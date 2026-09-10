---
title: "okf-agent-memory Review 2026 — Git-Native Agent Memory That Costs Nothing to Query"
date: 2026-09-11
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "okf-agent-memory"
  - "OKF"
  - "agent-memory"
  - "MCP"
  - "Go"
  - "BM25"
  - "git-native"
  - "persistent-memory"
  - "Claude-Code"
  - "Cursor"
  - "Developer-Tools"
  - "Open-Source"
cover: "/images/reviews/okf-agent-memory-review-2026/cover.png"
meta_description: "okf-agent-memory (created September 5, 2026, MIT, 549 stars) is a git-native persistent memory layer for AI coding agents built on Google's Open Knowledge Format v0.2. This review covers the knowledge/ bundle of Markdown plus strict YAML frontmatter, the zero-dependency Go CLI and its embedded stdio MCP server, the sub-300-microsecond in-memory BM25 search that replaces embedding API calls, progressive disclosure and its 80 percent token-reduction claim, the ten-point agent convention, the trust tiers that separate generated from verified knowledge, the adversarial security hardening in v0.1.4 and v0.1.5, and the honest limits: it is a convention and tooling kit, not an auto-capturing memory, and lexical BM25 is not semantic recall."
rating: 7.4
dimensions:
  ease-of-use: 7
  features: 8
  value: 8.5
  performance: 9
  ecosystem: 6
pros:
  - "Memory lives in your repository as plain Markdown plus strict YAML frontmatter under knowledge/, so the agent's long-term memory is reviewable with the tools you already use: git diff shows exactly what the agent learned this week, git log shows when, and a pull request can include a memory change alongside the code change that provoked it"
  - "The tooling is a single zero-dependency Go binary that does double duty as a CLI and as an embedded Model Context Protocol server over stdio (okf mcp knowledge), so the same deterministic parser and validator back both a human terminal session and a Claude Code, Cursor or Codex tool call"
  - "Search is local, lexical and in-memory: the project benchmarks its BM25 index at under 300 microseconds per concept query and about 4 milliseconds to parse and graph-validate a 50-plus-concept bundle, with a sub-4-millisecond cold start and under 15 MB resident memory, which removes both the vector-embedding bill and the network round-trip from the agent's memory loop"
  - "It is built on the Open Knowledge Format v0.2, Google's open specification for agent knowledge, and uses the format's provenance and trust machinery rather than inventing its own: every concept carries sources, a generated-versus-verified distinction, lifecycle status and a stale_after horizon, so an architectural decision your team confirmed is not silently equivalent to something an agent inferred"
  - "The convention beside the format is unusually well specified: ten minimal agent guarantees, including search-before-write, prefer-update-over-duplication, no chain-of-thought storage, preserve uncertainty, keep a dated log, and never claim a write persisted unless validation confirmed it — the last of which is the failure mode most memory systems leave unaddressed"
  - "Progressive disclosure is a real mechanism, not a slogan: hierarchical index.md files and a link graph let an agent load the concepts it needs instead of dumping a growing scratchpad into the context window, and the repo ships a benchmark suite (with reproducible logs across eight-plus local and cloud LLMs) for the claim it makes about token reduction"
  - "The security work is visible in the history: v0.1.4 and v0.1.5 added symlink-contained bundle isolation, protection for reserved files such as index.md and log.md, path-traversal and frontmatter-injection guards on the MCP tools, and a set of adversarial unit tests covering ancestor-symlink escapes and log-header injection"
cons:
  - "It is a convention plus a toolset, not an automatic memory: nothing captures a conversation for you. The value only appears if your agent is instructed to run the search, write, and review loop, which means the first hour is you wiring the skill and the AGENTS.md instructions into your harness and trusting the model to follow them"
  - "Retrieval is lexical BM25, not semantic — it will not match a concept saved as 'authorization' when the agent searches for 'auth' or 'login flow' unless the words overlap. That is the honest trade for sub-millisecond, zero-cost local search, but teams used to vector recall should expect to write better concept titles and descriptions"
  - "The headline performance table is self-published and, naturally, compares on the axis where a compiled Go binary wins: latency, cold-start and per-query cost against Python-and-vector runtimes. Those numbers look reproducible (the repo ships a benchmark runner), but they measure retrieval plumbing, not answer quality, and the 80 percent token-reduction claim depends on how well your bundle is actually curated"
  - "It is six days old at review time: created September 5, 2026, at v0.1.5 on September 9, 34 forks, two watchers. The format is described as an open standard and the CLI is stable in use, but a pre-1.0 bundle layout, MCP tool set and convention are all still allowed to move, and the ecosystem is a Homebrew formula and three example bundles, not a community"
  - "The contribution history includes automated security remediation under a 'Jules' bot, which is good for finding bugs but also signals how thin the human maintainer bench is; a repository this young with this much surface area (parser, validator, mutation API, MCP server, CLI) has a correspondingly high chance of sharp edges in the parts you did not test"
best-for: "Developers who already run Claude Code, Cursor or Codex against a real codebase and already maintain a CLAUDE.md or AGENTS.md that has started to rot — teams who want their agent's durable knowledge to be structured, diffable, provenance-tracked and free to query, and who are willing to teach the agent a search-before-write habit rather than pay a vector database to guess for them"
price: "Free and open source (MIT). Clone the repository, run make build to produce the bin/okf binary, then either use the CLI directly (okf validate, okf search, okf create, okf bootstrap) or register the embedded MCP server with your agent (command: /path/to/bin/okf, args: [mcp, /path/to/project/knowledge]). A Homebrew formula is provided in packaging/homebrew. No API keys, no cloud, no database, no subscription — the entire cost model is your own CPU and your own git repository."
---

## The Pitch: Your Agent's Memory Should Outlive the Context Window

okf-agent-memory, released September 5, 2026 by the okf-memory project under MIT, starts from a complaint most people who work with coding agents will recognise: a conversation with an AI agent resets when the context window closes, and the architectural decisions, domain discoveries and operational facts from that conversation go with it. The usual answers are a `CLAUDE.md` or `AGENTS.md` that grows monotonically until it crowds out the actual task, or a managed memory framework that hides everything behind a vector database and an embedding bill. okf-agent-memory proposes a third path: put the agent's memory in the repository as plain Markdown plus strict YAML frontmatter under `knowledge/`, and hand it a small, fast, local tool to read and write that bundle deterministically.

That is the whole idea, and it is a good one. After two days it had passed ~100 stars; by review time it sat at 549 stars and 34 forks with a v0.1.5 release on September 9 — a release cadence of roughly one version per day since launch, which is either a sign of a young project moving fast or of a young project not yet settled, and honestly both.

![The okf-agent-memory landing page — git-native persistent memory for AI coding agents, built on Google's Open Knowledge Format v0.2](/images/reviews/okf-agent-memory-review-2026/homepage.png "okf-memory.dev — the project's value proposition and quickstart")

## The Format: Markdown on Disk, Trust in the Frontmatter

The data layer is Google's Open Knowledge Format v0.2, an open specification for agent knowledge and the thing the project's name abbreviates. Each concept is a Markdown file with a YAML frontmatter block that carries more than a title: provenance via `sources`, a `generated` versus `verified` distinction, a lifecycle `status`, and a `stale_after` horizon. An `index.md` at the root provides progressive disclosure, a dated `log.md` records change over time, and cross-links between concepts form a graph that the tooling can validate for connectivity.

The practical payoff is auditability. Because the memory is a git repository, `git diff` tells you exactly what the agent decided to remember this week, `git log` tells you when, and a memory change can ride in the same pull request as the code change that provoked it — with review before it lands. That is a claim no vector-database memory framework can make, and it is the reason to prefer this design even if you could afford embeddings.

## The Tooling: One Go Binary, Two Jobs

The tooling layer is a single zero-dependency Go binary with a sub-4-millisecond cold start. It wears two hats. As a CLI it exposes `validate`, `search`, `show`, `create`, `update`, `relate`, `bootstrap` and `init`, plus a `--strict --drift` validation mode intended to catch description drift and broken graph links in CI. As an MCP server (`okf mcp knowledge`) it exposes the same deterministic parsing and mutation surface to Claude Code, Cursor, Codex and any other Model Context Protocol client over stdio.

Because the binary is what parses and writes the bundle, the language model is never asked to hand-format a knowledge file. The project's framing is that this "strictly separates semantic reasoning from syntax handling" across a five-layer stack: the OKF specification, an agent convention, an agent skill, the Go tooling, and the knowledge corpus itself. Whether or not you buy the five-layer diagram, the instinct — keep the model out of the business of writing valid YAML — is right, and it is the same lesson the wider agent-tooling ecosystem keeps relearning.

## The Performance Claim, Stated Plainly

The speed numbers are the headline in the README's benchmark table. In-memory BM25 concept search is quoted at under 300 microseconds; a full parse and graph validation of a 50-plus-concept bundle at about 4 milliseconds; cold start under 4 ms; resident memory under 15 MB; and zero retrieval cost, replacing the roughly $0.10 to $0.50 per thousand queries that the project attributes to embedding-based memory. Against Python-and-vector runtimes quoting 150–800 ms search latency, the gap is real and mostly a consequence of the design: compile once, index in memory, never call a network.

It is fair to note what the table is and is not. It is self-published, it measures retrieval plumbing rather than answer quality, and it compares on the axis where a compiled Go binary against Python-and-V8 runtimes is always going to look best. The repo ships a benchmark runner (`make benchmark`) and a progressive-disclosure suite with logged results across eight-plus local and cloud LLMs, so the numbers are at least reproducible — but the much-quoted 80 percent token reduction depends on how well you actually curate the bundle, not on the index being fast.

## The Convention: Ten Rules That Are the Real Product

The specification is open, but the opinionated part is the Agent Memory Convention: ten minimal guarantees every agent maintaining the bundle is asked to keep. Memory belongs in the corpus; search before you write; prefer updating an existing concept over duplicating it; do not store chain-of-thought; preserve sources and dates; qualify inference and preserve uncertainty; keep a meaningful log rather than silently overwriting; run a review loop after substantial work; validate changes; and — the one most memory systems quietly omit — never claim persistence unless a write and its validation were actually confirmed.

That last rule is the tell. Most agent memory fails not because retrieval is bad but because the agent confidently believes it saved something that never reached disk. Writing the honest-failure requirement into the convention is the difference between a demo and a system.

## Security, and Where It Is Still Thin

The version history is worth reading for the security commits alone. v0.1.4 added symlink-aware bundle isolation, reserved-file protection (an agent cannot overwrite the root `index.md`, `log.md` or `AGENTS.md`), and adversarial tests for ancestor-symlink traversal. v0.1.5 sanitised the `okf_update` MCP arguments and added tests for path traversal, frontmatter injection and log-header injection. For a project this young, treating model input as untrusted and testing for it is a maturity signal that many older agent tools still lack.

The limits are equally clear. This is a convention plus a toolset, not an auto-capturing memory: nothing here watches your chat and writes itself. The value appears only when your agent is instructed to run the search, write and review loop — which is a wiring job, an `AGENTS.md` job, and a "will the model actually follow the instructions" job before it is a memory job. Retrieval is lexical BM25, so a concept saved as "authorization" will not surface for "login flow" unless the words overlap; that is the honest price of local, sub-millisecond, zero-cost search, and teams raised on vector recall will need to write better titles and descriptions. And at v0.1.5, six days old, with a Homebrew formula and three example bundles as the whole ecosystem, the pre-1.0 surface — bundle layout, MCP tool names, the convention — is all still free to move.

## Who Should Care

If you already run a coding agent against a real codebase and your `CLAUDE.md` has quietly become a junk drawer, okf-agent-memory is the most principled cheap fix available: structured, diffable, provenance-tracked memory that costs your CPU time and nothing else to query. If you need semantic recall across paraphrased concepts, or an auto-capturing memory that requires zero discipline from the model, this is not that tool yet — and the README, to its credit, does not pretend otherwise. At 7.4/10 it earns Silver-plus on the strength of a clean design, a genuinely fast local index, and a convention that names the failure modes most memory projects leave unnamed; the deduction is for youth, for lexical-only retrieval, and for a benchmark table that wins the race it chose.
