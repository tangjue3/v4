<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  PlaySquare,
  Folder,
  CheckSquare,
  Network,
  History,
  Star,
  FileText
} from 'lucide-vue-next'
import { useTheme } from '../../composables/useEduMindTheme'

const { isDark, toggleTheme } = useTheme()

const props = defineProps<{
  weeklyHours: number
  goalHours: number
  currentTab: string
  isOpen: boolean
}>()

const emit = defineEmits<{
  tabChange: [tabName: string]
  close: []
}>()

const percentage = computed(() =>
  Math.min(Math.round((props.weeklyHours / props.goalHours) * 100), 100)
)

const progressWidth = ref(0)

watch(
  percentage,
  (val) => {
    requestAnimationFrame(() => {
      progressWidth.value = val
    })
  },
  { immediate: true }
)

const menuItems = [
  { name: '课程', icon: PlaySquare },
  { name: '资源中心', icon: Folder },
  { name: '练习中心', icon: CheckSquare },
  { name: '思维导图', icon: Network },
  { name: '学习记录', icon: History },
  { name: '收藏夹', icon: Star },
  { name: '笔记', icon: FileText }
]

function handleNavClick(itemName: string) {
  emit('tabChange', itemName)
  emit('close')
}
</script>

<template>
  <!-- Mobile Backdrop Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-slate-900/40 z-35 lg:hidden"
    @click="emit('close')"
    id="sidebar-mobile-backdrop"
  />

  <aside
    :class="[
      'edu-sidebar w-[280px] flex flex-col fixed h-screen overflow-y-auto z-40 transition-transform duration-300 ease-in-out lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full'
    ]"
    id="app-sidebar"
  >
    <!-- Mobile close button -->
    <div class="p-3 flex justify-end lg:hidden border-b border-[#e8e8e8] dark:border-slate-700">
      <button
        type="button"
        @click="emit('close')"
        class="w-7 h-7 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-300 cursor-pointer border-none text-[16px]"
        title="关闭菜单"
      >
        ✕
      </button>
    </div>

    <!-- Navigation -->
    <nav class="p-5 flex-1 space-y-3">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        :id="`nav-item-${index}`"
        @click="handleNavClick(item.name)"
        :class="[
          'edu-sidebar__item flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 text-[15px]',
          item.name === currentTab
            ? 'is-active text-white font-bold'
            : 'text-[#a5b4d8] hover:text-white'
        ]"
      >
        <component
          :is="item.icon"
          :size="16"
          :class="[
            'shrink-0',
            item.name === currentTab ? 'text-blue-400' : 'text-[#6b7fa8]'
          ]"
        />
        <span>{{ item.name }}</span>
        <span
          v-if="item.name === currentTab"
          class="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_12px_rgba(96,165,250,0.8)]"
        />
      </div>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-5 pt-3">
      <div class="flex items-center gap-2.5 p-3 edu-sidebar__profile rounded-lg">
        <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden shrink-0 border border-slate-300 dark:border-slate-500">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=xiaoming"
            alt="avatar"
            class="w-full h-full object-cover"
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="leading-tight">
          <h4 class="text-[15px] font-medium text-slate-800 dark:text-[#e0e7ff]">小明同学</h4>
          <div class="flex items-center gap-1 text-[13px] text-slate-400 dark:text-[#a5b4d8] mt-0.5">
            <span>Lv.12</span>
            <span class="bg-[#fff2e8] text-[#fa8c16] px-1 rounded-sm text-[12px] font-semibold">V</span>
          </div>
        </div>
      </div>

      <!-- Weekly Progress Tracker -->
      <div class="mt-3 p-3 edu-sidebar__profile rounded-lg">
        <h5 class="text-[13px] text-slate-400 font-medium mb-1.5">学习进度</h5>
        <div class="flex justify-between text-[14px] mb-1.5">
          <span class="text-slate-500 dark:text-slate-400">本周学习</span>
          <span class="text-accent dark:text-[#00d4ff] font-semibold">{{ weeklyHours }} 小时</span>
        </div>

        <div class="h-1.5 bg-[#e8e8e8] dark:bg-[rgba(0,212,255,0.08)] rounded-full overflow-hidden mb-1.5">
          <div
            class="h-full bg-gradient-to-r from-[#00d4ff] to-[#00d4ff] rounded-full transition-[width] duration-500 ease-out"
            :style="{ width: `${progressWidth}%` }"
          />
        </div>

        <div class="text-[12px] text-slate-400 dark:text-[#6b7fa8] flex justify-between">
          <span>目标 {{ goalHours }} 小时</span>
          <span>{{ percentage }}%</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.edu-sidebar {
  background: rgba(5, 10, 25, 0.35);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
  border-right: 1px solid rgba(59, 130, 246, 0.1);
}

.edu-sidebar__item {
  position: relative;
  background: transparent;
}

.edu-sidebar__item:hover {
  background: rgba(59, 130, 246, 0.08);
}

.edu-sidebar__item.is-active {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.08));
  box-shadow: inset 0 0 0 1px rgba(59, 130, 246, 0.2);
}

.edu-sidebar__profile {
  background: rgba(5, 10, 25, 0.3);
  border: 1px solid rgba(59, 130, 246, 0.08);
}
</style>
