---
title: "OpenTag Review 2026 — Open-Source @Agent Mentions for Slack and GitHub"
date: 2026-07-07
author: "AIPlaybook Editorial Team"
category: "Development Tools"
tags:
  - "OpenTag"
  - "Agents"
  - "Slack"
  - "GitHub"
  - "Codex"
  - "Claude-Code"
  - "Open-Source"
  - "Developer-Tools"
  - "Collaboration"
cover: "/images/reviews/opentag-review-2026/cover.png"
meta_description: "OpenTag lets your team mention a coding agent from Slack or GitHub (@opentag investigate this) — runs Codex or Claude Code locally and returns results in thread. Open-source, local-first, 825★ GitHub."
rating: 8.0
dimensions:
  ease-of-use: 8
  features: 8
  value: 9
  performance: 7
  ecosystem: 7
pros:
  - "Turn any conversation thread into an agent work loop — mention @opentag and get results back in the same thread"
  - "Local-first architecture: agents run on your infrastructure, no data leaves your network"
  - "Executor-agnostic: supports Codex, Claude Code, and extensible to other coding agents"
  - "Built-in permission system with compact action receipts — see what will change before approving"
  - "Multi-platform: Slack, GitHub, GitLab, Lark/Feishu, Telegram, and Discord"
  - "MIT License with active development from Amplify HQ"
  - "npm global install — setup in minutes with guided CLI"
cons:
  - "Requires Node.js 20+ and local infrastructure setup — not a SaaS plug-and-play"
  - "Background service mode needs LaunchAgent (macOS) or systemd --user (Linux) — no cloud broker"
  - "Still relatively new (June 2026 launch) — community plugins and adapter ecosystem are sparse"
  - "Agent work ledger visibility is CLI-only — no web dashboard for managing runs"
  - "GitHub integration needs webhook setup; Slack needs app registration"
  - "Scaling to large teams requires careful permission configuration"
  - "Named after suggesting agent tasks from chat, not for standalone agent work"
best-for: "Engineering teams already using Claude Code or Codex who want to trigger agent work from Slack/GitHub without leaving their collaboration flow"
price: "Free (open-source / MIT License)"
---

## What Is OpenTag?

OpenTag is an **open-source, local-first agent gateway** that lets you mention a coding agent directly from Slack or GitHub. When someone writes `@opentag investigate this error` in a thread, OpenTag routes the request to Codex or Claude Code running on your infrastructure and posts the results back to the same thread.

Developed by [Amplify HQ](https://github.com/amplifthq/opentag) (the team behind Codex integrations), OpenTag hit 825 GitHub stars within two weeks of its June 24, 2026 launch. It's positioned as a more open, self-hosted alternative to proprietary agent platforms.

**Key stats:**
- **825★** GitHub stars, MIT License
- Launched June 24, 2026
- Supports Slack, GitHub, GitLab, Lark/Feishu, Telegram, Discord
- npm package: @opentag/cli

## How OpenTag Works

OpenTag treats the thread where a request starts as the **approval surface** for agent-proposed mutations. The flow is:

1. **Mention** — Someone writes `@opentag <task>` in Slack or GitHub
2. **Context Curation** — OpenTag gathers the surrounding thread context: messages, files, code snippets
3. **Permission Check** — The dispatcher checks what the executor is capable of and what permissions apply
4. **Agent Execution** — Codex or Claude Code runs locally with the curated context
5. **Receipt Generation** — OpenTag renders a compact action receipt showing what will change
6. **Approval** — The team member approves or rejects the proposal
7. **Apply** — If approved, the change is applied (e.g., a PR is opened)
8. **Audit Trail** — Every run records a full agent work ledger: source event, context snapshot, executor capability, produced artifacts, callback delivery, and final outcome

### Source-Thread Action Receipts

The receipt system is OpenTag's most thoughtful feature. When an agent suggests a change, instead of dropping raw code blocks into the chat, OpenTag renders a structured receipt:

- **What will change** — files affected, diff summary
- **Ready to apply** — whether the dispatcher can execute the action
- **Decision buttons** — Apply, Review, or Dismiss

The "Apply" button appears only when the dispatcher confirms a configured adapter can execute the action. Otherwise, it shows "setup needed" or "attention required."

### Agent Work Ledger

Each run maintains a local audit trail accessible through:

```bash
opentag status --run <run_id>
```

The ledger captures:
- Source event (which thread, who mentioned it)
- Admission decision (was the request accepted?)
- Context packet snapshot (what was sent to the agent)
- Executor capability snapshot (what the agent was allowed to do)
- Produced artifacts (code changes, analysis, etc.)
- Callback delivery (was the result posted back?)
- Final outcome (applied, rejected, errored)

## Quick Start

```bash
npm install -g @opentag/cli@latest
opentag setup
```

The setup wizard guides through:
1. Language preference for the CLI
2. Port configuration
3. Agent selection (Codex or Claude Code)
4. Local project association
5. Platform credential setup (Slack, GitHub, etc.)
6. Service mode (background daemon or terminal)

For automation:

```bash
opentag setup --service
```

This installs and starts the background service — LaunchAgent on macOS, systemd --user on Linux.

## Multi-Platform Support

| Platform | Status | Notes |
|---|---|---|
| Slack | ✅ | App registration required |
| GitHub | ✅ | Webhook configuration |
| GitLab | ✅ | API token setup |
| Lark/Feishu | ✅ | Bot configuration |
| Telegram | ✅ | Bot token |
| Discord | ✅ | Bot application |

The broad platform support is unusual for an open-source tool in this space. Most competitors focus on one or two platforms.

## Community Reception

The HN thread for OpenTag (trending on July 6, 2026) generated discussion around the "local-first" approach vs. cloud-based alternatives like GitHub Copilot Chat. The main points of discussion:

- **Privacy advocates** praised the local-first architecture — no agent data leaves the network
- **Self-hosting enthusiasts** liked the MIT License and transparent audit trail
- **Scaling concerns** were raised about the lack of a cloud broker — each developer needs to configure local infrastructure
- **The receipt system** was widely praised as the right UX for agent-in-the-loop workflows

A notable comment from the HN thread: "This is what I wanted GitHub Copilot Chat to be — a connector, not a walled garden."

## Use Cases

**On-Call Triage:**
When a production error comes into a Slack thread, an engineer writes `@opentag investigate this stack trace` and gets a root cause analysis without leaving the incident channel.

**Code Review Assistance:**
In a GitHub PR thread: `@opentag review the security implications of this change` — the agent analyzes the diff and posts findings as a thread reply.

**CI/CD Integration:**
`@opentag fix the failing test in CI` — the agent reads the test output, diagnoses the failure, and proposes a fix as a PR.

**Natural Language Tasking:**
`@opentag add input validation to the signup form` — the agent creates the implementation and returns a receipt showing the changes.

## Comparison to Alternatives

| | OpenTag | GitHub Copilot Chat | Custom Bot |
|---|---|---|---|
| Open source | ✅ MIT | ❌ Proprietary | ✅ |
| Local-first | ✅ | ❌ Cloud | ⚠️ Depends |
| Multi-platform | ✅ 6 platforms | ❌ GitHub only | ⚠️ Custom build |
| Action receipts | ✅ Structured UI | ❌ Raw code | ⚠️ Custom |
| Audit ledger | ✅ Full trace | ❌ | ⚠️ Custom |
| Setup effort | Medium (self-host) | Low (SaaS) | High |
| Agent choice | Codex, Claude Code | Copilot only | Any |

## Pricing

OpenTag is **completely free and open-source** under MIT License. You run it on your own infrastructure. There is no paid plan, no cloud tier, and no API keys to manage beyond your platform credentials.

## Verdict

OpenTag solves a real problem well: bridging the gap between team collaboration platforms and AI coding agents. The local-first architecture, multi-platform support, and structured receipt system make it a strong choice for engineering teams that already use Claude Code or Codex.

The self-hosted nature and lack of a cloud option mean it's best suited for teams with DevOps capabilities. But for those teams, OpenTag provides a polished, auditable, and flexible agent gateway that goes beyond what proprietary alternatives offer.

**Rating: 8.0/10** — a well-designed tool for a clear use case. The self-hosted requirement limits its reach, but for teams that can manage it, OpenTag delivers a genuinely useful agent interaction model.

*Note: The cover image is a screenshot of the OpenTag GitHub repository showing the README, star count, and supported platforms.*
