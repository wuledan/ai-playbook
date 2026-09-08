---
title: "bankmcp Review 2026 — A Self-Hosted, Read-Only MCP Server That Lets Your AI Read Your Own Bank Accounts"
date: 2026-09-09
author: "AIPlaybook Editorial Team"
category: "Security"
tags:
  - "bankmcp"
  - "MCP"
  - "PSD2"
  - "Open-Banking"
  - "Enable-Banking"
  - "Claude"
  - "Claude-Code"
  - "Cursor"
  - "Personal-Finance"
  - "Self-Hosted"
  - "TypeScript"
  - "Open-Source"
cover: "/images/reviews/bankmcp-review-2026/cover.png"
meta_description: "bankmcp (created September 7, 2026, MIT, 160+ stars in two days) is a small self-hosted MCP server that lets your AI assistant read your own bank accounts over the standard Model Context Protocol. It connects to your banks through Enable Banking — one PSD2 API wrapping 2,700+ European banks — and exposes them to any MCP client (Claude, Claude Code, Cursor, ChatGPT, Ollama and others) as a connector. Read-only by design: no payments, no third party holding your data, one user, and the server itself stores no balances or transactions and sends no telemetry. Ask questions like 'Has the invoice from Acme been paid?', 'What did we spend on groceries in August?' or 'Which subscriptions am I paying for, and what do they cost per year?' This review covers the architecture (your assistant talks to your server, your server talks to Enable Banking via JWT, Enable Banking talks to your bank via PSD2), the two deployment paths (on your own machine for desktop MCP clients with nothing to deploy and no password, or on a small server for claude.ai and phone access), the Enable Banking restricted production mode that allows accessing your own accounts without a commercial contract, the 180-day consent lifecycle with in-conversation renewal, the honest caveats (bank logins happen at your bank's site through Enable Banking's licensed hop, and the localhost certificate warning), and who should care about giving an AI read access to their own finances."
rating: 7.0
dimensions:
  ease-of-use: 7
  features: 7
  value: 7
  performance: 7
  ecosystem: 7.5
pros:
  - "Read-only is the right default for a finance MCP: the server exposes balances, transactions and account metadata but no payment initiation, which keeps the blast radius of an AI mistake (or a prompt injection) at 'it read something it should not have' instead of 'it moved money' — and the README's example questions are all read queries"
  - "Self-hosted with a small trust surface: state lives in ~/.bankmcp on your machine (or a /data volume on your server), the server holds the Enable Banking application key, consents and account ids but does not store balances or transactions, sends no telemetry, and does not touch your system's trust store — delete the state folder to forget everything"
  - "Standard MCP means it works everywhere MCP works: Claude Code (claude mcp add bankmcp -- npx -y bankmcp), Claude Desktop via a one-click .mcpb extension file, Cursor and other desktop clients with the same stdio command, and on a server it becomes a remote connector for claude.ai, ChatGPT, Mistral Le Chat and others — tested with Claude, Claude Code and Ollama, with the others following the same standard"
  - "The Enable Banking restricted production mode is the key unlock for individuals: production normally requires a commercial contract, but restricted mode explicitly allows accessing your own accounts for individual non-commercial use — you register a Production application, activate it by linking accounts, log in at your bank and approve, and the API returns only the accounts you linked"
  - "Genuinely useful question patterns out of the box: invoice paid?, monthly grocery spend, subscription audit with per-year costs, balance-drop alerts — plus labeled accounts ('Everyday,' 'Joint expenses,' 'Mortgage') where every tool accepts labels instead of ids, and optional NOTIFY_WEBHOOK_URL webhooks for watch notifications and sign-in alerts"
  - "Consent lifecycle is handled as a product feature, not an afterthought: consents last up to 180 days, the server tells you when one is about to expire, and the same conversation renews it — plus bankmcp.dk documentation and a browser-based setup flow that generates its own localhost certificate or accepts mkcert-provided ones"
cons:
  - "Europe-only by construction: Enable Banking wraps 2,700+ European banks behind one PSD2 API, so if your bank is not in that network (or your country has no PSD2 open-banking regime) bankmcp simply has nothing to connect to — this is a European personal-finance tool, not a global one"
  - "The trust model still routes through a licensed third party: every balance and transaction you ask for passes through Enable Banking's servers on the way to yours (that hop is how PSD2 works), and while Enable Banking does not store the data or see your bank credentials — you log in at your bank's own site — you are trusting their restricted-mode terms for individual non-commercial use, which the README tells you to read before relying on it"
  - "You are sending financial data to your AI vendor: the whole point is that your assistant reads your accounts, so transactions and balances go to whatever model provider your MCP client uses — the README is upfront that this is the trade-off of the product, but users must consciously accept that their bank data now travels to Claude, ChatGPT or whichever assistant they connect"
  - "Operational rough edges at launch: the localhost flow produces a browser certificate warning the first time (mitigable with mkcert and TLS_CERT_PATH/TLS_KEY_PATH), a server deployment needs a persistent volume plus a public HTTPS address plus BASE_URL, and Node 24 or newer is required — a young project (two days old at review time, ~160 stars, 30+ forks) with the usual early-adopter setup friction"
  - "Narrow data surface by design: read-only access to accounts means no payment initiation, no transfers, no categorization engine, no budgeting logic — bankmcp is a connector, and everything smart about your money still has to be built by the assistant or by you"
best-for: "European individuals and small-business owners who already use Claude, ChatGPT, Cursor or another MCP client, keep their accounts at banks inside the Enable Banking network, and want to ask natural-language questions about their own money ('which subscriptions am I paying for?', 'what did we spend on groceries in August?') with read-only, self-hosted access — privacy-conscious users who would rather run the connector themselves than hand bank credentials to a fintech app"
price: "Free and open source (MIT). Run on your own machine with Node 24+: claude mcp add bankmcp -- npx -y bankmcp (Claude Code), the bankmcp.mcpb file (Claude Desktop), or the same npx stdio command (Cursor and others). For claude.ai or phone access, deploy the Dockerfile on Railway, Fly.io or your own box (persistent volume at /data, public HTTPS, BASE_URL set). Both paths need a free Enable Banking account to register an application; production restricted mode for your own accounts is allowed for individual non-commercial use. API usage is billed by your bank/Enable Banking per their terms — the server itself has no subscription."
---

## The Pitch: Your AI Now Reads Your Bank

bankmcp, released September 7, 2026 by noskillish under MIT, is a small open-source server you host yourself (npm package `bankmcp`) that answers the question a surprising number of people have been asking their assistants for years: *what is my money doing?* It connects to your banks through Enable Banking — one PSD2 API wrapping 2,700+ European banks — and exposes them to any MCP client as a standard connector. Read-only, self-hosted, one user. No payments, no third party holding your data. Two days after release it passed 160 stars and 30 forks, and its example questions are the kind that make the pitch click immediately: 'Has the invoice from Acme been paid?', 'What did we spend on groceries in August?', 'Which subscriptions am I paying for, and what do they cost per year?', 'Tell me when my balance drops below 5,000.'

The architecture is three hops, and the README draws them clearly: **your assistant** (Claude, ChatGPT, Cursor, or any MCP client) talks to your server as a connector over OAuth; **your server** holds the Enable Banking application key, the bank consents and your account ids — but no balances or transactions; **Enable Banking** is the licensed provider between your server and your bank over PSD2. You sign in once with a password; tokens handle the rest. Your bank credentials never reach Enable Banking or your server, because you log in at your bank's own site. That hop through Enable Banking is the one part of the chain that is not on your machine — and the README is honest that it is exactly how PSD2 works.

## Read-Only by Design

The single most important product decision is that bankmcp is read-only. There is no payment initiation surface at all. That caps the worst-case scenario of an AI misunderstanding — or a prompt injection aimed at an assistant with finance tools — at 'it read a transaction it should not have' rather than 'it moved money.' Every tool the server exposes reads balances, transactions or account metadata. The server does not store balances or transactions, sends no telemetry, and keeps its entire state in `~/.bankmcp` (or a `/data` volume on a server deployment) — delete the folder to forget everything. That is a small, auditable trust surface for a piece of software sitting between an AI and a bank.

## Two Deployment Paths

On your own machine — for Claude Desktop, Claude Code, Cursor and other desktop MCP clients — there is nothing to deploy and no password. Claude Code: `claude mcp add bankmcp -- npx -y bankmcp`. Claude Desktop: download `bankmcp.mcpb` and open it, or add the stdio entry by hand in `claude_desktop_config.json`. Cursor and others: the same `npx -y bankmcp` as a stdio server. Then ask your assistant anything about your bank; it answers with a localhost address; the setup page lists the values to register an application at Enable Banking and takes the application id plus the key file. Your browser warns once about the certificate on localhost — the server made it for itself because Enable Banking requires HTTPS for the bank redirect — and you continue past it, or avoid the warning with `mkcert localhost 127.0.0.1` pointed at via `TLS_CERT_PATH` and `TLS_KEY_PATH`.

On a small server — for claude.ai or phone access — any container host works: Railway (New Project, Deploy from GitHub repo, volume at `/data`, generate a domain), Docker Compose on your own box with a TLS terminator in front (Caddy: two lines), or Fly.io the same way. The server learns its own address, and a fresh server shows a setup page. Everything can be configured by environment variables instead (`EB_APP_ID`, `EB_PRIVATE_KEY`, `ADMIN_PASSWORD_HASH`, `BASE_URL`, `DEFAULT_COUNTRY`), with `npm run check` verifying a configuration from a terminal. Then the connector is added in claude.ai via Settings → Connectors → Add custom connector (`https://YOUR-HOST/mcp`), in Claude Code via `claude mcp add --transport http bank https://YOUR-HOST/mcp`, and in other MCP clients the same way.

## The Restricted Production Mode

The clever part for individuals is Enable Banking's **restricted mode**. Production normally requires a commercial contract, but restricted mode explicitly allows accessing your *own* accounts for individual non-commercial use. You register a Production application, click Activate by linking accounts, log in at your bank and approve for each bank you want, and the application becomes active with the API returning only the accounts you linked. Consents last up to 180 days; the server tells you when one is about to expire, and the same conversation renews it. Account labels ('Everyday,' 'Joint expenses,' 'Mortgage') are suggested at connect time, and every tool accepts labels instead of ids.

## Honest Limits and Who It's For

The limits are structural. This is a European tool — Enable Banking wraps 2,700+ European banks behind PSD2, so users outside that network have nothing to connect. The trust model routes through Enable Banking's licensed hop, and while they do not store your data or see your credentials, you are relying on their restricted-mode terms for individual non-commercial use. And the entire premise means your financial data travels to whatever AI vendor your MCP client uses — a trade-off the README owns directly. bankmcp is also deliberately narrow: a read-only connector, not a budgeting app; everything smart about your money still has to be built by the assistant or by you. But for European users who already live in an MCP client and want natural-language answers about their own accounts with a self-hosted, read-only, auditable connector, bankmcp is the first tool that does exactly that — and its two-day star run suggests the itch was real.
