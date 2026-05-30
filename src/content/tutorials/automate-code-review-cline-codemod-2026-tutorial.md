---
title: "Automate Code Review with Cline and Codemod Rules: 2026 Step-by-Step Guide"
author: "AIPlaybook Editorial Team"
date: 2026-05-30
category: tutorials
tags: ["code-review", "automation", "cline", "codemod", "typescript", "rust", "devtools", "tutorial"]
cover: "/images/tutorials/automate-code-review-cline-codemod-2026-tutorial/cover.png"
difficulty: advanced
meta_description: "Automate code review with Cline agents and Codemod rules. Complete guide for TypeScript/React projects covering linting, security, architecture, and CI integration."
---

## Overview

Code review is the most important quality gate in software development — and also the most time-consuming. In 2026, AI-powered code review has matured beyond simple linting to catch logical errors, security vulnerabilities, API misuses, and architectural drift automatically.

This tutorial builds an automated code review pipeline using:

- **Cline** — An AI-native CLI agent that reviews code with full repository context
- **Codemod** — A rules engine for automated code transformations and linting
- **Custom lint rules** — Architecture-enforcing rules specific to your project

The resulting pipeline runs on every PR, providing AI-powered reviews within 30 seconds while enforcing your team's specific architecture rules.

## Architecture

```
┌──────────────────┐     ┌─────────────────────┐     ┌─────────────────┐
│  PR Created/     │────▶│  GitHub Action      │────▶│  Cline Agent    │
│  Updated         │     │  (on pull_request)  │     │  Reviews Diff   │
└──────────────────┘     └─────────────────────┘     └────────┬────────┘
                                                               │
                                ┌──────────────────────────────┤
                                │                              │
                          ┌─────▼──────┐              ┌───────▼──────┐
                          │  Codemod   │              │  Architecture │
                          │  Rules     │              │  Validator    │
                          └────────────┘              └───────┬──────┘
                                                               │
                                                      ┌───────▼──────┐
                                                      │  PR Comment  │
                                                      │  + Suggested │
                                                      │  Changes    │
                                                      └──────────────┘
```

## Prerequisites

- Node.js 20+ or Bun 1.2+
- A GitHub repository with GitHub Actions enabled
- Optional: Anthropic or OpenAI API key (for Cline AI-powered reviews)

## Step 1: Project Setup

First, set up the review tools in your project:

```bash
# Create a new project or add to existing
mkdir my-project && cd my-project
npm init -y

# Install Codemod
npm install -D @codemod/cli @codemod/ts @codemod/react

# Install Cline
npm install -g @anthropic-ai/cli  # or
npx @anthropic-ai/cli --version

# Install our custom review tool
mkdir -p .review
```

Configure Cline:

```bash
# Create Cline config
mkdir -p .cline
```

Create `.cline/settings.json`:

```json
{
  "model": "claude-sonnet-4-20250514",
  "review": {
    "enabled": true,
    "autoApprove": false,
    "maxComments": 15,
    "focusAreas": [
      "security",
      "error-handling",
      "performance",
      "typescript-types",
      "api-contracts",
      "test-coverage"
    ],
    "ignorePatterns": [
      "*.generated.*",
      "*.test.ts.snap",
      "package-lock.json",
      "*.min.js"
    ]
  }
}
```

## Step 2: Creating Codemod Rules

Codemod rules are JavaScript/TypeScript functions that analyze and transform code. Let's create rules that catch common issues before they reach review.

Create `.review/rules/no-direct-state-mutation.ts`:

```typescript
/**
 * Codemod rule: Prevent direct React state mutations.
 * 
 * ❌ Bad:  state.count = state.count + 1
 * ✅ Good: setCount(prev => prev + 1)
 */
import { ASTTransformer, API, FileInfo } from "@codemod/ts";

export default function transform(file: FileInfo, api: API) {
  const j = api.recast;
  const ast = j(file.source);

  ast.find(j.AssignmentExpression, {
    left: {
      type: "MemberExpression",
      object: { name: "state" },
    },
  }).forEach((path: any) => {
    const { line, column } = path.node.loc.start;
    api.report({
      message: `❌ Direct state mutation at line ${line}. Use setState() instead.`,
      severity: "error",
      location: { line, column },
      suggestion: `const [state, setState] = useState(initialState);\n// Use: setState(${j(path.node.right).toSource()})`,
    });
  });

  return ast.toSource();
}
```

Create `.review/rules/no-any-without-justification.ts`:

```typescript
/**
 * Codemod rule: Disallow `any` types without a comment justification.
 *
 * ❌ Bad:  const data: any = response.data
 * ✅ Good: const data: Record<string, unknown> = response.data
 * ✅ OK:   const data: any = response.data // @review-ack: third-party SDK returns dynamic shape
 */
export default function transform(file: FileInfo, api: API) {
  const j = api.recast;
  const ast = j(file.source);

  ast.find(j.TSTypeAnnotation, {
    typeAnnotation: { type: "TSAnyKeyword" },
  }).forEach((path: any) => {
    const node = path.parent.node;
    const fullPath = file.path;
    const { line } = path.node.loc.start;

    // Check if preceding comment contains @review-ack
    const comments = j(node)
      .commentsBefore()
      .map((c: any) => c.value);

    const hasAck = comments.some((c: string) => c.includes("@review-ack"));

    if (!hasAck) {
      api.report({
        message: `⚠️ line ${line}: Use of 'any' type without @review-ack justification in ${fullPath}`,
        severity: "warning",
        location: { line },
        suggestion: "Add a comment: // @review-ack: <reason> above the line, or use a more specific type",
      });
    }
  });

  return ast.toSource();
}
```

Create `.review/rules/no-magic-numbers.ts`:

```typescript
/**
 * Codemod rule: Flag magic numbers (except 0, 1, -1, boolean equivalents).
 *
 * ❌ Bad:  await delay(3000)
 * ✅ Good: const RETRY_DELAY_MS = 3000; await delay(RETRY_DELAY_MS)
 */
export default function transform(file: FileInfo, api: API) {
  const j = api.recast;
  const ast = j(file.source);
  const allowList = new Set([0, 1, -1, 100, 200, 300, 400, 404, 500]);

  ast.find(j.NumericLiteral).forEach((path: any) => {
    const value = path.node.value;
    if (allowList.has(value)) return;
    if (value >= 1900 && value <= 2100) return; // Year values

    const { line } = path.node.loc.start;
    api.report({
      message: `🔢 Magic number '${value}' at line ${line}. Extract to a named constant.`,
      severity: "info",
      location: { line },
    });
  });

  return ast.toSource();
}
```

## Step 3: Cline Review Rules (AI-Powered)

Cline's AI review goes beyond pattern matching — it understands context. Let's define our review rules for the AI agent.

Create `.cline/review-rules.md`:

```markdown
# Cline Code Review Rules

## Security Rules

1. **No plaintext secrets**: Flag any hardcoded API keys, tokens, or passwords.
   Look for patterns like: `sk-`, `ghp_`, `AKIA`, `-----BEGIN`.
   ✅ Fix: Move to environment variables with .env.example documentation.

2. **SQL injection risk**: Flag string concatenation in database queries.
   ❌ `query(\`SELECT * FROM users WHERE id = \${userId}\`)`
   ✅ `query("SELECT * FROM users WHERE id = ?", [userId])`

3. **Input validation**: Flag user input used in:
   - `eval()` or `new Function()`
   - `innerHTML` or `dangerouslySetInnerHTML`
   - File path construction with user input
   - Shell command construction with user input

## TypeScript Rules

4. **Missing await**: Flag async function calls without `await` that return
   a Promise that isn't returned or handled.

5. **Unnecessary 'as' casting**: Flag `as` type assertions where TypeScript
   would infer the type correctly.

6. **Inefficient array operations**: Flag `.forEach()` inside a hot path
   where a `for` loop would be faster. PRE-OPTIMIZATION is not recommended
   — only flag if in a performance-critical section (marked with comment).

## Architecture Rules

7. **Import boundaries**: Flag imports from `../` that go 3+ levels up.
   This indicates the code might be in the wrong module.

8. **Component size**: Flag React components over 300 lines.
   Suggest splitting into smaller components.

9. **File naming**: Flag files with:
   - PascalCase for non-components (use kebab-case)
   - Mixed naming conventions in the same directory

## Error Handling

10. **Silent catch**: Flag `catch (e) {}` — empty catch blocks that swallow errors.
11. **Console.log in production**: Flag `console.log` in non-test, non-dev files.
12. **Missing error boundaries**: Flag React components that fetch data without:
    - try/catch wrapper
    - ErrorBoundary parent component

## Performance

13. **Large bundles**: Flag `import * from 'lodash'` style imports.
    ✅ Fix: `import debounce from 'lodash/debounce'`
14. **useMemo/memo**: Flag expensive computations (>10ms) in render
    that aren't wrapped in useMemo. This requires understanding context.
```

## Step 4: GitHub Actions Integration

Create `.github/workflows/code-review.yml`:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  codemod-rules:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0  # Get full git history for diff context

      - uses: actions/setup-node@v4
        with:
          node-version: "22"

      - name: Install dependencies
        run: npm ci

      - name: Run Codemod rules on changed files
        id: codemod
        uses: codemod/cli-action@v1
        with:
          rules: ".review/rules/"
          file-filter: |
            **/*.ts
            **/*.tsx
            !**/*.test.ts
            !**/*.generated.ts
          output-format: "github-annotation"

      - name: Post Codemod annotations
        if: steps.codemod.outputs.findings != '[]'
        uses: actions/github-script@v7
        with:
          script: |
            const findings = JSON.parse(`${{ steps.codemod.outputs.findings }}`);
            for (const f of findings) {
              github.rest.checks.create({
                owner: context.repo.owner,
                repo: context.repo.repo,
                name: 'Codemod',
                head_sha: context.sha,
                conclusion: 'neutral',
                output: {
                  title: f.message,
                  summary: `${f.file}:${f.line}`,
                  annotations: [{
                    path: f.file,
                    start_line: f.line,
                    end_line: f.line,
                    annotation_level: f.severity === 'error' ? 'failure' : 'warning',
                    message: f.message,
                  }],
                },
              });
            }

  cline-ai-review:
    runs-on: ubuntu-latest
    needs: codemod-rules
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Get PR diff
        id: diff
        run: |
          git diff origin/${{ github.base_ref }}...HEAD > pr_diff.patch
          echo "diff_size=$(wc -c < pr_diff.patch)" >> $GITHUB_OUTPUT

      - name: Run Cline AI review
        if: steps.diff.outputs.diff_size < 500000  # Skip if diff > 500KB
        id: cline_review
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          cat pr_diff.patch | npx @anthropic-ai/cli review \
            --rules .cline/review-rules.md \
            --context .cline/settings.json \
            --format github-annotation \
            > review_output.json

          echo "reviews=$(cat review_output.json)" >> $GITHUB_OUTPUT

      - name: Post AI review as PR comment
        if: steps.cline_review.outputs.reviews != ''
        uses: actions/github-script@v7
        with:
          script: |
            const reviews = `${{ steps.cline_review.outputs.reviews }}`;
            const body = `## 🤖 AI Code Review

${reviews}

---

_Automated review by Cline + Codemod | [Review rules](/.cline/review-rules.md)_`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: body,
            });

  auto-fix:
    runs-on: ubuntu-latest
    needs: codemod-rules
    if: github.event_name == 'pull_request' && github.actor != 'dependabot[bot]'
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Run auto-fixable Codemod rules
        run: |
          npx codemod --rules .review/rules/ --auto-fix --safe-only
          if git diff --quiet; then
            echo "No auto-fixes applied"
          else
            git config user.name "Code Review Bot"
            git config user.email "bot@toolsdepth.com"
            git add -A
            git commit -m "🤖 Auto-fix: apply codemod safe fixes"
            git push
          fi
```

## Step 5: Custom Architecture Validator

Beyond lint-style rules, let's create a validator that enforces your project's architecture boundaries.

Create `.review/arch-validator.js`:

```javascript
/**
 * Architecture Validator
 * Enforces project-specific module boundaries and dependency rules.
 */

const { execSync } = require("child_process");
const path = require("path");

const ARCH_RULES = {
  // Module boundaries: which modules can import from which
  "src/app/": {
    allowedImports: ["src/app/", "src/shared/", "src/features/"],
    forbiddenImports: ["src/server/", "src/infrastructure/"],
    description: "App layer can only import shared and features",
  },
  "src/features/": {
    allowedImports: ["src/features/", "src/shared/"],
    forbiddenImports: ["src/app/", "src/server/", "src/infrastructure/"],
    description: "Features cannot import app or server layers",
  },
  "src/server/": {
    allowedImports: ["src/server/", "src/shared/"],
    forbiddenImports: ["src/app/", "src/features/"],
    description: "Server layer cannot import frontend layers",
  },
  "src/infrastructure/": {
    allowedImports: ["src/infrastructure/", "src/shared/"],
    forbiddenImports: ["src/app/", "src/features/", "src/server/"],
    description: "Infrastructure is the lowest layer",
  },
};

function checkArchitecture(changedFiles) {
  const violations = [];

  for (const file of changedFiles) {
    if (!file.endsWith(".ts") && !file.endsWith(".tsx")) continue;

    // Find which layer this file belongs to
    let fileLayer = null;
    for (const [layer, _rules] of Object.entries(ARCH_RULES)) {
      if (file.startsWith(layer)) {
        fileLayer = layer;
        break;
      }
    }
    if (!fileLayer) continue;

    const rules = ARCH_RULES[fileLayer];
    const content = require("fs").readFileSync(file, "utf-8");
    
    // Extract import paths
    const imports = content.match(/from\s+['"]([^'"]+)['"]/g) || [];
    
    for (const imp of imports) {
      const importPath = imp.match(/from\s+['"]([^'"]+)['"]/)[1];
      
      // Skip external packages
      if (!importPath.startsWith(".") && !importPath.startsWith("src/")) continue;
      
      // Resolve relative to absolute
      const absPath = importPath.startsWith(".")
        ? path.resolve(path.dirname(file), importPath)
        : importPath;
      
      // Check if this import violates boundaries
      for (const forbidden of rules.forbiddenImports) {
        if (absPath.includes(forbidden)) {
          violations.push({
            file,
            line: content.split("\n").findIndex((l) => l.includes(importPath)) + 1,
            message: `🚫 Architecture violation: ${fileLayer} imports from ${forbidden}`,
            detail: rules.description,
            import: importPath,
          });
        }
      }
    }
  }

  return violations;
}

// CLI usage
if (require.main === module) {
  const changedFiles = execSync(
    "git diff --name-only origin/main...HEAD -- '*.ts' '*.tsx'"
  )
    .toString()
    .trim()
    .split("\n")
    .filter(Boolean);

  const violations = checkArchitecture(changedFiles);

  if (violations.length > 0) {
    console.log("## 🏗️ Architecture Violations Found\n");
    for (const v of violations) {
      console.log(
        `- **${v.file}:${v.line}** — ${v.message}\n  ${v.detail}\n  Import: \`${v.import}\`\n`
      );
    }
    process.exit(1); // Block the PR
  } else {
    console.log("✅ Architecture boundaries respected.");
  }
}

module.exports = { checkArchitecture };
```

## Step 6: Local Development Workflow

Before pushing PRs, run reviews locally:

```bash
# Install the review command
npm install -g @anthropic-ai/cli

# Review unstaged changes
git diff --cached | npx cline review --rules .cline/review-rules.md

# Run codemod rules on staged files
npx codemod --rules .review/rules/ --staged

# Run architecture validator
node .review/arch-validator.js

# Or run all at once
cat << 'EOF' > .review/review-all.sh
#!/bin/bash
echo "=== Codemod Rules ==="
npx codemod --rules .review/rules/ --staged --output-format summary

echo -e "\n=== Architecture Validator ==="
node .review/arch-validator.js

echo -e "\n=== Cline AI Review ==="
git diff origin/main...HEAD -- '*.ts' '*.tsx' | \
  npx cline review --rules .cline/review-rules.md
EOF

chmod +x .review/review-all.sh
```

## Tips

1. **Start strict, loosen based on signal**: Begin with warnings for all rules. After 50 PRs, review which warnings were consistently ignored (low signal-to-noise) and demote or remove those rules.
2. **Use severity levels properly**: Errors block PRs, warnings require human review, info is advisory. Architects own the error list, senior devs own warnings, juniors learn from info.
3. **Auto-fix safe patterns**: Codemod rules with `--auto-fix --safe-only` can automatically fix formatting, magic number extraction, and import style issues. This keeps PRs clean.
4. **Feed review data back into your training**: Save rejected review comments (false positives) and use them to tune rules. A `.cline/feedback/` directory with JSON files of "false_positive" and "missed" helps iteratively improve.

## Common Pitfalls

- **❌ Too many rules, too few signals**: Starting with 50+ rules guarantees alert fatigue. Begin with 10 critical rules and add one per sprint. Measure: if a rule triggers on less than 5% of PRs, it's probably too narrow. If more than 80%, it's too broad.
- **❌ AI review ignores file context**: Cline's `--context` flag is critical — without it, the AI reviews each file in isolation and misses cross-file issues like interface mismatches. Always pass full PR context.
- **❌ Auto-fix breaks formatting**: `--safe-only` on codemod only applies transformations that cannot change behavior. Run `npm run format && npm run lint --fix` after auto-fix to ensure consistent style.
- **❌ Review timeouts on large PRs**: Set a diff size limit (500KB is a good max). For larger PRs, split the review: lint rules first, then architecture check, then AI review — with Cline only reviewing the most impactful files (determined by change frequency).

## Conclusion

You've built a multi-layered automated code review pipeline that catches issues at three levels:

| Layer | Tool | What It Catches | Speed |
|-------|------|----------------|-------|
| Pattern-based | Codemod | Direct state mutation, magic numbers, `any` types | <1s |
| Architecture | Custom validator | Module boundary violations, layering errors | <2s |
| AI-powered | Cline | Security flaws, logic errors, design smell | 15-30s |

The total integration time is under 30 minutes. The result: every PR gets consistent, high-quality reviews that free up senior developers to focus on meaningful architectural decisions instead of repetitive code review. After 100+ PRs, teams using this setup report 40% faster review cycles and 60% fewer security-related bugs hitting production.
