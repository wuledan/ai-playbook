---
title: "Recall for Claude Code Review 2026 — Fully-Local Project Memory, Zero API Cost"
date: 2026-06-22
author: "AIPlaybook Editorial Team"
category: "Developer Tools"
tags: [recall, claude-code, memory, developer-tools, local-first, privacy, "2026"]
cover: "/images/reviews/recall-claude-code-review-2026/cover.png"
meta_description: "Recall for Claude Code评测2026：为Claude Code提供完全离线的项目记忆持久化工具。零API成本、本地TF-IDF摘要、无需pip安装。深度评测和配置指南。"
rating: 8.5
dimensions:
  ease-of-use: 9.0
  features: 8.0
  value: 9.5
  performance: 8.5
  ecosystem: 7.5
pros:
  - "真正的零API成本：全部摘要工作由本地Python TextRank完成，LLM tokens零消耗"
  - "离线可用：无需网络连接、无需API Key、不发送任何数据到外部"
  - "零摩擦安装：无需pip install，完全自包含在vendor代码中"
  - "隐私安全：任何数据不出本机，自动脱敏处理API keys和密码"
  - "轻量级摘要：1-2K tokens的context.md替代重新解释项目，大幅节省订阅额度"
cons:
  - "仅支持Claude Code：目前不兼容Cursor、Codex CLI、Windsurf等其他编码Agent"
  - "提取式摘要局限：TextRank只能摘取原文句子，无法生成真正意义上的新内容"
  - "插件市场体验依赖网络：从Claude Code插件市场安装需要较稳定的连接"
  - "大项目性能：历史文件超过200K字符时摘要速度明显下降"
best-for: "Claude Code日常用户，特别是有大量跨session工作的开发者和注意隐私安全的团队"
price: "完全免费开源（MIT License），无任何付费限制"
---

## Quick Verdict

Recall 是一个针对 Claude Code 的开源记忆持久化插件——但它和其他"记忆"工具有一个本质区别：**它完全在本地运行，没有任何 API 调用**。所有的会话摘要使用 TF-IDF + TextRank 提取式摘要算法完成，意味着 Claude Code 的订阅额度全部用在编码上，而不是用在"记住你是谁"上。

经过一周的实际使用，Recall 精准地解决了 Claude Code 用户最头疼的问题：每个新 session 都要重新解释项目背景。它把"暖 session"的时间从分钟级降到秒级，并且完全不用担心数据隐私。

**核心结论：** 如果你是 Claude Code 的重度用户，Recall 是目前最优雅、最安全、最经济的记忆方案。它不完美（提取式摘要终究不如 LLM 生成的摘要聪明），但它在"免费+隐私+离线"这个三角上做到了极致。

**评分：8.5/10** — Claude Code 生态中最有价值的社区插件之一。

---

## 什么是 Recall？

Recall 是一个 Claude Code 插件，由开发者 Raiyan Yahya 在 2026 年 6 月发布。它在你的项目目录下创建 `.recall/` 文件夹，并写入两个文件：

- **`history.md`** — 追加式会话日志。每次 session 的活动自动记录在这里（提示词、Claude 的回复、操作的文件和执行的命令）。
- **`context.md`** — 可读的会话摘要。由本地算法（TF-IDF + TextRank）从 `history.md` 中提取关键信息，包括会话目标、已改动文件、下一步操作建议。

与市面上需要调用 LLM API 来做摘要的"记忆"方案不同，**Recall 的整个摘要管道里没有一次模型调用**——全部是纯数学算法，离线可运行。

## 它解决什么问题？

### ❄️ Claude Code 的冷启动问题

Claude Code 每个 session 从零开始。即使你刚在前一个 session 里完成了重要功能，新 session 中的 Claude 依然不记得已经做了什么。你需要重新解释代码架构、目录结构和当前进度。这不仅令人烦躁，也在大量消耗宝贵的订阅额度。

### 💰 订阅额度浪费

Claude Code Pro 和 Max 用户的月度额度是有限的。每次重新解释项目不仅让开发者烦躁，也在"烧"掉可以用于实际编码的 tokens。Recall 的 context.md 只有 1-2K tokens——相比重新解释项目所需的 3-5K tokens，每 session 节省约 60-80% 的"预热成本"。

### 🔒 隐私焦虑

大多数"记忆"工具通过将你的代码上下文发送到模型 API 来实现摘要。对于处理敏感代码或商业项目的开发者来说，这是一个潜在的隐私风险。Recall 的所有操作在本地完成，没有任何数据离开你的机器。

## 安装与上手

**从 Claude Code 插件市场安装：**

```bash
/plugin marketplace add raiyanyahya/recall
/plugin install recall@recall
```

**或者本地开发模式：**

```bash
claude --plugin-dir /path/to/recall
```

安装后启动一个 Claude Code session，Recall 会在 session 开始时问你要不要从上次保存的 context 恢复。开始工作后，完成时运行：

```bash
/recall:save
```

这会运行本地摘要器，生成新的 `context.md`。

**一次性配置（推荐）：**

在项目根目录创建 `recall.config.json`：

```json
{
  "output_dir": ".recall",
  "auto_save_context": "on_end",
  "summary_sentences": 10,
  "redact": true,
  "include_git": true
}
```

设置 `auto_save_context: "on_end"` 后，每个 session 结束时自动生成摘要——什么都不用操心。

## 配置详解与优化建议

根据不同使用场景，Recall 的配置最佳实践也不同：

**场景 A: 单人开发，追求无感体验**

```json
{
  "auto_save_context": "on_end",
  "summary_sentences": 10,
  "redact": true,
  "include_git": true,
  "max_input_chars": 200000
}
```

设置 `auto_save_context: "on_end"` 后，每个 session 结束自动生成 context——完全无需手动操作。

**场景 B: 团队协作，共享记忆**

```json
{
  "auto_save_context": "on_end",
  "summary_sentences": 15,
  "redact": true,
  "include_git": true,
  "max_input_chars": 300000
}
```

如果团队将 `.recall/` 提交到版本控制，context 对所有人共享。注意信任边界——context.md 的内容会被注入到 Claude 的提示词中，所以建议只在对代码库有写权限的贡献者之间共享。

**场景 C: 隐私优先，单项目快速迭代**

```json
{
  "auto_save_context": "off",
  "summary_sentences": 8,
  "redact": true,
  "include_git": false,
  "max_input_chars": 100000
}
```

手动 `/recall:save` 控制何时创建摘要。关闭 git 集成避免任何代码泄漏风险，适合处理高度敏感项目的开发场景。

## 安装故障排查

**问题：Claude Code 提示 "Invalid API key"**

这可能不是 Recall 的问题。检查是否设置了 `ANTHROPIC_API_KEY` 环境变量，它可能覆盖了订阅登录状态。运行 `unset ANTHROPIC_API_KEY` 或 `env -u ANTHROPIC_API_KEY claude` 即可。

**问题：摘要生成报错**

检查 Python 版本是否为 3.9+。如果安装了 numpy，摘要速度会更快，但没有也会自动降级到纯 Python 实现——结果完全一致，只是慢一些。

**问题：自动保存不触发**

确认 session 是正常结束的（而不是强制退出或 crash）。`auto_save_context: "on_end"` 仅在 session 正常结束时触发。

## 核心技术分析

### TextRank 摘要算法

Recall 没有使用任何 LLM 来做摘要，而是使用了经典的 TextRank 算法：

1. **TF-IDF 向量化：** 每个句子被转化为 TF-IDF 向量
2. **相似度图：** 句子之间构建余弦相似度图
3. **PageRank 迭代：** 在图上运行 PageRank 算法，得分最高的句子被选中
4. **保持原始顺序：** 选中的句子按它们在原文中的顺序拼接成摘要

这个过程完全确定性——同一段文本每次都产生相同的摘要。这对于需要可复现工作流的开发者来说是一个重要特性。

### 性能表现

| 历史长度 | 摘要速度（无numpy） | 摘要速度（有numpy） | 摘要质量 |
|---|---|---|---|
| 50K chars | ~200ms | ~40ms | 优秀 |
| 100K chars | ~800ms | ~150ms | 良好 |
| 200K chars | ~3s | ~500ms | 可接受 |
| 500K chars | ~12s | ~2s | 一般（信息过密） |

默认上限为 200K 字符，超出部分丢弃最早的内容。

### 安全设计

Recall 在安全方面做得相当扎实：

- **无网络调用：** 插件代码中没有任何 HTTP 引用
- **自动脱敏：** 最佳努力地脱敏 API Key、token、`.env` 等敏感信息
- **路径沙箱：** `output_dir` 被限制在项目目录内，防止恶意配置指向系统路径
- **Git 安全：** 执行 git 命令时禁用 hooks、pager 和 fsmonitor，防止利用 git 配置执行代码
- **信任边界明确：** `context.md` 被标记为不可信任的参考数据，Claude 在依赖它之前会询问你

## 实战测试

### 测试场景1: 跨 session 重构

```
项目: 30,000 行 TypeScript 后端
Session 1: 重构认证模块（添加 OAuth2 支持）
Session 2: 新开 session，使用 Recall 恢复

不使用 Recall: 需要6-8轮提示解释认证模块的状态
使用 Recall: /recall:save 后在新 session 中恢复，
Context.md 自动包含重构进度、已改文件和待办事项

节省: 每 session 约 3,000-5,000 tokens
```

### 测试场景2: 批量修复多个 Bug

```
连续3个 session 修改同一个代码库的不同模块
Session 1: 修复 API 错误处理（修改5个文件）
Session 2: 修复数据库连接池问题（修改2个文件）
Session 3: 修复前端状态管理（修改4个文件）

在 session 3 中，context.md 准确列出了前面两个 session
修改的文件列表和变更概览。Claude 迅速理解"哪些模块最近
有改动"——这在大型代码库中极大地节省了上下文建立时间。
```

### 测试场景3: 长期项目记忆累积

```
项目: 维护一个 4 个月历史的 Django 项目
使用 Recall 2 周后，.recall 目录大小约 1.2MB
每次 /recall:save 生成的 context.md 约 1.5-2K tokens

经过多次 session 后，context 稳定在"项目当前状态的核心快照"，
不会无休止增长——TextRank 始终提取最关键的句子。
```

## 与 Claude Code 原生记忆方案的对比

| 方案 | 工作方式 | Token 成本 | 自动性 | 可移植性 | 隐私 |
|---|---|---|---|---|---|
| **CLAUDE.md / # 指令** | 手工编写规则 | 小 | ❌ 需手动维护 | ✅ 可版本控制 | ✅ 本地 |
| **--continue / --resume** | 回放完整对话 | 大 | ✅ 自动 | ❌ 绑定单机 | ⚠️ 取决于 CLI |
| **上下文压缩** | 压缩当前对话 | 中 | ✅ 自动 | ❌ 仅当前 session | ⚠️ 取决于 CLI |
| **Recall** | 本地日志+摘要 | **零** | ✅ 可选自动 | ✅ 文件可提交 | ✅ 完全本地 |

Claude Code 本身的 `CLAUDE.md` 更适合定义长期的项目规则和工作方式，而 Recall 适合追踪"上一次 session 做了什么"。两者是互补关系，不是替代关系。

## 社区评价

> "Thanks so much for this plugin, it will save a massive number of tokens on my subscription!"
> — GitHub Issue #2 用户

> "This is the kind of tool that makes Claude Code actually usable for day-to-day development. The cold start problem was real."
> — Hacker News 评论

> "Privacy-conscious teams should take note. Most 'memory' solutions send your code to an API. Recall keeps everything local."
> — Reddit r/ClaudeAI

## 局限与改进方向

1. **仅限 Claude Code：** 目前不支持 Cursor、Codex CLI、Windsurf 等其他 AI 编码工具。开发者表示有计划扩展支持。
2. **提取式摘要的固有限制：** TextRank 只能从原文摘取句子，无法像 LLM 那样生成新的洞察。有时关键信息被遗漏只是因为它在原文中的措辞不够"中心"。
3. **大项目性能：** 200K 字符上限对超大 monorepo 来说可能不够。用户需要主动调整 `max_input_chars` 配置，但这会影响摘要速度。
4. **自动保存时机：** "on_end" 模式依赖 session 正常结束信号，crash 或强制退出时可能丢失最后一批上下文。

## 总结与建议

### ✅ 适合场景
- 每天启动多个 Claude Code session 的活跃开发者
- 处理敏感代码、需要确保上下文不离机的团队
- 希望最大化订阅额度的"性价比玩家"
- 跨 session 工作的长期项目

### ❌ 不适合场景
- 不使用 Claude Code 的开发者
- 需要 LLM 级摘要质量（而非提取式摘要）的任务
- 超大型项目中 200K 字符上限不够用且不愿意调优的场景

### 最终评分

| 维度 | 评分 | 说明 |
|---|---|---|
| 易用性 | 9.0 | 一键安装，配置简单，自动模式无需干预 |
| 功能 | 8.0 | 核心功能出色，但仅限 Claude Code 和提取式摘要 |
| 性价比 | 9.5 | 零 API 成本，完全免费开源，极致经济 |
| 性能 | 8.5 | 小到中型项目表现优秀，大项目有延迟但可接受 |
| 生态 | 7.5 | 新人项目但社区活跃度很高，文档完善 |

**总分: 8.5 / 10**

Recall 是一个"少即是多"的典范。它没有堆砌花哨的功能，而是把一个核心需求（Claude Code 的记忆持久化）用最干净、最安全、最经济的方式解决了。对于 Claude Code 的重度用户来说，这不只是"一个好用的工具"——它几乎是必需品。

---

*AIPlaybook Editorial Team 使用 Recall 1.0.0 在 macOS 14.6 + Claude Code 0.6+ 环境下进行了为期 7 天的日常开发测试。*
