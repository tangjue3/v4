<script setup lang="ts">
import ThreeParticleBackground from '@/components/homepage/ThreeParticleBackground.vue'
import { useAppStore } from '@/store'

withDefaults(defineProps<{
  variant?: 'cosmic' | 'genre'
}>(), {
  variant: 'cosmic',
})

const appStore = useAppStore()
</script>

<template>
  <div class="cosmos-bg" :class="`variant-${variant}`" aria-hidden="true">
    <ThreeParticleBackground v-if="appStore.particleBgEnabled" :variant="variant" />
    <div class="cosmos-vignette" />
  </div>
</template>

<style scoped>
.cosmos-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.cosmos-vignette {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(10, 15, 30, 0.12) 0%, transparent 34%, rgba(10, 15, 30, 0.03) 100%),
    radial-gradient(ellipse at center, transparent 55%, rgba(10, 18, 35, 0.12) 100%);
}

.variant-genre .cosmos-vignette {
  background:
    linear-gradient(180deg, rgba(10, 18, 35, 0.1) 0%, transparent 24%, rgba(200, 220, 245, 0.05) 100%),
    radial-gradient(ellipse 1100px 620px at 58% 44%, transparent 0 42%, rgba(10, 25, 50, 0.1) 84%),
    linear-gradient(90deg, rgba(10, 18, 35, 0.1), transparent 30%, transparent 70%, rgba(170, 200, 235, 0.05));
}
</style>
