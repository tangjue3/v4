export interface BaseKnowledgeItem {
  id: string
  label: string
  domain: string
  mastery: number
  importance: number
  relations: string[]
  relationType?: 'prerequisite' | 'similar' | 'application' | 'mistake_related'
}

export interface ConstellationNode {
  id: string
  label: string
  domain: string
  importance: number
  mastery: number
  relations: string[]
  relationType: 'prerequisite' | 'similar' | 'application' | 'mistake_related'
  x: number
  y: number
}

export interface ConstellationEdge {
  from: string
  to: string
  type: 'prerequisite' | 'similar' | 'application' | 'mistake_related'
}

export interface MetroLine {
  id: string
  name: string
  color: string
  stations: MetroStation[]
  waypoints: [number, number][]
}

export interface MetroStation {
  id: string
  x: number
  y: number
  label: string
  mastery: number
  interchange?: string[]
  recommended?: boolean
  youAreHere?: boolean
  isRemedial?: boolean
  prerequisite?: string
  nextStation?: string
  estimatedTime?: string
}

export interface MatrixCell {
  domain: string
  domainLabel: string
  level: string
  levelLabel: string
  value: number
  evidenceCount: number
  lastScore: number
  isWeak: boolean
  isRecommended: boolean
}

export interface ConcentricRing {
  id: string
  label: string
  relationType: 'prerequisite' | 'current' | 'application' | 'extension'
  nodes: ConcentricNode[]
}

export interface ConcentricNode {
  id: string
  label: string
  mastery: number
  relationToCenter: string
  recommended?: boolean
  angle: number
}

export interface OrbitTrack {
  id: string
  name: string
  color: string
  nodes: OrbitNode[]
}

export interface OrbitNode {
  id: string
  label: string
  status: 'completed' | 'in_progress' | 'upcoming' | 'remedial'
  agentInvolved?: string
  triggeredResource?: boolean
  entersNextCycle?: boolean
  angle: number
}

export interface NodeDetail {
  mode: 'constellation' | 'metro' | 'matrix' | 'concentric' | 'orbital'
  nodeId: string
  label: string
  fields: { key: string; label: string; value: string }[]
  resourceLink?: { focus: string; nodeId: string }
}

// 学习路径阶段 / 资源类型
export type StageResourceType = 'doc' | 'video' | 'exercise' | 'code'

export interface StageResource {
  title: string
  type: StageResourceType
  isRemedial?: boolean
}

export interface LearningStage {
  id: string
  label: string
  icon: string
  color: string
}

export type StageContentMap = Record<string, StageResource[][]>
