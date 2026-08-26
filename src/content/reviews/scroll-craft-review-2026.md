---
title: "scroll-craft Review 2026 — A Claude Code Skill That Makes AI Websites Actually Feel Designed"
date: 2026-08-27
author: "AIPlaybook Editorial Team"
category: "Design"
tags:
  - "scroll-craft"
  - "Claude-Code"
  - "Agent-Skills"
  - "Web-Design"
  - "Scroll-Animation"
  - "Scrollytelling"
  - "Creative-Coding"
  - "Landing-Page"
  - "Design-System"
  - "Open-Source"
cover: /images/reviews/scroll-craft-review-2026/cover.png
meta_description: "scroll-craft is a Claude Code skill that builds premium scroll-driven websites with eight mutually exclusive page grammars, a fingerprint gate against repeating yourself, and a headless-browser verification pass that measures dead scroll, contrast and stalled video on the composited page. We review the interaction rules, the craft floor, and how it holds AI output to a real design standard."
rating: 7.8
dimensions:
  ease-of-use: 6.5
  features: 8.5
  value: 8.5
  performance: 8
  ecosystem: 6
pros:
  - "Treats interaction and craft as one job instead of two: scroll is the timeline, video scrubs frame-by-frame under the wheel, sections pin while their argument advances, and every build must invent one bespoke interaction that exists on that site alone"
  - "Eight mutually exclusive page grammars (filmic one-shot, chaptered editorial, live surface, continuous world, typographic poster, gallery, split stage, rhythmic cutlist) — each forbids what the others require, so two builds cannot quietly converge into the same template"
  - "The fingerprint gate is a real anti-repetition mechanism: a new build must differ from every page you have already made on at least 4 of 6 dimensions (grammar, nav, hero, act shape, close, signature move), or it changes the plan instead of the record"
  - "It verifies its own work with a headless browser that walks the page at every scroll position and measures dead scroll, cues that never reach full opacity, per-line composited contrast at the brightest frame, and clips that silently never decoded"
  - "A concrete design floor: two type families max, 45-75ch measure, 4px spacing base, six colour roles with one accent, no pure black, depth as five tools, and a refuse list that bans the feature-card grids and AI-purple gradients every other AI page defaults to"
  - "The engine is never edited per project — you theme it with six colour tokens and two fonts, which is exactly why builds stay distinct instead of looking like the same runtime skinned differently"
cons:
  - "Only ever run on Windows so far — the author explicitly notes no build has been done on a Mac, so macOS/Linux users are on best-effort path detection for ffmpeg and Chrome"
  - "Heavy setup surface: full ffmpeg with the scale filter, playwright-core plus Chrome in the build folder, Node 18+, and optional KIE_AI_API_KEY — the doctor script exists precisely because stripped toolchains fail in confusing ways"
  - "Generated video is genuinely expensive: a ten-leg continuous-world flight is real spend, though building from your own photos and footage costs nothing"
  - "Deeply opinionated on purpose — it will refuse the layouts and palettes that make AI pages recognizable and argue with you about your peak, so it is the wrong tool if you want a page that looks like everything else"
  - "No public benchmark or community forum; the signal is one creator's three showcase builds and a 1,000-star repo five days after creation"
best-for: "Designers, indie hackers and agencies who build marketing pages with Claude Code and are tired of AI output that is either well-behaved-and-forgettable or flashy-and-broken — and who want scroll-driven storytelling with a craft standard and automated self-verification"
price: "Free (MIT, Claude Code plugin marketplace: /plugin marketplace add nateherkai/scroll-craft)"
---

# scroll-craft Review 2026 — A Claude Code Skill That Makes AI Websites Actually Feel Designed

## Quick Verdict

**scroll-craft attacks the specific failure mode of AI-generated websites: output that is either "well behaved and forgettable" or "a flashy scroll animation with 2.1:1 body text and the same six sections every other AI page has."** It is a Claude Code skill (installed from the plugin marketplace, MIT-licensed, ~1,000 GitHub stars within five days of its 2026-08-22 creation) that treats interaction and craft as one job rather than two.

The core bet is that most AI page builders optimize the wrong thing: they generate a layout and sprinkle scroll effects on top. scroll-craft instead treats **scroll as the timeline** — video scrubs frame by frame under the wheel, sections pin while their argument advances, rails pan sideways, headlines assemble line by line, the page ground shifts color as you travel — and then holds the result to a *real* design standard with a headless-browser verification pass.

It is not a template, not a theme, and not a config-driven generator. It is a procedure with a hard design floor, and that is precisely why its three showcase builds (Orrery, PERKFORM, Fallowbank) look nothing alike.

## Features

### Eight page grammars, one required signature move

The skill defines **eight mutually exclusive page grammars**: filmic one-shot, chaptered editorial, live surface, continuous world, typographic poster, gallery, split stage, and rhythmic cutlist. Each grammar *forbids* what the others require — a filmic one-shot has no section boundaries, a chaptered editorial has them — so two builds cannot quietly converge into the same skeleton. Every build must also invent one bespoke interaction that exists on that site alone; a recolored spotlight does not count. The engine (scrollcraft.js + .css) is the mechanism and is **never edited per project**: you theme it with six color tokens and two fonts, write your own semantic HTML, and drive anything bespoke off the `--sc-p` custom property the engine publishes.

### The fingerprint gate

A registry (`FINGERPRINTS.md`) tracks every page you have built. A new build must differ from all previous ones on **at least 4 of 6 dimensions** — grammar, nav, hero, act shape, close, and signature move. Fail the gate and you change the plan, not the record. The registry starts empty by design: the gate exists to stop you repeating *yourself*, so your first build clears automatically and every build after it earns its place.

### The craft floor

The skill encodes a real typography and layout standard:

- **Two type families maximum**, tracking that tightens as size grows, 45–75ch measure, line height inverse to measure, light-on-dark compensated on three axes
- **A 4px spacing base** with more space above a heading than below it, and fluid section padding so a phone does not inherit desktop air
- **Color with six roles and one accent**, secondary text tinted rather than flat grey, no pure black, and a documented escape for pages that hard-cut between light and dark grounds
- **Depth as five tools** — offset shadows, edge light, scale-and-blur-as-distance, overlap, grain — rather than one shadow preset
- **A feeling curve before any act exists**: one line per act stating the emotion and what on screen causes it; two adjacent acts with the same feeling means one is filler
- **One engineered peak**, peak-end rule applied literally: the peak gets the asset budget, the silence in front of it, and the most scroll room

### The refuse list

The skill ships a refuse list of patterns it will not produce: identical feature-card grids, `01 / 06` counters, scroll cues, gradient text, em dashes, invented statistics, fake dashboards, AI-purple gradients, and the cream-and-brass artisan palette every craft brand defaults to. Brand guidelines are treated as inputs, not decoration — a brand kit's hard rules win, including rules that forbid things the skill would otherwise reach for.

### It checks its own work

A headless browser walks the finished page **at every scroll position**, waits for the video playhead to settle, and reports:

- **dead scroll** — scroll that changes nothing on screen
- **cues that never reach full opacity** — copy the reader can only ever see faded
- **contrast measured on the composited page**, per line, at the brightest frame that ever passes under it, with the direction picked per line so light-on-dark and dark-on-light are both graded correctly
- **legs stuck on a poster** — a clip that silently never decoded, which looks exactly like a paused film

Then it writes a contact sheet, because "a machine can prove a page works and cannot tell you it means anything."

## Pricing

Free and MIT-licensed. Install via the Claude Code plugin marketplace:

```bash
/plugin marketplace add nateherkai/scroll-craft
/plugin install nateherk-design
```

Requirements: Node 18+, a **full ffmpeg build** (stripped toolchains on PATH lack the `scale` filter; `SCROLLCRAFT_FFMPEG` overrides), `playwright-core` + Chrome in the build folder for the verification pass, and `KIE_AI_API_KEY` only if you want *generated* assets — building from your own photos and footage needs no key and no spend.

## Use Case: A Landing Page That Survives the Fingerprint Gate

A realistic flow for an agency that ships one marketing page a week with Claude Code:

1. `node scripts/doctor.mjs` preflights ffmpeg, Chrome and the workspace; `node scripts/workspace.mjs --ensure` seeds a workspace and an empty registry.
2. You describe the brief — a travel practice, a protein coffee, a landscape studio. The skill interviews you, picks a grammar (the first build has nothing to clear in the registry), and defines the feeling curve and the single peak before any act exists.
3. The build runs: semantic HTML over the shared engine, six color tokens, two fonts, one signature interaction invented for this page alone.
4. The verification harness walks every scroll position and reports dead scroll, faded cues, per-line contrast and stalled clips. The contact sheet shows you what the machine measured.
5. The page's grammar, nav, hero, act shape, close and signature move are recorded in `FINGERPRINTS.md`, so next week's build must clear the 4-of-6 difference bar against it.

The result: a body of work that accumulates distinct pages instead of a portfolio of the same template in different colors.

## Pros & Cons

**Pros:** interaction and craft unified under one procedure; eight grammars plus the fingerprint gate make repetition structurally impossible; a real typography/color/spacing floor replaces vibes; automated verification measures things humans miss (dead scroll, per-line composited contrast, undecoded clips); free and MIT; the changelog documents what broke on each build and the rule that came out of it.

**Cons:** Windows-only in practice so far; non-trivial setup (full ffmpeg, playwright-core, Chrome) with failure modes that only surface in misleading errors; generated video is real spend; the opinionated refuse list will fight you if you actually want a conventional AI-looking page; single-creator project with no public benchmark beyond three showcase builds.

## Alternatives

| Approach | Anti-repetition | Craft floor | Verification | Cost |
| --- | --- | --- | --- | --- |
| **scroll-craft** | 8 grammars + fingerprint gate | Explicit (type, spacing, color, depth, peak) | Headless scroll-walk + contact sheet | Free, MIT |
| **Generic AI site builders** (v0, Lovable, etc.) | None — converge on the same six sections | None — output depends on prompt luck | None | Subscription |
| **Framer AI / Webflow AI** | Weak | Design-system aware but template-bound | None | Subscription |
| **Hand-coded scrollytelling** (GSAP, ScrollTrigger) | Human discipline | Human taste | Manual | Dev time |

Nothing else in the agent-skill space ties interaction, craft and automated self-verification into one installable procedure. The nearest competitors are either prompt-luck generators or manual creative-coding stacks — scroll-craft is the first to make the *standard* the product.

## FAQ

**Does scroll-craft work on macOS?** The scripts search Windows, macOS and Linux locations for ffmpeg and Chrome, but no build has been done on a Mac — treat macOS/Linux as best-effort and set `SCROLLCRAFT_FFMPEG` / `SCROLLCRAFT_CHROME` if detection misses.

**Do I need an AI asset API key?** Only for *generated* imagery and video. Building from your own photos and footage is a first-class route with no key and no spend.

**Will it generate the same page twice?** The fingerprint gate requires 4-of-6 dimension differences against every page in your registry, so repeats get rejected at planning time — the plan changes, not the record.

**Is the engine customizable?** The engine is never edited per project. You theme via six color tokens and two fonts and drive bespoke behavior off the `--sc-p` custom property; a runtime that builds pages from a config object is exactly what makes AI sites look the same.

**What does the verification actually check?** Dead scroll, cues that never reach full opacity, per-line composited contrast at the brightest frame, and clips that silently failed to decode — plus a contact sheet of what the machine measured.
