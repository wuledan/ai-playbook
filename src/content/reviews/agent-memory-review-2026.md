---
title: "agent-memory Review 2026 — A File-Truth Long-Term Memory Runtime for AI Agents: Rebuildable Indexes, Sleep-Time Manage, and a 52.9% LongMemEval-S Result"
date: 2026-09-06
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "agent-memory"
  - "Agent-Memory"
  - "Long-Term-Memory"
  - "Claude-Code"
  - "Codex"
  - "MCP"
  - "SQLite"
  - "BM25"
  - "LongMemEval"
  - "Local-First"
  - "Open-Source"
cover: "/images/reviews/agent-memory-review-2026/cover.png"
meta_description: "agent-memory is a local-first, agent-agnostic long-term memory runtime (created 2026-09-01, 160+ stars, 71 commits in its first week) built on an unusual thesis: files are the truth and every index is a rebuildable cache — memories are plain markdown files in one store, the SQLite index beside them can be deleted at any time, and rm -rf .index && mem rebuild loses zero knowledge, enforced by a test. Writes are triggered at conversation boundaries, not at the agent's discretion, and an independent sleep-time Manage pass consolidates, ages and forgets by value while deletion only ever arrives as a proposal you confirm. There is no LLM client inside the library — zero API keys, judgment borrowed from the host agent's own CLI (Claude Code, Codex CLI or Hermes share one store). In its own bounded-haystack LongMemEval-S experiment with 120 episodes it scored 127/240 (52.9%) versus 86/240 (35.8%) for MemCore and 7/120 (5.8%) with no memory. This review covers the file-truth storage model, the Manage layer, the three recall tracks, the MCP/CLI/hooks wiring, the benchmark's honest framing, and the notable absence of a license."
rating: 7.6
dimensions:
  ease-of-use: 6.5
  features: 8
  value: 7.5
  performance: 8
  ecosystem: 6.5
pros:
  - "A genuinely different storage thesis with a test to back it: memories are plain markdown files and the SQLite index is a disposable cache — rm -rf .index && mem rebuild loses zero knowledge, and that property is enforced by a test, not promised in a doc; the store stays greppable, git-able and portable"
  - "A real Manage layer on its own clock: an unattended sleep-time pass (mem sleep) consolidates, ages and re-weights memories with authority tiers — T0 applies adds and updates, while deletion only ever arrives as a proposal (T1) that you confirm with mem decide <id> --accept; nothing is destroyed unattended, and each pass writes a dream report"
  - "Updating never destroys: supersede leaves the chain intact, recall --as-of answers as of a date, and archive/ keeps raw material append-only — 'missed by the distiller' never means 'lost by the system'"
  - "No LLM client inside the library: zero API keys, no billing surface; judgment is borrowed from the host agent's own CLI, keeping every write visible in your transcript — and one store is shared by Claude Code, Codex CLI and Hermes, with all 9 ordered writer/reader host pairs passing their generality test"
  - "Three independent read tracks so a miss on one is not a miss: deterministic MEMORY.md injection at session start, BM25 recall with progressive disclosure, and the plain directory tree you can reach with ls and grep"
  - "Measured, not asserted: a bounded-haystack LongMemEval-S experiment (120 episodes, claude -p Haiku 4.5 host, one calibrated Sonnet 5 judge, two exam replays per arm) shows agent-memory at 127/240 = 52.9% versus MemCore's 86/240 = 35.8% (paired p=0.009/0.004) and 7/120 = 5.8% with no memory (p<0.001), with the protocol and noise floor published in docs/experiments.md"
cons:
  - "No license file at review time (created 2026-09-01, still absent as of 2026-09-06): default copyright applies, which makes commercial use, redistribution and derivative works legally murky until the author picks a license — the single biggest adoption blocker for a tool aimed at agent infrastructure"
  - "Young and solo-driven: 71 commits from one primary contributor (liruihan000) in its first week, ~166 stars at review time, and the Manage layer's reasoning quality depends on the host CLI you point at it — a weaker host model means weaker distillation"
  - "Setup friction is real: Python 3.12+, uv, an AGENT_MEMORY_STORE environment variable, and per-host wiring (mem setup --host claude-code / codex) that probes the host and appends hook commands — anything that can run a shell command needs neither hooks nor MCP, but the richer integrations are host-specific"
  - "The benchmark is honestly scoped and should not be over-read: the LongMemEval-S haystack is bounded to 12 sessions per episode, which makes it a write-strategy study rather than a corpus-size one, and its absolute numbers are explicitly not comparable to published LongMemEval scores"
  - "The forgetting pipeline requires the sleep-time Manage pass to actually run (uv run mem sleep --reason host), which adds a background operational habit that most agent memory tools hide inside the write path — powerful, but one more moving part"
best-for: "Developers and power users running Claude Code, Codex CLI or Hermes who want durable, greppable, git-able long-term memory across hosts with a real consolidation/forgetting layer, no API keys and no vector-database dependency — especially people who have watched context compaction destroy agent state and want files as the source of truth"
price: "Free and open source (Python 3.12+, install via uv). No API keys, no hosted service, no billing surface — memory runs entirely on your machine, and Manage borrows reasoning from the host agent CLI you already use. Note: the repository has no license file as of 2026-09-06, so confirm usage terms with the author before commercial adoption"
---

## The Problem: Agent Memory That Dies With the Context Window

Every serious agent user has watched the same failure: the context window fills, the harness compacts the transcript into a summary, and the agent forgets — not just chat trivia, but decisions, project state and hard-won facts. The memory-tool landscape's standard answer is a vector store: embed everything, retrieve by similarity, hope the numbers work. tigerless-labs' agent-memory, created September 1, 2026, rejects that architecture and most of its cousins with a blunt thesis: **files are the truth; every index is a rebuildable cache.** Memories are plain markdown files in one store — the single source of truth — and the SQLite index sitting beside them is a cache you can delete at any time. `rm -rf .index && mem rebuild` loses zero knowledge, and that property is enforced by a test, not promised in a doc.

That inversion matters more than it sounds. Vector databases and memory servers make your memories depend on infrastructure: if the index corrupts, the service dies, or the provider changes its embedding model, your agent's memory silently degrades. With agent-memory, the memory is a directory of markdown files you can open in any editor, grep, commit to git, or copy to another machine — and the index is a derived artifact that exists purely for speed. The project calls itself a runtime rather than a library: it manages the full lifecycle of a memory — write, consolidate, age, forget — across any agent that can run a shell command.

## The Storage Model: One Memory Is One File

The store layout is deliberately boring. A root `MEMORY.md` holds one line per memory and is the only resident injection at session start. Memories land in four type domains — `user/`, `project/`, `reference/`, `experience/` — with topic directories that are not preset; the Manage pass clusters them into being over time. `archive/` is append-only and out of the retrieval surface by default, holding distillation provenance forever, retired and demoted entries, and full session trace copies in case the host prunes its own history. `dream-reports/` keeps one file per sleep pass describing what moved and what was proposed. `.index/` is the fully rebuildable cache: content-hash manifest, FTS5, access log. `.state/` holds only runtime state — distillation watermark, write lock.

One memory is one file, because the file boundary is the invalidation atom: supersede, weight and recall all operate on whole files. Frontmatter carries the stable name, a one-sentence abstract, status, timestamps, links, weight and provenance; the body is free markdown. There is one write path — validate → hash-diff → reindex — and CLI, MCP and hooks carry zero algorithm between them, so no integration can drift out of sync with the core.

## Writes at Conversation Boundaries, Not Agent Whim

The write discipline is the second pillar. Memories are written at **conversation boundaries**, not at the agent's discretion mid-task — the agent cannot spam the store with half-formed thoughts. `mem setup --host claude-code` (or `--host codex`) probes the host, appends the `mem-hook` command to its own hook dialect, and leaves the rest of the settings alone: SessionStart injects, Stop and SessionEnd distill, PreCompact evicts. Agents that speak MCP get the same core calls through `mem-mcp` — `memory_recall`, `memory_read`, `memory_record`, `memory_correct`, `memory_feedback`, `memory_proposals`, `memory_decide` — and anything that can run a shell command needs neither, because the CLI is the universal fallback.

There is no LLM client inside the library: zero keys to install, no billing surface, and judgment is borrowed from the host agent's own CLI, which keeps every write visible in your transcript. That design decision (recorded as ADR-002) is what lets one store serve three hosts — Claude Code, Codex CLI and Hermes — with the same files, and their P1 generality experiment shows all nine ordered writer/reader host pairs passing: what one host's shell writes, another's finds, specifics intact, with pooled net contribution over no memory of 2/36 → 13/36 (p=0.0074).

## The Manage Layer: Sleep-Time Consolidation That Cannot Delete Anything Unattended

The third pillar is the part most agent memory tools skip entirely: a real Manage layer on its own clock. Every competitor either has no M in MEM, or buries it inside the write path where it rewrites memories at the moment of writing, when the agent is least able to judge long-term value. agent-memory instead runs `mem sleep` — a separate, unattended consolidation pass that may add and update but whose deletion only ever arrives as a **proposal** you confirm with `mem decide <id> --accept`. Authority tiers are explicit: T0 applies adds and updates; T1 files a proposal for deletions. Nothing it touches is destroyed. Each pass borrows reasoning from the host CLI you point at it, writes a dream report of what moved and what was proposed, and leaves the evidence pointers behind. `recall --as-of` answers questions as of a past date; supersede leaves the superseded entry intact in the chain; archive keeps raw material append-only. The result is a memory system where "missed by the distiller" never means "lost by the system".

## The Evidence: A LongMemEval-S Write-Strategy Study

The project publishes its measurements rather than asking you to trust the design. The experiment used a bounded haystack (12 sessions per episode — deliberately not the full LongMemEval corpus), 120 episodes, `claude -p` with Haiku 4.5 as host, one calibrated Sonnet 5 judge, and two exam replays per arm, with the protocol, every known difference between arms, and the noise floor documented in `docs/experiments.md`. Results: agent-memory W2 scored **127/240 = 52.9%** pooled accuracy; MemCore scored 86/240 = 35.8% (paired +37/−17, p=0.009 and +35/−14, p=0.004); no memory scored 7/120 = 5.8% (p<0.001). The README is careful about what this does and does not prove: the bounded haystack makes it a write-strategy study rather than a corpus-size one, absolute numbers are not comparable to published LongMemEval scores, and the system-to-system row differs in write and read together, so it is an end-to-end comparison that licenses no attribution to either half. That framing — publishing the noise floor and refusing to over-claim — is exactly the rigor the agent-memory space needs more of.

The engineering signals match the rigor: 71 commits in the first week from one primary contributor, a CI pipeline running pytest, ruff and mypy, and open issues that read like a serious project's list (a TOCTOU race in Store.correct between find and write, a path-traversal refusal in import_into, lock-file handle cleanup, and frontmatter parsing edge cases). The design docs are unusually complete for a week-old project: ADR-001 file-truth, ADR-002 no-LLM-in-core, ADR-003 BM25-core-vector-plugin, ADR-004 graph-as-data, ADR-005 tree-emerges-from-manage, ADR-006 write-as-experiment, ADR-007 implementation language, plus domain docs for storage, manage, recall, write and the experiment harness.

## Honest Limits and Who It's For

The most important caveat is legal, not technical: at review time the repository has **no license file**, which under default copyright makes commercial use, redistribution and derivative works murky until the author chooses one. For an infrastructure tool aimed squarely at developers, that is a real adoption blocker and should be resolved early. Beyond that, the project is one week old and solo-driven; the Manage layer's distillation quality inherits from whatever host CLI you attach, and the sleep-time pass is an operational habit you must actually run. The benchmark, honestly scoped, is a write-strategy study rather than a proof of superiority on full-corpus recall.

For developers who have watched context compaction destroy agent state and who want memory that survives as plain files — greppable, git-able, portable across Claude Code and Codex, with an unattended consolidation layer that cannot destroy anything without asking — agent-memory is the most thoughtfully engineered open-source answer to appear this week. Its file-truth thesis, rebuildable indexes and proposal-based forgetting are each individually defensible; together they make a memory runtime worth watching closely.
