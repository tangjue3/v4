<template>
  <Transition name="glass-modal">
    <div v-if="visible" class="glass-modal-overlay" @click.self="onOverlayClick">
      <div class="glass-modal" :style="modalStyle">
        <div class="glass-modal-accent" :style="{ background: accentGradient }"></div>

        <button class="glass-modal-close" @click="$emit('close')">
          <X :size="16" />
        </button>

        <div class="glass-modal-header">
          <h2 class="glass-modal-title">{{ title }}</h2>
          <p v-if="subtitle" class="glass-modal-subtitle">{{ subtitle }}</p>
        </div>

        <div class="glass-modal-body">
          <slot />
        </div>

        <div v-if="$slots.footer" class="glass-modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from '@lucide/vue'

const props = withDefaults(defineProps<{
  visible: boolean
  title: string
  subtitle?: string
  accentColor?: string
  width?: number
  maxHeight?: number
  closeOnOverlay?: boolean
}>(), {
  accentColor: '#4FC3F7',
  width: 640,
  maxHeight: 85,
  closeOnOverlay: true,
})

const emit = defineEmits<{ close: [] }>()

const modalStyle = computed(() => ({
  width: `${props.width}px`,
  maxHeight: `${props.maxHeight}vh`,
}))

const accentGradient = computed(() =>
  `linear-gradient(90deg, ${props.accentColor}, transparent)`
)

function onOverlayClick() {
  if (props.closeOnOverlay) emit('close')
}
</script>

<style scoped>
.glass-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-modal {
  position: relative;
  background: rgba(8, 8, 32, 0.96);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.6),
    0 0 1px rgba(255, 255, 255, 0.1);
}

.glass-modal-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0.8;
}

.glass-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  color: #778;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  z-index: 1;
}

.glass-modal-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #bbc;
  border-color: rgba(255, 255, 255, 0.15);
}

.glass-modal-header {
  padding: 22px 28px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.glass-modal-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.glass-modal-subtitle {
  font-size: 13px;
  color: var(--text-muted);
  margin: 6px 0 0;
  line-height: 1.5;
}

.glass-modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 28px;
}

.glass-modal-footer {
  padding: 14px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-shrink: 0;
}

.glass-modal-enter-active {
  transition: all 0.35s var(--ease-out-expo);
}
.glass-modal-leave-active {
  transition: all 0.2s ease;
}
.glass-modal-enter-from {
  opacity: 0;
}
.glass-modal-enter-from .glass-modal {
  transform: scale(0.94) translateY(12px);
}
.glass-modal-leave-to {
  opacity: 0;
}
</style>
