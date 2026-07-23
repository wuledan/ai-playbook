---
title: "OneCLI Review 2026 — Open-Source Credential Gateway That Keeps Secrets Out of AI Agents"
date: 2026-07-24
author: "AIPlaybook Editorial Team"
category: "Security"
tags: [onecli, credentials, security, ai-agents, mcp, secret-management, vault, open-source, 2026, review]
cover: "/images/reviews/onecli-review-2026/cover.png"
meta_description: "OneCLI review 2026 — open-source credential gateway for AI agents. Tested transparent credential injection, AES-256-GCM vault, MCP integration, and multi-agent support. 2.6k GitHub stars and trending on HN."
rating: 8.2
dimensions:
  ease-of-use: 8
  features: 9
  value: 9
  performance: 8
  ecosystem: 7
---

## Introduction

OneCLI is an open-source credential gateway designed to solve one of the most pressing problems in the AI agent ecosystem: **how do you give agents access to dozens of API services without exposing raw credentials?**

Instead of baking API keys into every agent configuration, OneCLI sits as a transparent proxy between your agents and the services they call. Agents use placeholder keys (like `FAKE_KEY`) in their code, and the gateway intercepts outbound HTTP calls, swaps placeholders for real credentials from an encrypted vault, and forwards the request. The agent never touches the real secrets.

Launched in March 2026 and already at **2,630 GitHub stars**, OneCLI hit the Hacker News front page on July 23 with 68 points in 7 hours. It's also notable for its deep integration with the OpenClaw ecosystem and MCP (Model Context Protocol) tooling.

## Architecture

OneCLI's architecture is cleanly split into three components:

**1. Rust Gateway** (port 10255)
A high-performance HTTP proxy that intercepts outbound agent requests. Agents authenticate via `Proxy-Authorization` headers with access tokens. The gateway matches requests against stored credential rules (by host, path, and header patterns), swaps placeholders for real decrypted credentials, and forwards the request.

**2. Web Dashboard** (port 10254)
A Next.js web application for managing agents, secrets, and permissions. Built with shadcn/ui components. Administrators create agents, assign access tokens, and configure which credentials each agent can access.

**3. Secret Store**
AES-256-GCM encrypted credential storage. Secrets are encrypted at rest and decrypted only at request time — never stored in plaintext. Decryption happens in-memory during the credential injection pipeline.

## Key Features

### Transparent Credential Injection
This is the core value proposition. Your agent code uses placeholder strings like `YOUR_OPENAI_KEY` or `FAKE_KEY`, and OneCLI transparently swaps them for the real values when the request passes through the gateway. No code changes needed in the agent.

### Host & Path Pattern Matching
Credentials are matched by outbound request patterns — specific API endpoints get specific credentials. This allows granular control: one agent gets GitHub tokens, another gets AWS keys, and neither sees the other's secrets.

### Multi-Agent Support with Scoped Permissions
Each agent gets its own access token. Administrators can scope which secrets an agent can resolve, providing a proper zero-trust model for multi-agent systems.

### Two Authentication Modes
- **Single-user (local mode)**: No sign-in required, ideal for local development
- **Google OAuth**: Multi-user team deployments with proper identity

### Vault Integrations
OneCLI supports Bitwarden and other password managers as secret value sources, enabling teams to use their existing credential management infrastructure.

### MCP Integration
As highlighted by its GitHub topics (mcp, openclaw, nanoclaw), OneCLI integrates natively with the MCP ecosystem, making it a natural fit for agents built on Claude Code, Cursor, and other MCP-compatible tools.

## Installation & Setup

Getting started is straightforward:

**Quick install:**
```bash
curl -fsSL https://onecli.sh/install | sh
```

**Manual Docker setup:**
```bash
git clone https://github.com/onecli/onecli.git
cd onecli
docker compose -f docker/docker-compose.yml up -d --wait
```

Once running, open **http://localhost:10254**, create an agent, add your secrets, and point your agent's HTTP gateway to **localhost:10255**. The Quick Start runs in local mode (single-user, no login), so no environment configuration is needed.

## Developer Experience

OneCLI is built with TypeScript (web) and Rust (gateway). The project structure is clean:

```
apps/
  web/          # Next.js dashboard (port 10254)
  gateway/      # Rust HTTP gateway (port 10255)
packages/
  db/           # Prisma ORM + migrations
  ui/           # Shared shadcn/ui components
```

The gateway's Rust implementation ensures both performance and memory safety — critical for a security-critical proxy handling credential injection.

## Security Assessment

OneCLI's security model is well-thought-out:

- **Encryption at rest**: AES-256-GCM, auto-generated encryption keys by default
- **Decryption only at request time**: Secrets live encrypted on disk; decryption keys are ephemeral
- **No secret exposure to agents**: Agents never see real credentials in configs, logs, or environment variables
- **Host-enforcement bypass fix**: A recently patched vulnerability (CVE-2026-xxx, fix in #438) shows active security maintenance
- **Audit logging**: Recently added (#103), providing a tamper-evident trail of credential access

The repository also demonstrates strong security hygiene with 304 commits, automated CI/CD via release-please, and an active maintainer.

## Pricing

OneCLI is **100% open source** under the Apache 2.0 license. There's no paid tier, no feature gating — everything is available in the GitHub repository. Docker-based deployment means you can run it entirely self-hosted.

## Community & Support

- **GitHub**: 2,630 stars, 152 forks, 66 open issues, 27 open PRs
- **Discord**: Active community server
- **Documentation**: Full docs at [onecli.sh/docs](https://onecli.sh)
- **Changelog**: Detailed release notes with semantic versioning (currently v1.42.0)

The project has an impressive 304 commits from active development, with features like 1Password integration, Google Calendar app integration, and a unified policy engine all shipping within its first four months.

## Comparison to Alternatives

| Feature | OneCLI | Vault (HashiCorp) | Doppler | envkey |
|---------|--------|-------------------|---------|--------|
| Open source | ✅ Apache 2.0 | ❌ BSL | ❌ | ✅ MIT |
| Agent-optimized | ✅ Transparent proxy | ❌ | ❌ | ❌ |
| MCP integration | ✅ Native | ❌ | ❌ | ❌ |
| Self-hosted | ✅ Docker | ✅ | ❌ | ✅ |
| Pattern matching | ✅ Host + path | ✅ Path | ✅ Env-based | ❌ |
| Multi-agent | ✅ Scoped tokens | ✅ | ❌ | ❌ |

## Strengths

1. **Solves a real problem**: Credential management for AI agents is a growing pain point
2. **Transparent injection**: Zero code changes for agents — the killer feature
3. **Strong security model**: AES-256-GCM + runtime-only decryption
4. **Excellent developer experience**: Simple Docker setup, clean UI
5. **Active development**: 304 commits, weekly releases, responsive maintainers
6. **MCP native**: Integrates with the fastest-growing AI agent protocol
7. **Apache 2.0**: Permissive licensing for commercial use

## Weaknesses

1. **Young project**: First release was March 2026 — limited production track record
2. **No mobile agent support**: Desktop/server-focused only
3. **Rust gateway complexity**: Self-hosters need Docker; no standalone binary currently
4. **Limited protocol support**: HTTP/HTTPS only — no direct gRPC or websocket credential injection
5. **Single-region by default**: No built-in multi-region HA for production deployments

## Verdict

OneCLI hits a sweet spot in the AI infrastructure landscape. As organizations deploy more autonomous agents, the credential sprawl problem becomes acute — and OneCLI's approach of transparent, encrypted injection with zero agent code changes is elegantly simple.

The project is young but shipping fast, with strong architectural choices (Rust gateway + TypeScript dashboard + AES-256-GCM vault) and the right integrations (MCP, OpenClaw, Bitwarden). For teams running AI agents in production, OneCLI addresses a genuine security gap that existing credential managers don't cover.

**For AI agent developers and DevOps teams**, OneCLI is a strong recommendation. Install it alongside your agent infrastructure and credential risk drops significantly.

**Rating: 8.2/10** — A well-executed solution for an emerging problem, with strong security fundamentals and active development.
