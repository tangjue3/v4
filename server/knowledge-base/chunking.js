const SENTENCE_END = /(?<=[。！？.!?\n])\s*/g

function splitParagraphs(text) {
  return String(text || '')
    .split(/\n{2,}/)
    .map(item => item.trim())
    .filter(Boolean)
}

function splitSentences(paragraph) {
  return paragraph
    .split(SENTENCE_END)
    .map(item => item.trim())
    .filter(Boolean)
}

export function chunkText(text, { maxChars = 350, minChars = 80, docId = 'doc' } = {}) {
  const paragraphs = splitParagraphs(text)
  if (!paragraphs.length) return []

  const buffer = []
  const out = []
  let pending = ''
  let pendingStart = 0

  function flush(force) {
    const candidate = pending.trim()
    if (!candidate) {
      pending = ''
      return
    }
    if (!force && candidate.length < minChars) return
    const id = `${docId}-ch${out.length + 1}`
    out.push({ id, text: candidate, charCount: candidate.length })
    pending = ''
    pendingStart = 0
  }

  for (const paragraph of paragraphs) {
    if (paragraph.length <= maxChars) {
      if (pending && pending.length + paragraph.length + 1 > maxChars) {
        flush(false)
      }
      if (!pending) {
        pending = paragraph
      } else {
        pending = `${pending}\n${paragraph}`
      }
    } else {
      flush(false)
      const sentences = splitSentences(paragraph)
      for (const sentence of sentences) {
        if (!pending) {
          pending = sentence
        } else if (pending.length + sentence.length + 1 > maxChars) {
          flush(false)
          pending = sentence
        } else {
          pending = `${pending} ${sentence}`
        }
      }
    }
  }
  flush(true)

  if (!out.length && paragraphs[0]) {
    out.push({ id: `${docId}-ch1`, text: paragraphs[0].slice(0, maxChars), charCount: Math.min(paragraphs[0].length, maxChars) })
  }
  return out
}

export function chunkDocument(document) {
  if (!document) return []
  if (Array.isArray(document.chunks) && document.chunks.length) {
    return document.chunks.map((chunk, index) => ({
      id: chunk.id || `${document.id}-ch${index + 1}`,
      text: chunk.text || '',
      charCount: (chunk.text || '').length,
    }))
  }
  const merged = [
    document.title,
    document.summary,
    document.content,
    document.agentHint,
  ].filter(Boolean).join('\n\n')
  return chunkText(merged, { docId: document.id })
}