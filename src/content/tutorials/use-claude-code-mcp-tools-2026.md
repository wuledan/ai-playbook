---
title: "Use Claude Code with MCP Tools — 2026 Practical Guide"
date: 2026-06-06
author: "AIPlaybook Editorial Team"
category: "Tutorial"
tags: ["tutorial", "2026", "claude-code", "mcp", "model-context-protocol", "tools", "automation"]
cover: "/images/tutorials/use-claude-code-mcp-tools-2026/cover.jpg"
difficulty: intermediate
meta_description: "Learn to extend Claude Code with MCP (Model Context Protocol) tools in 2026. Build custom MCP servers, integrate APIs, databases, and external services."
---

# Use Claude Code with MCP Tools — 2026 Practical Guide

## Why This Matters

The Model Context Protocol (MCP) is the universal standard for connecting AI assistants to external tools. In 2026, Claude Code's MCP support lets you plug in databases, APIs, file systems, and custom business logic without writing glue code. Instead of copy-pasting between tools, MCP gives Claude Code direct access to your entire toolchain.

This guide teaches you to build and use MCP tools with Claude Code — from simple utility servers to complex multi-tool workflows.

## Prerequisites

- **Claude Code CLI** (`npm install -g @anthropic/claude-code`)
- **Claude Max subscription** ($100/mo) for extended MCP support
- **Node.js 20+** or **Python 3.11+** for building MCP servers
- **Anthropic API Key** with MCP access enabled
- **Basic knowledge** of TypeScript or Python

Check your setup:

```bash
claude-code --version
# Expected: 0.9.x or higher
node --version
# Expected: v20.0.0 or higher
```

## Step-by-Step

### Step 1: Understand MCP Architecture

MCP follows a client-server model:

```
┌──────────────┐       ┌──────────────────┐
│  Claude Code │ ◄────►│  MCP Client      │
│  (Host App)  │       │  (Built-in)      │
└──────────────┘       └────────┬─────────┘
                                │
           ┌────────────────────┼────────────────────┐
           │                    │                    │
    ┌──────▼──────┐     ┌──────▼──────┐     ┌──────▼──────┐
    │  MCP Server  │     │  MCP Server  │     │  MCP Server  │
    │  (Filesystem) │     │  (Database)  │     │  (Custom API) │
    └──────────────┘     └──────────────┘     └──────────────┘
```

Each MCP server exposes:
- **Resources** — data that Claude can read (files, DB rows, API responses)
- **Tools** — actions Claude can trigger (search, create, transform)
- **Prompts** — reusable prompt templates for specific tasks

### Step 2: Connect Existing MCP Servers

Claude Code ships with several built-in MCP servers. Enable them in your configuration:

```json
// ~/.claude/claude_desktop_config.json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "ghp_xxxxxxxxxxxx"
      }
    },
    "sqlite": {
      "command": "uvx",
      "args": ["mcp-server-sqlite", "--db-path", "/Users/yourname/data/app.db"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

Test that servers are detected:

```bash
claude-code --list-tools
# Expected output includes filesystem, github, sqlite, puppeteer
```

Now in Claude Code, ask: "Read my database schema from the SQLite server and summarize the tables." Claude Code automatically selects the right MCP server.

### Step 3: Install and Use the MCP SDK

Build custom servers using Anthropic's MCP SDK:

```bash
# TypeScript SDK
npm install @modelcontextprotocol/sdk

# Python SDK
pip install mcp
```

Create a Python-based MCP server:

```python
# server.py
from mcp.server import Server
from mcp.server.stdio import stdio_server
from mcp.types import Tool, TextContent
import httpx

server = Server("weather-server")

@server.list_tools()
async def list_tools() -> list[Tool]:
    return [
        Tool(
            name="get_weather",
            description="Get current weather for a city",
            input_schema={
                "type": "object",
                "properties": {
                    "city": {"type": "string", "description": "City name"},
                    "country": {"type": "string", "description": "2-letter country code"},
                },
                "required": ["city"],
            },
        ),
        Tool(
            name="get_forecast",
            description="Get 5-day weather forecast",
            input_schema={
                "type": "object",
                "properties": {
                    "city": {"type": "string"},
                },
                "required": ["city"],
            },
        ),
    ]

@server.call_tool()
async def call_tool(name: str, arguments: dict) -> list[TextContent]:
    if name == "get_weather":
        city = arguments["city"]
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.openweathermap.org/data/2.5/weather",
                params={"q": city, "appid": "YOUR_API_KEY", "units": "metric"},
            )
            data = response.json()
            return [TextContent(
                type="text",
                text=f"Weather in {city}: {data['weather'][0]['description']}, "
                     f"Temperature: {data['main']['temp']}°C, "
                     f"Humidity: {data['main']['humidity']}%"
            )]

if __name__ == "__main__":
    server.run(stdio_server())
```

Register your custom server:

```json
// Add to claude_desktop_config.json
{
  "mcpServers": {
    "weather": {
      "command": "python3",
      "args": ["/path/to/server.py"]
    }
  }
}
```

### Step 4: Build a Database MCP Server

Connect Claude Code directly to your database:

```python
# db_server.py
from mcp.server import Server, stdio_server
from mcp.types import Tool, TextContent, Resource
import sqlite3
import json

server = Server("database-helper")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="query_database",
            description="Run a SQL query on the connected database",
            input_schema={
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "SQL query to execute"},
                },
                "required": ["query"],
            },
        )
    ]

@server.call_tool()
async def call_tool(name: str, args: dict) -> list[TextContent]:
    if name == "query_database":
        conn = sqlite3.connect("app.db")
        cursor = conn.cursor()
        try:
            cursor.execute(args["query"])
            result = cursor.fetchall()
            columns = [desc[0] for desc in cursor.description]
            rows = [dict(zip(columns, row)) for row in result]
            return [TextContent(
                type="text",
                text=json.dumps(rows, indent=2, default=str)
            )]
        except Exception as e:
            return [TextContent(type="text", text=f"Error: {str(e)}")]
        finally:
            conn.close()

@server.list_resources()
async def list_resources():
    conn = sqlite3.connect("app.db")
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    conn.close()
    return [
        Resource(uri=f"db://{t[0]}", name=t[0], mime_type="application/json")
        for t in tables
    ]

if __name__ == "__main__":
    server.run(stdio_server())
```

Now ask Claude Code: "Query the users table and show me signup trends by month." Claude will call your MCP server, run the SQL, and analyze results.

### Step 5: Build a Multi-Tool Workflow Server

Combine multiple capabilities in one MCP server:

```python
# devops_server.py
from mcp.server import Server, stdio_server
from mcp.types import Tool, TextContent
import subprocess
import json

server = Server("devops-helper")

@server.list_tools()
async def list_tools():
    return [
        Tool(
            name="deploy_service",
            description="Deploy a Docker service to production",
            input_schema={
                "type": "object",
                "properties": {
                    "service_name": {"type": "string"},
                    "image_tag": {"type": "string", "default": "latest"},
                },
                "required": ["service_name"],
            },
        ),
        Tool(
            name="check_service_health",
            description="Check health of a deployed service",
            input_schema={
                "type": "object",
                "properties": {
                    "url": {"type": "string"},
                },
                "required": ["url"],
            },
        ),
    ]

@server.call_tool()
async def call_tool(name: str, args: dict) -> list[TextContent]:
    if name == "deploy_service":
        result = subprocess.run(
            ["docker", "compose", "up", "-d", args["service_name"]],
            capture_output=True, text=True, timeout=60
        )
        return [TextContent(
            type="text",
            text=f"Deploy result:\n{result.stdout}\n{result.stderr}"
        )]
    elif name == "check_service_health":
        import httpx
        async with httpx.AsyncClient() as client:
            resp = await client.get(args["url"], timeout=10)
        status = "healthy" if resp.status_code == 200 else "unhealthy"
        return [TextContent(
            type="text",
            text=f"Service at {args['url']}: {status} (HTTP {resp.status_code})"
        )]

if __name__ == "__main__":
    server.run(stdio_server())
```

### Step 6: Advanced — MCP Tool Chaining

The real power comes from chaining multiple MCP servers together:

```
Task: "Analyze last month's sales data and create a report"

1. SQLite MCP     → Query sales data from database
2. Filesystem MCP → Read existing report template
3. Weather MCP    → Get weather data for any location factors
4. Claude Code    → Synthesize all data into final report
5. Filesystem MCP → Save report to output directory
```

In Claude Code, just state your goal:

```
"Connect to the sales database, get last month's metrics, cross-reference with weather data,
and generate a sales report in the reports/ folder."
```

Claude Code plans the MCP tool sequence and executes autonomously, handling errors and re-tries.

## Community Reviews & Ratings

Claude Code and MCP have generated significant buzz in the developer community:

**G2**: Claude Code (Anthropic) rated 4.6/5 from 1,500+ reviews. "MCP is the missing piece that makes AI coding assistants truly useful," writes a senior engineer at a SaaS company.

**Product Hunt**: MCP servers category has 20+ listed tools. The official MCP Filesystem server launched with 800+ upvotes and a 4.8/5 rating. "Finally, a standardized way to give AI access to my tools," commented one top reviewer.

**Hacker News**: Two major threads on MCP in 2025-2026 with 400+ comments each. The consensus: MCP is the JSON-RPC of AI tooling — simple, extensible, and protocol-driven.

**GitHub**: The `@modelcontextprotocol/sdk` package has 30K+ stars. Community-built MCP servers for PostgreSQL, Stripe, Jira, and Notion each have 1-5K stars.

**Reddit r/ClaudeAI**: 200K+ subscribers. Weekly threads on custom MCP servers. "I built a full DevOps pipeline as MCP tools. Claude Code manages our entire deployment now," reports a top comment.

> *"MCP is the most important AI infrastructure project most people haven't heard of yet."* — Simon Willison, independent developer

## Tips & Best Practices

- **Security first**: MCP servers run with the same permissions as Claude Code. Never expose destructive tools (DROP TABLE, rm -rf) without confirmation gates.
- **Error handling**: Each MCP tool should return clear error messages. Claude Code can recover from errors with retry logic.
- **Idempotent tools**: Design tools that produce the same result when called multiple times. This allows Claude Code to safely retry on failure.
- **Naming clarity**: Tool names should clearly describe the action. `delete_user_by_id` is better than `remove` or `del_user`.
- **Input validation**: Always validate and sanitize inputs in your MCP server. Claude Code provides structured schemas, but server-side validation is essential.

## Common Mistakes

1. **Overly permissive servers** — An MCP server with full filesystem read/write access can accidentally modify critical files. Scope tools to specific directories.
2. **Missing timeout handling** — External API calls in MCP tools can hang. Always set timeouts (recommended: 30s default, 120s max).
3. **Not testing with Claude Code directly** — Use `claude-code --list-tools` and test each tool before building complex workflows.
4. **Circular dependencies** — Avoid tools that call other MCP servers. Each tool should be self-contained.
5. **Exposing sensitive data in tool names** — Tool names and descriptions are visible to Claude. Avoid embedding API keys or internal paths.

## FAQ

**Q: What Claude Code plan supports MCP?**
Claude Max ($100/mo) provides full MCP support including custom server registration. Claude Pro ($20/mo) supports built-in servers only.

**Q: Can I use MCP servers remotely?**
Yes, via TCP transport instead of stdio. Use `mcp-server-tcp` to expose servers over a network, but add authentication in production.

**Q: How many MCP servers can I connect?**
Practical limit is 10-15 servers before Claude Code's tool selection becomes less reliable. Each additional server adds cognitive load.

**Q: Does MCP work with Claude Code in VS Code?**
Yes. The Claude Code VS Code extension fully supports MCP. Configuration is shared with the CLI.

**Q: Can I share MCP servers with my team?**
Yes. Package MCP servers as npm packages or pip packages. Team members install them and add to their config. Consider an internal MCP registry for team-managed servers.
