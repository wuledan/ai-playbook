#!/bin/bash
# Batch 4: Image Collection Script
# Collects cover images for 8 articles by fetching OG images from brand websites

PROXY="socks5h://127.0.0.1:7897"
BASE="public/images"

# Article 1: elevenlabs-vs-playht-vs-murf-2026
# Brands: ElevenLabs, PlayHT, Murf
mkdir -p "$BASE/comparisons/elevenlabs-vs-playht-vs-murf-2026"
echo "=== Collecting ElevenLabs OG image ==="
curl --proxy "$PROXY" -sL https://elevenlabs.io 2>/dev/null | sed -n 's/.*og:image[^c]*content="\([^"]*\)".*/\1/p' | head -1
echo "=== Collecting Murf OG image ==="
curl --proxy "$PROXY" -sL https://murf.ai 2>/dev/null | sed -n 's/.*og:image[^c]*content="\([^"]*\)".*/\1/p' | head -1

# Article 2: canva-ai-vs-adobe-express-vs-microsoft-designer-2026
mkdir -p "$BASE/comparisons/canva-ai-vs-adobe-express-vs-microsoft-designer-2026"

# Article 3: claude-code-vs-cursor-vs-copilot-vs-codex-cli-2026
mkdir -p "$BASE/comparisons/claude-code-vs-cursor-vs-copilot-vs-codex-cli-2026"

# Article 4: runway-vs-pika-vs-kling-vs-sora-2026
mkdir -p "$BASE/comparisons/runway-vs-pika-vs-kling-vs-sora-2026"

# Tutorials
for slug in build-ai-youtube-automation-2026 master-perplexity-deep-research-2026 build-ai-agents-claude-code-2026 n8n-ai-automation-workflows-2026; do
  mkdir -p "$BASE/tutorials/$slug"
done

echo "=== Directories created ==="
ls -la "$BASE/comparisons/" | grep -E "elevenlabs|canva-ai|claude-code|runway"
echo "---"
ls -la "$BASE/tutorials/" | grep -E "youtube|perplexity|claude-code|n8n"
