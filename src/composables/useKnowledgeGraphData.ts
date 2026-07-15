import { ref } from 'vue'
import { fetchLearningPath, fetchEvaluation, fetchLatestProfile, fetchTutoringTopics, fetchKnowledgePath } from '@/lib/api'

// --- 通用类型 ---
export interface KnowledgeDomain {
  id: string
  name: string
  color: string
  short: string
  mastery: number
  topics: KnowledgeTopic[]
}

export interface KnowledgeTopic {
  id: string
  label: string
  mastery: number
  recommended?: boolean
  concepts?: string[]
  prerequisites?: string[]
}

export interface KnowledgeEdge {
  from: string
  to: string
  crossDomain?: boolean
}

// --- 颜色方案 ---
const DOMAIN_COLORS: Record<string, { color: string; short: string }> = {
  math: { color: '#00d4ff', short: 'MATH' },
  ml: { color: '#7c3aed', short: 'ML' },
  dl: { color: '#06d6a0', short: 'DL' },
  algo: { color: '#f59e0b', short: 'ALGO' },
  eng: { color: '#3b82f6', short: 'ENG' },
  nlp: { color: '#f43f5e', short: 'NLP' },
}

export const FALLBACK_DOMAINS: KnowledgeDomain[] = [
  {
    id: 'math', name: '数学基础', color: '#00d4ff', short: 'MATH', mastery: 0.72,
    topics: [
      { id: 'm1', label: '矩阵运算', mastery: 0.95 },
      { id: 'm2', label: '特征值与分解', mastery: 0.82 },
      { id: 'm3', label: '概率论', mastery: 0.78 },
      { id: 'm4', label: '微积分', mastery: 0.66 },
      { id: 'm5', label: '凸优化', mastery: 0.32, recommended: true },
    ],
  },
  {
    id: 'ml', name: '机器学习', color: '#7c3aed', short: 'ML', mastery: 0.65,
    topics: [
      { id: 'ml1', label: '监督学习', mastery: 0.88 },
      { id: 'ml2', label: '无监督学习', mastery: 0.62 },
      { id: 'ml3', label: '决策树/RF', mastery: 0.78 },
      { id: 'ml4', label: 'SVM', mastery: 0.55 },
      { id: 'ml5', label: '集成学习', mastery: 0.48 },
    ],
  },
  {
    id: 'dl', name: '深度学习', color: '#06d6a0', short: 'DL', mastery: 0.30,
    topics: [
      { id: 'dl1', label: '神经网络', mastery: 0.58 },
      { id: 'dl2', label: 'CNN', mastery: 0.32 },
      { id: 'dl3', label: 'RNN/LSTM', mastery: 0.22 },
      { id: 'dl4', label: 'Transformer', mastery: 0.12, recommended: true },
      { id: 'dl5', label: 'Attention', mastery: 0.18 },
    ],
  },
  {
    id: 'algo', name: '算法与数据结构', color: '#f59e0b', short: 'ALGO', mastery: 0.58,
    topics: [
      { id: 'a1', label: '排序与查找', mastery: 0.92 },
      { id: 'a2', label: '数据结构', mastery: 0.78 },
      { id: 'a3', label: '图算法', mastery: 0.42 },
      { id: 'a4', label: '动态规划', mastery: 0.30, recommended: true },
    ],
  },
  {
    id: 'eng', name: '工程实践', color: '#3b82f6', short: 'ENG', mastery: 0.50,
    topics: [
      { id: 'e1', label: 'Python工程', mastery: 0.72 },
      { id: 'e2', label: '版本控制', mastery: 0.65 },
      { id: 'e3', label: '模型部署', mastery: 0.30 },
    ],
  },
  {
    id: 'nlp', name: 'NLP与应用', color: '#f43f5e', short: 'NLP', mastery: 0.18,
    topics: [
      { id: 'n1', label: '词向量', mastery: 0.40 },
      { id: 'n2', label: 'LLM', mastery: 0.18 },
      { id: 'n3', label: '微调与对齐', mastery: 0.08 },
      { id: 'n4', label: '检索增强', mastery: 0.12, recommended: true },
    ],
  },
]

const FALLBACK_EDGES: KnowledgeEdge[] = [
  { from: 'm1', to: 'm2' }, { from: 'm1', to: 'm3' }, { from: 'm2', to: 'm4' },
  { from: 'm3', to: 'm4' }, { from: 'm4', to: 'm5' }, { from: 'm3', to: 'm5' },
  { from: 'ml1', to: 'ml2' }, { from: 'ml1', to: 'ml3' }, { from: 'ml2', to: 'ml4' },
  { from: 'ml3', to: 'ml4' }, { from: 'ml3', to: 'ml5' }, { from: 'ml1', to: 'ml5' },
  { from: 'dl1', to: 'dl2' }, { from: 'dl1', to: 'dl3' }, { from: 'dl2', to: 'dl4' },
  { from: 'dl3', to: 'dl4' }, { from: 'dl4', to: 'dl5' }, { from: 'dl3', to: 'dl5' },
  { from: 'a1', to: 'a2' }, { from: 'a2', to: 'a3' }, { from: 'a2', to: 'a4' },
  { from: 'e1', to: 'e2' }, { from: 'e2', to: 'e3' },
  { from: 'n1', to: 'n2' }, { from: 'n2', to: 'n3' }, { from: 'n2', to: 'n4' },
  { from: 'm1', to: 'dl1', crossDomain: true }, { from: 'm3', to: 'ml1', crossDomain: true },
  { from: 'ml1', to: 'dl1', crossDomain: true }, { from: 'a2', to: 'ml5', crossDomain: true },
  { from: 'dl4', to: 'n2', crossDomain: true }, { from: 'a2', to: 'e1', crossDomain: true },
]

export function useKnowledgeGraphData() {
  const domains = ref<KnowledgeDomain[]>(FALLBACK_DOMAINS)
  const edges = ref<KnowledgeEdge[]>(FALLBACK_EDGES)
  const loading = ref(false)
  const loaded = ref(false)

  async function loadFromBackend(force = false) {
    if (loaded.value && !force) return
    loading.value = true

    try {
      // 始终用 learning-path 数据（m1/m2/ml1 等 ID 命名空间跟星座 + mapTransforms.NODE_CONTENT 一致）
      // AI 知识路径用的是另一套 ID (f1/c1/d1/p1)，会让星座点击后无法匹配 topic
      const [pathData, evalData, profileData, topicsData] = await Promise.allSettled([
        fetchLearningPath().catch(() => null),
        fetchEvaluation().catch(() => null),
        fetchLatestProfile().catch(() => null),
        fetchTutoringTopics().catch(() => null),
      ])

      // 从学习路径数据提取领域和主题
      if (pathData.status === 'fulfilled' && pathData.value) {
        const lp = pathData.value as any
        if (lp.phases && Array.isArray(lp.phases)) {
          const newDomains: KnowledgeDomain[] = []
          const newEdges: KnowledgeEdge[] = []

          lp.phases.forEach((phase: any, pi: number) => {
            // 使用 JSON 中的 id/name/color/short，没有则 fallback
            const domainId = phase.id || `phase-${pi}`
            const colorInfo = DOMAIN_COLORS[domainId] || Object.values(DOMAIN_COLORS)[pi % Object.keys(DOMAIN_COLORS).length]
            const domain: KnowledgeDomain = {
              id: domainId,
              name: phase.name || `阶段 ${pi + 1}`,
              color: phase.color || colorInfo.color,
              short: phase.short || colorInfo.short,
              mastery: 0,
              topics: [],
            }

            if (phase.topics && Array.isArray(phase.topics)) {
              phase.topics.forEach((topic: any, ti: number) => {
                // 使用 JSON 中的 id，没有则生成
                const topicId = topic.id || `t-${domainId}-${ti}`
                const mastery = typeof topic.mastery === 'number' ? topic.mastery :
                  typeof topic.progress === 'number' ? topic.progress / 100 :
                  Math.random() * 0.6 + 0.1

                domain.topics.push({
                  id: topicId,
                  label: topic.name || topic.label || `主题 ${ti + 1}`,
                  mastery,
                  recommended: topic.recommended || false,
                  concepts: topic.concepts || [],
                  prerequisites: topic.prerequisites || [],
                })

                // 同领域内的前后关系
                if (ti > 0) {
                  const prevId = phase.topics[ti - 1]?.id || `t-${domainId}-${ti - 1}`
                  newEdges.push({ from: prevId, to: topicId })
                }
              })
            }

            domain.mastery = domain.topics.length > 0
              ? domain.topics.reduce((s, t) => s + t.mastery, 0) / domain.topics.length
              : 0

            newDomains.push(domain)

            // 跨领域连接
            if (pi > 0) {
              const prevDomain = newDomains[pi - 1]
              if (prevDomain.topics.length > 0 && domain.topics.length > 0) {
                newEdges.push({
                  from: prevDomain.topics[prevDomain.topics.length - 1].id,
                  to: domain.topics[0].id,
                  crossDomain: true,
                })
              }
            }
          })

          if (newDomains.length > 0) {
            domains.value = newDomains
            edges.value = newEdges
          }
        }
      }

      // 从辅导主题数据补充
      if (topicsData.status === 'fulfilled' && topicsData.value) {
        const raw = (topicsData.value as any).topics || topicsData.value
        if (Array.isArray(raw) && raw.length > 0 && domains.value.length > 0) {
          raw.forEach((cat: any, ci: number) => {
            if (cat.questions && Array.isArray(cat.questions)) {
              const domain = domains.value[ci % domains.value.length]
              cat.questions.forEach((q: string, qi: number) => {
                const existing = domain.topics.find(t => t.label === q)
                if (!existing) {
                  domain.topics.push({
                    id: `tq-${ci}-${qi}`,
                    label: q,
                    mastery: Math.random() * 0.5 + 0.1,
                    concepts: [],
                  })
                }
              })
            }
          })
        }
      }

      // 从评估数据更新掌握度
      if (evalData.status === 'fulfilled' && evalData.value) {
        const ev = evalData.value as any
        if (ev.masteryByDomain) {
          Object.entries(ev.masteryByDomain).forEach(([key, val]: [string, any]) => {
            const domain = domains.value.find(d =>
              d.id === key || d.name.includes(key) || d.short.toLowerCase() === key.toLowerCase()
            )
            if (domain && typeof val === 'number') {
              domain.mastery = val
            }
          })
        }
      }

      // 从学习画像(profile)数据动态调整掌握度
      if (profileData.status === 'fulfilled' && profileData.value) {
        const profile = profileData.value as any
        const dims = profile.dimensions || []
        if (dims.length > 0 && domains.value.length > 0) {
          // 维度名 → 值映射 (0-100 → 0-1)
          const dimMap: Record<string, number> = {}
          dims.forEach((d: any) => {
            dimMap[d.label] = (d.value || 0) / 100
          })

          // 每个领域与维度的关联权重
          const domainDimWeights: Record<string, { dim: string; weight: number }[]> = {
            math: [{ dim: '知识基础', weight: 0.5 }, { dim: '逻辑思维', weight: 0.3 }, { dim: '学习速度', weight: 0.2 }],
            ml: [{ dim: '逻辑思维', weight: 0.4 }, { dim: '知识基础', weight: 0.3 }, { dim: '创造力', weight: 0.3 }],
            dl: [{ dim: '创造力', weight: 0.4 }, { dim: '逻辑思维', weight: 0.3 }, { dim: '专注力', weight: 0.3 }],
            algo: [{ dim: '逻辑思维', weight: 0.5 }, { dim: '知识基础', weight: 0.3 }, { dim: '专注力', weight: 0.2 }],
            eng: [{ dim: '专注力', weight: 0.3 }, { dim: '自律性', weight: 0.3 }, { dim: '学习速度', weight: 0.4 }],
            nlp: [{ dim: '创造力', weight: 0.4 }, { dim: '学习速度', weight: 0.3 }, { dim: '知识基础', weight: 0.3 }],
          }

          // 根据 profile 调整每个领域的掌握度
          domains.value.forEach(d => {
            const weights = domainDimWeights[d.id]
            if (weights) {
              let profileMastery = 0
              let totalWeight = 0
              weights.forEach(w => {
                const dimVal = dimMap[w.dim]
                if (dimVal !== undefined) {
                  profileMastery += dimVal * w.weight
                  totalWeight += w.weight
                }
              })
              if (totalWeight > 0) {
                profileMastery /= totalWeight
                // 混合：70% 原有数据 + 30% profile 推断
                d.mastery = d.mastery * 0.7 + profileMastery * 0.3
              }
            }

            // 根据 profile 调整各 topic 的掌握度
            d.topics.forEach(t => {
              const weights = domainDimWeights[d.id]
              if (weights) {
                let topicBoost = 0
                weights.forEach(w => {
                  const dimVal = dimMap[w.dim]
                  if (dimVal !== undefined) topicBoost += dimVal * w.weight
                })
                if (weights.length > 0) topicBoost /= weights.length
                // 低掌握度的知识点提升更多（profile 推断你可能已经掌握了基础）
                const boost = t.mastery < 0.3 ? topicBoost * 0.15 : topicBoost * 0.05
                t.mastery = Math.min(1, t.mastery + boost)
              }
            })

            // 重新计算领域掌握度 = topic 平均
            if (d.topics.length > 0) {
              d.mastery = d.topics.reduce((s, t) => s + t.mastery, 0) / d.topics.length
            }
          })

          // 标记推荐学习的知识点（掌握度低但重要度高的）
          domains.value.forEach(d => {
            d.topics.forEach(t => {
              if (t.mastery < 0.25 && !t.recommended) {
                t.recommended = true
              }
            })
          })
        }
      }

      loaded.value = true
    } catch {
      // 保持 fallback 数据
    } finally {
      loading.value = false
    }
  }

  return { domains, edges, loading, loaded, loadFromBackend }
}
