<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { courses } from '@/data/courses'
import { useLearningProgressSync } from '@/composables/useLearningProgressSync'
import { BASE_KNOWLEDGE_ITEMS, buildConstellationView, getDomainMeta } from './mapTransforms'
import type { ConstellationNode, ConstellationEdge } from './mapTypes'

const emit = defineEmits<{ 'select-node': [nodeId: string] }>()
const router = useRouter()
const {
  applyProgressToMastery,
  progressRevision,
  recordKnowledgeAction,
} = useLearningProgressSync()

const { nodes: constellationNodes, edges: constellationEdges } = buildConstellationView(BASE_KNOWLEDGE_ITEMS)
const nodes = computed<ConstellationNode[]>(() => {
  progressRevision.value
  return constellationNodes.map((node) => ({
    ...node,
    mastery: applyProgressToMastery(node.id, node.mastery, node.label) / 100,
  }))
})
const edges = ref<ConstellationEdge[]>(constellationEdges)

const domainLabels = [
  { domain: 'math', x: 105, y: 230 },
  { domain: 'ml', x: 545, y: 145 },
  { domain: 'dl', x: 990, y: 155 },
  { domain: 'algo', x: 140, y: 595 },
  { domain: 'eng', x: 555, y: 620 },
  { domain: 'nlp', x: 970, y: 595 },
]

// Deterministic starfield
const bgStars = (() => {
  const out: { x: number; y: number; r: number; o: number; tw: boolean }[] = []
  let s = 47
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280 }
  for (let i = 0; i < 160; i++) {
    out.push({ x: rand() * 1400, y: rand() * 900, r: 0.5 + rand() * 1.4, o: 0.15 + rand() * 0.5, tw: rand() < 0.25 })
  }
  return out
})()

function nodeRadius(m: number) { return 4 + m * 7 }
function nodeOpacity(m: number) { return 0.35 + m * 0.65 }

const byId = computed(() => Object.fromEntries(nodes.value.map(n => [n.id, n])))
const selectedNode = ref<ConstellationNode | null>(null)
const focused = computed(() => selectedNode.value || nodes.value.find(n => n.mastery < 0.2 && n.importance > 0.8))

function handleNodeClick(node: ConstellationNode) {
  selectedNode.value = selectedNode.value?.id === node.id ? null : node
  emit('select-node', node.id)
}

function resolveCourseForNode(node: ConstellationNode) {
  const label = node.label.replace(/\s+/g, '')
  const byId = (id: number) => courses.find((course) => course.id === id) ?? courses[0]

  if (node.domain === 'math') return byId(15)
  if (node.domain === 'ml') return byId(17)
  if (node.domain === 'dl') return byId(18)
  if (node.domain === 'nlp') return byId(19)
  if (node.domain === 'algo') return label.includes('动态规划') ? byId(6) : byId(5)
  if (node.domain === 'eng') return label.includes('Python') ? byId(2) : byId(12)
  return courses[0]
}

function lightFocusedNode(node: ConstellationNode) {
  const targetCourse = resolveCourseForNode(node)
  const updated = recordKnowledgeAction({
    id: node.id,
    label: node.label,
    domainId: node.domain,
    domainName: getDomainMeta(node.domain).name,
    baseMastery: node.mastery,
    targetMastery: 100,
    action: 'light-star',
    source: 'resource-constellation',
  })

  selectedNode.value = { ...node, mastery: updated.mastery / 100 }
  emit('select-node', node.id)
  router.push({
    path: '/evaluation',
    query: {
      source: 'resource-constellation',
      constellationAction: 'light',
      knowledgePointId: node.id,
      topic: node.label,
      domain: node.domain,
      course: String(targetCourse?.id ?? ''),
      courseName: targetCourse?.name || getDomainMeta(node.domain).name,
      targetMastery: '100',
    },
  })
}

// Inject keyframes
let styleEl: HTMLStyleElement | null = null
onMounted(() => {
  if (!document.getElementById('constellation-kf')) {
    styleEl = document.createElement('style')
    styleEl.id = 'constellation-kf'
    styleEl.textContent = `
      @keyframes constellation-twinkle { 0%,100%{opacity:0.4} 50%{opacity:1} }
      @keyframes constellation-pulse { 0%{transform:scale(0.85);opacity:1} 100%{transform:scale(2.4);opacity:0} }
    `
    document.head.appendChild(styleEl)
  }
})
onUnmounted(() => { styleEl?.remove() })
</script>

<template>
  <div class="constellation-view">
    <div class="constellation-banner">
      <span class="banner-dot" style="background:#00d4ff;box-shadow:0 0 10px #00d4ff66"></span>
      <span>每颗星是一个知识点，亮度即掌握度。同域知识点连成一组星座；跨域的知识桥用更细的光路点连。</span>
    </div>

    <div class="constellation-canvas">
      <svg viewBox="0 0 1400 900" class="constellation-svg">
        <defs>
          <radialGradient id="c-star-bright" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fff" stop-opacity="1" />
            <stop offset="40%" stop-color="#fff" stop-opacity="0.6" />
            <stop offset="100%" stop-color="#fff" stop-opacity="0" />
          </radialGradient>
          <filter id="c-glow-sm" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="c-glow-md" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <!-- Background starfield -->
        <circle v-for="(s, i) in bgStars" :key="'s'+i"
          :cx="s.x" :cy="s.y" :r="s.r" fill="#fff" :opacity="s.o"
          :style="s.tw ? { animation: `constellation-twinkle ${2 + (i % 5)}s ease-in-out ${i * 0.13}s infinite` } : undefined" />

        <!-- Edges -->
        <line v-for="(e, i) in edges" :key="'e'+i"
          :x1="byId[e.from]?.x" :y1="byId[e.from]?.y"
          :x2="byId[e.to]?.x" :y2="byId[e.to]?.y"
          :stroke="byId[e.from]?.domain === byId[e.to]?.domain ? getDomainMeta(byId[e.from]!.domain).color : '#8892b0'"
          :stroke-opacity="byId[e.from]?.domain === byId[e.to]?.domain ? 0.35 + Math.min(byId[e.from]!.mastery, byId[e.to]!.mastery) * 0.3 : 0.14"
          :stroke-width="byId[e.from]?.domain === byId[e.to]?.domain ? 1.3 : 0.8"
          :stroke-dasharray="byId[e.from]?.domain !== byId[e.to]?.domain ? '3 4' : 'none'" />

        <!-- Nodes -->
        <g v-for="n in nodes" :key="n.id" class="graph-node" :class="{ selected: selectedNode?.id === n.id }" @click="handleNodeClick(n)">
          <!-- Selected ring -->
          <circle v-if="selectedNode?.id === n.id" :cx="n.x" :cy="n.y" :r="nodeRadius(n.mastery) + 10"
            fill="none" :stroke="getDomainMeta(n.domain).color" stroke-width="2" stroke-dasharray="4 3" opacity="0.6"
            :style="{ transformOrigin: `${n.x}px ${n.y}px`, animation: 'constellation-pulse 3s ease-out infinite' }" />
          <circle :cx="n.x" :cy="n.y" :r="nodeRadius(n.mastery) * 3.2"
            fill="url(#c-star-bright)" :opacity="n.mastery * 0.4" />
          <circle :cx="n.x" :cy="n.y" :r="nodeRadius(n.mastery) * 1.9"
            :fill="getDomainMeta(n.domain).color" :opacity="n.mastery * 0.25" filter="url(#c-glow-md)" />
          <circle :cx="n.x" :cy="n.y" :r="nodeRadius(n.mastery)"
            :fill="getDomainMeta(n.domain).color" :opacity="nodeOpacity(n.mastery)" filter="url(#c-glow-sm)" />
          <circle :cx="n.x" :cy="n.y" :r="Math.max(1.5, nodeRadius(n.mastery) * 0.45)"
            fill="#fff" :opacity="0.55 + n.mastery * 0.45" />
          <!-- Recommended pulse -->
          <g v-if="n.mastery < 0.2 && n.importance > 0.8" :style="{ transformOrigin: `${n.x}px ${n.y}px`, animation: 'constellation-pulse 2.4s ease-out infinite' }">
            <circle :cx="n.x" :cy="n.y" :r="nodeRadius(n.mastery) + 6"
              fill="none" :stroke="getDomainMeta(n.domain).color" stroke-width="1.5" />
          </g>
        </g>
      </svg>

      <!-- Domain labels -->
      <div v-for="dl in domainLabels" :key="dl.domain" class="domain-label"
        :style="{ left: (dl.x / 1400 * 100) + '%', top: (dl.y / 900 * 100) + '%', color: getDomainMeta(dl.domain).color }">
        <div class="domain-short">{{ getDomainMeta(dl.domain).short }}</div>
        {{ getDomainMeta(dl.domain).name }}
      </div>

      <!-- Node labels -->
      <div v-for="n in nodes" :key="'l'+n.id" class="node-label-overlay"
        :style="{ left: (n.x / 1400 * 100) + '%', top: ((n.y + nodeRadius(n.mastery) + 8) / 900 * 100) + '%', opacity: 0.4 + n.mastery * 0.55 }">
        {{ n.label }}
      </div>

      <!-- Recommended pin -->
      <div v-if="focused" class="rec-pin"
        :style="{ left: (focused.x / 1400 * 100) + '%', top: (focused.y / 900 * 100) + '%' }">
        <div class="rec-pin-inner">
          <span class="rec-pin-dot"></span>
          <span>下一颗星 · 推荐学习</span>
        </div>
      </div>

      <!-- Detail card -->
      <div class="detail-card" v-if="focused">
        <div class="detail-header">
          <span class="detail-chip" :style="{ background: getDomainMeta(focused.domain).color + '28', borderColor: getDomainMeta(focused.domain).color + '66', color: getDomainMeta(focused.domain).color }">当前聚焦</span>
          <span class="detail-domain">{{ getDomainMeta(focused.domain).short }} · {{ focused.label.toUpperCase() }}</span>
        </div>
        <div class="detail-title">{{ focused.label }}</div>
        <div class="detail-sub">{{ focused.mastery < 0.3 ? '这颗星几乎还没亮起来' : focused.mastery < 0.7 ? '正在逐渐点亮中' : '这颗星已经很亮了' }} — 你掌握了 {{ Math.round(focused.mastery * 100) }}%</div>
        <div class="mastery-bar-header">
          <span>掌握度</span>
          <span class="mastery-pct" :style="{ color: getDomainMeta(focused.domain).color }">{{ Math.round(focused.mastery * 100) }}%</span>
        </div>
        <div class="mastery-track"><div class="mastery-fill" :style="{ width: (focused.mastery * 100) + '%', background: `linear-gradient(90deg, ${getDomainMeta(focused.domain).color}, #00d4ff)` }"></div></div>
        <div class="detail-stats">
          <div class="stat-row"><span>关联知识点</span><span class="stat-val">{{ focused.relations.length }} 个</span></div>
          <div class="stat-row"><span>所属领域</span><span class="stat-val">{{ getDomainMeta(focused.domain).name }}</span></div>
          <div class="stat-row"><span>重要程度</span><span class="stat-val">{{ focused.importance > 0.8 ? '⭐ 核心' : '普通' }}</span></div>
        </div>
        <button type="button" class="detail-btn" @click="lightFocusedNode(focused)">点亮这颗星 →</button>
      </div>

      <!-- Legend -->
      <div class="legend-card">
        <div class="legend-title">MASTERY · 亮度</div>
        <div class="legend-samples">
          <div v-for="m in [0.1, 0.35, 0.6, 0.85]" :key="m" class="legend-sample">
            <svg width="28" height="28">
              <circle cx="14" cy="14" :r="nodeRadius(m) * 1.8" fill="#00d4ff" :opacity="m * 0.3" />
              <circle cx="14" cy="14" :r="nodeRadius(m)" fill="#00d4ff" :opacity="nodeOpacity(m)" />
              <circle cx="14" cy="14" :r="Math.max(1.5, nodeRadius(m) * 0.45)" fill="#fff" :opacity="0.5 + m * 0.5" />
            </svg>
            <span class="legend-pct">{{ Math.round(m * 100) }}%</span>
          </div>
        </div>
        <div class="legend-divider"></div>
        <div class="legend-domains">
          <div v-for="dl in domainLabels" :key="dl.domain" class="legend-domain-item">
            <span class="legend-dot" :style="{ background: getDomainMeta(dl.domain).color, boxShadow: `0 0 6px ${getDomainMeta(dl.domain).color}` }"></span>
            {{ getDomainMeta(dl.domain).name }}
          </div>
        </div>
      </div>

      <!-- Top stats -->
      <div class="top-stats">
        <div class="stat-card">
          <div class="stat-label">已点亮</div>
          <div class="stat-value-row"><span class="stat-big" style="color:#06d6a0">14</span><span class="stat-unit">/ 26 颗</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">推荐学习</div>
          <div class="stat-value-row"><span class="stat-big" style="color:#7c3aed">6</span><span class="stat-unit">颗</span></div>
        </div>
        <div class="stat-card">
          <div class="stat-label">薄弱星座</div>
          <div class="stat-value-row"><span class="stat-big" style="color:#f43f5e">深度学习</span><span class="stat-unit">20%</span></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes cv-float-up { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

.constellation-view { padding: 0 40px 40px; animation: cv-float-up 0.5s ease both; }
.constellation-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px; border-radius: 14px;
  background: transparent;
  border: none;
  margin-bottom: 20px; font-size: 13px; color: #8892b0; line-height: 1.6;
}
.banner-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.constellation-canvas {
  position: relative; width: 100%; aspect-ratio: 1400 / 900;
  border-radius: 18px; background: transparent;
  border: none; overflow: hidden;
}
.constellation-svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.graph-node { cursor: pointer; transition: transform 0.2s ease, filter 0.2s ease; }
.graph-node:hover { filter: brightness(1.4) drop-shadow(0 0 12px currentColor); transform-origin: center; }

.domain-label {
  position: absolute; pointer-events: none;
  font-family: var(--font-display); font-size: 18px; letter-spacing: 0.05em;
  opacity: 0.85; text-shadow: 0 0 16px currentColor;
}
.domain-short {
  font-size: 9px; letter-spacing: 0.35em; opacity: 0.7;
  font-family: var(--font-mono); margin-bottom: 2px;
}
.node-label-overlay {
  position: absolute; transform: translateX(-50%);
  font-size: 10.5px; font-weight: 500; color: #e8edf5;
  pointer-events: none; white-space: nowrap;
  text-shadow: 0 2px 8px rgba(0,0,0,0.8);
}
.rec-pin {
  position: absolute; transform: translate(28px, -100%); z-index: 8;
}
.rec-pin-inner {
  background: rgba(124, 58, 237, 0.12); border: 1px solid #7c3aed66;
  border-radius: 10px; padding: 8px 12px; backdrop-filter: blur(12px);
  display: flex; align-items: center; gap: 8px; white-space: nowrap;
  font-size: 11px; color: #e8edf5; font-weight: 500;
  box-shadow: 0 0 20px #7c3aed55;
}
.rec-pin-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #7c3aed; box-shadow: 0 0 8px #7c3aed;
}

/* Detail card */
.detail-card {
  position: absolute; right: 24px; bottom: 24px; width: 320px;
  background: rgba(12, 12, 30, 0.48); backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px;
  padding: 20px; z-index: 10;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
}
.detail-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.detail-chip {
  font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 100px;
  border: 1px solid; letter-spacing: 0.04em;
}
.detail-domain { font-size: 10px; color: #8892b0; font-family: var(--font-mono); letter-spacing: 0.12em; }
.detail-title { font-family: var(--font-display); font-size: 24px; color: #e8edf5; line-height: 1.1; margin-bottom: 4px; }
.detail-sub { font-size: 12px; color: #8892b0; margin-bottom: 16px; }
.mastery-bar-header { display: flex; justify-content: space-between; font-size: 10px; color: #8892b0; margin-bottom: 6px; letter-spacing: 0.12em; }
.mastery-pct { font-family: var(--font-mono); font-weight: 600; }
.mastery-track { height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; margin-bottom: 16px; overflow: hidden; }
.mastery-fill { height: 100%; background: linear-gradient(90deg, #7c3aed, #00d4ff); border-radius: 2px; }
.detail-stats { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: #8892b0; margin-bottom: 16px; }
.stat-row { display: flex; justify-content: space-between; }
.stat-val { color: #e8edf5; }
.mono { font-family: var(--font-mono); }
.detail-btn {
  width: 100%; background: linear-gradient(135deg, #00d4ff, #3b82f6);
  color: #fff; border: none; border-radius: 10px;
  padding: 11px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
  box-shadow: 0 4px 20px #00d4ff55;
}

/* Legend */
.legend-card {
  position: absolute; left: 24px; bottom: 24px;
  background: rgba(12, 12, 30, 0.48); backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px;
  padding: 16px 20px; z-index: 10;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
}
.legend-title { font-size: 10px; letter-spacing: 0.18em; color: #8892b0; margin-bottom: 12px; font-family: var(--font-mono); }
.legend-samples { display: flex; align-items: center; gap: 12px; }
.legend-sample { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.legend-pct { font-size: 10px; color: #8892b0; font-family: var(--font-mono); }
.legend-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 14px 0; }
.legend-domains { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; }
.legend-domain-item { display: flex; align-items: center; gap: 6px; font-size: 10.5px; color: #8892b0; }
.legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

/* Top stats */
.top-stats {
  position: absolute; top: 20px; right: 20px; z-index: 9;
  display: flex; gap: 12px;
}
.stat-card {
  background: rgba(12,12,30,0.42); border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px; padding: 10px 16px;
}
.stat-label { font-size: 9px; letter-spacing: 0.18em; color: #8892b0; font-family: var(--font-mono); margin-bottom: 4px; }
.stat-value-row { display: flex; align-items: baseline; gap: 4px; }
.stat-big { font-family: var(--font-display); font-size: 20px; line-height: 1; }
.stat-unit { font-size: 10px; color: #8892b0; }

@media (max-width: 900px) {
  .constellation-view { padding: 0 20px 32px; }
  .detail-card, .legend-card { position: static; width: 100%; margin-top: 12px; }
  .top-stats { position: static; flex-wrap: wrap; margin-top: 12px; }
}
</style>
