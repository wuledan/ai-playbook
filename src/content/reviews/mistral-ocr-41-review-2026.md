---
title: "Mistral OCR 4.1 Review — SOTA Document Extraction With Paragraph-Level Bounding Boxes"
date: 2026-08-14
author: "AIPlaybook Editorial Team"
category: "Document AI"
tags:
  - "Mistral"
  - "OCR"
  - "Document-AI"
  - "Bounding-Boxes"
  - "RAG"
  - "Enterprise"
  - "Self-Hosting"
cover: /images/reviews/mistral-ocr-41-review-2026/cover.png
meta_description: "Mistral OCR 4.1 is Mistral's latest document-extraction service: €3.5 per 1,000 pages (€4.38 annotated), paragraph-level bounding boxes, structural block labels, block-level confidence scores, and 2x speed over OCR 4. Built on OCR 4's SOTA scores — OlmOCRBench 85.20, OmniDocBench 93.07, 170 languages, single-container self-hosting. Review covers the pricing tiers, the benchmark caveats Mistral itself publishes, and the HN community debate on whether €3.5/1000 pages is defensible."
rating: 7.9
dimensions:
  ease-of-use: 8
  features: 9
  value: 7
  performance: 9
  ecosystem: 8
pros:
  - "OCR 4's benchmark scores are genuinely SOTA: OlmOCRBench 85.20, OmniDocBench 93.07, and 0.98 on Mistral's internal Crawl Multilingual eval — ahead of both AI-native and enterprise OCR systems tested"
  - "Paragraph-level bounding boxes with structural block labels (title, subtitle, text, image, table) and inline confidence scores per page and per word — the layout-aware output RAG pipelines actually need"
  - "2x speed improvement in 4.1 over OCR 4, and a customer quote (Anaqua) reports roughly 4x faster per-page throughput than their incumbent OCR provider"
  - "170 languages across 10 language groups, running in a single container for fully self-hosted deployments — enterprise data never leaves your environment"
  - "Flexible consumption: /v1/ocr, structured annotations, batch mode, and the Document AI no-code product at $5/1000 pages"
  - "Mistral publishes its benchmark caveats openly, including an audit showing most OlmOCRBench mismatches were scoring artifacts rather than model errors"
cons:
  - "At €3.5 per 1,000 pages it is the most expensive OCR API in the mainstream tier; HN commenters called it 'expensive as hell' and quoted self-run GPU pipelines at $0.05-0.10 per 1,000 pages"
  - "Annotated pages cost more: €4.38 per 1,000 pages (about $4.38/$5.00 in USD pricing) for structured output"
  - "Community testing found nothing special for highly specialized documents: 'ligatures, critical sigla, Fraktur letterforms... the pro models from OpenAI dominate' per one HN commenter"
  - "Self-hosting is enterprise-only — individual developers cannot access the single-container deployment without a sales conversation"
  - "Document AI product at $5/1000 pages is a premium on top of the raw API, pushing per-page cost higher for no-code users"
best-for: "Enterprises with high-volume document workloads (IP docketing, legal, finance, RAG ingestion) that need layout-aware structured output and data-residency control"
price: "€3.5 / 1,000 pages (OCR), €4.38 / 1,000 pages (annotated); Document AI $5 / 1,000 pages; self-hosting enterprise-only"
---

## Quick Verdict

Mistral OCR 4.1 is the latest iteration of Mistral's document-extraction service and the engine behind its Document AI stack. The headline addition over OCR 4 is speed — a 2x improvement — plus the mature structured-output pipeline: paragraph-level bounding boxes, structural block labels, and block-level confidence scores. The underlying OCR 4 model already holds SOTA scores on public benchmarks (OlmOCRBench 85.20, OmniDocBench 93.07). Pricing sits at €3.5 per 1,000 pages, which is the main fault line: the HN community argues loudly that self-run GPU pipelines deliver the same work for 1-2 orders of magnitude less. For enterprises that value layout-aware extraction and data residency, the premium is defensible; for cost-sensitive high-volume processing, it is not.

**Rating: 7.9/10** — best-in-class output quality and structure, at a price the community considers aggressive.

## What's New in OCR 4.1

Mistral's docs page lists OCR 4.1 as "our latest OCR service powering our Document AI stack, with native paragraph-level bounding box extraction, structural block labels, and block-level confidence scores." The version bump from 4 to 4.1 brings:

- **+2 speed** — the model card lists a 2x speed improvement over OCR 4
- **BBox extraction** via `/v1/ocr`
- **Structured annotations** via `/v1/ocr` annotations endpoint
- **Batch processing** via `/v1/batch`

Where previous generations converted a page into clean text and tables, OCR 4 and 4.1 return a structured representation of the document: each block is localized with a bounding box, classified by type, and carries inline confidence scores per page and per word. Downstream systems get not only what the document says, but where each element sits, what role it plays, and how confident the model is in each region — the exact inputs needed for grounded RAG, agentic document workflows, and domain-specific retrieval pipelines.

## Performance & Benchmarks

OCR 4 (the underlying model) placed first in Mistral's human-preference evaluation and achieved the top overall score on the public OlmOCRBench at **85.20**, ahead of both AI-native and enterprise OCR systems. On OmniDocBench it scores **93.07**. Mistral publishes an unusual level of caveat transparency here: both benchmarks have known scoring limitations, and their audit found that most mismatches behind the scores were "not model errors but artifacts" of the scoring methodology.

The performance story extends to throughput. Anaqua's AI engineer Ivan Mihailov is quoted: "Mistral OCR is roughly 4x faster per page than our incumbent provider, an impressive result for the high-volume docketing workflows where speed is critical to managing our customers' IP timelines."

| Benchmark | OCR 4 score | Note |
|-----------|-------------|------|
| OlmOCRBench | 85.20 | Top score among models tested |
| OmniDocBench | 93.07 | Reported with methodology caveats |
| Crawl Multilingual (internal) | 0.98 | Leads internal eval |
| Languages | 170 (10 groups) | Single-container self-host |

## Pricing: The Contested Number

| Tier | Price | Includes |
|------|-------|----------|
| OCR API | €3.5 / 1,000 pages | Text + tables extraction |
| Annotated OCR | €4.38 / 1,000 pages | Bounding boxes + block labels + confidence |
| Document AI (no-code) | $5 / 1,000 pages | Full Document AI stack |
| Self-hosted | Enterprise quote | Single container, full data residency |

This is the core controversy. HN commenter merb: "1000 Pages / 3.5€ this is expensive as hell. If this is not fastly superior than something like tesseract it is not worth it." Another commenter running an OCR pipeline on rented GPUs quoted $0.05-0.10 per 1,000 pages with full bounding boxes at ~0.8 seconds per page. The counterpoints: OCR 4's benchmark scores and layout structure are far beyond Tesseract, and for enterprises the alternative is not a GPU box but an incumbent vendor contract where Mistral claims 4x speed advantage.

## Community Verdict

The HN thread (223 points, 16 comments) was dominated by price skepticism and the Europe-vs-China AI debate. "Whoever is paying all that for OCR is being scammed" — hmokiguess. On quality for specialist use: "I've got a scan from a book that I OCR with new releases. Ligatures, critical sigla, Fraktur letterforms, subscripts, superscripts... Nothing special about this model for overly-detailed work like mine... the 'pro' models from OpenAI dominate" — ComputerPerson. But an insider pushed back on speed: "I won't comment on accuracy, but in internal benchmarks, Mistral OCR is significantly faster than comparable APIs" — ianhawes. The self-hosting angle drew interest from developers who want to run local OCR for sensitive documents, echoing NuExtract users running bank-statement extraction on a single RTX 4090.

## Alternatives

- **OpenAI OCR (pro tier)** — Preferred by HN commenters for highly specialized documents (ligatures, scholarly sigla); more expensive and less layout-structured.
- **Baidu OCR (Unlimited)** — "Essentially free to run on a decent computer, other than electricity costs" per one commenter; strong Chinese-language support.
- **Tesseract (open source)** — Free and self-hosted, but far behind on structured layout extraction; fine for simple text.
- **NuExtract / local vision models** — Run on a single RTX 4090 for structured documents like bank statements; strong for narrow domains, weaker for 170-language breadth.
- **Self-run GPU pipelines** — DIY approaches quoted at $0.05-0.10 per 1,000 pages; the cost winner when you have GPU capacity and engineering time.

## FAQ

**Q: How much does Mistral OCR 4.1 cost?**
A: €3.5 per 1,000 pages for OCR, €4.38 per 1,000 pages for annotated output with bounding boxes and confidence scores. Document AI is $5 per 1,000 pages. Self-hosting is available to enterprise customers via quote.

**Q: What's new in OCR 4.1 versus OCR 4?**
A: A 2x speed improvement, plus the mature structured-output pipeline: paragraph-level bounding boxes, structural block labels, and block-level confidence scores.

**Q: Can I self-host Mistral OCR 4.1?**
A: Yes, but only via enterprise sales. It runs in a single container for fully self-hosted deployments, keeping document data in your environment for residency, sovereignty, and compliance.

**Q: How many languages does Mistral OCR 4.1 support?**
A: 170 languages across 10 language groups.

**Q: Is Mistral OCR 4.1 good for RAG pipelines?**
A: Yes — the layout-aware output (bounding boxes, block types, confidence scores) is designed for grounded retrieval, agentic document workflows, and domain-specific pipelines. That structure is what justifies the premium over plain-text OCR.
