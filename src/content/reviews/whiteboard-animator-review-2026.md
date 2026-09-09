---
title: "whiteboard-animator Review 2026 — The CPU-Only Render Engine That Turns a Static Whiteboard Image Into a Hand-Drawn Video"
date: 2026-09-10
author: "AIPlaybook Editorial Team"
category: "Video"
tags:
  - "whiteboard-animator"
  - "Whiteboard-Animation"
  - "Video-Generation"
  - "Explainer-Videos"
  - "Python"
  - "FFmpeg"
  - "CRAFT"
  - "Kinoslide"
  - "Education"
  - "Open-Source"
  - "CPU-Only"
cover: "/images/reviews/whiteboard-animator-review-2026/cover.png"
meta_description: "whiteboard-animator (created September 8, 2026, MIT, ~100 stars) by masihsultani is a Python package that turns a finished whiteboard-style image into a hand-drawn reveal animation with one command and no GPU: pip install whiteboard-animator, then whiteboard-animate sketch.png --duration 8 -o sketch.mp4. It is the render engine behind the Whiteboard format at Kinoslide, released open source so anyone can animate their own images. The engine finds the ink (every connected blob of non-white pixels becomes a component, with a bundled 83 MB CRAFT text-detection ONNX model marking which components are text so words are written rather than traced), orders components the way a hand would (containers before contents, shapes before labels, text in reading order), assigns time slots that scale with the square root of area, gives every pixel a reveal time (strokes follow their skeleton from a real endpoint, closed outlines get one travelling front, fills get an outline pass then an angled sweep or bristled brush strokes, line art with junctions decomposes into sequential pen paths), and streams frames to ffmpeg. Optional narration: the drawing paces itself to an audio file, with a JSON region plan for exact drawing order — or --detect-regions lets Gemini propose the plan from the image and narration text. This review covers the render pipeline, the region-plan JSON format, quality presets, the honest limitations (white-background images only, text-based pacing that does not align to spoken-word timestamps, no audio alignment), and how the engine compares with the full Kinoslide product it powers."
rating: 7.4
dimensions:
  ease-of-use: 8
  features: 7.5
  value: 8
  performance: 7.5
  ecosystem: 7
pros:
  - "One command, CPU only, no API keys: pip install whiteboard-animator then whiteboard-animate sketch.png --duration 8 -o sketch.mp4 — the only model at render time is a small bundled text detector, and there is no GPU, no training and no cloud dependency, which makes it genuinely usable on a laptop or in CI"
  - "The drawing order is engineered to look like a hand, not a filter: every connected blob of non-white pixels becomes a component, a bundled CRAFT text detector (ONNX, CPU, 83 MB) marks text so words are written rather than traced like shapes, containers draw before their contents, shapes before their labels, text in reading order, and small dots attach to the glyph they belong to"
  - "Reveal timing is physically motivated: time slots scale with the square root of area so a big fill does not hog the timeline, strokes follow their skeleton from a real endpoint (so a V starts at a tip, not the apex), closed outlines get one travelling front, fills get an outline pass then either an angled sweep or bristled brush strokes depending on size, and line art with junctions decomposes into sequential pen paths so an X or a grid does not grow from the middle outward"
  - "Narration pacing is built in with honest boundaries: with an audio file the drawing finishes inside the audio and the finished frame holds until it ends; a JSON region plan allocates the first 75% of the audio to drawing windows, blending each region's share of annotation characters (70% weight) and bounding-box area (30% weight) — and the README is explicit that this estimates pacing from text and does not analyze speech or align to spoken-word timestamps"
  - "It is the production engine behind a real product: the README states this is the render engine behind the Whiteboard format at Kinoslide (kinoslide.ai), released so anyone can animate their own images, with linked YouTube examples of complete narrated videos made with the engine (The Yen Carry Trade Unwind; General Relativity in 2 minutes)"
  - "The engineering is visible and testable: seven commits from the author with CI, unit plus integration tests that include the real bundled model and CLI-to-MP4 checks against FFmpeg, a lower-level WhiteboardAnimator.render_to_file Python API exposing every tuning knob (fade length, fill detection thresholds, brush angle and width, the S-curve that decides when a fill uses brush strokes instead of a sweep, line-art decomposition thresholds), and an editable region plan saved with --save-regions for re-rendering"
cons:
  - "White-background images only, by design: the engine expects ink on white — pixels lighter than 240 gray are background and near-white is snapped to white, so photos, gradients and textured or coloured backgrounds will not animate, and the repo lists non-white backgrounds (dark boards, paper textures) as a known limitation it wants help with"
  - "Narration pacing is estimated from text, not aligned to speech: pauses, changes in speaking rate and uneven phrase lengths can make the drawing lead or lag the voice — for exact cue times you must pass explicit start and end times in an element_plan to the lower-level API, which is more work than the one-command path"
  - "The optional Gemini region detection is the only cloud touch: --detect-regions asks Gemini to work out the drawing order from the image and narration and needs the gemini extra plus a GOOGLE_API_KEY — everything else renders locally, but that one feature is a paid API call"
  - "Heavy first install: the package bundles an approximately 83 MB text-detection model plus scientific Python dependencies (OpenCV can try to compile if no prebuilt wheel matches), and it needs ffmpeg and ffprobe on your PATH with libx264 — the README's troubleshooting section is long because the install surface is real"
  - "Raster rendering, not vector: the engine traces a raster skeleton, so text is written by the detector and shapes are revealed by pixel-level fronts — there is no SVG input and no tracing of real vector paths yet, which the repo lists as a future direction"
best-for: "Educators, course creators, YouTube explainer producers and content teams who already have finished whiteboard-style diagrams (or can generate them) and want a reliable, CPU-only, scriptable way to turn them into hand-drawn reveal videos with optional narration pacing — especially people who want deterministic output and full control over drawing order via a JSON region plan rather than another black-box AI video generator"
price: "Free and open source (MIT). pip install whiteboard-animator (Python 3.10+, ffmpeg and ffprobe on PATH with libx264); the package includes the ~83 MB CRAFT text-detection model and rendering does not download it at runtime. Optional: pip install 'whiteboard-animator[gemini]' plus a GOOGLE_API_KEY for --detect-regions region-plan detection from image and narration. Quality presets: low (20 fps, 500k), medium (24 fps, 1500k, default), high (24 fps, 3000k). No per-render fees, no subscription — the only possible cost is Gemini API usage if you opt into region detection."
---

## The Pitch: One Command From Static Image to Hand-Drawn Video

whiteboard-animator, released September 8, 2026 by masihsultani under MIT, answers a deceptively simple question: what if a finished whiteboard picture could draw itself? Give it a whiteboard-style image and it writes the text word by word, traces the outlines, fills the shapes with brush strokes, and draws branched line art one stroke at a time — the way a person at a whiteboard would. Add a narration file and the drawing paces itself to the voice. One command, CPU only, no API keys:

```bash
pip install whiteboard-animator
whiteboard-animate sketch.png --duration 8 -o sketch.mp4
```

The repo is candid about its pedigree: this is **the render engine behind the Whiteboard format at Kinoslide** (kinoslide.ai), released open source so anyone can animate their own images. The README links complete narrated videos made with the engine — *The Yen Carry Trade Unwind* and *General Relativity in 2 minutes* — as evidence of what the pipeline produces. It passed ~100 stars within two days of release.

## How the Engine Draws

The render pipeline is five stages, and each one reads like someone who has watched a lot of whiteboard videos and got angry about the details:

1. **Finds the ink.** Every connected blob of non-white pixels becomes a component. A bundled CRAFT text detector (ONNX, CPU — an 83 MB export of CRAFT-pytorch's `craft_mlt_25k`, MIT) marks which components are text so words are *written* rather than traced like shapes.
2. **Orders the components the way a hand would.** Containers before contents, shapes before their labels, text in reading order, small dots attached to the glyph they belong to.
3. **Gives each one a time slot.** Slots scale with the square root of area, so a big fill does not hog the timeline. With a region plan, slots use estimated narration pacing instead.
4. **Assigns every pixel a reveal time.** Strokes follow their skeleton from a real endpoint, so a V starts at a tip and not the apex. Closed outlines get one travelling front. Fills get an outline pass, then either an angled sweep or bristled brush strokes depending on size. Line art with junctions is decomposed into sequential pen paths, so an X or a grid does not grow from the middle outward.
5. **Streams frames to ffmpeg.** Newly finished pixels are committed once, and only pixels currently fading are blended each frame.

At render time there is no model apart from the small text detector. No GPU, no training, no API keys. If the model cannot be loaded the engine still runs and treats text as ordinary strokes.

## Narration, Region Plans and the Honest Boundary

With narration, the default behaviour is that the drawing finishes inside the audio and the finished frame holds until the audio ends. Multiple scenes concatenate in order, each with its own audio. Quality presets cover the usual range: `low` (20 fps, 500k), `medium` (24 fps, 1500k, default), `high` (24 fps, 3000k), and images whose longest side exceeds 1280 px are downscaled.

The interesting control is the **region plan**: a JSON file that specifies what the image contains, the drawing order, and the narration text associated with each part. Boxes are normalized 0 to 1000 with the origin at the top left, and each region carries a label, role (`main_concept`), an `expected_visual`, a `reveal_order` and a reveal style. With a plan, the engine allocates the first 75% of the audio to drawing windows, and each region's share blends its fraction of annotation characters (70% weight) and bounding-box area (30% weight); if all annotations are empty it uses box area alone. A region can finish early and hold until the next window.

The README draws the honest boundary here: **this estimates pacing from text; it does not analyze speech or align to spoken-word timestamps.** Pauses, changes in speaking rate and uneven phrase lengths can cause the drawing to lead or lag the voice. For exact cue times you pass explicit `start` and `end` times in an `element_plan` to the lower-level `WhiteboardAnimator.render_to_file` API, which takes an RGB numpy array and writes a silent MP4 — and whose constructor exposes every tuning knob: fade length, fill detection thresholds, brush angle and width, the S-curve that decides when a fill uses brush strokes instead of a sweep, and the line-art decomposition thresholds.

The one optional cloud feature is `--detect-regions`, which asks Gemini to work out the drawing order from the image and the narration text — it needs the `gemini` extra and a `GOOGLE_API_KEY`. `--save-regions` writes the detected plan next to the output so you can edit it and re-render with `--regions`, which is a nice human-in-the-loop pattern: let the model propose, then fix the order by hand.

## What Makes a Good Input

The engine expects ink on white. Pixels lighter than 240 gray are background, and near-white is snapped to white. Clean marker-style drawings with a handful of flat colours animate best; photos, gradients, and textured or coloured backgrounds will not. That constraint is both the limitation and the reason the output looks coherent — the reveal logic depends on clean segmentation, and the repo is upfront that non-white backgrounds and SVG input with real vector tracing are the open problems it wants help with.

## Engine Alone vs the Full Kinoslide Product

The README includes a comparison table that is unusually clear about what the open-source engine does and does not do. The repo animates an image you already have, joins multiple scenes into one video, and paces narration from a region plan. Kinoslide — the hosted product — additionally writes the script from a PDF or prompt, generates the scene images, supplies narration with Gemini and ElevenLabs voices, handles narration pacing automatically, and offers hosted rendering, sharing and editing. In other words: whiteboard-animator is the deterministic render core, open-sourced, and the product layers the generative parts on top. For a content operator that is a useful separation — you can build your own pipeline on the engine without signing up for the hosted product, or use the hosted product and know exactly what is underneath.

## Honest Limits and Who It's For

The limits are structural and stated. White-background images only. Narration pacing estimated from text, not aligned to speech — with exact cue times requiring the lower-level API. One paid-API feature (Gemini region detection) in an otherwise local tool. An 83 MB model plus scientific Python dependencies and ffmpeg with libx264 on the first install. Raster rendering rather than vector tracing. And it is a two-day-old, single-author project at review time — though the seven commits include CI and integration tests that run the real bundled model through CLI-to-MP4 checks, which is more engineering rigour than most day-two releases.

Who should care? Educators, course creators and explainer producers who already have finished whiteboard diagrams and want deterministic, scriptable, CPU-only animation with full control over drawing order — people who would rather own a precise render engine with a JSON plan format than trust another black-box video generator. For that audience, whiteboard-animator is a rare thing in the 2026 AI-video landscape: a tool that does exactly one job, does it locally, and tells you honestly where its boundaries are.