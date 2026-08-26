---
title: "doop Review 2026 — The Open-Source Multiplayer Canvas Where Humans and AI Agents Design Together"
date: 2026-08-27
author: "AIPlaybook Editorial Team"
category: "Design"
tags:
  - "doop"
  - "Paper.design"
  - "MCP"
  - "Claude-Code"
  - "AI-Agents"
  - "Design-Tool"
  - "Multiplayer"
  - "Canvas"
  - "Open-Source"
  - "Self-Hosted"
cover: /images/reviews/doop-review-2026/cover.png
meta_description: "doop is an open-source alternative to Paper.design: a multiplayer design canvas where humans and AI agents design together live, with a built-in MCP server, streaming frame edits, design memory and a server-side Doop Agent. We review the canvas model, the 16 MCP tools, the typewriter reveal, the distiller, and what self-hosting an agentic design tool really takes."
rating: 7.7
dimensions:
  ease-of-use: 7
  features: 8.5
  value: 8
  performance: 7.5
  ecosystem: 7
pros:
  - "The core model is genuinely new for open source: a real multiplayer canvas (live cursors, presence, per-frame editing indicators, activity feed) where AI agents edit the same frames as humans through a built-in MCP server — not a prompt-and-refresh tool"
  - "Frames render real HTML in sandboxed iframes with DOM-morphing updates, so streaming agent edits and human edits never white-flash the frame; changed scripts re-execute while unchanged styles and fonts are untouched"
  - "The MCP surface is complete and well-designed: 16 tools including get_guide, set_status, get_feedback, create_frame, append_frame_html (streaming), edit_frame_html, and get_frame_screenshot so agents can see and iterate on their own designs"
  - "Server-side typewriter reveal smooths even one-shot HTML into a live stream, with healing that drops trailing half-written tags, cuts unclosed scripts, and closes unclosed style tags so content paints instead of blanking"
  - "A built-in Doop Agent with specialist roles (UX, copy, brand, accessibility) picks up queued cards and @mentions autonomously, and free-tier tasks are paid by the server's own key before users connect their own model account"
  - "Private by default with agents inheriting exactly their human's access; design memory pins exemplar frames and a distiller proposes durable style rules every agent follows"
cons:
  - "AGPL-3.0 copyleft plus trademark restrictions on the name — fine for self-hosting, but anyone building a commercial service on it must publish their changes under the same license and rebrand"
  - "The ChatGPT-subscription connection path exists but the README itself warns it is not sanctioned by OpenAI's terms and heavy use can get an account rate-limited or suspended — the API-key path is the fully supported alternative"
  - "Doop Agent tasks beyond the free tier (RESIDENT_TASK_LIMIT=5 by default) require connecting a model account or your own MCP agent, so the 'watch an agent design' demo is scripted until you configure a key"
  - "The welcome performance is explicitly scripted (server/demo.ts replays a pre-authored frame through the same machinery real agents use) — a great onboarding trick, but it can mislead about what an unconfigured instance can do"
  - "Self-hosting production needs real Postgres, BETTER_AUTH_SECRET and SMTP; the embedded PGlite fallback is single-process and only suits one instance with a persistent volume"
  - "No public quantitative benchmark of agent design quality; the signal is a 400-star repo, a hosted cloud, and an active single-maintainer project four days old"
best-for: "Design teams and indie makers who want to watch AI agents design in the same space they work in — live multiplayer canvases with Claude Code or any MCP client, self-hosted for privacy, without paying for Paper.design or rebuilding an agent harness"
price: "Free (AGPL-3.0, self-host via docker compose or npm run dev; hosted cloud at doop.design)"
---

# doop Review 2026 — The Open-Source Multiplayer Canvas Where Humans and AI Agents Design Together

## Quick Verdict

**doop is the open-source alternative to Paper.design — a multiplayer design canvas for humans *and* AI agents, where every design lives on a shareable Canvas holding Frames that render real HTML in sandboxed iframes.** People edit in the browser; AI agents edit through the built-in MCP server, streaming their designs in live. Everyone sees everything as it happens: cursors, presence, frame edits, agent status, and an activity feed.

Created 2026-08-22 (AGPL-3.0, ~400 GitHub stars and 40 forks in four days), doop makes a specific bet: the right unit for agentic design is a **live canvas**, not a prompt-and-refresh loop. Connect Claude Code once (`claude mcp add --transport http doop http://localhost:4300/mcp`), and the agent works *as you* — creating frames, streaming HTML in ~300–500 character chunks, screenshotting its own work, and iterating — while you watch it happen next to your cursor.

It is not a design generator. It is an agentic design *workspace* with real multiplayer, and the strongest part is how carefully the plumbing is built: DOM-morphing frame updates, typewriter reveals with HTML healing, and an MCP tool surface designed around the agent's actual workflow loop.

## Features

### The canvas model

Each design lives on a shareable Canvas (`/c/<id>`) holding Frames — artboards that render real HTML in sandboxed iframes. The infinite canvas pans on wheel, zooms with `⌘`/ctrl + wheel, and tracks a dot grid. Frames drag to move, resize from a corner handle, and edit in a right-hand inspector with debounced live saves. Multiplayer is real: live cursors with name tags, presence avatars, per-frame "who's editing" indicators, colored flash when a remote actor changes a frame, drag positions streamed live, and auto-reconnect — all over one per-canvas WebSocket room.

Frame HTML renders in `<iframe sandbox="allow-scripts">` — scripts run, but with no same-origin access and no reach into the app. Updates are **DOM-morphed in place** (`src/lib/frameRuntime.ts`), so streaming ticks never white-flash the frame with a full document reload; changed scripts re-execute while unchanged styles and fonts are untouched.

### The MCP server: 16 tools for agentic design

The `/mcp` endpoint (streamable HTTP, stateless) is the heart of the agent story:

| Tool | What it does |
| --- | --- |
| `get_guide` | The agent playbook — loaded first |
| `set_status` | Broadcast "what I'm working on" live |
| `get_feedback` | Fetch and claim open human feedback |
| `list_canvases` / `create_canvas` | Canvas management |
| `get_canvas` | Frame layout: position/size/meta |
| `view_website` | Inspect a public page read-only (screenshot + text) |
| `import_webpage` | Import a URL as an editable HTML frame |
| `create_frame` / `get_frame` | Add/read frames with HTML |
| `get_frame_screenshot` | Render headlessly and return a PNG — agents *see* their work |
| `set_frame_html` | Replace a design in one shot |
| `append_frame_html` | **Stream** a design in chunks — viewers watch it build |
| `edit_frame_html` | Targeted find/replace — morphs in place |
| `update_frame` / `delete_frame` | Rename/move/resize; remove |

Mutating tools accept `agent_name`, so the agent appears in the presence stack, gets an editing ring and chip on the frame it touched, and its actions land in the activity feed. Agent-to-human ownership comes from the OAuth bearer token: the agent acts under the account that approved it.

### The typewriter reveal

Agent HTML lands in the store immediately, but viewers see it through a **server-side typewriter reveal**: the server broadcasts accumulated HTML at ~500 chars/s (accelerating to clear backlogs in ~8s), so even a one-shot `set_frame_html` plays back as a smooth live stream. Mid-reveal HTML is *healed* before broadcast — a trailing half-written tag is dropped, an unclosed `<script>` is cut (never run half-written JS), and an unclosed `<style>` is closed so content paints instead of blanking. Human edits bypass the reveal and cancel any open one — the human takes over.

### The Doop Agent and steering

doop ships a built-in design team with specialist roles — UX, copy, brand, accessibility — defined in `shared/agents.ts`. Queue a board card, `@mention` a role on an element comment, or leave feedback on a task, and it runs without a human in the loop. The server's own `ANTHROPIC_API_KEY` pays for the free tier (5 resident tasks per account by default); past that, users connect a ChatGPT subscription (Codex backend) or an OpenAI API key, and the agent keeps running on their account with their model tier choice (gpt-5.6-sol / terra / luna).

Steering happens at three layers: server `instructions` at MCP initialize; the `get_guide` deep playbook with mandatory review checkpoints; and **result nudges** — tool results tell the agent it hasn't *seen* its design yet and to call `get_frame_screenshot` before moving on. Feedback on tasks becomes open requests on the canvas, delivered via the next identified agent call with a `HUMAN FEEDBACK` block — picked up exactly once.

### Design memory and the distiller

Pin exemplar frames, capture decisions, and the **guideline distiller** (`server/distill.ts`, `claude-haiku-4-5` by default) proposes durable style rules that every agent follows thereafter — the closest thing to a persistent team taste that an agentic design tool has shipped.

## Pricing

Free and AGPL-3.0. Self-host with `docker compose up` (app + Postgres on :4400), or `npm run dev` with zero configuration — data persists to embedded Postgres (PGlite) in `data/pg`, and optional integrations (SMTP, stock photos, object storage, analytics) degrade gracefully until their env vars are set. Hosted cloud: **doop.design**. Agent inference is the only real cost: your own MCP agent bills through your existing subscription; the Doop Agent bills the server's key for the free tier and your connected account afterwards.

## Use Case: Watching Claude Code Design a Pricing Section

1. `npm run dev` boots the web app on :4300 and API/WebSocket/MCP on :4400 — everything works with no configuration.
2. `claude mcp add --transport http doop http://localhost:4300/mcp` triggers the standard MCP OAuth flow: a browser window opens, you approve, and the agent now works as you.
3. On your canvas, tell the agent: *"Work on canvas <id>. Call get_canvas to see the frames. Create a frame and stream the pricing section with append_frame_html in ~300–500 char chunks."*
4. You watch it happen live: presence avatar, "for Kai Moreno" attribution, the working strip, the task in the Agents panel, the pulsing border on the frame being built — and the typewriter reveal as the HTML streams in.
5. The agent calls `get_frame_screenshot`, sees its own work, fixes what looks wrong, and re-checks. You leave feedback ("make the accent warmer") with ↩; the next agent call delivers it as a HUMAN FEEDBACK block.

## Pros & Cons

**Pros:** a genuinely new open-source model — agentic design as live multiplayer rather than prompt-and-refresh; a complete, well-documented MCP tool surface; DOM-morphing frames with no white-flash; healing typewriter reveals; a built-in agent with roles and a free tier; design memory with a distiller; private-by-default sharing with agent access inheritance; one-command self-hosting.

**Cons:** AGPL-3.0 + trademark restrictions; the ChatGPT-subscription path is legally gray and explicitly warned against for real users; free agent tasks are a trial, not a balance; the welcome demo is scripted; production self-hosting needs Postgres + SMTP; no quantitative design-quality benchmark yet.

## Alternatives

| Approach | Multiplayer | Agents in-canvas | Open source | Self-host |
| --- | --- | --- | --- | --- |
| **doop** | Yes (cursors, presence, feed) | MCP server + built-in agent | AGPL-3.0 | Yes |
| **Paper.design** | Yes | Yes (proprietary) | No | No |
| **Figma AI** | Yes | Assistive, not agentic canvas edits | No | No |
| **Prompt-and-refresh generators** | No | Yes, but no live canvas | Varies | Varies |

doop's closest commercial reference is Paper.design itself — which is proprietary. For teams that want the agentic design loop *and* the source code and the privacy of self-hosting, doop is currently the only serious option.

## FAQ

**Do I need an Anthropic or OpenAI key to use doop?** No — everything works with zero configuration. The Doop Agent needs a key (server's own key for the free tier, then your connected model account), but agents you connect yourself over MCP authenticate via OAuth and use your existing subscription, never metered by doop.

**Is the ChatGPT-subscription connection safe?** The API-key path is the fully supported option. The README warns that driving a ChatGPT subscription from a third-party server is not sanctioned by OpenAI's terms and heavy use can get an account rate-limited or suspended; `CHATGPT_CONNECT_DISABLED=1` switches that path off entirely.

**What does AGPL-3.0 mean for me?** Use it, self-host it, modify it — but if you offer a modified version as a service, you must publish your changes under the same license. The doop name and logo are trademarks and require rebranding for derived services.

**Can agents see their own work?** Yes — `get_frame_screenshot` renders the frame headlessly and returns a PNG, and result nudges push the agent to call it before moving on. Humans can hit the same renderer at `/api/frames/:id/screenshot.png?scale=2`.
