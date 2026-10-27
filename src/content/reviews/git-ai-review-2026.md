---
title: "Gitai Review 2026 — An Open-Source Take on Source Control Built for Hundreds of Concurrent Agents"
date: 2026-10-28
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags:
  - "gitai"
  - "graft"
  - "version-control"
  - "coding-agents"
  - "Go"
  - "Gitaly"
  - "agent-infrastructure"
  - "self-hosted"
  - "open-source"
  - "Developer Tools"
cover: "/images/reviews/git-ai-review-2026/cover.png"
meta_description: "Gitai (feder-cr, created October 15, 2026, 1,008 stars) is an open-source implementation of the source-control design Anthropic described for coding agents: server-side history, sparse object fetching, compare-and-swap landing without a merge queue, LLM conflict resolution gated by a verify command, a changeset log and per-agent tokens. This review covers the Graft architecture, the 50-agent benchmark, the storage core, the security model — and an unresolved licensing question about redistributing GPL-2.0 Git code under MIT."
rating: 7.6
dimensions:
  ease-of-use: 6.5
  features: 8.5
  value: 8
  performance: 8.5
  ecosystem: 6
pros:
  - "It attacks the right bottleneck: classic Git hosting assumes a human who clones once and pushes after hours of work, while agents run thousands of short-lived tasks on the same branches — gitai moves blame, path history, ancestry and code search to the server as memoized derived data so clients stop walking history they do not need"
  - "Landing without a merge queue is the design decision that pays for itself: UserLand rebases a change onto the current tip and lands it with a compare-and-swap, batching concurrent lands into one reference update, which is why the benchmark shows 1.0 attempts per landed change instead of 26-29"
  - "The benchmark is specific and reproducible: 50 agents landing 5 changes each on one branch with 20% deliberate conflicts, 200 of 250 landed versus 100-106 for the classic path, 1,487-1,944 lands per minute versus 264-385, p99 1.9-2.7 s versus 4.4-5.2 s, and with the deterministic resolver configured all 250 land"
  - "AI conflict resolution is treated as a proposal rather than an authority: a model's resolution only lands by itself if the verify.command you configured passes on the exact tree that would land, otherwise the agent receives the conflict package — the right shape for letting an LLM touch a merge"
  - "Agent identity is first-class infrastructure, not an afterthought: per-agent tokens, an RPC allowlist, branch policies enforced on every reference update through a reference-transaction hook, and a changeset log that records which agent landed what"
  - "Operationally it is a real system rather than a demo: stateless server nodes that rebuild as caches, SQLite or PostgreSQL write-ahead log per change, packs in file/S3/GCS/Azure object storage, a shadow-then-authoritative migration path, and crash, multi-node and fuzz tests behind the 0.4.0 tag"
cons:
  - "The licensing question is open and it is the first thing a legal review will raise: the repo presents MIT plus copyright notices imported from GitLab, but Git itself is GPL-2.0 and issue #5 argues you cannot relicense Git-derived code downward without every copyright holder's consent — at review time the GitHub API reports the license as NOASSERTION and the issue is unresolved"
  - "It is infrastructure, not a product: no web UI, no issues, no merge-request review workflow and no CI, and the author's own limitations page says so plainly — you are adopting a Git-compatible server plus a CLI, and everything around it stays your problem"
  - "The build is not casual: Go 1.26, a C toolchain, Meson and Ninja because the build compiles a bundled Git, and then a config.toml to adapt before anything serves traffic — this is a day of work before your first successful land"
  - "The access policy is local configuration, and whoever can edit that configuration can decide who writes where; the shared auth token is an administrative credential that can act as any user, exactly as in upstream Gitaly, so the security boundary is your file permissions rather than the software"
  - "It is explicitly not a Scion implementation and not affiliated with Anthropic — the design is reconstructed from a public engineering article, so internal behaviours Anthropic has not published are simply absent, and the interface is pre-1.0 with known gaps such as garbage collection of packs in the storage core"
  - "Ecosystem gravity is the hard part: the value appears when a fleet of agents lands through it, which means every agent, CI job and review tool has to speak Graft's RPCs, and there is not yet a community of operators who have run this at scale and written down what breaks"
best-for: "Platform and developer-infrastructure teams running fleets of coding agents that contend on the same branches and are being slowed by full clones, merge queues and client-side history walks — especially teams that already self-host GitLab or Gitaly, are comfortable compiling Go and C, and want per-agent identity, verified landing and an auditable changeset log without waiting for a vendor's private system to ship"
price: "Free and open source (MIT as declared in the repository, with an open compliance question about Git-derived code — see the licensing caveat). Self-hosted: Go 1.26, a C toolchain, Meson and Ninja to build, then SQLite or PostgreSQL plus file, S3, GCS or Azure object storage. The server never calls a language model; conflict resolution works with any provider, a deterministic tool, or none. Optional extras: graft-cache tiers, Slack reporting, graft-verify."
---

## What Gitai Is

Coding agents broke a set of assumptions Git hosting was built on. Classic hosting assumes a human who clones a repository, works for hours and pushes once. Agents do the opposite: thousands of short-lived tasks, each touching a few files, each wanting to land in seconds, many of them on the same branch at the same time. Full clones, merge queues and client-side history walks become the bottleneck, and no amount of faster hardware fixes a queue.

Anthropic described a different design for exactly this in *Redesigning source control*: a server-centric system for hundreds of agents reading, writing and landing code simultaneously. That system, Scion, is internal. **Gitai** — created October 15, 2026 by feder-cr, **1,008 stars and 97 forks** at review time, written in Go, at version 0.4.0 — is an open-source implementation of the publicly described design, built on top of a fork of Gitaly, GitLab's Git RPC server. Inside the code the extensions are called **Graft**.

The framing is deliberately honest in two directions. It is an independent implementation, explicitly not affiliated with or endorsed by Anthropic, and it does not claim to reproduce Scion's internals — only the ideas in the article. And the server never calls a language model: every AI feature works with any provider, or none.

![Gitai's README opens with the benchmark claim that matters — 50 agents racing on one branch, where classic Git lands 100 of 250 changes and gitai lands 200](/images/reviews/git-ai-review-2026/cover.png "The repository's own framing: the problem is concurrency on one branch, not storage size")

## The Ideas, Implemented

Five Graft mechanisms carry most of the value.

**Always-online clients that fetch exactly what they need.** An `ObjectService` serves single objects and sparse trees; `graft clone` and `graft sparse` materialise only the paths an agent asked for. An agent editing one file in a monorepo does not need the tree.

**Source control as an API.** Blame, path history, ancestry and code search run server-side and are memoized as derived data, computed once per commit. This is the quiet win: history questions stop being a client-side walk repeated by every agent.

**Landing without a merge queue.** `UserLand` rebases a change onto the current tip and lands it with a compare-and-swap; concurrent lands on one branch are batched into a single reference update. When a land cannot proceed, the agent gets a conflict package instead of a queue position.

**Automatic conflict resolution, gated.** A conflicting land is resolved by a resolver you choose — any LLM provider, a deterministic tool, or none — over a versioned protocol. The gate is the detail that matters: a model's resolution is only a **proposal**, and it lands by itself only if the `verify.command` you configured passes on the exact tree that would land. Otherwise the agent receives the conflict package with the proposal attached. Deterministic rules you configure are also verified on the exact tree when verification is enabled.

**A changeset log.** Every accepted reference update is recorded with its operation and actor in a dense, ordered log that clients can list or watch live. That is the substrate for both audit and the "superfan" monitoring agents that follow the stream and report what matters to each component, including through Slack.

Underneath, the storage core is one SQLite or PostgreSQL write-ahead log per change with a compare-and-swap per reference, content-addressed packs in object storage, and stateless server nodes that are caches any node can rebuild — so scaling out means adding nodes, and local Git repositories become derived artefacts rather than the source of truth. `graft-verify` tests the tip after landing, bisects a failure and reverts the change that broke it. Reviews support semantic approval rules, so a comment-only change can require fewer approvals than a logic change.

![The benchmark page, not the marketing line: attempts per landed change, lands per minute, p99 latency and the conflict-resolver variants that get all 250 changes landed](/images/reviews/git-ai-review-2026/benchmark.png "doc/graft/BENCH.md — the numbers behind the 50-agent claim, including what changes when a resolver is configured")

## The Benchmark, Read Carefully

The headline test is 50 agents landing 5 changes each on one branch, with 20% of changes conflicting on purpose. "Classic" means the same server with batching off: every agent rebases and retries its own compare-and-swap, up to 20 attempts. Measured on one 16-core machine, two runs:

| 50 agents, 250 changes, no resolver | classic | gitai |
|---|---|---|
| changes landed | 100-106 | 200 |
| attempts per landed change | 26.5-28.7 | 1.0 |
| lands per minute | 264-385 | 1,487-1,944 |
| p99 latency | 4.4-5.2 s | 1.9-2.7 s |

The 50 remaining changes are the planted conflicts, returned to their agents because no resolver was configured. With the deterministic resolver from `examples/graft/demo/resolve.toml`, every conflict resolves and all 250 changes land, at 1,245-1,806 lands per minute with p99 of 2.0-3.4 s. Two runs on one machine is not a fleet study, and the resolver numbers depend on the rules you write — but the shape of the result is the interesting part. The win comes from removing retry storms and client-side history work, not from a faster disk.

## Security, Stated Plainly

The limitations page is the most useful document in the repo, and it opens with what Graft is *not*: not a hosting product (no web UI, issues, merge-request workflow or CI), not a replacement for GitLab, not a Scion implementation, and **not a security boundary by itself** — the access policy is local configuration, so whoever can edit the server configuration can change who may write where.

The identity model is worth knowing before you deploy. For requests authenticated with an agent token, the standalone policy decides on the *agent name* of that token; the acting user ID the client sends is replaced server-side, so an agent cannot claim to be someone else to get around a branch policy. The user name and email still become the committer, which is intentional and should be understood. Requests with the shared `auth.token` are administrative: the holder can act as any user, exactly as in upstream Gitaly. Enforcement runs on every reference update through a reference-transaction hook as well as pre-receive, agents can never touch `refs/graft/`, and an agent cannot repoint `HEAD` to escape a protected branch. Denials are aborted whole and are not written to the changeset log; the server log names the rule that denied the update.

That is a coherent model, and it comes with an operational precondition: keep the configuration and token files protected, because they *are* the policy.

![The limitations page leads with what the software refuses to be — no web UI, no CI, no merge-request workflow, and a policy that is configuration rather than a security boundary](/images/reviews/git-ai-review-2026/limitations.png "doc/graft/LIMITATIONS.md — the rare README-adjacent page that talks you out of the wrong deployment")

## The Licensing Question You Cannot Skip

The repository declares MIT, and it began as a fork of Gitaly, which is MIT and carries GitLab Inc. copyright notices. But Git itself is GPL-2.0, and **issue #5**, opened October 21, 2026, argues the incompatibility directly: copyleft compatibility runs one way, and GPL-2.0 code cannot be relicensed to a permissive licence without the consent of every copyright holder — which for Git is effectively the whole contributor history. The issue asks the maintainer to restore GPL-2.0 text. It is still open, and at review time GitHub's own API reports the licence as `NOASSERTION` rather than MIT.

Nothing here is a verdict on the maintainer's intent, and the practical exposure for a team running gitai internally is different from the exposure of redistributing it or shipping it inside a product. But if you are evaluating this for anything commercial, that issue is the first item in the due-diligence list, not a footnote.

## Where It Fits

Gitai is the most substantial attempt I have seen to make agent concurrency a server concern rather than a queue. The benchmark is honest about scope, the AI features are gated in the right place, and the identity model treats agents as users with their own credentials and limits instead of a shared service account with a script.

It is also clearly pre-1.0 infrastructure: a Go 1.26 plus C toolchain plus Meson/Ninja build because it compiles a bundled Git, a `config.toml` to adapt, a shadow-mode migration if you want the database storage core, and no community of operators yet to tell you which failure modes bite at 500 agents rather than 50. Interfaces may change before 1.0, and known gaps such as pack garbage collection are tracked rather than solved.

The right way to read this review is as a scouting report, not a recommendation to migrate on Monday. If your agents are already colliding on branches and you self-host GitLab, a two-week shadow-mode pilot costs you a build and a config file, and the benchmark tells you exactly what to measure. If you need a hosting product with review UI and CI today, this is the wrong tool — and the limitations page will tell you so before you finish the build.
