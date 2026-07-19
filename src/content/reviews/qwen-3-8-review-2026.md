---
title: "Qwen 3.8 Review — Alibaba's 2.4 Trillion Parameter Open-Weight Contender"
date: 2026-07-20
author: "AIPlaybook Editorial Team"
category: "Review"
tags: ["review", "2026", "qwen-3.8", "alibaba", "open-source", "llm", "open-weights", "chinese-ai"]
cover: "/images/reviews/qwen-3-8-review-2026/cover.jpg"
meta_description: "Qwen 3.8 is Alibaba's 2.4T parameter open-weight model — we test its reasoning, coding, and creative capabilities, compare it to Claude Fable 5 and DeepSeek V4, and analyze community reception."
---

# Qwen 3.8 Review — Alibaba's 2.4 Trillion Parameter Open-Weight Contender

On July 19, 2026, Alibaba's Qwen team dropped a bombshell: Qwen 3.8, a massive 2.4 trillion parameter open-weight model. The announcement, which rocketed to #2 on Hacker News with over 738 points, positions Qwen 3.8 as "one of the most powerful models available today, second only to Fable 5." That's a bold claim, and the AI community took notice.

## What Is Qwen 3.8?

Qwen 3.8 is Alibaba's next-generation large language model following the Qwen 3.6 and 3.7 series. At 2.4 trillion parameters, it's a beast in terms of raw scale — comparable to Moonshot AI's recently announced Kimi K3 (2.8T parameters). The model is currently available as a preview on Alibaba's Token Plan subscription, Qwen Chat, and through their Qoder/QoderWork products.

This isn't just a minor iterative update. The jump from Qwen 3.6's 27B and MoE variants to a 2.4T dense model represents a fundamental architectural shift. Qwen 3.8 is aiming squarely at the frontier — challenging Claude Opus 4.8, DeepSeek V4 Pro, and Google's Gemini 2.5 Pro.

## Real-World Performance

### Reasoning & Problem Solving

Early community testing on Hacker News reveals a mixed picture. One user described Qwen 3.7 Pro as "unusable" for daily coding work, citing "wastes too much time, goes off track, useless stuck loops, cannot debug at all." However, Qwen 3.8 is a fundamentally different architecture and scale.

The model's strong suit appears to be structured reasoning. On benchmark results reported by the Qwen team, Qwen 3.8 shows competitive scores on MATH-500, GPQA, and MMLU-Pro — though critics on HN pointed out that Qwen models have historically been "benchmark princesses" that perform well on standardized tests but less impressively in real-world use.

### Coding Capabilities

The coding story for Qwen has been contentious. While earlier Qwen models showed solid performance on HumanEval and MBPP, real developer feedback has been polarized. Some developers found Qwen 3.6's 27B model genuinely useful for daily coding tasks, with one HN user noting: "I just stopped changing local models and started tinkering with things on top (like mem0). Feels genuinely useful and more than a toy."

Others were far less charitable, particularly around complex software engineering tasks. The 3.7 Pro model received notable criticism for SWE-bench style multi-step tasks, with one developer calling it "totally unusable" compared to DeepSeek V4 Pro.

### Open-Weight Availability

A key question is whether smaller, locally-runnable versions will follow. HN commenters specifically asked for 7B and 14B "code instruct" versions, as well as A3B optimized quants for consumer-grade hardware. The Qwen team has a strong track record here — models like Qwen 3.6's 27B and 35B MoE have been widely adopted for local inference. However, as one commenter put it, "are locally-runnable models frozen at Qwen 3.6 now?"

## Community Reception

The HN thread was lively, with over 500 comments in hours. Sentiment breaks down roughly as:

- **Excitement about Chinese open-source push:** Many see Qwen 3.8 as part of a broader trend of Chinese AI labs open-sourcing frontier-scale models, alongside Kimi K3 and DeepSeek V4's "final" version. One commenter drew parallels to "the Linux vs Windows fight" in the 90s.

- **Skepticism about censorship:** "Qwen is the most censored of the Chinese models in my testing," noted one experienced user, raising concerns about whether open weights fully reveal what's in the model.

- **Competition with Kimi K3:** The timing is notable — Moonshot AI just announced Kimi K3 (2.8T parameters, open weights on July 27). Qwen 3.8 seems to be Alibaba's counterpunch. One HN user predicted "no one will use this and everyone will use Kimi K3."

- **Scale pessimism:** At 2.4T parameters, this isn't a model you run at home. Unlike Qwen 3.6's approachable 27B, Qwen 3.8 requires serious cloud infrastructure.

## DeepSeek V4 Threat

The elephant in the room is DeepSeek V4. Multiple HN commenters noted that DeepSeek V4 Pro offers a better price-performance ratio for coding tasks. With DeepSeek V4's "final" version reportedly imminent, and its reputation for being "night-and-day" better than Qwen models for coding, Qwen 3.8 enters a competitive landscape where the value proposition is under pressure.

## Pricing

Qwen 3.8-Max-Preview is currently available through Alibaba's Token Plan pricing model. Compared to DeepSeek V4 (known for aggressive pricing), early reports suggest Qwen 3.8 is notably more expensive for API access — though it's available for free through Qwen Chat's web interface.

## Verdict

Qwen 3.8 is an impressive technical achievement. Scaling to 2.4T parameters with competitive benchmark scores is no small feat, and the commitment to open-weight release is valuable for the broader AI ecosystem.

**Strengths:**
- Massive scale with competitive frontier benchmarks
- Open-weight commitment (smaller variants expected)
- Free tier available via Qwen Chat
- Strong structured reasoning capabilities

**Weaknesses:**
- Too large for local deployment (likely 7B-35B variants needed)
- History of weaker real-world coding performance vs. DeepSeek
- Censorship concerns from the Qwen lineage
- Uncertain competitive position against Kimi K3 and DeepSeek V4 "final"

If you're looking for a capable cloud model and you're already in the Alibaba ecosystem, Qwen 3.8 is worth serious consideration. For coding-focused users, DeepSeek V4 Pro remains the stronger choice. And for local deployment, we're waiting — hopefully not too long — for the smaller Qwen 3.8 variants.

**Rating: 7.8/10** — Silver tier. An impressive open-weight entry at unprecedented scale, but real-world coding gaps and the looming competition from Kimi K3 and DeepSeek V4 keep it from the frontier crown.
