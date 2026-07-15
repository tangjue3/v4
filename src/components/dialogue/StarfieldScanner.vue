<template>
  <div class="cosmic-card rounded-2xl p-4 space-y-3">
    <!-- Header with progress -->
    <div class="flex flex-col gap-1.5">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-cyan-400 animate-pulse" />
          <h3 class="font-bold text-slate-100 text-sm tracking-tight">星场扫描 · 学习画像采集进度</h3>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-sm text-slate-400 font-medium font-mono">已采集 {{ collectedCount }} / 9</span>
          <button
            @click="isCollapsed = !isCollapsed"
            class="p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 hover:bg-blue-500/10"
            style="color: var(--text-muted); border: 1px solid var(--border-card); background: rgba(59, 130, 246, 0.06)"
          >
            <ChevronDown v-if="isCollapsed" class="w-4 h-4" />
            <ChevronUp v-else class="w-4 h-4" />
          </button>
        </div>
      </div>
      <div class="w-full rounded-full h-2 overflow-hidden" style="background: rgba(59, 130, 246, 0.1); border: 1px solid var(--border-subtle)">
        <div
          class="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(6,182,212,0.5)]"
          :style="{ width: `${(collectedCount / 9) * 100}%` }"
        />
      </div>
    </div>

    <div v-if="!isCollapsed" class="space-y-3 animate-fade-in">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-center">
        <!-- Scanner SVG -->
        <div class="col-span-5 flex justify-center relative rounded-2xl py-2" style="background: rgba(59, 130, 246, 0.04); border: 1px solid var(--border-subtle)">
          <svg :width="size" :height="size" class="overflow-visible select-none">
            <circle :cx="center" :cy="center" :r="radius" fill="none" stroke="rgba(56, 189, 248, 0.18)" stroke-width="1.5" />
            <circle :cx="center" :cy="center" :r="radius * 0.6" fill="none" stroke="rgba(99, 102, 241, 0.12)" stroke-width="1" />

            <line
              :x1="center" :y1="center"
              :x2="center" :y2="center - radius"
              stroke="rgba(6, 182, 212, 0.4)"
              stroke-width="1.5"
              stroke-linecap="round"
              :style="{ transformOrigin: `${center}px ${center}px`, animationDuration: '8s' }"
              class="animate-spin"
            />

            <path
              v-if="collectedCount > 1"
              :d="activeLinePath"
              fill="rgba(6, 182, 212, 0.1)"
              stroke="#06b6d4"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-all duration-500"
            />

            <g
              v-for="n in nodes"
              :key="'node-' + n.index"
              class="cursor-pointer font-semibold font-sans"
              @mouseenter="hoveredNode = n.index"
              @mouseleave="hoveredNode = null"
              @click="$emit('selectNode', n.label)"
            >
              <template v-if="n.value !== null">
                <circle
                  :cx="getNodeCoords(n.index).x" :cy="getNodeCoords(n.index).y"
                  r="9" fill="rgba(6, 182, 212, 0.35)"
                  class="animate-ping"
                  :style="{ transformOrigin: `${getNodeCoords(n.index).x}px ${getNodeCoords(n.index).y}px`, animationDuration: '2.5s' }"
                />
                <circle :cx="getNodeCoords(n.index).x" :cy="getNodeCoords(n.index).y" :r="hoveredNode === n.index ? 8 : 7" fill="#06b6d4" class="transition-all" />
                <path
                  :d="`M ${getNodeCoords(n.index).x - 2.5} ${getNodeCoords(n.index).y} L ${getNodeCoords(n.index).x + 2.5} ${getNodeCoords(n.index).y} M ${getNodeCoords(n.index).x} ${getNodeCoords(n.index).y - 2.5} L ${getNodeCoords(n.index).x} ${getNodeCoords(n.index).y + 2.5}`"
                  stroke="#ffffff" stroke-width="1.2" stroke-linecap="round"
                />
              </template>
              <template v-else>
                <circle :cx="getNodeCoords(n.index).x" :cy="getNodeCoords(n.index).y" r="5" fill="rgba(59, 130, 246, 0.15)" stroke="rgba(59, 130, 246, 0.2)" stroke-width="1" />
                <circle :cx="getNodeCoords(n.index).x" :cy="getNodeCoords(n.index).y" r="2.2" fill="rgba(147, 197, 253, 0.3)" />
              </template>
              <circle :cx="getNodeCoords(n.index).x" :cy="getNodeCoords(n.index).y" r="12" fill="transparent" />
            </g>

            <g v-if="hoveredNode !== null" :transform="`translate(${center}, ${center})`">
              <rect x="-60" y="-14" width="120" height="28" rx="6" fill="rgba(10, 20, 50, 0.85)" stroke="rgba(59, 130, 246, 0.3)" stroke-width="1" />
              <text x="0" y="4" text-anchor="middle" fill="#ffffff" class="text-xs font-sans font-medium">
                {{ nodes[hoveredNode - 1].label }}: {{ nodes[hoveredNode - 1].value || '未采集' }}
              </text>
            </g>
          </svg>
        </div>

        <!-- Dimension tags grid -->
        <div class="col-span-7 grid grid-cols-3 gap-1.5 text-sm">
          <button
            v-for="n in nodes"
            :key="'tag-grid-' + n.index"
            @click="$emit('selectNode', n.label)"
            class="py-2 px-1.5 rounded-xl text-center font-medium transition-all duration-300 border cursor-pointer text-sm"
            :class="n.value !== null
              ? 'text-emerald-400 hover:bg-emerald-500/10'
              : 'text-slate-400 hover:text-slate-200'"
            style="background: rgba(59, 130, 246, 0.04); border: 1px solid var(--border-subtle)"
          >
            <div class="flex items-center justify-center gap-1">
              <span class="opacity-90">{{ circledDigits[n.index] }}</span>
              <span class="truncate">{{ n.label }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Action bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-2.5 text-sm" style="border-top: 1px solid var(--border-subtle); color: var(--text-muted)">
        <div class="flex items-center gap-1 px-0.5">
          <Lock class="w-4 h-4 text-slate-500 shrink-0" />
          <span v-if="canUnlockReport" class="text-emerald-400 font-semibold">● 画像也已就绪，立即开启测绘！</span>
          <span v-else>再聊 <strong class="text-cyan-400 font-bold">{{ Math.max(1, 4 - collectedCount) }}</strong> 个维度即可解锁学习画像</span>
        </div>
        <button
          @click="$emit('triggerReport')"
          :disabled="!canUnlockReport"
          class="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 transition-all select-none border cursor-pointer"
            :class="canUnlockReport
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-950/50'
              : 'text-slate-400 cursor-not-allowed shadow-none'"
            :style="{
              border: '1px solid var(--border-card)',
              background: canUnlockReport ? undefined : 'rgba(59, 130, 246, 0.04)',
            }"
        >
          <Sparkles class="w-4 h-4" :class="canUnlockReport ? 'text-cyan-400 animate-pulse' : 'text-slate-500'" />
          <span>信号充足，可进行学习画像</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Sparkles, ChevronDown, ChevronUp, Lock } from 'lucide-vue-next'
import type { DimensionMap } from '@/types/dialogue'

const props = defineProps<{
  dimensions: DimensionMap
  canUnlockReport: boolean
}>()

defineEmits<{
  selectNode: [name: string]
  triggerReport: []
}>()

const isCollapsed = ref(true)
const hoveredNode = ref<number | null>(null)

const radius = 58
const size = 150
const center = size / 2

const circledDigits = ['', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨']

const nodes = computed(() => [
  { index: 1, key: 'identity' as const, label: '身份', value: props.dimensions.identity },
  { index: 2, key: 'domain' as const, label: '领域', value: props.dimensions.domain },
  { index: 3, key: 'level' as const, label: '水平', value: props.dimensions.level },
  { index: 4, key: 'experience' as const, label: '经验', value: props.dimensions.experience },
  { index: 5, key: 'goal' as const, label: '短期目标', value: props.dimensions.goal },
  { index: 6, key: 'motivation' as const, label: '动机', value: props.dimensions.motivation },
  { index: 7, key: 'period' as const, label: '学习时段', value: props.dimensions.period },
  { index: 8, key: 'weeklyHours' as const, label: '每周时长', value: props.dimensions.weeklyHours },
  { index: 9, key: 'method' as const, label: '学习方式', value: props.dimensions.method },
])

const collectedCount = computed(() => nodes.value.filter(n => n.value !== null).length)

function getNodeCoords(idx: number) {
  const angle = ((idx - 1) * 2 * Math.PI) / 9 - Math.PI / 2
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle),
  }
}

const activeLinePath = computed(() => {
  const activeNodes = nodes.value.filter(n => n.value !== null)
  if (activeNodes.length <= 1) return ''
  const coords = activeNodes.map(n => getNodeCoords(n.index))
  return `M ${coords.map(c => `${c.x},${c.y}`).join(' L ')} Z`
})
</script>
