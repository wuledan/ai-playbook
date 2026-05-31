---
title: "How to Set Up a Local AI Code Assistant with Continue.dev and Ollama 2026"
date: 2026-05-31
author: "AIPlaybook Editorial Team"
category: "Coding"
tags: [continue-dev, ollama, vs-code, local-ai, code-assistant, rag, codebase-indexing]
cover: "/images/tutorials/continue-ollama-local-ai/cover.png"
difficulty: intermediate
meta_description: "Set up a fully local AI code assistant using Continue.dev with Ollama — VS Code integration, model management, custom context providers, and codebase RAG."
---

## Overview

Cloud-based AI code assistants like GitHub Copilot and Cursor are powerful — but they send your code to external servers, require ongoing subscriptions, and stop working offline. For developers who work with sensitive code, need offline capability, or simply want to avoid monthly fees, a **local AI code assistant** is the answer.

This tutorial combines two open-source tools to create a fully local coding assistant:

- **Continue.dev** — An open-source AI code assistant for VS Code and JetBrains. It provides inline completions, chat, and code editing with a plugin architecture for custom providers.
- **Ollama** — A local LLM runner that makes it dead simple to download and run models like DeepSeek Coder, Qwen, CodeGemma, and Llama on your own hardware.

By the end of this tutorial, you'll have:

- VS Code integration with AI chat, inline completions, and code editing
- A local LLM running entirely on your machine (no internet needed)
- Custom context providers that understand your project structure and documentation
- Codebase indexing for Retrieval-Augmented Generation (RAG) — ask questions about your entire codebase
- Optimized configuration for speed and quality on consumer hardware

**Who this is for:** Developers who want local, private AI code assistance. Some familiarity with VS Code extensions and terminal commands is helpful.

## Prerequisites

- **VS Code** (1.85+) — The code editor (free, from code.visualstudio.com)
- **Ollama** — Local LLM runner (free, from ollama.com)
- At least **16GB RAM** (32GB recommended for 7B+ parameter models)
- A **GPU with 6GB+ VRAM** for decent speed on 7B models (CPU-only works but is slower)
- **50GB free disk space** for model storage (models are 4-16GB each)

## Step-by-Step Guide

### Step 1: Install Ollama

Ollama is the simplest way to run LLMs locally. It handles model downloads, GPU acceleration, and API serving.

**Install on macOS:**
```bash
# Download from ollama.com or use Homebrew
brew install ollama
```

**Install on Linux:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Install on Windows:**
Download the installer from [ollama.com/download](https://ollama.com/download) and run it.

**Verify installation:**
```bash
ollama --version
# Should output something like: ollama version 0.5.x
```

**Start the Ollama server (runs in background):**
```bash
ollama serve
# Ollama is now running at http://localhost:11434
```

### Step 2: Download a Code-Tuned Model

Ollama supports dozens of models. For code assistance, you want a model specifically fine-tuned for programming tasks.

**Recommended models (sorted by quality/speed tradeoff):**

| Model | Parameters | RAM Needed | Speed | Quality |
|-------|-----------|------------|-------|---------|
| `qwen2.5-coder:7b` | 7B | 8GB | Fast | Good |
| `qwen2.5-coder:14b` | 14B | 16GB | Medium | Very Good |
| `deepseek-coder-v2:16b` | 16B | 16GB | Medium | Excellent |
| `codegemma:7b` | 7B | 8GB | Fast | Good |
| `phi-4:14b` | 14B | 12GB | Medium | Very Good |
| `llama-4-scout:17b` | 17B | 20GB | Slow | Excellent |

**Download the recommended starting model:**
```bash
# Start with Qwen 2.5 Coder 7B
ollama pull qwen2.5-coder:7b

# This downloads ~4.5GB. Grab a coffee.
```

**Test the model works:**
```bash
ollama run qwen2.5-coder:7b
# Type a prompt: Write a Python function that checks if a string is a palindrome
# Ctrl+D or /bye to exit
```

**If you have 16GB+ RAM,** also download a larger model:
```bash
ollama pull deepseek-coder-v2:16b
```

You can switch between models in Continue.dev without reconfiguring everything.

### Step 3: Install Continue.dev in VS Code

1. Open VS Code
2. Go to Extensions (Cmd+Shift+X or Ctrl+Shift+X)
3. Search for **"Continue"**
4. Install the extension by "Continue Dev" (official, verified publisher)
5. After installation, you'll see the Continue icon in the activity bar (left sidebar)

**First launch:**
1. Click the Continue icon to open the sidebar
2. Continue will prompt you to configure a model provider
3. Select **"Ollama"** as the provider
4. It auto-detects your running Ollama server at localhost:11434
5. Select the model you downloaded: `qwen2.5-coder:7b`

**Test the setup:**
- Open any code file in your project
- Highlight some code and press `Cmd+I` (or `Ctrl+I`)
- Ask: "Explain this code"
- You should see a response within 5-15 seconds (depending on your hardware)

### Step 4: Configure Continue for Optimal Performance

For the best experience, create or edit the Continue configuration file at:

**macOS/Linux:** `~/.continue/config.json`
**Windows:** `%USERPROFILE%\.continue\config.json`

Here's an optimized configuration for local models:

```json
{
  "models": [
    {
      "title": "Qwen 2.5 Coder",
      "provider": "ollama",
      "model": "qwen2.5-coder:7b",
      "contextLength": 8192,
      "completionOptions": {
        "temperature": 0.2,
        "topP": 0.9,
        "maxTokens": 2048
      }
    },
    {
      "title": "DeepSeek Coder V2",
      "provider": "ollama",
      "model": "deepseek-coder-v2:16b",
      "contextLength": 16384,
      "completionOptions": {
        "temperature": 0.1,
        "topP": 0.85,
        "maxTokens": 4096
      }
    }
  ],
  "tabAutocompleteModel": {
    "title": "Qwen 2.5 Coder (Autocomplete)",
    "provider": "ollama",
    "model": "qwen2.5-coder:7b",
    "contextLength": 2048,
    "completionOptions": {
      "temperature": 0.01
    }
  },
  "contextProviders": [
    {
      "name": "codebase",
      "params": {
        "indexed": true
      }
    },
    {
      "name": "docs",
      "params": {}
    },
    {
      "name": "file",
      "params": {}
    },
    {
      "name": "folder",
      "params": {}
    },
    {
      "name": "terminal",
      "params": {}
    },
    {
      "name": "problems",
      "params": {}
    }
  ]
}
```

**Key configuration elements explained:**

- **`models` array** — You can define multiple models and switch between them in the Continue sidebar. Use the fast model for inline completions and the powerful model for complex tasks.
- **`tabAutocompleteModel`** — This powers the inline code completions (like Copilot tab-to-complete). Lower temperature (0.01) makes completions more deterministic.
- **`contextLength`** — How many tokens the model can see. 8K is safe for 7B models; 16K+ for larger models.
- **`temperature`** — 0.1-0.2 for code generation (precise), 0.5-0.7 for brainstorming/discussion.
- **`contextProviders`** — These give Continue additional information to include in prompts. More on this in Step 6.

### Step 5: Enable and Tune Inline Autocomplete

Continue's inline autocomplete is the feature most comparable to GitHub Copilot. It suggests completions as you type.

**Enable autocomplete:**
1. Open Command Palette (Cmd+Shift+P)
2. Type: "Continue: Toggle Autocomplete"
3. A notification should confirm it's enabled

**Tune autocomplete settings:**

Add to your `config.json`:

```json
{
  "tabAutocompleteOptions": {
    "debounceMs": 250,
    "maxSuffixPercentage": 0.3,
    "multilineCompletions": "always",
    "useSimilarFiles": true,
    "template": "default",
    "disableInFiles": ["*.md", "*.txt", "*.json"],
    "maxPromptTokens": 1500
  }
}
```

**Performance tips for autocomplete:**
- **`debounceMs: 250`** — Wait 250ms after the last keystroke before requesting a completion. Lower values feel faster but use more GPU.
- **`multilineCompletions: "always"`** — Show multi-line suggestions for whole function bodies.
- **`useSimilarFiles: true`** — Include content from similar files in your project for better context.
- **`disableInFiles`** — Skip autocomplete for non-code files to save resources.

Note: Local autocomplete is slower than cloud services (300-800ms vs 100-200ms for Copilot). The 7B models work well for this; 14B+ models may feel sluggish for inline completions.

### Step 6: Set Up Context Providers for RAG

Continue's context providers are what make it truly useful beyond basic autocomplete. They inject relevant context from your project into every AI prompt.

**Codebase Indexing (RAG):**

This is the most powerful feature. Continue indexes your entire codebase into a local vector database using embeddings. When you ask a question, it finds the most relevant files and includes them in the context.

1. Enable codebase indexing in config.json (already done above with `"indexed": true`)
2. Open Continue sidebar
3. Click the **"@"** icon in the chat input and select `@codebase`
4. Ask: `@codebase How does the authentication flow work?`
5. Continue searches your indexed codebase, finds relevant files, and includes them in the prompt

**First-time indexing:**
```bash
# Continue auto-indexes in the background after installation
# For large projects, this may take 2-10 minutes
# You can check progress in Continue → status bar
# Typical project (10K files) indexes in about 3-5 minutes on modern hardware
```

**Docs provider:**

Add documentation for frameworks you use:

```json
"docs": [
  {
    "title": "React",
    "startUrl": "https://react.dev/learn"
  },
  {
    "title": "Next.js",
    "startUrl": "https://nextjs.org/docs"
  },
  {
    "title": "Tailwind CSS",
    "startUrl": "https://tailwindcss.com/docs"
  }
]
```

Now you can type `@docs React` in the Continue chat and ask questions about React patterns — Continue retrieves relevant documentation snippets.

**Custom context providers:**

You can write custom context providers in TypeScript. For example, a provider that always includes your team's style guide:

```typescript
// ~/.continue/context-providers/style-guide.ts
import { ContextProvider } from "continue";

class StyleGuideProvider extends ContextProvider {
  description = "Includes your team's coding style guide";
  async getContextItems(query: string): Promise<ContextItem[]> {
    const styleGuide = fs.readFileSync("./STYLE_GUIDE.md", "utf8");
    return [{
      name: "Style Guide",
      description: "Team coding conventions",
      content: styleGuide
    }];
  }
}
```

### Step 7: Use Chat Mode Effectively

With Continue's chat, you can ask questions, edit code, and get explanations — all within VS Code.

**Chat commands:**

| Action | Shortcut | Description |
|--------|----------|-------------|
| Open chat | Cmd+Shift+I (Mac) / Ctrl+Shift+I (Windows) | Open Continue sidebar |
| Inline chat | Cmd+I | Chat over selected code |
| Generate code | ```` Write a function to... ```` | Generate code from description |
| Edit code | ```` Change this to use async/await ```` | Edit highlighted code |
| Explain | ```` Explain this code ```` | Get explanation of selected code |
| Fix | ```` Fix this bug ```` | Debug selected code |
| Inline edit | Cmd+Shift+E | Open inline editor for code modification |

**Chat best practices:**

1. **Use `@codebase` for broad questions** — "How are errors handled throughout the app?"
2. **Use `@file` for file-specific context** — "What does this function do?"
3. **Use `@folder` for module-level understanding** — "Explain the folder structure"
4. **Use `@terminal` for build/debug issues** — "What does this error mean?"

**Quick edit workflow:**
1. Highlight the code you want to change
2. Press `Cmd+Shift+E`
3. Describe the change: "Add input validation for email and password fields"
4. Review the diff
5. Click "Accept" or modify further

### Step 8: Performance Optimization

Local models are limited by your hardware. Here are real-world benchmarks and optimization tips:

**Benchmarks (Apple Silicon M2 Pro, 32GB):**

| Model | RAM Usage | First Response | Inline Completion |
|-------|-----------|----------------|--------------------|
| qwen2.5-coder:7b (Q4) | 5GB | 2-4s | 300-500ms |
| deepseek-coder-v2:16b | 12GB | 5-10s | 800-1500ms |
| phi-4:14b (Q4) | 9GB | 4-8s | 600-1000ms |

**Optimization tips:**

1. **Use quantized models** — Ollama defaults to Q4_K_M quantization, which balances quality and speed. If you're RAM-constrained, try Q3_K_S (smaller, slightly worse quality):
   ```bash
   # Install specific quantization
   ollama pull qwen2.5-coder:7b-q3_K_S
   ```

2. **GPU acceleration check:**
   ```bash
   # On macOS (Metal): should work automatically
   # On Linux (NVIDIA): install CUDA toolkit
   # On Linux (AMD): install ROCm
   ollama ps  # Shows which models are loaded and GPU usage
   ```

3. **Offload to GPU (Linux NVIDIA):**
   ```bash
   # Set GPU layers offload
   export OLLAMA_GPU_LAYERS=35
   ollama run qwen2.5-coder:7b
   ```

4. **Keep models warm** — The first prompt to Ollama is slow (model loading). After the first use, subsequent requests are faster because the model stays in VRAM:

```bash
# Keep model in memory by running a dummy prompt
ollama run qwen2.5-coder:7b "1+1="
# Now it's loaded for fast subsequent use
```

5. **Reduce context length** for autocomplete. The smaller the context, the faster the inference:
```json
// In config.json for autocomplete model
"contextLength": 2048  // vs 8192 for chat
```

## Troubleshooting

### Continue can't connect to Ollama

Make sure Ollama is running:
```bash
ollama serve  # Start the server if not running
curl http://localhost:11434/api/tags  # Should return model list
```

If you changed Ollama's port, update Continue's config:
```json
"models": [{
  "provider": "ollama",
  "model": "qwen2.5-coder:7b",
  "url": "http://localhost:11434/v1"
}]
```

### Very slow responses

- Check if you're running on CPU only: `ollama ps` should show GPU usage
- Try a smaller model: `ollama pull qwen2.5-coder:1.5b` (1.5B, 1GB RAM)
- Close other applications to free RAM
- Check Ollama logs: `OLLAMA_DEBUG=1 ollama serve`

### Autocomplete not appearing

- Toggle autocomplete: Cmd+Shift+P → "Continue: Toggle Autocomplete"
- Check that `tabAutocompleteModel` is configured in config.json
- Make sure you're in a supported file type (.py, .js, .ts, .rs, .go, .java, etc.)
- Try restarting VS Code after install

### Codebase indexing stuck

- Check ~/.continue/index directory size
- Restart VS Code to trigger re-indexing
- For very large projects, exclude node_modules and build directories:
```json
"tabAutocompleteOptions": {
  "disableInFiles": ["**/node_modules/**", "**/dist/**", "**/.git/**"]
}
```

### Out of memory errors

- Use smaller models (7B instead of 14B+)
- Reduce context length: `"contextLength": 4096`
- Enable memory swapping in Ollama: `OLLAMA_KEEP_ALIVE=30m ollama serve`
- Consider cloud fallback for complex tasks (see "Advanced" section)

## Next Steps / Advanced

1. **Multi-model setup** — Configure Continue with multiple models: use the fast local model for autocomplete and inline edits, and a cloud model (via API) for complex refactoring and codebase-wide questions. Add to config.json:

```json
{
  "models": [
    {
      "title": "Qwen 2.5 Coder (Local)",
      "provider": "ollama",
      "model": "qwen2.5-coder:7b"
    },
    {
      "title": "Claude Sonnet 4 (Cloud)",
      "provider": "anthropic",
      "model": "claude-sonnet-4-20250514",
      "apiKey": "sk-ant-..."
    }
  ]
}
```

2. **Custom slash commands** — Add commands for common tasks:
```json
"slashCommands": [
  {
    "name": "test",
    "description": "Write unit tests for selected code",
    "prompt": "Write comprehensive unit tests for the selected code. Use the project's test framework."
  },
  {
    "name": "review",
    "description": "Code review the selected code",
    "prompt": "Review the selected code for bugs, security issues, and style problems."
  }
]
```

3. **Continue + Aider integration** — Use Continue for chat-based editing and Aider for complex git-aware refactoring. The two complement each other: Continue is great for quick questions and inline edits, while Aider excels at multi-file changes.

4. **Personal knowledge base** — Integrate docs for your specific stack. Add your team's internal documentation as a docs provider to make Continue an expert on your codebase conventions.

## FAQ

### Is this completely free?

Yes. Both Continue.dev (Apache 2.0 license) and Ollama (MIT license) are free and open-source. You pay nothing for software, and the models are free to download. Your only cost is electricity.

### How does quality compare to GitHub Copilot?

For basic autocomplete, Copilot is faster and smoother because it runs on cloud GPUs. For complex coding tasks (refactoring, debugging, explaining), a good local model like DeepSeek Coder V2 or Qwen 2.5 Coder 14B is comparable to Copilot on quality. The tradeoff: speed vs. privacy and zero subscription cost.

### Can I use this with JetBrains IDEs?

Yes. Continue.dev has a JetBrains plugin as well. Install it from the JetBrains Marketplace. Configuration is similar to VS Code.

### Will this work on a laptop?

Yes, with limitations. A 7B model runs well on any Apple Silicon Mac with 16GB RAM or any laptop with a dedicated GPU (6GB+ VRAM). On integrated graphics or 8GB RAM, use the smallest models like Qwen 2.5 Coder 1.5B or CodeGemma 2B.
