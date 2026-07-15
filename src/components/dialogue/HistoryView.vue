<template>
  <section class="history-view">
    <div class="history-header">
      <h2 class="history-title">历史画像</h2>
      <p class="history-desc">过去生成的学习画像报告</p>
    </div>

    <!-- Empty state -->
    <div v-if="histories.length === 0" class="history-empty">
      <div class="empty-icon"><History class="w-12 h-12" style="color: var(--text-dim)" /></div>
      <h3 class="empty-title">暂无历史画像</h3>
      <p class="empty-desc">完成一次学习画像对话后，报告会自动保存在这里</p>
    </div>

    <div v-else class="history-list">
      <div v-for="h in histories" :key="h.id" class="history-card" @click="openHistory(h)">
        <div class="hc-top">
          <span class="hc-date">{{ h.date }}</span>
          <span class="hc-score">{{ h.score }}分</span>
        </div>
        <h3 class="hc-title">{{ h.evaluation }}</h3>
        <div class="hc-tags">
          <span v-for="tag in getTags(h).slice(0,4)" :key="tag" class="hc-tag">{{ tag }}</span>
        </div>
        <div class="hc-footer">
          <span class="hc-domain">{{ h.dimensions?.domain || '未指定领域' }}</span>
          <ChevronRight class="w-4 h-4" style="color: var(--text-dim)" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { History, ChevronRight } from 'lucide-vue-next'
import { historyPresets, restoreHistory } from '@/composables/dialogue/useAppState'
import type { HistoryPreset } from '@/types/dialogue'

const histories = historyPresets

function getTags(h: HistoryPreset): string[] {
  const tags: string[] = []
  if (h.report?.skills?.core) tags.push(...h.report.skills.core)
  if (h.report?.skills?.foundation) tags.push(...h.report.skills.foundation)
  if (h.dimensions?.level) tags.push(h.dimensions.level)
  return tags
}

function openHistory(h: HistoryPreset) {
  restoreHistory(h)
}
</script>

<style scoped>
.history-view {
  height: 100%;
  overflow-y: auto;
  padding: 48px 56px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.history-header { margin-bottom: 32px; }
.history-title { font-family: Georgia, "Noto Serif SC", serif; font-size: 24px; font-weight: 400; color: #fff; margin: 0 0 6px; }
.history-desc { font-size: 14px; color: var(--text-muted); margin: 0; }

/* Empty */
.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
}
.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
}
.empty-title { font-size: 18px; font-weight: 600; color: #fff; margin: 0 0 6px; }
.empty-desc { font-size: 14px; color: var(--text-dim); margin: 0; }

/* List */
.history-list { display: flex; flex-direction: column; gap: 12px; }
.history-card {
  background: rgba(59, 130, 246, 0.06);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-card);
  border-radius: 16px;
  padding: 20px 24px;
  cursor: pointer;
  transition: all 0.2s;
}
.history-card:hover {
  border-color: rgba(59, 130, 246, 0.25);
  background: rgba(59, 130, 246, 0.12);
  transform: translateY(-1px);
}
.hc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.hc-date { font-size: 12px; color: var(--text-dim); }
.hc-score { font-size: 14px; font-weight: 700; color: var(--gold-400); }
.hc-title { font-size: 15px; font-weight: 600; color: #fff; margin: 0 0 10px; }
.hc-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.hc-tag { font-size: 11px; padding: 3px 10px; border-radius: 12px; background: rgba(59, 130, 246,0.06); color: var(--text-muted); border: 1px solid rgba(59, 130, 246,0.1); }
.hc-footer { display: flex; justify-content: space-between; align-items: center; }
.hc-domain { font-size: 12px; color: var(--text-dim); }

@media (max-width: 640px) {
  .history-view { padding: 28px 20px; }
}
</style>
