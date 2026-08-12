---
title: "DeepSeek V4 Pro 0813 Review — GA Release, Fable-Class Benchmarks at 1/20 the Price"
date: 2026-08-13
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "DeepSeek"
  - "V4-Pro"
  - "LLM"
  - "MoE"
  - "Open-Weight"
  - "Pricing"
  - "Benchmarks"
  - "Agentic-AI"
cover: /images/reviews/deepseek-v4-pro-0813-review-2026/cover.png
meta_description: "DeepSeek V4 Pro 0813 is the GA release of DeepSeek's 1.6T-parameter MoE flagship: $0.435/$0.87 per 1M tokens, 1M context, and Fable-class benchmark averages at roughly 1/20 the cost of Anthropic Opus 4.8. Review covers the full benchmark table from the HN thread, cache-read economics that push effective agentic cost down ~60x, the same-day timing battle with Qwen3.8-2.4T, and community verdicts on privacy and adoption momentum."
rating: 8.3
dimensions:
  ease-of-use: 8
  features: 8
  value: 9
  performance: 9
  ecosystem: 8
pros:
  - "Fable-class geometric mean on the benchmark suite: 62.5 average across HLE w/ tools, Terminal Bench 2.1, Cybergym, DeepSWE, Toolathlon, AutomationBench and DSBench — versus 64.5 for Fable 5 (w/ fallback), 64.0 for Opus 5, and 65.5 for GPT-5.6 Sol, at a fraction of their per-token prices"
  - "Aggressive cache-read pricing is the real unlock: at $0.003625 per 1M cached input tokens, agentic coding workloads with a typical 750-in / 290-out / 82k-cached token split cost roughly $0.000875 per request — about 60x cheaper than comparable frontier usage when cache hits dominate"
  - "1M-token context window matches the V4 family's long-context story, and 0813 is the GA stamp on the V4 Pro line that was in preview since mid-2026"
  - "Open weights remain the family trait: HN commenters note you can rent GPUs or run the full unquantized model on 2x DGX Spark for about $8,000 — impossible with Sol or Fable"
  - "Strong single-benchmark wins: Terminal Bench 2.1 at 87.9 (vs 88.0 for Fable 5), Cybergym 83.3 (vs 83.1), AutomationBench Public 31.8 (vs 29.1) — not just competitive, ahead in security and automation niches"
  - "Official API has excellent caching behavior, and the same-day release timing reads as deliberate competition with Qwen's open-weight launch"
cons:
  - "Not top-of-the-line: geometric mean 62.5 trails GPT-5.6 Sol (65.5) and Fable 5 (64.5); DeepSWE 62.7 vs Fable's 70.0 and Toolathlon 74.1 vs 77.9 show real gaps in the hardest agentic benchmarks"
  - "No vision input — multiple HN users hit this wall when testing it as a full Claude replacement for coding workflows"
  - "Privacy policy is unusually permissive about training on your prompts and completions, which is a hard block for regulated enterprises"
  - "DeepSeek is raising prices from today; V4 Flash 0731 still looks like the value sweet spot for many users"
  - "Benchmark skepticism persists: some commenters argue HLE-without-tools tracks real-world performance better, and 'benchmark racing' makes every new card suspect"
best-for: "High-volume agentic coding and automation workloads where cache-heavy request patterns make the effective cost dramatically lower than list price"
price: "$0.435 / $0.87 per 1M tokens (input/output); cached input $0.003625 per 1M"
---

# DeepSeek V4 Pro 0813 Review — GA Release, Fable-Class Benchmarks at 1/20 the Price

## Quick Verdict

DeepSeek V4 Pro 0813 is the GA (general availability) release of the V4 Pro line, stamped on August 12, 2026 — the same day Qwen dropped open weights for Qwen3.8-2.4T and xAI shipped Grok 4.6. It is a large-scale mixture-of-experts model from DeepSeek, priced at **$0.435 per 1M input tokens and $0.87 per 1M output tokens** with a **1M-token context window**. Independent benchmark averages collected in the HN thread put it at **Fable-class level** — a 62.5 geometric mean versus 64.5 for Fable 5 and 65.5 for GPT-5.6 Sol — at roughly **1/20 the cost** of Anthropic's Opus 4.8 per token. If you run cache-heavy agentic workloads, the effective cost is closer to 60x cheaper. This is the best price-to-performance flagship release of the quarter, with two real caveats: no vision, and a privacy policy that trains on your data.

**Rating: 8.3/10** — best-in-class value, genuine Fable-adjacent capability, but not the smartest model on the market.

## What Changed in 0813

The V4 Pro line existed in preview since mid-2026. The 0813 stamp is the GA release, and it lands with three notable shifts:

1. **Official benchmark numbers** — DeepSeek published its own evaluation table via its WeChat channel, sitting "about Fable 5 level" per the LocalLLaMA thread that surfaced them.
2. **Price increase** — DeepSeek raised prices starting August 13; the OpenRouter listing still shows the same figures, so the increase appears to apply to the official API first.
3. **Same-day timing** — released the same day as Qwen3.8-2.4T weights and Grok 4.6. HN users immediately read this as "taking the wind out of Qwen's sails."

## Benchmark Table (Community-Collected, HN Thread)

The most complete table comes from an HN comment comparing DS-V4-Pro-0813 against the field:

| Benchmark | DS-V4-Pro 0813 | Fable 5 (w/ fallback) | GPT-5.6 Sol |
|---|---|---|---|
| HLE w/ tools | 60.0 | 63.0 | — |
| Terminal Bench 2.1 | 87.9 | 88.0 | — |
| Cybergym | 83.3 | 83.1 | — |
| DeepSWE | 62.7 | 70.0 | — |
| Toolathlon-Verified | 74.1 | 77.9 | — |
| AutomationBench (Public) | 31.8 | 29.1 | — |
| DSBench-FullStack | 71.1 | 77.2 | — |
| **Geometric mean** | **62.5** | **64.5** | **65.5** |

For context, the same geometric-mean calculation gives Kimi-K3 62.3, DS-V4-Flash 0731 55.8, and GLM-5.2 47.3. The headline: 0813 is a Fable-class model, narrowly behind Fable and Sol on aggregate, but ahead on security benchmarks (Cybergym) and automation (AutomationBench Public).

## Pricing and the Cache-Read Economics

List price is $0.435 / $0.87 per 1M tokens. The real story is cache reads: **$0.003625 per 1M cached input tokens**.

HN user calculations with OpenCode's publicly published token-split data (typical agentic coding request: 750 input, 290 output, 82k cached) show:

- V4 Pro 0813 cost per request: **~$0.000875**
- That's roughly **60x cheaper** than comparable frontier usage when the cache-hit ratio holds

This changes the math for agent loops. A model that re-reads the same context across dozens of turns (codebase state, system prompts, tool schemas) pays pennies instead of dollars. Multiple HN users confirmed the official API's caching is excellent, with one reporting "my credits balance barely moves even at max setting."

For local deployment: the full unquantized model runs on 2x DGX Spark (~$8,000 hardware) at full 1M context with decent speeds, per a community-run guide linked in the thread.

## Community Verdicts

**On capability:** "Competitive with Opus 4.8 but weaker than Sol or Fable. About 20x cheaper." — top HN comment

**On real-world testing:** One user ran both DS V4 Pro 0813 and Grok 4.6 on Codex CLI for the same feature. DeepSeek: 12m 02s, $0.12, shipped with a bug. Grok: 3m 18s, $1.41, no bug. The counterpoint: repeat the test five times per model before trusting a single run.

**On the value tier:** "There's just no place for models that are neither SoTA nor truly crazy cheap. If it's 500x cheaper than US models for similar ballpark performance, sure. If it's merely 50% cheaper, no." 0813 lands firmly in the "truly crazy cheap" bucket.

**On Flash vs Pro:** "V4 Flash 0731 still feels like the most outstanding model of the past few months." Several users run Flash for execution and reserve Opus/GLM for planning — Pro 0813 now slots into that execution tier at higher quality.

**On adoption barriers:** Enterprise users cite political risk ("the US gov bans federal contractors from using them in 6 months"), model-switching fatigue, and the privacy policy. One user's employer is evaluating a company-wide shift from Anthropic to DeepSeek after a week of positive Flash testing — "if our data has to be used by either US or China, we might as well go cheaper."

**On benchmarks:** "IMO the HLE scores without tools seem to align better with real-world performance... you can RL terminal bench to the moon but does the model hold up on out-of-distribution tasks?"

## Who Should Buy

**Buy it if:** you run high-volume agentic coding or automation where cache reads dominate — the effective cost is unmatched; you want Fable-adjacent capability at commodity pricing; you're already in the DeepSeek ecosystem and want the flagship stamp.

**Skip it if:** you need vision input (it has none); your data is subject to strict privacy regimes (the policy trains on prompts); you need the absolute best agentic benchmark scores (Sol and Fable are ahead on DeepSWE and Toolathlon).

## Alternatives

| Model | Price (per 1M in/out) | Geometric Mean | Notes |
|---|---|---|---|
| **DeepSeek V4 Pro 0813** | $0.435 / $0.87 | 62.5 | Best value; no vision |
| DeepSeek V4 Flash 0731 | $0.08 / $0.18 | 55.8 | "Too cheap to meter"; 13B active |
| GPT-5.6 Sol | ~$12.50 / $60 (est.) | 65.5 | Top aggregate, premium price |
| Fable 5 (w/ fallback) | ~$15 / $75 (est.) | 64.5 | Anthropic flagship |
| Kimi-K3 | ~$0.6 / $2.4 (est.) | 62.3 | 2.8T open weights, harder to serve |

## FAQ

**Is DeepSeek V4 Pro 0813 the same as the V4 Pro preview?**
It's the GA stamp on the same model family with official benchmark publication and a price adjustment. OpenRouter lists it as a separate slug (`deepseek/deepseek-v4-pro-0813`) from the preview (`deepseek/deepseek-v4-pro`).

**Does it support vision?**
No. Multiple HN users confirmed no image input — a common blocker for teams wanting a full Claude replacement.

**How big is the model?**
1.6T total parameters with 49B activated (MoE), per the V4 Pro family description.

**What context length does it support?**
1M tokens (1,048,576), matching the V4 family.

**Is it open weight?**
Yes, DeepSeek publishes weights; the HN thread notes you can run the full model locally on ~$8,000 of hardware, unlike Sol or Fable.

**Why did DeepSeek release it the same day as Qwen3.8-2.4T?**
HN users read it as deliberate timing competition — "taking the wind out of Qwen's sails." Coincidence is possible, but the same-day dance between DeepSeek, Qwen, and xAI is now a pattern.

## Rating Breakdown

- **Ease of Use: 8/10** — OpenAI-compatible API, drop-in via OpenRouter; no vision is the only workflow friction
- **Features: 8/10** — 1M context, tool calling, excellent caching; no vision, no multimodal
- **Value: 9/10** — the cache-read economics make this the cheapest Fable-class model by a wide margin
- **Performance: 9/10** — 62.5 geometric mean, ahead of Flash by a full tier, wins on Cybergym and AutomationBench
- **Ecosystem: 8/10** — OpenRouter, official API, open weights, local deployment guides, active community
