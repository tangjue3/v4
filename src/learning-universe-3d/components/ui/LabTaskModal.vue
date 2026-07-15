<template>
  <GlassModal
    :visible="visible"
    :title="`实验: ${labTask?.title ?? ''}`"
    :subtitle="stepSubtitle"
    accent-color="#81C784"
    :width="680"
    @close="$emit('close')"
  >
    <div class="lab-body">
      <div class="step-dots">
        <button
          v-for="(_, idx) in labTask?.steps"
          :key="idx"
          class="step-dot"
          :class="{ active: idx === currentStep, done: idx < currentStep }"
          @click="currentStep = idx"
        >
          {{ idx + 1 }}
        </button>
      </div>

      <div v-if="step" class="step-content">
        <h3 class="step-title">{{ step.title }}</h3>
        <p class="step-desc">{{ step.description }}</p>

        <div class="hint-toggle" @click="showHints = !showHints">
          <Lightbulb :size="14" />
          <span>提示</span>
          <ChevronDown :size="12" class="chevron" :class="{ open: showHints }" />
        </div>
        <Transition name="expand">
          <div v-if="showHints" class="hint-list">
            <p v-for="(hint, i) in step.hints" :key="i" class="hint-item">{{ hint }}</p>
          </div>
        </Transition>

        <div v-if="step.codeTemplate" class="code-section">
          <textarea v-model="code" class="code-input" spellcheck="false"></textarea>
        </div>

        <div class="checkpoint">
          <ShieldCheck :size="14" />
          <span>{{ step.checkpoint }}</span>
        </div>

        <div v-if="stepChecked" class="check-result" :class="stepPassed ? 'pass' : 'fail'">
          {{ stepPassed ? '✓ 检查通过' : '✗ 尚未通过，请检查代码' }}
        </div>
      </div>
    </div>

    <template #footer>
      <button class="nav-btn" :disabled="currentStep === 0" @click="currentStep--">上一步</button>
      <button class="nav-btn check" @click="checkStep">检查</button>
      <button class="nav-btn" :disabled="currentStep >= (labTask?.steps?.length ?? 1) - 1" @click="currentStep++">下一步</button>
      <button class="nav-btn complete" @click="completeLab">完成实验</button>
    </template>
  </GlassModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Lightbulb, ChevronDown, ShieldCheck } from '@lucide/vue'
import GlassModal from './GlassModal.vue'
import { useUniverseStore } from '../../stores/universeStore'
import { labTasks } from '../../data/labTasks'

const props = defineProps<{
  visible: boolean
  labTaskId: string
}>()

const emit = defineEmits<{ close: [] }>()

const store = useUniverseStore()
const labTask = computed(() => labTasks.find((l) => l.id === props.labTaskId))
const currentStep = ref(0)
const showHints = ref(false)
const code = ref('')
const stepChecked = ref(false)
const stepPassed = ref(false)

const step = computed(() => labTask.value?.steps[currentStep.value])
const stepSubtitle = computed(() => `步骤 ${currentStep.value + 1} / ${labTask.value?.steps?.length ?? 0}`)

watch(() => props.visible, (v) => {
  if (v) {
    currentStep.value = 0
    showHints.value = false
    stepChecked.value = false
    stepPassed.value = false
    code.value = step.value?.codeTemplate || ''
  }
})

watch(currentStep, () => {
  showHints.value = false
  stepChecked.value = false
  stepPassed.value = false
  code.value = step.value?.codeTemplate || ''
})

function checkStep() {
  stepChecked.value = true
  stepPassed.value = code.value.trim().length > 0
}

function completeLab() {
  if (props.labTaskId) {
    store.updateLabProgress(props.labTaskId, { completed: true })
  }
  emit('close')
}
</script>

<style scoped>
.lab-body { min-height: 280px; }

.step-dots {
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
}

.step-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) ease;
  font-family: inherit;
}

.step-dot.active {
  border-color: var(--accent-green);
  background: rgba(129, 199, 132, 0.12);
  color: var(--accent-green);
}

.step-dot.done {
  border-color: rgba(34, 197, 94, 0.3);
  background: rgba(34, 197, 94, 0.08);
  color: var(--status-completed);
}

.step-content { display: flex; flex-direction: column; gap: 14px; }

.step-title { font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0; }

.step-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0; }

.hint-toggle {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 12px;
  color: var(--accent-amber);
  background: rgba(255, 183, 77, 0.06);
  border: 1px solid rgba(255, 183, 77, 0.12);
  border-radius: var(--radius-full);
  cursor: pointer;
  width: fit-content;
  transition: background var(--duration-fast) ease;
}

.hint-toggle:hover { background: rgba(255, 183, 77, 0.12); }

.chevron { transition: transform var(--duration-fast) ease; }
.chevron.open { transform: rotate(180deg); }

.hint-list {
  padding: 10px 14px;
  background: rgba(255, 183, 77, 0.04);
  border: 1px solid rgba(255, 183, 77, 0.08);
  border-radius: var(--radius-md);
}

.hint-item { font-size: 13px; color: var(--text-secondary); line-height: 1.6; margin: 4px 0; }

.code-section { margin-top: 4px; }

.code-input {
  width: 100%;
  min-height: 140px;
  padding: 14px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #c9d1d9;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  resize: vertical;
  outline: none;
}

.checkpoint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--accent-green);
  padding: 8px 12px;
  background: rgba(129, 199, 132, 0.06);
  border-radius: var(--radius-sm);
}

.check-result {
  padding: 8px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
}

.check-result.pass { background: rgba(34, 197, 94, 0.1); color: var(--status-completed); }
.check-result.fail { background: rgba(229, 115, 115, 0.1); color: var(--accent-red); }

.nav-btn {
  padding: 8px 18px;
  font-size: 13px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) ease;
}

.nav-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.08); color: var(--text-primary); }
.nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.nav-btn.check {
  color: var(--accent-green);
  background: rgba(129, 199, 132, 0.08);
  border-color: rgba(129, 199, 132, 0.2);
}

.nav-btn.check:hover { background: rgba(129, 199, 132, 0.15); }

.nav-btn.complete {
  color: var(--accent-blue);
  background: rgba(79, 195, 247, 0.08);
  border-color: rgba(79, 195, 247, 0.2);
  margin-left: auto;
}

.nav-btn.complete:hover { background: rgba(79, 195, 247, 0.15); }

.expand-enter-active { transition: all 0.25s var(--ease-out-expo); }
.expand-leave-active { transition: all 0.15s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
