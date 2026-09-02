---
title: "Easel Review 2026 — An Open-Source AI Content Workspace That Discovers, Creates and Publishes Social Media Posts Across Six Chinese Platforms"
date: 2026-09-03
author: "AIPlaybook Editorial Team"
category: "Content Creation"
tags:
  - "Easel"
  - "Social-Media"
  - "Content-Automation"
  - "Xiaohongshu"
  - "Douyin"
  - "Zhihu"
  - "Bilibili"
  - "OpenClaw"
  - "Content-Creation"
  - "Agent"
  - "Open-Source"
  - "Marketing"
cover: "/images/reviews/easel-review-2026/cover.png"
meta_description: "Easel (ZJU-REAL/Easel, Apache-2.0, created 2026-08-28) is an open-source, OpenClaw-powered content workspace for social media creators — a private, continuously evolving social-media operations assistant that moves from an idea through discovery, planning, creation, publishing and attribution. It connects an OpenClaw agent, account profiles, 112 content skills, and real media tools, and supports login/adaptation/publishing to Xiaohongshu, Douyin, Kuaishou, Zhihu, Bilibili and WeChat Channels. This review covers the five-layer workflow (Discover, Plan, Produce, Publish, Attribute), the profile system, the Web workspace, real showcase outputs, the honest limitations (Chinese-platform focus, Xiaohongshu automation risk, v0.1.0 freshness), and who it's for."
rating: 7.3
dimensions:
  ease-of-use: 6.5
  features: 8
  value: 7.5
  performance: 7
  ecosystem: 6.5
pros:
  - "A full-loop social media content agent: five connected workflows (Discover, Plan, Produce, Publish, Attribute) in one continuous flow, so trend discovery, topic scoring, content calendar, creation, publishing and performance attribution aren't bolted-together point tools"
  - "Profile-driven, not one-shot generation: every account gets its own profile (positioning, style, audience, platforms, preferences and red lines, long-term memory) under profiles/<name>/ that persists across platforms, sessions and content cycles"
  - "112 executable skills with real scripts, not feature-list promises: image/card/poster/infographic generation, TTS, multi-role dubbing, voice cloning, AI music, subtitles, video editing, short-drama, and publishing skills write real deliverables to outputs/, with a skill-function-mapping doc"
  - "One source, many platform forms: a single topic can be adapted into Xiaohongshu cards, a short video, a Zhihu long-form article or a short post, each respecting the platform's format and length conventions"
  - "Real publishing and attribution loop: login/adaptation/publishing workflows for Xiaohongshu, Douyin, Kuaishou, Zhihu, Bilibili and WeChat Channels, with quality gates, risk checks, publishing checklists, and performance data fed back into the account profile"
  - "Research-backed and open: from Zhejiang University's REAL Lab and Peking University's OpenDCAI Lab, Apache-2.0, with a Web workspace (FastAPI + React) plus CLI, and an isolated OpenClaw profile so it doesn't clobber an existing setup"
cons:
  - "Chinese-platform-first: publishing targets Xiaohongshu, Douyin, Kuaishou, Zhihu, Bilibili and WeChat Channels — creators focused on Western platforms (Instagram/TikTok/X) won't get the publishing loop, and the docs are primarily Chinese (English README and project page exist)"
  - "Xiaohongshu automation risk is real and disclosed: the README warns that automated publishing may trigger verification, reach limits or account risk controls, and recommends previews and human-confirmed publishing — so the flagship platform is exactly where you must be most careful"
  - "Fresh and fast-moving: created 2026-08-28, first release v0.1.0 on 2026-08-31, ~200 stars/20 forks at review time — impressive for a week, but no community track record and APIs may shift"
  - "Requires an LLM key and optional media providers: minimal config needs ANTHROPIC_API_KEY (Claude model), and video/music/cloud-voice capabilities depend on external provider keys and services — it's an orchestrator, not a self-contained media suite"
  - "Heavier setup than a SaaS alternative: Linux/macOS, Python 3.10+, Node.js 22.19+, OpenClaw, plus optional `.[media]` extras, Playwright Chromium and FFmpeg for image/audio/video and browser publishing"
  - "Browser publishing depends on logged-in platform accounts and platform UI stability — the README itself notes real publishing can be affected by verification, permissions, risk controls and UI changes"
best-for: "Chinese social-media creators, brand content teams and studios (especially Xiaohongshu/Douyin/Zhihu operators) who want an open, self-hosted, profile-driven agent that handles the whole content loop — trend discovery to planning to card/video production to (carefully) publishing — and researchers exploring agentic social content workflows, given it's Apache-2.0 and built on OpenClaw"
price: "Free, Apache-2.0, open source (Python 3.10+). Requires an Anthropic-compatible LLM key (minimal .env: ANTHROPIC_API_KEY + CLAUDE_MODEL, default anthropic/claude-sonnet-4-6); optional paid providers for AI video, music and cloud voice; platform publishing needs your own logged-in accounts"
---

## The Pitch: A Content Partner That Remembers

On August 28, 2026, Zhejiang University's REAL Lab (with Peking University's OpenDCAI Lab) released **Easel** — an open-source "content workspace for social media creators" that takes a different stance from most AI writing tools. Instead of answering *"how should I do this?"*, Easel's agent actually makes the content: it connects an OpenClaw agent, account profiles, content skills, and real media tools, then produces and archives finished posts — with direct or on-demand publishing when you want it.

The framing is "a content partner that remembers." Each account has an independent profile — positioning, style, audience, platforms, preferences and boundaries (red lines), and long-term memory — that persists across platforms and sessions. Outputs get more on-brand over time because performance data flows back into the profile. In its first week the repo passed **200 stars and 20 forks**, with a v0.1.0 release on August 31.

## The Five-Layer Workflow

Easel's architecture is five connected workflows, and the pipeline is the product:

1. **Discover** — aggregate hot lists and industry news across Weibo, Douyin, Zhihu, Bilibili, Baidu and Toutiao; vertical trend research, content-gap analysis, event calendars, platform algorithm updates, competitor research, RSS aggregation and UGC discovery.
2. **Plan** — turn opportunities into topics: positioning analysis, audience profiles, persona and voice, account diagnosis, topic matrices with scoring, hooks and titles, scripts, storyboards, a content calendar, and series/campaign/livestream planning.
3. **Produce** — generate the actual assets: social copy and Xiaohongshu notes, long-form articles and novels, paper explainers, quote/knowledge cards, posters, infographics, charts, mind maps, memes and AI images — plus audio and video: TTS, multi-role dubbing, voice cloning, AI music, denoising/mixing, transcription, subtitles and translation, video editing, clipping, highlights, format conversion and green screen.
4. **Publish** — adapt titles, copy, aspect ratio and media per platform, run quality gates and risk checks (sensitivity, copyright), then publish through logged-in accounts for six platforms: Xiaohongshu, Douyin, Kuaishou, Zhihu, Bilibili and WeChat Channels.
5. **Attribute** — collect views, engagement, comments and content performance, run postmortems and ROI analysis, and preserve what works back into the account profile.

The 112 skills are mapped in a capability document (`docs/skill-function-mapping.md`), and the README's showcase shows real outputs: paper-explainer knowledge cards, novels across genres (cultivation comedy, horror, romance, suspense), lifestyle and meme cards, and finished videos including a talk-show drama and an AI character mukbang clip.

## Profiles, Workspace and the OpenClaw Foundation

Easel is built on **OpenClaw** — it manages an isolated `easel` OpenClaw profile with its own workspace, so installing it doesn't overwrite an existing OpenClaw configuration. The Web workspace (FastAPI backend + React frontend, default `http://localhost:7860`) manages sessions, assets, accounts, profiles, a content library and publishing states; the gateway defaults to port 18789. A CLI mirrors the essentials: `easel web`, `easel chat` (multi-turn terminal chat with profile selection), `easel skill <name> -i "..." [-p profile]` to run a single skill directly, plus `easel doctor` and `easel ping` for environment checks.

Profiles live under `profiles/<name>/` with six dimensions and can be created from a `_template` or in the Web workspace. Content projects are archived under `outputs/` with source material, intermediate files, metadata and deliverables together — so revision, retry and republishing don't scatter across chat history. Setup is `bash setup.sh` plus a minimal `.env` (an Anthropic-compatible key); optional `pip install -e ".[media]"`, Playwright Chromium and FFmpeg unlock image/audio/video and browser publishing.

## Honest Limitations

The biggest caveat is scope: Easel is built for the **Chinese social ecosystem**. Its publishing loop targets Xiaohongshu, Douyin, Kuaishou, Zhihu, Bilibili and WeChat Channels — creators working Instagram/TikTok/X get the discovery/creation half but not the publishing loop, and most documentation is Chinese (an English README and project page exist, and the UI/skills work regardless of language). The second caveat is disclosed by the authors themselves: **automated Xiaohongshu publishing risks verification, reach limits or account risk controls**, so they recommend preview and preflight checks with human-confirmed publishing — meaning the flagship channel is where automation must be most conservative. Third, it's a week-old v0.1.0: no community track record, and media capabilities depend on external providers you configure (video, music, cloud voice). Finally, it's an orchestrator, not a turnkey media suite — local image/audio work needs the media extras and FFmpeg, and browser publishing depends on logged-in accounts and platform UI stability.

## Verdict and Who It's For

Easel is the most complete open-source answer we've seen to the "content operations loop" problem for Chinese platforms: one profile-driven agent that discovers trends, plans a calendar, produces cards/videos/long-forms with genuinely executable skills, publishes with quality gates, and learns from performance. For Xiaohongshu/Douyin/Zhihu creators and brand teams who want a self-hosted, Apache-2.0 alternative to SaaS content tools — and for researchers interested in agentic social content — it's a Silver-tier pick with real showcase outputs, provided you respect the Xiaohongshu automation caution and bring your own LLM/media keys.

*Review based on public repository contents, README (EN), project page, and repository metadata as of 2026-09-03. Star/fork counts reflect a project six days old at review time.*
