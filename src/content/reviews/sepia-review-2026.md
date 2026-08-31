---
title: "sepia Review 2026 — De-AI Writing Skill That Repairs Narrative Architecture, Not Just Word Choice"
date: 2026-08-31
author: "AIPlaybook Editorial Team"
category: "Writing"
tags:
  - "sepia"
  - "AI-Writing"
  - "Humanizer"
  - "Agent-Skills"
  - "Claude-Code"
  - "Codex"
  - "Grok-Build"
  - "Writing-Style"
  - "Narrative"
  - "Open-Source"
cover: /images/reviews/sepia-review-2026/cover.png
meta_description: "sepia is an MIT-licensed, research-grounded De-AI writing skill for Claude Code, Codex, Grok Build, and Antigravity that fixes the layer that actually gives AI writing away: narrative architecture. Backed by the StoryScope study (61,608 stories — narrative-structure features alone detect AI fiction at 93.2% macro-F1, while surface-style edits barely move it), sepia runs a three-pass protocol — architecture, discourse flow, surface style — with a 30-feature diagnosis rubric, per-model fingerprint corrections, and domain rule files for release notes, PR replies, postmortems, tickets, and technical articles. 918 stars in three days."
rating: 7.6
dimensions:
  ease-of-use: 7
  features: 8
  value: 8
  performance: 7.5
  ecosystem: 7
pros:
  - "Evidence-driven instead of folklore: the StoryScope study (arXiv:2604.03136, 61,608 stories from humans plus five frontier LLMs) showed a classifier using narrative-structure features alone detects AI fiction at 93.2% macro-F1 — and that editing surface style barely moves detection (95.5% → 93.9%). sepia attacks the architecture, not the adjectives"
  - "It names the actual tells: themes explained by the narrator, single-track causally-tidy plots, emotions rendered only as bodily sensation, no real-world references, no reader, linear time, endings resolved by protagonist growth and acceptance"
  - "A real protocol, not a prompt: three passes (narrative architecture → discourse flow → surface style), a 30-feature diagnosis rubric, and per-model fingerprint corrections for Claude, GPT, Gemini, DeepSeek, and Kimi"
  - "Professional prose gets its own rules: release notes (user impact first, artifacts per claim), PR/issue replies (answer first, cite file:line, no reflex praise, length ∝ stakes), postmortems (blameless toward people, merciless toward mechanisms), tickets (title = outcome, testable acceptance criteria), technical articles (one real dead end, one committed opinion, numbers with conditions)"
  - "Calibration principle is sound: 'calibrate to the human distribution, don't invert the AI one' — the skill selects 3–5 moves per story and leaves slack, explicitly avoiding a new uniform 'sepia' fingerprint from over-application"
  - "Truly portable: one canonical SKILL.md following the Agent Skills standard, packaged as plugins for Claude Code, Codex, Grok Build, and Antigravity, with four operations (write, review, refactor, recreate) and a research/ folder digesting 12+ cited studies"
cons:
  - "Value depends entirely on the host agent: sepia is a skill, so output quality tracks the Claude Code / Codex / Grok Build / Antigravity model doing the rewriting — it can't fix a weak writer underneath"
  - "The 30-feature rubric and three-pass protocol take real judgment to apply; a rushed pass that applies every rule produces exactly the uniform-fingerprint failure mode the project warns about"
  - "No detector-evasion guarantee — and it's not the goal: the project is about narrative architecture and human-distribution calibration, and using any humanizer to defeat AI detectors raises academic-integrity questions the README doesn't engage with"
  - "Per-model fingerprint corrections are heuristic mappings, not per-model measured evaluations — reasonable starting points, but unvalidated for any specific model version"
  - "Heavy evidence base: the research/ digests are genuinely useful but dense, and non-English documentation currently exists only in Traditional Chinese (README.zh-TW)"
  - "Very young project (created August 28, 2026, 918 stars in three days) with a single canonical maintainer's voice shaping all four operations"
best-for: "Writers and technical communicators who produce long-form fiction or professional prose inside AI coding agents and want a research-grounded, multi-pass revision protocol — especially those writing release notes, postmortems, PR replies, or technical articles that must not read like chatbot output"
price: "Free, MIT-licensed; runs as an Agent Skill inside Claude Code, Codex, Grok Build, or Antigravity (your existing agent subscription/API costs apply)"
---

## Why "Another Humanizer" Is the Wrong Frame

Every popular AI-humanizer edits word choice and syntax: swap the clichés, break up the sentence templates, vary the vocabulary, adjust the register. sepia (repo `Nanako0129/sepia`, MIT, created August 28, 2026 — **918 stars in three days**) makes a specific, research-backed argument that this is working on the wrong layer.

The load-bearing evidence is **StoryScope** (Russell et al., arXiv:2604.03136): a corpus of **61,608 stories** written by humans and five frontier LLMs, used to train a classifier that distinguishes them. The result that drives sepia's design: a classifier using **narrative-structure features alone** detects AI fiction at **93.2% macro-F1** — and editing the surface style away barely moves it (**95.5% → 93.9%**). The tells that survive surface edits are *architectural*: themes explained by the narrator, single-track causally-tidy plots, emotions rendered only as bodily sensation, no real-world references, no reader, linear time, endings resolved by protagonist growth and acceptance.

> "De-AI writing at the layer that actually gives AI away." — sepia README

So sepia's answer to "another humanizer?" is: *the others fix the words; this fixes the structure that makes the words a giveaway in the first place.*

## The Protocol: Three Passes, Four Operations, One Rubric

sepia is a portable **Agent Skill** (per the [Agent Skills specification](https://agentskills.io/specification)) — one canonical `SKILL.md`, no per-platform forks — installable as a plugin in **Claude Code, Codex, Grok Build, and Antigravity**, with four operation entries: **write** (create new prose), **review** (diagnose only, no edits), **refactor** (minimal in-place edits), and **recreate** (full rewrite from source facts and intent).

The writing/revision protocol is a three-pass stack, each pass targeting a different layer:

| Pass | Layer | Example moves |
|---|---|---|
| 1 | **Narrative architecture** (fiction) | stop explaining the theme, loosen the causal chain, back-load revelations, mix emotion modes, sparse character networks, name real things |
| 2 | **Discourse flow** | de-template the paragraph-question sequence, fix the mid-story sag, vary rhythm and positions |
| 3 | **Surface style** | the classic layer: clichés, syntax templates, vocabulary, register |

Sitting on top is a **30-feature diagnosis rubric** and **per-model fingerprint corrections** for Claude, GPT, Gemini, DeepSeek, and Kimi — the idea being that each model family has its own detectable defaults, so the fix should be model-aware.

## Professional Prose Fails Differently — So It Gets Its Own Rules

sepia's most distinctive feature is that it doesn't treat all writing the same. The research base (12+ digested studies, including LAMP, *Measuring AI Slop*, NarraBench, and *Echoes in AI*) points at different tells for professional documents: filler that carries no information, hedging where a judgment was needed, chatbot leftovers, register that ignores the venue, formatting that looks stamped out. Each document type gets a thin rule file on top of one shared checklist:

- **Release notes / announcements:** user impact first, artifacts per claim, no marketing inflation
- **PR / issue replies:** answer first, cite `file:line`, no reflex praise, length proportional to stakes
- **Postmortems:** blameless toward people, merciless toward mechanisms — timestamps, dead ends, owned action items
- **Tickets / work orders:** title = outcome, testable acceptance criteria, link don't repeat
- **Technical articles:** open at the problem, one real dead end, one committed opinion, numbers with conditions

That last row is worth reading twice — "one real dead end, one committed opinion, numbers with conditions" is a better brief for technical writing than most style guides give.

## The Calibration Principle: Don't Invert the AI Distribution

The governing principle, stated explicitly, is the project's most sophisticated idea: **calibrate to the human distribution, don't invert the AI one.**

Humans sit at moderate values on most features. A story with *every* rule applied is a new fingerprint — an AI that has been "de-AI'd" with maximum effort is statistically just as detectable, because the output now over-corrects. So sepia deliberately **selects 3–5 moves per story and leaves slack**, applying only the highest-value corrections and leaving some tells (or near-tells) in place, the way a human writer actually writes. It also means the tool's job is *not* detector evasion — it's producing prose that sits in the human distribution because it was built with human structural habits.

## Practical Realities

**Installation** is a one-liner per platform: `npx skills add Nanako0129/sepia -g` (the Skills CLI supports 77+ agents), or native plugin commands (`claude plugin install sepia@sepia`, `codex plugin remove sepia@sepia`, etc.). Project-scoped installs commit the skill into `.claude/skills/sepia` or `.agents/skills/sepia`.

**The honest limitations:** as a skill, sepia's output quality is capped by the host model doing the rewriting — it amplifies a good writer and inherits a weak one. The three-pass protocol demands judgment; a mechanical pass that applies every rule produces exactly the uniform fingerprint the project warns against. The per-model fingerprints are heuristic mappings, not measured per-model evaluations. And while the research base is a genuine strength, its density is a barrier for casual users.

**Compared to alternatives:** classic humanizers (Undetectable AI, GPTZero-style rewriters) work on surface style and target detectors — sepia explicitly does not promise evasion and works on structure; writing-style skills like the Refactoring UI skill for design target a different domain entirely. For writers inside coding agents, sepia occupies a genuinely empty niche: a research-grounded, multi-pass revision protocol for narrative and professional prose.

## Verdict

sepia is the rare AI-tooling project that earns its claims with citations. The StoryScope numbers are specific and reproducible, the three-pass protocol is actionable, the per-domain rule files are sharp, and the calibration principle shows actual thinking about the failure mode of over-correction. It's young, it's opinionated, and it lives or dies by the host agent's writing ability — but for anyone producing long-form or professional prose inside Claude Code, Codex, Grok Build, or Antigravity, it's the most substantive De-AI writing tool to ship this year.

*Screenshots captured from the official GitHub repository on August 31, 2026. Star counts and metrics reflect the repository state at review time.*
