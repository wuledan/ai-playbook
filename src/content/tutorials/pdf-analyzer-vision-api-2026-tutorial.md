---
title: "Build a PDF Analyzer with Vision API: Gemini and Claude Step-by-Step Guide"
author: "AIPlaybook Editorial Team"
date: 2026-05-30
category: tutorials
tags: ["pdf", "vision-api", "gemini", "claude", "python", "document-analysis", "tutorial"]
cover: "/images/tutorials/pdf-analyzer-vision-api-2026-tutorial/cover.png"
difficulty: intermediate
meta_description: "Build a PDF analyzer using Gemini and Claude Vision APIs. Extract text, tables, charts, and images from PDFs. Complete Python tutorial with code examples."
---

## Overview

Traditional PDF parsers (PyPDF2, pdfplumber, pdfminer) struggle with scanned documents, complex tables, charts, and embedded images. Vision-capable LLMs like Gemini 2.5 Pro and Claude Sonnet 4 solve this by "reading" the PDF as a visual document — they see the layout, parse the tables, and interpret charts just like a human would.

This tutorial builds a **PDF Analyzer** that:

1. Converts PDF pages to high-resolution images
2. Sends them to Gemini or Claude Vision API
3. Extracts structured data (tables, key-value pairs, text)
4. Answers natural language questions about the document
5. Outputs results as JSON for downstream processing

No OCR setup. No layout parsing heuristics. Just vision API + smart prompting.

## Architecture

```
┌───────────┐     ┌──────────────┐     ┌──────────────┐
│   PDF     │────▶│  Page → PNG  │────▶│  Vision API  │
│  Document │     │  (pdf2image) │     │  (Gemini OR  │
└───────────┘     └──────────────┘     │   Claude)    │
                                        └──────┬───────┘
                                               │
                                ┌──────────────┴──────────┐
                                │                         │
                          ┌─────▼─────┐           ┌──────▼─────┐
                          │  Text +    │           │  Q&A Over   │
                          │  Tables    │           │  Document   │
                          └───────────┘           └────────────┘
```

## Prerequisites

- Python 3.10+
- Google AI API key OR Anthropic API key
- `poppler` installed (required by pdf2image; `brew install poppler` on macOS)

## Step 1: Setup

```bash
mkdir pdf-analyzer && cd pdf-analyzer
python -m venv .venv
source .venv/bin/activate

pip install pdf2image pillow google-genai anthropic python-dotenv pypdf2
```

Create `.env`:

```bash
GOOGLE_API_KEY=AIzaSy...
ANTHROPIC_API_KEY=sk-ant-...
# Use whichever you prefer; both work independently
```

## Step 2: PDF to Image Conversion

Modern LLMs accept images directly, so we convert each PDF page to a PNG. The resolution matters — too low and the API misses small text, too high and you hit token limits.

Create `pdf_to_images.py`:

```python
import os
from pdf2image import convert_from_path
from PIL import Image
from pathlib import Path


def pdf_to_images(
    pdf_path: str,
    output_dir: str = "./pages",
    dpi: int = 200,
    fmt: str = "PNG",
) -> list[str]:
    """
    Convert each PDF page to a high-resolution image.

    Args:
        pdf_path: Path to the PDF file
        output_dir: Directory to save page images
        dpi: Resolution (150-300 works well; 200 is the sweet spot)
        fmt: Output format (PNG or JPEG)

    Returns:
        List of paths to generated image files
    """
    os.makedirs(output_dir, exist_ok=True)
    basename = Path(pdf_path).stem

    print(f"Converting {pdf_path} to images at {dpi} DPI...")
    images = convert_from_path(
        pdf_path,
        dpi=dpi,
        fmt=fmt.lower(),
        thread_count=4,  # Parallel processing
    )

    image_paths = []
    for i, img in enumerate(images, 1):
        output_path = os.path.join(output_dir, f"{basename}_page_{i:03d}.png")
        img.save(output_path, fmt)
        image_paths.append(output_path)
        print(f"  Page {i}: {img.size[0]}×{img.size[1]}px → {output_path}")

    print(f"Total: {len(images)} pages converted")
    return image_paths


def compress_image(image_path: str, max_size_mb: float = 4.0) -> str:
    """
    Compress image if it exceeds max_size_mb. Vision APIs have file size limits.
    """
    size_mb = os.path.getsize(image_path) / (1024 * 1024)
    if size_mb <= max_size_mb:
        return image_path

    img = Image.open(image_path)
    # Reduce quality iteratively
    quality = 85
    while size_mb > max_size_mb and quality > 10:
        temp_path = image_path.replace(".png", "_compressed.jpg")
        img.save(temp_path, "JPEG", quality=quality)
        size_mb = os.path.getsize(temp_path) / (1024 * 1024)
        quality -= 10

    print(f"  Compressed {image_path}: {size_mb:.1f} MB (quality={quality + 10})")
    return temp_path if os.path.exists(temp_path) else image_path


if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python pdf_to_images.py <pdf_path>")
        sys.exit(1)
    paths = pdf_to_images(sys.argv[1])
    for p in paths:
        compress_image(p)
```

**What this does:** `pdf2image` wraps poppler's `pdftoppm` to render each page as a PIL Image. The `200 DPI` setting produces roughly 1650×2550 px images for A4 pages — sharp enough for Gemini to read 8pt font comfortably.

## Step 3: Gemini Vision Analyzer

Gemini 2.5 Pro natively handles multi-modal input. It can process multiple pages in one call and extract structured data.

Create `gemini_analyzer.py`:

```python
import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image

load_dotenv()

client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

EXTRACT_PROMPT = """Analyze this document page(s) carefully.

1. **Extract all text** word for word, preserving layout (columns, headers, footnotes)
2. **Extract all tables** as structured markdown
3. **Identify key-value pairs** (e.g., "Date: 2026-01-15", "Amount: $5,000")
4. **Describe any charts or diagrams** — what data they show and key takeaways
5. **List all figures/numbers** mentioned

If the page contains financial data, calculate totals. If legal text, identify parties and dates.

Output as JSON with keys:
- page_content (markdown string of all text)
- tables (list of markdown tables)
- key_values (dict)
- figures (list of {value, context})
- chart_descriptions (list of strings)
"""


def analyze_pdf_page(image_path: str) -> dict:
    """Analyze a single PDF page using Gemini Vision."""
    img = Image.open(image_path)

    response = client.models.generate_content(
        model="models/gemini-2.5-flash-preview-04-17",
        contents=[EXTRACT_PROMPT, img],
        config=types.GenerateContentConfig(
            temperature=0.1,
            max_output_tokens=8192,
        ),
    )

    try:
        result = json.loads(
            response.text.strip()
            .removeprefix("```json")
            .removeprefix("```")
            .removesuffix("```")
            .strip()
        )
    except json.JSONDecodeError:
        result = {"raw_text": response.text, "_parse_error": True}

    result["source_page"] = os.path.basename(image_path)
    return result


def analyze_multi_page(image_paths: list[str], max_pages: int = 10) -> list[dict]:
    """Analyze multiple pages, limited to max_pages to control cost and speed."""
    results = []
    for path in image_paths[:max_pages]:
        print(f"Analyzing {os.path.basename(path)}...")
        result = analyze_pdf_page(path)
        results.append(result)
        print(f"  ✓ Extracted {len(result.get('tables', []))} tables, "
              f"{len(result.get('key_values', {}))} fields")
    return results


def qa_over_document(image_paths: list[str], question: str) -> str:
    """Ask a question about the entire document. Gemini sees all pages at once."""
    contents = [f"Answer this question about the attached document pages:\n\n{question}"]
    for path in image_paths[:5]:  # Limit to 5 pages per query for token budget
        img = Image.open(path)
        contents.append(img)

    response = client.models.generate_content(
        model="models/gemini-2.5-flash-preview-04-17",
        contents=contents,
        config=types.GenerateContentConfig(
            temperature=0.1,
            max_output_tokens=4096,
        ),
    )
    return response.text
```

## Step 4: Claude Vision Analyzer (Alternative)

Claude Sonnet 4 offers excellent document analysis with slightly different strengths — better at handwriting recognition and complex table extraction.

Create `claude_analyzer.py`:

```python
import base64
import os
import json
from dotenv import load_dotenv
from anthropic import Anthropic

load_dotenv()

anthropic = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


CLAUDE_EXTRACT_PROMPT = """You are a professional document analyst. Extract ALL
information from this document page with maximum accuracy.

Return a JSON object with these keys:
{
  "page_title": "Title or header found on this page",
  "full_text": "Complete extracted text preserving layout",
  "tables": [
    {
      "caption": "table description",
      "headers": ["col1", "col2"],
      "rows": [["val1", "val2"]]
    }
  ],
  "fields": {"Field Name": "Value", ...},
  "numbers": [{"value": 1234, "context": "what it refers to"}],
  "has_signature": true/false,
  "has_logo": true/false,
  "page_number": null
}

Be thorough. Extract every number, every date, and every named entity."""


def analyze_page_with_claude(image_path: str) -> dict:
    """Analyze a PDF page using Claude Sonnet 4 Vision."""
    img_b64 = encode_image(image_path)

    response = anthropic.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=4096,
        system="You extract structured data from document pages. Output only valid JSON.",
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": CLAUDE_EXTRACT_PROMPT},
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": img_b64,
                        },
                    },
                ],
            }
        ],
    )

    text = response.content[0].text
    try:
        result = json.loads(
            text.strip()
            .removeprefix("```json")
            .removeprefix("```")
            .removesuffix("```")
            .strip()
        )
    except json.JSONDecodeError:
        result = {"raw_text": text, "_parse_error": True}

    result["source_page"] = os.path.basename(image_path)
    return result
```

## Step 5: Main Application

Create `main.py`:

```python
import json
import sys
from pathlib import Path
from pdf_to_images import pdf_to_images
from gemini_analyzer import analyze_multi_page, qa_over_document


def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <pdf_path> [--qa 'your question']")
        sys.exit(1)

    pdf_path = sys.argv[1]
    qa_mode = "--qa" in sys.argv

    # Step 1: Convert PDF to images
    image_paths = pdf_to_images(pdf_path)

    if qa_mode:
        # Q&A mode
        qa_idx = sys.argv.index("--qa")
        question = " ".join(sys.argv[qa_idx + 1:]) if len(sys.argv) > qa_idx + 1 else "Summarize this document"
        answer = qa_over_document(image_paths, question)
        print(f"\nQ: {question}\n")
        print(f"A: {answer}")
    else:
        # Full extraction mode
        results = analyze_multi_page(image_paths)

        # Save combined results
        output = {
            "source": pdf_path,
            "total_pages": len(results),
            "pages": results,
        }

        output_path = f"{Path(pdf_path).stem}_analysis.json"
        with open(output_path, "w") as f:
            json.dump(output, f, indent=2, ensure_ascii=False)

        print(f"\nAnalysis saved to {output_path}")

        # Print summary
        total_tables = sum(len(r.get("tables", [])) for r in results)
        total_fields = sum(len(r.get("key_values", {})) for r in results)
        print(f"\nSummary: {len(results)} pages, "
              f"{total_tables} tables, {total_fields} fields extracted")


if __name__ == "__main__":
    main()
```

## Step 6: Testing

```bash
# Download a sample PDF
curl -L -o sample.pdf "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"

# Full analysis
python main.py sample.pdf

# Q&A mode
python main.py sample.pdf --qa "What is the total amount on page 2?"
```

## Tips

1. **Use DPI strategically**: 150 DPI for text-heavy PDFs (faster, cheaper), 300 DPI for dense tables and small fonts. Vision APIs charge per image, so lower DPI = lower cost.
2. **Batch by page range**: For 50+ page PDFs, analyze pages 1-10 first to validate quality, then scale up. This avoids wasting API calls on irrelevant pages.
3. **Cross-validate**: Run the same page through both Gemini and Claude, then compare. They often catch different details — Claude is better at handwriting, Gemini at table structure.
4. **Use system prompts for formatting**: Tell the API exactly what schema you want. We used JSON mode above, but markdown tables work too for human readability.

## Common Pitfalls

- **❌ DPI too low**: Below 150 DPI, Gemini misreads numbers like "100" as "1oo". Test with your actual documents — a tax return needs more DPI than a novel.
- **❌ Page order mixing**: Multi-page PDFs analyzed in parallel lose page order. Always send pages sequentially and tag results with page numbers.
- **❌ Token limits on long documents**: Gemini 2.5 Flash has a 1M token context, but each page image consumes roughly 258 tokens at 200 DPI. For a 100-page document, that's 25,800 tokens just for images — well within limits, but subject to rate limiting.
- **❌ Scanned PDFs with poor quality**: Apply pre-processing with OpenCV (sharpening, contrast adjustment) before sending to the API. `cv2.createCLAHE()` works wonders on faded scans.

## Conclusion

You've built a PDF analyzer that uses Vision-capable AI to extract structured data from documents — no OCR, no layout parsing, no complex regex. The same approach works for invoices, contracts, research papers, bank statements, and any document with visual structure.

The dual-provider setup (Gemini + Claude) gives you flexibility: use Gemini for cost-effective bulk analysis and Claude for documents requiring maximum accuracy (financial reports, legal contracts). Total cost per page: roughly $0.001-0.005 depending on model choice.
