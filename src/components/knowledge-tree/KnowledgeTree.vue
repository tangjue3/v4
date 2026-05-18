<script lang="ts">
export interface TreeBranch {
  id: string
  label: string
  mastery: number
  topics: { id: string; label: string; mastery: number }[]
}
</script>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ArrowUpRight, Sparkles } from 'lucide-vue-next'

const props = withDefaults(defineProps<{
  branches: TreeBranch[]
  overallMastery?: number
  compact?: boolean
}>(), {
  overallMastery: 0,
  compact: false,
})

const emit = defineEmits<{
  (e: 'nodeClick', branchId: string, topicId: string): void
  (e: 'branchClick', branchId: string): void
}>()

interface BranchSlot {
  anchorX: number
  anchorY: number
  labelOffsetX: number
  labelOffsetY: number
  topicRadius: number
  topicStart: number
  topicSpread: number
}

interface TopicLayout {
  id: string
  label: string
  mastery: number
  x: number
  y: number
}

interface BranchLayout {
  id: string
  label: string
  mastery: number
  color: string
  anchorX: number
  anchorY: number
  labelX: number
  labelY: number
  topicRadius: number
  topics: TopicLayout[]
}

const branchPalette = [
  '#ff6b8f',
  '#ff8cab',
  '#ff9f80',
  '#ff7f96',
  '#ffa8c2',
  '#ff7085',
  '#ffb37d',
  '#ff91b5',
]

const branchSlots: BranchSlot[] = [
  { anchorX: 18, anchorY: 58, labelOffsetX: -3, labelOffsetY: 10, topicRadius: 10, topicStart: 214, topicSpread: 112 },
  { anchorX: 26, anchorY: 44, labelOffsetX: -8, labelOffsetY: -2, topicRadius: 10, topicStart: 196, topicSpread: 116 },
  { anchorX: 39, anchorY: 34, labelOffsetX: -8, labelOffsetY: -7, topicRadius: 9, topicStart: 184, topicSpread: 98 },
  { anchorX: 50, anchorY: 28, labelOffsetX: 0, labelOffsetY: -9, topicRadius: 8, topicStart: 164, topicSpread: 84 },
  { anchorX: 60, anchorY: 36, labelOffsetX: 7, labelOffsetY: -6, topicRadius: 9, topicStart: 132, topicSpread: 92 },
  { anchorX: 70, anchorY: 44, labelOffsetX: 10, labelOffsetY: 0, topicRadius: 10, topicStart: 112, topicSpread: 104 },
  { anchorX: 77, anchorY: 56, labelOffsetX: 9, labelOffsetY: 8, topicRadius: 11, topicStart: 92, topicSpread: 110 },
  { anchorX: 84, anchorY: 30, labelOffsetX: 8, labelOffsetY: -8, topicRadius: 9, topicStart: 74, topicSpread: 86 },
]

const selectedBranchId = ref('')

watch(
  () => props.branches.map(branch => branch.id).join('|'),
  () => {
    if (!props.branches.length) {
      selectedBranchId.value = ''
      return
    }

    if (!props.branches.some(branch => branch.id === selectedBranchId.value)) {
      const strongest = [...props.branches].sort((a, b) => b.mastery - a.mastery)[0]
      selectedBranchId.value = strongest?.id ?? props.branches[0]?.id ?? ''
    }
  },
  { immediate: true },
)

function normalizeMastery(mastery: number) {
  return Math.max(0, Math.min(100, mastery))
}

function branchColor(index: number) {
  return branchPalette[index % branchPalette.length]
}

function topicGlow(mastery: number) {
  if (mastery >= 80) return 'full'
  if (mastery >= 55) return 'partial'
  if (mastery >= 25) return 'dim'
  return 'off'
}

const totalTopicCount = computed(() => props.branches.reduce((sum, branch) => sum + branch.topics.length, 0))
const activeTopicCount = computed(() => props.branches.reduce(
  (sum, branch) => sum + branch.topics.filter(topic => topic.mastery >= 55).length,
  0,
))

const averageTopicMastery = computed(() => {
  const topics = props.branches.flatMap(branch => branch.topics)
  if (!topics.length) return 0
  return Math.round(topics.reduce((sum, topic) => sum + normalizeMastery(topic.mastery), 0) / topics.length)
})

const branchLayouts = computed<BranchLayout[]>(() => {
  return props.branches.map((branch, branchIndex) => {
    const slot = branchSlots[branchIndex] ?? branchSlots[branchSlots.length - 1]
    const topics = branch.topics.map((topic, topicIndex) => {
      const angleStep = branch.topics.length > 1 ? slot.topicSpread / (branch.topics.length - 1) : 0
      const angleDeg = slot.topicStart - (angleStep * topicIndex)
      const angle = (angleDeg * Math.PI) / 180
      const radiusJitter = (topicIndex % 2 === 0 ? -1.2 : 1.2) + (branchIndex % 3) * 0.45
      const radius = slot.topicRadius + radiusJitter + (topicIndex % 3) * 0.55
      return {
        ...topic,
        x: slot.anchorX + Math.cos(angle) * radius,
        y: slot.anchorY + Math.sin(angle) * radius,
      }
    })

    return {
      id: branch.id,
      label: branch.label,
      mastery: branch.mastery,
      color: branchColor(branchIndex),
      anchorX: slot.anchorX,
      anchorY: slot.anchorY,
      labelX: slot.anchorX + slot.labelOffsetX,
      labelY: slot.anchorY + slot.labelOffsetY,
      topicRadius: slot.topicRadius,
      topics,
    }
  })
})

const selectedBranch = computed(() => {
  return branchLayouts.value.find(branch => branch.id === selectedBranchId.value) ?? branchLayouts.value[0] ?? null
})

function handleBranchSelect(branchId: string) {
  selectedBranchId.value = branchId
  emit('branchClick', branchId)
}

function handleTopicSelect(branchId: string, topicId: string) {
  selectedBranchId.value = branchId
  emit('nodeClick', branchId, topicId)
}

function masteryLabel(mastery: number) {
  if (mastery >= 80) return '已掌握'
  if (mastery >= 55) return '学习中'
  if (mastery >= 25) return '待加强'
  return '未开始'
}
</script>

<template>
  <section :class="['kt-shell', { compact }]">
    <header class="kt-header">
      <div>
        <div class="kt-badge">Knowledge Tree</div>
        <div class="kt-title-row">
          <Sparkles :size="16" stroke-width="1.5" class="kt-title-icon" />
          <h2 class="kt-title">红色知识树</h2>
        </div>
        <p class="kt-subtitle">
          先把 Blender 生成的树真正放进学习面板里，再把章节和知识点挂到树冠上。
        </p>
      </div>

      <div class="kt-stats">
        <div class="kt-stat-card">
          <span class="kt-stat-value">{{ activeTopicCount }}</span>
          <span class="kt-stat-label">已点亮节点</span>
        </div>
        <div class="kt-stat-card">
          <span class="kt-stat-value">{{ totalTopicCount }}</span>
          <span class="kt-stat-label">总知识点</span>
        </div>
        <div class="kt-stat-card emphasis">
          <span class="kt-stat-value">{{ overallMastery || averageTopicMastery }}%</span>
          <span class="kt-stat-label">整体掌握度</span>
        </div>
      </div>
    </header>

    <div class="kt-stage">
      <div class="kt-canvas">
        <div class="kt-background-glow" />
        <img
          src="/knowledge-tree/knowledge-tree-red.png"
          alt="Red knowledge tree render"
          class="kt-render"
        />

        <svg class="kt-overlay" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="kt-node-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g v-for="branch in branchLayouts" :key="`${branch.id}-paths`">
            <path
              v-for="topic in branch.topics"
              :key="`${topic.id}-line`"
              :d="`M ${branch.anchorX} ${branch.anchorY} Q ${(branch.anchorX + topic.x) / 2} ${Math.min(branch.anchorY, topic.y) - 4.5} ${topic.x} ${topic.y}`"
              :stroke="branch.color"
              :stroke-width="selectedBranch?.id === branch.id ? 0.34 : 0.22"
              fill="none"
              :opacity="selectedBranch?.id === branch.id ? 0.82 : 0.38"
            />
          </g>
        </svg>

        <div
          v-for="branch in branchLayouts"
          :key="branch.id"
          class="kt-branch-anchor"
          :class="{ active: selectedBranch?.id === branch.id }"
          :style="{
            '--anchor-color': branch.color,
            left: `${branch.anchorX}%`,
            top: `${branch.anchorY}%`,
          }"
        >
          <button class="kt-branch-hit" type="button" @click="handleBranchSelect(branch.id)">
            <span class="kt-branch-core" />
          </button>
          <button
            class="kt-branch-label"
            type="button"
            :style="{ left: `${branch.labelX - branch.anchorX}%`, top: `${branch.labelY - branch.anchorY}%` }"
            @click="handleBranchSelect(branch.id)"
          >
            {{ branch.label }}
          </button>

          <button
            v-for="topic in branch.topics"
            :key="topic.id"
            class="kt-topic"
            :class="[`glow-${topicGlow(topic.mastery)}`, { active: selectedBranch?.id === branch.id }]"
            :style="{
              '--branch-color': branch.color,
              left: `${topic.x - branch.anchorX}%`,
              top: `${topic.y - branch.anchorY}%`,
            }"
            type="button"
            @click="handleTopicSelect(branch.id, topic.id)"
          >
            <span class="kt-topic-core" />
            <span class="kt-topic-ring" />
            <span class="kt-topic-tooltip">
              <strong>{{ topic.label }}</strong>
              <em>{{ topic.mastery }}% · {{ masteryLabel(topic.mastery) }}</em>
            </span>
          </button>
        </div>
      </div>

      <aside v-if="selectedBranch" class="kt-sidecard">
        <div class="kt-sidecard-head">
          <div>
            <p class="kt-sidecard-kicker">当前分支</p>
            <h3>{{ selectedBranch.label }}</h3>
          </div>
          <span class="kt-sidecard-score">{{ selectedBranch.mastery }}%</span>
        </div>

        <p class="kt-sidecard-copy">
          这部分已经和树上的热点绑定好了。点击树冠中的节点，会直接跳到对应知识点讲解。
        </p>

        <div class="kt-topic-list">
          <button
            v-for="topic in selectedBranch.topics"
            :key="topic.id"
            class="kt-topic-row"
            type="button"
            @click="handleTopicSelect(selectedBranch.id, topic.id)"
          >
            <span class="kt-topic-row-main">
              <span class="kt-topic-row-dot" :style="{ background: selectedBranch.color }" />
              <span>{{ topic.label }}</span>
            </span>
            <span class="kt-topic-row-meta">
              {{ topic.mastery }}%
              <ArrowUpRight :size="13" stroke-width="1.7" />
            </span>
          </button>
        </div>
      </aside>
    </div>

    <footer class="kt-footer">
      <div class="kt-legend">
        <span><i class="full" /> 已掌握</span>
        <span><i class="partial" /> 学习中</span>
        <span><i class="dim" /> 待加强</span>
        <span><i class="off" /> 未开始</span>
      </div>
      <p class="kt-note">当前是“渲染图 + 热点交互”集成版，后续可以无缝替换成真实 `GLB/Three.js` 版本。</p>
    </footer>
  </section>
</template>

<style scoped>
.kt-shell {
  --tree-bg: linear-gradient(180deg, rgba(17, 12, 24, 0.96) 0%, rgba(22, 12, 25, 0.94) 100%);
  --tree-border: rgba(255, 142, 167, 0.16);
  --tree-text: rgba(255, 241, 245, 0.96);
  --tree-muted: rgba(255, 217, 226, 0.68);
  --tree-soft: rgba(255, 194, 207, 0.18);
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  border: 1px solid var(--tree-border);
  background: var(--tree-bg);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 24px 60px rgba(10, 2, 8, 0.3);
  padding: 24px;
}

.kt-shell.compact {
  padding: 18px;
}

.kt-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 18px;
}

.kt-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(255, 122, 158, 0.12);
  border: 1px solid rgba(255, 145, 175, 0.18);
  color: rgba(255, 197, 212, 0.88);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.kt-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
}

.kt-title-icon {
  color: #ff8ca9;
}

.kt-title {
  margin: 0;
  color: var(--tree-text);
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
}

.kt-subtitle {
  max-width: 620px;
  margin: 8px 0 0;
  color: var(--tree-muted);
  font-size: 14px;
  line-height: 1.65;
}

.kt-stats {
  display: grid;
  grid-template-columns: repeat(3, minmax(92px, 1fr));
  gap: 10px;
  min-width: min(100%, 360px);
}

.kt-stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  min-height: 84px;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(255, 173, 196, 0.12);
  background: rgba(255, 255, 255, 0.03);
}

.kt-stat-card.emphasis {
  background: linear-gradient(180deg, rgba(255, 100, 138, 0.12), rgba(255, 100, 138, 0.03));
}

.kt-stat-value {
  color: #fff7f9;
  font-family: var(--font-display);
  font-size: 26px;
  line-height: 1;
}

.kt-stat-label {
  color: rgba(255, 214, 225, 0.64);
  font-size: 11px;
}

.kt-stage {
  display: grid;
  grid-template-columns: minmax(0, 1.6fr) minmax(260px, 0.72fr);
  gap: 18px;
  align-items: stretch;
}

.kt-canvas {
  position: relative;
  min-height: 720px;
  overflow: hidden;
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 72%, rgba(255, 137, 169, 0.24), transparent 34%),
    linear-gradient(180deg, rgba(17, 19, 47, 0.6) 0%, rgba(20, 10, 20, 0.2) 100%);
  border: 1px solid rgba(255, 184, 205, 0.12);
}

.kt-background-glow {
  position: absolute;
  inset: auto 10% 7%;
  height: 16%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 120, 157, 0.28) 0%, rgba(255, 120, 157, 0.07) 45%, transparent 74%);
  filter: blur(28px);
  pointer-events: none;
}

.kt-render {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 52%;
  user-select: none;
  pointer-events: none;
}

.kt-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.kt-branch-anchor {
  position: absolute;
  width: 0;
  height: 0;
}

.kt-branch-hit,
.kt-branch-label,
.kt-topic,
.kt-topic-row {
  appearance: none;
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.kt-branch-hit {
  position: absolute;
  left: -9px;
  top: -9px;
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
}

.kt-branch-core {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: var(--anchor-color);
  box-shadow:
    0 0 0 5px color-mix(in srgb, var(--anchor-color) 18%, transparent),
    0 0 14px color-mix(in srgb, var(--anchor-color) 70%, transparent);
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.kt-branch-anchor.active .kt-branch-core,
.kt-branch-hit:hover .kt-branch-core {
  transform: scale(1.16);
  box-shadow:
    0 0 0 7px color-mix(in srgb, var(--anchor-color) 24%, transparent),
    0 0 18px color-mix(in srgb, var(--anchor-color) 74%, transparent);
}

.kt-branch-label {
  position: absolute;
  min-width: max-content;
  padding: 6px 10px;
  border-radius: 999px;
  color: rgba(255, 241, 245, 0.92);
  background: rgba(23, 12, 22, 0.7);
  border: 1px solid color-mix(in srgb, var(--anchor-color) 28%, rgba(255, 255, 255, 0.1));
  box-shadow: 0 10px 24px rgba(12, 3, 8, 0.25);
  font-size: 11px;
  white-space: nowrap;
  transform: translate(-50%, -50%);
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.kt-branch-label:hover,
.kt-branch-anchor.active .kt-branch-label {
  transform: translate(-50%, -50%) scale(1.03);
  background: rgba(34, 16, 28, 0.84);
  border-color: color-mix(in srgb, var(--anchor-color) 58%, rgba(255, 255, 255, 0.22));
}

.kt-topic {
  position: absolute;
  transform: translate(-50%, -50%);
  width: 18px;
  height: 18px;
  z-index: 2;
}

.kt-topic-core,
.kt-topic-ring {
  position: absolute;
  inset: 50% auto auto 50%;
  transform: translate(-50%, -50%);
  border-radius: 999px;
}

.kt-topic-core {
  width: 8px;
  height: 8px;
  background: color-mix(in srgb, var(--branch-color) 88%, white);
  box-shadow: 0 0 14px color-mix(in srgb, var(--branch-color) 72%, transparent);
}

.kt-topic-ring {
  width: 18px;
  height: 18px;
  border: 1px solid color-mix(in srgb, var(--branch-color) 72%, transparent);
  opacity: 0.88;
}

.kt-topic.glow-full .kt-topic-core {
  width: 11px;
  height: 11px;
  box-shadow:
    0 0 18px color-mix(in srgb, var(--branch-color) 80%, transparent),
    0 0 34px color-mix(in srgb, var(--branch-color) 54%, transparent);
}

.kt-topic.glow-partial .kt-topic-core {
  width: 9px;
  height: 9px;
}

.kt-topic.glow-dim .kt-topic-core {
  opacity: 0.76;
}

.kt-topic.glow-off .kt-topic-core {
  background: rgba(255, 246, 248, 0.3);
  box-shadow: none;
}

.kt-topic.glow-off .kt-topic-ring {
  border-color: rgba(255, 229, 236, 0.16);
}

.kt-topic:hover,
.kt-topic.active {
  z-index: 5;
}

.kt-topic:hover .kt-topic-core,
.kt-topic.active .kt-topic-core {
  transform: translate(-50%, -50%) scale(1.14);
}

.kt-topic-tooltip {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 8px);
  transform: translateX(-50%) translateY(4px);
  min-width: 120px;
  padding: 9px 10px;
  border-radius: 12px;
  background: rgba(20, 10, 18, 0.92);
  border: 1px solid rgba(255, 181, 203, 0.16);
  box-shadow: 0 16px 34px rgba(6, 2, 5, 0.32);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.16s ease, transform 0.16s ease;
}

.kt-topic-tooltip strong,
.kt-topic-tooltip em {
  display: block;
}

.kt-topic-tooltip strong {
  color: #fff4f7;
  font-size: 12px;
  font-weight: 600;
}

.kt-topic-tooltip em {
  margin-top: 3px;
  color: rgba(255, 212, 223, 0.64);
  font-size: 11px;
  font-style: normal;
}

.kt-topic:hover .kt-topic-tooltip,
.kt-topic:focus-visible .kt-topic-tooltip {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

.kt-sidecard {
  display: flex;
  flex-direction: column;
  border-radius: 22px;
  border: 1px solid rgba(255, 182, 203, 0.12);
  background:
    linear-gradient(180deg, rgba(35, 18, 25, 0.88) 0%, rgba(21, 11, 16, 0.88) 100%);
  padding: 20px;
}

.kt-sidecard-head {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
}

.kt-sidecard-kicker {
  margin: 0 0 8px;
  color: rgba(255, 194, 208, 0.62);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.kt-sidecard-head h3 {
  margin: 0;
  color: #fff4f7;
  font-size: 22px;
  font-weight: 500;
}

.kt-sidecard-score {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  padding: 10px 12px;
  border-radius: 999px;
  background: rgba(255, 108, 150, 0.12);
  color: #ffd6e2;
  font-family: var(--font-display);
  font-size: 22px;
  line-height: 1;
}

.kt-sidecard-copy {
  margin: 14px 0 18px;
  color: rgba(255, 215, 225, 0.72);
  font-size: 13px;
  line-height: 1.7;
}

.kt-topic-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: auto;
}

.kt-topic-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 13px;
  border-radius: 14px;
  color: rgba(255, 240, 244, 0.88);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 183, 204, 0.08);
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.kt-topic-row:hover {
  transform: translateX(2px);
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 183, 204, 0.14);
}

.kt-topic-row-main,
.kt-topic-row-meta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.kt-topic-row-main {
  min-width: 0;
}

.kt-topic-row-main span:last-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.kt-topic-row-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  box-shadow: 0 0 12px currentColor;
}

.kt-topic-row-meta {
  color: rgba(255, 194, 209, 0.82);
  font-size: 12px;
  flex-shrink: 0;
}

.kt-footer {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 16px;
  align-items: center;
}

.kt-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  color: rgba(255, 210, 222, 0.62);
  font-size: 12px;
}

.kt-legend span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.kt-legend i {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  display: inline-block;
}

.kt-legend i.full {
  background: #ff7f9b;
  box-shadow: 0 0 12px rgba(255, 127, 155, 0.8);
}

.kt-legend i.partial {
  background: rgba(255, 145, 175, 0.76);
}

.kt-legend i.dim {
  background: rgba(255, 183, 201, 0.56);
}

.kt-legend i.off {
  background: rgba(255, 242, 246, 0.3);
}

.kt-note {
  margin: 0;
  color: rgba(255, 196, 209, 0.54);
  font-size: 12px;
  text-align: right;
}

@media (max-width: 1080px) {
  .kt-header,
  .kt-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .kt-stats,
  .kt-stage {
    grid-template-columns: 1fr;
  }

  .kt-sidecard {
    min-height: 0;
  }

  .kt-note {
    text-align: left;
  }
}

@media (max-width: 768px) {
  .kt-shell {
    padding: 16px;
    border-radius: 20px;
  }

  .kt-title {
    font-size: 24px;
  }

  .kt-canvas {
    min-height: 520px;
  }

  .kt-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .kt-stat-card.emphasis {
    grid-column: 1 / -1;
  }
}
</style>
