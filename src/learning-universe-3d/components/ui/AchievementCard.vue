<template>
  <div
    class="achievement-card"
    :class="[size, { unlocked, locked: !unlocked }]"
  >
    <div v-if="unlocked" class="glow-border"></div>
    <div class="ach-icon-wrap">
      <span v-if="unlocked" class="ach-icon">{{ achievement.icon }}</span>
      <span v-else class="ach-lock">🔒</span>
    </div>
    <div class="ach-title">{{ achievement.title }}</div>
    <div class="ach-desc">{{ unlocked ? achievement.description : achievement.condition }}</div>
    <div v-if="unlocked && unlockedAt" class="ach-date">
      {{ formatDate(unlockedAt) }}
    </div>
    <div v-else-if="!unlocked" class="ach-status-locked">未解锁</div>
  </div>
</template>

<script setup lang="ts">
import type { Achievement } from '../../types'

defineProps<{
  achievement: Achievement
  unlocked: boolean
  unlockedAt?: number | null
  size?: 'small' | 'large'
}>()

function formatDate(ts: number | null | undefined): string {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}
</script>

<style scoped>
.achievement-card {
  background: rgba(8, 8, 32, 0.96);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.achievement-card.small {
  padding: 10px 8px;
}

.achievement-card.large {
  padding: 16px 12px;
}

.achievement-card.unlocked {
  border-color: rgba(255, 183, 77, 0.25);
  background: rgba(255, 183, 77, 0.05);
}

.achievement-card.unlocked:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 183, 77, 0.4);
}

.achievement-card.locked {
  opacity: 0.5;
  filter: grayscale(0.6);
}

.glow-border {
  position: absolute;
  inset: -1px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(255, 183, 77, 0.3), rgba(255, 152, 0, 0.15), rgba(255, 183, 77, 0.1));
  z-index: -1;
  opacity: 0.6;
}

.ach-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  margin-bottom: 2px;
}

.small .ach-icon-wrap {
  width: 36px;
  height: 36px;
}

.large .ach-icon-wrap {
  width: 48px;
  height: 48px;
}

.unlocked .ach-icon-wrap {
  background: rgba(255, 183, 77, 0.12);
}

.ach-icon {
  font-size: 24px;
}

.small .ach-icon {
  font-size: 18px;
}

.ach-lock {
  font-size: 20px;
}

.small .ach-lock {
  font-size: 16px;
}

.ach-title {
  font-size: 13px;
  font-weight: 600;
  color: #dde;
}

.small .ach-title {
  font-size: 11px;
}

.locked .ach-title {
  color: #778;
}

.ach-desc {
  font-size: 11px;
  color: #99a;
  line-height: 1.4;
}

.small .ach-desc {
  font-size: 10px;
}

.unlocked .ach-desc {
  color: #bbc;
}

.ach-date {
  font-size: 10px;
  color: #FFB74D;
  margin-top: 2px;
}

.small .ach-date {
  font-size: 9px;
}

.ach-status-locked {
  font-size: 10px;
  color: #556;
  margin-top: 2px;
}

.small .ach-status-locked {
  font-size: 9px;
}
</style>
