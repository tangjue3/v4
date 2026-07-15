<template>
  <Transition name="hud">
    <header class="orbit-hud">
      <div class="hud-left">
        <button class="hud-logo" @click="$emit('openDashboard')">
          <Orbit :size="16" class="logo-icon" />
        </button>
        <div class="progress-section" @click="$emit('openDashboard')">
          <div class="energy-bar hud-energy">
            <div
              class="energy-bar-fill"
              :style="{ width: store.progressPercent + '%' }"
            ></div>
          </div>
          <span class="progress-label font-display">{{ store.progressPercent }}%</span>
        </div>
      </div>

      <div class="hud-center">
        <Transition name="fade" mode="out-in">
          <span v-if="selectedCourseName" class="selected-name" :key="selectedCourseName">
            {{ selectedCourseName }}
          </span>
          <span v-else class="selected-name placeholder" :key="'placeholder'">
            <span class="prompt-dot"></span>
            选择一颗星球探索
          </span>
        </Transition>
      </div>

      <div class="hud-right">
        <div
          class="streak-badge glass-panel-light"
          :class="{ hot: streak.currentStreak >= 7, blaze: streak.currentStreak >= 30 }"
        >
          <Flame :size="13" class="streak-icon" />
          <span class="font-display">{{ streak.currentStreak }}</span>
        </div>

        <div
          class="today-dot"
          :class="{ done: studiedToday }"
          :title="studiedToday ? '今日已学习' : '今日未学习'"
        >
          <Check v-if="studiedToday" :size="9" />
        </div>

        <button class="hud-btn glass-button" @click="$emit('openDashboard')">
          <Settings :size="14" />
        </button>
      </div>

      <div class="hud-glow"></div>

      <Transition name="tips">
        <div v-if="showTips" class="hud-tips glass-panel-light">
          <span class="tip">拖拽旋转</span>
          <span class="tip-sep">·</span>
          <span class="tip">滚轮缩放</span>
          <span class="tip-sep">·</span>
          <span class="tip">点击星球查看详情</span>
          <button class="tip-dismiss glass-button" @click="dismissTips">知道了</button>
        </div>
      </Transition>
    </header>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Orbit, Flame, Check, Settings } from '@lucide/vue'
import { useUniverseStore } from '../../stores/universeStore'
import { courses } from '../../data/courses'

defineEmits<{
  openDashboard: []
}>()

const store = useUniverseStore()
const showTips = ref(false)

const streak = computed(() => store.learningStreak)

const studiedToday = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return streak.value.lastStudyDate === today
})

const selectedCourseName = computed(() => {
  if (!store.selectedCourseId) return null
  return courses.find((c) => c.id === store.selectedCourseId)?.name || null
})

onMounted(() => {
  const dismissed = localStorage.getItem('hud-tips-dismissed')
  if (!dismissed) {
    showTips.value = true
  }
})

function dismissTips() {
  showTips.value = false
  localStorage.setItem('hud-tips-dismissed', '1')
}
</script>

<style scoped>
.orbit-hud {
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  height: var(--hud-height);
  z-index: 40;
  display: flex;
  align-items: center;
  padding: 0 16px;
  background: var(--hud-bg);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
}

.hud-glow {
  position: absolute;
  bottom: 0;
  left: 5%;
  right: 5%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(79, 195, 247, 0.15) 30%,
    rgba(186, 104, 200, 0.15) 70%,
    transparent 100%
  );
}

.hud-left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 180px;
}

.hud-logo {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(79, 195, 247, 0.08);
  border: 1px solid rgba(79, 195, 247, 0.15);
  color: var(--accent-blue);
  cursor: pointer;
  transition: all 0.25s var(--ease-out-expo);
  position: relative;
}

.hud-logo:hover {
  background: rgba(79, 195, 247, 0.15);
  border-color: rgba(79, 195, 247, 0.3);
  box-shadow: 0 0 20px rgba(79, 195, 247, 0.15);
}

.logo-icon {
  filter: drop-shadow(0 0 6px rgba(79, 195, 247, 0.4));
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px 4px 8px;
  border-radius: 6px;
  transition: background 0.2s ease;
}

.progress-section:hover {
  background: rgba(255, 255, 255, 0.03);
}

.hud-energy {
  width: 80px;
}

.energy-bar-fill {
  background: linear-gradient(90deg, #4FC3F7, #BA68C8);
  box-shadow: 0 0 12px rgba(79, 195, 247, 0.3);
}

.progress-label {
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.5);
  min-width: 32px;
}

.hud-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.selected-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.selected-name.placeholder {
  color: var(--text-muted);
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.6;
}

.prompt-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-blue);
  animation: breathe 2s ease-in-out infinite;
}

.hud-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;
  justify-content: flex-end;
}

.streak-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 12px 2px 8px;
  border-radius: var(--radius-full);
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-amber);
  border-color: rgba(255, 183, 77, 0.12);
  transition: all var(--duration-normal) var(--ease-out-expo);
}

.streak-badge.hot {
  border-color: rgba(255, 120, 50, 0.2);
  box-shadow: 0 0 16px rgba(255, 100, 30, 0.12);
}

.streak-badge.blaze {
  border-color: rgba(255, 60, 30, 0.25);
  box-shadow: 0 0 24px rgba(255, 50, 20, 0.18);
}

.streak-icon {
  filter: drop-shadow(0 0 4px rgba(255, 183, 77, 0.4));
}

.today-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-muted);
  cursor: default;
  transition: all var(--duration-normal) ease;
}

.today-dot.done {
  background: rgba(34, 197, 94, 0.1);
  border-color: rgba(34, 197, 94, 0.25);
  color: var(--status-completed);
  box-shadow: 0 0 10px rgba(34, 197, 94, 0.1);
}

.hud-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-muted);
  transition: all var(--duration-fast) ease;
}

.hud-btn:hover {
  color: var(--text-secondary);
  border-color: rgba(255, 255, 255, 0.12);
}

.hud-tips {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  font-size: 12px;
  color: var(--text-muted);
  z-index: 50;
}

.tip-dismiss {
  padding: 2px 10px;
  font-size: 11px;
  color: var(--accent-blue);
  border-color: rgba(79, 195, 247, 0.2);
  border-radius: var(--radius-full);
  transition: all var(--duration-fast) ease;
}

.tip-dismiss:hover {
  border-color: rgba(79, 195, 247, 0.35);
}

.hud-enter-active { transition: all 0.5s var(--ease-out-expo); }
.hud-leave-active { transition: all 0.2s ease; }
.hud-enter-from, .hud-leave-to { opacity: 0; transform: translateY(-12px); }

.fade-enter-active, .fade-leave-active { transition: all 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.tips-enter-active { transition: all 0.3s var(--ease-out-expo); }
.tips-leave-active { transition: all 0.2s ease; }
.tips-enter-from, .tips-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>
