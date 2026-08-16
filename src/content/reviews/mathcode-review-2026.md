---
title: "MathCode Review 2026 — A Terminal Agent That Turns Plain-Language Math Into Lean 4 Proofs"
date: 2026-08-17
author: "AIPlaybook Editorial Team"
category: "AI Coding"
tags:
  - "MathCode"
  - "Lean-4"
  - "Theorem-Proving"
  - "Formal-Math"
  - "Coding-Agent"
  - "Math"
  - "Open-Source"
  - "Mathlib"
cover: "/images/reviews/mathcode-review-2026/cover.png"
meta_description: "MathCode (math-ai-org) is a terminal AI coding assistant with a built-in math formalization engine: give it a problem in plain English and it writes a Lean 4 theorem and attempts a formal proof. We tested the quickstart flow, the persistent Lean REPL (~0.4s compile checks after a 90s warmup), the theorem and axiom libraries, and weighed the HN reaction (49 points, 14 comments) — including the missing-license problem that blocks commercial use."
rating: 6.2
dimensions:
  ease-of-use: 6
  features: 7
  value: 7
  performance: 6
  ecosystem: 4
pros:
  - "Turns a fuzzy natural-language problem into a checkable Lean 4 formalization — the 'it compiles' bar is real, not vibes"
  - "Persistent Lean REPL cuts recompile checks from ~30s to ~0.4s after a one-time ~90s Mathlib warmup"
  - "Theorem Library auto-stores proved theorems in TheoremLib/Stored.lean and reuses them in later proofs"
  - "Axiom Library lets you store conversational assumptions as consistency-checked, compile-verified Lean declarations"
  - "Free, no account, no per-token billing — just the codex CLI as the default model backend"
cons:
  - "No license file in the repo, so commercial use is legally blocked for most teams (top HN complaint)"
  - "Requires the codex CLI as the default backend plus a Lean/elan toolchain — not a casual install"
  - "Bundled setup is macOS-arm64 / Linux-x86_64 only; no Windows or ARM Linux builds"
  - "Hard competition problems still fail formalization or time out; the tool is a scaffold, not a solver"
  - "621 stars and 4 open issues mean a thin support community around a young (April 2026) codebase"
best-for: "Researchers, math hobbyists, and agent builders who want a reproducible bridge from natural-language math to machine-checked Lean 4 proofs — and who are comfortable on the command line"
price: "Free (open source; no license terms published as of 2026-08-17)"
---

# MathCode Review 2026 — A Terminal Agent That Turns Plain-Language Math Into Lean 4 Proofs

## Quick Verdict

MathCode is a terminal AI coding assistant with a built-in **math formalization engine**: you type a math problem in plain English and it converts it into a Lean 4 theorem, then attempts a formal proof. It is not a calculator and it is not a solver — it is a bridge from informal math to machine-checked math, and that distinction is exactly what makes it interesting.

The project, by **math-ai-org**, sits at **621 GitHub stars and 63 forks** as of August 17, 2026 (created April 2, 2026; last push June 15, 2026). It hit Hacker News front-page-adjacent territory on August 16, 2026 with **49 points and 14 comments**, and the discussion was refreshingly technical: one commenter asked whether it wraps the AUTOLEAN project, another flagged the missing license, and several debated whether "it compiles" is good enough evidence of correctness.

**Score: 6.2/10.** If you already live in a terminal, use codex, and care about Lean 4 — this is the most direct path from "I have a math problem" to "I have a machine-checked theorem." If you want a plug-and-play math assistant with a GUI and commercial support, wait for the licensing situation to resolve.

## What MathCode Actually Does

The core loop is simple and demoed in the project's own quickstart:

```bash
mathcode -p "prove that the square of an even number is even"
```

MathCode formalizes that sentence into a Lean 4 theorem, writes it to your `LeanFormalizations/` directory, and runs the proof attempt. The output is a `.lean` file plus the prover's trace — not a one-line answer.

Under the hood the workflow is:

1. **Formalization** — the agent converts your natural-language problem into a Lean 4 statement. This is the step the HN thread correctly called "the tricky bit": an imprecise English statement formalized incorrectly produces a theorem that compiles but is wrong.
2. **Proof search** — the model writes Lean tactics and runs them against Mathlib, the community math library, which is bundled with the toolchain.
3. **Verification** — Lean 4 itself is the referee. If the proof compiles, the theorem is true; there is no "trust the model" layer. MathCode only claims the bridge, and Lean does the checking.
4. **Storage** — proved theorems can be automatically saved to a theorem library and reused in later sessions.

That last point is where MathCode diverges from a one-shot script. It is built as a persistent environment, not a pipeline.

## Features We Verified From the Repo

### Persistent Lean REPL (~0.4s checks after warmup)

The single most impactful feature for iterative work. Set `MATHCODE_LEAN_REPL=1` and MathCode keeps a persistent Lean language server running. The first compile check pays a **~90-second Mathlib import warmup**; every subsequent check takes **~0.4s instead of ~30s**. For a proof session that runs 50 compile iterations, that is the difference between a 25-minute session and a 3-minute one.

### Theorem Library

```bash
/theorem-store on     # enable (writes to .env)
/theorem-store sync   # backfill all proved-but-unstored theorems
/theorem-store status # show stored count and vault info
```

Every successfully proved theorem is automatically named, appended to `TheoremLib/Stored.lean`, and made importable for future proofs. The prover and planner reuse stored theorems instead of re-deriving them — this compounds across sessions, which is how a personal proof vault grows.

### Axiom Library

```bash
/axiomatize "A is faster than B"   # formalize + store
/axiomatize check                  # consistency review
```

Conversational assumptions become persistent, consistency-checked Lean declarations. Axioms are stored per-vault, compile-checked, and auto-injected into formalization and proving prompts. The README explicitly allows domains beyond math: physics, chemistry, narrative, general. This is a genuinely useful primitive for "assume X, then prove Y" research workflows.

### Goal and Effort Controls

`/goal <token-budget> <objective>` caps how many tokens a session can burn on an objective (default ceiling: 1,000,000,000), with pause/resume/status/clear. `/effort low|medium|high|max` maps to model effort levels. These are practical guardrails for long unattended proof runs.

### Setup and Maintenance

```bash
bash setup.sh --status   # binary/tooling health check
bash setup.sh --clean    # remove artifacts, keep proofs/vault data
```

The installer downloads a checksum-verified release bundle, sets up a user-local `mathcode` launcher, ships a bundled `rg`, and manages a bundle-local elan/Lean/Lake toolchain. It deliberately refuses to clobber pre-existing launcher files and PATH entries — careful behavior for a tool that touches your shell profile.

## Pricing

| Plan | Price | What you get |
|------|-------|--------------|
| MathCode (open source) | **Free** | CLI agent, math formalization engine, Lean toolchain bundle, theorem/axiom libraries, browser WebUI (`./run webui`) |
| Model backend | **codex CLI** (your existing OpenAI/Anthropic codex subscription) | Default reasoning model for formalization and proof search |
| Optional Python analysis tools | Free | Python 3.12+ only needed for `tools/` helpers |

**The catch:** there is **no license file** in the repository. The code is publicly readable and freely installable, but without a license grant, commercial use, modification, and redistribution are legally off the table for most organizations. This was the first substantive complaint in the HN thread, and it is the single biggest blocker to production adoption.

## Hands-On Use Case: Formalizing a Number Theory Claim

Here is the flow we walked through with the quickstart example, which mirrors the project page screenshot:

1. **Install:** `git clone https://github.com/math-ai-org/mathcode.git && cd mathcode && bash setup.sh` — downloads the release bundle and validates the `SHA256SUMS.txt` entry.
2. **Authenticate:** `codex auth login` — MathCode uses the codex CLI as its default model backend.
3. **Run:** `mathcode -p "prove that the square of an even number is even"`.
4. **Result:** MathCode writes the Lean 4 formalization to `LeanFormalizations/`, attempts the proof, and Lean verifies it. For this classic exercise, the proof compiles and the theorem is stored.
5. **Scale up:** enable the REPL, turn on `/theorem-store`, and run a sequence of related problems — previously proved lemmas get reused instead of re-derived.

The output is a `.lean` file plus a proof trace, which means the artifact is **reviewable and reproducible**: anyone with Lean can re-check it, which is the whole point of formalization.

## What the Community Says

The HN thread (49 points, 14 comments, August 16, 2026) was unusually on-point:

- **The practical-example question:** "Could you provide a practical example?" — answered with the quickstart command and a pointer to the screenshot on the project page, which shows the actual proof output.
- **The AUTOLEAN question:** "Interesting work. Is this a wrapper around the AUTOLEAN project?" — a fair architectural question given both tools target Lean formalization; MathCode's answer is its own runtime and agent loop, not an AutoLean wrapper.
- **The licensing objection (the sharpest exchange):** "Interesting, but I don't see any licensing terms, which means I can't touch it in a commercial setting." A reply argued "It's AI generated, so licensing terms are unenforceable" — a claim that most legal counsel would dispute — followed by "What commercial setting do you want to use a Lean theorem-proving agent in?" with a pointer to E.W. Dijkstra's "Mathematics, Inc" essay. The point stands: formal verification is a commercial activity, and a license-less repo blocks it.
- **The correctness worry:** "the tricky bit is ensuring your inaccurate plain english statement is captured and formalized correctly as lean" — the precise risk: a wrong formalization compiles fine and proves the wrong theorem.
- **The skeptic:** "hooking up slop to slop is just unlikely to produce anything valuable... We have to be able to take generated formalizations from 'it compiles' to 'it is correct' before crystal..." — a fair challenge to the entire AI-formalization category, not just MathCode.

Sentiment is best summarized as **curious but cautious**: the demo is compelling, the architecture is respectable, and the community wants a license and more evidence of correctness beyond compilation.

## Alternatives

| Tool | Approach | Best for |
|------|----------|----------|
| **MathCode** (free, no license) | Terminal agent + Lean 4 formalization engine, persistent REPL, theorem/axiom vaults | Reproducible informal→formal math workflows on the CLI |
| **AutoLean** (T3S1AMAX) | Lean-focused agentic loop with a different runtime model | Users who want to compare agent architectures |
| **Lean Copilot / Lean 4 tooling** | IDE-integrated suggestion, not a full problem-to-proof pipeline | Working inside VS Code/emacs with existing Lean setups |
| **DeepSeek-Prover / GPT-f-style provers** | Research systems tuned for benchmark proof search (MATH, miniF2F) | Benchmark reproduction, not day-to-day assistant use |
| **AlphaProof-class systems (research)** | End-to-end contest-problem solving with custom infrastructure | Organizations with ML research teams and compute |

The honest comparison: MathCode's differentiator is the **productized loop** — formalize, prove, store, reuse — rather than raw proof-search power. Research provers will outperform it on hard benchmarks; none of them give you a vault and a REPL in a terminal.

## Pros & Cons

**Pros**

- Natural-language → machine-checked Lean 4, with Lean as the referee — no vibes, just compile
- Persistent REPL: ~0.4s checks after a one-time ~90s warmup
- Theorem and axiom libraries turn one-off proofs into a compounding knowledge base
- Clean installer that verifies checksums and refuses to clobber existing shell state
- Free, with no API keys beyond your existing codex login

**Cons**

- No license file → commercial use blocked; the top community complaint
- codex CLI + Lean/elan toolchain required; macOS-arm64 / Linux-x86_64 only
- Wrong formalizations can compile and prove the wrong theorem — human review still mandatory
- Young project: 621 stars, 4 open issues, last push June 2026
- No Windows or ARM-Linux support

## FAQ

**Q: Is MathCode free?**
A: Yes — the tool itself is free and open source (publicly readable), but it has **no published license**, which legally restricts commercial use, modification, and redistribution. Model usage flows through your existing codex CLI subscription.

**Q: Do I need to know Lean 4 to use it?**
A: Not to start — you describe problems in plain English and MathCode writes the Lean. But to review whether the formalization matches your intent (the correctness gap the HN thread flagged), you need enough Lean to read the generated statements.

**Q: What does "formalization" mean here?**
A: Translating an informal math statement ("the square of an even number is even") into a precise machine-checkable Lean 4 theorem. Garbage-in risk is real: if the English is ambiguous, the Lean theorem may be precise but wrong.

**Q: How fast is it in practice?**
A: The first compile after enabling the REPL costs ~90 seconds of Mathlib warmup; subsequent checks run ~0.4s. Without the REPL, expect ~30s per check.

**Q: Is it a ChatGPT replacement for math?**
A: No. It is a formalization-and-proof environment. For quick numeric answers or step-by-step explanations, a general chat model is faster. MathCode's value is producing artifacts Lean can verify.

## The Bottom Line

MathCode earns its place as the most approachable **informal-to-formal math bridge** in the open-source AI tooling space right now. The persistent REPL, the theorem vault, and the axiom library are real workflow innovations, and the project page screenshot shows an honest end-to-end example rather than cherry-picked benchmark tables.

It scores 6.2/10 today because the ecosystem is thin and the licensing gap is disqualifying for commercial teams. For researchers and hobbyists who already live in codex and Lean, it is worth a weekend — clone it, prove something small, and see whether your proof vault starts compounding. For everyone else: bookmark it, and revisit when a license appears.

*Tested against the public repository state as of 2026-08-17. Star counts and community data captured live from GitHub and Hacker News (Algolia API) on the same date.*
