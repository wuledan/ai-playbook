---
title: "useagent Review 2026 — The Open-Source AI Coworker: Agents With Their Own Cloud Computer, Your Tools and Context"
date: 2026-09-01
author: "AIPlaybook Editorial Team"
category: "Automation"
tags:
  - "useagent"
  - "AI-Coworker"
  - "Agent-Platform"
  - "Claude-Code"
  - "Codex"
  - "OpenCode"
  - "Sandbox"
  - "Self-Hosted"
  - "Slack"
  - "Open-Source"
  - "Event-Sourcing"
  - "Human-in-the-Loop"
cover: /images/reviews/useagent-review-2026/cover.png
meta_description: "useagent is the open-source AI coworker for your team: agents with their own cloud computer, your tools and context, handing back finished work — live websites, decks, spreadsheets, research reports, and tested pull requests — instead of just answers. It runs Claude Code, Codex, and OpenCode behind one provider-neutral event contract, with every run an event-sourced timeline in Postgres, isolated Linux sandboxes (terminal, browser, visible desktop with MP4 recording), a trusted gateway that keeps credentials out of the sandbox, human-in-the-loop approvals, and Slack-native operation. It shipped August 29, 2026 under AGPL-3.0 with a self-host deployment script and a reference Terraform host."
rating: 7.7
dimensions:
  ease-of-use: 7
  features: 8.5
  value: 7.5
  performance: 7
  ecosystem: 7
pros:
  - "One provider-neutral event contract for Codex, Claude Code, and OpenCode — swap engines and your threads, artifacts, and memory stay; every run renders through one session grammar regardless of engine"
  - "Real sandboxes, not abstractions: each thread gets an isolated Linux workstation with terminal, repositories, browser, and a visible desktop (noVNC) with MP4 recording — Daytona and CubeSandbox behind one sandbox contract"
  - "Credentials never enter the sandbox: knowledge, memory, skills, GitHub, web search, desktop control, and artifact publishing are typed tools served by a trusted gateway, with keys living only on your control plane"
  - "Durable by construction: every run is an event-sourced timeline in Postgres — runs survive backend restarts, recovery re-probes live sessions and adopts finished work instead of failing it"
  - "Human-in-the-loop done properly: destructive tools pause on an approval card (web or Slack) and resume with a one-shot, argument-bound capability rather than an open grant"
  - "Slack-native: mention-to-run, threaded replies, attachments, artifacts, and approvals all inside the thread — plus native DOCX/XLSX/PPTX/PDF artifacts with revisioned editing and native renderers"
cons:
  - "Explicitly alpha software: the README says APIs and schemas may change between releases, and stability requires pinning a tag — this is not a set-and-forget platform yet"
  - "Meaningful setup burden: bun + Postgres 16+ with the pgvector extension (stock Postgres images don't include it), seven monorepo workspaces to install, and a sandbox provider to provision (Daytona managed or CubeSandbox self-hosted)"
  - "AGPL-3.0 is a real constraint for commercial teams: self-hosting for internal use is fine, but distributing modified versions or offering it as a service has copyleft obligations that many vendors will need legal review for"
  - "151 stars and 18 forks at review time — a 3-day-old project with no release history, no issue backlog to judge maturity, and a docs site that's still filling in"
  - "The value depends on the engines you already pay for: it runs Claude Code, Codex, and OpenCode on your subscriptions — the orchestration is free, but the underlying agent capacity isn't"
  - "Credentials are sealed server-side for connectors (Gmail, Linear, Notion, HubSpot OAuth handled by the broker), which means the control plane is the single most sensitive machine in your stack — a compromise there exposes everything the gateway can reach"
best-for: "Small teams that already use Claude Code/Codex/OpenCode and want a self-hosted control plane that turns those agents into coworkers with durable sessions, isolated cloud computers, Slack delivery, and human-approved destructive actions — without sending code or credentials to a hosted vendor"
price: "Free, AGPL-3.0, self-hosted (bun + Postgres 16+ with pgvector; sandbox via Daytona managed or CubeSandbox self-hosted); you pay your existing agent subscriptions, sandbox compute, and infrastructure"
---

## The Pitch: Agents Hand Back Finished Work, Not Answers

On August 29, 2026, `useagenthq/useagent` hit GitHub with an ambitious description: *"The open-source AI coworker for your team: agents with their own cloud computer, your tools and context, handing back finished work websites, decks, spreadsheets, reports, PRs. Runs Claude Code, Codex, OpenCode on your subscription."* Three days later it has **150+ stars and 18 forks**, a docs site at useagent.org, and a monorepo spanning a control-plane backend, a product UI, shared contracts, a docs site, and a self-host infrastructure guide.

The core promise is a step beyond "agent runner": useagent turns the coding agents you already use into **coworkers with their own cloud computer**. They don't just answer — they produce durable artifacts: live websites, decks, spreadsheets, research reports, and tested pull requests, delivered through a UI, Slack, or a REST API.

Two design claims carry the whole pitch. First, **the engine is a plug**: Claude Code, Codex, OpenCode (and Pi) all speak one canonical event contract through engine adapters, so swapping engines doesn't strand your threads, artifacts, or memory. Second, **every run is an event log**: Postgres is the source of truth — runs survive backend restarts, replay exactly, and stay inspectable after the fact.

## Architecture: Sandbox, Gateway, and the Event Log

useagent's architecture has three properties that do the heavy lifting:

1. **Real sandboxes.** Each thread gets an isolated Linux workstation: terminal, repositories, browser, and a **visible desktop (noVNC) with MP4 recording**. Two sandbox providers sit behind one contract — **Daytona** (managed service, pairs with a host on any cloud, easiest start) and **CubeSandbox** (self-hosted runtime on your own hardware, full data locality).

2. **A trusted gateway.** Credentials never enter the sandbox. The agent's computer is isolated; every integration call — knowledge, memory, skills, GitHub, web search, desktop control, artifact publishing — crosses the gateway as a **typed tool**, and keys live only on your control plane. Connectors (Gmail, Linear, Notion, HubSpot) use OAuth handled by a broker with tokens sealed server-side.

3. **Human-in-the-loop by default.** Destructive tools pause on an approval card — in the web UI or a Slack thread — and resume with a **one-shot, argument-bound capability**. That's a meaningfully tighter grant than "the agent has shell access, trust it."

The run model is event-sourced throughout: every run is a timeline of typed events in Postgres. Recovery re-probes live sessions after a restart and adopts finished work instead of failing it — a durability story that most agent runners don't even attempt.

## Slack-Native Delivery and Native Artifacts

Where useagent differentiates itself from a plain web UI is the **Slack-native workflow**: mention-to-run, threaded replies, attachments, artifacts, and approvals all live inside the thread. Work arrives from anywhere — web app, Slack, REST API, schedules — and every channel enters through the same run door.

Artifacts are first-class: **native DOCX, XLSX, PPTX, and PDF with revisioned editing and native renderers**. That matters because a "finished deck" you can edit in place is a different deliverable than a screenshot of a deck. The artifact workspace is a package in the monorepo, and artifact formats are their own package with conformance tests.

Skills and team context are also first-class: **skills import from GitHub** (`SKILL.md` files as versioned skills, auto-resync, ranked into every turn), and knowledge/wiki/team memory is org-scoped retrieval with citations and a **human-reviewed learning lane** — the team's accumulated knowledge becomes part of what agents retrieve, with a review step before it enters the pool.

## Self-Hosting and the Setup Reality

Self-hosting is a documented, scripted path rather than a hope. The requirements: **bun**, **Postgres 16+ with the pgvector extension** (stock Postgres images don't include it — the quick start spins up a `pgvector/pgvector:pg16` container), and a sandbox provider. The quick start is:

```bash
docker run -d --name useagent-pg -p 5432:5432 \
  -e POSTGRES_HOST_AUTH_METHOD=trust pgvector/pgvector:pg16
export DATABASE_URL=postgres://postgres@localhost:5432/postgres

# install seven workspaces: agent-harness, artifact-workspace, agent-client,
# artifact-formats, sandbox-contract, conformance, cli + backend + frontend
bun run dev:backend    # API + orchestration on :3201
bun run dev:frontend   # UI on :3400
```

For production, `infra/self-host/deploy-app.sh` addresses any Linux host over SSH (AWS, GCP, Azure, Hetzner, or bare metal), and a **reference Hetzner Terraform** exists. The whole stack is provider-agnostic by design.

The honest framing from the README: *"Alpha software. useAgent is under active development: expect rough edges, and APIs/schemas may change between releases. It already runs real daily workloads, but pin a tag if you need stability."*

## Honest Boundaries and Who Should Use It

The caveats are substantial but disclosed. It's **alpha** — APIs and schemas may change; pin a tag for stability. The setup burden is real: bun, pgvector Postgres, seven workspaces, and a sandbox provider to provision. **AGPL-3.0** is fine for internal self-hosting but triggers copyleft obligations for distribution or offering-as-a-service that commercial teams should have legal review. At 3 days old with 151 stars, there's no release history or issue backlog to judge maturity. And critically, **useagent orchestrates engines you already pay for** — the orchestration is free, but the agent capacity underneath is your Claude Code/Codex/OpenCode subscriptions.

There's also a security concentration to name explicitly: the control plane holds every connector token and can reach every tool the gateway exposes. A compromise of the control plane is a compromise of everything downstream — which is the correct trade for keeping credentials out of sandboxes, but it makes the host your crown jewels.

**Who should use it:** small teams already running Claude Code/Codex/OpenCode that want a self-hosted control plane — durable sessions, isolated cloud computers, Slack delivery, human-approved destructive actions — without sending code or credentials to a hosted vendor. The deployment script and reference Terraform make it genuinely self-hostable, not a demo.

**Compared to the alternatives:** hosted agent platforms (a third party sees your code and holds your keys), plain agent CLIs (no sandbox, no approval loop, no artifact pipeline), and DIY orchestration (you build the event log, gateway, and sandbox contract yourself). useagent sits in the middle: self-hosted infrastructure with a real governance model. For teams that want agents as coworkers with boundaries, it's the most complete open-source attempt in the category right now — if you can live with alpha status and a pgvector dependency.

*Screenshots captured from the official GitHub repository on September 1, 2026. Star counts and metrics reflect the repository state at review time.*
