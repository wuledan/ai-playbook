---
title: "screenwriting-skills Review 2026 — 26 Agent Skills That Turn 47 Craft Books and 23 Script Collections Into a Working Writers' Room"
date: 2026-09-15
author: "AIPlaybook Editorial Team"
category: "Writing"
tags:
  - "screenwriting-skills"
  - "agent-skills"
  - "screenwriting"
  - "Claude Code"
  - "Codex"
  - "dramaturgy"
  - "television-writing"
  - "creative-writing"
  - "agentskills.io"
  - "Writing"
  - "Open-Source"
cover: "/images/reviews/screenwriting-skills-review-2026/cover.png"
meta_description: "screenwriting-skills (jtydhr88, created September 6, 2026, 1,081 stars, personal-study license) is an open set of 26 Agent Skills for screenwriting, television writing and dramaturgy, distilled from 47 craft books and 23 volumes of published scripts, scores and plays in Chinese, American, British, Japanese and Korean traditions. This review covers the four-layer skill structure, the deliberate one-source-tree-in-Chinese decision and the multilingual runtime that follows from it, the Chinese-opera banqiang and qupai systems, the master corpora behind Ozu and Succession, the install paths for Claude Code and Codex, and the honest limits: a personal-study license, instruction files you cannot audit unless you read Chinese, and a two-week-old, single-maintainer project."
rating: 8.2
dimensions:
  ease-of-use: 7.5
  features: 8.5
  value: 8
  performance: 8
  ecosystem: 6.5
pros:
  - "The source base is the point: 47 craft books (Field, Snyder, McKee's Story and Dialogue, Truby's Anatomy of Story and Anatomy of Genres, Hoxter, Hicks, Egri, Cron, Walter, Henson and the Chinese masters Mei Feng, Lu Jun and Liu Dapeng) plus 15 television-craft books and 23 volumes of published scripts, scores and plays are compressed into 26 loadable skills, so an agent reasons from named methods instead of vibes"
  - "It separates dramaturgy from medium rather than mashing them together: general skills (structure, premise, character, dialogue, scene, format) stay untouched when a medium layer is added, and the project documents that rule — the series layer grew from 13 to 20 skills without editing sw-story-structure, and the opera slot was added the same way"
  - "Chinese opera gets a genuinely serious treatment most English-language craft tooling ignores: two separate systems — qupai (a lyric filled into a fixed tune pattern with set line counts, lengths and tones) and banqiang (a lyric built from paired seven- or ten-character lines varied by metre) — each with a method skill and a full-script case library: the Peking-opera *Suo Lin Nang*, *Shajiabang* in its 1965 form against the 1970 changes, *The Peony Pavilion*'s 55 scenes, and *The Peach Blossom Fan*'s 44 scenes, verified against public-domain editions"
  - "The master corpora are real primary texts, not summaries: Chekhov's seven full-length plays with act-by-act tables, six Ozu screenplays with scene tables, and all four seasons of Succession — 39 shooting scripts used to reverse-engineer invisible-act tests, container episodes and humiliating reversals turned on a single word"
  - "Multilingual support is a design consequence, not an afterthought: ask in English, Japanese, Korean or French and the agent answers in that language, while terminology is anchored back to the original English craft vocabulary through sw-workflow/terms.md so the model restores 'logline' or 'act out' instead of inventing a translation"
  - "It is disciplined about what does not get a skill: subject matter (spy thriller, costume drama) and directorial style are case studies inside existing skills, and a genre only earns its own skill if it forces different structure, format or language rules — which is why short-form vertical drama and AI-generated comic drama are explicitly excluded"
cons:
  - "The license is a real constraint, not fine print: the README says 'for personal study use', quotations remain the property of their authors and translators, and the repository declares no SPDX license. That is a personal-study grant, not an open-source license, which rules out shipping it inside a commercial product or a client deliverable without asking first"
  - "You cannot audit the instruction files unless you read Chinese: the skill bodies are written in Chinese, and while output follows your question language, the principles, tables and checklists the model actually reasons from are Chinese-only. The project tried an English tree, then deliberately killed it to avoid five drifting translations — a defensible call that still trades away auditability"
  - "It is two weeks old with a single visible maintainer: created September 6, 2026, and the issue history is almost entirely one person's own follow-up work (a README prose pass, 13 scale fixes, an opera layer). A community feedback issue (#24, testing the skills in AutoClaw) is the one outside signal, and the bus factor is one"
  - "There are no automated tests, schemas or CI in the repository tree — no linter for SKILL.md frontmatter, no validation that the 26 skills cross-reference each other correctly. The project's quality argument rests on its source discipline, which is strong, rather than on machine-checked guarantees, which are absent"
  - "Skill activation is heuristic and context-driven, so a large 26-skill install can add meaningful context overhead and occasional mis-triggers; the project documents conventions and triggers (a long description ending in 'Use when …' with Chinese keywords) but ships no token-cost estimate, no activation log and no scoping tool to keep only the skills a project needs"
  - "Coverage is uneven by design and the gaps are stated plainly: film and television are covered, the stage is only partly covered, musical theatre is 'last', and two opera edges (a Henan-opera rhyme table, and whether Cantonese opera needs its own treatment) are open questions rather than shipped work — so a working playwright may find the medium they want is still on the roadmap"
best-for: "Screenwriters, TV writers, dramaturgs and development teams who already run Claude Code or Codex and want an agent that argues from named craft methods — Save the Cat board, McKee's controlling idea, Truby's moral-argument chain, Calvisi's pilot beat sheet — instead of generic advice, and who are comfortable with personal-study terms and reading the theory through the agent rather than in a translated manual"
price: "Free for personal study (no SPDX license declared; README states 'for personal study use'). Install via the Claude Code plugin marketplace (/plugin marketplace add jtydhr88/screenwriting-skills then /plugin install screenwriting@screenwriting-skills) or the Codex marketplace (codex plugin marketplace add jtydhr88/screenwriting-skills); alternatively git clone and copy the plugins/screenwriting/skills/* directory into ~/.claude/skills/, .claude/skills/, ~/.agents/skills/ or .agents/skills/."
---

## What screenwriting-skills Is

Ask a general-purpose coding agent to fix a scene and you get fluent, competent, generic prose: the beat lands, the characters talk, and nothing about it could only have been written by someone who had read Syd Field and John Truby and forty-five other books. The problem is not that the model cannot write. It is that it has no *named* method to hold itself to, so it optimises for plausible sentences instead of dramatic structure — no controlling idea, no act out, no moral argument, no scene as value turn. `screenwriting-skills`, created September 6, 2026 by jtydhr88, is a set of **26 Agent Skills** that closes that gap by making the craft explicit and loadable.

The repository is blunt about its ambition: 26 skills "distilled from 47 craft books and 23 volumes of published scripts, scores and plays." The books are the canonical ones — Field's *Screenplay*, Snyder's *Save the Cat*, McKee's *Story* and *Dialogue*, both of Truby's *Anatomy* volumes, Egri, Hoxter, Hicks, Cron, Walter, Henson — alongside a substantial Chinese craft literature (Mei Feng's *Screenwriting Self-Study*, Lu Jun's *Screenwriting Theory and Technique*, and Liu Dapeng's edited *Story Craft Masterclass, International Volume*). The collected works range from Chekhov's complete plays to all four seasons of *Succession*'s shooting scripts. At the time of writing the repository sits at **1,081 stars and 122 forks** in nine days, which for a writing-craft repo is a strong signal.

![The repository as of review time — 26 Agent Skills for screenwriting, television writing and dramaturgy, shared by Claude Code and Codex through the open agentskills.io format](/images/reviews/screenwriting-skills-review-2026/cover.png "github.com/jtydhr88/screenwriting-skills — 47 craft books and 23 volumes of scripts, distilled into loadable skills")

## Four Layers, and a Rule About What Earns a Skill

The skills are organised in four layers rather than a flat pile. **Layer 1 — general dramaturgy** is medium-independent: `sw-workflow` orchestrates a project and names which skill to call at each stage; `sw-story-structure` carries the paradigm and the Save the Cat board and McKee's event/scene/sequence/act; `sw-premise-theme` handles controlling idea and the "third rail"; `sw-character-conflict`, `sw-dialogue` and `sw-scene-craft` cover the working parts; `sw-format-adaptation` holds spec-format hard rules and a Fountain output contract.

**Layer 2 — the medium layer** is what a feature does not teach: `sw-series-structure` covers teasers and cold opens, broadcast four/five/six-act grids with page anchors, three tests for locating the *invisible* acts in streaming scripts, and Oberg's four information tools (mystery, surprise, dramatic irony, suspense). `sw-series-engine-bible`, `sw-writers-room` and `sw-sitcom-comedy` round it out, and the stage side gets its own serious treatment.

The design rule matters more than the list. A genre gets its own skill **only if it makes the model write with different structure, format or language rules**. Subject matter (spy thriller, costume drama) and directorial style do not qualify; they live as case studies inside existing skills, unless a complete script corpus exists — as with Ozu. This is why the project can state that adding the series layer (13 → 20 skills) and the opera slot left `sw-story-structure` unchanged, and even *shortened* `sw-dialogue`. That is a maintenance argument a lot of skill collections never make.

## The Multilingual Decision — and Its Cost

The most interesting engineering choice is the one the project fought with itself over. The skills are written **once, in Chinese**, and the agent answers in whatever language you asked in. There was an English tree — a parallel `screenwriting-en` plugin, proposed, built and merged — and it was then deleted. The argument, documented in the README, is that if a reader who cannot read Chinese deserves a translated tree, so does a Japanese reader, then Korean, then French; five languages is 230 files that drift independently with nothing to say which is stale.

The runtime does the rest. Output language follows your question. Terminology is anchored back to its original term through `sw-workflow/terms.md`, so a concept that different Chinese translators rendered differently is restored to *logline*, *act out*, *beat sheet* rather than reinvented. Concepts with no equivalent come through as the original term plus a gloss — the one-line core attraction of an episode is carried as *xiyan*, with its meaning spelled out beside it.

![The skills directory — 26 self-contained SKILL.md files, each agent-neutral and shared by Claude Code and Codex through one source tree](/images/reviews/screenwriting-skills-review-2026/skills-dir.png "plugins/screenwriting/skills — one source tree, no per-language forks")

It is a defensible call, and the project names its cost honestly: **you cannot read the instruction file itself unless you read Chinese, only the agent's account of it.** That is exactly what the deleted English edition bought, and the maintainers decided it was not worth a permanent five-way maintenance burden.

## What Using It Looks Like

Install is standard for the two majors. Claude Code: `/plugin marketplace add jtydhr88/screenwriting-skills`, then `/plugin install screenwriting@screenwriting-skills`, giving skills names like `/screenwriting:sw-dialogue`. Codex: `codex plugin marketplace add jtydhr88/screenwriting-skills`, then invoke with `$sw-story-structure`. The same `SKILL.md` files serve both because they follow the agentskills.io format and name no agent-specific syntax — each plugin carries only a thin `.claude-plugin/plugin.json` and `.codex-plugin/plugin.json` over one shared `skills/` directory.

The README's own examples show the intended granularity: "My dialogue is all on the nose, fix this scene" pulls `sw-dialogue` plus `sw-scene-craft`; "Turn this 400,000-word novel into a 40-episode Chinese drama outline" pulls `sw-chinese-series-practice` plus `sw-series-engine-bible`. You install once into `~/.claude/skills/`, `.claude/skills/`, `~/.agents/skills/` or `.agents/skills/` and the skills load when the agent detects relevant context.

## The Opera Layer Is the Surprise

Where the project goes well beyond anything comparable is Chinese opera. It treats it as **two vocal systems, not one genre**: the qupai system (Yuan zaju, Ming-Qing chuanqi, kunqu) where a lyric is filled into a fixed tune pattern with set line counts, lengths and tones, and the banqiang system (Peking opera, Henan, Yue and Qin opera) where a lyric is built from paired seven- or ten-character lines varied by metre. Each system gets a method skill and a full-script case library, taken from public-domain editions and checked against the originals; where a scan could not be verified (some Wu Mei and *Legend of the White Snake* passages) the notes say so and the skills refuse to build rules on them. Four skills, 25 sources, and an explicit statement of what is *not* planned — short-form vertical drama and AI-generated comic drama, "whose logic is distribution, with no dramaturgy to distil."

## The Honest Limits

The constraints are as clearly documented as the features, which is why the rating lands where it does.

**The license governs everything.** The repository declares no SPDX license; the README says "for personal study use," and quotations remain the property of their authors and translators. For an individual writer exploring craft with an agent, that is fine. For shipping inside a product or a paid client deliverable, it is a blocker you must clear first.

**Auditability is traded away.** The instruction bodies are Chinese-only. A non-Chinese-reading team adopts the project on trust — it can read the README and the agent's output, not the principles and tables underneath.

**It is young and single-maintainer.** Two weeks old, and the issue history is nearly all one person's own follow-ups: a 17-sentence README rewrite, a "13 scale fixes" pass, an opera-layer addition. The one genuinely external signal is issue #24, "Feedback: Testing screenwriting-skills in AutoClaw." There are no tests, no schemas, no CI — quality rests on source discipline, not machine-checked guarantees.

**Activation is heuristic.** A 26-skill install can add context overhead, and the project ships no token-cost estimate and no scoping tool to keep only the skills a project needs.

## Bottom Line

`screenwriting-skills` is the most carefully sourced creative-writing skill pack we have seen: named methods, primary texts, a maintenance rule that survives its own growth, and a multilingual decision the maintainers were willing to argue for and against in public. Set against a personal-study license, Chinese-only instruction files and a two-week-old single-maintainer project, it earns **8.2/10** — a genuinely strong tool for individual screenwriters and TV writers working in Claude Code or Codex, and a research reference for anyone building craft skill packs. If you write for a living and your agent keeps producing plausible, structureless drafts, install it and ask for a beat sheet; the difference in the first revision will tell you whether the source base is worth its constraints.
