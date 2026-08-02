---
title: "AI SVG Benchmark 2026 — 14 Models Draw a Frog With a Habsburg Jaw (Comparison)"
date: 2026-08-03
author: "AIPlaybook Editorial Team"
category: "Comparisons"
tools:
  - "Claude Opus 5"
  - "Claude Sonnet 5"
  - "Claude Haiku 4.5"
  - "GPT-5.5"
  - "GPT-5.4 Mini"
  - "Gemini 2.5 Pro"
  - "Gemini 3.6 Flash"
  - "Grok 4.5"
  - "DeepSeek V4 Pro"
  - "Kimi K3"
  - "GLM 5.1"
  - "Qwen 3.7 Max"
  - "Llama 4 Maverick"
  - "Mistral Large 2512"
tags:
  - "AI-Benchmark"
  - "SVG-Generation"
  - "Spatial-Reasoning"
  - "Model-Comparison"
  - "Claude"
  - "GPT"
  - "Gemini"
  - "Grok"
  - "DeepSeek"
  - "Kimi"
  - "Qwen"
  - "Mistral"
  - "Llama"
  - "GLM"
cover: "/images/comparisons/ai-svg-benchmark-habsburg-frog-2026/cover.png"
meta_description: "Frogs.vaguespac.es ran one prompt — 'Generate an SVG of a frog with a Habsburg jaw' — across 14 frontier models, 42 runs total. Which models nail the anatomical feature, which silently add crowns and royal robes, and what the results reveal about spatial reasoning and interpretive drift in 2026's leading LLMs."
rating: 7.6
dimensions:
  ease-of-use: 8
  features: 7
  value: 8
  performance: 7
  ecosystem: 6
pros:
  - "One fixed prompt, three runs per model, 14 models — the cleanest cross-model SVG benchmark released in months, with full raw SVGs and per-run timing published"
  - "The 'Habsburg jaw' framing is a genuinely good benchmark design: it combines a common animal with a specific anatomical feature models associate with royalty, exposing interpretive drift"
  - "Opus 5 produced the most anatomically coherent frogs; Claude Haiku and Llama 4 Maverick were fastest (6-7s) while staying recognizable"
  - "Byte-identical outputs from Mistral Large expose deterministic-cache behavior that other benchmarks miss"
  - "Real data throughout: 42 runs, per-model latency, SVG byte sizes, and code-comment analysis on every artifact"
cons:
  - "SVG generation is a narrow proxy — passing it correlates with model quality but not with coding, reasoning, or agentic performance"
  - "7 of 14 models silently imported royalty (crowns, robes, medals) into a prompt that named only an anatomical feature — interpretive drift is widespread"
  - "DeepSeek V4 Pro and Kimi K3 were very slow (140-169s per run), which matters for interactive use"
  - "Single-prompt design means one bad run can skew a model's result; three tries mitigates but does not eliminate variance"
  - "The benchmark is brand new (August 2026) — no longitudinal data yet to track improvement"
best-for: "Anyone choosing a model for code-generation or structured-output tasks where spatial reasoning matters, and benchmark enthusiasts comparing frontier LLMs"
price: "Free benchmark site (frogs.vaguespac.es); API costs vary by model — from ~$0.10/M (Haiku-class) to ~$10/M (Opus-class)"
---

## Quick Verdict

On August 2, 2026, an anonymous developer launched **frogs.vaguespac.es** — a dead-simple but surprisingly revealing benchmark: *one prompt, every model: "Generate an SVG of a frog with a Habsburg jaw."* Each model gets three tries a month. The August 2026 edition ran **14 models, 42 runs, and all 42 produced an SVG** — making it the cleanest cross-model structured-output comparison published in months (76 points on HN, 41 comments).

The headline finding is not which frog looks best. It's that **7 of 14 models silently imported royalty into a prompt that named only an anatomical feature** — crowns, imperial collars, "Order of the Golden Fleece" medals — because "Habsburg" is a dynasty. That interpretive drift, plus big variance in latency (6.1s to 169.1s per run), is the real signal. At **7.6/10**, this benchmark is Silver-plus: simple, transparent, and genuinely diagnostic.

---

## The Benchmark Design (Why It Works)

The prompt is a deliberate upgrade on the tired "pelican on a bicycle" test. As the creator (`thebigship`) explained on HN:

> "This one has advantages over the 'pelican riding a bicycle' one because it hinges on an anatomical feature that many models associate with royalty — 'habsburg' being a lineage and 'habsburg jaw' being an anatomical feature."

That design pays off immediately: models must (a) know what mandibular prognathism is, (b) render a *frog* with that protruding jaw, and (c) resist importing the dynasty's iconography. The site publishes every raw SVG, per-run latency, byte size, and — most usefully — an analysis of the **code comments** inside each SVG, which expose what the model *thought* it was doing.

Each model gets three tries per month, and the benchmark reruns monthly — giving a longitudinal view most ad-hoc tests lack.

## The 14 Models, Head to Head

### Latency (Run 1, August 2026)

| Model | Provider | Latency | SVG size |
|-------|----------|---------|----------|
| Claude Opus 5 | Anthropic | 64.0s | 3,900 B |
| Claude Sonnet 5 | Anthropic | 7.1s | 1,237 B |
| Claude Haiku 4.5 | Anthropic | 6.1s | 2,553 B |
| GPT-5.5 | OpenAI | 19.4s | 4,833 B |
| GPT-5.4 Mini | OpenAI | 10.8s | 3,394 B |
| Gemini 2.5 Pro | Google | 39.6s | 808 B |
| Gemini 3.6 Flash | Google | 34.9s | 10,891 B |
| Grok 4.5 | xAI | 15.4s | 2,126 B |
| DeepSeek V4 Pro | DeepSeek | 139.7s | 7,845 B |
| Kimi K3 | Moonshot | 169.1s | 2,448 B |
| GLM 5.1 | Z.ai | 40.8s | 5,567 B |
| Qwen 3.7 Max | Alibaba | 28.8s | 2,376 B |
| Llama 4 Maverick | Meta | 6.9s | 536 B |
| Mistral Large 2512 | Mistral | 10.0s | 1,951 B |

### The Interpretive Drift Problem

The most striking pattern: **half the field added royal iconography the prompt never asked for.**

- **Gemini 3.6 Flash** went furthest — "Royal Imperial Collar," "Imperial Habsburg Crown," "Golden Fleece Medal," plus mood descriptors ("Folded Pompously," "Sad/Weary facial lines") and medical framing ("weak maxilla," "Habsburg lethargic look").
- **DeepSeek V4 Pro** added "substantial unrequested royal framing" — robes and an "Order of the Golden Fleece" medal.
- **GLM 5.1** and **Qwen 3.7 Max** both added crowns with code comments explicitly noting "(because Habsburg)".
- **Claude Opus 5** editorialized anatomically ("massive protruding mandible," "recessed, tucked behind the jaw") but stayed in the anatomical lane — the most disciplined interpretation.
- **Claude Sonnet 5, GPT-5.4 Mini, Gemini 2.5 Pro, Llama 4 Maverick** produced clean SVGs with no code comments at all.

The lesson: "Habsburg" is doing double duty as a dynasty name and an anatomical descriptor, and most models cannot keep the two apart. For anyone using LLMs to generate structured output from domain-specific prompts, this is a concrete warning about **silent feature injection**.

### Determinism Red Flag: Mistral

`mistralai/mistral-large-2512` produced **2 byte-identical SVGs out of 3 runs** — identical down to the byte. HN commenter `n00bskoolbus`: "The identical pair from Mistral took me off guard... many of the other models were so varied between the runs." `fwip` wondered whether "the setup accidentally hit a cache at some layer." Either way, deterministic-by-default output is a real behavior to know about if you rely on Mistral for variety in generated assets.

### Community Verdict on Quality

- `getnormality`: "This is a strong benchmark! None of these could be remotely mistaken for human art. Opus 5 comes closest."
- `hn_throwaway_99`: "Kudos to Opus 5, I thought it was the only one that came close to passing... many of the failures drew the frog face OK, and they had some type of big blob for the jaw, so they knew 'Habsburg jaw' meant a protruding jaw, but it wasn't really connected to the frog face."
- `thebigship` (creator): "My favorite SVG was def the google/gemini-3.6-flash" — for artistic value, not fidelity.
- `leumon`: "Can you also try the new deepseek v4 flash?" → creator: "I will add it to next month's report!"

## What This Means in Practice

Three practical takeaways for teams using LLMs for code/structured output:

1. **Spatial reasoning is still the differentiator.** Opus 5's frogs actually connect the jaw to the face; most others render a jaw-shaped blob. If your task involves layout, geometry, or coordinate placement, the top-tier models still earn their premium.
2. **Latency varies by 27x.** 6.1s (Haiku) vs 169.1s (Kimi K3) for the same prompt. For interactive SVG/code generation, Haiku-class models are the practical choice unless quality demands the frontier.
3. **Prompt semantics leak.** If your domain terms have secondary meanings (brand names, dynasties, places), audit outputs for injected features — 50% of frontier models will add them.

## vs The Pelican Test

The pelican-on-a-bicycle test (popularized by Simon Willison) is now saturated — most models produce a recognizable pelican, and the differences are down to taste. The frog benchmark is harder precisely because it splits interpretation from anatomy: a model can nail the jaw shape and still fail by crowning the frog. It's a better test of *instruction fidelity*, which is exactly what enterprise structured-output workloads need.

## Verdict

Frogs.vaguespac.es is a small site with a sharp idea. As a one-prompt, three-run, 14-model comparison, it delivers more signal per page than most paid benchmarks — real latency data, real SVG artifacts, and a genuinely new failure mode (royalty injection) to watch for. The ranking that emerges: **Opus 5 for anatomical fidelity, Haiku/Llama for speed, Gemini 3.6 Flash for flair, and caution with DeepSeek V4 Pro and Kimi K3 on latency** — plus a note to check Mistral's deterministic output before relying on it for asset variety.

**Rating: 7.6/10.** Bookmark it; the monthly re-runs will be the longitudinal story of 2026's model generation gap.
