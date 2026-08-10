---
title: "AI Meeting Recorder Security Audit Workflow 2026 — What the 181,874-Meeting tl;dv Breach Teaches Us"
date: 2026-08-11
author: "AIPlaybook Editorial Team"
category: "Security"
tags:
  - "Security"
  - "AI-Meeting-Recorders"
  - "Tenant-Isolation"
  - "Firebase"
  - "Firestore"
  - "Vulnerability-Disclosure"
  - "Meeting-Recording"
  - "Workflow"
  - "SaaS-Security"
cover: /images/workflows/ai-meeting-recorder-security-audit-workflow-2026/cover.png
difficulty: "intermediate"
meta_description: "A six-step security audit workflow for evaluating AI meeting recording platforms, distilled from the tl;dv breach — where 181,874 meetings, 84,312 users, and 35,003 email domains sat in an unauthenticated Firestore collection for six months with the CTO ignoring disclosure. Includes the vulnerability mechanics, the timeline, and a vendor vetting checklist."
---

## Overview

On August 10, 2026, security researcher **BobDaHacker** published *"tl;dv (Too Lazy; Didn't Validate): 181,874 Meetings Left Wide Open"* — and it hit **508 points and 171 comments on Hacker News** within hours. The finding is as bad as it sounds: **tl;dv**, an AI meeting recorder with 2+ million users that drops a bot into Google Meet, Zoom, and Teams calls to record, transcribe, and summarize them, left its **entire meetings database queryable by any authenticated free-tier user** — for **six months**, with the CTO never responding to disclosure.

The scale is the story: **181,874 meeting records, 84,312 unique users, 35,003 email domains** — including **government meetings from 23 countries** (Brazil, Colombia, Peru, Ukraine, El Salvador, the Philippines, Chile, Indonesia, Mexico, the US, Qatar, Malaysia, Uzbekistan, Sri Lanka, Haiti, South Africa, Jamaica, Honduras, Argentina, Thailand, Japan, Israel, Belize), university meetings from Berkeley, the University of Tokyo and others, and corporate meetings from Mitsui-Soko, HubSpot, Confluent, and Mekari. At any given time, roughly **1,000 meetings were in `status: recording`** — meaning a thousand live, joinable calls, conference IDs exposed.

This article turns the incident into a **repeatable security audit workflow**: the six checks you should run (or demand from a vendor) before your team's sales calls, job interviews, and strategy sessions end up in someone's Firestore collection.

## The Vulnerability: How One Missing Rule Exposed Everything

Understanding the mechanics matters, because the pattern is common. From BobDaHacker's write-up:

1. **Auth handshake.** When you sign up for tl;dv, the platform authenticates you with a JWT and exchanges it for a **Firebase token** via `gw.tldv.io/v1/users/firebase/token`.
2. **The trust boundary is the token.** That token lets your client query their **Firestore database** at `projects/lmi-store/databases/(default)`.
3. **One collection forgot its rules.** The `meetings` collection had **no tenant isolation**. Every other collection — users, chats, transcripts, clips, recordings, videos, notes, teams, organizations — correctly returned 403. Only `meetings` was wide open.
4. **The blast radius.** Each meeting record exposes the **creator's email address**, the **conference ID** (a joinable Google Meet or Teams room), the provider, recording status, and timestamps. For meetings in recording status, that conference ID is a **live, active call**.

The researcher proved it: he joined a live Google Meet belonging to the **Malaysian Ministry of Education** — a lady presenting to 157 participants — and a call where students from a major US university were building a startup app, screen-sharing their whole project. Nobody invited him. "The Firestore database did."

Beyond the main database: over **1,000 of 27,334 scraped meeting IDs were public** (watchable video + transcript), exposing **715 invitee emails across 228 domains** — including a Brazilian government conservation meeting with WWF and The Nature Conservancy, meetings from **Ukraine's Ministry of Digital Transformation**, and a HubSpot sales call. And the company's internal **World Cup Pick'em** game (`worldcup.tldv.io`, built on Base44, "vibecoded") had a **zero-authentication Player API** leaking 43 player records including 19 @tldv.io employees with full names and corporate emails.

## The Disclosure Timeline: Six Months of Silence

The timeline is the second half of the lesson:

| Date | Event |
|------|-------|
| Late Jan 2026 | Firestore tenant-isolation bypass discovered |
| Jan 28, 2026 | Researcher contacts Raphael Allstadt on LinkedIn; emails CTO + Allstadt |
| Jan 29, 2026 | Allstadt: "I am sure the team is reviewing it very very soon ❤️" |
| Feb 14, 2026 | "Havent got an email and the vulnerability still works" |
| Feb 19, 2026 | "We're on it. It needs some time, but rest assured we're following through." |
| Mar 6, 2026 | "Still not fixed." — seen, no reply |
| Jul 22, 2026 | "Still not fixed..." — no reply |
| Aug 4, 2026 | Full disclosure published |

Meanwhile tl;dv's security page showed **SOC 2, GDPR, EU AI Act compliance badges**, AES-256, EU hosting, and a promise: "Our security team will respond within 24 hours." The CTO never responded in six months. As the researcher put it: "Their Firestore database has better uptime than their inbox."

The HN reaction was brutal. sktb: "Six Months!?! If I'd left a vulnerability like that open for 6 hours there'd be hell to pay. Something that critical is call for hitting the big red off button." Cthulhu_ added the worst part: "In this case the CEO was aware of it and... did nothing." Ekaros: "I keep being amazed how most basic things are not checked. Cross-tenant isolation is one of the main things I check for." And palmotea's sarcasm: "Don't worry, I'm sure this was all an AI agent's fault, so no one to blame and all they need to do is update their code review prompts to not make mistakes."

## The Workflow: Six Checks Before You Record Your Next Meeting

Use this as a vendor-evaluation checklist — or as a self-audit if you already run an AI meeting recorder.

### Step 1: Map the data flow (30 minutes)

Ask the vendor, or infer from docs: what happens to the audio after the bot joins? Where does the transcript live? What database and auth model? For tl;dv the answer was a JWT → Firebase-token exchange with client-side Firestore queries. **Client-side database access is a red flag** — it means every security decision lives in Firestore security rules, where one forgotten collection is a full breach. Server-side APIs, by contrast, can enforce tenant isolation in application code.

### Step 2: Test tenant isolation yourself (45 minutes)

Sign up for two accounts (free tier is fine) — ideally on different tenants. On account A, list meetings; on account B, try to query the same collection. The tl;dv failure was that the `meetings` collection returned data for *every* account while everything else returned 403. **Test every collection and every API endpoint**, not just the obvious ones. Ekaros's HN comment is the mantra: cross-tenant isolation is the first thing to check. Also check the "fun" internal apps — tl;dv's World Cup Pick'em had zero auth on its Player entity API.

### Step 3: Audit default privacy (30 minutes)

What's the default state of a recording — private or public? tl;dv's defaults were private (good), but 1,000+ meetings out of 27,334 sampled were public anyway. Ask: can a meeting be accidentally public? Can invitee emails leak via meeting metadata? What does the API return for a meeting you don't belong to?

### Step 4: Review the disclosure history (15 minutes)

Search for the vendor + "vulnerability", check their security page for a real channel, and test it: email them a low-severity finding and see how long the response takes. tl;dv's security page promised 24-hour response while the CTO ignored a critical disclosure for six months. **A compliance badge is not a security program.** SOC 2 + GDPR + EU AI Act badges sat on the same page as an unpatched critical vuln.

### Step 5: Check what metadata exposes (30 minutes)

Even "private" recordings leak metadata. tl;dv's records exposed creator emails, conference IDs, and recording status — and a conference ID for a meeting in recording status is a **live room you can walk into**. Ask vendors: does meeting metadata include joinable room IDs? Is metadata accessible to other tenants? Could a competitor enumerate your sales team's call schedule?

### Step 6: Plan your exit and escalation (ongoing)

If a critical issue is confirmed, what's your recourse? For customers, the practical options: demand a fix with a deadline, pause bot usage, export and delete recordings. For researchers, the incident shows disclosure norms failing — after 6 months and a published 508-point post, the bug was *still* live (the researcher wrote "I reported this on January 28th, 2026. It is now July 2026. The Firestore database is still wide open."). Know your org's policy on public disclosure before you engage.

## Community Reaction: What HN Said

- **sktb**: "Six Months!?! If I'd left a vulnerability like that open for 6 hours there'd be hell to pay." — the response-time expectation for critical data exposure.
- **Cthulhu_**: "In this case the CEO was aware of it and... did nothing." — awareness without action is the same as absence.
- **Ekaros**: "Cross-tenant isolation is one of the main things I check for." — the exact check that would have caught this.
- **pc86**: "Sturgeon's Law is proved correct time and again… especially with a low bar to entry like what is essentially AI-backed transcription-as-a-service, I'm not sure 90% is high enough." — commoditized AI SaaS means more vendors, more sloppy security.
- **SpaceL10n**: "Hmm, does Ukraine know that Russia is watching the Ministry of Digital Transformation's meetings?" — the geopolitical stakes of exposed government meeting metadata.
- **palmotea**: "I'm sure this was all an AI agent's fault… update their code review prompts" — the blame-the-AI deflection, pre-emptively mocked.

## Bottom Line

The tl;dv incident is a textbook case of **one forgotten Firestore rule turning a trusted recording platform into a surveillance tool**. Six months of silence from a SOC 2–badged vendor should reset your assumptions about what compliance certifications prove. Run the six steps above before you let any AI bot into your next strategy session — and if you're a customer of a platform that stores your sales calls and interviews, the cheapest security audit you can do is the one that takes 15 minutes: ask to see the meeting database's tenant-isolation rules, and time how long the vendor takes to answer.

**tl;dv's status as of this writing:** vulnerability still unpatched per the researcher's July 22 check-in; the CTO still has not responded. The Firestore meetings collection remains the cautionary tale for every AI meeting tool on the market — including the ones your company might be evaluating this week.
