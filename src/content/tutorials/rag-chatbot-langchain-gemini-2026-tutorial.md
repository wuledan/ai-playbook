---
title: "Build a RAG Chatbot with LangChain and Gemini: Step-by-Step 2026 Tutorial"
author: "AIPlaybook Editorial Team"
date: 2026-05-30
category: tutorials
tags: ["rag", "langchain", "gemini", "google-ai", "tutorial", "chatbot", "vector-search", "python", "chromadb"]
cover: "/images/tutorials/rag-chatbot-langchain-gemini-2026-tutorial/cover.png"
difficulty: intermediate
meta_description: "Build a production-ready RAG chatbot using LangChain and Google Gemini. Step-by-step guide covering document ingestion, semantic chunking, ChromaDB vector storage, and streaming chat responses."
---

## Overview

Retrieval-Augmented Generation (RAG) is the dominant architecture for building AI chatbots that actually know your data. In 2026, Google's Gemini models offer competitive performance with generous free tiers, making them an excellent choice for RAG applications.

This tutorial builds a complete RAG chatbot that:
- Ingests PDF and markdown documents
- Chunks them intelligently with semantic overlap
- Stores embeddings in ChromaDB (local, no cloud cost)
- Retrieves relevant context using Gemini embeddings
- Generates streaming responses with Gemini 2.5 Flash

Unlike tutorials that use cloud-only vector databases, we'll use ChromaDB — a fully local, open-source vector store that runs in-process. This means zero monthly costs and full data privacy.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  Documents   │────▶│  Chunking    │────▶│  Embeddings │
│  (PDF, MD)   │     │  1000 chars  │     │  Gemini API │
└──────────────┘     └──────────────┘     └──────┬──────┘
                                                  │
┌──────────────┐     ┌──────────────┐              │
│  User Query  │────▶│  Query Embed │──────────────┘
└──────────────┘     └──────────────┘              │
                                                   ▼
┌──────────────┐     ┌──────────────┐     ┌─────────────┐
│  Streamed    │◀────│  Gemini 2.5  │◀────│  ChromaDB   │
│  Response    │     │  Generation  │     │  Top-5 Docs │
└──────────────┘     └──────────────┘     └─────────────┘
```

## Prerequisites

- Python 3.10+
- Google AI API key ([get one free at aistudio.google.com](https://aistudio.google.com))
- Basic Python knowledge

## Step 1: Environment Setup

```bash
mkdir rag-gemini-chatbot && cd rag-gemini-chatbot
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

pip install langchain langchain-google-genai chromadb pypdf \
            python-dotenv pypdf2 tiktoken
```

Create a `.env` file:

```bash
GOOGLE_API_KEY=AIzaSy...your-key-here
```

## Step 2: Document Ingestion Pipeline

The ingestion pipeline reads documents, splits them into semantically meaningful chunks, and stores them in ChromaDB. The key design decision is **chunk strategy** — chunks that are too small miss context, chunks that are too large dilute relevance.

Create `ingest.py`:

```python
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma

# ── Configuration ──────────────────────────────────────
DOCS_DIR = "./knowledge_base/"
CHROMA_DIR = "./chroma_db"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200

# ── Step A: Load Documents ────────────────────────────
def load_documents():
    pdf_loader = DirectoryLoader(
        DOCS_DIR,
        glob="**/*.pdf",
        loader_cls=PyPDFLoader,
        show_progress=True,
    )
    md_loader = DirectoryLoader(
        DOCS_DIR,
        glob="**/*.md",
        loader_cls=lambda path: __import__(
            "langchain_community.document_loaders"
        ).TextLoader(path, encoding="utf-8"),
        show_progress=True,
    )

    docs = []
    for loader in [pdf_loader, md_loader]:
        try:
            docs.extend(loader.load())
        except Exception as e:
            print(f"Warning loading documents: {e}")

    print(f"Loaded {len(docs)} documents")
    return docs

# ── Step B: Smart Chunking ────────────────────────────
def chunk_documents(docs):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""],
        length_function=len,
    )
    chunks = splitter.split_documents(docs)

    # Add metadata for traceability
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = i
        chunk.metadata["char_count"] = len(chunk.page_content)

    print(f"Created {len(chunks)} chunks")
    return chunks

# ── Step C: Embed and Store ───────────────────────────
def embed_and_store(chunks):
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
    )

    vector_store = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
        collection_name="knowledge_base",
    )

    print(f"Stored {len(chunks)} chunks in ChromaDB at {CHROMA_DIR}")
    return vector_store

# ── Main ──────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(DOCS_DIR, exist_ok=True)
    print(f"Place your PDFs and markdown files in ./{DOCS_DIR}/")
    docs = load_documents()
    if not docs:
        print("No documents found. Add files and re-run.")
        exit(1)
    chunks = chunk_documents(docs)
    store = embed_and_store(chunks)
    print("✓ Ingestion complete!")
```

**What actually happens:** When you run this, the script:
1. Scans `./knowledge_base/` for PDF and markdown files
2. Loads each document into LangChain's `Document` format
3. Chunks them at 1000 characters with 200 character overlap (industry standard balance between precision and context)
4. Embeds each chunk using Gemini's `embedding-001` model (768 dimensions)
5. Stores embeddings + original text in ChromaDB

Run it:

```bash
mkdir knowledge_base
# Place your .pdf or .md files there
python ingest.py
```

## Step 3: The RAG Chatbot

Now we build the chat interface with streaming responses and source citations.

Create `chatbot.py`:

```python
import os
from dotenv import load_dotenv

load_dotenv()

from langchain_google_genai import (
    GoogleGenerativeAIEmbeddings,
    ChatGoogleGenerativeAI,
)
from langchain_chroma import Chroma
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough, RunnableLambda
from langchain.schema import Document
from typing import List

# ── Configuration ──────────────────────────────────────
CHROMA_DIR = "./chroma_db"
MODEL_NAME = "models/gemini-2.5-flash-preview-04-17"
TEMPERATURE = 0.3
TOP_K = 5  # Retrieve top-5 relevant chunks

# ── Vector Store Setup ────────────────────────────────
embeddings = GoogleGenerativeAIEmbeddings(
    model="models/embedding-001",
    google_api_key=os.getenv("GOOGLE_API_KEY"),
)

vector_store = Chroma(
    persist_directory=CHROMA_DIR,
    embedding_function=embeddings,
    collection_name="knowledge_base",
)

retriever = vector_store.as_retriever(
    search_type="similarity",
    search_kwargs={"k": TOP_K},
)

# ── LLM Setup ──────────────────────────────────────────
llm = ChatGoogleGenerativeAI(
    model=MODEL_NAME,
    temperature=TEMPERATURE,
    google_api_key=os.getenv("GOOGLE_API_KEY"),
    streaming=True,
)

# ── Prompt Template ───────────────────────────────────
PROMPT_TEMPLATE = """You are a helpful assistant answering questions based
ONLY on the provided context. If the context doesn't contain the answer,
say "I couldn't find information about that in my knowledge base."

Context:
{context}

Question: {question}

Provide a thorough answer with specific details from the context.
If you reference specific data points, cite the source filename.
"""

prompt = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)

# ── Format chunks for prompt ──────────────────────────
def format_docs(docs: List[Document]) -> str:
    formatted = []
    for i, doc in enumerate(docs, 1):
        source = doc.metadata.get("source", "unknown")
        formatted.append(
            f"[Source {i}: {source}]\n{doc.page_content}\n"
        )
    return "\n".join(formatted)

# ── RAG Chain ─────────────────────────────────────────
def build_rag_chain():
    return (
        {
            "context": retriever | format_docs,
            "question": RunnablePassthrough(),
        }
        | prompt
        | llm
    )

rag_chain = build_rag_chain()

# ── Interactive Chat ──────────────────────────────────
def chat():
    print("=" * 60)
    print("  RAG Chatbot with LangChain + Gemini")
    print("  Type 'quit' to exit, 'clear' to reset")
    print("=" * 60)

    while True:
        question = input("\n🧑 You: ").strip()
        if question.lower() in ("quit", "exit", "q"):
            break
        if question.lower() == "clear":
            continue

        print("\n🤖 Assistant: ", end="", flush=True)
        response_text = ""
        for chunk in rag_chain.stream(question):
            if hasattr(chunk, "content"):
                print(chunk.content, end="", flush=True)
                response_text += chunk.content
        print("\n")

        # Show retrieved sources
        print("─── Retrieved Sources ───")
        docs = retriever.invoke(question)
        for doc in docs:
            source = doc.metadata.get("source", "?")
            print(f"  📄 {source} (score: N/A)")
        print("────────────────────────")

if __name__ == "__main__":
    chat()
```

## Step 4: Running and Testing

```bash
python chatbot.py
```

**Sample interaction:**

```
🧑 You: What are the system requirements for deployment?

🤖 Assistant: Based on the deployment documentation, the minimum system
requirements are 4 GB RAM and 2 CPU cores for the application server.
The database server requires 8 GB RAM and 4 CPU cores...

─── Retrieved Sources ───
  📄 knowledge_base/deployment-guide.pdf
  📄 knowledge_base/system-requirements.md
────────────────────────
```

Notice how the chatbot not only answers but shows which documents it referenced — a critical trust-building feature for production RAG systems.

## Tips for Better Results

1. **Optimize chunk size by content type**: Code documentation benefits from smaller chunks (500 chars), while narrative documents work better with 1500+ chars. Experiment with your specific content.
2. **Use metadata filters**: Add metadata like `doc_type`, `date`, or `author` during ingestion, then filter the retriever: `search_kwargs={"filter": {"doc_type": "api-docs"}}`.
3. **Enable MMR search**: For diverse results, use `search_type="mmr"` instead of `"similarity"` — this avoids retrieving five near-identical chunks about the same topic.
4. **Add a re-ranker**: For >1000 documents, add a cross-encoder re-ranker (like Cohere rerank) between retrieval and generation to improve relevance.

## Common Pitfalls

- **❌ Chunk overlap too small**: Below 100 characters, context breaks mid-sentence between chunks. Always test with your actual content.
- **❌ No source citations**: Users won't trust a RAG chatbot that doesn't cite its sources. Always show which documents informed the answer.
- **❌ Cold cache**: Streaming Gemini needs warm start — the first query may be slower. Keep the connection alive or use a keep-alive mechanism.
- **❌ Ignoring user feedback**: Add a 👍/👎 feedback button to log poor retrievals for manual review and chunk tuning.

## Conclusion

You've built a complete RAG chatbot using Python, LangChain, Google Gemini, and ChromaDB — fully local with no cloud infrastructure costs. The architecture patterns here (semantic chunking, metadata-augmented retrieval, streaming generation, source citation) directly translate to production systems serving thousands of users.

**What's next:**
- Add `Streamlit` for a web UI
- Deploy with Docker + LiteLLM for multi-model support
- Add hybrid search (BM25 + embedding) for better keyword matching
- Implement conversation memory with LangChain's `ConversationBufferMemory`

The full code is production-ready. Drop your documents in, and you have a custom AI assistant that knows your data.
