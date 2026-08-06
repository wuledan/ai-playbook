---
title: "AI Agent Permission Workflow 2026 — What 409,000 Approve/Deny Decisions Teach Us About Keeping Rogue Agents Out"
date: 2026-08-07
author: "AIPlaybook Editorial Team"
category: "Workflows"
tags:
  - "AI-Agents"
  - "Permissions"
  - "Security"
  - "Coding-Agents"
  - "Human-in-the-Loop"
  - "Sandboxing"
  - "Claude-Code"
  - "DevSecOps"
cover: /images/workflows/ai-agent-permission-workflow-2026/cover.png
meta_description: "A data-driven workflow for AI agent permission review — 40,000 game runs and 409,000 approve/deny decisions show humans miss 1 in 3 threats. Build a permission model that survives permission fatigue: sandboxing, credential separation, script-name red flags, and approval automation."
---

## Overview

In early August 2026, developer-security engineer Alex (ex-Uber Staff) published the results of his browser game **Continue? Y/N** — a 60-second human-in-the-loop simulator where you approve or deny an AI coding agent's commands under time pressure. The data covers **40,000 runs and 409,000 individual approve/deny decisions**, and it is the most honest picture we have of how badly human permission review actually works.

The headline: **the average player missed 1 in 3 threats** (mean accuracy 66.3%). 32.9% of sessions ended with a negative score. And 7% of players approved *every single prompt* — "big fans of --dangerously-skip-permissions," as the author dryly notes.

The game is a toy, but the failure modes it exposes are not. This workflow turns those numbers into a concrete permission model for real coding agents: what to sandbox, what to separate, and which command patterns deserve your suspicion.

## The Data: What Actually Goes Wrong

The study breaks threats into four categories, and the miss rates are the first thing to internalize:

| Threat category | Examples | Miss rate |
|---|---|---|
| Obvious destructive | `rm -rf /`, `chmod -R 777 /` | 11.7% |
| Persistent mutation | crontab injection, git config hijack | 23.8% |
| Exfiltration / code execution | curl to unknown APIs, typosquatted packages | 33.4% |
| Scope violations | `cat ~/.aws/credentials`, `cat ~/.kube/config` | 35.0% |

Two patterns jump out. Blatantly destructive commands are caught almost always. The commands that *actually steal your credentials* are missed three times as often. And the harder a command is to read as dangerous, the worse humans do — which is a property of the prompt, not the player.

**The npm run blind spot.** The single most-missed command in the entire game was `npm run analyze`, approved **64.7%** of the time. `npm run setup` (48.0%) and `npm run deploy` (44.9%) also made the top-10 most-missed list. Pooled, the three were missed 52.5% of the time versus 28.4% for every other exfiltration-style attack. Hiding a payload behind a familiar script name *roughly doubles its success rate* — even when the malicious script body is displayed in the history log right above the approval prompt.

The reason is structural, and HN commenter dns_snek nailed it: "npm run build = run an arbitrary shell command written in package.json. Meanwhile the agent could have edited package.json to contain any arbitrary build command, or planted malicious code in build.js... Asking the user to validate commands, which are nearly all of the time safe, but aren't anymore because of modified files, is not a strong safeguard."

**Permission fatigue is measurable.** Miss rates degrade toward the end of sessions — every group in the study got worse as the clock ran down, after an initial "warming up" improvement. Anthropic has documented the same effect in Claude Code: the more approvals a user sees, the less attention they pay to each. The game quantifies it: vigilance is a finite resource, and it depletes.

**Over-blocking is the other half of the trap.** The flip side of fatigue is noise: `npm config set registry` was blocked 59% of the time (benign), `rm -rf dist/` 45% (benign), `kill $(lsof -t -i:3000)` 43% (benign). Every safe command you block teaches your agent to ask less — or trains *you* to approve faster. The noise is what makes the human-in-the-loop a broken control in the long run.

## Step 1: Remove Secrets from the Agent's Reach

The single highest-value change, per the study's "contested cat": `cat ~/.zshrc` was approved by **45.9%** of players. The command's risk depends entirely on setup the agent can't see — if your shell profile exports API keys, approving it is credential disclosure.

The fix is boring and effective: **stop putting secrets in files the agent reads routinely.**

- Move API keys out of `~/.zshrc` / `~/.bashrc` into a separate file that is sourced explicitly (e.g. `~/.secrets` with `source` in the rc) — or better, into a secrets manager the agent doesn't have a path to.
- Restrict the agent's workspace to the project directory. Scope violations (`cat ~/.aws/credentials`, `cat ~/.kube/config`) are the worst-missed category at 35% — make those files structurally unreachable instead of relying on review.
- Environment-scoped secrets beat file-scoped ones: `export` per-session or via direnv-style tooling means the agent never has a reason to cat anything.

## Step 2: Sandbox the Agent's Side Effects

The HN thread's most consistent piece of practical advice — repeated by users running `--dangerously-skip-permissions` and surviving — is to make the *environment* the safety boundary, not the approval prompt.

- Run the agent under a dedicated user account with **no sudo** and no access to your main home directory. One HN user runs Claude this way by default, accepts the risk of local mistakes, and treats the sandbox as the real control.
- Containerize or VM-isolate for anything touching prod: LXD containers, dev containers, or a disposable VM per risky task. One commenter built a TUI that toggles network access for LXD containers, allowing only Anthropic/OpenAI endpoints.
- Keep backups and treat the workspace as disposable. If your harness can `rm -rf` everything and you lose nothing, the "destructive" threat category drops from scary to annoying.

## Step 3: Build a Script-Name Watchlist

The npm-run data shows that humans pattern-match on command *names*, not command *bodies*. Add a lightweight review layer that catches the gap:

- **Treat `npm run` / `pnpm run` / `yarn` script execution as high-risk.** A script defined in `package.json` is arbitrary code — the name tells you nothing. Before approving, check what the script *actually runs*: diff `package.json` scripts, look for `curl | sh`, outbound POSTs, or `tee /dev/fd/1` piping to remote URLs.
- **Watchlist the familiar-but-dangerous patterns:** `npm install` (can mutate package-lock.json — prefer `npm ci`), `rm -rf` + `install` combos, `chmod -R`, crontab writes, `git config` mutations, and anything piping file contents to a remote endpoint.
- **Verify package provenance for new deps:** typosquatted packages are an exfiltration vector in the study — `npm view <pkg>` and check the registry owner before trusting a new install.

## Step 4: Design the Approval Flow for Fatigue

Since vigilance depletes, minimize the number of approvals that require real vigilance:

- **Automate the boring approvals.** `git status`, `npm test`, lint runs, build output — grant these as allow-listed commands so the agent doesn't burn your attention budget on them.
- **Auto-deny by policy, not by prompt.** Rule-based blocking (a hook that rejects secret reads, destructive root paths, unknown outbound curl) is the highest-precision layer; the study's 17% false-negative rate for Claude's Auto Mode shows machine judgment is not enough alone, but it is far better than nothing.
- **Reserve human review for the genuinely ambiguous middle** — commands that mutate state, touch credentials, or run project scripts. That's where the 35% miss rates live, and that's where your remaining attention should go.
- **Batch, don't stream.** Where your agent supports it, collect command proposals and review them as a group rather than one-at-a-time under a ticking clock — the game's degradation curve suggests time pressure is a real accuracy killer.

## Step 5: Know When to Bypass (and When Not To)

The thread's most controversial advice is also the most honest: several experienced users run with permissions bypassed entirely, on the theory that a sandboxed environment with backups is safer than a tired human clicking "yes" on a 35%-miss-rate prompt.

That works *only* if Steps 1-2 are in place. The pattern that repeatedly fails is bypass **without** isolation. The comment that should be the workflow's epigraph — from the original HN thread — frames the mindset correctly: "Thinking about agents as remote junior devs who *might* be North Korean operatives has been the right model for me."

If you must bypass, do it like the users who survive: dedicated non-sudo user, no secrets in reach, disposable workspace, backups on. And never bypass on a machine that holds credentials the agent can read.

## The Takeaway

The 40,000-run dataset collapses to one sentence: **the approval prompt is the weakest control in the loop, because humans get tired and pattern-match on names.** The robust workflow doesn't try to make humans review better — it shrinks what they have to review, moves secrets out of reach, sandboxes side effects, and keeps human attention for the ambiguous middle where it actually moves the needle.

The game is at llmgame.scalex.dev. Go play it once — your first run will tell you which of the four failure modes you personally have, and that is worth more than any checklist.
