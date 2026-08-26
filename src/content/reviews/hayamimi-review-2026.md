---
title: "hayamimi Review 2026 — Real-Time Multilingual Speech-to-Text on CPU Only, No Cloud, Under 2GB RAM"
date: 2026-08-27
author: "AIPlaybook Editorial Team"
category: "Audio"
tags:
  - "hayamimi"
  - "Speech-to-Text"
  - "ASR"
  - "Real-Time"
  - "Local-First"
  - "sherpa-onnx"
  - "Multilingual"
  - "Subtitles"
  - "OBS"
  - "Open-Source"
cover: /images/reviews/hayamimi-review-2026/cover.png
meta_description: "hayamimi (早耳) is a real-time, multilingual speech-to-text pipeline that runs on CPU only — live subtitles, a browser dashboard, speaker labels, and on-the-fly translation, with no GPU, no cloud API, and under 2GB RAM. Instead of one general-purpose Whisper model, it routes each utterance to a language-specialist model via sherpa-onnx, cutting Japanese broadcast CER from 13.8% (whisper-large-v3-turbo) to 5.8% while running 10-50x realtime on a 6-core desktop CPU."
rating: 7.5
dimensions:
  ease-of-use: 6.5
  features: 8
  value: 8
  performance: 8.5
  ecosystem: 6.5
pros:
  - "The routing architecture is the story: instead of accepting Whisper's accuracy ceiling, hayamimi runs a spoken-language classifier on the first ~4s of each segment and routes it to a best-in-class specialist model (ReazonSpeech for ja, Paraformer-zh for zh, SenseVoice for ko/yue, Parakeet TDT v3 for en+24 EU languages, Meta Omnilingual ASR as the ~1600-language fallback)"
  - "Measured results are concrete and honest: 5.8% CER on real Japanese broadcast audio vs whisper-large-v3-turbo's 13.8% on the same clips (less than half the error rate), ~100ms mean final latency for Japanese, and under 2GB RAM with LRU model eviction"
  - "CPU-only by construction — every model runs as quantized INT8 ONNX via sherpa-onnx, no PyTorch, no CUDA, and each route runs 9-16x faster than realtime on a desktop CPU (RTF well under 0.2)"
  - "Real-time UX done right: partial subtitles update every ~0.5s while you are still speaking, a finalized line lands ~100ms after you stop, and a two-pass refinement re-decodes utterance groups after 2s of silence (ja real-broadcast CER 15.5% -> 12.0%)"
  - "Practical streaming features: speaker labels via CAM++ embeddings, live translation (ja to en/zh/ko), an OBS browser-source overlay, a live dashboard, and a WebSocket ingest so a phone or ESP32 can stream mic audio over the LAN"
  - "MIT-licensed code with a genuinely honest limitations list — code-switching, hotwords on the ja tier, diarization and translation ceilings are all documented with measured failure cases"
cons:
  - "Setup is heavy: ~3.1GB of pretrained models (--minimal gives a ~1.1GB ja/en-only install), Python 3.10+ and ffmpeg on PATH, and multiple model licenses to track — one ja->en translation model is CC BY-SA 4.0 share-alike, which affects redistribution of that model's weights"
  - "Windows 11 is the only fully tested platform; macOS/Linux are expected to work but are not yet CI-tested end to end"
  - "Code-switching mid-sentence is not supported — the router picks one language per utterance, so a sentence mixing Japanese and English within itself will have the minority-language portion mangled or dropped"
  - "--hotwords currently has no effect on the Japanese ReazonSpeech tier (byte-level BPE incompatibility), so proper-noun biasing relies on the post-hoc --replace dictionary there"
  - "--speakers does turn-taking labeling, not true diarization — two overlapping speakers get one label"
  - "Translation quality has a real ceiling: FuguMT (ja->en) and M2M-100 (ja->zh/ko) are small models, and numeric values are not reliably preserved in ja->zh/ko — don't rely on it for anything financial"
best-for: "Streamers, interpreters, language learners and privacy-conscious users who want live multilingual subtitles and translation entirely on their own hardware — no GPU, no cloud, no subscription — with OBS integration and LAN-based phone/ESP32 mic input"
price: "Free (MIT; ~3.1GB model download, or ~1.1GB minimal ja/en install)"
---

# hayamimi Review 2026 — Real-Time Multilingual Speech-to-Text on CPU Only, No Cloud, Under 2GB RAM

## Quick Verdict

**hayamimi (早耳 — "quick ear") is a real-time, multilingual speech-to-text pipeline that runs entirely on CPU: live subtitles, a browser dashboard, speaker labels, and on-the-fly translation — no GPU, no cloud API, under 2GB RAM.** The design goal is stated in its name: partial subtitles appear while you're still talking, and a finalized line lands roughly **100ms after you stop**.

The technical bet is what makes it interesting. Most CPU-only real-time transcription setups fall back to a single general-purpose Whisper model and accept its accuracy ceiling. hayamimi instead routes **each utterance to whichever specialist model is best for its language**, all running as quantized INT8 ONNX models via sherpa-onnx. On real broadcast Japanese audio, that routing gets **5.8% CER — less than half of whisper-large-v3-turbo's 13.8% on the same clips** — while running 10-50x realtime on a 6-core desktop CPU.

Created 2026-08-25 (MIT, ~250 stars in two days), hayamimi is the rare local-first ASR project that publishes a real end-to-end scorecard, an honest limitations list, and a documented iteration log with 30+ measured changes.

## Features

### Five-route language catalog

| Route | Languages | Model |
| --- | --- | --- |
| ja | Japanese | ReazonSpeech (Zipformer) |
| zh | Chinese | Paraformer-zh |
| ko / yue | Korean / Cantonese | SenseVoice small |
| en + 24 EU | English + European | Parakeet TDT v3 |
| fallback | ~1600 languages | Meta Omnilingual ASR |

A whisper-tiny spoken-LID classifier runs on the first ~4s of each segment (with char-set arbitration) and tags the language; the segment then routes to the specialist model. Everything else (~1600 languages) falls back to Meta's Omnilingual ASR — so "multilingual" is not a marketing lie, it is a routing table with a real tail.

### Real-time UX

- **Partial subtitles**: in-progress draft text updates every ~0.5s while you're still speaking
- **Fast finals**: a finalized line typically lands ~100ms after you stop talking (ja)
- **Two-pass refinement**: after 2s of silence, recent utterances are batch re-decoded for a higher-accuracy "clean" transcript (ja real-broadcast CER 15.5% -> 12.0%)

The pipeline: Silero VAD (0.35s end-of-speech + 0.8s preroll) → spoken-LID on the first ~4s → routing → specialist decode → ja punctuation (BERT restore) → optional speaker labels and translation → dashboard/OBS overlay/transcript file. Models are lazy-loaded on first use, with an LRU cache (`--max-resident`, default 3) evicting least-recently-used non-Japanese models so memory stays bounded no matter how many languages a session wanders through.

### Dashboard, OBS overlay, network audio

`--serve` starts a local server (port 8833) with three views:

- **`/dashboard`** — live partial-text strip, finals feed with language badges, speaker chips, per-line latency, inline translations, and a second column with the refined two-pass transcript
- **`/`** — a minimal OBS browser-source overlay (add the URL as a Browser Source for stream captions)
- **`/transcript`** — plain scrolling transcript history

`--input ws` runs a WebSocket ingest endpoint instead of reading the local microphone, so a phone or a stackchan-class ESP32 board can stream mic audio over the LAN and get it transcribed through the same pipeline — the server resamples non-16kHz audio and replies with the same partial/final/translation/refine JSON events, so a client can show its own subtitles too.

### Measured performance

End-to-end (LID → routing → decode → ja punctuation), real speech, single clips (no preroll/two-pass). `en` uses WER, all others CER:

| Language | Clips | LID accuracy | Mean error | Mean RTF |
| --- | --- | --- | --- | --- |
| ja | 15 | 15/15 | 7.5% | 0.071 |
| en | 15 | 15/15 | 2.3% | 0.109 |
| zh | 12 | 12/12 | 5.3% | 0.102 |
| ko | 12 | 12/12 | 8.1% | 0.062 |
| yue | 12 | 12/12 | 6.1% | 0.061 |

RTF well under 0.2 across every route means each route runs 9-16x faster than realtime on CPU alone. Headline numbers from the full iteration log: **ja CER 5.8%** (beam search) vs whisper-large-v3-turbo's 13.8%; ~100ms mean final latency (ja, punctuated); ~236ms mean / 552ms max across a 5-language soak test with every feature enabled; <2GB RAM (1.35GB at `--max-resident 2`).

## Pricing

Free, MIT-licensed source. `pip install -r requirements.txt` + `scripts/download_models.py` pulls ~3.1GB of pretrained models into `models/` (git-ignored); `--minimal` gives a ~1.1GB ja/en-only install (ReazonSpeech, whisper-tiny, Silero VAD, Japanese punctuation). No model weights are committed to the repo — each carries its own license from its original publisher (`THIRD_PARTY_NOTICES.md` has the full table). One model is not permissive: the ja->en translation model is **CC BY-SA 4.0 (share-alike)** — redistribution of that model's weights must stay share-alike, which does not affect hayamimi's own MIT code or the `--translate zh,ko` path (M2M-100, MIT).

## Use Case: Privacy-First Live Subtitles for a Stream

1. `python -m venv .venv && .venv/bin/pip install -r requirements.txt && .venv/bin/python scripts/download_models.py --minimal`.
2. `.venv/bin/python scripts/realtime_transcribe.py --serve --speakers --translate en` — mic input, dashboard at localhost:8833, OBS overlay ready.
3. Add `http://localhost:8833/` as an OBS Browser Source — live Japanese subtitles with speaker labels and inline English translation appear on stream, with zero audio leaving the machine.
4. For a phone mic, add `--input ws`: the phone streams PCM over WebSocket to `ws://<host>:8766/ingest` and the same dashboard/overlay renders it.
5. After 2s of silence, the two-pass refinement quietly replaces recent utterances with the cleaner batch re-decode in the second dashboard column.

The result: full multilingual live captioning with translation, on a mid-range laptop, no GPU, no cloud account, no per-minute cost.

## Pros & Cons

**Pros:** specialist-model routing beats single-model Whisper accuracy by a wide margin on the benchmarked languages; genuinely CPU-only with bounded memory; fast, real-time UX with partials, ~100ms finals and two-pass refinement; OBS overlay + dashboard + LAN WebSocket ingest; honest, quantified limitations; MIT code with clear third-party license tracking.

**Cons:** heavy model download and Python/ffmpeg setup; Windows-11-tested only; no mid-sentence code-switching; hotwords broken on the ja tier; no true diarization; translation quality ceiling on numeric content; mic pipeline independently unverified beyond the project's own tests.

## Alternatives

| Approach | Model | Accuracy (ja broadcast) | Hardware | Privacy |
| --- | --- | --- | --- | --- |
| **hayamimi** | Routed specialists (5 routes + fallback) | 5.8% CER | CPU only, <2GB RAM | Fully local |
| **Whisper large-v3-turbo (local)** | Single general-purpose | 13.8% CER (same clips) | GPU recommended | Local |
| **Cloud STT** (Deepgram, AssemblyAI, etc.) | Proprietary | Varies, strong | None | Audio leaves machine |
| **OBS auto-captions** | Platform STT | Varies | Cloud | Cloud-dependent |

For privacy-sensitive live use (streaming, interpreting, language learning) hayamimi is the only serious CPU-only option that beats Whisper on its home turf while keeping everything on-device — at the cost of a heavier setup and a Windows-first support story.

## FAQ

**Does hayamimi need a GPU?** No — every model runs as quantized INT8 ONNX via sherpa-onnx, no PyTorch, no CUDA. RTF is under 0.2 on every route (9-16x realtime) on a 6-core desktop CPU.

**How much RAM and disk?** Under 2GB RAM at default settings (1.35GB at `--max-resident 2`). Disk: ~3.1GB for the full model catalog, ~1.1GB for the minimal ja/en install.

**Can it handle mixed-language speech?** Utterance-level switching works well (e.g. an interpreter alternating full sentences). Mid-sentence code-switching is not supported — the router picks one language per utterance.

**Is my audio ever uploaded?** No. The entire pipeline runs locally; `--serve` binds a local dashboard and OBS overlay, and `--input ws` listens on your LAN only. No cloud API is involved.

**What's the catch with hotwords?** `--hotwords` currently has no effect on the Japanese ReazonSpeech tier (byte-level BPE incompatibility — sherpa-onnx only warns on stderr). Use the `--replace` dictionary for Japanese proper nouns instead.
