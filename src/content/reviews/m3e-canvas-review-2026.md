---
title: "m3e-canvas Review 2026 — Sketch Material 3 Expressive Screens in the Browser, Link Them, and Copy a Vibe-Coding Prompt"
date: 2026-09-04
author: "AIPlaybook Editorial Team"
category: "Design"
tags:
  - "m3e-canvas"
  - "Material-3-Expressive"
  - "Material-Design"
  - "Vibe-Coding"
  - "Design-Tool"
  - "UI-Design"
  - "Nextjs"
  - "React"
  - "Prompt-Engineering"
  - "Android"
  - "Open-Source"
  - "lnkiai"
cover: "/images/reviews/m3e-canvas-review-2026/cover.png"
meta_description: "m3e-canvas is an MIT-licensed browser design tool (created 2026-09-02, 450+ stars in two days) for sketching Material 3 Expressive screens and turning them into prompts for AI coding tools. You drag and drop M3E parts — buttons, FABs, chips, app bars, navigation bars, cards, dialogs, switches, sliders — onto phone screens, link them with tap and swipe navigation, add real M3 Expressive transitions and loading indicators, tune the four theme axes (color, shape, type, motion), and export the whole design as a concise natural-language prompt in English, Japanese or Chinese that your AI coding tool can build from. The README shows a habit-tracker sketched in the editor running as a real Android app built from the generated prompt. It is a static Next.js app with no backend — everything saves to localStorage — with a phone-friendly buttons-only editor. This review covers the editor features, the prompt pipeline, the honest limits (M3E-only, 2 days old, solo-maintained), and who it's for."
rating: 7.3
dimensions:
  ease-of-use: 7.5
  features: 7.5
  value: 7
  performance: 7.5
  ecosystem: 6.5
pros:
  - "A genuine design-to-prompt pipeline for vibe coding: instead of describing a Material 3 screen to an AI tool in prose, you sketch it with real M3E parts, link screens, and export a concise prompt (English/Japanese/Chinese) that encodes layout, overlaps, navigation and behavior notes — the README's demo shows a sketched habit-tracker built by an AI coding tool and running on Android"
  - "The parts library is real Material 3 Expressive, not rectangles with rounded corners: buttons, icon buttons, FABs, split buttons, FAB menus, chips, app bars, navigation bars, floating toolbars, tabs, search bars, cards, lists, dialogs, snackbars, text fields, toggles, sliders — with the shape-morphing M3E loading indicator ported from material-components-android"
  - "Interaction is designed in, not described: parts can get tap targets with slide/fade/expand transitions (back plays in reverse), screens can open on left/right/up/down swipes with the preview following your finger, and toggle buttons flip style and icon on tap — the preview is tappable, so the flow is verified before the prompt is written"
  - "Magnetic connections and explicit layout description solve the classic vibe-coding failure: bring two buttons together and they fuse into a connected group with softened corners; layers and groups preserve z-order; and the generated prompt names overlaps and side-by-side rows explicitly so the AI-built layout keeps them"
  - "The four M3E theme axes in one panel: color (seven presets or a seed color generating a full Material 3 scheme, light/dark, three contrast levels, dynamic color), shape (square/rounded/full for every part at once), type (Roboto/Roboto Flex/Roboto Serif/system with emphasized styles) and motion (standard or expressive spring — which also drives the preview)"
  - "Zero backend, zero signup: static Next.js export with localStorage persistence, undo/redo, keyboard shortcuts, PNG screen export, a phone-friendly buttons-only editor, and a live demo at lnkiai.github.io/m3e-canvas"
cons:
  - "Committed to exactly one design language: Material 3 Expressive. If your target is iOS, a web dashboard, or a non-Material product, this isn't the tool — it deliberately produces prompts for M3E-shaped apps (Android, or m3e Lit web components)"
  - "Two days old at review time (created 2026-09-02): solo-maintained (15 commits), zero open issues partly because there's been no time for them, and no community contributions, discussions or third-party content yet — the 459 stars are momentum, not maturity"
  - "It doesn't generate anything itself: m3e-canvas is a front-end for your AI coding tool. Output quality tracks the tool you paste the prompt into, and the tri-lingual prompt export (EN/JA/ZH) is a fixed pipeline rather than a tunable template"
  - "The full multi-screen editor is desktop-browser only; the phone version is a deliberately reduced buttons-only editor with a bottom-sheet inspector — fine for tweaks, not for building a flow on the go"
  - "No team or project features: everything lives in your browser's localStorage, so there's no sharing, no versioning across machines, and no export of the editable design (only the prompt and PNG screens)"
best-for: "Android and Material 3 app developers who vibe-code with AI tools and are tired of describing screens in prose — sketch the M3E screen, link the flow, copy the prompt, and let Claude Code/Cursor/etc. build it; also useful as a fast M3E mockup tool even before AI enters the picture"
price: "Free, MIT, open source (TypeScript, Next.js 16 + React 19). No backend, no API keys, no accounts — runs entirely in the browser, with a free live demo hosted on GitHub Pages"
---

## The Pitch: Draw the Screen, Copy the Prompt, Let the AI Build It

The weakest link in vibe coding a UI is the brief. Describe a Material screen to an AI coding tool in prose and it will invent the layout, the spacing and the component choices — usually not the ones you wanted. m3e-canvas, created September 2, 2026 by `lnkiai`, removes prose from the equation: you *sketch* the screen with real Material 3 Expressive parts in the browser, link screens into a flow, tap through the preview to check it, and export the whole design as a concise prompt your AI coding tool can build from. The README leads with the proof: a habit-tracker sketched in the editor on the left, and the same app — built by an AI coding tool from the generated prompt — running on Android on the right.

In two days the repo drew 459 stars and 27 forks. There is no HN or Reddit thread yet and zero open issues — it's brand new, solo-maintained (15 commits from `lnkiai` plus dependabot), and already at the top of its niche. The star velocity says the itch is real: designers and developers sketching M3E screens want the AI to build what they actually drew.

## The Editor: M3E Parts, Magnetic Connections, Tappable Flows

The parts palette is the first thing that separates this from a generic diagram tool. Buttons, icon buttons, FABs, split buttons, FAB menus, chips, app bars, navigation bars, floating toolbars, tabs, search bars, cards, lists, dialogs, snackbars, text fields, switches, checkboxes, radio buttons, sliders, text, images, badges, boxes and dividers — all drawn to Material 3 Expressive, including the shape-morphing loading indicator ported from `material-components-android` and wavy linear/circular progress indicators. This is the design system, not an approximation of it.

Two interactions are worth calling out because they're the difference between a mockup and a design. **Magnetic connections**: bring two buttons or list items close and they fuse into a connected group, the corners softening as they meet — the tool understands M3E container grouping physically, not as a checkbox. **Designed-in navigation**: any tappable part, app-bar icon or nav-bar destination can get a target screen and a transition — slide from any of four sides, fade, expand, or none — with arrows showing the flow on the canvas. The preview is tappable: tap through the flow, and back plays the transition in reverse. Screens can also open on left/right/up/down swipes, with the preview following your finger and the reverse swipe going back. Toggle buttons flip icon and style on tap.

Layers and groups handle the fiddly part of design tools — z-order per screen via a layers panel, multi-select grouping that keeps overlaps and moves parts as one — and alignment guides, undo/redo and keyboard shortcuts round out the editor. Everything auto-saves to localStorage.

## The Theme Panel: Four M3E Axes, One Panel

Material 3 Expressive is defined by four axes, and m3e-canvas puts all of them in one panel. **Color**: seven presets, or one seed color that generates a full Material 3 scheme you can fine-tune, with light/dark, three contrast levels and a dynamic-color switch that matches the phone wallpaper. **Shape**: square, rounded or full corners for every part at once. **Type**: Roboto, Roboto Flex, Roboto Serif or the system font, with the emphasized styles. **Motion**: the standard or the expressive spring scheme — which also drives the preview, so the transitions you export are the transitions you saw.

## The Prompt Pipeline: What the AI Actually Receives

The export is the product. The whole design — or a single screen — becomes a concise natural-language prompt in Japanese, English or Chinese, and crucially it includes your own notes on what each part does. The prompt describes overlaps and side-by-side rows *explicitly* so the generated layout keeps them; per-part behavior notes carry into the brief. You can copy the prompt or save a screen as a PNG.

This is where the tool is cleverest and most honest at once. It doesn't generate UI itself, and it doesn't pretend to. It's a front-end for your AI coding tool: the demo pairs it with an AI tool that produced a working Android app from the prompt. The pragmatic sibling project is `matraic/m3e` — Material 3 Expressive as Lit web components with React bindings — which the README points to as "a good home for the screens you sketch here." Sketch in m3e-canvas, build with m3e components: that's the intended workflow, and it's a coherent one for the M3E ecosystem that's forming around the new Material language.

## Phone Editor, Zero Backend, and the Details

On a phone you get one fixed screen and a buttons-only editor: tap the plus to add a button, tap a button to move it, edit text/icon/style in a bottom sheet. The full multi-screen editor is for desktop browsers. The app is a static Next.js 16 + React 19 export — no backend, no signup, no API keys — with a GitHub Pages live demo at lnkiai.github.io/m3e-canvas, and sub-path hosting handled via `NEXT_PUBLIC_BASE_PATH` at build time. Contributions, part requests and PRs are welcome via CONTRIBUTING.md, with conventions spelled out (English comments, three languages for every string); questions go to GitHub Discussions.

## Honest Limits and Who It's For

The limits are real and worth stating plainly. m3e-canvas is committed to exactly one design language — if your target is iOS, a generic web dashboard or a non-Material product, it produces the wrong prompts. It is two days old, solo-maintained, with no community content beyond stars and forks; expect rough edges and fast iteration rather than stability. It generates nothing itself — output quality tracks the AI tool you paste into. And everything lives in localStorage: no sharing, no cross-machine versioning, no editable-design export (only prompt and PNG).

For Android and Material 3 developers who vibe-code, though, this closes a real gap: sketch the M3E screen, link the flow, copy the brief, and the AI builds what you drew instead of what it imagined. Even without AI in the loop it's a fast M3E mockup tool with honest previews. Watch it for the m3e component ecosystem to mature around it — the pairing is the actual product.
