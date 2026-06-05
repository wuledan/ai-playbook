#!/bin/bash
# Step 1: Batch Image Collection for June 6, 2026
# Collect OG images from brand websites for 40 pending articles
# Priority: brand sites > 

PROXY="socks5h://127.0.0.1:7897"
BASE="public/images"

collect_og() {
  local url="$1"
  local output="$2"
  mkdir -p "$(dirname "$output")"

  # Try to get og:image
  local og_url=$(curl --proxy "$PROXY" -sL --connect-timeout 10 --max-time 15 "$url" 2>/dev/null | 
    sed -n 's/.*<meta[^>]*property="og:image"[^>]*content="\([^"]*\)".*/\1/p' | head -1)
  
  if [ -z "$og_url" ]; then
    og_url=$(curl --proxy "$PROXY" -sL --connect-timeout 10 --max-time 15 "$url" 2>/dev/null | 
      sed -n 's/.*content="\([^"]*\)"[^>]*property="og:image".*/\1/p' | head -1)
  fi

  if [ -n "$og_url" ]; then
    curl --proxy "$PROXY" -sL --connect-timeout 10 --max-time 20 "$og_url" -o "$output" 2>/dev/null
    if [ -f "$output" ] && [ $(stat -f%z "$output" 2>/dev/null) -gt 10000 ]; then
      echo "  ✅ Saved $output ($(stat -f%z "$output" 2>/dev/null) bytes)"
      return 0
    else
      rm -f "$output"
      echo "  ⚠️ Failed or too small"
      return 1
    fi
  else
    echo "  ❌ No OG image on $url"
    return 1
  fi
}

collect_fallback() {
  local output="$1"
  local slug="$2"
  # Try Google favicon as placeholder
  local favicon="https://www.google.com/s2/favicons?domain=$(echo "$slug" | sed 's/-review-2026//;s/-2026//' | tr '-' '.')&sz=256"
  curl --proxy "$PROXY" -sL --connect-timeout 5 --max-time 10 "$favicon" -o "$output" 2>/dev/null
  if [ -f "$output" ] && [ $(stat -f%z "$output" 2>/dev/null) -gt 5000 ]; then
    echo "  ✅ Favicon fallback: $output"
    return 0
  fi
  rm -f "$output"
  return 1
}

echo "=== Batch Image Collection: June 6, 2026 ==="
echo ""

###############################
# REVIEWS (19 articles)
###############################
echo "=== REVIEWS ==="

echo "1/40: claude-4-opus-coding-review-2026"
collect_og "https://claude.ai" "$BASE/reviews/claude-4-opus-coding-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/claude-4-opus-coding-review-2026/cover.jpg" "anthropic"

echo "2/40: google-veo-2-review-2026"
collect_og "https://deepmind.google/technologies/veo/" "$BASE/reviews/google-veo-2-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/google-veo-2-review-2026/cover.jpg" "deepmind.google"

echo "3/40: mcp-server-marketplace-review-2026"
collect_og "https://modelcontextprotocol.io" "$BASE/reviews/mcp-server-marketplace-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/mcp-server-marketplace-review-2026/cover.jpg" "anthropic"

echo "4/40: openai-codex-cli-review-2026"
collect_og "https://openai.com/index/codex-cli/" "$BASE/reviews/openai-codex-cli-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/openai-codex-cli-review-2026/cover.jpg" "openai"

echo "5/40: claude-data-analysis-review-2026"
collect_og "https://claude.ai" "$BASE/reviews/claude-data-analysis-review-2026/cover.jpg" || echo "  ⚠️ Already may have cover"

echo "6/40: perplexity-ai-pages-review-2026"
collect_og "https://www.perplexity.ai" "$BASE/reviews/perplexity-ai-pages-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/perplexity-ai-pages-review-2026/cover.jpg" "perplexity.ai"

echo "7/40: gemini-advanced-2026-review"
collect_og "https://gemini.google.com" "$BASE/reviews/gemini-advanced-2026-review/cover.jpg" || collect_fallback "$BASE/reviews/gemini-advanced-2026-review/cover.jpg" "gemini.google.com"

echo "8/40: github-copilot-agent-mode-review-2026"
collect_og "https://github.com/features/copilot" "$BASE/reviews/github-copilot-agent-mode-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/github-copilot-agent-mode-review-2026/cover.jpg" "github.com"

echo "9/40: ai-meeting-summary-tools-2026-review"
collect_og "https://otter.ai" "$BASE/reviews/ai-meeting-summary-tools-2026-review/cover.jpg" || collect_fallback "$BASE/reviews/ai-meeting-summary-tools-2026-review/cover.jpg" "otter.ai"

echo "10/40: replit-core-review-2026"
collect_og "https://replit.com" "$BASE/reviews/replit-core-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/replit-core-review-2026/cover.jpg" "replit.com"

echo "11/40: anthropic-mcp-ecosystem-review-2026"
collect_og "https://www.anthropic.com" "$BASE/reviews/anthropic-mcp-ecosystem-review-2026/cover.jpg" || echo "  ⚠️ Already may have cover"

echo "12/40: deepseek-chat-web-review-2026"
collect_og "https://chat.deepseek.com" "$BASE/reviews/deepseek-chat-web-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/deepseek-chat-web-review-2026/cover.jpg" "deepseek.com"

echo "13/40: cursor-tab-review-2026"
collect_og "https://www.cursor.com" "$BASE/reviews/cursor-tab-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/cursor-tab-review-2026/cover.jpg" "cursor.com"

echo "14/40: elevenlabs-text-to-speech-review-2026"
collect_og "https://elevenlabs.io" "$BASE/reviews/elevenlabs-text-to-speech-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/elevenlabs-text-to-speech-review-2026/cover.jpg" "elevenlabs.io"

echo "15/40: warp-terminal-review-2026"
collect_og "https://www.warp.dev" "$BASE/reviews/warp-terminal-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/warp-terminal-review-2026/cover.jpg" "warp.dev"

echo "16/40: notion-ai-2026-review"
collect_og "https://www.notion.so" "$BASE/reviews/notion-ai-2026-review/cover.jpg" || collect_fallback "$BASE/reviews/notion-ai-2026-review/cover.jpg" "notion.so"

echo "17/40: chatgpt-search-review-2026"
collect_og "https://chatgpt.com" "$BASE/reviews/chatgpt-search-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/chatgpt-search-review-2026/cover.jpg" "openai.com"

echo "18/40: claude-artifacts-review-2026"
collect_og "https://claude.ai" "$BASE/reviews/claude-artifacts-review-2026/cover.jpg" || echo "  ⚠️ Already may have cover"

echo "19/40: ai-code-generator-hugging-face-review-2026"
collect_og "https://huggingface.co" "$BASE/reviews/ai-code-generator-hugging-face-review-2026/cover.jpg" || collect_fallback "$BASE/reviews/ai-code-generator-hugging-face-review-2026/cover.jpg" "huggingface.co"

###############################
# COMPARISONS (12 articles)
###############################
echo ""
echo "=== COMPARISONS ==="

echo "20/40: ai-coding-agents-2026-deep-comparison"
collect_og "https://github.com/features/copilot" "$BASE/comparisons/ai-coding-agents-2026-deep-comparison/cover.jpg" || collect_fallback "$BASE/comparisons/ai-coding-agents-2026-deep-comparison/cover.jpg" "github.com"

echo "21/40: ai-video-generators-veo-vs-sora-vs-runway-2026"
collect_og "https://runwayml.com" "$BASE/comparisons/ai-video-generators-veo-vs-sora-vs-runway-2026/cover.jpg" || collect_fallback "$BASE/comparisons/ai-video-generators-veo-vs-sora-vs-runway-2026/cover.jpg" "runwayml.com"

echo "22/40: mcp-vs-function-calling-2026"
collect_og "https://modelcontextprotocol.io" "$BASE/comparisons/mcp-vs-function-calling-2026/cover.jpg" || collect_fallback "$BASE/comparisons/mcp-vs-function-calling-2026/cover.jpg" "anthropic.com"

echo "23/40: ai-notetakers-granola-vs-tactiq-vs-otter-2026"
collect_og "https://otter.ai" "$BASE/comparisons/ai-notetakers-granola-vs-tactiq-vs-otter-2026/cover.jpg" || collect_fallback "$BASE/comparisons/ai-notetakers-granola-vs-tactiq-vs-otter-2026/cover.jpg" "otter.ai"

echo "24/40: openai-vs-anthropic-vs-google-2026-ecosystem"
collect_og "https://openai.com" "$BASE/comparisons/openai-vs-anthropic-vs-google-2026-ecosystem/cover.jpg" || collect_fallback "$BASE/comparisons/openai-vs-anthropic-vs-google-2026-ecosystem/cover.jpg" "openai.com"

echo "25/40: ai-video-editing-descript-vs-riverside-vs-veed-2026"
collect_og "https://www.descript.com" "$BASE/comparisons/ai-video-editing-descript-vs-riverside-vs-veed-2026/cover.jpg" || collect_fallback "$BASE/comparisons/ai-video-editing-descript-vs-riverside-vs-veed-2026/cover.jpg" "descript.com"

echo "26/40: vercel-ai-sdk-vs-langchain-vs-openai-api-2026"
collect_og "https://sdk.vercel.ai" "$BASE/comparisons/vercel-ai-sdk-vs-langchain-vs-openai-api-2026/cover.jpg" || collect_fallback "$BASE/comparisons/vercel-ai-sdk-vs-langchain-vs-openai-api-2026/cover.jpg" "vercel.com"

echo "27/40: local-llm-ollama-vs-lm-studio-vs-gpt4all-2026"
collect_og "https://ollama.com" "$BASE/comparisons/local-llm-ollama-vs-lm-studio-vs-gpt4all-2026/cover.jpg" || collect_fallback "$BASE/comparisons/local-llm-ollama-vs-lm-studio-vs-gpt4all-2026/cover.jpg" "ollama.com"

echo "28/40: ai-screenshot-tools-clean-shot-vs-shottr-vs-snagit-2026"
collect_og "https://www.techsmith.com" "$BASE/comparisons/ai-screenshot-tools-clean-shot-vs-shottr-vs-snagit-2026/cover.jpg" || collect_fallback "$BASE/comparisons/ai-screenshot-tools-clean-shot-vs-shottr-vs-snagit-2026/cover.jpg" "techsmith.com"

echo "29/40: ai-productivity-tools-superhuman-vs-motion-vs-akiflow-2026"
collect_og "https://superhuman.com" "$BASE/comparisons/ai-productivity-tools-superhuman-vs-motion-vs-akiflow-2026/cover.jpg" || collect_fallback "$BASE/comparisons/ai-productivity-tools-superhuman-vs-motion-vs-akiflow-2026/cover.jpg" "superhuman.com"

echo "30/40: browser-automation-browserbase-vs-puppeteer-vs-playwright-2026"
collect_og "https://pptr.dev" "$BASE/comparisons/browser-automation-browserbase-vs-puppeteer-vs-playwright-2026/cover.jpg" || collect_fallback "$BASE/comparisons/browser-automation-browserbase-vs-puppeteer-vs-playwright-2026/cover.jpg" "microsoft.com"

echo "31/40: ai-data-analysis-tools-2026-comparison"
collect_og "https://www.tableau.com" "$BASE/comparisons/ai-data-analysis-tools-2026-comparison/cover.jpg" || collect_fallback "$BASE/comparisons/ai-data-analysis-tools-2026-comparison/cover.jpg" "tableau.com"

###############################
# TUTORIALS (8 articles)
###############################
echo ""
echo "=== TUTORIALS ==="

echo "32/40: build-ai-research-agent-perplexity-2026"
collect_og "https://www.perplexity.ai" "$BASE/tutorials/build-ai-research-agent-perplexity-2026/cover.jpg" || collect_fallback "$BASE/tutorials/build-ai-research-agent-perplexity-2026/cover.jpg" "perplexity.ai"

echo "33/40: use-claude-code-mcp-tools-2026"
collect_og "https://claude.ai" "$BASE/tutorials/use-claude-code-mcp-tools-2026/cover.jpg" || collect_fallback "$BASE/tutorials/use-claude-code-mcp-tools-2026/cover.jpg" "anthropic.com"

echo "34/40: build-python-app-cursor-cline-2026"
collect_og "https://www.cursor.com" "$BASE/tutorials/build-python-app-cursor-cline-2026/cover.jpg" || collect_fallback "$BASE/tutorials/build-python-app-cursor-cline-2026/cover.jpg" "cursor.com"

echo "35/40: deploy-ai-agent-pipeline-vercel-2026"
collect_og "https://vercel.com" "$BASE/tutorials/deploy-ai-agent-pipeline-vercel-2026/cover.jpg" || collect_fallback "$BASE/tutorials/deploy-ai-agent-pipeline-vercel-2026/cover.jpg" "vercel.com"

echo "36/40: create-faceless-youtube-ai-2026"
collect_og "https://www.youtube.com" "$BASE/tutorials/create-faceless-youtube-ai-2026/cover.jpg" || collect_fallback "$BASE/tutorials/create-faceless-youtube-ai-2026/cover.jpg" "youtube.com"

echo "37/40: automated-blog-seo-pipeline-2026"
collect_og "https://ahrefs.com" "$BASE/tutorials/automated-blog-seo-pipeline-2026/cover.jpg" || collect_fallback "$BASE/tutorials/automated-blog-seo-pipeline-2026/cover.jpg" "ahrefs.com"

echo "38/40: build-custom-slack-ai-bot-2026"
collect_og "https://api.slack.com" "$BASE/tutorials/build-custom-slack-ai-bot-2026/cover.jpg" || collect_fallback "$BASE/tutorials/build-custom-slack-ai-bot-2026/cover.jpg" "slack.com"

echo "39/40: master-gemini-2-web-search-2026"
collect_og "https://gemini.google.com" "$BASE/tutorials/master-gemini-2-web-search-2026/cover.jpg" || collect_fallback "$BASE/tutorials/master-gemini-2-web-search-2026/cover.jpg" "gemini.google.com"

###############################
# WORKFLOWS (4 articles)
###############################
echo ""
echo "=== WORKFLOWS ==="

echo "40/40: ai-customer-feedback-analysis-workflow-2026"
collect_og "https://www.qualtrics.com" "$BASE/workflows/ai-customer-feedback-analysis-workflow-2026/cover.jpg" || collect_fallback "$BASE/workflows/ai-customer-feedback-analysis-workflow-2026/cover.jpg" "qualtrics.com"

echo "41/40: ai-legal-document-analysis-workflow-2026 (extra)"
collect_og "https://www.ironcladapp.com" "$BASE/workflows/ai-legal-document-analysis-workflow-2026/cover.jpg" || collect_fallback "$BASE/workflows/ai-legal-document-analysis-workflow-2026/cover.jpg" "ironcladapp.com"

echo "42/40: ai-recruitment-automation-workflow-2026 (extra)"
collect_og "https://www.lever.co" "$BASE/workflows/ai-recruitment-automation-workflow-2026/cover.jpg" || collect_fallback "$BASE/workflows/ai-recruitment-automation-workflow-2026/cover.jpg" "lever.co"

echo "43/40: ai-financial-reporting-workflow-2026 (extra)"
collect_og "https://www.workday.com" "$BASE/workflows/ai-financial-reporting-workflow-2026/cover.jpg" || collect_fallback "$BASE/workflows/ai-financial-reporting-workflow-2026/cover.jpg" "workday.com"

echo ""
echo "=== Collection Summary ==="
find "$BASE" -name "cover.*" -newer "content-plan-2026-06-06.json" -type f 2>/dev/null | wc -l || true
echo "Total image directories with covers:"
for dir in reviews comparisons tutorials workflows; do
  count=$(find "$BASE/$dir" -name "cover.*" -type f | wc -l)
  echo "  $dir: $count"
done
