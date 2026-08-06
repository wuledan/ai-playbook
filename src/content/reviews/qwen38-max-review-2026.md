---
title: "Qwen3.8-Max Review 2026 — First Open-Weight Max-Class Model, #1 on the Agentic Index, $2/$6 Pricing"
date: 2026-08-07
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "Qwen"
  - "Alibaba"
  - "Qwen3.8-Max"
  - "Agentic-Index"
  - "Open-Weight"
  - "Coding"
  - "LLM"
  - "Artificial-Analysis"
cover: /images/reviews/qwen38-max-review-2026/cover.png
rating: 8.0
dimensions:
  ease-of-use: 8
  features: 9
  value: 9
  performance: 8
  ecosystem: 8
pros:
  - "First Qwen-Max-class model to go open-weight — the full Max weights drop next week, which is a first for the family and directly answers the community's biggest open-vs-closed question"
  - "Ranked #1 overall model by Artificial Analysis' Agentic Index, beating GPT-5.6 and Claude on agentic workloads — a meaningful signal for coding-agent users, not just chat benchmarks"
  - "Official reasoning_effort support (low/high/xhigh) lets you trade reasoning depth against cost on the same checkpoint, from quick classification to long-horizon autonomous work"
  - "Aggressive pricing at $2/M input and $6/M output with $0.25/M implicit caching — undercuts frontier Western APIs on agent-heavy token profiles"
  - "Qwen3.8-27B open weights ship next week too, giving local runners a path from the 27B sweet spot (huge on 4090s and 16GB Mac minis per HN) toward Max-class quality"
cons:
  - "Open weights are announced but not yet released — 'next week' means you cannot self-host today, and HN is right to flag that the timeline can slip"
  - "The Max-Preview (July 19) → Max (Aug 6) transition was confusing: nothing on the official page documents what changed between the RL checkpoints, and HN users had to dig through Twitter to confirm it was a full release"
  - "Benchmark claims are hard to verify independently — Artificial Analysis' Agentic Index is credible, but Qwen's own page leans on self-reported numbers and the 'self-evolves through feedback loops' line drew justified HN skepticism"
  - "No dense mid-size option: the lineup jumps from 27B to Max, and multiple HN users (128GB RAM owners especially) said they'd want a 54B-72B dense model between the two"
  - "Agentic strength is concentrated in coding/cowork — the reasoning_effort tiers are a knob you must tune per task, and picking wrong costs you either accuracy or money"
best-for: "Teams and solo devs running agentic coding workloads who want frontier-class quality at Chinese-lab pricing — and anyone who has been waiting for an open-weight Max-class model to self-host or fine-tune"
price: "$2.00/M input tokens, $6.00/M output tokens, $0.25/M implicit cache reads via QwenCloud (qwencloud.com/models/qwen3.8-max); open weights free via Hugging Face when released next week"
---

## Quick Verdict

Qwen3.8-Max is the most capable model Alibaba's Qwen team has shipped, and the first Max-class checkpoint to go open-weight. In the 48 hours after its August 6 announcement, it picked up **1,115 points on Hacker News** and a second front-page story when **Artificial Analysis ranked it #1 overall on its Agentic Index** — ahead of GPT-5.6 and Claude in agentic workloads.

The two news items matter for different reasons. The launch post is about capability and openness: the full Max weights release next week, a first for the family, and Qwen3.8-27B goes open-weight in the same window. The Artificial Analysis ranking is about the shift everyone has been watching: Chinese labs' open-weight models now lead the frontier on the exact workload — long-horizon agentic coding — that Western labs are betting their products on.

The price is the other headline: **$2/M input, $6/M output, $0.25/M implicit caching** on QwenCloud. For agent-heavy token profiles, that is aggressively cheaper than frontier Western APIs. 8.0: the announcement is 9, the shipping reality (weights not yet out, preview→release muddle) is 7.

## What Qwen3.8-Max Actually Is

Qwen3.8-Max is the successor to the Qwen3.8-Max-Preview released July 19, and the flagship of the Qwen 3.8 family. The official line: it is the first Qwen-Max-class model to be released open-weight, with the weights arriving "next week" on open channels.

**What's new versus Preview.** Qwen doesn't document the delta explicitly, which HN noticed. The community reading: Preview models are earlier RL checkpoints; the official release is the checkpoint Alibaba is confident in after continued training. Practically, this is the version that ships in QwenCloud and powers the Qwen Code / Qwen Agent products.

**The Agentic Index #1.** Artificial Analysis' Agentic Index measures end-to-end performance on agentic workloads — tool use, long-horizon task completion, coding-agent scenarios — rather than static chat benchmarks. Qwen3.8-Max taking the top slot is the strongest independent signal in the thread. One HN user put it plainly: "Qwen3.8-Max is the new flagship model for coding and harness systems... that's gonna drop the price of LLM in the agent landscape a lot."

**reasoning_effort control.** Qwen3.8-Max ships official support for `reasoning_effort` — `xhigh` (default, for complex tasks demanding thorough analysis), `high`, `low` — letting you tune reasoning depth per call to control cost. This matters for agent pricing: you can run classification and quick edits at `low`, and reserve `xhigh` for autonomous multi-step jobs.

## Pricing & Plans

QwenCloud pricing for Qwen3.8-Max, confirmed via the model page and Alibaba's own announcement:

| Item | Price |
|------|-------|
| Input tokens | $2.00 / M |
| Output tokens | $6.00 / M |
| Implicit cache reads | $0.25 / M |

Context for that price: GPT-5.6-class and Claude-class frontier APIs sit at $3-15/M input and $15-60+/M output depending on tier. For an agent that burns hundreds of thousands of tokens per session, Qwen3.8-Max at $2/$6 cuts the API line item by a wide margin — which is exactly why HN's thread keeps returning to "the price of LLMs in the agent landscape is about to drop."

Self-hosted cost is not yet knowable: weights drop next week, so nobody has run benchmarks on local hardware yet. The 27B release in the same window is the immediate local play.

## The HN Debate

The thread is a useful map of where open-weight adoption stands. Three arguments dominate:

**1. Is the open-weights promise real?** Yes — "the first time we will open-source the weights of a Qwen-Max-class model" is explicit in the announcement, and Qwen3.8-27B follows. The skepticism is about timing, not intent.

**2. What changed since Preview?** Unresolved. HN commenters compared the July 19 "Max-Preview" post with today's "Max" post and found no public diff. One commenter noted the typical pattern — previews are earlier RL checkpoints, official release comes when the training run is finished — but the lack of documentation is a legitimate ding.

**3. The local-model angle.** Qwen3.6-27B is widely regarded as the best local model under 30B, and HN users are running it everywhere: IQ4 quantized on a 4090 with 24GB VRAM, the "bonsai" 1-bit quant fitting in 4GB on a 16GB Mac mini, and a 3.8-27B@fp8 on 96GB servers. The recurring ask: a dense 48-72B between 27B and Max. Alibaba didn't deliver that, and users noticed.

The "self-evolves through feedback loops" line drew the sharpest pushback. HN's response was essentially: every RL-trained model improves via exploration feedback; what matters is how long it runs without human intervention, not the marketing phrasing. Fair.

## Who Should Use It

**Get it via API now** if you run agentic coding workloads — the agentic-index #1 ranking plus $2/$6 pricing is the strongest combination in the market today. Point your harness (Codex, Claude Code, Pi, whatever speaks OpenAI-compatible APIs) at QwenCloud and A/B it against your current model.

**Wait one week if you want self-hosted**: the open weights are the headline feature for local runners, and the 27B release gives the 4090/16GB crowd a concrete upgrade path.

**Skip the hype on "self-evolution"** — treat it as marketing; judge the model on the agentic index, the price, and your own eval runs.

## FAQ

**Is Qwen3.8-Max open source or just open weight?** Open weight — the weights are Apache-style available for download and self-hosting, per the announcement, but this is not the full open-source stack (training data, code). The weights for Max and 27B release next week.

**How does Qwen3.8-Max compare to GPT-5.6 and Claude?** On Artificial Analysis' Agentic Index it ranks #1 overall, ahead of both. On static benchmarks the picture is closer and more contested. Real answer: run your own evals on your actual agent workload before switching.

**Can I run it locally?** Not yet — weights ship next week. The 27B variant will be the practical local option (the Qwen3.6-27B lineage runs on 4090s and 16GB Macs at quantized sizes).

**What is reasoning_effort?** A per-call control for reasoning depth: `low`, `high`, or `xhigh` (default). Lower effort = faster and cheaper for simple tasks; `xhigh` for complex autonomous work. It is the same cost-tuning pattern frontier models use, now official on Qwen3.8-Max.

**Where do I get it?** API: qwencloud.com/models/qwen3.8-max ($2/$6 per M tokens). Open weights: next week via Hugging Face and Qwen's channels.
