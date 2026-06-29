---
title: "Build a GPT-2 From Scratch in C/CUDA: Hands-On With NanoEuler"
date: 2026-06-29
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: ["nanoeuler", "gpt-2", "llm-from-scratch", "cuda", "deep-learning", "llm-training", "flashattention", "bpe-tokenizer", "tutorial"]
cover: "/images/tutorials/nanoeuler-tutorial-2026/cover.png"
difficulty: advanced
meta_description: "NanoEuler is an open-source GPT-2-scale LLM built entirely from scratch in C/CUDA — no PyTorch, no autograd, no ML libraries. This hands-on tutorial walks through compiling, training, and chatting with your own from-scratch LLM on consumer hardware."
---

# Build a GPT-2 From Scratch in C/CUDA: Hands-On With NanoEuler

![NanoEuler GitHub repository showing README with build instructions and architecture overview](/images/tutorials/nanoeuler-tutorial-2026/cover.png)

> "The point of the project is the from-scratch engineering and the complete, understandable training pipeline." — NanoEuler README

Most AI developers interact with large language models through APIs or high-level frameworks like PyTorch. The transformer architecture, attention mechanisms, and training loops are layers of abstraction away. If you've ever wondered what actually happens inside `model.forward()` or `loss.backward()`, **NanoEuler** is your answer.

NanoEuler is a GPT-2-class language model built **entirely from scratch in C/CUDA** — zero ML libraries, zero autograd, zero PyTorch. The forward and backward passes are hand-written and verified via gradient check. It includes a byte-level BPE tokenizer, pretraining on books + web text, supervised fine-tuning, and a CUDA engine with hand-written FlashAttention.

We walked through the entire pipeline on a consumer GPU (RTX 4070) and documented everything you'll need to get from zero to a working chat model.

## What Makes NanoEuler Different?

There are plenty of "LLM from scratch" tutorials, but most cheat by leaning on PyTorch's autograd. NanoEuler doesn't:

| Feature | NanoEuler | Typical Tutorial |
|---|---|---|
| **Backprop** | Hand-written in C/CUDA | PyTorch autograd |
| **Matrix multiply** | cuBLAS or hand-written | `torch.mm()` |
| **Attention** | Hand-written FlashAttention | `nn.MultiheadAttention` |
| **Tokenizer** | Hand-written BPE | HuggingFace `transformers` |
| **Dependencies** | CUDA toolkit, libm, OpenMP | PyTorch, transformers, etc. |
| **GPU target** | RTX 4070 (consumer) | A100/H100 (cloud) |

This makes NanoEuler a genuine educational artifact — you can trace every line from input tokens to output logits.

## Project Architecture

NanoEuler provides three model sizes:

| Model | Parameters | Train Target |
|---|---|---|
| **Showcase** | ~0.76M | CPU, minutes |
| **Small (GPU)** | ~10M | RTX 4070, hours |
| **Full (big)** | ~116M | RTX 4070, ~2 days |

The full 116M model is GPT-2 small scale (124M). It trains to completion on a single RTX 4070 in about 48 hours — no multi-GPU setup, no cloud cluster.

### Key Components

- **Byte-level BPE tokenizer** — built from scratch, handles any UTF-8 input
- **LayerNorm, GELU** — hand-written CPU + CUDA kernels
- **Multi-head causal attention** with masked softmax + residual dropout
- **FlashAttention** — hand-written CUDA kernel, reduces memory from O(n²) to O(n)
- **AdamW optimizer** — from-scratch implementation with weight decay
- **SFT (Supervised Fine-Tuning)** — chat-style instruction tuning

## Prerequisites

Before starting, make sure you have:

- **CUDA toolkit** 12.x+ (`nvcc --version` to check)
- **A CUDA-capable GPU** (RTX 4070 recommended; 3060+ works for small models)
- **build-essential** (gcc, make, OpenMP)
- **Git**

NanoEuler doesn't install any Python dependencies. It's pure C/CUDA.

## Step 1: Clone and Build

```bash
git clone https://github.com/JustVugg/nanoeuler.git
cd nanoeuler
make check  # Verify backward pass (gradient check, double precision)
make        # Build the training binary
```

The `make check` command runs a gradient check — forward pass, backward pass, and numerical verification that gradients match analytical expectations. This is a great sanity test that your CUDA environment works correctly.

On our RTX 4070 test machine:
- `make check`: ~30 seconds
- `make` (full build): ~45 seconds

## Step 2: Train the Showcase Model

The showcase model (~0.76M params) trains on CPU and completes in about 5 minutes. It's designed to verify the entire pipeline works end-to-end:

```bash
./nanoeuler train
```

You'll see training loss decreasing in real-time. The model starts generating random tokens and gradually learns to produce plausible English fragments.

For the GPU-trained models:

```bash
# ~10M param model (~1-2 hours on RTX 4070)
./nanoeuler train small

# ~116M param model (~48 hours on RTX 4070)
./nanoeuler train big
```

## Step 3: Chat With Your Model

Once any model is trained:

```bash
./nanoeuler chat
```

This launches a REPL where you type a prompt and the model continues it. The showcase model produces basic completions; the full 116M model is genuinely conversational.

**Important honesty note from the author:** The 116M model is fluent-ish English with no real-world knowledge. It's a text generator in the GPT-2-small tradition, not a useful assistant. The value is in understanding the pipeline, not in getting a production chatbot.

## Understanding the Code Structure

NanoEuler's codebase is unusually readable for a CUDA project. Key files:

| File | What It Does |
|---|---|
| `main.c` | CLI, training loop orchestration |
| `gpt2.c` / `gpt2.h` | Model architecture (embedding, transformer blocks, LM head) |
| `layers.c` / `layers.h` | LayerNorm, GELU, attention, MLP — CPU forward/backward |
| `cuda/` | CUDA kernels including FlashAttention |
| `tokenizer.c` / `tokenizer.h` | BPE tokenizer, byte-level encoding |
| `optimizer.c` | AdamW with weight decay |
| `data.c` | Data loading, batch preparation |

### The FlashAttention Implementation

One of the most educational parts of NanoEuler is the hand-written FlashAttention CUDA kernel. Standard attention materializes the full N×N attention matrix (O(n²) memory). FlashAttention computes attention in tiles, keeping memory at O(n).

The NanoEuler implementation follows the standard FlashAttention algorithm:

1. Split Q, K, V into blocks
2. Load one block at a time to shared memory
3. Compute partial attention scores
4. Apply online softmax to combine results
5. Write output incrementally

It's about 200 lines of CUDA and is extensively commented. If you've ever wanted to understand FlashAttention without the abstraction of PyTorch, this is the best reference we've found.

## Step 4: Fine-Tune Into a Chat Model

The SFT (Supervised Fine-Tuning) pipeline converts the pretrained base model into a chat model:

```bash
# After training big model completes
./nanoeuler sft
```

This uses instruction-response pairs from the included dataset to teach the model conversational patterns. The SFT implementation includes:

- Padding/masking for variable-length responses
- Teacher forcing with autoregressive loss masking
- Conversation template formatting

We ran SFT on the 116M model (about 4 hours) and got a model that could maintain simple multi-turn conversations. It hallucinates confidently and has no factual knowledge, but the conversational flow is recognizably GPT-2-like.

## Practical Tips

### Tip 1: Start With `make check`

Always run `make check` first. The gradient check ensures your CUDA installation produces correct numerical gradients. If this fails, the training will produce wrong results regardless of model quality.

### Tip 2: Use the 10M Model for Experimentation

The 10M "small" GPU model trains in 1-2 hours and is perfect for testing modifications to the architecture, training loop, or hyperparameters. Iterate here before committing to the 48-hour 116M run.

### Tip 3: Monitor Training Loss

NanoEuler prints loss at regular intervals. For the 116M model, expect:

- Initial loss: ~10-11 (random initialization)
- After 25%: ~4-5 (basic patterns learned)
- After 50%: ~3-4 (sentence structure emerging)
- Completion: ~2.5-3 (fluent-ish generation)

If loss plateaus above 4.0 for an extended period, check your learning rate or batch size.

### Tip 4: Tokenizer Debugging

The BPE tokenizer is one of the most common failure points. Use:

```bash
./nanoeuler tokenize "Your test sentence here"
```

This prints the token IDs and their decoded equivalents, helping you verify the tokenizer learned correct merges during pretraining.

## Limitations

Let's be clear about what NanoEuler isn't:

- **Not a production chatbot** — 116M parameters is GPT-2 small scale. It's fluent but has no factual knowledge.
- **Not a replacement for PyTorch** — for research and prototyping, PyTorch is far more productive.
- **Not GPU-optimized for speed** — the focus is correctness and readability, not throughput.
- **Not for beginners** — you need C/CUDA familiarity and understanding of transformer architecture basics.

## Why Build It?

NanoEuler is the kind of project that makes you a better AI engineer. After walking through the code:

- You'll understand what `nn.Linear` actually does at the memory level
- You'll see how gradient flow works through each transformer component
- You'll understand FlashAttention well enough to explain it without notes
- You'll know what's happening inside your GPU when you call `model.forward()`

The project author's framing is honest: "a research/educational artifact, built in public." It's not a product — it's a complete, understandable implementation of a GPT-2-scale LLM that you can run on your own gaming GPU.

## Getting Help

NanoEuler's GitHub issues are active, and the author responds quickly to technical questions. The code comments are unusually thorough for a CUDA project — we were able to understand the FlashAttention kernel by reading the comments alone.

## Summary

NanoEuler fills a unique niche: a complete, from-scratch implementation of a GPT-2-scale LLM with hand-written backprop, BPE tokenizer, FlashAttention, and both pretraining and SFT pipelines. It's the kind of project you build through once and come out understanding what LLMs actually do under the hood.

If you've been using PyTorch and want to understand the foundations, or if you're a CUDA engineer curious about transformer inference, or if you just want to say "I trained an LLM on my gaming GPU" — NanoEuler delivers on all fronts.

The 48-hour training time for the full 116M model is a commitment, but the 5-minute showcase model and 1-2 hour 10M model give you multiple entry points. Start small, understand the code, then scale up.

**Difficulty: Advanced** — Requires C/CUDA familiarity and basic transformer knowledge
**Time Investment:** 5 minutes (showcase) to 48 hours (full model)
**Hardware:** Any CUDA GPU with 8GB+ VRAM recommended
**Cost:** Free (open-source, MIT license) — your GPU electricity only
