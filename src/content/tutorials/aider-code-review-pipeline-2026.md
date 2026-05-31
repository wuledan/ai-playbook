---
title: "Build an AI Code Review Pipeline with Aider and GitHub Actions 2026"
date: 2026-05-31
author: "AIPlaybook Editorial Team"
category: "Coding"
tags: [aider, github-actions, code-review, ci-cd, ai-code-review, automation, developer-tools]
cover: "/images/tutorials/aider-code-review-pipeline/cover.png"
difficulty: advanced
meta_description: "Set up an automated AI code review pipeline using Aider CLI in GitHub Actions — with PR commenting, model selection, and cost optimization."
---

## Overview

Code reviews catch bugs early, improve code quality, and spread knowledge across teams — but they're time-consuming and inconsistent. An AI-powered code review pipeline fills the gap: it runs on every pull request, catches issues before human review, and provides consistent, actionable feedback.

This tutorial walks you through setting up **Aider** — the AI pair programming CLI — as an automated code reviewer inside **GitHub Actions**. By the end, you'll have a CI pipeline that:

- Triggers automatically on every PR
- Runs Aider's review mode against changed files
- Posts detailed review comments directly on the PR
- Supports configurable model selection and cost budgets
- Logs every review for auditing and iteration

**Who this is for:** Developers comfortable with GitHub Actions YAML, basic shell scripting, and code review workflows.

**Prerequisite knowledge:** Familiarity with Git branching, PR workflows, and CI/CD concepts.

## Prerequisites

Before starting, make sure you have:

- **GitHub repository** (public or private) with code you want reviewed
- **GitHub Actions enabled** (enabled by default on all repos)
- **An AI API key** — either OpenAI (GPT-4o), Anthropic (Claude Sonnet 4), or a local model via Ollama
- **Aider CLI** (v0.91+) installed locally for testing — you can install it with `pip install aider-chat` or `brew install aider`
- **A GitHub personal access token** (classic or fine-grained) with `contents: read` and `pull_requests: write` scopes

> **Note:** Aider's code review feature was introduced in v0.70+. All commands in this tutorial assume v0.91+, which is the latest stable as of mid-2026.

## Step-by-Step Guide

### Step 1: Install and Test Aider Locally

Before wiring up CI, confirm Aider can run code reviews on your machine:

```bash
# Install Aider
pip install aider-chat

# Verify installation
aider --version
# Expected output: 0.91.x or higher

# Set your API key (example uses Anthropic)
export ANTHROPIC_API_KEY="sk-ant-..."
```

Aider's review mode uses the `--lint` flag (or `--review` in newer versions) to analyze files without making edits. Test it on a single file:

```bash
# Review a specific file (no changes made, just analysis)
aider --review src/main.py --model claude-sonnet-4-20250514
```

The output will show lint errors, potential bugs, and suggestions organized by file and line number. If this works, Aider is ready for CI integration.

### Step 2: Understand Aider's Review Capabilities

Aider's review does more than basic linting. It understands:

- **Code logic errors** — null pointer risks, missing error handling, off-by-one errors
- **Security vulnerabilities** — SQL injection, XSS, hardcoded secrets
- **Performance issues** — N+1 queries, unnecessary allocations, inefficient loops
- **Style consistency** — deviation from project conventions
- **API misuse** — incorrect function signatures, deprecated method calls

You can tune the review with Aider's configuration file. Create `.aider.conf.yml` in your repo root:

```yaml
# .aider.conf.yml
auto-lint: true
lint-mode: review
auto-test: false
show-repo-map: false
git-mode: whole
map-refresh: auto
edit-format: udiff

# Model settings
model: claude-sonnet-4-20250514
weak-model: claude-3-5-haiku-20241022

# Cost control
max-spend-per-check: 0.10
```

The `weak-model` setting is important for CI: it lets you use a cheaper model for routine lint/format checks and reserve the expensive model for deeper reviews.

### Step 3: Create the GitHub Actions Workflow

Create `.github/workflows/aider-review.yml` in your repository:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]
  pull_request_review_comment:
    types: [created]

jobs:
  ai-review:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
      issues: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Full history needed for Aider's git analysis

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.12"
          cache: "pip"

      - name: Install Aider
        run: |
          pip install aider-chat

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v44
        with:
          separator: " "

      - name: Run AI Code Review
        id: review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          CHANGED_FILES="${{ steps.changed-files.outputs.all_changed_files }}"
          if [ -z "$CHANGED_FILES" ]; then
            echo "No changed files found. Skipping review."
            exit 0
          fi

          aider --review \
            --model claude-sonnet-4-20250514 \
            --weak-model claude-3-5-haiku-20241022 \
            --max-spend 0.10 \
            $CHANGED_FILES > review_output.txt 2>&1 || true

          cat review_output.txt

      - name: Post review comment
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const reviewText = fs.readFileSync('review_output.txt', 'utf8').trim();

            if (!reviewText || reviewText.length < 20) {
              console.log('No substantive review output. Skipping comment.');
              return;
            }

            const body = `## 🤖 AI Code Review\n\n` +
              `_Reviewed by Aider (${process.env.AIDER_MODEL || 'claude-sonnet-4'})_\n\n` +
              `\`\`\`\n${reviewText.slice(0, 30000)}\n\`\`\`\n`;

            await github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              body: body
            });
```

This workflow:

1. **Triggers on PR events** — open, sync (new commits), reopen
2. **Checks out the full repo** — Aider needs git history to understand context
3. **Installs Aider** via pip
4. **Detects changed files** using tj-actions/changed-files
5. **Runs Aider review** on only the changed files — not the entire codebase
6. **Posts the output** as a PR comment

### Step 4: Add Repository Secrets

For the workflow to call the AI API, you need to store your API key as a GitHub secret:

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Name: `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY` depending on your model)
4. Paste your API key value
5. Click **Add secret**

Update the workflow YAML to use the correct environment variable for your chosen model provider:

| Provider | Env Variable | Model Example |
|----------|-------------|---------------|
| Anthropic | `ANTHROPIC_API_KEY` | `claude-sonnet-4-20250514` |
| OpenAI | `OPENAI_API_KEY` | `gpt-4o-2025-05-13` |
| Google | `GEMINI_API_KEY` | `gemini-2.5-pro` |
| OpenRouter | `OPENROUTER_API_KEY` | `openrouter/anthropic/claude-sonnet-4` |

### Step 5: Fine-Tune the Review Configuration

Aider's `.aider.conf.yml` file supports extensive customization. Here's an advanced configuration tuned for CI:

```yaml
# .aider.conf.yml
# Model selection
model: claude-sonnet-4-20250514
weak-model: claude-3-5-haiku-20241022

# Review behavior
auto-lint: true
lint-mode: review
show-repo-map: true
repo-map: 1024

# Git settings
git-mode: full
auto-commits: false
attribute-author: false
attribute-committer: false

# File restrictions
restrict-files: true
only-review-changes: true

# Cost management
max-spend-per-check: 0.15
max-spend-per-day: 2.00

# Output
verbose: false
```

Key options explained:

- **`show-repo-map`** — Aider generates a map of your repo structure to understand context. Set to `true` for better analysis.
- **`only-review-changes`** — When `true`, Aider only flags issues in lines you changed, not pre-existing problems. This reduces noise.
- **`max-spend-per-check`** — Hard cap on API spend per review (USD). Aider stops reviewing once the budget is exceeded.
- **`restrict-files`** — Prevents Aider from reading files outside the changed set.

### Step 6: Test the Pipeline

1. Create a new branch and make a change with a deliberate bug:

```python
# buggy_function.py
def get_user(user_id):
    # Bug: no null check, SQL injection risk
    query = f"SELECT * FROM users WHERE id = {user_id}"
    return database.execute(query)
```

2. Push the branch and open a PR against `main`:

```bash
git checkout -b test-ai-review
# Add buggy_function.py
git add buggy_function.py
git commit -m "Add user lookup function"
git push origin test-ai-review
# Open PR via GitHub UI or gh CLI
gh pr create --title "Test AI Review" --body "Testing the AI review pipeline"
```

3. Watch the Actions tab — the workflow should trigger within seconds:

```bash
# Check workflow status
gh run list --workflow "AI Code Review"
```

4. Open your PR — you should see a comment from `github-actions` with Aider's review output. Expected feedback:

- **Security warning** about SQL injection in the f-string query
- **Suggestion** to use parameterized queries
- **Note** about missing error handling for missing users

### Step 7: Handle Large PRs and Incremental Review

For PRs with many changed files, Aider can hit token limits or cost caps. Implement incremental review by batching files:

```yaml
# Inside the workflow, replace the "Run AI Code Review" step
- name: Run AI Code Review (batched)
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    CHANGED_FILES="${{ steps.changed-files.outputs.all_changed_files }}"
    IFS=' ' read -ra FILES <<< "$CHANGED_FILES"
    BATCH_SIZE=5
    BATCH_NUM=0

    for ((i=0; i<${#FILES[@]}; i+=BATCH_SIZE)); do
      BATCH=("${FILES[@]:i:BATCH_SIZE}")
      BATCH_NUM=$((BATCH_NUM + 1))
      echo "=== Review Batch $BATCH_NUM ==="
      aider --review --model claude-sonnet-4-20250514 "${BATCH[@]}" >> review_output.txt 2>&1 || true
    done
```

This batches 5 files per review invocation, reducing context window pressure and keeping costs predictable.

### Step 8: Cost Estimation and Optimization

Aider's API costs depend on the model and the size of changed files. Here's an estimated cost breakdown:

| Model | Cost per 1K input tokens | Cost per 1K output tokens | Est. cost per PR (small) |
|-------|------------------------|-------------------------|-------------------------|
| Claude Sonnet 4 | $0.003 | $0.015 | $0.05 - $0.15 |
| GPT-4o | $0.0025 | $0.01 | $0.04 - $0.12 |
| Claude Haiku 3.5 | $0.0008 | $0.004 | $0.01 - $0.04 |
| DeepSeek Coder V3 | $0.001 | $0.002 | $0.01 - $0.03 |

**Cost optimization tips:**

1. **Use the `weak-model` for lint-stage checks** — only escalate to the expensive model when issues are found
2. **Set `max-spend-per-check`** to avoid runaway costs on large PRs
3. **Review only changed files** — this is the single biggest cost saver
4. **Skip binary and generated files** — add patterns to an exclusion list:

```yaml
- name: Filter files for review
  id: filter
  run: |
    ALL_FILES="${{ steps.changed-files.outputs.all_changed_files }}"
    FILTERED=""
    for f in $ALL_FILES; do
      case "$f" in
        *.md|*.json|*.lock|*.svg|*.png|*.jpg|*.ico|package-lock.json|yarn.lock)
          continue ;;
        *)
          FILTERED="$FILTERED $f" ;;
      esac
    done
    echo "filtered=${FILTERED}" >> $GITHUB_OUTPUT
```

## Troubleshooting

### Aider exits with "No API key found"

Make sure the secret is named exactly as expected by the workflow. Verify in GitHub UI: Settings → Secrets → Actions. Also check that the env variable in the workflow matches the secret name.

### Review output is truncated

GitHub Actions has a log size limit. If Aider produces very long review output, clip it in the posting script (as done in Step 3 with `.slice(0, 30000)`). Alternatively, post a summary with a link to full logs.

### Rate limiting from API provider

Add a retry mechanism to the workflow step:

```yaml
- name: Run AI Code Review (with retry)
  uses: nick-fields/retry@v3
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_wait_seconds: 30
    command: aider --review --model claude-sonnet-4-20250514 $CHANGED_FILES
```

### Aider doesn't review certain file types

Aider supports Python, JavaScript, TypeScript, Go, Rust, Java, C/C++, Ruby, PHP, and many more. If a file type isn't recognized, try specifying the model explicitly with `--model` or check if the file extension is in Aider's supported list by running `aider --supported-languages`.

## Next Steps / Advanced

Now that your basic pipeline is running, consider these enhancements:

1. **PR review summaries** — Have Aider generate a brief summary of all issues found, ranked by severity:

```bash
aider --review --summary --model claude-sonnet-4-20250514 $CHANGED_FILES
```

2. **Auto-fix suggestions** — Aider can suggest fixes (but not apply them automatically in CI). Pipe the review output to a formatting step that creates clickable suggestions.

3. **Multi-model voting** — Run two different models (e.g., Claude + GPT-4o) and only flag issues both agree on. This reduces false positives:

```yaml
# Run two reviews and compare
- name: Review with Claude
  run: aider --review --model claude-sonnet-4-20250514 >> review_claude.txt
- name: Review with GPT-4o
  run: aider --review --model gpt-4o-2025-05-13 >> review_gpt4.txt
# Then diff the outputs in a comparison step
```

4. **Learning mode** — Save review outputs and periodically fine-tune a custom model on your team's review preferences.

5. **Dashboard** — Log review results to a database or Google Sheets for tracking trends — which files have the most issues, which types of bugs are most common, and how review quality improves over time.

## FAQ

### Does Aider modify my code during review?

No. When using `--review` or `--lint` mode, Aider only analyzes and reports — it never writes changes to files. The codebase stays untouched.

### Can I use a local model via Ollama?

Yes. Aider supports Ollama models. In your `.aider.conf.yml`, set `model: ollama/qwen2.5-coder:32b` or any other Ollama-compatible model. Note that local models may produce less reliable reviews than cloud models.

### How does this compare to GitHub Copilot Code Review?

Aider's review is more customizable (you control the model, budget, and scope), supports more model providers, and runs entirely within your CI pipeline without a separate subscription. Copilot Code Review is simpler to set up but less flexible and limited to OpenAI models.

### What's the cost for a typical team?

For a team making 10 PRs per day, each touching 5-10 files, expect $1-3/day using Claude Sonnet 4 or GPT-4o. Using Haiku as the weak model can cut costs by 60-70%.
