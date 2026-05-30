---
title: "Create a Custom AI Research Agent with LangGraph + Tavily in 2026"
date: 2026-05-30
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: [langgraph, tavily, research-agent, ai-agent, tutorial, langchain, graph-based]
cover: /images/tutorials/build-ai-research-agent-langgraph-tavily-2026/cover.png
difficulty: advanced
meta_description: "Build a custom AI research agent using LangGraph's state graph framework and Tavily's real-time web search API — capable of iterative research with planning, search, analysis, and report generation."
---

## Introduction

Standard LLM-based research tools (like "deep research" modes in ChatGPT and Gemini) are black boxes. You don't control the search strategy, the depth of analysis, or when to stop.

With **LangGraph** + **Tavily**, you can build a transparent, customizable research agent that:

- Plans its own search queries based on a user's question
- Executes multiple web searches in parallel
- Analyzes results and identifies knowledge gaps
- Iterates — searches again to fill those gaps
- Produces a final structured report

Unlike the black-box approach, every step is logged, inspectable, and tunable.

## Prerequisites

```bash
pip install langgraph langchain-openai langchain-community tavily-python python-dotenv
```

Get API keys:

```bash
export OPENAI_API_KEY="sk-..."
export TAVILY_API_KEY="tvly-..."  # Free tier: 1000 searches/month
```

## Architecture Overview

LangGraph models the agent as a **state graph**:

```
[User Query] → [Planner] → [Search] → [Analyzer] → [Need more info?]
                                                         ↓ yes/no
                                                    [Planner] → [Final Report]
```

Each node is a function that transforms the shared state. The graph loops until the agent decides it has enough information.

## Step 1: Define the State

```python
# state.py
from typing import List, TypedDict, Annotated
import operator

class ResearchState(TypedDict):
    """The shared state across all graph nodes."""
    query: str                           # Original user question
    plan: List[str]                      # List of search queries to execute
    search_results: Annotated[List[dict], operator.add]  # Accumulated results
    analyzed_findings: List[str]         # Key findings so far
    gaps: List[str]                      # Identified knowledge gaps
    iteration: int                       # Current search iteration
    max_iterations: int                  # Safety limit
    final_report: str                    # Final output
    logs: Annotated[List[str], operator.add]  # Execution trace
```

## Step 2: Initialize the Agent

```python
# agent.py
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from tavily import TavilyClient
import os

# Initialize LLM and search client
llm = ChatOpenAI(model="gpt-4o", temperature=0.2)
tavily = TavilyClient(api_key=os.environ["TAVILY_API_KEY"])
```

## Step 3: Planner Node

The planner generates targeted search queries based on the current state:

```python
PLANNER_PROMPT = """You are a research strategist. Given a research question and current findings,
generate 2-3 specific search queries that would help fill knowledge gaps.

Current question: {query}
Current findings: {findings}
Identified gaps: {gaps}

Return ONLY a JSON array of search query strings. Each query should be specific and keyword-optimized."""

def planner_node(state: ResearchState) -> dict:
    """Generate search queries based on research state."""
    findings_text = "\n".join(state.get("analyzed_findings", []))
    gaps_text = "\n".join(state.get("gaps", []))
    
    response = llm.invoke(PLANNER_PROMPT.format(
        query=state["query"],
        findings=findings_text or "No findings yet.",
        gaps=gaps_text or "None identified yet.",
    ))
    
    # Parse queries from response
    import json
    try:
        queries = json.loads(response.content.strip().removeprefix("```json").removesuffix("```").strip())
    except:
        # Fallback: use the query itself
        queries = [state["query"]]
    
    return {
        "plan": queries,
        "iteration": state.get("iteration", 0) + 1,
        "logs": [f"[Planner] Generated {len(queries)} queries: {queries}"],
    }
```

## Step 4: Search Node

Execute all planned searches in parallel:

```python
def search_node(state: ResearchState) -> dict:
    """Execute all planned searches."""
    results = []
    for query in state["plan"]:
        try:
            response = tavily.search(
                query=query,
                search_depth="advanced",  # More thorough
                max_results=5,
                include_raw_content=True,
            )
            for r in response.get("results", []):
                results.append({
                    "query": query,
                    "title": r.get("title", ""),
                    "url": r.get("url", ""),
                    "content": r.get("content", ""),
                })
        except Exception as e:
            state["logs"].append(f"[Search] Error for '{query}': {e}")
    
    return {
        "search_results": results,
        "logs": [f"[Search] Found {len(results)} results across {len(state['plan'])} queries"],
    }
```

## Step 5: Analyzer Node

Analyze search results and identify gaps:

```python
ANALYZER_PROMPT = """You are a research analyst. Given a research question and search results:

1. Extract key findings (facts, data points, quotes)
2. Identify what's still missing or unclear (gaps)
3. Assess the confidence level based on source quality and consistency

Research question: {query}

Search results:
{results}

Return a JSON object with:
- "findings": array of strings, each a concrete finding
- "gaps": array of strings, each a question that remains unanswered
- "confidence": "high" | "medium" | "low"
- "has_sufficient_info": boolean (true if you can write a good report)
- "sources_count": number of unique sources used"""

def analyzer_node(state: ResearchState) -> dict:
    """Analyze search results and determine if more research is needed."""
    # Format results for the LLM
    results_text = ""
    for i, r in enumerate(state["search_results"][-15:]):  # Last 15 results
        results_text += f"\n[{i+1}] {r['title']} ({r['url']})\n{r['content'][:500]}\n"
    
    response = llm.invoke(ANALYZER_PROMPT.format(
        query=state["query"],
        results=results_text,
    ))
    
    import json
    try:
        analysis = json.loads(response.content.strip().removeprefix("```json").removesuffix("```").strip())
    except:
        analysis = {
            "findings": ["Analysis parsing failed - check raw results"],
            "gaps": [],
            "confidence": "low",
            "has_sufficient_info": False,
            "sources_count": 0
        }
    
    return {
        "analyzed_findings": state.get("analyzed_findings", []) + analysis.get("findings", []),
        "gaps": analysis.get("gaps", []),
        "logs": [
            f"[Analyzer] Found {len(analysis.get('findings', []))} findings, "
            f"{len(analysis.get('gaps', []))} gaps, "
            f"confidence={analysis.get('confidence')}, "
            f"sufficient={analysis.get('has_sufficient_info')}"
        ],
        "_has_sufficient": analysis.get("has_sufficient_info", False),
        "_confidence": analysis.get("confidence", "low"),
    }
```

> **Note:** The `_has_sufficient` and `_confidence` fields are stored in state but used by the router, not the final report.

## Step 6: Report Generator Node

When sufficient info is gathered, produce the final report:

```python
REPORT_PROMPT = """You are a professional research report writer. Based on the following research,
write a comprehensive, well-structured report.

Research question: {query}

All findings:
{findings}

Number of search iterations: {iterations}
Total sources consulted: {sources}

Write a report with:
1. **Executive Summary** (2-3 sentences)
2. **Key Findings** (with data points and citations where available)
3. **Detailed Analysis** (structured by subtopics)
4. **Critical Assessment** (limitations, conflicting viewpoints, confidence level)
5. **Sources** (list referenced URLs)

Format as Markdown with proper headings.
Be objective - present facts and uncertainties, not hype.
Target 800-1200 words."""

def report_node(state: ResearchState) -> dict:
    """Generate the final research report."""
    findings_text = "\n".join(
        f"- {f}" for f in state.get("analyzed_findings", [])
    )
    
    sources = set()
    for r in state.get("search_results", []):
        sources.add(r["url"])
    
    report = llm.invoke(REPORT_PROMPT.format(
        query=state["query"],
        findings=findings_text,
        iterations=state.get("iteration", 0),
        sources=len(sources),
    ))
    
    return {
        "final_report": report.content,
        "logs": [f"[Report] Generated final report ({len(report.content)} chars)"],
    }
```

## Step 7: Router + Graph Construction

The key innovation in LangGraph is the conditional edge — the router decides whether to loop or finish:

```python
def should_continue(state: ResearchState) -> str:
    """Decide whether to continue researching or generate the report."""
    # Safety: stop if we've done too many iterations
    if state.get("iteration", 0) >= state.get("max_iterations", 3):
        return "report"
    
    # Stop if we have sufficient info
    if state.get("_has_sufficient", False):
        return "report"
    
    # Stop if confidence is high enough
    if state.get("_confidence") == "high":
        return "report"
    
    # Otherwise, loop back to research
    return "research"

def build_research_graph() -> StateGraph:
    """Construct the research agent graph."""
    workflow = StateGraph(ResearchState)
    
    # Add nodes
    workflow.add_node("planner", planner_node)
    workflow.add_node("search", search_node)
    workflow.add_node("analyzer", analyzer_node)
    workflow.add_node("report", report_node)
    
    # Set entry point
    workflow.set_entry_point("planner")
    
    # Add edges
    workflow.add_edge("planner", "search")
    workflow.add_edge("search", "analyzer")
    
    # Conditional: loop or finish
    workflow.add_conditional_edges(
        "analyzer",
        should_continue,
        {
            "research": "planner",  # Go back for more
            "report": "report",      # Generate final output
        }
    )
    
    workflow.add_edge("report", END)
    
    return workflow.compile()
```

## Step 8: Run It

```python
# run_research.py
from agent import build_research_graph

# Initialize the graph
graph = build_research_graph()

# Run research
result = graph.invoke({
    "query": "What are the latest advances in AI-powered code generation tools as of mid-2026?",
    "plan": [],
    "search_results": [],
    "analyzed_findings": [],
    "gaps": [],
    "iteration": 0,
    "max_iterations": 3,
    "final_report": "",
    "logs": [],
})

print(result["final_report"])

print("\n\n=== Execution Log ===")
for log in result["logs"]:
    print(f"  {log}")
```

### Sample execution trace:

```
[Planner] Generated 3 queries: ['AI code generation tools 2026 advances',
 'GitHub Copilot vs Cursor vs Claude Code 2026 comparison',
 'latest AI coding assistants features review 2026']
[Search] Found 15 results across 3 queries
[Analyzer] Found 7 findings, 2 gaps, confidence=medium, sufficient=False
[Planner] Generated 2 queries: ['AI code generation agent mode capabilities 2026',
 'open source AI code generation tools 2026']
[Search] Found 10 results across 2 queries
[Analyzer] Found 5 findings, 1 gap, confidence=high, sufficient=True
[Report] Generated final report (2345 chars)
```

## Step 9: CLI Interface with Streaming

Make it interactive:

```python
# cli.py
from agent import build_research_graph
import json

def main():
    graph = build_research_graph()
    
    print("🤖 AI Research Agent")
    print("====================")
    query = input("\nResearch question: ")
    
    print("\n🔍 Researching (this may take 30-60 seconds)...\n")
    
    # Run with streaming for real-time logs
    for event in graph.stream({
        "query": query,
        "plan": [],
        "search_results": [],
        "analyzed_findings": [],
        "gaps": [],
        "iteration": 0,
        "max_iterations": 3,
        "final_report": "",
        "logs": [],
    }):
        for node, data in event.items():
            if "logs" in data:
                for log in data["logs"]:
                    print(f"  {log}")
    
    # Get final state
    final = graph.invoke({
        "query": query,
        "plan": [],
        "search_results": [],
        "analyzed_findings": [],
        "gaps": [],
        "iteration": 0,
        "max_iterations": 3,
        "final_report": "",
        "logs": [],
    })
    
    print("\n" + "=" * 50)
    print(final["final_report"])

if __name__ == "__main__":
    main()
```

## Customization Ideas

| Modification | Code Change | Effect |
|-------------|-------------|--------|
| Add more search iterations | `max_iterations: 5` | Deeper research, slower |
| Use Tavily `search_depth="basic"` | Faster but less thorough searches | 2x speed, lower quality |
| Switch to local LLM | Replace `ChatOpenAI` with `ChatOllama` | Zero API cost, slower |
| Add source quality filter | Filter results by domain (edu, gov, etc.) | Higher quality sources |
| Add summarization node | Condense long results before analysis | Better context window usage |

## Comparison: LangGraph vs. Other Approaches

| Aspect | LangGraph Agent | Manual code | CrewAI |
|--------|---------------|-------------|--------|
| Loop control | Native graph | Custom logic | Fixed pipeline |
| State management | Built-in | Manual | Manual |
| Debugging | LangSmith tracing | Print statements | Limited |
| Code size | ~200 lines | ~400 lines | ~150 lines (steeper learning) |

## Conclusion

You've built a transparent, multi-iteration research agent using LangGraph's state graph and Tavily's search API. Unlike ChatGPT's black-box research mode, your agent logs every decision, search query, and analysis step. You control:

- When to stop researching (custom threshold logic)
- How deep to search (Tavily depth + number of iterations)
- What sources to trust (filtering)
- How the final report is structured (prompt templates)

This same architecture powers production research systems at hedge funds, consulting firms, and content teams. The only difference is scale — add parallel search workers and a more sophisticated planner for enterprise workloads.

**Next steps:** Add a web UI with Gradio, or integrate with Slack so your team can start research with a `/research` command.
