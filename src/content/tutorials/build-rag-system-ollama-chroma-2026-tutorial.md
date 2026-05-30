---
title: "Build a Private RAG System with Ollama + Chroma in 2026"
date: 2026-05-30
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: [rag, ollama, chromadb, vector-database, local-llm, tutorial, langchain, document-qa]
cover: /images/tutorials/build-rag-system-ollama-chroma-2026/cover.png
difficulty: intermediate
meta_description: "Step-by-step guide to building a fully private RAG (Retrieval-Augmented Generation) system using Ollama for local LLM inference and Chroma for vector storage — no cloud API keys needed."
---

## Introduction

Retrieval-Augmented Generation (RAG) lets you query your own documents using an LLM. The catch? Most tutorials send your data to OpenAI or Claude. If you're working with sensitive documents (legal, medical, internal docs), that's a non-starter.

This tutorial builds a **fully offline RAG system** using:

- **Ollama** — run Llama 3, Mistral, or any open LLM locally
- **Chroma** — lightweight vector database for similarity search
- **LangChain** — orchestration layer connecting everything

No API keys. No data leaving your machine. ~100 lines of Python.

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Python | 3.11+ |
| Ollama | 0.5+ (latest) |
| RAM | 16GB minimum (32GB recommended for 7B+ models) |
| Disk | 5GB free for model storage |

Install the required Python packages:

```bash
pip install langchain langchain-community chromadb ollama pypdf sentence-transformers
```

Download a local model via Ollama:

```bash
ollama pull llama3.2:3b   # fast, lightweight
# or
ollama pull llama3.2:7b   # better quality, needs more RAM
```

Verify the model works:

```bash
ollama run llama3.2:3b "Hello, what model are you?"
```

## Step 1: Document Ingestion Pipeline

We'll start by loading PDFs, splitting them into chunks, embedding them, and storing in Chroma.

Create `ingest.py`:

```python
import os
from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma

DOCS_DIR = "./docs"
CHROMA_DIR = "./chroma_db"

# 1. Load documents from directory
def load_documents():
    loader = DirectoryLoader(
        DOCS_DIR,
        glob="**/*.pdf",
        loader_cls=PyPDFLoader,
        show_progress=True
    )
    documents = loader.load()
    print(f"Loaded {len(documents)} document(s)")
    return documents

# 2. Split into chunks
def split_documents(documents):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\n\n", "\n", " ", ""],
        length_function=len,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks")
    return chunks

# 3. Embed and store
def create_vectorstore(chunks):
    embeddings = OllamaEmbeddings(
        model="llama3.2:3b",  # Uses Ollama's built-in embedding support
        base_url="http://localhost:11434"
    )
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR,
    )
    vectorstore.persist()
    print(f"Vector store saved to {CHROMA_DIR}")
    return vectorstore

if __name__ == "__main__":
    os.makedirs(DOCS_DIR, exist_ok=True)
    os.makedirs(CHROMA_DIR, exist_ok=True)
    docs = load_documents()
    chunks = split_documents(docs)
    create_vectorstore(chunks)
```

> **Tip:** Place your PDFs in a `./docs/` folder. For testing, drop in a Wikipedia article or product manual PDF.

## Step 2: Query Engine

Now build `query.py` — the RAG query interface:

```python
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

CHROMA_DIR = "./chroma_db"

# Custom prompt template for better answers
RAG_PROMPT = PromptTemplate(
    template="""You are a helpful assistant answering questions based on the provided context.
    
Context:
{context}

Question: {question}

Answer the question using ONLY the context provided. If the context doesn't contain enough information, say "I cannot find sufficient information in the provided documents."
Keep your answer concise and cite specific parts from the context where relevant.

Answer:""",
    input_variables=["context", "question"]
)

def create_qa_chain():
    # Load the persisted vector store
    embeddings = OllamaEmbeddings(
        model="llama3.2:3b",
        base_url="http://localhost:11434"
    )
    vectorstore = Chroma(
        persist_directory=CHROMA_DIR,
        embedding_function=embeddings
    )
    
    # Initialize local LLM
    llm = Ollama(
        model="llama3.2:3b",
        base_url="http://localhost:11434",
        temperature=0.1,
        num_predict=512,
    )
    
    # Create QA chain
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vectorstore.as_retriever(
            search_type="similarity",
            search_kwargs={"k": 4}
        ),
        chain_type_kwargs={"prompt": RAG_PROMPT},
        return_source_documents=True,
    )
    return qa_chain

if __name__ == "__main__":
    qa = create_qa_chain()
    print("RAG system ready! Type 'quit' to exit.\n")
    while True:
        query = input("\n🔍 Your question: ")
        if query.lower() in ["quit", "exit", "q"]:
            break
        result = qa({"query": query})
        print(f"\n🤖 Answer: {result['result']}")
        print(f"\n📄 Sources: {len(result['source_documents'])} document(s)")
```

## Step 3: Run It

```bash
# Terminal 1 — make sure Ollama is running
ollama serve

# Terminal 2 — ingest your documents
python ingest.py

# Terminal 3 — query
python query.py
```

**Sample output:**

```
🔍 Your question: What are the key features of the product?

🤖 Answer: Based on the product manual, the key features include:
1. Automated data synchronization across all devices
2. End-to-end encryption for data security
3. Real-time collaboration with up to 50 users
4. Customizable dashboard with drag-and-drop widgets

📄 Sources: 2 document(s)
```

## Step 4: Add MMR Search for Better Diversity

Replace the retriever in `query.py` for better results:

```python
retriever = vectorstore.as_retriever(
    search_type="mmr",  # Maximum Marginal Relevance
    search_kwargs={"k": 4, "fetch_k": 20, "lambda_mult": 0.7}
)
```

MMR balances relevance and diversity — you get 4 useful chunks instead of 4 nearly identical ones.

## Step 5: Streaming Response (Optional)

For a chat-like experience, add streaming:

```python
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

llm = Ollama(
    model="llama3.2:3b",
    base_url="http://localhost:11434",
    callbacks=[StreamingStdOutCallbackHandler()],
    temperature=0.1,
)
```

Now answers stream token-by-token like ChatGPT, but entirely local.

## Performance Tips

| Optimization | Impact | How |
|-------------|--------|-----|
| Switch to nomic-embed-text | 2x faster embedding | `ollama pull nomic-embed-text` |
| Increase chunk_size to 1500 | Fewer chunks, faster search | Adjust in splitter config |
| Use Llama 3.2 7B | Better answer quality | `ollama pull llama3.2:7b` (needs ~8GB RAM) |
| Set search_kwargs k=3 | Faster retrieval | Fewer context windows = less LLM processing |

## When to Upgrade to a Production Setup

This local RAG system is great for personal use and small teams. When you outgrow it:

- **Scale up:** Switch Chroma to Qdrant or Weaviate for multi-node deployment
- **Embeddings:** Replace OllamaEmbeddings with sentence-transformers/all-MiniLM-L6-v2 for consistency
- **LLM:** Serve Ollama behind vLLM for GPU-accelerated batch inference
- **Monitoring:** Add LangSmith for trace-based debugging

## Full Code

All code from this tutorial is available in a single script:

<details>
<summary>full_rag.py — click to expand</summary>

```python
import os
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate

DOCS_DIR = "./docs"
CHROMA_DIR = "./chroma_db"

def ingest():
    loader = DirectoryLoader(DOCS_DIR, glob="**/*.pdf", loader_cls=PyPDFLoader, show_progress=True)
    docs = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = splitter.split_documents(docs)
    embeddings = OllamaEmbeddings(model="llama3.2:3b", base_url="http://localhost:11434")
    vectorstore = Chroma.from_documents(chunks, embeddings, persist_directory=CHROMA_DIR)
    vectorstore.persist()
    return len(chunks)

def query(q):
    embeddings = OllamaEmbeddings(model="llama3.2:3b", base_url="http://localhost:11434")
    vectorstore = Chroma(persist_directory=CHROMA_DIR, embedding_function=embeddings)
    llm = Ollama(model="llama3.2:3b", base_url="http://localhost:11434", temperature=0.1)
    prompt = PromptTemplate(template="Context:\n{context}\n\nQuestion: {question}\n\nAnswer:", input_variables=["context", "question"])
    qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=vectorstore.as_retriever(search_kwargs={"k": 4}), chain_type_kwargs={"prompt": prompt}, return_source_documents=True)
    return qa({"query": q})

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "ingest":
        n = ingest()
        print(f"Ingested {n} chunks into {CHROMA_DIR}")
    elif len(sys.argv) > 2 and sys.argv[1] == "query":
        result = query(sys.argv[2])
        print(result["result"])
        for src in result["source_documents"]:
            print(f"  Source: {src.metadata.get('source', 'unknown')}")
    else:
        print("Usage: python full_rag.py ingest | query 'your question'")
```
</details>

## Conclusion

You now have a fully private RAG system running on your own hardware. No data ever leaves your machine. The pipeline handles PDF ingestion, chunking, embedding, vector search, and LLM-powered answers — all in about 100 lines of Python.

The same architecture scales from a laptop with Llama 3.2 3B to a production cluster with dedicated embedding servers. The only difference is the model size and vector store backend.

**Next steps:** Add support for more file types (DOCX, HTML, CSV) via LangChain's document loaders, or wrap the query interface in a FastAPI server for a web UI.
