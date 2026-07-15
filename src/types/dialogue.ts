export interface DimensionMap {
  identity: string | null
  domain: string | null
  level: string | null
  experience: string | null
  goal: string | null
  motivation: string | null
  period: string | null
  weeklyHours: string | null
  method: string | null
}

export interface RecommendedCourse {
  id: string
  name: string
  difficulty: string
  color: string
  reason: string
  icon: string
}

export interface ChatMessage {
  id: string
  sender: 'ai' | 'user'
  text: string
  time?: string
  capturedTags?: string[]
  suggestChips?: string[]
  source?: 'chat' | 'ai' | 'asr'
  recommendedCourses?: RecommendedCourse[]
}

export interface RadarPoint {
  dimension: string
  score: number
}

export interface StudyReport {
  score: number
  evaluation: string
  radarPoints: RadarPoint[]
  weaknesses: string[]
  suggestions: string[]
  skills: {
    core: string[]
    foundation: string[]
    additional: string[]
  }
  recommendedPath: {
    step: number
    title: string
    description: string
  }[]
}

export interface ChatResponse {
  reply: string
  extractedDimensions: Partial<DimensionMap>
  capturedTags?: string[]
  suggestChips?: string[]
  report?: StudyReport
}

export interface HistoryPreset {
  id: string
  title: string
  score: number
  date: string
  evaluation: string
  dimensions: DimensionMap
  report: StudyReport
}

export type ThemeAccent = 'blue' | 'teal' | 'ruby' | 'cyan'
export type VirtualStyle = 'standard' | 'hologram' | 'cyber'
export type RecommendCategory = 'all' | 'course' | 'project' | 'literature'
