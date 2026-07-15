const AGENT_KEYS = ['ProfileAgent', 'ResourceAgent', 'PathAgent', 'TutorAgent', 'EvaluationAgent', 'ReflectionAgent', 'KnowledgePathAgent']

const state = {
  totalSearches: 0,
  totalHits: 0,
  byAgent: Object.fromEntries(AGENT_KEYS.map(key => [key, {
    searches: 0,
    hits: 0,
    totalScore: 0,
    avgScore: 0,
    durationMs: 0,
  }])),
  domainCounts: {},
  topDocs: new Map(),
  recent: [],
  startedAt: new Date().toISOString(),
}

function ensureAgent(agentName) {
  if (!state.byAgent[agentName]) {
    state.byAgent[agentName] = { searches: 0, hits: 0, totalScore: 0, avgScore: 0, durationMs: 0 }
  }
  return state.byAgent[agentName]
}

export function recordRetrieval({ agentName, query, matches, durationMs }) {
  state.totalSearches += 1
  const bucket = ensureAgent(agentName || 'unknown')
  bucket.searches += 1
  bucket.durationMs += durationMs || 0

  if (Array.isArray(matches) && matches.length) {
    state.totalHits += matches.length
    bucket.hits += matches.length
    const sumScore = matches.reduce((sum, m) => sum + (m.score || 0), 0)
    bucket.totalScore += sumScore
    bucket.avgScore = bucket.totalScore / bucket.hits
    for (const match of matches) {
      const key = match.docId || match.id || 'unknown'
      state.topDocs.set(key, (state.topDocs.get(key) || 0) + 1)
    }
  }

  if (matches?.[0]?.domain) {
    state.domainCounts[matches[0].domain] = (state.domainCounts[matches[0].domain] || 0) + 1
  }

  state.recent.unshift({
    at: new Date().toISOString(),
    agentName,
    queryPreview: String(query || '').slice(0, 80),
    matchCount: matches?.length || 0,
    topScore: matches?.[0]?.score || 0,
  })
  state.recent = state.recent.slice(0, 30)
}

export function getRetrievalMetrics() {
  const byAgent = {}
  for (const [name, bucket] of Object.entries(state.byAgent)) {
    byAgent[name] = {
      ...bucket,
      hitRate: bucket.searches ? Number((bucket.hits / bucket.searches).toFixed(3)) : 0,
    }
  }
  const topDocs = Array.from(state.topDocs.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([docId, count]) => ({ docId, hits: count }))

  return {
    totalSearches: state.totalSearches,
    totalHits: state.totalHits,
    avgHitsPerSearch: state.totalSearches ? Number((state.totalHits / state.totalSearches).toFixed(3)) : 0,
    byAgent,
    domainCounts: state.domainCounts,
    topDocs,
    recent: state.recent,
    startedAt: state.startedAt,
    snapshotAt: new Date().toISOString(),
  }
}

export function resetRetrievalMetrics() {
  state.totalSearches = 0
  state.totalHits = 0
  for (const key of AGENT_KEYS) {
    state.byAgent[key] = { searches: 0, hits: 0, totalScore: 0, avgScore: 0, durationMs: 0 }
  }
  state.domainCounts = {}
  state.topDocs.clear()
  state.recent = []
  state.startedAt = new Date().toISOString()
}