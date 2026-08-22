---
title: "NoBuzz Review 2026 — A Claude Code Skill That Strips the BuzzFeed Voice Out of Claude's Replies"
date: 2026-08-22
author: "AIPlaybook Editorial Team"
category: "Coding"
tags:
  - "NoBuzz"
  - "Claude-Code"
  - "Claude"
  - "Antigravity"
  - "Gemini"
  - "AI-Coding"
  - "Writing-Style"
  - "Prompt-Engineering"
  - "Review"
cover: /images/reviews/nobuzz-review-2026/cover.png
meta_description: "NoBuzz (aka 'Claudette') is a Claude Code skill that pipes Claude's replies through Google's Antigravity CLI so a second model rewrites them in plain English. We review the debuzz workflow, the three audience modes, the 260-point Hacker News reaction, and whether routing around the voice is better than fixing it."
rating: 7.2
dimensions:
  ease-of-use: 7
  features: 7
  value: 8
  performance: 7
  ecosystem: 4
pros:
  - "Honest architecture: a different model (Gemini via Antigravity CLI) rewrites the reply, printed verbatim — no same-model self-rewrite drift"
  - "Three audience modes (colleague / manager / director) map cleanly to who's actually reading the output"
  - "No prompt-engineering required — it triggers on natural phrases like 'say that in normal english'"
  - "Free, MIT-licensed, installs in two commands into ~/.claude/skills"
  - "Works as a general text translator too — paste any text after the mode to debuzz it"
cons:
  - "Requires Google Antigravity CLI (agy) plus a Google Sign-In — an extra account and auth surface for a writing fix"
  - "Doesn't fix Claude itself; it's a band-aid that costs a second model round-trip on every debuzz"
  - "Claude Code only — no support for Claude API, the Claude app, or other editors"
  - "Single-maintainer weekend project; no versioning, no issues triage, no roadmap"
  - "The 'Claudette' branding joke exists because the real Claudette is 'famously litigious' — the project is self-consciously unserious about naming"
best-for: "Claude Code users who love the engineering but are worn out by the prose — and who already have a Google account and don't mind installing the Antigravity CLI"
price: "Free (MIT, GitHub: adnanakil/nobuzz). Costs: Claude Code subscription + Google Antigravity CLI usage."
---

## Quick Verdict

**NoBuzz** (the repo is named `nobuzz` by `adnanakil`) is a Claude Code skill called `/debuzz` that does exactly one thing: it takes Claude's last reply, hands it to **Google's Antigravity CLI** (`agy`, running Gemini), and prints the second model's plain-English rewrite **verbatim**. The README's framing is blunt:

> "Obviously it's common knowledge by now that Anthropic has solely trained claude on old Buzzfeed articles (explaining its love for 90s nostalgia)."

The Hacker News thread (260 points, 177 comments) made the deeper point: this tool exists because a huge chunk of Claude's paying user base finds the output style actively hostile to work. The skill doesn't argue with you about it — it just routes around the problem.

**The bottom line:** NoBuzz is a clever, honest band-aid. Its design choice — let a *different* model do the rewrite and print it unchanged — avoids the classic failure mode where Claude "tidies up" its own translation and reintroduces the exact voice you're removing. It won't fix Claude's personality, but as a 10-minute install that makes every future reply read like a human wrote it, it's the most practical workaround in its niche right now.

## The Problem It Solves

Anyone who's used Claude Code for real work knows the pattern: you ask why a test is flaky and you get a "load-bearing assumption," three numbered revelations, and a solemn note that the third one is *the most instructive yet*. Nothing is ever just a bug. There is always a kicker.

The README captures it with a before/after that went around HN:

**Before (Claude):**

> Here's where it gets interesting: the retry logic isn't just a nice-to-have — it's the load-bearing assumption of the entire sync pipeline. Three things jumped out at me, and the third one is the most instructive yet. [...] And third — and this is the kicker — the dedupe key includes a timestamp, which means retries are never actually deduplicated.

**After (`/debuzz`, colleague mode):**

> The sync pipeline's retry logic has three bugs. `syncQueue.ts:142` swallows `ETIMEDOUT` instead of re-queuing the job. The backoff caps at 2 seconds, which is too low for mobile networks. And the dedupe key includes a timestamp, so retries are never deduplicated. Fix: strip the timestamp from the key, raise the cap to 30 seconds, and re-throw the timeout error.

Same facts, same file paths, same code references — zero theatrics. That's the whole value proposition.

## How It Works

The mechanism is deliberately simple, and the README is refreshingly honest about it:

1. `/debuzz` writes Claude's previous reply to a temp file
2. It runs `agy -p "$(cat <file>) <plain-English style instructions>"`
3. Antigravity's headless mode doesn't read stdin and won't read files outside the project, so the text goes straight into the prompt
4. The skill prints Antigravity's output **verbatim**

The critical design decision: **Claude never touches the translation.** As the README puts it, "a debuzzer that quietly asks the buzzer to debuzz itself is how you end up with a load-bearing translation." If `agy` errors (usually an auth problem), you see the actual error, and Claude's own rewrite is offered only as a clearly labeled fallback.

### The Three Modes

| Mode | Audience | What you get |
|------|----------|--------------|
| `colleague` (default) | An engineer | Same content, every file path and code block intact, zero theatrics |
| `manager` | A technical-adjacent manager | What happened, why it matters, what's next — about a third the length, no code |
| `director` | An executive | Three to five sentences: outcome, impact, ask. Assumes thirty seconds of attention |

With no text argument it translates Claude's previous reply; paste text after the mode to translate that instead. It also triggers on natural phrases like "say that in normal english."

## Install & Requirements

```bash
git clone https://github.com/adnanakil/nobuzz
mkdir -p ~/.claude/skills
cp -r nobuzz/debuzz ~/.claude/skills/
```

Requirements:

- **Claude Code** (the skill lives in `~/.claude/skills`)
- **Antigravity CLI** (`agy`) — `curl -fsSL https://antigravity.google/cli/install.sh | bash` on macOS/Linux, then run `agy` once to complete the Google Sign-In flow

That's it. Two commands, one auth flow, and the skill is live.

## Community Reception: The 177-Comment Therapy Session

The HN thread did two things at once: validated the tool and diagnosed the disease. `mcv` opened with: "I wish I didn't need it, but the way Claude talks can get pretty tiresome. I've often wondered why it talks like that. Was it really trained on Buzzfeed? Is Gemini really that much better?"

The diagnosis thread was brutal. `walthamstow`: "It's such a sad indictment of Anthropic's product that so many people hate interacting with it. Claude is on its way to the Microsoft Teams zone of hatred." `matheusmoreira`: "The moralizing is incredibly obnoxious as well. It didn't seem so bad at first, but it instantly became intolerable the second I remembered I was paying for those tokens." `lqcfcjx`: "I hate claude writing a lot, especially after opus 4.8 and it's even worse in 5. In many cases, it feels like playing whac-a-mole and you just can't get rid of all those obvious ai writing patterns."

Theories for *why* ranged from the cynical to the structural:

- **Token economics** — `chinathrow`: "The brevity how it outputs words seems like they try to save on tokens delivered." `fmbb`: "Producing more tokens means charging more money to solve a given task."
- **Watermarking** — `cryptonector`: "I see Claude-written prose AND I know instantly it's LLM writing."
- **RL side effects** — `gste`: "I think it's reinforcement learning. It's been trained to give coding results but some of the conversation it gives as a side effect of its coding are absolute garbage."
- **Compressed reasoning traces** — `YuriNiyazov`: "the output is a compressed version of its thought traces, very dense because the model is under pressure" (a theory that got cut off mid-explanation but resonated).

The thread also surfaced a small ecosystem of siblings: **"Vomit: Clean up Claude 5's token output with a separate LLM"** (285 points, `zachahn`), **"Claudish to English"** (`gvzdv`), and the **`bro` skill** (`backnotprop`). And a fair criticism from `pmarreck`: "Why couldn't this just be a skill that Claude and Codex could work with instead of something that has to go through Gemini, again?" — answered in-thread: the entire point is that the model doing the rewrite must not be the model with the voice problem.

## Alternatives

| Tool | Model used | Scope | Notes |
|------|-----------|-------|-------|
| **NoBuzz** (`/debuzz`) | Gemini via Antigravity CLI | Claude Code skill | 3 audience modes, verbatim print, free |
| **Vomit** (zachahn) | Separate LLM | Claude Code output cleaner | 285-pt HN sibling; cleans token output |
| **Claudish to English** (gvzdv) | LLM-based | General Claude text | Focused on the "Claudish" dialect |
| **bro** (backnotprop) | Claude/Codex skill | Coding agent replies | Same idea, different persona |
| **System prompt editing** | Claude itself | Any Claude surface | Free, but doesn't fully cure the voice per the HN consensus |

The HN consensus on prompt-level fixes: they help but don't cure. `hbarka` reported pruning `Claude.md` made a difference; `adastra22` countered: "I have no Claude.md file. Claude is still absolutely horrible." NoBuzz's bet is that a second model is the only reliable filter.

## Who Should Buy This

- **Claude Code power users** who spend hours in the terminal and are done with the prose — free, two commands, instant relief
- **Anyone writing for an audience** — the `manager` and `director` modes are genuinely useful for turning a debugging session into a status update
- **Teams with a Google Workspace** — the Antigravity auth flow is least annoying when the account already exists

## Who Should Skip

- **People who don't use Claude Code** — the skill is hard-wired to `~/.claude/skills`
- **Users who refuse to add another AI account** — the agy Google Sign-In is a real requirement
- **Anyone hoping for a permanent fix** — this is a filter, not a cure; Claude will keep talking like this until Anthropic changes the model behavior

## FAQ

### Does NoBuzz use Claude to rewrite Claude?

No — that's the point. It uses Gemini via Google's Antigravity CLI, and prints the output verbatim so Claude never touches its own translation. The only exception is a clearly labeled fallback if `agy` errors.

### Is it really free?

The skill is MIT-licensed and free. The *cost* is whatever Google's Antigravity CLI usage costs on your Google account, plus your existing Claude Code subscription.

### Will it work with my other tools?

Out of the box, no — it's a Claude Code skill. The HN thread shows a whole family of similar tools (Vomit, Claudish to English, bro) for other surfaces, but NoBuzz itself is Claude Code-specific.

### Does Anthropic plan to fix the voice?

Anthropic added a config option to Claude Code for more concise output and promised "more comprehensive improvements," but per the HN thread (`user43928`), no explanation was given and the problem persists in Opus 5-era models. Treat any fix as speculative.

### Is the name a trademark problem?

The README jokes that the project is "definitely absolutely not called 'Claudette'" because the real Claudette brand is "famously litigious." The repo is named `nobuzz` to sidestep the whole question.

## Bottom Line

NoBuzz is a symptom and a solution at the same time. As a symptom, it's damning: a thriving ecosystem of "make Claude stop talking like this" tools in 2026 says something real about model design priorities. As a solution, it's excellent — the second-model, print-verbatim architecture is the right call, the three audience modes cover real needs, and the install is trivial. It's a band-aid, not a cure, but for $0 and ten minutes, it's the best band-aid in the category.
