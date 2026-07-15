import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'
import {
  applyReviewPatchToProfile,
  evaluateReviewAnswers,
  generateReviewQuestionSet,
  getMistakeQuestions,
  getReviewSessionQuestions,
  saveReviewQuestionSet,
  saveReviewResult,
} from './store/review-question.js'

const storePath = new URL('./store.json', import.meta.url)

test('review questions are account scoped and mistakes can update profile', async () => {
  const before = fs.existsSync(storePath) ? fs.readFileSync(storePath, 'utf8') : null

  try {
    const profile = {
      totalScore: 64,
      dimensions: [
        { label: '知识基础', value: 60, color: '#3b82f6' },
        { label: '知识迁移', value: 55, color: '#06d6a0' },
      ],
      weaknesses: [{ tag: 'BFS visited 标记', count: 2 }],
      recommendations: [],
    }
    const generated = generateReviewQuestionSet({
      accountId: 'review-test-user',
      profile,
      knowledgePoint: { id: 'bfs', name: 'BFS visited 标记' },
      count: 2,
    })

    await saveReviewQuestionSet(generated)
    const questions = await getReviewSessionQuestions('review-test-user', generated.session.sessionId)
    assert.equal(questions.length, 2)

    const wrongAnswers = questions.map(question => ({ questionId: question.questionId, answer: 1 }))
    const result = evaluateReviewAnswers(questions, wrongAnswers)
    assert.equal(result.correctRate, 0)
    assert.equal(result.mistakes.length, 2)

    await saveReviewResult({
      accountId: 'review-test-user',
      sessionId: generated.session.sessionId,
      evaluatedQuestions: result.evaluatedQuestions,
      mistakes: result.mistakes,
      result,
    })

    const mistakes = await getMistakeQuestions('review-test-user')
    assert.equal(mistakes.length, 2)

    const updatedProfile = applyReviewPatchToProfile(profile, result.profilePatch)
    assert.ok(updatedProfile.totalScore < profile.totalScore)
    assert.equal(updatedProfile.source, 'review-reverse-update')
  } finally {
    if (before === null) fs.rmSync(storePath, { force: true })
    else fs.writeFileSync(storePath, before, 'utf8')
  }
})
