import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mysql from 'mysql2/promise'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const legacyStorePath = path.join(__dirname, '..', 'store.json')

const DEFAULT_ACCOUNT = 'guest'
const MAX_PROFILE_HISTORY = 50

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
    CREATE TABLE IF NOT EXISTS learning_profiles (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      account_id VARCHAR(128) NOT NULL,
      source VARCHAR(64) NOT NULL DEFAULT 'profile',
      total_score INT NULL,
      dimensions_json JSON NULL,
      weaknesses_json JSON NULL,
      recommendations_json JSON NULL,
      profile_json JSON NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_learning_profiles_account_created (account_id, created_at),
      CONSTRAINT fk_learning_profiles_account
        FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  await pool.query(`
    CREATE TABLE IF NOT EXISTS learning_knowledge_paths (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      account_id VARCHAR(128) NOT NULL,
      source VARCHAR(64) NOT NULL DEFAULT 'knowledge-path',
      phases_json JSON NULL,
      path_json JSON NOT NULL,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      INDEX idx_learning_knowledge_paths_account_created (account_id, created_at),
      CONSTRAINT fk_learning_knowledge_paths_account
        FOREIGN KEY (account_id) REFERENCES user_accounts(account_id)
        ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `)

  mysqlReady = true
}

export function normalizeAccountId(accountId) {
  const normalized = String(accountId || '').trim()
  return normalized || DEFAULT_ACCOUNT
}

function accountFromContext(context = {}) {
  return {
    accountId: normalizeAccountId(context.accountId || context.account || context.userAccount),
    role: String(context.role || 'student').trim() || 'student',
    name: String(context.name || context.displayName || '').trim() || null,
  }
}

function enrichProfile(profile, context) {
  const account = accountFromContext(context)
  return {
    ...profile,
    accountId: account.accountId,
    userAccount: account.accountId,
    accountRole: account.role,
    savedAt: profile?.savedAt || new Date().toISOString(),
  }
}

function readLegacyStore() {
  if (!fs.existsSync(legacyStorePath)) {
    return {
      profileResult: null,
      knowledgePathResult: null,
      chatHistory: [],
      tutoringHistory: [],
      accounts: {},
      profileHistory: [],
      knowledgePathHistory: [],
    }
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(legacyStorePath, 'utf8'))
    return {
      profileResult: null,
      knowledgePathResult: null,
      chatHistory: [],
      tutoringHistory: [],
      accounts: {},
      profileHistory: [],
      knowledgePathHistory: [],
      ...parsed,
    }
  } catch {
    return {
      profileResult: null,
      knowledgePathResult: null,
      chatHistory: [],
      tutoringHistory: [],
      accounts: {},
      profileHistory: [],
      knowledgePathHistory: [],
    }
  }
}

function writeLegacyStore(store) {
  fs.writeFileSync(legacyStorePath, JSON.stringify(store, null, 2), 'utf8')
}

function getJsonProfile(accountId) {
  const store = readLegacyStore()
  const account = normalizeAccountId(accountId)
  const accountProfile = store.accounts?.[account]?.latestProfile
  if (accountProfile) return accountProfile

  const hasAccountProfiles = Object.values(store.accounts || {}).some(item => item?.latestProfile)
  if (!hasAccountProfiles && store.profileResult) {
    return store.profileResult
  }

  return null
}

function getJsonKnowledgePath(accountId) {
  const store = readLegacyStore()
  const account = normalizeAccountId(accountId)
  const accountPath = store.accounts?.[account]?.latestKnowledgePath
  if (accountPath) return accountPath

  const hasAccountPaths = Object.values(store.accounts || {}).some(item => item?.latestKnowledgePath)
  if (!hasAccountPaths && store.knowledgePathResult) {
    return store.knowledgePathResult
  }

  return null
}

function saveJsonProfile(profile, context = {}) {
  const account = accountFromContext(context)
  const store = readLegacyStore()
  const enriched = enrichProfile(profile, account)

  store.accounts = store.accounts || {}
  store.accounts[account.accountId] = {
    ...(store.accounts[account.accountId] || {}),
    accountId: account.accountId,
    role: account.role,
    name: account.name,
    latestProfile: enriched,
    updatedAt: enriched.savedAt,
  }

  store.profileResult = enriched
  store.profileHistory = [
    ...(store.profileHistory || []),
    {
      accountId: account.accountId,
      source: enriched.source || 'profile',
      totalScore: enriched.totalScore ?? null,
      savedAt: enriched.savedAt,
      profile: enriched,
    },
  ].slice(-MAX_PROFILE_HISTORY)

  writeLegacyStore(store)
  return enriched
}

function saveJsonKnowledgePath(result, context = {}) {
  const account = accountFromContext(context)
  const store = readLegacyStore()
  const enriched = {
    ...result,
    accountId: account.accountId,
    userAccount: account.accountId,
    savedAt: result?.savedAt || new Date().toISOString(),
  }

  store.accounts = store.accounts || {}
  store.accounts[account.accountId] = {
    ...(store.accounts[account.accountId] || {}),
    accountId: account.accountId,
    role: account.role,
    name: account.name,
    latestKnowledgePath: enriched,
    updatedAt: enriched.savedAt,
  }

  store.knowledgePathResult = enriched
  store.knowledgePathHistory = [
    ...(store.knowledgePathHistory || []),
    {
      accountId: account.accountId,
      source: enriched.source || 'knowledge-path',
      savedAt: enriched.savedAt,
      phaseCount: Array.isArray(enriched.phases) ? enriched.phases.length : null,
      path: enriched,
    },
  ].slice(-MAX_PROFILE_HISTORY)

  writeLegacyStore(store)
  return enriched
}

async function getMysqlProfile(accountId) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  if (!pool) return null

  const [rows] = await pool.query(
    `SELECT profile_json
     FROM learning_profiles
     WHERE account_id = ?
     ORDER BY created_at DESC, id DESC
     LIMIT 1`,
    [normalizeAccountId(accountId)],
  )

  if (!rows.length) return null
  const raw = rows[0].profile_json
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

async function getMysqlKnowledgePath(accountId) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  if (!pool) return null

  const [rows] = await pool.query(
    `SELECT path_json
     FROM learning_knowledge_paths
     WHERE account_id = ?
     ORDER BY created_at DESC, id DESC
     LIMIT 1`,
    [normalizeAccountId(accountId)],
  )

  if (!rows.length) return null
  const raw = rows[0].path_json
  return typeof raw === 'string' ? JSON.parse(raw) : raw
}

async function saveMysqlProfile(profile, context = {}) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  if (!pool) return null

  const account = accountFromContext(context)
  const enriched = enrichProfile(profile, account)

  await pool.query(
    `INSERT INTO user_accounts (account_id, role, display_name)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       role = VALUES(role),
       display_name = VALUES(display_name),
       updated_at = CURRENT_TIMESTAMP(3)`,
    [account.accountId, account.role, account.name],
  )

  await pool.query(
    `INSERT INTO learning_profiles (
      account_id, source, total_score, dimensions_json, weaknesses_json, recommendations_json, profile_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      account.accountId,
      enriched.source || 'profile',
      Number.isFinite(enriched.totalScore) ? enriched.totalScore : null,
      JSON.stringify(enriched.dimensions || []),
      JSON.stringify(enriched.weaknesses || []),
      JSON.stringify(enriched.recommendations || []),
      JSON.stringify(enriched),
    ],
  )

  return enriched
}

async function saveMysqlKnowledgePath(result, context = {}) {
  await ensureMysqlSchema()
  const pool = getMysqlPool()
  if (!pool) return null

  const account = accountFromContext(context)
  const enriched = {
    ...result,
    accountId: account.accountId,
    userAccount: account.accountId,
    savedAt: result?.savedAt || new Date().toISOString(),
  }

  await pool.query(
    `INSERT INTO user_accounts (account_id, role, display_name)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE
       role = VALUES(role),
       display_name = VALUES(display_name),
       updated_at = CURRENT_TIMESTAMP(3)`,
    [account.accountId, account.role, account.name],
  )

  await pool.query(
    `INSERT INTO learning_knowledge_paths (
      account_id, source, phases_json, path_json
    ) VALUES (?, ?, ?, ?)`,
    [
      account.accountId,
      enriched.source || 'knowledge-path',
      JSON.stringify(enriched.phases || []),
      JSON.stringify(enriched),
    ],
  )

  return enriched
}

export async function getLatestAccountProfile(accountId) {
  if (mysqlConfigured()) {
    try {
      return await getMysqlProfile(accountId)
    } catch (error) {
      console.warn('[account-profile] MySQL read failed, using JSON fallback:', error.message)
    }
  }

  return getJsonProfile(accountId)
}

export async function saveAccountProfile(profile, context = {}) {
  if (mysqlConfigured()) {
    try {
      return await saveMysqlProfile(profile, context)
    } catch (error) {
      console.warn('[account-profile] MySQL write failed, using JSON fallback:', error.message)
    }
  }

  return saveJsonProfile(profile, context)
}

export async function getLatestAccountKnowledgePath(accountId) {
  if (mysqlConfigured()) {
    try {
      return await getMysqlKnowledgePath(accountId)
    } catch (error) {
      console.warn('[account-profile] MySQL knowledge path read failed, using JSON fallback:', error.message)
    }
  }

  return getJsonKnowledgePath(accountId)
}

export async function saveAccountKnowledgePath(result, context = {}) {
  if (mysqlConfigured()) {
    try {
      return await saveMysqlKnowledgePath(result, context)
    } catch (error) {
      console.warn('[account-profile] MySQL knowledge path write failed, using JSON fallback:', error.message)
    }
  }

  return saveJsonKnowledgePath(result, context)
}
