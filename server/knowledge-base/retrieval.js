import { searchKnowledgeBaseAdvanced } from './vector-store.js'
import { recordRetrieval } from './metrics.js'

export function retrieveKnowledgeContext({
  agentName,
  query,
  profile,
  learningData,
  exerciseResults,
  domain,
  type,
  limit = 3,
  weights,
}) {
  try {
    const result = searchKnowledgeBaseAdvanced({
      query,
      profile,
      learningData,
      exerciseResults,
      domain,
      type,
      limit,
      weights,
      agentName,
    })
    recordRetrieval({
      agentName,
      query: result.query,
      matches: result.matches,
      durationMs: result.durationMs,
    })
    return result
  } catch (error) {
    return {
      query: query || '',
      detectedDomain: domain || null,
      matches: [],
      embedding: null,
      weights: weights || { vector: 0.5, tag: 0.3, keyword: 0.2 },
      durationMs: 0,
      agentName,
      error: error.message,
    }
  }
}

export function buildKnowledgeEvidence(kbContext, { summary = '本地知识库' } = {}) {
  const lines = [`${summary}已注入 (${kbContext.agentName || 'Agent'})`]
  if (kbContext.detectedDomain) {
    lines.push(`领域识别: ${kbContext.detectedDomain}`)
  }
  if (kbContext.matches?.length) {
    const titles = kbContext.matches.map(m => m.title).join(' / ')
    lines.push(`知识库命中 ${kbContext.matches.length} 条: ${titles}`)
  } else {
    lines.push('知识库未命中匹配文档，本轮不引用外部知识')
  }
  return lines
}

export function summarizeKnowledgeForPrompt(matches, maxChars = 800) {
  if (!matches?.length) return '（无可用知识参考）'
  const lines = matches.map((match, index) => {
    const tagPart = match.matchedProfileTags?.length ? ` tags=[${match.matchedProfileTags.join(',')}]` : ''
    return `[${index + 1}] ${match.title} (score=${match.score}${tagPart})\n${match.text}`
  })
  const joined = lines.join('\n\n')
  return joined.length > maxChars ? `${joined.slice(0, maxChars)}\n…(已截断)` : joined
}