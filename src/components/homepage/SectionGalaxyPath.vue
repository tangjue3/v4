<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Map, Route, Sparkles, UserRound } from 'lucide-vue-next'
import UniverseCanvas from '@/learning-universe-3d/components/universe/UniverseCanvas.vue'
import { courses, galaxies } from '@/learning-universe-3d/data/courses'
import { learningPaths } from '@/learning-universe-3d/data/learningPaths'
import { useUniverseStore } from '@/learning-universe-3d/stores/universeStore'

const router = useRouter()
const store = useUniverseStore()
const universeRef = ref<InstanceType<typeof UniverseCanvas> | null>(null)
const activePathId = ref('systems-eng')
const activeCourseId = ref(5)

const activePath = computed(() => (
  learningPaths.find(path => path.id === activePathId.value) ?? learningPaths[0]
))

const activeCourse = computed(() => (
  courses.find(course => course.id === activeCourseId.value)
  ?? courses.find(course => course.id === activePath.value.courseSequence[0])
  ?? courses[0]
))

const activeGalaxy = computed(() => (
  galaxies.find(galaxy => galaxy.id === activeCourse.value.direction) ?? galaxies[0]
))

const pathCourses = computed(() => (
  activePath.value.courseSequence
    .map(id => courses.find(course => course.id === id))
    .filter((course): course is NonNullable<typeof course> => Boolean(course))
))

const progressStats = computed(() => {
  const sequence = activePath.value.courseSequence
  const completed = sequence.filter(id => store.getPlanetState(id) === 'completed').length
  const available = sequence.filter(id => store.getPlanetState(id) !== 'locked').length
  return {
    completed,
    available,
    total: sequence.length,
    pct: Math.round((Math.max(completed, available * 0.45) / sequence.length) * 100),
  }
})

const activeKnowledge = computed(() => activeCourse.value.knowledgePoints.slice(0, 4))

function activatePath(pathId: string) {
  activePathId.value = pathId
  store.selectedPath = pathId
  const firstCourse = learningPaths.find(path => path.id === pathId)?.courseSequence[0]
  if (firstCourse) {
    selectCourse(firstCourse)
  }
}

function selectCourse(courseId: number) {
  activeCourseId.value = courseId
  store.selectCourse(courseId)
  universeRef.value?.flyToPlanet(courseId)
}

function handlePlanetSelect(courseId: number) {
  activeCourseId.value = courseId
}

function openLearningPath() {
  router.push({
    path: '/dialogue',
    query: {
      source: 'home-profile-first',
      next: 'learning-path',
    },
  })
}

function openResources() {
  router.push({
    path: '/learning-path',
    query: {
      source: 'home-profile-preview',
    },
  })
}

onMounted(() => {
  store.selectedPath = null
  store.selectCourse(activeCourseId.value)

  window.setTimeout(() => {
    store.selectedPath = activePathId.value
    universeRef.value?.flyToPlanet(activeCourseId.value)
  }, 1200)

  window.setTimeout(() => {
    store.selectedPath = activePathId.value
  }, 3000)
})
</script>

<template>
  <section class="home-galaxy-path" aria-labelledby="home-galaxy-title">
    <div class="galaxy-copy">
      <div>
        <span class="section-kicker">PROFILE-DRIVEN PATH</span>
        <h2 id="home-galaxy-title">个性化学习路径星图</h2>
      </div>
      <p>
        学生完成画像诊断后，系统会把薄弱知识点、先修关系和学习目标编排成这张星图；资源学习、智能评估和反向更新会持续调整下一轮路径。
      </p>
    </div>

    <div class="universe-board">
      <div class="universe-stage">
        <UniverseCanvas ref="universeRef" @select-planet="handlePlanetSelect" />

        <div class="stage-overlay stage-overlay-top">
          <span>路径生成结果</span>
          <strong>{{ activePath.name }}</strong>
          <em>{{ progressStats.available }}/{{ progressStats.total }} 节点已解锁 · {{ progressStats.pct }}%</em>
        </div>

        <div class="stage-overlay stage-overlay-bottom">
          <span>当前知识节点</span>
          <strong>{{ activeCourse.name }}</strong>
        </div>
      </div>

      <aside class="path-detail" :style="{ '--phase-color': activeGalaxy.color }">
        <div class="detail-head">
          <span>{{ activeGalaxy.name }}</span>
          <strong>{{ activeCourse.name }}</strong>
          <em>{{ activeCourse.difficulty }} · {{ activeCourse.knowledgePoints.length }} 个知识点</em>
        </div>

        <div class="path-switcher" aria-label="切换学习路径">
          <button
            v-for="path in learningPaths"
            :key="path.id"
            type="button"
            :class="{ active: path.id === activePathId }"
            @click="activatePath(path.id)"
          >
            <span>{{ path.estimatedWeeks }} 周</span>
            <strong>{{ path.name }}</strong>
          </button>
        </div>

        <div class="node-list">
          <div class="panel-title">
            <Route :size="16" />
            <span>推荐路径节点</span>
          </div>
          <button
            v-for="course in pathCourses"
            :key="course.id"
            type="button"
            class="node-row"
            :class="{ active: course.id === activeCourseId }"
            @click="selectCourse(course.id)"
          >
            <div>
              <strong>{{ course.name }}</strong>
              <span>{{ store.getPlanetState(course.id) === 'locked' ? '待解锁' : '可学习' }}</span>
            </div>
            <i :style="{ width: `${course.id === activeCourseId ? 100 : 44}%` }" />
          </button>
        </div>

        <div class="evidence-list">
          <div class="panel-title">
            <Sparkles :size="16" />
            <span>节点说明</span>
          </div>
          <p>{{ activeCourse.description }}</p>
          <div class="knowledge-tags">
            <span v-for="point in activeKnowledge" :key="point.name">{{ point.name }}</span>
          </div>
        </div>

        <div class="detail-actions">
          <button type="button" class="primary-action" @click="openLearningPath">
            <UserRound :size="17" />
            先生成学习画像
          </button>
          <button type="button" class="secondary-action" @click="openResources">
            <Map :size="17" />
            查看学习路径
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.home-galaxy-path {
  position: relative;
  z-index: 1;
  max-width: 1880px;
  margin: 0 auto;
  padding: 38px 32px 22px;
}

.galaxy-copy {
  display: grid;
  grid-template-columns: minmax(0, 0.82fr) minmax(320px, 0.9fr);
  gap: 24px;
  align-items: end;
  margin-bottom: 18px;
}

.section-kicker {
  display: block;
  margin-bottom: 8px;
  color: #35e0d8;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.galaxy-copy h2 {
  margin: 0;
  color: #f7fbff;
  font-family: var(--font-display, inherit);
  font-size: clamp(28px, 2.7vw, 42px);
  font-weight: 640;
  line-height: 1.12;
  letter-spacing: 0;
}

.galaxy-copy p {
  margin: 0;
  color: #a7b8d7;
  font-size: 15px;
  line-height: 1.75;
}

.universe-board {
  display: grid;
  grid-template-columns: minmax(0, 1.58fr) minmax(360px, 0.58fr);
  gap: 16px;
  align-items: stretch;
}

.universe-stage,
.path-detail {
  min-height: clamp(560px, 52vw, 760px);
  border: 1px solid rgba(100, 140, 220, 0.15);
  border-radius: 16px;
  background:
    radial-gradient(ellipse at 52% 20%, rgba(53, 224, 216, 0.13), transparent 48%),
    linear-gradient(145deg, rgba(6, 14, 31, 0.82), rgba(3, 7, 18, 0.7));
  box-shadow:
    0 28px 86px rgba(0, 0, 0, 0.42),
    inset 0 1px 0 rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(14px) saturate(1.18);
}

.universe-stage {
  position: relative;
  overflow: hidden;
}

.universe-stage :deep(.universe-canvas) {
  position: relative;
  inset: auto;
  width: 100%;
  height: 100%;
  min-height: inherit;
}

.stage-overlay {
  position: absolute;
  z-index: 5;
  display: grid;
  gap: 3px;
  padding: 11px 13px;
  border: 1px solid rgba(53, 224, 216, 0.2);
  border-radius: 8px;
  background: rgba(5, 12, 27, 0.68);
  color: #9fb0cf;
  backdrop-filter: blur(12px);
}

.stage-overlay span,
.stage-overlay em {
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  font-style: normal;
}

.stage-overlay strong {
  color: #f7fbff;
  font-size: 14px;
}

.stage-overlay-top {
  top: 18px;
  left: 18px;
  max-width: 340px;
}

.stage-overlay-bottom {
  left: 18px;
  bottom: 18px;
}

.path-detail {
  --phase-color: #35e0d8;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow: hidden;
  padding: 18px;
}

.path-detail::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, color-mix(in srgb, var(--phase-color) 38%, transparent), transparent 1px) 0 0 / 100% 58px,
    radial-gradient(circle at 0% 0%, color-mix(in srgb, var(--phase-color) 18%, transparent), transparent 36%);
  opacity: 0.8;
}

.detail-head,
.path-switcher,
.node-list,
.evidence-list,
.detail-actions {
  position: relative;
  z-index: 1;
}

.detail-head {
  display: grid;
  gap: 4px;
  padding: 14px;
  border: 1px solid color-mix(in srgb, var(--phase-color) 28%, rgba(255, 255, 255, 0.06));
  border-radius: 10px;
  background: color-mix(in srgb, var(--phase-color) 8%, rgba(4, 9, 22, 0.7));
}

.detail-head span,
.detail-head em {
  font-family: var(--font-mono, monospace);
  font-style: normal;
}

.detail-head span {
  color: var(--phase-color);
  font-size: 10px;
  letter-spacing: 0.12em;
}

.detail-head strong {
  color: #f8fbff;
  font-size: 24px;
  line-height: 1.15;
}

.detail-head em {
  color: #96a8c7;
  font-size: 12px;
}

.path-switcher {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
}

.path-switcher button,
.node-row {
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.path-switcher button {
  min-width: 0;
  min-height: 66px;
  display: grid;
  gap: 5px;
  align-content: center;
  padding: 10px;
  border: 1px solid rgba(150, 175, 220, 0.09);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
  color: #b8c6df;
  transition: transform 0.18s ease, border-color 0.18s ease, background 0.18s ease;
}

.path-switcher button:hover,
.path-switcher button.active {
  transform: translateY(-2px);
  border-color: color-mix(in srgb, var(--phase-color) 58%, rgba(255, 255, 255, 0.1));
  background: color-mix(in srgb, var(--phase-color) 12%, rgba(255, 255, 255, 0.04));
}

.path-switcher span {
  color: var(--phase-color);
  font-family: var(--font-mono, monospace);
  font-size: 10px;
  font-weight: 760;
}

.path-switcher strong {
  color: #edf5ff;
  font-size: 12px;
  line-height: 1.25;
}

.node-list,
.evidence-list {
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid rgba(150, 175, 220, 0.1);
  border-radius: 10px;
  background: rgba(4, 9, 22, 0.45);
}

.node-list {
  max-height: 260px;
  overflow: auto;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--phase-color);
  font-size: 13px;
  font-weight: 740;
}

.node-row {
  display: grid;
  gap: 8px;
  padding: 10px;
  border: 1px solid rgba(150, 175, 220, 0.08);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.035);
}

.node-row:hover,
.node-row.active {
  border-color: color-mix(in srgb, var(--phase-color) 42%, rgba(255, 255, 255, 0.08));
  background: color-mix(in srgb, var(--phase-color) 9%, rgba(255, 255, 255, 0.035));
}

.node-row div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.node-row strong {
  color: #eaf2ff;
  font-size: 13px;
}

.node-row span {
  color: #8294b6;
  font-family: var(--font-mono, monospace);
  font-size: 11px;
  white-space: nowrap;
}

.node-row > i {
  display: block;
  height: 5px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--phase-color), rgba(219, 234, 254, 0.8));
  box-shadow: 0 0 12px color-mix(in srgb, var(--phase-color) 38%, transparent);
}

.evidence-list p {
  margin: 0;
  color: #9fb0cf;
  font-size: 12px;
  line-height: 1.55;
}

.knowledge-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.knowledge-tags span {
  max-width: 100%;
  padding: 6px 8px;
  border: 1px solid color-mix(in srgb, var(--phase-color) 20%, rgba(255, 255, 255, 0.08));
  border-radius: 6px;
  color: #dcecff;
  background: rgba(255, 255, 255, 0.04);
  font-size: 11px;
}

.detail-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
  margin-top: auto;
}

.detail-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 42px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 760;
  cursor: pointer;
}

.primary-action {
  border: none;
  color: #04111f;
  background: linear-gradient(135deg, var(--phase-color), color-mix(in srgb, var(--phase-color) 64%, #dbeafe));
}

.secondary-action {
  border: 1px solid color-mix(in srgb, var(--phase-color) 30%, rgba(255, 255, 255, 0.08));
  color: #dcecff;
  background: rgba(255, 255, 255, 0.045);
}

@media (max-width: 1180px) {
  .galaxy-copy,
  .universe-board {
    grid-template-columns: 1fr;
  }

  .universe-stage,
  .path-detail {
    min-height: 560px;
  }
}

@media (max-width: 720px) {
  .home-galaxy-path {
    padding: 28px 14px 18px;
  }

  .galaxy-copy {
    gap: 10px;
  }

  .galaxy-copy h2 {
    font-size: 26px;
  }

  .universe-stage {
    min-height: 440px;
  }

  .path-detail {
    min-height: 0;
    padding: 14px;
  }

  .path-switcher,
  .detail-actions {
    grid-template-columns: 1fr;
  }
}
</style>
