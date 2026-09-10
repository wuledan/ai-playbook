---
title: "browser-use-pi Review 2026 — A Web Agent That Writes JavaScript Instead of Calling Tools"
date: 2026-09-11
author: "AIPlaybook Editorial Team"
category: "Development"
tags:
  - "browser-use-pi"
  - "browser-use"
  - "browser-automation"
  - "TypeScript"
  - "CDP"
  - "Pi-Mono"
  - "web-agent"
  - "Agent-SDK"
  - "OpenRouter"
  - "Developer-Tools"
cover: "/images/reviews/browser-use-pi-review-2026/cover.png"
meta_description: "browser-use-pi (created September 5, 2026, MIT, 265 stars) is the browser-use team's TypeScript web agent built on Pi Mono, a persistent V8 REPL and raw Chrome DevTools Protocol. This review covers the write-JavaScript-not-tool-calls design, the BrowserUse create/run/followUp API, typed results via TypeBox schemas, sessions with saved logins and cloud browsers, the blocking beforeToolCall hook, the repo's own refused-to-spin benchmark table, telemetry defaults, and the honest limits: two API keys, cloud recommended, macOS-only runtime checks, hooks that are not a sandbox."
rating: 7.1
dimensions:
  ease-of-use: 6
  features: 8.5
  value: 7
  performance: 7.5
  ecosystem: 7
pros:
  - "The core idea is a real departure from tool-call web agents: instead of a fixed vocabulary of click, type and extract, the agent writes JavaScript into a persistent V8 REPL that talks to Chrome over raw CDP, and builds the helpers it needs as it goes — so a task that needs a loop, a data reshape or a page-side utility is a few lines of code rather than a missing tool"
  - "It comes from the team behind browser-use, and the SDK surface is the mature part: BrowserUse.create, agent.run and agent.followUp, with typed results via Type schemas, streaming events through an async iterator, and hooks — beforeToolCall, afterToolCall, validateResult — that can block a call, correct an answer, or stop a purchase before it happens"
  - "Sessions and persistence are first-class rather than bolted on: follow-ups continue the same session, saved logins and profile directories carry over, the workspace holds files the agent can read and write, and the session history format is shared with the earlier @browser_use/js package, so the rename is a migration, not a rewrite"
  - "Control over cost and failure is unusually explicit: maxSteps, timeoutMs, maxCostUsd, compaction and maxContextChars are per-run options, and every result carries a status that says exactly why it stopped — max_steps, timeout, cancelled, cost_limit, context_limit, incomplete, error — with partial work preserved and delivered rather than thrown away"
  - "The benchmark page is the most credible thing in the repository: it publishes historical Hard and V2 scores across specific commit SHAs (91 on Hard being flagged as an unstable peak, with later repeats at 79, 85 and 84), states plainly that the table 'does not establish causality, a matched BrowserCode advantage, or SOTA', and specifies the freeze-the-SHA-and-task-IDs protocol you would need to make a performance claim"
  - "Because the agent's actions are JavaScript in a worker, the 'show the work' story is strong: interaction highlights, session recordings and GIF exports are built in, and log: 'json' or 'pretty' gives a readable or machine-parseable trace of the run"
cons:
  - "It is a paid-infrastructure SDK in practice: you need an OPENROUTER_API_KEY for the model and a BROWSER_USE_API_KEY for the cloud browser, and the quickstart leans on Browser Use Cloud ('no local Chrome installation needed'). Local Chrome is supported, but the default happy path assumes a hosted browser you pay for"
  - "Telemetry is on by default — anonymous run counters, disableable with telemetry: false or DO_NOT_TRACK=1 — which is a small but real thing to know before wiring it into a product's build or a regulated environment"
  - "The worker that runs the agent's JavaScript has filesystem and network access, and the docs say to use an isolated machine for untrusted tasks; the hooks are described as application controls, not a sandbox, because arbitrary JavaScript can call CDP directly — so the programmability that is the selling point is also the thing you have to contain yourself"
  - "Platform support is honest but narrow: runtime checks cover macOS, Windows is described as unverified, and Bun hosts also need Node on PATH because the persistent worker uses Node's V8 inspector. The SDK needs a Node process and a filesystem, so it does not run inside Cloudflare Workers even with a remote browser"
  - "There are no tagged releases at review time, the docs live in a VitePress tree that is still being built out, and some examples need extra setup — the evaluated benchmark numbers are explicitly historical and, per the repo, are not scores for the current candidate, so there is little public evidence yet of how the current SDK performs"
  - "Model support inherits Pi's catalog and transports and, by the project's own note, provider access and model capabilities vary — so the 'one SDK you can put in your app' claim leans on upstream Pi for a big part of its reliability"
best-for: "Engineering teams building a web agent into their own product, rather than running a CLI, who want programmability over a fixed tool list — where writing a JavaScript helper for an awkward page is preferable to waiting for a new primitive, and where typed results, sessions with saved logins, cost caps and a stop-reason on every run are the features that matter. Also a good fit for teams already using browser-use's other tooling and wanting the TypeScript SDK underneath their app."
price: "The SDK is free and open source (MIT) — npm install @browser_use/pi, runnable on Node 22.19+ or Bun 1.3.14+ (Bun also needs Node for the V8 worker). Real cost comes from the services it drives: an OpenRouter API key for the model and a Browser Use Cloud key for the hosted browser in the quickstart, plus whatever those consume per run. Local Chrome is supported as an alternative to the cloud browser. Anonymous telemetry is on by default and can be turned off; there is no per-seat licence."
---

## The Pitch: Give the Agent a JavaScript Console, Not a Tool Belt

browser-use-pi, released September 5, 2026 under MIT by the team behind browser-use, is a TypeScript SDK built on a simple but consequential bet. Most web agents are handed a fixed set of primitives — click, type, scroll, extract — and then asked to compose a real task out of them, which is why they stall the moment a page needs a loop, a reshape or a small page-side utility that nobody thought to expose as a tool. browser-use-pi instead gives the agent a persistent V8 REPL and raw Chrome DevTools Protocol access, and lets it write the JavaScript it needs to get the job done.

The pipeline in the README is the whole design in one line: your task goes to Pi Mono (the model loop from upstream Pi), which drives a persistent V8 REPL, which talks to Chrome over raw CDP, with the accessibility tree and screenshots flowing back as feedback. The project's own one-sentence summary is that it offers "the programmability of Browser Harness, with sessions, saved logins, streaming and typed results" — and packages it as an SDK you can `import` into your own application rather than a CLI you babysit.

It is a migration as much as a launch: the package is `@browser_use/pi`, renamed from `@browser_use/js`, and the `BrowserUse` API, browser options, environment variables, profile directories and session history format are unchanged. Existing data is neither migrated nor deleted; the earlier package stays available.

![The Browser Use homepage — agents and browser infrastructure, the company behind the browser-use-pi TypeScript SDK](/images/reviews/browser-use-pi-review-2026/homepage.png "browser-use.com — the hosted browser and agent infrastructure the SDK's quickstart leans on")

## The API: Small Surface, Real Control

The whole quickstart is a handful of lines. `BrowserUse.create({ model, browser, workspace })` opens one session; `agent.run('…')` returns a result; `agent.followUp('…')` continues it; `agent.close()` ends it. Browser choice is a single call — `Browser.cloud({ apiKey })` for the hosted browser, or local Chrome — and a workspace directory gives the agent somewhere to keep files it writes.

Underneath that small surface is a lot of deliberate engineering. Results are typed: pass a TypeBox schema to `run` and the result is validated against it, with `validateResult(output, signal)` able to reject an answer and hand corrective feedback back — while the docs are careful to note that schema validation checks shape and "does not make unsupported facts true". Every run carries a status that names the stop reason — `completed`, `max_steps`, `timeout`, `cancelled`, `cost_limit`, `context_limit`, `incomplete`, `error` — and the agent is instructed to publish useful work as it goes, so when a limit is reached you keep the partial result instead of a stack trace. The control knobs are per-run and explicit: `maxSteps` (default 40), `timeoutMs` (default 300,000), `maxCostUsd` (no cap by default, soft when set), plus compaction and a context-character ceiling.

Streaming is built in. `log: 'pretty'` prints readable progress, `log: 'json'` prints JSON, and `agent.events()` is an async iterator you subscribe to before running; `onEvent` is awaited and applies backpressure while `observe` is best-effort and may coalesce under load. The hooks — `beforeToolCall`, `afterToolCall`, `validateResult` — are the app-level guardrail, and the README's example is the one that matters: return `{ block: true, reason: 'Needs review' }` when the tool call is a purchase.

## Sessions, Automation, and the Cost Cap

Sessions are the part that makes this usable inside a product rather than a notebook. Follow-ups, saved logins, persistent workspaces, and a choice between cloud browsers or your own Chrome are all first-class; the workspace keeps files the agent writes, and saved observations survive compaction, which summarises older context but never replays browser actions. Recovery after a failure resets the worker rather than assuming the page state is intact — the correct, if less magical, choice.

Cost control deserves a specific mention because it is where most agent SDKs hand-wave. `maxCostUsd` is a soft cap checked between turns, and the docs say plainly it can overshoot by one response; the last allowed turn is reserved for delivery when `maxSteps >= 2`, and near the time or cost limit the next turn becomes delivery-only, so no extra model call runs after the limit. The pattern the docs recommend — read `result.partial?.value ?? result.text` when the status is not `completed` — is the difference between an agent that fails usefully and one that fails blankly.

## The Benchmark Page Is the Best Page in the Repo

Most agent projects bury their evals in a marketing chart. browser-use-pi's `docs/benchmarks.md` opens by refusing to do that: the runs "predate the simplified helper surface" and "are not scores for the current candidate." What follows is a table of SDK revisions against a Hard suite of 106 tasks with GPT-5.5 medium, and a V2 suite scored out of 100 on a stronger model, with recorded agent-inference costs that climb from $10.99 to $20.25 across revisions. The 91-on-Hard result is explicitly called out as an unstable peak whose later original-code repeats scored 79, 85 and 84. The prose then states that the table "does not establish causality, a matched BrowserCode advantage, or SOTA," and tells you the protocol you would need to make a performance claim: freeze the SDK SHA, the task IDs, the model, the reasoning level, the budgets, the judge, the environment and the retries, then run matched arms and inspect failures.

For a six-day-old repository, that is a remarkable amount of epistemic hygiene — and it is the reason to trust the parts the project does claim, like the structured stop reasons and the cost cap, more than you might otherwise.

## Honest Limits

The limits are real and mostly self-reported. In practice this is a paid-infrastructure SDK: the quickstart needs an OpenRouter key and a Browser Use Cloud key, and while local Chrome is supported, the documented happy path assumes a hosted browser you pay for. Telemetry is on by default (anonymous run counters), disableable with `telemetry: false` or `DO_NOT_TRACK=1` — worth knowing before it lands in a build pipeline. The JavaScript worker has filesystem and network access, and the docs say to use an isolated machine for untrusted tasks; the hooks are application controls, not a sandbox, because arbitrary JavaScript can still call CDP directly. Platform coverage is macOS-verified with Windows unverified, Bun needs Node on PATH for the V8 worker, and the SDK needs a Node process and a filesystem — so no Cloudflare Workers, even with a remote browser. There are no tagged releases yet, and by the project's own admission the public benchmark numbers are historical rather than current.

## Who Should Care

browser-use-pi is for teams building a web agent into their own application who would rather give the model a JavaScript console than wait for a tool to be added — and who value a typed result, a session with saved logins, a cost cap and an honest stop reason over a friendlier demo. If you just want to script a browser, the older browser-use CLI and Playwright remain simpler and cheaper; if you need semantic recall, look elsewhere. At 7.1/10 it clears Silver-plus on the strength of a genuinely different and well-built design, an API that respects cost and failure, and a benchmark page that argues against its own hype. The deductions are the two keys and the cloud default, macOS-only verification, and a programmability that is also, unavoidably, your responsibility to contain.
