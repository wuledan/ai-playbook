---
title: "AirLLM Review 2026 — Run a 70B Model on a Single 4GB GPU (No Quantization, No Distillation)"
date: 2026-08-04
author: "AIPlaybook Editorial Team"
category: "Local LLM Inference"
tags:
  - "AirLLM"
  - "Local-LLM"
  - "GPU-Memory"
  - "Llama-70B"
  - "DeepSeek-V3"
  - "Kimi-K3"
  - "MoE"
  - "Open-Source"
cover: "/images/reviews/airllm-70b-4gb-gpu-review-2026/cover.png"
meta_description: "AirLLM (27k stars, Apache-2.0) runs 70B LLMs on a single 4GB GPU with no quantization, distillation, or pruning — by streaming layers and per-expert shards from disk. It now handles DeepSeek-V3 671B on ~12GB and Kimi K3 2.8T on under 4GB. Full review of how it works, real measured speeds (including 292 s/token on Kimi K3), who it's actually for, and the HN skepticism."
rating: 7.0
dimensions:
  ease-of-use: 7
  features: 8
  value: 7
  performance: 5
  ecosystem: 8
pros:
  - "Runs dense 70B models on a single 4GB GPU with zero quantization, distillation, or pruning — full-precision weights streamed from disk, so output quality is untouched"
  - "Scales to absurd sizes: Llama 3.1 405B on 8GB, DeepSeek-V3 671B on ~12GB, and Kimi K3 (2.8T, the largest open model ever) on under 4GB of VRAM"
  - "MoE-aware per-expert streaming: for sparse models it loads only the experts a token actually routes to, which is what makes 2.8T parameters fit in 3.72GB"
  - "27k GitHub stars, Apache-2.0 license, active maintenance with a v3.1.0 release in July 2026 and broad model support (Qwen, Llama 3.x/4, DeepSeek, Gemma, Phi-4, GLM, Baichuan, Mistral, InternLM)"
  - "One-line API: AutoModel.from_pretrained('repo-id') — familiar to any transformers user, with CPU inference and macOS support"
cons:
  - "Speed is the killer: Kimi K3 on an RTX 6000 Ada (48GB) runs at ~292 seconds per token — roughly 0.003 tokens/sec, unusable for interactive use"
  - "First-run layer splitting downloads and decomposes the model, requiring significant disk space and a long setup pass before inference starts"
  - "Documentation is thin — HN users called out 'nothing that I would call documentation, let alone concrete usage examples' beyond the quickstart"
  - "Requires specific dependency versions for newer models (flash-attn, CUDA 12 torch builds, transformers 4.56.x) that break the 'just works' promise"
  - "Community doubts long-term maintenance: multiple HN commenters see these memory-squeezing projects as vibe-coded and unlikely to survive"
best-for: "Batch and offline workloads — overnight jobs, sensitive-data processing that can't leave the machine, QA/refactoring sweeps — where a big model matters more than latency"
price: "Free, open source (Apache-2.0). Cost is your own hardware: a 4GB GPU plus enough system RAM/disk, or CPU-only inference on macOS"
---

## Quick Verdict

On August 3, 2026, AirLLM hit #9 on the Hacker News front page (176 points, 54 comments) with a claim that sounds impossible: **run a 70B large language model on a single 4GB GPU card — without quantization, distillation, or pruning.** The repo, 27,011 stars and Apache-2.0 licensed, does exactly that by streaming layers from disk instead of holding them in VRAM. And it has quietly escalated to the point where **Kimi K3 (2.8T parameters, the largest open-weight model released to date) runs on under 4GB of VRAM** via per-expert MoE streaming.

The catch, and it's a big one, is speed: ~292 seconds per token on Kimi K3. This is a tool for **offline and batch** work, not interactive chat. At **7.0/10**, AirLLM is a genuinely clever engineering solution for a narrow but real use case — with honest limitations that the HN thread was quick to quantify.

---

## How It Works: Streaming Layers, Not Squeezing Weights

AirLLM's core trick is architectural, not compression. Instead of quantizing weights (which degrades quality) or pruning (which removes capability), it keeps **full-precision weights on disk** and streams them through the GPU layer by layer:

1. On first load, the model is split into per-layer shards and saved to a `layer_shards_saving_path`.
2. During inference, only the **currently-active layer** is resident in VRAM; the rest live on disk (or in system RAM).
3. For **sparse MoE models** (DeepSeek-V3, Kimi K3, Qwen3-235B), it goes further — loading only the **experts a token actually routes to**, one expert at a time, rather than an entire layer.

That third point is what makes the headline numbers possible. MoE models route each token through a tiny fraction of their parameters. Kimi K3 is 2.8T total, but a token only touches a handful of experts — so AirLLM can stream those specific shards and keep VRAM at **3.72GB measured end-to-end on one RTX 6000 Ada**.

The GitHub README states the claims plainly:

> "AirLLM dramatically reduces inference memory usage, letting 70B large language models run on a single 4GB GPU card — without quantization, distillation, or pruning. You can even run 405B Llama 3.1 on 8GB, DeepSeek-V3 (671B) on ~12GB, and Kimi K3 (2.8T) — the largest open-source model released to date — on under 4GB."

Usage is a familiar one-liner:

```python
from airllm import AutoModel
model = AutoModel.from_pretrained("Qwen/Qwen3-32B")
# or 235B in ~3GB, DeepSeek-V3 in ~12GB, Kimi K3 in ~4GB
```

## What It Actually Costs You (Speed Numbers)

The HN thread produced the single most useful data point in the entire discussion. `imenani` posted the release-notes figure:

> "IIUC, Kimi K3 on RTX 6000 Ada (48GB) takes **292 s/token**."

Let's put that in human terms. `logicallee` did the math:

> "That's 0.003 tokens/second. To get an hour's work done that's normally 30 tokens/second (108k output tokens in an hour) will take **416 days** at this rate."

`throwawayffffas` estimated the energy cost at ~29.2 kJ per token ("15 AK47 bullets per token"). Even the HN humor circuit engaged: `malshe` — "I hope I'm not the only one who misread it as 292 tokens/s and got excited momentarily" — and the community's answer was a resounding "most definitely not."

To be fair, that worst case is specifically the 2.8T behemoth. Smaller models are far more usable — but the README doesn't publish a comprehensive speed table, which is itself a documentation gap. `bensyverson` asked the practical question: "Is anyone out there running a big Qwen for coding on a 16-32GB machine with these techniques?" `reactordev` reported 80-120 tok/s on an RTX 3080 with Gemma and Qwen 3.5 — but that's conventional in-VRAM loading, not AirLLM streaming.

## Who Is This Actually For?

The HN thread's most valuable contribution was separating genuine use cases from hype:

**Legitimate users:**
- `dsl`: "I've been building a SaaS that deals with data that can't be distributed to third parties. Some of the useful AI stuff I can add is **not time sensitive and can run overnight**. Things like this allow me to use higher quality models without selling my house for GPUs." — This is the killer use case: **private-data batch processing**.
- `nickpsecurity`: "If I could justify wear and tear and electricity, I was willing to do something like this for batch processing... QA or refactoring, on whatever software I wrote."
- `myshapeprotocol`: "Running 70B on a 4GB GPU is wild. Really impressive engineering feat for resource-constrained environments."
- `book_mike`: "This is the kind of efficiency we desperately need."

**Skeptics:**
- `classified`: "How a patchwork of Python modules constitutes an API... is beyond me. There is nothing that I would call documentation. I know more amusing ways to waste my time. When I want to play with models, I use llama.cpp."
- `roger_`: "Seeing a lot of these 'run 1TB models with 1GB RAM' projects recently. Most seem vibe coded and probably won't be maintained. Hoping a winner emerges with some real momentum behind it."
- `ilaksh` (sarcastic): "I guess the use case is something like: you have a slightly obsolete Mac or PC... and just need to compose one or more convincing spam emails, but it's fine if it takes a full week."

The pattern is clear: **the use case is batch, not interactive.** The project's own stated examples (overnight jobs, air-gapped data) align with the actual performance envelope.

## Technical Reality Check

The HN thread also surfaced genuine friction beyond speed:

1. **Dependency hell for new models.** Kimi K3 support requires `pip install compressed-tensors flash-attn`, a CUDA 12 torch build (no prebuilt flash-attn wheels exist for CUDA 13), and `transformers` 4.56.x — "its remote code does not load on 5.x." This directly undercuts the "one-line API" pitch for frontier models.
2. **Disk footprint.** Layer splitting means the model is stored decomposed, which `dofm` noted is actually a *benefit* over mmap approaches in some respects (streaming rather than page faults), but it still requires full model download plus shard storage.
3. **The verification gap.** Nobody in the thread had rigorously benchmarked AirLLM against llama.cpp with equivalent quants. `sixothree` pointed to a separate HN discussion on memory optimizations and asked the fair question: "With these optimizations and quants, it compares negatively. But can these optimizations be applied to models you want?"

## The MoE Sidebar Worth Knowing

The thread contained a genuinely educational tangent on whether MoE experts "specialize." `dannyw`: "Contrary to popular belief, 'experts' in MoE LLMs do not specialize. There's no expert trained to be good at maths, or python, or writing... You can think of it like sharing." `ahepp` refined it: "It develops expertise at the token level." This matters for AirLLM because its per-expert streaming assumes sparse activation — and if experts were all densely activated, the memory win would evaporate. It's a good reminder that AirLLM's headline capability is a property of the *model architecture*, not the tool itself.

## Use Case: A Real Offline Workflow

Here's the pattern that makes sense today:

1. **Pick a batch workload**: overnight code review summaries, translation of a document corpus, structured data extraction from internal files, QA sweeps.
2. **Run it on hardware you already own**: a 4GB GPU box, or even a Mac (macOS support since v2.8.2, CPU inference since v2.10.1).
3. **Pick the model tier that fits your latency budget**: a 32B-70B dense model for interactive-ish speeds, or DeepSeek-V3/Kimi K3 for highest quality when you can wait.
4. **Check the dependency matrix first** — flash-attn/CUDA/transformers versions for newer models — before committing to a pipeline.
5. **Never use it for real-time chat.** That's what llama.cpp with quantized models is for; AirLLM's edge is full-precision quality at batch speed.

## Alternatives

| Option | Why | Cost |
|--------|-----|------|
| **AirLLM** | Full-precision 70B on 4GB; MoE per-expert streaming; batch-focused | Free (Apache-2.0); disk space for shards |
| **llama.cpp** | Faster, better documented, more mature; best for interactive use; GGUF quants | Free (MIT); needs quantized models for small VRAM |
| **Ollama** | Easiest UX; great for CPU/Mac; limited to models that fit reasonably | Free; abstraction over llama.cpp |
| **Cloud APIs (DeepSeek, Kimi)** | Instant frontier quality, no hardware | Pay-per-token; data leaves your machine |

## Verdict

AirLLM is a real engineering achievement — full-precision 70B on 4GB, and 2.8T parameters in 3.72GB of VRAM via per-expert streaming, is genuinely impressive. But "runs" and "runs usefully" are different things. At 292 s/token, Kimi K3 on AirLLM is a demonstration, not a tool. Where AirLLM earns its keep is the **batch/offline/private-data niche**: overnight jobs, air-gapped processing, and QA sweeps where model quality beats latency, and where shipping data to a cloud API is a non-starter. If you need interactive local inference, llama.cpp or Ollama remain the right call. If you have a sensitive dataset and a patient cron job — AirLLM is quietly the best option out there.

**Rating: 7.0/10.** Best for offline batch inference on private data with frontier-scale open models. Not for interactive use; verify dependency compatibility before building a pipeline on it.
