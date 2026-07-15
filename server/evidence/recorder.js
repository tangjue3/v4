import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getRetrievalMetrics } from '../knowledge-base/metrics.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const tracesDir = path.join(__dirname, '..', 'evidence-data')

function ensureDir() {
  if (!fs.existsSync(tracesDir)) {
    fs.mkdirSync(tracesDir, { recursive: true })
  }
}

function tracesPath() {
  return path.join(tracesDir, 'traces.json')
}

export function readTraces() {
  ensureDir()
  const fp = tracesPath()
  if (!fs.existsSync(fp)) return []
  try {
    return JSON.parse(fs.readFileSync(fp, 'utf8'))
  } catch {
    return []
  }
}

function writeTraces(traces) {
  ensureDir()
  fs.writeFileSync(tracesPath(), JSON.stringify(traces, null, 2), 'utf8')
}

let traceHook = null

export function setTraceRecordedHook(hook) {
  traceHook = hook
}

export function recordTrace(trace) {
  const traces = readTraces()
  traces.push(trace)
  const kept = traces.slice(-200)
  writeTraces(kept)
  if (typeof traceHook === 'function') {
    try {
      traceHook(trace)
    } catch (err) {
      console.error('[traceHook] failed:', err)
    }
  }
  return trace
}

export function getTraces(limit = 50, offset = 0) {
  const traces = readTraces()
  return traces.slice(-(limit + offset)).slice(0, limit).reverse()
}

export function getTraceSummary() {
  const traces = readTraces()
  const totalTraces = traces.length
  const fallbackCount = traces.filter(t => t.fallbackUsed).length
  const riskFlagCount = traces.filter(t => t.riskFlags && t.riskFlags.length > 0).length

  const agentCounts = {}
  const agentStats = {}
  let totalDurationMs = 0
  for (const t of traces) {
    if (t.agents) {
      for (const a of t.agents) {
        agentCounts[a] = (agentCounts[a] || 0) + 1
      }
    }
    if (t.durationMs) {
      totalDurationMs += t.durationMs
    }
    if (!t.agents) continue
    for (const agent of t.agents) {
      if (!agentStats[agent.agentId]) {
        agentStats[agent.agentId] = {
          agentId: agent.agentId,
          agentName: agent.agentName,
          totalRuns: 0,
          fallbackCount: 0,
          avgConfidence: 0,
          avgDurationMs: 0,
        }
      }
      const s = agentStats[agent.agentId]
      s.avgConfidence = (s.avgConfidence * s.totalRuns + (agent.confidence || 0)) / (s.totalRuns + 1)
      s.avgDurationMs = (s.avgDurationMs * s.totalRuns + (agent.durationMs || 0)) / (s.totalRuns + 1)
      s.totalRuns += 1
      if (agent.fallbackUsed) s.fallbackCount += 1
    }
  }

  const riskFlags = []
  for (const trace of traces) {
    if (trace.riskFlags) riskFlags.push(...trace.riskFlags)
  }

  return {
    totalTraces,
    fallbackCount,
    fallbackRate: totalTraces > 0 ? Math.round((fallbackCount / totalTraces) * 100) : 0,
    riskFlagCount,
    riskRate: totalTraces > 0 ? Math.round((riskFlagCount / totalTraces) * 100) : 0,
    avgDurationMs: totalTraces > 0 ? Math.round(totalDurationMs / totalTraces) : 0,
    agentCounts,
    agentStats: Object.values(agentStats).map(s => ({
      ...s,
      avgConfidence: Math.round(s.avgConfidence * 100) / 100,
      avgDurationMs: Math.round(s.avgDurationMs),
    })),
    riskFlags: riskFlags.slice(-20),
    lastTraceAt: totalTraces > 0 ? traces[traces.length - 1].timestamp : null,
  }
}

export function buildTrace({ requestId, agents, inputsSummary, outputsSummary, evidence, riskFlags, fallbackUsed, durationMs, agentResults }) {
  const retrievalHits = extractRetrievalHits(agentResults || [])
  return {
    requestId: requestId || `req-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    agents: agents || [],
    inputsSummary: inputsSummary || '',
    outputsSummary: outputsSummary || '',
    evidence: evidence || [],
    riskFlags: riskFlags || [],
    fallbackUsed: fallbackUsed || false,
    durationMs: durationMs || 0,
    agentResults: (agentResults || []).map(r => ({
      agentName: r.agentName,
      inputSummary: r.inputSummary || '',
      outputSummary: r.outputSummary || '',
      confidence: r.confidence,
      evidence: r.evidence || [],
      durationMs: r.durationMs || 0,
      fallbackUsed: r.fallbackUsed || false,
    })),
    retrievalSummary: {
      totalHits: retrievalHits.totalHits,
      agentsUsed: retrievalHits.agentsUsed,
      topDomains: retrievalHits.topDomains,
      topDocs: retrievalHits.topDocs.slice(0, 5),
      globalMetrics: getRetrievalMetrics(),
    },
  }
}

function extractRetrievalHits(agentResults) {
  const agentsUsed = new Set()
  const docHits = new Map()
  const domainHits = new Map()
  let totalHits = 0

  for (const result of agentResults) {
    const matches = result?.output?.knowledgeContext?.matches
    if (Array.isArray(matches) && matches.length) {
      agentsUsed.add(result.agentName)
      for (const match of matches) {
        totalHits += 1
        const docKey = match.docId || match.id || match.title || 'unknown'
        docHits.set(docKey, (docHits.get(docKey) || 0) + 1)
        if (match.domain) {
          domainHits.set(match.domain, (domainHits.get(match.domain) || 0) + 1)
        }
      }
    }
  }

  const topDocs = Array.from(docHits.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([docId, count]) => ({ docId, hits: count }))
  const topDomains = Array.from(domainHits.entries())
    .sort((left, right) => right[1] - left[1])
    .map(([domain, count]) => ({ domain, count }))

  return {
    totalHits,
    agentsUsed: Array.from(agentsUsed),
    topDocs,
    topDomains,
  }
}
