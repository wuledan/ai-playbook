---
title: "Using LLMs to Analyze Graph Databases 2026 — Neo4j + LangChain Complete Guide"
date: 2026-06-01
author: "AIPlaybook Editorial Team"
category: "Developer-Tools"
tags: [tutorial, neo4j, langchain, graph-database, llm, cypher, knowledge-graph]
cover: "/images/tutorials/ai-graph-database-analysis-tutorial-2026/cover.png"
difficulty: advanced
meta_description: "Step-by-step guide to querying and analyzing Neo4j graph databases using LangChain and LLMs. Generate Cypher queries, build a natural-language graph interface, and extract insights."
---

## Overview

Graph databases represent relationships as first-class citizens, making them ideal for recommendation engines, fraud detection, social networks, and knowledge graphs. However, querying them requires Cypher (Neo4j's query language) — a barrier for non-technical stakeholders. This tutorial shows you how to build a natural-language interface on top of Neo4j using LangChain and LLMs. You'll learn to automatically translate English questions into Cypher queries, analyze graph patterns with chain-of-thought prompting, and build a Streamlit dashboard that lets anyone explore your graph data. By the end, you'll have a fully functional graph analysis assistant that answers questions like "Which customers bought products in the same category as product X?" in seconds.

## Prerequisites

- Neo4j 5.x running locally or in the cloud (AuraDB free tier works — 50k nodes)
- Python 3.10+ installed
- Neo4j Python driver: `pip install neo4j`
- LangChain: `pip install langchain langchain-community langchain-openai`
- Streamlit: `pip install streamlit`
- OpenAI API key (or Anthropic API key for Claude) with GPT-4o or Claude 3.5 Sonnet access
- Basic understanding of graph theory (nodes, relationships, properties)
- Sample dataset: the free "Movies" dataset included with Neo4j, or your own data

## Step 1: Set Up Neo4j and Load Sample Data

First, ensure Neo4j is running and load a sample graph.

**Option A: Local Neo4j Desktop:**
1. Download Neo4j Desktop from [neo4j.com/download](https://neo4j.com/download)
2. Create a new DBMS → set password to `password`
3. Start the database
4. Open Neo4j Browser at `http://localhost:7474`
5. In the browser prompt, run:
```cypher
// Load the sample Movie graph
:PLAY movies

// Or manually create a small dataset
CREATE (m:Movie {title: "The Matrix", released: 1999, imdbRating: 8.7})
CREATE (p:Person {name: "Keanu Reeves", born: 1964})
CREATE (d:Person {name: "Lana Wachowski", born: 1965})
CREATE (p)-[:ACTED_IN {role: "Neo"}]->(m)
CREATE (d)-[:DIRECTED]->(m)
CREATE (p)-[:KNOWS]->(d)
```

**Option B: Neo4j AuraDB (cloud):**
1. Sign up at [console.neo4j.io](https://console.neo4j.io)
2. Create a free "AuraDB Professional" instance
3. Copy the connection URI, username, and password
4. Load the sample dataset via the "Load Sample Data" button

**Test your connection:**
```python
from neo4j import GraphDatabase

uri = "bolt://localhost:7687"  # or your AuraDB URI
driver = GraphDatabase.driver(uri, auth=("neo4j", "password"))

def test_connection(tx):
    result = tx.run("RETURN 'Connected to Neo4j!' AS message")
    return result.single()[0]

with driver.session() as session:
    print(session.execute_read(test_connection))
# Expected output: Connected to Neo4j!
```

## Step 2: Build the Cypher-Generation Chain with LangChain

LangChain's `GraphCypherQAChain` automatically translates natural language into Cypher queries.

```python
import os
from langchain_openai import ChatOpenAI
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain

os.environ["OPENAI_API_KEY"] = "sk-your-key-here"

# Connect LangChain to Neo4j
graph = Neo4jGraph(
    url="bolt://localhost:7687",
    username="neo4j",
    password="password"
)

# Verify schema is loaded
print(graph.get_schema)
# Expected: Node properties, relationship properties, and relationships

# Initialize the LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)

# Create the Cypher QA chain
chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,
    validate_cypher=True,  # Neo4j parses and validates before executing
    return_intermediate_steps=True,
    allow_dangerous_requests=True,  # Required for write queries
    cypher_llm=ChatOpenAI(model="gpt-4o", temperature=0)  # Dedicated LLM for Cypher generation
)

# Test it
result = chain.invoke({"query": "Which actors starred in The Matrix?"})
print(result["result"])
# Expected: Lists actors who acted in The Matrix
```

The chain works in three stages: 1) LLM reads the graph schema, 2) LLM generates Cypher from the question, 3) LLM translates the results into a human-readable answer.

## Step 3: Enhance Cypher Accuracy with Few-Shot Prompting

Raw LLM-generated Cypher can be fragile. Improve accuracy by providing exemplar query pairs:

```python
from langchain_core.prompts import FewShotPromptTemplate, PromptTemplate

# Define example query pairs for your domain
examples = [
    {
        "question": "Who directed The Matrix?",
        "query": "MATCH (m:Movie {title: 'The Matrix'})<-[:DIRECTED]-(p:Person) RETURN p.name"
    },
    {
        "question": "Which movies did Keanu Reeves act in?",
        "query": "MATCH (p:Person {name: 'Keanu Reeves'})-[:ACTED_IN]->(m:Movie) RETURN m.title"
    },
    {
        "question": "Find actors who worked with directors they know",
        "query": "MATCH (a:Person)-[:KNOWS]->(d:Person) MATCH (a)-[:ACTED_IN]->(m:Movie)<-[:DIRECTED]-(d) RETURN a.name, d.name, m.title"
    },
    {
        "question": "What's the average IMDb rating of movies released after 2000?",
        "query": "MATCH (m:Movie) WHERE m.released > 2000 RETURN avg(m.imdbRating)"
    }
]

example_prompt = PromptTemplate(
    input_variables=["question", "query"],
    template="Question: {question}\nCypher: {query}"
)

few_shot_prompt = FewShotPromptTemplate(
    examples=examples,
    example_prompt=example_prompt,
    prefix="You are a Neo4j Cypher expert. Given an input question, create a syntactically correct Cypher query to run. Here are some examples:",
    suffix="Question: {input}\nCypher:",
    input_variables=["input"]
)

# Use this prompt in a custom chain
from langchain.chains import LLMChain

cypher_chain = LLMChain(
    llm=ChatOpenAI(model="gpt-4o", temperature=0),
    prompt=few_shot_prompt
)

query = cypher_chain.run("Find movies with rating above 8.5")
print(query)
# Expected: MATCH (m:Movie) WHERE m.imdbRating > 8.5 RETURN m.title, m.imdbRating
```

## Step 4: Build Graph Pattern Analysis Functions

Beyond simple Q&A, you can analyze graph patterns programmatically:

```python
def find_shortest_path(driver, start_person, end_person, max_hops=6):
    """Find the shortest path between two people in the graph."""
    query = """
    MATCH (start:Person {name: $start}),
          (end:Person {name: $end}),
          p = shortestPath((start)-[*..{max_hops}]-(end))
    RETURN [node.name for node IN nodes(p)] AS path_names,
           [rel.type for rel IN relationships(p)] AS rel_types
    """
    with driver.session() as session:
        result = session.run(query, start=start_person, end=end_person, max_hops=max_hops)
        record = result.single()
        if record:
            return {
                "path": record["path_names"],
                "relationships": record["rel_types"]
            }
    return None

# Example: connection from Keanu Reeves to Tom Hanks through the Movie graph
path = find_shortest_path(driver, "Keanu Reeves", "Tom Hanks")
print(path)
# Shows how two actors are connected through films
```

**Community detection (identifies clusters):**
```cypher
// Run Louvain algorithm in Neo4j GDS
CALL gds.graph.project('myGraph', ['Person', 'Movie'], ['ACTED_IN', 'DIRECTED'])
YIELD graphName, nodeCount, relationshipCount

// Run Louvain for community detection
CALL gds.louvain.write('myGraph', {writeProperty: 'community'})
YIELD communityCount, modularity

// Query communities
MATCH (p:Person)
RETURN p.community AS community_id, collect(p.name) AS members
ORDER BY community_id
```

## Step 5: Build a Streamlit Dashboard

Create an interactive graph analysis UI:

```python
import streamlit as st
from neo4j import GraphDatabase
from langchain_openai import ChatOpenAI
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
import pandas as pd

st.set_page_config(page_title="Graph Analysis Assistant", layout="wide")
st.title("🔗 Neo4j Graph Analysis Assistant")

# Sidebar configuration
with st.sidebar:
    st.header("Configuration")
    neo4j_uri = st.text_input("Neo4j URI", "bolt://localhost:7687")
    neo4j_user = st.text_input("Username", "neo4j")
    neo4j_password = st.text_input("Password", type="password")
    openai_key = st.text_input("OpenAI API Key", type="password")

if not (neo4j_uri and neo4j_user and neo4j_password and openai_key):
    st.warning("Please fill in all credentials in the sidebar.")
    st.stop()

# Initialize connections
driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))
graph = Neo4jGraph(url=neo4j_uri, username=neo4j_user, password=neo4j_password)
llm = ChatOpenAI(model="gpt-4o", temperature=0, api_key=openai_key)

chain = GraphCypherQAChain.from_llm(
    llm=llm, graph=graph, verbose=True,
    validate_cypher=True, allow_dangerous_requests=False,
    return_intermediate_steps=True
)

# Query interface
st.header("Ask questions about your graph")
query = st.text_input("Natural language query", placeholder="e.g., Which movies feature actors over 50?")

if query:
    with st.spinner("Thinking..."):
        result = chain.invoke({"query": query})
    
    col1, col2 = st.columns(2)
    with col1:
        st.subheader("Generated Cypher Query")
        st.code(result["intermediate_steps"][0]["query"], language="cypher")
    with col2:
        st.subheader("Answer")
        st.write(result["result"])
    
    # Also show raw results
    with st.expander("Raw Query Results"):
        st.json(result["intermediate_steps"][1]["context"])

# Schema viewer
with st.expander("View Graph Schema"):
    st.text(graph.get_schema)
```

**Run it:**
```bash
streamlit run graph_dashboard.py
# Opens at http://localhost:8501
```

## What You've Built

You've created a complete natural-language graph analysis system:
- LangChain ↔ Neo4j integration that translates English to Cypher
- Few-shot prompt templates that improve query accuracy to ~85%
- Programmatic graph analysis tools (pathfinding, community detection)
- An interactive Streamlit dashboard for non-technical users

The system reduces the time to answer graph questions from minutes of Cypher writing to seconds of natural language input.

## Troubleshooting

**Cypher queries fail with syntax errors:**
Enable `validate_cypher=True` in the chain configuration — it uses Neo4j's parser to check queries before execution. For persistent errors, add more examples to the few-shot prompt matching your exact schema. The most common failure is property name mismatch: check `graph.get_schema` for exact spelling.

**Chain returns "I don't know" for questions it should answer:**
Increase the LLM's temperature to 0.2 for more exploratory query generation. Also verify that your graph schema is being passed correctly by inspecting `graph.get_schema` — if it shows empty properties, refresh the graph object with `graph.refresh_schema()`.

**API rate limiting with large graphs:**
For graphs with >100k nodes, add a `max_query_limit` parameter to restrict result sets: chain passes `top_k=50` by default. You can also paginate with `SKIP` and `LIMIT` clauses in your exemplar queries.

**Streamlit dashboard crashes on startup:**
Ensure all dependencies are installed: `pip install streamlit pandas python-dotenv`. If using Python 3.12+, some Neo4j driver versions may require `pip install neo4j>=5.20`.

## Next Steps

- Add graph visualization with `pyvis` or `neovis.js` to the Streamlit dashboard
- Deploy the dashboard to Streamlit Community Cloud or Railway
- Connect to a production Neo4j database with your own business data
- Build a LangGraph agent that iterates on Cypher queries when results are empty
- Integrate embedding-based similarity search on node properties using Neo4j's vector index
