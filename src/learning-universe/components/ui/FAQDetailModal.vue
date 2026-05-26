<template>
  <GlassModal
    :visible="visible"
    :title="faqItem?.question ?? ''"
    accent-color="#FFB74D"
    :width="680"
    @close="$emit('close')"
  >
    <div class="faq-body">
      <div class="diff-row">
        <span class="diff-label">难度:</span>
        <span class="diff-badge" :class="faqItem?.difficulty">{{ faqItem?.difficulty }}</span>
      </div>

      <div class="faq-section">
        <h4 class="faq-stitle">答案</h4>
        <p class="answer-text">{{ faqItem?.answer }}</p>
      </div>

      <div v-if="faqItem?.keyPoints?.length" class="faq-section">
        <h4 class="faq-stitle">关键要点</h4>
        <ul class="point-list">
          <li v-for="(pt, i) in faqItem.keyPoints" :key="i">{{ pt }}</li>
        </ul>
      </div>

      <div v-if="faqItem?.commonMisconceptions?.length" class="faq-section">
        <h4 class="faq-stitle warn">常见误区</h4>
        <ul class="point-list warn">
          <li v-for="(m, i) in faqItem.commonMisconceptions" :key="i">{{ m }}</li>
        </ul>
      </div>

      <div v-if="faqItem?.relatedConcepts?.length" class="faq-section">
        <h4 class="faq-stitle">关联概念</h4>
        <div class="concept-chips">
          <span v-for="(c, i) in faqItem.relatedConcepts" :key="i" class="chip">{{ c }}</span>
        </div>
      </div>

      <div v-if="faqItem?.followUpQuestions?.length" class="faq-section">
        <h4 class="faq-stitle">追问</h4>
        <div class="followup-list">
          <div v-for="(q, i) in faqItem.followUpQuestions" :key="i" class="followup-item">
            <span class="followup-prefix">&gt;</span>
            <span>{{ q }}</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <button class="fb-btn" :class="{ active: feedback === 'helpful' }" @click="toggleFeedback('helpful')">
        👍 有帮助
      </button>
      <button class="fb-btn" :class="{ active: feedback === 'unclear' }" @click="toggleFeedback('unclear')">
        🤔 不清楚
      </button>
    </template>
  </GlassModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import GlassModal from './GlassModal.vue'
import { coursesV2 } from '../../data/coursesV2'

const props = defineProps<{
  visible: boolean
  faqId: string
}>()

defineEmits<{ close: [] }>()

const faqItem = computed(() => {
  for (const c of coursesV2) {
    const f = c.faqItems.find((item) => item.id === props.faqId)
    if (f) return f
  }
  return null
})

const feedback = ref<'helpful' | 'unclear' | null>(null)

function toggleFeedback(type: 'helpful' | 'unclear') {
  feedback.value = feedback.value === type ? null : type
}
</script>

<style scoped>
.faq-body { display: flex; flex-direction: column; gap: 18px; }

.diff-row { display: flex; align-items: center; gap: 6px; }

.diff-label { font-size: 12px; color: var(--text-muted); }

.diff-badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.diff-badge.入门 { color: var(--accent-green); background: rgba(129, 199, 132, 0.1); }
.diff-badge.进阶 { color: var(--accent-amber); background: rgba(255, 183, 77, 0.1); }
.diff-badge.高级 { color: var(--accent-red); background: rgba(229, 115, 115, 0.1); }

.faq-section {}

.faq-stitle {
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 8px;
}

.faq-stitle.warn { color: var(--accent-amber); }

.answer-text {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.7;
  margin: 0;
}

.point-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.point-list li {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  padding-left: 14px;
  position: relative;
}

.point-list li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent-blue);
}

.point-list.warn li::before { color: var(--accent-amber); }

.concept-chips { display: flex; flex-wrap: wrap; gap: 6px; }

.chip {
  padding: 3px 10px;
  font-size: 12px;
  border-radius: var(--radius-full);
  background: rgba(79, 195, 247, 0.06);
  border: 1px solid rgba(79, 195, 247, 0.1);
  color: var(--accent-blue);
}

.followup-list { display: flex; flex-direction: column; gap: 4px; }

.followup-item {
  display: flex;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
}

.followup-prefix { color: var(--accent-amber); font-weight: 600; }

.fb-btn {
  padding: 6px 14px;
  font-size: 12px;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-full);
  cursor: pointer;
  font-family: inherit;
  transition: all var(--duration-fast) ease;
}

.fb-btn:hover { background: rgba(255, 255, 255, 0.06); }

.fb-btn.active {
  background: rgba(79, 195, 247, 0.08);
  border-color: rgba(79, 195, 247, 0.2);
  color: var(--accent-blue);
}
</style>
