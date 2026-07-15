# EduMind — 基于大模型与 RAG 的个性化学习多智能体平台

面向 **软件杯 A3 赛题**（"基于大模型的个性化资源生成与学习多智能体系统"）的参赛作品。基于 Vue 3 + Vite + TypeScript 构建的 7 智能体协同闭环 + 检索增强生成（RAG）系统，覆盖学习画像、个性化资源生成、路径规划与重规划、智能辅导、效果评估、学习反思六大环节。

## 核心特性

- **7 个专业 Agent + Orchestrator**：`ProfileAgent` / `ResourceAgent` / `PathAgent` / `KnowledgePathAgent` / `TutorAgent` / `EvaluationAgent` / `ReflectionAgent`
- **检索增强生成（RAG）**：本地哈希 96 维 embedding + 混合检索（向量 + 标签 + 关键词）+ 8 个领域自动识别；6 个 Agent 全量接入
- **可追溯证据链**：每次多智能体调用生成 trace，前端可视化展示输入/输出/证据/风险
- **三段式持久化**：MySQL（可选）→ JSON 回退（profiles/review）+ SQLite（WASM，agent 协作视图）+ JSON 文件（trace 流）
- **优雅降级**：无 LLM API Key 时全部 Agent 走本地确定性 fallback，演示稳定

## 推荐演示流程

```text
1. 首页 → 查看学习闭环驾驶舱（画像摘要、今日路径、评估反馈、下一步推荐）
2. 首页 → 浏览多智能体执行链（每个节点显示输入/处理/输出/状态）
3. 画像页 → 完成问卷，触发 ProfileAgent 分析（自动生成 trace）
4. 资源页 → 点击任意资源卡片的"为什么推荐？"，查看推荐证据链
5. 路径页 → 查看评估后路径重规划对比（评估前路径 vs 评估后路径）
6. 评估页 → 查看画像更新记录（更新前 → 评估证据 → 更新后）
7. 评估页 → 点击成长知识树红色薄弱节点，查看错因、补救资源、路径影响
8. 证据链页 → 查看所有 Agent 协作 trace、Agent 统计、fallback 率、LLM 状态
9. 一键闭环 → POST /api/agents/run 触发 7 Agent 完整闭环
10. 知识库 → /api/knowledge/metrics 查看检索指标（按 Agent / domain / top docs 分布）
```

## 7 Agent 能力与 RAG 接入

| Agent                | 职责                                                                                     | RAG 接入                        |
| -------------------- | -------------------------------------------------------------------------------------- | ----------------------------- |
| `ProfileAgent`       | 问卷 → 6 维学习画像（知识基础/学习速度/逻辑思维/创造力/专注力/自律力）+ 薄弱点 + 建议                                     | pedagogy 域，注入"主动回忆/心流调节"策略    |
| `ResourceAgent`      | 生成 5 类资源包（思维导图/文档/视频/练习/代码）+ 错因 + 推荐理由                                                 | `detectDomain` 自动识别，注入错因诊断三步法 |
| `PathAgent`          | 学习路径规划与重规划（基础夯实/核心进阶/专题深入 三阶段）                                                         | pedagogy 域，注入"考前冲刺/补救"策略      |
| `KnowledgePathAgent` | 4 域知识图谱路径（基础/核心技能/深度学习/实战）+ topic mastery                                              | pedagogy 域，注入"间隔重复/项目驱动学习"    |
| `TutorAgent`         | 8 模式辅导（qa/solve/explain/brainstorm/case-intro/step-solve/debug-guide/concept-overview） | `detectDomain(question)` 自动路由 |
| `EvaluationAgent`    | 学习效果评估 + 掌握度 + 画像更新建议                                                                  | pedagogy 域，注入"错因诊断/主动回忆"      |
| `ReflectionAgent`    | 学习反思 + 成就 + 下一步 + 风险评估                                                                 | pedagogy 域，注入"心流/反馈闭环"        |

## 知识库（RAG 系统）

### 检索引擎

- **Embedding 模型**：`local-hash-embedding-v1`，本地哈希 96 维（FNV-1a + 大小写归一化 + 中文 bigram），完全离线
- **混合检索**：chunk 级向量相似度（0.5）+ 标签精确匹配（0.3）+ 关键词覆盖（0.2）
- **过滤**：domain / type 元数据过滤；最低分阈值（0.05）过滤假命中

### 知识库规模

| Domain                 | 文档数 | 主题                                                                         |
| ---------------------- | --- | -------------------------------------------------------------------------- |
| `algorithm`            | 10  | 数据结构、算法误区（指针别名、链表边界、BFS visited、DP 子问题、递归终止、二分边界等）                         |
| `systems`              | 4   | 操作系统虚拟内存 / 并发同步 / 网络协议 / 内存泄漏                                              |
| `ai`                   | 2   | 深度学习基础 / Transformer 架构                                                    |
| `software-engineering` | 2   | Git 版本控制 / 软件测试策略                                                          |
| `english`              | 5   | 英语时态 / 虚拟语气 / 阅读定位 / 写作结构 / 词汇记忆                                           |
| `pedagogy`             | 11  | 错因诊断三步法 / 主动回忆 / 苏格拉底提问 / 间隔重复 / 概念图 / 错题本 / 心流 / 考前冲刺 / 创造力 / 自律力 / 调试方法论 |
| `method`               | 6   | 费曼技巧 / 康奈尔笔记 / 番茄钟 / 双链笔记 / 项目驱动 / 知识内化                                    |
| `general`              | 2   | 时间估计 / 学习闭环反馈                                                              |

合计 **42 篇文档 / 81 个 chunk**。每篇带 `agentHint` 字段，指定推荐使用的 Agent 与场景。

### RAG 核心 API

```
GET  /api/knowledge/status          # KB 统计（文档数、chunks、domain 分布、同步 Agent）
POST /api/knowledge/search          # 混合检索（支持 domain / type / weights / agentName）
GET  /api/knowledge/metrics         # 检索指标（按 Agent 分布、命中率、Top Docs）
POST /api/knowledge/metrics/reset   # 重置指标快照
```

每条命中包含 `scoreBreakdown`（vector/tag/keyword 三项分）和 `matchedProfileTags`，便于前端展示"为什么命中"。

## 已提供 API 完整列表

### 系统 / 健康

```
GET  /api/health                    # 健康检查
GET  /api/llm/status                # LLM 配置状态（不泄露 key）
```

### 多智能体编排

```
POST /api/agents/run                # 一键完整闭环（7 Agent 串行）
POST /api/agents/profile            # ProfileAgent 单点
POST /api/agents/path-replan        # EvaluationAgent → PathAgent 重规划
POST /api/agents/tutor              # ProfileAgent → TutorAgent 智能辅导
POST /api/agents/evaluate           # EvaluationAgent → ReflectionAgent 综合评估
POST /api/resources/generate        # ProfileAgent → ResourceAgent 资源生成
```

### 学习画像

```
POST /api/profile/analyze           # 触发画像分析
GET  /api/profile/latest            # 读取最新画像
POST /api/profile/save              # 直接保存画像
```

### 知识路径

```
POST /api/knowledge-path/generate   # 生成个性化知识图谱路径
GET  /api/knowledge-path/latest     # 读取最新路径
```

### 知识库（RAG）

```
GET  /api/knowledge/status
POST /api/knowledge/search
GET  /api/knowledge/metrics
POST /api/knowledge/metrics/reset
```

### 复习巩固

```
POST /api/review/generate           # 生成复习题（基于画像薄弱点）
POST /api/review/submit             # 提交答案（自动更新画像 + 重规划路径）
GET  /api/review/mistakes           # 查看错题集
```

### 对话 / 辅导

```
POST /api/chat                      # 自由对话（支持多模态）
GET  /api/chat/history              # 对话历史
POST /api/tutoring/ask              # 智能辅导
GET  /api/tutoring/history          # 辅导历史
GET  /api/tutoring/topics           # 辅导主题列表
```

### 资源 / 路径 / 评估（静态数据）

```
GET  /api/resources                 # 资源库（支持 ?type=&q= 过滤）
GET  /api/resources/recommended     # 推荐资源
GET  /api/learning-path             # 学习路径静态数据
GET  /api/evaluation                # 评估数据
GET  /api/agent/workflow            # 演示用 Agent 流程
```

### 证据链

```
GET  /api/evidence/traces?limit=&offset=   # trace 列表
GET  /api/evidence/summary                 # trace 统计摘要
```

### Agent 协作视图

```
GET  /api/agent-collaboration?day=          # 单日协作数据（合并真实 + 模拟）
GET  /api/agent-collaboration/days          # 7 天列表
POST /api/agent-collaboration/seed          # 重新填充 7 天模拟数据
```

## 项目结构

```
v4/
├── server/                            # 后端 Node 服务（端口 8788）
│   ├── index.js                       # HTTP 入口 + 路由
│   ├── data.js                        # 数据访问层（JSON fallback / 业务工具）
│   ├── schemas.js                     # Agent 名常量 + 结果结构
│   ├── agents/                        # 7 个 Agent + Orchestrator
│   │   ├── profile-agent.js
│   │   ├── resource-agent.js
│   │   ├── path-agent.js
│   │   ├── knowledge-path-agent.js
│   │   ├── tutor-agent.js
│   │   ├── evaluation-agent.js
│   │   ├── reflection-agent.js
│   │   └── orchestrator.js
│   ├── llm/provider.js                # LLM 抽象（OpenAI 兼容）
│   ├── knowledge-base/                # RAG 系统
│   │   ├── documents.js               # 知识库文档（42 篇）
│   │   ├── chunking.js                # 文本切分
│   │   ├── vector-store.js            # 哈希 embedding + 混合检索
│   │   ├── detect-domain.js           # 8 域关键词识别
│   │   ├── retrieval.js               # 检索统一入口 + evidence 构造
│   │   └── metrics.js                 # 检索指标
│   ├── evidence/
│   │   ├── recorder.js                # trace 持久化 + retrievalSummary 抽取
│   │   └── report.js                  # trace 报告生成
│   ├── store/                         # 持久化层
│   │   ├── account-profile.js         # MySQL + JSON 回退
│   │   ├── review-question.js         # MySQL + JSON 回退
│   │   ├── agent-collaboration.js     # SQLite WASM
│   │   └── mysql-profile-schema.sql   # DDL 参考
│   └── content/                       # 静态 JSON 资源
│
├── src/                               # 前端 Vue 3
│   ├── views/                         # 16 个页面（Login / Welcome / Profile / LearningPath /
│   │                                 # Evaluation / Tutoring / Chat / Evidence / Admin / …）
│   ├── components/                    # 组件按领域分目录（agent / dashboard / evaluation /
│   │                                 # knowledge-tree / learning-path / resources / …）
│   ├── composables/                   # 业务组合式函数
│   ├── router/index.ts                # 路由
│   ├── store/ + stores/               # Pinia 状态
│   ├── lib/api.ts                     # 前端 API 封装
│   ├── types/api.ts                   # TS 类型定义
│   └── assets/styles/                 # Tailwind 编译产物
│
├── data/
│   └── agent-collaboration-v2.db      # SQLite 协作数据
│
├── docs/                              # 项目文档
│   ├── A3_COMPETITION_UPGRADE.md      # A3 升级说明
│   ├── 软件杯项目介绍.md                # 评审介绍
│   ├── 3D星系交互模块-实施方案.md
│   ├── 资源页面-设计方案.md
│   └── demo_evidence_a3/              # A3 评审证据链示例
│
├── tests/                             # 单元测试
│   ├── chunking.test.mjs
│   └── vector-store.test.mjs
│
├── DESIGN.md                          # 设计系统（深色 / 极光青）
├── PRODUCT.md                         # 产品定义
├── 课程内容文档.md                     # 24 门课程体系
└── EduMind_参赛作品文档.docx          # 参赛文档
```

## 启动方式

### 一键启动（Windows）

```bash
start.bat
```

### 手动启动

```bash
# 终端 1：后端 API（默认端口 8788）
npm install
npm run server

# 终端 2：前端开发环境
npm run dev
```

### 后端自动监听

```bash
npm run dev:server
```

### 启用真实 LLM（可选）

```bash
# .env 文件
LLM_API_URL=https://your-llm-provider/v1/chat/completions
LLM_API_KEY=your-key
LLM_MODEL=your-model-name
```

**说明**：

- Vite 已通过 `vite.config.ts` 把 `/api` 代理到 `http://localhost:8788`
- 默认 API 端口 `8788`（可通过 `PORT` 环境变量调整）
- 无 LLM Key 时所有 Agent 走本地确定性 fallback，演示仍然完整

## 验证

### 单元测试

```bash
node --test tests/chunking.test.mjs tests/vector-store.test.mjs
```

**结果**：27 / 27 通过

### 接口验证

```bash
# 健康检查
curl -s http://localhost:8788/api/health

# RAG 知识库状态
curl -s http://localhost:8788/api/knowledge/status

# RAG 检索
curl -s -X POST http://localhost:8788/api/knowledge/search \
  -H 'Content-Type: application/json' \
  -d '{"query":"指针别名 怎么理解","limit":3}'

# 检索指标
curl -s http://localhost:8788/api/knowledge/metrics

# Agent 闭环（ProfileAgent + TutorAgent）
curl -s -X POST http://localhost:8788/api/agents/tutor \
  -H 'Content-Type: application/json' \
  -d '{"question":"虚拟内存和分页是什么关系","mode":"explain","profile":{"weaknesses":[{"tag":"操作系统","count":2}]}}'

# 一键 7 Agent 完整闭环
curl -s -X POST http://localhost:8788/api/agents/run \
  -H 'Content-Type: application/json' -d '{}'

# 证据链
curl -s http://localhost:8788/api/evidence/summary
curl -s 'http://localhost:8788/api/evidence/traces?limit=5'
```

### 类型检查

```bash
./node_modules/.bin/vue-tsc --noEmit
```

## 持久化策略

| 数据                | 主存储                                                           | 回退                  |
| ----------------- | ------------------------------------------------------------- | ------------------- |
| 用户画像 / 知识路径       | MySQL（`MYSQL_URL` 或 `MYSQL_HOST/PORT/USER/PASSWORD/DATABASE`） | `server/store.json` |
| 复习题 / 错题集         | MySQL（同一连接）                                                   | `server/store.json` |
| 7 天 Agent 协作视图    | SQLite WASM（`data/agent-collaboration-v2.db`）                 | 无                   |
| Trace 流（最近 200 条） | JSON 文件（`server/evidence-data/traces.json`）                   | 无                   |
| 对话 / 辅导历史         | `server/store.json`                                           | 无                   |

MySQL 表结构参见 `server/store/mysql-profile-schema.sql`。

## 证据链可观测性

每次多智能体调用生成 trace 记录，包含：

- `requestId`, `timestamp`, `agents[]`（参与 Agent 名）
- `inputsSummary` / `outputsSummary`
- `evidence[]`（命中知识库条目标题列表 + 领域）
- `riskFlags[]`（高风险评估标记）
- `fallbackUsed`, `durationMs`
- `agentResults[]`（每个 Agent 的 inputSummary / outputSummary / confidence / evidence / durationMs）
- `retrievalSummary`（RAG 检索聚合：totalHits、agentsUsed、topDomains、topDocs、globalMetrics 快照）

前端 `/evidence` 页面可视化展示上述内容。

## 设计系统

详见 [DESIGN.md](DESIGN.md)。核心要点：

- 深邃暗夜（Abyss）+ 极光青（Aurora Cyan #00d4ff）
- 衬线标题（Instrument Serif）+ 无衬线正文（Outfit）+ 等宽代码（JetBrains Mono）
- 静态表面平坦，光晕仅出现在交互态
- 内容优先，避免企业后台灰白表格风格与 SaaS hero-metric 模板

## 文档导航

- [DESIGN.md](DESIGN.md) — 完整设计系统
- [PRODUCT.md](PRODUCT.md) — 产品定义与品牌
- [课程内容文档.md](课程内容文档.md) — 24 门课程体系
- [docs/A3\_COMPETITION\_UPGRADE.md](docs/A3_COMPETITION_UPGRADE.md) — A3 升级详情
- [docs/demo\_evidence\_a3/](docs/demo_evidence_a3/) — A3 评审证据链示例
- [EduMind\_参赛作品文档.docx](EduMind_参赛作品文档.docx) — 参赛作品文档

##

## License

MIT
