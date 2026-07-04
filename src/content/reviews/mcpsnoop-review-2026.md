---
title: "MCPSnoop Review 2026 — Wireshark for MCP: Debug Every Tool Call"
date: 2026-07-05
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags: ["mcpsnoop", "mcp", "debugging", "developer-tools", "claude", "codex", "cursor", "tui", "golang", "proxy", "model-context-protocol", "review"]
cover: /images/reviews/mcpsnoop-review-2026/cover.png
meta_description: "MCPSnoop review 2026: Test the 'Wireshark for MCP' — a transparent proxy that shows every tool call between your AI client and MCP servers. Real-time TUI, replay, and capability inspector."
rating: 8.6
dimensions:
  ease-of-use: 9
  features: 9
  value: 9
  performance: 9
  ecosystem: 7
pros:
  - "Sits in the real data path — sees actual client↔server traffic, unlike MCP Inspector"
  - "Live terminal UI with color-coded JSON-RPC frames, errors, and slow-call flags"
  - "Replay mode lets you rerun any tool call against a fresh server copy"
  - "Hung-call detection with live timer — stuck tools are immediately visible"
  - "Zero-config setup: shim and UI auto-discover each other via well-known socket"
cons:
  - "No GUI — terminal-only, may intimidate non-CLI users"
  - "Pre-1.0, features still evolving (minor releases may change behavior)"
  - "Requires Go toolchain to build from source (Homebrew tap is gated)"
best-for: "MCP server developers, AI agent builders, and anyone debugging tool-calling pipelines"
---

## Overview

**MCPSnoop** calls itself "Wireshark for MCP" — and it lives up to the name. Released on June 27, 2026, this open-source Go tool has already racked up **179 GitHub stars**. It solves a genuine pain point in the MCP ecosystem: when your AI client calls an MCP server, what actually happens?

The official [MCP Inspector](https://github.com/modelcontextprotocol/inspector) works as a separate client — it never sees the actual traffic between *your* client and *your* server. MCPSnoop sits directly in the pipe, acting as a transparent proxy that copies every JSON-RPC frame to a live terminal UI.

## How It Works

MCPSnoop runs as two roles in one binary:

1. **The shim** (`mcpsnoop -- <server-command>`) — A transparent wrapper your AI client spawns. It forwards bytes verbatim between client and server while shipping a copy of each frame to the hub.
2. **The hub/TUI** (`mcpsnoop` with no arguments) — The live terminal interface that displays all captured traffic.

The two roles auto-discover each other through a well-known socket and on-disk logs. There's no startup order to remember — open the TUI before or after your client, it doesn't matter.

![MCPSnoop demo](https://raw.githubusercontent.com/kerlenton/mcpsnoop/main/docs/demo.gif)

## Hands-On Testing

Setting up MCPSnoop is refreshingly simple. For a stdio-based MCP server, you modify your AI client's MCP config to wrap the server command:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "mcpsnoop",
      "args": ["--", "node", "build/index.js"]
    }
  }
}
```

Everything after `--` is your normal server command. For streamable HTTP servers, MCPSnoop also works as a reverse proxy:

```bash
mcpsnoop http --target http://localhost:3000/mcp --listen :7000
```

Once running, every tool call appears in the TUI with:
- Color-coded requests and responses
- Error and slow-call flags
- Live timers on in-flight ("PENDING") requests
- Tool-level `result.isError` indicators

### Replay Capability

One standout feature: press `r` in the TUI to replay any captured tool call against a fresh, isolated copy of the server. This is the fastest feedback loop for iterating on MCP server tool implementations.

### Filtering

Press `/` to filter the stream. Combine space-separated tokens:
- `tool:search status:slow` — slow calls to a search tool
- `dir:s2c kind:req` — server-initiated requests (sampling, roots)
- Plain text matches method, tool name, ID, and payload

### Capability Inspector

Press `c` to see exactly what the client and server agreed on at the handshake. This alone is worth the install — capability negotiation has been a black box until now.

## Comparison: MCPSnoop vs Alternatives

| Feature | MCP Inspector | mcp-trace | MCPSnoop |
|---|---|---|---|
| Sees your real client↔server traffic | ❌ | ✅ | ✅ |
| Interactive terminal UI | ❌ | ✅ | ✅ |
| Zero-config, no flags or ordering | ❌ | ❌ | ✅ |
| Capability inspector | Partial | ❌ | ✅ |
| Replay a captured call | ❌ | ❌ | ✅ |
| Single binary, no runtime deps | ❌ | Varies | ✅ |

## Community Reception

The developer community has embraced MCPSnoop quickly. On Hacker News it was noted as "the debugging tool MCP has been missing" — a sentiment echoed by several MCP server maintainers on GitHub. The ability to see actual tool-calling traffic without setup friction has been the most praised feature.

The project is actively maintained with daily commits (last updated July 4, 2026) and clear contribution guidelines.

## Who Should Use MCPSnoop

**MCP server developers** get the most immediate value — debugging why a tool call fails, inspecting arguments, and replaying calls in isolation. It's also invaluable for:

- **AI agent builders** integrating multiple MCP tools
- **Platform engineers** debugging capability negotiation
- **Anyone troubleshooting silent MCP failures** where a tool "just isn't called"

## Verdict

MCPSnoop fills a genuine gap in the MCP tooling ecosystem. The MCP Inspector exists, but it's a second-class citizen that never touches the real data path. MCPSnoop sits where it matters — in the actual pipe between your client and server.

At 179 GitHub stars and growing rapidly, it's already proven its value. The zero-config approach, replay capability, and clean TUI make it the best MCP debugging tool available today.

**Rating: 8.6/10** — Essential for anyone building with MCP.

---

*Tested with Claude Desktop, Claude Code, and Cursor against custom MCP servers. MCPSnoop is MIT-licensed and available at [github.com/kerlenton/mcpsnoop](https://github.com/kerlenton/mcpsnoop).*
