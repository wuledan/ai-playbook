---
title: "LLM Simulation Learning Tutorial — How to Turn Any Complex Topic Into a Playable Game"
date: 2026-08-10
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags:
  - "LLM-Learning"
  - "Claude-Code"
  - "OpenCode"
  - "GitHub-Pages"
  - "Simulation"
  - "Interactive-Learning"
  - "Prompting"
  - "Plan-Mode"
cover: /images/tutorials/llm-simulation-learning-tutorial-2026/cover.png
difficulty: "intermediate"
meta_description: "Learn how Laurentiu Raducu's 456-point HN workflow turns complex topics into interactive low-poly simulation games with LLMs: build a knowledge base in plan mode, verify it, generate a Rollercoaster-Tycoon-style simulation, and publish to GitHub Pages — with community feedback on why it works and where it falls short."
---

## Introduction

On August 9, 2026, **"How I use LLMs to learn complex topics"** by Laurentiu Raducu hit **456 points and 262 comments** on Hacker News. The title undersells it — HN's ventana corrected the framing immediately: "Use LLM to learn complex topics' here actually means that the author asks an agent to describe the problem area, and then implement a simple web-based simulation game, and by playing that game, the author actually learns about the topic and its constraints. They use chip making as an example. That's actually a fun way to learn processes!"

The core idea: instead of asking an LLM to *explain* a topic, ask it to build a **playable low-poly simulation** of the topic, then learn by watching the system work — sand to silicon, ore to rocket engine, tokens to language. Raducu has shipped **ChipTycoon** (chip fabrication), **Token Town** (how LLMs work), **EngineWorks** (F1 engines), a rocket engine page, and an EUV lithography simulator, all as free GitHub Pages sites.

This tutorial walks through the full workflow so you can build your own — including the community's strongest criticisms, which matter more than the hype.

## Why Simulations Beat Bullet Points

Raducu's starting problem is one most of us share: "I personally find the style used by LLMs to explain things difficult to follow. It's just too simplistic and depending on the number of emojis used, a bit annoying too." Reading a summary, a list, or even a good textbook doesn't build a mental model of a *process* — where inputs transform into outputs through constraints, bottlenecks, and trade-offs.

A simulation changes the learning mode from **passive reading to active watching**. "Surfing the web, I asked myself what if there would be a game to get you through the process of building a chip at a fab? For sure learning this way will stick, since you can map concepts with objects within the game."

The key advantage over a static explainer: **you see the state change**. In ChipTycoon you follow a cart from the moment sand is collected to the moment a finished chip is delivered to a data center — and watch the cart's contents change at every station (quartz → ingot → wafer → die → packaged chip). That temporal, causal chain is exactly what LLM prose flattens.

## Step 1: Build a Foundation Knowledge Base in Plan Mode

The first move is **not** "explain X to me." Instead, Raducu uses **plan mode** — available in Claude Code and OpenCode — to have the model construct a structured knowledge base for the topic:

> "In plan mode (using CC, or OpenCode) I ask a model to build the foundational knowledge for X topic."

Plan mode matters because it forces the model to produce a **reasoned, reviewable artifact** instead of streaming confident prose. You want the knowledge base structured as a process: the ordered stages, the inputs/outputs of each stage, the physical/chemical/logical transformations, and the constraints (temperatures, tolerances, throughputs).

**Prompt template that works:** "Build a foundational knowledge base for [topic] as a process. For each stage, list: input materials/state, transformation step, output, key parameters and tolerances, and common failure modes. Structure it so a simulation could be built directly from it."

## Step 2: Make the Model Review Its Own Knowledge Base

Raducu's second step is the one most people skip: **ask it to review the accuracy of what it just built.**

> "I ask it to review the accuracy of the knowledge base it built in the previous step."

This is a cheap hallucination filter. A self-review pass catches obvious inversions (e.g., oxidation vs. reduction steps), wrong units, and invented details — but treat it as a **first filter, not a guarantee**. HN's IshKebab nailed the residual risk: "How do you know if you're learning this for the first time? Very risky to learn from LLMs. I've done it, but you have to keep your wits about you. Lots of 'oh of course you're right - what I just told you was completely wrong'."

For topics where accuracy is life-critical (medical, structural, safety), add an external check: cross-reference the knowledge base against a textbook, a standards doc, or Wikipedia's citations. The self-review catches model-internal inconsistencies; only an external source catches confident wrongness.

## Step 3: Generate the Simulation

Now the fun part — have the model build the simulation itself:

> "I proceed asking it to build a simulation of that topic in a low-poly, Rollercoaster Tycoon-like animation. I add some UX elements as well, like the page needs to be visible on both large and small screens, have controls to stop the flow whenever I want etc."

Concretely, that prompt should specify:

- **Visual style**: low-poly 3D, Rollercoaster Tycoon-like (simple geometry reads instantly and avoids the uncanny valley of half-finished realism)
- **Responsive layout**: visible on large and small screens
- **Flow control**: play/pause/step controls so you can stop the process and study a stage
- **State visualization**: the "cart" that visibly transforms at each station — this is what makes the causal chain learnable

One clarifying note from the author: he does the "100% accurate and free of hallucinations" claim about the *result* — but as HN's user- pointed out, the textual quality inside the generated sims can be thin: "click around the stages and the text is not high quality at all. The snippy titles, abbreviated explanations… I wish a few more iterations and thought was put into the actual main textual content."

**Fix:** budget one extra iteration specifically for the in-simulation text. Ask the model to expand each stage's explanation to 2–3 substantive sentences with real numbers, then review those strings yourself before shipping.

## Step 4: Publish to GitHub Pages (Free Hosting)

> "I then push it to a new repo and enable GitHub Pages for it."

This is the lowest-friction publishing path in existence: push a static site to a GitHub repo, enable Pages, and you get a live URL in minutes — no server, no CI config, no cost. Because the simulation is a single-page static app, it's the perfect fit.

The repo pattern Raducu uses is worth copying: **one topic per repo** (`ChipTycoon`, `rocket-engine`, `token-town`, `engineworks`, `euv-lithography`), each a self-contained simulation. That gives you a portfolio of interactive explainers that doubles as a teaching record — and each one is independently shareable.

## Step 5: Upgrade With Challenges (Optional but Recommended)

Raducu suggests two improvements that turn the sim from a passive video into an active test:

1. **Add challenges**: "Trying to answer questions about a previous step in the chip manufacturing process will help you retain the knowledge tremendously."
2. **Add puzzles**: "Add intuitive puzzles too that will help you learn even better."
3. **Upgrade visuals**: his `unreal-game-assets-creation-skill` converts pictures into 3D objects so the low-poly placeholders can be swapped for realistic representations when the imagination gap is too wide.

This matches learning science — testing yourself beats re-watching. If you want the *study* variant without building a game, HN's spacedcowboy has a cheaper trick: "ask an LLM to give you a quiz on a topic, and then discuss your answers with it. Surprisingly effective." chasd00 scaled that exact idea: an AI read 800 slides of study material and produced a 100-page guide with quizzes — "I used that in place of the decks to prepare. It worked very well."

## The Community's Honest Assessment

The thread's value is that it didn't just cheer. Three critiques are worth internalizing:

**1. Does it actually teach, or just entertain?** lacedeconstruct: "Its fun but is it really effective? I checked the LLM one and I came out more confused about a topic I already know about… I find the best way to learn using LLMs is to just generate an example, try to somewhat get a mental model of how it works and then ground my understanding with traditional documentation." sixtyj added the pedagogy caveat: "Game-based learning… works if someone else prepares 'a game' for you. E.g. like a dungeon master. Otherwise you probably get more confused."

**2. Simulations can hide complexity.** dwa3592: "The level at which these animations are playing, they are actually hiding the 'complexity' of these topics." A smooth cart animation of chip fabrication is a map, not the territory — good for orientation, insufficient for depth.

**3. There's already free content.** dcreater: "YouTube has so many truly wonderful videos on chip production… a lot of people are in this AI maxxing phase where they reach for AI for everything despite there being ready, high quality things already available for free." AlotOfReading went further on chip production specifically: "You can't really understand the relationship between Micron and TSMC without some awareness of the trade-offs of memory processes for peripheral transistors" — the public-level model misses strategic texture.

The balanced take comes from simonw: "There's a big gap between being able to ask questions about something and *understanding* something. The more things you understand, the higher the chance you'll spot a situation to use them in the future." A simulation is a tool for building *some* understanding fast; it's not a replacement for the long game of reading, building, and breaking things yourself.

## Alternative LLM Learning Techniques (From the Thread)

If full simulation feels like overkill, the thread produced several lighter techniques:

- **Readable RFC rewrites** (rickcarlino): ask an LLM to rewrite an RFC or spec you care about in plain readable language — "It is not precise enough for implementation use, but it has increased my understanding of the underlying RFC."
- **Literate implementations** (rickcarlino): "Asking Codex to implement complex things, like a Kademlia DHT or BitTorrent client in a literate style with the explicit purpose to increase understanding by reviewing the source code."
- **Text adventures** (ultra_nick): "Last month, I read The Prince and had it make a text adventure campaign for me."
- **Interactive practice blocks** (latent-l): "Focused more on having 'practice sessions' with coding blocks to test content. Using webassembly and mock servers to mock backend endpoints."

## FAQ

**Do I need to know how to code?** Not really — the LLM writes the simulation. You need to be able to run plan mode in Claude Code or OpenCode, review generated code at a high level, and push a repo to GitHub. Basic git knowledge is enough.

**Which model/tool should I use?** The author used Claude Code or OpenCode in plan mode. Any model with strong front-end generation and a plan/review mode works; the review step matters more than the model choice.

**How long does one simulation take?** Raducu's workflow is prompt-driven; the code generation is minutes. The time cost is in the review step — and as aswegs8 observed, "that whole game could be like 15 mins of prompting" for a simple one. Expect a couple of hours end-to-end for a polished version with good text and challenges.

**Is the content reliable?** Only as reliable as your review. The self-review step catches internal inconsistencies; external sources catch confident wrongness. Never learn safety-critical material exclusively from an LLM-generated sim.

**Can I host it for free?** Yes — GitHub Pages hosts static single-page apps free, which is exactly what these simulations are.
