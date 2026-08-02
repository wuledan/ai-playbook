---
title: "Claude Opus 5 Long-Horizon Coding Review 2026 — Karpathy's 5,500-Line LoTR Render Test"
date: 2026-08-03
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "Claude-Opus-5"
  - "Anthropic"
  - "Long-Horizon-Tasks"
  - "Agentic-Coding"
  - "Three.js"
  - "World-Building"
  - "AI-Coding-Agents"
  - "Benchmark"
cover: "/images/reviews/claude-opus-5-long-horizon-review-2026/cover.png"
meta_description: "Andrej Karpathy gave Claude Opus 5 the first paragraph of The Lord of the Rings, a 1M-token budget (~$10), and asked for a three.js render. Opus 5 worked ~2 hours, wrote 5,500 lines of code, and procedurally rendered the story. Hands-on analysis of what this long-horizon test reveals about Opus 5's agentic capability, cost, and the multimodal audit gap — with the full HN debate."
rating: 8.0
dimensions:
  ease-of-use: 7
  features: 9
  value: 8
  performance: 8
  ecosystem: 8
pros:
  - "Sustained ~2-hour autonomous execution on a single 1M-token budget — Opus 5 wrote 5,500 lines of code that procedurally rendered the opening of Lord of the Rings in three.js without human intervention"
  - "The output is genuinely original: polygon assets, animation orchestration in (x,y,z) space, and scene sequencing derived from prose rather than from a template or tutorial"
  - "Cost efficiency at the frontier: a ~$10 token budget replaced what would have been days of bespoke three.js engineering for a custom, one-off world"
  - "Demonstrates the 'from no one would ever do this to sure, why not, it's ~free' transition — the economics of hyper-custom content collapse"
  - "Opus 5 self-corrected by taking screenshots at different points, showing it can use its own vision loop to check work, albeit slowly"
cons:
  - "Output is 'kind of janky' by Karpathy's own admission — visible scene errors that required manual screenshot-based debugging"
  - "No native video or gameplay perception: the model could not watch its own render, so it audited via slow, painstaking screenshots and still 'messed up a few times'"
  - "Multimodal input remains a bottleneck — video and interactive-world perception are exactly the raw capabilities Karpathy flags as still lacking"
  - "1M tokens for one short scene is a big budget; scaling this to a full interactive world would multiply cost and failure modes"
  - "Not a product yet — this is a research-style demonstration of capability, not a reproducible workflow with stable output quality"
best-for: "Developers and studios prototyping generative 3D worlds, procedural storytelling demos, and anyone evaluating frontier models for long-horizon autonomous coding tasks"
price: "Anthropic API, pay-per-token. Karpathy's test ran on a 1M-token budget ≈ $10; Opus 5 sits at the top of Anthropic's model tier above Sonnet and Haiku"
---

## Quick Verdict

On August 2, 2026, Andrej Karpathy posted what became the #1 story on Hacker News (377 points, 296 comments): he gave **Claude Opus 5** the first paragraph of *The Lord of the Rings*, a **1M-token budget (~$10)**, and one instruction — produce a **three.js render** of it. Opus 5 went off for roughly two hours, wrote **5,500 lines of code**, and procedurally rendered the story: polygon assets placed in (x, y, z) coordinates, animated, sequenced, and screened.

The result is janky but real — and that is exactly the point. Karpathy frames it as the moment we start leaving "draw an SVG of a pelican on a bicycle" territory: the test of an LLM is no longer a single artifact, but a *long-horizon autonomous build*. At **8.0/10**, this is a Silver-plus review of Opus 5's agentic ceiling as revealed by that test, plus the honest caveats the HN thread hammered on — especially the **multimodal audit gap**.

---

## What the Test Actually Was

Karpathy's exact setup (from the tweet, 22,926 likes, 9,437 bookmarks):

> "I was interested what Opus 5 would do if I gave it the first paragraph of the Lord of the Rings, a 1M token budget (~$10) and asked for three js render of it. Opus went off for ~2 hours and wrote 5500 lines of code that (procedurally) rendered the story. It's kind of janky but fun."

Two things stand out immediately:

1. **The budget, not the model, is the constraint.** A 1M-token allowance forces the agent to plan: it cannot afford endless regeneration loops, so it must write code that *procedurally* generates the scene rather than hand-authoring every frame. That is the clever part — it turns the render into a program.
2. **The task is unconstrained and custom.** There is no tutorial, no template, no benchmark harness. The model had to interpret prose ("In a hole in the ground there lived a hobbit...") into spatial assets, lighting, camera work, and motion. No human would "in their right mind" spend the time; LLMs have "all the stamina and patience in the world."

The result is the "ephemeral GTA of X on demand" thesis: hyper-custom worlds you can imagine dropping players into — as a spectator NPC, or one of the characters.

## How Opus 5 Did It (and Where It Struggled)

The most instructive part of the tweet is the failure mode Karpathy identifies at the end:

> "The domain of worlds/games exposes a weakness in LLMs: they can't easily audit their work because they aren't able to efficiently and natively perceive videos or play games within them. Here, Opus 5 had to very slowly and painstakingly take screenshots at different points, and it messed up a few times and created a bunch of jank."

This is a real, measurable limitation, not a vibe:

- **Audit loop exists but is slow.** The model rendered, screenshotted, inspected, and iterated. That loop works — the video is coherent — but it runs at human-ish speed because the model cannot watch the animation.
- **Spatial reasoning is still approximate.** The frames show assets whose placement is "close enough," not physically grounded. HN commenter `dllu` gave the same verdict on the pelican test: models still fail chain geometry, fork alignment, and pedal linkage.
- **The cost of correction is high.** Every screenshot-based check burns tokens from the same 1M budget. At scale, this is the economic bottleneck: capability is there, *verification* is not.

The accompanying video (92 seconds, 1920×1080) shows the rendered scene: a stylized, green-toned three.js interpretation of the Shire opening — recognizably LoTR, clearly procedural, and visibly unpolished.

## The HN Debate: Pelican, Saturation, and Skepticism

The 296-comment thread split into three camps worth quoting:

**1. "The pelican test is saturated."** `maxutility` argued the pelican-on-a-bicycle benchmark "was interesting a year ago when most models struggled... Now it's saturated and uninteresting. A good new benchmark should have awful performance to start." `irthomasthomas` added: "Claude pelicans aren't much better today than they were 18 months [ago]." Karpathy's test is a direct response: escalate from one artifact to a *world*.

**2. "The budget is the story."** `Gooblebrai`: "I can't believe the video demo is $10." `xg15` ran a similar experiment (LoTR paragraph, 1M tokens, ~$10) and was struck that the model "has to place and orchestrate various polygon assets in (x,y,z) coordinates and write code that animates it all — and that it even does anything at all."

**3. "Karpathy is marketing for Anthropic."** `quantumleaper` accused him of "peddling marketing slop" after previously claiming reliable agents were a decade away. Others pushed back — `novia` read the tweet as "signaling his intent to help change" the video-input gap, "an open problem," not a product pitch.

A related Show HN the same day — *"My personal AI benchmark: 'Generate an SVG of a frog with a Habsburg jaw'"* (frogs.vaguespac.es, 76 points) — showed the same dynamic in miniature: 14 models, 42 runs, all produced SVGs, and several (7 of 14) silently imported royalty imagery into a prompt that named only an anatomical feature. Same conclusion, smaller canvas: models are impressive, but their *interpretive drift* is predictable.

## Use Case: From Demo to Workflow

The practical takeaway is not "Opus 5 can render LoTR" — it's the **budgeted long-horizon pattern**:

1. Set a hard token budget (Karpathy used 1M ≈ $10).
2. Give the model a *procedural* target (code that generates the artifact) instead of the artifact itself.
3. Let it run unattended (2 hours here), then review the output — not the intermediate steps.
4. Accept that self-verification will be slow until models gain native video/gameplay perception.

For teams building procedural world demos, interactive storytelling prototypes, or "custom world on demand" products, this pattern is now reproducible on any frontier API. The gap — fast native multimodal audit — is precisely where the next model generation will differentiate.

## Alternatives

| Option | Why | Cost |
|--------|-----|------|
| **Opus 5 (Anthropic)** | Longest demonstrated autonomous build in this class; ~2h / 5,500 LOC on $10 budget | ~$10 per 1M tokens |
| **Claude Sonnet 5** | Cheaper mid-tier; shorter agentic runs, faster but less sustained | ~$3-5 per 1M tokens |
| **GPT-5.6 / Gemini 3.6** | Strong native multimodal; better at watching output, but no public equivalent long-horizon world-build demo | varies |
| **Game engine + coding agent (three.js + Claude Code/Codex)** | `hkalbasi`'s HN suggestion: "a game engine and a coding agent... will probably cost much more, but it will have almost zero consistency problems" | engine free; agent tokens add up |

## Verdict

Claude Opus 5's LoTR render is the strongest public evidence yet that frontier models can sustain **hours-long, budget-constrained, fully autonomous builds** — and the clearest picture of what still breaks: native perception of the output medium. If you need one-off custom worlds and can tolerate jank, this is the most cost-effective path that exists today. If you need consistent, auditable renders, pair the model with a real engine and keep the human in the loop.

**Rating: 8.0/10.** Best for prototyping generative worlds and evaluating long-horizon agentic coding. Watch for native video-in capability — that is the unlock that turns "kind of janky but fun" into production-grade.
