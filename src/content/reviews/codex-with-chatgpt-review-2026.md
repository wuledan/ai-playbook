---
title: "Codex with ChatGPT Review 2026 — Use Your ChatGPT Web Subscription as the Planning Brain While Codex Executes"
date: 2026-08-31
author: "AIPlaybook Editorial Team"
category: "Coding"
tags:
  - "codex-with-chatgpt"
  - "Codex"
  - "ChatGPT"
  - "AI-Coding"
  - "MCP"
  - "Agent-Architecture"
  - "Developer-Tools"
  - "OAuth"
  - "Cost-Saving"
  - "Open-Source"
cover: /images/reviews/codex-with-chatgpt-review-2026/cover.png
meta_description: "Codex with ChatGPT (c2c) is an MIT-licensed bridge that turns your ChatGPT Plus/Pro web subscription into the planning and review brain for Codex coding sessions — ChatGPT reasons and reviews through a read-only, OAuth 2.1-protected MCP connection while Codex keeps full ownership of execution. No API keys, no reverse proxy: official web UI plus a Cloudflare Quick Tunnel. It hit 1,400+ GitHub stars in three days with 76 passing tests covering path security, OAuth, pairing, and MCP end-to-end."
rating: 7.7
dimensions:
  ease-of-use: 8
  features: 7.5
  value: 8
  performance: 7.5
  ecosystem: 6.5
pros:
  - "The cost argument is real: ChatGPT Plus/Pro web quota sits idle for most users while coding agents burn scarce API or Codex tokens on planning and review — c2c moves the thinking to the subscription you already pay for, with no API key and no reverse proxy"
  - "Read-only by construction: the MCP server exposes exactly 8 read tools (workspace_info, list_directory, read_file, search_workspace, git_status, git_diff, test_status, execution_summary) — write, delete, shell, and commit tools simply do not exist, so no prompt injection can enable them"
  - "A genuine security model instead of vibes: OAuth 2.1 with PKCE S256 and dynamic client registration, rotating refresh tokens, one-time pairing codes (5-minute TTL, 5 attempts, rate-limited, destroyed on use), per-workspace token boundaries, and canonical-realpath path containment with symlink and ../ escapes blocked and tested"
  - "Sensitive files never leave: .env* files, keys, SSH material, and credentials are denied by default (with .env.example allowed), plus a .c2cignore for your own rules"
  - "Independent review loop: after Codex executes, ChatGPT inspects the actual git diff and test records through MCP rather than trusting an 'all tests passed' claim — the control plane carries only tiny [C2C] state messages (INIT → PLAN → EXECUTED → REVIEW → DONE), never diffs or file bodies"
  - "One-paste install designed for non-technical users: Codex itself runs the setup (clone, build, skill install, browser pairing) and only interrupts for ChatGPT/Cloudflare logins — plus a self-updating skill that checks GitHub daily"
cons:
  - "Unofficial community project explicitly not affiliated with or endorsed by OpenAI — driving the ChatGPT web app through Computer Use to do agent work is a terms-of-service gray area, and heavy use risks account throttling or restrictions"
  - "Requires a ChatGPT Plus/Pro subscription with web quota; it's a quota-redistribution hack, not a way to avoid paying for a model"
  - "A public endpoint exists by design: the loopback bridge is exposed through a Cloudflare Quick Tunnel, and while OAuth makes the URL useless without a token (401) and wrong-workspace access impossible (403), some teams will not want any public exposure for a coding workspace"
  - "Temporary tunnel URLs change on restart unless you set up a stable Cloudflare hostname, which requires a Cloudflare account and a domain already on Cloudflare"
  - "ChatGPT can't run commands itself — planning quality depends on how faithfully Codex reports execution summaries and test status, so the loop is only as good as the harness's reporting"
  - "Very new: created August 28, 2026, V1 verified end-to-end, single-project maturity so far, and Computer Use round-trips add latency versus a single-agent setup"
best-for: "ChatGPT Plus/Pro subscribers who want their paid web quota to do the expensive thinking (planning, architecture, review) while Codex keeps executing — especially non-technical users who want a one-paste, fully-automated setup"
price: "Free, MIT-licensed; requires a ChatGPT Plus/Pro subscription and cloudflared (auto-installed); optional free Cloudflare account for a stable hostname"
---

## The Problem: Paid Web Quota Sitting Idle While Your Agent Burns Tokens

Most ChatGPT Plus/Pro subscribers have a strange resource imbalance. The web subscription they pay for every month — with its generous, often underused quota — sits idle, while their coding agent (Codex, Claude Code, Gemini CLI) burns scarce API credits or Codex tokens on the least valuable work: planning the next step, reviewing a diff, summarizing a failure.

**Codex with ChatGPT** (repo `XiaoDuoYa/codex-with-chatgpt`, MIT, created August 28, 2026 — **1,400+ stars in three days**) is a direct attack on that imbalance. Its one-line thesis: *"ChatGPT thinks. Codex works."* The ChatGPT web app becomes the planning and review brain for your Codex coding sessions, while Codex keeps full ownership of execution — shell, tests, edits, git. No API keys, no reverse proxy, no jailbreak of OpenAI's client: just the official web UI plus a read-only MCP bridge.

## Architecture: A Control Plane and a Data Plane, Separated

The design is the interesting part, because it cleanly separates *what ChatGPT is allowed to know* from *what it is allowed to do*:

```
ChatGPT Web (Reason/Plan/Review)
      │  MCP Data Plane (read-only)        ▲ Computer Use Control Plane (<1KB msgs)
      ▼                                    │
   C2C Bridge  — loopback HTTP server, OAuth 2.1 + one-time pairing code,
                 Cloudflare Quick Tunnel
      │  read-only
      ▼
   Local Workspace  ◀───  Codex Harness (edit/git, shell, tests, fix)
```

- **Control plane (Computer Use):** Codex and ChatGPT exchange tiny structured `[C2C]` state messages — `INIT → PLAN → EXECUTED → REVIEW → DONE`. No diffs, no logs, no file bodies are ever pasted into the chat. This keeps the data plane the only channel for content.
- **Data plane (MCP):** ChatGPT pulls exactly what it needs through **8 read-only tools**: `workspace_info`, `list_directory`, `read_file`, `search_workspace`, `git_status`, `git_diff`, `test_status`, `execution_summary`.
- **Independent review:** after Codex executes, ChatGPT inspects the *actual* git diff and test records through MCP — it never blindly trusts a reported "all tests passed."

The bridge itself is a loopback-only HTTP server with three layers bolted on: **OAuth 2.1** (PKCE S256, dynamic client registration, rotating refresh tokens), a **one-time pairing code** system (CSPRNG-generated, 5-minute TTL, 5 attempts, rate-limited, destroyed on use), and a **Cloudflare Quick Tunnel** for the public connection.

## The Security Model: Read-Only by Construction

The security posture is where this project punches above its weight class. Three properties stand out:

1. **Read-only by construction.** The write/delete/shell/commit tools *do not exist* on the server. That is a stronger claim than "we promise not to call them" — no prompt injection, no clever tool-chaining, no mis-routing can ever enable a write because there is nothing to enable.

2. **One workspace = one boundary.** Every token is bound to a single workspace. Path containment uses canonical realpaths, and symlink escapes, `../` traversal, and absolute-path tricks are blocked and covered by tests.

3. **Knowing the URL grants nothing.** The public MCP endpoint returns 401 without a valid token, 403 for the wrong workspace. The only secret that ever touches a browser is the one-time pairing code. Long-lived credentials never reach the model.

Sensitive files are denied by default — `.env*`, keys, SSH material — with `.env.example` explicitly allowed so templates still work, and a `.c2cignore` file for project-specific rules. The repo ships **76 passing tests** (Vitest) covering path security, OAuth, pairing, and MCP end-to-end, plus a documented threat model in `docs/security.md`.

## The One-Paste Install: Designed for People Who Don't Know What MCP Is

The project's most unusual feature is its onboarding. The README's primary installation path is a single copy-paste paragraph you hand to Codex — explicitly written for *"I am a non-technical user — do everything yourself"*: check the environment (git, Node ≥ 20, installing Homebrew/winget packages as needed), clone, build with pnpm, install the skill, run first-time setup in the built-in browser, and only interrupt the human for ChatGPT or Cloudflare logins, one action at a time.

The skill self-updates by checking GitHub daily. After setup, normal usage is just: *"Use Codex with ChatGPT to implement XXX."* The user-facing output is a checklist — project detected, workspace bridge started, secure connection established, ChatGPT connected, file read test passed, *Ready.*

Under the hood the developer surface is conventional: `c2c setup`, `c2c status / doctor / pair / unpair / logs / stop`, `pnpm build` exposing the `c2c` binary. Requirements are Node ≥ 20, git, and `cloudflared` (auto-detected and installed by the skill).

## Practical Caveats: ToS Gray Area, Public Tunnel, and Latency

The honest reading of this project requires flagging what it is *not*:

- **It is unofficial.** The README states it plainly: *"Unofficial community project. Not affiliated with or endorsed by OpenAI."* Driving the ChatGPT web app through Computer Use for agent work sits in a terms-of-service gray area — the same caveat that applies to any tool that automates a consumer web product. Heavy, sustained use risks throttling or account restrictions.
- **It is not a free-model hack.** You need a paid ChatGPT subscription with web quota. The value is *redistribution* — using quota you already pay for on the highest-value work — not avoiding payment.
- **A public endpoint exists by design.** The Cloudflare Quick Tunnel is what lets ChatGPT reach your loopback bridge. OAuth makes it safe-ish (URL alone grants nothing), but teams with strict network policies may reject any public exposure for a coding workspace. The default temporary URL also changes on bridge restarts; a stable hostname requires a Cloudflare account and a domain already on Cloudflare.
- **Planning quality depends on reporting fidelity.** ChatGPT cannot run commands; its view of execution comes from `test_status` and `execution_summary`. The loop is only as good as Codex's reporting, which is honest but worth knowing.

## Who Should Use It

**Best fit:** ChatGPT Plus/Pro subscribers — especially heavy Codex users — who want their idle web quota to do the expensive cognitive work (planning, architecture, review) while Codex executes. The non-technical onboarding makes it unusually accessible: if you can paste a paragraph into Codex, you can get this running.

**Compared to alternatives:** native Codex does everything in one agent but burns paid tokens on planning; Claude Code + ChatGPT bridges solve a similar problem for Claude users but with less mature security tooling; API-key gateways (OpenRouter, LiteLLM) give you model choice but charge per token. c2c's angle — *use the subscription you already have, read-only, with real OAuth* — is distinct and genuinely cost-effective for the right user.

The verdict: a clever, well-engineered bridge with a thoughtful security model, real cost logic, and a very new — and very fast-growing — codebase. Just go in knowing it's an unofficial, subscription-dependent, tunnel-exposed tool that lives in OpenAI's ToS gray zone.

*Screenshots captured from the official GitHub repository on August 31, 2026. Star counts and metrics reflect the repository state at review time.*
