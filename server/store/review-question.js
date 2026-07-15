import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'
import { normalizeAccountId } from './account-profile.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const legacyStorePath = path.join(__dirname, '..', 'store.json')

let mysqlPool = null
let mysqlReady = false

function mysqlConfigured() {
  return Boolean(process.env.MYSQL_URL || process.env.MYSQL_HOST)
}

function getMysqlPool() {
  if (!mysqlConfigured()) return null
  if (mysqlPool) return mysqlPool

  mysqlPool = process.env.MYSQL_URL
    ? mysql.createPool(process.env.MYSQL_URL)
    : mysql.createPool({
        host: process.env.MYSQL_HOST || '127.0.0.1',
        port: Number(process.env.MYSQL_PORT || 3306),
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'edumind',
        waitForConnections: true,
        connectionLimit: Number(process.env.MYSQL_CONNECTION_LIMIT || 5),
        charset: 'utf8mb4',
      })

  return mysqlPool
}

async function ensureMysqlSchema() {
  if (mysqlReady) return
  const pool = getMysqlPool()
  if (!pool) return

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_accounts (
      account_id VARCHAR(128) PRIMARY KEY,
      role VARCHAR(32) NOT NULL DEFAULT 'student',
      display_name VARCHAR(128) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS review_sessions (
      session_id VARCHAR(64) PRIMARY KEY,
      account_id VARCHAR(128) NOT NULL,
      source VARCHAR(64) NOT NULL DEFAULT 'evaluation-live2d',
      knowledge_point_id VARCHAR(128) NULL,
      knowledge_point_name VARCHAR(255) NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'generated',
      correct_rate DECIMAL(5,4) NULL,
      profile_patch_json JSON NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      submitted_at DATETIME(3) NULL,
      INDEX idx_review_sessions_account_created (account_id, created_at),
      CONSTRAINT fk_review_sessions_account
        FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS review_questions (
      question_id VARCHAR(64) PRIMARY KEY,
      session_id VARCHAR(64) NOT NULL,
      account_id VARCHAR(128) NOT NULL,
      knowledge_point_id VARCHAR(128) NULL,
      knowledge_point_name VARCHAR(255) NULL,
      question_type VARCHAR(32) NOT NULL DEFAULT 'single-choice',
      difficulty VARCHAR(32) NOT NULL DEFAULT 'adaptive',
      prompt TEXT NOT NULL,
      options_json JSON NULL,
      answer_json JSON NOT NULL,
      explanation TEXT NULL,
      mistake_tags_json JSON NULL,
      status VARCHAR(32) NOT NULL DEFAULT 'generated',
      user_answer_json JSON NULL,
      is_correct TINYINT(1) NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      answered_at DATETIME(3) NULL,
      INDEX idx_review_questions_account_created (account_id, created_at),
      INDEX idx_review_questions_account_correct (account_id, is_correct),
      CONSTRAINT fk_review_questions_session
        FOREIGN KEY (session_id) REFERENCES review_sessions(session_id)
        ON DELETE CASCADE,
      CONSTRAINT fk_review_questions_account
        FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  mysqlReady = true
}

function nowIso() {
  return new Date().toISOString()
}

function createId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function readLegacyStore() {
  if (!fs.existsSync(legacyStorePath)) return { profileResult: null, accounts: {} }

  try {
    return { profileResult: null, accounts: {}, ...JSON.parse(fs.readFileSync(legacyStorePath, 'utf8')) }
  } catch {
    return { profileResult: null, accounts: {} }
  }
}

function writeLegacyStore(store) {
  fs.writeFileSync(legacyStorePath, JSON.stringify(store, null, 2), 'utf8')
}

function ensureJsonAccount(store, accountId) {
  store.accounts = store.accounts || {}
  store.accounts[accountId] = {
    accountId,
    reviewSessions: [],
    reviewQuestions: [],
    mistakeQuestions: [],
    ...(store.accounts[accountId] || {}),
  }
  store.accounts[accountId].reviewSessions = store.accounts[accountId].reviewSessions || []
  store.accounts[accountId].reviewQuestions = store.accounts[accountId].reviewQuestions || []
  store.accounts[accountId].mistakeQuestions = store.accounts[accountId].mistakeQuestions || []
  return store.accounts[accountId]
}

export function generateReviewQuestionSet({ accountId, profile, knowledgePoint, count = 5, source = 'evaluation-live2d' }) {
  const resolvedAccountId = normalizeAccountId(accountId)
  const sessionId = createId('review')
  const topics = resolveReviewTopics({ profile, knowledgePoint, count })
  const createdAt = nowIso()
  const questions = topics.map((topic, index) => createQuestion({
    accountId: resolvedAccountId,
    sessionId,
    topic,
    index,
    profile,
    source,
    createdAt,
  }))

  return {
    session: {
      sessionId,
      accountId: resolvedAccountId,
      source,
      status: 'generated',
      knowledgePointId: knowledgePoint?.id || topics[0]?.id || null,
      knowledgePointName: knowledgePoint?.name || topics[0]?.name || null,
      createdAt,
    },
    questions,
  }
}

function resolveReviewTopics({ profile, knowledgePoint, count }) {
  const explicit = knowledgePoint?.name
    ? [{
        id: knowledgePoint.id || normalizeTopicId(knowledgePoint.name),
        name: knowledgePoint.name,
        reason: knowledgePoint.reason || 'selected-knowledge-point',
      }]
    : []

  const weakTopics = (profile?.weaknesses || []).map((item, index) => {
    const tag = typeof item === 'string' ? item : item.tag || item.label || item.name
    return {
      id: normalizeTopicId(tag || `weak-${index + 1}`),
      name: tag || `薄弱点 ${index + 1}`,
      reason: 'profile-weakness',
    }
  })

  const dimensionTopics = (profile?.dimensions || [])
    .slice()
    .sort((a, b) => Number(a.value || 0) - Number(b.value || 0))
    .map((item, index) => ({
      id: normalizeTopicId(item.label || `dimension-${index + 1}`),
      name: item.label || `画像维度 ${index + 1}`,
      reason: 'low-profile-dimension',
    }))

  const fallback = [
    { id: 'core-concept', name: '核心概念', reason: 'fallback' },
    { id: 'applied-practice', name: '基础应用', reason: 'fallback' },
    { id: 'transfer-thinking', name: '知识迁移', reason: 'fallback' },
  ]
  const merged = [...explicit, ...weakTopics, ...dimensionTopics, ...fallback]
  const deduped = merged.filter((item, index) => merged.findIndex(candidate => candidate.id === item.id) === index)
  return deduped.slice(0, Math.max(1, Math.min(Number(count) || 5, 10)))
}

function normalizeTopicId(value) {
  return String(value || 'topic')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'topic'
}

function createQuestion({ accountId, sessionId, topic, index, profile, source, createdAt }) {
  const score = Number(profile?.totalScore || 60)
  const difficulty = score >= 75 ? 'advanced' : score >= 55 ? 'adaptive' : 'foundation'
  const base = topic.name

  return {
    questionId: createId('rq'),
    sessionId,
    accountId,
    source,
    knowledgePointId: topic.id,
    knowledgePointName: base,
    questionType: 'single-choice',
    difficulty,
    prompt: `关于「${base}」，如果你刚刚做错了一道相关题，最适合的复盘动作是什么？`,
    options: [
      `先复盘 ${base} 的定义，再完成一个最小练习`,
      `直接跳过 ${base}，进入更难的综合项目`,
      '只收藏相关资料，不做任何输出',
      `把 ${base} 的错题结论删除，避免影响画像`,
    ],
    answer: 0,
    explanation: `先确认「${base}」的概念边界，再用最小练习验证，能让错题证据更稳定地回写画像。`,
    mistakeTags: [base, topic.reason, difficulty],
    status: 'generated',
    createdAt,
    order: index + 1,
  }
}

export function evaluateReviewAnswers(questions, answers) {
  const answerMap = new Map((answers || []).map(item => [item.questionId, item.answer]))
  const answeredAt = nowIso()
  const evaluatedQuestions = questions.map((question) => {
    const userAnswer = answerMap.get(question.questionId)
    const isCorrect = normalizeAnswer(userAnswer) === normalizeAnswer(question.answer)
    return { ...question, status: 'answered', userAnswer, isCorrect, answeredAt }
  })
  const correctCount = evaluatedQuestions.filter(item => item.isCorrect).length
  const correctRate = evaluatedQuestions.length ? correctCount / evaluatedQuestions.length : 0
  const mistakes = evaluatedQuestions.filter(item => !item.isCorrect)
  const weakTags = Array.from(new Set(mistakes.flatMap(item => item.mistakeTags || []))).slice(0, 8)

  return {
    evaluatedQuestions,
    mistakes,
    correctCount,
    totalQuestions: evaluatedQuestions.length,
    correctRate,
    weakTags,
    profilePatch: buildProfilePatch(correctRate, weakTags, mistakes),
  }
}

function normalizeAnswer(answer) {
  if (Array.isArray(answer)) return JSON.stringify(answer.map(String).sort())
  return String(answer ?? '').trim()
}

function buildProfilePatch(correctRate, weakTags, mistakes) {
  const severity = correctRate >= 0.8 ? 'strengthen' : correctRate >= 0.6 ? 'stabilize' : 'repair'
  const dimensionDelta = correctRate >= 0.8 ? 4 : correctRate >= 0.6 ? 1 : -6
  return {
    source: 'review-session',
    correctRate,
    severity,
    dimensionDelta,
    weakTags,
    mistakeCount: mistakes.length,
    reason: `Review correct rate ${Math.round(correctRate * 100)}%, ${mistakes.length} mistakes captured.`,
    updatedAt: nowIso(),
  }
}

export function applyReviewPatchToProfile(profile, patch) {
  if (!profile || !patch) return null
  const dimensions = (profile.dimensions || []).map((dimension, index) => {
    const shouldAdjust = index === 0 || patch.weakTags.some(tag => String(tag).includes(dimension.label))
    if (!shouldAdjust) return dimension
    return {
      ...dimension,
      value: Math.max(0, Math.min(100, Math.round(Number(dimension.value || 0) + patch.dimensionDelta))),
    }
  })
  const totalScore = dimensions.length
    ? Math.round(dimensions.reduce((sum, item) => sum + Number(item.value || 0), 0) / dimensions.length)
    : profile.totalScore
  const reviewWeaknesses = patch.weakTags.slice(0, 5).map(tag => ({ tag, count: patch.severity === 'repair' ? 3 : 1 }))

  return {
    ...profile,
    dimensions,
    totalScore,
    weaknesses: mergeWeaknesses(reviewWeaknesses, profile.weaknesses || []),
    recommendations: [
      `根据本次复测正确率 ${Math.round(patch.correctRate * 100)}%，已将错题证据回写到画像。`,
      ...(profile.recommendations || []),
    ].slice(0, 8),
    source: 'review-reverse-update',
    lastReviewPatch: patch,
    savedAt: nowIso(),
  }
}

function mergeWeaknesses(primary, secondary) {
  const byTag = new Map()
  for (const item of [...primary, ...secondary]) {
    const tag = item?.tag || item?.label || String(item || '')
    if (!tag) continue
    const existing = byTag.get(tag)
    byTag.set(tag, {
      tag,
      count: Math.max(Number(existing?.count || 0), Number(item.count || 1)),
    })
  }
  return Array.from(byTag.values()).slice(0, 10)
}

export async function saveReviewQuestionSet({ session, questions }) {
  if (mysqlConfigured()) {
    try {
      await saveMysqlQuestionSet({ session, questions })
      return { session, questions }
    } catch (error) {
      console.warn('[review-question] MySQL write failed, using JSON fallback:', error.message)
    }
  }

  return saveJsonQuestionSet({ session, questions })
}

async function saveMysqlQuestionSet({ session, questions }) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  await pool.query(
    `INSERT INTO user_accounts (account_id, role)
     VALUES (?, 'student')
     ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP(3)`,
    [session.accountId],
  )
  await pool.query(
    `INSERT INTO review_sessions (
      session_id, account_id, source, knowledge_point_id, knowledge_point_name, status
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [session.sessionId, session.accountId, session.source, session.knowledgePointId, session.knowledgePointName, session.status],
  )

  for (const question of questions) {
    await pool.query(
      `INSERT INTO review_questions (
        question_id, session_id, account_id, knowledge_point_id, knowledge_point_name,
        question_type, difficulty, prompt, options_json, answer_json, explanation,
        mistake_tags_json, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        question.questionId,
        question.sessionId,
        question.accountId,
        question.knowledgePointId,
        question.knowledgePointName,
        question.questionType,
        question.difficulty,
        question.prompt,
        JSON.stringify(question.options || []),
        JSON.stringify(question.answer),
        question.explanation,
        JSON.stringify(question.mistakeTags || []),
        question.status,
      ],
    )
  }
}

function saveJsonQuestionSet({ session, questions }) {
  const store = readLegacyStore()
  const account = ensureJsonAccount(store, session.accountId)
  account.reviewSessions = [...account.reviewSessions, session].slice(-30)
  account.reviewQuestions = [...account.reviewQuestions, ...questions].slice(-300)
  writeLegacyStore(store)
  return { session, questions }
}

export async function getReviewSessionQuestions(accountId, sessionId) {
  const resolvedAccountId = normalizeAccountId(accountId)
  if (mysqlConfigured()) {
    try {
      return await getMysqlReviewSessionQuestions(resolvedAccountId, sessionId)
    } catch (error) {
      console.warn('[review-question] MySQL read failed, using JSON fallback:', error.message)
    }
  }

  const store = readLegacyStore()
  const account = ensureJsonAccount(store, resolvedAccountId)
  return account.reviewQuestions.filter(item => item.sessionId === sessionId)
}

async function getMysqlReviewSessionQuestions(accountId, sessionId) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  const [rows] = await pool.query(
    `SELECT *
     FROM review_questions
     WHERE account_id = ? AND session_id = ?
     ORDER BY created_at ASC`,
    [accountId, sessionId],
  )
  return rows.map(rowToQuestion)
}

function rowToQuestion(row) {
  return {
    questionId: row.question_id,
    sessionId: row.session_id,
    accountId: row.account_id,
    knowledgePointId: row.knowledge_point_id,
    knowledgePointName: row.knowledge_point_name,
    questionType: row.question_type,
    difficulty: row.difficulty,
    prompt: row.prompt,
    options: parseJson(row.options_json, []),
    answer: parseJson(row.answer_json, null),
    explanation: row.explanation,
    mistakeTags: parseJson(row.mistake_tags_json, []),
    status: row.status,
    userAnswer: parseJson(row.user_answer_json, null),
    isCorrect: row.is_correct === null || row.is_correct === undefined ? null : Boolean(row.is_correct),
    createdAt: row.created_at,
    answeredAt: row.answered_at,
  }
}

function parseJson(value, fallback) {
  if (value === null || value === undefined) return fallback
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

export async function saveReviewResult({ accountId, sessionId, evaluatedQuestions, mistakes, result }) {
  const resolvedAccountId = normalizeAccountId(accountId)
  if (mysqlConfigured()) {
    try {
      await saveMysqlReviewResult({ accountId: resolvedAccountId, sessionId, evaluatedQuestions, result })
      return result
    } catch (error) {
      console.warn('[review-question] MySQL result write failed, using JSON fallback:', error.message)
    }
  }

  const store = readLegacyStore()
  const account = ensureJsonAccount(store, resolvedAccountId)
  const byId = new Map(evaluatedQuestions.map(item => [item.questionId, item]))
  account.reviewQuestions = account.reviewQuestions.map(item => byId.get(item.questionId) || item)
  account.reviewSessions = account.reviewSessions.map(item => (
    item.sessionId === sessionId
      ? {
          ...item,
          status: 'submitted',
          submittedAt: nowIso(),
          correctRate: result.correctRate,
          profilePatch: result.profilePatch,
        }
      : item
  ))
  account.mistakeQuestions = [
    ...account.mistakeQuestions,
    ...mistakes.map(item => ({ ...item, mistakeCapturedAt: nowIso() })),
  ].slice(-200)
  writeLegacyStore(store)
  return result
}

async function saveMysqlReviewResult({ accountId, sessionId, evaluatedQuestions, result }) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  for (const question of evaluatedQuestions) {
    await pool.query(
      `UPDATE review_questions
       SET status = 'answered',
           user_answer_json = ?,
           is_correct = ?,
           answered_at = CURRENT_TIMESTAMP(3)
       WHERE account_id = ? AND session_id = ? AND question_id = ?`,
      [
        JSON.stringify(question.userAnswer ?? null),
        question.isCorrect ? 1 : 0,
        accountId,
        sessionId,
        question.questionId,
      ],
    )
  }
  await pool.query(
    `UPDATE review_sessions
     SET status = 'submitted',
         correct_rate = ?,
         profile_patch_json = ?,
         submitted_at = CURRENT_TIMESTAMP(3)
     WHERE account_id = ? AND session_id = ?`,
    [result.correctRate, JSON.stringify(result.profilePatch), accountId, sessionId],
  )
}

export async function getMistakeQuestions(accountId, limit = 50) {
  const resolvedAccountId = normalizeAccountId(accountId)
  const resolvedLimit = Math.max(1, Math.min(Number(limit) || 50, 100))
  if (mysqlConfigured()) {
    try {
      return await getMysqlMistakeQuestions(resolvedAccountId, resolvedLimit)
    } catch (error) {
      console.warn('[review-question] MySQL mistakes read failed, using JSON fallback:', error.message)
    }
  }

  const store = readLegacyStore()
  const account = ensureJsonAccount(store, resolvedAccountId)
  return account.mistakeQuestions.slice(-resolvedLimit).reverse()
}

async function getMysqlMistakeQuestions(accountId, limit) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  const [rows] = await pool.query(
    `SELECT *
     FROM review_questions
     WHERE account_id = ? AND is_correct = 0
     ORDER BY answered_at DESC, created_at DESC
     LIMIT ?`,
    [accountId, limit],
  )
  return rows.map(rowToQuestion)
}
