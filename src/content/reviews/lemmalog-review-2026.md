---
title: "lemmalog Review 2026 — A Datalog Engine for LLM Agent Memory: Provenance-Tracked Facts, Incremental Derivation, and an MCP Server"
date: 2026-09-01
author: "AIPlaybook Editorial Team"
category: "LLM"
tags:
  - "lemmalog"
  - "Agent-Memory"
  - "Datalog"
  - "LLM-Agents"
  - "Knowledge-Graph"
  - "NeuroSymbolic"
  - "MCP"
  - "Rust"
  - "Agent-Context"
  - "Open-Source"
cover: /images/reviews/lemmalog-review-2026/cover.png
meta_description: "lemmalog is a Datalog engine for LLM agent memory — stratified rules, provenance-tracked facts, incremental derivation, and an MCP server that lets Claude Code or Kimi CLI use it as a shared brain. The thesis: an agent's memory should be a deductive database, not a better vector store. Base facts are asserted at the LLM extraction boundary, rules derive closures and temporal projections, every fact carries provenance back to its source episode, and each conversation turn updates derived views incrementally. It shipped August 27, 2026 with 230+ GitHub stars, a differential-testing harness (450 random programs against a naive fixpoint oracle), and a design document that cites LongMemEval's 21-30% frontier-model drop on knowledge updates as the problem it exists to solve."
rating: 7.8
dimensions:
  ease-of-use: 6
  features: 9
  value: 8
  performance: 8.5
  ecosystem: 6.5
pros:
  - "A genuinely different memory thesis: instead of 'remember better than a vector store,' lemmalog treats memory as an incrementally maintained deductive database — closures, inheritance, contradiction detection, and consequence propagation are computed by the engine, not re-derived by the LLM on every query"
  - "Provenance on every derived fact: semiring annotations combine confidence (product t-norm) with provenance (set union), and why() proof trees trace any answer back to its source episodes with cycle protection — auditability you don't get from vector stores or property graphs"
  - "Real incremental maintenance: seminaive fixpoint with per-epoch delta maintenance, scoped negative deltas where retraction recomputes only transitive dependents, and DRed-lite supersession rebuilds only what actually changed"
  - "Bi-temporal facts (valid_from/valid_to/asserted_at + now()) give a principled supersession model — the exact capability where LongMemEval shows frontier models drop 21-30%, because most memory systems have no principled way to handle knowledge updates"
  - "Demand evaluation done properly: magic-sets ask_deep answers point queries without a full fixpoint, and indexed read paths hit ~100µs at 4M facts — the numbers are in the README, not just claimed"
  - "Ships as an MCP server (12 tools) usable from Claude Code or Kimi CLI, plus a generic agent skill — the engine is a shared brain, not a hardcoded workflow"
cons:
  - "Real learning curve: Datalog grammar, stratification, bi-temporal columns, and the line protocol (S --rel[conf]--> O) are a new vocabulary — the README even warns bare capitalized words are variables, so entity names must be quoted"
  - "The LLM is still the extraction boundary: base facts are asserted by the host model, so extraction quality gates everything downstream — lemmalog makes reasoning deterministic, not the reading of the conversation"
  - "Rust build with MCP features (cargo build --release --features mcp) is a developer-grade install, not a one-liner plugin — there's no hosted version, no prebuilt binary in the README's quick path"
  - "234 stars and 17 forks at review time: it's a 5-day-old research-grade project with zero open issues but also no community, no release tags, and a design doc that is itself honest about what shipped vs. future phases (leapfrog triejoins and DBSP streaming deltas are explicitly marked future)"
  - "The skill's discipline (assert-as-you-verify, rules as experiments, why before trusting) is prescriptive — it encodes the authors' converged workflow, which may or may not fit how your agents already work"
  - "No benchmark numbers vs. competing memory systems in the README — the synthetic eval harness (scenario::run_eval) exists, but you must run it yourself to see accuracy/token/latency comparisons"
best-for: "Engineers building long-horizon agent systems — investigations, debugging audits, multi-agent searches — who are willing to trade a steeper learning curve for deterministic, provenance-carrying, incrementally maintained memory instead of retrieval-plus-prompt-luck"
price: "Free, MIT-licensed; Rust crate + MCP server + REPL + agent skill — no paid tier, no hosted service; costs are your own compute and LLM extraction calls"
---

## The Thesis: Memory Should Be a Deductive Database

On August 27, 2026, `JordyZomer/lemmalog` appeared on GitHub with a description that reads like a position paper: *"A Datalog engine for LLM agent memory: stratified rules, provenance-tracked facts, incremental derivation, and an MCP server that lets your harness use it as a shared brain."* Five days later it has **230+ stars and 17 forks**, zero open issues, and a design document — `datalog-context-engine-design.md` — that is unusually honest about what shipped versus what's planned.

The thesis is stated in the first section of the design doc: **"an agent's memory should be a deductive database — the agent builds a verifiable model of what it knows and mechanically reasons over how that knowledge changes, rather than 'remembering better' than a vector store."**

The problem it targets is structural. LLM agents fail on long horizons because *context is treated as a buffer, not a database*. The design doc cites the evidence: **context rot** (Liu et al., arXiv:2307.03172; Chroma's 2025 context-rot study; NVIDIA RULER, arXiv:2404.06654) — every frontier model degrades non-uniformly as input grows, with effective reliable context often 4k–32k tokens regardless of the advertised window. And **LongMemEval** (arXiv:2410.10813) shows knowledge updates and temporal reasoning are the worst-performing memory abilities, with frontier models dropping **21–30%** — because most memory systems have no principled supersession model.

The current generation of agent-memory systems — Zep/Graphiti, Mem0, GraphRAG, Letta — stores *extracted facts* in a property graph, but **derives nothing**: closure, inheritance, contradiction detection, and consequence propagation are either re-done by the LLM on every query (expensive, unreliable) or absent. lemmalog's claim, stated narrowly in the design doc: it combines **bi-temporal supersession, provenance-carrying derived facts, runtime-installed rules, and demand evaluation** behind one agent-facing memory interface.

## What's Actually Implemented

The README ships a status table that is refreshingly precise about what exists. The headline items, all marked shipped:

- **Runtime-parsed, stratified Datalog** — an interpreter, not a proc-macro compiler, which is what makes runtime-installed rules possible
- **Negation-as-absence** with negative-cycle rejection
- **Seminaive fixpoint with per-epoch delta maintenance** — each conversation turn is a small delta; derived views update incrementally instead of re-deriving
- **Bi-temporal facts** via `valid_from`/`valid_to`/`asserted_at` columns plus `now()` — edge invalidation rather than deletion
- **Semiring annotations**: confidence (product t-norm) × provenance (set union), with annotation merge on re-derivation (max conf, union prov, deduped supports)
- **`why()` proof trees** with cycle protection — trace any fact back to its source episodes
- **Additive arithmetic in comparisons** (`D = Dm + 1`) with linear solving
- **Scoped negative deltas**: retraction recomputes only transitive dependents
- **`ask()`** — a read-only Datalog query surface for agents
- **Magic-sets demand evaluation (`ask_deep`)** — point queries without a full fixpoint
- **Hybrid retrieval (`context_for_query`)**: BM25 + entity/graph boosting, budget-aware
- **Entity resolution**: star-shaped aliasing, directional canonical views, conflict escalation
- **Hypotheticals**: `what_if` lookahead with byte-identical store restore
- **Streaming change feed**: `Added`/`Retracted`/`Cleared` events
- **Indexed read paths**: point lookups ~100µs at 4M facts
- **Differential testing**: 450 random programs vs. a naive fixpoint oracle, plus parser fuzzing
- **Aggregation**: `count`/`min`/`max`/`sum` head args with group-by fold and value-change propagation

Marked as future phases: **leapfrog triejoins** (worst-case-optimal joins) and **DBSP streaming deltas**. That distinction matters — the project knows exactly where it is.

## The MCP Server: A Shared Brain for Claude Code or Kimi CLI

The engine is exposed as a **stdio JSON-RPC MCP server with 12 tools**, buildable with:

```sh
cargo build --release --features mcp
claude mcp add lemmalog -- $(pwd)/target/release/lemmalog-mcp
# or: kimi mcp add lemmalog -- $(pwd)/target/release/lemmalog-mcp
```

Persistence across sessions is handled by setting an env var at registration (`LEMMALOG_MCP_PATH=/tmp/lemmalog.snapshot`). The division of labor is clean: **the host model reads the conversation and asserts triples; lemmalog derives everything deterministically.** A typical session:

```
lemmalog_observe       {"facts": "Alice --works_at--> Acme\nAlice --manager--> Bob", "ts": 100}
lemmalog_install_rules {"rules": "reports_to(X,Y) :- current(X,\"manager\",Y).\n trans: ..."}
lemmalog_query         {"goal": "reports_to(\"Alice\", Y)"}    -> Y=Bob, Y=Carol
lemmalog_why           {"fact": "reports_to(Alice, Carol)"}     -> proof tree to episodes
lemmalog_what_if       {"facts": "Dana --manager--> Alice", "goal": "reports_to(\"Dana\", Y)"}
lemmalog_canonicalize  {"facts": "Acme_Corp --alias_of[0.9]--> Acme"}
```

Plus `lemmalog_query_deep` (magic sets), `lemmalog_dump`, `lemmalog_batches`/`lemmalog_uninstall` (revertable rule batches), `lemmalog_save`, and `lemmalog_run`. One grammar gotcha the README flags explicitly: **bare capitalized words are variables** — quote entity names (`reports_to("Alice", Y)`).

The repo also ships a generic agent skill (`skills/lemmalog/SKILL.md`) that makes the engine the working memory for *any* long-running work — investigations, debugging, audits, multi-agent searches — encoding the discipline the authors converged on: assert-as-you-verify with anchors and confidence, rules as experiments, query before re-reasoning, `why` before trusting, hypothesis lifecycles, decide-from-queries, report-from-the-engine.

## Why Datalog, and What the Design Doc Admits

The design doc makes the case for Datalog specifically: recursion is the natural shape of context queries (transitive support, dependency, influence — reachability/dataflow queries that are awkward in Cypher/SQL); guaranteed termination and no side effects make it safe to expose to an LLM as a query language; incremental evaluation is a solved problem (differential dataflow, DDlog, DBSP/Feldera); and semiring annotations give one mechanism for provenance, confidence, and recency.

The most important design constraint it surfaces: **no established system puts an LLM call inside a Datalog fixpoint, and for good reason** — LLM calls are non-monotone and expensive. lemmalog keeps LLM predicates outside the fixpoint via strict stratification and memoization.

The design doc also documents a real engineering story: building entity resolution surfaced and fixed **two long-lived engine bugs** — scoped recompute never processing same-stratum dependents (latent stale-fact bug, fixed by SCC-condensation stratification plus a recompute fixpoint), and invalidation running before lower strata were materialized on first run (fixed by moving invalidation after evaluation). Both were caught by the differential harness — which is exactly what a differential harness is for.

## Honest Boundaries and Who Should Use It

The caveats are real and the README/design doc mostly admit them. The **LLM is still the extraction boundary** — base facts are asserted by the host model, so lemmalog makes reasoning deterministic, not the reading of the conversation. The install path is developer-grade (Rust build with MCP features), not a one-liner plugin. At 234 stars and 5 days old, there's no community, no release tags, and no third-party benchmarks — the synthetic eval harness exists, but you must run it yourself.

**Who should use it:** engineers building long-horizon agent systems — multi-step investigations, debugging audits, multi-agent searches — where the failure mode of current memory systems (re-deriving consequences in-context, or losing them entirely) is already hurting. The payoff is deterministic, provenance-carrying, incrementally maintained memory; the cost is Datalog fluency.

**Compared to the alternatives:** vector stores retrieve by similarity but derive nothing; property-graph memory (Zep/Graphiti, Mem0, GraphRAG) stores extracted facts but re-does reasoning in the LLM; text-to-SQL/Cypher gives agents a query language but not a safe, terminating one. lemmalog's niche — a deductive database with bi-temporal supersession, provenance semirings, and demand evaluation at the LLM context boundary — is genuinely distinct, and the honest status log makes it easier to trust than most 5-day-old repos. For a project this young with this much engineering surface already shipped and differentially tested, it's one of the more serious agent-memory bets of the week.

*Screenshots captured from the official GitHub repository on September 1, 2026. Star counts and metrics reflect the repository state at review time.*
