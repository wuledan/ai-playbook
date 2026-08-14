---
title: "Toast 1 Review — Mixedbread's Specialized Search Agent Matches Opus 5 and Sol at 10x Lower Cost"
date: 2026-08-15
author: "AIPlaybook Editorial Team"
category: "Search Agents"
tags:
  - "Mixedbread"
  - "Toast"
  - "Search"
  - "Agentic-RAG"
  - "Retrieval"
  - "Sub-agents"
  - "Pricing"
cover: /images/reviews/toast-1-review-2026/cover.png
meta_description: "Toast 1 is Mixedbread's first specialized search agent: frontier search quality matching or beating Claude Opus 5 and GPT-5.6 Sol at up to 10x lower cost and 12x higher speed. On Databricks' OfficeQA Pro V2, GPT-5.6 Sol in Codex with Toast 1 hits 70% answer correctness at ~$1.15-1.20 per task — the best score in the benchmark at a fraction of the cost of the previous Pareto frontier (Claude Fable 5 on Genie: 60% at ~$4). Launch pricing: $0.30/$0.72 per 1M tokens (40% off), $1 per 1K search queries. Review covers the benchmark claims, how it fits in retrieval stacks, and the HN reaction to specialized search models."
rating: 7.7
dimensions:
  ease-of-use: 7
  features: 8
  value: 9
  performance: 8
  ecosystem: 6
pros:
  - "Frontier search quality at commodity prices: matches/outperforms Claude Opus 5 and GPT-5.6 Sol on retrieval benchmarks while being up to 10x cheaper and 12x faster"
  - "Concrete third-party validation: on Databricks' OfficeQA Pro V2, Codex + Toast 1 hits 70% correctness at ~$1.20/task — the top score in the released eval, vs Claude Fable 5 on Genie at 60% for ~$4"
  - "Works with any search backend, not just Mixedbread's own stack — designed to slot in as a sub-agent your frontier model already knows how to call"
  - "Takes over the whole search loop: decomposes queries, gathers evidence, inspects sources, curates context — so the frontier model spends its tokens on reasoning, not lookup"
  - "Launch pricing is aggressive: 40% off LLM tokens ($0.30 in / $0.72 out per 1M) and $1 per 1K Toast 1 search queries"
  - "Benchmark methodology is open: Mixedbread confirms harness kept constant (Codex/Genie as Databricks used) and publishes interactive trace waterfalls"
cons:
  - "New product (v1.0, day one): ecosystem is thin — no OpenAI/Anthropic SDK integrations, no LangChain/LlamaIndex adapters yet, docs assume you build your own loop"
  - "Search usage billed separately from LLM tokens — the real cost depends on how many sub-query rounds your workload triggers, which is harder to budget than flat token pricing"
  - "Best results require Mixedbread Search (Wholembed v3 late-interaction retrieval); 'any backend' support is functional but unproven in benchmarks"
  - "HN skeptics note that quality metrics are agentic-benchmark-driven — 'I love to spend a dollar for a 70% correct search result' (jrflowers)"
  - "The branding drew real criticism: 'every time it comes up we have to double-check that it isn't some spoof/joke page' (ChrisArchitect) — a credibility tax for an enterprise product"
best-for: "Teams running agentic retrieval at scale — RAG pipelines, financial analysis agents, legal knowledge search — where frontier-model lookup costs dominate the bill"
price: "Launch: $0.30 in / $0.72 out per 1M LLM tokens (40% off, regular $0.50/$1.20); cached input $0.036; $1 per 1K Toast 1 search queries (+$1.50 with rerank); Scale plan $20/mo"
---

## Quick Verdict

Toast 1 is Mixedbread's bet that search is a specialization, not a generalist chore. It's a small, fast model that fully owns the retrieval loop — decomposing a query into sub-queries, gathering evidence, inspecting sources, and curating context — before handing a clean, token-efficient evidence package to a frontier model. The pitch: frontier search quality at up to 10x lower cost and 12x higher speed than using Opus 5 or GPT-5.6 Sol for the same lookup work.

The evidence is genuinely interesting. On Databricks' OfficeQA Pro V2, GPT-5.6 Sol running in Codex with Toast 1 as a sub-agent reaches 70% answer correctness at ~$1.15-1.20 per task — the highest score in the benchmark set and well above the previous Pareto frontier (Claude Fable 5 on Databricks Genie at 60% for ~$4). That's the strongest third-party validation a day-one search product has shipped with in a while.

**Rating: 7.7/10** — a real economic innovation in agentic retrieval, slightly held back by day-one ecosystem thinness and a branding problem the HN crowd won't let go of.

## What Toast 1 Does

The core idea: most agents waste most of their tokens looking things up, and context rot sets in when a frontier model burns context on noisy retrieval. Toast 1 replaces that loop. Given an initial query, it:

1. **Decomposes** the query into sub-queries
2. **Gathers** evidence across its search backend
3. **Inspects** sources (grep patterns, plans, re-queries)
4. **Curates** the relevant context into a compact evidence package

The blog shows a waterfall trace of a single query — "How did the employment rate change in retail compared to the healthcare sector?" — completed in 16 tool calls across 3 rounds in 5.33 seconds. It runs standalone or as a sub-agent that frontier models (Codex, Claude Code, any agent harness) already know how to call. It performs best with Mixedbread Search — a multimodal, multilingual search product powered by Wholembed v3, a late-interaction retrieval model — but works with any search backend.

Mixedbread's framing on why RAG underperforms: single embedding vector models "are not that good and stopped improving," and "most models are not good at looking up information." They trained Toast 1 specifically to be good at the lookup half, and kept the index as the bigger lever.

## Benchmarks: The Claims vs Third-Party Eval

| Benchmark | Setup | Result |
|-----------|-------|--------|
| OfficeQA Pro V2 (Databricks) | GPT-5.6 Sol in Codex + Toast 1 | **70% correctness at ~$1.15-1.20/task** (best in eval) |
| OfficeQA Pro V2 previous best | Claude Fable 5 on Databricks Genie | 60% at ~$4/task |
| OfficeQA Pro V2 baseline | GPT-5.6 Sol in Codex without Toast 1 | 33% correctness |
| Harvey LAB Law Firm Knowledge | GPT-5.6 Sol, 33-task subset | Answer quality constant across search methods; cost collapses with Toast 1 |
| Retrieval evals (mixedbread) | Open-source Toast harness | Matches or beats Opus 5 / GPT-5.6 Sol |

Mixedbread addressed methodology questions directly: for retrieval benchmarks the harness is the open-source Toast harness kept identical across models; for OfficeQA they used Codex exactly as Databricks did, adding only minimal tools for Mixedbread Search and Toast 1; for Harvey LAB they used the vanilla benchmark. The OfficeQA result is notable not just for the 70% score — the previous frontier was 60% at ~$4 — but because without Toast 1, the same Codex + Sol setup only reaches 33%. The economic story is the point: evidence gathering reformulated as a specialized, cheap operation.

## Pricing

Toast 1 launches with a 40% discount, with search billed separately from LLM tokens:

| Item | Regular | Launch price |
|------|---------|--------------|
| LLM input tokens | $0.50 / 1M | **$0.30 / 1M** |
| Cached input | $0.06 / 1M | **$0.036 / 1M** (cache writes free) |
| LLM output tokens | $1.20 / 1M | **$0.72 / 1M** |
| Toast 1 search queries | — | **$1 / 1K queries** (+$1.50 with rerank) |

The platform has a free Starter tier ($5 one-time credits, 100 requests/min) and a $20/month Scale tier with 10,000 stores and 1,200 queries/min. Startup credits up to $250 are available. The economics that matter: at $1 per 1K queries, a 3-round agentic search costs fractions of a cent, versus frontier-model lookup that can burn dollars of output tokens per task.

## Community Verdict

The HN thread (169 points, 57 comments) split between the search-economics discussion and the branding debate. The substantive camp liked the specialization: "I deeply love this idea of specialized LLMs for search. It's also extremely confusing to me how rough Google's entrance here is" — trjordan. Mixedbread's founder (breadislove) engaged directly: "the issue with smaller general models... are way behind the frontier models when it comes to search... having a very good index is the biggest lever and then having a specialised model."

The branding camp was loud and not wrong: "Dunno about this branding/naming scheme — every time it comes up we have to double-check that it isn't some spoof/joke page" — ChrisArchitect; "An inside joke that confuses your target audience and makes you sound like a joke, is probably not what you want as your brand" — andai. The pricing skeptics poked at value: "I love to spend a dollar for a 70% correct search result" — jrflowers. And there was genuine curiosity about where a search agent fits versus plain RAG pipelines — the answer being that Toast 1 replaces the model side of retrieval, not the index.

## Alternatives

- **Claude Opus 5 / GPT-5.6 Sol (direct)** — Frontier models used for lookup directly; 10x more expensive per search task and slower, but zero integration work and no new vendor.
- **NotebookLM / Gemini Deep Research** — Google's answer to deep retrieval; excellent results, closed ecosystem, no programmatic sub-agent API at this granularity.
- **Perplexity / Kagi Assistant** — Consumer search+answer layers; cheap for humans, not designed as agent sub-components.
- **Standard RAG with embedding models** — The incumbent approach; cheaper than frontier lookup but, per Mixedbread's (and many practitioners') experience, "not super great" at hard retrieval.
- **Open-source agent harnesses (pi.dev, LangGraph)** — DIY search agents wrapping small models; flexible, but you build and maintain the loop Toast 1 ships.

## FAQ

**Q: What is Toast 1?**
A: Mixedbread's first specialized search agent — a model that takes over the entire search loop (sub-query decomposition, evidence gathering, source inspection, context curation) and returns a compact evidence package to a frontier model. It's the retrieval half of agentic RAG, specialized and priced for it.

**Q: How much does Toast 1 cost?**
A: Launch pricing: $0.30 in / $0.72 out per 1M LLM tokens (40% off the regular $0.50/$1.20), plus $1 per 1K Toast 1 search queries. Search and LLM tokens are billed separately. Platform access starts free (Starter) or $20/month (Scale).

**Q: Does it only work with Mixedbread Search?**
A: No — it works with any search backend, but performs best with Mixedbread Search (Wholembed v3 late-interaction retrieval). Benchmarks were run with Mixedbread Search.

**Q: How does it compare to using GPT-5.6 Sol for search directly?**
A: On OfficeQA Pro V2, Codex + Sol with Toast 1 hits 70% correctness at ~$1.20/task vs 33% without it — and ~4x cheaper than the previous best (Claude Fable 5 on Genie at 60% for ~$4). Mixedbread claims up to 10x cheaper and 12x faster than frontier models doing the same search work.

**Q: Is the benchmark methodology trustworthy?**
A: Largely yes. Mixedbread used the same harnesses as the benchmark publishers (Codex for OfficeQA as Databricks did, vanilla Harvey for the legal benchmark, open-source Toast harness for retrieval evals) and published interactive trace waterfalls. The OfficeQA numbers were independently generated by Databricks' released eval, which Mixedbread ran.

**Q: Who should use Toast 1?**
A: Teams with token-hungry retrieval workloads — enterprise RAG, financial/legal analysis agents, anything where frontier-model lookup costs dominate. If your agent burns most of its context searching, Toast 1 is the specialization play. If you rarely search, skip it.
