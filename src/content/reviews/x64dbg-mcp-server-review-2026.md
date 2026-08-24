---
title: "x64dbg-MCP Server Review 2026 — Agentic Reverse Engineering in Zig, 84 MCP Tools, Zero Dependencies"
date: 2026-08-25
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "x64dbg"
  - "MCP"
  - "Reverse-Engineering"
  - "Zig"
  - "Debugger"
  - "Claude-Code"
  - "Codex"
  - "Agentic-RE"
  - "Open-Source"
  - "Review"
cover: /images/reviews/x64dbg-mcp-server-review-2026/cover.png
meta_description: "x64dbg-MCP Server is a native MCP plugin for the x64dbg debugger written in Zig: 84 MCP tools, 22 event callbacks, dual Streamable HTTP + SSE transport, mandatory bearer auth, and a single cross-compiled binary with zero dependencies. It rocketed to 1,209 stars in three days. We review what it can do — breakpoints, memory patching, OEP detection, tracing — and where agentic reverse engineering still hurts."
rating: 7.9
dimensions:
  ease-of-use: 7.5
  features: 9
  value: 8.5
  performance: 8
  ecosystem: 7
pros:
  - "84 MCP tools and 22 event callbacks cover essentially the full x64dbg workflow: breakpoints (INT3/hardware/conditional/memory/exception), disassembly, memory read/write/patch, registers, call stack, threads, modules, pattern scan, strings, xrefs, symbols, OEP detection, module dumping, SEH/PEB inspection, and tracing"
  - "Zero-dependency single binary written in Zig — no .NET, no Python, no runtime; x32 and x64 build from one codebase, and you can cross-compile Windows plugins from Linux, macOS, or WSL"
  - "Dual transport (Streamable HTTP + SSE, MCP 2024-11-05) keeps compatibility with both new and legacy MCP clients"
  - "Mandatory bearer auth with auto-generated token on first run — every request without a token gets 401; config dialog supports rotating the token and rebinding the port"
  - "Auto-start with x64dbg and a config dialog (Plugins menu) that persists to mcp_config.json — drops in with zero config friction"
  - "Active development: v1.0 (71 tools) → v1.1 (+12 tools to 84) shipped in two days, with long-poll WaitForEvent for HTTP-only clients"
cons:
  - "Windows-only target by nature (x64dbg is a Windows debugger) — the plugin itself is useless without x64dbg running on a Windows host, though you can develop against it from other OSes"
  - "Full debugger control over HTTP means the bearer token is a critical secret; any leak exposes read/write access to process memory of whatever you're debugging"
  - "SSE transport is marked 'legacy' — some older MCP clients may need configuration tweaks"
  - "No built-in sandboxing: an AI agent with these tools can patch memory, dump modules, and execute debugger commands on the target — mistakes are on you"
  - "Docs list '72 MCP tools' in one section while the header says 84 — version drift in the README after the v1.1 release"
  - "Requires Zig 0.16-dev to build from source, and x64dbg itself is a power-user tool with a learning curve"
best-for: "Malware analysts, CTF players, and reverse engineers who already live in x64dbg and want Claude Code, Codex, or any MCP client to drive the debugger — setting breakpoints, scanning for patterns, dumping modules, and walking call stacks conversationally"
price: "Free, open source (MIT), self-hosted — no paid tiers; v1.1 latest release"
---

## Quick Verdict

**x64dbg-MCP Server** is a native **Model Context Protocol (MCP) plugin for x64dbg** — the open-source Windows debugger — that exposes the debugger's full functionality over HTTP to any MCP-compatible AI assistant. Built entirely in **Zig**, it ships as a **zero-dependency single binary** with **84 MCP tools**, **22 event callbacks**, dual **Streamable HTTP + SSE** transport, and **mandatory bearer auth**.

The project exploded onto GitHub Trending: created **August 22, 2026**, it hit **1,209 stars and 122 forks within three days**, with v1.0 (71 tools) and v1.1 (+12 tools) shipping back-to-back. The pitch is a sentence: **agentic reverse engineering** — "MCP-powered agentic reverse engineering for x64dbg."

**The bottom line:** if you reverse-engineer Windows binaries in x64dbg, this is the most complete MCP bridge to a debugger that exists today. It's not a toy — the tool surface covers breakpoints, memory patching, pattern scanning, OEP detection, module dumping, SEH/PEB inspection, and tracing — and the auth story is more careful than most MCP servers you'll find. The caveats are the same ones that apply to any debugger-control MCP: it has full power over a live process, and the token is the only gate.

## What It Is

x64dbg-MCP Server plugs into x64dbg as a native plugin. Drop the plugin files into your x64dbg root, launch the debugger, and the MCP server **auto-starts** — no config file, no runtime, no Python:

- **x64** listens on `0.0.0.0:9094`
- **x32** listens on `0.0.0.0:9095`

A **bearer token is auto-generated on first run** and required on every request. Without it, all requests get `401 Unauthorized`. From the Plugins menu you can change the bind address, port, and rotate the token — changes take effect immediately (the server auto-restarts), and config persists to `mcp_config.json` next to the x64dbg executable.

Connecting an AI assistant is a standard MCP client config:

```json
{
  "mcpServers": {
    "x64dbg": {
      "type": "http",
      "url": "http://localhost:9094/",
      "headers": { "Authorization": "Bearer YOUR_TOKEN_HERE" }
    }
  }
}
```

## The Tool Surface: 84 MCP Tools

The tool list is the real story here. It's not a thin wrapper — it's a systematic port of the x64dbg workflow:

**Always available (no session needed):** `GetDebugState`, `LoadBinary`, `ExecuteDebuggerCommand` (run any x64dbg command), `ListCommandsByCategory`, `SearchForStrings`, `GetEventLog`, `ClearEventLog`, `EvalExpression`, `AttachProcess` (attach by PID), `Echo`, and `WaitForEvent` — a long-poll for debugger events added in v1.1 for HTTP-only clients that can't use SSE push.

**Session-required tools cover the debug loop:**

- **Breakpoints** — `SetBreakpoint` (INT3), `SetHardwareBreakpoint` (DR0-DR3, read/write/execute), `SetConditionalBreakpoint` (condition + optional log), `SetMemoryBreakpoint`, `SetExceptionBreakpoint` (break or ignore, first/second/all chance), plus enable/disable/toggle/delete/delete-all and hit-count reset
- **Execution** — `run` (F9), `StepInto` (F7), `StepOver` (F8), `StepOut` (Ctrl+F9), `PauseDebug` (F12), `StopDebug`, `RestartDebug`, `RunToAddress`, `TraceInto`/`TraceOver` (N instructions with address + disassembly recording)
- **Memory & registers** — `GetAllRegisters`, `SetRegister`, `ReadMemory` (hex dump), `WriteMemToAddress` (patch), `AllocateMemory`/`FreeMemory`, `GetMemoryMap`, `GetDumpableRegions`, `GetPatches`/`RestorePatches`, `Assemble` an instruction in place, `FollowPointer` (dereference N levels)
- **Analysis** — `Disassemble`/`DisassembleFunction`, `FindPattern` (byte patterns with `??` wildcards), `GetStrings` (ASCII extraction), `GetReferences` (CALL/JMP xrefs), `GetFunctions`, `AnalyzeModule` (PE structure: sections, EP, image size), `AnalyzeCode`, `DetectOEP` (packed binaries), `DumpMemory`/`DumpModule`, `SearchSymbols`, `GetImports`/`GetExports`
- **Process context** — `GetCallStack`, `GetThreads`/`SwitchThread`/`SuspendThread`/`ResumeThread`, `ListModules`, `GetSEHChain` (x32), `GetPEB`, `GetArguments` (function args from stack/registers), `WatchExpressions`
- **Annotations & persistence** — `CommentOrLabelAtAddress`, `SetBookmark`/`DeleteBookmark`/`ListBookmarks`, `SetBreakpointCommand`, `SetBreakpointFastResume`, `SaveDatabase` (`.dd64`/`.dd32`)

The README's worked example gives a feel for an actual session:

```
You:    Load calc.exe and break at the entry point
AI:     [calls LoadBinary, SetBreakpoint, run, WaitForPause]
        Loaded calc.exe, hit breakpoint at 0x7FF7A1234000 in calc.exe
You:    What are the current registers?
AI:     [calls GetAllRegisters] → RAX: 0x0, RCX: 0x7FF7A1234000, ...
You:    Read 64 bytes at the current instruction pointer
AI:     [calls ReadMemory] → 48 83 EC 28 E8 12 34 00 00 ...
```

## The Zig Angle: Why It Matters

The implementation choice is worth dwelling on. Most MCP servers in this space are Python or TypeScript; this one is **Zig with zero dependencies**:

- **Single binary** — no .NET, no Python, no Node runtime to install alongside x64dbg
- **x32 + x64 from one codebase** — `zig build -Doptimize=ReleaseSafe --prefix dist` produces both `x64dbg-MCP-Server.dp32` and `.dp64`
- **Cross-compilation** — build the Windows plugins from Linux, macOS, or WSL

That's a meaningful difference in a security-tool context: fewer moving parts, no supply-chain runtime surface, and a small attack area. The x64dbg SDK bindings are runtime-resolved (the `bridge.zig` module), and the HTTP server/JSON-RPC dispatch is hand-rolled (`mcp_server.zig`, `tools.zig`) rather than pulled from a framework.

## Auth and the Security Model

The project treats auth as a first-class concern, which is refreshing for MCP servers:

- **Mandatory token** — auto-generated on first run, required on every request, `401` otherwise
- **Config dialog** — rotate (`Generate`) or copy (`Copy`) the token from the Plugins menu
- **Bind control** — `127.0.0.1` for local-only, `0.0.0.0` for WSL/remote access (documented explicitly as the remote option)

The reason for the emphasis is real: this MCP server has **full debugger control and can read/write process memory**. A token leak on a `0.0.0.0` bind is not "someone can read my chat history" — it's "someone can patch the process you're debugging." The docs are clear about the risk model, and that's the right posture.

## Pricing

**Free, open source under MIT.** No paid tiers, no SaaS, no hosted option — it's a local plugin by nature. Building from source needs Zig 0.16-dev or later; prebuilt releases are available from the GitHub releases page.

## Community Reaction

The project hit **1,209 stars in three days** and GitHub Trending #1 in its category, but there's no significant HN thread yet — the signal so far is developer adoption rather than discussion. What's notable from the repo's trajectory:

- **Version velocity** — v1.0 (August 22, 71 tools) → v1.1 (August 24, 84 tools) is aggressive iteration, and the v1.1 changelog reads like a response to user requests: `WaitForEvent` long-polling for HTTP-only clients, memory/exception breakpoints, code analysis, `SetBreakpointCommand`, `SetBreakpointFastResume`.
- **The Red Team positioning** — the author's site badge reads "Red Team" and the repo is squarely aimed at malware analysis and RE workflows, which explains the tool breadth (OEP detection, PEB/SEH inspection, module dumping are CTF/analyst staples).

## Verdict

**x64dbg-MCP Server is the strongest MCP bridge to a real debugger available today.** The 84-tool surface is comprehensive, the Zig zero-dependency design is the right call for a security tool, the auth model is more careful than most, and the two-days-apart release cadence shows an author shipping what users actually ask for. The README's example — load `calc.exe`, break at entry, dump registers, read memory — is exactly the workflow that makes agentic RE feel inevitable.

**Who it's for:** malware analysts and CTF players who already use x64dbg and want to hand the mechanical parts of a session (breakpoints, pattern scans, dumps, xrefs) to Claude Code or Codex; RE educators; anyone building tooling where an AI assistant needs live debugger state.

**Who should skip it:** macOS/Linux-only reversers (no x64dbg, no plugin — though you can drive a Windows box remotely via `0.0.0.0` bind); users of other debuggers (no GDB/IDA bridge here); and anyone uncomfortable with the fundamental trust model of giving an LLM write access to a live process — the token is the only wall, and mistakes can patch memory.

**The bigger takeaway:** debugger control was one of the last holdouts against agentic tooling because of the risk profile. x64dbg-MCP Server shows the pattern that works — comprehensive tool surface, mandatory auth, local-only by default, and honest documentation of the trust boundary. Expect this category (debugger/RE MCP bridges) to grow fast now that the template exists.
