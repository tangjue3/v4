<template>
  <div
    class="base-card"
    :class="[`variant-${variant}`, { 'no-animation': noAnimation, hoverable }]"
    :style="cardStyle"
  >
    <div v-if="accentColor" class="card-accent-top" :style="{ background: accentColor, boxShadow: `0 0 10px ${accentColor}66` }"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  padding?: string
  maxWidth?: string
  noAnimation?: boolean
  hoverable?: boolean
  variant?: 'default' | 'strong' | 'light'
  accentColor?: string
  borderRadius?: string
}>(), {
  padding: '16px',
  maxWidth: undefined,
  noAnimation: false,
  hoverable: false,
  variant: 'default',
  accentColor: undefined,
  borderRadius: undefined,
})

const cardStyle = computed(() => ({
  padding: props.padding,
  ...(props.maxWidth ? { maxWidth: props.maxWidth } : {}),
  ...(props.borderRadius ? { borderRadius: props.borderRadius } : {}),
}))
</script>

<style scoped>
.base-card {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--glass-shadow);
  animation: cardFadeIn 0.3s var(--ease-out-expo);
  transition: border-color var(--duration-normal) ease, box-shadow var(--duration-normal) ease;
  position: relative;
  overflow: hidden;
}

.base-card.variant-default {
  background: var(--glass-bg);
}

.base-card.variant-strong {
  background: var(--glass-bg-strong);
  box-shadow: var(--glass-shadow-lg);
}

.base-card.variant-light {
  background: var(--glass-bg-light);
  box-shadow: var(--glass-shadow-sm);
}

.card-accent-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  opacity: 0.6;
}

.base-card.no-animation {
  animation: none;
}

.base-card.hoverable:hover {
  border-color: var(--glass-border-hover);
  box-shadow: var(--glass-shadow-lg);
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
