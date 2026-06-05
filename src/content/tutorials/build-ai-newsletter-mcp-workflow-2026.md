---
title: "Build an AI Newsletter with MCP + Claude 2026 — Full Curation Pipeline"
date: 2026-06-04
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: ["tutorial", "2026", "mcp", "claude", "newsletter", "automation", "content-curation"]
cover: "/images/tutorials/build-ai-newsletter-mcp-workflow-2026/cover.png"
difficulty: intermediate
meta_description: "Build a fully automated AI newsletter pipeline using MCP servers and Claude. Curate, summarize, and format newsletter content with AI agents in 2026."
---

# Build an AI Newsletter with MCP + Claude 2026 — Full Curation Pipeline

## Introduction

Newsletter curation is one of the highest-leverage content strategies in 2026 — but manually sifting through RSS feeds, social media, research papers, and news sites burns hours every week. The Model Context Protocol (MCP) changes everything.

MCP is an open standard that lets Claude connect directly to external data sources: RSS readers, web search engines, GitHub repositories, databases, and even your own custom tools. By wiring multiple MCP servers together, you can build a fully automated newsletter curation pipeline where Claude reads, filters, summarizes, and formats content — then drops the finished draft into your CMS or email platform.

In this tutorial, you'll build an end-to-end AI newsletter pipeline that:

- Pulls content from RSS feeds, Hacker News, and Twitter/X via MCP servers
- Uses Claude to score, filter, and prioritize articles by relevance
- Generates personalized summaries with your brand voice
- Formats everything into a ready-to-send newsletter draft

## Prerequisites

Before you start, make sure you have:

- **Claude Desktop** or **Claude Code CLI** — installed and authenticated
- **An MCP-compatible RSS reader** — we'll use the `fetch` MCP server (built into Claude Desktop) plus a dedicated RSS MCP server
- **API keys** — Twitter/X API (Pro tier) or a web search MCP server (Brave Search, Tavily, or Exa)
- **A newsletter platform** — Substack, ConvertKit, Buttondown, or any email service provider (ESP) with API access
- **Basic Node.js knowledge** — for configuring MCP servers
- **Claude Pro or Max subscription** — $20/mo minimum for longer curation sessions

## Step 1: Setting Up MCP Servers

MCP servers are the data pipelines that feed content into Claude. Each server exposes tools Claude can call directly — like `fetch_url`, `search_web`, or `get_tweets`.

### 1.1 Configure the Filesystem MCP Server

The filesystem server lets Claude read and write files to your local machine. Add it to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/Users/you/newsletter-content"
      ]
    }
  }
}
```

This gives Claude access to a dedicated `newsletter-content/` directory where it can store curated articles and drafts.

### 1.2 Add an RSS/Web Fetch MCP Server

For RSS feed ingestion, use the `fetch` MCP server (built into recent Claude Desktop versions) or install a dedicated one:

```json
{
  "mcpServers": {
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
```

The fetch server allows Claude to retrieve any URL — RSS feeds, web pages, and API endpoints. For structured RSS handling, you can also use the Puppeteer MCP server for JavaScript-heavy sites:

```json
{
  "mcpServers": {
    "puppeteer": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    }
  }
}
```

### 1.3 Configure Web Search MCP

For discovering trending content beyond your RSS feeds, add a search MCP server. Brave Search is free for up to 2,000 queries/month:

```json
{
  "mcpServers": {
    "brave-search": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-brave-search"
      ],
      "env": {
        "BRAVE_API_KEY": "your-brave-api-key-here"
      }
    }
  }
}
```

Alternative options: Tavily MCP server (AI-optimized search, $10/mo) or Exa MCP (semantic search, $10/mo).

### 1.4 Verify Your MCP Setup

Restart Claude Desktop. Click the 🔌 icon to verify all MCP servers are connected. Test with:

> "Claude, use the fetch tool to get the latest articles from `https://news.ycombinator.com/rss` and list the top 5 titles."

If Claude returns the titles, your MCP pipeline is working.

## Step 2: Building the Curation Prompt

The curation prompt is the brain of your newsletter pipeline. It tells Claude how to filter, score, and summarize content. Here's a production-ready template:

```markdown
You are a newsletter curator for [NEWSLETTER NAME], a weekly digest covering [TOPIC].

## Curation Rules
1. Fetch articles from these sources:
   - RSS feed: https://example.com/feed
   - Hacker News top stories (score > 50)
   - Twitter/X list: [LIST_ID] (using Twitter MCP)
   - Brave Search: "[TOPIC] 2026 latest developments"

2. Score each article on a scale of 1-10 based on:
   - Relevance to [AUDIENCE]
   - Novelty (new information, not a rehash)
   - Actionability (readers can apply this)
   - Credibility of source

3. Select top 10 articles (minimum score 7/10).

4. For each selected article, write:
   - A compelling one-line summary (under 280 chars)
   - A 3-sentence deep-dive with key takeaways
   - A "Why this matters" section for context

5. Format the output as:
   ```
   # [Newsletter Name] — [Date]
   
   ## 🏆 Top Pick
   [Article with highest score gets special treatment]
   
   ## 📰 This Week's Must-Reads
   [8 curated articles]
   
   ## 🛠️ Tool of the Week
   [1 standout tool mentioned in curated content]
   
   ## 💡 Quick Hits
   [3-4 short mentions for trending but less deep content]
   ```

6. Brand voice: [Describe tone — e.g., "Professional but conversational, data-driven, optimistic about AI, skeptical about hype"]
```

Save this as `curation-prompt.md` in your newsletter content directory.

## Step 3: First Curation Run

Now let's run the full pipeline. Start a new conversation with Claude and:

1. Ask Claude to read your curation prompt:
   > "Read the file `curation-prompt.md` and follow these instructions."

2. Claude will call its MCP tools to fetch articles, score them, and generate summaries.

3. Review the output. Common adjustments:
   - **Too many articles?** Raise your minimum score threshold.
   - **Off-topic content?** Refine your search queries and RSS sources.
   - **Bland summaries?** Update the brand voice section with more specific examples.

### Example Session

```
You: Read curation-prompt.md and curate this week's newsletter.
Claude: [Calls fetch tool for 3 RSS feeds]
Claude: [Calls brave-search for trending topics]
Claude: [Scores 47 articles, selects top 10]
Claude: [Generates formatted newsletter]
Claude: Here's your newsletter draft — saved to newsletter-content/draft-2026-06-04.md
```

### Saving the Draft

Configure Claude to save the draft with a date-based filename:

```markdown
7. Save the final newsletter to: `newsletter-content/draft-[YYYY-MM-DD].md`
```

You can also have Claude push directly to your ESP via API if you prefer full automation.

## Step 4: Adding Advanced MCP Integrations

### 4.1 GitHub Trending for Developer Newsletters

Add the GitHub MCP server to track trending repositories:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxx"
      }
    }
  }
}
```

### 4.2 Slack Integration for Team Review

Wire in a Slack MCP server to post drafts for team review:

```json
{
  "mcpServers": {
    "slack": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-slack"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-xxxx"
      }
    }
  }
}
```

Then add to your prompt: "Post the draft to #newsletter-review channel for feedback."

### 4.3 Database MCP for Curation History

Use a PostgreSQL or SQLite MCP server to track which articles you've already featured:

```json
{
  "mcpServers": {
    "sqlite": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sqlite",
        "newsletter-history.db"
      ]
    }
  }
}
```

This prevents duplicate articles and lets Claude reference your archive for context.

## Step 5: Optimization Tips

### Tip 1: Layer Your Sources by Frequency

Not all sources update at the same pace. Configure your curation prompt to check:
- **Daily sources:** RSS feeds, Hacker News, Twitter/X (every curation run)
- **Weekly sources:** Research papers, podcast transcripts (once per week)
- **Monthly sources:** Long-form blog posts, industry reports (monthly deep-dive section)

### Tip 2: Build an "Ignore" List

Create a `blocklist.md` file with domains and topics to skip. Update it when Claude surfaces low-quality sources:

```markdown
# Curation Blocklist
- medium.com/@low-quality-blog
- any article mentioning "unlock your potential"
- press releases from [COMPANY] (they're always fluff)
```

### Tip 3: A/B Test Your Summaries

Generate two versions of each summary (different angles) and track which style gets more clicks:

```markdown
For each article, write TWO summary variations:
- Variation A: Curiosity-driven ("You won't believe what happened when...")
- Variation B: Straightforward ("New research shows X leads to Y")
```

### Tip 4: Automate the Send

Use a cron job to trigger Claude Code at a scheduled time:

```bash
# crontab entry: every Sunday at 9 AM
0 9 * * 0 claude --prompt "Read curation-prompt.md and curate this week's newsletter. Save to newsletter-content/"
```

For Claude Code users:
```bash
claude "Read ~/newsletter-content/curation-prompt.md and execute the curation pipeline. Save the draft."
```

### Tip 5: Track Performance

Add a feedback loop. After sending your newsletter, log open rates and click-through data. Feed this back to Claude monthly:

> "Here are the top-clicked articles from last month: [list]. Use this data to adjust scoring criteria."

## FAQ

**Q: How much does this cost to run?**
A: The MCP servers are free and open-source. Your main costs are the Claude subscription ($20-100/mo) and optional API keys (Brave Search: free tier, Tavily: $10/mo). A weekly newsletter costs roughly $5-15 in API usage.

**Q: Can I use this for a daily newsletter?**
A: Yes. The same pipeline works for daily curation. Just increase your source pool (more RSS feeds, real-time Twitter monitoring) and adjust Claude's token limits accordingly. Claude Max ($100/mo) is recommended for daily runs with 20+ sources.

**Q: What if Claude hallucinates article details?**
A: Always include this rule in your prompt: "For every article, include the original URL. Never invent article content — only summarize what you actually retrieved." Using the fetch MCP server (which retrieves actual page content) drastically reduces hallucinations compared to relying on Claude's training data.

**Q: Can I integrate with ConvertKit or Mailchimp directly?**
A: Yes. Use the fetch MCP server to call ConvertKit/Mailchimp REST APIs directly from Claude. You can push draft content, create campaigns, and even trigger sends — all without leaving your Claude conversation.

**Q: How do I handle paywalled content?**
A: For paywalled sources, the fetch MCP server won't retrieve full text. Options: (1) subscribe to the publication and use their RSS feed (which often includes summaries), (2) use a service like Feedbin that provides full-text extraction even behind soft paywalls, or (3) pair Claude with a browser automation MCP server that can log in via your credentials.

## Conclusion

The MCP + Claude newsletter pipeline transforms a 5-10 hour weekly curation task into a 30-minute review session. You're no longer manually opening tabs, copy-pasting, and formatting — Claude does the heavy lifting while you focus on editorial judgment and personal commentary.

Next steps to level up:
1. **Add a second Claude instance** as a "fresh eyes" reviewer that critiques the first draft
2. **Connect to your analytics API** so Claude auto-analyzes which articles perform best
3. **Build a subscriber preference MCP** that personalizes newsletter sections per subscriber segment
4. **Integrate with Canva's API** to auto-generate newsletter header images

The MCP ecosystem is growing rapidly in 2026. Every new MCP server expands what your newsletter pipeline can do — all within a single Claude conversation.
