import { LOCAL_KNOWLEDGE_DOCUMENTS } from './documents.js'
import { chunkDocument } from './chunking.js'
import { detectDomain } from './detect-domain.js'

const DIMENSIONS = 96
const MODEL_NAME = 'local-hash-embedding-v1'

function hashToken(token) {
  let hash = 2166136261
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function tokenize(text) {
  const normalized = String(text || '').toLowerCase()
  const words = normalized.match(/[a-z0-9_+#.-]+|[一-鿿]/g) || []
  const cjk = normalized.match(/[一-鿿]{2,}/g) || []
  const bigrams = cjk.flatMap(item => {
    const tokens = []
    for (let index = 0; index < item.length - 1; index += 1) {
      tokens.push(item.slice(index, index + 2))
    }
    return tokens
  })
  return [...words, ...bigrams].filter(Boolean)
}

function embedText(text) {
  const vector = new Array(DIMENSIONS).fill(0)
  const tokens = tokenize(text)

  for (const token of tokens) {
    const hash = hashToken(token)
    const index = hash % DIMENSIONS
    const sign = hash & 1 ? 1 : -1
    vector[index] += sign * (1 + Math.min(token.length, 8) / 8)
  }

  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0)) || 1
  return vector.map(value => value / norm)
}

function cosineSimilarity(left, right) {
  let score = 0
  for (let index = 0; index < DIMENSIONS; index += 1) {
    score += left[index] * right[index]
  }
  return score
}

function documentText(document) {
  return [
    document.title,
    document.type,
    document.domain,
    document.tags?.join(' '),
    document.summary,
    Array.isArray(document.chunks) ? document.chunks.map(chunk => chunk.text).join('\n') : document.content,
    document.agentHint,
  ].filter(Boolean).join('\n')
}

const CHUNK_INDEX = LOCAL_KNOWLEDGE_DOCUMENTS.flatMap(document => {
  const chunks = chunkDocument(document)
  return chunks.map(chunk => ({
    chunkId: chunk.id,
    docId: document.id,
    docTitle: document.title,
    domain: document.domain || 'general',
    type: document.type || 'general',
    tags: document.tags || [],
    summary: document.summary || '',
    agentHint: document.agentHint || '',
    text: chunk.text,
    embedding: embedText(`${document.title}\n${document.tags?.join(' ') || ''}\n${chunk.text}`),
  }))
})

const TOKEN_INDEX = new Map()
for (const chunk of CHUNK_INDEX) {
  const tokens = new Set(tokenize(`${chunk.docTitle} ${chunk.tags.join(' ')} ${chunk.text}`))
  for (const token of tokens) {
    if (!TOKEN_INDEX.has(token)) TOKEN_INDEX.set(token, new Set())
    TOKEN_INDEX.get(token).add(chunk.chunkId)
  }
}

function buildQuery({ query, profile, learningData, exerciseResults }) {
  const dimensions = Array.isArray(profile?.dimensions)
    ? profile.dimensions.map(item => `${item.label || item.key || ''} ${item.value ?? ''}`).join(' ')
    : ''
  const weaknesses = Array.isArray(profile?.weaknesses)
    ? profile.weaknesses.map(item => `${item.tag || item.label || ''} ${item.count ?? ''}`).join(' ')
    : ''

  return [
    query,
    dimensions,
    weaknesses,
    JSON.stringify(learningData || {}),
    JSON.stringify(exerciseResults || {}),
  ].filter(Boolean).join('\n')
}

function extractProfileTags(profile) {
  if (!profile) return []
  const tags = []
  if (Array.isArray(profile.weaknesses)) {
    for (const item of profile.weaknesses) {
      if (item?.tag) tags.push(String(item.tag).toLowerCase())
      else if (item?.label) tags.push(String(item.label).toLowerCase())
    }
  }
  if (Array.isArray(profile.dimensions)) {
    for (const item of profile.dimensions) {
      if (item?.label) tags.push(String(item.label).toLowerCase())
    }
  }
  return tags
}

function tagScore(queryTags, docTags) {
  if (!queryTags.length || !docTags?.length) return 0
  const docTagSet = new Set(docTags.map(tag => String(tag).toLowerCase()))
  let hits = 0
  for (const tag of queryTags) {
    if (docTagSet.has(tag)) hits += 1
    else {
      for (const docTag of docTagSet) {
        if (docTag.includes(tag) || tag.includes(docTag)) {
          hits += 0.5
          break
        }
      }
    }
  }
  return Math.min(1, hits / Math.max(3, queryTags.length))
}

function keywordScore(queryTokens, chunkTextValue) {
  if (!queryTokens.length) return 0
  const chunkTokens = new Set(tokenize(chunkTextValue))
  if (!chunkTokens.size) return 0
  let hits = 0
  for (const token of queryTokens) {
    if (chunkTokens.has(token)) hits += 1
  }
  return Math.min(1, hits / Math.max(3, queryTokens.length))
}

function buildMatchPayload(chunk, scores, queryTokens, profileTags) {
  return {
    id: chunk.chunkId,
    docId: chunk.docId,
    title: chunk.docTitle,
    domain: chunk.domain,
    type: chunk.type,
    tags: chunk.tags,
    summary: chunk.summary,
    agentHint: chunk.agentHint,
    text: chunk.text,
    snippet: chunk.text.length > 240 ? `${chunk.text.slice(0, 240)}…` : chunk.text,
    score: Number(scores.final.toFixed(4)),
    scoreBreakdown: {
      vector: Number(scores.vector.toFixed(4)),
      tag: Number(scores.tag.toFixed(4)),
      keyword: Number(scores.keyword.toFixed(4)),
    },
    matchedQueryTokens: queryTokens.filter(token => token.length > 1).slice(0, 8),
    matchedProfileTags: profileTags.filter(tag => chunk.tags.map(t => String(t).toLowerCase()).includes(tag)),
  }
}

export function searchKnowledgeBase({ query, profile, learningData, exerciseResults, limit = 4 } = {}) {
  const finalQuery = buildQuery({ query, profile, learningData, exerciseResults })
  const queryEmbedding = embedText(finalQuery || 'evaluation profile learning weakness')

  const matches = CHUNK_INDEX
    .map(chunk => ({
      id: chunk.chunkId,
      docId: chunk.docId,
      title: chunk.docTitle,
      type: chunk.type,
      tags: chunk.tags,
      summary: chunk.summary,
      agentHint: chunk.agentHint,
      text: chunk.text,
      snippet: chunk.text.length > 240 ? `${chunk.text.slice(0, 240)}…` : chunk.text,
      score: Number(cosineSimilarity(queryEmbedding, chunk.embedding).toFixed(4)),
    }))
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)

  return {
    query: finalQuery,
    matches,
    embedding: {
      model: MODEL_NAME,
      dimensions: DIMENSIONS,
      indexSize: CHUNK_INDEX.length,
      generatedAt: new Date().toISOString(),
    },
  }
}

export function searchKnowledgeBaseAdvanced({
  query,
  profile,
  learningData,
  exerciseResults,
  domain,
  type,
  limit = 4,
  weights = { vector: 0.5, tag: 0.3, keyword: 0.2 },
  agentName,
} = {}) {
  const startedAt = Date.now()
  const finalQuery = buildQuery({ query, profile, learningData, exerciseResults })
  const queryEmbedding = embedText(finalQuery || 'learning evaluation weakness')
  const queryTokens = tokenize(finalQuery)
  const profileTags = extractProfileTags(profile)

  const detectedDomain = domain || detectDomain(`${query || ''} ${profileTags.join(' ')}`)

  const filtered = detectedDomain
    ? CHUNK_INDEX.filter(chunk => chunk.domain === detectedDomain || chunk.domain === 'general')
    : CHUNK_INDEX

  let candidates = filtered
  if (candidates.length === 0) {
    candidates = CHUNK_INDEX
  }

  const matches = candidates
    .map(chunk => {
      const vector = cosineSimilarity(queryEmbedding, chunk.embedding)
      const tag = tagScore(profileTags, chunk.tags)
      const keyword = keywordScore(queryTokens, chunk.text)
      const final = vector * weights.vector + tag * weights.tag + keyword * weights.keyword
      return { chunk, scores: { vector, tag, keyword, final } }
    })
    .sort((left, right) => right.scores.final - left.scores.final)
    .filter(({ scores }) => scores.final > 0.05)
    .slice(0, limit)
    .map(({ chunk, scores }) => buildMatchPayload(chunk, scores, queryTokens, profileTags))

  const payload = {
    query: finalQuery,
    detectedDomain,
    matches,
    embedding: {
      model: MODEL_NAME,
      dimensions: DIMENSIONS,
      indexSize: CHUNK_INDEX.length,
      candidatesScanned: filtered.length,
      generatedAt: new Date().toISOString(),
    },
    weights,
    durationMs: Date.now() - startedAt,
    agentName: agentName || 'unknown',
  }
  return payload
}

export function getKnowledgeBaseStats() {
  const localDocuments = LOCAL_KNOWLEDGE_DOCUMENTS.filter(item => item.source === 'local').length
  const vectorDocuments = LOCAL_KNOWLEDGE_DOCUMENTS.length
  const totalChunks = CHUNK_INDEX.length
  const domainCounts = LOCAL_KNOWLEDGE_DOCUMENTS.reduce((acc, item) => {
    const key = item.domain || 'general'
    acc[key] = (acc[key] || 0) + 1
    return acc
  }, {})

  return {
    model: MODEL_NAME,
    dimensions: DIMENSIONS,
    localDocuments,
    vectorDocuments,
    totalChunks,
    domainCounts,
    syncedAgents: ['EvaluationAgent', 'PathAgent', 'ReflectionAgent', 'TutorAgent', 'ResourceAgent', 'ProfileAgent'],
    updatedAt: new Date().toISOString(),
  }
}