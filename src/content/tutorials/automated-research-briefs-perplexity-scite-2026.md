---
title: "Build Automated Research Briefs with Perplexity and Scite 2026"
date: 2026-05-31
author: "AIPlaybook Editorial Team"
category: "Automation"
tags: [perplexity, scite, research-automation, research-briefs, n8n, deep-research, smart-citations]
cover: "/images/tutorials/automated-research-briefs/cover.png"
difficulty: advanced
meta_description: "Create an automated research pipeline combining Perplexity Pro deep research, Scite smart citations, and n8n scheduling to generate structured research briefs on any topic."
---

## Overview

Research briefs — those concise summaries of what's known about a topic — are essential for decision-making but incredibly time-consuming to create manually. You need to search literature, verify credibility, extract key findings, and format everything into a readable document.

This tutorial builds an **automated research brief pipeline** that does all of this on a schedule:

- **Perplexity Pro** performs deep research with citations, using its advanced web search and reasoning capabilities
- **Scite** validates sources by showing how each paper has been cited — supporting, contrasting, or neutral
- **n8n** orchestrates the entire workflow, scheduling runs and formatting the output

By the end, you'll have a system that produces ready-to-read research briefs on any topic, delivered to your inbox or knowledge base on a schedule you define.

**Who this is for:** Technical professionals comfortable with APIs, JSON, and basic workflows (n8n experience helpful but not required).

**Learning curve:** This is the most technically involved tutorial in this series. Expect 2-3 hours to set up the full pipeline.

## Prerequisites

- **Perplexity Pro subscription** ($20/month) — Pro is required for API access and deep research
- **Scite Pro account** with API access ($20/month academic)
- **n8n instance** — self-hosted (docker or npm) or cloud (n8n.cloud)
  - Self-hosted quick start: `docker run -it --rm --name n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n`
- **Basic API understanding** — REST, JSON, API keys
- **Slack or email** (or both) for receiving completed briefs

## Step-by-Step Guide

### Step 1: Set Up Perplexity API Access

Perplexity introduced its API in early 2026, enabling programmatic access to its deep research capabilities.

1. Go to [perplexity.ai/settings/api](https://perplexity.ai/settings/api)
2. Click **"Generate API Key"**
3. Name your key (e.g., "n8n research pipeline")
4. Copy the key (starts with `pplx-`)
5. Save it somewhere secure — you'll add it to n8n as a credential

**Test your API key:**

```bash
curl -X POST https://api.perplexity.ai/chat/completions \
  -H "Authorization: Bearer pplx-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "sonar-pro",
    "messages": [
      {"role": "system", "content": "You are a research assistant. Provide concise, well-cited answers."},
      {"role": "user", "content": "What are the latest findings on mRNA vaccine durability?"}
    ]
  }'
```

The response includes `citations` array — linked URLs that Perplexity used. These will be fed into Scite for validation.

**Understanding Perplexity models:**
- `sonar-pro` — Best for research, supports deep research mode, 128K context
- `sonar` — Faster, cheaper, good for simple lookups
- `sonar-deep-research` — Uses the "Deep Research" mode with multi-step reasoning

For our pipeline, we'll use `sonar-deep-research` for thorough briefs and `sonar-pro` for lighter daily updates.

### Step 2: Get Scite API Access

Scite's API provides programmatic access to its citation database.

1. Go to [scite.ai/settings/api](https://scite.ai/settings/api)
2. Request API access (Pro subscribers only)
3. You'll receive:
   - **API Key** (string)
   - **API Secret** (keep this private)
4. Both are needed for authentication

**Test Scite API:**

```bash
# Test basic paper search
curl -X GET "https://api.scite.ai/api/v1/papers?doi=10.1038/s41586-024-07164-0" \
  -H "x-api-key: YOUR_SCITE_API_KEY" \
  -H "x-api-secret: YOUR_SCITE_API_SECRET"

# Get citation statements for a paper
curl -X GET "https://api.scite.ai/api/v1/papers/DOI/citation-statements?limit=10" \
  -H "x-api-key: YOUR_SCITE_API_KEY" \
  -H "x-api-secret: YOUR_SCITE_API_SECRET"
```

The response includes `citation_statements` with each statement classified as `supporting`, `contrasting`, or `mentioning`.

### Step 3: Set Up n8n Workflow

Now we connect everything in n8n. We'll build a workflow that:

1. **Triggers on a schedule** — daily, weekly, or on-demand
2. **Calls Perplexity** with your research question
3. **Extracts citations** from the response
4. **Validates each citation** via Scite
5. **Formats the output** with credibility scores
6. **Delivers the brief** to Slack, email, or Notion

**Create the workflow:**

1. Open your n8n instance (locally: http://localhost:5678)
2. Click **"New Workflow"**
3. Name it: "Research Brief Generator"

**Add the Schedule Trigger:**
1. Search for "Schedule Trigger" in the nodes palette
2. Configure:
   - **Trigger Times:** Select your schedule
   - Example for weekly: "Every Monday at 9:00 AM"
   - Example for daily: "Every day at 8:00 AM"

**Pass topic as parameter:**
For flexibility, we'll use n8n's workflow variables:

1. Add an **"Edit Fields"** node after the trigger
2. Set the research topic:
   - Field `topic`: `="mRNA vaccine durability after 6 months"`
3. This makes the topic configurable — you can change it per run or pass it from a form/webhook

### Step 4: Build the Perplexity Research Step

Add an **HTTP Request** node to call Perplexity:

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "POST",
    "url": "https://api.perplexity.ai/chat/completions",
    "authentication": "genericCredentialType",
    "credentialType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {"name": "Authorization", "value": "Bearer pplx-YOUR_API_KEY"},
        {"name": "Content-Type", "value": "application/json"}
      ]
    },
    "sendBody": true,
    "bodyParameters": {
      "parameters": [
        {"name": "model", "value": "sonar-deep-research"},
        {"name": "messages[0][role]", "value": "system"},
        {"name": "messages[0][content]", "value": "You are an expert research assistant. Provide comprehensive, well-cited answers. Always include direct citations from academic papers. Your response should have: 1) Executive summary 2) Key findings with citations 3) Conflicting evidence 4) Gaps in research"},
        {"name": "messages[1][role]", "value": "user"},
        {"name": "messages[1][content]", "value": "={{ $json.topic }}"}
      ]
    },
    "options": {
      "timeout": 120000
    }
  }
}
```

**Parse the response:**
Add a **Function** node to extract the text and citations:

```javascript
// Parse Perplexity response
const data = $input.item.json;
const content = data.choices[0].message.content;
const citations = data.citations || [];

// Extract DOIs from citation URLs
const dois = citations
  .filter(url => url.includes('doi.org') || url.includes('doi/'))
  .map(url => {
    const match = url.match(/doi\.org\/(10\.\S+)/) || url.match(/doi\/(10\.\S+)/);
    return match ? match[1].replace(/[^a-zA-Z0-9\/\.\-\_\(\)]/g, '') : null;
  })
  .filter(Boolean);

// Remove duplicate DOIs
const uniqueDois = [...new Set(dois)];

return {
  researchText: content,
  citations: citations,
  dois: uniqueDois,
  citationCount: uniqueDois.length
};
```

### Step 5: Add Scite Credibility Validation

Now we validate each DOI using Scite's API. Add a **Loop Over Items** node:

1. **Source:** Function output → `dois` array
2. **Batch size:** 5 (respect rate limits)
3. Inside the loop, add an **HTTP Request** node:

```json
{
  "node": "HTTP Request",
  "parameters": {
    "method": "GET",
    "url": "=https://api.scite.ai/api/v1/papers/{{ encodeURIComponent($json.value) }}/citation-statements?limit=10",
    "authentication": "genericCredentialType",
    "credentialType": "httpHeaderAuth",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {"name": "x-api-key", "value": "YOUR_SCITE_KEY"},
        {"name": "x-api-secret", "value": "YOUR_SCITE_SECRET"}
      ]
    }
  }
}
```

3. Add a **Function** node after the HTTP Request to calculate credibility:

```javascript
const data = $input.item.json;
const statements = data.citation_statements || [];
const total = statements.length;

if (total === 0) {
  return { doi: $json.value, credibility: 'unknown', score: 0, support: 0, contrast: 0, mention: 0 };
}

let supportCount = 0, contrastCount = 0, mentionCount = 0;

statements.forEach(s => {
  if (s.citation_type === 'supporting') supportCount++;
  else if (s.citation_type === 'contrasting') contrastCount++;
  else mentionCount++;
});

const credibilityScore = total > 0 ? 
  Math.round((supportCount / total) * 10) : 0;

let credibilityLevel;
if (credibilityScore >= 7) credibilityLevel = 'high';
else if (credibilityScore >= 4) credibilityLevel = 'medium';
else credibilityLevel = 'low';

return {
  doi: $json.value,
  citationCount: total,
  supportCount,
  contrastCount,
  mentionCount,
  credibilityLevel,
  credibilityScore
};
```

### Step 6: Format the Research Brief

Once all Scite data is collected, add a **Function** node to assemble the final brief:

```javascript
// Collect all data from previous steps
const perplexityResult = $items("Function")[0].json;
const sciteResults = $items("Loop Over Items").map(item => item.json);

const topic = $json.topic;

// Build credibility summary section
let credibilitySection = "";
if (sciteResults.length > 0) {
  const high = sciteResults.filter(r => r.credibilityLevel === 'high').length;
  const medium = sciteResults.filter(r => r.credibilityLevel === 'medium').length;
  const low = sciteResults.filter(r => r.credibilityLevel === 'low').length;
  
  credibilitySection = `## Source Credibility Summary\n`;
  credibilitySection += `- **High credibility (≥70% supporting):** ${high} papers\n`;
  credibilitySection += `- **Medium credibility:** ${medium} papers\n`;
  credibilitySection += `- **Low credibility (contested findings):** ${low} papers\n\n`;
  
  // Add detailed table
  credibilitySection += `| DOI | Support | Contrast | Credibility |\n`;
  credibilitySection += `|-----|---------|----------|-------------|\n`;
  sciteResults.forEach(r => {
    credibilitySection += `| ${r.doi} | ${r.supportCount} | ${r.contrastCount} | ${r.credibilityLevel.toUpperCase()} |\n`;
  });
}

const brief = `# 📋 Automated Research Brief
**Topic:** ${topic}
**Generated:** ${new Date().toISOString()}
**Sources:** ${perplexityResult.citationCount} citations analyzed

## Executive Summary
${perplexityResult.researchText.split('\n').slice(0, 5).join('\n')}

## Detailed Findings
${perplexityResult.researchText}

${credibilitySection}

## Research Quality Notes
- Papers marked **LOW credibility** have significant contrasting citations — treat their conclusions cautiously
- Papers marked **HIGH credibility** have broad support in the literature
- ${sciteResults.filter(r => r.credibilityLevel === 'high').length}/${sciteResults.length} papers in this brief have high credibility scores

## Methodology
This brief was generated by Perplexity Deep Research and all citations were validated through Scite's smart citation analysis. Only papers with available Scite data were included in the credibility assessment.

---

Generated by Automated Research Brief Pipeline | Perplexity + Scite + n8n
`;

return { markdown: brief, topic, generatedAt: new Date().toISOString() };
```

### Step 7: Deliver the Brief

Add an output node to send the brief to your preferred channel:

**Slack option:**
1. Add a **Slack** node
2. Configure:
   - **Operation:** Send a message
   - **Channel:** #research-briefs (create this channel first)
   - **Text:** `={{ $json.markdown }}`
   - **As user:** Select your bot

**Email option:**
1. Add an **Email (SMTP)** node
2. Configure your SMTP settings (Gmail, Outlook, etc.)
3. Set:
   - **To:** you@example.com
   - **Subject:** `=Research Brief: {{ $json.topic }}`
   - **Text:** Paste the markdown content

**Notion option:**
1. Add a **Notion** node
2. Create a database page with the brief
3. Split the markdown into database fields: Title (Topic), Content (brief body), Generated Date

### Step 8: Create a Weekly "Deep Research" Variant

For a more thorough weekly brief, create a second workflow with:

1. **Perplexity model:** `sonar-deep-research` (uses multi-step reasoning)
2. **Multiple questions:** Instead of one topic, ask 3-5 sub-questions:

```json
{
  "questions": [
    "What is the efficacy of current mRNA vaccines against new variants?",
    "What are the latest findings on booster interval optimization?",
    "How durable are T-cell responses from mRNA vaccination?",
    "What is the evidence on combination influenza-COVID mRNA vaccines?"
  ]
}
```

3. Run each question through the pipeline separately, then merge results
4. Add a **summary node** that synthesizes across questions
5. Schedule: **Sundays at 10:00 AM**

This produces a comprehensive weekly research brief that covers multiple facets of a research area.

### Step 9: Add Error Handling and Monitoring

In production, your workflow will encounter errors. Add these safeguards:

**Retry on API failures:**
1. For each HTTP Request node, click **"Error Handling"**
2. Set:
   - **Retry on fail:** Yes
   - **Max retries:** 3
   - **Retry interval:** 60 seconds

**Fallback for Scite failures:**
Some DOIs won't be found in Scite's database. Add conditional logic:

```javascript
// In the Scite processing function
if (!data || data.error) {
  return {
    doi: /* original DOI */,
    error: "Not found in Scite database",
    credibilityLevel: "unavailable"
  };
}
```

**Alert on workflow failure:**
1. Add an **Error Trigger** node to the workflow
2. Connect it to a Slack node
3. Configure:

```
🚨 Research Brief Pipeline Failed
Workflow: Research Brief Generator
Error: {{ $json.error.message }}
Time: {{ $json.timestamp }}
```

## Troubleshooting

### Perplexity API returns 401 Unauthorized

Check that your API key is correctly entered in the HTTP Request node. Keys start with `pplx-`. Make sure there's no trailing whitespace. Regenerate the key if needed.

### Scite API rate limiting

Scite's API has a rate limit of 10 requests/second for Pro accounts. The Loop Over Items node with batch size 5 should stay well within this limit. If you get 429 errors, increase the batch delay or reduce batch size.

### n8n workflow times out

Perplexity deep research can take 30-60 seconds. Increase the HTTP Request node timeout to 180 seconds (3 minutes). For very long responses, consider Pagination option in the HTTP Request node.

### Markdown formatting lost in Slack

Slack supports limited markdown. Use the Slack Block Kit format instead of raw markdown for cleaner presentation. n8n has a Slack Block Kit node builder.

## Next Steps / Advanced

1. **Add RAG storage** — Save briefs to a vector database (Pinecone, Supabase) for semantic search across past research. Query past briefs naturally: "What did we find about mRNA durability in January 2026 briefs?"

2. **Multi-source briefs** — Add additional sources: PubMed API, Semantic Scholar, arXiv. Combine with Perplexity's web research for comprehensive coverage.

3. **Competitor intelligence twist** — Replace academic research topics with competitor tracking: "What's new on ProductHunt this week?" or "Latest funding rounds in AI startups."

4. **Interactive dashboard** — Send briefs to a Streamlit or Observable dashboard instead of Slack. Add filtering, drill-down, and chart visualizations.

5. **Schedule via Airtable** — Use an Airtable base as the topic source. Adding a new row with a topic triggers an on-demand brief. Great for teams that want to request briefs without touching n8n.

## FAQ

### Do I need a Perplexity Pro subscription?

Yes. The API is only available on the Pro plan ($20/month). The free tier doesn't include API access.

### How accurate is the Scite credibility score?

The credibility score is a simplified metric (ratio of supporting to total citations). It's a useful heuristic but shouldn't replace critical reading. A paper with 100% supporting citations might still have methodological flaws — it just hasn't been criticized in the literature yet.

### Can I run this on a budget?

Perplexity API costs $0.01-0.05 per deep research query (~$1-2/month for daily briefs). Scite API is included in your $20/month subscription. n8n self-hosted is free. Total: ~$22/month for a fully automated research assistant.

### What if I don't want to self-host n8n?

Use n8n.cloud (starting at ~$20/month) or replace n8n with Zapier (higher cost per task) or a simple cron + Python script. The Python-only approach is cheaper but loses n8n's visual workflow and error handling.
