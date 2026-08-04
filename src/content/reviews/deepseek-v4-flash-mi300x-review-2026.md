---
title: "DeepSeek V4 Flash on a Single AMD MI300X — 168 tok/s for $1.99/hr, and What You Give Up"
date: 2026-08-05
author: "AIPlaybook Editorial Team"
category: "AI Inference & Hardware"
tags:
  - "DeepSeek"
  - "V4-Flash"
  - "AMD"
  - "MI300X"
  - "vLLM"
  - "Self-Hosting"
  - "ROCm"
  - "Inference"
cover: "/images/reviews/deepseek-v4-flash-mi300x-review-2026/cover.png"
meta_description: "A community production stack runs DeepSeek V4 Flash (304B MoE) on a single AMD MI300X at 168.6 tok/s single-stream, 542 tok/s at 8 streams and 830 tok/s burst — no additional quantization, 256K context. Review of the patches, the FNUZ vs OCP FP8 trap, the $1.99/hr AMD Developer Cloud economics debate, and honest HN takes on whether self-hosting a model whose API costs pennies makes sense."
rating: 7.6
dimensions:
  ease-of-use: 5
  features: 8
  value: 8
  performance: 9
  ecosystem: 7
pros:
  - "Runs the full DeepSeek-V4-Flash-0731 checkpoint as shipped — 156.67 GiB of weights in HBM with no additional quantization or weight offload, and the model is MIT-licensed"
  - "Real numbers, not marketing: 168.6 tok/s median single-stream decode, 7.9–8.5K tok/s prefill, 542 tok/s aggregate at 8 streams, 830 tok/s 64-stream burst with no OOM"
  - "The FP8 correctness fix is the star: MI300X implements the AMD/Graphcore FNUZ E4M3 variant, and a kernel assuming OCP semantics can be wrong by a factor of two in the scale domain — the repo documents and patches exactly this"
  - "Reproducible: digest-pinned vLLM ROCm image, SHA-256-pinned overlays, unified diffs against upstream, and a validation suite including BFCL subset (74–76/90) and 380K-token needle recall"
  - "Hybrid KV design (20 GB GPU + 96 GiB CPU offload) fits seven concurrent 256K-token requests on one card"
cons:
  - "MI300X is an OAM module, not a buyable single unit — you're renting it (AMD Developer Cloud via Digital Ocean, ~$1.99/hr) or buying a ~250K EUR 8-card box, not dropping it in a workstation"
  - "Context is cut from the architecture's 1M to 256K validated; HN's WhitneyLand framing applies: the headline 'model runs on x' really means 'here's what you give up to run on x'"
  - "HBM headroom is razor-thin: warmed high-water mark is 204.5 of 205.8 GB; a 30 GB KV pool loads but fails at graph capture, and you must babysit HBM growth"
  - "The economics are genuinely contested — at 830 tok/s the output is worth ~$0.54/hr at DeepSeek's API price against a $1.99/hr rental; it only pencils out for privacy, IP protection, or serving multiple users at margin"
  - "Bleeding-edge maintenance burden: pinned ROCm nightly, 8+ full-file Python overlays, AITER tuning tables, and several fixes not yet upstream (vLLM issue #47282's WAR was never merged as PR #47291)"
best-for: "Privacy-sensitive teams and inference providers who need frontier-class open weights on AMD hardware without weight quantization, and who can stomach nightly-ROCm ops"
price: "Rent: ~$1.99/hr on AMD Developer Cloud (via Digital Ocean); hardware: 8x MI300X box ~250K EUR; DGX Spark alternative: 2x at ~$8,000 or ~$1.65/hr rental"
---

## Quick Verdict

On August 4, 2026, a repo titled **"DeepSeek V4 Flash on a single AMD MI300X"** hit the Hacker News front page at **358 points** and stayed there through the morning — a rare case where the top comment thread is mostly about the AI capex bubble rather than the engineering, which tells you how far running frontier-class open models on a single accelerator has come. The repo (`ryanzhou/deepseek-v4-flash-mi300x`) is a production configuration for running DeepSeek-V4-Flash-0731 on **one MI300X**: Docker Compose stack, SHA-256-pinned file overlays, reference diffs against upstream vLLM, and tuning tables. The headline numbers are genuinely impressive: **168.6 tok/s median single-stream decode**, **7.9–8.5K tok/s prefill**, **542 tok/s aggregate at 8 concurrent streams**, and a **830 tok/s 64-stream burst** with no OOM and no engine errors — all with the checkpoint **as shipped, without additional weight quantization or offload**.

At **7.6/10**, this is one of the most complete single-GPU frontier-inference deployments we've seen published: reproducible, benchmarked, and honest about its constraints. The real question it forces — debated across 87 HN comments — is not "can it run?" but "**should you run it?**" when DeepSeek's own API is priced at fractions of a cent per token.

## What the Stack Actually Is

The repo pins a digest-locked official vLLM ROCm nightly (`0.26.1rc1.dev229+g124154a88.rocm723`, AITER `0.1.19`) and layers on fixes for exactly the things the official vLLM recipe doesn't cover: the official recipe targets NVIDIA and newer AMD hardware (MI325X at 4K context, MI355X), not a single-MI300X production config for the 0731 checkpoint.

The model itself is worth situating: **DeepSeek-V4-Flash-0731 is a 304B-parameter MoE** (HN's `wren6991` puts total params at 284B; the model card says 304B — the difference is counting conventions around the fused DSpark module), with 256 MoE experts in **native MXFP4** quantization, a fused speculative-decoding module, and a 1M-token context architecture. The MI300X's **192 GB HBM3 at 5.3 TB/s** — 2.4× the HBM of an H100 SXM5 — is the entire point: the full checkpoint fits in HBM without PCIe weight streaming or layer offload.

## The FNUZ vs OCP FP8 Trap (The Most Important Fix)

The single most valuable thing this repo documents is a hardware correctness trap most people would never find. MI300X (CDNA3) implements the **AMD/Graphcore FNUZ variant of E4M3 FP8**, while MI325X and newer use the OCP-standard format. DeepSeek V4's Lightning Indexer cache writes FP8; the stock writer emits OCP E4M3 bytes in row-major order, but AITER on MI300X consumes AMD FNUZ E4M3 bytes in a **preshuffled 16×16 tile layout**. In the worst case, interpreting one format as the other produces a **factor-of-two error in the scale domain** — silently wrong KV cache values. The overlay selects `float8e4b8` with `FP8_MAX=224.0` and shuffled write offsets on ROCm while leaving the OCP path unchanged elsewhere. That's the difference between "runs" and "runs correctly," and it's the kind of finding that justifies the whole repo.

A second correctness fix targets **MXFP4 MoE routing**: the bitmatrix kernel pads block columns to Triton block size, but the padding lanes were masked against the global tensor bound instead of the logical block size, corrupting the routing matrix under load and causing "near-match tool names and forgotten schemas on long prompts." The one-line fix (`mask = (offs_local < BLOCK_SIZE) & (offs_global < nonzero_indx_size)`) comes from Doubleword's `c32932bb9` commit, and it's not yet upstream.

## Performance: The Numbers

The production profile uses **DSpark-7 speculative decoding** (probabilistic drafting, block rejection, causal verification — the causal small-head MLA verification overlay is now upstream in vLLM commit `77469c9`), a 2,048-token scheduler budget, and a 1,024-token long-prefill cap. Tuned AITER GEMM tables for 21 recurring `gfx942` shapes add **+42–62% single/double-stream decode**. The result table from the pinned stack:

| Streams | Aggregate tok/s | Median per-stream | TTFT p50 |
|---:|---:|---:|---:|
| 1 | 126.2 | **168.6 tok/s** | 1.026 s |
| 2 | 145.4 | 152.7 | 0.939 s |
| 4 | 316.8 | 108.6 | 0.369 s |
| 8 | 542.3 | 90.3 | 1.027 s |
| 64 | 830.2 | 16.4 | 2.190 s |

KV is a **hybrid design**: 20 GB of `fp8_ds_mla` GPU cache (UE8M0 block-scaled FP8, 256-token blocks) plus a 96 GiB native CPU tier for evicted prefix-cache entries — 1.93M-token length-equivalent capacity, or seven 256K requests admitted concurrently. The one concession: **context is validated at 256K, not the architecture's 1M**. A 52K cold prefill no longer stalls short requests (TTFT 8.2 s → 0.5 s) thanks to the prefill cap.

The caveats are equally concrete. **HBM headroom is 204.5 of 205.8 GB warmed** — the author explicitly warns not to raise `--kv-cache-memory-bytes` because a 30 GB pool "loads but fails during graph capture with `HSA_STATUS_ERROR_OUT_OF_RESOURCES`." You must monitor HBM growth. And DSpark acceptance is prompt-dependent: "treat these as gates for this exact image, not universal model benchmarks."

## The Economics Debate: The Real Story in the Comments

The HN thread (87 comments) is dominated by one question: **is this economically sane?** `WASDx` did the arithmetic that frames the whole debate: at 830 tok/s sustained for an hour that's almost 3M tokens, "which is just $0.54 worth of tokens at DeepSeek's current output price" — against a $1.99/hr rental on AMD Developer Cloud. `thrownaway561` was blunter: "The price of Flash is so cheap that trying to run it locally or with your own hardware is pointless. I ran it for 4 days non-stop and it cost me about $2."

The counter-case is the classic one, and it's well argued. `NitpickLawyer`: "Serving local models has advantages other than price. If you work in restricted industries, or have a strong need to protect your IP, or if you just value privacy more than cost, you now have options." `ak_t` adds a performance angle: "at least on my setup, it's about 5 times faster than any API, and is completely private." `lnenad` points out the rental actually works at the margin — at 8 concurrent users, ~90 tok/s per stream, a renter serving customers "can take a 100% margin" over API rates, though `minraws` counters that you'd need ~1,500 tps at 20–30 users to make it truly worthwhile, "which is what most providers are doing."

Two hardware alternatives got airtime. `Tepix` suggests **2x DGX Spark** (~$8,000 to buy, ~$1.65/hr to rent) but concedes the MI300X "will vastly outperform it for only a slightly higher price" — Spark's 274 GB/s memory bandwidth vs the MI300X's 5.3 TB/s is a chasm. And **MI350P** (144 GB, PCIe form factor) is "the one you want" for self-hosting per `Tepix`, since V4 Flash's native MXFP4 fits in 144 GB — though `craftkiller` notes it's a server card with a passive heatsink, "designed for servers... we won't be able to just drop it into our gaming PCs."

## Context: Where This Fits in the Self-Hosting Wave

This repo builds directly on two prior works it credits: **Fergus Finn's MI300X bring-up worklog** (FNUZ vs OCP FP8, AITER gaps on `gfx942`, HIP-graph hazards) and the companion **Doubleword repo**, plus the official vLLM recipe that covers NVIDIA and MI325X/MI355X. `GTP` noted the prior-art list omits **DwarfStar** (antirez's `ds4`), which runs the same model in less memory — `MaKey` answers that DwarfStar has no MI300X optimizations, and `wmf` links a parallel PR (`antirez/ds4#484`). `xorfish` adds context on headroom: DeepSeek's own DSpark paper reports ~15K tok/s/GPU on H800, so "there are probably still quite a few optimizations that can be made" — though `somnial` counters that throughput scales superlinearly with networked GPUs under wideEP, so single-card comparisons are apples-to-oranges.

The practical answer for most readers is in `zhoutong`'s comment: the card is available on demand from several cloud providers, cheapest being **AMD Developer Cloud at $1.99/hour** — which is exactly how you should try this stack before buying anything.

## Verdict

This repo is the reference implementation for "frontier MoE on a single AMD accelerator," and it earns its 358 points: the FNUZ/OCP FP8 documentation alone is worth the read, the reproducibility discipline (digest pins, SHA-256 overlays, diffs) is exemplary, and the honesty about HBM headroom and context trade-offs is rare. Whether you should deploy it is a different question — for most individuals, renting an MI300X at $1.99/hr to serve a model whose API is cheaper than your electricity is a novelty, not an infrastructure decision. But for privacy-sensitive teams, IP-protected workloads, and inference providers who want AMD independence (and who can run nightly-ROCm ops), this is a complete, working, benchmarked playbook. Watch the upstream merges — several of these fixes are already landing in vLLM.

**Rating: 7.6/10.** Best for teams that need full-fidelity DeepSeek V4 Flash on AMD hardware with verifiable numbers and can operate a pinned-nightly stack — everyone else should keep renting the API and revisit when MI350P-class PCIe cards mature.
