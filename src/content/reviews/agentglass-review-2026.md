---
title: "AgentGlass Review 2026 — AI Coding Agent Observatory That Puts Every Agent on One Screen"
date: 2026-07-28
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags: [agentglass, ai-agents, observability, developer-tools, coding-agents, monitoring, cost-tracking, dashboard, claude-code, open-telemetry]
cover: "/images/reviews/agentglass-review-2026/cover.png"
meta_description: "Hands-on AgentGlass review 2026 — open-source AI coding agent observability dashboard that tracks live cost, tokens, and tool calls across Claude Code, Codex, Gemini CLI, and more. Full workspace with diff viewer, git, Docker, terminal, and PR review."
rating: 8.2
dimensions:
  ease-of-use: 8
  features: 9
  value: 9
  performance: 8
  ecosystem: 7
pros:
  - "Universal provider support — Claude Code hooks and OpenTelemetry GenAI exporters cover OpenAI, Gemini, Bedrock, LangChain, all in one dashboard"
  - "Built-in workspace: real diff viewer, lazygit-style source control, lazydocker-style Docker panel, PTY terminal, and Claude chat panel — all keyboard-driven"
  - "Phone companion app with queue-based triage: approve/deny gates, review PRs, check container health from your phone"
  - "Control plane with remote approve/deny for dangerous operations — don't trust agent auto-approval"
  - "22 themes, rebindable shortcuts, per-project scoping, persistent sessions"
  - "MIT licensed, Bun+SQLite backend, React+Vite+Motion frontend"
cons:
  - "Heavy screen real estate — the cockpit is information-dense and can feel overwhelming on smaller monitors"
  - "PTY terminal is POSIX-only (no Windows ConPTY support yet)"
  - "Phone companion is designed as a triage queue, not a full desktop mirror — can't run terminal or view charts on mobile"
  - "Early project (July 2026 public release) — some features like phone companion are still being hardened"
  - "Desktop app uses Electron (~400MB idle), and the bundled server adds another ~200MB"
best-for: "Developers and teams running multiple AI coding agents who need a unified observability layer with cost tracking, live monitoring, and a workspace to act on what the fleet produces"
price: "Free (open source, MIT)"
---

## Overview

AgentGlass (stylized **agentglass**) is an open-source observability cockpit that brings every AI coding agent on your machine onto one screen. Launched in mid-July 2026 by SirAllap, it has already amassed **273+ GitHub stars** and is being actively developed with **390+ commits** from both the maintainer and Claude Code contributions.

The core promise is simple but powerful: stop context-switching between Claude Code terminals, OpenAI Codex sessions, Gemini CLI runs, and Bespoke agent dashboards. Point agentglass at all of them, and watch live cost, tokens, tool calls, errors, and session lifecycles in real time — from one cockpit.

## What Makes AgentGlass Different

Most agent observability tools are either per-provider dashboards (like Anthropic's own console) or lightweight event streams that forget everything on refresh. AgentGlass sits as a **persistent visibility layer** that:

1. **Connects via Claude Code hooks** (natively) or **OpenTelemetry GenAI exporters** for OpenAI Codex, Gemini CLI, Bedrock, LangChain, LiteLLM, and others
2. **Scans ~/.claude/projects transcripts** so historical sessions appear instantly, even before agents start streaming
3. **Persists everything across reloads** — not a "live only" dashboard
4. **Filters by provider, project, or scope** — zoom into one repo or see the whole machine

The data model includes cost tracking (per-provider pricing), tool-latency percentiles, error timelines, session lifecycles, and a sweeping **agent radar** that visualizes context window usage — a blip near the edge of the radar is about to compact.

## The Workspace: More Than a Dashboard

What elevates AgentGlass beyond a monitoring tool is its built-in **workspace** — six keyboard-driven panels that let you act on what the fleet produces without leaving the cockpit:

### Diff & Review
A full Shiki-syntax-highlighted diff viewer with word-level intra-line diffs, split/unified modes, and one-click "Explain" (local Claude walkthrough of the change set). Review and commit directly from the diff view.

### Source Control (lazygit-style)
Stage, hunk-stage, commit, branch, stash, push/pull — all live on any repo the fleet has touched, all write-gated (read-only until you opt in). Interactive hunk staging, conflict resolution with per-side selection, and merge undo.

### Pull Requests
Review PRs without opening a browser: overview, conversation, commits, files, checks, and review composer. Saved views, facet filtering (author, label, checks, etc.), and merge/squash/close actions.

### Docker (lazydocker-style)
Containers grouped by compose project with live CPU/memory stats, log viewer (colored by level, pinned to bottom), and start/stop/restart actions. Exec into a container directly.

### Real Terminal
A genuine PTY shell (your login shell) per repo/worktree over a WebSocket. Persistent sessions survive panel closes. Plus a commands menu that discovers Makefile targets and package.json scripts from the whole project tree.

### Claude Chat
Drive local Claude Code sessions from the browser. Pick model + permission mode, stream replies, resume existing sessions. Sessions started here appear in the fleet like any other agent.

## Phone Companion

AgentGlass ships a separate mobile interface (not a responsive stylesheet — a different React tree) designed for **triage, not terminal work**. The home screen is a queue of decision cards:

| Card Type | What It Means |
|-----------|--------------|
| **Blocked · waiting on you** | An agent gate — approve or deny a dangerous command |
| **Container down** | A container exited non-zero — tail logs or restart |
| **CI went red** | A failing check on your PR — open log or re-run |
| **Ready to merge** | Approved, checks green, nothing blocking |
| **Review requested** | Somebody asked for your eyes — opens PR with diff |
| **Stopped · wants direction** | A session that ended its turn 4min–12h ago |

The phone app has only three tabs: **Now** (the queue), **Chats** (conversations that persist across sessions), and **Repos** (changes, PRs, containers). It connects via QR code on your LAN and uses a 32-character secret.

## Pricing

AgentGlass is **completely free and open source** under the MIT license. The server (Bun + SQLite) and desktop app (Electron) are self-hosted on your machine — no cloud dependency, no API keys needed beyond what your agents already use.

## Community & Activity

- **GitHub Stars:** 273+ (as of July 28, 2026)
- **Commits:** 390+ in ~2 weeks since public release
- **Issues:** 40 open
- **Pull Requests:** 2 open
- **License:** MIT
- **Tech Stack:** Bun, SQLite, React, Vite, Motion, Shiki
- **Desktop:** Electron (macOS, Windows, Linux)
- **Trendshift:** Ranked on daily trending for TypeScript

## Verdict

AgentGlass fills a genuine gap in the AI coding agent ecosystem. As developers increasingly run multiple agents (Claude Code, Codex, Gemini CLI) across multiple projects and providers, the need for a **unified observability layer** becomes urgent.

| What | Score |
|------|-------|
| **Ease of Use** | 8/10 — The cockpit is polished but dense; getting started requires understanding hooks or OTel |
| **Features** | 9/10 — Workspace panels (diff, git, Docker, terminal, PRs, chat) go far beyond any other dashboard |
| **Value** | 9/10 — Free, MIT, self-hosted, no lock-in |
| **Performance** | 8/10 — Bun+SQLite backend is snappy, but the Electron desktop app is memory-heavy |
| **Ecosystem** | 7/10 — New project; Claude Code hooks are the most mature path, OTel support is still expanding |

**Overall: 8.2/10 — Silver+**

For developers who want to understand what their AI agents are actually doing, costing, and breaking — and act on it from one place — AgentGlass is the best option available today. The workspace feature alone puts it ahead of every other agent observability tool on the market.

## How to Get Started

```bash
# Install via npm
npx agentglass

# Or clone and run from source
git clone https://github.com/SirAllap/agentglass.git
cd agentglass
bun install
bun run dev
```

Then configure Claude Code hooks or set up OpenTelemetry exporters, and open `http://localhost:5173` to see every agent on your machine.
