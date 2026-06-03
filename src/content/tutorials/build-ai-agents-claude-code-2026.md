---
title: "Build AI Agents with Claude Code 2026 — Practical Tutorial"
date: 2026-06-04
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: ["tutorial", "2026", "claude-code", "ai-agents", "claude", "coding", "automation"]
cover: "/images/tutorials/build-ai-agents-claude-code-2026/cover.jpg"
difficulty: advanced
meta_description: "Learn to build AI agents with Claude Code in 2026. Practical step-by-step tutorial covering agent architecture, tool creation, multi-step workflows, and deployment."
---

# Build AI Agents with Claude Code 2026 — Practical Tutorial

## Why This Matters

Claude Code has evolved from a coding assistant into a full agent-building platform. In 2026, you can create AI agents that browse the web, manipulate files, run shell commands, interact with APIs, and act on your behalf — all orchestrated by Claude Code's agentic runtime.

This tutorial teaches you to build production-ready AI agents using Claude Code's tool-calling framework. We'll build three agents: a web research agent, a code review agent, and a multi-step workflow agent.

## Prerequisites

- **Claude Code CLI** — installed via `npm install -g @anthropic/claude-code`
- **Claude Pro or Max subscription** — $20/mo or $100/mo
- **Node.js 22+** — for running agents
- **GitHub account** — for code review agent
- **API keys** — for web research agent (SerpAPI, Firecrawl)
- **Basic TypeScript knowledge** — we'll use TypeScript for agent definitions

Check your setup:
```bash
claude-code --version
# Expected: 0.8.x or higher
node --version
# Expected: v22.0.0 or higher
```

## Step-by-Step

### Step 1: Understand Claude Code's Agent Architecture

Claude Code operates as a **tool-calling agent**. When you give it a task, it:
1. **Analyzes** your request and breaks it into steps
2. **Decides** which tool to use for each step
3. **Executes** the tool and reads the result
4. **Iterates** — continues until the task is complete or needs input

Available tools in Claude Code:
| Tool | Purpose |
|------|---------|
| `Read` | Read files (with line ranges) |
| `Write` | Create or overwrite files |
| `Edit` | Make targeted file edits |
| `Bash` | Execute shell commands |
| `Greptile` | Codebase-wide search |
| `WebFetch` | Fetch and process web content |
| `Agent` | Spawn a sub-agent for parallel work |
| `ToolResult` | Use results from previous tool calls |

For custom agents, we extend this with **custom tools** defined as TypeScript functions.

### Step 2: Create a Custom Agent Project

Create a new project for your agent:

```bash
mkdir my-claude-agent
cd my-claude-agent
npm init -y
npm install @anthropic/claude-code-sdk
mkdir src tools
```

Create the basic agent structure:

```typescript
// src/agent.ts
import { Claude } from "@anthropic/claude-code-sdk";

const client = new Claude({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function runAgent(prompt: string) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    tools: [], // We'll add custom tools next
    messages: [{ role: "user", content: prompt }],
  });
  console.log(response.content);
}

runAgent("Hello, Claude Code agent!");
```

### Step 3: Build a Web Research Agent

Let's build an agent that researches topics and saves reports.

```typescript
// tools/webResearch.ts
import { Tool } from "@anthropic/claude-code-sdk";

const serpApiKey = process.env.SERPAPI_KEY;

export const webSearchTool: Tool = {
  name: "web_search",
  description: "Search the web for current information on any topic",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      count: { type: "number", default: 5 },
    },
  },
  execute: async ({ query, count }) => {
    const response = await fetch(
      `https://serpapi.com/search?q=${encodeURIComponent(query)}&api_key=${serpApiKey}&num=${count}`
    );
    const data = await response.json();
    return data.organic_results?.map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet,
    })) || [];
  },
};

export const fetchPageTool: Tool = {
  name: "fetch_page",
  description: "Fetch and extract text content from a URL",
  inputSchema: {
    type: "object",
    properties: {
      url: { type: "string" },
    },
  },
  execute: async ({ url }) => {
    const response = await fetch(url);
    const html = await response.text();
    // Strip HTML tags for clean text
    return html.replace(/<[^>]*>/g, "").slice(0, 10000);
  },
};
```

Now use these tools in an agent:

```typescript
// agents/researchAgent.ts
import { Claude } from "@anthropic/claude-code-sdk";
import { webSearchTool, fetchPageTool } from "../tools/webResearch";

const client = new Claude({ apiKey: process.env.ANTHROPIC_API_KEY });

async function researchTopic(topic: string) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    tools: [webSearchTool, fetchPageTool],
    messages: [{
      role: "user",
      content: `Research this topic thoroughly: "${topic}"
      
1. First, search for the topic to find authoritative sources
2. Fetch content from the top 3 sources
3. Write a comprehensive report with:
   - Overview
   - Key findings with citations
   - Current state and trends
   - Expert opinions
4. Save the report as research-report.md`
    }],
  });
  return response;
}

// Run: researchTopic("AI video generation market 2026")
```

### Step 4: Build a Code Review Agent

Create an agent that reviews pull requests:

```typescript
// agents/codeReviewAgent.ts
import { Claude } from "@anthropic/claude-code-sdk";

export const gitDiffTool: Tool = {
  name: "get_git_diff",
  description: "Get the git diff for a pull request or branch",
  inputSchema: {
    type: "object",
    properties: {
      branch: { type: "string", description: "Branch to compare against main" },
      repoPath: { type: "string", description: "Path to the repository" },
    },
  },
  execute: async ({ branch, repoPath }) => {
    const { execSync } = require("child_process");
    const diff = execSync(
      `cd ${repoPath} && git diff main...${branch} -- "*.ts" "*.tsx" "*.js"`,
      { encoding: "utf-8" }
    );
    return diff.slice(0, 50000); // Limit diff size
  },
};

async function reviewPR(repoPath: string, branch: string) {
  // First, get the diff
  const claude = new Claude({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  return await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    tools: [gitDiffTool],
    messages: [{
      role: "user",
      content: `Review the code changes in branch "${branch}" of repo "${repoPath}".

Check for:
1. TypeScript type safety issues
2. Error handling gaps
3. Performance concerns (N+1 queries, memory leaks)
4. Security vulnerabilities (XSS, injection, auth bypass)
5. Code style violations (inconsistent naming, dead code)
6. Test coverage gaps

Rate each issue: Critical / Major / Minor / Suggestion
Generate a report as CODE_REVIEW.md with sections per category.`
    }],
  });
}
```

### Step 5: Build a Multi-Step Workflow Agent

This agent chains multiple tools into a production workflow:

```typescript
// agents/workflowAgent.ts
const workflowAgent = async () => {
  const claude = new Claude({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  const workflow = await claude.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8192,
    tools: [webSearchTool, fetchPageTool, gitDiffTool],
    messages: [{
      role: "user",
      content: `Run an automated content update workflow:

Step 1: Search for "latest Claude API changes 2026"
Step 2: Fetch the top 2 results for detailed information
Step 3: Read the current docs/claude-api.md file
Step 4: Compare new info with existing docs
Step 5: Update docs/claude-api.md with new information
Step 6: Create a git commit with the changes

Execute each step in sequence. If any step fails, 
report the error and try the next step.`
    }],
  });
  
  return workflow;
};
```

### Step 6: Deploy Your Agent

For production, run agents in a server environment:

```bash
# Install PM2 for process management
npm install -g pm2

# Create a startup script
cat > start-agent.js << 'EOF'
const { Claude } = require("@anthropic/claude-code-sdk");

const AGENT_PROMPT = process.env.AGENT_PROMPT || "Run daily research";

async function main() {
  const client = new Claude({ apiKey: process.env.ANTHROPIC_API_KEY });
  
  console.log("Agent starting...");
  const result = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    tools: [/* your tools here */],
    messages: [{ role: "user", content: AGENT_PROMPT }],
  });
  
  console.log("Agent complete:", result);
}

main().catch(console.error);
EOF

# Run agent in background
pm2 start start-agent.js --name "my-research-agent"
pm2 save
pm2 startup
```

## Tips & Best Practices

### Agent Design Patterns
- **Single responsibility** — Each agent should do one thing well. Chain agents for complex workflows rather than packing everything into one.
- **Explicit error handling** — Always tell your agent what to do on failure: "If the API fails, wait 30 seconds and retry up to 3 times."
- **Context management** — Large context windows (200K tokens) are powerful but expensive. Keep each agent session focused on its specific task.
- **Tool permissions** — Restrict what each agent can do. A code review agent doesn't need web access. A research agent doesn't need file write access.

### Cost Optimization
- **Use Claude Sonnet 4 for most tasks**, Opus 4 only for complex reasoning
- **Batch agent runs** — Process 10 research queries in one agent session vs 10 separate sessions
- **Cache responses** — Download and cache API results to avoid re-fetching
- **Set token limits** — `max_tokens: 4096` for standard tasks, increase only when needed

## Common Mistakes

1. **Overloading a single agent** — Agents work best focused on a specific task. Multiple agents communicating is better than one giant agent.
2. **No error recovery** — Agents hit API limits, connection errors, and malformed data. Always include recovery instructions.
3. **Infinite loops** — Without clear stopping criteria, agents can loop forever. Always specify: "Stop after 5 iterations" or "Proceed to final summary when all sources are checked."
4. **Ignoring tool permissions** — An agent with read+write+shell access can modify critical files. Scope tools to the minimum needed.
5. **Not testing with small runs first** — Test each tool individually before running a full workflow. A single broken tool can derail an entire agent session.

## FAQ

**Q: What's the difference between Claude Code and other agent frameworks?**
Claude Code is a direct tool-calling agent built by Anthropic. Compared to LangChain or CrewAI, it requires less boilerplate but offers less framework-level orchestration. Choose Claude Code for simplicity and direct API access.

**Q: Can agents use Claude Code's built-in tools?**
Yes. When running in Claude Code CLI mode, agents inherit all built-in tools (Read, Write, Edit, Bash). In SDK mode, you define custom tools.

**Q: How do I run agents on a schedule?**
Use cron, PM2, or a cloud scheduler (AWS EventBridge, GitHub Actions cron). The agent connects via API, runs its task, and disconnects.

**Q: What's the maximum agent runtime?**
Claude Code sessions have a practical limit of ~30 minutes or 200 tool calls. For longer tasks, split them into sequential agent runs with saved intermediate state.

**Q: Can multiple agents collaborate?**
Yes. Claude Code can spawn sub-agents for parallel work. The main agent coordinates tasks, waits for results, and integrates findings. This is effective for research that benefits from parallel web searches.

**Q: How do I secure API keys in agent workflows?**
Use environment variables (.env files) never hard-coded in agent prompts. For production, use a secrets manager like Vault or AWS Secrets Manager. Agents can read them at startup but should never output them.
