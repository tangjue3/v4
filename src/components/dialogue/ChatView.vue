<template>
  <section class="flex-1 flex flex-col xl:flex-row h-full overflow-hidden bg-transparent relative animate-fade-in">
    <!-- COLUMN 1: Chat Pane -->
    <div class="flex-1 flex flex-col h-full bg-transparent" style="border-right: 1px solid var(--border-subtle)">
      <!-- Header -->
      <header class="px-6 py-4 flex items-center justify-between bg-transparent shrink-0" style="border-bottom: 1px solid var(--border-card)">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-full flex items-center justify-center border" style="background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.2)">
            <span class="w-6 h-6 block rounded-full" style="background: radial-gradient(circle at 30% 30%, #93c5fd, #3b82f6)" />
          </div>
          <div>
            <h1 class="font-bold text-xl leading-tight" style="font-family: var(--font-display); color: var(--text-primary)">AI 学习导师</h1>
            <p class="text-sm" style="color: var(--text-muted)">像朋友一样聊天，AI 帮你绘制专属学习画像</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button @click="isSidebarCollapsed = !isSidebarCollapsed" class="text-sm font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0" style="color: var(--gold-400); border: 1px solid var(--border-card); background: rgba(59, 130, 246, 0.06)">
            <span>{{ isSidebarCollapsed ? '展开 ➔' : '⮨ 收入' }}</span>
          </button>
          <button @click="isAiSidebarOpen = !isAiSidebarOpen" class="text-sm font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0" style="color: var(--teal-400); border: 1px solid rgba(45, 212, 184, 0.2); background: rgba(45, 212, 184, 0.06)">
            <span>{{ isAiSidebarOpen ? '收起虚拟人' : '展开虚拟人' }}</span>
          </button>
          <button @click="isRightSidebarCollapsed = !isRightSidebarCollapsed" class="text-sm font-semibold px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shrink-0" style="color: #d64a7a; border: 1px solid rgba(214, 74, 122, 0.2); background: rgba(214, 74, 122, 0.06)">
            <span>{{ isRightSidebarCollapsed ? '展开报告 ➔' : '⮨ 收起报告' }}</span>
          </button>
        </div>
      </header>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-6 space-y-6 bg-transparent" ref="messagesContainer">
        <div v-for="chat in chats" :key="chat.id" class="flex gap-3.5 animate-fade-in-up" :style="{ animationDelay: '0s' }" :class="chat.sender === 'user' ? 'flex-row-reverse' : ''">
          <!-- AI Avatar (only for AI messages) -->
          <div v-if="chat.sender === 'ai'" class="shrink-0">
            <!-- 虚拟导师 -->
            <div v-if="chat.source === 'ai'" class="w-10 h-10 relative">
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-600 opacity-20 blur-sm" />
              <div class="relative w-full h-full rounded-xl flex items-center justify-center text-white shadow-lg" style="background: linear-gradient(135deg, #0d9488, #065f46); box-shadow: 0 2px 12px rgba(13, 148, 136, 0.3)">
                <Sparkles class="w-5 h-5" />
              </div>
            </div>
            <!-- AI 学习导师 -->
            <div v-else class="w-10 h-10 relative">
              <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 opacity-20 blur-sm" />
              <div class="relative w-full h-full rounded-xl flex items-center justify-center text-white shadow-lg" style="background: linear-gradient(135deg, #60a5fa, #3b82f6); box-shadow: 0 2px 12px rgba(59, 130, 246, 0.3)">
                <Brain class="w-5 h-5" />
              </div>
            </div>
          </div>

          <!-- User icon (simplified, for ASR only) -->
          <div v-if="chat.sender === 'user' && chat.source === 'asr'" class="shrink-0">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm" style="background: linear-gradient(135deg, #60a5fa, #3b82f6); box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15)">
              <Mic class="w-5 h-5" />
            </div>
          </div>

          <!-- Message Content -->
          <div class="max-w-[76%] space-y-1.5" :class="{ 'text-right': chat.sender === 'user' }">
            <div class="flex items-center gap-2 px-1">
              <span class="text-xs font-medium" style="color: var(--text-muted)">{{ chat.time || '10:25' }}</span>
              <span v-if="chat.source === 'ai' && chat.sender === 'ai'"
                class="text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1" style="color: var(--teal-400); background: rgba(45, 212, 184, 0.1); border: 1px solid rgba(45, 212, 184, 0.2)">
                <Tv class="w-3 h-3" /> 虚拟导师
              </span>
              <span v-else-if="chat.source === 'asr'"
                class="text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1" style="color: var(--gold-400); background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2)">
                <Mic class="w-3 h-3" /> 语音输入
              </span>
              <span v-else-if="chat.source === 'ai' && chat.sender === 'user'"
                class="text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1" style="color: var(--teal-400); background: rgba(45, 212, 184, 0.1); border: 1px solid rgba(45, 212, 184, 0.2)">
                <Tv class="w-3 h-3" /> 虚拟人
              </span>
            </div>

            <div class="p-4 rounded-2xl text-base leading-relaxed whitespace-pre-line shadow-sm"
              :class="chat.sender === 'user'
                ? 'rounded-tr-none text-white'
                : 'rounded-tl-none'"
              :style="chat.sender === 'user'
                ? { background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.2))', border: '1px solid rgba(59, 130, 246, 0.2)' }
                : { background: 'rgba(59, 130, 246, 0.08)', border: '1px solid var(--border-card)', backdropFilter: 'blur(12px)' }">
              {{ chat.text }}
            </div>

            <!-- Recommended Course Cards -->
            <div v-if="chat.recommendedCourses?.length" class="mt-3 space-y-2.5">
              <div v-for="course in chat.recommendedCourses" :key="course.id"
                @click="navigateToCourse(course.id)"
                class="group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                :style="{
                  background: `linear-gradient(135deg, ${course.color}18, ${course.color}08)`,
                  border: `1px solid ${course.color}30`,
                }"
              >
                <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-sm"
                  :style="{ background: `linear-gradient(135deg, ${course.color}, ${course.color}99)` }">
                  {{ course.name.slice(0, 1) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-sm text-white truncate">{{ course.name }}</span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-full shrink-0"
                      :class="course.difficulty === '入门' ? 'bg-emerald-500/15 text-emerald-400' : course.difficulty === '进阶' ? 'bg-blue-500/15 text-blue-400' : 'bg-rose-500/15 text-rose-400'">
                      {{ course.difficulty }}
                    </span>
                  </div>
                  <p class="text-xs mt-0.5 truncate" style="color: var(--text-muted)">{{ course.reason }}</p>
                </div>
                <ExternalLink class="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" :style="{ color: course.color }" />
              </div>
              <p class="text-[11px] pt-1" style="color: var(--text-dim)">💡 点击课程卡片跳转到资源页面开始学习</p>
            </div>

            <div v-if="chat.sender === 'user' && chat.capturedTags?.length" class="flex flex-wrap items-center gap-1.5 justify-end pt-1">
              <span v-for="tag in chat.capturedTags" :key="tag" class="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border animate-fade-in" style="color: var(--gold-400); background: rgba(59, 130, 246, 0.1); border-color: rgba(59, 130, 246, 0.25)">
                <span>+</span><span>{{ tag }}</span>
              </span>
            </div>

            <div v-if="chat.sender === 'ai' && chat.suggestChips?.length" class="flex flex-wrap gap-2 pt-2 pb-0.5">
              <button v-for="chip in chat.suggestChips" :key="chip" @click="handleChipClick(chip)" class="text-sm font-medium px-4 py-2 rounded-full border transition-all text-left shadow-sm hover:shadow cursor-pointer" style="color: var(--gold-400); border-color: rgba(59, 130, 246, 0.2); background: rgba(59, 130, 246, 0.05); backdrop-filter: blur(4px)">
                {{ chip }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="isAiLoading" class="flex gap-4">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center border" style="background: rgba(59, 130, 246, 0.1); border-color: var(--border-card)">
            <span class="w-4 h-4 rounded-full animate-pulse" style="background: var(--gold-500)" />
          </div>
          <div class="text-sm px-5 py-3 rounded-2xl flex items-center gap-2 shadow-md" style="background: rgba(59, 130, 246, 0.08); color: var(--text-secondary); border: 1px solid var(--border-card); backdrop-filter: blur(12px)">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style="background: var(--gold-400)" />
              <span class="relative inline-flex rounded-full h-2 w-2" style="background: var(--gold-500)" />
            </span>
            <span>AI 学习规划导师正在深度画像分析中...</span>
          </div>
        </div>
        <div ref="bottomRef" />
      </div>

      <!-- Starfield Scanner -->
      <div class="py-2.5 px-4 shrink-0" style="border-top: 1px solid var(--border-card)">
        <StarfieldScanner :dimensions="dimensions" :canUnlockReport="canUnlockReport" @selectNode="selectNodeDetail" @triggerReport="triggerReport" />
      </div>

      <!-- Input Area -->
      <footer class="p-4 bg-transparent shrink-0 space-y-2" style="border-top: 1px solid var(--border-card)">
        <div class="flex flex-wrap gap-1.5 items-center justify-start text-sm" style="color: var(--text-muted)">
          <span class="font-semibold mr-1.5" style="font-family: var(--font-sans)">快捷提问:</span>
          <button v-for="(act, idx) in quickActions" :key="idx" @click="handleChipClick(act)" class="font-medium py-1.5 px-3.5 rounded-lg border transition-all cursor-pointer" style="background: rgba(59, 130, 246, 0.06); color: var(--text-secondary); border-color: var(--border-card)">
            {{ act }}
          </button>
        </div>

        <div class="flex items-center gap-2 rounded-2xl p-2 border transition-all" style="background: rgba(59, 130, 246, 0.06); border-color: var(--border-input); backdrop-filter: blur(12px)">
          <div class="flex items-center gap-1 pl-1.5" style="color: var(--text-muted)">
            <button class="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-[var(--bg-hover)]" style="color: var(--text-muted)"><Paperclip class="w-4 h-4" /></button>
            <button class="p-1.5 rounded-lg transition-colors cursor-pointer hover:bg-[var(--bg-hover)]" style="color: var(--text-muted)"><Smile class="w-4 h-4" /></button>
          </div>

          <input
            type="text"
            placeholder="继续聊聊你的学习情况吧..."
            v-model="inputText"
            @keydown="handleKeydown"
            class="flex-1 bg-transparent border-0 outline-0 text-base py-1.5 px-2 font-sans focus:ring-0"
            style="color: var(--text-primary); --tw-placeholder-color: var(--text-muted)"
          />

          <button
            @click="sendMessage"
            :disabled="!inputText.trim() || isAiLoading"
            class="p-2.5 rounded-xl transition-all shadow-md focus:outline-none flex items-center justify-center shrink-0 cursor-pointer"
            :style="inputText.trim() && !isAiLoading
              ? { background: 'linear-gradient(135deg, var(--gold-500), var(--gold-600))', color: '#fff', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)' }
              : { background: 'rgba(59, 130, 246, 0.08)', color: 'var(--text-dim)', border: '1px solid var(--border-card)' }"
          >
            <Send class="w-4 h-4" />
          </button>
        </div>

        <div class="flex items-center justify-between text-xs px-2 font-medium" style="color: var(--text-muted)">
          <span>按 Enter 发送, Shift + Enter 换行</span>
          <span>对话状态: <strong style="color: var(--teal-400)">listening</strong></span>
        </div>
      </footer>
    </div>

    <!-- COLUMN 2: Metric Panel -->
    <MetricPanel />

    <!-- Separator -->
    <div class="hidden xl:flex flex-col items-center justify-center w-[1px] relative z-30 shrink-0" style="background: var(--border-subtle)">
      <button
        @click="isRightSidebarCollapsed = !isRightSidebarCollapsed"
        class="absolute flex items-center justify-center rounded-full w-5.5 h-12 shadow-md hover:shadow-lg focus:outline-none cursor-pointer transition-all group"
        style="left: -11px; background: rgba(59, 130, 246, 0.12); border: 1px solid var(--border-card); backdrop-filter: blur(12px)"
        :title="isRightSidebarCollapsed ? '展开完整学习画像报告' : '收起完整学习画像报告'"
      >
        <div class="flex flex-col items-center justify-center gap-0.5">
          <span class="w-1 h-1 rounded-full transition-colors" style="background: var(--text-dim)" />
          <ChevronRight class="w-4 h-4 transition-transform duration-300" style="color: var(--gold-400)" :class="{ 'rotate-180': !isRightSidebarCollapsed }" />
          <span class="w-1 h-1 rounded-full transition-colors" style="background: var(--text-dim)" />
        </div>
      </button>
    </div>

    <!-- COLUMN 3: Profile Report Panel -->
    <ProfileReportPanel />
  </section>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed } from 'vue'
import { Paperclip, Smile, Code, Image, Send, ChevronRight, Mic, Tv, Sparkles, Brain, ExternalLink } from 'lucide-vue-next'
import StarfieldScanner from './StarfieldScanner.vue'
import MetricPanel from './MetricPanel.vue'
import ProfileReportPanel from './ProfileReportPanel.vue'
import {
  chats, inputText, isAiLoading, isSidebarCollapsed, isRightSidebarCollapsed,
  isAiSidebarOpen, dimensions, canUnlockReport, handleChipClick, selectNodeDetail,
  navigateToCourse,
} from '@/composables/dialogue/useAppState'
import { sendMessage, triggerReport } from '@/composables/dialogue/useChatApi'

const bottomRef = ref<HTMLDivElement | null>(null)
const messagesContainer = ref<HTMLDivElement | null>(null)

const CodeIcon = Code
const ImageIcon = Image

const quickActions = ['继续聊聊我的学习情况', '换个话题吧', '我该如何安排学习时间？']

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

watch(chats, () => {
  nextTick(() => {
    bottomRef.value?.scrollIntoView({ behavior: 'smooth' })
  })
}, { deep: true })
</script>
