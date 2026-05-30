---
title: "Build an Automated Blog Content Pipeline with RSS + LLM in 2026"
date: 2026-05-30
author: "AIPlaybook Editorial Team"
category: "Tutorials"
tags: [rss, llm, content-automation, blog-pipeline, tutorial, langchain, openai, content-curation]
cover: /images/tutorials/automated-blog-content-pipeline-rss-llm-2026/cover.png
difficulty: intermediate
meta_description: "Build an automated blog content generation pipeline that fetches RSS feeds, processes articles through an LLM, and generates SEO-optimized blog posts — fully automated."
---

## Introduction

Blogging at scale means spending hours reading, summarizing, and writing. What if you could automate the pipeline — from finding good content to publishing a draft — without sacrificing quality?

This tutorial builds an end-to-end **automated blog content pipeline** that:

1. Fetches articles from RSS feeds (industry news, competitor blogs, arXiv)
2. Extracts and cleans article content
3. Runs each article through an LLM prompt chain for analysis and rewriting
4. Outputs a polished, SEO-optimized blog post as Markdown

By the end, you'll have a cron-ready script that produces publishable drafts daily.

## Prerequisites

```bash
pip install feedparser requests beautifulsoup4 openai langchain-core tiktoken python-frontmatter arxiv
```

Set your OpenAI or compatible API key:

```bash
export OPENAI_API_KEY="sk-..."  # or use any OpenAI-compatible provider
```

## Step 1: RSS Feed Fetcher

Create `fetcher.py` that pulls articles from multiple feeds:

```python
import feedparser
import hashlib
from datetime import datetime
from dataclasses import dataclass

@dataclass
class FeedItem:
    id: str
    title: str
    url: str
    summary: str
    published: str
    source: str

def fetch_feeds(feed_urls: list[str], max_per_feed: int = 5) -> list[FeedItem]:
    items = []
    seen = set()
    
    for url in feed_urls:
        try:
            feed = feedparser.parse(url)
            source_name = feed.feed.title if hasattr(feed.feed, 'title') else url
            
            for entry in feed.entries[:max_per_feed]:
                entry_id = hashlib.md5(entry.link.encode()).hexdigest()
                if entry_id in seen:
                    continue
                seen.add(entry_id)
                
                items.append(FeedItem(
                    id=entry_id,
                    title=entry.title,
                    url=entry.link,
                    summary=entry.summary if hasattr(entry, 'summary') else '',
                    published=entry.published if hasattr(entry, 'published') else '',
                    source=source_name,
                ))
        except Exception as e:
            print(f"⚠️  Error fetching {url}: {e}")
    
    return items

# Example feed sources
FEEDS = [
    "https://news.ycombinator.com/rss",
    "https://arxiv.org/rss/cs.AI",
    "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
    "https://feeds.feedburner.com/TechCrunch",
]

if __name__ == "__main__":
    items = fetch_feeds(FEEDS)
    print(f"Fetched {len(items)} articles")
    for item in items[:5]:
        print(f"  • [{item.source}] {item.title}")
```

## Step 2: Content Extractor

Raw RSS summaries are often short. We need the full article content. Use `trafilatura` for clean extraction:

```python
# extractor.py
import trafilatura
import trafilatura.settings as settings

def extract_article(url: str) -> str | None:
    """Extract clean article text from a URL."""
    try:
        downloaded = trafilatura.fetch_url(url)
        if not downloaded:
            return None
        text = trafilatura.extract(
            downloaded,
            include_comments=False,
            include_tables=False,
            include_formatting=True,
            output_format='markdown',
        )
        return text
    except Exception as e:
        print(f"⚠️  Failed to extract {url}: {e}")
        return None
```

> **Note:** Install `trafilatura` alongside the other packages: `pip install trafilatura`

## Step 3: LLM Content Pipeline (The Core)

This is where the magic happens. We chain two prompts — one for analysis, one for rewriting — using LangChain's `ChatOpenAI`:

```python
# pipeline.py
import json
import os
from datetime import datetime
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

llm = ChatOpenAI(
    model="gpt-4o-mini",  # Cost-effective for this workload
    temperature=0.3,
)

ANALYSIS_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a senior content strategist. Analyze the following article and produce a JSON output with:
- topic: The main topic (2-5 words)
- angle: A fresh, unique angle that hasn't been overdone
- target_keyword: Primary SEO keyword
- key_points: 3-5 bullet points from the article
- gap: What's missing from this article that readers would want
- hook: An engaging opening sentence for a new post"""),
    ("human", "Title: {title}\n\nContent:\n{content}"),
])

REWRITE_PROMPT = ChatPromptTemplate.from_messages([
    ("system", """You are a professional blog writer. Write a compelling blog post following this structure:

1. **Hook** — Start with the provided hook
2. **Context** — Briefly explain why this matters now (2-3 sentences)
3. **Main Content** — Expand the key points with your own analysis and examples. Add context the original article missed (the "gap").
4. **Actionable Takeaways** — What should the reader do with this information?
5. **Related Resources** — Mention 1-2 related tools or further reading

Requirements:
- SEO-optimized: Include the target keyword naturally in the first 100 words and once per section
- 500-800 words
- Write for a technical but non-expert audience (CTO, product manager, senior developer)
- Professional but not boring — use concrete examples
- Avoid fluff: no "In today's fast-paced..." or "Revolutionary" or "Game-changing"
- Output as clean Markdown with appropriate headings"""),
    ("human", """Analysis: {analysis}
    
Original Title: {title}
Original Source: {source}"""),
])

def process_article(title: str, content: str, source: str) -> dict | None:
    """Run a single article through the LLM pipeline and return a blog post draft."""
    if not content or len(content) < 200:
        return None
    
    # Step 1: Analyze
    try:
        response = llm.invoke(ANALYSIS_PROMPT.format_messages(title=title, content=content[:4000]))
        analysis = json.loads(response.content.strip().removeprefix("```json").removesuffix("```").strip())
    except (json.JSONDecodeError, Exception) as e:
        print(f"⚠️  Analysis failed for '{title}': {e}")
        return None
    
    # Step 2: Rewrite
    try:
        blog_post = llm.invoke(REWRITE_PROMPT.format_messages(
            analysis=json.dumps(analysis, indent=2),
            title=title,
            source=source,
        )).content
    except Exception as e:
        print(f"⚠️  Rewrite failed for '{title}': {e}")
        return None
    
    return {
        "title": f"{analysis.get('topic', title)}: {analysis.get('hook', '')}"[:100],
        "slug": title.lower().replace(" ", "-")[:80],
        "meta_description": analysis.get('hook', ''),
        "target_keyword": analysis.get('target_keyword', ''),
        "body": blog_post,
        "source_url": None,  # Will be filled by the orchestrator
        "source_name": source,
    }
```

## Step 4: Orchestrator

Tie it all together in `run_pipeline.py`:

```python
#!/usr/bin/env python3
"""Automated blog content pipeline orchestrator."""

from fetcher import fetch_feeds, FEEDS
from extractor import extract_article
from pipeline import process_article
import os
from datetime import datetime

OUTPUT_DIR = "./generated_posts"
MAX_ARTICLES = 3  # Generate at most 3 posts per run

def generate_frontmatter(post: dict) -> str:
    return f"""---
title: "{post['title']}"
date: {datetime.now().strftime('%Y-%m-%d')}
author: "AI Content Pipeline"
category: "Automated"
tags: [{', '.join(f'"{t}"' for t in post.get('tags', []))}]
cover: "/images/default/{post.get('target_keyword', 'blog')}.jpg"
meta_description: "{post['meta_description']}"
---
"""

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    print("🚀 Fetching RSS feeds...")
    items = fetch_feeds(FEEDS)
    print(f"📡 Found {len(items)} articles")
    
    count = 0
    for item in items:
        if count >= MAX_ARTICLES:
            break
        
        print(f"📄 Processing: {item.title[:60]}...")
        content = extract_article(item.url)
        if not content:
            print("  ⏭️  Skipped (no content)")
            continue
        
        result = process_article(item.title, content, item.source)
        if not result:
            print("  ⏭️  Skipped (LLM failed)")
            continue
        
        # Generate a unique slug
        safe_slug = item.title.lower()[:60]
        safe_slug = "".join(c if c.isalnum() or c in " -" else "" for c in safe_slug)
        safe_slug = safe_slug.replace(" ", "-").strip("-")
        filename = f"{datetime.now().strftime('%Y%m%d')}-{safe_slug}.md"
        
        with open(os.path.join(OUTPUT_DIR, filename), "w") as f:
            f.write(generate_frontmatter(result))
            f.write(result['body'])
        
        print(f"  ✅ Written to generated_posts/{filename}")
        count += 1
    
    print(f"\n🎉 Done! Generated {count} blog post(s) in {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()
```

## Step 5: Run and Review

```bash
# One-shot run
python run_pipeline.py

# Expected output:
# 🚀 Fetching RSS feeds...
# 📡 Found 18 articles
# 📄 Processing: OpenAI Announces GPT-5 Fine-Tuning...
#   ✅ Written to generated_posts/20260530-openai-announces-gpt-5-fine-tuning.md
```

Each generated post looks like (abbreviated):

```markdown
---
title: "OpenAI GPT-5 Fine-Tuning Now Available for All Developers"
date: 2026-05-30
author: "AI Content Pipeline"
category: "Automated"
tags: ["openai", "gpt-5", "fine-tuning"]
cover: "/images/default/gpt-5-fine-tuning.jpg"
meta_description: "GPT-5 fine-tuning is now open to all developers. Here's what changed and how to use it."
---

## GPT-5 Fine-Tuning: What Changed

OpenAI just opened GPT-5 fine-tuning to all paid-tier developers. Previously limited to enterprise customers, this change means startups and individual developers can now customize the model...

## Why This Matters Now

The timing isn't accidental. With Llama 4 and DeepSeek V4 offering competitive open-weight models, OpenAI needs to keep developers on its platform. Fine-tuning access is the carrot...
```

## Step 6: Production Hardening

### Deduplication

Track previously processed articles to avoid duplicates:

```python
import sqlite3

def init_db():
    conn = sqlite3.connect("pipeline_state.db")
    conn.execute("CREATE TABLE IF NOT EXISTS processed (article_id TEXT PRIMARY KEY)")
    return conn

def is_processed(conn: sqlite3.Connection, article_id: str) -> bool:
    return conn.execute("SELECT 1 FROM processed WHERE article_id=?", (article_id,)).fetchone() is not None

def mark_processed(conn: sqlite3.Connection, article_id: str):
    conn.execute("INSERT OR IGNORE INTO processed (article_id) VALUES (?)", (article_id,))
    conn.commit()
```

### Crontab Schedule

Run daily at 6 AM:

```bash
0 6 * * * cd /path/to/pipeline && python run_pipeline.py >> pipeline.log 2>&1
```

### Cost Estimate

| Component | Cost per Run (3 articles) |
|-----------|--------------------------|
| GPT-4o-mini (analysis) | ~$0.01 |
| GPT-4o-mini (rewrite) | ~$0.03 |
| API calls + bandwidth | ~$0.001 |
| **Total per run** | **~$0.04** |
| **Monthly (30 days)** | **~$1.20** |

Switch to GPT-4o for higher quality at ~$0.30/run, or use a local model via Ollama for zero API cost.

## Customization Ideas

- **Source filtering:** Add keyword whitelists so you only process articles about specific topics
- **Tone profiles:** Create multiple prompt variants (news-style, tutorial-style, opinion)
- **Image generation:** Pipe the article through DALL-E or Stable Diffusion for a cover image
- **Auto-publish:** Connect the output to your CMS API (WordPress, Ghost, Notion)

## Full Pipeline Script

Save all four files (`fetcher.py`, `extractor.py`, `pipeline.py`, `run_pipeline.py`) in the same directory. Run `python run_pipeline.py` after installing dependencies.

## Conclusion

You've built a production-grade automated blog content pipeline in under 200 lines of Python. It fetches real articles, analyzes them with an LLM, and produces SEO-optimized drafts ready for human review.

The key insight: **this doesn't replace writers.** It replaces the research and first-draft phase. A good editor can take a pipeline draft and make it excellent in 15 minutes — versus spending 2 hours starting from scratch. Use it to scale your content operation, not to cut corners.
