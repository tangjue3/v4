import { test } from 'node:test'
import assert from 'node:assert/strict'
import { chunkText, chunkDocument } from '../server/knowledge-base/chunking.js'

test('chunkText splits by double newline', () => {
  const text = '第一段内容比较长。\n\n第二段。\n\n第三段。'
  const chunks = chunkText(text, { maxChars: 500, minChars: 10 })
  assert.ok(chunks.length >= 1)
  assert.equal(chunks[0].id.includes('ch'), true)
})

test('chunkText merges short paragraphs', () => {
  const text = '短段1。\n\n短段2。\n\n短段3。\n\n短段4。'
  const chunks = chunkText(text, { maxChars: 500, minChars: 50 })
  for (const chunk of chunks) {
    assert.ok(chunk.charCount >= 50 || chunks.length === 1)
  }
})

test('chunkText splits overly long paragraphs by sentence', () => {
  const long = '这是第一句。这是第二句。这是第三句。这是第四句。这是第五句。'.repeat(5)
  const chunks = chunkText(long, { maxChars: 100, minChars: 20 })
  assert.ok(chunks.length > 1)
  for (const chunk of chunks) {
    assert.ok(chunk.charCount <= 120)
  }
})

test('chunkText returns empty for empty input', () => {
  assert.deepEqual(chunkText(''), [])
  assert.deepEqual(chunkText(null), [])
})

test('chunkText preserves docId in chunk id', () => {
  const chunks = chunkText('段落内容', { docId: 'kb-test', maxChars: 500, minChars: 5 })
  assert.ok(chunks[0].id.startsWith('kb-test-ch'))
})

test('chunkDocument uses provided chunks array', () => {
  const doc = {
    id: 'kb-x',
    chunks: [
      { id: 'c1', text: 'one' },
      { id: 'c2', text: 'two' },
    ],
  }
  const result = chunkDocument(doc)
  assert.equal(result.length, 2)
  assert.equal(result[0].id, 'c1')
  assert.equal(result[1].text, 'two')
})

test('chunkDocument falls back to chunkText when no chunks', () => {
  const doc = {
    id: 'kb-y',
    title: '标题',
    summary: '摘要',
    content: '正文内容',
  }
  const result = chunkDocument(doc)
  assert.ok(result.length >= 1)
  assert.ok(result[0].text.includes('标题') || result[0].text.includes('正文'))
})