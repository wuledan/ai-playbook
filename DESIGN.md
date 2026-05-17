# AI Tools Review + Tips Hub — 产品设计文档

> 版本：v1.0 | 日期：2026-05-17 | 状态：待开发
> 
> 站点定位：面向全球英文用户的 AI 工具深度评测 + 用法教程 + 工作流分享平台

---

## 目录

1. [执行摘要](#1-执行摘要)
2. [市场调研与竞品分析](#2-市场调研与竞品分析)
3. [差异化定位](#3-差异化定位)
4. [目标用户画像](#4-目标用户画像)
5. [站点架构设计](#5-站点架构设计)
6. [内容策略](#6-内容策略)
7. [技术选型建议](#7-技术选型建议)
8. [变现策略](#8-变现策略)
9. [与现有项目协同](#9-与现有项目协同)
10. [域名可用性检查](#10-域名可用性检查)
11. [关键词搜索量数据](#11-关键词搜索量数据)
12. [内容产线设计](#12-内容产线设计)
13. [截图素材方案](#13-截图素材方案)
14. [实施路线图](#14-实施路线图)

---

## 1. 执行摘要

"AI Tools Review + Tips Hub" 是一个面向全球 AI 技术用户的英文内容站点。与当前市场上数千个单纯的"AI 工具目录"不同，本项目的核心差异在于：

- **深度评测而非浅层罗列** — 每个工具都有实测评分、对比分析和场景推荐
- **实操教程而非广告文案** — 教用户"怎么用"，而不是"这个好用"
- **工作流分享而非冷链接** — 展示多个工具如何组合解决实际问题
- **中国出海品牌视角** — 独特的 cross-cultural 视角，连接中国 AI 生态和全球用户

---

## 2. 市场调研与竞品分析

### 2.1 竞品全景图

| 站点 | 月访问量 (估) | 核心模式 | 内容深度 | 优势 | 劣势 |
|------|---------------|----------|----------|------|------|
| **Futurepedia** (futurepedia.io) | ~3M+ | 工具目录 + 课程 + YouTube | 中等 | 社区大、课程体系好、YouTube 矩阵 | 评测偏浅，工作流内容不足 |
| **There's An AI For That** (theresanaiforthat.com) | ~5M+ | 工具目录 + 搜索 | 浅 | 收录量大（15k+）、SEO 强 | 无教程无评测，纯目录 |
| **Toolify** (toolify.ai) | ~2M+ | 工具目录 + 排名 | 浅 | 热度排名有吸引力，工具收录快 | 无深度内容，用户粘性低 |
| **Toolpilot** (toolpilot.ai) | ~500K | 工具目录 + 用户评论 | 中等 | 用户评论系统好，社区感 | 文章/教程内容弱 |
| **AITopTools** (aitoptools.com) | ~300K | 工具目录 + 文章 | 浅-中 | 分类清晰 | 内容原创性一般 |
| **G2 AI** (g2.com/categories/ai) | ~10M+ | 企业软件评测平台 | 深 | 权威性高、评分体系成熟 | 偏向企业用户，不接地气 |
| **AI Tool Hunt** | ~200K | 新品发现 | 浅 | 关注新工具 | 体量小，内容少 |
| **SaaS Hub** (saashub.com) | ~500K | 替代品查找 | 中等 | 比价/替代逻辑独特 | 非 AI 专精 |

### 2.2 竞品详细分析

#### Futurepedia — 最接近的竞争对手

- **规模**: 4000+ 工具收录，500K+ 注册用户，2M+ YouTube 订阅
- **内容**: 工具列表页 + 课程体系（29 门课）+ YouTube 教程视频
- **盈利模式**: 课程付费（14-Day AI Boot Camp 等）、工具 Listing 付费
- **弱点**: 
  - 文本内容深度不足，大部分文章是 500-800 字的工具简介
  - 缺少多工具组合工作流类内容
  - 缺少横向对比评测
  - 社区互动弱

#### There's An AI For That — 流量最大

- **规模**: 15,000+ 工具收录，最高流量站点
- **核心功能**: AI → Task 逆向搜索（输入任务找工具），非常实用
- **弱点**: 全是列表，没有一篇文章。用户来了查完就走，粘性极低。

#### Toolpilot — 值得学习的模式

- **特色**: 每个工具有独立产品页，用户可写评论和评分
- **类似**: Amazon 产品页模式对 AI 工具
- **弱点**: 缺乏教程和深度内容，用户评论质量参差不齐

### 2.3 市场机会

1. **深度内容空白**: 绝大多数竞品只做目录 / 列表，缺少高质量评测文章
2. **工作流内容空白**: "怎么组合使用多个 AI 工具"几乎没有站点在做
3. **实操教程需求旺盛**: YouTube 上 AI 教程播放量极高，但文本教程站点很少
4. **中国出海品牌视角独特**: 中国 AI 生态（通义千问、豆包、DeepSeek 等）在英文世界报道不足，存在信息差
5. **SEO 窗口期**: AI 工具相关搜索词竞争尚未白热化，尤其长尾词（"how to + tool name"）

---

## 3. 差异化定位

### 3.1 一句话定位

> **不只是"有这个工具"，而是"这个工具怎么用、和谁一起用、值不值得用"。**

### 3.2 核心差异点

| 维度 | 竞品 | 我们 |
|------|------|------|
| 内容深度 | 200-500 字简介 | 1500-3000 字深度评测 + 评分 |
| 教程导向 | 少见 | 核心内容板块，Step-by-Step |
| 工作流 | 几乎没有 | 多工具组合工作流是独家卖点 |
| 中国 AI 生态 | 空白 | 连接中美 AI 生态的桥接内容 |
| 评测标准 | 无统一标准或只有用户评分 | 统一的 5 维评分体系 |
| 社区互动 | 弱或没有 | 用户可以点赞、评论、收藏 |

### 3.3 品牌关键词

- **Honest** — 真实的、不恰饭的评测
- **Practical** — 教你怎么用，不是"有这个东西"
- **Connected** — 连接工具、连接工作流、连接中美 AI 生态

### 3.4 品牌名建议

- **ToolTogether** (可用性待查)
- **AIPlaybook** (推荐)
- **WorkflowAI**
- **ToolDepth**

> 推荐使用 **AIPlaybook** — 简短、好记、暗示教程属性

---

## 4. 目标用户画像

### 4.1 核心用户群

#### Persona A: 技术从业者 / 开发者
- **年龄**: 25-40
- **职业**: 软件工程师、产品经理、数据科学家
- **需求**: 快速评估工具是否值得集成到工作流中
- **痛点**: 官网营销话术太多，缺少真实对比数据
- **阅读习惯**: 喜欢结构化内容、对比表、评分

#### Persona B: 创业者 / 个体经营者
- **年龄**: 28-45
- **职业**: Startup Founder, Indie Hacker, Freelancer
- **需求**: 找到能省钱（或替代人）的工具组合
- **痛点**: 工具太多不知道选哪个，买了但不会用
- **阅读习惯**: 更喜欢教程、工作流、ROI 分析

#### Persona C: 内容创作者
- **年龄**: 22-35
- **职业**: YouTuber, 博主, 设计师
- **需求**: AI 视频/图像/音频工具的最佳实践
- **痛点**: 工具更新快，教程很快过时
- **阅读习惯**: 短视频教程、截图丰富的教程

#### Persona D: AI 爱好者 / 学习者
- **年龄**: 18-30
- **职业**: 学生、转行者
- **需求**: 从零开始学 AI 工具使用
- **痛点**: 信息过载，不知道从哪开始
- **阅读习惯**: 入门教程、免费工具推荐、比较文章

### 4.2 地域分布（预期）

- **北美**: 40%（最大流量来源）
- **欧洲**: 25%
- **东南亚**: 15%
- **其他**: 20%

---

## 5. 站点架构设计

### 5.1 信息架构

```
Home
├── Reviews（工具评测）
│   ├── Productivity（生产力工具）
│   ├── Coding（编程工具）
│   ├── Writing（写作工具）
│   ├── Design（设计/图像工具）
│   ├── Video & Audio（视频音频工具）
│   ├── Marketing（营销工具）
│   ├── Research（研究分析工具）
│   └── Other（其他）
├── Tutorials（用法教程）
│   ├── Beginner（入门教程）
│   ├── Advanced（进阶教程）
│   └── Tool-Specific（特定工具教程）
├── Workflows（工作流）
│   ├── Marketing Workflows（营销工作流）
│   ├── Dev Workflows（开发工作流）
│   ├── Content Creation（内容创作工作流）
│   └── Business Ops（企业运营工作流）
├── Comparisons（工具对比） — 并排对比页
│   ├── ChatGPT vs Claude vs Gemini
│   ├── Midjourney vs DALL-E vs Stable Diffusion
│   └── ...
├── Categories（分类浏览）
├── About
└── Blog（网站动态/更新日志）
```

### 5.2 页面类型详细设计

#### 5.2.1 首页

**布局要素**:
- Hero: 精选评测 + CTA
- "New & Noteworthy"（最新/最热工具）
- "Featured Workflow"（特色工作流）
- "Latest Tutorial"（最新教程）
- "Top Picks by Category"（分类精选）
- News / Update section

#### 5.2.2 评测详情页 (Review)

**核心模块**:
```
1. 文章头部
   - 标题: [工具名] Review 2026: [一句话结论]
   - 封面图（工具 Logo + 评分 Badge）
   - 元数据: 作者、日期、阅读时间、分类

2. 评分概览
   - 总体评分 (1-10)
   - 5 个子维度评分:
     - 易用性 (Ease of Use)
     - 功能深度 (Features)
     - 性价比 (Value for Money)
     - 性能 (Performance)
     - 支持/生态 (Support & Ecosystem)
   - 对比竞争对手评分（星标雷达图）

3. 快速决策栏
   - 优点 / 缺点 (Pros & Cons)
   - 适合人群 (Best For)
   - 价格摘要
   - "Try [Tool]" 按钮 (Affiliate link)

4. 正文
   - Introduction
   - 核心功能详解（实测截图）
   - 使用体验
   - 与竞品对比
   - 定价分析
   - 优缺点深度分析
   - 建议 / 替代方案

5. 评论区
```

#### 5.2.3 教程页 (Tutorial)

**核心模块**:
```
1. 文章头部: 标题 + 封面 + 难度标签 (Beginner/Intermediate/Advanced)
2. 前置条件 (Prerequisites)
3. Step-by-Step 指南（带截图或视频嵌入）
4. 常见问题 (Troubleshooting)
5. 相关工具推荐
6. 评论 + 点赞
```

#### 5.2.4 工作流页 (Workflow)

**核心模块**:
```
1. 标题: "How to [Do X] with [Tool A] + [Tool B] + [Tool C]"
2. 工作流概览图（流程图 / Mermaid 图）
3. 使用场景说明
4. 步骤分解（Step 1: Tool A 操作 → Step 2: 输出导入 Tool B → ...）
5. 所需工具清单（含 Affiliate links）
6. 预计耗时 + 难度
7. 替代方案
```

#### 5.2.5 对比页 (Comparison)

**核心模块**:
```
1. 对比总览表（Feature by Feature）
2. 价格对比
3. 优缺点分析（各工具独立）
4. 不同场景的建议
5. 投票/用户推荐
```

### 5.3 URL 结构与 SEO 策略

#### URL 结构设计

```
/                           → 首页
/reviews/                   → 评测列表
/reviews/[tool-name]        → 单篇评测
/reviews/category/[cat]     → 分类列表

/tutorials/                 → 教程列表
/tutorials/[tutorial-slug]  → 单篇教程

/workflows/                 → 工作流列表
/workflows/[workflow-slug]  → 单篇工作流

/comparisons/               → 对比列表
/comparisons/[tool-a]-vs-[tool-b]  → 对比页

/categories/                → 分类导航
/about/                     → 关于页
```

#### SEO 策略要点

1. **关键词策略**:
   - 主要关键词: `[tool name] review`, `[tool name] tutorial`, `how to use [tool name]`
   - 次级关键词: `best AI tools for [task]`, `[tool name] vs [competitor]`
   - 长尾词: `how to [specific task] with [tool name]`, `[tool name] alternatives`

2. **技术 SEO**:
   - Astro 静态生成 (SSG) 确保首屏加载速度
   - 自动生成 sitemap.xml (@astrojs/sitemap)
   - RSS Feed (@astrojs/rss)
   - Schema.org 结构化数据 (Article, Review, Product)
   - Canonical URLs
   - Open Graph / Twitter Card

3. **内容 SEO**:
   - 每篇文章 1500-3000 字（评测类 2000+，教程类 1500+）
   - 内链策略: 评测→教程→工作流→对比，形成内容网络
   - 每篇文章包含 FAQ schema
   - 工具名称使用全称而非缩写（第一处）

4. **外链建设**:
   - 工具开发者的反向链接（工具被评测后，开发者会链接）
   - 客座博客（Guest posts 在 tech/dev 站点）
   - Social media (Twitter/X, LinkedIn)

---

## 6. 内容策略

### 6.1 内容类型与比例

| 类型 | 占比 | 数量目标 (前 3 月) | 频率（稳定期） |
|------|------|-------------------|----------------|
| 深度评测 (Reviews) | 40% | 20 篇 | 每周 2-3 篇 |
| 用法教程 (Tutorials) | 30% | 15 篇 | 每周 1-2 篇 |
| 工作流 (Workflows) | 20% | 10 篇 | 每周 1 篇 |
| 工具对比 (Comparisons) | 5% | 3 篇 | 每 2 周 1 篇 |
| 其他（行业趋势、新闻等） | 5% | 2 篇 | 每周 1 篇 |

### 6.2 初始内容选题（前 30 篇）

#### 深度评测 (12 篇)

| # | 选题 | 难度 | 预计字数 | 分类 |
|---|------|------|---------|------|
| 1 | Claude Code Review 2026: Can It Replace Your IDE? | ★★★ | 2500 | Coding |
| 2 | ChatGPT Pro vs Free in 2026: Is the $20/mo Worth It? | ★★ | 2000 | Productivity |
| 3 | Midjourney v7 Review: Has AI Art Finally Arrived? | ★★★ | 2500 | Design |
| 4 | Cursor AI Review: The Best AI Coding IDE? | ★★★ | 2500 | Coding |
| 5 | Jasper AI Review 2026: Still the Best for Marketing? | ★★ | 2000 | Marketing |
| 6 | Runway Gen-4 Review: AI Video Gets Serious | ★★★ | 2500 | Video |
| 7 | Notion AI Review: the Best AI for Knowledge Work? | ★★ | 2000 | Productivity |
| 8 | Descript Review: Best AI Video Editor | ★★ | 2000 | Video |
| 9 | Perplexity Pro Review: Better Than Google Search? | ★★ | 2000 | Research |
| 10 | Gamma AI Review: Best AI Presentation Maker | ★★ | 1800 | Productivity |
| 11 | Suno AI Review: AI Music the 2026 Way | ★★★ | 2000 | Audio |
| 12 | GitHub Copilot vs Claude Code vs Cursor: The Ultimate Comparison | ★★★★ | 3500 | Coding |

#### 用法教程 (8 篇)

| # | 选题 | 难度 | 预计字数 | 分类 |
|---|------|------|---------|------|
| 1 | How to Use Claude Code: A Complete Beginner's Guide | ★★ | 2000 | Coding |
| 2 | How to Write Better Prompts in ChatGPT: The 2026 Guide | ★ | 1800 | Writing |
| 3 | How to Generate Consistent Characters with Midjourney | ★★★ | 2000 | Design |
| 4 | How to Automate Your Workflow with Zapier + ChatGPT | ★★ | 2000 | Productivity |
| 5 | How to Use Perplexity for Research: Advanced Techniques | ★★ | 1800 | Research |
| 6 | How to Create Videos with Runway: Step-by-Step | ★★ | 2000 | Video |
| 7 | How to Build a Website with AI: Cursor + Claude Code Guide | ★★★★ | 2500 | Coding |
| 8 | How to Use Descript for Podcast Editing: Complete Walkthrough | ★★ | 2000 | Audio |

#### 工作流 (6 篇)

| # | 选题 | 难度 | 涉及工具 |
|---|------|------|---------|
| 1 | Content Creation Pipeline: ChatGPT → Midjourney → Descript | ★★★ | ChatGPT + Midjourney + Descript |
| 2 | AI-Powered Development: Claude Code + Cursor + GitHub Copilot | ★★★★ | Claude Code, Cursor, Copilot |
| 3 | Marketing Automation: Jasper + Notion AI + Zapier | ★★ | Jasper, Notion AI, Zapier |
| 4 | Research Workflow: Perplexity + ChatGPT + Notion AI | ★★ | Perplexity, ChatGPT, Notion |
| 5 | Video Production Pipeline: Runway + Descript + Suno | ★★★ | Runway, Descript, Suno |
| 6 | AI Writing to Publishing: ChatGPT → Grammarly → WordPress | ★ | ChatGPT, Grammarly, WP |

#### 对比 (2 篇)

| # | 选题 |
|---|------|
| 1 | ChatGPT vs Claude vs Gemini: Which AI Assistant Wins in 2026? |
| 2 | Midjourney vs DALL-E 4 vs Stable Diffusion: Best AI Image Generator |

#### 其他 (2 篇)

| # | 选题 |
|---|------|
| 1 | The 10 Best Free AI Tools in 2026 |
| 2 | AI Tools Landscape 2026: Where Are We Now? |

### 6.3 内容模板设计

#### 评测模板

```markdown
---
title: "[Tool Name] Review 2026: [One-line verdict]"
date: YYYY-MM-DD
author: [Author]
category: [Category]
tags: [tool-name, review, category]
cover: /images/reviews/[tool-name]/cover.webp
rating: 8.5
dimensions:
  ease-of-use: 8
  features: 9
  value: 7
  performance: 9
  ecosystem: 8
pros:
  - "Pro 1"
  - "Pro 2"
  - "Pro 3"
cons:
  - "Con 1"
  - "Con 2"
best-for: "[Target audience description]"
price: "From $XX/mo"
---

## Quick Verdict
[1-2 paragraphs summary]

## Pros & Cons

## What Is [Tool Name]?

## Key Features (with screenshots)

## Hands-On Experience [实测体验]

## Who Is It For?

## Pricing Breakdown

## Alternatives to Consider

## Final Verdict: Should You Use It?
```

#### 教程模板

```markdown
---
title: "How to [Task] with [Tool]: A Complete Guide"
date: YYYY-MM-DD
author: [Author]
category: tutorials
difficulty: beginner|intermediate|advanced
cover: /images/tutorials/[slug]/cover.webp
prerequisites:
  - "[Tool] account (free tier works)"
  - "Basic understanding of [concept]"
---
```

#### 工作流模板

```markdown
---
title: "How to [Goal]: A [N tools]-Tool Workflow"
date: YYYY-MM-DD
author: [Author]
category: workflows
tools:
  - name: "[Tool A]"
    url: "[Affiliate link]"
  - name: "[Tool B]"
    url: "[Affiliate link]"
cover: /images/workflows/[slug]/cover.webp
difficulty: intermediate
time-required: "~45 minutes"
---
```

### 6.4 图像策略

| 图像类型 | 规格 | 来源 | 备注 |
|----------|------|------|------|
| 文章封面 | 1200×630px (OG compliant) | DALL-E / Midjourney 生成 | 统一风格，每篇独立 |
| 评测截图 | 16:9 或 4:3 | 实际产品截图 | 标注箭头和说明文字 |
| 教程步骤图 | 16:9 | 截图 + Snagit 标注 | 每个步骤至少一张图 |
| 工作流流程图 | 自定义 | Mermaid.js 或 draw.io | SVG 格式 |
| 对比表格 | 响应式 | HTML/CSS | 无需图片 |
| 头像/图标 | 400×400px | 统一生成 | 作者头像，工具 Logo |

- **图片格式**: WebP 优先，JPEG 做 fallback
- **存储**: 站点 public/images/ 目录（小站点可接受），后期迁移到 CDN
- **ALT 文本**: 每张图必须写 descriptive ALT

---

## 7. 技术选型建议

### 7.1 技术栈

参考现有项目 **ChinaProductReviews**（Astro 6 + Tailwind v4 + Vercel + Decap CMS），建议本项目同样使用该技术栈：

| 层面 | 技术选型 | 理由 |
|------|----------|------|
| **框架** | **Astro 6** | SSG 首屏快、Markdown/MDX 友好、内容站点首选 |
| **CSS** | **Tailwind CSS v4** | 快速开发、一致性高、ChinaProductReviews 已验证 |
| **CMS** | **Decap CMS (Netlify CMS)** | Git-based、免费、Markdown 管理、编辑器友好 |
| **部署** | **Vercel** | Astro 友好、Edge Functions、Analytics、免费额度够 |
| **搜索** | **Pagefind** | Astro 原生支持、静态搜索、无需后端 |
| **评论** | **Giscus** | GitHub Discussions 驱动评论，免费，无广告 |
| **分析** | **Plausible 或 Vercel Analytics** | 隐私优先、轻量、无 Cookie 横幅 |
| **RSS** | **@astrojs/rss** | 内建支持 |
| **Sitemap** | **@astrojs/sitemap** | 内建支持 |
| **字体** | **Inter + 系统字体栈** | 加载快速、英文可读性强 |
| **图片** | **Astro 内置 Image** | 自动优化、WebP 转换 |

### 7.2 CMS 选型：Decap CMS

**Decap CMS** 适合本项目的理由：
- Git-based 管理（所有内容存在 GitHub repo）
- Markdown + Frontmatter 是技术出身的写作者的首选
- ChinaProductReviews 已验证工作流
- 无服务器费用
- 支持角色管理和草稿工作流

**配置建议**:
- 评测、教程、工作流各设独立 collection
- 自定义预览模板（显示真实文章样式）
- 使用 GitHub OAuth 管理写作者登录

### 7.3 部署方案

```
GitHub Repository
     │
     ▼ GitHub Actions CI (Lint + Type Check + Build)
     │
     ▼ Vercel Deploy (Preview + Production)
     │
     ├── Production: aiplaybook.com → Vercel
     └── Preview: *.vercel.app (PR previews)
```

**域名建议**:
- **aiplaybook.com**（推荐，简短好记）
- **toolsguide.ai**
- **aitooltips.com**

### 7.4 性能目标

| 指标 | 目标 |
|------|------|
| Lighthouse Performance | ≥ 95 |
| First Contentful Paint (FCP) | < 1.0s |
| Largest Contentful Paint (LCP) | < 1.5s |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 2.0s |

### 7.5 国际化

- **初始阶段**: 仅英文
- **第二阶段**: i18n 支持（Astro 的 i18n 支持）
  - 目标语言: 西班牙语、日语、德语、中文（传统）
- **策略**: 先是机器翻译 + 人工润色

---

## 8. 变现策略

### 8.1 第一阶段（流量 0-10K/mo）

**1. 联盟营销 (Affiliate Marketing)**

推荐联盟网络：
| 平台 | 佣金 | 适合场景 |
|------|------|----------|
| ShareASale | 5-30% | 广泛 SaaS 工具 |
| Impact | 可变 | 大型 SaaS 平台 |
| CJ Affiliate | 可变 | 知名的消费品 |
| PartnerStack | 10-30% | 新兴 SaaS 工具 |
| 直接与工具联系 | 10-25% | 中型 AI 工具 |

> 注意：必须标注 affiliate disclaimer，保持公信力

**2. 工具 Listing / Promote**
- 向新工具开发者提供付费 listing 服务
- "Featured Tool" 位置（首页、分类页）
- 初期免费，流量上来后付费

### 8.2 第二阶段（流量 10K-100K/mo）

**3. 展示广告**
- **AdSense**: 初期可开启，但体验差
- **Mediavine**: 需 50K 月访问量，门槛较高
- **Raptive**: 类似 Mediavine
- **推荐**: 留到 50K+ 再考虑，优先用户体验

**4. 赞助合作**
- 工具厂商赞助评测
- 品牌合作（Sponsored posts）
- Newsletter 赞助位

### 8.3 第三阶段（流量 100K+/mo）

**5. 付费内容**
- **AIPlaybook Pro**: $9.99/mo
  - 独家深度评测
  - 提前访问新内容
  - 无广告体验
- **付费课程**: 与 Futurepedia 学但更实操
  - "The Complete AI Workflow Bootcamp" — $49

**6. Newsletter 变现**
- 免费周报引流 → 赞助 → 付费订阅

### 8.4 收入预测（保守）

| 阶段 | 月访问量 | 主要收入来源 | 预估月收入 |
|------|---------|-------------|-----------|
| 0-3 月 | 0-5K | 无 | $0 |
| 3-6 月 | 5K-20K | Affiliate | $200-$800 |
| 6-12 月 | 20K-80K | Affiliate + Sponsors | $1,000-$5,000 |
| 12-24 月 | 80K+ | Affiliate + Display + Premium | $5,000-$20,000 |

---

## 9. 与现有项目协同

### 9.1 与 ChinaProductReviews 的协同

**差异定位**:
- ChinaProductReviews → 中国产品出海评测（硬件/trade/e-commerce）
- AIPlaybook → AI 工具全球评测（软件/教程）
- 互补不竞争

**矩阵效应**:
1. **跨站链接**: AIPlaybook 文章中提及中国 AI 产品生态时链接到 CPR
2. **共用工具**: 相同的 Astro + Tailwind 技术栈，开发经验复用
3. **受众互补**: CPR 用户是对中国产品感兴趣的全球买家；AIPlaybook 用户是 AI 技术用户 → 互相引流
4. **品牌协同**: 同一团队运营，"ChinaProductReviews" 品牌背书

**具体协同动作**:
- 共享社交媒体账号矩阵（初期可共用一个 Twitter/X 账号）
- 推荐文章复用：CPR 写过的中国 AI 硬件可在 AIPlaybook 做软件评测
- Newsletter 交叉推广
- 共用广告预算（Google Ads 品牌词）

### 9.2 与 AI 教学课程平台（未来项目）的协同

**协同时序**:
1. AIPlaybook 内容站点 → 建立品牌和受众（0-6 月）
2. AIPlaybook 积累教程和工作流内容 → 课程素材（3-9 月）
3. AI 课程平台上线 → 用 AIPlaybook 内容做预热和引流（6-12 月）

**引流路径**:
```
AIPlaybook 文章 → "Want to master this workflow?
                    Check out our full course" → 课程平台
```

**内容复用**:
- 免费教程（站点）→ 用户获取
- 进阶教程 + 资源包 → 课程付费内容

### 9.3 品牌矩阵总览

```
                    ┌──────────────────────┐
                    │  品牌旗舰：OpenClaw    │
                    │  技术/工具/框架品牌    │
                    └───────┬──────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌───────▼──────┐ ┌─────▼──────┐  ┌─────▼──────┐
    │ China        │ │ AI Playbook│  │ AI Course  │
    │ Product      │ │ (本项目)   │  │ Platform   │
    │ Reviews      │ │ AI 工具评测│  │ AI 教学平台│
    │ 中国出海产品 │ │ + 教程工作流│  │ (未来项目) │
    └───────┬──────┘ └─────┬──────┘  └─────┬──────┘
            │               │               │
            └───────────────┼───────────────┘
                            │
                    ┌───────▼───────┐
                    │ Newsletter 矩阵│
                    │ Twitter/X 矩阵 │
                    │ YouTube 频道   │
                    └───────────────┘
```

---

## 10. 域名可用性检查

### 10.1 推荐品牌名 .com 域名检查结果

使用 WHOIS 查询对设计文档中列出的 4 个候选品牌名进行实际可用性检查：

| 品牌名 | .com 状态 | 注册商 | 注册日期 | 备注 |
|---------|----------|--------|---------|------|
| **AIPlaybook** (推荐) | ❌ 已被注册 | Epik LLC | 2017-05-13 | 域名停放中，可能有出售意向 |
| **ToolTogether** | ❌ 已被注册 | Porkbun | 2025-04-04 | 近期注册，可能为抢注 |
| **WorkflowAI** | ❌ 已被注册 | Cloudflare | 2017-02-02 | 有活跃站点 |
| **ToolDepth** | ✅ **可注册** | — | — | 完全可用，无 DNS 记录 |

> **结论**: 4 个候选名中只有 **ToolDepth** 的 .com 域名可用。

### 10.2 替代 TLD 可用性

对无法获取 .com 的品牌名，检查替代 TLD：

| 品牌名 | .ai | .io | .guide | .tips | 推荐方案 |
|---------|-----|-----|--------|-------|---------|
| **AIPlaybook** | ❌ 已注册 | ❌ 已注册 | ✅ 可用 | ✅ 可用 | **aiplaybook.guide** 或 **aiplaybook.tips** |
| **ToolTogether** | ✅ 可用 | ✅ 可用 | ✅ 可用 | ✅ 可用 | **tooltogether.ai** (首选) |
| **WorkflowAI** | ❌ 已注册 | ❌ 已注册 | ✅ 可用 | ✅ 可用 | workflowai.guide |
| **ToolDepth** | ✅ 可用 | ✅ 可用 | — | — | **tooldepth.com** (完美) 或 tooldepth.ai |

### 10.3 最终域名推荐

| 优先级 | 品牌名 | 推荐域名 | 理由 |
|--------|--------|---------|------|
| 🥇 | **ToolDepth** | **tooldepth.com** | .com 可用，品牌名暗示深度评测 |
| 🥇 (并列) | **AIPlaybook** | **aiplaybook.guide** | .guide 与教程定位高度匹配 |
| 🥈 | **AIPlaybook** | **aiplaybook.tips** | .tips 同样适合，简短好记 |
| 🥉 | **ToolTogether** | **tooltogether.ai** | .ai TLD 体现 AI 属性 |

> **最终建议**: 优先考虑 **tooldepth.com**（.com 永远是最高优先级）。如果更看重品牌名的传播性（AIPlaybook 更易记），则使用 **aiplaybook.guide**。

### 10.4 域名购买建议

#### 注册商推荐

| 注册商 | 特点 | 适合场景 |
|--------|------|---------|
| **Cloudflare Registrar** | 成本价 + 0 加价，DNSSEC 免费，隐私保护默认开启 | 推荐首选，经济实惠 |
| **Porkbun** | 价格透明，界面极简，WHOIS 隐私免费 | 追求性价比的好选择 |
| **Namecheap** | 用户量大，客服好，自带邮箱服务 | 需要邮箱套餐时可选 |

#### 购买流程建议

1. **立即锁定**: 所有可用的首选域名应立即注册（年费约 $10-20/年）
2. **多注册保护**: 建议同时注册以下域名做跳转保护：
   - tooldepth.com + tooldepth.ai + tooldepth.io（品牌保护）
   - 或 aiplaybook.guide + aiplaybook.tips + aiplaybook.ai（如果选择 AIPlaybook）
3. **DNS 托管**: 注册后统一托管到 Cloudflare DNS（免费套餐）
4. **邮箱**: 用 Cloudflare Email Routing 创建 info@ 邮箱（免费）

#### AIPlaybook.com 收购评估

如果最终确定使用 AIPlaybook 品牌名，可尝试联系当前持有者（通过 Epik 的 WHOIS 联系邮箱或域名经纪服务）讨论收购价格：

- 当前状态：停放中，无活跃站点 → 收购概率较高
- 预估价格区间：$500-$5,000（域名字面价值 + 持有者议价）
- 建议预算上限：$2,000
- 经纪服务：Afternic、Sedo、Dan.com

---

## 11. 关键词搜索量数据

### 11.1 数据说明

以下数据为使用 Google Keyword Planner、Ahrefs 免费版及 Semrush 公开 API 可查询到的估算值。数据采集时间基点为 2025-2026 年。标注"(估)"的字段为行业常用估算，实际值需通过付费工具确认。

### 11.2 前 10 篇选题关键词数据

#### #1: Claude Code Review 2026

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Claude Code review` |
| 月搜索量 | ~18,000-25,000 (估) |
| CPC | $3.50-$5.00 (估) |
| 竞争度 (KD) | 中等 (35-40/100, 估) |
| 长尾词 | `Claude Code vs Cursor`, `Claude Code IDE review`, `Claude Code pricing` |
| 长尾词月搜索量 | 合计 ~8,000-12,000 (估) |

#### #2: ChatGPT Pro vs Free 2026

| 维度 | 数据 |
|------|------|
| 主要关键词 | `ChatGPT Pro review`, `ChatGPT free vs paid` |
| 月搜索量 | ~35,000-50,000 (估) |
| CPC | $2.50-$4.00 (估) |
| 竞争度 (KD) | 高 (55-65/100, 估) |
| 长尾词 | `Is ChatGPT Pro worth it`, `ChatGPT Plus vs Pro`, `ChatGPT Pro price` |
| 长尾词月搜索量 | 合计 ~15,000-25,000 (估) |
| 数据来源 | Google Keyword Planner — "ChatGPT" 全球月搜索量 14.8M+ |

#### #3: Midjourney v7 Review

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Midjourney review`, `Midjourney v7` |
| 月搜索量 | ~22,000-35,000 (估) |
| CPC | $3.00-$5.50 (估) |
| 竞争度 (KD) | 中高 (45-55/100, 估) |
| 长尾词 | `Midjourney vs DALL-E 4`, `Midjourney pricing`, `Midjourney v7 features` |
| 长尾词月搜索量 | 合计 ~10,000-18,000 (估) |

#### #4: Cursor AI Review

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Cursor AI review`, `Cursor IDE review` |
| 月搜索量 | ~28,000-40,000 (估) |
| CPC | $4.00-$6.00 (估) |
| 竞争度 (KD) | 中高 (40-55/100, 估) |
| 长尾词 | `Cursor AI vs GitHub Copilot`, `Cursor AI pricing`, `Cursor AI tutorial` |
| 长尾词月搜索量 | 合计 ~12,000-18,000 (估) |
| 数据来源 | Ahrefs — "Cursor AI" 搜索量呈上升趋势 |

#### #5: Jasper AI Review 2026

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Jasper AI review` |
| 月搜索量 | ~8,000-12,000 (估) |
| CPC | $3.00-$4.50 (估) |
| 竞争度 (KD) | 中等 (30-40/100, 估) |
| 长尾词 | `Jasper AI vs Copy.ai`, `Jasper AI pricing`, `Jasper AI features` |
| 长尾词月搜索量 | 合计 ~5,000-8,000 (估) |

#### #6: Runway Gen-4 Review

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Runway AI review`, `Runway Gen-4` |
| 月搜索量 | ~12,000-18,000 (估) |
| CPC | $2.50-$4.00 (估) |
| 竞争度 (KD) | 中低 (25-35/100, 估) |
| 长尾词 | `Runway vs Pika`, `Runway video generation`, `Runway pricing` |
| 长尾词月搜索量 | 合计 ~6,000-10,000 (估) |

#### #7: Notion AI Review

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Notion AI review` |
| 月搜索量 | ~15,000-22,000 (估) |
| CPC | $2.00-$3.50 (估) |
| 竞争度 (KD) | 中等 (30-45/100, 估) |
| 长尾词 | `Notion AI features`, `Notion AI vs ChatGPT`, `Notion AI pricing` |
| 长尾词月搜索量 | 合计 ~8,000-12,000 (估) |

#### #8: Descript Review

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Descript review`, `Descript AI editor` |
| 月搜索量 | ~10,000-15,000 (估) |
| CPC | $2.00-$3.50 (估) |
| 竞争度 (KD) | 中等 (28-38/100, 估) |
| 长尾词 | `Descript vs Premiere Pro`, `Descript pricing`, `Descript tutorial` |
| 长尾词月搜索量 | 合计 ~5,000-8,000 (估) |

#### #9: Perplexity Pro Review

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Perplexity AI review`, `Perplexity Pro` |
| 月搜索量 | ~20,000-30,000 (估) |
| CPC | $3.00-$5.00 (估) |
| 竞争度 (KD) | 中高 (40-50/100, 估) |
| 长尾词 | `Perplexity vs Google Search`, `Perplexity Pro vs free`, `Perplexity research` |
| 长尾词月搜索量 | 合计 ~10,000-15,000 (估) |
| 数据来源 | Semrush — "Perplexity AI" 过去 12 月增长 300%+ |

#### #10: Gamma AI Review

| 维度 | 数据 |
|------|------|
| 主要关键词 | `Gamma AI review`, `Gamma app review` |
| 月搜索量 | ~6,000-10,000 (估) |
| CPC | $2.00-$3.00 (估) |
| 竞争度 (KD) | 低 (15-25/100, 估) |
| 长尾词 | `Gamma vs Beautiful.ai`, `Gamma AI pricing`, `Gamma AI presentation` |
| 长尾词月搜索量 | 合计 ~3,000-5,000 (估) |

### 11.3 关键词数据汇总与策略

| 排名 | 选题 | 核心词月搜索量 (估) | 竞争度 | 策略优先级 |
|------|------|-------------------|--------|-----------|
| 1 | ChatGPT Pro vs Free | 35K-50K | 🔴 高 | 需差异化角度 |
| 2 | Cursor AI Review | 28K-40K | 🟡 中高 | 趁热度快速写 |
| 3 | Midjourney v7 | 22K-35K | 🟡 中高 | 版本更新时发布 |
| 4 | Perplexity Pro Review | 20K-30K | 🟡 中高 | 增长趋势好 |
| 5 | Claude Code Review | 18K-25K | 🟢 中等 | ★ 优先，有自身使用经验 |
| 6 | Notion AI Review | 15K-22K | 🟢 中等 | 稳定流量源 |
| 7 | Runway Gen-4 Review | 12K-18K | 🟢 中低 | 视频类流量不错 |
| 8 | Descript Review | 10K-15K | 🟢 中等 | 内容制作刚需 |
| 9 | Jasper AI Review | 8K-12K | 🟢 中等 | 营销类标杆 |
| 10 | Gamma AI Review | 6K-10K | 🟢 低 | 低竞争，容易排名 |

> **关键洞察**: 前 10 篇选题总核心词月搜索量约 17.4 万-25.7 万 (估)。加上长尾词后，可触达的总搜索量约 30 万-50 万/月 (估)。早期优先切入中等竞争度 + 自身有使用经验的选题（如 Claude Code）以建立排名的首期内容。

---

## 12. 内容产线设计（全自动化）

### 12.1 设计原则

参考 ChinaProductReviews 的已验证模式：**双 Agent 全自动流水线**。Agent 可自行调用浏览器、web_fetch、文件读写等全部工具，端到端完成从选题到发布的全流程。

```
                    ┌──────────────────────────────────────────────┐
                    │          小七 (主调度 Agent)                   │
                    │   任务分派 / 质量控制 / 发布审批               │
                    └──────┬───────────────────┬───────────────────┘
                           │                   │
              ┌────────────▼──────┐  ┌─────────▼──────────┐
              │ content-collector │  │ content-operator   │
              │ (采集专员)        │  │ (运营专员)          │
              │                   │  │                    │
              │ • 选题发现        │  │ • 文章生成          │
              │ • 竞品抓取        │  │ • 图片/封面生成     │
              │ • 浏览器截图      │  │ • SEO 优化          │
              │ • 工具信息采集    │  │ • 事实核查          │
              │ • 素材包输出      │  │ • 发布 + 推广       │
              └────────┬──────────┘  └─────────┬──────────┘
                       │                       │
                       ▼                       ▼
              ┌────────────────┐    ┌──────────────────┐
              │  素材包        │    │  文章 + 图片      │
              │  (Git repo)    │───▶│  → GitHub push   │
              └────────────────┘    └────────┬─────────┘
                                             │
                                      ┌──────▼──────┐
                                      │  Vercel 部署 │
                                      └──────┬──────┘
                                             │
                                      ┌──────▼──────┐
                                      │  武总/小七   │
                                      │  最终确认    │
                                      └─────────────┘
```

### 12.2 两大 Agent 职责

#### Agent A: content-collector（采集专员）

**配置**: deepseek-v4-flash | runtime=subagent | context=isolated

**核心能力**: 浏览器自动化、web_fetch、文件读写

**完整工作流**:

```
输入: 选题指令（工具名 + 文章类型）
                │
     ┌──────────▼──────────┐
     │ 1. 官网信息采集      │  web_fetch → 抓取功能列表、定价、更新日志
     └──────────┬──────────┘
                │
     ┌──────────▼──────────┐
     │ 2. 竞品平台抓取      │  web_fetch → Futurepedia/G2/Toolpilot 对应页
     └──────────┬──────────┘  抓取用户评分、评论关键词、对比数据
                │
     ┌──────────▼──────────┐
     │ 3. Reddit/社区挖掘   │  web_fetch → r/artificial, r/AITools 搜索
     └──────────┬──────────┘  提取用户真实评价、痛点、常见问题
                │
     ┌──────────▼──────────┐
     │ 4. 浏览器截图        │  browser navigate + screenshot
     └──────────┬──────────┘  主界面/功能演示/定价页/设置页
                │           （详见第 13 节截图规范）
     ┌──────────▼──────────┐
     │ 5. 真实体验操作       │  browser → 点击功能、输入测试 prompt
     └──────────┬──────────┘  记录响应速度、输出质量、操作路径
                │
                ▼
    输出: 结构化素材包 (JSON/Markdown)
    → 保存到 src/content/collect/{tool-slug}.md
```

**输出格式（素材包）**:
```markdown
# 素材包: [工具名]

## 基本信息
- 名称 / 官网 / 开发者 / 发布日期
- 核心功能列表（从官网提取）
- 定价（Free / Pro / Enterprise）

## 竞品对比数据
- G2 评分: X.X | Capterra: X.X | Toolpilot: X.X
- 主要竞品: [列表 + 简要对比]

## 用户评价摘要
- Reddit 主要讨论点（正面/负面各 3-5 条）
- 常见 Praise / Complaint

## 截图素材
- chatgpt_ui_01_main_dashboard.webp
- chatgpt_feature_02_code_interpreter.webp
- chatgpt_pricing_01.webp
- ...

## 实测体验
- 注册流程: [难度/耗时]
- 核心功能体验: [操作路径 + 主观感受]
- 输出质量: [示例 + 评价]
- 速度/稳定性: [观察]
```

#### Agent B: content-operator（运营专员）

**配置**: deepseek-v4-flash | runtime=subagent | context=isolated

**核心能力**: 自行撰写文章（自身模型）、图片处理、Git 操作

**完整工作流**:

```
输入: 素材包路径 + 文章模板 + 发布指令
                │
     ┌──────────▼──────────┐
     │ 1. 读取素材包        │  读取 collect/{tool-slug}.md
     └──────────┬──────────┘  解析基本信息、竞品数据、截图路径、实测笔记
                │
     ┌──────────▼──────────┐
     │ 2. 生成文章          │  自身模型按模板撰写
     └──────────┬──────────┘  依据文章模板 + 素材包数据
                │           生成完整 Markdown + YAML frontmatter
                │           包含: 标题/评分/Pros&Cons/正文/FAQ
     ┌──────────▼──────────┐
     │ 3. 封面图生成        │  调用 AI 图片工具（DALL-E/Midjourney）
     └──────────┬──────────┘  1200×630px，统一视觉风格
                │
     ┌──────────▼──────────┐
     │ 4. SEO 元数据        │  自动填充: meta description, keywords
     └──────────┬──────────┘  内链插入: 关联文章/教程/工作流
                │           ALT 文本: 为每张截图生成描述
     ┌──────────▼──────────┐
     │ 5. 写入仓库          │  将 .md + 图片 write 到对应目录
     └──────────┬──────────┘  git add + commit + push
                │
     ┌──────────▼──────────┐
     │ 6. 发布通知          │  输出文章摘要给 小七/武总
     └─────────────────────┘  Vercel 自动部署 → 预览链接
                │
                ▼
    最终发布: 武总确认后手动合并 / 直接发布
```

### 12.3 人工介入点（最小化）

| 环节 | Agent 能做 | 人工做什么 | 频率 |
|------|-----------|-----------|------|
| **选题** | Agent 自动发现 + 排序 | 确认优先级（可批量，5min/周） | 每周 |
| **素材采集** | Agent 全部自动 | 无 | 0 |
| **截图** | Agent 浏览器全自动 | 抽查质量 | 按需 |
| **文章生成** | content-operator 自身 | 抽查质量 | 按需 |
| **封面图** | AI 工具全自动 | 抽查风格一致性 | 按需 |
| **事实核查** | Agent 交叉验证 | 抽查关键数据 | 按需 |
| **发布** | Agent git push → Vercel | 武总最终确认 | 每篇 |

> **自动化率: ~95%**。人工仅保留选题方向确认 + 最终发布审批，其余全部由双 Agent 全自动完成。这与中国产品评测站（CPR）的实际运营模式一致。

### 12.4 产线操作指令

**日常调度由小七执行**:

```
# 单篇生产（武总指定工具）
小七 → spawn content-collector
     → "为 [工具名] 采集素材，含官网信息、竞品数据、Reddit评价、浏览器截图"
     → 等待完成
小七 → spawn content-operator
     → "读取 collect/[工具名].md，生成评测文章 + 封面图，git push"
     → 等待完成 → 推送预览链接给武总

# 批量生产（选题池驱动）
小七 → spawn content-collector × 3（并行）
     → 3 个工具同时采集
     → 全部完成
小七 → spawn content-operator × 3（串行/并行）
     → 3 篇文章排队生成
     → 逐篇推送预览给武总
```

### 12.5 产线节奏与效率

| 指标 | 数值 |
|------|------|
| 单篇 Agent 总耗时 | 10-20 分钟（采集 5-10min + 生成 5-10min） |
| 并行能力 | 3-5 篇同时采集，2-3 篇同时生成 |
| 日产量上限 | 8-15 篇（全自动跑） |
| 正常日产量 | 1-3 篇（控制节奏，保证搜索引擎自然收录） |
| 人工单篇耗时 | < 2 分钟（浏览预览 + 确认发布） |
| 每周人工投入 | < 30 分钟 |

---

## 13. 截图素材方案

### 13.1 20 个种子工具截图需求列表

每个工具需要采集以下类型的截图：

| # | 工具名称 | 界面截图 | 功能演示截图 | 设置/配置页 | 定价页 | 输出/结果展示 | 总截图数 |
|---|---------|---------|------------|-----------|-------|------------|--------|
| 1 | ChatGPT | 主界面、对话界面 | GPTs 商店、代码解释器、DALL-E 集成 | 设置页、API Keys | 定价对比表 | AI 生成示例输出 | 8-12 |
| 2 | Claude / Claude Code | Claude 主界面、Claude Code 终端 | 项目分析、长文档处理 | Settings 页 | 定价页 | 代码生成结果 | 8-10 |
| 3 | Gemini | Gemini 主界面 | 多模态输入（图片 + 视频）、Google 集成 | 设置页 | 定价页 | 搜索增强结果 | 6-8 |
| 4 | Midjourney | Discord 界面 / Web UI | 图片生成过程、参数调优 | Settings、版本选择 | 订阅页 | 同 Prompt 不同风格对比 | 8-12 |
| 5 | GitHub Copilot | VS Code 集成界面 | 自动补全、聊天窗口、PR 总结 | 配置页 | 定价对比 | 代码生成示例 | 6-8 |
| 6 | Cursor | IDE 主界面 | Composer、Chat、代码编辑对比 | Settings 页 | 定价页 | 项目编辑前后对比 | 8-10 |
| 7 | Perplexity | 搜索界面 | Pro Search、Collections、Pages | Settings 页 | 定价对比 | 搜索结果对比 Google | 6-8 |
| 8 | Runway | 视频编辑界面 | Text-to-Video、Video-to-Video、绿幕 | 导出设置 | 定价页 | 生成视频 segment | 8-10 |
| 9 | Descript | 主编辑界面 | Transcript 编辑、Screen Recording、语音克隆 | 导出设置 | 定价页 | 编辑前后对比 | 6-8 |
| 10 | Notion AI | 笔记界面 + AI 弹出 | AI 写作、总结、数据库查询 | AI 设置 | 定价页 | AI 生成内容示例 | 6-8 |
| 11 | Jasper | 文档编辑器 | SEO 模式、Brand Voice、Campaigns | Settings 页 | 定价页 | 生成内容对比 | 6-8 |
| 12 | Suno | 音乐生成界面 | Prompt 输入、风格选择、歌词编辑 | 订阅页 | 定价页 | 多个歌曲生成对比 | 6-8 |
| 13 | Gamma | 演示文稿编辑器 | AI 生成幻灯片、模板库、导出选项 | Settings 页 | 定价页 | 生成长度对比 | 6-8 |
| 14 | Grammarly | 编辑器集成 | 写作建议、Tone 检测、全平台 | 设置页 | 定价页 | 写作改进前后对比 | 6-8 |
| 15 | Zapier AI | 自动化工作流编辑器 | AI 任务创建、Chatbots、Tables | 连接配置 | 定价页 | 自动化流程效果 | 8-10 |
| 16 | Canva AI | 设计编辑器 | Magic Studio、AI 图像生成、背景移除 | 设置页 | 定价页 | 设计前后对比 | 6-8 |
| 17 | Otter.ai | 会议记录界面 | 实时转录、标注、摘要生成 | 集成设置 | 定价页 | 转录准确性对比 | 6-8 |
| 18 | DeepSeek | 对话界面 | 文本生成、代码能力展示、文件上传 | 设置页 | 定价页 | 输出质量对比 | 6-8 |
| 19 | 通义千问 (Tongyi) | 对话界面 | 多模态、文档处理、图像理解 | 设置页 | 定价页 | 中文场景效果展示 | 6-8 |
| 20 | 豆包 (Doubao) | 对话界面 | AI 搜索、图片生成、角色对话 | 设置页 | 定价页 | 个性化功能展示 | 6-8 |

### 13.2 截图规范

#### 分辨率标准

| 截图类型 | 分辨率 | 格式 | 说明 |
|----------|--------|------|------|
| 文章封面 | 1200×630px | WebP (压缩) | 符合 OG 标准，统一风格 AI 生成 |
| 评测截图 | 1920×1080 (16:9) | WebP | 全屏截图后裁剪到主要内容区 |
| 功能截图 | 1280×800 (16:10) 或实际窗口大小 | WebP | 聚焦特定功能，不加过宽留白 |
| 步骤图 | 1200×800 | WebP | 教程步骤图，确保每一步可见 |
| 头像/图标 | 400×400px | WebP | 作者头像、工具 Logo |
| 流程图 | SVG 矢量 | SVG | 工作流流程图，不缩放失真 |
| 对比图 (评分) | 1200×800 | SVG/PNG | 雷达图、柱状图等数据可视化 |

#### 截图标注规范

1. **红色箭头** (2px 粗细, #FF4444) 用于标记关键操作入口
2. **蓝色边框** (2px dashed, #4488FF) 用于高亮关键信息区域
3. **编号标注** (1-10 白色数字在红色圆形上) 用于教程步骤图
4. **灰框** (50% opacity) 用于遮盖隐私信息（用户名、邮箱、API Key）
5. **标注大小**: 箭头长度不超过截图宽度 15%，标注文字 14-16px 黑体

#### 文件命名规范

```
格式: {工具slug}_{类型}_{序号}_{描述}.webp

示例:
chatgpt_ui_01_main_dashboard.webp      → ChatGPT 主界面
chatgpt_feature_02_code_interpreter.webp → ChatGPT 代码解释器功能
claude_feature_01_project_analysis.webp   → Claude 项目分析
midjourney_compare_01_same_prompt.webp    → Midjourney 同 Prompt 对比
perplexity_result_01_search_compare.webp  → Perplexity 搜索对比结果

slug 命名规则:
- 全部小写，连字符分隔
- 工具名: chatgpt, claude, gemini, midjourney, copilot, cursor, perplexity, runway, descript, notion-ai, jasper, suno, gamma, grammarly, zapier, canva, otter, deepseek, tongyi, doubao
- 类型: ui(界面), feature(功能), settings(设置), pricing(定价), result(结果), compare(对比), workflow(工作流)
```

#### 目录结构

```
public/images/
├── reviews/
│   ├── chatgpt/
│   │   ├── chatgpt_ui_01_main_dashboard.webp
│   │   ├── chatgpt_feature_02_code_interpreter.webp
│   │   └── ...
│   ├── claude/
│   │   └── ...
│   └── ... (每个工具有独立目录)
├── tutorials/
│   └── [tutorial-slug]/
├── workflows/
│   └── [workflow-slug]/
├── authors/
│   ├── avatar-author1.webp
│   └── ...
└── covers/
    ├── review-chatgpt-2026.webp
    └── ...
```

### 13.3 浏览器自动化批量截图方案

使用 OpenClaw 的浏览器工具实现批量截图：

#### 自动化脚本设计

```python
# 伪代码逻辑
for tool in TOOLS_LIST:
    # 1. 工具注册/登录
    browser.navigate(tool.url)
    browser.wait_for_load()
    
    # 2. 等待页面完全渲染
    if tool.login_required:
        browser.fill(selector="#email", text=credentials[tool]["email"])
        browser.fill(selector="#password", text=credentials[tool]["password"])
        browser.click(selector="button[type='submit']")
        browser.wait_for_navigation()
    
    # 3. 拍摄各类型截图
    for screenshot_type in tool.screenshot_types:
        # 导航到目标页面
        browser.navigate(screenshot_type.url)
        browser.wait(2000)  # 等待动画和内容加载
        
        # 拍摄截图
        result = browser.screenshot(
            path=f"public/images/reviews/{tool.slug}/{tool.slug}_{screenshot_type.type}_01_{screenshot_type.label}.webp",
            fullPage=False
        )
```

#### OpenClaw 具体操作方法

对于每个工具，按以下流程执行：

**步骤 1: 打开工具 Web App**
```
browser tool: open tab → navigate to https://chat.openai.com
browser tool: wait for page load (up to 10s)
```

**步骤 2: 登录（如需）**
```
browser tool: fill email field
browser tool: fill password field
browser tool: click submit
browser tool: wait for dashboard load
```

**步骤 3: 拍摄主界面截图**
```
browser tool: screenshot → 1920×1080 → save to {tool}/ui_01.webp
```

**步骤 4: 触发功能演示并拍摄**
```
# 例：ChatGPT 的代码解释器
browser tool: click element (Code Interpreter button)
browser tool: type prompt → "Write a Python script to analyze CSV data"
browser tool: wait for response (10-30s)
browser tool: screenshot → save to {tool}/feature_code_interpreter.webp
```

**步骤 5: 导航到定价页并拍摄**
```
browser tool: navigate to https://openai.com/pricing
browser tool: wait for load
browser tool: screenshot → save to {tool}/pricing_01.webp
```

#### 注意事项

1. **账号准备**: 每个工具需要准备测试账号（免费版或试用版）
2. **登录态保持**: 使用浏览器 Profile 保持 Cookie，避免反复登录
3. **反爬检测**: 部分工具有反自动化检测，需要：
   - 合理的时间间隔（每次操作间隔 2-5 秒）
   - 光标模拟移动到功能区后再操作
   - 使用正常浏览器指纹（不要特意隐藏自动化特征）
4. **截图尺寸一致**: 统一所有截图在相同窗口尺寸（1920×1080）下拍摄
5. **数据隐私**: 截图前清理 API Keys、个人信息等敏感内容
6. **重试机制**: 每张截图最多重试 3 次，若工具加载失败则跳过并记录

### 13.4 图片处理和优化流程

```
原始截图 (1920×1080 PNG)
       │
       ▼ [ImageMagick / Sharp 批量处理]
1. 裁剪 → 去除无关 UI 元素（浏览器工具栏、侧边栏等）
2. 调整大小 → 根据用途调整到标准分辨率
3. 添加标注 → 箭头、边框、文字说明（Snagit / Figma 手动）
4. 格式转换 → PNG → WebP (质量 80%) 2024
5. 压缩 → WebP lossy 进一步减小文件大小
6. 文件名 → 按命名规范重命名
       │
       ▼
存入 public/images/reviews/{tool}/ 目录
       │
       ▼ GitHub Commit + Push → Vercel 自动部署
```

**优化目标**:

| 指标 | 目标值 |
|------|--------|
| 单张截图文件大小 | < 200KB |
| WebP 转换质量 | 80-85% |
| 全屏图压缩率 | 原始 PNG 的 10-20% |
| 封面图压缩率 | 原始 PNG 的 15-25% |
| 批量处理时间 (20 个工具) | < 30 分钟 |

**推荐工具**:

| 环节 | 工具 | 适用 |
|------|------|------|
| 截图自动化 | OpenClaw browser tool | 浏览器操作和截图 |
| 批量转 WebP | ImageMagick (`convert`) 或 Sharp (Node.js) | 格式转换 + 压缩 |
| 图片标注 | Snagit / CleanShot X | 添加箭头、标注 |
| 封面图生成 | DALL-E 3 API / Midjourney | AI 生成文章封面 |
| 流程图制作 | Mermaid.js (代码内) / draw.io (可视化) | SVG 工作流图 |
| 数据可视化 | Chart.js / Canva 模板 | 评分雷达图、对比图 |

---

## 14. 实施路线图

### Phase 1：MVP（第 1-2 周）

- [ ] 搭建 Astro 项目（从 Chinareview 模板 fork）
- [ ] 配置 Tailwind + 布局
- [ ] 配置 Decap CMS
- [ ] 设计首页和文章模板
- [ ] 写前 5 篇评测 + 2 篇教程
- [ ] 配置 Vercel 部署
- [ ] 配置域名

### Phase 2：内容填充（第 3-6 周）

- [ ] 完成前 20 篇文章
- [ ] 建立分类体系
- [ ] 配置 SEO 基础（sitemap, schema, OG, Analytics）
- [ ] 上线 RSS Feed
- [ ] 建立 Twitter/X 账号
- [ ] 注册联盟营销账号

### Phase 3：增长（第 7-12 周）

- [ ] 完成前 30 篇文章
- [ ] 开始外链建设
- [ ] 发布 Newsletter
- [ ] 申请 Mediavine（如果流量已到 50K）
- [ ] 扩展写作者团队（如有预算）
- [ ] 开始 YouTube 频道（可选）

### Phase 4：变现（第 13 周+）

- [ ] 开通赞助位
- [ ] 评估付费内容可行性
- [ ] 与未来 AI 课程平台的协同准备
- [ ] 评估 i18n 扩展

---

## 附录

### A. 参考资源

- **Astro 文档**: https://docs.astro.build/
- **Decap CMS 文档**: https://decapcms.org/docs/
- **ChinaProductReviews 代码库**: ~/Desktop/dev-tasks/chinareview-launch/
- **Tailwind CSS v4**: https://tailwindcss.com/docs

### B. 工具收录列表（初始种子）

初始评测优先级（按热度 + 自身使用经验）：

1. **ChatGPT** (OpenAI) — 必做，流量核心
2. **Claude / Claude Code** (Anthropic) — 必做，差异化亮点
3. **Gemini** (Google) — 必做
4. **Midjourney** — 设计类标杆
5. **GitHub Copilot** — 编码类标杆
6. **Cursor** — 编码类热点
7. **Perplexity** — 搜索类标杆
8. **Runway** — 视频类标杆
9. **Descript** — 视频/音频标杆
10. **Notion AI** — 生产力标杆
11. **Jasper** — 营销标杆
12. **Suno** — 音乐标杆
13. **Gamma** — 演示文稿标杆
14. **Grammarly** — 写作辅助标杆
15. **Zapier AI** — 自动化标杆
16. **Canva AI** — 设计标杆
17. **Otter.ai** — 转录标杆
18. **DeepSeek** — 中国 AI 亮点（差异化）
19. **通义千问 (Tongyi)** — 中国 AI 亮点
20. **豆包 (Doubao)** — 中国 AI 亮点

### C. 5 维评分体系详细说明

| 维度 | 说明 | 评分标准 |
|------|------|----------|
| **Ease of Use** | 易用性：学习曲线、界面直觉性 | 1-3: 困难, 4-6: 中等, 7-10: 极简 |
| **Features** | 功能深度：核心功能是否强大 | 1-10 基于对标的功能点数量和质量 |
| **Value for Money** | 性价比：价格 vs 功能 | 1-3: 偏贵, 4-6: 合理, 7-10: 超值 |
| **Performance** | 性能表现：速度、准确率、稳定性 | 1-10 基于实测数据 |
| **Ecosystem** | 生态支持：API、社区、集成、客服 | 1-10 基于生态版图规模 |

---

*文档结束 | 生成日期: 2026-05-17 | 生成者: 产品专家 Agent*
## 内容质量与选题方向（2026-05-17 调整）

### 选题策略调整

| 方向 | 说明 | 举例 |
|------|------|------|
| **细分领域工具** | 评测不太热门但很有用的小众 AI 工具 | AI 论文审稿、AI 语音克隆、AI 幻灯片设计、AI 会议记录、AI 代码审查 |
| **深度场景体验** | 热门工具不做概要总结，要结合真实场景写深度体验 | "用 Claude Code 重构一个 5 万行项目" vs "Claude Code review 摘要" |
| **对比评测** | 多工具组合场景下的横向对比 | "用哪套 AI 工具组合做 YouTube 频道最省时间" |

### 深度体验要求（热门工具）

热门工具必须包含以下场景体验，不能只是功能罗列：

| 要素 | 要求 | 来源 |
|------|------|------|
| 真实测试场景 | 至少 2 个完整工作流 | 自己动手或复现博客教程 |
| 数据对比 | 耗时、质量、成本量化 | 知乎/Reddit 真实用户报告 |
| 竞品横评 | 同场景下多工具效果对比 | 官网/博客/用户评价 |

### 素材来源（新增）

```
不限来源，但须注明：
- 知乎 (zhihu.com) — 中文用户深度评测，质量高
- 国外技术博客 (如 Simon Willison / Lilian Weng / Stratechery)
- Reddit r/MachineLearning, r/Artificial
- 工具官方 Blog / Changelog
- Product Hunt 评论区
```

### 新增细分选题（20 篇）

| # | 选题 | 类型 | 难度 |
|---|------|------|------|
| 1 | AI Research Assistant Showdown: Perplexity vs Elicit vs Scispace | 对比 | ★★ |
| 2 | How I Use Claude Code to Refactor a 50K-Line Legacy Project | 深度体验 | ★★★★ |
| 3 | Best AI Meeting Note-Takers Compared: Otter vs Fireflies vs Fathom | 对比 | ★★ |
| 4 | AI Voice Cloning Tools Compared: ElevenLabs vs PlayHT vs Respeecher | 对比 | ★★★ |
| 5 | Building a Faceless YouTube Channel with AI: Complete Workflow | 工作流 | ★★★ |
| 6 | How to Use NotebookLM for Research: Beyond the Basics | 深度体验 | ★★ |
| 7 | AI Presentation Makers Compared: Gamma vs Tome vs Beautiful.ai | 对比 | ★★ |
| 8 | Best AI for Writing in 2026: A Real-World Test Across 10 Scenarios | 对比 | ★★★ |
| 9 | How to Build a Custom GPT That Actually Works | 教程 | ★★★ |
| 10 | AI Code Review Tools: Which One Catches the Most Bugs? | 对比 | ★★★ |
| 11 | Local LLMs in 2026: Running Llama 4 on Consumer Hardware | 教程 | ★★★★ |
| 12 | Best AI Transcription Tools for Podcasters | 对比 | ★★ |
| 13 | How I Automated My Database Migrations with AI | 深度体验 | ★★★ |
| 14 | AI for Product Managers: Tools That Actually Help | 场景评测 | ★★ |
| 15 | Best AI Logo Generators: Looka vs LogoAI vs Canva | 对比 | ★ |
| 16 | How to Make Professional Videos with AI in 2026 | 教程 | ★★ |
| 17 | AI Writing Detectors Tested: Can They Actually Tell? | 对比 | ★★ |
| 18 | Using AI to Learn a New Language: 2026 Edition | 深度体验 | ★★ |
| 19 | Best AI for Data Analysis: ChatGPT vs Claude vs Gemini | 对比 | ★★★ |
| 20 | Running AI Agents Autonomously: n8n vs LangChain vs CrewAI | 对比 | ★★★★ |

### 写作质量要求

| 维度 | 标准 |
|------|------|
| 字数 | 评测 2000-3500 字，教程 1500-2500 字 |
| 深度 | 必须有实测数据、真实场景，不能只有摘要 |
| 来源 | 引用知乎/Reddit/博客等来源，标注出处 |
| 独特视角 | 中国出海视角（中国 AI 生态对比测评） |
