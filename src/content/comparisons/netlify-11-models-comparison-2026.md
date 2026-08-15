---
title: "One Prompt, 11 Models: Netlify's Real-World AI Site-Building Comparison 2026"
date: 2026-08-16
author: "AIPlaybook Editorial Team"
category: "AI Coding"
tags:
  - "Netlify"
  - "Claude"
  - "GPT"
  - "Gemini"
  - "Kimi"
  - "GLM"
  - "DeepSeek"
  - "Model-Comparison"
  - "AI-Coding"
  - "Agent-Runners"
cover: /images/comparisons/netlify-11-models-comparison-2026/cover.png
meta_description: "Netlify ran one identical prompt through 11 frontier AI models to build the same coffee shop website — credit costs ranged from 2.4 to 519 per run. We break down the full results table, quality differences, and what the 218-point HN discussion concluded about cost vs. quality."
tools:
  - "Claude Opus 5"
  - "Claude Sonnet 5"
  - "GPT 5.6 Sol"
  - "GPT 5.6 Terra"
  - "Gemini 3.6 Flash"
  - "Gemini 3.1 Pro"
  - "Kimi K3"
  - "Kimi K2.7 Code"
  - "GLM 5.2"
  - "DeepSeek V4 Pro"
  - "DeepSeek V4 Flash"
---

## Quick Verdict

On August 12, 2026, Netlify published the first installment of a real-world model bake-off: **one identical prompt, 11 models, three runs each, all building the same neighbourhood coffee shop website** inside Netlify's Agent Runners. The results are the most useful cost-vs-quality dataset we have seen this year — and the spread is enormous. The same task cost **519 credits on average with Claude Opus 5, and 2.4 credits with DeepSeek V4 Flash (0731)** — a **216x cost difference** between the most and least expensive runs. GPT 5.6 Terra delivered a different but genuinely worthwhile design language for 39 credits, GLM 5.2 produced surprisingly varied results for 27, and Gemini 3.1 Pro spent 53 credits to generate "really nothing to see." If you pay for AI site building on credits, this dataset changes how you should spend them.

## The Test Setup (Why This Comparison Is Trustworthy)

Netlify's principal product manager Elad Rosenheim ran the experiment through **AXIS**, Netlify's open-source framework for automatically evaluating coding agents. Each model received the exact same prompt:

> Build a one-page site for a neighbourhood coffee shop: opening hours, the address, a short menu and a photo. Nothing on it changes unless I edit it myself.

The last sentence was an explicit hint that no CMS or database is needed. Models were run with **default settings**, three times each, and the results are live pages you can click through. Notably, **GPT 5.6 Sol was run at "low effort" by default** — Netlify's deliberate choice to position it as a more economical alternative to Opus, with the effort setting now exposed to users.

This matters because most model comparisons use abstract benchmarks. Here, every model produced an actual artifact — a deployable website — and the cost is measured in the credits Netlify users actually pay.

## The Full Credit Cost Table (Real Data, 3 Runs Per Model)

| Model | Avg cost/run | Run 1 | Run 2 | Run 3 |
|-------|-------------|-------|-------|-------|
| Claude Opus 5 | **519** | 253 | 249 | **1,055** |
| Claude Sonnet 5 | 143 | 81 | 245 | 103 |
| GPT 5.6 Sol (low effort) | 141 | 173 | 158 | 92 |
| Gemini 3.6 Flash | 103 | 109 | 91 | 111 |
| Kimi K3 | 102 | 125 | 95 | 86 |
| Gemini 3.1 Pro | 53 | 57 | 52 | 49 |
| GPT 5.6 Terra | 39 | 43 | 23 | 49 |
| DeepSeek V4 Pro | 37 | 47 | 30 | 33 |
| GLM 5.2 | 27 | 15 | 42 | 24 |
| Kimi K2.7 Code | 19 | 21 | 18 | 17 |
| DeepSeek V4 Flash (0731) | **2.4** | 3.4 | 1.3 | 2.5 |

**Context for the numbers:** the Netlify free plan includes 300 credits, Personal includes 1,000, Pro includes 3,000, and additional credit packs are $10 per 1,500 credits. So one Opus 5 run at 519 credits costs roughly **$3.46 on top of plan credits** — and its single 1,055-credit outlier run costs about **$7.03**. Meanwhile, 10 DeepSeek V4 Flash runs at 2.4 credits average would cost about 24 credits total — well inside the free plan.

## Model-by-Model Breakdown

### Claude Opus 5 (519 avg) — The Quality King With a Spend Problem

The 1,055-credit run produced the most delightful page of the whole test: a "stamp-like" coffee-bean text element, a custom map, dark mode out of the box. But the *average* hides a wild distribution — 253, 249, then 1,055. Netlify's own observation: "in all the tests I've done, Opus does have a tendency to run off with excessive credit usage (compared to its typical baseline) more than other models. It does not guarantee a worse or better outcome, though."

### Claude Sonnet 5 (143 avg) — Solid, Simpler

The three runs at 81/245/103 credits still have "some delightful detail," just less of it, with noticeably simpler vector graphics — "not really something you'd consider for a live site." A clear step down from Opus in this design-focused task.

### GPT 5.6 Sol, low effort (141 avg) — Beats Sonnet on Design Intuition

Netlify's verdict: "OpenAI's top-tier model in low effort mode wins over Anthropic's mid-tier model when it comes to basic design intuition." More content richness, no funky vector shapes — though the images lean generic. At roughly the same price as Sonnet 5, this is a strong value signal for OpenAI's effort dial.

### GPT 5.6 Terra (39 avg) — The Surprise Contender

Going one tier down (Sol→Terra→Luna), Netlify expected the same drop they saw from Opus to Sonnet. Instead: "Terra has a different visual language, and not a necessarily worse one." Two minor visual glitches (a missing image, low-contrast text over an image) but nothing fatal. At 39 credits, Terra is the model Netlify's own author would run twice — "Opus 5 and GPT 5.6 Terra, and get two very different but worthwhile takes."

### Gemini 3.6 Flash vs 3.1 Pro (103 vs 53 avg) — Generations Apart

This is the most damning comparison in the dataset. Gemini 3.1 Pro — the older generation — spent 53 credits to produce "really nothing to see. Yes, these are wholly separate runs. It did what we asked in the prompt, and really nothing more." Gemini 3.6 Flash, a whole generation newer, worked much harder on content at 103 credits — with the caveat that "all models repeat themselves, but it seems like Gemini might repeat itself even more."

### Kimi K3 vs K2.7 Code (102 vs 19 avg) — Right Tool, Wrong Test

Kimi K3 is built for long-horizon agentic tasks, "to take on Fable 5 more than Opus 5" — so a narrow design task doesn't show its strengths. At 102 credits it doesn't particularly shine here. Kimi K2.7 Code at 19 credits: "in terms of design or content there's really not much to see here," despite hype around K2.6's visual capabilities.

### GLM 5.2 (27 avg) — Cheap, Varied, Maple-Obsessed

The three runs (15/42/24 credits) are "as if coming from a few different models" — ignoring GLM's "love for maple," the results vary wildly. Netlify's advice: at this price, run it a few times before settling. One structural limitation: GLM 5.2 is text-only, so it can't take screenshots from users for design inspiration — something the Kimi models can do.

### DeepSeek V4 Pro vs V4 Flash 0731 (37 vs 2.4 avg) — The Cost Kings

V4 Pro at 37 credits "does not provide inspiring results" — and the middle run shipped a **broken image** (HTML pointing at an image file that doesn't exist), which Netlify notes is "a lot less likely to occur nowadays with any of the commercial models." But V4 Flash 0731 is the story of the dataset: **2.4 credits average — 216x cheaper than Opus 5** — and the middle run "doesn't just look the most like what a mid-tier closed model might give you, but also feels the same in terms of language, and has actually consumed the least credits among all runs."

## What We Learned — The 5 Takeaways

1. **Cost and quality are not linearly related.** Opus 5's 519-credit average is 216x DeepSeek V4 Flash's 2.4 — but the cheapest run in the entire dataset (1.3 credits) was also one of the best-looking mid-tier results. Price is a *ceiling* on what a model might produce, not a guarantee of it.

2. **The mid-tier is the value zone.** GPT 5.6 Terra (39), DeepSeek V4 Flash (2.4), GLM 5.2 (27), and Kimi K2.7 Code (19) all produce usable results for a fraction of frontier cost. For iteration-heavy work — generate, review, regenerate — cheap models let you run 10x more attempts for the same credits.

3. **Effort settings are the new pricing lever.** GPT 5.6 Sol at low effort (141) beat Claude Sonnet 5 (143) on design intuition at the same price. The model vendor's effort dial is becoming as important as the model choice itself.

4. **Generation gaps dominate model choice.** Gemini 3.1 Pro vs 3.6 Flash is a night-and-day difference at 2x the cost for the newer one. Old-generation models at any price are a trap.

5. **Single runs are noise.** Opus 5's 253/249/1,055 spread and GLM's 15/42/24 spread show why any one-run comparison is meaningless. Budget for multiple runs — and for Opus specifically, budget for outliers.

## Community Reception (HN, 218 points, 95 comments)

The HN thread split into three camps:

- **"They all look the same" camp** — `isqueiros`: "If that's the entire prompt, it's quite depressing how much alike these all look. I appreciate some of the details from the Opus 5 version, but I can't help but strongly feel the AI vibes emanating from that design." `hombre_fatal` pushed back with the kitchen-to-bedroom analogy: "If you tell humans to go from their kitchen to their bedroom, they all stand up and walk the same way. Nobody decides to crab walk." `andy99` added historical perspective: "It's always been interesting to see how similar output is across ostensibly very different models. I remember testing short story writing in the early days and having the models all choose the same niche topic."

- **"Do coffee shops need websites at all?" camp** — `tantalor`: "Why does a coffee shop need a website anyway? Nobody is saying, 'man I would love to go to this coffee shop but I can't find their website.'" `miyoji` disagreed strongly: "I've skipped going to coffee shops and restaurants because they don't have a website, just a Facebook page. I don't use Meta products." `sorenjan` offered a real-world data point: "Just a few days ago I looked up a small coffee shop on Google Maps which claimed it was closed, but their own website had different opening hours showing it was open. Businesses should own their own communication."

- **"Blast radius" camp** — `mym1990` on the broader point: "Why does your brain instantly go to 'what's the cheapest and easiest way to do things' instead of 'what's creative, fun, interactive, usable, accessible'... This is the reason the world is slowly becoming a boring ass place."

The technical consensus: identical prompts produce convergent, average output across models — the differentiator is how you steer, iterate, and how many attempts your budget allows.

## Pricing Comparison

| Model | Avg credits/run | Cost at $10/1,500 credits | Relative to cheapest |
|-------|----------------|--------------------------|---------------------|
| Claude Opus 5 | 519 | ~$3.46 | 216x |
| Claude Sonnet 5 | 143 | ~$0.95 | 60x |
| GPT 5.6 Sol (low effort) | 141 | ~$0.94 | 59x |
| Gemini 3.6 Flash | 103 | ~$0.69 | 43x |
| Kimi K3 | 102 | ~$0.68 | 43x |
| Gemini 3.1 Pro | 53 | ~$0.35 | 22x |
| GPT 5.6 Terra | 39 | ~$0.26 | 16x |
| DeepSeek V4 Pro | 37 | ~$0.25 | 15x |
| GLM 5.2 | 27 | ~$0.18 | 11x |
| Kimi K2.7 Code | 19 | ~$0.13 | 8x |
| DeepSeek V4 Flash (0731) | 2.4 | ~$0.016 | 1x |

*Credit pack pricing: $10 per 1,500 credits (Pro add-on); free plan = 300 credits, Personal = 1,000, Pro = 3,000.*

## Who Should Choose Which Model

- **Claude Opus 5** — budget-blind quality seekers who want the most polished single artifact and accept 519 credits average with real outlier risk.
- **GPT 5.6 Terra** — the balanced pick: a genuinely different design language at 39 credits. Netlify's own author recommends pairing it with Opus for two-take ideation.
- **DeepSeek V4 Flash (0731)** — iteration machines. At 2.4 credits average you can run 50 attempts for less than one Opus run, and the best results look mid-tier-commercial.
- **Gemini 3.6 Flash** — content-heavy one-shot builds at 103 credits with a good modern-generation look.
- **GLM 5.2** — budget experimentation; run it several times (15-42 credit spread) and pick the best.
- **Avoid** — Gemini 3.1 Pro for design work (old generation, "nothing to see"), and DeepSeek V4 Pro unless you need its exact behavior (broken image in our test).

## FAQ

**Q: Is this comparison trustworthy?**
A: It's one of the most honest we've seen. Same prompt, default settings, three runs per model, live deployable results you can click through, and the methodology (AXIS, Netlify's open-source eval framework) is public. The author also openly flags subjective judgment calls and shows the raw per-run numbers rather than cherry-picked screenshots.

**Q: Why is GPT 5.6 Sol listed at "low effort"?**
A: Netlify runs Sol at low effort by default to position it as an economical alternative to Opus. The effort setting is now user-controlled, and the results show effort dials are a major cost lever — low-effort Sol (141) beat Sonnet 5 (143) on design intuition at the same price.

**Q: Should I pay for Opus 5 to build a website?**
A: For a one-shot flagship site, possibly — the 1,055-credit run was genuinely delightful. For iteration, no: at 519 credits average with runs as high as 1,055, you'll burn through a free plan in half a run. Run cheap models many times and keep the best.

**Q: What's the cheapest viable option?**
A: DeepSeek V4 Flash (0731) at 2.4 credits average — and its best run (1.3 credits) was one of the strongest cheap results. GLM 5.2 (27) and Kimi K2.7 Code (19) are the next rungs up.

**Q: Do these results apply to real web apps, not just coffee shop sites?**
A: Not yet — this is deliberately the simplest scenario. Netlify announced follow-up posts covering to-do apps with shared databases and AI-Gateway-powered apps, where "does it know which platform features to use" becomes the differentiator. Treat these numbers as design-and-copy costs, not full-app costs.

**Q: Where can I see the actual generated sites?**
A: Each model row in Netlify's post links to the live generated pages (three per model), and the full results are published on Netlify's report site. The AXIS evaluation framework is open source on GitHub.

## Verdict

This comparison is worth bookmarking for anyone who builds with AI agents on a budget. The headline numbers — **519 vs 2.4 credits for the same task** — are a 216x reminder that frontier models are a luxury, not a requirement, for simple generation work. The real insight is subtler: model choice matters less than iteration strategy. The cheapest run in the dataset produced one of the best results, and the most expensive model produced the worst outlier. Run cheap models many times, review hard, and reserve frontier spend for the final polish pass.

Netlify is also betting that more model choice equals more value for users — the OpenRouter partnership behind this test puts all 11 (and hundreds more) behind one Agent Runners interface. Whether that's a platform win or just more FOMO to manage, the dataset itself is the takeaway: **one prompt, eleven answers, and a 216x range in what they cost.**
