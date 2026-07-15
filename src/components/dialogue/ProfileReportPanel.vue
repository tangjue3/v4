<template>
  <section
    class="h-full overflow-y-auto bg-transparent backdrop-blur-md flex flex-col transition-all duration-300 shrink-0" style="border-left: 1px solid var(--border-subtle) !important"
    :class="isRightSidebarCollapsed
      ? 'w-0 overflow-hidden border-l-0 opacity-0'
      : showReport
        ? 'w-full xl:w-[350px]'
        : 'hidden xl:flex xl:w-[350px] opacity-65 pointer-events-none select-none'"
  >
    <!-- Active Report -->
    <div v-if="showReport && report" class="p-6 space-y-6">
      <div class="flex items-center justify-between pb-4" style="border-bottom: 1px solid var(--border-subtle);">
        <h2 class="font-extrabold text-white text-lg tracking-tight font-display">完整学习画像报告</h2>
        <button @click="showReport = false" class="p-1 rounded-lg transition-colors cursor-pointer" style="color: rgb(100 116 139);"
          @mouseenter="hoverCloseBtn = true"
          @mouseleave="hoverCloseBtn = false"
          :style="hoverCloseBtn ? { color: 'rgb(226 232 240)', background: 'rgba(59, 130, 246, 0.1)' } : {}">
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Score Card -->
      <div class="grid grid-cols-2 gap-4 items-center rounded-2xl p-4 backdrop-blur-md" style="background: rgba(59, 130, 246, 0.06); border: 1px solid var(--border-subtle);">
        <div>
          <h3 class="text-sm font-bold text-slate-500 tracking-wider">综合评分</h3>
          <div class="flex items-baseline gap-1 mt-1">
            <span class="text-4xl font-extrabold text-cyan-400 font-display">{{ report.score }}</span>
            <span class="text-sm text-slate-500 font-bold">/ 100</span>
          </div>
          <div class="flex items-center gap-1.5 mt-2">
            <div class="flex gap-0.5">
              <Sparkles v-for="i in 5" :key="'s-' + i" class="w-3.5 h-3.5" :class="i < 4 ? 'text-blue-400 fill-blue-400' : 'text-blue-400/30'" />
            </div>
            <span class="text-xs font-bold text-emerald-400 bg-emerald-950/45 border border-emerald-900/50 px-2 py-0.5 rounded-full">{{ report.evaluation }}</span>
          </div>
        </div>
        <div class="flex justify-center">
          <RadarChart :points="report.radarPoints" :size="150" />
        </div>
      </div>

      <!-- Capability Details -->
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-slate-200 tracking-wider uppercase">能力维度详情</h3>
        <div class="space-y-2.5">
          <div v-for="(pt, idx) in report.radarPoints" :key="idx" class="space-y-1">
            <div class="flex justify-between items-center text-sm text-slate-300 font-semibold">
              <span>{{ pt.dimension }}</span>
              <span class="font-bold text-cyan-400">{{ pt.score }}/100</span>
            </div>
            <div class="h-2 rounded-full overflow-hidden" style="background: rgba(59, 130, 246, 0.1);">
              <div class="bg-cyan-500 h-full rounded-full transition-all duration-[1.2s] ease-out" :style="{ width: `${pt.score}%` }" />
            </div>
          </div>
        </div>
      </div>

      <!-- Skill Tree -->
      <div class="space-y-3">
        <h3 class="text-sm font-bold text-slate-200 tracking-wider uppercase">技能树</h3>
        <div class="space-y-3">
          <div class="space-y-1.5">
            <h4 class="text-xs font-bold text-emerald-400">重点核心技能</h4>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="sk in report.skills.core" :key="'c-' + sk" class="bg-emerald-950/40 text-emerald-400 font-bold text-sm px-3 py-1.5 rounded-xl border border-emerald-900/50">✦ {{ sk }}</span>
            </div>
          </div>
          <div class="space-y-1.5">
            <h4 class="text-xs font-bold text-blue-400">基础通识底座</h4>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="sk in report.skills.foundation" :key="'f-' + sk" class="bg-blue-950/40 text-blue-400 font-bold text-sm px-3 py-1.5 rounded-xl border border-blue-900/50">♦ {{ sk }}</span>
            </div>
          </div>
          <div class="space-y-1.5">
            <h4 class="text-xs font-bold text-slate-400">工程与拓展方向</h4>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="sk in report.skills.additional" :key="'a-' + sk" class="text-slate-300 font-bold text-sm px-3 py-1.5 rounded-xl" style="background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-subtle);">⚙ {{ sk }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weaknesses -->
      <div class="space-y-3 pt-4" style="border-top: 1px solid var(--border-subtle);">
        <h3 class="text-sm font-bold text-slate-200 tracking-wider uppercase">薄弱环节分析</h3>
        <ul class="space-y-2 list-none p-0 text-sm text-slate-300 leading-relaxed font-semibold">
          <li v-for="(w, idx) in report.weaknesses" :key="'w-' + idx" class="flex items-start gap-2">
            <span class="text-rose-500 font-bold mt-0.5">•</span><span>{{ w }}</span>
          </li>
        </ul>
      </div>

      <!-- Suggestions -->
      <div class="space-y-3 pt-4" style="border-top: 1px solid var(--border-subtle);">
        <h3 class="text-sm font-bold text-slate-200 tracking-wider uppercase">个性化学习建议</h3>
        <ul class="space-y-2 list-none p-0 text-sm text-slate-300 leading-relaxed font-semibold">
          <li v-for="(s, idx) in report.suggestions" :key="'s-' + idx" class="flex items-start gap-2">
            <span class="text-emerald-500 font-bold mt-0.5">✓</span><span>{{ s }}</span>
          </li>
        </ul>
      </div>

      <!-- Roadmap -->
      <div class="space-y-4 pt-4" style="border-top: 1px solid var(--border-subtle);">
        <h3 class="text-sm font-bold text-slate-200 tracking-wider uppercase">学习路线推荐</h3>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="itm in report.recommendedPath" :key="'step-' + itm.step" class="backdrop-blur-sm p-3 rounded-2xl text-center space-y-1 relative" style="background: rgba(59, 130, 246, 0.06); border: 1px solid var(--border-subtle);">
            <span class="absolute top-1 left-2.5 text-[40px] leading-none font-black font-display pointer-events-none select-none" style="color: rgba(59, 130, 246, 0.1);">{{ itm.step }}</span>
            <h4 class="font-bold text-slate-200 text-sm relative z-10">{{ itm.title }}</h4>
            <p class="text-sm text-slate-400 font-medium leading-tight relative z-10">{{ itm.description }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-2 gap-3 pt-4" style="border-top: 1px solid var(--border-subtle);">
        <button @click="handleExportPDF" class="py-2.5 px-4 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer outline-0" style="background: rgba(59, 130, 246, 0.08); color: rgb(203 213 225); border: 1px solid var(--border-subtle);"
          @mouseenter="hoverExport = true"
          @mouseleave="hoverExport = false"
          :style="hoverExport ? { background: 'rgba(59, 130, 246, 0.15)' } : {}">
          <Download class="w-4 h-4" /><span>导出报告 PDF</span>
        </button>
        <button @click="handleShare" class="py-2.5 px-4 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer outline-0 border border-cyan-800/40">
          <Share2 class="w-4 h-4" /><span>分享报告</span>
        </button>
      </div>
    </div>

    <!-- Locked Preview -->
    <div v-else class="p-6 flex flex-col items-center justify-center h-full text-center space-y-4 select-none animate-fade-in">
      <div class="w-14 h-14 rounded-2xl flex items-center justify-center" style="background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-subtle); color: rgb(100 116 139);">
        <Lock class="w-7 h-7 text-cyan-500 animate-pulse" />
      </div>
      <div class="space-y-1.5 px-4">
        <h3 class="font-extrabold text-white text-base tracking-tight font-display">完整学习画像暂未点亮</h3>
        <p class="text-sm text-slate-400 leading-relaxed font-semibold">通过和 AI 导师聊天，注入您的背景或动机特征，收集 <strong>≥ 4 个维度</strong> 的特征日志，即可启动智能算力引擎绘制您的专属学习画像和高度定制的路线图。</p>
        <div class="pt-2">
          <span class="inline-flex items-center gap-1 bg-cyan-950/40 text-cyan-400 text-xs font-extrabold px-3 py-1 rounded-full border border-cyan-900/50">目前进度: {{ collectedCount }}/4 维度</span>
        </div>
      </div>
      <div class="w-full opacity-35 max-w-[90%] pointer-events-none scale-90 rounded-xl p-3 text-left text-xs space-y-2" style="border: 1px dashed var(--border-subtle);">
        <div class="h-2 w-1/3 rounded" style="background: rgba(59, 130, 246, 0.08);" />
        <div class="flex gap-2">
          <div class="h-10 w-10 rounded-full shrink-0" style="background: rgba(59, 130, 246, 0.08);" />
          <div class="flex-1 space-y-1.5">
            <div class="h-2 w-3/4 rounded" style="background: rgba(59, 130, 246, 0.08);" />
            <div class="h-2 w-1/2 rounded" style="background: rgba(59, 130, 246, 0.08);" />
          </div>
        </div>
        <div class="h-1.5 w-full rounded-full" style="background: rgba(59, 130, 246, 0.08);" />
        <div class="h-1.5 w-5/6 rounded-full" style="background: rgba(59, 130, 246, 0.08);" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, Sparkles, Lock, Download, Share2 } from 'lucide-vue-next'
import RadarChart from './RadarChart.vue'
import { isRightSidebarCollapsed, showReport, report, collectedCount, handleExportPDF, handleShare } from '@/composables/dialogue/useAppState'

const hoverCloseBtn = ref(false)
const hoverExport = ref(false)
</script>
