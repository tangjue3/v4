import type {
  BaseKnowledgeItem,
  ConstellationNode,
  ConstellationEdge,
  MetroLine,
  MatrixCell,
  ConcentricRing,
  OrbitTrack,
  NodeDetail,
  StageResource,
  LearningStage,
  StageContentMap,
} from './mapTypes'

export const BASE_KNOWLEDGE_ITEMS: BaseKnowledgeItem[] = [
  { id: 'm1', label: '矩阵运算', domain: 'math', mastery: 0.95, importance: 0.9, relations: ['m2', 'ml1', 'dl1'], relationType: 'prerequisite' },
  { id: 'm2', label: '特征值与分解', domain: 'math', mastery: 0.82, importance: 0.7, relations: ['m4', 'ml3'], relationType: 'prerequisite' },
  { id: 'm3', label: '概率论', domain: 'math', mastery: 0.78, importance: 0.85, relations: ['m4', 'ml1'], relationType: 'prerequisite' },
  { id: 'm4', label: '微积分', domain: 'math', mastery: 0.66, importance: 0.8, relations: ['m5'], relationType: 'prerequisite' },
  { id: 'm5', label: '凸优化', domain: 'math', mastery: 0.32, importance: 0.6, relations: [], relationType: 'prerequisite' },
  { id: 'ml1', label: '监督学习', domain: 'ml', mastery: 0.88, importance: 0.95, relations: ['ml2', 'ml3', 'ml5'], relationType: 'prerequisite' },
  { id: 'ml2', label: '无监督学习', domain: 'ml', mastery: 0.62, importance: 0.7, relations: ['ml4'], relationType: 'similar' },
  { id: 'ml3', label: '决策树 / RF', domain: 'ml', mastery: 0.78, importance: 0.65, relations: ['ml4', 'ml5'], relationType: 'similar' },
  { id: 'ml4', label: 'SVM', domain: 'ml', mastery: 0.55, importance: 0.5, relations: [], relationType: 'similar' },
  { id: 'ml5', label: '集成学习', domain: 'ml', mastery: 0.48, importance: 0.55, relations: [], relationType: 'application' },
  { id: 'dl1', label: '神经网络', domain: 'dl', mastery: 0.58, importance: 0.9, relations: ['dl2', 'dl3'], relationType: 'prerequisite' },
  { id: 'dl2', label: 'CNN', domain: 'dl', mastery: 0.32, importance: 0.75, relations: ['dl4'], relationType: 'similar' },
  { id: 'dl3', label: 'RNN / LSTM', domain: 'dl', mastery: 0.20, importance: 0.6, relations: ['dl4', 'dl5'], relationType: 'similar' },
  { id: 'dl4', label: 'Transformer', domain: 'dl', mastery: 0.10, importance: 0.95, relations: ['n2'], relationType: 'application', },
  { id: 'dl5', label: 'Attention', domain: 'dl', mastery: 0.18, importance: 0.85, relations: ['dl4'], relationType: 'prerequisite' },
  { id: 'a1', label: '排序与查找', domain: 'algo', mastery: 0.92, importance: 0.8, relations: ['a2'], relationType: 'prerequisite' },
  { id: 'a2', label: '数据结构', domain: 'algo', mastery: 0.78, importance: 0.9, relations: ['a3', 'a4', 'e1'], relationType: 'prerequisite' },
  { id: 'a3', label: '图算法', domain: 'algo', mastery: 0.42, importance: 0.75, relations: ['a4'], relationType: 'similar' },
  { id: 'a4', label: '动态规划', domain: 'algo', mastery: 0.30, importance: 0.7, relations: [], relationType: 'application' },
  { id: 'e1', label: 'Python 工程', domain: 'eng', mastery: 0.72, importance: 0.6, relations: ['e2', 'e3'], relationType: 'prerequisite' },
  { id: 'e2', label: '版本控制', domain: 'eng', mastery: 0.65, importance: 0.4, relations: ['e3'], relationType: 'prerequisite' },
  { id: 'e3', label: '模型部署', domain: 'eng', mastery: 0.30, importance: 0.5, relations: [], relationType: 'application' },
  { id: 'n1', label: '词向量', domain: 'nlp', mastery: 0.40, importance: 0.6, relations: ['n2'], relationType: 'prerequisite' },
  { id: 'n2', label: 'LLM', domain: 'nlp', mastery: 0.18, importance: 0.9, relations: ['n3', 'n4'], relationType: 'application' },
  { id: 'n3', label: '微调与对齐', domain: 'nlp', mastery: 0.08, importance: 0.7, relations: [], relationType: 'application' },
  { id: 'n4', label: '检索增强', domain: 'nlp', mastery: 0.12, importance: 0.8, relations: [], relationType: 'application' },
]

const DOMAIN_META: Record<string, { name: string; color: string; short: string }> = {
  math: { name: '数学基础', color: '#00d4ff', short: 'MATH' },
  ml: { name: '机器学习', color: '#7c3aed', short: 'ML' },
  dl: { name: '深度学习', color: '#06d6a0', short: 'DL' },
  algo: { name: '算法与数据结构', color: '#f59e0b', short: 'ALGO' },
  eng: { name: '工程实践', color: '#3b82f6', short: 'ENG' },
  nlp: { name: 'NLP 应用', color: '#f43f5e', short: 'NLP' },
}

export function getDomainMeta(domain: string) {
  return DOMAIN_META[domain] || { name: domain, color: '#8892b0', short: domain.toUpperCase() }
}

export function buildConstellationView(items: BaseKnowledgeItem[]): {
  nodes: ConstellationNode[]
  edges: ConstellationEdge[]
} {
  const domainKeys = Object.keys(DOMAIN_META)
  const domainPositions: Record<string, { cx: number; cy: number }> = {
    math: { cx: 300, cy: 350 },
    ml: { cx: 700, cy: 250 },
    dl: { cx: 1050, cy: 300 },
    algo: { cx: 280, cy: 700 },
    eng: { cx: 680, cy: 680 },
    nlp: { cx: 1050, cy: 660 },
  }

  const nodes: ConstellationNode[] = items.map((item, i) => {
    const pos = domainPositions[item.domain]
    const domainItems = items.filter(it => it.domain === item.domain)
    const idx = domainItems.indexOf(item)
    const spread = 120
    const angleOffset = (idx / domainItems.length) * Math.PI * 2
    const r = 40 + idx * 25
    return {
      ...item,
      relationType: item.relationType || 'similar',
      x: pos.cx + r * Math.cos(angleOffset),
      y: pos.cy + r * Math.sin(angleOffset),
    }
  })

  const edges: ConstellationEdge[] = []
  const nodeIds = new Set(items.map(i => i.id))
  for (const item of items) {
    for (const relId of item.relations) {
      if (nodeIds.has(relId)) {
        edges.push({ from: item.id, to: relId, type: item.relationType || 'similar' })
      }
    }
  }

  return { nodes, edges }
}

export function buildMetroView(_items: BaseKnowledgeItem[]): MetroLine[] {
  return [
    {
      id: 'math', name: '数学基础线', color: '#00d4ff',
      waypoints: [[120, 200], [1280, 200]],
      stations: [
        { id: 'ms1', x: 140, y: 200, label: '集合 / 线代基础', mastery: 1.0, prerequisite: '—', nextStation: '矩阵运算', estimatedTime: '2h' },
        { id: 'ms2', x: 310, y: 200, label: '矩阵运算', mastery: 0.95, interchange: ['ml'], prerequisite: '线代基础', nextStation: '特征值', estimatedTime: '3h' },
        { id: 'ms3', x: 470, y: 200, label: '特征值与分解', mastery: 0.82, prerequisite: '矩阵运算', nextStation: '微积分', estimatedTime: '4h' },
        { id: 'ms4', x: 640, y: 200, label: '微积分', mastery: 0.66, interchange: ['ml', 'dl'], prerequisite: '特征值', nextStation: '概率统计', estimatedTime: '5h' },
        { id: 'ms5', x: 820, y: 200, label: '概率与统计', mastery: 0.78, prerequisite: '微积分', nextStation: '凸优化', estimatedTime: '3h' },
        { id: 'ms6', x: 980, y: 200, label: '凸优化', mastery: 0.30, interchange: ['ml', 'dl'], recommended: true, isRemedial: true, prerequisite: '概率统计', nextStation: '信息论', estimatedTime: '6h' },
        { id: 'ms7', x: 1150, y: 200, label: '信息论', mastery: 0.05, prerequisite: '凸优化', nextStation: '—', estimatedTime: '4h' },
      ],
    },
    {
      id: 'ml', name: '机器学习线', color: '#7c3aed',
      waypoints: [[120, 370], [1280, 370]],
      stations: [
        { id: 'mls1', x: 140, y: 370, label: 'Python 基础', mastery: 1.0, prerequisite: '—', nextStation: '数据预处理', estimatedTime: '2h' },
        { id: 'mls2', x: 310, y: 370, label: '数据预处理', mastery: 0.88, interchange: ['math'], prerequisite: 'Python', nextStation: '监督学习', estimatedTime: '3h' },
        { id: 'mls3', x: 470, y: 370, label: '监督学习', mastery: 0.82, prerequisite: '数据预处理', nextStation: '回归与分类', estimatedTime: '5h' },
        { id: 'mls4', x: 640, y: 370, label: '回归与分类', mastery: 0.66, interchange: ['math', 'dl'], prerequisite: '监督学习', nextStation: '集成方法', estimatedTime: '4h' },
        { id: 'mls5', x: 820, y: 370, label: '集成方法', mastery: 0.52, prerequisite: '回归与分类', nextStation: '模型评估', estimatedTime: '3h' },
        { id: 'mls6', x: 980, y: 370, label: '模型评估', mastery: 0.46, interchange: ['math', 'dl'], prerequisite: '集成方法', nextStation: 'AutoML', estimatedTime: '4h' },
        { id: 'mls7', x: 1150, y: 370, label: 'AutoML', mastery: 0.10, prerequisite: '模型评估', nextStation: '—', estimatedTime: '5h' },
      ],
    },
    {
      id: 'dl', name: '深度学习线', color: '#06d6a0',
      waypoints: [[400, 540], [1280, 540]],
      stations: [
        { id: 'dls1', x: 420, y: 540, label: '感知机 / MLP', mastery: 0.62, prerequisite: '—', nextStation: '神经网络', estimatedTime: '3h' },
        { id: 'dls2', x: 640, y: 540, label: '神经网络', mastery: 0.50, interchange: ['math', 'ml'], prerequisite: 'MLP', nextStation: 'CNN', estimatedTime: '6h' },
        { id: 'dls3', x: 820, y: 540, label: 'CNN', mastery: 0.32, isRemedial: true, prerequisite: '神经网络', nextStation: 'RNN/LSTM', estimatedTime: '5h' },
        { id: 'dls4', x: 980, y: 540, label: 'RNN / LSTM', mastery: 0.22, interchange: ['math', 'ml'], prerequisite: 'CNN', nextStation: 'Transformer', estimatedTime: '5h' },
        { id: 'dls5', x: 1140, y: 540, label: 'Transformer', mastery: 0.12, youAreHere: true, recommended: true, prerequisite: 'RNN/LSTM', nextStation: '大模型预训练', estimatedTime: '8h' },
        { id: 'dls6', x: 1280, y: 540, label: '大模型预训练', mastery: 0.04, prerequisite: 'Transformer', nextStation: '—', estimatedTime: '10h' },
      ],
    },
    {
      id: 'algo', name: '算法数据线', color: '#f59e0b',
      waypoints: [[120, 710], [1180, 710]],
      stations: [
        { id: 'as1', x: 140, y: 710, label: '数据结构', mastery: 0.88, prerequisite: '—', nextStation: '排序查找', estimatedTime: '4h' },
        { id: 'as2', x: 310, y: 710, label: '排序与查找', mastery: 0.92, prerequisite: '数据结构', nextStation: '图算法', estimatedTime: '3h' },
        { id: 'as3', x: 470, y: 710, label: '图算法', mastery: 0.42, isRemedial: true, recommended: true, prerequisite: '排序查找', nextStation: '动态规划', estimatedTime: '6h' },
        { id: 'as4', x: 640, y: 710, label: '动态规划', mastery: 0.30, interchange: ['eng'], isRemedial: true, prerequisite: '图算法', nextStation: '—', estimatedTime: '8h' },
      ],
    },
    {
      id: 'nlp', name: 'NLP 应用线', color: '#f43f5e',
      waypoints: [[700, 880], [1280, 880]],
      stations: [
        { id: 'ns1', x: 720, y: 880, label: '词嵌入', mastery: 0.40, prerequisite: '—', nextStation: 'RAG', estimatedTime: '3h' },
        { id: 'ns2', x: 900, y: 880, label: 'RAG', mastery: 0.12, interchange: ['dl'], recommended: true, prerequisite: '词嵌入', nextStation: '微调对齐', estimatedTime: '5h' },
        { id: 'ns3', x: 1080, y: 880, label: '微调与对齐', mastery: 0.08, prerequisite: 'RAG', nextStation: 'LLM 应用', estimatedTime: '6h' },
        { id: 'ns4', x: 1240, y: 880, label: 'LLM 应用', mastery: 0.05, prerequisite: '微调对齐', nextStation: '—', estimatedTime: '8h' },
      ],
    },
    {
      id: 'eng', name: '工程实践线', color: '#3b82f6',
      waypoints: [[120, 880], [600, 880]],
      stations: [
        { id: 'es1', x: 140, y: 880, label: 'Python 工程', mastery: 0.72, prerequisite: '—', nextStation: 'Git 协作', estimatedTime: '3h' },
        { id: 'es2', x: 310, y: 880, label: 'Git 协作', mastery: 0.65, prerequisite: 'Python', nextStation: '模型部署', estimatedTime: '2h' },
        { id: 'es3', x: 480, y: 880, label: '模型部署', mastery: 0.30, interchange: ['algo'], prerequisite: 'Git', nextStation: '—', estimatedTime: '5h' },
      ],
    },
  ]
}

export function buildMatrixView(items: BaseKnowledgeItem[]): MatrixCell[] {
  const levels = [
    { key: 'remember', label: '了解' },
    { key: 'understand', label: '掌握' },
    { key: 'apply', label: '应用' },
    { key: 'transfer', label: '迁移' },
    { key: 'create', label: '创新' },
  ]
  const domainOrder = ['math', 'algo', 'ml', 'dl', 'eng', 'nlp']
  const domainLabels: Record<string, string> = {
    math: '数学基础', algo: '算法与数据', ml: '机器学习', dl: '深度学习', eng: '工程实践', nlp: 'NLP 应用',
  }
  const decayPerLevel = [0, 0.08, 0.22, 0.40, 0.60]

  const cells: MatrixCell[] = []
  for (const domain of domainOrder) {
    const domainItems = items.filter(i => i.domain === domain)
    const avgMastery = domainItems.reduce((s, i) => s + i.mastery, 0) / domainItems.length
    for (let li = 0; li < levels.length; li++) {
      const value = Math.max(0, Math.min(1, avgMastery - decayPerLevel[li]))
      const isWeak = value > 0 && value < 0.4
      const isRecommended = isWeak && (li === Math.ceil(avgMastery * 5) - 1)
      cells.push({
        domain,
        domainLabel: domainLabels[domain] || domain,
        level: levels[li].key,
        levelLabel: levels[li].label,
        value,
        evidenceCount: Math.round(value * 12),
        lastScore: Math.round(value * 100),
        isWeak,
        isRecommended,
      })
    }
  }
  return cells
}

export function buildConcentricView(centerId: string, items: BaseKnowledgeItem[]): ConcentricRing[] {
  const center = items.find(i => i.id === centerId) || items.find(i => i.id === 'dl4')!
  const centerDomain = center.domain

  const sameDomain = items.filter(i => i.domain === centerDomain && i.id !== center.id)
  const prerequisiteIds = new Set(items.filter(i => i.relations.includes(center.id)).map(i => i.id))
  const applicationIds = new Set(items.filter(i => center.relations.includes(i.id)).map(i => i.id))

  const prerequisites = items.filter(i => prerequisiteIds.has(i.id))
  const applications = items.filter(i => applicationIds.has(i.id))
  const currentChapter = sameDomain.filter(i => !prerequisiteIds.has(i.id) && !applicationIds.has(i.id))
  const extensions = items.filter(i =>
    i.domain !== centerDomain &&
    !prerequisiteIds.has(i.id) &&
    !applicationIds.has(i.id) &&
    i.mastery < 0.5
  ).slice(0, 4)

  function assignAngles(arr: { id: string; label: string; mastery: number; recommended?: boolean }[], startAngle: number) {
    return arr.map((item, i) => ({
      ...item,
      relationToCenter: '',
      angle: startAngle + (i / arr.length) * 360,
    }))
  }

  return [
    {
      id: 'prerequisite', label: '先修基础', relationType: 'prerequisite',
      nodes: assignAngles(prerequisites.map(i => ({ id: i.id, label: i.label, mastery: i.mastery, recommended: i.mastery < 0.4 })), 0),
    },
    {
      id: 'current', label: '当前章节', relationType: 'current',
      nodes: assignAngles(currentChapter.map(i => ({ id: i.id, label: i.label, mastery: i.mastery })), 60),
    },
    {
      id: 'application', label: '应用场景', relationType: 'application',
      nodes: assignAngles(applications.map(i => ({ id: i.id, label: i.label, mastery: i.mastery })), 150),
    },
    {
      id: 'extension', label: '拓展迁移', relationType: 'extension',
      nodes: assignAngles(extensions.map(i => ({ id: i.id, label: i.label, mastery: i.mastery, recommended: true })), 240),
    },
  ]
}

export function buildOrbitView(_items: BaseKnowledgeItem[]): OrbitTrack[] {
  return [
    {
      id: 'preview', name: '预习轨道', color: '#7c3aed',
      nodes: [
        { id: 'pv1', label: '知识预检', status: 'completed', agentInvolved: 'ProfileAgent', angle: -150 },
        { id: 'pv2', label: '预习材料推送', status: 'completed', agentInvolved: 'ResourceAgent', triggeredResource: true, angle: -90 },
        { id: 'pv3', label: '预习自测', status: 'in_progress', agentInvolved: 'EvalAgent', angle: -30 },
      ],
    },
    {
      id: 'understand', name: '理解轨道', color: '#00d4ff',
      nodes: [
        { id: 'un1', label: '概念讲解', status: 'completed', agentInvolved: 'TutorAgent', angle: -120 },
        { id: 'un2', label: '示例演示', status: 'in_progress', agentInvolved: 'TutorAgent', angle: -60 },
        { id: 'un3', label: '知识关联', status: 'upcoming', angle: 0 },
      ],
    },
    {
      id: 'practice', name: '练习轨道', color: '#06d6a0',
      nodes: [
        { id: 'pr1', label: '基础练习', status: 'completed', agentInvolved: 'ResourceAgent', triggeredResource: true, angle: -100 },
        { id: 'pr2', label: '专项训练', status: 'remedial', agentInvolved: 'PathAgent', triggeredResource: true, entersNextCycle: true, angle: -40 },
        { id: 'pr3', label: '综合应用', status: 'upcoming', angle: 20 },
      ],
    },
    {
      id: 'assess', name: '测评轨道', color: '#f59e0b',
      nodes: [
        { id: 'as1', label: '阶段小测', status: 'completed', agentInvolved: 'EvalAgent', angle: -130 },
        { id: 'as2', label: '能力评估', status: 'in_progress', agentInvolved: 'EvalAgent', angle: -70 },
        { id: 'as3', label: '画像更新', status: 'upcoming', agentInvolved: 'FeedbackAgent', entersNextCycle: true, angle: -10 },
      ],
    },
    {
      id: 'feedback', name: '反馈轨道', color: '#f43f5e',
      nodes: [
        { id: 'fb1', label: '薄弱点识别', status: 'completed', agentInvolved: 'ProfileAgent', angle: -140 },
        { id: 'fb2', label: '路径修正', status: 'in_progress', agentInvolved: 'PathAgent', angle: -80 },
        { id: 'fb3', label: '补救触发', status: 'upcoming', agentInvolved: 'ResourceAgent', triggeredResource: true, entersNextCycle: true, angle: -20 },
      ],
    },
    {
      id: 'remedial', name: '补救轨道', color: '#3b82f6',
      nodes: [
        { id: 'rm1', label: '针对性复习', status: 'upcoming', agentInvolved: 'TutorAgent', triggeredResource: true, angle: -110 },
        { id: 'rm2', label: '二次测评', status: 'upcoming', agentInvolved: 'EvalAgent', angle: -50 },
        { id: 'rm3', label: '闭环验证', status: 'upcoming', agentInvolved: 'FeedbackAgent', entersNextCycle: true, angle: 10 },
      ],
    },
  ]
}

export function buildNodeDetail(
  mode: NodeDetail['mode'],
  nodeId: string,
  items: BaseKnowledgeItem[],
): NodeDetail | null {
  const item = items.find(i => i.id === nodeId)
  if (!item) return null

  const domainMeta = getDomainMeta(item.domain)

  switch (mode) {
    case 'constellation':
      return {
        mode,
        nodeId: item.id,
        label: item.label,
        fields: [
          { key: 'domain', label: '所属领域', value: domainMeta.name },
          { key: 'connections', label: '关联节点数', value: String(item.relations.length) },
          { key: 'importance', label: '重要性', value: `${Math.round(item.importance * 100)}%` },
          { key: 'mastery', label: '掌握度', value: `${Math.round(item.mastery * 100)}%` },
          { key: 'relationType', label: '关键关系', value: item.relationType === 'prerequisite' ? '先修依赖' : item.relationType === 'similar' ? '相似概念' : item.relationType === 'application' ? '应用关联' : '易错关联' },
        ],
        resourceLink: { focus: item.label, nodeId: item.id },
      }
    case 'metro': {
      const metroData = buildMetroView(items)
      let station: { id: string; label: string; mastery: number; prerequisite?: string; nextStation?: string; estimatedTime?: string; isRemedial?: boolean; interchange?: string[] } | null = null
      let lineName = ''
      for (const line of metroData) {
        const found = line.stations.find(s => s.label === item.label)
        if (found) { station = found; lineName = line.name; break }
      }
      return {
        mode,
        nodeId: item.id,
        label: item.label,
        fields: [
          { key: 'line', label: '所在线路', value: lineName },
          { key: 'prerequisite', label: '前置站点', value: station?.prerequisite || '—' },
          { key: 'next', label: '下一站', value: station?.nextStation || '—' },
          { key: 'interchange', label: '换乘方向', value: station?.interchange?.join(', ') || '无' },
          { key: 'time', label: '预计耗时', value: station?.estimatedTime || '—' },
          { key: 'remedial', label: '补救点', value: station?.isRemedial ? '是' : '否' },
        ],
        resourceLink: { focus: item.label, nodeId: item.id },
      }
    }
    case 'matrix': {
      const matrixData = buildMatrixView(items)
      const cell = matrixData.find(c => c.domain === item.domain && c.level === 'apply')
      return {
        mode,
        nodeId: item.id,
        label: item.label,
        fields: [
          { key: 'domain', label: '领域', value: domainMeta.name },
          { key: 'level', label: '认知层级', value: cell?.levelLabel || '应用' },
          { key: 'completion', label: '完成度', value: `${Math.round((cell?.value || item.mastery) * 100)}%` },
          { key: 'evidence', label: '测评证据', value: `${cell?.evidenceCount || 0} 条` },
          { key: 'weak', label: '薄弱原因', value: item.mastery < 0.4 ? '掌握度低于 40%' : '—' },
        ],
        resourceLink: { focus: item.label, nodeId: item.id },
      }
    }
    case 'concentric':
      return {
        mode,
        nodeId: item.id,
        label: item.label,
        fields: [
          { key: 'center', label: '中心知识', value: 'Transformer' },
          { key: 'relation', label: '关系类型', value: item.relationType === 'prerequisite' ? '先修基础' : item.relationType === 'application' ? '应用场景' : '拓展迁移' },
          { key: 'why', label: '为什么关联', value: `${item.label} 是理解中心概念的${item.relationType === 'prerequisite' ? '前置条件' : item.relationType === 'application' ? '应用方向' : '延伸知识'}` },
          { key: 'mastery', label: '掌握度', value: `${Math.round(item.mastery * 100)}%` },
        ],
        resourceLink: { focus: item.label, nodeId: item.id },
      }
    case 'orbital': {
      const orbitData = buildOrbitView(items)
      let orbitNode: { id: string; label: string; status: string; agentInvolved?: string; triggeredResource?: boolean; entersNextCycle?: boolean } | null = null
      let trackName = ''
      for (const track of orbitData) {
        const found = track.nodes.find(n => n.id === item.id || n.label === item.label)
        if (found) { orbitNode = found; trackName = track.name; break }
      }
      return {
        mode,
        nodeId: item.id,
        label: item.label,
        fields: [
          { key: 'track', label: '当前阶段', value: trackName },
          { key: 'status', label: '完成状态', value: orbitNode?.status === 'completed' ? '已完成' : orbitNode?.status === 'in_progress' ? '进行中' : orbitNode?.status === 'remedial' ? '需补救' : '待开始' },
          { key: 'agent', label: '智能体介入', value: orbitNode?.agentInvolved || '无' },
          { key: 'resource', label: '触发资源推荐', value: orbitNode?.triggeredResource ? '是' : '否' },
          { key: 'next', label: '下一步动作', value: orbitNode?.entersNextCycle ? '进入下一轮循环' : orbitNode?.status === 'upcoming' ? '等待前置完成' : '继续当前阶段' },
        ],
        resourceLink: { focus: item.label, nodeId: item.id },
      }
    }
  }
}

// ============================================================
//  学习路径阶段（5 个阶段 + 元数据）
//  阶段: 课前预习 → 课中答疑 → 课后巩固 → 阶段测评 → 期末辅导
// ============================================================

export const LEARNING_STAGES: LearningStage[] = [
  { id: 'pre',   label: '课前预习',   icon: 'BookOpen',       color: '#7c3aed' },
  { id: 'in',    label: '课中答疑',   icon: 'MessageCircle',  color: '#00d4ff' },
  { id: 'post',  label: '课后巩固',   icon: 'RefreshCw',      color: '#06d6a0' },
  { id: 'eval',  label: '阶段测评',   icon: 'ClipboardCheck', color: '#f59e0b' },
  { id: 'final', label: '期末辅导',   icon: 'GraduationCap',  color: '#f43f5e' },
]

// ============================================================
//  每个知识点（key = 星座节点 ID）的 5 阶段学习内容
// ============================================================

export const NODE_CONTENT: StageContentMap = {
  m1: [
    [{ title: '矩阵加减乘与转置概念', type: 'doc' }, { title: 'NumPy 矩阵创建与基本操作', type: 'video' }, { title: '线性方程组与矩阵关系', type: 'doc' }],
    [{ title: '矩阵乘法结合律常见疑问', type: 'video' }, { title: '逆矩阵与行列式的直觉理解', type: 'doc' }, { title: '分块矩阵运算技巧', type: 'video' }],
    [{ title: '矩阵乘法手算练习', type: 'exercise' }, { title: 'NumPy 矩阵运算编程题', type: 'code' }, { title: '特殊矩阵（对角/对称/稀疏）辨识', type: 'exercise' }],
    [{ title: '矩阵运算综合测试', type: 'exercise' }, { title: '矩阵在图像变换中的应用', type: 'exercise' }],
    [{ title: 'SVD 分解原理与应用', type: 'doc' }, { title: 'PCA 降维中的矩阵运算', type: 'video' }, { title: '矩阵分解在推荐系统中的角色', type: 'doc' }],
  ],
  m2: [
    [{ title: '特征值与特征向量的几何含义', type: 'doc' }, { title: '特征方程求解方法', type: 'video' }, { title: '对角化条件与步骤', type: 'doc' }],
    [{ title: '特征值在 PCA 中的作用', type: 'video' }, { title: '实对称矩阵的谱定理', type: 'doc' }, { title: '特征值与矩阵稳定性的关系', type: 'video' }],
    [{ title: '手动计算 2x2 矩阵特征值', type: 'exercise' }, { title: '用 sklearn 求协方差矩阵特征值', type: 'code' }, { title: '特征值分解验证练习', type: 'exercise' }],
    [{ title: '特征值综合测验', type: 'exercise' }, { title: '特征值在 PageRank 中的应用', type: 'exercise' }],
    [{ title: '特征值在动力系统中的意义', type: 'doc' }, { title: '谱聚类算法原理', type: 'video' }, { title: '特征值在量子计算中的角色', type: 'doc' }],
  ],
  m3: [
    [{ title: '随机变量与概率分布基础', type: 'doc' }, { title: '条件概率与贝叶斯公式', type: 'video' }, { title: '常见分布（正态/泊松/二项）概览', type: 'doc' }],
    [{ title: '贝叶斯推理在垃圾邮件过滤中的应用', type: 'video' }, { title: '联合分布与边缘分布的关系', type: 'doc' }, { title: '大数定律直觉理解', type: 'video' }],
    [{ title: '概率计算综合练习', type: 'exercise' }, { title: '用 Python 模拟概率实验', type: 'code' }, { title: '贝叶斯公式应用题', type: 'exercise' }],
    [{ title: '概率论阶段测评', type: 'exercise' }, { title: '概率在 ML 损失函数中的角色', type: 'exercise' }],
    [{ title: '概率图模型入门', type: 'doc' }, { title: '蒙特卡洛方法原理', type: 'video' }, { title: '概率论在自然语言处理中的应用', type: 'doc' }],
  ],
  m4: [
    [{ title: '导数的定义与几何意义', type: 'doc' }, { title: '常见函数求导公式速查', type: 'video' }, { title: '偏导数与梯度概念', type: 'doc' }],
    [{ title: '链式法则在反向传播中的应用', type: 'video' }, { title: '梯度下降法的数学推导', type: 'doc' }, { title: '多元函数极值条件', type: 'video' }],
    [{ title: '手算导数练习题', type: 'exercise' }, { title: '梯度下降手动模拟', type: 'exercise' }, { title: 'PyTorch 自动求导体验', type: 'code' }],
    [{ title: '微积分基础测验', type: 'exercise' }, { title: '导数在优化算法中的核心角色', type: 'exercise' }],
    [{ title: '积分在概率密度中的应用', type: 'doc' }, { title: '变分法入门', type: 'video' }, { title: '微积分在深度学习优化中的前沿', type: 'doc' }],
  ],
  m5: [
    [{ title: '凸集与凸函数定义', type: 'doc' }, { title: '优化问题分类（无约束/有约束）', type: 'video' }, { title: '局部最优与全局最优的区别', type: 'doc' }],
    [{ title: '拉格朗日乘子法原理', type: 'video' }, { title: 'SVM 中的凸优化应用', type: 'doc' }, { title: 'KKT 条件直觉理解', type: 'video' }],
    [{ title: '凸函数判定练习', type: 'exercise' }, { title: '用 cvxpy 解简单优化问题', type: 'code' }, { title: '约束优化手算题', type: 'exercise' }],
    [{ title: '凸优化综合测评', type: 'exercise' }, { title: '优化在模型训练中的实际意义', type: 'exercise' }],
    [{ title: '非凸优化与鞍点问题', type: 'doc' }, { title: '学习率调度策略', type: 'video' }, { title: '二阶优化方法（牛顿法）简介', type: 'doc' }],
  ],
  ml1: [
    [{ title: '监督学习基本框架（输入→标签）', type: 'doc' }, { title: '线性回归原理与公式推导', type: 'video' }, { title: '逻辑回归与 sigmoid 函数', type: 'doc' }],
    [{ title: '损失函数（MSE/CrossEntropy）详解', type: 'video' }, { title: '正则化（L1/L2）防止过拟合', type: 'doc' }, { title: '偏差-方差权衡', type: 'video' }],
    [{ title: '线性回归手写实现', type: 'code' }, { title: '逻辑回归分类练习', type: 'exercise' }, { title: '正则化效果对比实验', type: 'exercise' }],
    [{ title: '监督学习综合测评', type: 'exercise' }, { title: '模型评估指标（Precision/Recall/F1）', type: 'exercise' }],
    [{ title: '核方法与非线性扩展', type: 'doc' }, { title: '半监督学习入门', type: 'video' }, { title: '主动学习策略', type: 'doc' }],
  ],
  ml2: [
    [{ title: '无监督学习应用场景概述', type: 'doc' }, { title: 'K-Means 聚类算法原理', type: 'video' }, { title: '降维的意义与方法概览', type: 'doc' }],
    [{ title: 'DBSCAN 与密度聚类', type: 'video' }, { title: 'PCA 降维数学原理', type: 'doc' }, { title: 't-SNE 可视化直觉', type: 'video' }],
    [{ title: 'K-Means 手写实现', type: 'code' }, { title: '聚类效果评估（轮廓系数）', type: 'exercise' }, { title: 'PCA 降维实战', type: 'exercise' }],
    [{ title: '无监督学习综合测评', type: 'exercise' }, { title: '聚类在客户分群中的应用', type: 'exercise' }],
    [{ title: '自编码器与表示学习', type: 'doc' }, { title: '对比学习入门', type: 'video' }, { title: '无监督特征学习前沿', type: 'doc' }],
  ],
  ml3: [
    [{ title: '决策树分裂原理（信息增益）', type: 'doc' }, { title: 'ID3/C4.5/CART 算法对比', type: 'video' }, { title: '随机森林的 Bagging 思想', type: 'doc' }],
    [{ title: '特征重要性排序机制', type: 'video' }, { title: 'OOB 评估与交叉验证', type: 'doc' }, { title: '树模型的过拟合与剪枝', type: 'video' }],
    [{ title: '决策树手写（贪心分裂）', type: 'code' }, { title: 'sklearn 随机森林调参练习', type: 'exercise' }, { title: '特征重要性可视化', type: 'exercise' }],
    [{ title: '树模型综合测评', type: 'exercise' }, { title: '随机森林在表格数据中的优势', type: 'exercise' }],
    [{ title: '梯度提升树（GBDT）原理', type: 'doc' }, { title: 'XGBoost/LightGBM 对比', type: 'video' }, { title: '树模型在竞赛中的应用', type: 'doc' }],
  ],
  ml4: [
    [{ title: '最大间隔分类器直觉', type: 'doc' }, { title: '支持向量的定义与作用', type: 'video' }, { title: '软间隔与松弛变量', type: 'doc' }],
    [{ title: '核技巧（RBF/多项式核）', type: 'video' }, { title: 'SVM 对偶问题推导', type: 'doc' }, { title: 'SVM 与逻辑回归的对比', type: 'video' }],
    [{ title: 'sklearn SVM 分类实战', type: 'code' }, { title: '核函数选择实验', type: 'exercise' }, { title: 'SVM 调参（C/gamma）练习', type: 'exercise' }],
    [{ title: 'SVM 综合测评', type: 'exercise' }, { title: 'SVM 在文本分类中的应用', type: 'exercise' }],
    [{ title: 'SVM 回归（SVR）', type: 'doc' }, { title: '大规模 SVM 的近似方法', type: 'video' }, { title: 'SVM 在小样本场景的优势', type: 'doc' }],
  ],
  ml5: [
    [{ title: '集成学习核心思想（三个臭皮匠）', type: 'doc' }, { title: 'Bagging vs Boosting 对比', type: 'video' }, { title: '偏差-方差分解与集成的关系', type: 'doc' }],
    [{ title: 'AdaBoost 算法详解', type: 'video' }, { title: 'Stacking 混合策略', type: 'doc' }, { title: 'Blending 与多层集成', type: 'video' }],
    [{ title: '实现简单 Bagging 分类器', type: 'code' }, { title: '集成策略对比实验', type: 'exercise' }, { title: 'Kaggle 竞赛中的集成技巧', type: 'exercise' }],
    [{ title: '集成学习综合测评', type: 'exercise' }, { title: '模型融合对精度的提升量化', type: 'exercise' }],
    [{ title: '深度集成（Snapshot Ensemble）', type: 'doc' }, { title: '多模态集成学习', type: 'video' }, { title: '集成在生产环境中的部署', type: 'doc' }],
  ],
  dl1: [
    [{ title: '感知机模型与激活函数', type: 'doc' }, { title: '多层网络结构与前向传播', type: 'video' }, { title: '万能近似定理', type: 'doc' }],
    [{ title: '反向传播算法推导', type: 'video' }, { title: '梯度消失/爆炸问题', type: 'doc' }, { title: '权重初始化策略', type: 'video' }],
    [{ title: '用 NumPy 手写两层网络', type: 'code' }, { title: '激活函数对比实验', type: 'exercise' }, { title: 'MNIST 手写数字识别', type: 'code' }],
    [{ title: '神经网络基础测评', type: 'exercise' }, { title: '网络深度vs宽度对性能的影响', type: 'exercise' }],
    [{ title: '残差连接与深层网络', type: 'doc' }, { title: '网络架构搜索（NAS）入门', type: 'video' }, { title: '神经网络可解释性', type: 'doc' }],
  ],
  dl2: [
    [{ title: '卷积操作的直觉理解', type: 'doc' }, { title: '卷积核/滤波器的工作原理', type: 'video' }, { title: '池化层的作用', type: 'doc' }],
    [{ title: '经典架构 LeNet→AlexNet→VGG', type: 'video' }, { title: 'ResNet 残差学习原理', type: 'doc' }, { title: '感受野计算方法', type: 'video' }],
    [{ title: '用 PyTorch 搭建 CNN', type: 'code' }, { title: 'CIFAR-10 图像分类实战', type: 'code' }, { title: '卷积核可视化实验', type: 'exercise' }],
    [{ title: 'CNN 综合测评', type: 'exercise' }, { title: '数据增强对分类精度的影响', type: 'exercise' }],
    [{ title: '目标检测（YOLO/Faster RCNN）', type: 'doc' }, { title: '语义分割入门', type: 'video' }, { title: 'Vision Transformer（ViT）', type: 'doc' }],
  ],
  dl3: [
    [{ title: '序列数据与时间步概念', type: 'doc' }, { title: 'RNN 基本结构与隐藏状态', type: 'video' }, { title: '梯度截断解决长期依赖', type: 'doc' }],
    [{ title: 'LSTM 门控机制详解', type: 'video' }, { title: 'GRU 简化门控设计', type: 'doc' }, { title: '双向 RNN 与深层 RNN', type: 'video' }],
    [{ title: '用 LSTM 做文本生成', type: 'code' }, { title: '时间序列预测练习', type: 'exercise' }, { title: 'RNN vs 全连接网络对比', type: 'exercise' }],
    [{ title: '序列模型综合测评', type: 'exercise' }, { title: 'Seq2Seq 在机器翻译中的应用', type: 'exercise' }],
    [{ title: 'Transformer 为何取代 RNN', type: 'doc' }, { title: 'State Space Models 入门', type: 'video' }, { title: '序列建模的未来方向', type: 'doc' }],
  ],
  dl4: [
    [{ title: 'Attention Is All You Need 论文精读', type: 'doc' }, { title: '自注意力机制计算过程', type: 'video' }, { title: 'Multi-Head Attention 原理', type: 'doc' }],
    [{ title: '位置编码（正弦/旋转）详解', type: 'video' }, { title: 'Encoder-Decoder 架构设计', type: 'doc' }, { title: 'Layer Norm 与残差连接', type: 'video' }],
    [{ title: '从零手写 Self-Attention', type: 'code' }, { title: 'Transformer 分类任务实战', type: 'code' }, { title: '注意力权重可视化', type: 'exercise' }],
    [{ title: 'Transformer 架构综合测评', type: 'exercise' }, { title: 'Transformer 复杂度分析', type: 'exercise' }],
    [{ title: 'GPT 系列架构演进', type: 'doc' }, { title: 'Flash Attention 加速原理', type: 'video' }, { title: 'Mamba 与线性注意力', type: 'doc' }],
  ],
  dl5: [
    [{ title: '注意力机制的历史演进', type: 'doc' }, { title: 'Bahdanau Attention 原理', type: 'video' }, { title: 'Self-Attention vs Cross-Attention', type: 'doc' }],
    [{ title: '注意力分数计算（点积/加性）', type: 'video' }, { title: '注意力权重的可解释性', type: 'doc' }, { title: '稀疏注意力与高效注意力', type: 'video' }],
    [{ title: '注意力权重热力图绘制', type: 'code' }, { title: '注意力在不同任务中的表现', type: 'exercise' }, { title: '注意力机制变体对比', type: 'exercise' }],
    [{ title: 'Attention 机制综合测评', type: 'exercise' }, { title: '注意力在 CV/NLP 中的跨领域应用', type: 'exercise' }],
    [{ title: '线性注意力与高效 Transformer', type: 'doc' }, { title: '注意力蒸馏技术', type: 'video' }, { title: '可解释 AI 中的注意力分析', type: 'doc' }],
  ],
  a1: [
    [{ title: '比较排序复杂度下界', type: 'doc' }, { title: '快速排序分治原理', type: 'video' }, { title: '归并排序稳定性分析', type: 'doc' }],
    [{ title: '堆排序与优先队列', type: 'video' }, { title: '二分查找变体（左/右边界）', type: 'doc' }, { title: '排序算法选择决策树', type: 'video' }],
    [{ title: '手写快排/归并/堆排', type: 'code' }, { title: '二分查找边界题练习', type: 'exercise' }, { title: '排序稳定性验证实验', type: 'exercise' }],
    [{ title: '排序与查找综合测评', type: 'exercise' }, { title: 'O(nlogn) 在大数据中的意义', type: 'exercise' }],
    [{ title: '非比较排序（计数/桶/基数）', type: 'doc' }, { title: '外部排序与磁盘排序', type: 'video' }, { title: '排序在数据库索引中的角色', type: 'doc' }],
  ],
  a2: [
    [{ title: '数组vs链表内存模型对比', type: 'doc' }, { title: '栈的应用（括号匹配/表达式求值）', type: 'video' }, { title: '队列与滑动窗口', type: 'doc' }],
    [{ title: '哈希表冲突解决（链地址/开放寻址）', type: 'video' }, { title: '红黑树/AVL 树平衡原理', type: 'doc' }, { title: 'B 树/B+ 树在数据库中的应用', type: 'video' }],
    [{ title: '实现 LRU 缓存（哈希+双向链表）', type: 'code' }, { title: '二叉搜索树操作练习', type: 'exercise' }, { title: '堆的建堆与调整操作', type: 'exercise' }],
    [{ title: '数据结构综合测评', type: 'exercise' }, { title: '不同场景下数据结构选型', type: 'exercise' }],
    [{ title: '跳表与概率数据结构', type: 'doc' }, { title: '布隆过滤器原理与应用', type: 'video' }, { title: '一致性哈希在分布式系统中的角色', type: 'doc' }],
  ],
  a3: [
    [{ title: '图的表示（邻接矩阵/邻接表）', type: 'doc' }, { title: 'BFS 广度优先遍历原理', type: 'video' }, { title: 'DFS 深度优先与回溯', type: 'doc' }],
    [{ title: 'Dijkstra 最短路径算法', type: 'video' }, { title: '拓扑排序与任务调度', type: 'doc' }, { title: '最小生成树（Prim/Kruskal）', type: 'video' }],
    [{ title: '用 BFS 求最短路径', type: 'code' }, { title: '拓扑排序应用题', type: 'exercise' }, { title: '图的连通性判断', type: 'exercise' }],
    [{ title: '图算法综合测评', type: 'exercise' }, { title: '图在社交网络分析中的应用', type: 'exercise' }],
    [{ title: 'A* 搜索与启发式算法', type: 'doc' }, { title: '网络流与匹配问题', type: 'video' }, { title: '图神经网络（GNN）入门', type: 'doc' }],
  ],
  a4: [
    [{ title: '动态规划核心思想（最优子结构）', type: 'doc' }, { title: '重叠子问题与记忆化搜索', type: 'video' }, { title: '状态转移方程设计方法', type: 'doc' }],
    [{ title: '背包问题详解（01/完全/多重）', type: 'video' }, { title: 'LCS/LIS 经典问题', type: 'doc' }, { title: '区间DP与状态压缩', type: 'video' }],
    [{ title: '手写 01 背包 DP', type: 'code' }, { title: 'LIS 最长递增子序列练习', type: 'exercise' }, { title: '编辑距离问题', type: 'exercise' }],
    [{ title: '动态规划综合测评', type: 'exercise' }, { title: 'DP 在序列比对中的应用', type: 'exercise' }],
    [{ title: '概率DP与马尔可夫决策', type: 'doc' }, { title: '强化学习中的 DP 基础', type: 'video' }, { title: 'DP 优化技巧（单调队列/斜率优化）', type: 'doc' }],
  ],
  e1: [
    [{ title: 'Python 虚拟环境（venv/conda）', type: 'doc' }, { title: 'pip/poetry 包管理最佳实践', type: 'video' }, { title: '项目目录结构规范', type: 'doc' }],
    [{ title: '类型提示（Type Hints）详解', type: 'video' }, { title: '代码规范与 PEP8/linting', type: 'doc' }, { title: 'logging 与调试技巧', type: 'video' }],
    [{ title: '搭建 Python 项目脚手架', type: 'code' }, { title: 'pytest 编写单元测试', type: 'code' }, { title: 'requirements.txt 管理练习', type: 'exercise' }],
    [{ title: 'Python 工程能力测评', type: 'exercise' }, { title: '代码质量审查实践', type: 'exercise' }],
    [{ title: 'Python 性能优化技巧', type: 'doc' }, { title: '异步编程（asyncio）入门', type: 'video' }, { title: 'Python 在 ML 工程中的生态', type: 'doc' }],
  ],
  e2: [
    [{ title: 'Git 基本概念（仓库/分支/提交）', type: 'doc' }, { title: 'Git 工作流（commit/push/pull）', type: 'video' }, { title: '分支管理策略（Git Flow）', type: 'doc' }],
    [{ title: 'merge vs rebase 的选择', type: 'video' }, { title: '冲突解决实操', type: 'doc' }, { title: 'Git bisect 与代码溯源', type: 'video' }],
    [{ title: '创建分支并提交 PR', type: 'code' }, { title: '解决合并冲突练习', type: 'exercise' }, { title: '.gitignore 配置', type: 'exercise' }],
    [{ title: '版本控制综合测评', type: 'exercise' }, { title: '团队协作 Git 工作流考核', type: 'exercise' }],
    [{ title: 'Git Hooks 与 CI/CD 集成', type: 'doc' }, { title: '大型仓库管理策略', type: 'video' }, { title: 'Git 在 MLOps 中的角色', type: 'doc' }],
  ],
  e3: [
    [{ title: '模型序列化（pickle/torchscript）', type: 'doc' }, { title: 'REST API 设计基础', type: 'video' }, { title: 'Flask/FastAPI 服务搭建', type: 'doc' }],
    [{ title: 'Docker 容器化打包模型', type: 'video' }, { title: '模型量化与压缩', type: 'doc' }, { title: 'ONNX 格式转换与推理', type: 'video' }],
    [{ title: '用 FastAPI 部署推理服务', type: 'code' }, { title: 'Dockerfile 编写练习', type: 'code' }, { title: '模型推理基准测试', type: 'exercise' }],
    [{ title: '部署综合测评', type: 'exercise' }, { title: '端到端部署流程考核', type: 'exercise' }],
    [{ title: 'Kubernetes 编排入门', type: 'doc' }, { title: 'A/B 测试与灰度发布', type: 'video' }, { title: 'MLOps 全流程概览', type: 'doc' }],
  ],
  n1: [
    [{ title: '分布式假设（Harris 假说）', type: 'doc' }, { title: 'Word2Vec（CBOW/Skip-gram）原理', type: 'video' }, { title: '词向量的数学表示', type: 'doc' }],
    [{ title: '词向量相似度计算与类比', type: 'video' }, { title: 'GloVe 全局向量方法', type: 'doc' }, { title: 'FastText 子词嵌入', type: 'video' }],
    [{ title: '用 Gensim 训练词向量', type: 'code' }, { title: '词向量可视化（t-SNE）', type: 'exercise' }, { title: '词类比任务练习', type: 'exercise' }],
    [{ title: '词向量综合测评', type: 'exercise' }, { title: '词向量在下游任务中的迁移', type: 'exercise' }],
    [{ title: '上下文化词向量（ELMo）', type: 'doc' }, { title: '从词向量到句子嵌入', type: 'video' }, { title: '多语言词向量', type: 'doc' }],
  ],
  n2: [
    [{ title: '语言模型基本概念（困惑度）', type: 'doc' }, { title: 'GPT 系列架构演进', type: 'video' }, { title: 'BERT 预训练与微调', type: 'doc' }],
    [{ title: 'In-Context Learning 原理', type: 'video' }, { title: 'Chain-of-Thought 推理', type: 'doc' }, { title: 'LLM 的涌现能力', type: 'video' }],
    [{ title: 'Prompt Engineering 实战', type: 'exercise' }, { title: '用 HuggingFace 调用 LLM', type: 'code' }, { title: 'Few-shot vs Zero-shot 对比实验', type: 'exercise' }],
    [{ title: 'LLM 综合测评', type: 'exercise' }, { title: 'LLM 在不同任务中的表现分析', type: 'exercise' }],
    [{ title: 'MoE（混合专家）架构', type: 'doc' }, { title: '长上下文技术（RoPE/ALiBi）', type: 'video' }, { title: 'LLM 推理加速（KV Cache/投机解码）', type: 'doc' }],
  ],
  n3: [
    [{ title: '全参数微调 vs LoRA 微调', type: 'doc' }, { title: '指令微调（Instruction Tuning）', type: 'video' }, { title: '数据准备与格式规范', type: 'doc' }],
    [{ title: 'RLHF 奖励模型原理', type: 'video' }, { title: 'DPO 直接偏好优化', type: 'doc' }, { title: '对齐税与安全性的权衡', type: 'video' }],
    [{ title: '用 LoRA 微调小模型', type: 'code' }, { title: '构建微调数据集', type: 'exercise' }, { title: '微调效果评估', type: 'exercise' }],
    [{ title: '微调与对齐综合测评', type: 'exercise' }, { title: '微调在垂直领域的应用', type: 'exercise' }],
    [{ title: '宪法 AI（Constitutional AI）', type: 'doc' }, { title: 'RLAIF 替代人类标注', type: 'video' }, { title: '对齐技术前沿综述', type: 'doc' }],
  ],
  n4: [
    [{ title: 'RAG 基本架构（检索+生成）', type: 'doc' }, { title: '向量数据库原理（FAISS/Milvus）', type: 'video' }, { title: '文档分块与嵌入策略', type: 'doc' }],
    [{ title: '混合检索（BM25+向量）', type: 'video' }, { title: '重排序（Reranking）优化', type: 'doc' }, { title: '检索质量评估指标', type: 'video' }],
    [{ title: '用 LangChain 搭建 RAG', type: 'code' }, { title: '文档嵌入与检索实验', type: 'code' }, { title: 'RAG vs 长上下文对比', type: 'exercise' }],
    [{ title: 'RAG 综合测评', type: 'exercise' }, { title: 'RAG 在企业知识库中的应用', type: 'exercise' }],
    [{ title: 'GraphRAG 图增强检索', type: 'doc' }, { title: 'Self-RAG 自检索机制', type: 'video' }, { title: '多模态 RAG 入门', type: 'doc' }],
  ],
}

/** 取某个知识点在某个阶段的资源 */
export function getStageContent(topicId: string, stageIdx: number): StageResource[] {
  return NODE_CONTENT[topicId]?.[stageIdx] ?? []
}

/** 取某个知识点的所有阶段资源（5 个数组） */
export function getAllStageContent(topicId: string): StageResource[][] {
  return NODE_CONTENT[topicId] ?? [[], [], [], [], []]
}
