<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUp,
  Award,
  Brain,
  Clock,
  Download,
  FileBarChart,
  PenTool,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-vue-next'
import { fetchEvaluation } from '@/lib/api'
import KnowledgeTree from '@/components/knowledge-tree/KnowledgeTree.vue'
import type { TreeBranch } from '@/components/knowledge-tree/KnowledgeTree.vue'

type SuggestionType = 'weakness' | 'strength' | 'positive' | 'action'

interface StatItem {
  label: string
  value: string
  change: string
  color: string
  icon: unknown
}

interface SuggestionItem {
  text: string
  type: SuggestionType
  icon: unknown
}

const router = useRouter()
const loaded = ref(false)
const isLoading = ref(false)
const showReportModal = ref(false)
const reportDate = ref('2026-05-12')

const defaultStats: StatItem[] = [
  { label: '学习时长', value: '86h', change: '+8h', icon: Clock, color: '#00d4ff' },
  { label: '编程练习', value: '42', change: '+5', icon: PenTool, color: '#7c3aed' },
  { label: '模型正确率', value: '79%', change: '+4%', icon: Target, color: '#06d6a0' },
  { label: '知识掌握度', value: '65%', change: '+8%', icon: TrendingUp, color: '#f59e0b' },
]

const defaultSuggestions: SuggestionItem[] = [
  { text: '正则化(Ridge/Lasso)是当前短板，建议安排 2 小时专项复习。', type: 'weakness', icon: AlertTriangle },
  { text: '线性回归掌握较扎实，可以逐步加入分类算法实战。', type: 'strength', icon: Sparkles },
  { text: '本周 Scikit-learn 编程练习较上周提升 15%，继续保持。', type: 'positive', icon: ArrowUp },
  { text: '建议增加 SVM 核函数的编程练习，理论与实践比例调整到 1:1。', type: 'action', icon: ArrowRight },
]

const stats = ref(defaultStats)
const suggestions = ref(defaultSuggestions)

const subjects = [
  { name: 'Python数据科学基础', mastery: 88, color: '#00d4ff' },
  { name: '线性回归', mastery: 82, color: '#3b82f6' },
  { name: '分类算法', mastery: 68, color: '#7c3aed' },
  { name: '集成学习', mastery: 55, color: '#06d6a0' },
  { name: '无监督学习', mastery: 45, color: '#f59e0b' },
  { name: '神经网络入门', mastery: 35, color: '#f43f5e' },
]

const weeklyTrend = [
  { week: 'W1', you: 55, avg: 50 },
  { week: 'W2', you: 58, avg: 52 },
  { week: 'W3', you: 62, avg: 54 },
  { week: 'W4', you: 68, avg: 55 },
  { week: 'W5', you: 65, avg: 56 },
  { week: 'W6', you: 72, avg: 58 },
  { week: 'W7', you: 78, avg: 60 },
]

const badges = [
  { icon: Sparkles, name: '初识学习', earned: true, color: '#00d4ff' },
  { icon: Zap, name: '连续打卡', earned: true, color: '#06d6a0' },
  { icon: Award, name: '知识达人', earned: true, color: '#7c3aed' },
  { icon: PenTool, name: '刷题能手', earned: false, color: '#f59e0b' },
  { icon: Brain, name: '项目先锋', earned: false, color: '#f43f5e' },
  { icon: TrendingUp, name: '学习大师', earned: false, color: '#3b82f6' },
]

const iconMap = {
  Clock,
  PenTool,
  Target,
  TrendingUp,
  Sparkles,
  Award,
  Zap,
  Brain,
} as const

const chartPoints = computed(() => {
  const maxX = 350
  const width = maxX / (weeklyTrend.length - 1)
  const toY = (value: number) => 100 - value
  const youPoints = weeklyTrend.map((item, index) => `${index * width},${toY(item.you)}`).join(' ')
  const avgPoints = weeklyTrend.map((item, index) => `${index * width},${toY(item.avg)}`).join(' ')
  return { youPoints, avgPoints }
})

const averageMastery = computed(() => {
  const sum = subjects.reduce((total, item) => total + item.mastery, 0)
  return Math.round(sum / subjects.length)
})

const treeBranches = computed<TreeBranch[]>(() => {
  const branchTopicMap: Record<string, { id: string; label: string; mastery: number }[]> = {
    'Python数据科学基础': [
      { id: 'ch1-1', label: 'NumPy', mastery: 90 },
      { id: 'ch1-2', label: 'Pandas', mastery: 85 },
      { id: 'ch1-3', label: 'Matplotlib', mastery: 88 },
      { id: 'ch1-4', label: '数据清洗', mastery: 82 },
    ],
    '线性回归': [
      { id: 'ch2-1', label: '损失函数', mastery: 80 },
      { id: 'ch2-2', label: '梯度下降', mastery: 68 },
      { id: 'ch2-3', label: '正则化', mastery: 55 },
      { id: 'ch2-4', label: '特征缩放', mastery: 72 },
    ],
    '分类算法': [
      { id: 'ch3-1', label: '逻辑回归', mastery: 70 },
      { id: 'ch3-2', label: '决策树', mastery: 65 },
      { id: 'ch3-3', label: 'SVM', mastery: 52 },
      { id: 'ch3-4', label: '核函数', mastery: 45 },
    ],
    '集成学习': [
      { id: 'ch4-1', label: '随机森林', mastery: 60 },
      { id: 'ch4-2', label: 'GBDT', mastery: 50 },
      { id: 'ch4-3', label: 'XGBoost', mastery: 42 },
      { id: 'ch4-4', label: '模型融合', mastery: 38 },
    ],
    '无监督学习': [
      { id: 'ch5-1', label: 'K-Means', mastery: 55 },
      { id: 'ch5-2', label: 'PCA', mastery: 48 },
      { id: 'ch5-3', label: '异常检测', mastery: 35 },
      { id: 'ch5-4', label: '轮廓系数', mastery: 40 },
    ],
    '神经网络入门': [
      { id: 'ch6-1', label: '感知机', mastery: 45 },
      { id: 'ch6-2', label: '反向传播', mastery: 38 },
      { id: 'ch6-3', label: 'PyTorch', mastery: 32 },
      { id: 'ch6-4', label: 'Dropout', mastery: 28 },
    ],
  }

  return subjects.map((subject, idx) => ({
    id: `branch-${idx}`,
    label: subject.name,
    mastery: subject.mastery,
    topics: branchTopicMap[subject.name] || [
      { id: `${subject.name}-1`, label: '基础概念', mastery: Math.min(subject.mastery + 5, 100) },
      { id: `${subject.name}-2`, label: '核心方法', mastery: subject.mastery },
      { id: `${subject.name}-3`, label: '进阶应用', mastery: Math.max(subject.mastery - 15, 0) },
    ],
  }))
})

function handleTreeNodeClick(branchId: string, topicId: string) {
  const branch = treeBranches.value.find(b => b.id === branchId)
  const topic = branch?.topics.find(t => t.id === topicId)
  if (topic) {
    router.push({ path: '/tutoring', query: { q: `讲解一下${topic.label}` } })
  }
}

function handleTreeBranchClick(branchId: string) {
  const branch = treeBranches.value.find(b => b.id === branchId)
  if (branch) {
    router.push({ path: '/tutoring', query: { q: `${branch.label}学习路径` } })
  }
}

function suggestIconColor(type: SuggestionType) {
  const colors: Record<SuggestionType, string> = {
    weakness: 'var(--color-accent-rose)',
    strength: 'var(--color-accent-cyan)',
    positive: 'var(--color-accent-emerald)',
    action: 'var(--color-accent-amber)',
  }
  return { color: colors[type] }
}

function inferSuggestionType(text: string): SuggestionType {
  if (text.includes('短板') || text.includes('薄弱') || text.includes('加强')) return 'weakness'
  if (text.includes('保持') || text.includes('提升')) return 'positive'
  if (text.includes('可以') || text.includes('掌握')) return 'strength'
  return 'action'
}

function iconForSuggestion(type: SuggestionType) {
  if (type === 'weakness') return AlertTriangle
  if (type === 'strength') return Sparkles
  if (type === 'positive') return ArrowUp
  return ArrowRight
}

function iconForStat(label: string, iconName?: string) {
  if (iconName && iconName in iconMap) {
    return iconMap[iconName as keyof typeof iconMap]
  }

  if (label.includes('时长')) return Clock
  if (label.includes('课时')) return PenTool
  if (label.includes('正确率')) return Target
  if (label.includes('掌握')) return TrendingUp
  return Brain
}

function goToTutoring(text?: string) {
  router.push({ path: '/tutoring', query: text ? { q: text } : {} })
}

function masteryColor(value: number) {
  if (value >= 80) return 'var(--color-accent-emerald)'
  if (value >= 60) return 'var(--color-accent-cyan)'
  if (value >= 40) return 'var(--color-accent-amber)'
  return 'var(--color-accent-rose)'
}

onMounted(() => {
  isLoading.value = true
  setTimeout(() => {
    loaded.value = true
  }, 100)

  fetchEvaluation()
    .then(data => {
      stats.value = data.stats.map(item => ({
        ...item,
        icon: iconForStat(item.label, item.icon),
      }))

      suggestions.value = data.suggestions.map(item => {
        const type = item.type ?? inferSuggestionType(item.text)
        return {
          text: item.text,
          type,
          icon: iconForSuggestion(type),
        }
      })

      reportDate.value = data.generatedAt
    })
    .catch(() => {
      // Keep local fallback data when the API server is unavailable.
    })
    .finally(() => {
      isLoading.value = false
    })
})
</script>

<template>
  <div class="evaluation">
    <div class="eval-hero">
      <div>
        <div class="hero-badge">效果评估</div>
        <h1 class="hero-title">学习效果<span class="gradient-text">数据洞察</span></h1>
        <p class="hero-desc">从学习时长、知识掌握和成长曲线三个维度看清当前状态。</p>
        <p v-if="isLoading" class="page-status">正在同步评估数据...</p>
      </div>
      <button class="report-btn" @click="showReportModal = true">
        <FileBarChart :size="16" stroke-width="1.5" />
        <span>生成评估报告</span>
      </button>
    </div>

    <KnowledgeTree
      :branches="treeBranches"
      :overall-mastery="averageMastery"
      @node-click="handleTreeNodeClick"
      @branch-click="handleTreeBranchClick"
    />

    <div class="stats-grid">
      <div v-for="item in stats" :key="item.label" class="stat-card" :style="{ '--s-color': item.color }">
        <div class="stat-icon">
          <component :is="item.icon" :size="20" stroke-width="1.5" />
        </div>
        <div class="stat-body">
          <div class="stat-top">
            <span class="stat-value">{{ item.value }}</span>
            <span class="stat-change">{{ item.change }}</span>
          </div>
          <span class="stat-label">{{ item.label }}</span>
        </div>
      </div>
      <div class="badge-strip">
        <div
          v-for="badge in badges.slice(0, 3)"
          :key="badge.name"
          :class="['mini-badge', { earned: badge.earned }]"
          :style="{ '--b-color': badge.color }"
        >
          <component :is="badge.icon" v-if="badge.earned" :size="14" stroke-width="2" />
          <span v-else class="badge-locked">•</span>
        </div>
        <span class="badge-more">+{{ badges.filter(item => !item.earned).length }} 待解锁</span>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="card chart-card">
        <div class="card-head">
          <h2 class="card-title-sm">能力成长曲线</h2>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-dot cyan" />我的</span>
            <span class="legend-item"><span class="legend-dot dim" />平均</span>
          </div>
        </div>
        <div class="chart-body">
          <svg viewBox="0 0 350 120" class="trend-svg">
            <line x1="0" y1="30" x2="350" y2="30" stroke="rgba(0,212,255,0.04)" stroke-width="1" />
            <line x1="0" y1="60" x2="350" y2="60" stroke="rgba(0,212,255,0.04)" stroke-width="1" />
            <line x1="0" y1="90" x2="350" y2="90" stroke="rgba(0,212,255,0.04)" stroke-width="1" />
            <polyline :points="chartPoints.avgPoints" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-dasharray="5 4" />
            <polyline :points="chartPoints.youPoints" fill="none" stroke="url(#trendLine)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            <defs>
              <linearGradient id="trendLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stop-color="#00d4ff" />
                <stop offset="100%" stop-color="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
          <div class="chart-labels">
            <span v-for="item in weeklyTrend" :key="item.week">{{ item.week }}</span>
          </div>
          <div class="chart-footer">
            <span>累计提升 <strong>23%</strong></span>
            <span>较上周 <strong class="up">+12%</strong></span>
          </div>
        </div>
      </div>

      <div class="card mastery-card">
        <div class="card-head">
          <h2 class="card-title-sm">知识掌握度</h2>
          <span class="mastery-avg">平均 {{ averageMastery }}%</span>
        </div>
        <div class="mastery-list">
          <div v-for="subject in subjects" :key="subject.name" class="mastery-row">
            <div class="mastery-top">
              <span class="mastery-name">{{ subject.name }}</span>
              <span class="mastery-pct" :style="{ color: masteryColor(subject.mastery) }">{{ subject.mastery }}%</span>
            </div>
            <div class="mastery-track">
              <div
                class="mastery-fill"
                :style="{
                  width: loaded ? `${subject.mastery}%` : '0%',
                  background: masteryColor(subject.mastery),
                }"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card suggest-card">
        <div class="card-head">
          <h2 class="card-title-sm">学习建议</h2>
          <span class="suggest-count">{{ suggestions.length }} 条</span>
        </div>
        <div class="suggest-list">
          <div
            v-for="(item, index) in suggestions"
            :key="index"
            :class="['suggest-item', item.type]"
            @click="goToTutoring(item.text)"
          >
            <div class="suggest-icon">
              <component :is="item.icon" :size="15" stroke-width="1.5" :style="suggestIconColor(item.type)" />
            </div>
            <span class="suggest-text">{{ item.text }}</span>
            <ArrowRight :size="13" stroke-width="1.5" class="suggest-arrow" />
          </div>
        </div>
      </div>
    </div>

    <transition name="scale-in">
      <div v-if="showReportModal" class="modal-overlay" @click.self="showReportModal = false">
        <div class="modal">
          <div class="modal-header">
            <h2 class="modal-title">学习评估报告</h2>
            <button class="modal-close-btn" @click="showReportModal = false">✕</button>
          </div>
          <div class="modal-body">
            <div class="report-summary">
              <div class="report-grade">
                <span class="grade-letter">B+</span>
                <span class="grade-label">综合评级</span>
              </div>
              <div class="report-metrics">
                <div class="metric-item">
                  <span class="metric-label">学习总时长</span>
                  <span class="metric-value">128 小时</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">完成课时</span>
                  <span class="metric-value">47 节</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">平均正确率</span>
                  <span class="metric-value">82%</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">知识掌握度</span>
                  <span class="metric-value">68%</span>
                </div>
              </div>
            </div>
            <div class="report-section">
              <h3>阶段总结</h3>
              <p>当前学习节奏稳定，机器学习基础表现较好，但在深度学习和大模型应用上的完成度还有明显提升空间。</p>
            </div>
            <div class="report-section">
              <h3>下一步建议</h3>
              <ul class="rec-list">
                <li>优先补足概率统计与模型评估相关内容。</li>
                <li>增加项目驱动学习，把知识点转成可运行成果。</li>
                <li>每周做一次短复盘，及时调整学习节奏。</li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <span class="footer-date">{{ reportDate }}</span>
            <div class="footer-actions">
              <button class="btn-ghost">预览</button>
              <button class="btn-primary">
                <Download :size="14" stroke-width="1.5" />
                下载 PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.evaluation {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 40px;
  position: relative;
  z-index: 1;
}

.eval-hero,
.stats-grid,
.dashboard-grid {
  padding-left: 40px;
  padding-right: 40px;
}

.eval-hero {
  padding-top: 48px;
  padding-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
}

.hero-badge {
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(0, 212, 255, 0.08);
  color: var(--color-accent-cyan);
  border: 1px solid rgba(0, 212, 255, 0.12);
  margin-bottom: 12px;
}

.hero-title {
  margin: 0 0 8px;
  color: #fff;
  font-size: 34px;
  font-family: var(--font-display);
  font-weight: 400;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc,
.page-status {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.page-status {
  margin-top: 8px;
  color: var(--color-accent-cyan);
}

.report-btn,
.btn-primary,
.btn-ghost {
  transition: all 0.2s var(--ease-out);
}

.report-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(124, 58, 237, 0.1));
  border: 1px solid rgba(0, 212, 255, 0.15);
  color: var(--color-accent-cyan);
  white-space: nowrap;
}

.report-btn:hover {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.16), rgba(124, 58, 237, 0.16));
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr) auto;
  gap: 12px;
  margin-bottom: 28px;
}

.stat-card,
.card,
.modal {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--s-color) 12%, transparent);
  color: var(--s-color);
  flex-shrink: 0;
}

.stat-body {
  flex: 1;
}

.stat-top,
.card-head,
.chart-footer,
.metric-item,
.modal-header,
.modal-footer {
  display: flex;
}

.stat-top,
.card-head,
.chart-footer,
.modal-header,
.modal-footer {
  justify-content: space-between;
}

.stat-top {
  align-items: baseline;
  gap: 8px;
}

.stat-value {
  color: #fff;
  font-size: 22px;
  font-family: var(--font-display);
}

.stat-change,
.mastery-avg,
.footer-date {
  font-family: var(--font-mono);
}

.stat-change {
  color: var(--color-accent-emerald);
  font-size: 12px;
  font-weight: 600;
}

.stat-label,
.badge-more,
.suggest-count,
.chart-labels,
.metric-label,
.footer-date {
  color: var(--color-text-tertiary);
  font-size: 11px;
}

.badge-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
}

.mini-badge {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  color: var(--b-color);
  background: var(--color-bg-card);
}

.mini-badge.earned {
  border-color: color-mix(in srgb, var(--b-color) 45%, transparent);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 20px;
}

.card {
  padding: 24px;
}

.chart-card {
  grid-column: 1 / -1;
}

.card-head {
  align-items: center;
  margin-bottom: 20px;
}

.card-title-sm,
.modal-title,
.report-section h3 {
  margin: 0;
  color: #fff;
  font-family: var(--font-display);
  font-weight: 400;
}

.card-title-sm {
  font-size: 20px;
}

.chart-legend {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.cyan {
  background: var(--color-accent-cyan);
}

.legend-dot.dim {
  background: rgba(255, 255, 255, 0.2);
}

.trend-svg {
  width: 100%;
  height: 120px;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
}

.chart-footer {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 13px;
}

.chart-footer strong {
  color: #fff;
}

.chart-footer .up {
  color: var(--color-accent-emerald);
}

.mastery-list,
.suggest-list,
.rec-list {
  display: flex;
  flex-direction: column;
}

.mastery-list {
  gap: 14px;
}

.mastery-row,
.metric-item {
  display: flex;
  flex-direction: column;
}

.mastery-row {
  gap: 4px;
}

.mastery-top {
  display: flex;
  justify-content: space-between;
}

.mastery-name,
.suggest-text,
.report-section p,
.rec-list li {
  color: var(--color-text-secondary);
}

.mastery-pct {
  font-family: var(--font-mono);
  font-weight: 600;
}

.mastery-track {
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
}

.mastery-fill {
  height: 100%;
  transition: width 0.6s var(--ease-out);
}

.suggest-card {
  grid-column: 2 / 3;
}

.suggest-list {
  gap: 8px;
}

.suggest-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
}

.suggest-item:hover {
  transform: translateX(2px);
}

.suggest-item.weakness {
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.08);
}

.suggest-item.strength {
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid rgba(0, 212, 255, 0.08);
}

.suggest-item.positive {
  background: rgba(6, 214, 160, 0.04);
  border: 1px solid rgba(6, 214, 160, 0.08);
}

.suggest-item.action {
  background: rgba(245, 158, 11, 0.04);
  border: 1px solid rgba(245, 158, 11, 0.08);
}

.suggest-icon,
.suggest-arrow {
  flex-shrink: 0;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  backdrop-filter: blur(4px);
}

.modal {
  width: 100%;
  max-width: 620px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--color-bg-elevated);
}

.modal-header,
.modal-footer {
  align-items: center;
}

.modal-header {
  padding: 28px 28px 0;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: var(--color-text-tertiary);
}

.modal-body {
  padding: 20px 28px 28px;
}

.report-summary {
  display: flex;
  gap: 28px;
  padding: 20px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.24);
  margin-bottom: 20px;
}

.report-grade {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.grade-letter {
  font-size: 40px;
  font-family: var(--font-display);
  background: linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.grade-label {
  margin-top: 4px;
  color: var(--color-text-tertiary);
  font-size: 11px;
}

.report-metrics {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.metric-value {
  color: #fff;
  font-size: 17px;
  font-weight: 600;
}

.report-section {
  margin-bottom: 20px;
}

.report-section h3 {
  margin-bottom: 6px;
  font-size: 16px;
}

.report-section p,
.rec-list li {
  line-height: 1.7;
  font-size: 13px;
}

.rec-list {
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.rec-list li {
  padding-left: 18px;
  position: relative;
}

.rec-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-accent-cyan);
}

.modal-footer {
  padding: 16px 28px;
  border-top: 1px solid var(--color-border);
}

.footer-actions {
  display: flex;
  gap: 8px;
}

.btn-ghost {
  padding: 8px 18px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-blue));
  color: #fff;
  font-weight: 600;
}

@media (max-width: 900px) {
  .eval-hero,
  .stats-grid,
  .dashboard-grid {
    padding-left: 20px;
    padding-right: 20px;
  }

  .eval-hero {
    padding-top: 32px;
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .badge-strip {
    display: none;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .chart-card,
  .suggest-card {
    grid-column: 1;
  }

  .modal-overlay {
    padding: 20px;
  }

  .report-summary {
    flex-direction: column;
  }
}
</style>
