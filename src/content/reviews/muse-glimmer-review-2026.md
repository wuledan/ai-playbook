---
title: "Muse Glimmer Review 2026 — Meta's 30B Open-Weight Agentic Model for Always-On Local Agents"
date: 2026-08-11
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "Meta"
  - "Muse-Glimmer"
  - "Open-Weights"
  - "Local-AI"
  - "Agentic-AI"
  - "Tool-Calling"
  - "Apache-2.0"
  - "Ollama"
cover: /images/reviews/muse-glimmer-review-2026/cover.png
meta_description: "Meta's Muse Glimmer is a 30B Apache-2.0 open-weight model for always-on local agents: MCP Atlas 75.5, SWE-Bench Pro 51.2, a 17GB quant with 1.0% degradation, and a DFlash drafter giving 3.1x speedup on RTX 5090. Review with full benchmarks, hardware requirements, pricing, and HN community reaction."
rating: 8.0
dimensions:
  ease-of-use: 8
  features: 9
  value: 9
  performance: 7
  ecosystem: 8
pros:
  - "Truly permissive: Apache 2.0 license, open weights on Hugging Face, with GGUF quantizations from Unsloth and MLX 4-bit builds already live on day one — 683 HF likes on the main repo within hours"
  - "Agentic-first training: distilled from Muse Spark with on-policy RL across agentic domains, and it shows on MCP Atlas (75.5 vs Gemma4-31B's 54.2 and Qwen3.6-27B's 62.5), DeepSearch QA (74.6), SWE-Bench Pro (51.2) and τ³-Banking (23.5 vs 15.1/16.7)"
  - "Fits on consumer hardware: K-Quant-17GB build runs in a 24GB VRAM envelope with only 1.0% measured benchmark degradation, leaving room for KV cache, the 1.8B perception encoder, and the DFlash drafter at once"
  - "Speculative decoding is the sleeper feature: DFlash block-diffusion drafter (16-token blocks) gives 3.1x speedup on RTX 5090 (74.9 → 233.4 tok/s), 1.8x on M5 Max (26.6 → 50.2 tok/s) — measured by Meta, batch size 1, greedy"
  - "Scaffold-friendly: works with OpenClaw, Hermes Agent and other orchestration patterns, with 131K+ context, controllable reasoning strength (low/medium/high/xhigh), and interleaved text+image input via a dedicated ViT-G/14 encoder"
  - "Strong safety posture for a local model: Siren AgentDojo attack success rate 28.4% (lower than Gemma4's 25.6% is the only loss, but utility 94.2 beats both), and 'Moderate or lower' risk designations across chem/bio, cyber, and loss-of-control"
cons:
  - "Not actually open source in the strict sense: open weights only, no training data release, and regional gating on Hugging Face — 'Meta did not abandon opensource. Open weights*' as HN's gunalx/ignoramous corrected"
  - "Benchmarks are Meta's own and skimp on the details: gunalx worried the numbers 'seem competitive as long as it isn't benchmaxed,' and the headline speed table omits non-greedy, batched, or long-context scenarios"
  - "Losses where it matters for some users: OSWorld-Verified 65.9 vs Qwen3.6-27B's 75.6, TerminalBench 51.7 vs 60.7, SkillsBench 44.3 vs 46.6 — Qwen still leads GUI/terminal automation"
  - "Reputation tax: InfiniteLoup and ninjin pointed at Meta's crawling behavior ('ignoring the robots.txt, scraping everything, and incurring significant Google Maps costs for us'), which colors trust in the company's ecosystem claims"
best-for: "Developers and tinkerers who want a genuinely capable always-on local agent for tool calling, coding, and multimodal workflows on a single consumer GPU or Mac — especially those already in the Ollama / LM Studio / llama.cpp / MLX ecosystem who want open weights without an OpenAI-style cloud dependency"
price: "Free — Apache 2.0 open weights (meta-models/Muse-Glimmer-30B on Hugging Face); GGUF quants from Unsloth and mlx-community; runs via Ollama, LM Studio, llama.cpp, ExecuTorch, MLX, vLLM, SGLang"
---

## Quick Verdict

On August 10, 2026, **Meta Superintelligence Labs** released **Muse Glimmer**, a 30-billion-parameter dense model explicitly engineered for **always-on local agent workflows**. It hit **978 points and 554 comments on Hacker News** within hours — the top story of the day. The pitch: a model small enough to run on a Mac or a single consumer GPU that can still do end-to-end agentic tasks — tool calling, local coding, LLM-as-a-judge — without phoning home.

The community reaction was broadly positive but sharply framed. The praise was for the licensing and the engineering: "good to see new open weights releases from meta," wrote tosh, with jauntywundrkind calling the showing "excellent." The skepticism came in two flavors — whether the benchmarks are trustworthy ("seems competitive as long as it isn't benchmaxed," said gunalx), and whether "open weights" deserves to be called "open source" at all (ignoramous's one-word correction: "Open weights*").

**8.0.** Muse Glimmer is the most credible open-weight local agentic model in its class yet, with real benchmark wins on MCP Atlas and DeepSearch QA, honest quantization math, and a genuinely innovative speculative-decoding drafter. It loses points on the open-weights-vs-open-source debate, a couple of Qwen-led benchmark losses in GUI automation, and Meta's checkered community reputation.

## What Muse Glimmer Actually Is

Muse Glimmer is a **~29.6B dense causal transformer with a dedicated 1.8B perception encoder**, distilled from Meta's frontier **Muse Spark** teacher. The distillation recipe is the story: logit distillation in pre-training, agent-heavy long-context data with richer reasoning traces in mid-training, then SFT combined with on-policy distillation and reinforcement learning across general, reasoning, coding, and agentic domains.

Key architecture details from the model card:

| Spec | Value |
|------|-------|
| Total parameters | ~29.6B (incl. 1.8B ViT-G/14 vision encoder) |
| Hidden dim / layers | 6,656 / 52 |
| Attention pattern | [Local, Local, Local, Global] repeating, 2,048 sliding window |
| Attention heads | 32 Q / 2 KV (GQA 16:1), head dim 128 |
| FFN | SwiGLU, 19,968 intermediate |
| Position encoding | RoPE (θ = 500,000), local layers only |
| Context length | 131,072+ |
| Tokenizer | 200,000 BPE tokens + 2,048 special tokens |
| Max visual tokens/image | 4,096 |
| Modalities | Text + image in, text out |
| Knowledge cutoff | January 4, 2026 |
| License | Apache 2.0 |

It's built for eight capability axes: end-to-end agentic task completion, reliable tool use, multi-step reasoning, **failure recovery** (diagnose an error and retry rather than halt), multimodal input, scaffold compatibility, **controllable effort** (reasoning strength low → xhigh, set in the system prompt), and 100+ languages.

## Local Deployment: The Quantization Math That Actually Works

The most honest part of the release is the degradation table. A 30B model at full precision needs 55+ GB — useless on consumer hardware. Meta's quantization story:

| Build | Degradation* | Target hardware |
|-------|-------------|-----------------|
| Full precision | — | 64GB VRAM |
| K-Quant-Dynamic | 0.2% | 32GB VRAM |
| K-Quant-17GB | 1.0% | 24GB VRAM |

\*Measured as average accuracy drop across 15 common benchmarks.

The 17GB build is the headline: it fits a **24GB envelope** alongside the KV cache, the perception encoder, and the drafter. And the DFlash drafter is genuinely interesting — a small block-diffusion model that proposes **16-token blocks in a single forward pass** while the main model verifies in parallel. Meta's own measurements (batch size 1, greedy decoding):

| GPU | Baseline (tok/s) | With DFlash (tok/s) | Speedup |
|-----|------------------|---------------------|---------|
| RTX 5090 | 74.9 | 233.4 | 3.1x |
| Apple M5 Max | 26.6 | 50.2 | 1.8x |
| Apple M4 Max | 23.7 | 37.8 | 1.5x |

That 233 tok/s on a 5090 is what makes "always-on agent" plausible rather than aspirational. (M-series numbers run via ExecuTorch; the RTX number via llama.cpp.)

## Benchmarks vs. the Class

Meta compared against **Gemma4-31B** and **Qwen3.6-27B** — the two models that define this size class. Highlights from the published table (High Reasoning vs. Thinking Mode settings):

| Benchmark | Muse Glimmer | Gemma4-31B | Qwen3.6-27B |
|-----------|:---:|:---:|:---:|
| MCP Atlas (Public) | **75.5** | 54.2 | 62.5 |
| DeepSearch QA | **74.6** | 61.7 | 71.1 |
| τ³-Banking | **23.5** | 15.1 | 16.7 |
| WildClawBench | **47.6** | 37.6 | 43.2 |
| Gaia2 | **43.3** | 36.4 | 40.0 |
| SWE-Bench Pro | **51.2** | 36.9 | 50.2 |
| SWE-Bench Verified | 76.0 | 66.6 | **77.2** |
| TerminalBench 2.1 | 51.7 | 43.4 | **60.7** |
| OSWorld-Verified | 65.9 | 58.5 | **75.6** |
| SkillsBench (with skills) | 44.3 | 32.4 | **46.6** |
| SciCode | **43.6** | 43.4 | 39.8 |
| AIME 2026 | **94.7** | 89.2 | 94.1 |
| GPQA Diamond (AA) | 83.5 | **85.7** | 84.2 |
| Beam128K | **65.1** | 58.2 | 63.0 |

The pattern is clear: **Muse Glimmer wins general agentic orchestration and tool-use benchmarks** (MCP Atlas, DeepSearch, τ³-Banking, WildClaw, Gaia2), while **Qwen3.6-27B wins the GUI/terminal automation trio** (OSWorld, TerminalBench, SkillsBench) and SWE-Bench Verified by a hair. Safety-wise, Muse Glimmer's Siren AgentDojo attack success rate (28.4%) and utility (94.2) are the best balance in the trio — Qwen's 40.3% ASR with 92.7 utility is meaningfully worse, and Gemma4's 25.6% ASR comes at 90.8 utility.

## The Community Conversation

The HN thread (554 comments) split into four debates worth knowing about:

**Open weights vs. open source.** The sharpest correction came from ignoramous: "Meta did not abandon opensource. Open weights*" — no training data, no full reproducibility. dannyw pointed at NVIDIA Nemotron as the genuinely-open-data alternative: "They also have very good code and playbooks for actually doing a fine-tune, CPT, etc. Even if you're not tuning a Nemotron model, its mixes are very excellent for your replay data slice." nickludlam seconded: "I'm using Ultra remotely and Super locally, and I find them very useful for RAG-like problems."

**The timing vs. Qwen.** scrlk flagged that "Qwen3.8 27B" releases this week, making the comparison timely: "Seems like dense 30B is back in fashion?" The thread then went deep on Qwen's notorious overthinking — naasking: "Qwen finds the answer relatively quickly but then second guesses itself multiple times for another 20,000+ tokens… that's clearly overthinking." dannyw's counter-tip for Qwen users: "Try a system prompt requiring it to think in Mandarin, while still delivering the response in the user's language."

**Real-world local usage.** jermaustin1 runs Qwen3.6 35B A3B with reasoning on for a solo TTRPG with 80k context and 4-10 agents: "Each turn is about 45-60 seconds to generate all of the various responses." jakswa recommends Gemma 4 for creative DMing: "much better at holding the plotlines." The takeaway: this size class is already the daily-driver class for local agent users — Glimmer enters a crowded, opinionated field.

**The reputation tax.** InfiniteLoup: "The least they could do, after ruthlessly bombarding my employer's servers with requests, ignoring the robots.txt, scraping everything, and incurring significant Google Maps costs for us in the process." ninjin added a link to an eight-month-old complaint about the same behavior. For many HN readers, Meta's model quality isn't the question — Meta's behavior is.

## Pricing: Actually Free (Apache 2.0)

| Plan | Price | Notes |
|------|-------|-------|
| Muse Glimmer weights | **$0** | Apache 2.0, meta-models/Muse-Glimmer-30B on HF |
| GGUF quants | $0 | unsloth/Muse-Glimmer-30B-GGUF, Abiray, vmlinux ROCm builds |
| MLX builds | $0 | mlx-community 4-bit & bf16 for Apple Silicon |
| Serving | $0 self-host | llama.cpp, ExecuTorch, MLX, vLLM, SGLang; or pay-per-token via Together, Fireworks, OpenRouter |

The actual cost is hardware: a 24GB GPU (or an M4/M5 Max Mac) to run the K-Quant-17GB build comfortably. Unsloth published a "How to Run Muse Glimmer" guide with quantization analysis the same day, including a 2-bit build that "execute[s] 100+ tool calls" in Unsloth.

## Who Should Use It

**Use Muse Glimmer if:** you want a local, always-on agent for tool calling and coding on a single consumer GPU; you're in the Ollama/LM Studio/llama.cpp ecosystem and want Apache-2.0 weights with no usage caps; you need multimodal input (screenshots, charts) in a local model; or you're building agent scaffolds and want a model whose training was agentic-first.

**Skip it if:** you need "open source" in the strict sense (data included — look at Nemotron instead); you're doing heavy GUI/terminal automation where Qwen3.6-27B still leads; you're on 16GB VRAM or less (the 17GB build wants a 24GB envelope); or Meta's ecosystem behavior is a dealbreaker for you.

## Alternatives at a Glance

| Model | License | Size | Best For |
|-------|---------|------|----------|
| **Muse Glimmer** | Apache 2.0 (weights) | 30B dense | Local agentic tool-calling, MCP Atlas/DeepSearch workloads |
| **Qwen3.6-27B** | Apache 2.0 (weights) | 27B | GUI/terminal automation, OSWorld, overthinking-prone |
| **Gemma4-31B** | Gemma license | 31B | Safety balance, creative/plot-holding use cases |
| **NVIDIA Nemotron** | Open weights + partial data release | Various | Fine-tuning, CPT, RAG; genuinely open data mixes |
| **Muse Spark 1.2** | Frontier (cloud) | Large | When you need full frontier capability and have cloud budget |

## FAQ

**Is Muse Glimmer really free?** Yes — Apache 2.0 open weights, downloadable from Hugging Face. No usage caps, no API key required. Your only cost is the hardware to run it.

**What hardware do I need?** A 24GB VRAM GPU for the K-Quant-17GB build (1.0% degradation), 32GB for K-Quant-Dynamic (0.2%), 64GB for full precision. Apple M4/M5 Max Macs work via ExecuTorch/MLX.

**How fast is it?** Meta measures 233.4 tok/s on RTX 5090 with the DFlash drafter (3.1x over baseline), 50.2 tok/s on M5 Max (1.8x). Fast enough for fluid real-time agent interaction.

**Is it truly open source?** Open weights under Apache 2.0, but no training data release — which is why HN commenters insisted on "open weights*" rather than "open source."

**Does it work with OpenClaw?** Yes — Meta lists OpenClaw and Hermes Agent among compatible scaffolds, with 131K+ context and controllable reasoning strength.

**What about safety?** Meta assessed it as Moderate or lower risk on chem/bio, cyber, and loss-of-control under its AAISF framework, and its Siren AgentDojo scores (28.4% ASR, 94.2 utility) are the best balance in its class — but you should still deploy it inside a guardrailed system, not as a bare endpoint.
