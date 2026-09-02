---
title: "commerce-agents Review 2026 — Anthropic's Reference Blueprint for Building Shopping and Merchant Agents With Claude"
date: 2026-09-03
author: "AIPlaybook Editorial Team"
category: "Agent Frameworks"
tags:
  - "commerce-agents"
  - "Anthropic"
  - "Claude"
  - "Shopping-Agent"
  - "Merchant-Agent"
  - "Agent-SDK"
  - "Managed-Agents"
  - "MCP"
  - "E-Commerce"
  - "Reference-Implementation"
  - "Open-Source"
  - "Claude-Code"
cover: "/images/reviews/commerce-agents-review-2026/cover.png"
meta_description: "commerce-agents is Anthropic's official Apache-2.0 reference blueprint (created 2026-09-01, 289+ stars in 2 days) for building two Claude agents — a customer-facing shopping agent and a staff-facing merchant agent. Each agent is defined once (prompt, skills, tool contracts, gates) and runs on the Messages API, the Claude Agent SDK, or Managed Agents, with four runnable verticals (retail, travel, telecom, entertainment) plus a Claude Code plugin that scaffolds agents against your own systems. This review covers the two-agent architecture, the five flows of each, the safety model (fencing, provenance gates, staged merchant writes, approval surfaces), the honest limitations (reference-only, not maintained, no contributions accepted), and who it's for."
rating: 7.5
dimensions:
  ease-of-use: 7.5
  features: 8
  value: 7.5
  performance: 7.5
  ecosystem: 8
pros:
  - "Anthropic's official reference: a complete, opinionated architecture for commerce agents — shopping (customer-facing) and merchant (back-office) — with prompts, skills, tool contracts, and gates defined once and runnable on Messages API, Agent SDK, or Managed Agents"
  - "Safety is structural, not advisory: fencing, provenance gates, caps, memory validation, and a merchant approval gate execute inside the tool call on all three runtime paths; nothing places an order, charges a card, or changes a live listing — checkout renders a cart for the host to complete and every merchant write is staged"
  - "Four runnable verticals (retail, travel, telecom, entertainment) with web storefronts and portals, plus shared host code — `python scripts/run_demo.py retail` boots an API and storefront on localhost"
  - "A Claude Code plugin (commerce-builder) scaffolds agents against your systems with /scaffold-commerce-agent, /add-commerce-flow, /author-commerce-evals and /review-commerce-agent, and auto-runs when a request matches"
  - "Clean separation between model-visible behavior and your systems: backend interfaces (StorefrontBackend, MerchantBackend) call your services server-side with host-held credentials; enable_* switches remove tools, prompt lines, and grounding rules for capabilities you don't have"
  - "Apache-2.0 with a docs/ tree that itemizes every safety rule by module (safety.md), maps backend methods to your systems (backends.md), and covers Vertex AI/Bedrock/Foundry deployment (deployment.md)"
cons:
  - "Explicitly a reference implementation: the README states it is 'not maintained and does not accept contributions' — you are meant to read it and build your own, not to depend on it"
  - "Everything is fictional: every company, brand, product, and person is ACME, so the examples prove architecture, not production readiness; the example apps have no authentication and MCP servers bind to loopback only"
  - "Real commerce integration is entirely on you: no MCP connectors ship (by design), and each backend method must be implemented against your catalog, cart, order, and policy systems"
  - "Two days old at review time (created 2026-09-01, ~289 stars / 50 forks): fast-moving signal, but zero release history and no maintenance commitment"
  - "Python 3.11+/Node 22 with an eight-app npm workspace is a heavier dev setup than a single-file demo; the merchant side needs an approval surface you build"
  - "The README's tone is blueprint rather than tutorial — you will read package docs before you feel productive"
best-for: "Engineering teams at retailers, marketplaces, or commerce platforms who want a battle-tested-looking reference architecture for Claude-based shopping assistants and merchant back-office agents — especially those evaluating how to structure prompts, skills, grounding, and approval gates before building against the Agent SDK or Managed Agents, or who want to scaffold a working pilot with the Claude Code plugin"
price: "Free, Apache-2.0, open source (Python). Running the demos requires an Anthropic API key; production deployment uses your existing Anthropic contract (Messages API / Agent SDK / Managed Agents) plus your own commerce backend systems"
---

## The Pitch: Two Commerce Agents, One Definition, Four Runnable Verticals

On September 1, 2026, Anthropic published `anthropics/commerce-agents`, a reference implementation that answers a question every retailer is now asking: *what should a commerce agent actually look like?* The repo's answer is two agents. A **shopping agent** a business embeds in its app for customers — it searches, compares, plans, fills the cart, answers order and policy questions, and remembers what a customer tells it. A **merchant agent** its staff use to run the back office — it explains performance, maintains listings, acts on inventory and order alerts, prices and promotes, and drafts campaigns.

The architectural bet is that both can be *defined once* — prompt, skills, tool contracts, gates — and then run on whichever runtime you pick: the Messages API, the Claude Agent SDK, or Managed Agents. In its first two days the repo drew ~289 stars and **50 forks** — a fork rate that high on a reference repo suggests teams aren't just starring it, they're cloning it to build on. Four runnable verticals (retail, travel, telecom, entertainment) demonstrate the same libraries against different business rules.

## The Two Agents and Their Five Flows

Each agent's behavior lives in skills — one directory per flow under `shopping-agent/skills/` or `merchant-agent/skills/`. The shopping agent's five flows cover search, comparison, planning, cart filling, and order/policy answers with memory. A deployment implements the `StorefrontBackend` interface (in `shopping-agent/core/shopping_agent/backend.py`) over its catalog, cart, order, and policy systems.

The merchant agent is the more interesting half, because its writes are **staged**: every listing fix, restock, price move, or campaign draft becomes a pending change that a human approves on a portal. Its five flows sit behind a `MerchantBackend` over analytics, catalog, inventory, pricing, and campaign systems. The travel vertical adds date-bound inventory and a `present_itinerary` extension; telecom adds account context, a plan matrix, and server-authored fee disclosures; entertainment (ACME Tickets) handles timed holds, waitlists, transfers, and venue maps.

## The Safety Model: Fencing, Gates, and Staged Writes

The README is explicit about what the demos will not do: *"Nothing places an order, charges a card, or changes a live listing: `checkout` renders the cart for the host to complete, and every merchant write is staged until a person approves it."* Fencing, provenance gates, caps, memory validation, and the merchant approval gate all run **inside the tool call** and hold on all three runtime paths (Messages API, Agent SDK, Managed Agents). Grounding, analysis budgets, and memory extraction are runtime features. `docs/safety.md` lists each rule with its module and what a deployment adds first — and the examples ship with no authentication, so the safety story is honest about what the repo itself does versus what you must add.

## Three Runtimes, One Definition

The Messages API runtime is the reference loop — `agent.stream_turn()` emits `text_delta`, `tool_call`, `ui`, and `cart_update` (or `change_update` on the merchant side) events, with an explicit `agent.update_memory()` step. The Agent SDK path runs the same prompt, skills, and tools with the SDK driving the loop, and nothing runs after the turn. Managed Agents deploys the same skills and contracts as a hosted agent calling your MCP server (`scripts/deploy_managed_agent.sh`, with `--live` for real deployment; the merchant manifest includes a scheduled digest).

## Scaffolding Your Own: The Claude Code Plugin

For most teams the fastest entry is the plugin: `claude plugin marketplace add anthropics/commerce-agents` then `claude plugin install commerce-builder@claude-commerce-agents`. Inside Claude Code, `/scaffold-commerce-agent a shopping assistant for our store` asks about your stack, plays the plan back, and builds a project; `/add-commerce-flow` and `/author-commerce-evals` extend it; `/review-commerce-agent` audits one you already have. Each command also runs when a request matches its description.

Backend methods call your services server-side with the credential your host holds for the session — the model reads only the result. Flows with a fixed step order enforce that order in the backend, not in the prompt. MCP connectors deliberately don't ship: both agents reach your systems through backend interfaces, and where an official connector is the source of record (Snowflake/BigQuery/Databricks/Amplitude for analytics, Stripe/Square/PayPal/QuickBooks for finance), it's the integration target. The merchant config carries `enable_*` switches for listing edits, inventory, pricing, and campaigns so you can switch off whole capabilities.

## Honest Limitations

The biggest caveat is in the license section: this is a **reference implementation that is not maintained and does not accept contributions**. That means no issue tracker backlog, no roadmap, no community fixes — the value is the architecture and the code you fork. Everything is fictional ACME data, so don't mistake the demos for production behavior. The example apps have no authentication, and the MCP servers bind to loopback. Real integration — catalogs, carts, checkout hand-off (the checkout card links to *your* checkout route or hosted checkout URL, which the model never sees) — is your job, guided by `docs/backends.md`. And at two days old with no releases, the repo is a strong signal of Anthropic's commerce direction rather than a proven product.

## Verdict and Who It's For

commerce-agents is the most complete public reference for Claude commerce agents we've seen: two role-correct agents, five flows each, a structural safety model with staged merchant writes, four runnable verticals, and a scaffolding plugin. It's not a product you run in production — it's the architecture you copy, the vocabulary you adopt (fencing, provenance gates, backend interfaces, approval surfaces), and the fastest way to get a shopping-agent pilot running against your own stack. For teams at retailers and marketplaces evaluating Claude for commerce, that makes it a Silver-tier reference worth reading cover to cover before you write your first prompt.

*Review based on public repository contents, README, docs/safety.md structure, and repository metadata as of 2026-09-03. Star/fork counts reflect the first two days of a reference repo that explicitly does not accept contributions.*
