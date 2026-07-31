---
title: "WASTE Review 2026 — Run the Full 2.78T Kimi K3 on a 64GB Laptop via NVMe Streaming"
date: 2026-08-01
author: "AIPlaybook Editorial Team"
category: "AI Models"
tags:
  - "WASTE"
  - "Kimi-K3"
  - "Local-LLM"
  - "Inference"
  - "NVMe"
  - "Open-Weights"
  - "MoE"
  - "Quantization-Free"
cover: "/images/reviews/waste-kimi-k3-review-2026/cover.png"
meta_description: "WASTE is a dependency-free C inference engine that streams Mixture-of-Experts weights directly from NVMe, running the complete 2.78-trillion-parameter Kimi K3 model in just 29GB of RAM at 0.5 tok/s on a consumer laptop. Full review with benchmarks, energy cost math, and community reaction."
rating: 7.5
dimensions:
  ease-of-use: 5
  features: 8
  value: 9
  performance: 4
  ecosystem: 6
pros:
  - "Runs the complete, unquantized 2.78T-parameter Kimi K3 — not a distilled or pruned variant — on a 64GB MacBook Pro with just 29.05GB of minimum RAM"
  - "Dependency-free C engine with no third-party runtime; every layer validated against a PyTorch reference with final logits agreeing to 3.6e-06"
  - "Smart architecture: one expert costs exactly one read on disk, and every remaining byte of RAM is spent on the repeating part of the computation"
  - "Free and open source — the entire cost story is just electricity and storage, roughly $5 per million tokens at 42W sustained draw"
cons:
  - "Extremely slow: 0.49-0.54 tokens per second means a single sentence takes ~30 seconds and a useful task can take hours"
  - "The 982GB converted model container requires a large NVMe drive; the official model is 1.42TB as published and must be converted yourself"
  - "Mac users get no Metal GPU acceleration — the authors found NEON ARM optimizations beat Metal for this workload"
  - "No prebuilt k3.waste container download yet; you must fetch official weights and convert them, which is a multi-hour operation"
  - "Practical only for asynchronous, batched workloads (overnight summaries, email-style Q&A), not interactive use"
best-for: "Hobbyists, researchers, and privacy-focused users who want to run the full frontier-class Kimi K3 locally on consumer hardware and are willing to trade speed for cost and data control"
price: "Free (open source, MIT-style project); hardware cost is a 64GB machine plus ~1TB NVMe storage"
---

## Quick Verdict

WASTE proves something most people assumed impossible: the **complete 2.78-trillion-parameter Kimi K3** — no distillation, no pruning, no quantization — runs on a consumer 64GB MacBook Pro. The trick is streaming: a Mixture-of-Experts model activates roughly 4% of its weights per token, so WASTE keeps the model trunk in RAM and pulls exactly the experts each token needs straight from NVMe disk.

At **0.49–0.54 tokens per second**, it is not a tool for chat. It is a tool for overnight jobs, email-style batch questions, and privacy-critical workloads where $5 per million tokens beats any API bill.

At 7.5/10, WASTE earns **Silver+**: the engineering is genuinely novel, the correctness validation is rigorous, and the cost equation is compelling — but the speed wall and setup friction keep it out of daily-driver territory for most users.

---

## What Is WASTE?

WASTE (from the `sqliteai/waste` repository) is an embeddable inference engine written in C with no third-party runtime dependencies. Its stated purpose is narrow and specific: run Kimi K3, Moonshot AI's 2.78-trillion-parameter open-weights model, on hardware where it does not fit in RAM.

The model is 1.42TB as published and 982GB after conversion. Consumer mainstream systems simply cannot hold that in memory. WASTE's insight is that a mixture-of-experts model activates only about 4% of itself per token — so idle weight does not need to be in RAM, it needs to be *reachable in time*. WASTE lays the weights out on disk so that fetching one expert costs exactly one read, streams the experts each token actually needs, and spends every remaining byte of RAM on the part of the computation that repeats.

## Real-World Test Results

The repository's own proof point is a 64GB MacBook Pro:

| Metric | Value |
|---|---|
| Model | Kimi K3 2.78T (full, unquantized) |
| Container size | 982 GiB (converted from 1.42TB) |
| Minimum RAM | 29.05 GiB |
| Tested speed | 0.49–0.54 tok/s |
| Sample latency | ~31s for a 16-token answer |
| Expert cache hit rate | 3,357 hits / 20,195 misses (14%) |
| Logit agreement vs PyTorch | 3.6e-06 |

A second supported model, Kimi-Linear 48B, runs at a much more usable **10.7 tok/s** with only 1.87GB of RAM and a 19GB container — making it the sensible choice for anyone who wants interactive speeds.

Correctness is the part that separates WASTE from a hack: every layer is validated against a PyTorch reference, final logits agree to 3.6e-06, and the vision tower matches its own oracle to 2.3e-06.

## Pricing & Hardware Cost

WASTE is free and open source. The real cost is electricity. One HN commenter did the math: at a sustained 42W draw and 20¢/kWh, running Kimi K3 through WASTE costs roughly **$5 per million tokens** — excluding hardware. That is dramatically cheaper than frontier API pricing, but it arrives at 0.5 tokens per second instead of 100+.

You also need storage: a 64GB machine (ideally with 96GB unified memory for headroom) and roughly 1TB of NVMe for the 982GB container.

## Community Reception

The Hacker News thread (118 points) split into two camps. The engineering camp was impressed: *"This sounds a lot like what the colibri project did for GLM-5.2. I'm a fan so keep at it!"* The pragmatist camp asked the obvious question: *"Neat! But what do you do with a 0.5 tok/s LLM?"*

The best answer came from the thread itself — use it like email, not like chat. One commenter summarized the workflow: *"If you have a slow system like this, you should communicate by email. It is no longer meant for realtime iteration, but more pointed questions for which there is more effort and time available."* Another suggested a practical overnight pattern: *"Have it summarise the week overnight for the meeting in the morning."*

Energy efficiency drew the harshest critique: *"So if this Mac uses 30-50W, that's 40-60 tok/Wh vs maybe 80k for a modern GPU cluster — about 1000-2000x more power for the SSD streaming."* A separate thread point: the 29GB headline figure assumes 4K context, so longer contexts need more RAM.

There was also fair criticism of the LLM-generated README, with one commenter noting the docs seem to contradict themselves on native precision. The author pushed back, pointing to hand-written software history and a gravity language project, and the thread mostly agreed that "written by an LLM" is no longer a meaningful dismissal.

## Who Should Use WASTE

**Good fit:** privacy-sensitive users who cannot send code or documents to external APIs; researchers validating that full-precision frontier models work outside data centers; anyone with a spare laptop who wants a frontier-class model for overnight batch jobs.

**Skip it if:** you need interactive latency, you have no 1TB+ NVMe drive, or you are happy with API pricing and just want answers fast. For interactive local use, run Kimi-Linear 48B instead at 10.7 tok/s, or use llama.cpp with a smaller quantized model.

## Alternatives

- **Kimi-Linear 48B via WASTE** — same engine, 10.7 tok/s, tiny 19GB footprint; the pragmatic local option.
- **llama.cpp with SSD offloading** — supports naive offloading; the WASTE README invites speed comparisons, though trillion-scale NVMe streaming is out of llama.cpp's documented comfort zone.
- **Colibri (GLM-5.2)** — a similar disk-streaming project referenced in the HN thread for a different open-weights model.
- **Cloud Kimi K3 API** — full speed, no local hardware, but per-token cost and zero data privacy.

## FAQ

**Does WASTE use Metal on macOS?**
No. The authors tested Metal and found NEON ARM optimizations were faster for this specific workload, and the decision is documented in the repo.

**Can I download the 1TB k3.waste container?**
Not yet. You download the official Kimi K3 weights and convert them yourself using the provided tools (`tools/fetch_weights.sh` and the conversion pipeline).

**Is the model really full precision?**
WASTE runs the complete open-weights model — not a distilled, pruned, or reduced variant. The authors note that documentation about native precision has drawn some criticism, so verify against the repo before committing a big workload.

**What can I realistically do at 0.5 tok/s?**
Asynchronous tasks: overnight document summaries, meeting-transcript reports, batch code review, email-style Q&A where a 30-60 minute turnaround is acceptable.
