import { computed } from 'vue'
import { useUniverseStore } from '../stores/universeStore'
import { courses } from '../data/courses'
import { coursesV2 } from '../data/coursesV2'
import { learningPaths } from '../data/learningPaths'

export function usePathRecommender() {
  const store = useUniverseStore()

  const availableCourses = computed(() =>
    courses.filter((c) => store.getPlanetState(c.id) === 'available'),
  )

  const completedCourses = computed(() =>
    courses.filter((c) => store.getPlanetState(c.id) === 'completed'),
  )

  const userLevel = computed(() => {
    const completed = completedCourses.value
    const advancedCount = completed.filter((c) => c.difficulty === '高级').length
    const midCount = completed.filter((c) => c.difficulty === '进阶').length
    if (advancedCount >= 3) return 3
    if (midCount >= 3 || advancedCount >= 1) return 2
    return 1
  })

  const recommendedNext = computed(() => {
    const available = availableCourses.value
    if (available.length === 0) return []

    const scored = available
      .map((c) => ({ course: c, score: computeScore(c) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    return scored.map((item) => ({
      course: item.course,
      reason: getRecommendReason(item.course.id, item.score),
    }))
  })

  function computeScore(course: (typeof courses)[number]): number {
    let score = 0

    // Prerequisites completion (0-60)
    const prereqsCompleted = course.prerequisites.filter(
      (pid) => store.getPlanetState(pid) === 'completed',
    ).length
    if (course.prerequisites.length === 0) {
      score += 60
    } else {
      score += (prereqsCompleted / course.prerequisites.length) * 60
    }

    // Path matching bonus (0-20)
    if (store.selectedPath) {
      const path = learningPaths.find((p) => p.id === store.selectedPath)
      if (path) {
        const idx = path.courseSequence.indexOf(course.id)
        if (idx !== -1) {
          score += 20
        }
      }
    }

    // Time efficiency (0-10): prefer shorter courses
    const v2 = coursesV2.find((v) => v.id === course.id)
    if (v2) {
      const hours = v2.estimatedHours
      if (hours <= 30) score += 10
      else if (hours <= 40) score += 7
      else if (hours <= 50) score += 3
    }

    // Difficulty matching (0-5): recommend appropriate difficulty
    const level = userLevel.value
    const diffScore: Record<string, number> = { '入门': 1, '进阶': 2, '高级': 3 }
    const courseDiff = diffScore[course.difficulty] || 2
    const diffDelta = Math.abs(courseDiff - level)
    if (diffDelta === 0) score += 5
    else if (diffDelta === 1) score += 3

    // Dead-end detection (0-5): prefer courses that unlock more courses
    const successors = coursesV2.find((v) => v.id === course.id)?.successorCourses || []
    if (successors.length >= 3) score += 5
    else if (successors.length >= 1) score += 3
    else score += 1

    // Assessment bonus (0-5): if previously attempted and did well
    const assessment = store.assessmentResults[course.id]
    if (assessment) {
      const avgPct = (assessment.conceptual + assessment.coding) / 2
      score += Math.round(avgPct / 20)
    }

    return score
  }

  function getRecommendReason(courseId: number, _score: number): string {
    const course = courses.find((c) => c.id === courseId)
    if (!course) return ''

    const reasons: string[] = []

    // Prerequisites
    if (course.prerequisites.length === 0) {
      reasons.push('无前置要求，可直接开始')
    } else {
      const completed = course.prerequisites.filter(
        (pid) => store.getPlanetState(pid) === 'completed',
      ).length
      if (completed === course.prerequisites.length) {
        reasons.push('前置课程已全部完成')
      } else {
        reasons.push(`前置课程完成 ${completed}/${course.prerequisites.length}`)
      }
    }

    // Path membership
    if (store.selectedPath) {
      const path = learningPaths.find((p) => p.id === store.selectedPath)
      if (path?.courseSequence.includes(courseId)) {
        reasons.push(`属于当前学习路径「${path.name}」`)
      }
    }

    // Time estimate
    const v2 = coursesV2.find((v) => v.id === courseId)
    if (v2 && v2.estimatedHours <= 35) {
      reasons.push('适中课时，可快速完成')
    }

    // Difficulty match
    reasons.push(`适合${course.difficulty}阶段学习`)

    // Unlocks
    const successors = v2?.successorCourses || []
    if (successors.length >= 3) {
      reasons.push(`完成后可解锁${successors.length}门后续课程`)
    }

    return reasons.join('；')
  }

  function getPathProgress(pathId: string) {
    const path = learningPaths.find((p) => p.id === pathId)
    if (!path) return { completed: 0, total: 0, percent: 0 }
    const completed = path.courseSequence.filter(
      (id) => store.getPlanetState(id) === 'completed',
    ).length
    return {
      completed,
      total: path.courseSequence.length,
      percent: Math.round((completed / path.courseSequence.length) * 100),
    }
  }

  function getBestPath() {
    let bestPath = learningPaths[0]
    let bestProgress = 0
    learningPaths.forEach((p) => {
      const prog = getPathProgress(p.id)
      if (prog.percent > bestProgress) {
        bestProgress = prog.percent
        bestPath = p
      }
    })
    return { path: bestPath, progress: bestProgress }
  }

  function getPathRemainingHours(pathId: string): number {
    const path = learningPaths.find((p) => p.id === pathId)
    if (!path) return 0
    return path.courseSequence.reduce((sum, id) => {
      if (store.getPlanetState(id) === 'completed') return sum
      const v2 = coursesV2.find((v) => v.id === id)
      return sum + (v2?.estimatedHours || 35)
    }, 0)
  }

  return {
    availableCourses,
    recommendedNext,
    getPathProgress,
    getBestPath,
    getPathRemainingHours,
  }
}
