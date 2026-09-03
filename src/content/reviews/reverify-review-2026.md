---
title: "reverify Review 2026 — A Lie Detector for AI Reverse Engineering That Checks Every Claim Against the Real Bytes"
date: 2026-09-04
author: "AIPlaybook Editorial Team"
category: "Security"
tags:
  - "reverify"
  - "Reverse-Engineering"
  - "Binary-Analysis"
  - "AI-Agents"
  - "MCP"
  - "Claude-Code"
  - "Cursor"
  - "Hallucination"
  - "Verification"
  - "Capstone"
  - "Unicorn"
  - "Open-Source"
cover: "/images/reviews/reverify-review-2026/cover.png"
meta_description: "reverify is an MIT-licensed Python toolkit (created 2026-08-31, 740+ stars and a remarkable 152 forks in four days) that stops AI agents from hallucinating when they read binaries. The model proposes; a deterministic PE/ELF/Mach-O toolkit decides — every claim about offsets, structs, instructions or behavior is checked against the actual bytes and returned as VERIFIED, REFUTED or INCONCLUSIVE with evidence. On 19 real Windows system files the repo's reproducible benchmark caught the AI's textbook answer 100% of the time with zero false alarms. It ships as a CLI and an MCP server for Claude Code and Cursor, adds information-weighted scoring so 'grounded' means informative rather than trivially true, and since v0.8.0 keeps a per-binary ledger of verified and refuted facts that survives context compaction. This review covers the verification loop, the version history (v0.3–v0.8 in four days), the honest limits, and who should use it."
rating: 7.5
dimensions:
  ease-of-use: 7
  features: 8
  value: 7.5
  performance: 8
  ecosystem: 7
pros:
  - "A genuinely different answer to AI hallucination: instead of trying to make the model more careful, reverify makes a deterministic pure-Python RE toolkit the judge — a claim about a binary is only reported after the tools verify it against the real bytes, so confidence never substitutes for evidence"
  - "Reproducible proof it works: on 19 real Windows system files the README's benchmark shows the AI's textbook answer was wrong 100% of the time and reverify caught every one with zero false alarms; EXAMPLE.md walks a full kernel32.dll run with no API key and no specific model"
  - "Grounded means informative, not merely unrefuted: claims are scored with information weight measured from the binary itself (frequency × entropy), so restating the fact sheet, echoing the tools' own output, or asserting ubiquitous prologues weighs ~zero — a CORE-style refinement of FActScore, with the verifier (not model confidence) selecting among sampled reconstructions"
  - "Agent-native by design: ships as an MCP server (re_verify_claim, re_ledger) so Claude Code, Cursor and other harnesses call the tools directly, plus a plain CLI; a refuted claim returns the bytes that actually are there, and behavior_equiv runs the original function and a candidate over shared inputs to return a concrete counterexample"
  - "Fast-moving but versioned engineering: v0.3 added capstone/unicorn/lief as optional in-place upgrades, v0.4 hardened the loop against gaming plus a testbed that cross-checks the pure readers against real engines and fuzzing, v0.5 added behavioral equivalence, v0.6 a two-stage observe-then-hypothesize loop, v0.7 a Z3 proof tier (proven > tested > observed), v0.8 a durable per-binary ledger with negative memory — 196 unit tests"
  - "The v0.8 ledger solves context loss for a grounded loop: what the tools verified, observed, proved and refuted is checkpointed to .reverify/ledger/<sha256>.json after every round, restored after /clear, auto-compaction or restart, and refutations come back as KNOWN FALSE so a fresh context never re-proposes the same wrong prior"
cons:
  - "Four days old at review time (created 2026-08-31, v0.3→v0.8 shipped within days): the claim vocabulary and CLI are still moving fast, and it is a solo project — 22 commits from one maintainer, one watcher, four open issues"
  - "It verifies what its claim kinds can express: bytes, patterns, strings, instructions, emulation results, protobuf fields, imports/exports and behavioral equivalence — it does not make an agent's free-form narrative about a binary trustworthy, only its tool-checkable hypotheses"
  - "The loop needs a capable model as proposer and a human/agent loop to drive reconstruct; EXAMPLE.md is model-agnostic but the value you get tracks the agent you plug in"
  - "Pure-Python core is deliberately minimal (no Ghidra), and the mature engines are optional extras you must install with reverify[full]; several commands (emulate, decode-protobuf, gen-hook) are micro-tools rather than full analysis"
  - "Positioned strictly for authorized reverse engineering — malware analysis, CTF, interoperability and your own software — with a defensive audit-boundary command, so red-team use cases need your own authorization story"
best-for: "Security researchers, malware analysts, CTF players and dev-tool builders who want AI assistance on binaries without the confident lies — especially teams running Claude Code or Cursor on RE tasks who can wire the MCP server in as the ground-truth judge, and anyone who has watched an agent invent offsets and structs and wants the bytes to decide"
price: "Free, MIT, open source (Python, PyPI: pip install reverify). The deterministic core is pure standard library; pip install reverify[full] adds capstone, unicorn and lief. No API key required for the toolkit — you bring the model/agent of your choice"
---

## The Pitch: The Model Proposes, the Bytes Decide

Ask a language model to reverse-engineer a binary and it will make things up — offsets, struct sizes, what a function does — and say it with total confidence. That is the problem reverify starts from, and its diagnosis is sharper than most: in binary analysis the hallucination problem is *worse* than in source code, because there is no compiler or type system quietly enforcing reality, and "did the model just make that up?" is the single biggest blocker to using AI for real RE work.

The answer is not a better model. Reverify, created August 31, 2026 by solo maintainer `2akouwu`, pairs whatever model you already run with a **deterministic, pure-Python RE toolkit**, and makes the toolkit the judge. A hypothesis about a structure or algorithm is only reported once it has been checked against the actual bytes — disassembled, pattern-matched, or executed in the emulator. The tagline is the whole thesis: *"The AI proposes. The bytes decide."* In four days it drew 747 stars and a strikingly high **152 forks** — a ~20% fork rate that signals teams are cloning it to build on, not just bookmarking it.

## The Verification Loop: VERIFIED, REFUTED, INCONCLUSIVE

The core primitive is a **claim**: any hypothesis about the binary. `reverify verify` hands the claim to the deterministic tools, which return `VERIFIED`, `REFUTED` or `INCONCLUSIVE` together with the bytes they actually observed. Claim kinds cover typed reads (`bytes_at`, `u32_at`), `pattern_present`, `string_present`, `instructions` (mnemonics and optionally operands), `emulate_result`, `protobuf_field`, and import/export/section presence. Offsets default to file offsets but can be declared as `rva` or `va`; the verifier translates through the section table and echoes all three address spaces in the evidence, and a refuted `bytes_at` reports where the expected bytes actually are.

Two details make the loop trustworthy rather than theatrical. First, **observe mode**: set `"observe": true` (or omit `expected`) and the tools *read* a value instead of asserting one, so the model can build facts from what the binary says. Second, **dependencies**: `"depends_on": [...]` means a refuted root claim invalidates everything built on it. Claims can be batched from a JSON file, and the CLI exits non-zero if anything is refuted — so an agent loop or CI job can hard-gate on a grounded reconstruction.

The worked example in `EXAMPLE.md` shows the pattern on real `kernel32.dll`. The model sees only the fact sheet (format, arch, sections, imports, strings, entry RVA) — not the entry-point disassembly. From priors it proposes the textbook `push rbp; mov rbp, rsp; sub rsp, N` prologue. Refuted. The verifier returns what is actually there: `mov qword ptr [rsp + 8], rbx; push rdi; sub rsp, 0x20; mov edi, edx; mov rbx, rcx` — the real MSVC x64 prologue. Round two, the model corrects from the evidence: 3/3 verified, information weight 1.236, `Trustworthy: True, Grounded: True`. The run needs no API key and no specific model.

## Grounded Means Informative — and the Anti-Gaming Story

"Every claim verified" is trivially reachable: assert the file starts with `MZ` and that `.text` exists. So reverify weighs how much a verified set actually *says*. Each result carries a **weight** — zero for claims that merely restate the fact sheet the model was shown, for duplicates, for inline code that does not occur in the binary, and for echoes of the tools' own previous output. Otherwise the weight is measured from the binary itself: how often the expected content occurs in this file and how much entropy it has. Zero padding, a ubiquitous prologue, or a pattern that matches everywhere weigh almost nothing even though they verify; emulation must execute non-degenerate code. A reconstruction is grounded only when nothing is refuted *and* the verified weight clears `--min-information` (default 1.0). The README credits this explicitly to the CORE refinement of FActScore: credit only claims that are factual, informative and non-repetitive. `reverify reconstruct --samples N` draws several proposals per round and lets the verifier — not the model's confidence — select among them.

That anti-gaming posture is backed by a real testbed. v0.4.x cross-checks the readers themselves: the pure parser against lief on real binaries, the disassembler and emulator against capstone and Unicorn and known-answer vectors, plus fuzzing. The verifier is not just trusted; it is checked — 196 unit tests at last count.

## The Ledger: State That Survives a Context Reset

Every agent harness compacts context the same way: the model summarizes the transcript, the rest is dropped, and repeated compactions degrade accuracy. Reverify argues that loss is unavoidable for free-form conversation — nothing in a transcript says which parts were *state* and which were chatter — but its own loop draws that line already. The only things that matter are what the tools verified, observed, proved, and refuted; the model's prose was never trusted, so dropping it loses nothing.

Since v0.8.0 that state is written to disk as it happens: a content-keyed `.reverify/ledger/<sha256>.json` per binary, checkpointed after every round, so a crash, a `/clear`, an auto-compact or a new process all resume from the same grounded position. Refutations come back as `KNOWN FALSE` — negative memory, the part a summary usually drops. In context the view is bounded (the most recent proof-grade facts pinned, a deterministic ladder trimming the shown fact sheet to `--prompt-budget` characters — kernel32's 43k chars fit a 20k budget with section table, entry point and header intact), while scoring still uses the full sheet so hiding a fact never makes restating it profitable. A Claude Code `SessionStart` hook (`reverify ledger --hook`) injects one index line per binary, and over MCP the `re_ledger` tool hands the facts back after the host compacts or clears.

## MCP Server, Toolkit Commands, and the Strength Ladder

Reverify is agent-native by design: `python reverify/mcp_server.py` exposes the toolkit over MCP so Claude Code, Cursor and others can parse, disassemble and scan binaries directly, with `re_verify_claim` letting an agent have its own hypotheses judged before it reports them. The CLI alone is a compact RE kit: `auto` triage, `parse`/`parse-pe` for PE/ELF/Mach-O, `disasm`, `pattern-scan` with `??` wildcards, `strings` with offsets, `emulate`, schema-less `decode-protobuf`/`decode-tlv`, Frida hook generation, `hexdump`, `diff-patch`, and a defensive `audit-boundary` command for filesystem/SSRF boundary audits. `reverify backends` shows which engines are active.

The version history is itself the architecture story, compressed into four days: v0.3.0 brought the mature engines, v0.4.x hardened against gaming, **v0.5.0** added `behavior_equiv` — run the original function and a candidate reconstruction over shared inputs and compare outputs, returning a concrete counterexample on mismatch (the ExeBench/LLM4Decompile re-executability methodology) — v0.6.0 made the loop two-stage (observe, then hypothesize) with an established-facts ledger so the model can't build on its own earlier guesses, and **v0.7.0** added a proof tier: `prove_equiv` uses Z3 to prove two expressions equal for *all* inputs, verifying MBA deobfuscation. That gives an honest strength ladder — proven > tested > observed — which is the right way to think about what any AI RE tool actually guarantees.

## Honest Limits and Who It's For

Reverify is four days old, solo-maintained, and version-churning — the CLI and claim vocabulary may shift under you, and long-session hygiene is still being bound (v0.7.1). It verifies what its claim kinds can express, not everything the model says; your free-form narrative about a binary stays unverified. The value tracks the agent you plug in as proposer, and the mature-engine tier is an explicit optional install. It is also positioned strictly for authorized RE — malware analysis, CTF, interoperability research and software you own or are permitted to analyze.

For security teams and CTF players who have watched an agent confidently invent offsets, reverify is the most concrete grounding mechanism to appear in the open-source RE tooling space this week — and its fork rate says the community agrees. If you want a model to *read* binaries with you rather than *fantasize* about them, this is the tool to wire into your agent next.
