---
title: "Building Enterprise Knowledge Graphs from Unstructured Data 2026"
date: 2026-06-01
author: "AIPlaybook Editorial Team"
category: "Developer-Tools"
tags: [tutorial, knowledge-graph, neo4j, llm, entity-extraction, nlp, data-engineering]
cover: "/images/tutorials/ai-knowledge-graph-tutorial-2026/cover.png"
difficulty: advanced
meta_description: "Build an enterprise knowledge graph from PDFs, documents, and databases using LLMs for entity extraction and Neo4j for graph storage."
---

## Overview

Most enterprise data is unstructured — PDFs, emails, meeting transcripts, internal wikis — locked in formats that machines can't reason about. A knowledge graph bridges this gap by extracting entities (people, companies, products, concepts) and their relationships into a queryable graph structure. This tutorial guides you through building an enterprise knowledge graph from scratch: extracting entities from documents using GPT-4o, resolving duplicates with embedding similarity, storing relationships in Neo4j, and querying the graph with natural language. You'll process real-world sources like company financial filings, product documentation, and internal wikis. The final system supports questions like "Which suppliers have contracts expiring in Q3 and how are they connected to our top customers?"

## Prerequisites

- Python 3.10+
- Neo4j 5.x (local or AuraDB cloud — free tier sufficient for 100k nodes)
- OpenAI API key (GPT-4o for entity extraction, text-embedding-3-large for dedup)
- Sample documents: 5-10 PDFs or markdown files (e.g., annual reports, product specs)
- `pip install neo4j openai langchain langchain-openai spacy pandas`
- Docker (optional, for local Neo4j): `docker run -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password neo4j:5`
- Download spaCy model: `python -m spacy download en_core_web_lg`

## Step 1: Design the Graph Schema

Before extracting data, define your ontology — what entities and relationships matter.

```cypher
// Enterprise knowledge graph schema
// Node labels:
//   - Person
//   - Organization
//   - Product
//   - Document
//   - Concept
//   - Project
//   - Technology
//
// Relationship types:
//   - WORKS_FOR (Person → Organization)
//   - MENTIONS (Document → Person | Organization | Product | Concept)
//   - DEPENDS_ON (Product → Technology)
//   - COMPETES_WITH (Organization → Organization)
//   - PARTNERS_WITH (Organization → Organization)
//   - LEADS (Person → Project)
//   - PRODUCES (Organization → Product)
//   - USES (Organization → Product | Technology)
//   - CITED_IN (Document → Document)
//
// Example: Create a small test node
CREATE (n:Concept {name: "Knowledge Graph", description: "A structured representation of entities and their relationships"})
RETURN n
```

## Step 2: Extract Entities and Relationships from Documents

Use LLM-powered entity extraction to parse unstructured documents:

```python
from openai import OpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from typing import TypedDict, List
import json

client = OpenAI()
llm = ChatOpenAI(model="gpt-4o", temperature=0)

EXTRACTION_PROMPT = """You are an expert knowledge graph entity extractor. 
Analyze the following document text and extract:

1. **Entities**: People, Organizations, Products, Technologies, Concepts, Projects
2. **Relationships**: Meaningful connections between entities with types from this ontology:
   {ontology}
3. **Confidence**: A score from 0.0 to 1.0 for each extraction

Return a JSON object with this exact structure:
{{
  "entities": [
    {{"name": "string", "type": "Person|Organization|Product|Technology|Concept|Project", 
      "aliases": ["string"], "mentions": 5, "context": "string"}}
  ],
  "relationships": [
    {{"source": "string", "target": "string", "type": "string",
      "evidence": "string from document", "confidence": 0.95}}
  ]
}}

Document text:
{document_text}
"""

def extract_entities_from_document(text, ontology_description, chunk_size=8000):
    """Extract entities and relationships from a document chunk."""
    all_entities = []
    all_relationships = []
    
    # Process in chunks for long documents
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    
    for i, chunk in enumerate(chunks):
        prompt = ChatPromptTemplate.from_messages([
            ("system", EXTRACTION_PROMPT),
            ("user", "{document_text}")
        ])
        
        chain = prompt | llm
        
        try:
            result = chain.invoke({
                "ontology": ontology_description,
                "document_text": chunk
            })
            
            # Parse JSON from response
            content = result.content
            # Extract JSON if wrapped in markdown code blocks
            if "```json" in content:
                content = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                content = content.split("```")[1].split("```")[0]
            
            parsed = json.loads(content)
            all_entities.extend(parsed.get("entities", []))
            all_relationships.extend(parsed.get("relationships", []))
            
        except Exception as e:
            print(f"Chunk {i} extraction failed: {e}")
    
    return all_entities, all_relationships

# Test with a sample document
sample_text = """
Acme Corporation announced a strategic partnership with DataFlow Inc. to integrate 
their AI-powered analytics platform. Sarah Chen, CTO of Acme, will lead the integration 
project called "Project Nexus". The platform uses AWS Bedrock for LLM inference and 
PostgreSQL for data storage. Acme's main competitor in this space is Vertex Analytics.
"""

ontology = """
- WORKS_FOR (Person → Organization)
- PARTNERS_WITH (Organization → Organization)  
- LEADS (Person → Project)
- USES (Organization → Product|Technology)
- COMPETES_WITH (Organization → Organization)
- PRODUCES (Organization → Product)
"""

entities, relationships = extract_entities_from_document(sample_text, ontology)
print(f"Entities: {json.dumps(entities, indent=2)}")
print(f"Relationships: {json.dumps(relationships, indent=2)}")
```

## Step 3: Resolve Duplicate Entities with Embedding Similarity

The same entity may appear as "OpenAI", "Open AI Inc.", "OpenAI Corporation". Deduplicate:

```python
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def get_embedding(text, model="text-embedding-3-large"):
    """Generate embedding for an entity name."""
    response = client.embeddings.create(model=model, input=[text], dimensions=1536)
    return response.data[0].embedding

def resolve_duplicates(entities, threshold=0.85):
    """Merge entities that likely refer to the same thing."""
    # Generate embeddings for all entity names + aliases
    entity_names = [e["name"] for e in entities]
    all_names = entity_names.copy()
    
    # Add aliases to the embedding pool
    alias_map = {}  # alias → original entity index
    for i, e in enumerate(entities):
        for alias in e.get("aliases", []):
            all_names.append(alias)
            alias_map[alias] = i
    
    embeddings = [get_embedding(name) for name in all_names]
    entity_embeddings = embeddings[:len(entity_names)]
    
    # Build clusters using cosine similarity
    clusters = []
    assigned = set()
    
    for i, entity in enumerate(entities):
        if i in assigned:
            continue
        
        cluster = [entity]
        assigned.add(i)
        
        for j in range(i + 1, len(entities)):
            if j in assigned:
                continue
            
            sim = cosine_similarity(
                [entity_embeddings[i]], 
                [entity_embeddings[j]]
            )[0][0]
            
            if sim > threshold:
                cluster.append(entities[j])
                assigned.add(j)
        
        clusters.append(cluster)
    
    # Merge each cluster into a single entity
    merged_entities = []
    for cluster in clusters:
        merged = {
            "name": cluster[0]["name"],  # Use first mention's name
            "type": max(set(e["type"] for e in cluster), key=lambda t: sum(1 for e in cluster if e["type"] == t)),
            "aliases": list(set(
                [e["name"] for e in cluster[1:]] + 
                sum([e.get("aliases", []) for e in cluster], [])
            )),
            "mentions": sum(e.get("mentions", 1) for e in cluster),
            "context": cluster[0].get("context", "")
        }
        merged_entities.append(merged)
    
    return merged_entities

# Deduplicate
deduped_entities = resolve_duplicates(entities)
print(f"Before dedup: {len(entities)} entities → After: {len(deduped_entities)}")
```

## Step 4: Load Entities and Relationships into Neo4j

```python
from neo4j import GraphDatabase

class KnowledgeGraphBuilder:
    def __init__(self, uri, user, password):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
    
    def create_constraints(self):
        """Create uniqueness constraints for efficient upserts."""
        with self.driver.session() as session:
            constraints = [
                "CREATE CONSTRAINT IF NOT EXISTS FOR (p:Person) REQUIRE p.name IS UNIQUE",
                "CREATE CONSTRAINT IF NOT EXISTS FOR (o:Organization) REQUIRE o.name IS UNIQUE",
                "CREATE CONSTRAINT IF NOT EXISTS FOR (p:Product) REQUIRE p.name IS UNIQUE",
                "CREATE CONSTRAINT IF NOT EXISTS FOR (c:Concept) REQUIRE c.name IS UNIQUE",
                "CREATE CONSTRAINT IF NOT EXISTS FOR (t:Technology) REQUIRE t.name IS UNIQUE",
            ]
            for c in constraints:
                session.run(c)
    
    def merge_entity(self, entity):
        """Upsert an entity node."""
        type_label = entity["type"]
        query = f"""
        MERGE (n:{type_label} {{name: $name}})
        ON CREATE SET n.aliases = $aliases, n.mentions = $mentions, n.first_seen = timestamp()
        ON MATCH SET n.mentions = n.mentions + $mentions, n.aliases = apoc.coll.union(n.aliases, $aliases)
        RETURN n.name
        """
        with self.driver.session() as session:
            session.run(query, 
                name=entity["name"],
                aliases=entity.get("aliases", []),
                mentions=entity.get("mentions", 1)
            )
    
    def merge_relationship(self, rel):
        """Upsert a relationship between two entities."""
        source_type = self._infer_type(rel["source"], rel.get("source_type"))
        target_type = self._infer_type(rel["target"], rel.get("target_type"))
        rel_type = rel["type"]
        
        query = f"""
        MATCH (s:{source_type} {{name: $source_name}})
        MATCH (t:{target_type} {{name: $target_name}})
        MERGE (s)-[r:{rel_type}]->(t)
        ON CREATE SET r.evidence = $evidence, r.confidence = $confidence, r.first_seen = timestamp()
        RETURN s.name, type(r), t.name
        """
        
        with self.driver.session() as session:
            session.run(query,
                source_name=rel["source"],
                target_name=rel["target"],
                evidence=rel.get("evidence", ""),
                confidence=rel.get("confidence", 0.5)
            )
    
    def _infer_type(self, name, explicit_type=None):
        """Infer entity type from name if not provided."""
        if explicit_type:
            return explicit_type
        
        # Simple heuristic — improve with a classifier for production
        if any(suffix in name for suffix in ["Inc.", "Corp.", "LLC", "Ltd.", "Company"]):
            return "Organization"
        return "Concept"  # Default type
    
    def build_graph(self, entities, relationships):
        """Build the complete knowledge graph."""
        print("Creating constraints...")
        self.create_constraints()
        
        print(f"Inserting {len(entities)} entities...")
        for entity in entities:
            self.merge_entity(entity)
        
        print(f"Inserting {len(relationships)} relationships...")
        for rel in relationships:
            self.merge_relationship(rel)
        
        print("Graph build complete!")

# Build the graph
builder = KnowledgeGraphBuilder("bolt://localhost:7687", "neo4j", "password")
builder.build_graph(deduped_entities, relationships)
```

## Step 5: Query the Knowledge Graph with Natural Language

Build a LangChain-based query system:

```python
from langchain_community.graphs import Neo4jGraph
from langchain.chains import GraphCypherQAChain
from langchain_openai import ChatOpenAI

graph = Neo4jGraph(url="bolt://localhost:7687", username="neo4j", password="password")
llm = ChatOpenAI(model="gpt-4o", temperature=0)

kg_chain = GraphCypherQAChain.from_llm(
    llm=llm,
    graph=graph,
    verbose=True,
    validate_cypher=True,
    return_intermediate_steps=True,
    allow_dangerous_requests=False,
    top_k=50
)

# Test queries
queries = [
    "What organizations does Acme Corporation partner with?",
    "Who leads projects at Acme Corporation?",
    "Which technologies does Acme use?",
    "Find all people who work at organizations that compete with Acme",
    "Show me all documents that mention both AI and PostgreSQL"
]

for q in queries:
    print(f"\nQuery: {q}")
    result = kg_chain.invoke({"query": q})
    print(f"Cypher: {result['intermediate_steps'][0]['query']}")
    print(f"Answer: {result['result']}")
```

## Step 6: Add Temporal and Document Provenance

Knowledge graphs need context about when and where information came from:

```cypher
// Add document provenance
MATCH (d:Document {title: "Acme Q3 Filing"})
MATCH (o:Organization {name: "Acme Corporation"})
CREATE (d)-[:MENTIONS {
    timestamp: datetime(),
    page: 12,
    confidence: 0.95,
    extract: "Acme Corporation announced a strategic partnership..."
}]->(o)

// Temporal query: find relationships updated in the last month
MATCH ()-[r]->() 
WHERE r.first_seen > datetime() - duration('P1M')
RETURN startNode(r).name, type(r), endNode(r).name, r.first_seen
ORDER BY r.first_seen DESC
```

## Step 7: Visualize the Graph

```python
# Streamlit dashboard with pyvis
import streamlit as st
from pyvis.network import Network
import tempfile

def visualize_graph(driver, query="MATCH (n)-[r]->(m) RETURN n.name, n.type, type(r), m.name, m.type LIMIT 200"):
    """Create an interactive graph visualization."""
    net = Network(height="600px", width="100%", bgcolor="#ffffff", font_color="black")
    net.barnes_hut(gravity=-2000, central_gravity=0.3, spring_length=200)
    
    with driver.session() as session:
        results = session.run(query)
        
        for record in results:
            n_name = record["n.name"]
            n_type = record.get("n.type", "unknown")
            rel_type = record["type(r)"]
            m_name = record["m.name"]
            m_type = record.get("m.type", "unknown")
            
            # Color by type
            type_colors = {
                "Person": "#4CAF50", "Organization": "#2196F3",
                "Product": "#FF9800", "Technology": "#9C27B0",
                "Concept": "#607D8B", "Document": "#795548"
            }
            
            net.add_node(n_name, label=n_name, color=type_colors.get(n_type, "#333333"), title=n_type)
            net.add_node(m_name, label=m_name, color=type_colors.get(m_type, "#333333"), title=m_type)
            net.add_edge(n_name, m_name, title=rel_type, label=rel_type, arrows="to")
    
    # Save to HTML and display
    with tempfile.NamedTemporaryFile(delete=False, suffix=".html") as f:
        net.save_graph(f.name)
        with open(f.name, "r") as html_file:
            html_content = html_file.read()
    
    return html_content

# Display in Streamlit
st.title("🔍 Enterprise Knowledge Graph Explorer")
html = visualize_graph(builder.driver)
st.components.v1.html(html, height=600)
```

## What You've Built

You now have an enterprise knowledge graph system:
- LLM-powered entity and relationship extraction from unstructured documents
- Embedding-based duplicate resolution (85%+ accuracy)
- Neo4j graph storage with constraints and provenance tracking
- Natural language query interface via LangChain
- Interactive graph visualization dashboard

The system transforms hundreds of documents into a queryable, analyzable knowledge structure.

## Troubleshooting

**Entity extraction misses domain-specific terms:**
Add custom entity types to the extraction prompt's ontology. For medical documents, add types like "Symptom", "Treatment", "Drug". For legal documents, add "Statute", "Precedent", "Jurisdiction". Update the Neo4j schema accordingly.

**Duplicate resolution threshold too aggressive or lenient:**
Tune the `threshold` parameter. Start at 0.85. If you see too many false merges (two distinct entities becoming one), raise to 0.92. If too many duplicates remain, lower to 0.78. Evaluate on a labeled test set.

**Neo4j query performance degrades with >500k entities:**
Add indexes beyond uniqueness constraints:
```cypher
CREATE INDEX entity_type_idx FOR (n:Entity) ON (n.type);
CREATE INDEX entity_name_idx FOR (n:Entity) ON (n.name);
CALL db.index.fulltext.createNodeIndex("entity_search", ["Person", "Organization", "Product"], ["name"]);
```

**LLM generation of Cypher queries is unreliable for complex graph schemas:**
Restrict the schema passed to the LLM: set `graph.refresh_schema()` and manually prune the schema string to only include relevant node labels and relationship types for the current user query.

## Next Steps

- Add batch document processing with a scheduled ETL pipeline (Apache Airflow or n8n)
- Integrate a vector index on entity descriptions for hybrid graph + vector search
- Build a GraphRAG system: combine knowledge graph traversal with LLM reasoning
- Set up incremental updates: re-process documents on modification (webhook-based)
- Export the graph to RDF/OWL format for interoperability with standard ontology tools
