const ALGO_KEYWORDS = [
  '指针', '链表', '队列', '栈', '栈与队列', 'bfs', 'dfs', '递归', '迭代',
  '算法', '排序', '哈希', 'hash', 'map', 'set', '动态规划', 'dp',
  '二叉树', '树', '图', '最短路', 'dijkstra', 'floyd', 'bellman',
  '二分', 'binary', '内存', '地址', '数组', '字符串', '复杂度',
  'pointer', 'linkedlist', 'stack', 'queue', 'tree', 'graph',
  'recursion', 'sorting', 'search', 'algorithm', 'c++', 'java', 'python',
  '遍历', '子问题', '边界', '终止条件', '回溯',
]

const ENGLISH_KEYWORDS = [
  '英语', 'english', '时态', '语法', '写作', '阅读', '词汇',
  'pronunciation', 'tense', 'grammar', 'vocab', 'vocabulary',
  'subjunctive', '虚拟语气', '写作结构', 'reading', 'writing',
  '听力', 'listening', '口语', 'speaking', 'toefl', 'ielts',
]

const SYSTEMS_KEYWORDS = [
  '操作系统', '进程', '线程', '虚拟内存', '分页', '页面置换', '调度',
  '死锁', '文件系统', '系统调用', '内核', '中断', '缓存', 'cache',
  '内存管理', '虚拟存储', '页表', 'tlb', '内存分配', 'gc', '垃圾回收',
  '内存泄漏', 'memory leak', '进程同步', '信号量', '互斥锁',
  '计算机组成', 'cpu', '指令集', '流水线', '总线', '主存', '寄存器',
  '计算机网络', 'tcp', 'udp', 'http', 'ip', '路由', 'socket', 'dns',
  '三次握手', '四次挥手', '滑动窗口', '拥塞控制',
  '数据库', 'sql', '索引', '事务', 'acid', '范式', '范式', '连接',
  '关系数据库', 'nosql', 'redis', '事务隔离',
  'os', 'operating system', 'process', 'thread', 'kernel', 'deadlock',
  'virtual memory', 'paging', 'file system', 'syscall', 'interrupt',
  'network', 'protocol', 'routing', 'congestion', 'database', 'index',
]

const AI_KEYWORDS = [
  '机器学习', '深度学习', '神经网络', '卷积', 'cnn', 'rnn', 'lstm',
  'transformer', '注意力', 'attention', '反向传播', '梯度下降', '梯度',
  '损失函数', '激活函数', '过拟合', '欠拟合', '正则化', 'dropout',
  '批量归一化', 'batch norm', '强化学习', '迁移学习', '生成对抗', 'gan',
  'embedding', '词向量', '预训练', '微调', 'fine-tuning',
  '监督学习', '无监督学习', '半监督学习', '分类', '回归', '聚类',
  '决策树', '随机森林', '支持向量机', 'svm', '朴素贝叶斯',
  '特征工程', '特征选择', '数据预处理', '交叉验证', '网格搜索',
  'ml', 'machine learning', 'deep learning', 'neural network',
  'gradient', 'backprop', 'loss', 'activation', 'overfitting', 'regularization',
  'classifier', 'regression', 'clustering', 'feature', 'training', 'model',
]

const SE_KEYWORDS = [
  '软件工程', 'git', 'github', '版本控制', '分支', '合并', '冲突',
  'ci/cd', 'jenkins', 'docker', '部署', 'devops', '敏捷', 'scrum',
  '重构', '设计模式', '单例', '工厂', '观察者', 'mvc', 'mvvm',
  '测试', '单元测试', '集成测试', '压力测试', 'tdd', 'bdd',
  '代码审查', 'code review', '结对编程', '文档', '需求分析',
  '软件测试', '测试用例', '测试覆盖', '回归测试',
  'refactor', 'design pattern', 'agile', 'kanban', 'tdd',
  'unit test', 'integration test', 'deployment',
]

const PEDAGOGY_KEYWORDS = [
  '错因', '错题', '诊断', '补救', '复习', '记忆', '笔记',
  '心流', '番茄钟', 'pomodoro', 'anki', '间隔重复', 'spaced',
  '费曼', 'feynman', '康奈尔', 'cornell', '错题本',
  '考前', '冲刺', '考试', '计划', '时间管理',
  '动机', '激励', '反馈', 'feedback', '评估',
  'active-recall', 'mindmap', '双链', 'zettelkasten',
  '创造力', '创新', 'brainstorm', '头脑风暴', 'scamper', '设计思维',
  '自律', '习惯', '拖延', '拖延症', '习惯回路', 'habit',
  'debug', '调试', 'bug', '根因', '最小复现', '二分法', '排查',
  'commit message', 'code review', '结对编程',
]

const METHOD_KEYWORDS = [
  '学习方法', '学习法', '学习策略', '内化', '项目驱动',
  '费曼技巧', '康奈尔笔记', '番茄工作法', '双链笔记',
  'project-driven', 'internalization',
]

export function detectDomain(text) {
  const normalized = String(text || '').toLowerCase()
  if (!normalized.trim()) return null

  let bestDomain = null
  let bestScore = 0
  const candidates = [
    ['algorithm', ALGO_KEYWORDS],
    ['systems', SYSTEMS_KEYWORDS],
    ['ai', AI_KEYWORDS],
    ['software-engineering', SE_KEYWORDS],
    ['english', ENGLISH_KEYWORDS],
    ['method', METHOD_KEYWORDS],
    ['pedagogy', PEDAGOGY_KEYWORDS],
  ]

  for (const [domain, keywords] of candidates) {
    let score = 0
    for (const keyword of keywords) {
      const lower = keyword.toLowerCase()
      if (normalized.includes(lower)) {
        score += lower.length >= 4 ? 2 : 1
      }
    }
    if (score > bestScore) {
      bestScore = score
      bestDomain = domain
    }
  }

  return bestScore > 0 ? bestDomain : null
}

export const DOMAIN_KEYWORDS = {
  algorithm: ALGO_KEYWORDS,
  systems: SYSTEMS_KEYWORDS,
  ai: AI_KEYWORDS,
  'software-engineering': SE_KEYWORDS,
  english: ENGLISH_KEYWORDS,
  pedagogy: PEDAGOGY_KEYWORDS,
  method: METHOD_KEYWORDS,
}