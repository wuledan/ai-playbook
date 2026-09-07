---
title: "mobilecode Review 2026 — The OpenCode Fork That Puts a Live iPhone or Android Simulator Next to Your Coding Agent"
date: 2026-09-08
author: "AIPlaybook Editorial Team"
category: "Coding"
tags:
  - "mobilecode"
  - "opencode"
  - "AI-Coding-Agents"
  - "React-Native"
  - "iOS"
  - "Android"
  - "Expo"
  - "Mobile-Development"
  - "Simulator"
  - "Open-Source"
  - "Xcode"
  - "Gradle"
cover: "/images/reviews/mobilecode-review-2026/cover.png"
meta_description: "mobilecode is an MIT-licensed fork of opencode (created 2026-09-05, 170+ stars in three days) that makes the terminal coding agent genuinely useful for mobile work: when it detects an iOS or Android project it starts the simulator or emulator preview server and streams a live device pane into the app, right next to your session, with an Xcode-style Play button that builds, installs and launches. For React Native it starts one Metro server, builds both native projects and runs them in embedded Simulator and Emulator panes from a single Play press; for Expo it runs expo prebuild when needed, installs pods, starts Metro and connects the emulator through adb reverse. The device_run tool lets the agent itself build and launch the app, wait for the result and read the build error and log tail, so it can fix a failing build without you pasting logs. This review covers the device pane, the per-platform build pipelines (xcodebuild + simctl on iOS, Gradle + adb on Android), the HTTP preview API, what mobilecode inherits from opencode (config, providers, plugins, skills, MCP), the honest limits of a three-day-old fork, and how it compares with vanilla opencode, Cursor and the Expo CLI workflow."
rating: 7.3
dimensions:
  ease-of-use: 7.5
  features: 8
  value: 7.5
  performance: 7
  ecosystem: 7.5
pros:
  - "The missing feedback loop for agent-written mobile code: instead of the agent editing files and asking you to run the app and paste the error, mobilecode opens a device pane beside the conversation and gives the agent a device_run tool that builds, launches, waits and reads the failure — a failing build is fixed by the agent without you ever copying a log line"
  - "One Play button for React Native across both platforms: mobilecode starts a single Metro server, builds both native projects, installs them and launches them in embedded Simulator and Emulator panes, and the Xcode-style run control in the titlebar shows live status moving through Building, Installing, Launching and Running with the first compiler or Gradle error one click away in the device pane"
  - "Embedded live device, not a sidecar window: the iOS Simulator stream (via Evan Bacon's serve-sim) and the Android Emulator stream (via the author's serve-avd) render inside the app next to your session with Start, Stop, Reload and Open-in-browser controls, and the pane opens by itself when you open a session in a mobile project"
  - "Agent-driven runs are first-class: device_run waits for the result and returns the build error plus a log tail, so the agent can self-correct against the real toolchain — the project explicitly documents that the same operations are available over HTTP (/api/device-preview/start, /stop, /run), which makes the flow scriptable and testable outside the TUI"
  - "Keeps opencode's whole surface: terminal UI, desktop app and web UI, any model provider, MCP, plugins and skills all carry over unchanged, and configuration stays compatible (opencode.json, ~/.config/opencode, OPENCODE_ env vars), so an existing opencode setup is a drop-in migration rather than a reconfiguration"
  - "Project detection is tolerant: projects are found up to two directories below the session root, Expo apps are recognized, and switching back to a tab whose project was running relaunches the installed app without a rebuild when it can, which keeps the iteration loop fast"
cons:
  - "Three days old at review time (created September 5, 2026): one author plus merged community PRs, no tagged release on the homepage, and the build pipeline was still being pinned down (bun version, tag collisions, Node version) in the commit history on day one — the kind of churn you expect before a 1.0"
  - "Heavy native prerequisites: iOS needs macOS with Xcode and serve-sim's Node 20+, Android needs the SDK platform-tools with at least one AVD plus a JDK your Gradle version supports, and package names are read from the built APK with aapt2 when build-tools are installed — this is not a zero-setup tool and the embedded previews only run on the machine hosting the mobilecode server"
  - "One project at a time by design: the simulator, emulator and Metro port are shared, so starting a project stops any other project's apps first — a deliberate simplicity trade-off that will annoy anyone who keeps a backend and an app running simultaneously"
  - "Unsigned builds by default: the macOS app is unsigned, so you right-click and choose Open the first time, and shipping a signed, notarized build requires a Developer ID certificate plus APPLE_API_KEY/APPLE_API_KEY_ID/APPLE_API_ISSUER environment variables"
  - "A fork, with fork risk: mobilecode is built on anomalyco's opencode (MIT) and its value depends on tracking upstream — the README is honest that it 'keeps its MIT license' but users must weigh whether a one-person fork can keep pace with opencode's release cadence"
best-for: "Mobile developers and teams who already use opencode, Cursor or Codex-style agents and want the agent to build, run and fix iOS, Android, React Native and Expo apps with live simulator feedback instead of manual run-and-paste cycles — especially solo developers and small teams running on a single macOS host with Xcode and the Android SDK installed"
price: "Free and open source (MIT). Install with the curl script (downloads a release binary from GitHub into ~/.mobilecode/bin) or from source with bun install and bun run --cwd packages/opencode src/index.ts. Requires macOS with Xcode and Node 20+ for iOS previews (serve-sim), and the Android SDK platform-tools with at least one AVD plus a compatible JDK for Android (serve-avd). No API keys, no cloud, no per-seat pricing — you bring your own model provider through opencode's existing configuration."
---

## The Problem: Coding Agents Are Blind to the Thing They're Building

A coding agent is very good at editing files and very bad at knowing what those files do on a device. Ask it to fix an iOS layout issue and it will edit SwiftUI, report success, and have no idea whether the app even compiles — because the feedback loop runs through you: you build, you stare at the simulator, you paste the error back. That round trip is where mobile AI coding dies. hsandhu's **mobilecode**, a fork of anomalyco's opencode created September 5, 2026, is a direct answer: it detects when you're working in a mobile project, starts the simulator or emulator preview server, and streams a live device pane into the app right next to your session — then hands the agent a `device_run` tool so the build-launch-read-error loop no longer needs you in the middle. In three days it passed 170 stars on an MIT license with 18 forks, and it was posted twice to Hacker News as a Show HN.

The core pitch is simple: opencode already gives you a terminal agent with any model provider, MCP, plugins and skills. mobilecode adds the one capability opencode lacks for mobile work — *eyes on a running device*.

## How the Device Pane Works

Open a session in a mobile project and the device pane opens by itself, alongside your conversation. It starts `npx serve-sim` or `npx serve-avd` on the machine running the mobilecode server and streams the simulator or emulator into the app, with Start, Stop, Reload and Open-in-browser controls. Project detection is deliberately tolerant: projects are found up to two directories below the session root, so an app nested in a subfolder is still picked up.

The session titlebar carries an Xcode-style run control for every detected platform, showing the current build status next to it. **Play** builds the native project, installs it on the running simulator or emulator and launches it. On iOS that means `xcodebuild` against the first shared scheme, then `simctl install` and `simctl launch`; on Android it means `./gradlew :<module>:assembleDebug`, then `adb install -r -g` and an explicit launch intent. **Stop** cancels a build in flight or terminates the app when it's already running. Status moves through Building, Installing, Launching and Running, and a failed build surfaces the first compiler or Gradle error with the full log one click away in the device pane.

## React Native, Expo and the One-Metro Design

The most impressive workflow is React Native: mobilecode starts a single Metro server, builds both native projects, and launches them in embedded Simulator and Emulator panes from one Play press. Expo gets the full treatment too — Play generates the native project with `expo prebuild` when needed, installs pods, starts Metro, and connects the emulator to it through `adb reverse`. One Metro serves both platforms, which is exactly how a React Native developer thinks about the world and precisely what most agent setups fail to replicate because they treat iOS and Android as two separate build tasks.

## Agent-Driven Runs: The device_run Tool

Where mobilecode stops being a nice simulator wrapper and becomes an agent tool is the `device_run` capability. It lets the agent build and launch the app itself, wait for the result, and read the build error and log tail — so it can fix a failing build without you pasting logs. The device pane opens when a run starts. That closes the loop that makes agent-written mobile code trustworthy: the agent proposes a change, runs the real toolchain against it, reads the real error, and iterates — the same discipline that made agentic coding work on the backend, now applied to native mobile.

The same operations are exposed over HTTP: `GET /api/device-preview?location[directory]=<project>`, `POST /api/device-preview/start`, `/stop`, `/run` and `/run/stop`, each taking a `{"platform": "ios" | "android"}` body. That HTTP surface matters: it means the preview flow is scriptable and testable outside the TUI, so a CI job or a test harness can drive the same build-launch-read cycle the agent uses interactively.

## Everything Else, Inherited

mobilecode keeps opencode's configuration format and locations, so an existing `opencode.json`, provider credentials, plugins and skills work unchanged. Configuration lives in `~/.config/opencode`, data in `~/.local/share/opencode`, and environment variables keep the `OPENCODE_` prefix — the opencode docs are the reference. You also keep the full opencode surface: terminal UI, desktop app, web UI, any model provider, MCP servers, plugins and skills. The macOS app builds with one command (`bun run build:macos`), which bundles the server, builds the Electron app and writes `MobileCode.app` plus a `.dmg` and `.zip` to `packages/desktop/dist`.

## Honest Limits and Who It's For

mobilecode is a three-day-old fork, and it shows its age in the honest places: the build pipeline commits from day one are about pinning bun versions and fixing tag collisions; the macOS app ships unsigned by default; and the "one project at a time" rule means starting a project stops any other project's apps first — fine for a solo developer, limiting for anyone juggling a backend and an app. The native prerequisites are real: iOS previews demand macOS with Xcode and Node 20+ (serve-sim), Android demands the SDK platform-tools, an AVD and a JDK your Gradle version supports. And it is a fork — its future depends on tracking opencode upstream, which the README acknowledges by keeping the MIT license and opencode's copyright notice.

For solo mobile developers and small teams who already live in opencode, Cursor or Codex-style agents and are tired of the manual build-and-paste loop, mobilecode is the most direct fix available: an embedded live device, a Play button, and an agent that can finally see — and fix — what it builds.
