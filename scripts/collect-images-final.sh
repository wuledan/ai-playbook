#!/bin/bash
# Collect real OG images for brand-specific articles
# Fall back to SVG covers via existing script

BASE="public/images"

# Known OG image URLs for brand articles
collect_og() {
  local url="$1"
  local output="$2"
  curl -sL --connect-timeout 8 --max-time 15 \
    -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
    "$url" -o "$output" 2>/dev/null
  if [ -f "$output" ] && [ $(stat -f%z "$output") -gt 15000 ]; then
    echo "✅ $output ($(stat -f%z "$output") bytes)"
    return 0
  else
    rm -f "$output"
    return 1
  fi
}

echo "=== Collecting Brand OG Images ==="

# Anthropic/Claude brand OG from their CDN
ANTHROPIC_OG="https://cdn.prod.website-files.com/67ce28cfec624e2b733f8a52/68309ab48369f7ad9b4a40e1_open-graph.jpg"
CLAUDE_OG="https://cdn.prod.website-files.com/6889473510b50328dbb70ae6/68c469d23594abeb9ab6ee48_70ed020ecf8fa028b9bc95fa819720b6_og_claude-generic.jpg"

# Claude articles all use same Claude brand image
echo "1. claude-4-opus-coding-review-2026"
collect_og "$CLAUDE_OG" "$BASE/reviews/claude-4-opus-coding-review-2026/cover.jpg"

echo "2. claude-data-analysis-review-2026"
collect_og "$CLAUDE_OG" "$BASE/reviews/claude-data-analysis-review-2026/cover.jpg"

echo "3. claude-artifacts-review-2026"
collect_og "$CLAUDE_OG" "$BASE/reviews/claude-artifacts-review-2026/cover.jpg"

echo "4. anthropic-mcp-ecosystem-review-2026"
collect_og "$ANTHROPIC_OG" "$BASE/reviews/anthropic-mcp-ecosystem-review-2026/cover.jpg"

echo "5. openai-codex-cli-review-2026"
# Try OpenAI brand image
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://openai.com" -o /tmp/openai_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/openai_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/openai-codex-cli-review-2026/cover.jpg"
fi

echo "6. chatgpt-search-review-2026"
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/openai_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/chatgpt-search-review-2026/cover.jpg"
fi

echo "7. perplexity-ai-pages-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://www.perplexity.ai" -o /tmp/perplexity_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/perplexity_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/perplexity-ai-pages-review-2026/cover.jpg"
fi

echo "8. github-copilot-agent-mode-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://github.com/features/copilot" -o /tmp/github_page.html 2>/dev/null
OG=$(grep -ioP 'property="og:image".*?content="\K[^"]+' /tmp/github_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/github-copilot-agent-mode-review-2026/cover.jpg"
fi

echo "9. deepseek-chat-web-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://chat.deepseek.com" -o /tmp/deepseek_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/deepseek_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/deepseek-chat-web-review-2026/cover.jpg"
fi

echo "10. cursor-tab-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://www.cursor.com" -o /tmp/cursor_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/cursor_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/cursor-tab-review-2026/cover.jpg"
fi

echo "11. elevenlabs-text-to-speech-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://elevenlabs.io" -o /tmp/eleven_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/eleven_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/elevenlabs-text-to-speech-review-2026/cover.jpg"
fi

echo "12. warp-terminal-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://www.warp.dev" -o /tmp/warp_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/warp_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/warp-terminal-review-2026/cover.jpg"
fi

echo "13. notion-ai-2026-review"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://www.notion.so" -o /tmp/notion_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/notion_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/notion-ai-2026-review/cover.jpg"
fi

echo "14. replit-core-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://replit.com" -o /tmp/replit_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/replit_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/replit-core-review-2026/cover.jpg"
fi

echo "15. google-veo-2-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://deepmind.google" -o /tmp/deepmind_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/deepmind_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/google-veo-2-review-2026/cover.jpg"
fi

echo "16. gemini-advanced-2026-review"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://deepmind.google/gemini" -o /tmp/gemini_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/gemini_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/gemini-advanced-2026-review/cover.jpg"
fi

echo "17. mcp-server-marketplace-review-2026"
curl -sL --connect-timeout 8 --max-time 15 \
  -A "Mozilla/5.0" \
  "https://modelcontextprotocol.io" -o /tmp/mcp_page.html 2>/dev/null
OG=$(grep -ioP 'og:image.*?content="\K[^"]+' /tmp/mcp_page.html 2>/dev/null | head -1)
if [ -n "$OG" ]; then
  collect_og "$OG" "$BASE/reviews/mcp-server-marketplace-review-2026/cover.jpg"
fi

echo ""
echo "=== Collection Results ==="
echo "Covers collected:"
find "$BASE" -name "cover.jpg" -newer "content-plan-2026-06-05.json" -type f | wc -l
echo "Total sizes:"
find "$BASE" -name "cover.jpg" -newer "content-plan-2026-06-05.json" -type f -exec du -sh {} \; | wc -l
echo "files with size"
