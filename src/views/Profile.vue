<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import {
  ArrowLeft, ArrowRight, Check, Brain, Sparkles,
  RefreshCw,
} from 'lucide-vue-next'
import { useLearningProgressSync, type LearningAction } from '@/composables/useLearningProgressSync'
import { useProfileSurvey, roleOptions, fieldOptions, levelOptions, experienceOptions, goalOptions, longTermGoalOptions, motivationOptions, timeOptions, resourceOptions, weeklyHourOptions, paceOptions, stepLabels } from '@/composables/useProfileSurvey'

const {
  phase, currentStep, answers, result,
  analysisProgress, analysisMessage, totalSteps,
  isFirstStep, isLastStep, isWelcomeStep, progressPercent,
  canProceed, nextStep, prevStep, startAnalysis, toResults,
  reset, loadFromStorage, loadLatestSavedResult,
} = useProfileSurvey()
const { recentEvents } = useLearningProgressSync()

const loaded = ref(false)

onMounted(async () => {
  const saved = await loadLatestSavedResult()
  if (saved) {
    toResults(saved)
  } else {
    const localSaved = loadFromStorage()
    if (localSaved) toResults(localSaved)
  }
  setTimeout(() => { loaded.value = true }, 50)
})

// ── Radar helpers ──
const dimensions = computed(() => result.value?.dimensions ?? [])
function radarPoints(cx: number, cy: number, r: number) {
  const dims = dimensions.value
  if (!dims.length) return []
  return dims.map((d, i) => {
    const angle = (Math.PI * 2 * i) / dims.length - Math.PI / 2
    const val = d.value / 100
    return { x: cx + r * val * Math.cos(angle), y: cy + r * val * Math.sin(angle) }
  })
}
const cx = 170, cy = 170, r = 130
const points = computed(() => radarPoints(cx, cy, r))
const gridLevels = [0.2, 0.4, 0.6, 0.8, 1]

function skillLevelColor(val: number) {
  if (val >= 80) return '#06d6a0'
  if (val >= 60) return '#00d4ff'
  if (val >= 40) return '#f59e0b'
  return '#f43f5e'
}

function setSlider(key: string, val: number) {
  (answers.value as any)[key] = val
}

function actionLabel(action: LearningAction) {
  if (action === 'light-star') return '学习路径点亮知识点'
  if (action === 'favorite-resource') return '资源收藏偏好更新'
  if (action === 'complete-resource') return '资源学完并提升掌握度'
  if (action === 'reverse-update') return '反向更新写回画像'
  return '智能评估聚焦知识点'
}

const profileTimeline = computed(() => {
  const synced = recentEvents.value.slice(0, 5).map((event) => ({
    date: new Date(event.createdAt).toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }),
    event: `${actionLabel(event.action)}：${event.domainName} / ${event.label}`,
    score: `${event.after - event.before >= 0 ? '+' : ''}${event.after - event.before}%`,
    type: event.after >= event.before ? 'up' : 'down',
  }))
  return [...synced, ...(result.value?.timeline ?? [])]
})
</script>

<template>
  <div class="profile">
    <!-- ============================================================ -->
    <!-- SURVEY PHASE                                                   -->
    <!-- ============================================================ -->
    <div v-if="phase === 'survey'" class="survey-container">
      <transition name="survey-fade" mode="out-in">
        <div v-if="currentStep === 0" key="welcome" class="survey-welcome">
          <div class="welcome-graphic">
            <div class="welcome-icon-ring">
              <Brain :size="40" stroke-width="1" class="welcome-icon" />
            </div>
          </div>
          <h1 class="welcome-title">发现你的学习画像</h1>
          <p class="welcome-desc">
            通过 4 步简短的自我评估，AI 将为你生成多维度的学习能力图谱，
            帮助你更清晰地认识自己的学习特征与成长方向。
          </p>
          <div class="welcome-steps">
            <div class="welcome-step-item breathe-subtle">
              <div class="wstep-num">1</div>
              <div class="wstep-info">
                <span class="wstep-title">学习背景</span>
                <span class="wstep-desc">你的经历与基础</span>
              </div>
            </div>
            <div class="welcome-step-item breathe-subtle">
              <div class="wstep-num">2</div>
              <div class="wstep-info">
                <span class="wstep-title">学习目标</span>
                <span class="wstep-desc">你前行的方向</span>
              </div>
            </div>
            <div class="welcome-step-item breathe-subtle">
              <div class="wstep-num">3</div>
              <div class="wstep-info">
                <span class="wstep-title">技能自评</span>
                <span class="wstep-desc">了解你的能力分布</span>
              </div>
            </div>
            <div class="welcome-step-item breathe-subtle">
              <div class="wstep-num">4</div>
              <div class="wstep-info">
                <span class="wstep-title">学习偏好</span>
                <span class="wstep-desc">找到最佳学习方式</span>
              </div>
            </div>
          </div>
          <button class="btn-primary btn-start" @click="nextStep">
            开始评估
            <ArrowRight :size="16" stroke-width="2" />
          </button>
        </div>

        <div v-else key="survey-form" class="survey-form">
          <div class="survey-progress">
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: progressPercent + '%' }" />
            </div>
            <div class="progress-labels">
              <span
                v-for="(label, i) in stepLabels"
                :key="i"
                :class="['progress-label', { active: i <= currentStep, current: i === currentStep }]"
                @click="i <= currentStep && currentStep !== totalSteps - 1 && (currentStep = i)"
              >
                {{ label }}
              </span>
            </div>
          </div>

          <div class="survey-body">
            <div v-if="currentStep === 1" class="step-content">
              <h2 class="step-title">学习背景</h2>
              <p class="step-desc">让我们先了解一下你的基础和所处的阶段</p>
              <div class="survey-grid">
                <div class="survey-field">
                  <label class="field-label">你的身份</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in roleOptions" :key="opt.value"
                      :class="['chip', { active: answers.role === opt.value }]"
                      @click="answers.role = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
                <div class="survey-field">
                  <label class="field-label">所学/从事领域</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in fieldOptions" :key="opt.value"
                      :class="['chip', { active: answers.field === opt.value }]"
                      @click="answers.field = opt.value; if (opt.value !== 'other') answers.customField = ''"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                  <input
                    v-if="answers.field === 'other'"
                    v-model="answers.customField"
                    class="field-input"
                    placeholder="请输入你的领域..."
                  />
                </div>
                <div class="survey-field">
                  <label class="field-label">当前水平</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in levelOptions" :key="opt.value"
                      :class="['chip', { active: answers.level === opt.value }]"
                      @click="answers.level = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
                <div class="survey-field">
                  <label class="field-label">学习/工作经验</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in experienceOptions" :key="opt.value"
                      :class="['chip', { active: answers.experience === opt.value }]"
                      @click="answers.experience = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 2" class="step-content">
              <h2 class="step-title">学习目标</h2>
              <p class="step-desc">了解你的目标，才能规划更精准的成长路径</p>
              <div class="survey-grid">
                <div class="survey-field">
                  <label class="field-label">短期目标（1-3 个月）</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in goalOptions" :key="opt.value"
                      :class="['chip', { active: answers.shortTermGoal === opt.value }]"
                      @click="answers.shortTermGoal = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                  <textarea
                    v-model="answers.shortTermDetail"
                    class="field-textarea"
                    placeholder="简单描述你的短期目标..."
                    rows="2"
                  />
                </div>
                <div class="survey-field">
                  <label class="field-label">长期目标（1 年以上）</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in longTermGoalOptions" :key="opt.value"
                      :class="['chip', { active: answers.longTermGoal === opt.value }]"
                      @click="answers.longTermGoal = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
                <div class="survey-field">
                  <label class="field-label">主要动机</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in motivationOptions" :key="opt.value"
                      :class="['chip', { active: answers.motivation === opt.value }]"
                      @click="answers.motivation = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 3" class="step-content">
              <h2 class="step-title">技能自评</h2>
              <p class="step-desc">滑动滑块，诚实地评估自己在各维度的水平</p>
              <div class="slider-grid">
                <div v-for="dim in ['knowledgeBase', 'learningSpeed', 'logicalThinking', 'creativity', 'focus', 'selfDiscipline']" :key="dim" class="slider-row">
                  <div class="slider-header">
                    <span class="slider-label">{{ { knowledgeBase: '知识基础', learningSpeed: '学习速度', logicalThinking: '逻辑思维', creativity: '创造力', focus: '专注力', selfDiscipline: '自律性' }[dim] }}</span>
                    <span class="slider-value" :style="{ color: skillLevelColor((answers as any)[dim]) }">
                      {{ (answers as any)[dim] }}
                    </span>
                  </div>
                  <div class="slider-track-wrap">
                    <input
                      type="range"
                      min="0" max="100"
                      :value="(answers as any)[dim]"
                      @input="setSlider(dim, Number(($event.target as HTMLInputElement).value))"
                      class="slider-input"
                    />
                    <div class="slider-track-bg">
                      <div
                        class="slider-track-fill"
                        :style="{ width: (answers as any)[dim] + '%', background: skillLevelColor((answers as any)[dim]) }"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="currentStep === 4" class="step-content">
              <h2 class="step-title">学习偏好</h2>
              <p class="step-desc">了解你的习惯，让学习建议更贴合你的生活</p>
              <div class="survey-grid">
                <div class="survey-field">
                  <label class="field-label">最佳学习时段</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in timeOptions" :key="opt.value"
                      :class="['chip', { active: answers.bestTime === opt.value }]"
                      @click="answers.bestTime = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
                <div class="survey-field">
                  <label class="field-label">首选学习资源</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in resourceOptions" :key="opt.value"
                      :class="['chip', { active: answers.resourcePreference === opt.value }]"
                      @click="answers.resourcePreference = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
                <div class="survey-field">
                  <label class="field-label">每周可投入时间</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in weeklyHourOptions" :key="opt.value"
                      :class="['chip', { active: answers.weeklyHours === opt.value }]"
                      @click="answers.weeklyHours = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
                <div class="survey-field">
                  <label class="field-label">学习节奏偏好</label>
                  <div class="option-chips">
                    <button
                      v-for="opt in paceOptions" :key="opt.value"
                      :class="['chip', { active: answers.learningPace === opt.value }]"
                      @click="answers.learningPace = opt.value"
                    >
                      {{ opt.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="survey-nav">
            <button v-if="!isFirstStep" class="btn-ghost" @click="prevStep">
              <ArrowLeft :size="16" stroke-width="2" />
              上一步
            </button>
            <div v-else />
            <button
              v-if="!isLastStep"
              :class="['btn-primary', { disabled: !canProceed() }]"
              :disabled="!canProceed()"
              @click="nextStep"
            >
              下一步
              <ArrowRight :size="16" stroke-width="2" />
            </button>
            <button
              v-else
              :class="['btn-primary', 'btn-complete', { disabled: !canProceed() }]"
              :disabled="!canProceed()"
              @click="startAnalysis"
            >
              完成评估
              <Check :size="16" stroke-width="2" />
            </button>
          </div>
        </div>
      </transition>
    </div>

    <!-- ============================================================ -->
    <!-- ANALYZING PHASE                                               -->
    <!-- ============================================================ -->
    <div v-else-if="phase === 'analyzing'" class="analyzing-container">
      <div class="analyzing-inner">
        <div class="analyzing-icon-wrap">
          <Brain :size="48" stroke-width="1" class="analyzing-icon" />
          <div class="analyzing-ring" />
        </div>
        <h2 class="analyzing-title">正在生成你的学习画像</h2>
        <div class="analyzing-track">
          <div class="analyzing-fill" :style="{ width: analysisProgress + '%' }" />
        </div>
        <p class="analyzing-message">{{ analysisMessage }}</p>
        <div class="analyzing-dots">
          <span v-for="i in 3" :key="i" class="dot" :style="{ animationDelay: i * 0.2 + 's' }" />
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- RESULTS PHASE — Redesigned                                    -->
    <!-- ============================================================ -->
    <div v-else-if="phase === 'results' && result" class="results">
      <!-- ── Background constellation ── -->
      <svg class="res-stars" viewBox="0 0 1440 900" preserveAspectRatio="none">
        <circle cx="120" cy="180" r="1.5" fill="rgba(0,212,255,0.15)" />
        <circle cx="280" cy="80" r="1" fill="rgba(0,212,255,0.12)" />
        <circle cx="55" cy="400" r="1.2" fill="rgba(124,58,237,0.12)" />
        <circle cx="90" cy="620" r="1" fill="rgba(0,212,255,0.08)" />
        <circle cx="1350" cy="150" r="1.5" fill="rgba(0,212,255,0.12)" />
        <circle cx="1380" cy="450" r="1" fill="rgba(124,58,237,0.1)" />
        <circle cx="1320" cy="700" r="1.2" fill="rgba(0,212,255,0.08)" />
        <circle cx="1100" cy="120" r="1" fill="rgba(0,212,255,0.1)" />
        <circle cx="400" cy="750" r="1" fill="rgba(0,212,255,0.06)" />
        <circle cx="1180" cy="550" r="1" fill="rgba(0,212,255,0.06)" />
      </svg>

      <!-- ── Page header ── -->
      <div class="res-header">
        <div class="res-header-left">
          <span class="res-badge">
            <Sparkles :size="11" stroke-width="1.5" />
            学习画像
          </span>
          <h1 class="res-title">你的能力星图</h1>
          <p class="res-sub">基于问卷生成的个性化分析报告</p>
        </div>
        <button class="res-retake" @click="reset">
          <RefreshCw :size="13" stroke-width="1.5" />
          重新评估
        </button>
      </div>

      <!-- ── Metrics line ── -->
      <div class="res-metrics">
        <span class="res-metric">
          综合评分 <strong class="metric-val">{{ result.totalScore }}</strong>
        </span>
        <span class="res-mdot" />
        <span class="res-metric">
          最强维度 <strong class="metric-cyan">{{ result.stats[1]?.value }}</strong>
        </span>
        <span class="res-mdot" />
        <span class="res-metric">
          待提升 <strong class="metric-amber">{{ result.stats[2]?.value }}</strong>
        </span>
        <span class="res-mdot" />
        <span class="res-metric">
          学习阶段 <strong>{{ result.stats[3]?.value }}</strong>
        </span>
      </div>

      <div class="res-divider" />

      <!-- ── Main two-column: Radar + Skills ── -->
      <div class="res-two">
        <!-- Radar -->
        <div class="res-radar">
          <h2 class="res-sec-title">能力雷达</h2>
          <div class="radar-body">
            <svg viewBox="0 0 350 350" class="radar-svg">
              <polygon
                v-for="level in gridLevels" :key="level"
                :points="dimensions.map((_, i) => {
                  const a = (Math.PI * 2 * i) / dimensions.length - Math.PI / 2
                  return `${cx + r * level * Math.cos(a)},${cy + r * level * Math.sin(a)}`
                }).join(' ')"
                fill="none" stroke="rgba(0,212,255,0.05)" stroke-width="1"
              />
              <line
                v-for="(_, i) in dimensions" :key="'ax'+i"
                :x1="cx" :y1="cy"
                :x2="cx + r * Math.cos((Math.PI * 2 * i) / dimensions.length - Math.PI / 2)"
                :y2="cy + r * Math.sin((Math.PI * 2 * i) / dimensions.length - Math.PI / 2)"
                stroke="rgba(0,212,255,0.05)" stroke-width="1"
              />
              <polygon
                v-if="points.length"
                :points="points.map(p => `${p.x},${p.y}`).join(' ')"
                :fill="loaded ? 'rgba(0,212,255,0.1)' : 'transparent'"
                :stroke="loaded ? '#00d4ff' : 'transparent'"
                stroke-width="2.5" stroke-linejoin="round"
              />
              <circle
                v-for="(p, i) in points" :key="'pt'+i"
                :cx="p.x" :cy="p.y" r="5"
                :fill="dimensions[i].color"
                :class="{ 'radar-pt': true, 'radar-pt--on': loaded }"
              />
              <text
                v-for="(d, i) in dimensions" :key="'lb'+i"
                :x="cx + (r + 28) * Math.cos((Math.PI * 2 * i) / dimensions.length - Math.PI / 2)"
                :y="cy + (r + 28) * Math.sin((Math.PI * 2 * i) / dimensions.length - Math.PI / 2)"
                text-anchor="middle" dominant-baseline="middle"
                fill="#8892b0" font-size="13" font-family="Outfit, sans-serif"
              >{{ d.label }}</text>
            </svg>
          </div>
        </div>

        <!-- Skills -->
        <div class="res-skills">
          <h2 class="res-sec-title">技能分布</h2>
          <div class="skill-list">
            <div v-for="g in result.skillTree" :key="g.category" class="skill-group">
              <div class="skill-group-hd">
                <span class="skill-dot" :style="{ background: g.color }" />
                <span class="skill-cat">{{ g.category }}</span>
                <span class="skill-avg">
                  {{ Math.round(g.skills.reduce((s, sk) => s + sk.level, 0) / g.skills.length) }}%
                </span>
              </div>
              <div v-for="sk in g.skills" :key="sk.name" class="skill-row">
                <span class="skill-name">{{ sk.name }}</span>
                <div class="skill-bar">
                  <div
                    class="skill-bar-fill"
                    :style="{ width: loaded ? sk.level + '%' : '0%', background: skillLevelColor(sk.level) }"
                  />
                </div>
                <span class="skill-pct" :style="{ color: skillLevelColor(sk.level) }">{{ sk.level }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="res-divider" />

      <!-- ── Weaknesses ── -->
      <div class="res-section">
        <h2 class="res-sec-title">薄弱知识点</h2>
        <div class="weak-cloud">
          <span v-for="w in result.weaknesses" :key="w.tag" class="weak-tag">
            {{ w.tag }}
            <span class="weak-count">{{ w.count }}</span>
          </span>
        </div>
      </div>

      <div class="res-divider" />

      <!-- ── Two-col bottom: Recommendations + Preferences / Timeline ── -->
      <div class="res-two">
        <!-- Recommendations -->
        <div class="res-recs">
          <h2 class="res-sec-title">学习建议</h2>
          <div class="rec-list">
            <div v-for="(rec, i) in result.recommendations" :key="i" class="rec-item">
              <span class="rec-num">{{ i + 1 }}</span>
              <p class="rec-text">{{ rec }}</p>
            </div>
          </div>
        </div>

        <!-- Preferences + Timeline -->
        <div class="res-side">
          <div class="res-prefs">
            <h2 class="res-sec-title">学习偏好</h2>
            <ul class="pref-list">
              <li v-for="p in result.preferences" :key="p.label" class="pref-item">
                <span class="pref-lbl">{{ p.label }}</span>
                <span class="pref-val">{{ p.value }}</span>
              </li>
            </ul>
          </div>
          <div class="res-timeline">
            <h2 class="res-sec-title">画像演变</h2>
            <div class="tl-list">
              <div v-for="(t, i) in profileTimeline" :key="`${t.date}-${i}`" class="tl-item">
                <div class="tl-marker">
                  <span :class="['tl-dot', { 'tl-dot--cur': i === 0 }]" />
                  <span v-if="i < result.timeline.length - 1" class="tl-line" />
                </div>
                <div class="tl-body">
                  <time class="tl-date">{{ t.date }}</time>
                  <span class="tl-event">{{ t.event }}</span>
                  <span v-if="t.score" :class="['tl-score', t.type]">{{ t.score }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* ================================================================= */
/* BASE                                                              */
/* ================================================================= */
.profile {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0;
  position: relative;
  z-index: 1;
}

/* ================================================================= */
/* SURVEY                                                            */
/* ================================================================= */
.survey-container {
  display: flex;
  justify-content: center;
  padding: 48px 20px 80px;
  min-height: calc(100vh - var(--header-height) - 40px);
}

.survey-welcome {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; max-width: 520px; padding-top: 32px;
}
.welcome-graphic { margin-bottom: 28px; }
.welcome-icon-ring {
  width: 88px; height: 88px; border-radius: 50%;
  background: rgba(0, 212, 255, 0.06);
  border: 1px solid rgba(0, 212, 255, 0.15);
  display: flex; align-items: center; justify-content: center; position: relative;
}
.welcome-icon-ring::before {
  content: ''; position: absolute; inset: -6px;
  border-radius: 50%; border: 1px solid rgba(0, 212, 255, 0.06);
}
.welcome-icon { color: var(--color-accent-cyan); }
.welcome-title {
  font-family: var(--font-display); font-size: 36px; font-weight: 400;
  color: #e8edf5; margin-bottom: 12px; line-height: 1.2;
}
.welcome-desc { font-size: 15px; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 32px; }
.welcome-steps { display: flex; flex-direction: column; gap: 14px; width: 100%; margin-bottom: 36px; }
.welcome-step-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; border-radius: 12px;
  background: rgba(255,255,255,0.02); border: 1px solid var(--color-border);
}
.wstep-num {
  width: 30px; height: 30px; border-radius: 50%;
  background: rgba(0,212,255,0.1); color: var(--color-accent-cyan);
  font-size: 14px; font-weight: 600;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.wstep-info { display: flex; flex-direction: column; gap: 3px; text-align: left; }
.wstep-title { font-size: 15px; font-weight: 600; color: #e8edf5; }
.wstep-desc { font-size: 13px; color: var(--color-text-tertiary); }

.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 32px; border-radius: var(--radius-md);
  background: var(--color-accent-cyan); color: #07070d;
  font-size: 15px; font-weight: 600; border: none; cursor: pointer;
  transition: opacity 0.2s var(--ease-out);
}
.btn-primary:hover { opacity: 0.85; }
.btn-primary.disabled { opacity: 0.3; cursor: not-allowed; }
.btn-start { margin-top: 8px; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 10px 22px; border-radius: var(--radius-sm);
  color: var(--color-text-secondary); font-size: 14px; font-weight: 500;
  border: 1px solid var(--color-border);
  transition: all 0.2s var(--ease-out);
}
.btn-ghost:hover { color: var(--color-accent-cyan); border-color: rgba(0,212,255,0.25); }

.survey-form { width: 100%; max-width: 600px; display: flex; flex-direction: column; }
.survey-progress { margin-bottom: 32px; }
.progress-track { height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 10px; }
.progress-fill { height: 100%; background: var(--color-accent-cyan); border-radius: 2px; transition: width 0.4s var(--ease-out); }
.progress-labels { display: flex; justify-content: space-between; }
.progress-label { font-size: 12px; color: var(--color-text-tertiary); cursor: default; transition: color 0.2s var(--ease-out); }
.progress-label.active { color: var(--color-text-secondary); }
.progress-label.current { color: var(--color-accent-cyan); }
.survey-body { flex: 1; }

.step-content { animation: fadeInUp 0.35s var(--ease-out); }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

.step-title { font-family: var(--font-display); font-size: 28px; font-weight: 400; color: #e8edf5; margin-bottom: 8px; }
.step-desc { font-size: 14px; color: var(--color-text-tertiary); margin-bottom: 32px; }
.survey-grid { display: flex; flex-direction: column; gap: 24px; }
.survey-field { display: flex; flex-direction: column; gap: 10px; }
.field-label { font-size: 14px; font-weight: 600; color: var(--color-text-secondary); letter-spacing: 0.3px; }
.option-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.chip {
  padding: 10px 20px; border-radius: var(--radius-sm);
  font-size: 14px; font-weight: 500;
  color: var(--color-text-secondary);
  background: rgba(255,255,255,0.03); border: 1px solid var(--color-border);
  cursor: pointer; transition: all 0.2s var(--ease-out);
}
.chip:hover { border-color: rgba(0,212,255,0.25); color: var(--color-text-primary); }
.chip.active { border-color: var(--color-accent-cyan); background: rgba(0,212,255,0.1); color: var(--color-accent-cyan); }

.field-input, .field-textarea {
  width: 100%; padding: 12px 16px; border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.03); border: 1px solid var(--color-border);
  color: #e8edf5; font-size: 14px;
  transition: border-color 0.2s var(--ease-out);
}
.field-input:focus, .field-textarea:focus { border-color: rgba(0,212,255,0.3); }
.field-textarea { resize: vertical; font-family: inherit; }

.slider-grid { display: flex; flex-direction: column; gap: 22px; }
.slider-row { display: flex; flex-direction: column; gap: 8px; }
.slider-header { display: flex; justify-content: space-between; align-items: center; }
.slider-label { font-size: 14px; font-weight: 500; color: var(--color-text-primary); }
.slider-value { font-size: 16px; font-family: var(--font-mono); font-weight: 700; min-width: 30px; text-align: right; transition: color 0.2s var(--ease-out); }
.slider-track-wrap { position: relative; height: 8px; }
.slider-input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; z-index: 2; }
.slider-track-bg { position: absolute; inset: 0; height: 8px; border-radius: 4px; background: rgba(255,255,255,0.06); overflow: hidden; }
.slider-track-fill { height: 100%; border-radius: 4px; transition: width 0.15s var(--ease-out), background 0.2s var(--ease-out); }
.slider-input::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #e8edf5; box-shadow: 0 0 20px rgba(0,212,255,0.5), 0 2px 8px rgba(0,0,0,0.4); cursor: pointer; }
.slider-input::-moz-range-thumb { width: 20px; height: 20px; border-radius: 50%; background: #e8edf5; border: none; box-shadow: 0 0 20px rgba(0,212,255,0.5), 0 2px 8px rgba(0,0,0,0.4); cursor: pointer; }

.survey-nav { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid var(--color-border); }
.survey-nav .btn-primary { font-size: 14px; padding: 12px 28px; }

/* ================================================================= */
/* ANALYZING                                                         */
/* ================================================================= */
.analyzing-container {
  display: flex; justify-content: center; align-items: center;
  min-height: calc(100vh - var(--header-height) - 40px);
  padding: 40px 20px;
}
.analyzing-inner { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 400px; }
.analyzing-icon-wrap {
  position: relative; width: 96px; height: 96px;
  display: flex; align-items: center; justify-content: center; margin-bottom: 28px;
}
.analyzing-icon { color: var(--color-accent-cyan); animation: pulseGlow 1.5s ease-in-out infinite; }
.analyzing-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 2px solid transparent;
  border-top-color: var(--color-accent-cyan);
  border-right-color: var(--color-accent-purple);
  animation: spin 1.2s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulseGlow { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.08); } }
.analyzing-title { font-family: var(--font-display); font-size: 24px; font-weight: 400; color: #e8edf5; margin-bottom: 20px; }
.analyzing-track { width: 240px; height: 3px; background: rgba(255,255,255,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 16px; }
.analyzing-fill { height: 100%; background: var(--color-accent-cyan); border-radius: 2px; transition: width 0.4s var(--ease-out); }
.analyzing-message { font-size: 14px; color: var(--color-text-secondary); min-height: 20px; }
.analyzing-dots { display: flex; gap: 6px; margin-top: 20px; }
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--color-accent-cyan); animation: dotBounce 1.2s ease-in-out infinite; }
@keyframes dotBounce { 0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }

/* ================================================================= */
/* RESULTS — Star-chart editorial layout                              */
/* ================================================================= */
.results {
  position: relative;
  padding: 48px 56px 72px;
  animation: fadeInUp 0.5s var(--ease-out);
}

/* Background constellation dots */
.res-stars {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}

/* ── Header ── */
.res-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.res-header-left { flex: 1; }

.res-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.3px;
  background: rgba(0, 212, 255, 0.07);
  color: var(--color-accent-cyan);
  border: 1px solid rgba(0, 212, 255, 0.1);
  margin-bottom: 12px;
}

.res-title {
  font-family: var(--font-display);
  font-size: clamp(32px, 4.5vw, 40px);
  font-weight: 400;
  color: #e8edf5;
  line-height: 1.1;
  margin-bottom: 8px;
}

.res-sub {
  font-size: 15px;
  color: var(--color-text-tertiary);
  max-width: 440px;
  line-height: 1.6;
}

.res-retake {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 20px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  transition: all 0.2s var(--ease-out);
  flex-shrink: 0;
}
.res-retake:hover {
  color: var(--color-accent-cyan);
  border-color: rgba(0, 212, 255, 0.25);
}

/* ── Metrics line ── */
.res-metrics {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.res-metric {
  font-size: 15px;
  color: var(--color-text-tertiary);
  letter-spacing: 0.2px;
}
.res-metric strong { font-weight: 600; color: #e8edf5; margin-left: 6px; }
.metric-val { font-family: var(--font-mono); font-size: 20px; }
.metric-cyan { color: var(--color-accent-cyan); }
.metric-amber { color: var(--color-accent-amber); }

.res-mdot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-text-tertiary);
  opacity: 0.3;
}

/* ── Divider ── */
.res-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.04);
  margin: 28px 0 36px;
}

/* ── Section title ── */
.res-sec-title {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  color: #e8edf5;
  margin-bottom: 20px;
}

/* ── Two-column ── */
.res-two {
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 48px;
  align-items: start;
}

@media (max-width: 820px) { .res-two { grid-template-columns: 1fr; gap: 32px; } }

/* ── Radar ── */
.res-radar .radar-body {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}
.res-radar .radar-svg {
  width: 320px;
  height: 320px;
}
@media (min-width: 1200px) {
  .res-radar .radar-svg { width: 380px; height: 380px; }
}
.radar-pt { opacity: 0; transition: opacity 0.3s var(--ease-out); }
.radar-pt--on { opacity: 1; }

/* ── Skills ── */
.skill-list { display: flex; flex-direction: column; gap: 20px; }
.skill-group-hd {
  display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
}
.skill-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.skill-cat { font-size: 14px; font-weight: 600; color: var(--color-text-primary); flex: 1; }
.skill-avg { font-size: 12px; font-family: var(--font-mono); color: var(--color-text-tertiary); font-weight: 600; }

.skill-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0 5px 16px;
}
.skill-name { font-size: 13px; color: var(--color-text-secondary); width: 95px; flex-shrink: 0; }
.skill-bar { flex: 1; height: 5px; border-radius: 3px; background: rgba(255,255,255,0.04); overflow: hidden; }
.skill-bar-fill { height: 100%; border-radius: 3px; transition: width 0.6s var(--ease-out); }
.skill-pct { font-size: 12px; font-family: var(--font-mono); font-weight: 600; width: 34px; text-align: right; }

/* ── Weaknesses ── */
.res-section { margin: 0; }
.weak-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.weak-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 500;
  color: #7eb8d4;
  background: rgba(0, 212, 255, 0.04);
  border: 1px solid rgba(0, 212, 255, 0.08);
  transition: all 0.2s var(--ease-out);
}
.weak-tag:hover {
  border-color: rgba(0, 212, 255, 0.2);
  background: rgba(0, 212, 255, 0.07);
}
.weak-count {
  font-size: 11px;
  font-family: var(--font-mono);
  opacity: 0.45;
}

/* ── Recommendations ── */
.rec-list { display: flex; flex-direction: column; gap: 12px; }
.rec-item { display: flex; gap: 12px; align-items: flex-start; }
.rec-num {
  width: 24px; height: 24px; border-radius: 50%;
  background: rgba(0,212,255,0.08);
  color: var(--color-accent-cyan);
  font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; margin-top: 1px;
}
.rec-text { font-size: 14px; color: var(--color-text-secondary); line-height: 1.65; flex: 1; }

/* ── Preferences ── */
.res-side { display: flex; flex-direction: column; gap: 32px; }

.pref-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  padding: 0;
}
.pref-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255,255,255,0.03);
}
.pref-item:last-child { border-bottom: none; }
.pref-lbl {
  font-size: 13px;
  color: var(--color-text-tertiary);
  width: 76px;
  flex-shrink: 0;
}
.pref-val {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

/* ── Timeline ── */
.tl-list { display: flex; flex-direction: column; }
.tl-item { display: flex; gap: 14px; }
.tl-marker { display: flex; flex-direction: column; align-items: center; width: 12px; flex-shrink: 0; }
.tl-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: rgba(0,212,255,0.08);
  border: 2px solid rgba(0,212,255,0.2);
  flex-shrink: 0;
}
.tl-dot--cur { background: var(--color-accent-cyan); border-color: var(--color-accent-cyan); box-shadow: 0 0 10px rgba(0,212,255,0.3); }
.tl-line { width: 1px; flex: 1; background: rgba(255,255,255,0.05); margin: 4px 0; }
.tl-body { padding-bottom: 20px; display: flex; flex-direction: column; gap: 2px; }
.tl-date { font-size: 12px; font-family: var(--font-mono); color: var(--color-text-tertiary); }
.tl-event { font-size: 14px; color: var(--color-text-primary); }
.tl-score {
  display: inline-block; font-size: 12px; font-family: var(--font-mono);
  margin-top: 4px; padding: 2px 10px; border-radius: 4px;
  font-weight: 600; width: fit-content;
}
.tl-score.up { color: var(--color-accent-emerald); background: rgba(6,214,160,0.08); }
.tl-score.down { color: var(--color-accent-rose); background: rgba(244,63,94,0.08); }

/* ================================================================= */
/* RESPONSIVE                                                         */
/* ================================================================= */
@media (max-width: 1024px) {
  .results { padding: 40px 32px 56px; }
}
@media (max-width: 820px) {
  .results { padding: 32px 20px 48px; }
  .res-header { flex-direction: column; gap: 16px; }
  .res-metrics { gap: 10px; }
  .res-two { grid-template-columns: 1fr; gap: 32px; }
  .res-radar .radar-svg { width: 280px; height: 280px; }
}
@media (max-width: 480px) {
  .res-metrics { flex-direction: column; align-items: flex-start; gap: 6px; }
  .res-mdot { display: none; }
}
</style>
