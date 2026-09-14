---
title: "tokentab Review 2026 — The Local-Only CLI That Prices Your AI Coding Sessions"
date: 2026-09-14
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "tokentab"
  - "token-usage"
  - "cost-tracking"
  - "Claude-Code"
  - "Codex"
  - "Gemini-CLI"
  - "Coding"
  - "observability"
  - "Developer-Tools"
  - "Python"
  - "Open-Source"
cover: "/images/reviews/tokentab-review-2026/cover.png"
meta_description: "tokentab (created September 7, 2026, MIT, 852 stars) is a local-only CLI and web dashboard that reads the session logs Claude Code, Codex and Gemini CLI already write to disk and turns them into token counts and dollar costs by model, project, day and kind of work. This review covers the three log formats it parses, the hand-kept pricing table and its fuzzy model matching, the caching fixes that stop double-counting, the standard-library web dashboard on localhost:4747, the heuristic activity classifier, and the honest limits: a single-commit project, unfinished Cursor support, best-effort prices and a 'guess, not gospel' activity signal."
rating: 7.3
dimensions:
  ease-of-use: 8.5
  features: 7.5
  value: 8
  performance: 8
  ecosystem: 5.5
pros:
  - "It answers a question every heavy agent user has and almost nobody measures: what did this week's coding with Claude Code, Codex and Gemini CLI actually cost? tokentab reads the session logs those tools already leave on disk rather than instrumenting them, so there is nothing to configure in the agent, no wrapper to run your commands through, and no change to how you work"
  - "Everything runs locally by design and the privacy story is structural rather than a promise: no account, no API key, nothing leaves the machine, the pricing table is hand-kept precisely so the tool never phones home to add up numbers, and even the web dashboard refuses to pull fonts from a CDN so it works with the network unplugged"
  - "The token accounting is careful about the trap that ruins naive cost tools: Claude splits cache reads and cache writes into separate fields and Gemini reports input including the cached portion, so tokentab pulls cached tokens back out before pricing to avoid charging you twice for the same context"
  - "The dashboard is the same numbers as a monthly statement — totals on top, everything itemised below — served from Python's standard-library HTTP server with no Flask, no framework and no extra install, reading from disk on every request so it never shows a stale cached figure, and binding to localhost only"
  - "Extensibility is genuinely small: each provider is one module exposing a collect() function that returns a flat list of UsageRecord objects, so adding a fourth tool is writing a parser and registering it, and pricing, grouping and the dashboard all work for free because everything downstream touches only that one shared shape"
  - "The README teaches you what to look for instead of just dumping numbers: a cache hit rate under about 80 percent consistently means your context is not stable, a big model dominating cost on lots of tiny calls means you are reaching for the expensive one when a cheaper model would do, and a large 'chat' or 'exploring' share means spend went to reading and talking rather than editing"
cons:
  - "It is one week old and effectively a single commit: created September 7, 2026 at 17:18 and last pushed at 17:20, two minutes later, which means there is no release history, no tag, no CI signal and no track record of maintenance to judge it on — you are adopting this at its very first version"
  - "Cursor support is a stub: the README is upfront that the fourth slot is wired up but not finished, so the tool currently covers Claude Code, Codex and Gemini CLI, which leaves out the many developers whose assistant of record is Cursor"
  - "Prices are best-effort by design and the design has a visible seam: the table is kept by hand in prices.py and a slightly stale number is preferred to a crash, matching is fuzzy so claude-opus-4-6-20260514 still resolves to claude-opus-4-6, and an unmatched model prices at $0.00 — the CLI does say so, but a cost report that can silently understate an unrecognised model is only as good as your willingness to read the warning"
  - "The activity breakdown (coding, debugging, refactor, testing) is a deterministic heuristic based on which tools were used and the wording of the first message in a session; the README calls it 'a hint, not gospel', and it is the kind of number that looks authoritative on a chart while being a guess underneath"
  - "Zero open issues is ambiguous rather than reassuring: for a project this new and this starred, it more likely means few people have filed anything yet than that the parser handles every edge case in three vendors' undocumented, evolving log formats, and log-format drift is exactly the failure mode that kills tools like this quietly"
best-for: "Developers who run two or more agentic coding tools daily (Claude Code, Codex, Gemini CLI) and want a private, local, no-account way to see what they cost by model, project and day — individual engineers and small teams who care more about a fast, dependency-light, offline answer than about an enterprise dashboard, and who can live with best-effort prices and one unfinished provider"
price: "Free and open source (MIT). Clone the repository, run pip install . and then python cli.py (or pip install -e . for an editable install); the only third-party dependency is rich for terminal tables, and the web dashboard uses Python's standard library. There is no hosted tier, no API key and no subscription — the entire cost model is your own machine time."
---

## What tokentab Does

tokentab reads the session logs that Claude Code, Codex, Cursor and Gemini CLI already leave on disk, adds up token usage, and prices it — broken down by model, by project, by day, and by the kind of work each session was doing. It runs entirely locally: no account, no API key, nothing leaves your machine. That sentence is doing a lot of work, and it is the whole product thesis.

The mechanism is the interesting part. Rather than instrumenting the agents, wrapping your commands, or asking an API for usage, tokentab reads what is already there: `~/.claude/projects/**/*.jsonl` for Claude Code, `~/.codex/sessions/**/rollout-*.jsonl` for Codex, and `~/.gemini/tmp/**/session-*.json` for Gemini CLI. Cursor is a wired-up stub. If a tool is not installed, it is simply skipped, so you only ever see the tools you actually use. There is no configuration step inside the agents themselves.

## The Command Line

The bare `python cli.py` gives you the last seven days across everything. From there it is a familiar set of switches: `-today`, `-month`, `-p all` for every session you have ever run, `--provider claude` to isolate one tool, `--project myapp` to isolate one project, `--from`/`--to` for an explicit window, and `--json` to pipe structured output into `jq` or anything else. Colour drops automatically when output is piped, so pasting a cost table into a pull request or a chat does not drag escape codes along with it.

![tokentab's hand-kept pricing table — the tool ships an explicit per-million-token price list rather than calling a pricing API, so it never has to make a network request just to add up numbers](/images/reviews/tokentab-review-2026/pricing.png "The pricing table in prices.py — hand-maintained, fuzzy-matched, deliberately offline")

## The Dashboard and the Accounting

`python cli.py -web` opens `http://localhost:4747` and lays the same numbers out as a monthly statement — total up top, everything itemised below. It reads from disk on every request (the data is tiny, so there is no reason to cache and risk showing something stale), binds to localhost only, and is built on Python's standard-library HTTP server with no framework in sight. It does not even pull fonts from a CDN.

The token math is more careful than most tools of this genre. Every one of these tools records its own token counts per call, so nothing is guessed — but caching is where naive cost tools go wrong. Claude splits cache reads and writes into separate fields, and Gemini reports input *including* the cached part, so tokentab pulls cached tokens back out before pricing, avoiding double-charging for the same context. Prices live in a hand-kept table in `tokentab/pricing/prices.py` in dollars per million tokens, and matching is fuzzy: `claude-opus-4-6-20260514` still finds `claude-opus-4-6`. The design rationale is stated plainly — "a slightly-stale number beats a crash when a vendor renames a model overnight." If a model shows up as `$0.00`, the name did not match anything and the CLI says so rather than quietly counting it as free.

![tokentab's local web dashboard on localhost:4747 — the same figures as the CLI, presented as a monthly statement, served from disk with no external requests](/images/reviews/tokentab-review-2026/dashboard.png "The dashboard: totals up top, everything itemised below, localhost only")

The activity classifier is a deterministic heuristic — which tools were used, and the wording of your first message in a session — with no model calls. The README is candid: "treat it as a hint, not gospel."

## What You Actually Learn

This is the section that makes tokentab more than a meter. The README teaches patterns: a **cache hit under about 80 percent, consistently**, means your context probably is not stable between calls or caching is not switched on (one weird session is nothing; weeks of it is worth a look). **A big model dominating cost on lots of tiny calls** means you are reaching for the expensive one on work a cheaper model would one-shot. **A large "chat" or "exploring" share** means a lot of spend went to talking and reading rather than editing. "These are starting points, not verdicts," it says. "The tool shows you the data: you know what the work actually was."

## Where It Is Weak

The honesty also exposes the seams. tokentab is **one week old and effectively a single commit** — created September 7, 2026 at 17:18, last pushed two minutes later — so there is no release, no tag, no CI history and no maintenance track record. **Cursor is an unfinished stub**, which excludes a large slice of the market. **Prices are best-effort**: an unmatched model prices at zero, and the correctness of your report depends on you reading the warning. And **zero open issues** is ambiguous for a project this new — it likely means few users have filed anything yet, not that three vendors' undocumented, evolving log formats are fully handled, and log-format drift is precisely how tools like this die quietly.

The README even contains a visible typo (`python cli.pyb`) in the usage block, a small reminder that this is a fresh, lightly-polished first release rather than a hardened product.

At **7.3/10** tokentab earns Silver-plus on the strength of a genuinely useful question answered cleanly, a privacy story that is architectural rather than rhetorical, and accounting that avoids the caching double-count most cheap trackers get wrong. It loses ground for being a single-commit week-old tool, for the unfinished Cursor path, and for a pricing table that can understate a model it has never heard of.

## Who Should Care

If you run Claude Code, Codex or Gemini CLI — especially two or more of them — and you have never actually measured what they cost, tokentab is the fastest private answer available: clone it, `pip install .`, and run it in five minutes with nothing leaving your laptop. If you depend on Cursor, or you need prices you can audit against a vendor API, wait for a release or two. As a first-week open-source utility, this is exactly the kind of tool that earns its stars by being small, offline and honest about its guesses.
