---
title: "How to Run Claude Design Locally — Agent Skills Guide 2026"
date: 2026-06-21
author: "AIPlaybook Editorial Team"
category: "Tutorial"
tags: ["tutorial", "2026", "claude-design", "baoyu-design", "agent-skills", "cursor", "claude-code", "codex", "ui-design", "prototyping"]
cover: "/images/tutorials/run-claude-design-locally-agent-skills-guide-2026/cover.png"
difficulty: intermediate
meta_description: "Run Claude Design locally as an Agent Skill using baoyu-design. Step-by-step guide to install, configure, and use with Cursor, Claude Code, and Codex CLI for UI mockups, prototypes, and decks."
---

# How to Run Claude Design Locally — Agent Skills Guide 2026

## Why This Matters

Claude Design on claude.ai is great — but it has limitations. You're stuck in Anthropic's browser, you can't version your designs in git, and every iteration means typing the same feedback over and over.

**Baoyu Design** (宝玉设计) changes this. It's an open-source Agent Skill (MIT licensed) that gives Claude Design's capabilities to your local coding agent — Cursor, Claude Code, Codex CLI, or Claude Desktop. Your designs land as self-contained HTML files in a git-tracked project folder. You iterate using live browser previews instead of text-only descriptions. And you export to HTML, PDF, PPTX, Figma, or MP4 — all from your editor.

This tutorial walks you through installing baoyu-design, configuring it for your agent, and producing your first design in under 15 minutes.

## Prerequisites

| Requirement | Details | Estimated Cost |
|-------------|---------|:--------------:|
| **Coding Agent** | Cursor, Claude Code, Codex CLI, or Claude Desktop | $10-20/mo |
| **Premium Model** | Claude Opus 4.8 recommended ($200/mo Pro) | $200/mo |
| **Node.js 20+** | For running the agent CLI | Free |
| **Git** | For versioning your designs | Free |
| **Browser** | For live preview iteration | Free |

> **💡 Model note:** Baoyu Design works best with Claude Opus 4.8. Sonnet 4 produces good results, but weaker models (DeepSeek V4, Gemini 2.5 Pro) struggle with complex layouts. If you don't have Opus 4.8, you can still follow along — just expect quality differences on intricate designs.

## Step 1: Install Baoyu Design

Baoyu Design is distributed as a single Agent Skill file. Installation is straightforward:

```bash
# Clone the repository
git clone https://github.com/JimLiu/baoyu-design.git
cd baoyu-design

# The skill file is ready to use — no build step required
ls baoyu-design.skills.md
```

The key file is `baoyu-design.skills.md` — a single, comprehensive Markdown file (~500+ lines) that instructs your coding agent to follow Claude Design's methodology. This includes requirement clarification, design system generation, HTML mockup creation, and iterative refinement through live preview.

## Step 2: Configure Your Agent

### For Cursor

1. Open Cursor and go to **Cursor Settings > General > Rules for AI**
2. In the "Rules" field, add:
   ```
   Always load the baoyu-design Agent Skill before any design task.
   ```
3. Place `baoyu-design.skills.md` in your project's `.cursor/rules/` directory:
   ```bash
   mkdir -p .cursor/rules
   cp /path/to/baoyu-design.skills.md .cursor/rules/
   ```
4. Restart Cursor to pick up the new rules

Now when you prompt Cursor with a design task, it will automatically apply baoyu-design's methodology.

### For Claude Code

1. Create a project-level instruction file:
   ```bash
   mkdir -p .claude
   cp /path/to/baoyu-design.skills.md .claude/instructions.md
   ```
   Or add to your global CLAUDE.md:
   ```bash
   cat /path/to/baoyu-design.skills.md >> ~/.claude/CLAUDE.md
   ```

2. Start a session with the skill loaded:
   ```bash
   claude --instructions .claude/instructions.md
   ```
   Or simply include the file in your project and reference it:
   ```
   claude "Read baoyu-design.skills.md and follow its design process to create a landing page for my SaaS"
   ```

### For Codex CLI

1. Place the skill file in your project root:
   ```bash
   cp /path/to/baoyu-design.skills.md ./
   ```
2. Start a session and reference the skill:
   ```
   codex "Apply the baoyu-design Agent Skill from baoyu-design.skills.md to design a mobile app prototype"
   ```

### For Claude Desktop

1. Open Claude Desktop and create a new Project
2. Upload `baoyu-design.skills.md` as a project document
3. In your project instructions, add:
   ```
   Before any UI design task, read baoyu-design.skills.md and follow its methodology.
   ```
4. Claude Desktop will now have access to the full design skill

## Step 3: Create Your First Design

Let's walk through a real example — designing a landing page for a fictional SaaS product called "Flowboard" (a project management tool).

### Prompt Template

With baoyu-design loaded, use this prompt pattern:

```
I need to design a landing page for [product name], a [product description].
Target audience: [who uses it]
Key features: [3-5 main features]
Design direction: [modern/minimal/playful/corporate]
Follow the baoyu-design Agent Skill process.
```

### Example: Flowboard Landing Page

```bash
claude "I need to design a landing page for Flowboard, a visual project management tool for creative teams. Target audience is design agencies and marketing teams. Key features: drag-and-drop kanban, time tracking, client portals, file sharing, AI-powered task suggestions. Design direction: modern, colorful, approachable. Follow the baoyu-design skill."
```

Baoyu-design will:

1. **Clarify requirements** — ask you questions about brand colors, tone, layout preferences, and content sections
2. **Generate design context** — create a design system with typography scales, color palettes, spacing grids
3. **Produce HTML mockup** — generate a self-contained HTML file with embedded CSS and interactivity
4. **Launch browser preview** — the agent opens the HTML in a local preview so you can see it

### What You'll See

The output lands as a single HTML file in your project directory:

```
designs/
  flowchart-landing-page-01.html  ← Full landing page with hero, features, pricing, CTA
  design-system.html              ← Color palette, typography, spacing tokens
```

Open `flowchart-landing-page-01.html` in your browser. You'll see a fully styled landing page with:
- Animated hero section with gradient background
- Feature cards with hover effects
- Pricing table with tier highlighting
- Testimonial carousel
- CTA section with gradient button
- Responsive layout (desktop + mobile)

## Step 4: Iterate via Live Preview

This is where baoyu-design's workflow shines. Because the output is plain HTML served on `localhost`, you can iterate in real time:

### Using Cursor Browser

1. Cursor has a built-in browser preview (Cmd+Shift+P → "Browser: Open Preview")
2. Point it at your design file
3. Describe what you want changed — point-and-iterate:

```
You: "Make the primary button use a warmer gradient — 
      orange to coral instead of blue to purple"
Agent: (edits the CSS gradient in the HTML)
Preview: (updates instantly — you see the change in your browser)
```

### Using Claude Code

1. Open the HTML file in your browser with live-server or a simple HTTP server:
   ```bash
   npx serve designs/
   ```
2. Tell Claude what to change:
   ```
   "The hero section needs more whitespace below the headline. 
    Increase the margin-bottom on the h1 to 2.5rem."
   ```
3. Claude edits the HTML file directly
4. Refresh the browser to see the change

### Iteration Efficiency

This visual second-pass editing is **significantly faster** than describing every change on claude.ai, where you can't point at specific elements. In practice, you can go from "initial mockup" to "final design" in 3-5 iterations, each taking 30-60 seconds.

## Step 5: Export Your Design

Baoyu-design supports multiple export formats:

| Export Format | Command | Use Case |
|--------------|---------|----------|
| **Standalone HTML** | Already done | Use as-is or hand off to developers |
| **PDF** | `Print to PDF` from browser | Stakeholder reviews, client presentations |
| **PPTX (editable)** | Ask agent: "Export this as an editable PPTX" | Presentations |
| **PPTX (screenshots)** | Ask agent: "Export this as PPTX with screenshots" | Pitch decks |
| **MP4** | Ask agent: "Export this as a video" (uses html-video) | Product demos |
| **Send to Figma** | Agent converts HTML → .fig format | Design handoff |
| **Send to Canva** | Agent exports for Canva import | Non-technical team members |

Example:
```
You: "Export the landing page as a PPTX with editable slides"
Agent: (renders each section as a slide → outputs flowchart-deck.pptx)
```

## Step 6: Build a Design System

For projects beyond a single page, baoyu-design's design system feature is invaluable:

```
"Create a design system for Flowboard with:
- 10-color palette (primary, secondary, neutral, accent)
- Modular typography scale (12px to 72px)
- Spacing grid (4px base unit)
- Component tokens for buttons, cards, inputs, modals
Generate the design-components library (.dc.html)"
```

This produces a reusable `.dc.html` file that can be imported into any new design session. Future prompts like "Use the Flowboard design system to design the dashboard" will automatically apply your established tokens.

## Step 7: Advanced — Import from Figma

If you already have designs in Figma:

1. In Figma, go to **File > Save Local Copy...** to export a `.fig` file
2. Place it in your project directory
3. Prompt your agent:
   ```
   "Decode this Figma file (design.fig) and rebuild it as an interactive HTML prototype. Apply the Flowboard design system."
   ```
4. Baoyu-design's offline `.fig` decoder extracts layers, artboards, and styles
5. The agent reconstructs the design as a working HTML prototype — without a Figma plugin

## Pro Tips

### 1. Start with a Design Brief

Don't jump straight into generating. Use baoyu-design's requirement clarification phase:

```
"Ask me 5 questions about my project before starting to design."
```

This forces the agent to gather context first, producing better output on the first attempt.

### 2. Use Component-Level Iteration

Instead of regenerating the entire page, target specific components:

```
"Only redesign the pricing section. Keep cards but add a 'Popular' badge 
for the Pro tier and make the Enterprise tier expandable."
```

### 3. Combine with html-video for Video Output

Exporting to MP4 requires html-video. The two tools integrate naturally:

```
"Install html-video as a dependency. Export the landing page as a 30-second 
animated product video with background music."
```

### 4. Build a Component Library

After finishing a project, extract reusable components:

```
"Take the button styles, card layouts, and nav bar from this project and 
generate a reusable component library (.dc.html) for future projects."
```

### 5. Use Sub-Agents for Parallel Design

With Claude Code, you can fork sub-dialogues to design multiple pages simultaneously:

```
"Fork a sub-agent to design the dashboard page while I continue refining the landing page."
```

## Pricing Summary

| Component | Cost |
|-----------|:----:|
| **Baoyu Design (MIT license)** | $0 |
| **Claude Pro (Opus 4.8)** | $200/mo |
| **Claude Code (included with Pro)** | $0 |
| **Cursor Pro (alternative)** | $20/mo |
| **Total (Claude route)** | ~$200/mo |
| **Total (Cursor + Sonnet 4)** | ~$20/mo |

The Claude Pro subscription is the main expense. If you're already paying for it for coding, baoyu-design extracts significant additional value from the same subscription.

## FAQ

**Q: Can I use baoyu-design without a paid Claude subscription?**
A: Baoyu-design itself is free (MIT), but the skill is optimized for Claude Opus 4.8. You can run it on other models (Sonnet 4, GPT-5, DeepSeek V4), but output quality drops noticeably, especially for complex layouts and animations.

**Q: Does it work with visual reference images?**
A: Yes — you can provide brand guidelines, competitor landing pages, or mood boards as reference. The agent reads image files and extracts design direction. This works best with Opus 4.8's vision capabilities.

**Q: Can I version control my designs?**
A: Absolutely — all output is plain HTML in a git-tracked folder. Design iterations become commit history. You can branch, merge, diff, and roll back designs like code.

**Q: How does it compare to Figma?**
A: Baoyu-design is complementary to Figma. Use it for rapid prototyping and iteration in your coding environment, then export to Figma format for polish and collaboration. For wireframing and early-stage design, baoyu-design is faster than Figma. For production-grade vector editing and multi-designer collaboration, Figma still wins.

**Q: Can I create interactive prototypes?**
A: Yes — baoyu-design generates HTML with CSS transitions, hover states, click handlers, and navigation between pages. For fully interactive prototypes, request "an interactive prototype with routing between 3 screens."

**Q: What about mobile design?**
A: Baoyu-design includes a dedicated "mobile prototype" skill. Use the prompt: "Design a mobile prototype for iOS" — it generates phone-form-factor HTML with touch interactions.

**Q: Is baoyu-design production-ready?**
A: The skill is stable and actively maintained (1,626 stars, MIT license). Output quality depends on your model choice. For production UI that ships as actual code, baoyu-design's HTML output can be directly used in web projects with minimal cleanup.

## Troubleshooting

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Agent ignores the skill | Skill not loaded | Verify the skill file is in the right location and referenced in your prompt |
| Messy HTML output | Wrong model | Switch to Claude Opus 4.8 — weaker models produce messy code |
| Context window exceeded | Design too complex | Break into smaller sections; design one component at a time |
| Slow iteration | Regenerating from scratch | Use component-level prompts instead of full-page regenerations |
| Missing export option | Agent didn't load all skill sections | Explicitly ask "What export formats are available for this design?" |

## Final Verdict

Baoyu-design brings production-quality Claude Design capability to your local development environment. The agent-native workflow with live preview iteration is genuinely faster than browser-based design tools for developers who already work in Cursor, Claude Code, or Codex CLI.

The main constraint is model dependency — you need Opus 4.8 for the best results, and that costs $200/month. But if you're already paying for Claude Pro, baoyu-design transforms that subscription from "a coding assistant" into "a full design team." The MIT license, git-versioned HTML output, and multi-format export pipeline make it a **best-in-class Agent Skill for designers who code and coders who design.**
