---
title: "pcb-skill Review 2026 — The Agent Skill That Takes a Hardware Idea to a Manufacturable PCB, With Gates Instead of Hope"
date: 2026-09-10
author: "AIPlaybook Editorial Team"
category: "Hardware"
tags:
  - "pcb-skill"
  - "PCB"
  - "EasyEDA"
  - "EDA"
  - "Claude-Code"
  - "Codex"
  - "MCP"
  - "Hardware"
  - "Electronics"
  - "Gerber"
  - "Agent-Skills"
  - "Open-Source"
cover: "/images/reviews/pcb-skill-review-2026/cover.png"
meta_description: "pcb-skill (created September 8, 2026, MIT, ~100 stars in two days) is an agent skill by daishuge that takes a hardware idea all the way to a board you can order, solder and bring up — concept, schematic, sourcing, layout, routing, verification, and a purchase staged at the pre-payment page. It runs inside Claude Code or Codex on the desktop, drives EasyEDA Pro over MCP, and does its shopping in a browser you are already logged in to. The skill is written from one real project: a 41.40 x 100.00 mm four-layer programmable music player with 149 components, 108 routed nets and 100% hand-soldered assembly, released to fabrication with 0 DRC clearance errors and 0 connection errors. This review covers the four gated phases (concept, schematic plus sourcing, layout plus routing, fabrication plus purchase), the adversarial one-pass review that ends every phase, the deliberately EDA-independent verification scripts (Gerber parsing, clearance sweeps, drill census, netlist assertions, 3D interference), the four rules that did the work — including the 10-hour-53-minute silent run that taught the author to make every wait condition answer 'if this crashed right now, would my filter emit a line?' — and the honest caveats: the case-study board is released to fabrication but not yet assembled or powered on, and every defect caught so far is a design-stage catch verified against Gerbers and 3D solids, not a physical failure."
rating: 7.2
dimensions:
  ease-of-use: 6.5
  features: 8
  value: 7.5
  performance: 7
  ecosystem: 6.5
pros:
  - "It is a gate system, not a wish: every phase ends with a one-pass, read-only adversarial review that re-derives the numbers instead of reading them, and its termination criterion is written before it starts — so the agent cannot declare a green board correct by squinting at its own work, and the review cannot loop forever"
  - "The verification layer is deliberately independent of the EDA tool: scripts/verify contains its own Gerber parser, clearance sweeps, drill census, netlist assertions and 3D interference checks, so the package is verified against the exported data rather than against the tool that made it — a real answer to 'the tool says DRC clean' being a different claim from 'the board is correct'"
  - "Written from an honest case study: one real board (ESP32-P4 plus C6 core module on 88 castellated pads, 3.99-inch MIPI-DSI panel, I2S DAC, 149 components, 108 nets, 406 vias) where the process caught a socket rotated so a display could never plug in, a capacitor under a module body, a keep-out that existed only on a drawing layer, and a checker quietly measuring the previous release — and the author states plainly the board has not yet been fabricated or powered on, so every defect listed is a design-stage catch"
  - "Hard rules with real teeth: 'measured, not inferred' (if a claim decides whether work continues, prove it and say which numbers were measured and which computed), 'verify the tool before the result' (three checkers on the reference project silently measured the wrong thing), and a wait-condition rule learned from a 10-hour-53-minute silent run whose filter would not have emitted a line if the process had crashed at minute one"
  - "The agent never places an order and never pays: carts are staged and the workflow drives to the pre-payment page, then hands the click to a human — the approval watcher for browser actions is explicitly configured to never touch carts or payment, which keeps the most expensive mistake (ordering the wrong board) outside the agent's reach"
  - "Optimises for the three things hobby hardware actually fails on: cost-effectiveness (every part priced from a live page or labelled ESTIMATE, BOM netted against stock you already own), assemblability by hand (no bottom-terminated packages, every pad reachable, a soldering order that does not trap a joint), and a free prototype (design inside the free-prototype envelope from the first sketch, not at the end)"
cons:
  - "The physical proof is still pending: the case study board was released to fabrication and staged for purchase, but at review time it had not been fabricated, assembled or powered on — the author is honest that this is a weaker claim than 'we built it and it worked,' and readers should treat the defect list as design-stage evidence, not field results"
  - "A heavy environment stack before the skill will start: EasyEDA Pro plus an MCP bridge, a browser with the agent extension logged in to your PCB house and parts suppliers, and an approval watcher for permission cards on macOS or Windows — the skill refuses to begin until these checks pass, which is correct but means the first hour is setup, not design"
  - "Single-author, very young, and small: three commits, created September 8, 2026, ~100 stars at review time — the README and case study are unusually candid for the age, but there is no community, no tagged release cadence and no second board in the case study to show the process generalises"
  - "The quality ceiling is your agent's: the skill is text plus scripts that tell Claude Code or Codex what to check and how to route (Specctra DSN/SES autoroute chain with a four-state watchdog and a rate floor), but the actual schematic judgement, part selection and layout decisions still depend on the model's competence with electronics — a weak model will produce a confident, well-gated wrong board"
  - "English README with Chinese working vocabulary: the three principles are labelled in Chinese first (cost-effectiveness, assemblable by hand, free prototype) with English glosses, and there is a linux.do community link — none of it blocks English-speaking users, but it signals the author's primary audience is the Chinese maker community"
best-for: "Developers and makers who already run Claude Code or Codex on the desktop and want a disciplined, gate-driven process for turning a hardware idea into an orderable PCB — especially first-time board designers who would rather have an agent that asks every question whose two answers give a different board, prices parts from live pages, checks its own work with independent scripts, and stops at the pre-payment page than one that cheerfully produces an unroutable, un-solderable layout"
price: "Free and open source (MIT). git clone the repository and copy skills/pcb into ~/.claude/skills/pcb (Claude Code) or ~/.codex/skills/pcb (Codex), then work through setup/README.md: EasyEDA Pro with the MCP bridge, a logged-in browser for your PCB house and parts suppliers (the author's stack is JLC/LCSC plus Taobao), and an optional approval watcher for macOS or Windows. The design tool (EasyEDA Pro) is free-tier; the free-prototype coupon from your PCB house covers the first boards. No API keys, no cloud, no subscription — the skill is text and scripts that run inside your existing agent."
---

## The Pitch: A Hardware Idea Should Not Die in the Schematic

pcb-skill, released September 8, 2026 by daishuge under MIT, is an agent skill that takes a hardware idea all the way to **a board you can order, solder and bring up** — concept, schematic, sourcing, layout, routing, verification, and a purchase staged at the pre-payment page. It runs inside Claude Code or Codex on the desktop, drives EasyEDA Pro over MCP, and does its component shopping in a browser you are already logged in to. Two days after release it passed ~100 stars and 16 forks, and its opening claim is not that the agent designs PCBs, but that it runs *the set of gates that catch the things PCB theory does not*: a socket rotated so the display can never be plugged in, a capacitor hiding under a module body, a keep-out that exists only on a drawing layer, a checker quietly measuring the previous release. Every rule in the skill was paid for on a real board, and the repo publishes that board's case study as the evidence.

The skill is organised around three principles that map to how hobby hardware actually fails. **Cost-effectiveness**: every part is chosen on measured price and real availability, netted against stock you already own; a price nobody has read off a live page is an ESTIMATE and must be labelled as one. **Assemblable by hand**: the user solders this, so no QFN/DFN/exposed-pad-only packages unless the user says otherwise, every pad reachable with an iron, in an order that does not trap a joint behind a tall part. **A free prototype**: JLC's free-prototype coupon has hard geometric and process limits, so the design must stay inside that envelope from the first sketch, not discover the limit at the end. (The README states these three in Chinese first — cost-effectiveness, assemblability by hand, and a free prototype — which is a small window into the author's primary audience.)

## Four Phases, Each Ending in a Gate

The workflow is four phases, and each phase produces an artifact plus a written gate that must pass before the next begins:

1. **Concept** — hard versus soft constraints, agreed. Gate: every question whose two answers give a different board has been asked.
2. **Schematic + sourcing** — schematic, priced BOM, staged carts. Gate: netlist assertions pass; every price is VERIFIED or labelled ESTIMATE.
3. **Layout + routing** — placed, routed, poured board. Gate: placement is *routable*, not merely legal; DRC clean; adversarial review clear.
4. **Fabrication + purchase** — verified Gerber, order at the pre-payment page. Gate: the package is verified independently of the tool that made it.

Two details make this more than a checklist. First, the skill refuses to start until the environment is actually ready: EasyEDA Pro plus the MCP bridge, a browser with the agent extension logged in to the PCB house and parts suppliers, and an approval watcher if the desktop raises a permission card for every browser action — with carts and payment explicitly excluded from automation. Second, **the agent never places an order and never pays**: it drives to the pre-payment page and hands you the click. The most expensive mistake in hardware — ordering the wrong board — stays outside the agent's reach by construction.

## Four Rules That Did the Work

Underneath the phases sit four rules the author says did the real work. **A green board is not a correct board**: every phase ends with a one-pass, read-only adversarial review that re-derives the numbers instead of reading them, and its termination criterion is written before it starts, or it loops. **Measured, not inferred**: 'this probably is not supported' is not a finding — if a claim decides whether work continues, prove it, and say which numbers were measured and which computed. **Verify the tool before the result**: three checkers on the reference project silently measured the wrong thing, so every geometric transform is calibrated against a known asymmetric object. **A wait condition must answer a specific question**: if this crashed right now, would my filter emit a line? One run on the reference project sat silent for 10 hours 53 minutes because the answer was no.

The repo ships the machinery those rules imply. `scripts/placement/` derives courtyards from real pads, computes via lanes and module-body clearance. `scripts/routing/` chains the Specctra DSN/SES autoroute with a four-state watchdog and a rate floor. `scripts/verify/` is the interesting one: Gerber parsing, clearance sweeps, drill census, netlist assertions and 3D interference checks that are **deliberately independent of the EDA** — the package is verified against the exported data, not against the tool that made it. `scripts/notify/` is a progress relay so a long run is never silent, and `skills/pcb/references/` loads on demand: workflow, review protocol, manufacturing, sourcing, EDA-MCP traps, mechanical/3D, bring-up.

## The Case Study Is the Honest Part

The skill was written from a single real project: a slim, bar-shaped programmable music player, 41.40 × 100.00 mm, four layers, 1.6 mm. The board carries 149 components on the panel-facing side with the battery cell glued flat to the bare back, 108 routed nets each one island, 1,882 track segments totalling 5,344 mm, 406 vias becoming 584 total holes after the final prune, and 100% hand-soldered assembly with no machine placement. The stack decision — panel in front, PCB behind it, components on the panel-facing side, cell on the back — was taken in Phase 1 from an area calculation, and later caught three of the documented defects. Final DRC: 0 clearance errors, 0 connection errors.

The author is scrupulous about what that proves. The board has been **released to fabrication and staged for purchase, but at the time of writing it has not been fabricated, assembled or powered on**. Every defect listed is a design-stage catch, verified against the design data, the exported Gerbers and the exported 3D solids — not against a physical failure. That is a weaker claim than 'we built it and it worked,' and the page says so in its first paragraph. For a repo two days old, that level of epistemic hygiene is rarer than the PCB tooling.

## Honest Limits and Who It's For

The limits are real. The physical proof is pending, and the case study is one board from one author. The environment stack — EasyEDA Pro, an MCP bridge, logged-in browser sessions, an approval watcher — is a project before the skill can start, and the skill correctly refuses to begin until those checks pass. The quality ceiling is your agent's: the skill routes and checks, but schematic judgement and layout decisions still depend on the model's electronics competence, so a weak model will produce a confident, well-gated wrong board. And while the README is English, the working vocabulary is partly Chinese-first with a linux.do community link, signalling the author's primary audience. None of that blocks an English-speaking maker, but it shapes the tone.

Who should care? Developers who already live in Claude Code or Codex and want a disciplined process for their first real board — someone who would rather have an agent that asks every question whose two answers give a different board, prices parts from live pages, checks its own work with independent Gerber-level scripts, and stops at the pre-payment page, than one that cheerfully produces an unroutable layout. The gate philosophy also travels: the four rules are good advice for any agent doing physical-world work, not just PCBs.