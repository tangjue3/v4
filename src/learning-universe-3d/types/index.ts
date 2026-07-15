export interface Course {
  id: number
  name: string
  direction: DirectionId
  difficulty: '入门' | '进阶' | '高级'
  prerequisites: number[]
  themeColor: string
  knowledgePoints: KnowledgePoint[]
  codeExample?: string
  faq: string[]
  description: string
}

export interface KnowledgePoint {
  name: string
  description: string
  difficulty: '入门' | '进阶' | '高级'
}

export type DirectionId = 'programming' | 'systems' | 'software' | 'ai' | 'frontier'

export interface Galaxy {
  id: DirectionId
  name: string
  color: string
  planetIds: number[]
}

export type PlanetState = 'locked' | 'available' | 'completed'

// ─── V2 类型定义 ───

export interface BloomObjective {
  level: 'L1-认知' | 'L2-应用' | 'L3-综合'
  description: string
}

export interface CodeExampleV2 {
  id: string
  title: string
  description: string
  level: '入门' | '进阶' | '高级'
  code: string
  output?: string
  commonError?: string
  language: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  difficulty: '基础' | '深入'
  keyPoints: string[]
  commonMisconceptions: string[]
  relatedConcepts: string[]
  followUpQuestions: string[]
}

export interface LabTaskStep {
  stepIndex: number
  title: string
  description: string
  hints: string[]
  codeTemplate?: string
  checkpoint: string
}

export interface LabTask {
  id: string
  courseId: number
  title: string
  description: string
  difficulty: '入门' | '进阶' | '高级'
  estimatedMinutes: number
  steps: LabTaskStep[]
}

export interface AssessmentQuestion {
  id: string
  type: 'choice' | 'judge' | 'code'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  commonMisconception?: string
  relatedKnowledgePoint?: string
  hint?: string
  testCases?: { input: string; expected: string }[]
  codeTemplate?: string
}

export interface Assessment {
  id: string
  courseId: number
  type: 'pre-test' | 'unit-test' | 'coding-challenge'
  title: string
  questions: AssessmentQuestion[]
  timeLimitMinutes: number
}

export interface CourseV2 {
  id: number
  objectives: BloomObjective[]
  prerequisiteCourses: number[]
  successorCourses: number[]
  codeExamples: CodeExampleV2[]
  faqItems: FAQItem[]
  labTaskIds: string[]
  assessmentIds: string[]
  estimatedHours: number
}

export interface KnowledgeCrossRef {
  knowledgePointName: string
  sourceCourseId: number
  targetCourseId: number
  relationDescription: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: string
  unlockedAt: number | null
}

export interface LearningPath {
  id: string
  name: string
  description: string
  targetRole: string
  courseSequence: number[]
  estimatedWeeks: number
}

export interface AssessmentResult {
  conceptual: number
  coding: number
  lastAttemptAt: number
  totalQuestions: number
  correctAnswers: number
}

export interface LabProgress {
  currentStep: number
  completed: boolean
  startedAt: number
}

export interface LearningStreak {
  currentStreak: number
  lastStudyDate: string
  totalStudyMinutes: number
}

export type ModalName =
  | 'assessment'
  | 'labTask'
  | 'codePlayground'
  | 'faqDetail'
  | 'achievement'
  | 'preRequisiteCheck'

export interface ModalState {
  name: ModalName
  params?: Record<string, unknown>
}

export interface KnowledgeGraphNode {
  id: number
  name: string
  direction: DirectionId
  color: string
  x: number
  y: number
  state: PlanetState
  isHighlighted: boolean
  isPathNode: boolean
}

export interface KnowledgeGraphEdge {
  sourceId: number
  targetId: number
  type: 'prerequisite' | 'path'
  weight: number
}

export interface ActivityLogEntry {
  id: string
  type: 'complete-course' | 'pass-assessment' | 'complete-lab' | 'unlock-achievement'
  courseId?: number
  courseName?: string
  timestamp: number
  description: string
}
