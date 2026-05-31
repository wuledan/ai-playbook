---
title: "AI-Powered Podcast Production 2026 — From Recording to Publishing with Descript, ElevenLabs & Auphonic"
date: 2026-06-01
author: "AIPlaybook Editorial Team"
category: "Content-Creation"
tags: [tutorial, podcast, descript, elevenlabs, auphonic, audio-production]
cover: "/images/tutorials/ai-podcast-production-tutorial-2026/cover.png"
difficulty: beginner
meta_description: "Complete step-by-step guide to producing a podcast with AI tools: Descript for editing, ElevenLabs for voice cloning, and Auphonic for audio mastering. From raw recording to RSS feed."
---

## Overview

Podcasting in 2026 has been transformed by AI. What once required expensive studio equipment, hours of manual editing, and professional audio engineers can now be done with three AI tools working together. This tutorial walks you through producing a complete podcast episode — from raw recording to published RSS feed — using Descript for AI-powered editing, ElevenLabs for voice cloning and filler-word removal, and Auphonic for broadcast-quality audio mastering. You'll learn how to edit audio like a word processor, generate synthetic voiceovers, and automatically level your audio to professional standards. No prior podcasting or audio engineering experience required.

## Prerequisites

- A computer running macOS, Windows, or Linux (16GB RAM recommended for Descript)
- A microphone (built-in is OK for testing, USB/XLR preferred for production)
- Descript account (free tier works; Pro tier at $24/month unlocks features)
- ElevenLabs account (free tier: 10,000 characters/month; Starter at $5/month)
- Auphonic account (free tier: 2 hours/month; Pay-as-you-go at $12/hour)
- A 5-10 minute raw audio recording (could be a solo monologue or conversation)
- Optional: hosting platform account (Buzzsprout, Transistor, or Spotify for Podcasters)
- Node.js 18+ and FFmpeg installed (for optional local processing)

## Step 1: Record Your Raw Audio

Before any AI magic, you need raw source material. Use any recording tool — Descript has a built-in recorder, or use QuickTime (Mac), Voice Recorder (Windows), or OBS Studio (cross-platform).

**Recording best practices:**
- Record in a quiet room with soft furnishings to minimize echo
- Keep your microphone 6-12 inches from your mouth
- Record at 48kHz/16-bit WAV or FLAC for best quality
- Record for 5-10 minutes — don't worry about mistakes, filler words, or pauses

**Command-line recording with FFmpeg (optional):**
```bash
# List audio devices
ffmpeg -f avfoundation -list_devices true -i ""

# Record from built-in microphone
ffmpeg -f avfoundation -i ":0" -acodec pcm_s16le -ar 48000 -ac 1 \
  podcast_raw.wav
```

## Step 2: Import and Transcribe in Descript

Descript uses AI to transcribe your audio instantly, turning the waveform into editable text.

1. Open Descript → New Project → "Import" → select your `podcast_raw.wav`
2. Descript automatically transcribes the file. Wait 30-60 seconds for a 10-minute recording.
3. Review the transcript. Descript's speaker detection labels different voices automatically
4. If speaker labels are wrong: click on a word → "Change Speaker" → assign to correct speaker

**Pro tip:** Click the "Transcription" menu → "Retranscribe" if you need to switch the AI model. The "Studio" model is most accurate for English podcasts.

## Step 3: Edit Your Podcast Like a Word Processor

The killer feature: delete text in the transcript, and the audio is deleted too. No waveform cutting required.

**Remove filler words:**
1. Click the "Studio" panel (wand icon) → "Remove Filler Words"
2. Check: "um", "uh", "like", "you know", "actually"
3. Click "Apply" — Descript removes them and uses AI to smooth the gaps

**Cut mistakes and pauses:**
1. Highlight the text of a mistake in the transcript
2. Press Delete — the audio is removed
3. For long silences: Studio panel → "Remove Silence" → threshold at 0.5s

**Rearrange sections:**
1. Select a paragraph in the transcript
2. Cut (⌘X) and paste (⌘V) to reposition the entire audio clip
3. Descript crossfades transitions automatically

**Add a "Regenerate" section with AI voice:**
1. Place your cursor where you want new audio
2. Click the "+" icon → "AI Actions" → "Generate Audio"
3. Type: "Welcome back to the show. In this episode, we're exploring how AI is reshaping..."
4. Choose your voice (ElevenLabs integration if connected; otherwise Descript's stock voices)
5. Click "Generate" — synthetic audio is inserted seamlessly

**Export the raw transcript for review:**
1. File → Export → "Transcript (TXT)" — save as `episode_transcript.txt`
2. Share with a guest or editor for fact-checking before final polish

## Step 4: Enhance with ElevenLabs AI Voice

ElevenLabs takes your podcast to the next level with voice cloning, multilingual dubbing, and ultra-realistic text-to-speech.

**Option A: Voice cloning for consistent narration:**
1. In ElevenLabs, go to "Voice Lab" → "Voice Cloning"
2. Upload a 3+ minute clean recording of your voice (no background noise)
3. ElevenLabs creates a voice model (instant cloning in version 2+)
4. Name it "Podcast Host Voice"
5. Go to "Speech Synthesis" → select your cloned voice
6. Enter any script and click "Generate"
7. Download the WAV file — this sounds indistinguishable from your real voice

**Option B: Dub your podcast into multiple languages:**
1. In ElevenLabs, go to "Dubbing" → "New Dubbing"
2. Upload your exported Descript WAV file
3. Select source language (e.g., English) and target languages (e.g., Spanish, Japanese, German)
4. Speaker detection will map each voice automatically
5. Click "Dub" — wait 2-5 minutes per language
6. Download each dubbed track as a separate WAV file

**Fix filler words at the AI level:**
1. ElevenLabs Pro users: Enable "Automatic Filler Word Removal" in project settings
2. Set sensitivity to "High" — it catches 90%+ of umms and ahhs at this level

## Step 5: Master Audio with Auphonic

Auphonic uses AI to apply broadcast-quality leveling, noise reduction, and loudness normalization.

1. Go to [Auphonic.com](https://auphonic.com) → "New Production"
2. Upload your edited WAV from Descript (or the dubbed version from ElevenLabs)
3. Configure these settings:
   - **Algorithm:** "Humans" (for speech) or "Humans and Music" (if you have intro/outro music)
   - **Loudness target:** -16 LUFS (podcast standard; -23 LUFS for broadcast)
   - **Leveler strength:** 65% (balances volume fluctuations without sounding compressed)
   - **Noise reduction:** Enable + set to "Medium" — removes fan hum, AC noise, traffic rumble
   - **Filter infrasound and ultrasound:** Enable — removes sub-20Hz rumbles
4. Add **intro/outro music**: upload your theme song, set fade-in at 0.5s, fade-out at 3s
5. Click "Start Processing" — Auphonic runs AI analysis for 2-3 minutes
6. Download the result: choose WAV 48kHz/24-bit for maximum quality

**Verify loudness compliance:**
```bash
# Check integrated loudness with FFmpeg
ffmpeg -i episode_mastered.wav -af loudnorm=I=-16:dual_mono=true -f null -
# Look for "Integrated loudness: I = -16.0 LUFS" — target achieved
```

## Step 6: Generate Show Notes and Metadata with AI

Use the transcript from Step 3 to auto-generate episode metadata.

**Option: Use Descript's AI show notes:**
1. In Descript, click "AI Actions" → "Generate Show Notes"
2. Select format: "Timestamps + Summary + Key Takeaways"
3. The AI produces a formatted document ready for your RSS feed

**Option: Use a local script with Claude/OpenAI API:**
```python
from openai import OpenAI
client = OpenAI()

with open("episode_transcript.txt", "r") as f:
    transcript = f.read()

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{
        "role": "system",
        "content": "Generate podcast show notes with: 1) 2-sentence summary, 2) 3 key takeaways as bullet points, 3) 5 timestamped highlights."
    }, {
        "role": "user",
        "content": f"Transcript:\n{transcript[:10000]}"
    }]
)
show_notes = response.choices[0].message.content
print(show_notes)
```

## Step 7: Upload to Your Podcast Host

1. Log into your hosting platform (e.g., Buzzsprout, Transistor, Spotify for Podcasters)
2. Click "New Episode"
3. Upload your Auphonic-mastered `episode_mastered.wav`
4. Paste the AI-generated show notes into the description field
5. Set publish date and time
6. Add episode artwork (use Canva AI or Midjourney for generated cover art)
7. Click "Publish" — your hosting platform generates the RSS feed

**Test the RSS feed:**
```bash
# Validate RSS feed URL
curl -s "https://yourpodcast.libsyn.com/rss" | head -50
# Look for valid XML with <channel>, <item>, <enclosure> tags
```

## Step 8 (Advanced): Automate the Pipeline with n8n

Set up an n8n workflow that triggers when you drop a raw WAV into a Google Drive folder:

1. **Trigger:** Google Drive → "File Watcher" on `/Podcast/Raw/` folder
2. **Upload to Descript:** Use Descript API → create project → import file
3. **Wait for transcription** → use webhook to detect completion
4. **Export transcript:** Descript API → export TXT
5. **Generate notes:** OpenAI node → send transcript → receive show notes
6. **Upload to Auphonic:** Auphonic API → process audio → download mastered file
7. **Publish:** Webhook → Buzzsprout/Transistor API → create episode

This pipeline cuts your per-episode time from 2-3 hours to ~15 minutes.

## What You've Built

You now have a complete, professionally produced podcast episode:
- Clean, edited audio with no filler words or awkward pauses
- Synthetic voiceovers or dubs in multiple languages
- Broadcast-quality mastering at -16 LUFS
- AI-generated show notes and metadata
- An RSS-ready episode file

The entire workflow takes under 30 minutes for a 10-minute episode, compared to 2-3 hours with traditional tools.

## Troubleshooting

**AI voice sounds robotic or unnatural:**
Ensure your ElevenLabs voice clone was trained on at least 3 minutes of clean audio. For better results, use the "Professional Voice Cloning" plan ($99/month) which supports 30+ minutes of training data. Also check that the Stability slider in ElevenLabs is set to 40-50% — too high produces monotone output.

**Auphonic introduces distortion on music segments:**
If your podcast has intro/outro music, set Algorithm to "Humans and Music" and reduce Leveler strength to 45%. Music transitions should use short crossfades (0.5s) to avoid the leveler overcompensating on silence gaps.

**Descript transcription is inaccurate for technical terms:**
Upload a custom vocabulary list: Descript → Project → "Custom Vocabulary" → add domain-specific terms like "LangChain", "RAG pipeline", "vector embedding". The transcription engine will prioritize these terms.

**Podcast audio is too quiet compared to other shows:**
Common issue. Your target should be -16 LUFS (integrated) with -1 dB true peak. Use the FFmpeg verification command from Step 5. If Auphonic's output is still quiet, increase "Leveler Makeup Gain" to 60-70%.

**Dubbing produces out-of-sync audio:**
ElevenLabs dubbing adds some processing delay. In your podcast editor, align the dubbed track's first word with the original's first word, then use "Sync All" in Descript to auto-align the rest.

## Next Steps

- Explore Descript's "Eye Contact" feature for video podcasts (AI reframes your eyes to look at the camera)
- Set up ElevenLabs "Sound Effects" to add SFX from text descriptions
- Build an automated publishing pipeline with the GitHub Actions + n8n integration described in Step 8
- Try Auphonic's "Multitrack Production" for interviews with remote guests
- Distribute your RSS feed to Apple Podcasts, Spotify, Google Podcasts, and Amazon Music
