---
title: "Watermark-Remover Review 2026 — Stripping Multi-Vendor AI Watermarks After the MS Paint GUID Scandal"
date: 2026-08-25
author: "AIPlaybook Editorial Team"
category: "Security"
tags:
  - "Watermark-Remover"
  - "C2PA"
  - "Content-Credentials"
  - "AI-Watermarking"
  - "SynthID"
  - "Claude-Code"
  - "Codex"
  - "Privacy"
  - "Open-Source"
  - "Review"
cover: /images/reviews/watermark-remover-review-2026/cover.png
meta_description: "Watermark-Remover is an MIT-licensed agent skill + stdlib Python service that strips invisible AI provenance marks — C2PA, EXIF/XMP, invisible Unicode, and statistical text watermarks — from PNG, JPEG, PDF, DOCX, MP4, and 20+ more formats. We review it against the MS Paint invisible GUID watermark story (501 points, ~200 comments on HN) and test its layer-based cleaning model, hook-based auto-clean, and the privacy questions the whole category raises."
rating: 7.6
dimensions:
  ease-of-use: 8
  features: 8
  value: 8.5
  performance: 7.5
  ecosystem: 6.5
pros:
  - "Three-layer cleaning model (invisible Unicode → statistical text watermarks → file metadata) covers both text and media, from Claude/Gemini/OpenAI marks to Kirchenbauer green-list and keyed-Gumbel open-LLM schemes"
  - "Genuinely broad format support: 20+ file types from PNG/JPEG/WebP to PDF (qpdf structural strip), DOCX/XLSX/PPTX/EPUB, and MP4/MOV/MP3/FLAC containers"
  - "Ships as an agent skill for Claude Code, Cursor, Grok, and Cowork plus a stdlib-only HTTP service with OpenAPI spec, batch endpoints, and optional bearer auth"
  - "PostToolUse hook can auto-clean files the agent writes without model cooperation, and pre-commit hooks gate CI"
  - "Honest about limits: soft-bound C2PA and pure pixel/audio/video watermarks are explicitly out of scope for the core path, and no tool can certify a vendor detector will fail"
  - "Ethics section is explicit: for privacy and research on content you own, not academic fraud or fake 'human-written' claims"
cons:
  - "Layer B statistical-text rewrite is best-effort and costs style and voice — a heavy paraphrase is the only lever against sampling watermarks"
  - "Install is multi-part (skill + service + optional system tools like qpdf/exiftool), so it's not a single-command privacy fix"
  - "PDF stripping needs qpdf for a real strip — exiftool alone leaves recoverable bytes, which the README admits"
  - "README badges point at a different org path (guillaumemeyer/watermarks-remover) than the repo URL, a sign of fast-moving maintainership"
  - "Detection backends (MarkLLM, SynthID scoring, CtrlRegen) are opt-in and some require external checkouts or local builds"
  - "The tool's very existence sits in a gray zone — it removes provenance signals that some platforms (and regulators) now mandate"
best-for: "Developers and privacy-conscious creators who generate AI content and want to strip provenance metadata and invisible watermarks from files they own, using Claude Code, Codex, or a plain HTTP service — especially in the wake of OS-level invisible watermarking like MS Paint's GUID embedding"
price: "Free, open source (MIT), self-hosted — v0.5.0 latest release, no paid tiers, no hosted service"
---

## Quick Verdict

**Watermark-Remover** is an MIT-licensed **agent skill + stdlib Python service** that purges invisible AI provenance marks from text and files — invisible Unicode carriers, statistical text watermarks, and C2PA/EXIF/XMP metadata across **20+ file formats**. It hit **768 stars and 73 forks within 48 hours** of its August 23, 2026 creation, and it landed at an unusually charged moment: the same week a reverse-engineering writeup showed **MS Paint and Microsoft Photos embedding server-issued GUIDs as invisible watermarks in locally generated images**, a story that drew **501 points and roughly 200 comments on Hacker News**.

The timing is not a coincidence. Invisible AI watermarking moved from research papers to the consumer desktop this month, and a tool that removes those marks — even with explicit "only on content you own" guardrails — is exactly what a heated privacy discussion produces.

**The bottom line:** if you generate AI text and images and want control over the provenance metadata and invisible watermarks attached to files you own, this is the most complete open-source option available today. It is *not* a magic "un-watermarker" — the README is admirably explicit that soft-bound C2PA and pure pixel/audio/video watermarks remain out of scope, and that no tool can certify a vendor detector will fail. Think of it as **hygiene tooling for your own content**, not a defeat of the provenance ecosystem.

## The Context That Made This Tool Relevant

On **August 23, 2026**, reverse engineer **Xusheng Li** published a deep-dive showing that Microsoft Paint's local image generation embeds a **server-issued GUID** into the pixels of every locally generated image — invisibly, with no user-facing toggle. The HN submission (authored by ComputerGuru, who flagged the piece as AI-assisted) went to **501 points with ~200 comments**.

The mechanism, in brief:

- Paint ships **local ONNX models** (`seg.onnxe` 23.1 MB, `inseg_enc` 28.0 MB, `inseg_dec` 16.5 MB, `mager.onnxe` 302.4 MB) for NPU-based generation — but the **prompt is sent to a remote moderation endpoint** first.
- The moderation server returns `{revisedPrompt, promptGenerationId, watermarkId, containsHumanReference}` — and the `watermarkId` GUID is embedded into the locally generated pixels by `Watermarker.dll!WmkWriteWatermark`.
- The encoder builds an **18-byte message** (`0x4c || GUID[0..15] || byte-sum checksum`), expands it into **144 bits**, and requires each bit to be placed at least three times via **content-adaptive block-domain SVD-style quantization**. In a synthetic 512×512 test, **193,376 of 262,144 pixels changed**.
- The same GUID also appears in the file's **C2PA manifest** (`c2pa.soft-binding`, algorithm `com.microsoft.invismark.1`, "Content watermarked by Microsoft Responsible AI"), cryptographically signed — a *soft binding* so content can be matched to its provenance record even after the file-level manifest is removed.
- Paint restricts save formats to C2PA-capable ones — **PNG, JPEG, GIF, and .paint** — with classic BMP conspicuously absent. Microsoft Photos has the **same Watermarker.dll** behind its Image Creator and Restyle Image features.

The community reaction split three ways, and it's the backdrop for why a watermark-stripping tool exists at all:

- **Privacy hawks** focused on the identifier: "A GUID isn't an indicator, it's a fingerprint" (serf); "They're secretly adding a unique identifier into every image you create… a copyright subpoena to Microsoft could get your full name" (weberer).
- **Provenance defenders** pushed back: "I fear that one day we will look back and wonder why we didn't do more to sign and preserve human authenticity" (Delphiza), and "This is exactly what the EU wants" (mosura).
- **The middle** noted the distinction that matters: "You can watermark AI *without* leaking who did it. That's just using AI to add yet another layer of user tracking" (jacquesm) — and several commenters pointed at Microsoft's own **InvisMark** open-source repo.

Watermark-Remover is the counter-tool that the first camp has been waiting for.

## What Watermark-Remover Does

The project is structured as a **thin agent skill** backed by a **stdlib-only HTTP service**:

```
Agent (Claude Code / Codex / Cursor / Grok) → skill → HTTP service (127.0.0.1:8765)
```

The skill ships **no code** — the agent host needs no Python. All detection and cleaning work happens in the service, which exposes `/health`, `/capabilities`, `/openapi.json` (OpenAPI 3.0.3), `/inspect`, `/detect`, `/clean`, and batch variants (`max 50` files per call). A `WATERMARKS_SERVER_API_KEY` env var adds bearer auth; the server binds loopback by default.

### The three-layer cleaning model

| Layer | Target | Method |
|-------|--------|--------|
| **A** | Invisible Unicode, exotic spaces, bidi, tag chars | Deterministic Python, lossless |
| **B** | Statistical (token-sampling) text watermarks | Agent rewrite + optional `rewrite_text.py` |
| **Files** | C2PA / EXIF / XMP / document properties | Container-aware stripping |

- **Layer A** removes edit-based Unicode carriers — zero-width characters, exotic spaces, bidi overrides, tag characters — the class of marks that tools like Claude and various open-LLM watermarkers slip into text. It's deterministic and **lossless**.
- **Layer B** attacks **sampling watermarks** — Kirchenbauer green-list, keyed-Gumbel / Aaronson EXP, and vendor schemes — via heavy rewrite. The README is blunt that this is **best-effort and costs style and voice**: "Skip Layer B when quality matters more than hygiene."
- **File cleaners** strip C2PA/XMP/properties from supported containers. The format table is the most thorough I've seen in this category: PNG/JPEG/WebP (drop C2PA/XMP/EXIF segments), AVIF/HEIC (drop ISOBMFF boxes), BMP/GIF/TIFF (truncate trailing metadata), SVG (strip `<metadata>`/XMP), PDF (exiftool → qpdf structural → optional Ghostscript deep pass), Office docs (scrub props, customXml, OPF, embedded media), HTML/Markdown (strip meta/JSON-LD/AI frontmatter keys + Layer A), and media containers (MP4/MOV/M4A/M4V/WAV/MP3/FLAC — drop C2PA/ID3/LIST chunks).

### Agent integration: skills, hooks, pre-commit

- **Skills** install via one Python script targeting Claude Code (personal/project), Cursor, Grok, or Cowork: `python3 install_skill.py --skill remove-ai-marks --target claude-code`. A Claude Code plugin marketplace path exists too (`/plugin install watermarks-remover@watermarks-remover`).
- **Hooks** are the clever part: the plugin registers a `PostToolUse` hook on `Write|Edit|MultiEdit|NotebookEdit` that runs `hook_written_file.py` — in `check` mode it reports marks and leaves the file alone; in `clean` mode (`WATERMARKS_HOOK_MODE=clean`) it strips marks in place. Because a hook runs on every matching tool call, it **does not need model cooperation** — a meaningful reliability win over a pure skill.
- **Pre-commit** hooks (`watermarks-remover-check`, opt-in `watermarks-remover-clean`) gate CI.

### Optional detection backends

Detection is **separate from cleaning**. Opt-in backends include reverse-SynthID (image SynthID scoring), CtrlRegen (pixel-domain removal), MarkLLM (KGW/SynthID text verification), MarkDiffusion (image watermark harness + DiffusionPurification), and a stdlib keyed-Gumbel replayer (`detect_gumbel.py`) that needs the generation key. All are fail-soft — if a detector errors, cleaning still proceeds.

## Pricing

**Free, open source under MIT.** No paid tiers, no hosted service, no telemetry. The only cost is infrastructure: Python 3.10+ for the service, optional `qpdf`/`exiftool`/`c2patool` for deeper file cleaning, and Docker (GHCR images: `core`, `markllm`, `markdiffusion`) if you prefer containers. CtrlRegen and the SynthID scorer remain local-only builds because of upstream licensing.

## The Limitations, Honestly Stated

The README's honesty is the strongest signal of its maturity:

- **Soft-bound C2PA and pure pixel/audio/video watermarks remain out of scope for the core path.** The MS Paint GUID watermark — which survives even after C2PA removal, by design — is precisely this category. Stripping the pixel-domain GUID would require the CtrlRegen-style pixel-domain removal backend, which is "external; heavy; conservative strength default."
- **"No tool can certify that a vendor detector will fail."** This is the category's fundamental truth, and Watermark-Remover says it out loud.
- **Layer B guidance is practical:** "Prefer a non-origin model for Layer B so you do not re-stamp the text" — i.e., don't ask Claude to remove a Claude watermark, or you'll re-watermark it.

## Community Reaction

With 768 stars in two days, the reception has been fast but the discussion is still forming — the notable signals:

- **The MS Paint story is the catalyst.** Comments across both threads connect the dots between OS-level invisible watermarking and the need for user-side hygiene tooling.
- **The ethics tension is real.** The project's own ethics doc carves out "content you own or are authorized to process" and explicitly excludes "academic fraud or false 'human-written' claims" — a recognition that this category will be used for both privacy hygiene and deception.
- **The provenance defenders' counterpoint** (from the MS Paint thread) applies here: if soft-binding watermarks like `com.microsoft.invismark.1` become the norm, removing only the file-level C2PA manifest is theater — the pixel-domain mark remains.

## Verdict

**Watermark-Remover is the most complete, most honest open-source answer to invisible AI watermarking on your own content.** The three-layer model (Unicode → statistical → file metadata) is the right decomposition, the format coverage is genuinely broad, and the hook-based auto-clean design shows real understanding of how agent workflows actually run. The explicit limitations — soft-bound C2PA out of scope, no guaranteed detector failure, Layer B's style cost — are refreshingly candid.

**Who it's for:** developers generating AI content with Claude Code/Codex/Cursor who want provenance metadata and invisible text marks stripped from files they own; privacy researchers studying watermark schemes; teams that want a self-hosted cleaning API.

**Who should skip it:** anyone expecting pixel-level removal of image watermarks (SynthID pixel marks and MS Paint's GUID-style soft bindings need the heavier opt-in backends and are still best-effort); users who want a one-command, no-infrastructure tool; and anyone intending to forge "human-written" claims — the project explicitly rejects that use case, and as the MS Paint thread's provenance defenders noted, soft bindings are designed to survive this kind of cleaning anyway.

**The bigger takeaway:** whether you're on the privacy side or the provenance side of this debate, the MS Paint story proved invisible watermarking is now a desktop-default behavior. Tools like Watermark-Remover — and the honest conversations about their limits — are the user-side response, and they're only going to become more relevant.
