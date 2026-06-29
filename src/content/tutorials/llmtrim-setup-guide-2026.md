---
title: "How to Set Up LLMTrim: Cut Your LLM API Costs by 30-70% in 5 Minutes"
date: 2026-06-30
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags: ["LLMTrim", "cost optimization", "API proxy", "Claude Code", "token compression", "LLM"]
cover: "/images/tutorials/llmtrim-setup-guide-2026/cover.png"
difficulty: beginner
meta_description: "Step-by-step guide to installing and configuring LLMTrim — a local proxy that compresses LLM API requests to reduce costs by 31% input and 74% output tokens without changing answers."
---

If you use Claude Code, Codex CLI, Cursor, or any AI coding tool heavily, you've seen the bills. Every prompt — every system message, tool definition, and build log — costs tokens. A lot of those tokens are **waste**: repeated tool schemas, verbose build output, near-identical log lines sent over and over.

**LLMTrim** is a local proxy that sits between your AI tools and the LLM provider, strips the waste, and forwards a compressed request. The model gets the same information for fewer tokens. It's open-source, runs entirely locally, and the authors report **-31% input tokens and -74% output tokens** based on 112 live A/B comparisons.

This guide walks through installation, configuration, and verification.

## Step 1: Install LLMTrim

The easiest method is npm:

```bash
npm install -g @llmtrim/cli@latest && llmtrim setup
```

If you don't have Node.js, use the shell installer:

```bash
curl -fsSL https://raw.githubusercontent.com/fkiene/llmtrim/main/install.sh | sh
```

The `setup` command configures LLMTrim as a system-level HTTPS proxy. It does two things:
1. Installs the Rust binary (one static binary, ~5MB)
2. Configures your shell to route `HTTPS_PROXY` through `http://127.0.0.1:9090`

After setup, open a **new terminal window** (or `source ~/.zshrc`).

## Step 2: Verify It's Running

```bash
llmtrim status
```

This shows a live dashboard with:

![LLMTrim Status Dashboard Showing Token Savings](/images/tutorials/llmtrim-setup-guide-2026/cover.png)

The dashboard shows:
- Total tokens trimmed so far
- Input/output savings percentage
- Dollars saved (calculated from your real provider pricing)
- Per-model breakdown of compression rates

If you see `proxy: active` and green bars, you're good.

## Step 3: Route Your AI Tools Through LLMTrim

LLMTrim works by setting the `HTTPS_PROXY` environment variable. The setup wizard handles this, but you can also set it manually:

```bash
export HTTPS_PROXY=http://127.0.0.1:9090
```

Tools that honor `HTTPS_PROXY` **work automatically**:

- **Claude Code** — automatic (uses HTTPS_PROXY)
- **Codex CLI** — automatic
- **Cursor** — go to Settings → Network → Proxy → `http://127.0.0.1:9090`
- **Aider** — automatic (uses HTTPS_PROXY)
- **Any OpenAI/Anthropic SDK** — automatic when you set the env var

**Tools that DON'T work** (pin their certificates):
- GitHub Copilot (pins CA certs)
- Some JetBrains plugin backends

> [!TIP]
> If you're using Cursor, set the proxy in Settings → Network rather than relying on HTTPS_PROXY, because Cursor sometimes ignores the environment variable.

## Step 4: Start Using Your AI Tools Normally

That's it. Use Claude Code, Codex, or Cursor as you normally would. LLMTrim intercepts every request, compresses it, sends it to the provider, and passes the reply back unchanged.

The compression happens in **~5ms per call** — you won't notice the overhead.

```bash
# Example — Claude Code now runs through LLMTrim
cd my-project
claude
# ... code as usual ...
# Every request gets auto-optimized
```

## What LLMTrim Actually Compresses

LLMTrim uses a pipeline of up to 10 "compressor stages." In auto mode, it enables each stage only where measurements show it saves tokens:

### 1. Tool Output Compression (biggest savings)

Build logs, git diffs, grep output, JSON dumps — LLMTrim's showpiece. Repetitive lines get folded into templates. For example, 58 lines of build output with 56 near-identical INFO lines become 5 lines with a range notation:

```
Before (58 lines, 4,662 chars):
  [2026-06-13T10:02:00Z] INFO  compiling module core::worker::task_0
  [2026-06-13T10:02:01Z] INFO  compiling module core::worker::task_1
  ... 55 more lines ...

After (5 lines, 978 chars, -79%):
  [{}] INFO compiling module core::worker::task_{} [×30: (10:02:00Z..10:02:29Z)]
  [2026-06-13T10:02:31Z] ERROR src/worker/pool.rs:214: mismatched types
  ... (remaining patterns) ...
```

The error lines survive **verbatim**. The model still sees what went wrong — it just costs less to send.

### 2. Cache Discipline

Stabilizes the system prompt and tool definitions so the provider's prompt caching (Anthropic/OpenAI) works more effectively. Tool schemas that don't change between turns stay cached.

### 3. Lexical Retrieval

For pasted documentation or long context: BM25+ ranking selects the chunks relevant to the current question, drops the rest.

### 4. Source Code Skeletonization

Tree-sitter AST analysis keeps function bodies that are relevant to the query, reduces everything else to signatures. Supports 14 languages.

### 5. JSON Record Array Encoding

Large JSON arrays (database dumps, API responses) get re-encoded into a compact table format (TOON encoding):

```
Before: [{"id":1,"city":"Paris","ok":true}, ...1000 rows...]
After:  [1000]{id,city,ok}: 1,Paris,true; 2,Lyon,false; ...
```

### Other Stages

- DEDUP (collapses near-duplicate lines)
- Output control (asks model for terser responses)
- Tool layer (static tool selection, trims descriptions)
- Image downscaling (to provider's resolution cap)

## Configuration Options

LLMTrim supports three modes via `~/.config/llmtrim/config.json`:

```json
{
  "mode": "auto",
  "proxy": {
    "listen": "127.0.0.1:9090",
    "providers": ["openai", "anthropic", "google-ai-studio"]
  }
}
```

- **`auto`** (default) — enables each compressor where measurements show it saves tokens
- **`safe`** — lossless stages only (template fold, TOON encoding, dedup). Zero risk of any information loss.
- **`aggressive`** — fires all stages, including lexical retrieval that may discard some context

Start with `auto`. If you're concerned about information loss, use `safe`. The difference in savings is about 15-20 percentage points.

## Measuring Your Savings

The `llmtrim status` dashboard updates in real-time. But for hard numbers:

```bash
# Show savings since install
llmtrim status --json

# Show per-provider breakdown
llmtrim status --providers

# Export detailed logs
cat ~/.llmtrim/stats.json
```

On a typical Claude Code session (2-3 hours of active use), expect:
- **Input savings**: 25-35%
- **Output savings**: 60-80%
- **Dollar savings**: ~40-50% of total API cost

## Troubleshooting

**"LLMTrim isn't intercepting my requests"**
Check HTTPS_PROXY is set: `echo $HTTPS_PROXY`. Should show `http://127.0.0.1:9090`.

**"My tool can't connect"**
Check the proxy is running: `llmtrim status`. Restart with `llmtrim start`.

**"I see errors about certificate"**
LLMTrim uses a local CA certificate. If your tool does strict cert pinning (Copilot), it won't work. For other tools, re-run `llmtrim setup`.

**"How do I disable it temporarily?"**
```bash
unset HTTPS_PROXY
# Or stop the proxy:
llmtrim stop
```

## Verdict

LLMTrim is one of those rare tools that pays for itself. If you spend $100+/month on AI coding tools, the 5-minute setup saves you $30-50/month immediately. For heavy users spending $500+ on Claude Code or Codex, the savings are substantial.

The best part: there's zero behavior change. Install it once, forget it exists, and watch your bill shrink.
