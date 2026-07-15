<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits<{ 'select-node': [nodeId: string] }>()

const DOMAIN_META: Record<string, { name: string; color: string; short: string; topicId: string }> = {
  pointer: { name: '指针基础', color: '#00d4ff', short: 'PTR', topicId: 'a2' },
  memory: { name: '内存模型', color: '#7c3aed', short: 'MEM', topicId: 'm1' },
  array: { name: '数组与字符串', color: '#06d6a0', short: 'ARR', topicId: 'a1' },
  function: { name: '函数传参', color: '#f59e0b', short: 'FUNC', topicId: 'ml4' },
  struct: { name: '结构体链表', color: '#3b82f6', short: 'LIST', topicId: 'a3' },
  debug: { name: '调试与追踪', color: '#f43f5e', short: 'DBG', topicId: 'e1' },
}

const LEVELS = [
  { key: 'remember', name: '识别', en: 'Recognize', icon: '◐' },
  { key: 'understand', name: '解释', en: 'Explain', icon: '◓' },
  { key: 'apply', name: '改写', en: 'Apply', icon: '◑' },
  { key: 'transfer', name: '迁移', en: 'Transfer', icon: '◒' },
  { key: 'create', name: '排错', en: 'Debug', icon: '●' },
]

const DOMAIN_ORDER = ['pointer', 'memory', 'array', 'function', 'struct', 'debug']

const MATRIX_VALUES: Record<string, number[]> = {
  pointer: [0.86, 0.74, 0.58, 0.42, 0.28],
  memory: [0.78, 0.63, 0.45, 0.34, 0.22],
  array: [0.82, 0.70, 0.56, 0.38, 0.30],
  function: [0.74, 0.52, 0.36, 0.24, 0.18],
  struct: [0.68, 0.50, 0.33, 0.20, 0.12],
  debug: [0.72, 0.48, 0.30, 0.18, 0.10],
}

const matrixCells = DOMAIN_ORDER.flatMap(domain =>
  LEVELS.map((level, index) => {
    const value = MATRIX_VALUES[domain][index]
    const isWeak = value > 0 && value < 0.4
    return {
      domain,
      domainLabel: DOMAIN_META[domain].name,
      level: level.key,
      levelLabel: level.name,
      value,
      evidenceCount: Math.max(1, Math.round(value * 10)),
      lastScore: Math.round(value * 100),
      isWeak,
      isRecommended: domain === 'function' && level.key === 'apply',
    }
  }),
)

const selectedCell = ref(matrixCells.find(cell => cell.isRecommended) ?? matrixCells[0])

const cellsByDomain = computed(() =>
  DOMAIN_ORDER.map(domain => ({
    domain,
    meta: DOMAIN_META[domain],
    cells: LEVELS.map(lv => matrixCells.find(c => c.domain === domain && c.level === lv.key)!),
  }))
)

function cellBg(mastery: number, color: string): string {
  if (mastery === 0) return 'rgba(255, 255, 255, 0.02)'
  const alpha = 0.08 + mastery * 0.78
  return `${color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
}

const colAvgs = computed(() =>
  LEVELS.map((_, li) => {
    const vals = DOMAIN_ORDER.map(d => matrixCells.find(c => c.domain === d && c.level === LEVELS[li].key)!.value)
    return vals.reduce((s, v) => s + v, 0) / vals.length
  })
)

function statusLabel(m: number): string {
  if (m === 0) return '未触及'
  if (m < 0.3) return '易断层'
  if (m < 0.6) return '需巩固'
  if (m < 0.85) return '较稳定'
  return '熟练'
}

function selectCell(cell: typeof matrixCells[number]) {
  selectedCell.value = cell
  emit('select-node', DOMAIN_META[cell.domain].topicId)
}

function selectRecommendedCell() {
  selectCell(selectedCell.value)
}

// Inject keyframes
let styleEl: HTMLStyleElement | null = null
onMounted(() => {
  if (!document.getElementById('matrix-kf')) {
    styleEl = document.createElement('style')
    styleEl.id = 'matrix-kf'
    styleEl.textContent = `@keyframes matrix-pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }`
    document.head.appendChild(styleEl)
  }
})
onUnmounted(() => { styleEl?.remove() })
</script>

<template>
  <div class="matrix-view">
    <div class="matrix-banner">
      <span class="banner-dot" style="background:#f59e0b;box-shadow:0 0 10px #f59e0b66"></span>
      <span>认知矩阵看的是 C 指针学习的能力断层：指针、内存、数组、传参、链表和调试分别落在识别、解释、改写、迁移、排错哪一层。</span>
    </div>

    <div class="matrix-canvas">
      <!-- Depth axis -->
      <div class="depth-axis">
        <span>表层 · 浅</span>
        <div class="depth-line"></div>
        <span style="color:#f43f5e">深层 · 创造</span>
      </div>

      <!-- Column headers -->
      <div class="col-headers">
        <div v-for="(lv, li) in LEVELS" :key="lv.key" class="col-header">
          <div class="col-top">
            <span class="col-name">{{ lv.name }}</span>
            <span class="col-level">L{{ li + 1 }}</span>
          </div>
          <div class="col-en">{{ lv.en.toUpperCase() }}</div>
          <div class="col-avg-track"><div class="col-avg-fill" :style="{ width: (colAvgs[li] * 100) + '%' }"></div></div>
          <div class="col-avg-label">平均 {{ Math.round(colAvgs[li] * 100) }}%</div>
        </div>
      </div>

      <!-- Matrix grid -->
      <div class="matrix-grid">
        <!-- Domain headers (left) -->
        <div class="domain-col">
          <div v-for="row in cellsByDomain" :key="row.domain" class="domain-header" :style="{ borderRightColor: row.meta.color + '33' }">
            <div class="domain-top">
              <span class="domain-dot" :style="{ background: row.meta.color, boxShadow: `0 0 8px ${row.meta.color}` }"></span>
              <span class="domain-name">{{ row.meta.name }}</span>
            </div>
            <div class="domain-en">{{ row.meta.short }} · {{ row.cells.length }} 层级</div>
            <div class="domain-avg">
              <div class="domain-avg-track"><div class="domain-avg-fill" :style="{ width: (row.cells.reduce((s, c) => s + c.value, 0) / row.cells.length * 100) + '%', background: row.meta.color }"></div></div>
              <span>{{ Math.round(row.cells.reduce((s, c) => s + c.value, 0) / row.cells.length * 100) }}%</span>
            </div>
          </div>
        </div>

        <!-- Cells -->
        <div class="cells-col">
          <div v-for="row in cellsByDomain" :key="row.domain" class="cell-row">
            <div v-for="(cell, ci) in row.cells" :key="cell.level"
              :class="['cell', {
                active: selectedCell?.domain === cell.domain && selectedCell?.level === cell.level,
                rec: cell.isRecommended,
                weak: cell.isWeak,
              }]"
              :style="{
                background: cellBg(cell.value, row.meta.color),
                borderColor: cell.isRecommended ? '#f59e0b'
                  : cell.isWeak ? '#f43f5e88'
                  : 'rgba(255,255,255,0.04)',
              }"
              :title="`${cell.domainLabel} × ${cell.levelLabel}：${cell.lastScore}% | 证据 ${cell.evidenceCount} 条`"
              @click="selectCell(cell)">
              <!-- High mastery gradient -->
              <div v-if="cell.value > 0.6" class="cell-glow" :style="{ background: `radial-gradient(circle at 30% 0%, ${row.meta.color}33, transparent 70%)` }"></div>

              <div class="cell-top">
                <span class="cell-pct" :style="{ color: cell.value === 0 ? '#4a5568' : cell.value > 0.5 ? '#e8edf5' : '#8892b0' }">
                  {{ cell.value === 0 ? '—' : Math.round(cell.value * 100) + '%' }}
                </span>
                <span v-if="cell.value > 0" class="cell-icon" :style="{ color: row.meta.color }">{{ LEVELS[ci].icon }}</span>
              </div>
              <div class="cell-status">{{ statusLabel(cell.value) }}</div>
              <div class="cell-meta">{{ cell.evidenceCount }} 条 · {{ cell.lastScore }}分</div>
              <div v-if="cell.value > 0" class="cell-bar" :style="{ width: (cell.value * 100) + '%', background: row.meta.color }"></div>

              <!-- Recommended star -->
              <div v-if="cell.isRecommended" class="rec-star">★</div>

              <!-- Weak indicator -->
              <div v-if="cell.isWeak && !cell.isRecommended" class="weak-corner"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Annotation -->
      <div class="annotation">
        <div class="annotation-badge">★ 推荐补这一格</div>
      </div>

      <!-- Bottom detail -->
      <div class="matrix-detail">
        <div class="detail-chips">
          <span class="detail-chip" style="background:rgba(245,158,11,0.12);border-color:#f59e0b33;color:#f59e0b">★ 主要推荐</span>
          <span class="detail-chip" style="background:rgba(244,63,94,0.12);border-color:#f43f5e33;color:#f43f5e">跳跃式提升点</span>
        </div>
        <div class="detail-title">
          <span style="color:#06d6a0">{{ selectedCell.domainLabel }}</span>
          <span style="color:#8892b0; margin: 0 12px">×</span>
          <span style="color:#f59e0b">{{ selectedCell.levelLabel }}</span>
        </div>
        <div class="detail-desc">这里看的不是图谱关系，而是“能说清概念”到“能在题目里稳定使用”之间的断层：当前格 {{ selectedCell.lastScore }} 分，建议优先补 {{ selectedCell.domainLabel }} 的 {{ selectedCell.levelLabel }} 层级。</div>
        <div class="detail-metrics">
          <div class="metric-card">
            <div class="metric-label">当前差距</div>
            <div class="metric-value" style="color:#f59e0b">−{{ Math.max(0, 75 - selectedCell.lastScore) }} 个百分点</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">推荐资源</div>
            <div class="metric-value" style="color:#06d6a0">{{ selectedCell.evidenceCount }} 个 · 含逐行 Trace</div>
          </div>
        </div>
        <button class="detail-btn" style="background:linear-gradient(135deg,#f59e0b,#f43f5e);box-shadow:0 4px 20px #f59e0b55" @click="selectRecommendedCell">看看具体怎么补 →</button>
      </div>

      <!-- Diagnostic panel -->
      <div class="diagnostic">
        <div class="diag-title">DIAGNOSTIC · 整体诊断</div>
        <div class="diag-section">
          <div class="diag-label">认知深度均值</div>
          <div class="diag-big-row">
            <span class="diag-big">L 2.6</span>
            <span class="diag-sub">/ L 6</span>
            <span class="diag-trend">↑ 上月 +0.3</span>
          </div>
        <div class="diag-note">主要停在「解释→改写」之间</div>
        </div>
        <div class="diag-divider"></div>
        <div class="diag-section">
          <div class="diag-label">认知分布</div>
          <div class="diag-bars">
            <div v-for="(lv, li) in LEVELS" :key="lv.key" class="diag-bar-row">
              <span class="diag-bar-label">{{ lv.name }}</span>
              <div class="diag-bar-track"><div class="diag-bar-fill" :style="{ width: (colAvgs[li] * 100) + '%' }"></div></div>
              <span class="diag-bar-pct">{{ Math.round(colAvgs[li] * 100) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes mx-float-up { 0% { transform: translateY(10px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }

.matrix-view { padding: 0 0 40px; animation: mx-float-up 0.5s ease both; }
.matrix-banner {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 20px; border-radius: 14px;
  background: rgba(12, 12, 30, 0.42); backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 20px; font-size: 13px; color: #8892b0; line-height: 1.6;
}
.banner-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }

.matrix-canvas {
  position: relative; padding: 24px;
  border-radius: 18px; background: rgba(7, 7, 13, 0.62);
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow-x: auto;
}

/* Depth axis */
.depth-axis {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 16px; padding-left: 220px;
  font-size: 10px; font-family: var(--font-mono); color: #8892b0; letter-spacing: 0.18em;
}
.depth-line {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, #f59e0b33, #f59e0b, #f43f5e);
}

/* Column headers */
.col-headers {
  display: flex; gap: 8px; margin-bottom: 8px; padding-left: 220px;
}
.col-header {
  flex: 1; min-width: 120px; padding: 10px 14px; border-radius: 10px;
  border: 1px solid transparent;
}
.col-header.rec {
  background: rgba(245, 158, 11, 0.06); border-color: #f59e0b44;
}
.col-top { display: flex; align-items: center; gap: 6px; margin-bottom: 4px; }
.col-name { font-family: var(--font-display); font-size: 18px; color: #e8edf5; }
.col-level { font-size: 11px; color: #4a5568; font-family: var(--font-mono); margin-left: auto; letter-spacing: 0.08em; }
.col-en { font-size: 9px; color: #8892b0; font-family: var(--font-mono); letter-spacing: 0.18em; margin-bottom: 8px; }
.col-avg-track { height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; }
.col-avg-fill { height: 100%; background: #f59e0b; opacity: 0.6; }
.col-avg-label { font-size: 10px; color: #8892b0; margin-top: 4px; font-family: var(--font-mono); }

/* Matrix grid */
.matrix-grid { display: flex; gap: 0; }
.domain-col { display: flex; flex-direction: column; gap: 8px; }
.domain-header {
  width: 200px; height: 90px; padding: 10px 14px;
  display: flex; flex-direction: column; justify-content: center;
  border-right: 2px solid;
}
.domain-top { display: flex; align-items: center; gap: 8px; }
.domain-dot { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
.domain-name { font-family: var(--font-display); font-size: 17px; color: #e8edf5; }
.domain-en { font-size: 10px; color: #4a5568; font-family: var(--font-mono); margin-top: 3px; letter-spacing: 0.1em; }
.domain-avg { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-family: var(--font-mono); margin-top: 6px; width: fit-content; }
.domain-avg-track { width: 50px; height: 2px; background: rgba(255,255,255,0.08); border-radius: 1px; overflow: hidden; }
.domain-avg-fill { height: 100%; }

.cells-col { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 0; }
.cell-row { display: flex; gap: 8px; }
.cell {
  position: relative; flex: 1; min-width: 120px; height: 90px;
  border: 1px solid; border-radius: 8px; padding: 10px 14px;
  display: flex; flex-direction: column; justify-content: space-between;
  overflow: hidden; cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}
.cell:hover,
.cell.active {
  transform: translateY(-2px);
  box-shadow: 0 0 22px rgba(0, 212, 255, 0.28), 0 10px 24px rgba(0, 0, 0, 0.28);
}
.cell.active { border-color: #00d4ff !important; }
.cell.rec { box-shadow: 0 0 24px #f59e0b66; }
.cell-glow { position: absolute; inset: 0; pointer-events: none; }
.cell-top { display: flex; align-items: center; justify-content: space-between; position: relative; }
.cell-pct { font-family: var(--font-mono); font-size: 18px; font-weight: 600; letter-spacing: -0.02em; }
.cell-icon { font-size: 14px; opacity: 0.5; }
.cell-status { font-size: 9.5px; color: #8892b0; font-family: var(--font-mono); letter-spacing: 0.06em; position: relative; }
.cell-meta { font-size: 8px; color: #4a5568; font-family: var(--font-mono); letter-spacing: 0.04em; position: relative; }
.cell-bar { position: absolute; left: 0; bottom: 0; height: 3px; opacity: 0.7; }
.cell.weak { border-width: 2px; }
.weak-corner {
  position: absolute; top: 0; right: 0;
  width: 0; height: 0;
  border-style: solid; border-width: 0 14px 14px 0;
  border-color: transparent #f59e0b transparent transparent;
  opacity: 0.7;
}
.rec-star {
  position: absolute; top: -8px; right: -8px;
  width: 24px; height: 24px; border-radius: 50%;
  background: #f59e0b; color: #000;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700;
  box-shadow: 0 0 16px #f59e0baa;
  animation: matrix-pulse 2s ease-in-out infinite;
}

/* Annotation */
.annotation {
  position: absolute;
  right: 280px; top: 200px;
  z-index: 8; pointer-events: none;
}
.annotation-badge {
  background: rgba(245, 158, 11, 0.1); border: 1px solid #f59e0b;
  border-radius: 10px; padding: 8px 12px;
  font-size: 11px; color: #f59e0b; font-weight: 600;
  white-space: nowrap; letter-spacing: 0.02em;
  box-shadow: 0 0 20px #f59e0b66;
}

/* Detail card */
.matrix-detail {
  margin-top: 24px; padding: 22px;
  background: rgba(12, 12, 30, 0.48); backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
  max-width: 520px;
}
.detail-chips { display: flex; gap: 8px; margin-bottom: 14px; }
.detail-chip {
  font-size: 10px; font-weight: 600; padding: 3px 10px; border-radius: 100px;
  border: 1px solid; letter-spacing: 0.04em;
}
.detail-title { font-family: var(--font-display); font-size: 22px; color: #e8edf5; line-height: 1.15; margin-bottom: 6px; }
.detail-desc { font-size: 12px; color: #8892b0; line-height: 1.6; margin-bottom: 16px; }
.detail-metrics { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.metric-card { padding: 10px 14px; background: rgba(255,255,255,0.05); border-radius: 10px; }
.metric-label { font-size: 10px; color: #8892b0; letter-spacing: 0.12em; margin-bottom: 4px; }
.metric-value { font-family: var(--font-mono); font-size: 18px; font-weight: 600; }
.detail-btn {
  width: 100%; color: #fff; border: none; border-radius: 10px;
  padding: 11px 16px; font-size: 13px; font-weight: 600; cursor: pointer;
}

/* Diagnostic */
.diagnostic {
  position: absolute; right: 24px; bottom: 24px;
  background: rgba(12, 12, 30, 0.48); backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 16px;
  padding: 22px; width: 280px; z-index: 10;
  box-shadow: 0 12px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04);
}
.diag-title { font-size: 10px; letter-spacing: 0.18em; color: #8892b0; margin-bottom: 14px; font-family: var(--font-mono); }
.diag-section { margin-bottom: 0; }
.diag-label { font-size: 11px; color: #8892b0; margin-bottom: 4px; }
.diag-big-row { display: flex; align-items: baseline; gap: 6px; }
.diag-big { font-family: var(--font-display); font-size: 28px; color: #e8edf5; line-height: 1; }
.diag-sub { font-size: 11px; color: #8892b0; }
.diag-trend { font-size: 11px; color: #06d6a0; margin-left: auto; }
.diag-note { font-size: 10px; color: #4a5568; margin-top: 3px; }
.diag-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 14px 0; }
.diag-bars { display: flex; flex-direction: column; gap: 6px; }
.diag-bar-row { display: flex; align-items: center; gap: 8px; font-size: 11px; }
.diag-bar-label { width: 36px; color: #8892b0; font-size: 10px; }
.diag-bar-track { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
.diag-bar-fill { height: 100%; background: linear-gradient(90deg, #f59e0b, #f43f5e); opacity: 0.85; }
.diag-bar-pct { font-size: 10px; color: #8892b0; font-family: var(--font-mono); width: 30px; text-align: right; }

@media (max-width: 900px) {
  .matrix-view { padding: 0 20px 32px; }
  .matrix-canvas { padding: 16px; overflow-x: auto; }
  .matrix-detail, .diagnostic { position: static; width: 100%; margin-top: 16px; }
  .annotation { position: static; margin-top: 12px; }
}
</style>
