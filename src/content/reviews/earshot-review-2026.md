---
title: "Earshot Review 2026 — Ears for Coding Agents: Describe, Judge and Forge Sound From the Command Line"
date: 2026-10-28
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "earshot"
  - "ai-audio"
  - "coding-agents"
  - "MCP"
  - "Claude Code"
  - "sound-design"
  - "audio-forensics"
  - "Python"
  - "open-source"
  - "Developer Tools"
cover: "/images/reviews/earshot-review-2026/cover.png"
meta_description: "Earshot (Leonxlnx, created October 15, 2026, 3,047 stars, MIT) gives coding agents ears: describe a sound in words, match a description against candidates, find the best moment inside a recording, tell real from code-synthesized, critique a launch film against professional references, and forge new sound effects as code on CPU. This review covers the CLI and MCP surface, the two-model stack behind the verdicts, the measured accuracy in docs/VALIDATION.md, the forge/search loop and its Goodhart problem, and the honest limits of a two-week-old 0.4.0 release."
rating: 8.0
dimensions:
  ease-of-use: 7
  features: 8.5
  value: 8.5
  performance: 7.5
  ecosystem: 7.5
pros:
  - "It converts a sense agents simply did not have into structured evidence: describe, match, rank, find, compare, realness, timeline, critique all return calibrated numbers and plain-language verdicts an agent can quote back to you, instead of an opaque 'this sounds fine'"
  - "The command surface is unusually well thought out for machine consumers — every command prints a human summary first, --json returns the full result, --out saves it, errors are one line on stderr with exit 1, and the same tools are exposed as an MCP server so Claude Code or any MCP client gets them without shell plumbing"
  - "It runs entirely on CPU with two open models downloaded once (~1.1 GB, CLAP plus an AudioSet tagger at pinned revisions) and never phones home afterwards; EARSHOT_OFFLINE makes that a guarantee rather than a hope"
  - "The measured claims are documented with the exact command that produced them, which is rare: a 'strong' match verdict is the right kind of sound 98% of the time on a held-out library, real vs code-synthesized scores 0.92 ROC-AUC with whole families held out, and 93% of placed effects in a 60-second mix are detected"
  - "earshot forge closes the loop instead of stopping at analysis: the agent writes a sound as a physical-synthesis recipe, earshot renders variants, a critic built from the same models plus model-free measurements scores them, and the agent reads the critique and mutates — a real iteration loop for sound, not a one-shot generator"
  - "The shipping extras are practical: a bank of 252 code-built effects with earshot sfx / kit for film sync, earshot fit to turn a recording into a re-renderable recipe module, and two bundled agent skills that tell an agent which command answers which question"
cons:
  - "It is 0.4.0, two weeks old, and the bug tail is visible: a single NaN or Inf sample breaks most commands (issue #12), media globs treat directories with audio extensions as playable files (#16), and mocked sleeps in interface tests were still making the suite flaky at review time"
  - "Each CLI call is a cold process that reloads the models (~20-40 s) before it answers, so a naive loop of ten shell invocations burns several minutes on loading alone; the fix is to use the MCP server or one Python script, which is not obvious from the first example"
  - "The realness model is easy to fool and the README says so: after a forge search the synthesized sounds pass every model check including held-out ones, and the author's own warning is to judge by model-free measurements, spectrograms next to references and a human blind test — meaning the headline verdict is directional, not a certificate"
  - "It cannot judge taste, emotion, provenance or licensing, and nothing above 14 kHz from the models; a 'strong' verdict still only picks the exact variant 61% of the time, which matters when the difference between a thock and a click is the whole point"
  - "Installation assumes a working Python 3.10+ and ffmpeg environment plus a torch CPU wheel from the PyTorch index — heavyweight for a tool you might want to hand to a non-Python agent host, and the model download has to be planned rather than discovered mid-task"
  - "The vocabulary is calibrated for the sounds it was built on: the fit benchmarks cover risers, shimmers, swells and camera moves, while zips, long glides and swipes are explicitly untested, so confidence in a verdict should drop sharply outside motion-design and UI territory"
best-for: "Teams whose coding agents already produce video, demos or games and need them to work with sound — sound designers and motion developers who want an agent to pick, verify and iterate on effects, and anyone who needs programmatic answers to 'what does this file sound like', 'is this the right effect', 'where is the hit' and 'is this real or synthesized' without a human listening to every take"
price: "Free and open source (MIT). Python 3.10+ and ffmpeg required, CPU only. Clone the repo, create a venv, install torch from the CPU index, then pip install -e \".[mcp,llm,dev]\" and run earshot doctor --load. Two open models (~1.1 GB) download on first use into a local cache; EARSHOT_OFFLINE=1 hard-disables all network access afterwards. Optional audio-LLM critique needs your own Gemini key and explicit --yes-upload consent."
---

## What Earshot Is

Agents can now write the code that renders a film, a product demo or a game. What they cannot do is hear what they made. They cannot tell a premium key press from a cheap one, or notice that a hit lands 80 ms after the cut, or hear that the music swells in the wrong place. Earshot, created October 15, 2026 by Leonxlnx, exists to fix that specific asymmetry: **it turns sound into evidence an agent can reason about, and then lets the agent make sound as code and improve it by listening.**

At review time the repository sits at **3,047 stars and 187 forks** (four open issues, ten open pull requests), MIT licensed, written in Python, running entirely on CPU. Version 0.4.0 shipped the "sound of a music-led launch film" update: 51 new code-built effects, a `launch` kit preset that mixes effects against a music bed instead of at a fixed level, and a remade `earshot fit`.

The framing matters, because "AI audio tool" is a crowded and mostly vague category. Earshot is not a text-to-music generator. It is a **measurement and verdict layer** — a CLI, a Python API and an MCP server — with a synthesis engine bolted on so the verdicts can drive a loop.

![The CLI surface is the product: describe, match, rank, find, compare, realness, timeline, sheet, critique, forge, fit, sfx, kit — each answering one question with a calibrated verdict](/images/reviews/earshot-review-2026/cli-commands.png "Earshot's command surface as documented in the README — one command per question an agent needs answered")

## Asking Questions in Words

The core commands answer the questions an agent actually has. `earshot describe FILE` returns what a sound *is*: a 0.56 s short transient with a 3 ms attack that decays in 190 ms, sounding most like "a single mechanical keyboard key press" (z +5.4) with "a soft key release click" as the closest alternative (z +3.6), peak −0.1 dBFS, brightness 1.5 kHz. Those `z` scores are calibrated against a vocabulary, which is the difference between a number an agent can threshold on and a number it has to guess about.

`earshot match FILE "a deep thocky mechanical keyboard press" --alts "a clicky blue switch keyboard" "a mouse click"` returns a verdict banded strong / plausible / weak / no match, and — crucially — where that verdict would rank among 322 vocabulary descriptions. `earshot rank` sorts a folder of candidates by a description, which is the command an agent should use after downloading five whooshes from three libraries. `earshot find` returns tight trims inside a long recording: on a file of 17 single key presses the found windows land on real presses, and in a 300-second scene every planted event is found.

Then the judgement layer. `earshot realness` classifies a recording as real/pro-produced or code-synthesized, with per-window evidence. `earshot timeline FILE --video V --cues C` produces a listening transcript: events with time, level and tag, plus sections, loudness, beat grid, and **sync of sound to picture cuts and cue frames**. `earshot sheet` renders an annotated PNG — video frames, labelled events, spectrogram, waveform, loudness, sync markers — for agents that read images rather than JSON. And `earshot critique` grades a launch film against a profile built from seven professional launch films and returns timestamped fixes ("nothing reaches body level until 0:01.01").

The first line of every output is plain language; `--json` and `--out` give the machine version. Errors are one line on stderr, exit 1. For MCP clients this all arrives as tools, so an agent does not need to construct shell commands at all.

## Making Sound, Then Listening to It

Analysis alone would be a linter. `earshot forge` makes it a design loop, and this is the part worth understanding before you install.

A **recipe** is a sound written as physical synthesis: modal resonators, contact excitations, filtered noise, a computed room and a microphone — no recorded audio inside. Earshot renders candidates from the recipe's parameters, then a **critic** scores each one on three axes: description match against named confusions, realness, and closeness to reference recordings, plus a set of **model-free** penalties (1/3-octave tonal balance, spectro-temporal envelope, artifacts such as clicks, aliasing, DC/infrasound, harsh resonances, comb ring, clipped tails, and polish metrics like attack and tail smoothness). A cheap pre-screen ranks many renders with measurements only, so the models only hear the finalists; an evolutionary search keeps and mutates the best. The agent reads the critique in words, looks at spectrograms next to the references, rewrites the recipe, runs it again.

```bash
earshot forge keypress --refs path/to/real/keypresses/ --budget 144 --variants 4 --dir made/keypress
earshot forge whoosh --refset whoosh_fast --budget 96 --dir made/whoosh
earshot forge --render keypress --params made/keypress/report.json --seeds 1 2 3 --dir made/again
```

`earshot fit` runs the same idea backwards: analysis by synthesis fits a small, readable model (ringing modes, tracked partials, a time-varying noise gesture, or a layered hybrid) to a recording until the render matches, then writes a recipe module whose `render()` reconstructs the sound. The module stores *structure*, not samples, so it can produce new takes, vary size, damping, pitch, brightness and decay, and morph between two recordings. `sfx` and `kit` give you a bank of 252 effects and a film-level kit that places each role against the music bed and the cut, with measured onset, peak and end — no models loaded, so those commands are fast.

For agent hosts, there are also two bundled skills: `skills/earshot` (which command answers which question, how to read verdicts, when not to trust them) and `skills/real-sound` (a full process for premium soundtracks from licensed recordings, including licence checks and a deterministic mixer).

## The Numbers, and the Honest Catch

Earshot's validation page is unusual in that every figure names the command that produced it, run on a Ryzen 7 260 laptop CPU with two to three threads. The claims worth remembering:

- **Matching descriptions**, on a held-out library of 125 real recordings with nothing tuned on it: a "strong" verdict is the right *kind* of sound 98% of the time, and the exact variant 61% of the time.
- **Real vs code-synthesized**: held-out ROC-AUC 0.92 with whole sound families held out. Firm verdicts call 6.7% of real clips synthesized and 5.5% of synthesized clips real; about a fifth of clips come back "uncertain".
- **Listening through a soundtrack**: 93% of placed effects in a 60-second mix are detected as events, 89% of the quiet ones under music. A 60-90 second film takes about 1.5 minutes on a laptop CPU.

![Validation numbers with their measuring commands — held-out match accuracy, realness ROC-AUC, event detection through a mix, and the launch-film scorecard baseline](/images/reviews/earshot-review-2026/validation.png "The docs/VALIDATION.md page — each claim tied to a reproducible command rather than a vibe")

The catch is the one the author writes himself. The forge search optimises earshot's own models, and those models can be pleased without the sound getting better: after a search, made sounds pass every model check, held-out included, so the checks stop separating made from real — the 1/3-octave measurement still can. A modal resonator plus a room and a noise floor reads "real" to the realness model. The documented conclusion is to judge by model-free measurements, spectrograms beside references, robust re-renders on new seeds, and a human blind test. That is admirably candid, and it changes how you should deploy this: earshot is a **filter that removes the obviously wrong 90%**, not an arbiter of the last 10%.

The operational shape has its own tax. Each CLI invocation is a fresh process that loads the models in roughly 20-40 seconds before answering — `measure`, `sfx` and `kit` load none. Ten shell calls in a loop is ten loads. Use the MCP server (models stay warm) or a single Python script importing `earshot.api`. That guidance is in the README, but it is the first thing a new integrator gets wrong.

## Where It Fits

The clearest use case is an agent that builds video: it renders a product demo, then uses `kit init` / `kit render` to place effects at measured sync points, `critique` to find the moment nothing reaches body level, and `forge` to make the one whoosh that no library has. A second use case is selection at scale: an agent pulling assets from five sound libraries ranks them with `rank`, verifies the winner with `match`, and only escalates ambiguity to a human. A third is triage for humans: `describe` plus `realness` turns a folder of 200 unlabelled clips into a searchable, filterable table before anyone puts on headphones.

Ecosystem caveats are real. It is Python plus a torch CPU wheel plus ffmpeg, which is a heavier handoff than a single binary, and the shipped vocabularies are strongest exactly where the author tested them — motion design, UI, key presses, impacts, whooshes, and the launch-film idiom. Zips, long glides and swipes are explicitly untested. The open issue list is normal for a two-week-old launch, not alarming: NaN/Inf sample handling, media glob correctness, install ergonomics, thread pinning.

That is the trade. For **$0 and a CPU**, you get an agent that can hear well enough to catch the errors humans catch, and can make sound in code well enough to iterate — with a documented map of where its own judgement stops being trustworthy. Rarely does a two-week-old repository hand you the caveats along with the claims.
