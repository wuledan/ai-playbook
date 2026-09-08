---
title: "i-have-adhd Review 2026 — The 30,000-Star Skill That Stops Your Coding Agent From Burying the Answer"
date: 2026-09-09
author: "AIPlaybook Editorial Team"
category: "Coding"
tags:
  - "i-have-adhd"
  - "AI-Coding-Agents"
  - "Agent-Skills"
  - "Claude-Code"
  - "Codex"
  - "Cursor"
  - "OpenCode"
  - "Gemini"
  - "Prompt-Engineering"
  - "Productivity"
  - "Open-Source"
  - "ADHD"
cover: "/images/reviews/i-have-adhd-review-2026/cover.png"
meta_description: "i-have-adhd is an MIT-licensed skill (30,000+ stars on GitHub, Hacker News front page on September 9, 2026) that stops Claude Code, Codex, Cursor, OpenCode, Gemini and other coding agents from burying the answer. Instead of a preamble, a plan and a 'Hope this helps!', the agent leads with the next action, numbers every multi-step task, restates progress each turn, gives time estimates in concrete units and drops all closing pleasantries. The skill ships ten explicit output rules driven by five facts about ADHD reading, a pre-send checklist that deletes announcing openers, recaps and hedging adverbs, and an unusual breadth of runtime support: plugin manifests for Claude Code and Codex, a Cursor skills mirror, an OpenCode plugin, always-on hooks, native extensions for Pi and OMP, and GEMINI.md instructions for always-on Gemini behavior. This review covers the ten rules, when the skill tells the agent to break them, the pre-send check, the cross-runtime install matrix, the verification tooling (unit tests, evals and a context-compatibility check), the community's 'AI Agora' experiment in issue #127, and the honest limits of output-shaping skills: the model still has to follow the rules, and the off switch is a spoken phrase."
rating: 7.8
dimensions:
  ease-of-use: 8.5
  features: 8
  value: 8
  performance: 7.5
  ecosystem: 8
pros:
  - "Unusually concrete rules that a model can actually follow: 'lead with the next action,' 'number multi-step tasks,' 'end with one concrete next action,' 'restate state every turn,' 'cap lists at five' — each rule comes with a bad example and a good example, and the bad examples are recognizably the exact filler every coding agent produces today ('Great question! Let me think about this... Hope this helps!')"
  - "Cross-runtime breadth that few skills attempt: plugin manifests for Claude Code and Codex, a synchronized Cursor skills mirror, an OpenCode plugin plus command, hooks for always-on behavior, native TypeScript extensions for Pi and OMP, and per-runtime instructions for Gemini, Qwen and Kimi — the same ten rules install on nearly every major agent surface from one repository"
  - "The 'always-on' design is the right call for the problem: most output-style prompts expire after a few turns, but i-have-adhd persists for the whole session by design and only turns off on an explicit 'stop adhd mode' — the persistence is itself one of the rules, which is what makes the behavior stick across topic changes"
  - "Sensible escape hatches instead of rigid enforcement: the skill tells the agent to break the rules when the user asks to be walked through something, before destructive actions, after three failed fixes (name the wrong assumption instead of iterating again), or when a rule would fight the task itself — plus a pre-send check that removes announcing first sentences, recaps, sidebars and hedging adverbs"
  - "Real engineering around a prompt: repository map with a canonical SKILL.md mirrored to Cursor, hooks declarations, plugin metadata kept in sync across manifests, and a verification suite (Python unit tests, a run_evals.py validation, a context-compatibility check, and claude plugin validate) — this is treated as software, not as a copy-paste system prompt"
  - "Community scale is genuine: 30,000+ stars and ~1,800 forks in about four months, a contributor workflow with an explicit 'AI Agora' forum (issue #127) where agents may comment under a label, and translated READMEs — for an output-style skill that is extraordinary adoption"
cons:
  - "It is prompt-shaped behavior, not enforced behavior: the skill can only ask the model to comply, and compliance depends on the underlying model's instruction-following — a weaker or heavily system-prompted model can still bury the answer, and there is no programmatic guarantee the rules run"
  - "The off switch is a phrase ('stop adhd mode'), which is fragile in practice: if the skill is always-on via hooks or GEMINI.md and the user forgets the exact wording, the styled output persists until they find it — the repo documents the toggle, but a UI kill-switch would be more robust"
  - "Some rules are opinionated about style in ways not everyone wants: no hedging adverbs at all and a hard cap of five list items can flatten genuinely useful nuance for readers who prefer cautious, probabilistic language (the skill does allow keeping a hedge that carries real uncertainty, but the default bias is toward deletion)"
  - "Ten rules plus escape hatches plus a pre-send check is a lot of surface for the model to hold at once; on long sessions the later rules (cap lists, no recaps) are the ones most likely to drift, and nothing in the skill re-asserts them mid-session beyond the persistence clause"
  - "Category and naming may put off non-ADHD readers: the repo is explicit that 'no ADHD diagnosis needed,' but the branding means teams that would benefit from the output discipline have to explain why they installed a skill called i-have-adhd"
best-for: "Anyone who uses a coding agent (Claude Code, Codex, Cursor, OpenCode, Gemini CLI, Qwen, Kimi, Pi, OMP or Antigravity) and finds that its answers start with context and end with pleasantries instead of starting with the fix — solo developers, people with attention or working-memory constraints, and teams that want terse, action-first, numbered output as a default rather than something they have to re-ask for each session"
price: "Free and open source (MIT). Install per runtime: 'agy plugin install https://github.com/ayghri/i-have-adhd' for Antigravity, the standard plugin install for Claude Code and Codex (plugin.json manifests are in the repo), copy the .cursor skills mirror for Cursor, or paste the install line for the CLI agent you use; for always-on Gemini behavior add the ten-rule block to ~/.gemini/GEMINI.md. Invoke with /i-have-adhd and it stays on until you say 'stop adhd mode' or 'normal mode.' No API keys, no cloud, no cost."
---

## The Problem: Agents Answer Like They're Networking, Not Working

A coding agent that knows the answer will still spend its first three sentences telling you it's about to think, its next paragraph re-explaining your own problem back to you, and its last line asking if you'd like anything else. Between the opener and the closer sits the actual fix — somewhere. For readers with ADHD, that packaging is not a minor annoyance: working memory is small, so anything not on screen is forgotten; knowing the answer is not doing the answer; and vague time estimates ('a bit of work') register identically to honest ones ('about two hours'). ayghri's **i-have-adhd**, which hit the Hacker News front page on September 9, 2026 with 30,000+ stars and roughly 1,800 forks on GitHub, is a skill that reshapes agent output around those five facts. It does not diagnose anyone. It just stops the agent from burying the answer.

The skill's pitch fits in one sentence: output is not just brief, it is *shaped so an ADHD brain can act on it* — action first, steps numbered, state restated, wins visible, pleasantries forbidden.

## The Ten Rules, and the Persistence Clause

The canonical behavior lives in `skills/i-have-adhd/SKILL.md` and reads like a style guide a furious senior engineer would write after one too many 'Great question!' openers. The ten rules: (1) lead with the next action — a command, path or snippet goes first, prose after if at all; (2) number multi-step tasks, one bounded action per step, no step containing 'and then' twice; (3) end with one concrete next action doable in under two minutes; (4) suppress tangents — finish the current issue, then offer the second as a separate question; (5) restate state every turn ('Step 3 of 5 done: schema updated. Next: backfill the new column.'); (6) give time estimates in concrete units, never 'a bit'; (7) make completed work visible in concrete terms; (8) a matter-of-fact tone for errors — state location, cause and fix, no 'Uh oh'; (9) cap lists at five items, splitting into 'do now' vs 'later' rather than dumping ten unranked options; and (10) no preamble, no recap, no closing pleasantries — forbidden openers include 'Great question,' 'Let me...' and 'To answer your question...', and forbidden closers include 'Hope this helps' and 'Let me know if you need anything else.'

The persistence clause is the design decision that makes the whole thing work: the rules apply to *every* response for the rest of the session, do not expire after a few turns, and do not lapse when the topic changes. The skill only turns off on an explicit 'stop adhd mode' or 'normal mode.' That is the difference between i-have-adhd and a hundred forgotten output-style prompts: it is on until told otherwise, and it says so.

## When to Break the Rules

A skill this rigid would be unusable without escape hatches, and the README's 'When to break the rules' section is arguably the most valuable part of the design. The agent overrides the defaults when: the user asks to be explained to (explain fully, still no preamble, but the body runs as long as the topic needs — add headers so the reader can skim back); a destructive action is ahead (`rm -rf`, force push, a schema migration — confirm before acting, safety wins over brevity); the last three turns have been 'still broken' (stop iterating, name the assumption that might be wrong, ask one diagnostic question); the request is genuinely ambiguous (one short clarifying question beats guessing); or a rule fights the task itself — 'what are my options' gets two to four ranked options with one-line trade-offs and a recommendation first, because the options *are* the answer. The meta-rule is consistent: the constraint wins, the shape stays.

## The Pre-Send Check

Before sending anything, the skill instructs the agent to delete: the first sentence if it announces what is about to happen; the last sentence if it asks 'anything else?' or recaps; any 'by the way' sidebar; any hedging adverb adding no information ('perhaps,' 'might,' 'could possibly' — keep a hedge that carries real uncertainty, because deleting it manufactures confidence); and any idiom ('circle back,' 'get the ball rolling,' 'on the same page'). Then the agent verifies: if the reader reads only the first line and the last line, do they know (a) what to do next and (b) what just happened? If yes, send. That two-line test is a genuinely good universal filter — the kind of check that would improve output even for readers who have never heard of ADHD.

## Cross-Runtime Coverage

What separates this from a paste-into-Claude prompt is the install matrix. The repository carries plugin manifests for Claude Code (`.claude-plugin/plugin.json` plus hooks in `hooks/hooks.json` and always-on behavior in `hooks/always-on.mjs`) and Codex (`.codex-plugin/plugin.json`, an agents marketplace manifest), a synchronized Cursor mirror (`.cursor/skills/i-have-adhd/SKILL.md`, kept in lockstep with the canonical file), an OpenCode plugin and slash command (`opencode.json`, `.opencode/plugins/i-have-adhd.mjs`), native TypeScript extensions for Pi and OMP (`extensions/i-have-adhd.ts`, `context-compat.ts`), and metadata for Qwen, Kimi and Gemini — with `GEMINI.md` documenting the always-on path that appends the ten-rule block to `~/.gemini/GEMINI.md`. Antigravity installs with `agy plugin install https://github.com/ayghri/i-have-adhd`. The repository map in AGENTS.md is explicit about which file is the source of truth (the canonical SKILL.md — change it first, then sync the Cursor mirror) and treats manifests as runtime contracts that must stay aligned.

## Honest Limits and Who It's For

The limits are the limits of any output-shaping skill. It is prompt-shaped, not enforced: the model must follow the rules, and on long sessions the later rules are the ones most likely to drift. The off switch is a phrase, which is fragile if the user forgets it. And the style is opinionated — the blanket bias against hedging will not suit every reader. But for anyone who uses a coding agent and is tired of answers that start with context and end with pleasantries, this is the most complete, best-engineered fix available: ten concrete rules, a persistence clause, sensible escape hatches, a pre-send check, and install support for nearly every agent surface that exists in 2026. At 30,000 stars it is no longer a niche productivity hack — it is evidence that a huge number of people want their agents to stop performing helpfulness and start being useful.
