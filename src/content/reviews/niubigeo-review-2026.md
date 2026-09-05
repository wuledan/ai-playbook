---
title: "niubigeo Review 2026 — Open-Source AI Brand Visibility Audits: See Whether ChatGPT, Claude and Perplexity Recommend Your Product"
date: 2026-09-06
author: "AIPlaybook Editorial Team"
category: "SEO"
tags:
  - "niubigeo"
  - "GEO"
  - "AI-Visibility"
  - "Brand-Monitoring"
  - "Competitor-Analysis"
  - "ChatGPT"
  - "Perplexity"
  - "Claude"
  - "Open-Source"
  - "Self-Hosted"
  - "BYOK"
cover: "/images/reviews/niubigeo-review-2026/cover.png"
meta_description: "niubigeo is an Apache-2.0, self-hosted AI brand visibility auditor (created 2026-09-03, 450+ stars and 33 forks in its first three days) that answers the question every founder is asking in 2026: does ChatGPT, Claude, Gemini or Perplexity actually recommend my product when users ask? You enter a domain, confirm the brand, competitors and customer questions, and niubigeo calls the provider APIs you configure — OpenRouter, OpenAI, Anthropic, Gemini, Perplexity, DeepSeek, or any OpenAI-compatible gateway — then produces a readable report in English or Chinese where every conclusion links back to the underlying AI answer and cited sources. It separates confirmed competitors from loosely related names, flags the questions where your brand is missing, and never hides analysis behind an unexplained score. This review covers the audit flow, the seven supported providers, Docker and CLI usage, the honest boundaries of API-based measurement, and how it compares with commercial platforms like Profound, Otterly.AI, Semrush AI Visibility and Ahrefs Brand Radar."
rating: 7.3
dimensions:
  ease-of-use: 7
  features: 7.5
  value: 8
  performance: 7
  ecosystem: 6.5
pros:
  - "Answers the exact question paid GEO platforms charge for, in the open: enter a domain, see whether AI recognizes your brand, how it describes it, which competitors show up instead, and which cited sources shape the answer — every conclusion in the report links back to the original AI answer so nothing is a black-box score"
  - "Seven provider paths with bring-your-own keys: OpenRouter (one key, many models, native web plugin), OpenAI Responses API, Anthropic Messages API with Claude web search, Gemini with Google Search grounding, Perplexity Sonar with returned citations, DeepSeek, and any OpenAI-compatible gateway — provider keys never cross boundaries"
  - "Honest about its own measurement: it separates 'confirmed competitors' from loosely related brands, keeps AI answers collapsed but inspectable, and the report structure answers plain business questions (does AI know me, who shows up instead, which questions miss me) rather than demanding GEO-metric literacy"
  - "Reproducible and auditable by design: question confirmation happens before any provider call, the CLI accepts custom keywords, competitor lists and customer question sets, and reports land in local runs/ directories — you can rerun the same audit against a different model and diff the answers"
  - "Bilingual by design (English and Simplified Chinese) across the UI, auto-generated monitoring questions, provider prompts, brand analysis and the final report — rare for an open-source tool in this category"
  - "The comparison table against commercial platforms (Profound, Peec AI, Otterly.AI, Semrush AI Visibility, Ahrefs Brand Radar, AthenaHQ, Scrunch) is honest about trade-offs: you give up hosted infrastructure, proprietary datasets and team workflows to get open source, self-hosting and full control of questions and models"
cons:
  - "Alpha software: v0.1.0-alpha at review time with interfaces, data structures and report rules still subject to change, and the roadmap items (scheduled monitoring, report comparison under identical audit conditions, export packages, provider plugin SDK) are exactly the features a continuous brand tracker needs"
  - "API answers are not consumer UI answers: niubigeo measures what provider APIs return, which can differ from what a user sees in the ChatGPT or Gemini web apps — the README says so explicitly, and human regional testing is a separate paid managed service"
  - "No provider key means no results, and one audit is a stochastic snapshot, not a permanent ranking — it needs your keys and your questions to be meaningful, so the value depends on how carefully you define the audit"
  - "Small contributor base and a fast-moving young project: 11 open issues already include real bugs (short brand names misclassified in prompt targeting, GitHub repository citations matching same-path-prefix repos, web search reported without execution evidence), which is healthy for an alpha but a warning for production dependence"
  - "No hosted option in the Community Edition: scheduled runs, cross-audit comparisons and the consumer-web-UI checks are either on the roadmap or gated behind the NiubiStar managed service"
best-for: "Founders, SEO and GEO practitioners, and marketing teams who want to know — before paying for a SaaS visibility platform — whether AI assistants recommend their product, who shows up instead, and which sources AI cites; especially teams that want to self-host, bring their own model keys, define their own questions and keep the evidence chain fully inspectable"
price: "Free and open source (Apache-2.0). Self-hosted via Docker (docker compose up --build, published image ghcr.io/albert-weasker/niubigeo) or Node.js 22+; npm run audit for CLI audits. Bring your own provider API keys — cost is your own API usage. A commercial NiubiGEO Managed Service (human regional testing, consumer web UI checks, GEO optimization plans) is offered by NiubiStar separately"
---

## The Question Every Brand Faces in 2026: Does AI Recommend You?

More users now ask an AI assistant directly instead of clicking through a page of search results. "What tools should I use?" "What are the alternatives to this product?" "Which one should I choose?" Your website can be perfectly indexed by search engines while ChatGPT, Claude, Gemini or Perplexity still miss your brand entirely, misunderstand your positioning, or cite third-party pages while ignoring your official site. That gap between search-engine visibility and AI visibility is what Generative Engine Optimization (GEO) exists to close — and it is the problem niubigeo, created September 3, 2026 by Albert-Weasker and released under Apache-2.0, attacks with a deliberately boring architecture: ask real AI providers real customer questions, read what they actually answer, and show you the receipts.

The pitch fits in one line from the README: *"Does AI recommend your product? Who shows up instead?"* The repo is TypeScript, self-hosted, and reached roughly 457 stars and 33 forks within its first three days — a signal that the category (AI visibility auditing) has far more demand than supply in the open-source world. NiubiGEO is built by NiubiStar, which also runs a commercial managed version of the same audit, but the Community Edition is a genuine product: Docker image, CLI, seven provider integrations, and a report format designed to be read by founders rather than GEO analysts.

## The Audit Flow: Confirm Before You Call

The core loop is six steps and every one of them is visible to you. You enter a domain or product page. NiubiGEO identifies the brand, its aliases, category, keywords, and likely competitors. Crucially, **you confirm or edit the questions before any provider call happens** — the tool does not silently decide what to ask on your behalf. It then calls the provider APIs you configured, analyzes how the target brand, competitors and recommendations appear in the answers plus which sources the providers returned, and generates a short, readable report.

That confirmation step is the design decision that separates niubigeo from a dashboard that hands you a number. The report answers plain business questions in a summary tree: Does AI recognize your product? How does AI describe your brand? Who are the confirmed competitors? Which questions surface competitors more often? Which important questions miss your brand entirely? Which sources support these conclusions? Full AI answers are collapsed by default and can be opened when you want to inspect the evidence behind any single conclusion. NiubiGEO also separates **confirmed competitors** — products AI actually brings up when your brand is not mentioned — from **loosely related names**, so you do not chase noise.

## Seven Provider Paths, One Key Each

Provider coverage is where the tool is unusually pragmatic. One OpenRouter key can run models from many providers with native web plugin support. OpenAI goes through the official Responses API with native `web_search`; Anthropic through the Messages API with Claude web search; Gemini through the official API with Google Search grounding; Perplexity through Sonar's web-grounded answers with provider-returned citations; DeepSeek through its Responses-compatible API with native `web_search`. Any OpenAI-compatible gateway works via `OPENAI_COMPATIBLE_BASE_URL` and a companion key. Provider keys never cross boundaries — an OpenAI key only calls OpenAI, a Gemini key only calls Gemini — and without at least one key the tool produces no visibility results at all. The README's provider-native search doc spells out the exact execution paths and source-labeling rules per provider.

## Docker, Node, or a CLI Audit

Three usage modes cover three different buyers. The quick path is Docker: clone, copy `.env.example` to `.env`, add at least one provider key, `docker compose up --build`, and open `http://localhost:8787` to enter a domain and run the audit; a published image exists at `ghcr.io/albert-weasker/niubigeo`. Node users clone and run `npm install`, `npm run self-check`, then `npm run server`. The CLI is the most scriptable mode:

```bash
npm run audit -- \
  --domain example.com \
  --provider openrouter \
  --models openai/gpt-4o-mini,perplexity/sonar \
  --prompt-count 8
```

You can add your own keywords and real customer questions — `--keywords "category keyword,buyer intent keyword"`, `--competitors rival.com,other.com`, and `--prompts "What are the best tools in this category?|What are the alternatives?"` — which makes the audit repeatable against a fixed question set, the right primitive for tracking whether a change moved the needle. Reports are saved in the local `runs/` directory by default, so consecutive audits against different models or question sets can be compared later. The whole product is bilingual by design: English and Simplified Chinese affect the interface, the automatically generated monitoring questions, the prompts sent to providers, brand and competitor analysis, and the final report.

## The Honest Boundaries of API-Based Measurement

NiubiGEO's documentation is refreshingly direct about what it does and does not measure. Community Edition uses provider APIs and **does not simulate consumer web UI results** — API answers can differ from what a user sees in the ChatGPT or Perplexity web apps, which is precisely why the managed service exists with human regional testing. Citations only come from provider responses or sources that appear in the AI answer. OpenRouter results are labeled as OpenRouter API even when the underlying model is from another provider. The core audit path never treats mock data as a substitute for real provider answers, and the docs are explicit that AI answers are stochastic — one audit is not a permanent ranking. There is also a security note: do not commit provider keys, customer reports, private prompts, or run data containing sensitive information, with private reporting via SECURITY.md.

## NiubiGEO vs the Commercial GEO Platforms

Rather than hand-waving, the README includes a point-by-point comparison against Profound, Peec AI, Otterly.AI, Semrush AI Visibility, Ahrefs Brand Radar, AthenaHQ and Scrunch, last checked September 3, 2026. The pattern across all of them: commercial platforms win on hosted infrastructure, proprietary datasets, mature marketing workflows and team collaboration; niubigeo wins on open source, self-hosting, bring-your-own provider keys, and inspectable evidence — you define the questions, choose the models, and open the original AI answer behind each conclusion. The capability table makes the trade-off legible: AI brand visibility, competitor analysis and citation analysis are supported on both sides; open source, self-hosting and BYOK are niubigeo-only; hosted infrastructure, proprietary datasets and team workflows are commercial-only, with team workflows marked "Planned" for niubigeo. For a team deciding between a $100+/month SaaS subscription and a self-hosted audit they fully control, that is the entire argument in one table.

## Honest Limits and Who It's For

At review time niubigeo is v0.1.0-alpha, three days old, with two contributors and 11 open issues — several of which are genuine bugs that show the tool is being used: short brand names can misclassify unbranded prompts, GitHub repository citations can match repositories with the same path prefix, and web search can be reported as used without execution evidence. None of that is disqualifying for an alpha, but it is a warning for anyone planning to build production monitoring on it today: the roadmap features you would want for continuous tracking — scheduled monitoring, report comparison under identical audit conditions, export packages, a provider plugin SDK — are not shipped yet, and the current release is a point-in-time audit tool, not a watchtower.

For founders who have ever wondered whether ChatGPT mentions their product when a customer asks "what are the best tools in this category?", niubigeo is the cheapest way to find out: self-host it, plug in an OpenRouter key you already pay for, and get a readable, evidence-linked report in minutes. It will not tell you what users see in consumer web UIs, and it will not continuously monitor your brand yet — but as a transparent, self-hosted, multi-provider AI visibility audit it delivers exactly what its name promises, and it does so without hiding behind an unexplained score.
