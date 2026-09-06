---
title: "codenotch Review 2026 — A macOS Notch That Shows How Much of Your Claude Code, Cursor and Codex Limits You've Burned"
date: 2026-09-07
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "codenotch"
  - "Claude-Code"
  - "Cursor"
  - "Codex"
  - "Usage-Monitoring"
  - "macOS"
  - "Rate-Limits"
  - "Coding-Agents"
  - "Antigravity"
  - "GLM"
  - "Open-Source"
cover: "/images/reviews/codenotch-review-2026/cover.png"
meta_description: "codenotch is an open-source macOS app (created 2026-09-05, 679+ stars and 90 forks in its first two days, MIT license) that pins a small black notch to any screen edge showing how much of each AI coding assistant's usage limit you have burned — Claude Code, Cursor, Codex, Antigravity and GLM — with a spinning arc when a session is busy and a pulsing amber ring when one is blocked waiting on you. Instead of signing in anywhere, every provider adapter borrows the credential or session the owning tool already holds: Claude Code's OAuth token against the same endpoint its own /usage panel reads, Cursor's signed-in session from its local SQLite state, Codex's app server asked live for rate limits, Antigravity's local language server, and GLM's Z.ai Coding Plan monitor endpoint. Each adapter declares a Fidelity tier (official, derived or manual) so the UI never presents a guess as a vendor-published number, polling backs off against 429s with a persisted deadline, and every failure degrades to a visible stale/needsAuth/error state instead of an invented percentage. This review covers the provider matrix, the notch UI and its state bands, the honest caveat that no vendor publishes a clean usage API, and how codenotch compares with alternatives like Honey for Devs and manual /usage checks."
rating: 7.4
dimensions:
  ease-of-use: 8
  features: 7.5
  value: 7.5
  performance: 7.5
  ecosystem: 6.5
pros:
  - "A genuinely useful ambient question answered at a glance: 'which of my coding assistants still has room right now?' Instead of digging into each tool's settings or /usage screen mid-thought, you hover a small notch pinned to the screen edge and see every provider's burned percentage, its limit windows and when they reset — the working pattern of running two or three assistants in parallel is exactly what it is designed for"
  - "Never signs in anywhere: each adapter borrows the credential or session the owning tool already holds (Claude Code's OAuth token in the login keychain, Cursor's signed-in session from its SQLite state, Codex's app server, Antigravity's language server, GLM's monitor endpoint), so installing codenotch adds no new account and disabling a provider in Settings stops reading its credential entirely"
  - "Fidelity is declared, not hidden: every provider implements UsageProvider with an explicit .official, .derived or .manual tier, the ring always shows the same session window Claude Code's own /usage leads with so the two never disagree, and failures degrade to visible stale/needsAuth/error states rather than made-up percentages"
  - "It answers 'is it still working?': a thin arc spins inside a provider's ring while a session is busy and the ring pulses amber when one is blocked waiting on you, with hover showing every live session by name, where it is running and what it wants — the always-on status layer that usage panels lack"
  - "Thoughtful macOS engineering: the notch pins to the usable edge and follows the Dock when it hides or moves, top placement takes the exact shape of a hardware notch, multi-login works (any ~/.claude-<slug> directory gets its own ring), polling drops to every 5 minutes when nothing is running, and 429 back-off is a floor-raiser with a persisted deadline so relaunching during a penalty waits instead of spending an attempt"
  - "Honest scope: the README and design spec openly state that the name is a placeholder, that no vendor publishes a clean usage API, and that adapter endpoints can change without notice — with response shapes pinned by tests and an MIT license plus a signed Sparkle auto-update pipeline"
cons:
  - "macOS only by design (SwiftUI + AppKit, XcodeGen project, LSUIElement agent process): Windows users get nothing, and there is a Windows-port issue (#7) where a contributor is ready but the maintainer has not merged it yet"
  - "Young and still settling: created September 5, 2026, reviewed at v1.4.0 with 12 commits and 5 contributors in its first two days — the provider list (Claude Code, Cursor, Codex, Antigravity, GLM) is already shifting, with open issues asking for Grok Build, SuperGrok weekly pools and OpenCode Go plan windows"
  - "The honest caveat cuts both ways: adapters read internal endpoints, local databases and language-server RPCs that the vendors can change without notice, so a reading can silently become stale between releases — codenotch degrades gracefully, but it cannot fix a vendor that stops exposing what its own app reads"
  - "Single-device scope: the notch is per-Mac and per-screen-edge with no sync across machines, and multi-monitor placement still has an open issue (#16) about the notch jumping between displays; a usage ceiling for a team or an account shared across two laptops is not tracked"
  - "It is an observer, not a manager: codenotch tells you where you stand but cannot pause a runaway agent, route work to a provider with headroom, or enforce a ceiling — the 'plan ceilings' decision in TASKS.md is still open"
best-for: "Developers who run Claude Code, Cursor, Codex, Antigravity or GLM (often several at once) on a Mac and want a passive, always-visible answer to 'which assistant still has budget right now?' — especially people who have been caught mid-session by a reset limit or who keep a work and personal Claude Code login apart via CLAUDE_CONFIG_DIR and want both rings visible without opening either tool"
price: "Free and open source (MIT). Install from the GitHub repo and build with make run (XcodeGen + Xcode, no signing identity required for a Debug build); release builds use a Developer ID certificate and App Store Connect notary profile, and updates ship through a signed Sparkle feed that checks daily. Run with CODENOTCH_DEMO=1 to see fixed sample data instead of live readings"
---

## The Problem: Usage Limits You Only Discover Mid-Thought

Every serious AI coding assistant meters you on rolling session windows. The standard way to know where you stand is to interrupt your flow, open the tool, dig into a settings or usage screen — or find out the hard way when the model stops answering because a limit reset. Now multiply that by the actual working pattern of 2026: Claude Code for one project, Cursor for another, Codex for a third, sometimes Antigravity or GLM in the same afternoon. There is no single place that answers the question that actually matters: **which one still has room right now?**

vinzdg's codenotch, created September 5, 2026, is a macOS agent app built to answer exactly that. It pins a small black notch to a screen edge — a vertical pill drawn with inverse rounded corners so it reads as part of the hardware bezel — and each provider it tracks gets one cell: a progress ring sweeping clockwise from 12 o'clock, a percentage of the limit you have *burned* (not what remains), and a glyph. Hover a ring and a tooltip lists that provider's limit windows and when they reset. In two days it passed 679 stars and 90 forks on an MIT license, which tells you how many people recognized the pain.

## What It Reads: A Provider Matrix With No New Logins

The design decision that separates codenotch from a dashboard you configure by hand: **it never signs in anywhere.** Every reading is borrowed from a credential or session a tool on your Mac already holds, so install and sign in to any of them and its ring appears. The provider table in the README is specific about the source for each:

- **Claude Code** reads the OAuth token in the login keychain against the same endpoint Claude Code's own `/usage` uses — which is why the ring's headline number always agrees with what the tool itself reports. Two Claude Code logins become two rings: keep a work account apart with `CLAUDE_CONFIG_DIR=~/.claude-work claude` and you get a **Claude (work)** ring with its own limits, sessions and Settings row. Any `~/.claude-<slug>` directory Claude Code has run against is found at launch; the default `~/.claude` always comes first and the rest are alphabetical so rings never swap places.
- **Cursor** reads the editor's own signed-in session from its local SQLite state — no separate sign-in.
- **Codex** asks its own app server live for the current rate limits, falling back to its rollout log when Codex is not running.
- **Antigravity** queries its local language server first, then Google's quota endpoint, and falls back to a plain request count when neither will answer for the account.
- **GLM** reads Z.ai's Coding Plan monitor endpoint, using a key borrowed from whichever coding tool already holds one — Claude Code's `settings.json`, ZCode or OpenCode.

Switching a provider off in Settings stops its credential being read at all and forgets the readings taken from it; it does not sign you out of the tool that owns the account, and the row says so.

## Fidelity, States and the Honest Caveat

The README's architecture section is where codenotch earns its credibility. Every provider implements a `UsageProvider` protocol and declares its own **Fidelity** — `.official`, `.derived` or `.manual` — so the UI never presents a guess as if a vendor had published it. A `UsageStore` polls them on a timer, keeps the last good reading across launches, and degrades every failure to a visible status (`stale`, `needsAuth`, `error`) rather than a made-up percentage. The tooltip shows a "~" prefix on any number the app derived rather than read from a vendor — the spec requires it, and even the demo fixture renders as "~73% Used" to prove the convention holds.

Then comes the honest caveat, stated plainly: *no vendor publishes a clean "your session limit is N% used" API for any of these tools.* Each adapter reads whatever the owning app itself reads from — an internal endpoint, a local database, a language server's own RPC — and those can change without notice. Every adapter's response shape is pinned by tests, and every failure degrades to a visible status. Two details show the engineering care behind that promise. The app is signed with a stable Developer ID identity so the one-time "Always Allow" grant on Claude Code's and Antigravity's keychain items survives rebuilds, and the secret is read only when the owning app has actually changed it — checked via the item's modification date, which is not behind the same access prompt as the credential. And rate limits are handled with unusual discipline: Claude's endpoint returns 429 with an unhelpful `Retry-After: 0` if polled too hard, so the back-off treats that as a floor-raiser only — 60 seconds, doubling per consecutive 429, capped at 15 minutes — and the deadline is persisted, so relaunching during a penalty waits instead of spending an attempt on it.

## The Notch, the Rings and the Live Session Status

The UI is deliberately restrained. At rest the notch is a small pill on the screen edge that unfolds when the pointer reaches it, configurable to always show or hide entirely; settings live in an orb below the notch. It works in one-dimensional stack space regardless of which edge it is on, and `NotchPlacement` is the only place that maps that back onto real screen coordinates. Right and left edges keep a vertical column; top and bottom lay readings out side by side. It pins to the *usable* edge, so a bottom notch rests on the Dock and follows when the Dock hides or moves, and on a Mac with a hardware notch the top placement takes its exact shape so the two read as one. Every measurement in `NotchLayout` is quoted from the design frame (`docs/design/frame-124-hover-tooltip.png`), and the code deliberately follows the frame where the prose spec disagreed — colour-band thresholds at 50% and 70%, hexes sampled from the frame, and the ring showing the session window rather than whichever limit is most alarming, so a number that means one thing never silently changes meaning.

The second question codenotch answers — beyond "how much have I burned?" — is **"is it still working?"** A thin arc spins inside a provider's ring while a session is busy, and the ring becomes a pulsing amber when one is blocked waiting on you. Hover to see every live session by name, where it is running and what it wants. That turns the notch from a limit meter into an always-on status layer for every coding agent on the machine, which is the part usage panels never give you.

## Honest Limits and Who It's For

codenotch is young — 12 commits, 5 contributors and an 11-issue tracker in its first two days — and its open issues read like a healthy backlog rather than a bug list: Grok Build support (#17), a fix for the notch jumping between displays on multi-monitor Macs (#16), reading Codex account limits from the usage endpoint (#14), OpenCode Go plan windows via the official endpoint (#11), and a Windows port (#7) where a contributor is waiting on the maintainer. The TASKS.md file is equally candid about open product decisions: the final app name (Codenotch is a placeholder), whether plan ceilings should be configured by hand or inferred from observed peak usage, and whether web-session adapters (ChatGPT et al.) are in scope for v1 — the README notes Claude now answers that question for itself because its OAuth endpoint is in, which puts the same question live for OpenAI and Perplexity.

This is not a cost-reduction tool — that is Honey for Devs' territory, which cuts token usage with a cross-tool skill. codenotch is a *meter*: it tells you where every assistant stands, when limits reset, and whether a session is grinding or waiting on you, without adding a single new login to your machine. For developers who juggle two or three coding agents across a day and have been caught mid-thought by a reset limit, that passive awareness is worth the install — with the honest caveat that the adapters' underlying endpoints belong to the vendors, and the notch can only be as current as the tools it borrows from.
