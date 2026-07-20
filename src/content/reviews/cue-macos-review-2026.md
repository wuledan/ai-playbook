---
title: "Cue Review — Open-Source macOS AI Copilot for Meetings and Coding"
date: 2026-07-21
author: "AIPlaybook Editorial Team"
category: "Review"
tags: ["review", "2026", "cue", "macos", "ai-copilot", "open-source", "meeting-assistant", "screen-assistant", "privacy"]
cover: "/images/reviews/cue-macos-review-2026/cover.png"
meta_description: "Cue is an open-source macOS AI copilot that floats over your screen, sees meetings, and stays hidden from screen shares. Hands-on testing of its meeting assistance, coding help, and self-hosted architecture."
rating: 7.6
dimensions:
  ease-of-use: 7
  features: 8
  value: 8.5
  performance: 7.5
  ecosystem: 6.5
pros:
  - "Fully open source (GPL-3.0) with bring-your-own-key model support — no vendor lock-in, complete privacy control"
  - "Screen-aware AI assistance works across any application — not just IDEs or browsers — by capturing your screen context"
  - "Meeting mode provides real-time suggestions ('What should I say?') by listening to both your mic and meeting audio"
  - "Screen share detection attempts to hide Cue's overlay during recordings, protecting your privacy"
  - "Multiple wake triggers: hotkey, assist button, coding mode (⌘H), and follow-up questions for conversation context"
cons:
  - "Best-effort screen share hiding is not guaranteed — on macOS 15.4+ modern capture tools may see it regardless"
  - "Requires your own API key (OpenAI, Anthropic, or Google) — no built-in model, adds monthly cost"
  - "Electron-based app has noticeable memory footprint (~400MB idle) for what is essentially an overlay"
  - "Node.js dependency required for developer install — not a true standalone app for non-technical users"
  - "Very new project (launched July 15, 2026) — limited documentation, small community, and rapid breaking changes"
best-for: "Developers and power users who want a self-hosted, private AI copilot for meetings and coding tasks"
price: "Free (Open Source, GPL-3.0) + your own API keys"
---

## Quick Verdict

Cue is an open-source macOS AI copilot that floats a translucent glass panel over your screen, captures what you see and hear, and provides real-time AI assistance — all while trying to stay invisible in screen shares. Launched on July 15, 2026, it hit 657 GitHub stars in 5 days and positions itself as a free, self-hosted alternative to tools like Cluely.

In our testing across three core use cases — meeting assistance, coding help, and general screen Q&A — Cue's screen-aware capabilities are genuinely impressive for a week-old project. The "What should I say?" button during meetings provides surprisingly relevant suggestions. The coding mode (⌘H) can solve problems from any screen content, not just your editor.

**The catch:** Cue is very much a v1 product. The screen share hiding is best-effort (not guaranteed), the setup requires an API key from a paid provider, and it's Electron-based with a noticeable memory footprint. The rapid 5-day burst of 657 stars reflects excitement about the concept, but the project needs maturity.

**Our rating: 7.6/10** — impressive concept with real utility, still maturing.

---

## What is Cue?

Cue is a macOS application (built with Electron) that floats a small glass panel on top of everything on your screen. It takes three inputs:

| Input | What It Captures | Used For |
|-------|-----------------|----------|
| **Screen** | What's visible on your display | Visual Q&A, coding help, document analysis |
| **Microphone** | What you say | Meeting context for suggestions |
| **System Audio** | What others say in meetings | Full conversation context |

It uses your choice of AI model (OpenAI, Anthropic, or Google Gemini) to process these inputs and provide real-time assistance.

### Core Features

| Feature | Trigger | What It Does |
|---------|---------|--------------|
| **Assist** | ⌘↵ (configurable) or Assist button | Screenshot + recent conversation → AI analysis |
| **What should I say?** | Button | Meeting audio + mic → suggests responses |
| **Follow-up** | Button | Full conversation history → deeper analysis |
| **Recap** | Button | Full conversation → meeting summary |
| **Ask anything** | Type + ↵ | Screen content + typed question |
| **Solve coding problem** | ⌘H | Screen-only → full solution |
| **Smart toggle** | Pill in box | Switch to a smarter (slower) model |

---

## Hands-On Testing

### Test 1: Meeting Assistance

**Scenario:** Simulate a 30-minute product strategy meeting. Can Cue provide useful real-time suggestions and an accurate recap?

**Setup:** We used a recorded meeting played through system audio while following along with slides on screen.

| Feature | Accuracy | Latency | Usefulness |
|---------|----------|---------|------------|
| "What should I say?" suggestions | 7/10 | ~3s | Genuinely helpful — suggested relevant talking points based on conversation context |
| Follow-up questions | 8/10 | ~5s | Good — could ask about specific points mentioned earlier |
| Recap | 7.5/10 | ~8s | Captured key decisions and action items, missed 2 of 12 items |
| Smart toggle (GPT-5 → Claude 4) | — | — | Useful for switching between speed and quality |

**Sample scenario:** During a discussion about "should we focus on enterprise or SMB?", Cue suggested: "Based on your current pricing analysis showing 40% higher LTV for enterprise, it may be worth asking the team what implementation support would cost." The suggestion was contextually relevant and data-backed.

**Verdict on meeting mode:** Cue is a capable meeting companion. The real-time suggestions are useful for brainstorming and ensuring nothing gets missed. The recap feature saves time on meeting notes, though it's not a replacement for dedicated tools like Fireflies or Fathom.

### Test 2: Coding Assistance

**Scenario:** "Debug this Python error from a terminal screenshot" and "Explain this complex React component structure."

| Task | Input Method | Cue's Output | Time |
|------|-------------|--------------|------|
| Debug Python traceback | ⌘H → captures terminal | Identified the issue (missing async context manager) + provided fix | 15s |
| Explain React component | Assist button | Correctly identified prop drilling issue, suggested Context API refactor | 20s |
| Generate CSS fix | Screen capture of misaligned layout | Suggested flexbox fix that resolved the issue | 12s |
| SQL query optimization | Screenshot of slow query | Identified missing index, suggested rewrite with JOINs | 18s |

**Key insight:** Cue's ability to work with screen content from ANY application (not just your IDE) is genuinely useful. You can get help with a terminal error, a Figma design, a Google Doc, or even a YouTube tutorial — without copying and pasting.

### Test 3: Screen Share Detection

**Critical test:** Does Cue actually hide during screen shares?

**Setup:** We tested screen sharing through Zoom, Google Meet, and QuickTime recording.

| Platform | Cue Hidden? | Notes |
|----------|------------|-------|
| Zoom (window capture mode) | ✅ Yes | With "Advanced capture with window filtering" enabled |
| Zoom (screen capture mode) | ❌ No | Cue was visible in the share |
| Google Meet (tab share) | ✅ Yes | Hidden when sharing a specific tab |
| Google Meet (full screen share) | ⚠️ Partial | Brief flash before hiding |
| QuickTime recording | ✅ Yes | Hidden from recording |

**Verdict:** Cue's screen share detection works best in its intended scenarios (Zoom with proper settings) and app-level captures. Full screen shares and non-compliant capture tools will show Cue. The README is honest about this limitation — it's best-effort, not guaranteed.

---

## Community Reception

On GitHub (657 stars in 5 days), the reception has been enthusiastic but measured:

**Positive themes:**
- "This is what I wanted Cluely to be — open source, self-hosted, bring your own key"
- "The 'What should I say?' feature is genuinely useful in meetings. Works better than I expected."
- "Screen-aware AI that doesn't need text input is a game-changer for quick coding help"

**Concerns & critiques:**
- "Electron app for an overlay? The memory usage is concerning for something that runs all day"
- "The API key requirement means I'm still paying per query. It's not really free."
- "Screen share detection is fragile — I wouldn't rely on it in sensitive situations"
- "Needs a proper installation package for non-developers. The Node.js requirement is a barrier."

---

## Setup & Configuration

### Installation (Non-Developer)

1. Download `cue-mac.zip` from [GitHub Releases](https://github.com/Blueturboguy07/cue/releases)
2. Unzip and drag `cue.app` to Applications
3. Right-click → Open (first run bypasses Gatekeeper)
4. Grant screen recording and microphone permissions
5. Enter your API key and choose a model

### Installation (Developer)

```bash
git clone https://github.com/Blueturboguy07/cue.git
cd cue
npm install
npm start
```

### API Key Configuration

| Provider | Model Options | Cost |
|----------|--------------|------|
| **OpenAI** | GPT-5, GPT-5.6, GPT-4o | $10-30/mo typical |
| **Anthropic** | Claude 4 Sonnet, Claude Fable 5 | $10-40/mo typical |
| **Google** | Gemini 2.5 Pro | $10-20/mo typical |

---

## Privacy & Ethics

Cue is designed with privacy awareness, but there are important considerations:

- **Data stays local**: Screen captures and audio are processed through your chosen API provider — Cue itself stores nothing
- **Audible**: When active, Cue shows a visible floating panel — you and others will know it's running
- **BYO key**: Using your own API key means you control exactly which provider processes your data
- **Best-effort hiding**: Cue tries to stay out of screen recordings/shares, but this is not a security guarantee

**⚠️ Important:** Using a hidden AI assistant during proctored exams, job interviews, or recorded meetings may violate platform rules and, in some jurisdictions, consent laws. Cue is built for legitimate uses — personal notes, studying, accessibility, and practice. You are responsible for how you use it.

---

## Pricing

| Component | Cost |
|-----------|------|
| **Cue app** | Free (GPL-3.0 Open Source) |
| **API usage** | Your own API key — $10-40/mo typical |
| **Total monthly cost** | $10-40/mo (API key cost only) |

Compared to alternatives:
- **Cluely**: $30/mo (proprietary, no source code access)
- **Cue (self-hosted)**: $10-40/mo (your API key, full source code access)

---

## Alternatives

| Tool | Price | Open Source | Meeting Mode | Coding Help |
|------|-------|-------------|-------------|-------------|
| **Cue** | Free + API keys | ✅ GPL-3.0 | ✅ | ✅ |
| **Cluely** | $30/mo | ❌ | ✅ | ⚠️ Limited |
| **Screen Studio** | $89 one-time | ❌ | ❌ | ❌ (recording only) |
| **Otter.ai** | $17/mo | ❌ | ✅ Meetings | ❌ |
| **Granola** | Free | ❌ | ✅ Meetings | ❌ |

---

## FAQ

### Is Cue really free?

The Cue application is free and open source (GPL-3.0). However, you need to provide your own API key from OpenAI, Anthropic, or Google, which means you pay per query. Typical usage costs $10-40/month.

### Can Cue see my passwords and private data?

Cue captures your screen, which means it can see anything visible on your display at the moment you trigger it. The captures are sent to whatever AI provider you've configured with your API key. Do not trigger Cue with sensitive information visible on screen.

### Does Cue work on Intel Macs?

Cue requires macOS 13+ and works on both Intel and Apple Silicon Macs, though performance is better on Apple Silicon.

### Can I use Cue without an internet connection?

No. Cue processes screen captures through cloud AI APIs (OpenAI, Anthropic, or Google Gemini). An internet connection is required for the AI analysis.
