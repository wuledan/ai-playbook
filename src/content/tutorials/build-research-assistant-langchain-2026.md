---
title: "How to Build an AI Research Assistant with LangChain & OpenAI 2026"
date: 2026-05-22
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: [langchain, openai, research-assistant, tutorial, ai-agents, python]
cover: /images/tutorials/research-assistant-langchain/cover.jpg
meta_description: "Step-by-step tutorial to build an AI research assistant using LangChain and OpenAI in 2026. Includes web search, PDF analysis, and report generation."
difficulty: advanced
---
# How to Build an AI Research Assistant with LangChain & OpenAI 2026

## Overview

This tutorial builds a complete AI research assistant that can:
- Search the web for up-to-date information
- Read and analyze PDF documents
- Summarize findings across multiple sources
- Generate structured research reports

Total code: ~150 lines of Python. Time to build: 45 minutes.

## Prerequisites

- Python 3.11+
- OpenAI API key (or Anthropic/Gemini)
- Basic Python knowledge
- pip installed

## Step 1: Setup Environment

```bash
mkdir research-assistant && cd research-assistant
python -m venv .venv && source .venv/bin/activate
pip install langchain langchain-community langchain-openai langgraph \
            pypdf2 chromadb tiktoken duckduckgo-search
```

Create a `.env` file:
```
OPENAI_API_KEY=sk-your-key-here
LANGCHAIN_TRACING_V2=true  # optional, for debugging
```

## Step 2: Core Research Agent

```python
# research_assistant.py
import os
from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from langchain_community.tools import DuckDuckGoSearchRun
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

# Initialize LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0.3)
search_tool = DuckDuckGoSearchRun()

# State definition
class ResearchState(TypedDict):
    query: str
    web_results: Annotated[List[str], "web_search_results"]
    pdf_content: Annotated[List[str], "pdf_documents"]
    analysis: str
    report: str
```

## Step 3: Web Research Node

```python
def web_research_node(state: ResearchState) -> dict:
    """Search the web and collect top results."""
    query = state["query"]
    results = []
    
    # Multiple search variations for depth
    queries = [
        query,
        f"{query} 2026 latest",
        f"{query} analysis review"
    ]
    
    for q in queries:
        try:
            result = search_tool.run(q)
            results.append(f"Query: {q}\n{result[:2000]}")
        except Exception as e:
            results.append(f"Search failed for '{q}': {str(e)}")
    
    return {"web_results": results}
```

## Step 4: PDF Analysis Node

```python
def pdf_analysis_node(state: ResearchState) -> dict:
    """Load and process PDF documents."""
    pdf_dir = "./pdfs"
    if not os.path.exists(pdf_dir):
        return {"pdf_content": ["No PDF directory found. Create ./pdfs/ and add PDFs."]}
    
    documents = []
    for pdf_file in os.listdir(pdf_dir):
        if pdf_file.endswith(".pdf"):
            loader = PyPDFLoader(os.path.join(pdf_dir, pdf_file))
            pages = loader.load()
            
            # Split into chunks for embedding
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000, chunk_overlap=200
            )
            chunks = splitter.split_documents(pages)
            
            # Store in vector DB for retrieval
            vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=OpenAIEmbeddings(),
                persist_directory="./chroma_db"
            )
            
            # Retrieve relevant chunks
            retriever = vectorstore.as_retriever(search_kwargs={"k": 5})
            relevant = retriever.get_relevant_documents(state["query"])
            
            content = "\n".join([doc.page_content for doc in relevant])
            documents.append(f"From {pdf_file}:\n{content[:3000]}")
    
    return {"pdf_content": documents}
```

## Step 5: Analysis Node

```python
def analysis_node(state: ResearchState) -> dict:
    """Synthesize web results and PDF content into analysis."""
    context_parts = []
    
    if state.get("web_results"):
        context_parts.append("=== WEB RESEARCH ===")
        context_parts.extend(state["web_results"])
    
    if state.get("pdf_content"):
        context_parts.append("=== PDF ANALYSIS ===")
        context_parts.extend(state["pdf_content"])
    
    context = "\n\n".join(context_parts)
    
    analysis_prompt = f"""
    Research Query: {state['query']}
    
    Research Context:
    {context[:10000]}
    
    Provide:
    1. Key findings (3-5 bullet points)
    2. Conflicting information or gaps
    3. Confidence assessment (high/medium/low) for each finding
    4. Sources that corroborate each other
    """
    
    result = llm.invoke(analysis_prompt)
    return {"analysis": result.content}
```

## Step 6: Report Generation Node

```python
def report_node(state: ResearchState) -> dict:
    """Generate structured research report."""
    report_prompt = f"""
    Based on this research analysis, generate a structured report:
    
    Analysis: {state['analysis'][:8000]}
    
    Report structure:
    ## Executive Summary
    ## Key Findings
    ## Detailed Analysis
    ## Methodology
    ## Limitations
    ## Sources
    """
    
    result = llm.invoke(report_prompt)
    return {"report": result.content}
```

## Step 7: Build the Graph

```python
# Create the workflow graph
workflow = StateGraph(ResearchState)

# Add nodes
workflow.add_node("web_research", web_research_node)
workflow.add_node("pdf_analysis", pdf_analysis_node)
workflow.add_node("analysis", analysis_node)
workflow.add_node("report", report_node)

# Set entry point
workflow.set_entry_point("web_research")

# Add edges (parallel web + PDF → analysis → report)
workflow.add_edge("web_research", "analysis")
workflow.add_edge("pdf_analysis", "analysis")
workflow.add_edge("analysis", "report")
workflow.add_edge("report", END)

# Compile
app = workflow.compile()
```

## Step 8: Run It

```python
# Usage example
def run_research(query: str, pdf_dir: str = "./pdfs"):
    initial_state = ResearchState(
        query=query,
        web_results=[],
        pdf_content=[],
        analysis="",
        report=""
    )
    
    result = app.invoke(initial_state)
    
    # Save report
    with open("research_report.md", "w") as f:
        f.write(result["report"])
    
    print(f"✅ Report saved to research_report.md")
    return result

# Example
run_research("Latest developments in solid-state battery technology 2026")
```

## Output Example (Abridged)

```markdown
## Executive Summary

Solid-state battery technology reached commercial viability in H1 2026. Three companies—Toyota, CATL, and QuantumScape—announced production-ready solid-state cells with energy densities exceeding 500 Wh/kg.

## Key Findings

1. **Toyota** began limited production of solid-state batteries for hybrids in April 2026 (source: Reuters)
2. **CATL** demonstrated a 520 Wh/kg solid-state pouch cell at Auto China 2026 (source: CATL press release)
3. **QuantumScape** reached 800 cycles with 95% capacity retention (source: Nature Energy paper)
4. Estimated cost: $75/kWh at scale vs $110/kWh for current Li-ion (source: BNEF)
5. Mass consumer EV adoption expected 2028-2029 (source: multiple analysts)
```

## Tips

- **Start with 1-2 sources**, then expand. The research quality scales with source diversity.
- **Add custom tools** — integrate Slack, Notion, or Google Drive for organizational research.
- **Caching** — ChromaDB persists between runs. Use the same vector store to avoid re-processing PDFs.
- **Rate limits** — Web search tools have rate limits. Add delays for batch research.

## FAQ

**Q: Can I use this with Claude or Gemini instead of OpenAI?**
A: Yes. Swap `ChatOpenAI` with `ChatAnthropic` or `ChatGoogleGenerativeAI`. Update embeddings accordingly.

**Q: How do I deploy this as a web app?**
A: Wrap the research function in a FastAPI endpoint and add a React frontend. Or use LangServe for auto-generated API.

**Q: What about cost?**
A: Each research run costs approximately ¥7-14 ($1-2) in API calls depending on source volume. PDF analysis is the most expensive step.

**Q: Can I add citation tracking?**
A: Yes, modify the `web_research_node` to return URLs alongside content, and include them in the report generation prompt.
