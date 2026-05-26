<template>
  <Transition name="burst">
    <div v-if="currentAchievement" class="burst-overlay" @click="dismiss">
      <div class="burst-ring" :style="{ '--color': currentAchievement.icon === '🏆' ? '#FFB74D' : '#4FC3F7' }"></div>
      <div class="burst-icon">{{ currentAchievement.icon }}</div>
      <h3 class="burst-title">{{ currentAchievement.title }}</h3>
      <p class="burst-desc">{{ currentAchievement.description }}</p>
      <div class="burst-particles">
        <span v-for="i in 12" :key="i" class="particle" :style="particleStyle(i)"></span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUniverseStore } from '../../stores/universeStore'
import type { Achievement } from '../../types'

const store = useUniverseStore()
const queue = ref<Achievement[]>([])
const currentAchievement = ref<Achievement | null>(null)
let dismissTimer: ReturnType<typeof setTimeout> | null = null

watch(() => store.unlockedAchievements.length, (newLen, oldLen) => {
  if (newLen > oldLen) {
    for (let i = oldLen; i < newLen; i++) {
      const ach = store.unlockedAchievements[i]
      if (ach && !queue.value.find((a) => a.id === ach.id)) {
        queue.value.push(ach)
      }
    }
    if (!currentAchievement.value) showNext()
  }
})

function showNext() {
  if (!queue.value.length) { currentAchievement.value = null; return }
  currentAchievement.value = queue.value.shift()!
  if (dismissTimer) clearTimeout(dismissTimer)
  dismissTimer = setTimeout(dismiss, 3500)
}

function dismiss() {
  currentAchievement.value = null
  if (dismissTimer) { clearTimeout(dismissTimer); dismissTimer = null }
  setTimeout(showNext, 300)
}

function particleStyle(i: number) {
  const angle = (i / 12) * 360
  const distance = 80 + Math.random() * 60
  const dx = Math.cos((angle * Math.PI) / 180) * distance
  const dy = Math.sin((angle * Math.PI) / 180) * distance
  return {
    '--dx': `${dx}px`,
    '--dy': `${dy}px`,
    animationDelay: `${i * 40}ms`,
  }
}
</script>

<style scoped>
.burst-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.4);
}

.burst-ring {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 2px solid var(--color, #4FC3F7);
  animation: ringExpand 1s var(--ease-out-expo) forwards;
  opacity: 0;
}

@keyframes ringExpand {
  0% { transform: scale(0.2); opacity: 0.8; }
  100% { transform: scale(2); opacity: 0; }
}

.burst-icon {
  font-size: 56px;
  animation: iconPop 0.5s var(--ease-out-expo) forwards;
  position: relative;
  z-index: 1;
}

@keyframes iconPop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.burst-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin: 16px 0 6px;
  animation: fadeUp 0.4s 0.2s var(--ease-out-expo) forwards;
  opacity: 0;
  z-index: 1;
}

.burst-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  animation: fadeUp 0.4s 0.3s var(--ease-out-expo) forwards;
  opacity: 0;
  z-index: 1;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.burst-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color, #4FC3F7);
  animation: particleFly 0.8s var(--ease-out-expo) forwards;
  opacity: 0;
}

@keyframes particleFly {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}

.burst-enter-active { transition: opacity 0.3s ease; }
.burst-leave-active { transition: opacity 0.2s ease; }
.burst-enter-from, .burst-leave-to { opacity: 0; }
</style>
