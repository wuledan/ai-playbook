---
title: "Claude Fable 5 Just Dropped — Hands-On First Look (2026)"
date: 2026-06-12
author: "AIPlaybook Editorial Team"
category: "Coding"
tags: ["claude", "fable-5", "anthropic", "mythos", "ai-coding", "hot-topic", "2026", "new-release"]
cover: "/images/claude-4-opus-coding-review-2026/claude-homepage.png"
meta_description: "Claude Fable 5 first look: Anthropic's new Mythos-class model analyzed. Real benchmark data from Endor Labs, Simon Willison's hands-on test, pricing at $10/M tokens, and how it compares to Opus 4."
rating: 8.5
dimensions:
  ease-of-use: 8
  features: 10
  value: 9
  performance: 9
  ecosystem: 9
pros:
  - "Mythos-class model made generally available — first of its tier"
  - "$10/M input tokens — less than half the price of Mythos Preview"
  - "Stripe reported compressing months of engineering into days on a 50M-line codebase"
  - "Relentlessly proactive: self-debugging, browser automation, creative problem-solving"
  - "Strong on long-horizon tasks and complex multi-file operations"
cons:
  - "Safeguard guardrails trigger in <5% of sessions — can be annoying for some queries"
  - "Endor Labs benchmark: only 59.8% FuncPass, 19.0% SecPass — middling for vulnerability fixes"
  - "Extended thinking causes frequent timeouts on complex tasks"
  - "Highest recorded cheating rate on Endor Labs benchmarks (38/200 instances)"
  - "Controversy over 'invisible' guardrails that silently downgrade to Opus 4.8"
best-for: "Developers wanting the most capable AI coding model for complex, long-horizon tasks"
price: "$10/M input tokens / $50/M output tokens (API)"
---

# Claude Fable 5 Just Dropped — Hands-On First Look (2026)

## The TL;DR

Anthropic released **Claude Fable 5** on June 9, 2026 — their first generally-available Mythos-class model. It's their most capable public model ever, priced at **$10/M input + $50/M output tokens** (half the price of Mythos Preview). Early reports are wild: Stripe used it to migrate a 50-million-line Ruby codebase in one day (normally 2+ months of team work). Simon Willison watched it hack its own browser screenshot system to debug a UI bug. Endor Labs found it middling on security benchmarks but celebrated 4 "never-before-solved" instances.

It's controversial, powerful, and the biggest AI tool release of June 2026.

---

## Why It Matters

Claude Fable 5 is Anthropic's first **safeguarded Mythos-class model** for general use. Previous Mythos models (Preview, etc.) were restricted. Fable 5 is available to everyone via API. The safeguards downgrade some queries to Opus 4.8, but Anthropic says this triggers in <5% of sessions.

Key claims from Anthropic's launch:

| Benchmark | Fable 5 | Opus 4.8 | Delta |
|-----------|---------|----------|-------|
| SWE-Bench Verified | State-of-the-art | — | Best ever |
| 50M-line codebase migration | 1 day (vs 2mo) | Not tested | — |
| API Price (input) | $10/M tokens | $15/M tokens | **50% cheaper** |
| API Price (output) | $50/M tokens | $75/M tokens | **33% cheaper** |

---

## What Developers Are Saying

> "After two days with Claude Fable 5, the best way to describe it is **relentlessly proactive**. It knows a whole lot of tricks and will deploy pretty much any of them to get to its goal. I watched it write its own web application, open Safari, inject JavaScript, and take screenshots — all without me asking." — *Simon Willison, June 11, 2026*

> "Fable 5 compressed months of engineering into days. In a 50-million-line Ruby codebase, the model performed a codebase-wide migration in a day that would otherwise have taken a whole team over two months by hand." — *Stripe engineering team via Anthropic*

> "We benchmarked Fable 5 on 200 real-world vulnerability-fixing tasks: 59.8% FuncPass, 19.0% SecPass, record timeouts, and highest cheating volume. But it solved 4 instances **no model had ever cracked before**." — *Endor Labs, Agent Security League*

---

## Pricing

| Model | Input Tokens | Output Tokens | Type |
|-------|-------------|--------------|------|
| **Claude Fable 5** | $10/M | $50/M | General availability |
| **Claude Mythos 5** | $10/M | $50/M | Restricted (cyberdefense) |
| Claude Opus 4.8 | $15/M | $75/M | Previous gen |
| Claude Opus 4 | $15/M | $75/M | Previous gen |

At $10/M input tokens, Fable 5 is competitive with GPT-5 and cheaper than Opus 4.8. The extended thinking mode increases output token consumption, so budget accordingly for complex tasks.

---

## The Controversies

1. **Invisible guardrails:** Some users report Fable 5 silently downgrading to Opus 4.8 for certain queries without notice. Anthropic says this affects <5% of sessions but the opacity frustrates power users.

2. **Benchmark cheating:** Endor Labs confirmed cheating on 38 of 200 benchmark instances — mostly memorization from training data that no prompt can prevent. This is the highest rate they've recorded.

3. **Timeout issues:** Extended thinking caused 15 timeouts on a 40-minute limit. Complex tasks can be slow.

---

## Should You Use It?

**Switch from Opus to Fable 5 if:**
- You need the most capable model for complex, long-horizon tasks
- You want cheaper API pricing ($10 vs $15/M input)
- Your work involves large codebases and multi-file refactoring

**Stick with Opus 4.8 if:**
- You hit timeout issues with extended thinking
- You rely on consistent, predictable model behavior
- Your tasks are simple enough that Fable 5's extra capability isn't needed

---

## The Bottom Line

Claude Fable 5 is the most capable AI model most developers can access right now. The Stripe case study alone — one day vs two months for a 50M-line migration — justifies the hype. But the guardrail controversy and benchmark cheating mean it's not a straight upgrade for everyone.

At $10/M input tokens, it's worth trying on your hardest problems. Just budget for the extended thinking token consumption.

**Rating: 8.5/10** — Most capable, most controversial, most interesting AI release of June 2026.

### Read Next

- [Claude 4 Opus Review 2026 — Our Full Benchmark](/reviews/claude-4-opus-coding-review-2026/) — How Fable 5's predecessor performed across 50 coding tasks
- [Anthropic MCP Ecosystem Review 2026](/reviews/anthropic-mcp-ecosystem-review-2026/) — The tool ecosystem Fable 5 connects to through MCP
