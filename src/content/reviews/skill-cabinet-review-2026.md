---
title: "skill-cabinet Review 2026 — A Local Catalog for Every Agent Skill Installed on Your Machine"
date: 2026-09-02
author: "AIPlaybook Editorial Team"
category: "Developer-Tools"
tags:
  - "skill-cabinet"
  - "Agent-Skills"
  - "Claude-Code"
  - "Codex"
  - "Cursor"
  - "Skills"
  - "Plugin-Management"
  - "Local-First"
  - "Open-Source"
  - "Developer-Tools"
cover: /images/reviews/skill-cabinet-review-2026/cover.png
meta_description: "skill-cabinet is a free MIT-licensed local catalog for the agent skills installed on your machine: it scans user-level drawers like .agents, .claude, .codex and .cursor (including plugins), lets you read each skill's body and YAML frontmatter, filter by drawer, risk, symlink status or copies, follow GitHub origins, and delete skill folders from disk. One command — npx skill-cabinet — starts a localhost server (port 3781) and opens a browser UI with search, j/k keyboard navigation, theme switching and static-risk analysis. This review covers how the drawer model works, the safety model around deletion, the honest limitations (single-machine scope, no cloud sync, deletion is permanent), and how it compares to eyeballing ~/.claude/skills in a file manager."
rating: 7.4
dimensions:
  ease-of-use: 8
  features: 7
  value: 7.5
  performance: 8
  ecosystem: 6
pros:
  - "One command to see everything: `npx skill-cabinet` scans .agents, .claude, .codex, .cursor (including plugins) and other ~/.*/skills drawers into a single searchable catalog — no more spelunking through dotfolders"
  - "Real signal in the cards: each skill shows drawer, name, path, origin (with GitHub origin followed when named or encoded in the install path), copies across drawers, and static risk classification"
  - "Read the actual skill: body rendered or as source, YAML frontmatter, and extra files — so you can audit what a skill actually instructs before you trust or delete it"
  - "Safety-minded deletion: deleting a symlink unlinks it while its target stays; builtin Cursor skills and plugin-cache copies are flagged as likely to reappear on the next tool update"
  - "Local-first and light: binds only to 127.0.0.1, runs on Node 20+, keyboard-driven (j/k move, / find, x mark, d delete) and skinnable from the Theme menu"
  - "314 stars in two days (created 2026-08-31) — the agent-skill ecosystem is clearly hitting the point where people need inventory tooling"
cons:
  - "Catalog, not a manager: it can read, search and delete skills, but there is no install/update/versioning — you still manage skill sources yourself"
  - "Deletion is permanent with no undo, and the README is explicit that builtin Cursor skills and plugin-cache copies may come back after the next tool update — a footgun if you clean aggressively"
  - "Static risk analysis is heuristic (regex-level patterns in the body), so 'elevated risk' flags are a prompt, not a security audit — dangerous skills can still look clean"
  - "Single-machine scope by design: no cloud sync, no team sharing, no remote catalog — it's a local inventory tool and nothing more"
  - "Two-day-old project: 314 stars but only 19 forks, no release history, no issue backlog to judge long-term maintenance"
  - "Origin inference is best-effort: origins taken from a parent plugin or git remote are marked inferred, so provenance display can be wrong for hand-installed skills"
best-for: "Developers and power users who run Claude Code, Codex, Cursor or other agent tools with a growing pile of installed skills/plugins and want one searchable, local inventory — read what each skill does, spot duplicates and elevated-risk bodies, and clean up skill folders without touching the terminal"
price: "Free, MIT-licensed, open source; runs locally via `npx skill-cabinet` (Node 20+) or `npx github:subsy/skill-cabinet`; no accounts, no cloud, no data leaves the machine"
---

## The Pitch: Your Agent Skills Are a Mess, Here's the Cabinet

On August 31, 2026, `subsy/skill-cabinet` appeared on GitHub with a deceptively simple job: *"A local catalog for agent skills installed on your machine."* The agent-skill ecosystem has exploded — Claude Code skills, Codex skills, Cursor rules and plugins, `.agents` drawers — and most people manage them the way they manage dotfiles: by squinting at folders in a file manager and hoping. skill-cabinet turns that into a searchable, readable, filterable local catalog.

The traction was immediate: **314 stars and 19 forks in two days** (created 2026-08-31). That's not hype about a new model — it's a sign that a real pain point crossed a threshold: when you install skills from marketplaces, plugins and git repos, you quickly lose track of what's on disk, where it came from, and whether you even want it.

## The Drawer Model

skill-cabinet's core concept is **drawers**: the user-level directories where agent tools keep their skills. Out of the box it scans `.agents`, `.claude`, `.codex`, `.cursor` (including plugins) and other `~/.*/skills` folders, then presents each skill as an index card in a browser UI:

- **Filter by drawer**, or search across name, description, path, origin, copies and frontmatter
- **Filter symlink cards**: all, only, or hide
- **Filter risk**: all, elevated, or hide
- **Read the skill body** — rendered or as raw source — plus YAML frontmatter and extra files
- **See the shape**: folder, single file, or symlink
- **Follow the origin**: a GitHub origin is followed when the skill names it or when the install path encodes it; origins derived from a parent plugin or git remote are marked *inferred*
- **Spot duplicates**: identical copies across drawers are flagged, and static risk in the body is classified

Run it with one command — `npx skill-cabinet` — which starts a local server on `127.0.0.1` (port 3781 by default) and opens your browser. It only binds to localhost. Keyboard-driven like a proper power tool: `j`/`k` move, `/` find, `x` mark, `d` delete. Theme menu included (Carbon is the default).

For an agent-heavy setup — say, Claude Code with marketplace plugins plus a few hand-installed skills in `~/.claude/skills/` plus Cursor rules — the value is immediate: one screen shows what's installed, what each one claims to do, which are symlinks, which are duplicates across drawers, and which bodies carry static risk patterns. The skill sprawl becomes a browsable collection instead of a folder dump.

The search surface matters more than it sounds. Skills arrive from different sources with inconsistent naming — a marketplace plugin installs under a plugin slug, a hand-copied skill uses its folder name, a symlink points elsewhere entirely. Searching across name, description, path, origin, copies and frontmatter means you can answer "do I already have something that does X?" before installing another one, which is exactly the question that prevents skill rot from compounding. The copies filter catches the same skill installed in three drawers (one for Claude Code, one for Codex, one for Cursor) where each copy can drift out of sync — the cabinet at least surfaces that divergence instead of hiding it.

## The Safety Model (and Its Edge)

Deletion is where a catalog tool earns or loses trust. skill-cabinet's approach is explicit and careful: **delete removes the skill from disk with no undo**, but a symlink is unlinked while its target stays, and the README warns that builtin Cursor skills and plugin-cache copies may come back the next time the tool updates. That last warning is honest engineering — it prevents the "I deleted it, why is it back?" confusion that plagues plugin-cache systems.

The flip side is also honest: static risk analysis is heuristic. It classifies risk from patterns in the skill body — useful as a triage signal, but a prompt, not a security audit. A skill with genuinely dangerous instructions can still render cleanly, and a skill with scary-sounding strings can be benign. Treat the risk filter as "worth a human look," not "safe/unsafe."

## Honest Limitations

skill-cabinet is a catalog, not a manager: it reads, searches and deletes, but there's no install, update or versioning — you still pull skill sources yourself. It's single-machine by design: no cloud sync, no team sharing. Origin inference is best-effort — inferred origins can be wrong for hand-installed skills. And it's a two-day-old project: 314 stars, 19 forks, no release history, no issue backlog to judge how it holds up at scale.

## Verdict and Who It's For

If you run Claude Code, Codex, Cursor or `.agents`-based tools with more than a handful of skills, skill-cabinet is a genuinely useful local utility: it answers "what did I install, where is it from, what does it do, and can I remove it" in one localhost screen, with a thoughtful deletion safety model and zero cloud dependency. It won't manage your skill lifecycle, and its risk filter is a heuristic — but as an inventory and audit surface for the skill sprawl era, it earns its stars. A Silver-tier pick for the agent-skill ecosystem.

*Review based on public repo contents, README, and repository metadata as of 2026-09-02. Star/fork counts may change quickly for a two-day-old project.*
