#!/bin/bash
# Step 1: Batch Image Collection - collect OG images from brand websites
# Priority: brand sites > generated covers

PROXY="socks5h://127.0.0.1:7897"
BASE="public/images"

collect_og() {
  local url="$1"
  local output="$2"
  local og_url=$(curl --proxy "$PROXY" -sL --connect-timeout 10 --max-time 15 "$url" 2>/dev/null | 
    sed -n 's/.*<meta[^>]*property="og:image"[^>]*content="\([^"]*\)".*/\1/p' | head -1)
  
  # Also try alternate og:image format
  if [ -z "$og_url" ]; then
    og_url=$(curl --proxy "$PROXY" -sL --connect-timeout 10 --max-time 15 "$url" 2>/dev/null | 
      sed -n 's/.*content="\([^"]*\)"[^>]*property="og:image".*/\1/p' | head -1)
  fi

  if [ -n "$og_url" ] && [ "$og_url" != "" ]; then
    echo "  OG: $og_url"
    curl --proxy "$PROXY" -sL --connect-timeout 10 --max-time 20 "$og_url" -o "$output" 2>/dev/null
    if [ -f "$output" ] && [ $(stat -f%z "$output" 2>/dev/null || stat -c%s "$output" 2>/dev/null || echo 0) -gt 10000 ]; then
      echo "  ✅ Saved to $output ($(stat -f%z "$output" 2>/dev/null) bytes)"
      return 0
    else
      rm -f "$output"
      echo "  ⚠️ OG image too small or failed"
      return 1
    fi
  else
    echo "  ❌ No OG image found"
    return 1
  fi
}

echo "=== Collecting brand OG images ==="

# --- REVIEWS ---

# Claude 4 Opus Coding Review
echo "1/44: claude-4-opus-coding-review-2026"
collect_og "https://claude.ai" "$BASE/reviews/claude-4-opus-coding-review-2026/cover.jpg"

# Google Veo 2 Review
echo "2/44: google-veo-2-review-2026"
collect_og "https://deepmind.google" "$BASE/reviews/google-veo-2-review-2026/cover.jpg"

# MCP Server Marketplace Review
echo "3/44: mcp-server-marketplace-review-2026"
collect_og "https://modelcontextprotocol.io" "$BASE/reviews/mcp-server-marketplace-review-2026/cover.jpg"

# OpenAI Codex CLI Review
echo "4/44: openai-codex-cli-review-2026"
collect_og "https://openai.com" "$BASE/reviews/openai-codex-cli-review-2026/cover.jpg"

# Claude Data Analysis Review
echo "5/44: claude-data-analysis-review-2026"
collect_og "https://claude.ai" "$BASE/reviews/claude-data-analysis-review-2026/cover.jpg"

# Perplexity AI Pages Review
echo "6/44: perplexity-ai-pages-review-2026"
collect_og "https://www.perplexity.ai" "$BASE/reviews/perplexity-ai-pages-review-2026/cover.jpg"

# Gemini Advanced Review
echo "7/44: gemini-advanced-2026-review"
collect_og "https://gemini.google.com" "$BASE/reviews/gemini-advanced-2026-review/cover.jpg"

# GitHub Copilot Agent Mode Review
echo "8/44: github-copilot-agent-mode-review-2026"
collect_og "https://github.com/features/copilot" "$BASE/reviews/github-copilot-agent-mode-review-2026/cover.jpg"

# Replit Core Review
echo "10/44: replit-core-review-2026"
collect_og "https://replit.com" "$BASE/reviews/replit-core-review-2026/cover.jpg"

# Anthropic MCP Ecosystem Review
echo "11/44: anthropic-mcp-ecosystem-review-2026"
collect_og "https://www.anthropic.com" "$BASE/reviews/anthropic-mcp-ecosystem-review-2026/cover.jpg"

# DeepSeek Chat Web Review
echo "12/44: deepseek-chat-web-review-2026"
collect_og "https://chat.deepseek.com" "$BASE/reviews/deepseek-chat-web-review-2026/cover.jpg"

# Cursor Tab Review
echo "13/44: cursor-tab-review-2026"
collect_og "https://www.cursor.com" "$BASE/reviews/cursor-tab-review-2026/cover.jpg"

# ElevenLabs Text-to-Speech Review
echo "14/44: elevenlabs-text-to-speech-review-2026"
collect_og "https://elevenlabs.io" "$BASE/reviews/elevenlabs-text-to-speech-review-2026/cover.jpg"

# Warp Terminal Review
echo "15/44: warp-terminal-review-2026"
collect_og "https://www.warp.dev" "$BASE/reviews/warp-terminal-review-2026/cover.jpg"

# Notion AI 2026 Review
echo "16/44: notion-ai-2026-review"
collect_og "https://www.notion.so" "$BASE/reviews/notion-ai-2026-review/cover.jpg"

# ChatGPT Search Review
echo "17/44: chatgpt-search-review-2026"
collect_og "https://chatgpt.com" "$BASE/reviews/chatgpt-search-review-2026/cover.jpg"

# Claude Artifacts Review
echo "18/44: claude-artifacts-review-2026"
collect_og "https://claude.ai" "$BASE/reviews/claude-artifacts-review-2026/cover.jpg"

echo ""
echo "=== Collection complete ==="
echo "Checking what we got:"
find "$BASE" -name "cover.*" -newer "content-plan-2026-06-05.json" -type f | wc -l
echo "images collected"
