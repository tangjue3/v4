<template>
  <section class="dash">
    <!-- Empty State -->
    <div v-if="!report" class="dash-empty">
      <div class="empty-icon">
        <Compass class="w-12 h-12" style="color: var(--gold-400)" />
      </div>
      <h2 class="empty-title">暂无学习画像报告</h2>
      <p class="empty-desc">完成 AI 学习导师对话，收集至少 4 个维度信息后，即可生成专属学习画像报告。</p>
      <div class="empty-progress">
        <div class="ep-bar"><div class="ep-fill" :style="{ width: collectedPct + '%' }" /></div>
        <span class="ep-text">{{ collectedCount }}/9 维已采集</span>
      </div>
      <button @click="goToChat" class="empty-btn">
        <MessageSquare class="w-4 h-4" />
        <span>去对话创建画像</span>
      </button>
    </div>

    <!-- Report Content -->
    <template v-else>
    <!-- ===== 顶部：评分 + 身份一句话 ===== -->
    <header class="dash-hero">
      <div class="dash-hero-inner">
        <div class="hero-score-block">
          <span class="hero-score">{{ report?.score ?? '—' }}</span>
          <span class="hero-score-unit">/ 100</span>
        </div>
        <div class="hero-right">
          <h1 class="hero-title">{{ report?.evaluation || '数据采集中' }}</h1>
          <p class="hero-sub">{{ dimSummary }}</p>
          <div class="hero-collect">
            <div class="collect-bar"><div class="collect-fill" :style="{ width: collectedPct + '%' }" /></div>
            <span class="collect-text">{{ collectedCount }}/9 维已采集</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ===== 关键洞察 ===== -->
    <section class="dash-insight">
      <div class="insight-grid">
        <div class="insight-text">
          <p class="insight-quote">{{ weaknesses[0] || '暂无诊断数据' }}</p>
          <span class="insight-from">诊断建议</span>
        </div>
        <div class="insight-text" v-if="weaknesses[1]">
          <p class="insight-quote">{{ weaknesses[1] }}</p>
          <span class="insight-from">薄弱环节</span>
        </div>
        <div class="insight-text" v-if="suggestions[0]">
          <p class="insight-quote">{{ suggestions[0] }}</p>
          <span class="insight-from">改进建议</span>
        </div>
      </div>
    </section>

    <!-- ===== 能力维度（雷达图） ===== -->
    <section class="dash-section">
      <div class="section-inner">
        <h2 class="sec-title">能力维度</h2>
        <div class="radar-layout">
          <RadarChart :points="radarPoints" :size="240" />
          <div class="radar-side">
            <div v-for="dim in radarData" :key="dim.name" class="radar-row">
              <span class="radar-name">{{ dim.name }}</span>
              <span class="radar-score">{{ dim.score }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 技能标签 ===== -->
    <section class="dash-section">
      <div class="section-inner">
        <h2 class="sec-title">技能标签</h2>
        <div class="skill-groups">
          <div class="skill-group">
            <div class="sg-hdr sg-core">核心实战</div>
            <div class="skill-bubbles"><span v-for="s in skills.core" :key="s" class="skill-b sb-core">{{ s }}</span></div>
          </div>
          <div class="skill-group">
            <div class="sg-hdr sg-found">理论基础</div>
            <div class="skill-bubbles"><span v-for="s in skills.foundation" :key="s" class="skill-b sb-found">{{ s }}</span></div>
          </div>
          <div class="skill-group" v-if="skills.additional?.length">
            <div class="sg-hdr sg-add">拓展方向</div>
            <div class="skill-bubbles"><span v-for="s in skills.additional" :key="s" class="skill-b sb-add">{{ s }}</span></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 学习路线 ===== -->
    <section class="dash-section" v-if="milestones.length">
      <div class="section-inner">
        <h2 class="sec-title">推荐学习路线</h2>
        <div class="timeline">
          <div v-for="m in milestones" :key="m.step" class="tl-node">
            <div class="tl-dot">{{ m.step }}</div>
            <div class="tl-content">
              <h4>{{ m.title }}</h4>
              <p>{{ m.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 底部留白 ===== -->
    <div class="dash-foot" />
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Compass, MessageSquare } from 'lucide-vue-next'
import { collectedCount, report, dimensions, activeMenu } from '@/composables/dialogue/useAppState'
import RadarChart from './RadarChart.vue'
import type { RadarPoint } from '@/types/dialogue'

const collectedPct = computed(() => Math.round((collectedCount.value / 9) * 100))

const dimSummary = computed(() => {
  const parts: string[] = []
  if (dimensions.value.identity) parts.push(dimensions.value.identity)
  if (dimensions.value.domain) parts.push(dimensions.value.domain)
  if (dimensions.value.level) parts.push(dimensions.value.level)
  if (dimensions.value.goal) parts.push(`目标:${dimensions.value.goal}`)
  return parts.length ? parts.join(' · ') : '尚未采集足够信息'
})

const radarData = computed(() => {
  if (report.value?.radarPoints?.length) {
    return report.value.radarPoints.map(p => ({ name: p.dimension, score: p.score }))
  }
  return []
})

const radarPoints = computed<RadarPoint[]>(() => {
  if (report.value?.radarPoints) return report.value.radarPoints
  return radarData.value.map(d => ({ dimension: d.name, score: d.score }))
})

const skills = computed(() => report.value?.skills || {
  core: [], foundation: [], additional: [],
})

const weaknesses = computed(() => report.value?.weaknesses || [])
const suggestions = computed(() => report.value?.suggestions || [])

const milestones = computed(() => {
  if (report.value?.recommendedPath) {
    return report.value.recommendedPath.map(m => ({ step: m.step, title: m.title, desc: m.description }))
  }
  return []
})

function goToChat() {
  activeMenu.value = 'chat'
}
</script>

<style scoped>
.dash {
  overflow-y: auto;
  height: 100%;
  flex: 1;
  width: 100%;
  min-width: 0;
  background: transparent;
  color: var(--text-primary);
}

/* ===== EMPTY STATE ===== */
.dash-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 60px 40px;
  text-align: center;
}
.empty-icon {
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.15);
}
.empty-title {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 8px;
}
.empty-desc {
  font-size: 14px;
  color: var(--text-muted);
  max-width: 400px;
  line-height: 1.6;
  margin: 0 0 28px;
}
.empty-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
  width: 100%;
  max-width: 320px;
}
.ep-bar {
  flex: 1;
  height: 6px;
  border-radius: 999px;
  background: rgba(255,255,255,0.06);
  overflow: hidden;
}
.ep-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--gold-500), var(--gold-400));
  transition: width 0.8s ease;
}
.ep-text {
  font-size: 13px;
  color: var(--text-dim);
  white-space: nowrap;
}
.empty-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  color: #fff;
  background: linear-gradient(135deg, var(--gold-500), var(--gold-600));
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.25);
  transition: all 0.2s;
}
.empty-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
}

/* ===== HERO ===== */
.dash-hero {
  padding: 48px 56px 36px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.dash-hero-inner {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: flex-end;
  gap: 36px;
}
.hero-score-block { display: flex; align-items: baseline; gap: 6px; }
.hero-score { font-family: Georgia, "Noto Serif SC", serif; font-size: 72px; font-weight: 400; color: var(--gold-400); line-height: 1; text-shadow: 0 0 30px rgba(59, 130, 246, 0.3); }
.hero-score-unit { font-size: 18px; color: var(--text-dim); font-weight: 300; }
.hero-right { flex: 1; }
.hero-title { font-family: Georgia, "Noto Serif SC", serif; font-size: 26px; font-weight: 400; color: #fff; margin: 0 0 6px; }
.hero-sub { font-size: 14px; color: var(--text-muted); margin: 0 0 14px; }
.hero-collect { display: flex; align-items: center; gap: 12px; }
.collect-bar { flex: 1; max-width: 200px; height: 6px; border-radius: 999px; background: rgba(255,255,255,0.06); overflow: hidden; }
.collect-fill { height: 100%; border-radius: 999px; background: var(--gold-400); transition: width 1.5s; }
.collect-text { font-size: 13px; color: var(--text-dim); white-space: nowrap; }

/* ===== INSIGHT ===== */
.dash-insight {
  padding: 0 56px;
  max-width: 1112px;
  margin: 0 auto;
}
.insight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1px;
  background: rgba(255,255,255,0.04);
}
.insight-text {
  background: rgba(8, 12, 24, 0.55);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.08);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
}
.insight-quote {
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.6;
  margin: 0;
}
.insight-from { font-size: 12px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }

/* ===== GENERIC SECTION ===== */
.dash-section {
  padding: 0 56px;
  max-width: 1112px;
  margin: 0 auto;
}
.section-inner {
  padding: 40px 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.sec-title {
  font-family: Georgia, "Noto Serif SC", serif;
  font-size: 20px;
  font-weight: 400;
  color: #fff;
  margin: 0 0 24px;
}

/* ===== RADAR LAYOUT ===== */
.radar-layout { display: flex; align-items: center; gap: 40px; }
.radar-side { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.radar-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.radar-name { font-size: 14px; color: var(--text-secondary); }
.radar-score { font-size: 15px; font-weight: 700; color: var(--gold-400); }

/* ===== SKILLS ===== */
.skill-groups { display: flex; flex-direction: column; gap: 16px; }
.skill-group {  }
.sg-hdr { font-size: 13px; font-weight: 600; margin-bottom: 8px; }
.sg-core { color: #5c9a8a; }
.sg-found { color: var(--gold-400); }
.sg-add { color: #94a3b8; }
.skill-bubbles { display: flex; flex-wrap: wrap; gap: 8px; }
.skill-b { padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; }
.sb-core { background: rgba(92,154,138,0.1); color: #5c9a8a; }
.sb-found { background: rgba(59, 130, 246,0.08); color: var(--gold-400); }
.sb-add { background: rgba(148,163,184,0.06); color: #94a3b8; }

/* ===== TIMELINE ===== */
.timeline { display: flex; gap: 0; position: relative; }
.timeline::before { content: ''; position: absolute; top: 16px; left: 16px; right: 16px; height: 2px; background: rgba(255,255,255,0.06); }
.tl-node { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 12px; position: relative; }
.tl-dot { width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--gold-400); background: var(--bg-deep); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: var(--gold-400); position: relative; z-index: 1; }
.tl-content { text-align: center; }
.tl-content h4 { font-size: 14px; font-weight: 600; color: var(--text-primary); margin: 0 0 4px; }
.tl-content p { font-size: 12px; color: var(--text-muted); margin: 0; line-height: 1.5; }

/* ===== FOOT ===== */
.dash-foot { height: 60px; }

/* ===== RESPONSIVE ===== */
@media (max-width: 1000px) {
  .dash-hero { padding: 36px 28px 28px; }
  .dash-hero-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
  .hero-score { font-size: 56px; }
  .dash-insight { padding: 0 28px; }
  .insight-grid { grid-template-columns: 1fr; }
  .dash-section { padding: 0 28px; }
  .timeline { flex-direction: column; gap: 20px; }
  .timeline::before { display: none; }
  .tl-node { flex-direction: row; align-items: flex-start; }
  .tl-content { text-align: left; }
  .radar-layout { flex-direction: column; align-items: center; }
  .radar-side { width: 100%; max-width: 320px; }
}
@media (max-width: 640px) {
  .dash-hero { padding: 28px 20px 20px; }
  .hero-score { font-size: 44px; }
  .dash-insight { padding: 0 20px; }
  .dash-section { padding: 0 20px; }
}
</style>
