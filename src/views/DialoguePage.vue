<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import CosmicPageBackground from '@/components/layout/CosmicPageBackground.vue'
import ChatView from '@/components/dialogue/ChatView.vue'
import AiSidebar from '@/components/dialogue/AiSidebar.vue'
import DashboardView from '@/components/dialogue/DashboardView.vue'
import HistoryView from '@/components/dialogue/HistoryView.vue'
import RecommendView from '@/components/dialogue/RecommendView.vue'
import {
  activeMenu, isSidebarCollapsed, exportNotification,
} from '@/composables/dialogue/useAppState'
import '@/assets/styles/dialogue.css'
import { MessageSquare, GraduationCap, Compass, History } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { id: 'chat' as const, title: '对话', icon: MessageSquare },
  { id: 'recommend' as const, title: '课程', icon: GraduationCap },
  { id: 'portrait-report' as const, title: '画像报告', icon: Compass },
  { id: 'history' as const, title: '历史', icon: History },
]

function isNavActive(id: string) {
  return activeMenu.value === id
}

function handleNavClick(id: typeof activeMenu.value) {
  activeMenu.value = id
}

watch(() => route.query.tab, (tab) => {
  const tabName = Array.isArray(tab) ? tab[0] : tab
  if (tabName === 'portrait-report' || tabName === 'chat' || tabName === 'recommend' || tabName === 'history') {
    activeMenu.value = tabName
  }
}, { immediate: true })
</script>

<template>
  <div class="dialogue-root flex h-screen text-[var(--text-primary)] overflow-hidden font-sans selection:bg-blue-500/25 selection:text-white relative z-0">
    <CosmicPageBackground />

    <!-- Notification Banner -->
    <div v-if="exportNotification" class="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-card py-2.5 px-6 rounded-xl shadow-lg text-xs font-medium flex items-center gap-2 animate-fade-in">
      <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
      <span class="text-blue-200">{{ exportNotification }}</span>
    </div>

    <!-- Left Navigation Sidebar -->
    <aside class="dialogue-navbar flex flex-col items-center transition-all duration-300 relative select-none shrink-0"
      :class="[
        isSidebarCollapsed
          ? 'w-0 overflow-hidden opacity-0 p-0 pointer-events-none'
          : 'w-[76px] py-8 opacity-100'
      ]"
    >
      <nav class="flex-1 w-full space-y-4 px-2">
        <button
          v-for="item in navItems" :key="item.id"
          @click="handleNavClick(item.id)"
          class="relative w-full py-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-200 text-center border cursor-pointer group"
          :class="isNavActive(item.id)
            ? 'glass-card text-white font-bold shadow-lg'
            : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'"
        >
          <span v-if="isNavActive(item.id)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-7 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-full shadow-[0_0_10px_rgba(96,165,250,0.5)]"
          />
          <component :is="item.icon" class="w-5.5 h-5.5 transition-transform duration-200 group-hover:scale-105"
            :class="isNavActive(item.id) ? 'text-blue-300' : 'text-[var(--text-muted)] group-hover:text-blue-400/70'" />
          <span class="text-[11px] tracking-wider transition-all duration-200"
            :class="isNavActive(item.id) ? 'text-blue-200 font-semibold' : 'text-[var(--text-dim)] group-hover:text-[var(--text-secondary)]'"
          >{{ item.title }}</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 flex overflow-hidden relative"
      :class="activeMenu === 'recommend' ? 'flex-row-reverse' : 'flex-row'">
      <AiSidebar v-if="activeMenu === 'chat' || activeMenu === 'recommend'" :side="activeMenu === 'recommend' ? 'right' : 'left'" />
      <ChatView v-if="activeMenu === 'chat'" />
      <DashboardView v-if="activeMenu === 'portrait-report'" />
      <HistoryView v-if="activeMenu === 'history'" />
      <RecommendView v-if="activeMenu === 'recommend'" />
    </main>
  </div>
</template>

<style scoped>
.dialogue-navbar {
  border-right: 1px solid var(--border-subtle) !important;
  background: rgba(59, 130, 246, 0.06);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
</style>
