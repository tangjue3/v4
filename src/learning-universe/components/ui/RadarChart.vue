<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="radar-chart">
    <defs>
      <radialGradient :id="gradId" cx="50%" cy="50%" r="50%">
        <stop offset="0%" :stop-color="strokeColor" stop-opacity="0.3" />
        <stop offset="100%" :stop-color="strokeColor" stop-opacity="0.02" />
      </radialGradient>
      <filter :id="`${gradId}-glow`">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    <!-- Grid rings -->
    <g v-for="level in levels" :key="'grid-' + level">
      <polygon
        :points="getGridPoints(level / levels)"
        fill="none"
        :stroke="level === levels ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)'"
        stroke-width="1"
      />
    </g>

    <!-- Axis lines -->
    <g v-for="(_, i) in normalizedData" :key="'axis-' + i">
      <line
        :x1="cx" :y1="cy"
        :x2="getPoint(i, 1.0).x"
        :y2="getPoint(i, 1.0).y"
        stroke="rgba(255,255,255,0.04)"
        stroke-width="1"
      />
    </g>

    <!-- Data area -->
    <polygon
      :points="getDataPoints()"
      :fill="`url(#${gradId})`"
      fill-opacity="0.6"
      :stroke="strokeColor"
      stroke-width="1.5"
      class="data-polygon"
    />

    <!-- Data points -->
    <g v-for="(d, i) in normalizedData" :key="'dot-' + i">
      <circle
        :cx="getPoint(i, d / 100).x"
        :cy="getPoint(i, d / 100).y"
        r="4"
        :fill="strokeColor"
        :filter="`url(#${gradId}-glow)`"
        class="data-dot"
      />
      <circle
        :cx="getPoint(i, d / 100).x"
        :cy="getPoint(i, d / 100).y"
        r="7"
        :fill="strokeColor"
        opacity="0.12"
      />
    </g>

    <!-- Value labels -->
    <text
      v-for="(d, i) in normalizedData"
      :key="'val-' + i"
      :x="getPoint(i, Math.max(d / 100, 0.15)).x"
      :y="getPoint(i, Math.max(d / 100, 0.15)).y"
      text-anchor="middle"
      dominant-baseline="central"
      :fill="strokeColor"
      font-size="9"
      font-weight="700"
      font-family="Exo 2, sans-serif"
    >
      {{ d }}
    </text>

    <!-- Axis labels -->
    <text
      v-for="(label, i) in labels"
      :key="'label-' + i"
      :x="getPoint(i, 1.25).x"
      :y="getPoint(i, 1.25).y"
      :text-anchor="labelAnchor(i)"
      dominant-baseline="central"
      fill="rgba(255,255,255,0.4)"
      font-size="11"
      font-weight="500"
    >
      {{ label }}
    </text>
  </svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  data: number[]
  labels: string[]
  size?: number
  levels?: number
  fillColor?: string
  strokeColor?: string
}>(), {
  size: 260,
  levels: 4,
  fillColor: 'rgba(79, 195, 247, 0.15)',
  strokeColor: '#4FC3F7',
})

const gradId = computed(() => `radar-grad-${props.strokeColor.replace('#', '')}`)

const normalizedData = computed(() => props.data)

const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - 40)

function getAngle(index: number): number {
  return -Math.PI / 2 + (2 * Math.PI * index) / props.data.length
}

function getPoint(index: number, ratio: number): { x: number; y: number } {
  const angle = getAngle(index)
  const r = radius.value * ratio
  return { x: cx.value + r * Math.cos(angle), y: cy.value + r * Math.sin(angle) }
}

function getGridPoints(ratio: number): string {
  return props.data.map((_, i) => { const p = getPoint(i, ratio); return `${p.x},${p.y}` }).join(' ')
}

function getDataPoints(): string {
  return props.data.map((d, i) => { const p = getPoint(i, d / 100); return `${p.x},${p.y}` }).join(' ')
}

function labelAnchor(index: number): string {
  const count = props.data.length
  const mid = count / 2
  if (index === 0 || index === mid) return 'middle'
  if (index < mid) return 'start'
  return 'end'
}
</script>

<style scoped>
.radar-chart {
  display: block;
  margin: 0 auto;
}

.data-polygon {
  animation: radarPulse 3s ease-in-out infinite;
}

.data-dot {
  animation: dotPulse 2s ease-in-out infinite;
}

@keyframes radarPulse {
  0%, 100% { fill-opacity: 0.5; }
  50% { fill-opacity: 0.7; }
}

@keyframes dotPulse {
  0%, 100% { opacity: 1; r: 4; }
  50% { opacity: 0.8; r: 5; }
}
</style>
