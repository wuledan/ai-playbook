---
title: "course2md Review 2026 — Turn YouTube, Bilibili or Lecture Recordings Into Slide-Illustrated Markdown Notes"
date: 2026-09-02
author: "AIPlaybook Editorial Team"
category: "Productivity"
tags:
  - "course2md"
  - "ASR"
  - "Speech-Recognition"
  - "Qwen3-ASR"
  - "Whisper"
  - "Lecture-Notes"
  - "YouTube"
  - "Bilibili"
  - "Rust"
  - "Local-First"
  - "Open-Source"
  - "CoreML"
  - "NPU"
cover: /images/reviews/course2md-review-2026/cover.png
meta_description: "course2md is a free MIT-licensed Rust CLI that turns YouTube, Bilibili or local course/meeting recordings into slide-illustrated Markdown and HTML lecture notes. It extracts keyframes with SSIM-based slide detection, transcribes audio with a choice of five ASR backends (Apple Silicon CoreML with Qwen3-ASR 0.6B, llama.cpp GPU/CPU with Qwen3-ASR 1.7B, cloud OpenAI-compatible STT via OpenRouter, and Intel NPU via OpenVINO Whisper), then assembles timestamped, slide-interleaved notes with an optional LLM proofreading and summarization stage. Benchmarked on Apple Silicon: 47s wall time at ~6.7W on the CoreML backend for a 3-minute lecture, 13s on GPU. This review covers the pipeline, backend trade-offs, the honest limitations (developer-grade install on Linux/Windows, first-run model downloads, cloud STT privacy), and who it's for."
rating: 7.8
dimensions:
  ease-of-use: 7.5
  features: 8
  value: 8
  performance: 8
  ecosystem: 6.5
pros:
  - "The full pipeline in one command: `course2md <url-or-file>` downloads/reads the video, detects slide changes with SSIM, transcribes with local or cloud ASR, and writes slide-illustrated course.md / course.html plus structured.json, keyframe images, timeline.jsonl and provenance metadata"
  - "Five ASR backends with a sensible default per platform: CoreML on Apple Silicon (ANE-powered, ~375 J per 3-min clip, zero external dependencies), llama.cpp GPU/CPU, cloud API mode, and Intel NPU — with automatic fallback from CoreML to the GPU pipeline"
  - "Qwen3-ASR is genuinely well-suited to technical content: the README's benchmark shows 1.7B handling NeoVim/Altair 8800/ICQ/Codex flawlessly where Whisper large-v3-turbo mishears (NeoWim, 'PCG RTIR 8800') and Whisper Tiny hallucinates ('cow smell' for NeoVim)"
  - "Slide detection done properly: SSIM frame similarity threshold, configurable sample interval, cooldown between captures, ROI support, and keyframe extraction — so the notes interleave the actual slide images with the transcript at the right points"
  - "Optional LLM polish and summary: proofreads filler words and homophone typos (batch of 20 segments, temperature 0, auto-fallback on failure) and can generate a TL;DR with timestamped outline via map-reduce for long videos"
  - "Cross-platform and packaged: Homebrew tap on macOS, AUR package, Windows exe via winget/Scoop, cargo install from source — plus a `course2md doctor` environment checker"
cons:
  - "First run downloads models (1-2 GB on macOS CoreML cache, ~2.4 GB GGUF on Linux/Windows) — not instant gratification, and restricted networks need HF_ENDPOINT mirror handling"
  - "Linux/Windows install is developer-grade: you need ffmpeg, yt-dlp, and llama-server from llama.cpp built from source for local ASR — the README's Debian/Ubuntu path literally walks you through cmake-building llama.cpp"
  - "Cloud STT mode uploads audio chunks to the provider (OpenRouter by default) — privacy is explicitly opt-in aware, frames/OCR/VAD stay local but audio leaves the machine"
  - "ASR accuracy is model-dependent: Whisper large-v3-turbo has sparse punctuation and occasional dropped clauses; Whisper Tiny/Base hallucinate on technical jargon and are only recommended for pipeline testing"
  - "Two-day-old project (created 2026-08-31): 187 stars, 7 forks, no release history yet despite a 1.0-era feature surface — the README references pre-1.0 checkpoint issues already fixed, so it's moving fast but young"
  - "Output is notes, not a polished product: LLM summarization is an extra setup step (course2md llm setup), and vision-assisted polish needs a multimodal model"
best-for: "Students, self-learners, and teams who watch lots of course/meeting recordings and want timestamped, slide-illustrated markdown notes they can search, quote and remix — especially Chinese/English technical content where Qwen3-ASR excels, on Apple Silicon or with an Intel NPU laptop, without paying for a transcription subscription"
price: "Free, MIT-licensed, open source (Rust); install via Homebrew tap / AUR / winget / cargo. Local ASR backends are free; cloud STT via OpenRouter costs ~$0.000035/second of audio with qwen/qwen3-asr-flash-2026-02-10; optional LLM polishing uses any OpenAI-compatible endpoint (DeepSeek, GLM, OpenAI, Ollama, vLLM)"
---

## The Pitch: One Command From Video to Illustrated Notes

On August 31, 2026, `mizorewww/course2md` landed on GitHub with a workflow that sounds simple and turns out to be surprisingly hard: *"Turn YouTube, Bilibili, or local course/meeting recordings into slide-illustrated Markdown and HTML lecture notes."*

In two days it drew **187 stars and 7 forks** — modest next to model-launch hype, but the star curve tells the real story: this solves an actual workflow problem. Anyone who has watched a 90-minute technical lecture knows the pain: the transcript alone loses the slides, the slides alone lose the context, and taking notes by hand means pausing every 30 seconds. course2md's bet is that the pipeline — download → detect slide changes → transcribe → interleave into timestamped notes — can be fully automated, locally, with one command.

## The Pipeline

```bash
# Process a Bilibili video
course2md https://www.bilibili.com/video/BV1pb8o6yE8f

# Process a YouTube video
course2md https://youtu.be/dQw4w9WgXcQ

# Process a local lecture or meeting recording
course2md ./lecture.mp4
```

Output lands in `out/<platform>/<title>/<id>/`: `course.md` and `course.html` (default formats), plus `structured.json` when requested, `frames/` with extracted slide keyframes (`slide_0001.jpg`...), `audio.wav` (16kHz mono), `timeline.jsonl` (timestamp-aligned event stream), `meta.json`, `run.json` (provenance: version, transcript source, provider/model, stats), and `media.mp4` (cleaned up by default).

The slide detection is the quietly impressive part. course2md samples frames at a configurable interval (default 1s), compares consecutive frames with **SSIM** against a similarity threshold (default 0.85), respects a cooldown between captures (10s) so it doesn't fire on every animation frame, and supports a region-of-interest so you can restrict comparison to the actual slide area (e.g. `40%,0%-100%,100%`). The result: the notes interleave the real slide images with the transcript at the right moments, not a screenshot every frame.

## The ASR Backend Story: Five Ways to Transcribe

course2md's real architecture is its ASR backend matrix — five providers, with a sensible default per platform:

| Backend | Target | Model | Highlights |
|---|---|---|---|
| `coreml` | macOS Apple Silicon (default) | Silero VAD + Qwen3-ASR 0.6B or Whisper large-v3-turbo | Zero external dependencies, ANE-powered, lowest power (~375 J / 3 min), auto-fallback to GPU on failure |
| `gpu` | Linux/Windows/Intel Mac | Qwen3-ASR 1.7B GGUF Q8 via llama-server | Fastest (13s for 3-min lecture on Metal), high precision |
| `cpu` | Universal fallback | Same, `-ngl 0` | Maximum compatibility, higher power |
| `api` | Any platform | OpenAI-compatible endpoint (OpenRouter default) | Zero local deps, ~$0.000035/s of audio, audio chunks uploaded |
| `npu` | Intel Core Ultra | OpenVINO Whisper Large-v3 Turbo | >6x faster than CPU, 550MB memory footprint |

The benchmark data in the README is unusually concrete — measured with `powermetrics` on a 3-minute 1080p lecture: CoreML at 47s wall / ~6.7W average with the Neural Engine doing the heavy lifting, GPU at 13s / 16W GPU burst, NPU at 16s. The accuracy table is the more interesting read: on the same CS lecture, **Qwen3-ASR 1.7B transcribed NeoVim, Altair 8800, ICQ, OICQ, and Codex flawlessly**, while Whisper large-v3-turbo produced *NeoWim* and *"PCG RTIR 8800"*, and Whisper Tiny hallucinated NeoVim as "cow smell" / "pinching tail" in Chinese. For technical content — especially Chinese/English mixed lectures — the model choice is the difference between usable and garbage.

## The LLM Layer: Polish and Summarize

After transcription, course2md can optionally call any OpenAI-compatible chat endpoint (DeepSeek, GLM, OpenAI, Ollama, vLLM) to **proofread** the transcript — correcting filler words, stutters, homophone typos and technical-term spelling while preserving meaning (no summarizing, adding or translating). It batches in 20-segment chunks at temperature 0, and if a batch fails or returns invalid JSON it falls back to raw ASR text and logs a warning instead of halting. A separate `course2md summarize` step generates a TL;DR / key points / timestamped outline with hallucination guards (timestamped-subtitles-only input, temperature 0, structured JSON output, map-reduce for long videos).

## Honest Limitations

The Linux/Windows story is the weakest part: local ASR needs `llama-server` from llama.cpp, and the README's Debian/Ubuntu path walks you through a cmake build. On macOS the Homebrew tap handles everything including the Developer-ID-signed binary and CoreML `mlx.metallib` — but that path needs macOS 15+ on Apple Silicon. First run downloads ~1-2GB of models (or ~2.4GB GGUF), and restricted networks need the `HF_ENDPOINT` mirror. Cloud STT mode uploads audio chunks to the provider — the privacy note is explicit that frames, OCR/SSIM and VAD stay local, but audio leaves the machine. And it's a two-day-old project: 187 stars, 7 forks, no release history, moving fast but young.

## Verdict and Who It's For

course2md is the most complete local-first video-to-notes pipeline we've seen this quarter: SSIM-based slide capture, five ASR backends with honest benchmarks, LLM polish and summarization, and real cross-platform packaging. The Qwen3-ASR focus is a genuine differentiator for technical and mixed-language content — the model quality gap it documents is exactly what makes or breaks lecture notes. It's not turnkey on Linux/Windows yet, and the first-run model download plus cloud-privacy tradeoff need a decision, but for Apple Silicon users and NPU laptops it's a Silver-tier pick that makes course watching dramatically more productive.

*Review based on public repo contents, README, and repository metadata as of 2026-09-02. Star/fork counts and features may change quickly for a two-day-old project.*
