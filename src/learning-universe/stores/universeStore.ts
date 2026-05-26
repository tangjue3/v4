import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlanetState, DirectionId, AssessmentResult, LabProgress, Achievement, LearningStreak, ModalState, ActivityLogEntry } from '../types'
import { courses, galaxies } from '../data/courses'
import { labTasks } from '../data/labTasks'
import { achievements as achievementDefs } from '../data/achievements'

const STORAGE_KEY = 'universe-learning-progress'
const V2_STORAGE_KEY = 'universe-learning-v2'

export const useUniverseStore = defineStore('universe', () => {
  const planetStates = ref<Record<number, PlanetState>>(loadProgress())
  const selectedCourseId = ref<number | null>(null)

  const assessmentResults = ref<Record<number, AssessmentResult>>(loadV2Data('assessmentResults') || {})
  const labProgress = ref<Record<string, LabProgress>>(loadV2Data('labProgress') || {})
  const unlockedAchievements = ref<Achievement[]>(loadV2Data('achievements') || [])
  const learningStreak = ref<LearningStreak>(loadV2Data('learningStreak') || { currentStreak: 0, lastStudyDate: '', totalStudyMinutes: 0 })
  const selectedPath = ref<string | null>(null)
  const modalStack = ref<ModalState[]>([])
  const showPathPlanner = ref(false)
  const showKnowledgeGraph = ref(false)
  const showDashboard = ref(false)
  const customPathSequence = ref<number[]>(loadV2Data('customPathSequence') || [])
  const activeDetailTab = ref<string>('overview')
  const activeFloatingCard = ref<{ type: string; targetId: string; x: number; y: number } | null>(null)
  const activityLog = ref<ActivityLogEntry[]>(loadV2Data('activityLog') || [])
  const showCourseDropdown = ref(false)

  function loadProgress(): Record<number, PlanetState> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    const init: Record<number, PlanetState> = {}
    courses.forEach((c) => {
      init[c.id] = c.prerequisites.length === 0 ? 'available' : 'locked'
    })
    return init
  }

  function loadV2Data<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`${V2_STORAGE_KEY}-${key}`)
      if (raw) return JSON.parse(raw)
    } catch {}
    return null
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(planetStates.value))
  }

  function saveV2Progress() {
    localStorage.setItem(`${V2_STORAGE_KEY}-assessmentResults`, JSON.stringify(assessmentResults.value))
    localStorage.setItem(`${V2_STORAGE_KEY}-labProgress`, JSON.stringify(labProgress.value))
    localStorage.setItem(`${V2_STORAGE_KEY}-achievements`, JSON.stringify(unlockedAchievements.value))
    localStorage.setItem(`${V2_STORAGE_KEY}-learningStreak`, JSON.stringify(learningStreak.value))
    localStorage.setItem(`${V2_STORAGE_KEY}-activityLog`, JSON.stringify(activityLog.value))
    localStorage.setItem(`${V2_STORAGE_KEY}-customPathSequence`, JSON.stringify(customPathSequence.value))
  }

  function getCourseNameById(id: number): string {
    return courses.find((c) => c.id === id)?.name || `课程#${id}`
  }

  function addActivityLog(type: ActivityLogEntry['type'], courseId: number | undefined, description: string) {
    const entry: ActivityLogEntry = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type,
      courseId,
      courseName: courseId ? getCourseNameById(courseId) : undefined,
      timestamp: Date.now(),
      description,
    }
    activityLog.value.unshift(entry)
    if (activityLog.value.length > 50) {
      activityLog.value = activityLog.value.slice(0, 50)
    }
    saveV2Progress()
  }

  function getPlanetState(courseId: number): PlanetState {
    return planetStates.value[courseId] || 'locked'
  }

  function selectCourse(courseId: number | null) {
    selectedCourseId.value = courseId
  }

  function completeCourse(courseId: number) {
    planetStates.value[courseId] = 'completed'
    courses.forEach((c) => {
      if (c.prerequisites.includes(courseId)) {
        const allPrereqsDone = c.prerequisites.every((pid) => planetStates.value[pid] === 'completed')
        if (allPrereqsDone && planetStates.value[c.id] === 'locked') {
          planetStates.value[c.id] = 'available'
        }
      }
    })
    recordStudyActivity()
    checkAchievements()
    saveProgress()
    saveV2Progress()
    addActivityLog('complete-course', courseId, `完成了「${getCourseNameById(courseId)}」课程`)
  }

  function resetProgress() {
    courses.forEach((c) => {
      planetStates.value[c.id] = c.prerequisites.length === 0 ? 'available' : 'locked'
    })
    assessmentResults.value = {}
    labProgress.value = {}
    unlockedAchievements.value = []
    learningStreak.value = { currentStreak: 0, lastStudyDate: '', totalStudyMinutes: 0 }
    selectedPath.value = null
    saveProgress()
    saveV2Progress()
  }

  function recordAssessmentResult(courseId: number, result: AssessmentResult) {
    assessmentResults.value[courseId] = result
    recordStudyActivity()
    checkAchievements()
    saveV2Progress()
    const pct = Math.round((result.correctAnswers / result.totalQuestions) * 100)
    addActivityLog('pass-assessment', courseId, `通过了「${getCourseNameById(courseId)}」评估 (正确率 ${pct}%)`)
  }

  function updateLabProgress(labTaskId: string, progress: Partial<LabProgress>) {
    const existing = labProgress.value[labTaskId] || { currentStep: 0, completed: false, startedAt: Date.now() }
    const wasCompleted = existing.completed
    labProgress.value[labTaskId] = { ...existing, ...progress }
    recordStudyActivity()
    checkAchievements()
    saveV2Progress()
    if (!wasCompleted && progress.completed) {
      const labDef = labTasks.find((l) => l.id === labTaskId)
      addActivityLog('complete-lab', labDef?.courseId, `完成了实验任务「${labTaskId}」`)
    }
  }

  function startLab(labTaskId: string) {
    if (!labProgress.value[labTaskId]) {
      labProgress.value[labTaskId] = { currentStep: 0, completed: false, startedAt: Date.now() }
      saveV2Progress()
    }
  }

  function recordStudyActivity(minutes = 15) {
    const today = new Date().toISOString().slice(0, 10)
    const streak = learningStreak.value
    streak.totalStudyMinutes += minutes
    if (streak.lastStudyDate === today) return
    if (streak.lastStudyDate) {
      const lastDate = new Date(streak.lastStudyDate)
      const todayDate = new Date(today)
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      streak.currentStreak = diffDays === 1 ? streak.currentStreak + 1 : 1
    } else {
      streak.currentStreak = 1
    }
    streak.lastStudyDate = today
  }

  function checkAchievements() {
    const completedIds = new Set(unlockedAchievements.value.map((a) => a.id))
    achievementDefs.forEach((def) => {
      if (completedIds.has(def.id)) return
      let unlocked = false

      if (def.id.startsWith('explorer-') || def.id === 'first-course') {
        const thresholds: Record<string, number> = {
          'first-course': 1,
          'explorer-5': 5,
          'explorer-10': 10,
          'explorer-15': 15,
          'explorer-24': 24,
        }
        unlocked = completedCount.value >= (thresholds[def.id] ?? Infinity)
      } else if (def.id.endsWith('-master')) {
        const directionId = def.id.replace('-master', '') as DirectionId
        const dp = directionProgress.value[directionId]
        if (dp) {
          unlocked = dp.completed === dp.total
        }
      } else if (def.id === 'first-assessment') {
        unlocked = Object.keys(assessmentResults.value).length >= 1
      } else if (def.id === 'first-lab') {
        unlocked = Object.values(labProgress.value).some((l) => l.completed)
      } else if (def.id === 'streak-7') {
        unlocked = learningStreak.value.currentStreak >= 7
      } else if (def.id === 'streak-30') {
        unlocked = learningStreak.value.currentStreak >= 30
      }

      if (unlocked) {
        unlockedAchievements.value.push({ ...def, unlockedAt: Date.now() })
        addActivityLog('unlock-achievement', undefined, `解锁了成就「${def.title}」`)
      }
    })
  }

  function openModal(modal: ModalState) {
    modalStack.value.push(modal)
  }

  function closeModal() {
    modalStack.value.pop()
  }

  function closeAllModals() {
    modalStack.value = []
  }

  function isModalOpen(name: string): boolean {
    return modalStack.value.some((m) => m.name === name)
  }

  function getModalParams(name: string): Record<string, unknown> | undefined {
    const modal = modalStack.value.find((m) => m.name === name)
    return modal?.params
  }

  const completedCount = computed(() =>
    Object.values(planetStates.value).filter((s) => s === 'completed').length,
  )

  const totalCount = computed(() => courses.length)

  const directionProgress = computed(() => {
    const result: Record<DirectionId, { completed: number; total: number }> = {
      programming: { completed: 0, total: 0 },
      systems: { completed: 0, total: 0 },
      software: { completed: 0, total: 0 },
      ai: { completed: 0, total: 0 },
      frontier: { completed: 0, total: 0 },
    }
    galaxies.forEach((g) => {
      result[g.id].total = g.planetIds.length
      result[g.id].completed = g.planetIds.filter((id) => planetStates.value[id] === 'completed').length
    })
    return result
  })

  const progressPercent = computed(() =>
    totalCount.value > 0 ? Math.round((completedCount.value / totalCount.value) * 100) : 0,
  )

  const currentModal = computed(() => {
    const stack = modalStack.value
    return stack.length > 0 ? stack[stack.length - 1] : null
  })

  function courseAssessmentProgress(courseId: number) {
    const result = assessmentResults.value[courseId]
    if (!result) return { conceptual: 0, coding: 0 }
    return { conceptual: result.conceptual, coding: result.coding }
  }

  function courseLabProgress(courseId: number) {
    const courseLabs = labTasks.filter((l) => l.courseId === courseId)
    if (courseLabs.length === 0) return { completed: 0, total: 0 }
    const completed = courseLabs.filter((l) => labProgress.value[l.id]?.completed).length
    return { completed, total: courseLabs.length }
  }

  function courseOverallScore(courseId: number): number {
    const assessment = assessmentResults.value[courseId]
    if (!assessment) return 0
    const state = getPlanetState(courseId)
    const completionBonus = state === 'completed' ? 20 : 0
    const assessmentScore = (assessment.conceptual * 0.4 + assessment.coding * 0.4)
    return Math.min(100, Math.round(assessmentScore + completionBonus))
  }

  function nextRecommendedCourses() {
    return courses.filter((c) => {
      if (planetStates.value[c.id] !== 'available') return false
      return c.prerequisites.every((pid) => planetStates.value[pid] === 'completed')
    }).slice(0, 3)
  }

  const dailyStudyMap = computed(() => {
    const map: Record<string, number> = {}
    activityLog.value.forEach((entry) => {
      const date = new Date(entry.timestamp).toISOString().slice(0, 10)
      map[date] = (map[date] || 0) + 1
    })
    return map
  })

  return {
    planetStates,
    selectedCourseId,
    assessmentResults,
    labProgress,
    unlockedAchievements,
    learningStreak,
    selectedPath,
    modalStack,
    showPathPlanner,
    showKnowledgeGraph,
    showDashboard,
    customPathSequence,
    activeDetailTab,
    activeFloatingCard,
    activityLog,
    showCourseDropdown,
    dailyStudyMap,
    getPlanetState,
    selectCourse,
    completeCourse,
    resetProgress,
    recordAssessmentResult,
    updateLabProgress,
    startLab,
    recordStudyActivity,
    checkAchievements,
    openModal,
    closeModal,
    closeAllModals,
    isModalOpen,
    getModalParams,
    completedCount,
    totalCount,
    directionProgress,
    progressPercent,
    currentModal,
    courseAssessmentProgress,
    courseLabProgress,
    courseOverallScore,
    nextRecommendedCourses,
  }
})
