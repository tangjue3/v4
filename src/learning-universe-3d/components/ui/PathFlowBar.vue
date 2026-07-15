<template>
  <Transition name="flow-up">
    <div v-if="visible" class="path-flow-bar">
      <div class="flow-glow"></div>
      <div class="flow-header">
        <span class="flow-path-name">{{ path?.name }}</span>
        <span class="flow-count">{{ completedCount }}/{{ courseIds.length }}</span>
      </div>
      <div class="flow-track">
        <template v-for="(id, idx) in courseIds" :key="id">
          <div
            class="flow-step"
            :class="getStepClass(id)"
            :style="{ animationDelay: `${idx * 0.06}s` }"
            @click="$emit('selectCourse', id)"
          >
            <div class="step-dot">
              <div v-if="isCompleted(id)" class="step-check">✓</div>
            </div>
            <span class="step-name">{{ getCourseName(id) }}</span>
          </div>
          <div
            v-if="idx < courseIds.length - 1"
            class="flow-arrow"
            :class="getArrowClass(id, courseIds[idx + 1])"
            :style="{ animationDelay: `${idx * 0.06 + 0.03}s` }"
          ></div>
        </template>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUniverseStore } from '../../stores/universeStore'
import { courses } from '../../data/courses'
import { learningPaths } from '../../data/learningPaths'
import type { LearningPath } from '../../types'

defineEmits<{ selectCourse: [courseId: number] }>()

const props = withDefaults(defineProps<{
  visible: boolean
  pathId: string | null
}>(), {
  visible: false,
  pathId: null,
})

const store = useUniverseStore()

const path = computed<LearningPath | undefined>(() => {
  if (!props.pathId) return
  return learningPaths.find((p) => p.id === props.pathId)
})

const courseIds = computed<number[]>(() => path.value?.courseSequence || [])

const completedCount = computed(() => {
  return courseIds.value.filter((id) => store.getPlanetState(id) === 'completed').length
})

function getCourseName(id: number) {
  return courses.find((c) => c.id === id)?.name || ''
}

function isCompleted(id: number) {
  return store.getPlanetState(id) === 'completed'
}

function isLocked(id: number) {
  return store.getPlanetState(id) === 'locked'
}

function getStepClass(id: number) {
  if (isCompleted(id)) return 'step-completed'
  if (isLocked(id)) return 'step-locked'
  return 'step-available'
}

function getArrowClass(fromId: number, toId: number) {
  if (isCompleted(fromId) && isCompleted(toId)) return 'arrow-completed'
  if (!isLocked(fromId)) return 'arrow-active'
  return ''
}
</script>

<style scoped>
.path-flow-bar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 35;
  background: rgba(10, 14, 39, 0.88);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 14px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 40px rgba(79, 195, 247, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 80vw;
  pointer-events: auto;
}

.flow-glow {
  position: absolute;
  top: -1px;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(79, 195, 247, 0.2) 30%,
    rgba(255, 215, 0, 0.2) 70%,
    transparent 100%
  );
}

.flow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flow-path-name {
  font-size: 12px;
  font-weight: 600;
  color: var(--accent-blue, #4FC3F7);
  letter-spacing: 0.5px;
}

.flow-count {
  font-size: 11px;
  color: var(--text-muted, #4a5568);
  font-weight: 500;
}

.flow-track {
  display: flex;
  align-items: center;
  overflow-x: auto;
  gap: 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.06) transparent;
  padding-bottom: 2px;
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  transition: background 0.2s ease;
  flex-shrink: 0;
  opacity: 0;
  animation: stepIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.flow-step:hover {
  background: rgba(255, 255, 255, 0.04);
}

.step-dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.step-completed .step-dot {
  background: rgba(34, 197, 94, 0.2);
  border: 1.5px solid #22c55e;
  color: #22c55e;
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.2);
}

.step-available .step-dot {
  background: rgba(79, 195, 247, 0.15);
  border: 1.5px solid rgba(79, 195, 247, 0.5);
}

.step-locked .step-dot {
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
}

.step-locked .step-name {
  color: var(--text-muted, #4a5568);
}

.step-check {
  line-height: 1;
}

.step-name {
  font-size: 11px;
  font-weight: 500;
  color: var(--text-secondary, #8892a8);
  white-space: nowrap;
  transition: color 0.3s ease;
}

.step-completed .step-name {
  color: #22c55e;
}

.step-available:hover .step-name {
  color: var(--text-primary, #f0f2f5);
}

.flow-arrow {
  width: 20px;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  margin: 0 2px;
  flex-shrink: 0;
  border-radius: 1px;
  position: relative;
  transition: background 0.3s ease;
  opacity: 0;
  animation: stepIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.flow-arrow::after {
  content: '';
  position: absolute;
  right: 0;
  top: -3px;
  width: 0;
  height: 0;
  border-left: 5px solid rgba(255, 255, 255, 0.08);
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
  transition: border-left-color 0.3s ease;
}

.flow-arrow.arrow-completed {
  background: #22c55e;
}
.flow-arrow.arrow-completed::after {
  border-left-color: #22c55e;
}

.flow-arrow.arrow-active {
  background: rgba(79, 195, 247, 0.3);
}
.flow-arrow.arrow-active::after {
  border-left-color: rgba(79, 195, 247, 0.3);
}

@keyframes stepIn {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.92);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ─── Entry/exit animations ─── */
.flow-up-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.flow-up-leave-active {
  transition: all 0.25s ease;
}
.flow-up-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(24px) scale(0.96);
}
.flow-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px) scale(0.97);
}
</style>
