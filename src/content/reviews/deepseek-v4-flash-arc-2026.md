---
title: "DeepSeek V4 Flash 0731 ARC-AGI Review — 89% on ARC-AGI-1 at $0.02 Per Task, and the Price Hike That's Coming"
date: 2026-08-08
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "DeepSeek"
  - "V4-Flash"
  - "ARC-AGI"
  - "LLM"
  - "Reasoning-Model"
  - "Pricing"
  - "Open-Weights"
  - "Benchmark"
cover: /images/reviews/deepseek-v4-flash-arc-2026/cover.png
rating: 8.3
dimensions:
  ease-of-use: 8
  features: 8
  value: 10
  performance: 8
  ecosystem: 8
pros:
  - "ARC-AGI-1 Semi-Private score of 89.0% at $0.02 per task — the strongest verified price/performance point on the ARC Prize leaderboard, with the Max reasoning variant beating its own High (87.0%) and Low (84.0%) tiers"
  - "ARC-AGI-2 Semi-Private 61.4% at $0.04 per task is a generational leap in cost-efficiency: GPT-5.2 (medium) scored 26.7% at $0.759 per task on ARC-AGI-2, per HN commenter sourcecodeplz — DeepSeek gets 2.3x the score at 1/19th the price"
  - "Verified by ARC Prize (not self-reported), with per-task pass/fail data published for all 120 ARC-AGI-2 and 400 ARC-AGI-1 public tasks across three reasoning levels"
  - "Three explicit reasoning tiers (Max/High/Low) let you trade cost against accuracy per workload — and HN users noted Max reasoning is cheaper than High reasoning, an anomaly that signals aggressive pricing"
  - "Community consensus across HN: 'too cheap to meter' territory for everyday agentic coding, with strong reports for instruction compliance, tool calling, and Kubernetes/FluxCD work (nikp123), plus 256GB-RAM CPU-only deployments via Q8 K XL quant (walrus01)"
cons:
  - "DeepSeek announced a 'significant' API price increase in early August — the $0.02/task economics on the ARC chart are a snapshot that may not survive the quarter, and HN users (Havoc, modeless) flagged the pricing page and email notices"
  - "Tool-calling latency is the recurring complaint: iagooar reports the model reasons fast but tool calls are SLOW, which matters for agentic loops where tool round-trips dominate wall time"
  - "Token-hungry: esafak notes V4 Flash, like many Chinese models, uses a lot of tokens to get work done — the $/token headline hides a higher token-per-task ratio"
  - "No ARC-AGI-3 result published, and HN (clayhacks) explicitly asked why — the benchmark that measures adaptive agents is the one frontier labs are now being judged on"
  - "Price benchmarking is confounded, as muricula argues: VC subsidies, economies of scale, and inference optimizations make raw $/task comparisons between labs misleading"
best-for: "Developers and teams running high-volume agentic coding workloads who want frontier-adjacent reasoning at commodity prices — the strongest 'too cheap to meter' API model on the ARC verified leaderboard as of August 8, 2026"
price: "$0.02/task at max reasoning on ARC-AGI-1 Semi-Private, $0.04/task on ARC-AGI-2 (verified); API list pricing on platform.deepseek.com — a 'significant' increase was announced August 6, 2026"
---

## Quick Verdict

On August 7, ARC Prize published verified results for **DeepSeek V4 Flash 0731**: **89.0% on ARC-AGI-1 Semi-Private at $0.02 per task**, and **61.4% on ARC-AGI-2 Semi-Private at $0.04 per task** — at max reasoning effort. The post hit **662 points on Hacker News** and sat near the top of the front page for a full day.

The score itself is remarkable; the price is the story. HN user sourcecodeplz put the comparison bluntly: on ARC-AGI-2, GPT-5.2 (medium) scored 26.7% at $0.759 per task, while DeepSeek V4 Flash (max) scored 61.4% at $0.04 — **2.3x the score at roughly 1/19th the cost**. That is not an incremental improvement; it is a different category of cost-efficiency.

The caveat, flagged by multiple commenters in the same thread: **DeepSeek announced a "significant" API price increase on August 6**. The chart that made V4 Flash famous may not survive the quarter. 8.3: the verified benchmark performance is 9, the durability of the pricing is 6.

## What ARC Prize Actually Verified

ARC Prize doesn't take a vendor's word for it. The verified results page publishes per-task pass/fail for every task in the eval, across all three reasoning variants:

| Variant | ARC-AGI-1 Semi-Private | ARC-AGI-2 Semi-Private | Cost per task (ARC-AGI-1) |
|---|---|---|---|
| Max | 89.0% | 61.4% | $0.02 |
| High | 87.0% | 56.0% | — |
| Low | 84.0% | 46.0% | — |

Three things stand out in the raw data.

**First, the reasoning tiers behave like a cost ladder, not a quality cliff.** Dropping from Max to Low costs you 5 points on ARC-AGI-1 (89.0 → 84.0) but 15.4 points on ARC-AGI-2 (61.4 → 46.0). ARC-AGI-2 is deliberately harder to brute-force, so reasoning effort matters more there. For production use, that means the Low tier is fine for classification-grade work, but don't expect it to hold up on the harder eval.

**Second, the Max-vs-High pricing anomaly.** HN's minimaxir flagged it: "It's always fun when Max reasoning is cheaper than High reasoning." ARC Prize prices per task by actual token spend, so a cheaper Max run implies the provider's pricing or the model's token profile makes max-effort reasoning *cheaper per task* than the mid tier. That's unusual enough to be worth understanding before you build budget models around the published tiers.

**Third, the missing ARC-AGI-3.** clayhacks asked the obvious question: "Why wasn't this run against ARC-AGI-3? Or did it fail to solve anything?" ARC-AGI-3 is the adaptive-agents benchmark — the one that measures whether a model can *act* in novel environments, not just reason over grids. No result was published. For agentic buyers, that's the gap in the otherwise impressive picture.

## The Price Hike: the Clock Is Ticking

The same week ARC Prize published these results, DeepSeek announced a **"significant" API price increase** — flagged on HN by Havoc ("They did recently announce they're increasing prices though, got a mail yesterday I think") and modeless, pointing to the official pricing page. Bloomberg, SCMP, and The Next Web all carried the story on August 6.

The HN discussion around this was unusually sober:

- **andai** initially misread the news as a 10x cache-read price change ("I thought the magical cache read pricing was going away (0.002) and they were going to be on par with everyone else (0.02)"), and HN commenters corrected the framing — the *magnitude* was unclear, but the direction was not.
- **croes** simply linked the price-hike thread under the ARC results: "Price raise incoming."
- **dcchambers** gave the strategic read: "This latest DeepSeek is almost at the 'too cheap to meter' level. That's going to be a larger unlock than models like Fable/Mythos that are way too expensive to justify."

What this means practically: if you're building agentic workloads on V4 Flash pricing, **the $0.02/task economics are a limited-time offer**. The ARC-verified chart is a snapshot of August 7, 2026. Lock in cache settings, batch workloads, and evaluate alternatives (GLM, Kimi K3, Qwen3.8-Max) before repricing lands.

## The Community Verdict

The 662-point thread is one of the most positive HN receptions of a Chinese model this year. The dominant theme is cost:

- **tosh**: "results comparable to gpt 5.6 luna but cheaper, promising!"
- **542458**: "Kimi K3 was an interesting model only a month ago, and now we're looking at the same performance for 1/20th of the price. Wild how fast this is advancing."
- **simonw**: "That's a pretty great score for a model you can run on as [expensive] laptop." (simonw also noted the significance of verified scores for open-weight models)
- **iagooar**: "It is the first model that is truly too cheap to meter," with the key caveat: "tool calling with it is SLOW."
- **nikp123**: "I just used it for some Kubernetes + FluxCD tasks and oh my is it good."
- **walrus01**: the Q8 K XL quant fits in a 256GB DRAM server with no GPU — "give it a task and check back."
- **mosura**: "It is strong (not Fable strong though) with a much better 'persona' than Opus, and very different blindspots. If you flip between Claude and this you will find both catch the mistakes of the other."

The dissenting voices are worth hearing too:

- **antirez** (Salvatore Sanfilippo): "Price is not a good meter. Active parameters per token are. Joule would be even better." His point: $/task conflates model size, quantization, and provider margins — it tells you what it costs *you*, not what the model *is*.
- **muricula**: "Price is confounded by VC subsidies, economies of scale, and inference optimizations. A more interesting chart would be ARC-AGI vs forward pass flops."
- **esafak**: "It's serviceable but, like many Chinese models, it uses a lot of tokens to get work done."
- **SwellJoe**: "Most of the major Chinese models are benchmaxxed, they have weird quirks every time I use them."
- **surprisetalk**: "When I see dramatic leaps like this, it tells me that the important hacks haven't yet been discovered."

## Who Should Use It

**Adopt now for high-volume agentic coding** if your workloads tolerate occasional weirdness and you want verified frontier-adjacent reasoning at commodity prices. The ARC-verified scores plus the "too cheap to meter" consensus make V4 Flash 0731 the default answer for teams burning tokens at scale — run it in Oh My Pi (LaurensBER's setup with a second instance as "advisor"), Prime Agent (johnmlussier), or your OpenAI-compatible harness of choice.

**Build with cache in mind** — the implicit cache reads are where the magic is, and they're the pricing line most at risk in the announced increase. Measure your cache hit rate before you commit architecture.

**Skip it if you need frontier-grade reliability or fast tool loops** — the tool-calling latency and benchmaxxed quirks are real. Keep a frontier model (Claude, Fable-class) for the hard 10%, and let V4 Flash eat the volume.

**The one number to remember:** 61.4% on ARC-AGI-2 at $0.04/task, verified, August 7, 2026 — and check the pricing page before you build the budget around it.
