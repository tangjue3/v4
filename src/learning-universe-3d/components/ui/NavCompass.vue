<template>
  <!-- Left drawer for content panels -->
  <Transition name="compass-slide">
    <aside v-if="visible" class="nav-drawer glass-panel-strong">
      <div class="accent-line right" style="background: linear-gradient(180deg, #4FC3F7, #BA68C8); box-shadow: 0 0 12px rgba(79, 195, 247, 0.3);"></div>

      <!-- Dashboard Tab -->
      <div v-if="activeTab === 'dashboard'" class="tab-dashboard">
        <div class="drawer-header">
          <h3 class="drawer-title">仪表盘</h3>
          <button class="drawer-close glass-button" @click="$emit('close')">
            <X :size="14" />
          </button>
        </div>
        <div class="drawer-body">
          <div class="stat-cards">
            <div class="stat-card glass-panel-light">
              <span class="stat-value font-display">{{ store.progressPercent }}<small>%</small></span>
              <span class="stat-label">总进度</span>
            </div>
            <div class="stat-card glass-panel-light">
              <span class="stat-value font-display">{{ streak.currentStreak }}</span>
              <span class="stat-label">连续天数</span>
            </div>
            <div class="stat-card glass-panel-light">
              <span class="stat-value font-display">{{ streak.totalStudyMinutes }}</span>
              <span class="stat-label">学习分钟</span>
            </div>
          </div>

          <div class="section">
            <h4 class="section-title">能力分布</h4>
            <div class="radar-wrap">
              <RadarChart
                :data="radarData"
                :size="220"
                :labels="radarLabels"
              />
            </div>
          </div>

          <div class="section">
            <h4 class="section-title">方向进度</h4>
            <div class="direction-bars">
              <div v-for="dir in directionList" :key="dir.id" class="dir-bar-row">
                <span class="dir-label" :style="{ color: dir.color }">{{ dir.label }}</span>
                <div class="energy-bar">
                  <div
                    class="energy-bar-fill"
                    :style="{ width: dir.pct + '%', background: dir.color, boxShadow: `0 0 8px ${dir.color}66` }"
                  ></div>
                </div>
                <span class="dir-pct font-display">{{ dir.pct }}%</span>
              </div>
            </div>
          </div>

          <div class="section">
            <h4 class="section-title">最近活动</h4>
            <div class="activity-list">
              <div v-for="log in recentLogs" :key="log.timestamp" class="activity-item glass-panel-light">
                <span class="activity-icon">{{ activityIcon(log.type) }}</span>
                <span class="activity-text">{{ log.description }}</span>
                <span class="activity-time">{{ formatTime(log.timestamp) }}</span>
              </div>
              <div v-if="!recentLogs.length" class="empty-hint">暂无活动记录</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paths Tab -->
      <div v-if="activeTab === 'paths'" class="tab-paths">
        <div class="drawer-header">
          <h3 class="drawer-title">学习路径</h3>
          <button class="drawer-close glass-button" @click="$emit('close')">
            <X :size="14" />
          </button>
        </div>
        <div class="drawer-body">
          <div class="section">
            <h4 class="section-title">推荐路径</h4>
            <div class="path-cards">
              <div
                v-for="path in recommendedPaths"
                :key="path.id"
                class="path-card glass-panel-light"
                :class="{ selected: store.selectedPath === path.id }"
                @click="applyPath(path)"
              >
                <div class="path-card-header">
                  <span class="path-name">{{ path.name }}</span>
                  <div class="path-meta">
                    <span class="path-count">{{ path.courseSequence.length }} 门课</span>
                    <span v-if="store.selectedPath === path.id" class="path-active">已选</span>
                  </div>
                </div>
                <p class="path-desc">{{ path.description }}</p>
                <div class="path-progress-row">
                  <div class="energy-bar">
                    <div
                      class="energy-bar-fill"
                      :style="{ width: pathProgress(path) + '%', background: 'linear-gradient(90deg, #4FC3F7, #BA68C8)' }"
                    ></div>
                  </div>
                  <span class="font-display path-pct">{{ pathProgress(path) }}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Graph Tab -->
      <div v-if="activeTab === 'graph'" class="tab-graph">
        <div class="drawer-header">
          <h3 class="drawer-title">课程图谱</h3>
          <button class="drawer-close glass-button" @click="$emit('close')">
            <X :size="14" />
          </button>
        </div>
        <div class="drawer-body">
          <div class="graph-search">
            <Search :size="14" class="search-icon" />
            <input
              v-model="graphSearch"
              type="text"
              placeholder="搜索课程..."
              class="search-input"
            />
          </div>
          <div class="graph-container">
            <svg class="graph-svg" :viewBox="`0 0 ${graphW} ${graphH}`">
              <defs>
                <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6" fill="rgba(255,255,255,0.15)" />
                </marker>
              </defs>
              <line
                v-for="edge in graphEdges"
                :key="edge.key"
                :x1="edge.x1" :y1="edge.y1"
                :x2="edge.x2" :y2="edge.y2"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="1"
                marker-end="url(#arrow)"
              />
              <g
                v-for="node in graphNodes"
                :key="node.id"
                class="graph-node"
                @click="$emit('selectCourse', node.id)"
              >
                <circle
                  :cx="node.x" :cy="node.y" r="16"
                  :fill="node.color + '20'"
                  :stroke="node.color"
                  stroke-width="1.5"
                />
                <text
                  :x="node.x" :y="node.y + 4"
                  text-anchor="middle"
                  fill="#fff"
                  font-size="8"
                  font-weight="600"
                >{{ node.shortName }}</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </aside>
  </Transition>

  <!-- Top center floating nav bar (always visible) -->
  <nav class="nav-bar-wrapper">
    <div class="nav-bar glass-panel-strong">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-btn"
        :class="{ active: activeTab === tab.id }"
        @click="onNavTabClick(tab.id)"
      >
        <component :is="tab.icon" :size="14" />
        <span>{{ tab.label }}</span>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, BarChart3, Map, GitBranch, Search } from '@lucide/vue'
import { useUniverseStore } from '../../stores/universeStore'
import { courses } from '../../data/courses'
import { learningPaths } from '../../data/learningPaths'
import type { LearningPath } from '../../types'
import RadarChart from './RadarChart.vue'

const props = withDefaults(defineProps<{
  visible: boolean
  initialTab?: string
}>(), {
  initialTab: 'dashboard',
})

const emit = defineEmits<{
  close: []
  open: []
  selectCourse: [courseId: number]
}>()

const store = useUniverseStore()
const activeTab = ref('dashboard')
const graphSearch = ref('')
const graphW = 440
const graphH = 500

const streak = computed(() => store.learningStreak)

const tabs = [
  { id: 'dashboard', label: '仪表盘', icon: BarChart3 },
  { id: 'paths', label: '路径', icon: Map },
  { id: 'graph', label: '图谱', icon: GitBranch },
]

watch(() => props.initialTab, (t) => { activeTab.value = t }, { immediate: true })

function onNavTabClick(tabId: string) {
  activeTab.value = tabId
  if (!props.visible) {
    emit('open')
  }
}

const radarLabels = ['编程', '系统', '软件', 'AI', '前沿']
const radarData = computed(() => {
  const dp = store.directionProgress
  return [
    dp.programming.total ? Math.round((dp.programming.completed / dp.programming.total) * 100) : 0,
    dp.systems.total ? Math.round((dp.systems.completed / dp.systems.total) * 100) : 0,
    dp.software.total ? Math.round((dp.software.completed / dp.software.total) * 100) : 0,
    dp.ai.total ? Math.round((dp.ai.completed / dp.ai.total) * 100) : 0,
    dp.frontier.total ? Math.round((dp.frontier.completed / dp.frontier.total) * 100) : 0,
  ]
})

const directionList = computed(() => {
  const dp = store.directionProgress
  return [
    { id: 'programming', label: '编程与算法', color: '#4FC3F7', pct: dp.programming.total ? Math.round((dp.programming.completed / dp.programming.total) * 100) : 0 },
    { id: 'systems', label: '计算机系统', color: '#81C784', pct: dp.systems.total ? Math.round((dp.systems.completed / dp.systems.total) * 100) : 0 },
    { id: 'software', label: '软件工程', color: '#FFB74D', pct: dp.software.total ? Math.round((dp.software.completed / dp.software.total) * 100) : 0 },
    { id: 'ai', label: '人工智能', color: '#BA68C8', pct: dp.ai.total ? Math.round((dp.ai.completed / dp.ai.total) * 100) : 0 },
    { id: 'frontier', label: '前沿技术', color: '#E57373', pct: dp.frontier.total ? Math.round((dp.frontier.completed / dp.frontier.total) * 100) : 0 },
  ]
})

const recentLogs = computed(() => store.activityLog.slice(0, 8))

function activityIcon(type: string) {
  const map: Record<string, string> = {
    'complete-course': '🎓',
    'complete-lab': '🔬',
    'pass-assessment': '📝',
    'unlock-achievement': '🏆',
  }
  return map[type] || '📌'
}

function formatTime(ts: number) {
  const diff = Date.now() - ts
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${Math.floor(diff / 86400000)}天前`
}

const recommendedPaths = computed(() => learningPaths.slice(0, 4))

function pathProgress(path: LearningPath) {
  const completed = path.courseSequence.filter((id: number) => store.getPlanetState(id) === 'completed').length
  const total = path.courseSequence.length
  return total ? Math.round((completed / total) * 100) : 0
}

function applyPath(path: LearningPath) {
  if (store.selectedPath !== path.id) {
    store.selectedPath = path.id
  }
}

interface GraphNode {
  id: number
  x: number
  y: number
  color: string
  shortName: string
}

const graphNodes = computed<GraphNode[]>(() => {
  const dirColors: Record<string, string> = {
    programming: '#4FC3F7', systems: '#81C784', software: '#FFB74D', ai: '#BA68C8', frontier: '#E57373',
  }
  const filtered = graphSearch.value
    ? courses.filter((c) => c.name.includes(graphSearch.value))
    : courses
  const cols = 5
  const spacingX = graphW / (cols + 1)
  const spacingY = 80
  return filtered.map((c, i) => ({
    id: c.id,
    x: spacingX * ((i % cols) + 1),
    y: spacingY * (Math.floor(i / cols) + 1),
    color: dirColors[c.direction] || '#4FC3F7',
    shortName: c.name.slice(0, 3),
  }))
})

const graphEdges = computed(() => {
  const nodeMap = {} as Record<number, GraphNode>
  graphNodes.value.forEach((n) => { nodeMap[n.id] = n })
  const edges: { key: string; x1: number; y1: number; x2: number; y2: number }[] = []
  for (const c of courses) {
    const target = nodeMap[c.id]
    if (!target) continue
    for (const pid of c.prerequisites) {
      const source = nodeMap[pid]
      if (!source) continue
      edges.push({ key: `${pid}-${c.id}`, x1: source.x, y1: source.y, x2: target.x, y2: target.y })
    }
  }
  return edges
})
</script>

<style scoped>
/* ─── Left drawer for content ─── */
.nav-drawer {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: var(--drawer-width);
  z-index: 45;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid var(--glass-border);
  border-radius: 0 16px 16px 0;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 0;
  flex-shrink: 0;
}

.drawer-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.drawer-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-muted);
}

.drawer-close:hover {
  color: var(--text-secondary);
  border-color: rgba(255, 255, 255, 0.12);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.06) transparent;
}

/* ─── Top center nav bar ─── */
.nav-bar-wrapper {
  position: fixed;
  top: calc(60px + var(--hud-height) + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 46;
  pointer-events: none;
}

.nav-bar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 5px;
  border-radius: var(--radius-full);
  pointer-events: auto;
  border: 1px solid var(--glass-border);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 16px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-expo);
  font-family: inherit;
  white-space: nowrap;
}

.nav-btn:hover {
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
}

.nav-btn.active {
  color: var(--text-primary);
  background: rgba(79, 195, 247, 0.12);
  box-shadow: 0 0 12px rgba(79, 195, 247, 0.08);
}

/* ─── Dashboard ─── */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 8px;
  border-radius: var(--radius-md);
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
}

.stat-value small { font-size: 12px; font-weight: 400; color: var(--text-muted); }

.stat-label { font-size: 10px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }

.radar-wrap {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}

.section { margin-bottom: 24px; }

.direction-bars { display: flex; flex-direction: column; gap: 10px; }

.dir-bar-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dir-label { font-size: 12px; font-weight: 500; width: 72px; flex-shrink: 0; }

.dir-pct { font-size: 12px; color: var(--text-muted); width: 36px; text-align: right; }

.activity-list { display: flex; flex-direction: column; gap: 6px; }

.activity-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
}

.activity-icon { font-size: 13px; flex-shrink: 0; }

.activity-text {
  flex: 1;
  font-size: 12px;
  color: var(--text-secondary);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-time { font-size: 11px; color: var(--text-muted); flex-shrink: 0; }

.empty-hint { font-size: 13px; color: var(--text-muted); text-align: center; padding: 16px 0; }

/* ─── Paths ─── */
.path-cards { display: flex; flex-direction: column; gap: 10px; }

.path-card {
  padding: 14px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-expo);
}

.path-card:hover {
  border-color: rgba(79, 195, 247, 0.2);
}

.path-card.selected {
  border-color: rgba(79, 195, 247, 0.3);
  background: rgba(79, 195, 247, 0.06);
}

.path-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.path-name { font-size: 14px; font-weight: 600; color: var(--text-primary); }

.path-meta {
  display: flex;
  align-items: center;
  gap: 6px;
}

.path-count { font-size: 11px; color: var(--text-muted); }

.path-active {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  color: var(--accent-blue);
  background: rgba(79, 195, 247, 0.1);
}

.path-desc { font-size: 12px; color: var(--text-muted); margin: 0 0 10px; line-height: 1.5; }

.path-progress-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.path-pct { font-size: 11px; color: var(--text-muted); min-width: 28px; }

/* ─── Graph ─── */
.graph-search {
  position: relative;
  margin-bottom: 16px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 34px;
  font-size: 13px;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  outline: none;
  transition: border-color var(--duration-fast) ease;
  font-family: inherit;
  box-sizing: border-box;
}

.search-input:focus { border-color: rgba(79, 195, 247, 0.3); }

.search-input::placeholder { color: var(--text-muted); }

.graph-container {
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  overflow: auto;
  background: rgba(0, 0, 0, 0.25);
}

.graph-svg { width: 100%; height: auto; display: block; }

.graph-node { cursor: pointer; transition: opacity var(--duration-fast) ease; }
.graph-node:hover { opacity: 0.8; }
.graph-node:hover circle { stroke-width: 2.5; }

/* ─── Animations ─── */
.compass-slide-enter-active { transition: all 0.4s var(--ease-out-expo); }
.compass-slide-leave-active { transition: all 0.25s ease; }
.compass-slide-enter-from { opacity: 0; transform: translateX(-60px); }
.compass-slide-leave-to { opacity: 0; transform: translateX(-40px); }

</style>
