<template>
  <GlassModal
    :visible="visible"
    :title="`${courseName} — 评估测试`"
    :subtitle="showResults ? '测试完成' : progressText"
    accent-color="#4FC3F7"
    :width="640"
    @close="$emit('close')"
  >
    <div v-if="!showResults" class="assessment-body">
      <div class="question-nav">
        <span class="q-progress font-display">{{ currentIdx + 1 }} / {{ questions.length }}</span>
        <span class="timer" :class="{ urgent: timeRemaining < 60 }">⏱ {{ formattedTime }}</span>
      </div>

      <div v-if="!showFeedback" class="question-area">
        <p class="question-text">{{ currentQuestion.question }}</p>

        <div v-if="currentQuestion.type === 'choice'" class="options">
          <button
            v-for="(opt, idx) in currentQuestion.options"
            :key="idx"
            class="option-btn"
            :class="{ selected: selectedAnswer === idx }"
            @click="selectedAnswer = idx"
          >
            <span class="opt-letter">{{ labels[idx] }}</span>
            <span class="opt-text">{{ opt }}</span>
          </button>
        </div>

        <div v-else-if="currentQuestion.type === 'judge'" class="options">
          <button class="option-btn" :class="{ selected: selectedAnswer === '正确' }" @click="selectedAnswer = '正确'">
            <span class="opt-letter">T</span>
            <span class="opt-text">正确</span>
          </button>
          <button class="option-btn" :class="{ selected: selectedAnswer === '错误' }" @click="selectedAnswer = '错误'">
            <span class="opt-letter">F</span>
            <span class="opt-text">错误</span>
          </button>
        </div>

        <div v-else-if="currentQuestion.type === 'code'" class="code-area">
          <textarea v-model="codeAnswer" class="code-input" placeholder="在此输入代码..." spellcheck="false"></textarea>
        </div>

        <button class="submit-btn" :disabled="!hasAnswer" @click="submitAnswer">提交答案</button>
      </div>

      <div v-else class="feedback-area" :class="isCorrect ? 'correct' : 'wrong'">
        <div class="feedback-icon">{{ isCorrect ? '✓' : '✗' }}</div>
        <p class="feedback-text">{{ isCorrect ? '回答正确！' : '回答错误' }}</p>
        <p v-if="currentQuestion.explanation" class="feedback-explain">{{ currentQuestion.explanation }}</p>
        <button class="next-btn" @click="nextQuestion">{{ isLastQuestion ? '查看结果' : '下一题' }}</button>
      </div>
    </div>

    <div v-else class="results-area">
      <div class="score-ring-wrap">
        <svg class="score-ring" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="8" />
          <circle cx="60" cy="60" r="50" fill="none" :stroke="scoreColor" stroke-width="8"
            stroke-linecap="round" :stroke-dasharray="314" :stroke-dashoffset="314 - 314 * score / 100"
            style="transition: stroke-dashoffset 1s var(--ease-out-expo)" />
        </svg>
        <span class="score-value font-display">{{ score }}</span>
      </div>
      <p class="score-label">总分</p>
      <div class="result-stats">
        <span class="rs-correct">✓ {{ correctCount }}</span>
        <span class="rs-wrong">✗ {{ questions.length - correctCount }}</span>
      </div>
    </div>

    <template v-if="showResults" #footer>
      <button class="action-btn" @click="$emit('close')">关闭</button>
    </template>
  </GlassModal>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue'
import GlassModal from './GlassModal.vue'
import { useUniverseStore } from '../../stores/universeStore'
import { courses } from '../../data/courses'
import { coursesV2 } from '../../data/coursesV2'
import { assessments } from '../../data/assessments'

const props = defineProps<{
  visible: boolean
  courseId: number
}>()

const emit = defineEmits<{ close: [] }>()

const store = useUniverseStore()
const courseV2 = computed(() => coursesV2.find((c) => c.id === props.courseId))
const courseName = computed(() => courseV2.value?.id ? courses.find((c) => c.id === props.courseId)?.name || '' : '')

const assessmentId = computed(() => courseV2.value?.assessmentIds[0] || '')
const assessmentData = computed(() => assessments.find((a) => a.id === assessmentId.value))
const questions = computed(() => assessmentData.value?.questions || [])
const currentIdx = ref(0)
const selectedAnswer = ref<number | string | null>(null)
const codeAnswer = ref('')
const showFeedback = ref(false)
const showResults = ref(false)
const isCorrect = ref(false)
const correctCount = ref(0)
const timeRemaining = ref(0)
const labels = ['A', 'B', 'C', 'D']

let timer: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => questions.value[currentIdx.value])
const isLastQuestion = computed(() => currentIdx.value >= questions.value.length - 1)
const hasAnswer = computed(() => selectedAnswer.value !== null || codeAnswer.value.trim() !== '')
const progressText = computed(() => `第 ${currentIdx.value + 1} 题 / 共 ${questions.value.length} 题`)

const score = computed(() => {
  if (!questions.value.length) return 0
  return Math.round((correctCount.value / questions.value.length) * 100)
})

const scoreColor = computed(() => {
  if (score.value >= 80) return '#22c55e'
  if (score.value >= 60) return '#FFB74D'
  return '#E57373'
})

const formattedTime = computed(() => {
  const m = Math.floor(timeRemaining.value / 60)
  const s = timeRemaining.value % 60
  return `${m}:${s.toString().padStart(2, '0')}`
})

watch(() => props.visible, (v) => {
  if (v) {
    currentIdx.value = 0
    selectedAnswer.value = null
    codeAnswer.value = ''
    showFeedback.value = false
    showResults.value = false
    correctCount.value = 0
    timeRemaining.value = (assessmentData.value?.timeLimitMinutes || 30) * 60
    startTimer()
  } else {
    stopTimer()
  }
})

function startTimer() {
  stopTimer()
  timer = setInterval(() => {
    if (timeRemaining.value > 0) timeRemaining.value--
    else { stopTimer(); finishAssessment() }
  }, 1000)
}

function stopTimer() {
  if (timer) { clearInterval(timer); timer = null }
}

function submitAnswer() {
  const q = currentQuestion.value
  if (q.type === 'code') {
    isCorrect.value = codeAnswer.value.trim().length > 0
  } else {
    isCorrect.value = selectedAnswer.value === q.correctAnswer
  }
  if (isCorrect.value) correctCount.value++
  showFeedback.value = true
}

function nextQuestion() {
  if (isLastQuestion.value) {
    finishAssessment()
  } else {
    currentIdx.value++
    selectedAnswer.value = null
    codeAnswer.value = ''
    showFeedback.value = false
  }
}

function finishAssessment() {
  stopTimer()
  showResults.value = true
  if (props.courseId) {
    store.recordAssessmentResult(props.courseId, {
      conceptual: score.value,
      coding: score.value,
      lastAttemptAt: Date.now(),
      totalQuestions: questions.value.length,
      correctAnswers: correctCount.value,
    })
  }
}

onUnmounted(stopTimer)
</script>

<style scoped>
.assessment-body { min-height: 300px; }

.question-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.q-progress { font-size: 14px; color: var(--text-muted); }

.timer { font-size: 13px; color: var(--text-secondary); }
.timer.urgent { color: var(--accent-red); animation: blink 1s ease-in-out infinite; }

@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

.question-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 20px;
}

.options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }

.option-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  text-align: left;
  font-family: inherit;
}

.option-btn:hover {
  background: rgba(79, 195, 247, 0.04);
  border-color: rgba(79, 195, 247, 0.12);
}

.option-btn.selected {
  background: rgba(79, 195, 247, 0.08);
  border-color: rgba(79, 195, 247, 0.25);
  color: var(--text-primary);
}

.opt-letter {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  flex-shrink: 0;
}

.option-btn.selected .opt-letter {
  background: rgba(79, 195, 247, 0.2);
  color: var(--accent-blue);
}

.code-area { margin-bottom: 24px; }

.code-input {
  width: 100%;
  min-height: 160px;
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

.submit-btn {
  display: block;
  width: 100%;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: rgba(79, 195, 247, 0.15);
  border: 1px solid rgba(79, 195, 247, 0.25);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  font-family: inherit;
}

.submit-btn:hover:not(:disabled) { background: rgba(79, 195, 247, 0.25); }
.submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.feedback-area {
  text-align: center;
  padding: 24px 0;
}

.feedback-icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  margin: 0 auto 16px;
}

.feedback-area.correct .feedback-icon { background: rgba(34, 197, 94, 0.15); color: var(--status-completed); }
.feedback-area.wrong .feedback-icon { background: rgba(229, 115, 115, 0.15); color: var(--accent-red); }

.feedback-text { font-size: 18px; font-weight: 600; color: var(--text-primary); margin-bottom: 8px; }

.feedback-explain { font-size: 13px; color: var(--text-muted); line-height: 1.6; margin-bottom: 20px; }

.next-btn {
  padding: 10px 32px;
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-blue);
  background: rgba(79, 195, 247, 0.08);
  border: 1px solid rgba(79, 195, 247, 0.2);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) ease;
}

.next-btn:hover { background: rgba(79, 195, 247, 0.15); }

.results-area { text-align: center; padding: 20px 0; }

.score-ring-wrap {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 12px;
}

.score-ring { width: 100%; height: 100%; transform: rotate(-90deg); }

.score-value {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.score-label { font-size: 14px; color: var(--text-muted); margin-bottom: 16px; }

.result-stats {
  display: flex;
  justify-content: center;
  gap: 24px;
  font-size: 16px;
  font-weight: 600;
}

.rs-correct { color: var(--status-completed); }
.rs-wrong { color: var(--accent-red); }

.action-btn {
  padding: 8px 24px;
  font-size: 13px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) ease;
}

.action-btn:hover { background: rgba(255, 255, 255, 0.08); color: var(--text-primary); }
</style>
