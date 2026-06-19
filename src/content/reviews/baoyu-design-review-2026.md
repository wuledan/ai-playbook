---
title: "Baoyu Design Review 2026 — Run Claude Design Locally as an Agent Skill"
date: 2026-06-20
author: "AIPlaybook Editorial Team"
category: "Design"
tags: [baoyu-design, claude-design, agent-skills, claude-code, claude-opus, cursor, ui-design, prototyping, html-mockups, open-source, review, "2026"]
cover: "/images/reviews/baoyu-design-review-2026/baoyu-design-cover.png"
meta_description: "Baoyu Design review 2026 — run Claude Design locally as a portable Agent Skill for Cursor, Claude Code, and Codex. Generate polished UI mockups, prototypes, decks as self-contained HTML. Features, workflow, and comparison."
rating: 8.0
dimensions:
  ease-of-use: 7.5
  features: 8.5
  value: 9
  performance: 8
  ecosystem: 7.5
pros:
  - "Brings Claude Design capabilities to your local editor without needing claude.ai — full design process including mockups, prototypes, wireframes, and decks"
  - "Supports multiple coding agents — Cursor, Claude Code, Codex CLI, and Claude Desktop — as long as they can read files and access the browser preview"
  - "Iterative visual feedback loop is genuinely fast — point at a button in the live preview, describe the change, and the agent edits the underlying HTML"
  - "Self-contained HTML output lands in a dedicated project folder — versionable, forkable, exportable to Figma/Canva/PPTX/PDF"
  - "Rich built-in skills: design systems, mobile prototypes, animated video, speaker notes, Figma .fig offline decode, GitHub repo import"
  - "Starter components library saves agents from hand-rolling basics — iOS/macOS UI elements, layout grids, typography scales, color palettes"
  - "MIT licensed — free to use, modify, and redistribute for any purpose, including commercial projects"
cons:
  - "Requires Opus 4.8 for best results — weaker models produce visibly worse output, limiting the tool to subscribers of premium tiers"
  - "Learning curve is steep — you need to understand Agent Skills, local agent configuration, and browser-based iteration before you can be productive"
  - "No cloud rendering — all HTML generation happens through your agent, so complex prototypes can hit context window limits"
  - "Skill file is large and detailed — loading it into your agent consumes significant context budget, especially on models with smaller windows"
  - "Import from Figma requires offline .fig file — you need to export from Figma first, no live plugin integration"
  - "Video export depends on external tools (html-video or third-party screen recording) — not natively built in"
best-for: "UI/UX designers and frontend developers who want to design in their coding environment using Claude Opus 4.8, producing production-ready HTML mockups without leaving the editor"
price: "Free (open-source MIT) — requires Claude Opus 4.8 subscription ($200/mo for Pro) or equivalent capable model"
---

# Baoyu Design Review 2026 — Run Claude Design Locally as an Agent Skill

## What Is Baoyu Design?

**Baoyu Design** (宝玉设计) is an open-source **Agent Skill** that packages Claude Design's capabilities into a portable, local-first tool. Instead of going to `claude.ai/design` to generate UI mockups, you install baoyu-design as a skill in your local coding agent — Cursor, Claude Code, Codex CLI, or Claude Desktop — and get the same quality output right in your editor.

Created by **JimLiu** and launched on **June 7, 2026**, it has quickly reached **1,626 GitHub stars** with 124 forks. The name "Baoyu" references the protagonist of *Dream of the Red Chamber* — fitting for a tool that brings the elegance of Claude Design to the messy reality of local development workflows.

Licensed under **MIT**, it's free for any use — personal, commercial, or enterprise.

## How It Works

Baoyu Design is a **single, comprehensive skill file** that instructs your coding agent to follow Claude Design's design methodology. When loaded, it transforms the agent into a design assistant capable of:

1. **Clarifying requirements** — asking smart questions about the design brief before generating anything
2. **Gathering design context** — analyzing brand guidelines, existing UI, and content requirements
3. **Producing HTML deliverables** — generating self-contained HTML files with embedded CSS, animations, and interactivity
4. **Iterating via live preview** — showing the HTML in a local browser preview where you can point and describe changes

The key insight is that Claude Design at `claude.ai/design` follows a specific design methodology — and that methodology can be distilled into a prompt-skill that any capable agent can execute.

## Best with Opus 4.8

Baoyu Design works best with **Claude Opus 4.8** — the skill is a long, demanding design brief that requires strong reasoning, visual understanding, and code generation. Running it on weaker models produces noticeably worse output:

| Model | Quality | Notes |
|---|---|---|
| Claude Opus 4.8 | ⭐⭐⭐⭐⭐ | Full design capability, polished output |
| Claude Sonnet 4 | ⭐⭐⭐⭐ | Good results, some quality loss on complex layouts |
| GPT-5 | ⭐⭐⭐½ | Functional but misses Claude's design sensibility |
| DeepSeek V4 Pro | ⭐⭐⭐ | Viable for basic mockups, struggles with complex animations |
| Gemini 2.5 Pro | ⭐⭐⭐ | Decent wireframes, weaker on visual polish |

This means the tool is effectively gated behind premium model subscriptions — primarily **Claude Pro at $200/month** for Opus 4.8 access.

## What It Can Build

Baoyu Design ships a deep bench of built-in skills organized by purpose:

### Core Design
- **Hi-fi design** — production-ready UI mockups with pixel-perfect spacing, typography, and color
- **Interactive prototype** — clickable HTML prototypes with navigation, hover states, and transitions
- **Wireframe** — quick structural layouts without visual polish, for early-stage iteration
- **Frontend aesthetic direction** — explore multiple visual directions before committing

### Presentations
- **Make a deck** — slide-based presentations as self-contained HTML
- **Speaker notes** — presenter notes embedded in the deck HTML

### Mobile & Motion
- **Mobile prototype** — phone-form-factor interactive mockups with touch interactions
- **Animated video** — CSS-animated screen recordings for product demos
- **Sound effects** — audio cues triggered by interactions

### Design Systems
- **Create design system** — establish typography scales, color palettes, spacing grids, and component tokens
- **Use design system** — apply existing design system to new designs
- **Design Components (.dc.html)** — reusable HTML components with customizable properties
- **Make tweakable** — add runtime controls so non-developers can adjust colors, spacing, and content

### Import & Export
- **Figma `.fig` offline decode** — extract layers, artboards, and styles from exported Figma files
- **GitHub repo import** — analyze an existing repo's CSS/UI to inform new designs
- **Existing HTML/CSS** — import and redesign existing web pages
- **Export**: Standalone HTML, PDF, PPTX (editable), PPTX (screenshots), MP4, Send to Figma, Send to Canva, Handoff to Claude Code

## The Iterative Feedback Loop

Baoyu Design's most innovative feature isn't in the skill file — it's in the **workflow it enables**. Because the output is plain HTML served on `localhost`, you can use your agent's built-in browser tools (Cursor Browser, Claude Preview, Codex Browser) to inspect the result, point at specific elements, and request changes:

```
You: "Make the primary button 4px more rounded"
Agent: (edits the CSS in the HTML file)
Browser preview: (updates instantly)
```

This visual second-pass editing loop is **significantly faster** than describing every change in text on claude.ai. It's the difference between "the button in the top-right section" and pointing directly at it.

## Starter Components

To save the agent from hand-rolling the basics, Baoyu Design includes **starter components**:

- iOS-style navigation bars, tab bars, and table views
- macOS-style window chrome, sidebars, and toolbar menus
- Web layout grids (CSS Grid, Flexbox)
- Typography scales (modular, responsive)
- Color palette generators (HSL, OKLCH)
- Form elements (inputs, selects, toggles, sliders)

These aren't a full design system — they're scaffolding that helps the agent produce consistent, production-quality output faster.

## Real-World Use Cases

**Solo designer-developer**: A full-stack developer needs a landing page for their new SaaS. They load baoyu-design, describe the product in natural language, and get a polished HTML mockup in 5 minutes. They iterate on the live preview until it's right, then ship the HTML as the actual landing page.

**Design handoff**: A designer exports their Figma file, loads it into baoyu-design via offline decode, and generates a set of developer-ready HTML components with a matching design system. The frontend team imports these directly into their codebase.

**Presentation mockups**: A product manager uses baoyu-design to generate slide decks for stakeholder reviews — interactive prototypes that look and feel like a real app, without investing in full development.

**Design system documentation**: A team establishes their design tokens in baoyu-design, generates the `.dc.html` component library, and hands it off to Claude Code for React component implementation — a smooth design-to-code pipeline.

## How It Compares

| Feature | Baoyu Design | Claude.ai Design | Figma | Cursor AI Design |
|---|---|---|---|---|
| **Runs Locally** | ✅ | ❌ (cloud) | ❌ (desktop app) | ✅ |
| **MIT Licensed** | ✅ | ❌ (proprietary) | ❌ | ❌ |
| **Agent Integrated** | ✅ Native | ❌ | ❌ | Limited |
| **Live Preview Iteration** | ✅ Point-and-edit | ❌ Text-only | ✅ Native | ✅ Native |
| **Model Required** | Opus 4.8 best | Claude | N/A | Any model |
| **Export Options** | HTML/PDF/PPTX/MP4/Figma/Canva | HTML | Native formats | Code only |
| **Figma Import** | ✅ Offline .fig decode | ❌ | ✅ Native | ❌ |
| **Cost** | Free (MIT) + model fees | $20-200/mo | Free-$75/mo | $20/mo |

## Verdict

Baoyu Design is a **clever distillation** of Claude Design's methodology into a portable, local-first skill. For anyone who already uses Claude Code, Cursor, or Codex CLI for development work, adding design capability to the same environment eliminates context-switching and produces faster iteration cycles.

The requirement for Opus 4.8 to get the best results is a real barrier — at $200/month for Pro, this is a premium workflow. But if you're already paying for Claude's top tier, baoyu-design unlocks **significant additional value** from that subscription.

The MIT license is commendable — you can fork, customize, and embed baoyu-design into commercial products without restriction. Combined with the starter components and comprehensive export pipeline, it's one of the most **complete open-source design tools** in the AI ecosystem.

**Rating: 8.0/10** — Genuinely useful skill that bridges AI design and local development. Premium model dependency is the main catch, but the output quality justifies it for professional use.
