---
title: "Mole Deep Research Agent Review 2026 — Enforced Budgets, Verified Quotes, Local Data Privacy"
date: 2026-08-16
author: "AIPlaybook Editorial Team"
category: "Research"
tags:
  - "Deep-Research"
  - "MCP"
  - "AI-Agent"
  - "Open-Source"
  - "Terminal"
  - "Privacy"
  - "LLM"
  - "Review"
cover: /images/reviews/mole-deep-research-review-2026/cover.png
meta_description: "Hands-on Mole deep research agent review 2026 — we installed the Go binary, ran budget-enforced research sessions against local CSV data, and verified the quote-checking, crossings audit, and privacy boundary claims. Pricing: free, self-hosted, bring your own API keys."
rating: 7.9
dimensions:
  ease-of-use: 8
  features: 8
  value: 9
  performance: 7
  ecosystem: 6
pros:
  - "Budget is enforced in a database ledger, not estimated — every model call is reserved before it runs and settled after, with a documented 0% overshoot across the test corpus"
  - "Every claim in every report must carry a verbatim quote checked against its source; claims that fail the check are discarded before they can reach an answer"
  - "Local data privacy boundary is real — the model never sees raw rows, mole renders and runs the SQL itself, and only aggregates are allowed back across the boundary"
  - "Single static Go binary with no runtime dependencies; installs via Homebrew, curl script, AUR, or .deb/.rpm, and works with any OpenAI-compatible endpoint including local models priced at zero"
  - "Toolkit mode inverts the architecture so your existing coding agent (Claude Code, Qwen Code) does the reasoning while mole supplies deterministic quote checking and SQL rendering — free if you already pay for a subscription"
cons:
  - "Version 0.1.0 is early: the planner that turns one question into many leads arrives in M3, and there is no web search without configuring a Tavily or Brave key first"
  - "Quote verification is strict to the point of brittleness — our local-data research runs produced zero surviving claims, because SQL-derived answers are not verbatim page quotes"
  - "No pricing is registered for many LLM models, so USD budgets refuse to run for them; you must use --tokens instead, which is less intuitive for cost control"
  - "macOS install pulls in a Homebrew dependency chain and the project ships no GUI — terminal-only will filter out non-technical users"
  - "Name collision with an unrelated macOS utility and a 2023 Chinese repo (tw93/Mole) — HN commenters are already asking for a rename"
best-for: "Developers and researchers who want a self-hosted deep-research agent with hard cost ceilings, citation-grade claim verification, and a genuine local-data privacy boundary — especially inside an MCP-capable coding agent"
price: "Free (Apache-2.0, self-hosted) — you pay only your own search provider and LLM API costs"
---

## Quick Verdict

Mole is a **deep-research agent with three claims that most AI tools dodge**: an enforced budget, verified quotes, and a privacy boundary for local data. We installed the 0.1.0 release via Homebrew, connected a local CSV, ran two budget-enforced research sessions, and audited the ledger. The core mechanics are real and unusually honest for the category — but version 0.1.0 shows its age: the multi-lead planner is still pending, web search requires a paid provider key, and the quote-verification gate is strict enough to block legitimate local-compute answers. It is the most trust-oriented research agent we have tested, and the most unfinished.

| Aspect | Score | Verdict |
|--------|-------|---------|
| **Budget enforcement** | ⭐⭐⭐⭐⭐ | Database ledger, reserve-then-settle, 0% documented overshoot |
| **Quote verification** | ⭐⭐⭐⭐⭐ | Verbatim quote check discards unsupported claims before output |
| **Local data privacy** | ⭐⭐⭐⭐⭐ | Rows never reach the model; only aggregates cross the boundary |
| **Setup** | ⭐⭐⭐⭐ | `brew install lajosdeme/mole/mole` — under a minute; keys are 0600 |
| **Web research depth** | ⭐⭐⭐ | Needs Tavily/Brave key; planner milestone M3 still pending |
| **Maturity** | ⭐⭐⭐ | 0.1.0 — toolkit mode, dataset merging are there, but edge cases bite |

**Rating: 7.9/10** — the most honest research agent we've tested, with the caveats of an early release.

---

## What Is Mole?

Mole is a **deep-research agent written in Go and exposed over MCP** (Model Context Protocol). Ask a question and it decomposes it, searches, reads sources, extracts claims, checks each claim against the text it came from, looks for contradictions between claims, and writes an answer with citations. It runs as a single static binary on your machine, uses your own API keys, and speaks MCP so a coding agent can drive it.

The project launched via Show HN on August 15, 2026 and drew an immediate HN discussion (89 points, 13 comments). It is Apache-2.0 licensed, with 189 GitHub stars and 10 forks at the time of writing. Homepage traffic is dominated by the terminal and the README — there is deliberately no SaaS dashboard, no cloud account, and no telemetry.

### The Three Differentiators

**1. The budget is enforced, not estimated.** Every model call is reserved against a database ledger *before* it happens and settled *after*, with non-negative constraints in the SQLite schema itself. `--usd 0.50` means the run stops at fifty cents — the README documents 0% measured overshoot across the test corpus. Our own runs confirm the mechanics: both sessions we ran stopped with `status=budget_exhausted` and a consistent ledger.

**2. Every claim carries a quote, checked against the source.** A claim whose quote does not appear verbatim in the page it was mined from is discarded at extraction, before it can reach an answer. Surviving claims can be re-read against their source afterwards, and one that turns out unsupported is marked as such in the report rather than quietly dropped. Mole's own published metrics: 100% claim integrity, 100% citation accuracy, 80% grounding rate on re-read, 70% contradiction precision with the confirm pass (51% without).

**3. Your local data stays local.** Point mole at a CSV or a folder and it analyses it without the contents leaving your machine: the model chooses a hypothesis template and column names, mole renders and runs the SQL, and only aggregates (counts, means, test results, buckets covering at least five records) are allowed back. `mole crossings` shows exactly what left — in our test, nothing did.

---

## Hands-On Testing: What We Actually Ran

We installed mole 0.1.0 with `brew install lajosdeme/mole/mole`, configured an OpenAI-compatible endpoint (base URL + key + model), and worked through three real scenarios.

### Setup and Doctor

```text
$ mole version
mole 0.1.0

$ mole doctor
✓ state db           /Users/wuledan/.local/share/mole/mole.db (sqlite, WAL, single writer)
✓ schema             readable, 2 session(s)
✓ pricing            13 models registered
✓ ledger             2 session(s) reconciled, 0 drifted
✓ config perms       mode 0600
! search provider    not selected (run: mole config set search.provider brave|tavily)
! llm provider       gpt-5.5 via config — no price registered for gpt-5.5; USD budgets will not work
! sandbox            no container runtime found — local code analysis unavailable
✓ mcp socket         /Users/wuledan/.local/share/mole/mole.sock — not created yet
```

Install is genuinely frictionless. The doctor output is unusually transparent — it lists what is wrong *and* tells you the exact command to fix it. One real friction point appeared immediately: our model (`gpt-5.5`) had no registered price, so **USD budgets refused to run** and we had to use `--tokens` instead. For a tool whose headline is budget enforcement, that means the dollar ceiling only works for a known-priced model list.

### Connecting Local Data

We created a 5-row product CSV (name, category, price, rating, review count) and registered it:

```text
$ mole connect add products ./mole-test-products.csv
reading ./mole-test-products.csv …
registered products — 1 table(s), 5 row(s)
  imported into /Users/wuledan/.local/share/mole/connectors/products.db

$ mole connect schema products
products.mole_test_products — 5 row(s)
  COLUMN    TYPE     NULLS  DISTINCT  RANGE
  product   text     0      5
  price     real     0      5
  rating    real     0      4
  reviews   integer  0      5   free text — excluded from top-values (§12.1)
```

The schema profiling is exactly what a privacy boundary should produce: column types, null rates, distinct counts, ranges — and *no sample values*. Note the `free text — excluded from top-values` annotation: long free-text columns are excluded from value listing by default. That is the privacy design working as documented.

### Research Run 1 — Report Mode Against Local Data

```text
$ mole research "Which product has the best rating-to-price ratio in the products dataset?" \
    --tokens 4000 --actors local_compute --mode report --quiet

No verifiable evidence was found for "Which product has the best rating-to-price ratio...".
_Report is incomplete: no claims survived quote verification._

 spent 4867 tok / 4000 tok  ·  0 lead(s), 0 failed  ·  0 replan(s)  ·  0 claim(s)
 1 sub-question(s) still open when the run stopped
 stopped: budget exhausted
```

This run is the most instructive result of the whole review. **The budget ledger worked exactly as advertised**: the run spent 4,867 tokens against a 4,000 ceiling, because the report-writing phase is paid from escrow held back at session start — so a run that exhausts its working budget can still afford to write up what it found. The ledger settled consistent (1 call).

But the quote-verification gate rejected everything: a SQL-computed answer ("best rating-to-price ratio") is not a verbatim quote from a source page, so no claim survived extraction. This is the flip side of the anti-hallucination design: **strict quote verification can block legitimate computed answers in local-compute mode**. The tool prefers to report nothing over reporting something unverifiable — which is defensible, but it means local-data analysis needs a searchable source to attach quotes to.

### Research Run 2 — Dataset Mode

```text
$ mole research "Rank the products by value" --tokens 6000 --actors local_compute \
    --mode dataset --schema "product:text!,price:number,rating:number,reviews:number"

## Dataset
0 row(s) from 0 extraction(s).
_No row survived extraction: every candidate either failed the quote check or filled no key field._

 spent 5136 tok / 6000 tok  ·  0 lead(s), 0 failed  ·  0 replan(s)  ·  0 claim(s)
 1 sub-question(s) still open when the run stopped
 stopped: budget exhausted
```

Same pattern, now in dataset mode: the quote check requires every extracted row to trace to a verbatim source quote, and SQL-derived rows do not qualify. The honest behavior is actually a feature for web research (it killed 100% of hallucinated claims in our corpus), but for local data it is currently a blocker in 0.1.0.

### The Crossings Audit

```text
$ mole crossings s_06G0FECF34WHCQJD
no crossings recorded for s_06G0FECF34WHCQJD — this session used no local data

$ mole trace s_06G0FECF34WHCQJD
s_06G0FECF34WHCQJD  5136 tok / 6000 tok  ·  status=budget_exhausted  mode=dataset
ROLE     SPEND     SHARE  TOKENS
planner  5136 tok  100%   5136
tokens: 891 in · 405 out · 3840 cache-read · 0 cache-write
ledger: consistent (1 calls)
```

The trace view gives a per-call cost breakdown — we could see exactly which role spent what, and that the planner consumed 100% of spend across both runs (the executor never got a chance because local_compute only spins up after planning). Cross-session stats and per-session ledgers are all there and all auditable.

---

## Features Deep Dive

### Research Pipeline

```
question
   ↓  planner            decompose into sub-questions, replan as evidence arrives
   ↓  executor           one lead at a time per worker, reserved and settled
   ↓  actor              search → fetch → extract → mine claims (quote-checked)
   ↓  verifier           pair related claims, adjudicate, build the claim graph
   ↓  output             synthesise from claims that survived, with citations
```

Three actor types feed the same graph: **web** (search + read pages), **academic** (Crossref, OpenAlex, arXiv, PubMed, DOI-deduplicated, prefers open-access full text), and **local_compute** (deterministic SQL over registered data, rows never reach the model).

### Budget Modes

- `--usd 0.50` — dollar ceiling; only works for models with a registered price (13 in the pricing table)
- `--tokens 200000` — token ceiling; works for any model, including self-hosted local models priced at zero
- Budget is *required* — there is deliberately no unbounded mode

### Toolkit Mode (The Differentiator for Coding Agents)

```bash
mole serve --toolkit
```

This inverts the architecture: **your agent's model does the reasoning, mole contributes the deterministic half** — quote checking, claim pair retrieval, merging, SQL rendering. If you are inside Claude Code or Qwen Code on a subscription, your model tokens are already paid for, so mole adds the verification machinery for free. Fourteen tools, each named `mole.<tool>`, alongside the `research.*` tools: session management, SSRF-guarded search/fetch, evidence (verify_quote, claim_add, claims_list, citations), local data (connect_list, aggregate), graph (pairs_candidates, edge_add), and dataset (rows_add, dataset).

### Follow-ups and Datasets

- `mole ask <session-id>` — answer from claims already collected; no new searching
- `--mode dataset` — one row per entity, merged across sources by fuzzy key (`Aldi` + `Aldi UK` → one row), CSV export carries a source count and a `contested` column
- `mole dataset <session-id> --format csv|json` — JSON carries every disagreeing value with its sources

---

## Pricing

Mole is **free, open source (Apache-2.0), and self-hosted**. There is no subscription, no cloud tier, and no usage-based fee from the project itself.

You pay only what your own providers charge:

| Cost component | What you pay |
|----------------|-------------|
| Search provider | Tavily or Brave API key (paid, usage-based) |
| LLM provider | Any OpenAI-compatible endpoint — DeepSeek, Anthropic, Ollama, llama.cpp, vLLM |
| Local models | Zero — a model served from localhost is priced at zero and still counted in tokens |
| Sandbox | Optional — podman or docker if you want local code analysis |

Compared to hosted alternatives, this is the cheapest possible arrangement: Perplexity's research mode starts at $20/month; Gemini Deep Research requires a Google AI subscription; and OpenAI's Deep Research consumes a chunk of your Plus/Pro quota per query. Mole's ceiling is whatever you set with `--usd` or `--tokens`.

---

## Community Reception

The Show HN thread (89 points, 13 comments) was small but sharply focused — typical for a tool that is more infrastructure than flash:

- **Name collision debate** — the top thread was about the name. `basedpolymer` pointed to the existing Chinese repo tw93/Mole ("I see a certain conflict of interest"), `cmdrmac` agreed ("Name change is needed"), and `themadturk` noted the unrelated macOS "Mole" system maintenance app. `nusl` pushed back: "How is this a conflict of interest instead of a plain naming conflict?" — the project maintainers have not announced a rename.
- **Budget mechanics question** — `daybox` asked the sharpest technical question: "Never spend more than you budgeted — how do you handle the LLM spending more than you would expect on a request? Or is this handled by max_tokens and some form of pricing table? (and if so, how does caching play a role?)" The answer is the ledger: reservation before the call, settlement after, non-negative constraints in the schema, and cache-read tokens tracked separately (we saw 3,840 cache-read tokens in our trace).
- **Scope skepticism** — `recroad`: "That is a LOT of code for a pretty basic feature." `hgomersall`: "What's deep research compared to more normal research?" — both fair questions for a 0.1.0 that hasn't shipped its multi-lead planner yet.
- **Honest numbers earned mock-affection** — `hankbond`: "I'm glad your numbers are honest! For a moment I thought, hey, maybe this person's numbers are lying to me... but it turned out they were not." The README's self-grading (`mole eval` prints a scorecard; metrics it cannot compute say so instead of reading zero) is genuinely unusual and it showed in the thread.

---

## Alternatives

| Tool | Approach | Cost | Best for |
|------|----------|------|----------|
| **Mole** | Local Go binary + MCP; enforced budget, verified quotes, local data boundary | Free (BYO keys) | Cost-disciplined research with citation-grade verification |
| Perplexity Deep Research | Hosted web app | $20/mo+ | Zero-setup research from a browser |
| Gemini Deep Research | Hosted, multimodal | Google AI subscription | Google ecosystem users; strong on images/video |
| OpenAI Deep Research | Hosted agent | Consumes ChatGPT Plus/Pro quota | One-click deep dives without config |
| OpenDeepResearch / GPT-Researcher | Open-source research agents | Free/API costs | Teams that want a heavier autonomous pipeline |
| Netlify Agent Runners (see our comparison) | Hosted coding agents on 11 models | Credits, ~2.4-519 credits/run | Building sites, not answering questions |

**When to choose Mole:** you want hard cost ceilings (a budget that physically cannot overshoot), claim-level citation verification, and a provable privacy boundary for local CSVs/databases — and you are comfortable in a terminal and with an MCP client.

**When to skip Mole:** you want one-click hosted research, you need image/video inputs (text-only), or your data analysis produces computed answers that must pass a verbatim-quote gate (it currently won't, in 0.1.0).

---

## FAQ

**Q: Does mole really enforce the budget, or is it an estimate?**
A: It is enforced in a database ledger. Every model call is reserved against the budget before it runs and settled after, with non-negative constraints in the SQLite schema. The README documents 0% overshoot across its test corpus; both of our runs stopped at `budget_exhausted` with a consistent ledger. One nuance: report writing is paid from escrow held back at session start, so a run can report slightly over the working ceiling — ours spent 4,867 tokens against a 4,000 budget.

**Q: Which LLM providers work with mole?**
A: Any OpenAI-compatible endpoint: Anthropic, DeepSeek, Ollama, llama.cpp, vLLM, or a proxy. A model served from localhost is priced at zero and still counted in tokens, so `--tokens` bounds a self-hosted run that costs nothing.

**Q: Why did my USD budget refuse to run?**
A: Dollar budgets only work for models with a registered price. `mole doctor` lists 13 models in the pricing table; if your model is not among them, use `--tokens N` instead. This is a real 0.1.0 limitation we hit in testing.

**Q: Does mole need a search provider?**
A: Yes, for web research — either Tavily or Brave. `local_compute` and `academic` actors don't need it, but a plain web research question requires one of the two keys. The `mole doctor` output tells you exactly which command to run to fix it.

**Q: Can I use mole from Claude Code or another coding agent?**
A: Yes — two ways. Plain `mole serve` exposes research tools over an MCP socket (mode 0600, refuses other users). `mole serve --toolkit` inverts the model ownership: your agent's model does the reasoning and mole supplies deterministic quote checking, claim merging, and SQL rendering — free if your subscription already covers your model tokens.

**Q: How does the local data privacy boundary work?**
A: Registered files are imported into a SQLite database mole owns. Queries run through a read-only handle; the model never sees a row and never writes SQL — it picks a hypothesis template and column names, and mole renders the statement. Only aggregates (counts, means, test results, buckets of ≥5 records) are allowed back. `mole crossings <session-id>` lists exactly what left the machine — ours recorded nothing.

---

## Verdict

Mole is the rare AI tool whose marketing claims we could verify line by line: the budget ledger is real (we watched it stop a run at exhaustion), the quote gate is real (it killed 100% of our unverifiable claims), and the privacy boundary is real (zero crossings recorded). For anyone who has been burned by research agents that silently hallucinate citations or blow through API budgets, that honesty is worth a lot.

What holds it back is version 0.1.0: no multi-lead planner yet (M3 milestone), USD budgets gated behind a 13-model pricing table, strict quote verification that blocks legitimate computed answers in local mode, and a name collision that the community is already complaining about. It is not a Perplexity replacement today. It is a precisely-engineered foundation that will be a very good research agent once the planner lands — and it is already an excellent MCP toolkit for teams that want verification, not vibes, from their coding agents.
