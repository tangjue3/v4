import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import {
  getLatestAccountKnowledgePath,
  saveAccountKnowledgePath,
} from './store/account-profile.js'

const storePath = new URL('./store.json', import.meta.url)

test('knowledge paths are scoped by account', async () => {
  const before = fs.existsSync(storePath) ? fs.readFileSync(storePath, 'utf8') : null

  try {
    await saveAccountKnowledgePath(
      { source: 'test', phases: [{ title: 'Path A', modules: [] }] },
      { accountId: 'path-user-a', role: 'student', name: 'Path User A' },
    )
    await saveAccountKnowledgePath(
      { source: 'test', phases: [{ title: 'Path B', modules: [] }] },
      { accountId: 'path-user-b', role: 'student', name: 'Path User B' },
    )

    const pathA = await getLatestAccountKnowledgePath('path-user-a')
    const pathB = await getLatestAccountKnowledgePath('path-user-b')

    assert.equal(pathA.phases[0].title, 'Path A')
    assert.equal(pathB.phases[0].title, 'Path B')
    assert.equal(pathA.accountId, 'path-user-a')
    assert.equal(pathB.accountId, 'path-user-b')

    await saveAccountKnowledgePath(
      { source: 'initial', phases: [{ title: 'Original A', modules: [] }] },
      { accountId: 'review-path-a', role: 'student', name: 'Review Path A' },
    )
    await saveAccountKnowledgePath(
      { source: 'initial', phases: [{ title: 'Original B', modules: [] }] },
      { accountId: 'review-path-b', role: 'student', name: 'Review Path B' },
    )
    await saveAccountKnowledgePath(
      { source: 'review-reverse-update', phases: [{ title: 'Reviewed A', modules: [] }] },
      { accountId: 'review-path-a', role: 'student', name: 'Review Path A' },
    )

    const reviewedPathA = await getLatestAccountKnowledgePath('review-path-a')
    const reviewedPathB = await getLatestAccountKnowledgePath('review-path-b')

    assert.equal(reviewedPathA.source, 'review-reverse-update')
    assert.equal(reviewedPathA.phases[0].title, 'Reviewed A')
    assert.equal(reviewedPathB.source, 'initial')
    assert.equal(reviewedPathB.phases[0].title, 'Original B')
  } finally {
    if (before === null) fs.rmSync(storePath, { force: true })
    else fs.writeFileSync(storePath, before, 'utf8')
  }
})
