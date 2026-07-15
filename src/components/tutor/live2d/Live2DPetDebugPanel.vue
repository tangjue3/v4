<script setup lang="ts">
import type { CompanionPetState } from './live2dPetMotionMap'
import type { Live2DPetPresetId } from './live2dPetPresets'

import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

type Live2DPetDebugApi = NonNullable<(Window & { __live2dPetDebug?: any })['__live2dPetDebug']>

type RendererStatus = {
  ready: boolean
  live2dFailed: boolean
  canvasCount: number
}

const PRESET_IDS: Live2DPetPresetId[] = ['airi_default', 'airi_compact', 'airi_focus']
const STATE_IDS: CompanionPetState[] = ['idle', 'thinking', 'typing', 'cheer', 'error', 'sleep', 'speaking', 'listening']

const collapsed = ref(true)
const presetId = ref<Live2DPetPresetId>('airi_default')
const currentState = ref<CompanionPetState>('idle')
const capability = ref<ReturnType<Live2DPetDebugApi['getMotionCapability']> | null>(null)
const hitState = ref<ReturnType<Live2DPetDebugApi['getMotionHitState']> | null>(null)
const rendererStatus = ref<RendererStatus>({
  ready: false,
  live2dFailed: false,
  canvasCount: 0,
})
const motionGroupInput = ref('TapBody')
const motionIndexInput = ref('0')
const isTestingMotion = ref(false)
const testResult = ref<string | null>(null)

let refreshTimer: number | null = null

const capabilityGroups = computed(() => capability.value?.groupNames.map((groupName: string) => ({
  groupName,
  count: capability.value?.groups[groupName] ?? 0,
})) ?? [])

function getDebugApi() {
  return (window as any).__live2dPetDebug
}

function readRendererStatus(): RendererStatus {
  const debug = getDebugApi()
  if (debug?.getRendererStatus) {
    return debug.getRendererStatus()
  }

  return {
    ready: Boolean(document.querySelector('.airi-live2d-renderer.ready')),
    live2dFailed: false,
    canvasCount: document.querySelectorAll('.airi-live2d-canvas canvas').length,
  }
}

function refreshSnapshot() {
  const debug = getDebugApi()
  if (!debug) {
    capability.value = null
    hitState.value = null
    rendererStatus.value = {
      ready: false,
      live2dFailed: false,
      canvasCount: 0,
    }
    return
  }

  presetId.value = debug.getPresetId() as Live2DPetPresetId
  currentState.value = debug.getState() as CompanionPetState
  capability.value = debug.getMotionCapability()
  hitState.value = debug.getMotionHitState()
  rendererStatus.value = readRendererStatus()
}

function setPreset(nextPresetId: Live2DPetPresetId) {
  const debug = getDebugApi()
  if (!debug) return

  debug.setPresetId(nextPresetId)
  refreshSnapshot()
}

function setState(nextState: CompanionPetState) {
  const debug = getDebugApi()
  if (!debug) return

  debug.setState(nextState)
  refreshSnapshot()
}

async function testMotion() {
  const debug = getDebugApi()
  if (!debug) return

  const index = Number.parseInt(motionIndexInput.value, 10)
  const normalizedIndex = Number.isFinite(index) ? Math.max(0, index) : 0

  isTestingMotion.value = true
  testResult.value = null
  try {
    const started = await debug.testMotion(motionGroupInput.value.trim(), normalizedIndex)
    testResult.value = started ? 'hit' : 'miss'
  } finally {
    isTestingMotion.value = false
    refreshSnapshot()
  }
}

onMounted(() => {
  refreshSnapshot()
  refreshTimer = window.setInterval(refreshSnapshot, 500)
})

onBeforeUnmount(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
})
</script>

<template>
  <aside class="live2d-debug-panel" :class="{ collapsed }" data-live2d-debug="panel">
    <button class="toggle-button" type="button" data-live2d-debug="toggle" @click="collapsed = !collapsed">
      {{ collapsed ? 'Live2D Debug' : 'Hide Debug' }}
    </button>

    <div v-if="!collapsed" class="panel-body">
      <div class="status-grid">
        <div><span>Preset</span><strong>{{ presetId }}</strong></div>
        <div><span>State</span><strong>{{ currentState }}</strong></div>
        <div><span>Ready</span><strong>{{ rendererStatus.ready ? 'yes' : 'no' }}</strong></div>
        <div><span>Canvas</span><strong>{{ rendererStatus.canvasCount }}</strong></div>
      </div>

      <div class="status-grid compact">
        <div><span>Fallback</span><strong>{{ rendererStatus.live2dFailed ? 'yes' : 'no' }}</strong></div>
        <div><span>Total</span><strong>{{ capability?.totalMotions ?? 0 }}</strong></div>
      </div>

      <section class="panel-section">
        <h4>Preset</h4>
        <div class="chip-row">
          <button v-for="id in PRESET_IDS" :key="id" type="button" class="chip-button" :class="{ active: presetId === id }" :data-live2d-preset="id" @click="setPreset(id)">
            {{ id }}
          </button>
        </div>
      </section>

      <section class="panel-section">
        <h4>State</h4>
        <div class="chip-row">
          <button v-for="id in STATE_IDS" :key="id" type="button" class="chip-button" :class="{ active: currentState === id }" :data-live2d-state="id" @click="setState(id)">
            {{ id }}
          </button>
        </div>
      </section>

      <section class="panel-section">
        <h4>Capability</h4>
        <div class="capability-list">
          <div v-for="item in capabilityGroups" :key="item.groupName" class="capability-row">
            <span>{{ item.groupName }}</span>
            <strong>{{ item.count }}</strong>
          </div>
        </div>
      </section>

      <section class="panel-section">
        <h4>Test Motion</h4>
        <div class="motion-form">
          <input v-model="motionGroupInput" data-live2d-debug="motion-group" type="text" spellcheck="false" placeholder="groupName" />
          <input v-model="motionIndexInput" data-live2d-debug="motion-index" type="number" min="0" step="1" placeholder="index" />
          <button type="button" class="test-button" data-live2d-debug="test-motion" :disabled="isTestingMotion" @click="void testMotion()">
            {{ isTestingMotion ? 'Testing...' : 'testMotion' }}
          </button>
        </div>
        <p v-if="testResult" class="test-result">last test: {{ testResult }}</p>
      </section>

      <section class="panel-section">
        <h4>Last Hit</h4>
        <div class="hit-grid">
          <div><span>source</span><strong>{{ hitState?.source ?? '-' }}</strong></div>
          <div><span>state</span><strong>{{ hitState?.requestedState ?? '-' }}</strong></div>
          <div><span>group</span><strong>{{ hitState?.requestedMotionGroup ?? '-' }}</strong></div>
          <div><span>index</span><strong>{{ hitState?.requestedMotionIndex ?? '-' }}</strong></div>
          <div><span>hit</span><strong>{{ hitState?.hit ? 'true' : 'false' }}</strong></div>
          <div><span>fallback</span><strong>{{ hitState?.fallbackUsed ? 'true' : 'false' }}</strong></div>
          <div class="full"><span>reason</span><strong>{{ hitState?.fallbackReason ?? '-' }}</strong></div>
          <div class="full"><span>final</span><strong>{{ hitState?.finalMotionKey ?? '-' }}</strong></div>
        </div>
      </section>
    </div>
  </aside>
</template>

<style scoped>
.live2d-debug-panel {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 44;
  width: min(320px, calc(100vw - 32px));
  pointer-events: auto;
  font-size: 12px;
  color: #e8f0ff;
}

.toggle-button {
  width: 100%;
  padding: 9px 12px;
  border: 1px solid rgba(130, 180, 255, 0.26);
  border-radius: 14px;
  background: rgba(8, 12, 22, 0.86);
  color: inherit;
  text-align: left;
  cursor: pointer;
  backdrop-filter: blur(12px);
}

.panel-body {
  margin-top: 8px;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(130, 180, 255, 0.18);
  background: rgba(8, 12, 22, 0.92);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(14px);
}

.panel-section + .panel-section {
  margin-top: 12px;
}

.panel-section h4 {
  margin: 0 0 8px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #8fd3ff;
}

.status-grid,
.hit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.status-grid.compact {
  margin-top: 8px;
}

.status-grid div,
.hit-grid div {
  padding: 7px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
}

.status-grid span,
.hit-grid span {
  display: block;
  margin-bottom: 3px;
  font-size: 10px;
  color: #9cb6d8;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.status-grid strong,
.hit-grid strong {
  display: block;
  overflow-wrap: anywhere;
  font-weight: 600;
}

.chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.chip-button,
.test-button {
  border: 1px solid rgba(141, 211, 255, 0.18);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  cursor: pointer;
}

.chip-button {
  padding: 6px 9px;
}

.chip-button.active {
  border-color: rgba(102, 214, 255, 0.44);
  background: rgba(61, 174, 255, 0.18);
}

.capability-list {
  display: grid;
  gap: 6px;
}

.capability-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
}

.motion-form {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 72px auto;
  gap: 6px;
}

.motion-form input {
  min-width: 0;
  padding: 7px 8px;
  border: 1px solid rgba(141, 211, 255, 0.16);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: inherit;
}

.test-button {
  padding: 7px 10px;
}

.test-button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.test-result {
  margin: 8px 0 0;
  color: #9cb6d8;
}

.hit-grid .full {
  grid-column: 1 / -1;
}

@media (max-width: 900px) {
  .live2d-debug-panel {
    left: 12px;
    bottom: 12px;
    width: min(300px, calc(100vw - 24px));
  }

  .motion-form {
    grid-template-columns: minmax(0, 1fr) 64px;
  }

  .test-button {
    grid-column: 1 / -1;
  }
}
</style>
