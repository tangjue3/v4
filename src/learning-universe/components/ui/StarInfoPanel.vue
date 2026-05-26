<template>
  <Transition name="panel-slide">
    <aside v-if="visible" class="star-panel glass-panel-strong" :class="[`mode-${mode}`]">
      <div class="accent-line left" :style="{ background: directionColor, boxShadow: `0 0 12px ${directionColor}66` }"></div>

      <button class="panel-close glass-button" @click="$emit('close')">
        <X :size="14" />
      </button>

      <div v-if="mode === 'mini'" class="mini-content">
        <div class="status-dot" :class="state"></div>
        <div class="mini-info">
          <span class="mini-name">{{ course?.name }}</span>
          <span class="mini-desc">{{ course?.description }}</span>
        </div>
      </div>

      <template v-else-if="mode === 'standard'">
        <div class="panel-header">
          <div class="header-top">
            <span class="tag" :class="`tag-${directionTagClass}`">{{ directionLabel }}</span>
            <span class="tag" :class="difficultyTagClass">{{ course?.difficulty }}</span>
            <span class="tag" :class="stateTagClass">{{ stateLabel }}</span>
          </div>
          <h2 class="panel-title">{{ course?.name }}</h2>
          <p class="panel-desc">{{ course?.description }}</p>
        </div>

        <div v-if="state === 'locked'" class="locked-section">
          <Lock :size="32" class="lock-icon" />
          <p class="locked-text">课程未解锁</p>
          <p class="locked-hint">请先完成前置课程：</p>
          <div class="prereq-list">
            <button
              v-for="pid in course?.prerequisites ?? []"
              :key="pid"
              class="prereq-item glass-panel-light"
              @click="$emit('selectCourse', pid)"
            >
              <div class="status-dot" :class="store.getPlanetState(pid)"></div>
              {{ getCourseName(pid) }}
            </button>
          </div>
        </div>

        <template v-else>
          <div class="stats-row">
            <div class="stat-item glass-panel-light">
              <Trophy :size="13" class="stat-icon" :style="{ color: directionColor }" />
              <div class="stat-data">
                <span class="stat-value font-display">{{ overallScore }}</span>
                <span class="stat-label">总分</span>
              </div>
            </div>
            <div class="stat-item glass-panel-light">
              <Clock :size="13" class="stat-icon" style="color: #8899bb" />
              <div class="stat-data">
                <span class="stat-value font-display">{{ courseV2?.estimatedHours || '—' }}</span>
                <span class="stat-label">小时</span>
              </div>
            </div>
            <div class="stat-item glass-panel-light">
              <ClipboardCheck :size="13" class="stat-icon" style="color: #81C784" />
              <div class="stat-data">
                <span class="stat-value font-display">{{ labProgress.completed }}/{{ labProgress.total }}</span>
                <span class="stat-label">实验</span>
              </div>
            </div>
          </div>

          <div class="tab-bar">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              class="tab-btn glass-button"
              :class="{ active: activeTab === tab.id }"
              @click="activeTab = tab.id"
            >
              <component :is="tab.icon" :size="13" />
              <span>{{ tab.label }}</span>
            </button>
          </div>

          <div class="tab-content">
            <div v-if="activeTab === 'overview'" class="overview-tab">
              <div v-if="courseV2?.objectives?.length" class="section">
                <h4 class="section-title">学习目标</h4>
                <div v-for="obj in courseV2.objectives" :key="obj.description" class="objective-item glass-panel-light">
                  <span class="bloom-level" :class="obj.level.replace('-', '')">{{ obj.level }}</span>
                  {{ obj.description }}
                </div>
              </div>

              <div v-if="course?.knowledgePoints?.length" class="section">
                <h4 class="section-title">知识点</h4>
                <div class="kp-list">
                  <button
                    v-for="kp in course.knowledgePoints"
                    :key="kp.name"
                    class="kp-item glass-panel-light"
                    @click="$emit('selectKnowledgePoint', kp.name, $event)"
                  >
                    <span class="kp-diff" :class="kp.difficulty">{{ kp.difficulty }}</span>
                    <span class="kp-name">{{ kp.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <div v-if="activeTab === 'code'" class="code-tab">
              <div v-if="courseV2?.codeExamples?.length" class="code-list">
                <div v-for="ex in courseV2.codeExamples" :key="ex.id" class="code-item glass-panel-light">
                  <div class="code-item-header">
                    <span class="code-item-title">{{ ex.title }}</span>
                    <span class="code-item-level tag tag-purple">{{ ex.level }}</span>
                  </div>
                  <p class="code-item-desc">{{ ex.description }}</p>
                  <button class="action-btn small" @click="$emit('openCodePlayground', ex.id)">
                    <Play :size="12" /> 运行
                  </button>
                </div>
              </div>
              <div v-else class="empty-hint">暂无代码示例</div>
            </div>

            <div v-if="activeTab === 'lab'" class="lab-tab">
              <div v-if="courseV2?.labTaskIds?.length" class="lab-list">
                <div v-for="labId in courseV2.labTaskIds" :key="labId" class="lab-item glass-panel-light">
                  <span class="lab-status" :class="labProgressMap[labId]?.completed ? 'done' : 'pending'">
                    {{ labProgressMap[labId]?.completed ? '✓' : '○' }}
                  </span>
                  <span class="lab-title">{{ getLabTitle(labId) }}</span>
                  <button class="action-btn small green" @click="$emit('openLab', labId)">
                    {{ labProgressMap[labId]?.completed ? '重做' : '开始' }}
                  </button>
                </div>
              </div>
              <div v-else class="empty-hint">暂无实验任务</div>
            </div>

            <div v-if="activeTab === 'faq'" class="faq-tab">
              <div v-if="courseV2?.faqItems?.length" class="faq-list">
                <button
                  v-for="faq in courseV2.faqItems"
                  :key="faq.id"
                  class="faq-item glass-panel-light"
                  @click="$emit('openFaq', faq.id)"
                >
                  <HelpCircle :size="14" class="faq-icon" />
                  <span>{{ faq.question }}</span>
                </button>
              </div>
              <div v-else class="empty-hint">暂无常见问题</div>
            </div>
          </div>

          <div class="panel-actions">
            <button class="action-btn primary" @click="$emit('startLearning')">
              <Rocket :size="14" /> 开始学习
            </button>
            <button class="action-btn" @click="$emit('startAssessment')">
              <FileText :size="14" /> 自测
            </button>
            <button v-if="state === 'available'" class="action-btn" @click="$emit('complete')">
              <CheckCircle :size="14" /> 完成
            </button>
          </div>
        </template>
      </template>

      <template v-else-if="mode === 'learning'">
        <div class="learning-header">
          <button class="action-btn back-btn" @click="$emit('exitLearning')">
            <ArrowLeft :size="14" /> 返回
          </button>
          <h2 class="learning-title">{{ course?.name }}</h2>
          <div class="learning-progress">
            <div class="energy-bar">
              <div class="energy-bar-fill learning-fill" :style="{ width: learningProgress + '%' }"></div>
            </div>
            <span class="font-display lp-pct">{{ learningProgress }}%</span>
          </div>
        </div>

        <div class="learning-tabs">
          <button
            v-for="lt in learningTabs"
            :key="lt.id"
            class="tab-btn glass-button"
            :class="{ active: activeLearningTab === lt.id }"
            @click="activeLearningTab = lt.id"
          >
            <component :is="lt.icon" :size="12" />
            <span>{{ lt.label }}</span>
          </button>
        </div>

        <div class="learning-content">
          <div v-if="activeLearningTab === 'knowledge'" class="lc-section">
            <div v-for="(kp, idx) in course?.knowledgePoints ?? []" :key="kp.name" class="lc-kp glass-panel-light">
              <div class="lc-kp-header" @click="toggleKp(idx)">
                <span class="lc-kp-num" :style="{ background: directionColor + '22', color: directionColor }">{{ idx + 1 }}</span>
                <span class="lc-kp-name">{{ kp.name }}</span>
                <ChevronDown :size="14" class="lc-kp-chevron" :class="{ open: expandedKps.has(idx) }" />
              </div>
              <Transition name="expand">
                <div v-if="expandedKps.has(idx)" class="lc-kp-body">
                  <p>{{ kp.description }}</p>
                  <span class="kp-diff" :class="kp.difficulty">{{ kp.difficulty }}</span>
                </div>
              </Transition>
            </div>
          </div>

          <div v-if="activeLearningTab === 'code'" class="lc-section">
            <div v-for="ex in courseV2?.codeExamples ?? []" :key="ex.id" class="lc-code-item glass-panel-light">
              <h4 class="lc-code-title">{{ ex.title }}</h4>
              <pre class="code-block"><code>{{ ex.code }}</code></pre>
              <div v-if="ex.output" class="code-output">
                <span class="output-label">输出</span>
                <code>{{ ex.output }}</code>
              </div>
              <button class="action-btn small" @click="$emit('openCodePlayground', ex.id)">
                <Play :size="12" /> 在沙盒中运行
              </button>
            </div>
          </div>

          <div v-if="activeLearningTab === 'lab'" class="lc-section">
            <div v-for="labId in courseV2?.labTaskIds ?? []" :key="labId" class="lc-lab-item glass-panel-light">
              <h4 class="lc-lab-title">{{ getLabTitle(labId) }}</h4>
              <button class="action-btn green full-width" @click="$emit('openLab', labId)">
                {{ labProgressMap[labId]?.completed ? '重新开始' : '开始实验' }}
              </button>
            </div>
          </div>

          <div v-if="activeLearningTab === 'assessment'" class="lc-section">
            <p class="lc-hint">通过评估测试检验你的学习成果</p>
            <button class="action-btn primary full-width" @click="$emit('startAssessment')">
              <FileText :size="14" /> 开始评估
            </button>
          </div>

          <div v-if="activeLearningTab === 'faq'" class="lc-section">
            <div v-for="faq in courseV2?.faqItems ?? []" :key="faq.id" class="lc-faq-item glass-panel-light">
              <button class="faq-item" @click="$emit('openFaq', faq.id)">
                <HelpCircle :size="14" class="faq-icon" />
                <span>{{ faq.question }}</span>
              </button>
            </div>
          </div>
        </div>

        <div class="learning-footer">
          <button v-if="state !== 'completed'" class="action-btn primary full-width" @click="$emit('complete')">
            <CheckCircle :size="14" /> 标记课程完成
          </button>
        </div>
      </template>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  X, Lock, Trophy, Clock, ClipboardCheck, Play,
  FileText, CheckCircle, Rocket, ArrowLeft, ChevronDown, HelpCircle,
  BookOpen, Code2, FlaskConical, ClipboardList, MessageCircle,
} from '@lucide/vue'
import { useUniverseStore } from '../../stores/universeStore'
import { courses } from '../../data/courses'
import { coursesV2 } from '../../data/coursesV2'
import { labTasks } from '../../data/labTasks'
import type { Course, CourseV2 } from '../../types'

const props = withDefaults(defineProps<{
  visible: boolean
  mode: 'mini' | 'standard' | 'learning'
}>(), {
  mode: 'standard',
})

const emit = defineEmits<{
  close: []
  startLearning: []
  exitLearning: []
  complete: []
  startAssessment: []
  openCodePlayground: [codeExampleId: string]
  openLab: [labTaskId: string]
  openFaq: [faqId: string]
  selectKnowledgePoint: [name: string, event: MouseEvent]
  selectCourse: [courseId: number]
}>()

const store = useUniverseStore()

const activeTab = ref('overview')
const activeLearningTab = ref('knowledge')
const expandedKps = ref(new Set<number>())

const course = computed<Course | null>(() => {
  if (!store.selectedCourseId) return null
  return courses.find((c) => c.id === store.selectedCourseId) || null
})

const courseV2 = computed<CourseV2 | null>(() => {
  if (!store.selectedCourseId) return null
  return coursesV2.find((c) => c.id === store.selectedCourseId) || null
})

const state = computed(() => {
  if (!store.selectedCourseId) return 'locked'
  return store.getPlanetState(store.selectedCourseId)
})

const stateLabel = computed(() => {
  const map: Record<string, string> = { locked: '未解锁', available: '可学习', completed: '已完成' }
  return map[state.value] || state.value
})

const directionColor = computed(() => {
  const map: Record<string, string> = {
    programming: '#4FC3F7', systems: '#81C784', software: '#FFB74D', ai: '#BA68C8', frontier: '#E57373',
  }
  return map[course.value?.direction || ''] || '#4FC3F7'
})

const directionTagClass = computed(() => {
  const map: Record<string, string> = {
    programming: 'blue', systems: 'green', software: 'amber', ai: 'purple', frontier: 'red',
  }
  return map[course.value?.direction || ''] || 'blue'
})

const difficultyTagClass = computed(() => {
  const map: Record<string, string> = { '入门': 'tag-green', '进阶': 'tag-amber', '高级': 'tag-red' }
  return map[course.value?.difficulty || ''] || 'tag-amber'
})

const stateTagClass = computed(() => {
  const map: Record<string, string> = { locked: 'tag', available: 'tag-blue', completed: 'tag-green' }
  return map[state.value] || 'tag'
})

const directionLabel = computed(() => {
  const map: Record<string, string> = {
    programming: '编程与算法', systems: '计算机系统', software: '软件工程', ai: '人工智能', frontier: '前沿技术',
  }
  return map[course.value?.direction || ''] || ''
})

const overallScore = computed(() => {
  if (!store.selectedCourseId) return 0
  return store.courseOverallScore(store.selectedCourseId)
})

const labProgress = computed(() => {
  if (!store.selectedCourseId) return { completed: 0, total: 0 }
  return store.courseLabProgress(store.selectedCourseId)
})

const labProgressMap = computed(() => store.labProgress)

const learningProgress = computed(() => {
  if (state.value === 'completed') return 100
  const total = (courseV2.value?.objectives?.length || 0) + (courseV2.value?.codeExamples?.length || 0) + labProgress.value.total
  if (total === 0) return 0
  const done = labProgress.value.completed + (Object.keys(store.assessmentResults).includes(String(store.selectedCourseId)) ? 1 : 0)
  return Math.min(99, Math.round((done / total) * 100))
})

const tabs = [
  { id: 'overview', label: '概览', icon: BookOpen },
  { id: 'code', label: '代码', icon: Code2 },
  { id: 'lab', label: '实验', icon: FlaskConical },
  { id: 'faq', label: 'FAQ', icon: MessageCircle },
]

const learningTabs = [
  { id: 'knowledge', label: '知识', icon: BookOpen },
  { id: 'code', label: '代码', icon: Code2 },
  { id: 'lab', label: '实验', icon: FlaskConical },
  { id: 'assessment', label: '测试', icon: ClipboardList },
  { id: 'faq', label: 'FAQ', icon: MessageCircle },
]

watch(() => props.mode, (m) => {
  if (m === 'learning') activeLearningTab.value = 'knowledge'
  else if (m === 'standard') activeTab.value = 'overview'
})

function getCourseName(id: number) {
  return courses.find((c) => c.id === id)?.name || `课程#${id}`
}

function getLabTitle(labId: string) {
  return labTasks.find((l) => l.id === labId)?.title || labId
}

function toggleKp(idx: number) {
  const s = new Set(expandedKps.value)
  if (s.has(idx)) s.delete(idx)
  else s.add(idx)
  expandedKps.value = s
}
</script>

<style scoped>
.star-panel {
  position: fixed;
  top: calc(60px + var(--hud-height));
  right: 0;
  bottom: 0;
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-left: 1px solid var(--glass-border);
  border-radius: 16px 0 0 16px;
}

.star-panel.mode-mini { width: 280px; }
.star-panel.mode-standard { width: 420px; }
.star-panel.mode-learning { width: 600px; }

.panel-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  color: var(--text-muted);
  z-index: 1;
}

.panel-close:hover {
  color: var(--text-secondary);
  border-color: rgba(255, 255, 255, 0.12);
}

/* ─── Mini mode ─── */
.mini-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
}

.mini-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.mini-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mini-desc {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── Standard mode header ─── */
.panel-header {
  padding: 20px 24px 16px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
}

.panel-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 6px;
  letter-spacing: -0.01em;
}

.panel-desc {
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

/* ─── Locked state ─── */
.locked-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 24px;
  text-align: center;
}

.lock-icon { color: var(--status-locked); opacity: 0.5; }
.locked-text { font-size: 16px; font-weight: 600; color: var(--text-secondary); }
.locked-hint { font-size: 13px; color: var(--text-muted); }

.prereq-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
  width: 100%;
  max-width: 260px;
}

.prereq-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  text-align: left;
  width: 100%;
}

.prereq-item:hover {
  border-color: rgba(79, 195, 247, 0.2);
  color: var(--text-primary);
}

/* ─── Stats row ─── */
.stats-row {
  display: flex;
  gap: 8px;
  padding: 0 24px 16px;
}

.stat-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
}

.stat-data {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.1;
}

.stat-label {
  font-size: 10px;
  color: var(--text-muted);
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-icon {
  flex-shrink: 0;
}

/* ─── Tab bar ─── */
.tab-bar {
  display: flex;
  gap: 4px;
  padding: 0 24px 12px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  border-radius: 6px;
}

.tab-btn:hover { color: var(--text-secondary); }

.tab-btn.active {
  color: var(--text-primary);
  background: rgba(79, 195, 247, 0.1);
  border-color: rgba(79, 195, 247, 0.2);
}

/* ─── Tab content ─── */
.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.06) transparent;
}

.section { margin-bottom: 20px; }

.objective-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin-bottom: 6px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
}

.bloom-level {
  font-size: 10px;
  font-weight: 600;
  padding: 1px 6px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
}

.bloom-level.L1认知 { color: var(--accent-blue); background: rgba(79, 195, 247, 0.1); }
.bloom-level.L2应用 { color: var(--accent-amber); background: rgba(255, 183, 77, 0.1); }
.bloom-level.L3综合 { color: var(--accent-red); background: rgba(229, 115, 115, 0.1); }

.kp-list { display: flex; flex-direction: column; gap: 4px; }

.kp-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--duration-fast) ease;
  text-align: left;
  width: 100%;
}

.kp-item:hover {
  border-color: rgba(79, 195, 247, 0.2);
  color: var(--text-primary);
}

.kp-diff {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--radius-full);
}

.kp-diff.入门 { color: var(--accent-green); background: rgba(129, 199, 132, 0.1); }
.kp-diff.进阶 { color: var(--accent-amber); background: rgba(255, 183, 77, 0.1); }
.kp-diff.高级 { color: var(--accent-red); background: rgba(229, 115, 115, 0.1); }

.code-list, .lab-list, .faq-list { display: flex; flex-direction: column; gap: 6px; }

.code-item, .faq-item {
  padding: 12px 14px;
  border-radius: var(--radius-md);
  transition: all var(--duration-fast) ease;
}

.faq-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  text-align: left;
  width: 100%;
}

.faq-item:hover {
  border-color: rgba(79, 195, 247, 0.2);
  color: var(--text-primary);
}

.faq-icon { flex-shrink: 0; color: var(--accent-amber); }

.code-item-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.code-item-title { font-size: 13px; font-weight: 600; color: var(--text-primary); }
.code-item-desc { font-size: 12px; color: var(--text-muted); margin-bottom: 8px; }

.lab-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
}

.lab-status { font-size: 14px; }
.lab-status.done { color: var(--status-completed); }
.lab-status.pending { color: var(--text-muted); }

.lab-title { flex: 1; font-size: 13px; color: var(--text-secondary); }

.empty-hint {
  text-align: center;
  padding: 32px 0;
  font-size: 13px;
  color: var(--text-muted);
}

/* ─── Actions ─── */
.panel-actions {
  display: flex;
  gap: 8px;
  padding: 14px 24px;
  border-top: 1px solid var(--glass-border);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out-expo);
  font-family: inherit;
  white-space: nowrap;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  border-color: rgba(255, 255, 255, 0.12);
}

.action-btn:active {
  transform: scale(0.97);
}

.action-btn.primary {
  background: rgba(79, 195, 247, 0.1);
  border-color: rgba(79, 195, 247, 0.2);
  color: var(--accent-blue);
}

.action-btn.primary:hover {
  background: rgba(79, 195, 247, 0.18);
  border-color: rgba(79, 195, 247, 0.35);
  box-shadow: 0 0 20px rgba(79, 195, 247, 0.15);
}

.action-btn.small {
  padding: 4px 12px;
  font-size: 11px;
}

.action-btn.green {
  color: var(--accent-green);
  background: rgba(129, 199, 132, 0.08);
  border-color: rgba(129, 199, 132, 0.15);
}

.action-btn.green:hover {
  background: rgba(129, 199, 132, 0.15);
  border-color: rgba(129, 199, 132, 0.3);
  box-shadow: 0 0 16px rgba(129, 199, 132, 0.1);
}

.action-btn.full-width { width: 100%; justify-content: center; }

.back-btn {
  margin-bottom: 12px;
}

/* ─── Learning mode ─── */
.learning-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--glass-border);
}

.learning-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 12px;
}

.learning-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.learning-fill {
  background: linear-gradient(90deg, var(--accent-blue), var(--accent-green));
}

.lp-pct { font-size: 12px; color: var(--text-muted); min-width: 32px; }

.learning-tabs {
  display: flex;
  gap: 4px;
  padding: 12px 24px;
}

.learning-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 24px 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.06) transparent;
}

.lc-section { display: flex; flex-direction: column; gap: 6px; }

.lc-kp {
  border-radius: var(--radius-md);
  overflow: hidden;
}

.lc-kp-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  cursor: pointer;
  transition: background var(--duration-fast) ease;
}

.lc-kp-header:hover { background: rgba(255, 255, 255, 0.02); }

.lc-kp-num {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  border-radius: 50%;
  flex-shrink: 0;
}

.lc-kp-name { flex: 1; font-size: 13px; color: var(--text-primary); }

.lc-kp-chevron {
  color: var(--text-muted);
  transition: transform var(--duration-fast) ease;
}

.lc-kp-chevron.open { transform: rotate(180deg); }

.lc-kp-body {
  padding: 0 14px 12px;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.lc-code-item, .lc-lab-item, .lc-faq-item {
  padding: 14px;
  border-radius: var(--radius-md);
}

.lc-code-title, .lc-lab-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px;
}

.code-block {
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-md);
  padding: 14px;
  font-size: 12px;
  line-height: 1.6;
  color: #c9d1d9;
  overflow-x: auto;
  margin: 0 0 8px;
  font-family: 'Fira Code', 'Consolas', monospace;
}

.code-output {
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-sm);
  font-size: 12px;
  margin-bottom: 8px;
}

.output-label { color: var(--accent-green); font-size: 11px; margin-right: 6px; }

.lc-hint { font-size: 13px; color: var(--text-muted); margin-bottom: 12px; }

.learning-footer {
  padding: 14px 24px;
  border-top: 1px solid var(--glass-border);
}

/* ─── Animations ─── */
.panel-slide-enter-active { transition: all 0.4s var(--ease-out-expo); }
.panel-slide-leave-active { transition: all 0.25s ease; }
.panel-slide-enter-from { opacity: 0; transform: translateX(60px); }
.panel-slide-leave-to { opacity: 0; transform: translateX(40px); }

.expand-enter-active { transition: all 0.25s var(--ease-out-expo); }
.expand-leave-active { transition: all 0.15s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; overflow: hidden; }
</style>
