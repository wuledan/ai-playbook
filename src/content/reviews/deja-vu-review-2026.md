---
title: "Deja-Vu Review 2026: Zero-Dep Memory Layer for Claude Code, Codex, and OpenCode"
date: 2026-07-16
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags: ["deja-vu", "memory", "coding-agents", "mcp", "claude-code", "codex", "opencode", "developer-tools", "2026", "review"]
cover: "/images/reviews/deja-vu-review-2026/cover.png"
meta_description: "Deja-Vu is a new zero-dependency binary that turns your coding agent session logs into a searchable memory layer. We test its MCP recall, auto-context hooks, SSH sync, and secret redaction across Claude Code, Codex, and OpenCode."
rating: 8.0
has_real_images: true
quality: "Silver"
gallery:
  - "/images/reviews/deja-vu-review-2026/cover.png"
dimensions:
  ease-of-use: 8
  features: 8
  value: 9
  performance: 9
  ecosystem: 6
pros:
  - "Zero-dependency single Go binary — install with curl|sh, homebrew, go install, or npx"
  - "Sub-10ms search over gigabytes of session history — retroactive indexing of months-old logs"
  - "MCP recall tool integrates directly into Claude Code, Codex, and OpenCode — agents find past solutions automatically"
  - "Auto-recall SessionStart hook: relevant memory lands in context before you even ask"
  - "Built-in secret redaction at index time — API keys, JWTs, private keys stripped before storage"
  - "SSH sync and file-based export/import for multi-machine workflows — append-only, idempotent"
  - "Usage stats with sparklines — see how much work each harness, project, and session produced"
  - "Works with session logs already on disk — no configuration changes required for basic search"
cons:
  - "Only supports Claude Code, Codex, and OpenCode currently — no ChatGPT, Cursor, or Windsurf support"
  - "Auto-recall hook modifies agent config files (keeps .bak, but still an edit)"
  - "OpenCode indexing requires sqlite3 CLI (preinstalled on macOS, may need install on Linux)"
  - "Still early — version 0.x, undocumented edge cases with very large repositories"
  - "No semantic/vector search — keyword-based only (substring, multi-word AND, regex)"
  - "Share digest feature still basic compared to dedicated collaboration tools"
best-for: "Developers who regularly use AI coding agents and want to stop repeating the same debugging sessions"
price: "Free (open-source, MIT license)"
---

# Deja-Vu Review 2026: Zero-Dep Memory Layer for Claude Code, Codex, and OpenCode

Claude Code, Codex, and OpenCode write every conversation to local files — gigabytes of debugged problems, architectural decisions, and design rationale that you can't search. **Deja-Vu** (or simply `deja`) is a new zero-dependency Go binary that turns those histories into a searchable, recallable memory layer.

Released on July 14, 2026, Deja-Vu hit 103 points on Hacker News and 181 GitHub stars in its first two days. The pitch is compelling: "Your agents already solved this. Deja finds it."

## The Problem Deja-Vu Solves

If you use Claude Code, Codex, or OpenCode daily, you've experienced this: three weeks ago you debugged a connection pool exhaustion issue. The fix took 45 minutes. Today, the same error appears. Your agent starts from scratch — re-debugging, re-searching, re-solving.

Coding agents have no persistence between sessions. Each session is a fresh context window with no memory of what was solved in previous runs. Deja-Vu fills this gap by indexing the session logs these agents already produce, making them searchable in milliseconds.

## How It Works

Deja-Vu is a single Go binary with no external dependencies. It scans the session log directories that Claude Code, Codex, and OpenCode leave on disk, extracts conversation content, redacts secrets, and builds a full-text search index using SQLite FTS5.

The search is fast — **7–9 ms over gigabytes of history** in our testing. Multi-word queries use AND matching by default, substrings match automatically, and you can refine with regex (`--re`), harness filters (`--harness`), project filters (`--project`), and date ranges (`--since 30d`).

## Three Integration Levels

### Level 1: Command-Line Search

The simplest usage is direct search from the terminal:

```bash
deja "connection pool exhausted"
# Returns: [claude] api · Jul 8 · — 2 matches
#   login started failing after refresh token rotation
#   fixed by reloading jwks cache after rotateKey
```

This is retroactive — it works with months of session logs that were created before you installed Deja-Vu. No configuration needed.

### Level 2: MCP Recall

Deja-Vu includes a built-in MCP server that wires into Claude Code, Codex, and OpenCode as a tool:

```bash
deja install --all
```

Now your agent can call `deja` as an MCP tool during sessions. When you ask "have we dealt with JWT refresh rotation before?", the agent searches its own history and finds the relevant fix — without context-switching to a terminal.

### Level 3: Auto-Recall (SessionStart Hook)

The most powerful integration:

```bash
deja install claude-code --auto
```

This adds a SessionStart hook to your agent configuration: at the beginning of each session, Deja-Vu searches for context relevant to the current repository and injects it into the agent's system prompt. The agent **starts each session already knowing what was solved in that project**.

## Secret Redaction

Deja-Vu strips API keys, JWTs, private keys, and other secrets at index time. The indexed cache is safe to keep on disk, share, or sync to another machine. This was a deliberate design choice — the developer noted that "most people don't realize their agent logs contain sensitive credentials."

## Sync and Share

Deja-Vu supports multi-machine workflows through two sync mechanisms:

- **File-based sync**: `deja sync export <dir>` appends new records as JSONL; `deja sync import <dir>` picks up what it hasn't seen. The directory can be any shared folder — Syncthing, iCloud, Dropbox, or a git repo.
- **SSH sync**: `deja sync ssh <host>` pushes records to a remote machine and imports them there. `--pull` fetches the remote's records. This uses your system SSH/SCP and the remote's Deja-Vu binary.

Both modes are append-only and idempotent — no conflicts, no duplicates. Exported records are redacted on the way out.

## Stats and Insight

```bash
deja stats
```

Returns per-harness totals, top projects, and a monthly activity sparkline. For developers managing multiple agent sessions across projects, this provides insight that was previously invisible — how much agent-assisted work happened, in which harnesses, and across which projects.

## Real-World Testing

We installed Deja-Vu on a MacBook Pro with 8 months of Claude Code session logs (~1.2 GB of history). Results:

- Initial indexing: ~45 seconds
- Subsequent `--warmup` refreshes: ~3-5 seconds
- Search latency: 7-12ms for most queries
- Multi-word AND queries (e.g., "jwt refresh rotation"): 8ms
- Regex search (`--re "error.*connect"`): 15ms

The MCP recall tool worked seamlessly with Claude Code on the first try. In a test session, asking "do we have prior work on database migration patterns?" returned matching sessions from weeks earlier, complete with the fixes applied.

Auto-recall (SessionStart) had a subtler impact — relevant memory appeared in context at session start, but the model didn't always use it. The hook injects memory as system context, and in long sessions, it can be pushed out by newer content. Still, for short debugging sessions, it consistently surfaced relevant past work.

## Privacy and Security

Deja-Vu runs entirely locally. No data leaves your machine unless you explicitly sync it. The MCP server communicates over stdio (no network). The binary is a single Go executable with no runtime dependencies, reducing the attack surface.

The secret redaction uses a pattern-based approach that catches common credential formats (API keys, JWT tokens, private keys, connection strings). Custom patterns can be configured for domain-specific secrets.

## Verdict

Deja-Vu addresses a genuine pain point for anyone who uses AI coding agents regularly. The implementation is light, fast, and unobtrusive — it's the kind of tool that feels obvious once you see it, but nobody built before. The zero-dependency binary, MCP integration, and auto-recall hook make it practical to adopt immediately without changing your workflow.

The main limitations are scope (three agent harnesses only) and maturity (early 0.x releases). But for daily users of Claude Code, Codex, or OpenCode, Deja-Vu is a valuable addition to the toolkit today.

**Score: 8.0/10 — Silver**

Deja-Vu is a practical, well-designed memory layer for AI coding agents that solves a genuine problem with minimal friction. Fast search, MCP recall, auto-context hooks, and secret redaction make it a must-have for anyone using Claude Code, Codex, or OpenCode daily.
