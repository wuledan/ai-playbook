---
title: "Codebase Vectorization 2026 — Semantic Code Search with Embeddings"
date: 2026-06-01
author: "AIPlaybook Editorial Team"
category: "Developer-Tools"
tags: [tutorial, embeddings, vector-search, code-search, semantic-search, openai, langchain]
cover: "/images/tutorials/ai-codebase-vectorization-tutorial-2026/cover.png"
difficulty: intermediate
meta_description: "Learn to vectorize your entire codebase for semantic search using embeddings. Build a code search engine that understands intent, not just keywords."
---

## Overview

Traditional code search tools like grep only match exact strings — they can't find "function that validates email" if the codebase calls it `checkEmailFormat`. Vector embeddings solve this by converting code into semantic vectors, enabling search by meaning rather than literal text. This tutorial walks you through building a codebase vectorization pipeline that: chunks your repository into searchable units, generates embeddings with OpenAI's `text-embedding-3-large`, stores them in pgvector (PostgreSQL), and provides a semantic search API. You'll end up with a search system that can find relevant code from natural language queries, docstring descriptions, or even other code snippets. Performance target: sub-100ms search on a 100k-chunk repository.

## Prerequisites

- Python 3.10+ and Node.js 18+
- PostgreSQL 15+ with pgvector extension (`CREATE EXTENSION vector;`)
- OpenAI API key with access to `text-embedding-3-large`
- A codebase to index (any language; we'll use a small open-source project like `FastAPI` as example)
- `pip install openai psycopg2-binary numpy tiktoken`
- Docker (optional, for local PostgreSQL): `docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password ankane/pgvector`

## Step 1: Design the Chunking Strategy

Code cannot be chunked like plain text. Functions, classes, and imports must stay atomic.

```python
import ast
import tree_sitter
from tree_sitter import Language, Parser

# Method 1: AST-based chunking for Python
def chunk_python_file(source_code, filepath):
    """Parse Python file and extract function/class boundaries."""
    tree = ast.parse(source_code)
    chunks = []
    
    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            chunk_text = source_code[node.lineno-1:node.end_lineno] if hasattr(node, 'end_lineno') else \
                         ast.get_source_segment(source_code, node)
            chunks.append({
                "type": "function",
                "name": node.name,
                "file": filepath,
                "start_line": node.lineno,
                "end_line": getattr(node, 'end_lineno', node.lineno + 20),
                "content": chunk_text
            })
        elif isinstance(node, ast.ClassDef):
            methods_text = []
            for item in node.body:
                if isinstance(item, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    methods_text.append(f"  def {item.name}(...): ...")
            chunks.append({
                "type": "class",
                "name": node.name,
                "file": filepath,
                "start_line": node.lineno,
                "content": f"class {node.name}:\n" + "\n".join(methods_text)
            })
    
    return chunks

# Method 2: token-count-aware chunking for any language
from transformers import GPT2TokenizerFast
tokenizer = GPT2TokenizerFast.from_pretrained("gpt2")

def get_tokens(text):
    return tokenizer.encode(text)

def chunk_by_tokens(code, filepath, max_tokens=500, overlap_tokens=50):
    """Split code into overlapping chunks by token count."""
    lines = code.split('\n')
    chunks = []
    current_chunk = []
    current_tokens = 0
    
    for i, line in enumerate(lines):
        line_tokens = len(get_tokens(line))
        
        if current_tokens + line_tokens > max_tokens and current_chunk:
            chunk_text = '\n'.join(current_chunk)
            chunks.append({
                "file": filepath,
                "start_line": i - len(current_chunk) + 1,
                "end_line": i,
                "content": chunk_text,
                "token_count": current_tokens
            })
            
            # Keep overlap tokens from end of previous chunk
            overlap_content = current_chunk[-(overlap_tokens // 10):]  # ~10 lines of overlap
            current_chunk = overlap_content + [line]
            current_tokens = sum(len(get_tokens(l)) for l in current_chunk)
        else:
            current_chunk.append(line)
            current_tokens += line_tokens
    
    # Last chunk
    if current_chunk:
        chunk_text = '\n'.join(current_chunk)
        chunks.append({
            "file": filepath,
            "start_line": len(lines) - len(current_chunk) + 1,
            "end_line": len(lines),
            "content": chunk_text,
            "token_count": current_tokens
        })
    
    return chunks
```

## Step 2: Scan and Chunk Your Codebase

Build a recursive scanner that walks your repository:

```python
import os
from pathlib import Path

def scan_codebase(root_dir, extensions={'.py', '.js', '.ts', '.jsx', '.tsx', '.go', '.rs', '.java'}):
    """Walk the codebase and chunk every file."""
    exclude_dirs = {'node_modules', '__pycache__', '.git', 'venv', '.venv', 'dist', 'build', '.next', 'target'}
    all_chunks = []
    
    for path in Path(root_dir).rglob('*'):
        if path.suffix not in extensions:
            continue
        if any(excl in path.parts for excl in exclude_dirs):
            continue
        if path.stat().st_size > 100000:  # Skip files >100KB
            continue
        if path.stat().st_size < 10:  # Skip empty/near-empty files
            continue
            
        try:
            source = path.read_text(encoding='utf-8', errors='ignore')
            # Use method 1 for Python, method 2 for everything else
            if path.suffix == '.py':
                chunks = chunk_python_file(source, str(path))
            else:
                chunks = chunk_by_tokens(source, str(path), max_tokens=500)
            all_chunks.extend(chunks)
            print(f"  ✓ {path} → {len(chunks)} chunks")
        except Exception as e:
            print(f"  ✗ {path}: {e}")
    
    return all_chunks

# Example: scan FastAPI source
chunks = scan_codebase("./fastapi/fastapi")
print(f"Total chunks: {len(chunks)}")
# Expected: ~1500-3000 chunks for a medium codebase
```

## Step 3: Generate Embeddings

Chunk → vector transformation is the core of semantic search:

```python
from openai import OpenAI
import numpy as np
from tqdm import tqdm

client = OpenAI(api_key="sk-your-key-here")

def embed_chunks(chunks, batch_size=20):
    """Generate embeddings for code chunks in batches."""
    EMBEDDING_MODEL = "text-embedding-3-large"
    DIMENSIONS = 1536  # Use 1536 for speed; 3072 for max accuracy
    
    for i in tqdm(range(0, len(chunks), batch_size)):
        batch = chunks[i:i+batch_size]
        texts = [c["content"] for c in batch]
        
        response = client.embeddings.create(
            model=EMBEDDING_MODEL,
            input=texts,
            dimensions=DIMENSIONS
        )
        
        for j, embedding_data in enumerate(response.data):
            batch[j]["embedding"] = embedding_data.embedding
    
    return chunks

# Store original content minus embedding for preview
chunks_with_embeddings = embed_chunks(chunks)
print(f"Embedding dimensionality: {len(chunks_with_embeddings[0]['embedding'])}")
```

## Step 4: Store in PostgreSQL with pgvector

```python
import psycopg2
from psycopg2.extras import execute_values

def setup_pgvector():
    conn = psycopg2.connect(
        host="localhost", port=5432, dbname="code_search",
        user="postgres", password="password"
    )
    cur = conn.cursor()
    
    # Enable pgvector extension
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    
    # Create table with vector index
    cur.execute("""
    CREATE TABLE IF NOT EXISTS code_chunks (
        id SERIAL PRIMARY KEY,
        file_path TEXT NOT NULL,
        start_line INTEGER,
        end_line INTEGER,
        chunk_type TEXT,
        chunk_name TEXT,
        content TEXT NOT NULL,
        token_count INTEGER,
        embedding vector(1536)
    );
    """)
    
    # Create IVFFlat index for fast approximate search
    cur.execute("""
    CREATE INDEX IF NOT EXISTS idx_code_chunks_embedding 
    ON code_chunks 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
    """)
    
    conn.commit()
    return conn

def insert_chunks(conn, chunks):
    cur = conn.cursor()
    data = [
        (
            c["file"], c.get("start_line"), c.get("end_line"),
            c.get("type"), c.get("name"), c["content"],
            c.get("token_count"), c["embedding"]
        )
        for c in chunks
    ]
    
    execute_values(cur, """
    INSERT INTO code_chunks 
        (file_path, start_line, end_line, chunk_type, chunk_name, content, token_count, embedding) 
    VALUES %s
    """, data)
    
    conn.commit()
    print(f"Inserted {len(data)} chunks")

conn = setup_pgvector()
insert_chunks(conn, chunks_with_embeddings)
```

## Step 5: Build the Semantic Search Engine

```python
import numpy as np
from openai import OpenAI

client = OpenAI(api_key="sk-your-key-here")

def search_code(query, conn, top_k=10):
    """Search codebase by semantic similarity to a query."""
    # Generate query embedding
    response = client.embeddings.create(
        model="text-embedding-3-large",
        input=[query],
        dimensions=1536
    )
    query_embedding = response.data[0].embedding
    
    # Search with pgvector
    cur = conn.cursor()
    cur.execute("""
    SELECT 
        file_path, start_line, end_line, chunk_type, chunk_name,
        LEFT(content, 200) AS content_preview,
        1 - (embedding <=> %s::vector) AS similarity
    FROM code_chunks
    ORDER BY embedding <=> %s::vector
    LIMIT %s
    """, (query_embedding, query_embedding, top_k))
    
    results = []
    for row in cur.fetchall():
        results.append({
            "file": row[0],
            "lines": f"{row[1]}-{row[2]}",
            "type": row[3],
            "name": row[4],
            "preview": row[5],
            "similarity": round(row[6], 4)
        })
    
    return results

# Test: search for email validation
results = search_code("validate email address format", conn)
for r in results:
    print(f"{r['similarity']:.4f}  {r['file']}:{r['lines']}  ({r['type']}: {r['name']})")
# Expected: Finds functions like "validate_email" or "check_email_format"
```

## Step 6: Add Hybrid Search (Vector + Keyword)

Pure semantic search can miss exact matches that have weak embedding similarity. Add BM25 keyword search as a complement:

```python
# Option A: Use PostgreSQL full-text search combined with pgvector
def hybrid_search(query, conn, top_k=10):
    """Combined vector + keyword search."""
    response = client.embeddings.create(
        model="text-embedding-3-large",
        input=[query],
        dimensions=1536
    )
    query_embedding = response.data[0].embedding
    
    cur = conn.cursor()
    cur.execute("""
    WITH semantic AS (
        SELECT id, file_path, start_line, content,
               1 - (embedding <=> %s::vector) AS score,
               'semantic' AS match_type
        FROM code_chunks
        ORDER BY embedding <=> %s::vector
        LIMIT %s
    ),
    keyword AS (
        SELECT id, file_path, start_line, content,
               ts_rank(to_tsvector('english', content), plainto_tsquery('english', %s)) AS score,
               'keyword' AS match_type
        FROM code_chunks
        WHERE to_tsvector('english', content) @@ plainto_tsquery('english', %s)
        ORDER BY score DESC
        LIMIT %s
    )
    SELECT * FROM semantic
    UNION ALL
    SELECT * FROM keyword
    WHERE id NOT IN (SELECT id FROM semantic)
    ORDER BY score DESC
    LIMIT %s;
    """, (query_embedding, query_embedding, top_k, query, query, top_k, top_k))
    
    return cur.fetchall()

# Test hybrid search
results = hybrid_search("HTTP exception handler", conn)
print(f"Found {len(results)} results combining semantic and keyword matching")
```

## Step 7: Build a FastAPI Search Service

Wrap everything in an API:

```python
from fastapi import FastAPI, Query
from pydantic import BaseModel
import psycopg2

app = FastAPI(title="Codebase Vector Search")
conn = psycopg2.connect(host="localhost", dbname="code_search", 
                        user="postgres", password="password")

class SearchResult(BaseModel):
    file: str
    lines: str
    type: str | None = None
    name: str | None = None
    preview: str
    similarity: float

@app.get("/search", response_model=list[SearchResult])
async def search(q: str = Query(..., description="Natural language query"), 
                 top_k: int = Query(10, ge=1, le=50)):
    results = search_code(q, conn, top_k=top_k)
    return results

@app.post("/index")
async def index_repo(repo_path: str):
    """Re-index the codebase."""
    chunks = scan_codebase(repo_path)
    chunks_with_emb = embed_chunks(chunks)
    
    # Clear and re-insert
    cur = conn.cursor()
    cur.execute("TRUNCATE code_chunks")
    conn.commit()
    insert_chunks(conn, chunks_with_emb)
    
    return {"message": f"Indexed {len(chunks_with_emb)} chunks"}

@app.get("/status")
async def status():
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*) FROM code_chunks")
    count = cur.fetchone()[0]
    return {"total_chunks": count}

# Run with: uvicorn search_api:app --reload --port 8000
```

## What You've Built

You have a complete codebase vectorization pipeline:
- Recursive code scanner with language-aware chunking (AST for Python, token-based for others)
- OpenAI embedding generation at batch scale (1536-dimensional vectors)
- pgvector storage with IVFFlat indexing for sub-100ms search
- Hybrid semantic + keyword search engine
- REST API serving search results from any natural language query

Search a 10k-file codebase takes under 200ms from query to results.

## Troubleshooting

**IVFFlat index doesn't improve search speed:**
The `lists` parameter in `WITH (lists = 100)` should be set to `sqrt(n)` where `n` is the number of rows. For 10,000 chunks, use `lists = 100`. For 100,000 chunks, use `lists = 300`. Rebuild the index after tuning: `REINDEX INDEX idx_code_chunks_embedding;`.

**OpenAI embedding API returns 429 rate limit errors:**
Implement exponential backoff: reduce batch_size to 10 and add `time.sleep(0.5)` between batches. For production, use the `openai.Retry` strategy with `max_retries=5`.

**Large files (>100KB) cause token limit errors:**
The scanner already skips files >100KB. For legitimate large source files, split into top-level declarations only rather than chunking every function body.

**Semantic search returns irrelevant results for very short queries:**
Short queries like "auth" lack semantic context. Enrich them programmatically: prepend the most common code language patterns. "auth" → "authentication, authorization, login, password handling code".

## Next Steps

- Add deduplication with cosine similarity threshold (>0.95 = duplicate)
- Implement streaming re-indexing with a Git hook (`post-commit` triggers re-index of changed files)
- Integrate with VS Code as a custom search provider extension
- Use a local embedding model like `mxbai-embed-large` for offline search
- Build a RAG system on top: "Explain this bug using context from our codebase"
