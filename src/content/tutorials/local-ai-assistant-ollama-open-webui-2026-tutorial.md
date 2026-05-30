---
title: "Build a Local-First AI Assistant with Ollama and Open WebUI: 2026 Guide"
author: "AIPlaybook Editorial Team"
date: 2026-05-30
category: tutorials
tags: ["ollama", "open-webui", "local-ai", "llama", "privacy", "self-hosted", "tutorial"]
cover: "/images/tutorials/local-ai-assistant-ollama-open-webui-2026-tutorial/cover.png"
difficulty: beginner
meta_description: "Build a fully offline, local-first AI assistant using Ollama and Open WebUI. Step-by-step guide covering installation, model management, RAG, and web UI on macOS/Linux."
---

## Overview

By mid-2026, running LLMs locally has gone from experimental hobby to mainstream practice. Ollama makes it trivial to download and run models like Llama 4, DeepSeek V4, and Qwen 3 on consumer hardware, while Open WebUI provides a ChatGPT-like interface with RAG, web search, and multi-user support — all running entirely on your machine with zero data leaving your network.

This tutorial builds a complete local AI assistant:

1. Install and configure Ollama
2. Download and manage multiple models (Llama 4, DeepSeek V4, Qwen 3)
3. Deploy Open WebUI with Docker
4. Enable local RAG with document upload
5. Configure web search integration
6. Set up multi-user access for your team

Total cost: $0. Hardware: any Mac with Apple Silicon (8GB+ RAM recommended) or any x86 Linux machine with 16GB+ RAM.

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Your Machine                          │
│                                                         │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────┐ │
│  │  Open WebUI  │───▶│  Ollama API  │◀───│  Models   │ │
│  │  (Docker)    │    │  localhost:  │    │  Llama 4  │ │
│  │  port 3000   │    │  11434      │    │  DeepSeek  │ │
│  └──────┬──────┘    └──────────────┘    │  Qwen 3   │ │
│         │                               └───────────┘ │
│         │                                                │
│  ┌──────▼──────┐    ┌──────────────┐                    │
│  │  Local RAG  │    │  Web Search  │                    │
│  │  (ChromaDB) │    │  (SearXNG)   │                    │
│  └─────────────┘    └──────────────┘                    │
└────────────────────────────────────────────────────────┘
          │
          ▼
   Zero data leaves your network
```

## Prerequisites

- macOS (Apple Silicon) or Linux (x86_64) with 8GB+ RAM
- Docker Desktop or Docker Engine
- 20GB+ free disk space (models are 4-8GB each)

## Step 1: Install Ollama

Ollama is a single binary that manages model downloads, caching, and inference.

**macOS:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Verify installation:**
```bash
ollama --version
# Should output something like: ollama version 0.5.12
```

**Start the Ollama server:**
```bash
ollama serve
```

This starts the REST API on `http://localhost:11434`. Keep this terminal open.

## Step 2: Download Models

Ollama can pull models from its registry or use GGUF files. The key factor is your VRAM/RAM:

| Model | Size | RAM Needed | Best For |
|-------|------|------------|----------|
| `llama4:8b` | 4.7 GB | 8GB+ | General conversation, coding |
| `deepseek-v4:7b` | 4.2 GB | 8GB+ | Coding, reasoning |
| `qwen3:14b` | 8.4 GB | 16GB+ | Multilingual, complex reasoning |
| `gemma3:12b` | 7.6 GB | 16GB+ | Fast responses, good English |

```bash
# PULL MODELS (this downloads and quantizes — takes 5-15 min each)
ollama pull llama4:8b
ollama pull deepseek-v4:7b
ollama pull qwen3:14b

# LIST INSTALLED MODELS
ollama list

# Test a model directly from terminal
ollama run llama4:8b "What is the capital of France? Answer in one word."
```

**Expected output:**

```
NAME                      ID            SIZE      MODIFIED
llama4:8b                 8daa7a1e4d60   4.7 GB    About a minute ago
deepseek-v4:7b            c1b5a23f0a7e   4.2 GB    About a minute ago
qwen3:14b                 3e1d4b73f0c5   8.4 GB    About a minute ago
```

## Step 3: Create a Custom Modelfile

Ollama allows customizing model behavior via Modelfiles. Let's create a helpful assistant persona:

Create `Modelfile`:

```dockerfile
FROM llama4:8b

# System prompt that defines behavior
SYSTEM """You are a helpful, knowledgeable AI assistant running locally.
You have access to uploaded documents for context.
You are concise, accurate, and cite sources when possible.
If you don't know something, say so — don't fabricate information.
You run entirely on the user's machine with complete privacy."""

# Temperature (lower = more deterministic)
PARAMETER temperature 0.7

# Context window (2048-8192 depending on hardware)
PARAMETER num_ctx 4096

# Stop sequences
PARAMETER stop "</s>"
PARAMETER stop "<|im_end|>"
```

Build and run your custom model:

```bash
ollama create my-assistant -f Modelfile
ollama run my-assistant "Who are you?"
```

## Step 4: Deploy Open WebUI

Open WebUI is a self-hosted ChatGPT clone that integrates directly with Ollama. We'll deploy it via Docker.

```bash
docker run -d \
  --name open-webui \
  -p 3000:8080 \
  -v open-webui-data:/app/backend/data \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  --restart unless-stopped \
  ghcr.io/open-webui/open-webui:main
```

**Explanation:**
- `-p 3000:8080` — Maps container port 8080 to host port 3000
- `-v open-webui-data:/app/backend/data` — Persistent volume for user data, chats, and RAG documents
- `OLLAMA_BASE_URL=http://host.docker.internal:11434` — Docker-to-host connection for Ollama API
- `ghcr.io/open-webui/open-webui:main` — Latest stable release

**Visit:** `http://localhost:3000`

Create your admin account on first visit.

## Step 5: Configure Model Selection

Once logged into Open WebUI:

1. Go to **Settings → Models**
2. Configure **Default Model**: Select `my-assistant` or `llama4:8b`
3. Enable **Show all models by default** for the model switcher
4. Go to **Admin Settings → Models** and set the context length to match your hardware:
   - 8GB RAM: 4096 tokens
   - 16GB RAM: 8192 tokens
   - 32GB RAM: 16384 tokens

## Step 6: Enable Local RAG

Open WebUI includes built-in RAG using ChromaDB. This lets you upload documents and ask questions about them.

1. Go to **Workspace → Documents**
2. Click **+ Upload** and select PDF, DOCX, TXT, or MD files
3. The system automatically chunks and embeds them using a local embedding model (Ollama pulls `nomic-embed-text` automatically)

**How it works under the hood:**

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│ Document │───▶│  Chunking    │───▶│  Embeddings  │
│  Upload   │    │  (1000 char)  │    │  (local)     │
└──────────┘    └──────────────┘    └──────┬───────┘
                                           │
                                          ▼
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│  Answer  │◀───│  LLM +       │◀───│  ChromaDB    │
│          │    │  Context     │    │  Retrieval   │
└──────────┘    └──────────────┘    └──────────────┘
```

3. In a chat, type `#` followed by your document name to activate RAG mode, or click the paperclip icon
4. Ask questions — the model only answers from your uploaded content

## Step 7: Configure Web Search (Optional)

Open WebUI can integrate with SearXNG for privacy-respecting web search:

```bash
docker run -d \
  --name searxng \
  -p 4000:8080 \
  -e BASE_URL=http://localhost:4000 \
  -e SEARXNG_SECRET=$(openssl rand -hex 32) \
  searxng/searxng
```

In Open WebUI:
1. Go to **Admin Settings → Web Search**
2. Enable **Web Search**
3. Set **Search Engine**: `SearXNG`
4. Set **API URL**: `http://host.docker.internal:4000/search`
5. Save and test

Now your assistant can answer questions about current events — all routed through your own infrastructure.

## Step 8: Multi-User Setup

Open WebUI supports role-based access:

1. **Admin Panel → Users → Add User**
2. Assign roles: `Admin`, `User`, `Pending` (requires approval)
3. Enable **User approval required** for security
4. Users get isolated chat histories and document spaces

## Tip for Performance

- **M-series Mac**: Models run on the Neural Engine and ANE + GPU. A M3 Max with 48GB runs Llama 4 70B at ~15 tok/s (4-bit quantized).
- **Linux with NVIDIA GPU**: Add `OLLAMA_CUDA=1` environment variable before starting Ollama for GPU acceleration. A 4090 runs 70B models at ~25 tok/s.
- **RAM-only mode**: If you have no GPU, models run on CPU + system RAM. Expect 2-5 tok/s for 7B models — perfectly usable for chat, just not real-time.
- **Model hot-swapping**: Ollama keeps the last model in memory. Switch between models instantly once cached.

## Common Pitfalls

- **❌ Docker can't reach Ollama**: If Open WebUI shows "Connection refused", the `host.docker.internal` DNS may not work on Linux. Use `--network host` or set `OLLAMA_BASE_URL=http://$(ip route show default | awk '{print $3}'):11434`.
- **❌ Out of memory on model load**: Use smaller quantizations. Pull `llama4:8b-q4_K_M` instead of the full 8b — this uses 4-bit quantization and the model fits in 6GB RAM. Available quantizations: `q2_K`, `q3_K_M`, `q4_K_M`, `q5_K_M`, `q8_0`.
- **❌ Slow first response**: Ollama loads models on first request. After idle, models may be swapped out. Set `OLLAMA_KEEP_ALIVE=15m` environment variable to keep the model loaded for 15 minutes of inactivity.
- **❌ RAG not finding documents**: Open WebUI's default chunk size may be too small for your content. Go to Admin Settings → RAG and increase chunk size to 1500 with 300 overlap for dense documents.

## Conclusion

You now have a complete, local-first AI assistant running on your own machine with:

- Multiple models (Llama 4, DeepSeek V4, Qwen 3)
- ChatGPT-like web interface via Open WebUI
- Local RAG for your documents
- Optional private web search
- Multi-user support for your team
- **Zero data leaving your network**

The total cost was $0. No API keys, no subscriptions, no privacy concerns. For teams concerned about data sovereignty, this setup rivals cloud offerings in capability while keeping everything on-premises.

**Where to go from here:**
- Add `whisper.cpp` for local speech-to-text (Open WebUI has a voice input plugin)
- Hook up local TTS with `piper-tts` for spoken responses
- Set up Open WebUI behind an nginx reverse proxy for LAN access
- Add custom tools/function calling by extending Open WebUI's pipeline system
