---
title: "Multi-Agent Systems with LangGraph 2026 — Practical Tutorial"
date: 2026-06-04
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: [langgraph, langchain, multi-agent, ai-agents, python, coding, tutorial]
cover: /images/tutorials/multi-agent-systems-langgraph-2026/cover.jpg
difficulty: advanced
meta_description: "Build production multi-agent systems with LangGraph — agent orchestration, state machines, tool delegation, and human-in-the-loop. Working Python code for every step."
---

## Why This Matters

Single-agent LLM applications hit a wall when tasks require multiple specialized skills. A single prompt can't simultaneously research web sources, query a database, generate a chart, and write a report — at least not with reliable quality.

Multi-agent architectures solve this by delegating work to specialized sub-agents, just like a team of human experts. LangGraph, the graph-based framework from LangChain, provides the state machine infrastructure to orchestrate these agents with precision.

In production deployments at companies like Uber, Elastic, and GitLab, LangGraph powers agent systems that process millions of tasks per day. By the end of this tutorial, you will have built a working multi-agent research system that searches the web, analyzes documents, and generates structured reports.

## Prerequisites

- Python 3.11+ installed
- OpenAI API key (or Anthropic/Groq key for alternative models)
- Basic familiarity with Python async patterns (helpful but not required)

## Step-by-Step

### Step 1: Install LangGraph and Dependencies

```bash
pip install langgraph langchain langchain-openai tavily-python python-dotenv
```

Create a `.env` file:

```
OPENAI_API_KEY=sk-your-key-here
TAVILY_API_KEY=tvly-your-key-here
```

LangGraph runs on top of LangChain but introduces its own graph-based execution model. Tavily provides web search optimized for LLM agents.

### Step 2: Define Your Agent State

LangGraph works by passing a shared state object through a directed graph. Define your state schema with TypedDict:

```python
from typing import TypedDict, List, Annotated
from langgraph.graph.message import add_messages
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    """Shared state passed between agents in the graph."""
    messages: Annotated[List[BaseMessage], add_messages]
    research_question: str
    search_results: str
    analysis: str
    report: str
    is_complete: bool
```

The `add_messages` reducer tells LangGraph to append new messages rather than overwrite. Custom keys like `research_question` hold agent outputs.

### Step 3: Build the Research Agent

This agent takes the user's question, searches the web, and returns relevant findings:

```python
from langchain_openai import ChatOpenAI
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.prebuilt import create_react_agent
import json

llm = ChatOpenAI(model="gpt-4o", temperature=0.2)
search_tool = TavilySearchResults(max_results=5)

def research_agent(state: AgentState) -> AgentState:
    """Search the web for information related to the question."""
    research_prompt = f"""
    You are a research specialist. Your task is to find high-quality information about:
    
    Question: {state['research_question']}
    
    Use the search tool to find relevant, recent, and authoritative sources.
    Summarize what you find into 3-5 key points with source URLs.
    If multiple sources conflict, note the disagreement.
    """
    
    agent = create_react_agent(llm, [search_tool])
    result = agent.invoke({"messages": [("human", research_prompt)]})
    
    return {
        **state,
        "search_results": result["messages"][-1].content,
        "messages": result["messages"]
    }
```

The `create_react_agent` helper sets up a ReAct loop — the agent reasons, chooses a tool, observes the result, and decides whether to continue.

### Step 4: Build the Analysis Agent

The analysis agent processes raw search results and extracts structured insights:

```python
def analysis_agent(state: AgentState) -> AgentState:
    """Analyze search results and extract structured insights."""
    analysis_prompt = f"""
    Analyze the following research findings and provide a structured analysis.
    
    Research Question: {state['research_question']}
    
    Search Results:
    {state['search_results']}
    
    Provide your analysis as a JSON object with:
    - key_findings: array of strings (3-5 items)
    - confidence_score: number 0-1
    - gaps: array of strings (what information is missing)
    - sources_used: array of URLs
    - recommended_next_steps: array of strings
    """
    
    response = llm.invoke([("human", analysis_prompt)])
    state["analysis"] = response.content
    return state
```

No tools are needed here — just pure LLM reasoning. This keeps the analysis agent fast and cost-effective.

### Step 5: Build the Report Writer Agent

The report agent formats everything into a polished output:

```python
def report_agent(state: AgentState) -> AgentState:
    """Generate a structured report from research and analysis."""
    report_prompt = f"""
    Generate a professional research report based on the following.
    
    Question: {state['research_question']}
    Key Findings: {state['search_results']}
    Analysis: {state['analysis']}
    
    Format the report with:
    1. Executive Summary (2-3 sentences)
    2. Key Findings (numbered, with evidence)
    3. Analysis (critical evaluation)
    4. Gaps and Limitations
    5. Conclusion with actionable takeaways
    
    Use markdown formatting. Include inline citations with [Source: URL].
    """
    
    response = llm.invoke([("human", report_prompt)])
    state["report"] = response.content
    state["is_complete"] = True
    return state
```

### Step 6: Wire the Graph Together

Now connect the agents into a graph with LangGraph's StateGraph:

```python
from langgraph.graph import StateGraph, START, END

# Initialize the graph
builder = StateGraph(AgentState)

# Add nodes (agents)
builder.add_node("research", research_agent)
builder.add_node("analyze", analysis_agent)
builder.add_node("write_report", report_agent)

# Add edges — defines the execution flow
builder.add_edge(START, "research")
builder.add_edge("research", "analyze")
builder.add_edge("analyze", "write_report")
builder.add_edge("write_report", END)

# Compile the graph
graph = builder.compile()
```

### Step 7: Add Conditional Routing with a Supervisor

For a more advanced setup, add a supervisor agent that decides which agent to call next:

```python
from typing import Literal

def supervisor_router(state: AgentState) -> Literal["research", "analyze", "write_report", "__end__"]:
    """Decide which agent to run next based on current state."""
    
    if not state.get("search_results"):
        return "research"
    elif not state.get("analysis"):
        return "analyze"  
    elif not state.get("report"):
        return "write_report"
    else:
        return "__end__"

# Build a dynamic graph with the supervisor
dynamic_builder = StateGraph(AgentState)
dynamic_builder.add_node("research", research_agent)
dynamic_builder.add_node("analyze", analysis_agent)
dynamic_builder.add_node("write_report", report_agent)
dynamic_builder.add_node("supervisor", supervisor_router)

# Note: In LangGraph, routing is done via conditional edges
dynamic_builder.add_conditional_edges(
    "supervisor",
    supervisor_router,
    {"research": "research", "analyze": "analyze", "write_report": "write_report"}
)
dynamic_builder.add_edge(START, "supervisor")
```

### Step 8: Add Human-in-the-Loop

LangGraph supports interrupt points for human approval:

```python
from langgraph.checkpoint.memory import MemorySaver

def human_review_node(state: AgentState) -> AgentState:
    """Pause for human review between research and analysis."""
    # LangGraph's interrupt automatically pauses execution
    # The human reviews state['search_results'] and approves or sends back
    print(f"Research complete. Waiting for human review...")
    print(f"Key sources found: {len(state.get('search_results', '').split(chr(10)))} lines")
    return state

# Insert the review node between research and analysis
builder.add_node("human_review", human_review_node)
builder.add_edge("research", "human_review")
builder.add_edge("human_review", "analyze")

# Use checkpointing to persist state across interrupts
checkpointer = MemorySaver()
graph_with_review = builder.compile(checkpointer=checkpointer)
```

### Step 9: Run the Complete System

```python
import asyncio

async def run_research(question: str):
    initial_state = {
        "messages": [],
        "research_question": question,
        "search_results": "",
        "analysis": "",
        "report": "",
        "is_complete": False
    }
    
    config = {"configurable": {"thread_id": "research-001"}}
    result = await graph_with_review.ainvoke(initial_state, config)
    
    print("=" * 50)
    print("FINAL REPORT:")
    print(result["report"])
    
    return result

# Execute
asyncio.run(run_research(
    "What are the latest developments in solid-state battery technology for electric vehicles in 2026?"
))
```

## Tips

- **Keep sub-agent scopes narrow.** A single agent should do one thing well — searching, analyzing, or writing. Don't mix responsibilities.
- **State is your debug log.** Every agent writes to the shared state. When something breaks, inspect the state at each node to find the issue.
- **Use async for parallelism.** LangGraph supports `invoke`, `ainvoke`, and `stream`. Use `astream` for real-time agent output.
- **Set max iteration limits.** Add a `max_steps` counter to prevent runaway agent loops. 25 steps is a reasonable ceiling.
- **Cost management.** Log per-node token usage. If analysis agents consistently use 5K+ tokens, switch to a cheaper model like GPT-4o-mini.
- **Test each agent in isolation.** Before wiring the full graph, call each agent function with sample state to verify its output format.

## FAQ

**Q: How is LangGraph different from LangChain?**  
A: LangChain provides chain-based orchestration (sequenced calls). LangGraph provides graph-based orchestration with cycles, branching, and state machines. Use LangGraph when agents need conditional logic or loops.

**Q: Can I use models other than OpenAI?**  
A: Yes. LangGraph works with Anthropic, Google, Groq, and local models via Ollama. Swap `ChatOpenAI` for `ChatAnthropic` or any LangChain chat model.

**Q: What happens if an agent's tool call fails?**  
A: LangGraph catches exceptions and passes the error message back to the agent. The agent can retry, log the failure, or route to a fallback — design your error handling in each node.

**Q: How do I deploy a LangGraph agent in production?**  
A: Use LangGraph Cloud (managed) or deploy as a FastAPI endpoint. The `LangGraphServe` package wraps your graph in a REST API with streaming support.

**Q: What's the typical latency for a 3-agent system?**  
A: 10-30 seconds for a typical graph, depending on tool call latency and LLM response time. Streaming output makes this feel faster — users see results as each agent completes.
