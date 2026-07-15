import { computed, reactive } from 'vue'
import { DOMAINS } from '@/data/learning-resources'
import type { Resource } from '@/types/edu-mind'

export type LearningAction =
  | 'light-star'
  | 'favorite-resource'
  | 'complete-resource'
  | 'reverse-update'
  | 'evaluation-focus'

export interface LearningPointProgress {
  id: string
  label: string
  domainId: string
  domainName: string
  mastery: number
  previousMastery: number
  lastAction: LearningAction
  lastSource: string
  lastUpdatedAt: number
  completedResources: string[]
}

export interface LearningProgressEvent {
  id: string
  pointId: string
  label: string
  domainId: string
  domainName: string
  action: LearningAction
  source: string
  resourceTitle?: string
  before: number
  after: number
  createdAt: number
}

interface ResourceProgress {
  id: string
  title: string
  pointId?: string
  action: LearningAction
  updatedAt: number
}

interface LearningProgressState {
  points: Record<string, LearningPointProgress>
  resources: Record<string, ResourceProgress>
  events: LearningProgressEvent[]
  revision: number
}

interface KnowledgeInput {
  id?: string
  label?: string
  domainId?: string
  domainName?: string
  baseMastery?: number
  targetMastery?: number
  masteryDelta?: number
  action: LearningAction
  source: string
  resourceId?: string
  resourceTitle?: string
}

const STORAGE_KEY = 'edumind-learning-progress-sync'
const MAX_EVENTS = 40

const state = reactive<LearningProgressState>({
  points: {},
  resources: {},
  events: [],
  revision: 0,
})

let hydrated = false

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function hydrate() {
  if (hydrated) return
  hydrated = true
  if (!canUseStorage()) return

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Partial<LearningProgressState>
    state.points = parsed.points && typeof parsed.points === 'object' ? parsed.points : {}
    state.resources = parsed.resources && typeof parsed.resources === 'object' ? parsed.resources : {}
    state.events = Array.isArray(parsed.events) ? parsed.events.slice(0, MAX_EVENTS) : []
    state.revision += 1
  } catch {
    state.points = {}
    state.resources = {}
    state.events = []
  }
}

function persist() {
  if (!canUseStorage()) return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
    points: state.points,
    resources: state.resources,
    events: state.events,
  }))
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function toPercent(value: number | undefined, fallback = 0) {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback
  return clampPercent(value <= 1 ? value * 100 : value)
}

export function normalizeLearningKey(value: string | undefined) {
  return (value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s/_\-·,，()（）]/g, '')
}

function domainByIdOrName(value: string | undefined) {
  const key = normalizeLearningKey(value)
  if (!key) return null
  return DOMAINS.find((domain) => (
    normalizeLearningKey(domain.id) === key ||
    normalizeLearningKey(domain.name) === key ||
    normalizeLearningKey(domain.short) === key
  )) ?? null
}

function topicByIdOrLabel(value: string | undefined, domainId?: string) {
  const key = normalizeLearningKey(value)
  if (!key) return null
  const domains = domainId ? DOMAINS.filter((domain) => domain.id === domainId) : DOMAINS
  for (const domain of domains) {
    const topic = domain.topics.find((item) => (
      normalizeLearningKey(item.id) === key ||
      normalizeLearningKey(item.label) === key
    ))
    if (topic) return { topic, domain }
  }
  return null
}

export function resolveLearningPoint(input: {
  id?: string
  label?: string
  domainId?: string
  domainName?: string
}) {
  const domain = domainByIdOrName(input.domainId) ?? domainByIdOrName(input.domainName)
  const topic = topicByIdOrLabel(input.id, domain?.id) ?? topicByIdOrLabel(input.label, domain?.id)

  if (topic) {
    return {
      id: topic.topic.id,
      label: topic.topic.label,
      domainId: topic.domain.id,
      domainName: topic.domain.name,
    }
  }

  const fallbackDomain = domain ?? DOMAINS[0]
  const fallbackId = input.id || normalizeLearningKey(input.label) || `point-${Date.now()}`
  return {
    id: fallbackId,
    label: input.label || fallbackId,
    domainId: fallbackDomain.id,
    domainName: fallbackDomain.name,
  }
}

export function resolveLearningPointFromResource(resource: Pick<Resource, 'id' | 'title' | 'domain' | 'topic'> | undefined) {
  if (!resource) return null
  const resolved = resolveLearningPoint({
    label: resource.topic || resource.title,
    domainName: resource.domain,
  })
  return resolved.id ? resolved : null
}

function defaultDeltaFor(action: LearningAction) {
  if (action === 'light-star') return 34
  if (action === 'complete-resource') return 14
  if (action === 'favorite-resource') return 5
  if (action === 'reverse-update') return 6
  return 0
}

export function recordKnowledgeAction(input: KnowledgeInput) {
  hydrate()
  const point = resolveLearningPoint(input)
  const existing = state.points[point.id]
  const before = existing?.mastery ?? toPercent(input.baseMastery, 0)
  const target = typeof input.targetMastery === 'number'
    ? toPercent(input.targetMastery, before)
    : before + (input.masteryDelta ?? defaultDeltaFor(input.action))
  const after = clampPercent(Math.max(before, target))
  const now = Date.now()
  const completedResources = new Set(existing?.completedResources ?? [])
  if (input.action === 'complete-resource' && input.resourceTitle) {
    completedResources.add(input.resourceTitle)
  }

  state.points[point.id] = {
    id: point.id,
    label: point.label,
    domainId: point.domainId,
    domainName: point.domainName,
    mastery: after,
    previousMastery: before,
    lastAction: input.action,
    lastSource: input.source,
    lastUpdatedAt: now,
    completedResources: [...completedResources],
  }

  if (input.resourceId || input.resourceTitle) {
    const resourceKey = input.resourceId || input.resourceTitle || `${point.id}-${now}`
    state.resources[resourceKey] = {
      id: resourceKey,
      title: input.resourceTitle || resourceKey,
      pointId: point.id,
      action: input.action,
      updatedAt: now,
    }
  }

  const event: LearningProgressEvent = {
    id: `${now}-${state.events.length}`,
    pointId: point.id,
    label: point.label,
    domainId: point.domainId,
    domainName: point.domainName,
    action: input.action,
    source: input.source,
    resourceTitle: input.resourceTitle,
    before,
    after,
    createdAt: now,
  }

  state.events = [event, ...state.events].slice(0, MAX_EVENTS)
  state.revision += 1
  persist()
  return state.points[point.id]
}

export function recordResourceAction(resource: Resource | undefined, action: Extract<LearningAction, 'favorite-resource' | 'complete-resource'>, hours = 0) {
  const point = resolveLearningPointFromResource(resource)
  if (!resource || !point) return null
  return recordKnowledgeAction({
    id: point.id,
    label: point.label,
    domainId: point.domainId,
    domainName: point.domainName,
    action,
    source: action === 'complete-resource' ? 'resource-center-complete' : 'resource-center-favorite',
    resourceId: resource.id,
    resourceTitle: resource.title,
    masteryDelta: action === 'complete-resource' ? Math.max(10, Math.round(hours * 8)) : 5,
  })
}

export function applyProgressToMastery(id: string | undefined, baseMastery: number, label?: string) {
  hydrate()
  const byId = id ? state.points[id] : undefined
  const labelKey = normalizeLearningKey(label)
  const byLabel = labelKey
    ? Object.values(state.points).find((point) => normalizeLearningKey(point.label) === labelKey)
    : undefined
  const progress = byId ?? byLabel
  if (!progress) return toPercent(baseMastery)
  return Math.max(toPercent(baseMastery), progress.mastery)
}

export function useLearningProgressSync() {
  hydrate()
  return {
    state,
    progressRevision: computed(() => state.revision),
    recentEvents: computed(() => state.events),
    recentFocus: computed(() => state.events[0] ?? null),
    progressPoints: computed(() => Object.values(state.points)),
    recordKnowledgeAction,
    recordResourceAction,
    resolveLearningPoint,
    resolveLearningPointFromResource,
    applyProgressToMastery,
  }
}
