---
title: "GitHub Stacked PRs Tutorial 2026 — Break Large Changes into Small, Reviewable Pull Requests"
date: 2026-07-31
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "GitHub"
  - "Stacked PRs"
  - "Pull Requests"
  - "Code Review"
  - "CI/CD"
  - "Developer-Workflow"
  - "Git"
  - "Collaboration"
cover: "/images/tutorials/github-stacked-prs-tutorial-2026/cover.png"
difficulty: "intermediate"
meta_description: "Complete hands-on tutorial for GitHub Stacked PRs (public preview 2026). Learn to create, review, and merge stacked pull requests using the gh CLI extension. Includes real-world workflow with code examples."
---

## What Are Stacked Pull Requests?

On July 30, 2026, GitHub launched **Stacked Pull Requests** in public preview — a feature that breaks large changes into small, independently reviewable pull requests that form an ordered series (a "stack"). Each pull request in the stack represents a focused layer of the overall change.

Instead of opening one giant PR that takes days to review, you create a stack of small, logical PRs. Reviewers can look at each layer independently, and when everything is ready, you merge the entire stack in a single click.

> *"We've been using GitHub stacked PRs for Next.js for the past few months. It has helped us introduce smaller individual changes while shipping larger features, making it easier to review PRs."* — **Tim Neutkens, Next.js lead, Vercel**

## Why Stacked PRs Matter

Traditional large PRs have well-known problems:

- **Review fatigue**: A 2000-line PR is mentally exhausting to review
- **Blocking dependencies**: One change blocks everything downstream
- **Merge conflicts**: Long-lived branches accumulate conflicts
- **Context switching**: Reviewers can't focus on one logical change at a time

Stacked PRs solve all of this. Each PR in the stack is small and focused. Reviewers can work on different layers in parallel. When any layer is ready, the whole stack merges with one click.

## Prerequisites

- GitHub account with access to a repository
- [GitHub CLI](https://cli.github.com/) installed (`gh` version 2.60+)
- Basic familiarity with Git branches and pull requests

## Step 1: Install the CLI Extension

Start by installing the official `gh-stack` extension:

```bash
gh extension install github/gh-stack
```

Verify the installation:

```bash
gh stack --help
```

You should see the stack command help, listing subcommands for creating, viewing, and managing stacks.

## Step 2: Create Your First Stack

Let's say you're adding a new search feature to your app. This involves:

1. Adding a search index backend
2. Creating the search API endpoint
3. Building the frontend search UI
4. Adding tests for the search feature

Without stacked PRs, you'd create one massive branch with everything. With stacked PRs, you create a stack of four focused PRs.

### Create the base branch

Start with your first change:

```bash
git checkout -b add-search-index
# Make your changes to add the search index
git add -A
git commit -m "feat: add search index backend"
git push -u origin add-search-index
gh pr create --title "Add search index backend" --body "Implements the backend search index using Meilisearch."
```

### Stack the next layer on top

Now create the second PR on top of the first:

```bash
git checkout -b add-search-api --track origin/add-search-index
# Make your API endpoint changes
git add -A
git commit -m "feat: add search API endpoint"
git push -u origin add-search-api
gh pr create --title "Add search API endpoint" --body "Exposes search index via REST API."
```

GitHub automatically recognizes that `add-search-api` targets `add-search-index` below it. Continue for layers 3 and 4:

```bash
git checkout -b add-search-ui --track origin/add-search-api
# Build the frontend
git add -A && git commit -m "feat: add search UI component"
git push -u origin add-search-ui
gh pr create --title "Add search UI component" --body "React search component with autocomplete."

git checkout -b add-search-tests --track origin/add-search-ui
# Write tests
git add -A && git commit -m "test: add search feature tests"
git push -u origin add-search-tests
gh pr create --title "Add search feature tests" --body "Integration and unit tests for search."
```

## Step 3: Review Each Layer Independently

Each PR in the stack shows only its own diff — not the diffs of the layers below it. This means:

- **PR #1 (search index)**: Review only the index code — ~50 lines
- **PR #2 (search API)**: Review only the API endpoint — ~80 lines  
- **PR #3 (search UI)**: Review only the frontend component — ~120 lines
- **PR #4 (search tests)**: Review only the test files — ~100 lines

At the top of each PR page, GitHub displays a **stack map** showing how this PR fits into the larger stack:

```
┌─────────────────────────────────┐
│ Your Stack (4 PRs)              │
│                                 │
│  [4] Add search feature tests   │ ← You are here
│  [3] Add search UI component    │   (approved ✓)
│  [2] Add search API endpoint    │   (pending)
│  [1] Add search index backend   │   (changes requested)
└─────────────────────────────────┘
```

Different reviewers can pick different layers. Alice reviews the backend (PR #1, #2), Bob reviews the frontend (PR #3), and Carol reviews the tests (PR #4) — all in parallel.

## Step 4: Merge Everything in One Click

Once all PRs in the stack are approved and pass checks, the bottom PR shows a **Merge Stack** button. Clicking it lands all unmerged layers in a single operation.

To merge part of a stack (e.g., only the backend changes), merge the lower layers individually. The PRs above stay open and automatically rebase and retarget.

```
# Merge the entire stack
# Click "Merge stack" on PR #1 (the base)
# All 4 PRs land at once ✅

# Or merge individual layers
# Merge PR #1 → PR #2 auto-retargets to main
# Merge PR #2 → PR #3 auto-retargets to main
```

## Using Stack with Coding Agents

GitHub Stacked PRs also works with coding agents like GitHub Copilot using the `gh-stack` skill:

```
# Agent-assisted stack creation
gh copilot explain "Create a stack of 3 PRs: add database schema, add migration, add seed data"
```

This is especially useful when paired with AI coding tools that generate speculative changes across multiple layers.

## Best Practices

### 1. Keep Layers Small and Focused
Each PR should represent exactly one logical change. If a PR needs a description of "Part 1 of N", it's too big.

### 2. Maintain a Clean Stack DAG
The stack forms a directed acyclic graph. Make sure each PR only depends on the layer immediately below it. Avoid cross-stack dependencies.

### 3. Use Meaningful PR Titles
Since reviewers see the stack map, titles should clearly describe each layer:

```
✅ Good: "Add database migration for user profiles"
✅ Good: "Implement user profile API endpoints"  
❌ Bad:  "More changes"
❌ Bad:  "Fix stuff"
```

### 4. Rebase Before Merging
Always rebase the stack on `main` before merging, especially if the stack has been open for a while:

```bash
git fetch origin main
git rebase origin/main add-search-tests
```

The `gh-stack` extension includes tools to help with this.

### 5. Use Branch Protections
Required checks and branch protections still apply to each layer. Configure merge queue support for stacked PRs (rolling out progressively).

## Real-World Adoption

Major engineering teams are already adopting stacked PRs:

- **Vercel**: Used stacked PRs for Next.js development during the preview. Smaller individual changes while shipping larger features.
- **TED**: Solved the "AI productivity bottleneck" — AI tools made developers faster at generating code, but PRs grew too large. Stacked PRs brought review time back down.
- **WHOOP**: "A big change used to mean one giant PR nobody wanted to review. Now it's a stack of small ones reviewers can actually follow."

## Comparison with Traditional Git Workflow

| Aspect | Traditional PR | Stacked PR |
|--------|---------------|------------|
| PR size | 500-2000+ lines | 50-200 lines per layer |
| Review time | 2-5 days for large PRs | 2-4 hours per small PR |
| Parallel review | Not possible | Multiple reviewers in parallel |
| Merge | Single PR merge | One-click stack merge |
| Rebase effort | Manual, error-prone | Automatic on partial merge |
| CI resource | One big CI run | Parallel CI per layer |

## Getting Started Today

Stacked pull requests are rolling out in public preview to all repositories over the coming days. To get started:

1. **Install the extension**: `gh extension install github/gh-stack`
2. **Read the docs**: [gh.io/stacks](https://gh.io/stacks)
3. **Give feedback**: [stacks discussion](https://gh.io/stacks-feedback)
4. **Enable merge queue**: Configure merge queue support for the smoothest experience

## Conclusion

GitHub Stacked PRs represents a fundamental improvement to how teams collaborate on large changes. By breaking work into small, independently reviewable layers, teams can maintain code quality while shipping faster. The public preview is available now — try it on your next feature branch.

The feature is particularly well-suited for teams where AI coding tools have increased code generation velocity. When PRs were the bottleneck, stacked PRs remove that bottleneck by keeping every individual change small enough for focused human review.
