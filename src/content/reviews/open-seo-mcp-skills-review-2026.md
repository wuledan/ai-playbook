---
title: "open-seo-mcp-skills Review 2026 — Claude Skills That Run SEO on Your Real Search Console, GA4 and Ads Data"
date: 2026-09-02
author: "AIPlaybook Editorial Team"
category: "SEO"
tags:
  - "open-seo-mcp-skills"
  - "SEO"
  - "GEO"
  - "Claude"
  - "Claude-Code"
  - "MCP"
  - "Search-Console"
  - "GA4"
  - "DataForSEO"
  - "Keyword-Research"
  - "Rank-Tracking"
  - "AI-Visibility"
  - "Open-Source"
cover: /images/reviews/open-seo-mcp-skills-review-2026/cover.png
meta_description: "open-seo-mcp-skills is a free MIT-licensed pack of eight Claude skills (seo-audit, keyword-research, rank-tracking, competitor-gap, backlink-check, ai-visibility, content-brief, seo-vs-ads) that run SEO directly on your own Google Search Console, GA4 and Google Ads data through the Ryze MCP connector, with DataForSEO wired in for competitor keywords, backlinks and SERPs. No subscription, no markup on API calls, no SERP-scrape estimates: rankings are your real GSC positions and traffic is your real GA4 — including AI referral traffic from ChatGPT, Perplexity, Claude and Gemini. This review covers what each skill does, the data-source architecture, the honest limitations (Ryze workspace dependency, skill quality variance), and how it compares to Semrush, Ahrefs and OpenSEO-style wrappers."
rating: 7.6
dimensions:
  ease-of-use: 8
  features: 7.5
  value: 8.5
  performance: 7
  ecosystem: 6.5
pros:
  - "First-party truth instead of estimates: rankings come from your real Search Console positions and traffic from real GA4 — including AI referral traffic (ChatGPT, Perplexity, Claude, Gemini) that scrape-based tools can only guess at"
  - "Eight ready-made skills cover the whole workflow — audit, keyword research, rank tracking, competitor gap, backlinks, AI visibility, content briefs, and SEO-vs-ads cannibalization — each with a documented fallback when a data source is unavailable"
  - "The honest pricing model is the differentiator: MIT skills, no subscription for the tool, no markup layer on data calls — you pay only what your Ryze workspace and connected accounts cost"
  - "DataForSEO is pre-wired into the connector, so competitor keywords, backlinks and SERPs work without you managing a separate DataForSEO key or building a markup integration"
  - "Works natively inside Claude as a plugin: `claude plugin marketplace add Ryze-AI-Adgent/open-seo-mcp-skills` then `/plugin install open-seo-mcp-skills@ryze`, or just copy the skills folder into ~/.claude/skills/"
  - "GEO-first design: the ai-visibility skill answers a question most SEO tooling still can't — which AI engines send you traffic and which pages do they cite"
cons:
  - "The skills are the MIT half; the data half runs through the hosted Ryze MCP connector (connector.get-ryze.ai) and your own Ryze workspace — so 'open source SEO' still means trusting a vendor with your GSC/GA4/ads OAuth, even if the code is free"
  - "Tool availability varies by workspace and plan; every skill declares its fallback, which means on lower tiers some skills degrade to partial answers"
  - "Quality of a 'skill' is a prompt, not a product: you get Claude's judgment on top of your data, so results vary with the model, the skill version, and how well your properties are connected"
  - "Two days old at review time (created 2026-08-29): 255 stars, only 2 forks, no release history, no issue backlog to judge maturity — the docs live on a help subdomain and are still filling in"
  - "No local/self-hosted option for the connector: if you want zero third-party data access, this isn't it — you'd keep using raw GSC exports with manual prompts"
best-for: "SEO practitioners, content teams and GEO-curious site owners who already live in Claude and want SEO work (audits, keyword plans, rank tracking, competitor gaps, AI-visibility reporting) executed against their own Search Console / GA4 / Ads data without paying for a Semrush/Ahrefs subscription or a hosted SEO-AI wrapper"
price: "Free, MIT-licensed skills; data access through a free Ryze workspace with your connected Google Search Console / GA4 / Ads accounts; DataForSEO calls billed through your Ryze workspace (no markup layer, no separate key to manage); optional paid Ahrefs/Semrush connections if you already subscribe"
---

## The Pitch: SEO Skills That Read Your Own Data

On August 29, 2026, `Ryze-AI-Adgent/open-seo-mcp-skills` hit GitHub with a pointed argument: *"open source SEO tools" are having a moment, but most are just a UI over the DataForSEO API — you either bring your own key and pay per request, or pay a hosted subscription plus a ~28% markup on every data call. The code is free; the data never was.*

The repo's answer is a pack of **eight Claude skills** that flip the data source: instead of estimating rankings from SERP scrapes, they read **your actual Google Search Console positions**, **your actual GA4 traffic** (including AI referral traffic), and **your actual Google Ads keyword planner volumes** — through the hosted Ryze MCP connector, with DataForSEO wired in only for the data Google won't give you (competitor keywords, backlinks, SERPs).

In two days it collected **255 stars and 2 forks**, which tells you the pain point is real: SEO teams already pay for Semrush or Ahrefs, and AI-adjacent SEO tooling has been a parade of hosted wrappers that charge markup on data calls.

## Architecture: Skills + One MCP Connector

The design is deliberately thin. Two install steps:

1. **Connect the Ryze MCP** in Claude: Settings → Connectors → Customize → add a custom connector named `Ryze AI` pointing at `https://connector.get-ryze.ai/mcp`. Sign in, pick a workspace, connect Google Search Console / GA4 / ads accounts once.
2. **Install the skills** as a Claude Code plugin:

```
claude plugin marketplace add Ryze-AI-Adgent/open-seo-mcp-skills
/plugin install open-seo-mcp-skills@ryze
```

or copy them directly: `git clone` the repo and `cp -r open-seo-mcp-skills/skills/* ~/.claude/skills/`.

The eight skills map onto the standard SEO workflow:

| Skill | What it does | Data source |
|---|---|---|
| `seo-audit` | Full site audit: indexation, CTR anomalies, decaying pages, quick wins | GSC + GA4 |
| `keyword-research` | Seed → ideas → volume/CPC/intent → clustered keyword plan | Google Ads + DataForSEO |
| `rank-tracking` | Position movers between any two periods, no tracker subscription | GSC |
| `competitor-gap` | Keywords a competitor ranks for that you don't | DataForSEO + GSC |
| `backlink-check` | Backlink profile + referring domains vs a competitor | DataForSEO |
| `ai-visibility` | Which AI engines send you traffic and which pages they cite | GA4 AI-referral reports |
| `content-brief` | SERP-driven brief: headings, entities, questions, internal links | DataForSEO + GSC |
| `seo-vs-ads` | Queries you pay for that you already rank for organically | GSC × Google Ads |

Then you just ask in natural language: *"run an SEO audit on my site"*, *"what keywords does competitor.com rank for that I don't?"*, *"how much am I paying for clicks I'd get free?"*

The MCP tool namespace follows a `<provider>__<tool>` convention (`google_search_console__runRawSearchAnalytics`, `google_ads__generateKeywordIdeas`), and when a request shape is unclear the skills call `native__get_provider_docs` with the provider name to pull official API docs — a nice touch for a skill pack, because it keeps prompts resilient to API changes.

## What Actually Makes This Interesting

Three design choices separate this from the SEO-AI wrapper crowd:

**1. First-party data beats scraped estimates.** Rank trackers like Semrush and Ahrefs estimate positions from SERP scrapes. This pack reads your real GSC positions — actual impressions, clicks, and average position, not a model's guess. The same for traffic: GA4 gives you real sessions instead of a projection. For a content team that lives in Claude, that's the difference between "Claude tells me my rankings" and "Claude reads my rankings."

**2. GEO is a first-class citizen.** The `ai-visibility` skill reads GA4's AI-referral reports to answer which AI engines (ChatGPT, Perplexity, Claude, Gemini) send you traffic and which pages they cite. That's a question most SEO platforms still answer with prompt-sampling estimates or not at all. For sites chasing Generative Engine Optimization in 2026, this is arguably the pack's single most valuable skill — and it requires no extra data source, just your own GA4.

**3. The pricing model is the feature.** No tool subscription, no markup on data calls, MIT license on the skills. You pay for your Ryze workspace's data access and your connected accounts. The comparison table in the README is blunt about it: Semrush/Ahrefs at $120+/mo with estimated rankings, OpenSEO-style wrappers with free code but a ~28% hosted markup on DataForSEO, versus this with free skills and real GSC/GA4 data.

## Honest Limitations

The README is upfront that tool availability varies by workspace, and every skill declares its fallback — on a limited workspace, `competitor-gap` or `backlink-check` may degrade to partial answers. And while the skills are MIT, the **data path runs through the hosted Ryze connector**, so "open source SEO" still means authorizing a third party to read your GSC/GA4/ads data via OAuth. If your threat model says no vendor sees your analytics, this isn't the tool — you'd stay on raw exports with hand-written prompts.

It's also a two-day-old repo: 255 stars and only 2 forks at review time, no release tags, no issue backlog to judge how the skills behave in the wild at scale. The skills are prompts on top of Claude's judgment — quality will vary with model version and how cleanly your properties are connected. And the `seo-vs-ads` skill's premise (queries you pay for that you already rank for) is genuinely useful, but it's only as good as your Google Ads account structure.

## Verdict and Who It's For

For SEO practitioners and content operators who already live inside Claude, this is the most honest "AI SEO tool" architecture we've seen this quarter: the data is real, the code is free, and the workflow (audit → keyword plan → content brief → AI-visibility report) maps directly onto how a content pipeline actually runs. It won't replace Semrush for deep backlink archaeology, and the hosted connector is a real trust decision — but for day-to-day SEO operations on your own properties, it does what hosted SEO-AI wrappers charge $10-50/month for, with better data. That's a Silver-tier pick with genuine GEO upside.

*Review based on public repo contents, README, and repository metadata as of 2026-09-02. Star/fork counts and features may change quickly for a two-day-old project.*
