---
title: "headcount Review 2026 — An Agent Organization for Claude Code: 16 Departments, 146 Skills, Structured as a Company"
date: 2026-09-01
author: "AIPlaybook Editorial Team"
category: "Coding"
tags:
  - "headcount"
  - "Claude-Code"
  - "Agent-Organization"
  - "Agent-Skills"
  - "Claude-Code-Plugin"
  - "Skill-Marketplace"
  - "Multi-Agent"
  - "Prompt-Engineering"
  - "Open-Source"
  - "Agent-Governance"
cover: /images/reviews/headcount-review-2026/cover.png
meta_description: "headcount is an agent organization for Claude Code, structured as a company: a chief executive over 16 departments and 146 skills, every department an independently installable plugin. Instead of adding one more prompt to your Claude Code setup, you add a department — security, finance, demand generation, legal — and skills address as department:skill so names never collide. It shipped August 28, 2026 and hit 840+ GitHub stars in four days, with an interactive org chart, seven cross-department use cases worked end to end, and a CI check that fails if any referenced skill stops resolving."
rating: 7.9
dimensions:
  ease-of-use: 8.5
  features: 9
  value: 7.5
  performance: 7.5
  ecosystem: 7
pros:
  - "A real organizing principle instead of a flat pile of prompts: 16 departments with named executives (CEO, CTO, CISO, CFO, CHRO) give Claude Code a function-ownership model — you add a department, not a prompt, and the right skill loads itself when a request matches its territory"
  - "Namespacing that actually works: skills are addressed as department:skill (security:threat-modeling, finance:unit-economics), so names never collide and a project can install multiple departments without ambiguity"
  - "Every department is an independently installable plugin via /plugin marketplace add cbrock84/headcount, so a project loads only the functions it needs rather than all 146 skills at once"
  - "Reviewer-class departments (Security, Legal & Risk) are designed to stop work rather than add an opinion — the SOC 2 and incident use cases show exactly where a department has authority to say no, which is rare in agent-skill packs"
  - "Docs can't rot: a CI check fails if any referenced skill stops resolving, and seven cross-department situations (SOC 2 demand, security incident, stalled funnel) are worked end to end in docs/USE-CASES.md"
  - "Each department ships an agent charter in .claude/agents/, so a department can be delegated as a subagent with its own exclusive write surface instead of just a skill that runs in the main session"
cons:
  - "The organization is only as good as the discipline of its users: skills self-load on request matching, so vague questions can pull the wrong department, and the org metaphor adds vocabulary (departments, charters, reviewer-class) before it pays off"
  - "No published benchmarks or before/after evidence that the 146-skill org meaningfully improves Claude Code output quality versus a well-curated smaller skill set — the README demonstrates structure, not measured gains"
  - "Installing multiple departments means 100+ skills in the plugin registry, and there's no built-in governance for who in a team can install or update departments — trust is implicit"
  - "Very young: created August 28, 2026, 2 open issues, no release tags or changelog yet, and the maintenance model (how departments evolve when Claude Code's skill format changes) is unproven"
  - "Markdown-heavy repo means the value lives in documentation and skill text — if the org-chart site or USE-CASES drift from actual skill behavior, the CI check only catches broken references, not behavioral drift"
  - "It's opinionated about company structure: teams that don't think in C-suite departments may find the metaphor (Office of the CEO, EPMO/COO) prescriptive rather than helpful"
best-for: "Claude Code power users and small teams that want a governed, namespaced skill library organized by business function — especially useful for mixed technical/business workflows like threat modeling, unit economics, landing-page CRO, and contract review in one setup"
price: "Free, MIT-licensed; install via Claude Code plugin marketplace (/plugin marketplace add cbrock84/headcount), then /plugin install <department>@headcount — no paid tier, your existing Claude Code subscription/API costs apply"
---

## The Pitch: Add a Department, Not a Prompt

On August 28, 2026, a repository called `cbrock84/headcount` appeared on GitHub with a one-line tagline that immediately stands out in the agent-skills crowd: **"Add a department, not a prompt."** Four days later it has **840+ stars and 128 forks**, an interactive org chart at [cbrock84.github.io/headcount/org-chart.html](https://cbrock84.github.io/headcount/org-chart.html), and a structure unlike the flat skill packs that dominate the Claude Code plugin ecosystem.

headcount is an **agent organization for Claude Code, structured as a company**: a chief executive over **16 departments and 146 skills in total**. The departments mirror a real corporate structure — Office of the CEO (6 skills), Technology/CTO (18), Security/CISO (6), IT Operations/CIO (11), Product/CPO (9), Marketing/CMO (18), Demand Generation/CMO (11), Revenue/CRO (8), Finance/CFO (10), Operations/COO (10), Program Management Office (7), Customer Experience (5), Data & Analytics (6), Corporate Strategy (5), People/CHRO (10), and Legal & Risk (6).

Two of those — **Security and Legal & Risk — are marked "reviewer-class,"** a designation with real teeth: these departments are designed to stop work rather than add an opinion. That single design decision is what separates headcount from a curated list of prompts.

## The Core Idea: Function Ownership Beats Prompt Piles

The problem headcount attacks is familiar to anyone who has built a serious Claude Code setup: skill packs grow until they're a flat list, names collide, and there's no organizing principle for *who owns what decision*. headcount's answer is to borrow the one structure every business already understands — an org chart.

Every skill lives in exactly one department and is addressed as **`department:skill`** — `security:threat-modeling`, `finance:unit-economics`, `demand-generation:landing-page-cro-expert`. Because the namespace is hierarchical, names never collide, and a project can install as many departments as it needs without ambiguity.

Installation is plugin-native:

```
/plugin marketplace add cbrock84/headcount
/plugin install security@headcount
```

Each department is an independently installable plugin, so a project loads only the functions it needs rather than all 146 skills. Skills **load themselves when a request matches** — you don't invoke most of them directly:

| You ask | What loads |
|---|---|
| "why isn't this landing page converting?" | `demand-generation:landing-page-cro-expert` |
| "can we afford this hire?" | `finance:unit-economics` |
| "review this design before we build it" | `security:threat-modeling` |
| "our growth has stalled" | `executive:business-growth-consultant` |
| "is this contract term normal?" | `legal-risk:contract-review` |
| "our data model is a mess" | `data-analytics:data-modeling` |

When you want a specific lens, you force it by name: `/finance:financial-modeling`.

## Reviewer-Class Departments: Where the Agent Can Say No

The most interesting architectural choice is the **reviewer-class** designation on Security and Legal & Risk. These departments don't just produce output — they have authority to block. The README's cross-department use cases show the pattern in practice.

**Scenario: an enterprise prospect demands SOC 2.** Six departments engage in sequence — `revenue:chief-revenue-officer` (what the deal is worth), `security:security-architecture-review` (the posture you actually have, not the one on the website), `security:access-and-identity` (least privilege and joiner-mover-leaver), `legal-risk:privacy-and-data-protection` (DPA and subprocessor chain), `operations:process-design` (evidence collection must be repeatable), and `finance:budgeting-and-forecasting` (auditor, tooling, and engineering time nobody costed).

Then the design kicks in: *"Where it stops. security is reviewer-class. A finding that the access model can't support the control isn't a trade-off revenue gets to price against the deal — the date moves, or the control gets built."*

**Scenario: you've had a security incident.** `security:incident-response` contains first and scopes second; `legal-risk:privacy-and-data-protection` identifies which notification clocks are running and from when; `customer-experience:escalation-management` decides what affected customers are told; `marketing:public-relations` drafts the external statement; `executive:chief-executive` decides what gets disclosed. The stop rule: *"Communications cannot outrun the legal position. legal-risk sets the notification obligation; PR writes inside it, never ahead of it."*

That "where it stops" discipline is the through-line. An organization answers a *situation* — several functions engaging in order, with someone able to say no — where a collection of skills only answers a question.

## Org Chart, Agent Charters, and Docs That Can't Rot

headcount ships three supporting artifacts that are unusual for a skill pack:

1. **An interactive org chart** — search every skill, open a department, jump to the source, with light/dark variants. It's a real documentation surface, not a marketing graphic.
2. **Agent charters** — every department ships one in `.claude/agents/`, so a department can be delegated as a **subagent with its own exclusive write surface**. That's a governance primitive: the department doesn't just advise the main session, it can own a piece of work with bounded write access.
3. **A CI-enforced reference integrity check** — a check in CI fails if any skill reference stops resolving, so the USE-CASES document cannot rot as skills are renamed or consolidated.

The USE-CASES.md document works seven cross-department situations end to end: SOC 2 demand, security incident, "should we build this?", stalled growth, and more. Each shows the engagement order and the explicit stopping point — which is the real payload. It's the difference between a skill library and an operating manual.

## Honest Boundaries and Who Should Use It

The honest caveats are the same ones that apply to any structured skill pack, plus a few specific ones. There are **no published benchmarks** demonstrating that 146 skills organized into 16 departments measurably beats a well-curated 20-skill setup — the README demonstrates structure, not measured output gains. The org metaphor is opinionated: teams that don't think in C-suite departments may find "Office of the CEO" and "EPMO/COO" prescriptive. And at 4 days old with 2 open issues, the maintenance model is unproven — the value lives in documentation and skill text, and the CI check catches broken references, not behavioral drift.

**Who should use it:** Claude Code power users and small teams running mixed technical/business workflows — threat modeling before a design ships, unit economics before a hire, CRO on a landing page, contract review on an inbound term sheet. If those workflows are currently a pile of ad-hoc prompts, headcount gives them an org structure with namespaces and stop authority.

**Compared to the alternatives:** flat skill packs (install everything, names collide, no governance), MCP servers (capabilities, not judgment), and multi-agent frameworks like CrewAI (build-your-own orchestration) each solve one slice. headcount is the rare attempt to give Claude Code a *function-ownership model* with explicit authority boundaries — closer to a company handbook than a tool library. For teams that want their coding agent to think in departments, it's the most coherent structure in the category right now.

*Screenshots captured from the official GitHub repository on September 1, 2026. Star counts and metrics reflect the repository state at review time.*
