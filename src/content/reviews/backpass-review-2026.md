---
title: "backpass Review 2026 — Gradient Descent for Your Agent Memory (AGENTS.md as Weights)"
date: 2026-08-26
author: "AIPlaybook Editorial Team"
category: "Agent Memory"
tags:
  - "backpass"
  - "AGENTS.md"
  - "Agent-Memory"
  - "CLAUDE.md"
  - "Claude-Code"
  - "Codex"
  - "Local-First"
  - "Gradient-Descent"
  - "Developer-Tools"
  - "Open-Source"
cover: /images/reviews/backpass-review-2026/cover.png
meta_description: "backpass treats your AGENTS.md as a set of weights: it reads local session transcripts from seven agent harnesses, computes which instructions actually helped or were violated, and proposes evidence-backed, budgeted edits you approve one by one. We review the collect-loss-gradient-apply pipeline, the 5,000-token budget gate, skills-as-overflow, and the no-DEFER apply UI."
rating: 7.7
dimensions:
  ease-of-use: 7
  features: 8.5
  value: 8
  performance: 7.5
  ecosystem: 6
pros:
  - "The core idea is genuinely novel and useful: AGENTS.md is treated as a weight vector, every session is a forward pass, the on-disk transcript is the loss signal — and backpass is the first tool we have seen that actually reads that signal"
  - "Local-first by construction: it reads the transcript stores of seven harnesses (claude, codex, pi, opencode, grok, cursor CLI, hermes) directly from disk, has no API keys of its own, and routes every model call through acpx to a harness you already authenticated, with obvious secrets redacted"
  - "Evidence-gated output: every proposed edit carries verbatim quotes from real sessions, quoteless claims are discarded, and a new instruction needs evidence from at least two independent sessions — one bad session can never rewrite your memory file"
  - "The token budget acts like a learning rate: 5,000 estimated tokens (~20KB) per always-loaded file by default, adaptive max 5 edits per run, and a shrink plan that forces one removal per ~40 tokens of overage so overgrown files recover instead of bloating"
  - "Skills-as-overflow is a clever release valve: a 640-token procedure relevant to 4% of sessions becomes a 35-token description line, with the arithmetic reported (−611 tok always-loaded, +35 tok description)"
  - "The human gate is respected: backpass apply is the only writing command, rejections are remembered (no DEFER button is a design choice), and the review UI is a deterministic static template injected with one JSON payload — nothing model-generated"
cons:
  - "Conceptual overhead is real: collect samples → calculate loss → aggregate gradients → gradient descent is a mental model developers must buy into before the value is obvious"
  - "Requires Node >= 22.5 plus acpx on your PATH, and works best in repos that already have a meaningful session history — a fresh repo bootstraps a starter AGENTS.md with no evidence behind it"
  - "The loss calculation costs one model call per transcript (recency-weighted sample capped at 100 by default), so a first run on a large codex store is slow and spends tokens before you see anything"
  - "AGENTS.md is canonical by design: if you maintain a separate full CLAUDE.md, backpass optimizes AGENTS.md and warns you to consolidate — which may conflict with teams that intentionally split harness instructions"
  - "Synthesis uses a single high-reasoning session that edits a staging copy; the two-re-prompt violation loop is robust, but the quality ceiling depends on the model you route through acpx"
  - "No quantitative evidence yet that optimized memory files measurably improve session outcomes — the loop is elegant, but published results are anecdotal"
best-for: "Solo developers and small teams who live in Claude Code / Codex / Cursor CLI daily, already keep an AGENTS.md or CLAUDE.md, and want their memory files to evolve from real session evidence instead of hand-edited guesses"
price: "Free (MIT, npm package); model calls bill through your existing acpx-authenticated harness"
---

# backpass Review 2026 — Gradient Descent for Your Agent Memory (AGENTS.md as Weights)

## Quick Verdict

backpass is a local-first CLI that treats your agent memory file the way a trainer treats a neural network: **AGENTS.md is the weights, every agent session is a forward pass, and the transcript that session leaves on disk is the loss signal.** It reads transcripts from seven agent harnesses, distills them, measures which instructions helped and which were violated, aggregates that evidence across sessions, and proposes budgeted edits — ADD, REMOVE, REWRITE, or EXTRACT→SKILL — that you accept or reject one by one.

It is a 327-star, MIT-licensed npm package created 2026-08-21 by the author of `lavish-axi`, and it has no HN front-page moment — the signal is the idea itself, which resonates with anyone who has watched an AGENTS.md rot into an unreadable 40KB dump. The strongest part is the discipline: **quoteless claims are discarded, new instructions need two independent sessions of evidence, and `backpass apply` is the only command that writes.** The weakest part is that you must buy the whole pipeline metaphor before the payoff is visible.

## Features

### Seven harnesses, read from disk

backpass reads local transcript stores directly — no API, no upload:

| Harness | Store |
| --- | --- |
| **claude** | `~/.claude/projects/<munged-cwd>/<uuid>.jsonl` |
| **codex** | `~/.codex/sessions/YYYY/MM/DD/rollout-*.jsonl` |
| **pi** | `~/.pi/agent/sessions/<escaped-cwd>/*.jsonl` |
| **opencode** | `~/.local/share/opencode/opencode.db` (sqlite) |
| **grok** | `~/.grok/sessions/<encoded-cwd>/<uuid>/` |
| **cursor CLI** | `~/.cursor/chats/<md5(cwd)>/<uuid>/` |
| **hermes** | `~/.hermes/state.db` (sqlite) |

Sessions are tied to your repo in three tiers: deterministic cwd matching, git-remote matching that survives worktree deletion, and best-effort dead-path matching (excluded under `--strict`). Collection is incremental and cached by path/mtime/size, which matters because a codex store can hold 10,000+ rollouts. backpass's own sessions are tagged and excluded from the corpus.

### Distillation: 96–99% reduction

Raw transcripts are mostly tool-call noise, so backpass reduces each session deterministically *before* any model sees it: user and assistant turns verbatim, each tool call collapsed to one line (`tool: Bash "npm test" -> 1 failing`), tool output truncated, scaffolding dropped, secrets redacted. The distilled trace keeps the path to the raw transcript so the analysis agent can reopen the original when a specific claim needs it.

### Loss, gradients, and the human gate

- **Calculate loss**: one cheap call per transcript, returning strict JSON — which instructions helped, which were violated, what mistakes no current instruction covers. **Every claim must carry a verbatim quote**; negative evidence (a visible violation) is weighted highest. The set is capped at 100 transcripts with a recency-weighted sample (half-life 14 days).
- **Aggregate gradients**: deterministic, no model. Evidence groups by instruction; gaps seen in fewer than two sessions are dropped. A **gap ledger** carries sightings across runs — a gap seen today and next week graduates, a sighting expires after 90 days, and one session never counts twice.
- **Gradient descent**: a single high-reasoning session edits a **staging copy** of the memory file (the repo itself is read-only for grounding). Mechanical gates are non-negotiable: at most 5 edits per run (adaptive cap), every measured change belongs to exactly one annotated edit, every edit carries a verbatim quote, and the post-edit file must fit the budget. Violations trigger at most two re-prompts; beyond that, backpass **fails loudly** and saves the rejected proposal.
- **Apply**: `backpass apply` is the only writing command. It serves one card per edit — diff, evidence quotes with sources, a live budget gauge, ACCEPT/REJECT — through a static template shipped in the package, so the UI is deterministic and identical every run. There is no DEFER button: **rejections are remembered** and never re-proposed without materially new evidence.

### The budget: memory files are paid forever

Every always-loaded token costs on every future session, and instruction-following dilutes as files grow. backpass defaults to **5,000 estimated tokens (~20KB)** per always-loaded memory file (bytes/4 estimator, harness-neutral, ±15%), shown as a live gauge:

```text
AGENTS.md      [###############.................] 2,412 / 5,000 tok · 63 instructions
```

Over budget, synthesis goes zero-sum: every addition must name the removal or extraction that pays for it. **Skills-as-overflow** is the release valve — a conditional procedure becomes a description line, and the arithmetic is reported: `−611 tok always-loaded, +35 tok description`.

### Which file is the weights

`memoryFiles` defaults to `["AGENTS.md", "CLAUDE.md"]`; the first existing file is optimized, so **AGENTS.md is canonical**. A `CLAUDE.md` that is only `@AGENTS.md` is a pointer and stays valid; two separate full files are a divergence hazard backpass warns about until you consolidate. Repos with no memory file get bootstrapped with a starter AGENTS.md on first run, then the ordinary backward pass turns real transcript gaps into the first evidence-backed instructions.

## Pricing

backpass is **free, MIT**, on npm (`npm install -g backpass` or `npx backpass`). Requirements: **Node >= 22.5** and `acpx` on your PATH. It has **no API keys of its own** — every model call goes through acpx to a harness you already authenticated, so the true cost is your existing model usage (one cheap call per transcript for loss, one high-reasoning session for synthesis).

## Use Case: Evolving Your AGENTS.md After a Busy Week

A realistic weekly loop:

1. `backpass init` writes `.backpassrc.json` and excludes `.backpass/` locally.
2. After a week of Claude Code and Codex sessions, run `backpass` (never writes): it scans stores, distills transcripts, computes loss, aggregates gradients across sessions, and runs gradient descent on a staging copy.
3. `backpass scan --since 7d --strict` shows the transcript table with a confidence column if you want to inspect the corpus first.
4. `backpass apply` opens the review surface: you see each proposed edit with its verbatim evidence quotes and a budget gauge, accept or reject per edit. Rejections are remembered.
5. The file stays under 5,000 tokens; procedures that matter in only a few sessions get extracted to skills with the token arithmetic shown.

The result: your memory file changes only when real sessions demonstrate a recurring gap — and every change is attributable to a quote you can verify.

## Pros & Cons

**Pros:** a genuinely new mechanism — evidence-gated, budgeted memory evolution instead of vibes-based editing; local-first with no upload and secret redaction; seven-harness coverage including sqlite-backed stores; deterministic distillation and gradient aggregation; a human gate with remembered rejections; bootstrap mode for new repos.

**Cons:** steep conceptual on-ramp; Node 22.5 + acpx prerequisites; first run is slow and token-spending on big stores; AGENTS.md-canonical design forces consolidation of split memory files; synthesis quality depends on the routed model; no published quantitative proof that optimized memory improves session outcomes yet.

## Alternatives

| Approach | Evidence | Automation | Privacy | Human gate |
| --- | --- | --- | --- | --- |
| **backpass** | Verbatim quotes, 2-session minimum | Full pipeline, apply-only writes | Local-first, no upload | ACCEPT/REJECT, remembered |
| **Hand-edited AGENTS.md** | Human memory (lossy) | None | Perfect | Manual |
| **Prompt-injection audits** (e.g., prompt-leak scanners) | One-shot scans | Partial | Depends | Varies |
| **Session summarizers** (e.g., claude's built-in memory) | Recent sessions only | Partial | Cloud-dependent | Varies |

Nothing else on the market reads your transcripts, measures instruction compliance, and proposes edits with per-edit evidence under a token budget. The nearest competitor is "remember to update AGENTS.md yourself" — which is exactly the loop backpass exists to close.

## FAQ

**Does backpass upload my transcripts?** No. It reads stores from disk; model calls route through acpx to harnesses you already authenticated, with obvious secrets redacted before anything leaves.

**How many edits can one run make?** At most five by default (adaptive), and every edit must carry verbatim evidence. Over-budget files get a shrink plan with up to 20 removal-first edits.

**Which harnesses are supported?** Claude Code, Codex, Pi, OpenCode, Grok, Cursor CLI, and Hermes — with tiered repo attribution (cwd, git remote, best-effort).

**I maintain both AGENTS.md and CLAUDE.md. What happens?** backpass optimizes AGENTS.md, treats a pointer-only CLAUDE.md as valid, and warns until you consolidate split full files.

**What does it cost to run?** The tool is free (MIT). You pay your normal model-API rates through acpx: one cheap call per transcript for loss calculation, one high-reasoning session for synthesis.
