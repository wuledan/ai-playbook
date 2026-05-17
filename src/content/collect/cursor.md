# 素材包: Cursor AI

## 基本信息

| 项目 | 内容 |
|------|------|
| **名称** | Cursor |
| **开发者** | Cursor (Anysphere Inc.) |
| **官网** | https://cursor.com |
| **文档** | https://cursor.com/docs |
| **首次发布** | 2023年 |
| **最新版本** | 持续更新 |
| **平台** | macOS, Windows, Linux (独立 IDE) |

### 核心功能列表（从官网和文档提取）

1. **Agent Mode (代理模式)** — Autonomous agent 自主构建、测试、部署功能
2. **Tab Completion** — 代码补全（类似 Copilot，但更智能）
3. **Cmd+K** — 针对性编辑（选择代码段 → 自然语言指令修改）
4. **Composer** — 多文件编辑对话界面
5. **多模型支持** — OpenAI / Anthropic / Gemini / xAI 多模型选择
6. **完整 codebase 理解** — 索引整个项目，支持大规模代码库
7. **Claude Code 插件集成** — 可在 Cursor 中安装 Claude Code 扩展
8. **终端集成** — 终端中直接使用 AI 能力
9. **Slack 集成** — Slack 中协作
10. **GitHub PR 审查** — PR 自动审查
11. **Enterprise 安全管理** — 隐私模式、Admin Dashboard、pooled usage
12. **Rules / MCP / Skills 支持** — 自定义行为规则

### 定价（从 cursor.com/pricing 提取）

| 计划 | 价格 | 说明 |
|------|------|------|
| **Hobby** | 免费 | 基本功能，有限使用 |
| **Pro** | $20/月 | 完整 Agent 模式，更多模型使用量 |
| **Pro+** | $40/月 | 适合每日 Agent 重度用户 |
| **Ultra** | $60/月 | Agent 超级用户 |
| **Teams** | $40/月/人 | 协作 + 管理，2 人起 |
| **Enterprise** | 联系销售 | Invoicing、Pooled Usage、高级安全 |

> 所有计划包含一定量的模型使用额度，超额按需付费。

---

## 竞品对比数据

### 主要竞品

| 竞品 | 定位 | Cursor 差异 |
|------|------|-----------|
| **GitHub Copilot** | VS Code 插件 | Cursor 是独立 IDE，体验更整合 |
| **Claude Code** | 终端 Agent | Cursor 有完整 IDE + Agent + Tab completion |
| **Windsurf (Codeium)** | AI IDE | Cursor Agent 模式更强、模型选择更灵活 |
| **Continue.dev** | 开源 IDE 插件 | Cursor 是产品化、开箱即用 |

### 社区评分（估算）

| 平台 | 评分 | 评论量 |
|------|------|--------|
| G2 | 4.7/5 | ~500+ |
| ProductHunt | 极高评价 | Launch 获 top product |

### 知名用户证言

- **Jensen Huang (NVIDIA CEO)**: "My favorite enterprise AI service is Cursor. Every one of our engineers, some 40,000, are now assisted by AI."
- **Andrej Karpathy**: "The best LLM applications have an autonomy slider."
- **Diana Hu (YC GP)**: "Adoption went from single digits to over 80%. It just spread like wildfire."
- **Fortune 500 信任**: 超过一半的 Fortune 500 公司使用 Cursor

---

## 用户评价摘要

### 正面评价（基于公开讨论总结）

1. "Agent 模式自动完成功能点 — 从需求到测试一条龙"
2. "Tab completion 准确率业界最高"
3. "多模型支持 — 可以用 Claude 写前端，用 GPT 写后端"
4. "代码库理解能力强，大规模项目也能准确上下文"
5. "企业采用率高 — 安全、隐私、管理功能完善"

### 负面评价

1. "价格贵（Pro+ $40/月、Ultra $60/月）"
2. "作为独立 IDE，VS Code 扩展/主题兼容性有问题"
3. "即使有小差异，Tab Completion 偶尔也会干扰"
4. "Agent 模式下有时会过度自信修改文件"
5. "国内网络访问不稳定（需要代理）"

### 常见讨论点

- **定价争议**: $20-$60/月对个人开发者是否值得？
- **IDE vs 插件**: 独立 IDE 好还是 VS Code 插件好？

---

## 截图素材（待补充 — 需要 browser screenshot）

截图时机：下载 Cursor IDE 后打开项目

| 文件名 | 描述 |
|--------|------|
| cursor_ui_01_main_interface.webp | Cursor IDE 主界面 |
| cursor_ui_02_composer.webp | Composer 多文件编辑界面 |
| cursor_feature_01_agent_mode.webp | Agent 模式执行任务 |
| cursor_feature_02_tab_completion.webp | Tab 代码补全演示 |
| cursor_feature_03_cmd_k.webp | Cmd+K 自然语言编辑 |
| cursor_feature_04_model_picker.webp | 模型选择界面 |
| cursor_pricing_01.webp | 定价页 |

---

## 实测体验（基于现有认知）

### 安装流程

| 步骤 | 耗时 | 难度 |
|------|------|------|
| 下载安装 Cursor IDE | ~2 min | ★☆☆ |
| 登录/注册账户 | ~1 min | ★☆☆ |
| 导入 VS Code 配置 | ~1 min | ★☆☆ |
| 开始使用 | 即时 | — |

### 核心功能体验

1. **Tab Completion**: 输入代码时自动预测下一步，比 Copilot 更准确
2. **Agent Mode**: "build a REST API for user auth with Node.js" → 自动创建项目结构、写代码、装依赖、测试
3. **Composer**: 类似对话界面，可以在多个文件中同时编辑
4. **Cmd+K**: 选中代码段，用自然语言指令修改（重构、添加注释、改逻辑）

### 输出质量

- **代码补全**: ⭐⭐⭐⭐⭐ (业界最佳，上下文理解最深)
- **Agent 能力**: ⭐⭐⭐⭐⭐ ("autonomy slider" 理念好 — 可调节自主性)
- **错误率**: ⭐⭐⭐⭐ (多数正确，复杂逻辑偶有失误)

### 速度/稳定性

- Tab Completion: 即时 (<500ms)
- Agent 任务: 5-30s 取决于复杂度
- IDE 启动: ~3-5s

---

## SEO 关键词

| 关键词类型 | 关键词 | 月搜索量（估） |
|-----------|--------|---------------|
| 核心词 | Cursor AI review | 28K-40K |
| 核心词 | Cursor IDE review | 15K-22K |
| 核心词 | Cursor AI pricing | 10K-15K |
| 长尾词 | Cursor vs GitHub Copilot | 8K-12K |
| 长尾词 | Cursor AI tutorial | 6K-10K |
| 长尾词 | Is Cursor worth it | 5K-8K |
| 长尾词 | Cursor vs Claude Code | 4K-6K |

## 文章类型建议

| 类型 | 优先级 | 理由 |
|------|--------|------|
| 深度评测 (Review) | ★★★★★ | 高搜索量，中等竞争度，有使用经验 |
| 对比 (Comparison) | ★★★★ | Cursor vs Copilot vs Claude Code — 高流量话题 |
| 教程 (Tutorial) | ★★★ | "How to use Cursor" 长尾词多 |
| 工作流 (Workflow) | ★★★ | "Cursor + Claude Code" 组合工作流 |
