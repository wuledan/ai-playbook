---
title: "GLM-5.3 Review — Post-Training Scaling Puts Open Weights Within a Hair of Mythos 5"
date: 2026-08-15
author: "AIPlaybook Editorial Team"
category: "Frontier Models"
tags:
  - "GLM"
  - "Z.ai"
  - "Open-weights"
  - "Coding"
  - "Cybersecurity"
  - "Agentic"
  - "Post-training"
cover: /images/reviews/glm-53-review-2026/cover.png
meta_description: "GLM-5.3 is Z.ai's new frontier flagship built on the GLM-5.2 base with post-training only. Terminal-Bench 3.0 jumps 4.6→28.3, DeepSWE v1.1 46.2→66.9, Agents' Last Exam 23.8→28.5. It scores 84.5% on CyberGym (vs Mythos 5's 83.8%) and 54.4% on ExploitBench (up from 24.4%), and its security sweep found 2,436 vulnerabilities across 269 open-source projects. Weights ship in two weeks; API 'coming soon'; Coding Plan subscribers get it today. Review covers benchmarks, the Z.ai Code Bench private eval, the security disclosure ledger, and the HN debate on whether open cyber-capable models change the calculus."
rating: 8.3
dimensions:
  ease-of-use: 7
  features: 9
  value: 9
  performance: 9
  ecosystem: 8
pros:
  - "Terminal-Bench 3.0 jumps from 4.6 to 28.3 and DeepSWE v1.1 from 46.2 to 66.9 — pure post-training gains on the same GLM-5.2 base, with no architecture change"
  - "CyberGym score of 84.5% edges out Mythos 5 (83.8%) and GPT-5.6 Sol (83.6%) on vulnerability discovery, and ExploitBench more than doubles from 24.4% to 54.4%"
  - "Real-world security sweep: 2,436 vulnerabilities found across 269 open-source projects (1,097 critical/high), disclosed via a public CVD ledger — one single-shot RCE fix in US software included"
  - "Z.ai Code Bench shows better token efficiency: 34.5% at ~75K output tokens at Max effort vs GLM-5.2's 23.4% at 96K tokens"
  - "Open weights in two weeks — the only frontier-class model in this capability band that will be freely downloadable"
  - "Coding Plan pricing remains far below US rivals: HN users report 3-4x more quota per dollar than GPT-5.6 Sol, with 98%+ cache hit rates"
cons:
  - "Text-only again: no multimodal input, which excludes screenshot-driven workflows some users rely on ('nixes these for some of my main use cases' — zmmmmm)"
  - "API access is 'coming soon' — currently only Coding Plan subscribers can use it; OpenRouter/third-party hosting depends on the two-week weights release"
  - "Weights release delayed by safety hardening: Z.ai says two weeks, and HN skeptics question what 'hardening' means for a model already demonstrated to exploit flaws"
  - "Still 'shy of Sol and Fable, but only just by a hair' per HN tester aliljet — the closed frontier (Mythos 5: 181/247 tasks on exploit-chain benchmarks) retains a gap at the deep end"
  - "GLM-5.2's long-thinking quirks carried over: some users report thinking 'forever' and stopping mid-task, though that is partly harness/vendor dependent"
best-for: "Developers and security teams who want frontier-class coding and vulnerability-discovery capability at open-weights prices, without US approval processes or usage guardrails"
price: "GLM Coding Plan subscription (credit-based, 3-4x more quota per dollar than GPT-5.6 Sol per HN users); API pricing TBA — GLM-5.2 API is $1.4/$4.4 per 1M tokens (input/output)"
---

## Quick Verdict

GLM-5.3 is Z.ai's statement release: the same base model as GLM-5.2, every gain from post-training, and a headline capability nobody expected — vulnerability discovery that beats Anthropic's restricted Mythos 5 on the CyberGym benchmark (84.5% vs 83.8%). On pure coding, the improvements are dramatic: Terminal-Bench 3.0 from 4.6 to 28.3, DeepSWE v1.1 from 46.2 to 66.9, Agents' Last Exam from 23.8 to 28.5. Z.ai backs the benchmark claims with a public vulnerability-disclosure ledger documenting 2,436 findings across 269 open-source projects.

The catch list is short but real: it is text-only, the API is "coming soon," and weights arrive in two weeks after what Z.ai calls safety evaluation and hardening. For HN's working developers the economics already win — Coding Plan subscribers get 3-4x more quota per dollar than GPT-5.6 Sol — and once weights drop, this becomes the first frontier-class cyber-capable model anyone can host. That is why the thread hit 1,016 points in hours.

**Rating: 8.3/10** — the best open-weights coding model available, with a security capability that forces a conversation.

## What's New: Post-Training Only

Z.ai is explicit that GLM-5.3 shares GLM-5.2's base model. The release note opens: "It uses the same base model as GLM-5.2 — every gain comes from post-training." The stack carries over from 5.2: IndexShare for long-context processing, SAO for RL on long-horizon tasks, and slime, Z.ai's open-source post-training framework for RL scaling (Megatron on training, SGLang on rollout, single dataflow for math/code/sandbox/verifier/agentic environments).

This matters because the gains hold on long tasks, not just short ones. The claimed benchmark trajectory:

| Benchmark | GLM-5.2 | GLM-5.3 | Δ |
|-----------|---------|---------|---|
| Terminal-Bench 3.0 | 4.6 | 28.3 | +23.7 |
| DeepSWE v1.1 | 46.2 | 66.9 | +20.7 |
| Agents' Last Exam | 23.8 | 28.5 | +4.7 |
| ExploitBench | 24.4% | 54.4% | +30.0pp |
| CyberGym | — | 84.5% | vs Mythos 5: 83.8% |
| GDPval-AA v2 (44 occupations) | — | 1769 | — |

Z.ai also introduced Z.ai Code Bench, a private benchmark evaluating coding agents in realistic local dev environments: end-to-end task completion plus fine-grained checklist accuracy across effort levels. The headline there is efficiency, not just quality — at Max effort GLM-5.3 hits 34.5% at ~75K output tokens per task vs GLM-5.2's 23.4% at 96K. Fewer tokens per completed task means real cost savings at scale.

## The Cyber Capability: Benchmarks and Real World

The surprise of the release is security. Z.ai trained vulnerability-discovery data and environments into the post-training mix and watched the capability compound: "GLM-5.3 did not simply become better at identifying isolated flaws: it began to reason across multiple stages" of the exploitation chain.

- **CyberGym: 84.5%** — ahead of Mythos 5 (83.8%) and GPT-5.6 Sol (83.6%) on vulnerability discovery
- **ExploitBench: 54.4%** — more than double GLM-5.2's 24.4%
- Z.ai's own caveat: the advantage sits at the front of the exploitation chain; deep exploitation and full attack/defense tasks remain weaker than the closed frontier

The real-world evidence is the part that moved HN. Since GLM-5.2, Z.ai has worked with security teams running the model against real codebases. After expert review and deduplication: **2,436 vulnerabilities across 269 projects**, 1,097 critical/high severity, with findings spanning system kernels and widely-deployed US software. The public ledger (cvd.z.ai) shows 53 publicly disclosed, 2,383 under embargo. One commenter noted a single-shot Remote Code Execution fix in US software that "Anthropic's Project Glasswing was supposed to find a while ago."

## Pricing & Access

GLM-5.3 is not on the public API yet — docs say "The GLM-5.3 API is coming soon" — but it is live for all GLM Coding Plan subscribers today. The Coding Plan moved to credits; HN users report:

- **3-4x more quota per dollar** than GPT-5.6 Sol (scotty79: "I pay 3-4 times less for larger quota than gpt-5.6-sol")
- **98%+ cache hit rate** — KronisLV's session log showed 56.91M cached / 1.23M uncached tokens (97.9% hit), with repeated context billed at the cheaper cached rate
- **1.5x limited-time quota boost through August 31** — stacking with cache savings to ~180% of standard quota
- Current plan is credit-based with peak/off-peak windows (multiple legacy plan flavors exist, which HN calls confusing)

For comparison, GLM-5.2's API pricing is $1.4 input / $4.4 output per 1M tokens with cached input at $0.26. The open weights (due in two weeks) mean third-party hosts like OpenRouter, Together, and DeepInfra will set their own prices — historically 30-60% below API list for GLM models.

## Community Verdict

The HN thread (1,016 points, 501 comments) split into three camps. The working-developer camp is pragmatic: "If GLM is better, I'm here for it, as I think GLM is also cheaper than K3" — SwellJoe, who switched security work to Kimi K3 and DeepSeek after US models began refusing. The security-access camp is frustrated with the closed frontier: "Your tools refusing to do your bidding is an absurd idea in the first place. Imagine asking for permission to use your hammer" — spaceman_2020. And the skeptic camp questions the benchmark story: "This is absolutely still shy of Sol and Fable, but only just by a hair" — aliljet; "It's not like you will be allowed to use Fable... for anything cybersecurity-related unless your name is 'Dario Amodei'" — kouteiheika.

Two recurring caveats: GLM-5.2's long-thinking behavior (thinking "forever" and stopping mid-task) appears to carry over, though commenters attribute much of it to harness incompatibilities and vendor hosting quality; and the two-week weights delay drew questions about what "hardening" means — "They already evaluated it and found it to be highly capable at exploiting security vulnerabilities. So we know it is not 'safe'" — cubefox.

## Alternatives

- **Kimi K3 (Moonshot)** — The other Chinese frontier used by HN security practitioners; similar price band, different benchmark profile.
- **DeepSeek V4 Pro** — Cheaper for high-volume text work; 13-26x cheaper than Gemini on text tasks per earlier comparisons, weaker on agentic coding than GLM-5.3.
- **Mythos 5 / Fable 5 (Anthropic)** — Still ahead on the deep end of exploit chains (181 vs 247 tasks on Z.ai's own comparison), but requires corporate whitelisting for security work and refuses security-adjacent prompts even when approved.
- **GPT-5.6 Sol (OpenAI)** — Slightly ahead on CyberGym-adjacent evals per Z.ai's numbers (83.6% vs 84.5%), far more expensive per token, and its Daybreak Blue variant is "just Sol with fewer guardrails" per HN.
- **GLM-5.2** — Still a solid open model; if you don't need the new capability, it's cheaper on third-party hosts and already supported by DwarfStar and other local runners.

## FAQ

**Q: When will GLM-5.3 weights be released?**
A: Z.ai says the open weights will be publicly available "in two weeks" after safety evaluation and hardening are complete. The API is listed as "coming soon"; only Coding Plan subscribers can use GLM-5.3 right now.

**Q: Is GLM-5.3 multimodal?**
A: No — it is text-only (input modality: text; output: text), with 1M context and 128K max output tokens. HN users flagged this as a real gap for screenshot-driven workflows; a separate small vision model as a "seeing-eye dog" is a workaround some use.

**Q: How much does GLM-5.3 cost?**
A: Today, it's included in GLM Coding Plan subscriptions (credit-based; users report 3-4x more quota per dollar than GPT-5.6 Sol). API pricing is not yet published; GLM-5.2 sits at $1.4/$4.4 per 1M tokens, and third-party hosts typically undercut that.

**Q: What is the Z.ai Code Bench?**
A: Z.ai's private benchmark for coding agents in realistic local environments, measuring end-to-end completion and checklist accuracy across effort levels. GLM-5.3 improves 50% over GLM-5.2 there while using fewer output tokens.

**Q: Is GLM-5.3 actually better at finding vulnerabilities than Mythos 5?**
A: On the CyberGym benchmark, yes: 84.5% vs 83.8%. On real-world codebases, Z.ai documents 2,436 findings across 269 projects. Z.ai itself notes the advantage is at the front of the exploitation chain — deep exploitation and full offense/defense still favor the closed frontier.

**Q: Can I run GLM-5.3 locally?**
A: Once weights drop (two weeks), yes — but expect heavy hardware. HN estimates at least 2x DGX Sparks for 2-bit quant, 4x for 4-bit; the practical sweet spot remains hosted inference via Coding Plan or third-party providers.
