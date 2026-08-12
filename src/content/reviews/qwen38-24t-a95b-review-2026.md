---
title: "Qwen3.8-2.4T-A95B Review 2026 — The First Max-Class Open-Weight Model, Weights Released"
date: 2026-08-13
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "Qwen"
  - "Alibaba"
  - "Qwen3.8"
  - "Open-Weight"
  - "MoE"
  - "DeltaNet"
  - "LLM"
  - "Self-Hosting"
cover: /images/reviews/qwen38-24t-a95b-review-2026/cover.png
meta_description: "Qwen3.8-2.4T-A95B is the open-weight release behind Qwen3.8-Max: 2.4T total parameters with 95B activated, 512 experts, a Gated DeltaNet hybrid architecture, and a 262K native context (extendable to 1M). The first Qwen-Max-class model ever opened — and at ~5TB in BF16, one of the largest releases by parameter count. Review covers architecture, benchmark table, the FP8/quantization reality check, license terms, and the HN debate over whether it's a Kimi-K3 rival or a hobbled flagship."
rating: 8.1
dimensions:
  ease-of-use: 6
  features: 8
  value: 8
  performance: 9
  ecosystem: 7
pros:
  - "The first Qwen-Max-class open release: Terminal Bench 2.1 at 86.6 and PaperBench at 93.0 beat Opus 4.8's 84.6 and 80.3, with GPQA Diamond at 92.6 — frontier capability is now downloadable, not just API-only"
  - "Hybrid architecture is genuinely novel: 23 repeated blocks of (Gated DeltaNet → MoE) with one Gated Attention → MoE per block, 512 experts with 10 routed + 1 shared activated, and multi-token prediction (MTP) trained in"
  - "95B active parameters out of 2.4T total means per-token compute is comparable to much smaller models; unsloth's 1-bit quant lands at 397GB with the 95B active MoE preserved"
  - "reasoning_effort is officially supported (xhigh / medium / low), and preserve_thinking retains reasoning context from historical messages — first-class agent-harness controls"
  - "262,144-token native context, extensible to ~1,010,000 tokens; the open card supports vLLM, SGLang, and TokenSpeed out of the box"
  - "Community momentum is real: 465 likes and 978 downloads within hours, with unsloth quant guides and llama.cpp conversion discussion already live"
cons:
  - "~5TB in BF16 and ~2.5TB in FP8 — this is not a self-hostable model for normal hardware; even the 1-bit quant (397GB) needs a serious machine, and HN users joke about running it on an Intel N100"
  - "No QAT: released in BF16/FP8 only, so community quantization with calibration data is required to approach Kimi-K3's 1.5TB 4-bit footprint — harder to serve than K3 at launch"
  - "Capability compromises vs the API version: open weights lack vision input, lack non-thinking mode, and ship with 262K (not 1M) default context; Qwen3.8-Max the API adds vision, tools, and 1M context"
  - "License is 'other' (qwen3.8-max custom terms), not MIT — several HN users explicitly asked 'when will we see MIT Qwen again?'"
  - "Benchmark skepticism: 'the card looks almost too good to be true,' and comparing a 1-bit quant to the full model is misleading"
  - "Vocabulary is padded to 248,320 tokens — larger than Kimi-K3 (~164K), DeepSeek-V4 (~129K), and GLM-5.2 (~155K), which raises tokenizer-efficiency questions"
best-for: "Teams with serious GPU infrastructure (or cloud rental) who want frontier open weights with 1M-scale context for agentic workloads — or anyone waiting for the Qwen3.8-27B variant due Friday for local use"
price: "Free (open weights); BF16 ~5TB / FP8 ~2.5TB storage; Qwen3.8-Max API from $2/$6 per 1M tokens (Qwen Cloud)"
---

# Qwen3.8-2.4T-A95B Review 2026 — The First Max-Class Open-Weight Model, Weights Released

## Quick Verdict

Qwen3.8-2.4T-A95B is the open-weight release behind Qwen3.8-Max, published to Hugging Face on August 12, 2026 — the largest open release in Qwen history and, at 2.4T total parameters, one of the biggest open-weight releases by parameter count ever. It uses a **Gated DeltaNet + MoE hybrid architecture** with **512 experts (10 routed + 1 shared activated)**, **92 layers**, and **95B active parameters**. Native context is **262,144 tokens**, extendable to ~1M.

The headline: **frontier capability is now downloadable.** The open card scores 86.6 on Terminal Bench 2.1 and 93.0 on PaperBench — ahead of Opus 4.8 on both. The reality check: **~5TB of BF16 weights** means only well-resourced teams can actually run it, and the open version deliberately omits vision, non-thinking mode, and the 1M default context that the API-based Qwen3.8-Max offers.

**Rating: 8.1/10** — historically significant and genuinely frontier, but a "hobbled flagship" for most users until the 27B variant (due Friday) and community quants mature.

## The Release Context

Following Qwen3.5 and Qwen3.6, Qwen3.8 is the "most capable generation in the Qwen open-model family to date" — and for the first time, a Qwen-Max-class model gets an open release. The HN thread (443 points) appeared the same day DeepSeek V4 Pro 0813 went GA and Grok 4.6 launched, making August 12, 2026 a three-way frontier release day.

Two files are on Hugging Face: the BF16 card (`Qwen3.8-2.4T-A95B`, ~5TB) and an FP8 card (`Qwen3.8-2.4T-A95B-FP8`, ~2.5TB). 213 safetensors shards in the BF16 release.

## Architecture Deep Dive

The card's structure is the most interesting part of the release:

- **Hidden dimension:** 8192
- **Token embedding:** 248,320 (padded)
- **Layers:** 92
- **Hidden layout:** 23 × (3 × (Gated DeltaNet → MoE) → 1 × (Gated Attention → MoE))
- **Gated DeltaNet:** 128 linear-attention heads (V) + 16 (QK), head dim 128
- **Gated Attention:** 64 Q heads / 4 KV heads, head dim 256, RoPE dim 64
- **Mixture of Experts:** 512 experts, 10 routed + 1 shared activated, expert intermediate dim 2048
- **MTP:** multi-token prediction, trained with multiple steps

The DeltaNet hybrid is the architectural signature — gated linear attention replaces full attention in most blocks, with sparse gated attention kept for the parts that need it. That's the same research lineage as the Qwen3.5 series, scaled to Max-class size. Config confirms: `Qwen3_5MoeForCausalLM`, `qwen3_5_moe_text` model type, 92 layers, 10 experts per token.

## Benchmark Table (vs the Frontier)

| Benchmark | Opus 4.8 | Fable 5 | GPT 5.6 Sol (max) | Qwen3.7-Max | **Qwen3.8-Max** |
|---|---|---|---|---|---|
| Terminal Bench 2.1 | 84.6 | 84.6 | 88.8 | 74.5 | **86.6** |
| SWE-bench Pro | 69.2 | 80.0 | 64.6 | 60.6 | **67.7** |
| DeepSWE 1.1 | 59.0 | 70.0 | 73.0 | 21.6 | **56.6** |
| PaperBench | 80.3 | 88.8 | 90.5 | 64.8 | **93.0** |
| AndroidBench | 69.8 | 84.5 | 74.0 | 56.5 | **75.1** |
| QwenSWEBench | 84.0 | 86.3 | 73.5 | 63.4 | **80.7** |
| QwenSVGBench | 1648 | 1690 | 1758 | 1499 | **1713** |
| CoWorkBench | 72.3 | 75.9 | 71.5 | 64.6 | **74.8** |
| Automation-Bench (Pass@1) | 27.2 | 29.1 | 29.7 | 14.2 | **27.3** |
| Toolathlon Verified | 76.2 | 77.9 | 74.9 | 49.7 | **72.5** |
| HLE w/ tools | 57.9 | 64.5 | 58.0 | 53.5 | **56.2** |
| GPQA Diamond | 92.0 | 92.6 | 94.1 | 92.4 | **92.6** |

Pattern: Qwen3.8-Max wins outright on PaperBench (93.0) and Terminal Bench 2.1 (86.6), and holds its own on GPQA Diamond (92.6) — but trails Fable 5 clearly on SWE-bench Pro (67.7 vs 80.0), DeepSWE (56.6 vs 70.0), and HLE w/ tools (56.2 vs 64.5). It's a research-and-terminal agent powerhouse with softer software-engineering and hard-knowledge edges.

## The Honest Reality Check: Size and Serving

The HN thread's most practical comments:

- "A ~5TB model." (top comment, on the BF16 card)
- "Supposedly this is a Kimi-K3 rival. Bit of a chonker, especially since they only released bf16 and fp8. So at launch this will be harder to serve than K3. No QAT on q4 means someone with deep pockets will have to quant it, with plenty of calibration data. Should bring it ~1.3TB, so around K3 size."
- "The 1-bit quant model is at an astonishing 397GB with 95B active per MoE. This literally puts Opus 4.5 performance level into a machine a normal person could buy" — countered by "to compare a 1-bit quant to the full fat model is misleading."
- "Maybe 4 Strix Halo / DGX Spark, and then at 1-bit quant? Nah. Use the right sized model for your hardware."
- "Opus 4.5-level performance is also accessible with deepseek-v4-flash-0731... 2x RTX Pro 6000 Blackwell can run it."

The practical route for most people: **wait for Qwen3.8-27B, announced for Friday** ("That's the size that I can run locally"), or rent serving through DigitalOcean/Fireworks/OpenRouter. An RTX 5090 with 64GB RAM cannot touch 2.4T-A95B.

## Capability Trade-Offs vs Qwen3.8-Max API

The open weights are a deliberately reduced version:

- ❌ No vision input (the API version has it)
- ❌ No non-thinking mode (open card is thinking-mode only)
- ❌ 262K native context instead of 1M default
- ❌ No official built-in tools

HN reaction was sharp: "Read the room, Qwen. It's not a good time to hobble your releases." Counterpoint from the thread: "People have had surprising success adding vision to open-weight LLMs that ship without it, like DSV4 Flash or GLM-5.2. Given this model is already vision-trained, I expect that approach will work well here."

## License and Ecosystem

License is `other` with name `qwen3.8-max` (custom terms, license_link to LICENSE). Community consensus is it's "pretty similar to K3 with some restrictions." The recurring ask in the thread: "when will we see MIT Qwen again?"

Supported serving: vLLM, SGLang, TokenSpeed. Unsloth already published a quant guide (`unsloth.ai/docs/models/qwen3.8`). Qwen Cloud serves the full Max experience.

## Who Should Use It

**Use it if:** you have multi-GPU infrastructure or cloud budget and want frontier open weights with 1M-scale context; you're researching hybrid DeltaNet architectures; you want to post-train or quantize a Max-class base yourself.

**Skip it if:** you need vision, you're on consumer hardware, or you need MIT-style licensing. For local use, wait for Qwen3.8-27B on Friday.

## FAQ

**Is Qwen3.8-2.4T-A95B the largest open-weight model ever?**
By parameter count it's 2.4T — but Kimi-K3 is 2.8T total (~1.5TB weights with QAT 4-bit), so K3 holds the size record. This is the largest Qwen release, and the largest BF16 open release in recent memory at ~5TB.

**Can I run it locally?**
Not realistically on consumer hardware. BF16 is ~5TB, FP8 ~2.5TB, and even the 1-bit quant is 397GB. The HN consensus: 4x Strix Halo or DGX Spark class machines at minimum.

**Why no vision in the open version?**
Qwen ships the vision-enabled, 1M-context, tool-enabled experience as the Qwen3.8-Max API product (Qwen Cloud). The open card is the text/thinking core. Community projects have added vision to similar open cards via LoRA.

**What is the DeltaNet hybrid?**
Most layers use Gated DeltaNet linear attention (128 V heads) with a sparse Gated Attention block (64 Q / 4 KV heads) per 3-layer group — a hybrid that cuts KV-cache cost while keeping recall quality.

**When is the small version coming?**
Qwen3.8-27B is announced for Friday (per multiple HN comments); that's the size most local users are waiting for, comparable to Qwen3.6-27B-class serving on a 5090/3090.

**What does reasoning_effort do?**
It controls reasoning depth: xhigh (default), medium, or low — letting you trade quality for cost/latency per request, plus `preserve_thinking` to keep reasoning context across agent turns.

## Rating Breakdown

- **Ease of Use: 6/10** — serving a 5TB model is a serious infrastructure project; no vision, no non-thinking mode
- **Features: 8/10** — hybrid architecture, MTP, reasoning_effort, 262K context; missing vision/tools vs the API
- **Value: 8/10** — free weights and genuinely frontier PaperBench/Terminal Bench scores, but hardware cost is enormous
- **Performance: 9/10** — wins PaperBench (93.0) and Terminal Bench (86.6) outright; softer on SWE-bench and HLE
- **Ecosystem: 7/10** — vLLM/SGLang/TokenSpeed support, unsloth guides, community quants incoming; license is not MIT
