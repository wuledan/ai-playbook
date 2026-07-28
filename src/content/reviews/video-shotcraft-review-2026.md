---
title: "Video ShotCraft Review 2026 — 104 Cinematic Shot Recipes That Turn Claude Code Into a Motion-Design Studio"
date: 2026-07-29
author: "AIPlaybook Editorial Team"
category: "AI Video Production"
tags: [video-shotcraft, claude-code, codex, remotion, ai-video, video-production, motion-graphics, agent-skills, product-video, promo-video, cinematic]
cover: "/images/reviews/video-shotcraft-review-2026/cover.png"
meta_description: "Hands-on Video ShotCraft review 2026 — an AI agent skill for Claude Code and Codex that produces cinematic product videos with 104 shot recipes, 161 motion styles, and Remotion. Includes real gallery previews and production walkthrough."
rating: 8.4
dimensions:
  ease-of-use: 8
  features: 9
  value: 9
  performance: 8
  ecosystem: 7
pros:
  - "104 pre-built shot recipe cards covering Opening & Brand, Typography, UI Entrance, Camera, Data, Interaction, Transitions, Rhythm, Light & Emphasis, and Outro — more library depth than any template-based video tool"
  - "161 motion variants with live previews in an interactive gallery — search, preview, and copy shot names before firing up the agent"
  - "Works as a Claude Code or Codex skill — just hand the repo URL to your agent and describe your product"
  - "Ink Press production-ready template: 36.2 seconds, 1920x1080, 30fps, 10 shots, paper-ink-amber style with 2.5D camera moves and full SFX pass"
  - "Real page captures, beat-synced cuts, film-grade sound design — not just talking-head overlays or generic slideshows"
  - "Apache-2.0 licensed, fully open-source, self-contained Remotion project"
cons:
  - "Requires Claude Code or Codex access — not a standalone video editor, you need an AI coding agent to drive it"
  - "Heavy rendering: Remotion video export needs Node.js 22+, and a full 36-second promo can take 5-15 minutes depending on hardware"
  - "Headless rendering quirks on Linux (concurrency limits, headless Chrome detection) — the README documents workarounds, but it's not plug-and-play for CI"
  - "Gallery page is a static demo — you can preview motions, but you can't tweak or export directly from the gallery"
  - "Skill ecosystem dependency: your video quality depends heavily on the agent's ability to follow the shot card recipes correctly"
best-for: "Product teams, marketers, and indie developers who need high-quality cinematic product videos without hiring a motion designer — point an AI agent at your product and get a finished promo in under an hour"
price: "Free (open source, Apache-2.0)"
---

## Overview

Video ShotCraft is an AI agent skill that transforms Claude Code or Codex into a motion-design studio. Released in mid-July 2026 by Vincent Wei, it has rocketed to **2,500+ GitHub stars** in under two weeks and is currently trending on both daily and weekly GitHub trending charts for TypeScript.

The core premise is simple but ambitious: instead of learning After Effects or hiring a motion designer, you hand a repo link to your AI coding agent, describe your product, and get back a cinematic promo video rendered with [Remotion](https://www.remotion.dev/) — real product screenshots, 2.5D camera moves, beat-synced cuts, and film-grade sound effects included.

## What Makes Video ShotCraft Different

There are plenty of AI video tools, but most fall into two categories: text-to-video generators (Sora, Runway, Kling) that hallucinate product visuals, and template-based editors (Canva, Descript) that limit creative control. Video ShotCraft takes a third path:

1. **Motion-design agency as an agent skill** — The skill ships 104 curated shot recipes, each with multiple motion variants. The agent picks shots based on your product, storyboards the sequence, and renders with Remotion.

2. **Real screenshots, not generated imagery** — The skill captures your actual product pages and animates them with camera moves, transitions, and overlays. No hallucinated UIs, no generic stock footage.

3. **Production-grade output** — Beat-synced cuts, multi-plane parallax, SVG draw traces, CRT-style HUD reveals, before-after sliders, and a full SFX pass. This is not a slideshow maker.

4. **Gallery-driven workflow** — Browse all 161 motion previews in the live gallery, pick the ones that match your brand, and tell the agent which shots to use.

## The Shot Recipe Library

The 104 recipe cards are organized into 10 categories:

| Category | Cards | What They Do |
|----------|-------|-------------|
| **Opening & Brand** | 15 | Logo stings, brand-frame reveals, ink-stamp opens, product shots with brand colors |
| **Typography** | 27 | Kinetic type, gradient word sweeps, letter-space reveals, typewriter effects, beat-step lists |
| **UI Entrance** | 28 | Card flock tumbles, bubble swarm takeovers, command palette drops, deck-deal flyins |
| **Camera** | 16 | Crane rises, crash-zoom punches, graze-face tours, multiplane parallax, dolly-zooms |
| **Data** | 12 | Live chart writes, oscilloscope streams, needle-sweep gauges, dataviz landscape opens |
| **Interaction** | 13 | Cursor performances, input triggers, icon burst confirms, collab-cursor duets |
| **Transitions** | 22 | Color-block step wipes, circle-match iris, bottom-push stacks, axial stretches, particle dissolves |
| **Rhythm** | 15 | Accelerando beat cuts, pulse-timed reveals, hit-counter combos, beat-synced color cycles |
| **Light & Emphasis** | 21 | Spotlight sweeps, glow-orb ambients, sheen sweeps, halation blooms, gradient sweeps |
| **Outro** | 8 | CTAs, end cards, social links, brand-frame closures, call-to-action beats |

Each card comes with 1-3 motion variants (styles) — totalling 161 distinct motion previews. For example, the "beat-cut" category has both "beat-cut-accelerando" (six hard cuts with halving intervals) and "paparazzi-flash" (rapid flash transitions).

## The Ink Press Template

The skill ships a production-ready template called **Ink Press**: 36.2 seconds at 1920×1080, 30fps, with 10 shots in a consistent paper-ink-amber aesthetic. The template includes:

- 2.5D real-page camera moves
- Title cards with brand typography
- Cinematic transitions matching the ink theme
- A fully pinned SFX pass (ambient drift, paper rustle, ink stamp, and beat-synced cuts)

To use it, you tell your agent: "Use video-shotcraft to make a promo for my product with the Ink Press template." The agent swaps in your product's screenshots, copy, and branding.

## How It Works: The Agent Workflow

### Installation

```bash
# Install via skills CLI
npx skills add Vincentwei1021/video-shotcraft

# Or clone and link manually
git clone https://github.com/Vincentwei1021/video-shotcraft.git
cd video-shotcraft
ln -s "$(pwd)" ~/.claude/skills/video-shotcraft   # for Claude Code
# or
ln -s "$(pwd)" ~/.codex/skills/video-shotcraft    # for Codex
```

### Usage Flow

1. **Decide on shots** — Browse the gallery at `vincentwei1021.github.io/video-shotcraft/library.html` and pick shots that match your product and brand style
2. **Prompt your agent** — "Use video-shotcraft to create a promo for my desktop app. Use the deck-deal-flyin and row-embed shot cards to present this feature."
3. **Agent storyboards** — The agent loads the shot recipe cards, arranges them into a sequence, and generates the Remotion composition
4. **Agent renders** — Remotion captures real product screenshots, applies animations, and renders the final MP4
5. **Review and iterate** — Watch the output, ask for changes ("Make the opening slower", "Switch to the spotlight-sweep variant"), and re-render

### Headless / CI Rendering

The README documents practical rendering gotchas for CI environments:

- **Concurrency cap** — Low-core machines need `--concurrency=1`
- **Headless Chrome** — Recent Chrome dropped old headless mode; use a `chrome-headless-shell` binary
- **Memory** — Remotion is memory-intensive; the 36-second Ink Press template needs roughly 4GB RAM

## Community & Activity

- **GitHub Stars:** 2,500+ (as of July 29, 2026)
- **Daily Rank:** Trending #1 TypeScript on some days
- **License:** Apache-2.0
- **Tech Stack:** TypeScript, Remotion, React, Motion
- **Gallery:** vincentwei1021.github.io/video-shotcraft/
- **Templates:** Ink Press (shipped), more on the way

## Verdict

Video ShotCraft fills a gap that no other tool addresses: **cinematic product videos, driven by an AI agent, using your real product screenshots, with film-grade motion design**. It's not a replacement for After Effects for complex animations, but for 90% of product marketing videos — launch promos, feature demos, product tours — it's faster and cheaper than any alternative.

| What | Score |
|------|-------|
| **Ease of Use** | 8/10 — Gallery browsing + one agent prompt is elegant; Remotion rendering complexity is the bottleneck |
| **Features** | 9/10 — 104 shots × 161 styles is unmatched depth; Ink Press template proves production readiness |
| **Value** | 9/10 — Free, Apache-2.0, replaces thousands in motion design costs |
| **Performance** | 8/10 — Render times are reasonable (5-15 min); headless CI setup needs attention |
| **Ecosystem** | 7/10 — Requires Claude Code or Codex; Remotion dependency; gallery is reference-only |

**Overall: 8.4/10 — Silver+**

For product teams who want cinematic launch videos, feature demos, or promo content without hiring a motion designer — and already use AI coding agents — this is the best tool available. The shot recipe library alone is worth the price of admission.

## How to Get Started

```bash
# Browse the gallery first
open https://vincentwei1021.github.io/video-shotcraft/library.html

# Install the skill
npx skills add Vincentwei1021/video-shotcraft

# In Claude Code or Codex, just say:
# "Use video-shotcraft to make a promo for my product"
```
