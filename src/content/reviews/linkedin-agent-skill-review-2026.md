---
title: "linkedin-agent-skill Review 2026 — Eleven Free Claude Skills That Run a LinkedIn Account, With a Humanizer That Measures Itself"
date: 2026-09-10
author: "AIPlaybook Editorial Team"
category: "Marketing"
tags:
  - "linkedin-agent-skill"
  - "LinkedIn"
  - "Claude"
  - "Claude-Code"
  - "Agent-Skills"
  - "Humanizer"
  - "AI-Detection"
  - "Social-Media"
  - "Content-Marketing"
  - "Personal-Branding"
  - "Open-Source"
cover: "/images/reviews/linkedin-agent-skill-review-2026/cover.png"
meta_description: "linkedin-agent-skill (created September 7, 2026, MIT, ~85 stars in three days) by Jake Schincariol is a pack of eleven free Claude skills that run a LinkedIn account: posts generated from 21 hook formulas, comments in nine types, replies sorted by lead potential, a 100-point profile score against a 12-part rubric, weekly planning, carousel copy, repurposing, DM sequences, inbox triage and a post-mortem audit. The centrepiece is /li-human, a humanizer that ships two real Python scripts — humanize.py runs three cleaning passes (invisible characters, typography, a 113-term slop lexicon) and detect.py scores the result against a five-check panel (burstiness, specificity, slop density, fingerprint, voice) with the verdict weighting the weakest single check at 40%. Nothing is posted automatically: the skills write and you paste, because there is no official API for posting to a personal profile and browser automation violates LinkedIn's User Agreement. This review covers the eleven commands, how the humanizer's five checks work with worked numbers (24.8 FLAGGED before, 69.7 REVIEW after a single pass), the honest fine print — local heuristics, not GPTZero, no claims about defeating watermarking, nothing fabricated — and who should use a LinkedIn workflow that ends in a copy-ready block."
rating: 7.1
dimensions:
  ease-of-use: 8
  features: 7.5
  value: 8
  performance: 7
  ecosystem: 6.5
pros:
  - "A complete, opinionated LinkedIn operating system in eleven skills: /li-post (21 hook formulas in hooks.json with template, example and how it gets ruined), /li-comment (nine types picked by what the post actually is, never 'Great post!'), /li-reply (sorts your thread into lead / substance / peer / support / noise and writes in that order), /li-profile (scores you out of 100 against a 12-part rubric and rewrites in fix-first order), /li-plan, /li-carousel, /li-repurpose, /li-dm, /li-inbox and /li-audit (ranks published posts by engagement rate and reach multiple, not impressions)"
  - "The humanizer is real software, not a prompt: /li-human ships humanize.py and detect.py with no dependencies that run locally — three cleaning passes (17 classes of invisible characters, typography fixes, a 113-term slop lexicon in editable slop.json) plus a five-check scoring panel with the verdict weighting the mean at 60% and the weakest single check at 40%, because a detector only needs one signal to fire"
  - "The numbers are shown, not claimed: a deliberately terrible draft scores 24.8 (FLAGGED) with 19 stock terms at 24.1 per 100 words; one pass of humanize.py lifts it to 69.7 (REVIEW, +44.9) — and the repo is explicit that the last stretch to PASS is deliberately left to you, the part that needs judgement"
  - "Radically honest about automation: the skills do not post to LinkedIn and should not — no official API exists for posting to a personal profile without an approved partner app, and browser automation violates LinkedIn's User Agreement and gets accounts restricted — so every skill ends in a copy-ready block and you paste it, which the author argues is the design, not a limitation"
  - "The voice layer is the glue: a ten-minute voice.md template (copy to ~/.claude/linkedin/voice.md and fill it in, or paste three of your own posts and say 'write my voice.md from these') is read by every skill, which is what stops the output from sounding like everyone else"
  - "No fabrication, enforced: if a draft needs a number you have not given, it comes back with {{your number}} in it and a flag, every time — no invented metrics, clients or outcomes go under your name"
cons:
  - "It does not automate posting, by design: every skill ends in a copy-ready block that you paste manually into LinkedIn — if you were hoping for a set-and-forget LinkedIn autopilot, this is the opposite of that, and the whole reason is that LinkedIn's rules make safe automation impossible"
  - "The five checks are local heuristics, not detector APIs: they model the signals public detectors key on and run entirely on your machine, but they are not GPTZero, Originality, Copyleaks, Winston or Turnitin and cannot promise those verdicts — fixing what they measure tends to move those numbers because they measure the same underlying things, and the repo says that is the whole claim"
  - "Single-author, single-commit, three days old at review time: one release commit from Jakeschincariol (~85 stars, 15 forks), one open issue, and the real-world effectiveness depends on how well the skills ride your model's judgement — the scripts are the deterministic core, but hook selection, comment type matching and thread triage are still LLM decisions"
  - "The humanizer's shape-level flags are handed back for a rewrite, not fixed: 'It's not just X, it's Y' constructions, rule-of-three triads, one-word rhetorical questions, hashtag walls, reflex engagement bait and uniform sentence length all need a human or a model rewrite because changing sentence shape needs judgement a regex cannot have"
  - "It is LinkedIn-specific by construction: eleven skills, one platform — the humanizer's lexicon and checks travel well, but /li-post's hook formulas and /li-comment's nine types are tuned to LinkedIn's culture and will not transfer unchanged to X, Threads or a newsletter"
best-for: "Individual professionals, founders and content operators who want a disciplined, paste-to-post LinkedIn workflow inside Claude — people who post regularly, want drafts generated from their own voice profile, want comments and replies that are not engagement bait, and want a measurable humanizer between the model and the publish button, without ever risking account automation bans"
price: "Free and open source (MIT). Install in Claude Code: git clone the repo and copy the skills/li-* folders into ~/.claude/skills/, or use /plugin marketplace add Jakeschincariol/linkedin-agent-skill then /plugin install linkedin-agent. Project-local: copy the same folders into your repo's .claude/skills/. No Claude Code at all: paste any single SKILL.md into a chat and it runs as a mode, losing the two Python tools (most of /li-human's point). The Python scripts have no dependencies and run locally; nothing is uploaded, no API keys, no subscription."
---

## The Pitch: Eleven Skills That Treat LinkedIn Like a Job

linkedin-agent-skill, released September 7, 2026 by Jake Schincariol under MIT, is a pack of **eleven free Claude skills** that run a LinkedIn account — free, MIT, no signup, no API key, nothing to connect. One of them writes posts off 21 hook formulas. One comments on other people's posts. One handles the replies under yours. One scores your profile out of 100 and rewrites what lost points. One plans the week: what to post, when, and who to engage with. And one — the humanizer — is the reason the rest are usable, because it strips the em dashes, the slop vocabulary and the invisible watermark characters out of a draft, then scores what is left against a five-check detection panel before you ever see it.

The headline constraint is stated in the README's first lines and repeated in the fine print: **nothing gets posted until you say yes.** These skills write; you post. That is not a missing feature — it is the entire design, and it is why the approval gate is real rather than a setting.

## The Eleven Commands

| command | what it does |
| --- | --- |
| `/li-post` | One idea into a post. Three hook options from 21 formulas, one full draft, humanized before you see it. |
| `/li-comment` | Comments on other people's posts. Nine types, picked by what the post actually is. Never 'Great post!'. |
| `/li-reply` | The thread under your own post. Sorts every comment into lead / substance / peer / support / noise, then writes in that order. |
| `/li-profile` | Scores your profile against a 12-part rubric out of 100, then rewrites in fix-first order. |
| `/li-plan` | The week: what to post, when, and the 10 people to engage with. Writes `~/.claude/linkedin/plan.md`. |
| `/li-human` | The humanizer. Two Python scripts that actually run. |
| `/li-carousel` | Document posts: slide-by-slide copy, the cover that earns the swipe, and the PDF to upload. |
| `/li-repurpose` | One video, newsletter or transcript into a week of posts that each stand alone. |
| `/li-dm` | The 200-character invite note, the first message, and the two follow-ups. |
| `/li-inbox` | Triages the inbox into lead / recruiter / peer / ask / spam, and tells you which tell gave the sequence away. |
| `/li-audit` | Post-mortem on what you have already published. Ranks by engagement rate and reach multiple, not impressions. |

Install is deliberately frictionless: clone and copy the `skills/li-*` folders into `~/.claude/skills/`, install as a plugin (`/plugin marketplace add Jakeschincariol/linkedin-agent-skill`, then `/plugin install linkedin-agent`), keep them project-local in a repo's `.claude/skills/`, or — with no Claude Code at all — paste any single `SKILL.md` at the top of a chat, where it runs as a mode (you lose the two Python tools, which is most of the point of `/li-human`).

The glue is the voice file. Spend ten minutes on `templates/voice.md`: copy it to `~/.claude/linkedin/voice.md` and fill it in, or paste three of your own posts into Claude and say 'write my voice.md from these.' Every skill reads that file — skip it and everything comes out sounding like everyone else.

## The Humanizer: Software, Not a Prompt

`/li-human` ships two Python scripts with no dependencies. They run on your machine, on your text, and nothing is uploaded: `humanize.py` cleans a draft and can show every change; `detect.py` scores it against five checks, and can prove the delta between a before and after file.

**What comes out automatically.** The cleaning pass removes invisible characters — zero-width spaces and joiners, word joiners, soft hyphens, byte-order marks, Unicode tag characters, non-breaking and narrow spaces: the characters your keyboard does not make, that survive copy-paste and are invisible in every editor you own. It fixes typography: em dash to comma, en dash to hyphen, curly quotes to straight, ellipsis to three dots. And it runs a lexicon of 113 stock words and phrases with plain-English replacements — delve, leverage, robust, seamless, crucial, testament to, 'in today's fast-paced world', 'let that sink in' — with capitalisation preserved and URLs untouched. The lexicon lives in `slop.json` and is meant to be edited.

**What gets flagged instead of fixed.** 'It's not just X, it's Y' constructions, rule-of-three triads, one-word rhetorical questions, hashtag walls, reflex engagement bait, uniform sentence length. Changing the shape of a sentence needs judgement, so those are handed back for a rewrite rather than mangled by a regex.

**The five checks**, scored 0-100 where higher is more human:

| check | what it measures |
| --- | --- |
| BURSTINESS | sentence-length variation. Models write even. |
| SPECIFICITY | numbers, names and concrete markers per 100 words |
| SLOP DENSITY | lexicon hits per 100 words |
| FINGERPRINT | invisible characters, em dashes, curly quotes per 1,000 |
| VOICE | contractions, person, structural tells |

The verdict weights the mean at 60% and the **weakest single check** at 40%, because a detector only needs one signal to fire. The repo shows the numbers rather than claiming them: a deliberately terrible draft scores 24.8 (FLAGGED) with 19 stock terms at 24.1 per 100 words; after `humanize.py`, with the flagged structures still unrewritten, the same draft scores 69.7 (REVIEW, +44.9) — and the last stretch to PASS is the part the script deliberately leaves to you.

## The Fine Print, Which Is the Honest Part

Three claims in the README deserve emphasis because they are the opposite of the usual AI-marketing pitch. **These skills do not post to LinkedIn, and they should not.** There is no official API for posting to a personal profile without an approved partner app, and automating the site with a browser or a third-party tool violates LinkedIn's User Agreement and gets accounts restricted. Every skill ends the same way: a copy-ready block, and you paste it.

**The five checks are local heuristics, not detector APIs.** They are modelled on the signals public detectors key on and run entirely on your machine. They are not GPTZero, Originality, Copyleaks, Winston or Turnitin, and they cannot promise those verdicts — fixing what they measure tends to move those numbers, because they are measuring the same underlying things. Nobody can honestly sell you 'undetectable,' and anybody who does is selling you something.

**The invisible-character pass is real and it is narrow.** It removes the zero-width and format characters that end up in generated text and survive copy-paste — a genuine, checkable fingerprint. It is not a claim about defeating a cryptographic watermarking scheme. And nothing here fabricates: no invented metrics, clients or outcomes go under your name — a draft that needs a number you have not given comes back with `{{your number}}` in it and a flag, every time.

## Honest Limits and Who It's For

The limits follow from the design. It does not automate posting, so it will not satisfy anyone hunting for a LinkedIn autopilot. The five checks are heuristics, not detector verdicts, and the shape-level flags still need human or model judgement. It is single-author and three days old at review time — one release commit, one open issue, and the real-world quality depends on how well the skills ride your model's judgement for the parts that are not deterministic scripts. And it is LinkedIn-specific by construction: the hook formulas and comment types are tuned to that platform's culture.

Who should care? Individual professionals, founders and content operators who already use Claude and want a disciplined, paste-to-post LinkedIn workflow — people who want drafts generated from their own voice profile, comments that are not engagement bait, replies sorted by lead potential, and a measurable humanizer between the model and the publish button. For that audience, the honest fine print is not a drawback; it is the reason the tool is safe to use at all.