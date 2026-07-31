---
title: "DeepSeek V4 Flash 0731 Review — The $0.03-per-Task Reasoning Model That Beats Its Own Pro Tier"
date: 2026-08-01
author: "AIPlaybook Editorial Team"
category: "LLM"
tags:
  - "DeepSeek"
  - "V4-Flash"
  - "LLM"
  - "Reasoning-Model"
  - "Open-Weights"
  - "MoE"
  - "API-Pricing"
  - "Benchmark"
cover: "/images/reviews/deepseek-v4-flash-0731-analysis-2026/cover.png"
meta_description: "DeepSeek V4 Flash 0731 analysis — the 284B-parameter open-weights reasoning model scores 50 on the Artificial Analysis Intelligence Index (#3 of 101) at just $0.14/$0.28 per million tokens. Benchmark breakdown, pricing table, verbosity data, and HN community reaction."
rating: 8.5
dimensions:
  ease-of-use: 8
  features: 8
  value: 10
  performance: 8
  ecosystem: 9
pros:
  - "Frontier-adjacent intelligence at commodity pricing: Intelligence Index score of 50 (rank #3 of 101 open-weights models) with a median of just 25 for comparable models"
  - "Dirt-cheap: $0.14 per 1M input tokens and $0.28 per 1M output tokens — roughly 3-8x below category medians ($0.43 input / $1.20 output)"
  - "Best-in-class cache hit pricing at $0.003 per 1M tokens (98% discount, ranked #1 of 101) — huge for agentic loops and RAG workflows with repeated context"
  - "Full open weights under MIT license with 1M-token context window and MoE efficiency (284B total / 13B active per token)"
  - "Already beats DeepSeek V4 Pro on the Intelligence Index (50 vs 44) — the flash tier out-punches its bigger sibling"
cons:
  - "Very verbose: 210M output tokens across the Intelligence Index evaluation, roughly 2x the 100M median — meaning per-task cost and latency are higher than the raw token price suggests"
  - "Text-only: no multimodal input support, which rules out vision, document-scanning, and screenshot-based workflows"
  - "Speed data still N/A on Artificial Analysis for the reasoning max-effort variant; third-party measurements show ~93 TPS on OpenRouter but provider-dependent"
  - "No API opt-out from training on your data (per HN discussion), a blocker for some enterprises"
  - "Reasoning verbosity means effective cost-per-useful-answer is higher than headline token pricing; one HN user estimated needing ~5x tokens vs GPT-5.6 Luna for equivalent results"
best-for: "Developers and startups building cost-sensitive agentic apps, RAG pipelines, and bulk classification/analysis workloads that can tolerate verbose reasoning and need open weights with a permissive license"
price: "$0.14 per 1M input tokens, $0.28 per 1M output tokens, $0.003 per 1M cache-hit tokens (DeepSeek API); MIT license, weights on Hugging Face"
---

## Quick Verdict

On July 31, 2026, DeepSeek shipped **V4 Flash 0731**, an update to its open-weights Flash line — and Artificial Analysis immediately ranked it **#3 of 101 open-weights models** on the Intelligence Index with a score of 50, ahead of DeepSeek's own V4 Pro (44) and above the category median of 25.

The headline numbers are the price: **$0.14 per million input tokens and $0.28 per million output tokens**, with a category-best cache-hit price of **$0.003 per million tokens**. On the weighted cost-per-task chart, V4 Flash 0731 lands at roughly **$0.03 per Intelligence Index task** — versus $0.05 for V4 Pro, $0.56 for Gemini 3.6 Flash, $1.86 for GPT-5.6 Sol, and $2.34 for Claude Opus 5.

At 8.5/10, this is **Gold-adjacent value**: frontier-adjacent reasoning at commodity prices. The main deductions are verbosity (2x median token output), text-only modality, and unclear training-data opt-out.

---

## What Changed in the 0731 Update

DeepSeek's July 31 release (announced via the API changelog, picked up by a 663-point HN thread) refreshed the Flash line with an updated reasoning model. Per the Artificial Analysis model page, V4 Flash 0731 (Reasoning, Max Effort) is a **284-billion-parameter Mixture-of-Experts model with 13B active parameters per token**, a **1M-token context window**, MIT-licensed weights on Hugging Face (`deepseek-ai/DeepSeek-V4-Flash-0731`), and text input/output only.

HN commenters who tested it reported noticeably better instruction following than the previous Flash iteration: *"The increase in quality Deepseek Flash just got (in my personal testing so far, it seems to have improved a lot at following instructions)."*

## Intelligence Benchmarks

The Artificial Analysis Intelligence Index v4.1 blends 9 evaluations: GDPval-AA v2, τ³-Banking, Terminal-Bench v2.1, SciCode, Humanity's Last Exam, GPQA Diamond, CritPt, AA-Omniscience, and AA-LCR.

| Model | Intelligence Index | Rank (open weights) |
|---|---|---|
| Claude Opus 5 (max) | 61 | proprietary |
| GPT-5.6 Sol (max) | 59 | proprietary |
| Kimi K3 (max) | 57 | open weights |
| Grok 4.5 (high) | 54 | proprietary |
| GLM-5.2 (max) | 51 | open weights |
| Muse Spark 1.1 (xhigh) | 51 | open weights |
| Gemini 3.6 Flash | 50 | proprietary |
| **DeepSeek V4 Flash 0731 (max)** | **50** | **#3 open weights** |
| MiniMax-M3 | 44 | open weights |
| DeepSeek V4 Pro (max) | 44 | open weights |
| gpt-oss-120b (high) | 24 | open weights |

The comparison-summary note from Artificial Analysis: *"DeepSeek V4 Flash 0731 is amongst the leading models in intelligence and well priced when comparing to other open weight models of similar size."* It scores 50 versus a median of 25 for comparable models — but it is also very verbose, generating 210M output tokens across the evaluation versus a 100M median.

## Pricing Table

| Plan | Price |
|---|---|
| Input (non-cache) | $0.14 / 1M tokens (median: $0.43) |
| Output | $0.28 / 1M tokens (median: $1.20) |
| Cache hit | $0.003 / 1M tokens (98% discount, ranked #1) |
| Blended rate (7:2:1 cache/input/output) | $0.06 / 1M tokens |
| Cost to run full Intelligence Index eval | $72.02 |

The cost-per-task chart is where the model shines: **$0.03 per Intelligence Index task** vs $0.05 (V4 Pro), $0.08 (gpt-oss-120b), $0.14 (MiniMax-M3), $0.29 (Muse Spark / GLM-5.2), $0.41 (Nemotron 3 Ultra), $0.44 (Grok 4.5), $0.56 (Gemini 3.6 Flash), $0.86 (Kimi K3), $1.86 (GPT-5.6 Sol), $2.34 (Claude Opus 5), $3.15 (Claude Fable 5). One HN commenter noted it *"already beat Luna on price/task, by about 2x"* — though the verbosity tax narrows that gap on real workloads.

## Community Reception

The HN thread (506 points) was largely enthusiastic but measured. Developers building products on it were the strongest advocates: *"I've been using v4 flash for an app I'm building and it's amazing how cost effective and good it is coming from having always used gpt, opus and sonnet models. It's so cost effective I can offer a generous free tier."*

The verbose-reasoning tax got real scrutiny. One user: *"Looking at pricing myself, it needs 5x the tokens to get the same results as GPT 5.6 Luna at a much lower TPS."* Another pointed out that *"DeepSeek Flash still doesn't support multimodal; otherwise it would offer better value than GPT 5.6 SOL."*

The main recurring complaint was training-data opt-out: *"If only they would let you opt out of training use, it might actually be a viable option."* And the "new Deepseek models are like Christmas" sentiment summed up the API crowd: *"Really big fan of low cost API models, no one does it better than DS... I'll be rocking DS flash for the entire day whilst my colleagues burn through Claude tokens within an hour."*

## Who Should Use DeepSeek V4 Flash 0731

**Good fit:** cost-sensitive startups and indie developers building agentic apps with generous free tiers; RAG pipelines where cache-hit pricing makes repeated-context workloads nearly free; bulk text classification, extraction, and analysis at scale; anyone who wants frontier-adjacent reasoning with MIT-licensed open weights.

**Skip it if:** you need vision/multimodal input, you're an enterprise that must guarantee training-data opt-out, or your latency budget can't absorb a verbose reasoning model running at ~93 TPS.

## Alternatives

- **DeepSeek V4 Pro (max)** — same family, higher ceiling expected with an announced updated version, but currently scores *below* Flash 0731 on the Index (44 vs 50) at higher prices.
- **Gemini 3.6 Flash** — comparable Index score (50), 217 output TPS (fastest in the chart), but proprietary and pricier per task ($0.56).
- **gpt-oss-120b (high)** — the open-weights budget option at $0.08/task, though at a much lower Index score (24).
- **Kimi K3 (max)** — the other frontier open-weights model (Index 57), stronger raw intelligence but $0.86/task and a 2.78T footprint that favors API use.

## FAQ

**When was DeepSeek V4 Flash 0731 released?**
July 31, 2026, via the DeepSeek API changelog and Hugging Face weights release.

**How intelligent is it?**
Score of 50 on the Artificial Analysis Intelligence Index v4.1 — #3 among open-weights models, well above the 25 median for comparable models, and above DeepSeek V4 Pro (44).

**How much does it cost?**
$0.14/1M input, $0.28/1M output, $0.003/1M cache-hit tokens via the DeepSeek API. Roughly $0.03 per Intelligence Index task.

**Is it multimodal?**
No — text input and text output only.

**Is it open source?**
Open weights under the MIT license, downloadable from Hugging Face. Commercial use is permitted.

**What's its context window and size?**
1M tokens context; 284B total parameters with 13B active per token (MoE).
