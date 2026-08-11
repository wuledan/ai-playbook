---
title: "NVIDIA Nemotron 3.5 Lightning Review 2026 — 30B MoE Agentic Model and the NeMo Switchyard Routing Library"
date: 2026-08-12
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "NVIDIA"
  - "Nemotron"
  - "MoE"
  - "Agentic-AI"
  - "Model-Routing"
  - "Open-Models"
  - "NeMo"
  - "Open-Weight"
cover: /images/reviews/nemotron-35-lightning-review-2026/cover.png
meta_description: "NVIDIA Nemotron 3.5 Lightning is a 30B mixture-of-experts model for always-on agentic workloads — up to 4x faster output and 30% faster task completion than peers, with Nemotron Coalition contributions and a Nemotron-RL-Agentic-Terminal-Pivot coding dataset. NeMo Switchyard routing cuts LangChain Deep Agents cost by 74% and Ramp SWE-Bench cost by 58%. Review with PinchBench claims, partner results, pricing, and the HN debate over sparse-vs-dense design."
rating: 7.6
dimensions:
  ease-of-use: 8
  features: 7
  value: 8
  performance: 8
  ecosystem: 7
pros:
  - "Efficiency-first design: 30B total params with sparse MoE activation means output speeds up to 4x faster than dense peers and 30% faster agentic task completion per NVIDIA's PinchBench runs — the right profile for high-volume always-on agent loops where latency compounds across turns"
  - "The routing story is concrete, not vaporware: NeMo Switchyard partner results are specific — LangChain cut cost 74% across 145 multi-turn Deep Agents tasks by routing only 7% of calls to a frontier model at a 6% accuracy tradeoff; Ramp matched frontier performance on SWE-Bench while cutting cost 58% and runtime 33%; Cognition's staged router cut mean cost 28% on Devin Desktop"
  - "Real transparency data: as with every Nemotron launch, NVIDIA publishes as much training data and technique documentation as licensing permits, plus a dedicated agentic RL dataset (Nemotron-RL-Agentic-Terminal-Pivot) used to post-train the model for coding agents — dannyw's standing HN point about Nemotron actually publishing data, unlike some open-weight rivals"
  - "Runs everywhere: RTX PCs, DGX Spark, DGX Station, Jetson, RTX PRO workstations, data centers, and cloud, with NIM microservice on build.nvidia.com, plus Hugging Face, ModelScope, and OpenRouter availability on day one"
  - "Enterprise adoption is real and named: CrowdStrike (cybersecurity), Harvey with Trajectory (legal), CodeRabbit with Baseten (code review), Lila Sciences (life sciences), Fastino Labs (software/finance/healthcare) all post-trained the model for domain-specific agent tasks"
  - "Routing is tunable, not a black box: developers can swap routing algorithms to prioritize quality, latency, or cost — Boomi reports 100% domain-routing accuracy with 59% of traffic sent to a 5x faster fine-tuned model and 21% lower later-turn latency"
cons:
  - "Sparse MoE trades reasoning depth for speed: HN's sleepyeldrazi notes reasoning ability tracks active parameters — a 30B-A3B-class model is roughly 8-10x faster than a dense 30B but leans on the mixture for knowledge, which shows on reasoning-heavy tasks; XCSme's aibenchy comparison currently ranks Meta Muse Glimmer 30B higher across his suite"
  - "The README contradicts the press release: NVIDIA-NeMo/Switchyard is labeled 'Experimental software. Not for production use' — embedding-shape flagged the mismatch between marketing claims and the repo's own warning"
  - "Prompt-cache story is unresolved: thehamkercat called smart-model-routing 'snake-oil marketing' because switching models per turn can fragment KV caches — defenders (hedgehog, try-working, WASDx) argue per-model caches still save on turn count, but providers haven't shipped a unified answer, and eli notes you must pick a cache-stickiness vs routing-quality tradeoff"
  - "Headline benchmark comparisons are relative to 'models in its class,' not named rivals, and PinchBench numbers are NVIDIA's own — the 4x speed and 30% completion claims need independent reproduction (evidence dirs exist but are thinner than Muse Glimmer's third-party benchmarks)"
  - "KV cache math gets awkward at long context: sleepyeldrazi's ballpark — 27B at q4 KV for 256k context needs ~8GB while a 35B sparse model needs ~3.5GB at q4 — means long-context agent sessions can flip the cost equation back in favor of denser models"
best-for: "Teams running high-volume, latency-sensitive agentic workloads — code review, security alert triage, billing Q&A, tool use — who want a small open MoE they can post-train on their own domain data, plus a routing layer that dispatches each step to the cheapest model that still gets the job done. It is not aimed at one-shot deep-reasoning leaders."
price: "Free — open model on Hugging Face and ModelScope; available via OpenRouter and as an NVIDIA NIM microservice on build.nvidia.com. NeMo Switchyard is open source on GitHub (NVIDIA-NeMo/Switchyard). Routing cost claims: LangChain 74% cheaper Deep Agents, Ramp 58% cheaper SWE-Bench, Classmethod 27% cheaper opencode+Fireworks workloads."
---

## Quick Verdict

On August 11, 2026, **NVIDIA expanded the Nemotron 3 family with Nemotron 3.5 Lightning**, a 30-billion-parameter **mixture-of-experts** model built specifically for specialized tasks inside larger multi-agent systems — code review, tool use, security alert monitoring, billing questions. It landed at **144 points and 74 comments on Hacker News**, a modest debut shadowed by Meta's Muse Glimmer 30B (978 points the day before), and the HN thread immediately turned into a debate about whether sparse MoE or dense design is the right bet for local agentic AI.

The release pairs the model with **NeMo Switchyard**, an open source model-routing library that automatically sends each step of an agent workflow to the cheapest model that can still do the job. The partner numbers are the most interesting thing here: LangChain cut costs **74%** across 145 multi-turn Deep Agents tasks by routing only 7% of calls to a frontier model; Ramp matched frontier performance on SWE-Bench while cutting cost **58%** and runtime **33%**.

**7.6.** Nemotron 3.5 Lightning is a genuinely well-engineered efficiency play with unusually concrete routing economics and real named enterprise adopters. It loses points on the README-vs-press-release contradiction, the unresolved prompt-cache question, and the fact that the current open 30B class has a denser, higher-scoring alternative in Muse Glimmer.

## What Nemotron 3.5 Lightning Actually Is

Nemotron 3.5 Lightning is a **30B-parameter MoE model** designed for high-volume specialized tasks in always-on agent systems. It follows Nemotron 3 Nano in NVIDIA's strategy of building a "system of models": a frontier reasoning model like Nemotron 3 Ultra or GPT-5.6 plans and orchestrates, while smaller specialized models execute targeted tasks.

The model was developed with contributions from the **Nemotron Coalition**, whose members supplied evaluation methodologies, inference software, and datasets. NVIDIA claims:

- **Up to 4x faster output speed** than models in its class
- **30% faster agentic task completion** (PinchBench benchmarks)
- Frontier-level accuracy on agentic tasks relative to its class

Because it's open and customizable, organizations can post-train it with **NVIDIA NeMo** on their own domain data, tools, and workflows. NVIDIA also released **Nemotron-RL-Agentic-Terminal-Pivot**, an agentic reinforcement learning dataset used to post-train the model for coding-agent capabilities.

| Spec / Claim | Value |
|--------------|-------|
| Parameter count | 30B total, MoE (sparse activation) |
| Design goal | High-volume specialized tasks in multi-agent systems |
| Output speed | Up to 4x faster than class peers (NVIDIA claim) |
| Task completion | 30% faster agentic completion (PinchBench, NVIDIA claim) |
| Post-training | NVIDIA NeMo on domain data; RL dataset released |
| Hardware | RTX PCs, DGX Spark, DGX Station, Jetson, RTX PRO, cloud |
| Availability | Hugging Face, ModelScope, OpenRouter, NIM on build.nvidia.com |

## NeMo Switchyard: The Routing Library

NeMo Switchyard is the more interesting half of this release. It's an open source model-routing library that plugs into agent tools and directs each request to the most capable and suitable model — across a developer's own mix of open, proprietary, and NVIDIA models — without rewriting applications. Developers can tune or swap routing algorithms to match quality, latency, or cost priorities.

NVIDIA's internal claim: **frontier-level accuracy at nearly one-third the task-completion cost of Opus 4.8 alone.** The partner results, all named and specific:

| Partner | Result |
|---------|--------|
| Boomi | 100% domain-routing accuracy; 59% of traffic to a 5x faster fine-tuned model; 21% lower later-turn latency |
| Cadence | 9.9% efficiency gain (ChipStack AI Super Agent, formal verification) |
| Classmethod | 27% cost reduction on opencode + Fireworks workloads |
| Cognition | Staged router in Devin Desktop: near-frontier FrontierCode Main, 28% lower mean cost |
| Kong | Native routing through Kong AI Gateway |
| LangChain | 74% lower cost, 145 multi-turn Deep Agents tasks; 7% of calls to frontier model; 6% accuracy tradeoff |
| LiteLLM | Switchyard plug-in into its proxy layer |
| Nous Research | Integration into Hermes |
| Ramp | Matched frontier performance on SWE-Bench; 58% lower cost; 33% lower runtime |
| Siemens | Benchmarking for Fuse EDA AI Agent |

## Pricing

Both the model and the router are free:

- **Nemotron 3.5 Lightning** — open model on Hugging Face and ModelScope; available via OpenRouter and as an NVIDIA NIM microservice on build.nvidia.com
- **NeMo Switchyard** — open source on GitHub (NVIDIA-NeMo/Switchyard)
- The costs that matter are inference and routing economics: LangChain's 74% reduction, Ramp's 58%, Classmethod's 27%

## What the Community Says

The HN thread split into three camps:

**The prompt-cache skeptics.** thehamkercat called smart-model-routing products "snake-oil marketing," arguing prompt caching breaks when you switch models mid-session. The counter-argument came from hedgehog and try-working: most agentic API cost is cached reads plus generation, and switching models doesn't increase turn count — you prefill the diff plus your new message, which is still one turn. eli noted real routers let you pick a tradeoff point between cache stickiness and per-turn routing performance. amluto clarified the mechanics: prompt caching is about caching prefill results (the KV cache), which is strictly model-specific.

**The sparse-vs-dense debate.** khimaros summarized: "lightning is sparse, glimmer is dense." rllearneratwork added that Glimmer has roughly 10x the active parameters of Lightning, meaning ~10x slower on the same hardware. XCSme's aibenchy comparisons currently rank Muse Glimmer 30B above Nemotron Lightning across his task suite, though he acknowledged both fit a 3090 and the speed difference in practice is under 2x. sleepyeldrazi's KV-cache math — 27B at q4 KV for 256k context ≈ 8GB vs a 35B sparse model ≈ 3.5GB — means long-context sessions can flip the economics back toward dense.

**The efficiency thesis.** jmward01 framed the release as a consequence of the "ramapocalypse": multi-trillion-parameter models are missing something, and the push to smaller, efficient models will drive structural change. schainks is "literally betting my company" on that thesis; cootsnuck argued speed enables categorically different user experiences, not just cheaper versions of the same ones.

## Alternatives

| Model | Size / Type | Key difference |
|-------|-------------|----------------|
| Meta Muse Glimmer 30B | ~29.6B dense + 1.8B vision encoder | Dense; higher active params; stronger per aibenchy and MCP Atlas (75.5) — but ~8-10x slower on same hardware |
| Qwen3.6 27B / Qwen3.8 27B | Dense | The incumbent class leader before Glimmer; Qwen3.8 27B was expected to drop the week of this review |
| Gemma 4 12B | Dense | Smaller, runs in far less VRAM; good for edge agents |

## FAQ

**Is Nemotron 3.5 Lightning open source?**
Open weights with permissive licensing, available on Hugging Face and ModelScope. NVIDIA publishes as much training data and technique documentation as licensing permits — the transparency dannyw has repeatedly credited Nemotron for on HN.

**Can I run it locally?**
Yes — RTX PCs, DGX Spark, DGX Station, and Jetson are explicitly supported, alongside RTX PRO workstations, data centers, and cloud.

**Is NeMo Switchyard production-ready?**
The GitHub README literally says "Experimental software. Not for production use." NVIDIA's press materials suggest deployment readiness; the repo hedges. Treat it as a promising router with excellent partner results, not a proven-in-prod default yet.

**How does routing interact with prompt caching?**
Unresolved in the community. Per-model KV caches preserve most of the caching benefit because turn count doesn't increase, but cross-provider shared caching is not generally available, and cache-stickiness vs routing-quality is a real tradeoff you configure.

**Who is this for?**
Teams with high-volume, latency-sensitive agent tasks — code review, security triage, billing Q&A — who want to post-train a small open model and route cheaply around a frontier planner. Not for one-shot deep-reasoning workloads.
