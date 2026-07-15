<template>
  <div class="bg-transparent backdrop-blur-md flex flex-col h-full overflow-y-auto shrink-0 transition-all duration-300" style="border-right: 1px solid var(--border-subtle) !important"
    :class="isMetricCollapsed ? 'w-[64px] p-2 bg-transparent' : 'w-full md:w-[400px] p-5 space-y-5'">
    <!-- Collapsed State -->
    <template v-if="isMetricCollapsed">
      <div class="flex flex-col items-center py-2 h-full w-full space-y-6">
        <button @click="isMetricCollapsed = false" class="p-1.5 rounded-lg transition-colors cursor-pointer" style="background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-subtle); color: rgb(203 213 225);" title="展开采集指标"
          @mouseenter="hoverCollapseBtn = true"
          @mouseleave="hoverCollapseBtn = false"
          :style="hoverCollapseBtn ? { background: 'rgba(59, 130, 246, 0.15)', color: '#22d3ee' } : {}">
          <ChevronLeft class="w-4 h-4" />
        </button>
        <div class="flex-1 flex flex-col items-center justify-center space-y-3.5 w-full">
          <span class="text-xs font-bold text-slate-400 uppercase tracking-wider select-none text-center" style="writing-mode: vertical-lr">学习画像进度</span>
          <span class="text-sm font-black text-cyan-400 font-mono">{{ Math.round((collectedCount / 9) * 100) }}%</span>
          <div class="w-2.5 h-44 rounded-full relative overflow-hidden flex flex-col justify-end shadow-inner" style="background: rgba(59, 130, 246, 0.1); border: 1px solid var(--border-subtle);">
            <div class="bg-gradient-to-t from-blue-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out" :style="{ height: `${(collectedCount / 9) * 100}%` }" />
          </div>
          <span class="text-xs font-bold text-slate-400 font-mono">{{ collectedCount }}/9</span>
        </div>
        <button
          @click="triggerReport"
          :disabled="!canUnlockReport"
          class="p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center shrink-0"
          :class="canUnlockReport ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/50 animate-pulse' : 'cursor-not-allowed'"
          :style="!canUnlockReport ? { background: 'transparent', color: 'rgb(100 116 139)', border: '1px solid var(--border-subtle)' } : {}"
          title="可以生成学习画像报告了！"
        >
          <Sparkles class="w-4 h-4" />
        </button>
      </div>
    </template>

    <!-- Expanded State -->
    <template v-else>
      <!-- Progress Panel -->
      <div class="rounded-2xl backdrop-blur-md p-4 shrink-0 space-y-4" style="background: rgba(59, 130, 246, 0.06); border: 1px solid var(--border-subtle);">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-200 tracking-wider uppercase">采集进度</h2>
          <button @click="isMetricCollapsed = true" class="p-1 rounded-lg transition-colors cursor-pointer" title="折叠指标日志" style="color: rgb(100 116 139);"
            @mouseenter="hoverChevronRight = true"
            @mouseleave="hoverChevronRight = false"
            :style="hoverChevronRight ? { background: 'rgba(59, 130, 246, 0.1)', color: 'rgb(203 213 225)' } : {}">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>

        <!-- Circular Progress -->
        <div class="flex flex-col items-center justify-center py-2 relative">
          <svg class="w-24 h-24 transform -rotate-90 overflow-visible">
            <circle cx="48" cy="48" r="38" stroke="rgba(59, 130, 246, 0.15)" stroke-width="8" fill="transparent" />
            <circle cx="48" cy="48" r="38" stroke="#06b6d4" stroke-width="8" fill="transparent"
              :stroke-dasharray="2 * Math.PI * 38"
              :stroke-dashoffset="2 * Math.PI * 38 * (1 - collectedCount / 9)"
              stroke-linecap="round"
              class="transition-all duration-1000 ease-out" />
          </svg>
          <div class="absolute text-center flex flex-col items-center justify-center">
            <span class="text-xl font-black text-slate-200 font-display">{{ Math.round((collectedCount / 9) * 100) }}%</span>
            <span class="text-xs font-semibold text-slate-400">已采集 {{ collectedCount }}/9</span>
          </div>
        </div>
        <p class="text-sm text-center text-slate-400 leading-normal px-2">继续聊聊，完善你的学习画像吧~</p>
      </div>

      <!-- Dimensions Checklist -->
      <div class="space-y-3.5 flex-1">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-200 tracking-wider uppercase">维度日志</h2>
          <button v-if="selectedDimensionInfo" @click="selectedDimensionInfo = null" class="text-xs text-cyan-400 font-medium hover:text-cyan-300">清除说明</button>
        </div>

        <div v-if="selectedDimensionInfo" class="p-2.5 bg-cyan-950/25 border border-cyan-900/40 rounded-xl text-sm leading-relaxed text-slate-200 animate-fade-in">
          <span class="font-bold">「{{ selectedDimensionInfo }}」</span>说明: 系统根据当前会话分析精准提炼出和您该维度匹配的信息作为特征入库。
        </div>

        <div class="space-y-1.5 text-sm">
          <div
            v-for="(row, idx) in dimensionRows"
            :key="idx"
            @click="selectNodeDetail(row.label.split(' ')[1])"
            class="flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer"
            :class="row.isChecked
              ? 'text-slate-100'
              : 'text-slate-500'"
            :style="row.isChecked
              ? { background: 'rgba(59, 130, 246, 0.1)', borderColor: 'var(--border-card)' }
              : { background: 'transparent', borderColor: 'var(--border-subtle)', borderStyle: 'dashed' }"
          >
            <span class="font-semibold text-sm">{{ row.label }}</span>
            <div class="flex items-center gap-2">
              <span class="text-sm font-bold" :class="row.isChecked ? 'text-cyan-400' : 'text-slate-500'">
                {{ row.display }}
              </span>
              <Check v-if="row.isChecked" class="w-4 h-4 text-emerald-400 stroke-[3]" />
              <div v-else class="w-1.5 h-1.5 rounded-full" style="background: rgba(59, 130, 246, 0.2);" />
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="space-y-2 shrink-0 pt-3" style="border-top: 1px solid var(--border-subtle);">
        <button
          @click="triggerReport"
          :disabled="!canUnlockReport"
          class="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          :class="canUnlockReport ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/50' : 'cursor-not-allowed'"
          :style="!canUnlockReport ? { background: 'rgba(59, 130, 246, 0.04)', color: 'rgb(100 116 139)', border: '1px solid var(--border-subtle)' } : {}"
        >
          <Sparkles class="w-4 h-4" />
          <span>开始学习画像</span>
        </button>

        <button @click="resetConversation" class="w-full py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer" style="background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(244, 63, 94, 0.2); color: #f87171;"
          @mouseenter="hoverReset = true"
          @mouseleave="hoverReset = false"
          :style="hoverReset ? { background: 'rgba(244, 63, 94, 0.1)', borderColor: 'rgba(244, 63, 94, 0.3)' } : {}">
          <RefreshCw class="w-4 h-4" />
          <span>重置对话</span>
        </button>
      </div>

      <!-- Scoring Panel -->
      <div class="p-3 rounded-2xl backdrop-blur-sm shrink-0 space-y-2" style="background: rgba(59, 130, 246, 0.05); border: 1px solid var(--border-subtle);">
        <div class="flex items-center justify-between text-sm text-white font-bold">
          <span>画像评分 (示例)</span>
          <span class="text-cyan-400 font-black">87</span>
        </div>
        <div class="flex gap-0.5">
          <Sparkles v-for="i in 5" :key="'star-' + i" class="w-3.5 h-3.5" :class="i < 4 ? 'text-blue-400 fill-blue-400' : ''" :style="i >= 4 ? { color: 'rgba(59, 130, 246, 0.2)' } : {}" />
        </div>
        <div class="space-y-1 text-xs text-slate-400">
          <div v-for="(score, label) in sampleScores" :key="label" class="flex justify-between items-center gap-2">
            <span class="shrink-0">{{ label }}</span>
            <div class="flex-1 h-2 rounded-full overflow-hidden" style="background: rgba(59, 130, 246, 0.1);">
              <div class="bg-cyan-500 h-full rounded-full" :style="{ width: `${score}%` }" />
            </div>
            <span class="text-xs text-cyan-400 font-bold w-8 text-right">{{ score }}</span>
          </div>
        </div>
        <button
          @click="triggerReport"
          :disabled="!canUnlockReport"
          class="w-full py-2 mt-1 rounded-lg text-sm font-bold text-center transition-all cursor-pointer"
          :class="canUnlockReport ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-900/50 hover:bg-cyan-950/60' : 'cursor-not-allowed'"
          :style="!canUnlockReport ? { background: 'rgba(59, 130, 246, 0.05)', color: 'rgb(71 85 105)', border: '1px solid var(--border-subtle)' } : {}"
        >查看完整画像</button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Sparkles, ChevronLeft, ChevronRight, Check, RefreshCw } from 'lucide-vue-next'
import {
  isMetricCollapsed, dimensions, collectedCount, canUnlockReport,
  selectedDimensionInfo, selectNodeDetail, resetConversation,
} from '@/composables/dialogue/useAppState'
import { triggerReport } from '@/composables/dialogue/useChatApi'

const dimensionKeys = [
  { key: 'identity' as const, idx: 1, label: '身份' },
  { key: 'domain' as const, idx: 2, label: '领域' },
  { key: 'level' as const, idx: 3, label: '水平' },
  { key: 'experience' as const, idx: 4, label: '经验' },
  { key: 'goal' as const, idx: 5, label: '短期目标' },
  { key: 'motivation' as const, idx: 6, label: '动机' },
  { key: 'period' as const, idx: 7, label: '学习时段' },
  { key: 'weeklyHours' as const, idx: 8, label: '每周时长' },
  { key: 'method' as const, idx: 9, label: '学习方式' },
]

const dimensionRows = computed(() =>
  dimensionKeys.map(dk => ({
    label: `${dk.idx} ${dk.label}`,
    isChecked: dimensions.value[dk.key] !== null,
    display: dimensions.value[dk.key] || '待捕获',
  }))
)

const sampleScores = { '知识基础': 85, '学习速度': 90, '逻辑思维': 88, '创造力': 82 }

const hoverCollapseBtn = ref(false)
const hoverChevronRight = ref(false)
const hoverReset = ref(false)
</script>
