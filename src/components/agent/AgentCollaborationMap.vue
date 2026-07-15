<script setup lang="ts">
import {
  UserRound,
  Route,
  BookOpen,
  BarChart3,
  RefreshCw,
  MessageCircle,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-vue-next'

interface AgentNode {
  name: string
  icon: unknown
  input: string[]
  process: string
  output: string
  status: 'completed' | 'processing' | 'pending'
}

const agents: AgentNode[] = [
  {
    name: '画像智能体',
    icon: UserRound,
    input: ['测评结果', '提问记录', '学习行为'],
    process: '识别薄弱知识点与学习偏好',
    output: '学生画像标签',
    status: 'completed',
  },
  {
    name: '路径规划智能体',
    icon: Route,
    input: ['画像标签', '课程目标', '阶段任务'],
    process: '排序学习任务，生成课前/课中/课后/期末路径',
    output: '六阶段学习路径',
    status: 'completed',
  },
  {
    name: '资源生成智能体',
    icon: BookOpen,
    input: ['画像偏好', '路径阶段', '知识薄弱点'],
    process: '生成知识卡片、思维导图、练习题、虚拟人讲解',
    output: '多模态学习资源',
    status: 'processing',
  },
  {
    name: '评估智能体',
    icon: BarChart3,
    input: ['测评数据', '答题记录', '学习时长'],
    process: '分析测评结果、错题类型、掌握度变化',
    output: '评估报告 + 薄弱点',
    status: 'processing',
  },
  {
    name: '反馈智能体',
    icon: MessageCircle,
    input: ['评估报告', '错题记录', '路径进度'],
    process: '生成正反馈、成长提示和下一步建议',
    output: '学习反馈 + 成长建议',
    status: 'pending',
  },
  {
    name: '画像反向更新',
    icon: RefreshCw,
    input: ['评估结论', '薄弱点', '学生反馈'],
    process: '根据评估结果重构画像，触发下一轮路径优化',
    output: '更新后的画像 + 新路径',
    status: 'pending',
  },
]

function statusLabel(status: string) {
  if (status === 'completed') return '已完成'
  if (status === 'processing') return '处理中'
  return '待触发'
}

function statusIcon(status: string) {
  if (status === 'completed') return CheckCircle2
  if (status === 'processing') return Play
  return Pause
}

function statusColor(status: string) {
  if (status === 'completed') return '#06d6a0'
  if (status === 'processing') return '#00d4ff'
  return 'rgba(255,255,255,0.25)'
}

const agentColors = ['#00d4ff', '#3b82f6', '#7c3aed', '#f59e0b', '#06d6a0', '#f43f5e']
</script>

<template>
  <section class="agent-map">
    <div class="agent-header">
      <p class="agent-kicker">Multi-Agent Execution Chain</p>
      <h2>多智能体协同执行链</h2>
      <p>
        每个智能体接收上游数据、执行专项处理、输出结构化结果，
        最终通过反馈智能体闭合回路，反向更新学生画像。
      </p>
    </div>

    <div class="agent-flow">
      <div v-for="(agent, index) in agents" :key="agent.name" :class="['agent-node', agent.status]" :style="{ '--agent-accent': agentColors[index] }">
        <div class="agent-glow" />

        <div class="agent-node-hd">
          <div class="agent-icon">
            <component :is="agent.icon" :size="20" stroke-width="1.6" />
          </div>
          <div class="agent-status" :style="{ '--st-c': statusColor(agent.status) }">
            <component :is="statusIcon(agent.status)" :size="9" stroke-width="2.5" />
            <span>{{ statusLabel(agent.status) }}</span>
          </div>
        </div>

        <h3>{{ agent.name }}</h3>

        <div class="agent-io">
          <div class="agent-io-row">
            <span class="agent-io-label">输入</span>
            <span class="agent-io-value">{{ agent.input.join('、') }}</span>
          </div>
          <div class="agent-io-row">
            <span class="agent-io-label">处理</span>
            <span class="agent-io-value process">{{ agent.process }}</span>
          </div>
          <div class="agent-io-row">
            <span class="agent-io-label">输出</span>
            <span class="agent-io-value output">{{ agent.output }}</span>
          </div>
        </div>

        <div v-if="index < agents.length - 1" class="agent-arrow">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14m0 0l-5-5m5 5l-5 5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.agent-map {
  margin: 40px auto 60px;
  max-width: 1200px;
  padding: 36px 32px;
  border-radius: 24px;
  background: linear-gradient(165deg, rgba(8, 14, 32, 0.85), rgba(5, 5, 16, 0.9));
  border: 1px solid rgba(0, 212, 255, 0.08);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
}

.agent-header {
  text-align: center;
  margin-bottom: 32px;
}

.agent-kicker {
  color: var(--color-accent-cyan);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
}

.agent-header h2 {
  color: #fff;
  font-family: var(--font-display);
  font-size: 30px;
  margin: 8px 0;
  letter-spacing: -0.01em;
}

.agent-header p {
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.8;
  font-size: 14px;
}

.agent-flow {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.agent-node {
  position: relative;
  padding: 18px 14px 16px;
  border-radius: 18px;
  background: linear-gradient(175deg, rgba(255,255,255,0.05), rgba(255,255,255,0.015));
  border: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: all 0.3s var(--ease-out);
  overflow: hidden;
}

.agent-node:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}

.agent-glow {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 60px;
  background: radial-gradient(ellipse, var(--agent-accent, #00d4ff), transparent 70%);
  opacity: 0.06;
  pointer-events: none;
}

.agent-node.completed {
  border-color: rgba(6, 214, 160, 0.12);
}

.agent-node.completed .agent-glow { opacity: 0.08; }

.agent-node.processing {
  border-color: rgba(0, 212, 255, 0.15);
}

.agent-node.processing .agent-glow {
  opacity: 0.12;
  animation: glow-breathe 3s ease-in-out infinite;
}

.agent-node.pending {
  border-color: rgba(255,255,255,0.03);
  opacity: 0.6;
}

.agent-node-hd {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.agent-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: var(--agent-accent, #00d4ff);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.agent-status {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 2px 7px;
  border-radius: 100px;
  font-size: 9px;
  font-weight: 600;
  color: var(--st-c);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.agent-node h3 {
  color: #fff;
  font-size: 13px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.01em;
}

.agent-io {
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex: 1;
}

.agent-io-row {
  display: flex;
  gap: 4px;
  align-items: baseline;
}

.agent-io-label {
  min-width: 28px;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.25);
  flex-shrink: 0;
  font-weight: 500;
  letter-spacing: 0.03em;
}

.agent-io-value {
  font-size: 10.5px;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.5;
}

.agent-io-value.process {
  color: var(--agent-accent, rgba(0, 212, 255, 0.7));
}

.agent-io-value.output {
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.agent-arrow {
  position: absolute;
  right: -18px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(0, 212, 255, 0.2);
  z-index: 2;
}

@keyframes glow-breathe {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.17; }
}

@media (max-width: 1100px) {
  .agent-flow {
    grid-template-columns: repeat(2, 1fr);
  }
  .agent-arrow { display: none; }
}

@media (max-width: 640px) {
  .agent-map { padding: 24px 16px; }
  .agent-flow { grid-template-columns: 1fr; }
}
</style>