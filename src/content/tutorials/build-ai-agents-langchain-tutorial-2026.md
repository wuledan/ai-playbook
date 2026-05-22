---
title: "Build AI Agents with LangChain: A Step-by-Step Tutorial for 2026"
date: 2026-05-22
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: [langchain, ai-agents, tutorial, python, llm, automation, beginner, intermediate]
cover: "/images/tutorials/build-ai-agents-langchain-tutorial-2026/cover.png"
difficulty: intermediate
meta_description: "Learn how to build production-ready AI agents using LangChain in 2026. Covers tools, memory, multi-agent systems, and deployment — with complete code examples."
---

## What You'll Build

By the end of this tutorial, you'll have a **personal research assistant agent** that can:

1. ✅ Search the web and summarize findings
2. ✅ Query databases and APIs for structured data
3. ✅ Read and extract information from PDFs and documents
4. ✅ Write formatted reports with citations
5. ✅ Maintain conversation context across multiple interactions

We'll build it step-by-step, starting simple and adding capabilities.

## Prerequisites

- Python 3.11+ installed
- An LLM API key (OpenAI, Anthropic, or any LangChain-compatible provider)
- Basic Python knowledge (functions, async, error handling)
- pip installed

## Step 1: Environment Setup

```bash
mkdir research-agent && cd research-agent
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install langchain langchain-core langchain-community langchain-openai \
            langgraph httpx beautifulsoup4 pypdf python-dotenv duckduckgo-search
```

Create a `.env` file:
```
OPENAI_API_KEY=sk-your-key-here
```

## Step 2: The Simplest Agent

Let's start with a basic agent that can use tools:

```python
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import create_tool_calling_agent, AgentExecutor
from langchain.tools import tool

load_dotenv()

@tool
def calculate(expression: str) -> str:
    """Evaluate a mathematical expression"""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Error: {e}"

@tool
def get_character_count(text: str) -> str:
    """Count characters in a string"""
    return str(len(text))

tools = [calculate, get_character_count]

llm = ChatOpenAI(model="gpt-4o", temperature=0)
agent = create_tool_calling_agent(llm, tools)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

response = agent_executor.invoke({
    "input": "Calculate 245 * 37, then tell me how many characters are in the result"
})
print(response["output"])
```

**What's happening**: LangChain's `create_tool_calling_agent` uses the model's native tool-calling capability. The `@tool` decorator turns any Python function into a tool the agent can invoke. The `AgentExecutor` manages the reasoning loop.

## Step 3: Adding Web Search

Now let's add real functionality — web search and web scraping:

```python
from duckduckgo_search import DDGS

@tool
def search_web(query: str) -> str:
    """Search the web for current information"""
    with DDGS() as ddgs:
        results = list(ddgs.text(query, max_results=5))
    if not results:
        return "No results found"
    formatted = []
    for r in results:
        formatted.append(f"- [{r['title']}]({r['href']}): {r['body']}")
    return "\n".join(formatted)

@tool
def read_url(url: str) -> str:
    """Fetch and extract text content from a URL"""
    import httpx
    from bs4 import BeautifulSoup
    try:
        response = httpx.get(url, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')
        # Remove script and style elements
        for tag in soup(['script', 'style', 'nav', 'footer', 'header']):
            tag.decompose()
        text = soup.get_text(separator='\n')
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return '\n'.join(lines[:150])  # Limit output
    except Exception as e:
        return f"Error fetching URL: {e}"
```

This transforms your agent from a toy into something genuinely useful. With web search + URL reading, it can research topics, compare products, and answer current questions.

## Step 4: RAG with PDF Documents

Many real-world agent use cases require reading documents. Let's add PDF support:

```python
from pypdf import PdfReader
import tempfile
import os

@tool
def read_pdf(file_path: str) -> str:
    """Extract text from a PDF file"""
    if not os.path.exists(file_path):
        return f"File not found: {file_path}"
    reader = PdfReader(file_path)
    text = []
    for page in reader.pages:
        text.append(page.extract_text())
    return "\n".join(text)[:5000]  # Limit output

@tool
def summarize_document(text: str) -> str:
    """Summarize a long text using the LLM (internal tool, not for direct use)"""
    from langchain_core.prompts import ChatPromptTemplate
    prompt = ChatPromptTemplate.from_template(
        "Summarize the following text in 3-5 bullet points:\n\n{text}"
    )
    chain = prompt | llm
    return chain.invoke({"text": text}).content
```

## Step 5: Adding Memory

Right now, each agent call is stateless. Let's add conversation memory:

```python
from langchain.memory import ConversationBufferMemory
from langchain.agents import AgentExecutor
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain.agents.format_scratchpad import format_to_openai_function_messages

memory = InMemoryChatMessageHistory()

# Modified agent executor with memory
agent_executor_with_memory = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    chat_history=memory,
    handle_parsing_errors=True,
)

# First interaction
response1 = agent_executor_with_memory.invoke({
    "input": "Search for the latest news about LangChain in 2026"
})

# Second interaction — agent remembers previous context
response2 = agent_executor_with_memory.invoke({
    "input": "Summarize what you found in a short report with citations"
})
```

## Step 6: Structured Output with Pydantic

For production use, you want structured, validated output:

```python
from pydantic import BaseModel, Field
from typing import List

class ResearchFinding(BaseModel):
    """A single research finding with source"""
    claim: str = Field(description="The finding or claim")
    source_url: str = Field(description="URL where this was found")
    confidence: str = Field(description="high/medium/low based on source reliability")

class ResearchReport(BaseModel):
    """A complete research report"""
    topic: str = Field(description="The research topic")
    findings: List[ResearchFinding] = Field(description="List of findings")
    summary: str = Field(description="Executive summary")
    unanswered_questions: List[str] = Field(description="What remains unclear")

from langchain_core.output_parsers import PydanticOutputParser

parser = PydanticOutputParser(pydantic_object=ResearchReport)

structured_agent = create_tool_calling_agent(
    llm, tools,
    prompt=prompt.partial(
        format_instructions=parser.get_format_instructions()
    )
)
```

## Step 7: Multi-Agent System with LangGraph

For complex workflows, LangGraph gives you **graph-based agent orchestration**:

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict, List, Optional

class AgentState(TypedDict):
    query: str
    search_results: Optional[str]
    analysis: Optional[str]
    report: Optional[str]
    citations: List[str]

# Research agent
def researcher(state: AgentState) -> AgentState:
    results = search_web(state["query"])
    return {**state, "search_results": results}

def analyst(state: AgentState) -> AgentState:
    prompt = f"Analyze these search results:\n{state['search_results']}\n\nProvide key insights"
    analysis = llm.invoke(prompt).content
    return {**state, "analysis": analysis}

def writer(state: AgentState) -> AgentState:
    prompt = f"Write a report based on this analysis:\n{state['analysis']}"
    report = llm.invoke(prompt).content
    return {**state, "report": report}

# Build the graph
graph = StateGraph(AgentState)
graph.add_node("researcher", researcher)
graph.add_node("analyst", analyst)
graph.add_node("writer", writer)

graph.set_entry_point("researcher")
graph.add_edge("researcher", "analyst")
graph.add_edge("analyst", "writer")
graph.add_edge("writer", END)

app = graph.compile()
result = app.invoke({"query": "Latest developments in AI agent frameworks 2026"})
print(result["report"])
```

LangGraph allows conditional branching, parallel execution, human-in-the-loop approval gates, and persistent state across runs — making it suitable for production agent systems.

## Step 8: Deployment

```python
# Simple FastAPI deployment
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class AgentQuery(BaseModel):
    query: str
    session_id: Optional[str] = None

class AgentResponse(BaseModel):
    answer: str
    sources: List[str] = []

@app.post("/agent", response_model=AgentResponse)
async def run_agent(query: AgentQuery):
    try:
        result = agent_executor.invoke({"input": query.query})
        return AgentResponse(
            answer=result["output"],
            sources=result.get("intermediate_steps", [])
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn app:app --host 0.0.0.0 --port 8000
```

## Complete Code

The full code for this tutorial is available at: [github.com/ai-playbook/langchain-research-agent](https://github.com/ai-playbook/langchain-research-agent)

## FAQ

### What's the difference between LangChain and LangGraph?
LangChain is the core framework for building LLM applications (chains, agents, tools, memory). LangGraph is an extension for building **stateful, multi-actor** agent systems with cyclic execution paths, branching, and persistent state.

### Do I need LangChain or can I use plain Python + API calls?
You can build agents with plain HTTP calls to LLM APIs — many developers do. LangChain provides abstractions (tool interface, agent loop, memory) that save significant boilerplate. For anything beyond a single-function agent, LangChain/LangGraph is worth the dependency.

### Can I use open-source models instead of GPT?
Yes. LangChain supports any model through `ChatOpenAI` (compatible endpoints like Ollama, vLLM, Together AI), `ChatAnthropic`, `ChatHuggingFace`, and many others. For local models, Ollama integration works seamlessly.

### How do I handle API rate limits?
Use LangChain's built-in rate limiting wrappers: `from langchain.callbacks import RateLimiterCallbackHandler`. For production, use `langchain_community.cache.InMemoryCache` to cache common API calls.

### What about cost optimization?
Use model routing: route simple tasks (summarization, extraction) to cheaper models (GPT-5 Mini, Claude 3.5 Haiku) and complex reasoning to frontier models (GPT-5, Claude 4). LangChain's `create_model_routing` helps automate this.
