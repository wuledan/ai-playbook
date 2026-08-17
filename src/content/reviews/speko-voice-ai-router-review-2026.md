---
title: "Speko Review 2026 — YC S26's 'OpenRouter for Voice AI' Routes STT, LLM, and TTS From One API"
date: 2026-08-18
author: "AIPlaybook Editorial Team"
category: "Voice AI"
tags:
  - "Speko"
  - "Voice-AI"
  - "STT"
  - "TTS"
  - "Speech-to-Text"
  - "Model-Routing"
  - "OpenRouter"
  - "LiveKit"
  - "YC"
  - "LLM-Gateway"
cover: "/images/reviews/speko-voice-ai-router-review-2026/cover.png"
meta_description: "Speko (YC S26) is an OpenRouter-style router for voice AI: one OpenAI-compatible API in front of 20+ speech-to-text models, LLMs, and TTS engines, with routing decisions based on its own continuously published benchmarks (WER vs cost per language) rather than vendor leaderboards. Router pricing is +5% on provider rates; Speko's own infrastructure is $0.09/min all-in for STT+LLM+TTS, with $100 signup credit. We break down the benchmark table, the LiveKit integration, the 'auto' model routing, and the HN debate (84 points) over whether cascaded or end-to-end voice stacks win."
rating: 7.4
dimensions:
  ease-of-use: 8
  features: 8
  value: 7
  performance: 7
  ecosystem: 6
pros:
  - "One OpenAI-compatible base URL and one API key in front of every provider — swap voice models without touching your agent framework"
  - "Routing is driven by its own continuously published measurements (WER, cost, per language), not vendor English-language leaderboards"
  - "Benchmark boards are public and include speech-to-speech (s2s) models alongside cascaded stacks — whoever wins, Speko routes to them"
  - "$0.09/min all-in on Speko infrastructure for STT + LLM + TTS is a genuinely simple pricing story, with $100 in signup credit"
  - "Works with LiveKit agents out of the box (model: 'auto') and exposes an MCP server for agent tooling"
cons:
  - "Public preview: email-only support, no SLA, no commitment-free enterprise tier — not a production-grade contract yet"
  - "Router pricing is +5% on the provider's published rate, and some rates on the boards are marked with a tilde (vendor publishes no exact rate)"
  - "The 'auto' routing depends on Speko's measurements, which are English-heavy at launch; non-English coverage is thinner"
  - "Deepgram Nova-3, one of the most widely deployed STT models, sits near the bottom of Speko's own table (9.8% WER) — routing will disagree with your incumbent assumptions"
  - "The whole value prop leans on the benchmark methodology being trustworthy; there's no independent third-party audit of the boards yet"
best-for: "Voice-agent teams that want one integration surface, benchmark-driven model selection, and the freedom to switch STT/LLM/TTS engines without refactoring — especially teams already on LiveKit"
price: "Router: +5% on provider's published rate. Speko infra: $0.09/min all-in (STT + LLM + TTS). $100 signup credit. Enterprise: custom."
---

# Speko Review 2026 — YC S26's "OpenRouter for Voice AI" Routes STT, LLM, and TTS From One API

## Quick Verdict

Speko (YC S26) is a **router for voice models** — the OpenRouter analogy is exact, and the founders say so themselves. A typical production voice agent is an ensemble of three models: speech-to-text, an LLM, and text-to-speech. Speko puts one OpenAI-compatible API in front of 20+ providers across all three legs, and — this is the differentiator — decides **which model to call per language and per objective from its own published measurements instead of a vendor's English leaderboard**.

It launched publicly on Hacker News on August 17, 2026 (84 points, 15 comments), and the thread was unusually substantive for a Launch HN: a debate about whether the industry is moving to end-to-end speech-to-speech models (which would make routing an obsolete middleman) versus the enterprise reality that "around 95% of cases are still cascaded."

The pricing is refreshingly legible: **+5% on the provider's rate when routed, or $0.09 per minute all-in on Speko infrastructure for STT + LLM + TTS, with $100 in signup credit.** The catch is maturity: public preview, email-only support, no SLA. For a prototype or internal tool, that's fine. For a regulated production deployment, it's a conversation.

**Score: 7.4/10.** The routing concept is sound, the benchmark-first positioning is genuinely differentiated, and the integration story (OpenAI-compatible + LiveKit plugin + MCP) is the smoothest of any voice gateway we've reviewed. What's missing is time: independent validation of the benchmark boards and a production-grade support contract.

## What Speko Actually Does

Three layers, from the landing page and the Launch HN thread:

### 1. Router (measured selection)

Speko continuously benchmarks voice models across its boards — the top of the STT table on launch:

| Rank | Model (provider) | WER | Cost / min |
|------|------------------|-----|-----------|
| 1 | Universal-3.5 Pro (assemblyai) | 2.0% | $0.0075 |
| 2 | GPT-4o Transcribe (openai) | 2.3% | $0.0060 |
| 3 | GPT-4o-mini Transcribe (openai) | 2.7% | $0.0030 |
| 4 | Qwen3-ASR (alibaba) | 2.8% | $0.0054 |
| 5 | Realtime STT-1 (inworld) | 3.3% | $0.0025 |
| 6 | Chirp 3 (google) | 3.9% | $0.0160 |
| 7 | Velma 2 (modulate) | 4.4% | $0.0010 |
| 8 | Grok STT (xai) | 4.8% | $0.0033 |
| 9 | Solaria-1 (gladia) | 5.0% | $0.0125 |
| 10 | Pulse (smallest) | 5.1% | ~$0.0050 |
| 13 | Nova-3 (deepgram) | 9.8% | $0.0048 |

Two things jump out. First, the table has an opinion: **Deepgram Nova-3 — one of the most widely deployed production STT models — sits near the bottom (9.8% WER)**, while smaller names like Universal-3.5 Pro and Velma 2 top it. Whether you agree or not, that's the point of a measurement-driven router: it will disagree with your incumbents, and it publishes the receipts. Second, the cost column makes the trade visible — Chirp 3 costs 16x Velma 2 per minute for 0.5 points of WER. Routing on WER alone is table stakes; routing on WER-per-dollar is the actual product.

The boards also cover **speech-to-speech (s2s) models** at `benchmarks.speko.ai/s2s`, which matters for the end-to-end debate below. Founder abdik: "We measure those too, same methodology. If the single models win, we route to them the same way, so we do not care which architecture (s2s or cascaded) wins."

### 2. Gateway (one surface)

One base URL (`https://api.speko.ai/v1`) and one key in front of every provider, speaking the OpenAI API so existing frameworks work with just a hostname and a model string. The LiveKit integration is the cleanest example:

```js
import { defineAgent, voice } from '@livekit/agents';
import * as openai from '@livekit/agents-plugin-openai';

const key = process.env.SPEKO_API_KEY!;
const baseURL = 'https://api.speko.ai/v1';

export default defineAgent({
  entry: async (ctx) => {
    const session = new voice.AgentSession({
      stt: new openai.STT({ apiKey: key, baseURL, model: 'auto' }),
      llm: new openai.LLM({ apiKey: key, baseURL, model: 'auto' }),
      tts: new openai.TTS({ apiKey: key, baseURL, model: 'auto' }),
    });
    await session.start({ agent: new voice.Agent({ ... }) });
  },
});
```

The `model: 'auto'` string is the whole product in one line: your framework asks for "the best model for this language and objective," and Speko resolves it from measurements. There's also an MCP server (`claude mcp add speko https://mcp.speko.ai/mcp`) so agents can query the routing surface directly.

### 3. Where it runs

Founder abdik's answer to "what's the difference with LiveKit Gateway?": "Our gateway is open source and runs in your own container, including with self-hosted LiveKit." So the routing brain is hosted, but the data plane can live in your VPC — the same hybrid pattern OpenRouter and LiteLLM have made standard for LLMs, applied to voice.

## Pricing

| Plan | Price | What you get |
|------|-------|--------------|
| Router | **+5% on provider's rate** | Measured model selection, pre-response failover, per-language routing |
| Speko infra | **$0.09/min all-in** | STT + LLM + TTS, routing included, on Speko's own infrastructure |
| Enterprise | Custom (locked for term) | Dedicated support, deployment reviews, SLA in contract, committed monthly minimum |
| Signup credit | **$100** | Applies to every account |

Notes from the pricing page: on the Router plan you pay the rate of whichever model the router selects, plus 5%. The $0.09/min all-in price covers all three legs and no provider rates apply. A tilde (~) on the boards means the vendor publishes no exact rate — Speko transcribes what it can. Public preview means email support and no SLA until you move to Enterprise.

The $0.09/min number is the one to stress-test: at 10 minutes of conversation per customer per day, that's $0.90/day per active customer on the infra plan — competitive with assembling Deepgram + GPT-4o-mini + a cheap TTS yourself, and it removes all the per-provider contract math. The trade is lock-in to Speko's routing decisions.

## Use Case: Multi-Language Support Without Vendor Roulette

The concrete scenario the router targets: you're building a voice agent that serves EN, AR, FR, DE, HI, and ES (the languages listed on the landing page's coverage matrix). Today you'd either pick one vendor and accept its non-English degradation, or build your own routing layer with per-language evaluations you maintain yourself. Speko's pitch: the boards already rank models per language, the router picks per call, and you get pre-response failover if the selected model errors — behavior that would take you weeks to build and maintain in-house.

The honest caveat, which the launch materials don't hide: the benchmark coverage is **English-heavy at launch**. If your production traffic is mostly Hindi or Arabic, the per-language ranking evidence is thinner, and the "auto" decision is only as good as the measurements behind it.

## Community Reaction (HN Launch, 84 points)

The thread's best exchange was a genuine product debate, not a launch-day echo chamber:

- **narrationbox** pushed back on the premise: "The industry is very much moving towards one-model-does-all end to end trained similar to LLMs and VLMs. Mostly for latency reasons and partially because the results for the end to end trained models are just so much better... I think most of the value prop is in automatic evals, not routing."
- **abdik** (founder) responded with data: "For now, what we see in production so far is that most teams still want to control each piece: swap the STT for medical vocabulary, keep the LLM, keep the voice." And later: "around 95% cases are still cascaded, even tho s2s has been improving a lot."
- **cootsnuck** backed the founder with enterprise experience: "I've worked with hundreds of enterprises on voice AI... the people actually paying for voice agents (i.e enterprises) are not moving towards s2s solutions in a meaningful way. The composability, observability, and reliability profile of s2s systems is not amenable to enterprise criteria."
- **MikhailTal** asked the obvious comparison question (LiveKit Gateway, Vapi); **dhruv3006** kept it simple: "the concept is interesting I must say — good luck!"

The debate matters beyond Speko: if end-to-end speech models win the accuracy-latency race, routers of *components* shrink into routers of *providers of one model*. Speko's hedge — benchmarking s2s models too and routing to whichever architecture wins — is the right answer either way.

## Alternatives

| Tool | Model | Pricing | Best for |
|------|-------|---------|----------|
| **Speko** | Router + benchmark boards | +5% routed / $0.09-min infra | Teams that want measured model selection and one integration surface |
| **LiveKit Gateway** | Provider gateway for LiveKit stack | Per provider, no routing layer | Teams already locked into LiveKit's inference stack |
| **Vapi** | Managed voice agents | Per-minute agent pricing | Teams that want the whole agent managed, not the models routed |
| **DIY (Direct APIs + LiteLLM)** | Your own routing | Provider rates + your engineering | Teams with in-house evals and the headcount to maintain them |
| **OpenRouter** | LLM-only router | +5-6% | Text/agent workloads — no STT/TTS coverage |

## FAQ

**Is Speko really "OpenRouter for Voice"?**
Structurally, yes: one OpenAI-compatible API, one key, many providers, a percentage markup on routed calls. The difference is the vertical: STT/LLM/TTS ensembles, per-language routing, and continuously published benchmark boards instead of a single leaderboard.

**How does the router decide which model to call?**
From Speko's own measurements (WER, cost, latency) per language and per task, published at benchmarks.speko.ai — not from vendor marketing numbers. `model: 'auto'` delegates the choice to those measurements.

**What about end-to-end speech-to-speech models?**
Speko benchmarks s2s models with the same methodology and routes to them if they win. The founder's data point: production traffic is still ~95% cascaded (STT + LLM + TTS) as of launch.

**What does it cost?**
+5% on the provider's published rate when routed, or $0.09/minute all-in on Speko infrastructure covering STT + LLM + TTS. $100 signup credit. Enterprise is custom with a committed monthly minimum.

**Is it production-ready?**
Public preview: email-only support, no SLA outside Enterprise, no long-term commitment on the self-serve plans. Fine for prototypes and internal tools; enterprise contracts exist for regulated deployments.

## Bottom Line

Speko is the most coherent "router for voice" pitch we've seen: the benchmark boards give the routing claim teeth, the OpenAI-compatible surface makes adoption nearly free for anyone on LiveKit or an OpenAI-style voice stack, and the $0.09/min all-in price is a genuinely simple alternative to provider-hopping. The open questions are maturity (preview-stage support and SLAs) and methodology (the boards are self-published, with an English-heavy bias at launch). If you're already building voice agents and tired of maintaining your own model-selection layer, Speko is worth a weekend prototype — the $100 credit covers it.
