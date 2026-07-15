<script setup lang="ts">
import { ref } from 'vue'
import { Bot, ChevronRight } from 'lucide-vue-next'

defineProps<{
  currentQuestion?: string
  currentAnswer?: string
  scenario?: string
  subMode?: string
}>()

const isOpen = ref(true)
</script>

<template>
  <div :class="['dh-panel-wrapper', { open: isOpen }]">
    <!-- Toggle Button -->
    <button class="dh-toggle" @click="isOpen = !isOpen" title="AI 数字人">
      <Bot :size="18" stroke-width="1.5" />
    </button>

    <div class="dh-panel">
      <div class="dh-header">
        <Bot :size="18" stroke-width="1.5" />
        <span>AI 数字人</span>
        <button class="dh-close" @click="isOpen = false">
          <ChevronRight :size="14" stroke-width="2" />
        </button>
      </div>

      <div id="digital-human-slot" class="dh-slot">
        <div class="dh-placeholder">
          <div class="dhp-icon">
            <Bot :size="36" stroke-width="1" />
          </div>
          <span class="dhp-text">AI 数字人</span>
          <span class="dhp-hint">实时讲解同步中</span>
        </div>
      </div>

      <div class="dh-footer">
        <div class="dhf-label">当前讲解</div>
        <p class="dhf-text">
          {{ currentQuestion ? currentQuestion.slice(0, 50) + '...' : '等待提问中...' }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dh-panel-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 0;
  flex-shrink: 0;
}

.dh-toggle {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  flex-shrink: 0;
  z-index: 2;
}

.dh-toggle:hover,
.dh-panel-wrapper.open .dh-toggle {
  border-color: var(--color-accent-cyan);
  color: var(--color-accent-cyan);
}

.dh-panel {
  width: 0;
  overflow: hidden;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-left: none;
  border-radius: 0 14px 14px 0;
  display: flex;
  flex-direction: column;
  transition: width 0.3s var(--ease-out);
  min-height: 300px;
}

.dh-panel-wrapper.open .dh-panel {
  width: 260px;
  border-left: none;
}

.dh-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.dh-close {
  margin-left: auto;
  color: var(--color-text-tertiary);
  transition: transform 0.2s;
  display: flex;
}

.dh-close:hover { color: var(--color-text-primary); }

/* ── DH Slot (reserved) ── */
.dh-slot {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  min-height: 200px;
  white-space: nowrap;
}

.dh-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.dhp-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 212, 255, 0.06);
  border: 1px dashed rgba(0, 212, 255, 0.2);
  color: rgba(0, 212, 255, 0.3);
  animation: dh-pulse 3s ease-in-out infinite;
}

@keyframes dh-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

.dhp-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-tertiary);
}

.dhp-hint {
  font-size: 10px;
  color: var(--color-text-tertiary);
  opacity: 0.5;
}

.dh-footer {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  white-space: nowrap;
}

.dhf-label {
  font-size: 10px;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.dhf-text {
  font-size: 12px;
  color: var(--color-text-secondary);
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
