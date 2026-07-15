import type { ProfileResult, SurveyAnswers } from '@/composables/useProfileSurvey'

export interface ApiResource {
  id: number
  type: 'doc' | 'mindmap' | 'exercise' | 'video' | 'code'
  title: string
  desc: string
  tags: string[]
  date: string
  color: string
  reads: number
  author?: string
  difficulty?: string
  reason?: string
  profileTag?: string
  pathStage?: string
  format?: string
  estTime?: string

  slides?: Array<{
    title: string
    subtitle?: string
    content: string
    icon?: string
    image?: string
  }>
  recommendEvidence?: {
    profileSource: string
    evaluationReason: string
    pathStage: string
    formatReason: string
  }
}

export interface ChatResource {
  type: 'doc' | 'mindmap' | 'exercise' | 'video' | 'code'
  title: string
  color?: string
}

export interface ApiSuggestion {
  text: string
  type?: 'weakness' | 'strength' | 'positive' | 'action'
}

export interface MultimodalContent {
  type: 'text' | 'image'
  text?: string
  imageData?: string
  imageType?: string
}

export interface ChatReply {
  content: string
  resources?: ChatResource[]
  suggestions?: string[]
}

export interface ChatHistoryItem {
  id: number
  role: 'user' | 'assistant'
  content: string
  time: string
  resources?: ChatResource[]
  suggestions?: string[]
  multimodalContents?: MultimodalContent[]
}

export interface TutoringReply {
  answer: string
  time: string
}

export interface TutoringHistoryItem {
  q: string
  a: string
  time: string
  helpful?: boolean
  scenario: string
  mode: string
  multimodalContents?: MultimodalContent[]
}

export interface LearningPathResponse {
  phases: Array<{
    title: string
    period: string
    progress: number
    status: string
    color: string
    nodes: Array<{
      name: string
      progress: number
      duration: string
      resources: number
    }>
  }>
  weeklyGoals: Array<{
    label: string
    progress: number
    target: string
  }>
}

export interface EvaluationDashboardMetric {
  key: string
  label: string
  stage0: number
  stage1: number
  stage2: number
}

export interface EvaluationDashboardWeakness {
  id: string
  label: string
  severity: 'low' | 'medium' | 'high'
  reason: string
  impact: string
  action: string
}

export interface EvaluationDashboardPayload {
  flow: string[]
  profileMetrics: EvaluationDashboardMetric[]
  weaknesses: EvaluationDashboardWeakness[]
  evidenceRounds: Array<{
    stage: 0 | 1 | 2
    trigger: string
    evidence: string[]
    profileUpdates: string[]
    pathImpact: string
  }>
}

export interface EvaluationResponse {
  generatedAt: string
  stats: Array<{
    label: string
    value: string
    change: string
    color: string
    icon?: string
  }>
  suggestions: ApiSuggestion[]
  dashboard?: EvaluationDashboardPayload
}

export type ProfileAnalyzeRequest = SurveyAnswers
export type ProfileAnalyzeResponse = ProfileResult
export interface LatestProfileResponse {
  result: ProfileResult | null
}

export interface AgentTrace {
  agentId: string
  agentName: string
  role: string
  input: string
  process: string
  output: string
  confidence: number
  evidenceTags: string[]
  timestamp: string
  status: 'running' | 'completed' | 'pending' | 'error'
}

export interface LearningWorkflowResponse {
  workflowId: string
  startTime: string
  endTime: string
  agents: AgentTrace[]
  summary: string
  profileSnapshot: Record<string, unknown>
}

export interface GeneratedResource {
  id: string
  concept: string
  example: string
  exercise: string
  mistakeReminder: string
  recommendReason: string
  evidence: {
    profileSource: string
    evaluationReason: string
    pathStage: string
    formatReason: string
  }
  audioText?: string
}

export interface GeneratedResourceItem {
  type: 'video' | 'doc' | 'mindmap' | 'exercise' | 'code' | 'audio'
  title: string
  description: string
  difficulty: string
  estimatedMinutes: number
  tags: string[]
  formatReason: string
  sourceResourceId?: number
  source?: 'local-resource-library'
  assetKind?: 'interactive-slides' | 'catalog-item' | 'browser-speech' | 'unavailable'
  speechText?: string
  slides?: Array<{
    title: string
    subtitle?: string
    content: string
    keyPoints?: string[]
    example?: string
    tip?: string
  }>
}

export interface EvidenceTrace {
  traceId: string
  workflowId: string
  agentId: string
  agentName: string
  input: string
  output: string
  confidence: number
  evidenceTags: string[]
  timestamp: string
  duration: number
}

export interface EvidenceSummary {
  workflowId: string
  totalAgents: number
  completedAgents: number
  totalDuration: number
  traceCount: number
  keyFindings: string[]
  profileUpdates: Array<{
    field: string
    before: string
    after: string
    evidence: string
  }>
  pathAdjustments: Array<{
    reason: string
    addedNodes: string[]
    removedNodes: string[]
  }>
}

export interface AgentResult {
  agentName: string
  inputSummary: string
  outputSummary: string
  input: unknown
  output: unknown
  confidence: number
  evidence: string[]
  durationMs: number
  status: string
  fallbackUsed: boolean
}

export interface TraceAgentResult {
  agentName: string
  inputSummary: string
  outputSummary: string
  confidence: number
  evidence: string[]
  durationMs: number
  fallbackUsed: boolean
}

export interface TraceRecord {
  requestId: string
  timestamp: string
  agents: string[]
  inputsSummary: string
  outputsSummary: string
  evidence: string[]
  riskFlags: string[]
  fallbackUsed: boolean
  durationMs: number
  agentResults: TraceAgentResult[]
}

export interface ResourceGenerateRequest {
  profile?: ProfileResult
  weaknesses?: Array<{ tag: string; count: number }>
  topic: string
  resourceType: string
}

export interface ResourcePackage {
  concept: string
  example: { title: string; description: string; steps: string[] }
  exercise: { title: string; questions: Array<{ question: string; options: string[]; correctAnswer: string; explanation: string }> }
  errorTip: string
  recommendReason: string
  profileEvidence: string
  generatedResources?: Array<{
    id: string
    type: 'mindmap' | 'document' | 'video' | 'exercise' | 'code' | string
    title: string
    format: string
    content: unknown
    profileEvidence: string
    qualityScore: number
    qualityReason: string
  }>
  qualityEvaluation?: {
    averageScore: number
    dimensions: Array<{ key: string; label: string; score: number }>
    cases: Array<{ id: string; type: string; title: string; score: number; reason: string }>
  }
  antiHallucination?: {
    strategy: string
    checks: string[]
    evidence: string[]
  }
}

export interface ResourceGenerateResponse {
  resourcePackage: ResourcePackage
  agentResults: AgentResult[]
  trace: TraceRecord
}

export interface EvidenceTracesResponse {
  items: TraceRecord[]
  total: number
}

export interface EvidenceSummaryResponse {
  totalTraces: number
  fallbackCount: number
  fallbackRate: number
  riskFlagCount: number
  riskRate: number
  avgDurationMs: number
  agentCounts: Record<string, number>
  lastTraceAt: string | null
  llmAvailable: boolean
}

export interface PathReplanResponse {
  path: LearningPathResponse & { replanReason?: string }
  evaluation: unknown
  agentResults: AgentResult[]
  trace: TraceRecord
}

export interface TutorAgentResponse {
  answer: string
  agentResults: AgentResult[]
  trace: TraceRecord
}

export interface FullEvaluationResponse {
  evaluation: unknown
  reflection: unknown
  agentResults: AgentResult[]
  trace: TraceRecord
}

export interface KnowledgeHit {
  id: string
  docId?: string
  source?: string
  title: string
  domain?: string
  type: string
  tags: string[]
  summary: string
  agentHint: string
  text?: string
  snippet?: string
  score: number
  scoreBreakdown?: {
    vector: number
    tag: number
    keyword: number
  }
  matchedQueryTokens?: string[]
  matchedProfileTags?: string[]
}

export interface KnowledgeContextResponse {
  query: string
  detectedDomain?: string | null
  matches: KnowledgeHit[]
  embedding: {
    model: string
    dimensions: number
    indexSize: number
    candidatesScanned?: number
    generatedAt: string
  }
  weights?: { vector: number; tag: number; keyword: number }
  durationMs?: number
  agentName?: string
}

export interface KnowledgeStatusResponse {
  model: string
  dimensions: number
  localDocuments: number
  vectorDocuments: number
  totalChunks?: number
  domainCounts?: Record<string, number>
  syncedAgents: string[]
  updatedAt: string
}

export interface RetrievalMetricsResponse {
  totalSearches: number
  totalHits: number
  avgHitsPerSearch: number
  byAgent: Record<string, {
    searches: number
    hits: number
    totalScore: number
    avgScore: number
    durationMs: number
    hitRate: number
  }>
  domainCounts: Record<string, number>
  topDocs: Array<{ docId: string; hits: number }>
  recent: Array<{
    at: string
    agentName: string
    queryPreview: string
    matchCount: number
    topScore: number
  }>
  startedAt: string
  snapshotAt: string
}

export interface ReviewQuestion {
  questionId: string
  sessionId: string
  accountId: string
  knowledgePointId: string | null
  knowledgePointName: string | null
  questionType: 'single-choice' | string
  difficulty: string
  prompt: string
  options: string[]
  answer?: unknown
  explanation?: string
  mistakeTags?: string[]
  status: 'generated' | 'answered' | string
  userAnswer?: unknown
  isCorrect?: boolean | null
  createdAt?: string
  answeredAt?: string
}

export interface ReviewSession {
  sessionId: string
  accountId: string
  source: string
  status: string
  knowledgePointId: string | null
  knowledgePointName: string | null
  createdAt: string
}

export interface ReviewGenerateRequest {
  knowledgePoint?: { id?: string; name?: string; reason?: string }
  count?: number
  source?: string
  profile?: ProfileResult
}

export interface ReviewGenerateResponse {
  session: ReviewSession
  questions: ReviewQuestion[]
}

export interface ReviewSubmitRequest {
  sessionId: string
  answers: Array<{ questionId: string; answer: unknown }>
}

export interface ReviewSubmitResponse {
  evaluatedQuestions: ReviewQuestion[]
  mistakes: ReviewQuestion[]
  correctCount: number
  totalQuestions: number
  correctRate: number
  weakTags: string[]
  profilePatch: unknown
  updatedProfile: ProfileResult | null
  shouldReplanPath: boolean
}

export interface ReviewMistakesResponse {
  items: ReviewQuestion[]
}

export interface FullRunRequest {
  answers?: unknown
  topic?: string
  resourceType?: string
  question?: string
  mode?: string
}

export interface FullRunResponse {
  workflowId: string
  agentResults: AgentResult[]
  resourcePackage: ResourcePackage
  tutoringAnswer: string
  evaluation: unknown
  path: LearningPathResponse & { replanReason?: string }
  reflection: unknown
  profile: ProfileResult
  trace: TraceRecord
}
