---
title: "Hister Review 2026 — A Private, Full-Content Search Engine for Everything You've Read"
date: 2026-08-23
author: "AIPlaybook Editorial Team"
category: "Productivity"
tags:
  - "Hister"
  - "Self-Hosted"
  - "Search"
  - "Privacy"
  - "Open-Source"
  - "Bookmarks"
  - "Knowledge-Management"
  - "Review"
cover: /images/reviews/hister-review-2026/cover.png
meta_description: "Hister is a self-hosted, full-content search index from the creator of Searx that makes everything you've read searchable — browser history, local files, bookmarks, and crawled sites. We review its Bleve-powered index, MCP and terminal search, auth options, and the 60-comment Hacker News reaction."
rating: 8.0
dimensions:
  ease-of-use: 7.5
  features: 8.5
  value: 8.5
  performance: 8
  ecosystem: 7
pros:
  - "Full-content indexing: search the words inside every indexed page and file, not just titles and URLs"
  - "Privacy pedigree from the Searx creator (asciimoo): self-hosted, AGPL-3.0, no telemetry, no external requests"
  - "Flexible capture: Chrome/Firefox extension, file watchers, browser-history import, crawlers, and SingleFile HTML import"
  - "One-click imports from Karakeep, Linkding, Linkwarden, Readeck, Shaarli, and wallabag"
  - "Real auth options: token, password, or OIDC/OAuth with optional multi-user isolation and per-user data persistence"
  - "Search from the web UI, terminal, or an MCP assistant; rich query language with fields, phrases, wildcards, negation, priorities, and aliases"
cons:
  - "No browser-bookmark import yet — the author's own TODO; bookmark-first users must rely on history or crawlers"
  - "Safari support is stalled in a PR awaiting macOS maintainers"
  - "Public mode is the footgun: users warned that exposing a full browsing-history index on a LAN is dangerous and auth should default on"
  - "Mobile page capture requires Firefox, since Chrome on Android doesn't support extensions"
  - "No hosted version and AGPLv3 licensing set a high bar for non-technical users"
  - "The name drew real pushback — 'Hister' reads as 'Hitler' to some users (author: it's HISTORY on STEROIDS)"
best-for: "Privacy-conscious researchers and knowledge workers who want a personal, self-hosted search index over everything they've read — browser history, local files, bookmarks, and crawled sites — searchable from web, terminal, or their AI assistant"
price: "Free, open source (AGPL-3.0), self-hosted — no paid tiers, no hosted service planned"
---

## Quick Verdict

**Hister** is a self-hosted **personal full-content search engine**: it turns the pages you visit and the files you keep into a private index that you control. Built by **asciimoo — the same developer behind Searx** — it hits Hacker News' front page with **192 points and 60 comments** in a day, and the GitHub repo sits at **2,086 stars** with a Go codebase under AGPL-3.0.

The pitch is simple and overdue: bookmarks and browser-history search only match titles and URLs, so the *contents* of everything you've read are effectively lost. Hister indexes the **full text** of pages you visit (via browser extension), local files you watch, history you import, and sites you crawl — then lets you search that personal corpus with a real query language, from a web UI, a terminal client, or an MCP-connected AI assistant.

**The bottom line:** if you've ever spent ten minutes hunting for "that article I read in March about X," Hister is the tool you've been waiting for. It's free, self-hosted, privacy-first, and actively developed — with the caveat that "self-hosted" is doing real work in that sentence: this is a tool for people comfortable running a server, and the default public mode deserves a warning label.

## What Hister Is

Hister builds a **personal search index from pages you visit, bookmarks, browser history, local files, and crawled websites**. From the homepage:

> "Hister turns the pages you visit and the files you keep into a private, full content search index that you control."

It's the spiritual successor to asciimoo's first search project, Searx — a privacy-respecting metasearch engine. The author explains the pivot:

> "My first free software search project was Searx… but because of the limitations of the metasearch concept, I've decided to take a different approach."

Instead of proxying searches to other engines, Hister owns the index: it stores **extracted document content alongside the index** and displays a readable preview next to results — so you can re-read what you found without re-visiting the source (or even going back online).

## How It Works: Collect → Index → Find

The capture loop is deliberately simple:

1. **Collect** — the browser extension saves newly visited pages; file watchers monitor local folders; imports pull in browser history and bookmark-service exports; crawlers add whole sites.
2. **Index** — Hister extracts the parts that matter and indexes full text on the server you choose. The underlying indexer is **Bleve**, which its docs say handles millions of records.
3. **Find** — search from the web UI, the terminal, or an AI assistant via MCP.

A notable design decision: **Hister always stores the original material** — full original HTML — for offline previews. That costs about **100KB per document on average** (disable offline previews to shrink that significantly), and it's what makes the "read it in context" experience possible.

## Capture Options

- **Browser extensions** — Chrome and Firefox; pages indexed as you visit them. Mobile capture works via Firefox (Chrome on Android doesn't support extensions; the author recommends hosting Hister on a home server and accessing from multiple devices).
- **File watchers** — watch local folders (e.g., a ~/documents/notes directory with privacy-notes.md in the demo).
- **Imports** — browser history plus **Karakeep, Linkding, Linkwarden, Readeck, Shaarli, and wallabag** exports are supported out of the box.
- **SingleFile** — Hister can already import HTML files created by SingleFile, though direct extension integration is a longer-term goal.
- **Crawlers** — add whole sites to the index.

Notably, **plain browser-bookmark import doesn't exist yet** — the author confirmed it's on his TODO after an HN exchange, so bookmark-first users currently rely on history/crawler paths.

## Search & Retrieval

The query language goes well beyond keyword matching: **fields, phrases, wildcards, negation, priorities, and your own aliases**. Results show a **clean stored preview** beside them — extracted content rendered readably, with the source visible, so you "get back to the exact idea you remembered."

Access points:
- **Web UI** on your self-hosted server
- **Terminal** search
- **MCP** — an AI assistant can retrieve from your index, which was one of the most-requested integrations in the thread

## Privacy, Auth, and the Public-Mode Debate

Hister's privacy posture is strong: the index, stored page content, and rules **remain on the Hister server you configure**; the server has **no telemetry and makes no external requests**.

Authentication options are genuinely flexible — **token-based, password-based, or OIDC/OAuth**, with **optional multi-user handling** and per-user data persistence ("your searches will not be polluted by your family's," as one happy OIDC user put it). A "public mode" also exists.

That public mode sparked the thread's sharpest exchange. One user:

> "I tried this out this week and liked it but really wish this project had some form of auth. Opening the contents of every page you've ever visited, even to the local network, is not the best idea… It might just be nice to default to at least a user and pass login rather than just wide open."

The author's defense: the default configuration **binds only to localhost**, and a fresh install starts with an **empty database**. Both sides have a point — localhost binding is safe, but Docker users can accidentally expose the index to a LAN, and a browsing-history index is a uniquely sensitive dataset. **Treat "enable auth" as step one of any deployment.**

## Community Reaction

The 60-comment thread was overwhelmingly constructive:

- **The killer use case** — a user built a hobby research corpus (award travel) by scraping and importing blog posts: "I realized not too long ago that it could be a pretty useful research tool for one of my hobbies… I scraped and imported posts from the blogs I regularly [read]." The author called it "a really inspiring use case."
- **The comparison crowd** — "I've been using LinkDing + SingleFile for this. Nice to have another option!" (friction: manual capture), and a competitor plug for a Webtm.io-style "bring your own LLM" index.
- **Scale questions** — for a hypothetical 30GB email/Drive archive, the author recommended **Meilisearch** over Hister ("sure that Hister would be the best choice for this task"), showing honest scoping.
- **The name debate** — several users read "Hister" as "Hitler" (via Nostradamus associations); the author says it stands for **HISTory on STEROIDS**, named after a beetle and a stretch of the Danube. It's a genuine naming-risk lesson.
- **Searx lineage** — a Searx veteran (asciimoo's old collaborator) endorsed the AGPL choice: "asciimoo, thanks for using AGPL, I've been using hister for months now and it helped me a lot."

## Pricing

**Free, open source under AGPL-3.0.** No paid tiers, and no hosted version planned in the near term — the author's stated focus is maturing the core, with **federation and distributed search** as the longer-term vision rather than a centralized hosted product.

## Verdict

**Hister is the rare tool that solves a problem you didn't realize you had until you try it** — and then it's hard to imagine life without it. Full-content search over everything you've read, stored locally, with no telemetry, real auth options, terminal and MCP access, and a query language that respects power users. The Searx pedigree shows in every design decision.

The trade-offs are honest ones: it's self-hosted (Docker or a server required), the default public mode is a footgun until you enable auth, Safari support is stalled, and bookmarks import is still on the TODO. But for the target audience — researchers, knowledge workers, and self-hosting privacy enthusiasts — **it earns a strong recommendation**, and the "find it again" workflow is exactly what a personal knowledge base should feel like.

**Who it's for:** privacy-conscious researchers and knowledge workers who read a lot, forget where things were, and are comfortable running a small server.

**Who should skip it:** users who want a hosted, zero-maintenance service (wait for the federation roadmap or use a hosted alternative), and anyone who needs Safari/mobile-Chrome capture today.
