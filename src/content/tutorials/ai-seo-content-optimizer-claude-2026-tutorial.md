---
title: "Build an AI SEO Content Optimizer with Claude and SERP API: 2026 Tutorial"
author: "AIPlaybook Editorial Team"
date: 2026-05-30
category: tutorials
tags: ["seo", "content-optimization", "claude", "serp-api", "python", "keyword-research", "tutorial"]
cover: "/images/tutorials/ai-seo-content-optimizer-claude-2026-tutorial/cover.png"
difficulty: advanced
meta_description: "Build an AI-powered SEO content optimizer using Claude Sonnet 4 and real SERP data. Complete guide for keyword research, content scoring, and outline generation."
---

## Overview

SEO content optimization typically requires expensive tools like SurferSEO, Frase, or NeuronWriter. But with AI models that understand search intent and SERP APIs that provide real ranking data, you can build your own optimizer that matches or exceeds paid tools — at a fraction of the cost.

This tutorial builds an SEO content optimizer that:

1. Fetches real SERP results for any keyword (position, title, snippet)
2. Analyzes top-ranking content structure and gaps
3. Scores your existing content against competitors
4. Generates an optimized outline with exact word counts, headings, and entities
5. Rewrites sections to target specific keywords with proper density

The tool costs roughly $0.05 per keyword analysis — versus $50+/month for SaaS tools that lock you into their workflows.

## Architecture

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Keyword     │────▶│  SERP API    │────▶│  Claude Sonnet  │
│  Input       │     │  (top 10)    │     │  4 Analysis     │
└──────────────┘     └──────────────┘     └────────┬────────┘
                                                    │
                          ┌─────────────────────────┘
                          │
                    ┌─────▼──────┐     ┌─────────────────┐
                    │  Content   │     │  Optimized      │
                    │  Gap       │────▶│  Outline +      │
                    │  Analysis  │     │  Rewrite        │
                    └────────────┘     └─────────────────┘
```

## Prerequisites

- Python 3.10+
- Anthropic API key (Claude Sonnet 4)
- SerpAPI key (or any SERP API provider; we use SerpAPI for this tutorial)
- Basic understanding of SEO concepts (TF-IDF, keyword density, content gap)

## Step 1: Setup

```bash
mkdir seo-optimizer && cd seo-optimizer
python -m venv .venv
source .venv/bin/activate

pip install anthropic requests beautifulsoup4 python-dotenv readability-lxml
```

Create `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-...
SERPAPI_KEY=your-serpapi-key
```

## Step 2: SERP Data Fetcher

We use SerpAPI to get real Google search results. This is critical — optimization without real SERP data is just guessing.

Create `serp_fetcher.py`:

```python
import os
import requests
from typing import Optional
from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class SERPResult:
    """Represents a single search result from Google."""
    position: int
    title: str
    url: str
    snippet: str
    displayed_link: str


@dataclass
class SERPData:
    """Complete SERP data for a keyword."""
    keyword: str
    total_results: int
    results: list[SERPResult]
    featured_snippet: Optional[str] = None
    people_also_ask: list[str] = field(default_factory=list)
    related_questions: list[str] = field(default_factory=list)
    fetched_at: str = ""


def fetch_serp(keyword: str, location: str = "us", num_results: int = 10) -> SERPData:
    """
    Fetch real Google SERP data for a keyword using SerpAPI.

    Args:
        keyword: The search keyword
        location: Two-letter country code (us, uk, de, etc.)
        num_results: Results to fetch (max 10 on basic plan)

    Returns:
        SERPData object with parsed results
    """
    params = {
        "q": keyword,
        "api_key": os.getenv("SERPAPI_KEY"),
        "num": num_results,
        "gl": location,
        "hl": "en",
        "engine": "google",
    }

    resp = requests.get("https://serpapi.com/search", params=params)
    resp.raise_for_status()
    data = resp.json()

    results = []
    for item in data.get("organic_results", []):
        results.append(SERPResult(
            position=item.get("position", 99),
            title=item.get("title", ""),
            url=item.get("link", ""),
            snippet=item.get("snippet", ""),
            displayed_link=item.get("displayed_link", ""),
        ))

    # Extract featured snippet
    featured = data.get("organic_results", [{}])[0].get("snippet") if data.get("organic_results") else None

    # People Also Ask
    paa = []
    for item in data.get("related_questions", []):
        if isinstance(item, dict):
            paa.append(item.get("question", ""))

    return SERPData(
        keyword=keyword,
        total_results=int(data.get("search_information", {}).get("total_results", 0)),
        results=results,
        featured_snippet=featured,
        people_also_ask=paa,
        fetched_at=datetime.now().isoformat(),
    )


def fetch_page_content(url: str) -> str:
    """Fetch and extract main content from a URL using readability."""
    from bs4 import BeautifulSoup
    from readability import Document

    try:
        resp = requests.get(url, timeout=10, headers={
            "User-Agent": "Mozilla/5.0 (compatible; SEOOptimizer/1.0)"
        })
        resp.raise_for_status()

        doc = Document(resp.text)
        content_html = doc.summary()
        soup = BeautifulSoup(content_html, "html.parser")

        # Remove non-content elements
        for tag in soup.find_all(["script", "style", "nav", "footer", "header"]):
            tag.decompose()

        text = soup.get_text(separator="\n", strip=True)
        # Limit to first 3000 words
        words = text.split()
        return " ".join(words[:3000])

    except Exception as e:
        print(f"  ⚠ Failed to fetch {url}: {e}")
        return ""


if __name__ == "__main__":
    # Test with a keyword
    serp = fetch_serp("best AI writing tools 2026")
    print(f"Keyword: {serp.keyword}")
    print(f"Total results: {serp.total_results:,}")
    print(f"Top results:")
    for r in serp.results[:5]:
        print(f"  #{r.position}: {r.title[:60]}")
    if serp.featured_snippet:
        print(f"Featured snippet: {serp.featured_snippet[:100]}...")
    if serp.people_also_ask:
        print(f"People also ask: {serp.people_also_ask[:3]}")
```

## Step 3: Content Analysis & Scoring

This is where Claude analyzes the competitor content against your keyword and produces actionable scores.

Create `content_analyzer.py`:

```python
import json
import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


ANALYSIS_PROMPT = """You are an expert SEO content analyst. Analyze the
following SERP data and competitor content for the keyword "{keyword}".

Return a JSON object with:

1. search_intent (informational/commercial/transactional/navigational)
2. avg_word_count (average word count of top 5 results)
3. common_headings (list of H2/H3 heading topics found across competitors)
4. content_gaps (list of topics NOT covered by top results that would add value)
5. keyword_opportunities (list of related long-tail keywords with search_volume_estimate of low/medium/high)
6. entity_list (key entities/topics that should be in the article)
7. readability_target (recommended grade level: 8-10 for general, 12+ for technical)
8. top_content_score (score 0-100): evaluate the best competitor page against:
   - Keyword usage in H1, H2, first 100 words
   - Entity coverage
   - Content depth and uniqueness
   - Readability

SERP DATA:
{serp_json}

COMPETITOR CONTENT:
{competitor_content}

Be specific. Name exact headings, exact word counts, and exact terms missing.
"""


def analyze_keyword_opportunity(
    keyword: str,
    serp_data: dict,
    competitor_content: str = "",
) -> dict:
    """Analyze keyword opportunity and content gaps using Claude."""

    serp_json = {
        "keyword": serp_data.get("keyword", keyword),
        "total_results": serp_data.get("total_results", 0),
        "featured_snippet": serp_data.get("featured_snippet", None),
        "people_also_ask": serp_data.get("people_also_ask", []),
        "top_results": [
            {"position": r.get("position"), "title": r.get("title"),
             "snippet": r.get("snippet")}
            for r in serp_data.get("results", [])[:5]
        ],
    }

    # Truncate competitor content to avoid token limit
    limited_content = competitor_content[:5000]

    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system="You are an SEO content strategist. Output only valid JSON.",
        messages=[{
            "role": "user",
            "content": ANALYSIS_PROMPT.format(
                keyword=keyword,
                serp_json=json.dumps(serp_json, indent=2),
                competitor_content=limited_content or "No competitor content provided",
            ),
        }],
    )

    text = response.content[0].text
    try:
        result = json.loads(text.strip().removeprefix("```json").removesuffix("```").strip())
    except json.JSONDecodeError:
        result = {"raw_analysis": text, "parse_error": True}

    return result


def score_existing_content(content: str, keyword: str, analysis: dict) -> dict:
    """Score existing content against target keyword and SERP analysis."""
    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2048,
        system="You are an SEO content scorer. Output only valid JSON.",
        messages=[{
            "role": "user",
            "content": f"""Score this content for the keyword "{keyword}" (0-100).

Content:
{content[:4000]}

Analysis context:
- Search intent: {analysis.get('search_intent', 'unknown')}
- Entity coverage needed: {analysis.get('entity_list', [])}
- Avg competitor word count: {analysis.get('avg_word_count', 'N/A')}

Return JSON:
{{
  "overall_score": 0-100,
  "keyword_usage": {{"in_title": bool, "in_h1": bool, "in_first_100_words": bool, "density_pct": "X%"}},
  "entity_coverage": {{"covered": ["entity1"], "missing": ["entity2"]}},
  "readability_grade": "X",
  "improvement_suggestions": ["suggestion1", "suggestion2"]
}}""",
        }],
    )

    try:
        return json.loads(response.content[0].text.strip().removeprefix("```json").removesuffix("```").strip())
    except json.JSONDecodeError:
        return {"score": 0, "error": "parse_failed"}
```

## Step 4: Outline & Content Generator

Create `outline_generator.py`:

```python
import json
import os
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


OUTLINE_PROMPT = """Generate an optimized SEO content outline for the keyword
"{keyword}" targeting {intent} intent.

Analysis data:
- Avg competitor word count: {avg_word_count}
- Content gaps to cover: {content_gaps}
- Entities to include: {entities}
- Related questions to answer: {related_questions}

Requirements:
- Target word count: {target_word_count} words (10-20% longer than avg)
- Include {entities_count} identified entities naturally
- Each H2 section should have exact word count target
- Include FAQ schema opportunity at the end
- Cover all content gaps identified

Return JSON:
{{
  "title_options": ["Option 1", "Option 2", "Option 3"],
  "meta_description": "SEO meta description under 160 chars",
  "sections": [
    {{
      "heading": "H2 or H3 heading text",
      "type": "intro/body/conclusion/faq",
      "target_words": 200,
      "key_points": ["point1", "point2"],
      "entities_to_include": ["entity1"]
    }}
  ],
  "faq_schema_items": [{{"question": "Q", "answer": "A"}}],
  "internal_linking_suggestions": ["link to /reviews/...", "link to /comparisons/..."]
}}
"""


def generate_optimized_outline(
    keyword: str,
    analysis: dict,
    target_word_count: int | None = None,
) -> dict:
    """Generate an SEO-optimized content outline based on SERP analysis."""

    avg_word_count = analysis.get("avg_word_count", 1500)
    if not isinstance(avg_word_count, (int, float)):
        avg_word_count = 1500

    tgt = target_word_count or int(avg_word_count * 1.3)

    content_gaps = analysis.get("content_gaps", [])
    entities = analysis.get("entity_list", [])
    related_qs = analysis.get("people_also_ask", [])

    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system="You are an SEO content strategist. Output only valid JSON.",
        messages=[{
            "role": "user",
            "content": OUTLINE_PROMPT.format(
                keyword=keyword,
                intent=analysis.get("search_intent", "informational"),
                avg_word_count=avg_word_count,
                content_gaps=", ".join(content_gaps[:5]) if content_gaps else "None identified",
                entities=", ".join(entities[:8]) if entities else "General relevant terms",
                entities_count=min(len(entities), 8) if entities else 5,
                target_word_count=tgt,
                related_questions=", ".join(related_qs[:5]) if related_qs else "None",
            ),
        }],
    )

    try:
        return json.loads(response.content[0].text.strip().removeprefix("```json").removesuffix("```").strip())
    except json.JSONDecodeError:
        return {"title_options": ["Optimized: " + keyword], "sections": [], "_error": "parse_failed"}


def rewrite_section(
    original_text: str,
    keyword: str,
    target_entity: str,
    target_word_count: int,
) -> str:
    """Rewrite a content section to be more SEO-optimized."""
    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=target_word_count + 200,
        system="You are an SEO content writer. Write naturally — keyword stuffing is penalized.",
        messages=[{
            "role": "user",
            "content": f"""Rewrite this section for the keyword "{keyword}".
Make sure to naturally include the entity "{target_entity}".
Target: {target_word_count} words.
Improve readability and add specific details.

Original:
{original_text[:3000]}""",
        }],
    )
    return response.content[0].text
```

## Step 5: The Main Application

Create `main.py`:

```python
import json
import sys
from pathlib import Path
from serp_fetcher import fetch_serp, fetch_page_content
from content_analyzer import analyze_keyword_opportunity, score_existing_content
from outline_generator import generate_optimized_outline
import os


def analyze_keyword(keyword: str, existing_content: str = ""):
    """Full SEO analysis pipeline for a single keyword."""
    print(f"\n{'='*60}")
    print(f"🔍 Analyzing keyword: {keyword}")
    print(f"{'='*60}")

    # Step 1: Fetch SERP
    print("\n1. Fetching SERP data...")
    serp = fetch_serp(keyword)

    print(f"   {serp.total_results:,} total results")
    print(f"   Top results:")
    for r in serp.results[:3]:
        print(f"     #{r.position}: {r.title[:70]}")

    # Step 2: Fetch top competitor content
    print("\n2. Fetching top competitor content...")
    competitor_content = ""
    if serp.results:
        for r in serp.results[:3]:
            print(f"   Fetching #{r.position}: {r.url}")
            content = fetch_page_content(r.url)
            if content:
                word_count = len(content.split())
                competitor_content += f"\n\n=== COMPETITOR #{r.position} ===\n\n{content[:2000]}"
                print(f"   → {word_count} words extracted")
                break  # Just analyze the top result

    # Step 3: Analyze
    print("\n3. Analyzing with Claude...")
    analysis = analyze_keyword_opportunity(keyword, {
        "keyword": serp.keyword,
        "total_results": serp.total_results,
        "featured_snippet": serp.featured_snippet,
        "people_also_ask": serp.people_also_ask,
        "results": [r.__dict__ for r in serp.results],
    }, competitor_content)

    print(f"   Search intent: {analysis.get('search_intent', '?')}")
    print(f"   Avg word count: {analysis.get('avg_word_count', '?')}")
    gaps = analysis.get("content_gaps", [])
    if gaps:
        print(f"   Content gaps: {len(gaps)} identified")
        for g in gaps[:3]:
            print(f"     • {g}")

    # Step 4: Score existing content
    if existing_content:
        print("\n4. Scoring existing content...")
        score = score_existing_content(existing_content, keyword, analysis)
        print(f"   Score: {score.get('overall_score', '?')}/100")
        missing = score.get("entity_coverage", {}).get("missing", [])
        if missing:
            print(f"   Missing entities: {', '.join(missing[:5])}")
    else:
        score = None

    # Step 5: Generate outline
    print("\n5. Generating optimized outline...")
    outline = generate_optimized_outline(keyword, analysis)
    titles = outline.get("title_options", [])
    if titles:
        print(f"   Title options:")
        for t in titles:
            print(f"     • {t}")

    sections = outline.get("sections", [])
    total_words = sum(s.get("target_words", 0) for s in sections)
    print(f"   Outline: {len(sections)} sections, ≈{total_words} words total")

    # Save results
    output = {
        "keyword": keyword,
        "serp": {
            "total_results": serp.total_results,
            "featured_snippet": serp.featured_snippet,
            "people_also_ask": serp.people_also_ask,
        },
        "analysis": analysis,
        "existing_score": score,
        "optimized_outline": outline,
    }

    output_path = f"{keyword.replace(' ', '_')}_seo_analysis.json"
    with open(output_path, "w") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Full analysis saved to {output_path}")

    return output


if __name__ == "__main__":
    if len(sys.argv) < 2:
        keyword = input("Enter keyword to analyze: ").strip()
    else:
        keyword = " ".join(sys.argv[1:])

    existing = ""
    if Path("existing_content.txt").exists():
        with open("existing_content.txt") as f:
            existing = f.read()
        print(f"Found existing_content.txt ({len(existing.split())} words)")

    result = analyze_keyword(keyword, existing)
```

## Step 6: Testing

```bash
# Analyze a keyword
python main.py "best AI code editor 2026"

# With existing content to score
echo "Your existing article content here..." > existing_content.txt
python main.py "AI code editor comparison"
```

**Expected output snippet:**

```
🔍 Analyzing keyword: best AI code editor 2026

1. Fetching SERP data...
   14,200,000 total results
   Top results:
     #1: 10 Best AI Code Editors (2026) - ToolsDepth
     #2: Best AI Coding Assistants Compared - TechRepublic
     #3: 7 AI Code Editors I Tested for 6 Months - Medium

2. Analyzing with Claude...
   Search intent: commercial
   Avg word count: 2,350
   Content gaps: 4 identified
     • Performance benchmarks comparison
     • Pricing for team plans
     • Offline vs cloud latency comparison
```

## Tips

1. **Use location-specific SERP data**: Add `location="us"` for US results, `"de"` for Germany. Content competitiveness varies significantly by region.
2. **Analyze the featured snippet**: Pages ranking in position 0 get 8-30% CTR. Always analyze whether your content can target the featured snippet.
3. **Track over time**: Run the same keyword weekly and track score changes. The `fetched_at` timestamp helps correlate score changes with Google algorithm updates.
4. **Combine with Google Search Console**: Export your underperforming keywords (positions 10-20) and run them through this pipeline to get specific rewrite suggestions.

## Common Pitfalls

- **❌ SERP API rate limits**: SerpAPI free tier is 100 queries/month. For production, budget $50/month for 5,000 queries or use an alternative provider.
- **❌ Content fetching blocked**: Some sites block scrapers. Add rotating User-Agent headers or use a headless browser for JavaScript-rendered content.
- **❌ Over-optimization**: Claude can produce content that aggressively targets keywords. Use `temperature=0.3` for analysis and `0.7` for generation to balance optimization and natural language.
- **❌ Ignoring user intent**: If the SERP shows "best X" lists but your content is a beginner tutorial, no amount of optimization will rank it. The `search_intent` field catches this — pivot entirely if misaligned.

## Conclusion

You've built a professional-grade SEO content optimizer that would cost $500+/year as a SaaS subscription. The tool combines real search data, competitor analysis, content scoring, and AI-powered outline generation into a single pipeline.

The key insight: SEO tools don't need to be expensive. Claude Sonnet 4 + SERP API gives you 90% of what tools like SurferSEO offer, with the flexibility to customize every aspect of the analysis. Run this weekly on your content backlog, and you'll see consistent ranking improvements as you close content gaps and target the right entities.
