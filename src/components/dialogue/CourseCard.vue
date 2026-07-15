<template>
  <div
    class="backdrop-blur-md rounded-2xl overflow-hidden transition-all duration-300 group"
    style="background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-card);"
    :class="expanded ? 'border-blue-500/25' : 'hover:border-blue-500/20'"
    :style="expanded ? { background: 'rgba(59, 130, 246, 0.12)', borderColor: 'rgba(59, 130, 246, 0.25)' } : { background: 'rgba(59, 130, 246, 0.08)' }"
    @mouseenter="cardHover = true"
    @mouseleave="cardHover = false"
  >
    <!-- Header -->
    <div class="p-4 flex items-start gap-4 cursor-pointer select-none" @click="expanded = !expanded">
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xl"
        :style="{ background: course.color + '30', border: '1px solid ' + course.color + '50' }"
      >
        <span :style="{ color: course.color }">{{ course.name.charAt(0) }}</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <h3 class="font-extrabold text-slate-200 text-base group-hover:text-cyan-400 transition-colors">
            {{ course.name }}
          </h3>
          <span class="text-xs px-2.5 py-0.5 rounded-full border font-bold" :class="difficultyColors[course.difficulty]">
            {{ course.difficulty }}
          </span>
        </div>
        <p class="text-sm text-slate-500 mt-1 font-medium">
          前置知识: {{ course.prerequisites }} · {{ course.knowledgePoints.length }} 个知识点 · {{ course.qa.length }} 道预设问答
        </p>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <button
          @click.stop="handleConsult"
          class="py-1.5 px-3.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer border-none"
        >
          连麦咨询
        </button>
        <ChevronDown class="w-5 h-5 text-slate-500 transition-transform duration-200 shrink-0"
          :class="expanded ? 'rotate-180' : ''" />
      </div>
    </div>

    <!-- Expanded Content -->
    <div v-if="expanded" class="px-4 pb-4 space-y-4 pt-3 animate-fade-in" style="border-top: 1px solid var(--border-card);">
      <!-- Knowledge Points -->
      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">📚 核心知识点</h4>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div v-for="kp in course.knowledgePoints" :key="kp.concept"
            class="rounded-xl p-3 backdrop-blur-sm"
            style="background: rgba(59, 130, 246, 0.06); border: 1px solid var(--border-subtle);"
          >
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-bold text-slate-200">{{ kp.concept }}</span>
              <span class="text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0" :class="difficultyColors[kp.difficulty]">
                {{ kp.difficulty }}
              </span>
            </div>
            <p class="text-sm text-slate-400 mt-1 leading-relaxed">{{ kp.desc }}</p>
          </div>
        </div>
      </div>

      <!-- Code Example -->
      <div v-if="course.codeExample">
        <div class="flex items-center justify-between mb-2">
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">💻 代码示例</h4>
          <button
            @click="showCode = !showCode"
            class="text-xs text-cyan-400 hover:text-cyan-300 font-bold cursor-pointer bg-transparent border-none"
          >
            {{ showCode ? '收起代码' : '展开代码' }}
          </button>
        </div>
        <div v-if="showCode" class="relative">
          <div class="absolute top-2 right-2 z-10">
            <span class="text-[10px] px-2 py-0.5 rounded font-mono font-bold" style="background: rgba(59, 130, 246, 0.15); color: rgba(148, 163, 184, 0.9);">
              {{ course.codeExample.lang }}
            </span>
          </div>
          <pre class="rounded-xl p-3.5 overflow-x-auto text-sm leading-relaxed font-mono text-slate-300 max-h-[300px] overflow-y-auto" style="background: rgba(59, 130, 246, 0.08); border: 1px solid var(--border-card); backdrop-filter: blur(8px);"><code>{{ course.codeExample.code }}</code></pre>
        </div>
      </div>

      <!-- Preset Q&A -->
      <div>
        <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">❓ 预设问答</h4>
        <div class="flex flex-wrap gap-1.5">
          <button
            v-for="(q, idx) in course.qa" :key="idx"
            @click="handleQaClick(q)"
            class="text-sm px-3 py-1.5 rounded-lg bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-400 border border-cyan-900/30 hover:border-cyan-800/50 font-medium transition-all cursor-pointer text-left"
          >
            {{ q }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { difficultyColors } from '@/data/dialogue/courseData'
import type { Course } from '@/data/dialogue/courseData'

const props = defineProps<{
  course: Course
}>()

const emit = defineEmits<{
  consult: [course: Course]
  qaClick: [question: string]
}>()

const expanded = ref(false)
const showCode = ref(false)
const cardHover = ref(false)

function handleConsult() {
  emit('consult', props.course)
}

function handleQaClick(question: string) {
  emit('qaClick', question)
}
</script>
