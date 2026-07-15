# A3 竞赛升级文档

## 项目概述

EduMind 是面向 **软件杯 A3 赛题** 的"基于大模型的个性化资源生成与学习多智能体系统"。

## 核心升级内容

### 1. 多智能体协作闭环

新增 6 个专业 Agent + 1 个 Orchestrator：

- **ProfileAgent**: 学习画像分析，输出维度评分、薄弱点、个性化建议
- **ResourceAgent**: 个性化资源生成，输出概念讲解、例题、练习题、错因提醒、推荐理由、画像证据
- **PathAgent**: 学习路径规划与重规划，根据评估结果动态调整
- **TutorAgent**: 智能辅导，根据画像调整讲解风格和内容深度
- **EvaluationAgent**: 学习效果评估，输出掌握度、建议、画像更新
- **ReflectionAgent**: 学习反思反馈，输出反思总结、成就、风险评估

**Orchestrator** 负责串行依赖和有限并行调度，每次协作生成完整 trace。

### 2. 个性化资源生成闭环

- `POST /api/resources/generate` 接受 profile、weaknesses、topic、resourceType
- 输出完整资源包：概念讲解、例题、练习题（含答案解析）、错因提醒、推荐理由、适配画像证据
- 画像不只生成分数，还驱动：资源选择、讲解风格、练习题难度、学习路径重规划

### 3. 大模型接入抽象

- `server/llm/provider.js` 统一 LLM Provider 层
- 支持环境变量 `LLM_API_URL`、`LLM_API_KEY`、`LLM_MODEL` 启用真实大模型
- 无 API Key 时走本地 deterministic fallback，保证演示稳定
- 所有大模型输出经过结构化解析和兜底

### 4. 可追溯评估与证据链

- `server/evidence/recorder.js` 记录每次关键操作的 trace
- trace 包含：requestId、timestamp、agents、inputs摘要、outputs摘要、evidence、riskFlags、fallbackUsed、durationMs
- `GET /api/evidence/traces` 和 `GET /api/evidence/summary` 提供查询接口
- `/evidence` 页面可视化展示完整证据链

## 新增/修改文件清单

### 后端新增

| 文件 | 说明 |
|---|---|
| `server/llm/provider.js` | LLM 统一接入层 |
| `server/agents/orchestrator.js` | Agent 调度器 |
| `server/agents/profile-agent.js` | 画像分析 Agent |
| `server/agents/resource-agent.js` | 资源生成 Agent |
| `server/agents/path-agent.js` | 路径规划 Agent |
| `server/agents/tutor-agent.js` | 辅导 Agent |
| `server/agents/evaluation-agent.js` | 评估 Agent |
| `server/agents/reflection-agent.js` | 反思 Agent |
| `server/evidence/recorder.js` | 证据记录器 |
| `server/evidence/report.js` | 证据报告生成 |
| `server/schemas.js` | Agent 输入输出 Schema |

### 后端修改

| 文件 | 修改内容 |
|---|---|
| `server/index.js` | 新增 7 个 API 路由 |

### 前端修改

| 文件 | 修改内容 |
|---|---|
| `src/types/api.ts` | 新增 Agent/Trace/Resource 类型定义 |
| `src/lib/api.ts` | 新增 7 个 API 调用函数 |
| `src/router/index.ts` | 新增 /evidence 路由 |
| `src/components/layout/AppLayout.vue` | 导航栏新增"证据链"入口 |

### 前端新增

| 文件 | 说明 |
|---|---|
| `src/views/Evidence.vue` | 证据链可视化页面 |

### 文档新增

| 文件 | 说明 |
|---|---|
| `docs/A3_COMPETITION_UPGRADE.md` | 本文档 |
| `docs/demo_evidence_a3/demo_trace_sample.json` | Demo trace 样本 |
| `docs/demo_evidence_a3/demo_trace_report.md` | Demo 证据链报告 |

## 运行方式

```bash
# 安装依赖
npm install

# 终端 1：启动后端 API 服务
npm run server

# 终端 2：启动前端开发环境
npm run dev

# 构建前端
npm run build

# 启用真实大模型（可选，在后端终端设置环境变量）
LLM_API_URL=https://your-api/v1/chat/completions LLM_API_KEY=your-key npm run server
```

说明：
- 后端默认端口 `8788`，前端 Vite 已配置代理 `/api` → `http://localhost:8788`
- 如果希望后端自动监听重启，可用 `npm run dev:server` 代替 `npm run server`

## 验收场景对照

| 场景 | 实现方式 | 验证 |
|---|---|---|
| 1. 用户完成画像问卷 | ProfileAgent 分析问卷 | POST /api/profile/analyze 或 POST /api/agents/profile |
| 2. 系统生成画像与薄弱点 | ProfileAgent 输出 dimensions + weaknesses | 同上 |
| 3. 多 Agent 协同生成个性化资源 | ProfileAgent → ResourceAgent | POST /api/resources/generate |
| 4. PathAgent 根据评估结果重规划路径 | EvaluationAgent → PathAgent | POST /api/agents/path-replan |
| 5. TutorAgent 回答问题并附带资源推荐 | ProfileAgent → TutorAgent | POST /api/agents/tutor |
| 6. EvaluationAgent 更新掌握度 | EvaluationAgent → ReflectionAgent | POST /api/agents/evaluate |
| 7. Evidence 页面看到完整 trace | /evidence 页面 | GET /api/evidence/traces |
| 8. 一键完整闭环演示 | 6 Agent 串行闭环 | POST /api/agents/run |
| 9. 文档说明 A3 个性化资源生成 + 学习多智能体系统 | 本文档 | docs/A3_COMPETITION_UPGRADE.md |

## 设计原则

1. **不破坏现有接口**: 所有新增路由独立，现有路由保持不变
2. **无 API Key 可运行**: LLM Provider 无 key 时走 deterministic fallback
3. **Agent 协作链路可追溯**: Orchestrator 串行/有限并行调度，每个 Agent 输出含 confidence/evidence/durationMs
4. **证据链完整**: 每次关键操作生成 trace，前端可查看
5. **前后端类型对齐**: TypeScript 类型与后端 JSON 结构一一对应
