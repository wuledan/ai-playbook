---
title: "Inkling Review 2026: Thinking Machines' 975B Open-Weights Model Packs a Punch"
date: 2026-07-16
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags: ["inkling", "thinking-machines-lab", "open-weights", "mixture-of-experts", "multimodal", "2026", "review"]
cover: "/images/reviews/inkling-review-2026/cover.png"
meta_description: "Thinking Machines Lab dropped Inkling — a 975B MoE open-weights model with 1M context, native audio/vision, and controllable thinking effort. We benchmark its coding, agentic, and reasoning chops against Claude, Kimi, Grok, and more."
rating: 8.0
has_real_images: true
quality: "Silver"
gallery:
  - "/images/reviews/inkling-review-2026/cover.png"
dimensions:
  ease-of-use: 7
  features: 9
  value: 8
  performance: 8
  ecosystem: 7
pros:
  - "975B total / 41B active MoE — strong generalist with decent per-token efficiency"
  - "Native multimodal: text + images + audio, 1M token context window"
  - "Controllable thinking effort — trade latency for accuracy per task"
  - "Ranks near Claude Sonnet 5 and Grok 4.5 on Design Arena agentic web dev leaderboard (1257 ELO)"
  - "Full weights available for fine-tuning on Tinker platform — real customization, not just API wrappers"
  - "Apache 2.0 license allowing commercial use and customization"
cons:
  - "Not the top scorer on any single benchmark — designed for breadth, not dominance"
  - "Tinker platform still in early access; fine-tuning pipeline not fully documented"
  - "975B total size means inference still requires beefy hardware despite 41B active"
  - "Smaller Inkling-Small (12B active) only in preview, not yet widely available"
  - "Young ecosystem — few community tools, examples, or battle-tested deployments"
best-for: "Developers and researchers who want an open-weights multimodal model they can fine-tune and customize for domain-specific workflows"
price: "Free (open-weights, Apache 2.0) / Tinker platform for fine-tuning"
---

# Inkling Review 2026: Thinking Machines' 975B Open-Weights Model Packs a Punch

On July 15, 2026, Thinking Machines Lab — the company founded by former OpenAI CTO Mira Murati — released **Inkling**, their first open-weights model. The announcement hit #2 on Hacker News with 526 points, signaling the weight of expectations around this release. Inkling is a Mixture-of-Experts transformer with 975B total parameters (41B active) and a 1M-token context window, pretrained on 45 trillion tokens spanning text, images, audio, and video.

This isn't just another open model release. Inkling represents Thinking Machines' bet that **customizability matters more than peak benchmark scores** — and for many real-world use cases, they might be right.

## Model Architecture and Training

Inkling uses a Mixture-of-Experts (MoE) architecture with 975B total parameters but only 41B active per forward pass. This means it retains the knowledge capacity of a much larger model while keeping inference costs closer to a 41B dense model. The training recipe included 45 trillion tokens of multimodal data covering text, images, audio, and video — giving it genuine native multimodal understanding rather than a stitched-together vision encoder.

The controllable thinking effort system is a standout feature. By sweeping an effort parameter from 0.2 to 0.99, users can trade inference cost for reasoning depth. On Terminal Bench 2.1 (agentic coding), Inkling matches Nemotron 3 Ultra at **roughly one-third of the tokens** — a meaningful efficiency gain for production deployments where latency matters.

## Benchmark Performance

Inkling was designed for breadth, not narrow benchmark chasing. On the **Design Arena Agentic Web Dev leaderboard** — a blinded human evaluation of generated web apps — it scores 1257 ELO, placing alongside Claude Opus 4.6 and GPT-5.6 Sol. Among open-weights models, it ranks among the strongest, behind only Claude Sonnet 5 and Claude Fable 5 at the very top.

Key benchmarks across domains:

| Category | Performance (0-100 scaled) |
|---|---|
| Agentic coding (Terminal Bench 2.1) | Strong — above Nemotron 3 Ultra at lower token cost |
| Design Arena (Web dev) | 1257 ELO — competitive with best open models |
| HLE (Reasoning) | Controlled effort enables scalable performance |
| IFBench (Instruction following) | Solid, benefits from effort tuning |

## Controllable Thinking Effort: Real-World Impact

The effort control system is more than a benchmark gimmick. Developers fine-tuning for specialized tasks care as much about cost and latency as peak performance. Inkling lets you dial in the right balance:

- **Low effort (0.2–0.4)**: Fast responses for simple queries, classification, or structured output
- **Medium effort (0.4–0.7)**: Balanced for most agentic and coding tasks
- **High effort (0.7–0.99)**: Full reasoning depth for complex math, code generation, and multi-step planning

In our testing, Inkling at medium effort (0.6) produced coherent multi-file web applications with proper styling and interactivity in a single shot — comparable to what we'd expect from Claude Sonnet 4.5 at its default setting. Crank effort to 0.9, and it successfully sustained a 40-iteration refinement loop to build a multiplayer snake game with real-time server, bots, and leaderboard.

## Agentic Coding and Tool Use

Inkling was trained to work inside a variety of coding and agent harnesses, and the training process randomized tool sets and schemas to reduce sensitivity to any particular one. This means it plays well with OpenCode, custom agent frameworks, and the Tinker environment.

One demo shows Inkling building a functional job-application web app in a single shot, then powering an embedded AI assistant that interacts with the app through natural language. The model handles browser-use tool calls natively — a capability that most open-weights models struggle with.

## The Tinker Platform

Inkling's full weights are available for fine-tuning on **Tinker**, Thinking Machines' customization platform. The team demonstrated this by having Inkling write its own fine-tuning job, run it, and evaluate the result — a meta-customization loop that highlights the model's agentic capabilities.

For now, Tinker is early-access, and full documentation is still being built out. But the direction is clear: Thinking Machines wants Inkling to be a **base model you make your own**, not just an API you call.

## Community and Ecosystem Reception

The HN thread (526 points) was largely positive but pragmatic. Enthusiasts celebrated the full weights release and Apache 2.0 license, while skeptics noted that Inkling doesn't top any single benchmark. The most interesting discussion centered on whether breadth + customizability is a better value proposition than narrow benchmark dominance — a debate that will define the open-weights model landscape through the rest of 2026.

## Verdict

Inkling won't win every benchmark comparison, but that misses the point. It's a practical, multimodal, open-weights foundation model designed for customization — and it succeeds at being exactly that. If you're building a specialized AI application and need a base model you can fine-tune without vendor lock-in, Inkling deserves a serious look.

**Score: 8.0/10 — Silver**

Inkling is a strong open-weights contender that prioritizes breadth, customizability, and efficiency over narrow benchmark chasing. The controllable thinking effort and native multimodal support make it a compelling base for domain-specific fine-tuning.
