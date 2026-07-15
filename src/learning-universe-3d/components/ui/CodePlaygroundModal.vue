<template>
  <GlassModal
    :visible="visible"
    :title="`代码练习 — ${codeExample?.title ?? ''}`"
    :subtitle="codeExample?.description"
    accent-color="#BA68C8"
    :width="960"
    @close="$emit('close')"
  >
    <div class="playground">
      <div class="editor-side">
        <div class="editor-bar">
          <span class="lang-tag">{{ codeExample?.language }}</span>
          <span class="level-tag" :class="codeExample?.level">{{ codeExample?.level }}</span>
        </div>
        <textarea v-model="code" class="code-editor" spellcheck="false"></textarea>
      </div>

      <div class="output-side">
        <div class="output-bar">测试结果</div>
        <div v-if="!hasRun && !showAnswer" class="output-empty">点击「运行」查看结果</div>
        <div v-else-if="showAnswer" class="answer-block">
          <pre class="answer-code"><code>{{ codeExample?.code }}</code></pre>
        </div>
        <div v-else class="output-results">
          <div
            v-for="(r, idx) in testResults"
            :key="idx"
            class="test-row"
            :class="r.passed ? 'pass' : 'fail'"
          >
            <span class="test-icon">{{ r.passed ? '✓' : '✗' }}</span>
            <span>测试 {{ idx + 1 }}: {{ r.passed ? '通过' : '未通过' }}</span>
            <div v-if="!r.passed" class="test-detail">
              <span v-if="r.expected">期望: {{ r.expected }}</span>
              <span v-if="r.actual">实际: {{ r.actual }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="pg-btn run" @click="runCode">
        <Play :size="13" /> 运行
      </button>
      <button class="pg-btn" @click="resetCode">重置</button>
      <button class="pg-btn" :class="{ active: showAnswer }" @click="showAnswer = !showAnswer">
        {{ showAnswer ? '隐藏答案' : '显示答案' }}
      </button>
    </template>
  </GlassModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Play } from '@lucide/vue'
import GlassModal from './GlassModal.vue'
import { coursesV2 } from '../../data/coursesV2'

const props = defineProps<{
  visible: boolean
  codeExampleId: string
}>()

defineEmits<{ close: [] }>()

const codeExample = computed(() => {
  for (const c of coursesV2) {
    const ex = c.codeExamples.find((e) => e.id === props.codeExampleId)
    if (ex) return ex
  }
  return null
})

const code = ref('')
const hasRun = ref(false)
const showAnswer = ref(false)
const testResults = ref<{ passed: boolean; expected?: string; actual?: string }[]>([])

watch(() => props.visible, (v) => {
  if (v) {
    code.value = codeExample.value?.code || ''
    hasRun.value = false
    showAnswer.value = false
    testResults.value = []
  }
})

function runCode() {
  hasRun.value = true
  const expected = codeExample.value?.output
  const actual = '```\n' + code.value + '\n```'
  if (expected) {
    const passed = code.value.trim() === expected.trim()
    testResults.value = [{ passed, expected, actual: passed ? expected : actual }]
  } else {
    testResults.value = [{ passed: true, actual }]
  }
}

function resetCode() {
  code.value = codeExample.value?.code || ''
  hasRun.value = false
  testResults.value = []
}
</script>

<style scoped>
.playground {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  min-height: 360px;
}

.editor-side, .output-side {
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.editor-bar, .output-bar {
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.lang-tag {
  padding: 1px 8px;
  border-radius: var(--radius-full);
  background: rgba(186, 104, 200, 0.1);
  color: var(--accent-purple);
  font-size: 11px;
  font-weight: 500;
}

.level-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.level-tag.入门 { color: var(--accent-green); background: rgba(129, 199, 132, 0.1); }
.level-tag.进阶 { color: var(--accent-amber); background: rgba(255, 183, 77, 0.1); }
.level-tag.高级 { color: var(--accent-red); background: rgba(229, 115, 115, 0.1); }

.code-editor {
  flex: 1;
  padding: 14px;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #c9d1d9;
  background: rgba(0, 0, 0, 0.3);
  border: none;
  resize: none;
  outline: none;
}

.output-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: var(--text-muted);
}

.output-results {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.test-row {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.test-row.pass { background: rgba(34, 197, 94, 0.06); color: var(--status-completed); }
.test-row.fail { background: rgba(229, 115, 115, 0.06); color: var(--accent-red); }

.test-icon { font-weight: 700; }

.test-detail {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--text-muted);
  margin-left: auto;
}

.answer-block {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
.answer-code {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
  padding: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #c9d1d9;
  margin: 0;
  overflow-x: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.pg-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  font-size: 12px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) ease;
}

.pg-btn:hover { background: rgba(255, 255, 255, 0.08); color: var(--text-primary); }

.pg-btn.run {
  color: var(--accent-purple);
  background: rgba(186, 104, 200, 0.08);
  border-color: rgba(186, 104, 200, 0.2);
}

.pg-btn.run:hover { background: rgba(186, 104, 200, 0.15); }

.pg-btn.active {
  background: rgba(186, 104, 200, 0.12);
  border-color: rgba(186, 104, 200, 0.25);
  color: var(--accent-purple);
}
</style>
