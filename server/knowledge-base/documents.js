export const KNOWLEDGE_DOMAINS = ['algorithm', 'systems', 'ai', 'software-engineering', 'english', 'pedagogy', 'method', 'general']

export const LOCAL_KNOWLEDGE_DOCUMENTS = [
  {
    id: 'kb-algo-pointer-aliasing',
    source: 'local',
    domain: 'algorithm',
    type: 'misconception',
    title: '指针别名混淆 — 学生常见误区',
    tags: ['pointer', 'memory', 'c', 'misconception', 'tutor', 'algorithm'],
    summary: '指针变量更新与指针所指对象的值更新是两个不同操作，初学者最常混淆。',
    chunks: [
      {
        id: 'kb-algo-pointer-aliasing-ch1',
        text: '指针变量保存的是"地址"，对指针变量赋值是改变它指向谁；对指针解引用赋值是改变它指向的那个对象的值。两层操作必须分开：p = &a 让 p 指向 a；*p = 5 改的是 a 的值，不是 p 的值。学生最常犯的错是把 *p++ 写成 (*p)++，或把传指针和传指针所指内容混为一谈。',
      },
      {
        id: 'kb-algo-pointer-aliasing-ch2',
        text: '诊断学生是否真正理解指针别名，可以让他画三步内存图：初始状态、p=&b 之后、*p=10 之后；只要其中一步画错就说明他对别名还没建立稳定模型。补救顺序：先画图，再做 swap 函数手写，再做链表节点插入，最后做树的双指针遍历。',
      },
    ],
    agentHint: '当用户提问指针/内存/地址相关问题时优先匹配；TutorAgent 在 explain 模式可直接引用第一段做讲解。',
  },
  {
    id: 'kb-algo-linked-list-boundary',
    source: 'local',
    domain: 'algorithm',
    type: 'misconception',
    title: '链表边界条件 — 头节点 / 空链表 / 尾节点',
    tags: ['linkedlist', 'boundary', 'pointer', 'algorithm'],
    summary: '链表题 80% 的 bug 出在头节点处理、空链表和尾节点的 next 指针上。',
    chunks: [
      {
        id: 'kb-algo-linked-list-boundary-ch1',
        text: '处理链表题永远先想三种边界：(1) 链表为空 head=null；(2) 只有一个节点 head→next=null；(3) 操作涉及头节点或尾节点。是否需要 dummy 节点取决于是否会修改头节点。删除节点时一定要先保存 next 再断链，否则一旦丢掉就找不回来。',
      },
      {
        id: 'kb-algo-linked-list-boundary-ch2',
        text: '快慢指针追及问题一定要先想：快指针一次两步，慢指针一步，相遇 = 有环；入口 = 相遇后再走 head→入口 步数 = 相遇→入口 步数。如果 fast 一次三步，则不一定相遇，需要数学证明步数与环长互质。',
      },
    ],
    agentHint: 'ResourceAgent 在生成链表相关练习时强制覆盖三种边界；TutorAgent 解释链表题应主动提及 dummy 节点选择。',
  },
  {
    id: 'kb-algo-bfs-visited-timing',
    source: 'local',
    domain: 'algorithm',
    type: 'misconception',
    title: 'BFS visited 标记的时机 — 入队即标 vs 出队再标',
    tags: ['bfs', 'graph', 'visited', 'queue', 'algorithm'],
    summary: 'visited 在入队时标记才能保证每个节点只入队一次。',
    chunks: [
      {
        id: 'kb-algo-bfs-visited-timing-ch1',
        text: 'BFS 的不变量：每个节点最多入队一次。因此 visited 标记必须在节点入队时立即完成，而不是出队时才标。出队再标会导致同一节点被多次入队，队列状态不稳定，递归/迭代都错。',
      },
      {
        id: 'kb-algo-bfs-visited-timing-ch2',
        text: '诊断方式：让学生手画一个 5 节点的图，写出每步 queue 和 visited 集合。如果某个节点出现在 queue 里两次，就说明标记时机错了。补救策略：先看 4 节点的最小反例，再做"层序遍历 + visited 时机对比"两道练习。',
      },
    ],
    agentHint: 'TutorAgent 在学生写 BFS 代码出错时，主动提示 visited 时机问题；可用 animation snapshot 辅助讲解。',
  },
  {
    id: 'kb-algo-dp-subproblem',
    source: 'local',
    domain: 'algorithm',
    type: 'teaching-strategy',
    title: '动态规划 — 子问题切分三步法',
    tags: ['dp', 'dynamic-programming', 'subproblem', 'algorithm'],
    summary: 'DP 题三步：定义状态、找转移方程、确定 base case。',
    chunks: [
      {
        id: 'kb-algo-dp-subproblem-ch1',
        text: '动态规划的本质是用"已经算过的更小问题的答案"推导"当前问题的答案"。第一步：明确定义 dp[i] 或 dp[i][j] 是什么，是"以 i 结尾的最长xxx"还是"前 i 个物品的最优解"——这一步错后面全错。',
      },
      {
        id: 'kb-algo-dp-subproblem-ch2',
        text: '第二步：转移方程，要把 dp[i] 拆成"取第 i 个"和"不取第 i 个"两种情况分别算什么。第三步：base case 决定 dp[0] / dp[1] 的初值，往往 base case 一错整道题错。诊断方法：让学生用最小例子手算 dp 数组，对照他写的转移方程。',
      },
    ],
    agentHint: 'ResourceAgent 生成 DP 资源时优先按"三步法"组织文档结构；TutorAgent 讲解 DP 题时强制走三步。',
  },
  {
    id: 'kb-algo-recursion-base',
    source: 'local',
    domain: 'algorithm',
    type: 'misconception',
    title: '递归终止条件 — 为什么无限递归',
    tags: ['recursion', 'basecase', 'stack', 'algorithm'],
    summary: '递归必须有两个东西：终止条件 + 递归式缩小问题规模。',
    chunks: [
      {
        id: 'kb-algo-recursion-base-ch1',
        text: '递归出错的两个最大原因：(1) 终止条件写错，比如应该 return 但忘记 return；(2) 递归调用没有让问题规模缩小，比如 fib(n) 写成 fib(n) 而不是 fib(n-1)。诊断时让学生用 n=0,1,2,3 四个最小例子逐步手算调用栈，定位是哪一层出问题。',
      },
    ],
    agentHint: 'TutorAgent 解释递归题时建议学生用 n=0,1,2,3 手算；ResourceAgent 应生成"调用栈追踪"练习。',
  },
  {
    id: 'kb-algo-binary-search-edge',
    source: 'local',
    domain: 'algorithm',
    type: 'misconception',
    title: '二分查找边界 — left/right/mid 计算',
    tags: ['binarysearch', 'boundary', 'algorithm'],
    summary: '二分查找的 bug 几乎都来自边界条件：left + right 是否溢出、while 循环条件、mid ± 1。',
    chunks: [
      {
        id: 'kb-algo-binary-search-edge-ch1',
        text: '二分查找三个最常错的写法：(1) mid = (left + right) / 2 在 left+right 很大时会溢出，必须写成 left + Math.floor((right-left)/2)；(2) while(left <= right) 还是 while(left < right) 决定了搜索区间是闭还是开；(3) 命中后 left=mid 还是 left=mid+1 决定会不会死循环。',
      },
    ],
    agentHint: 'TutorAgent 解释二分时应明确指出这三种边界；ResourceAgent 应给出闭区间/开区间两种模板。',
  },
  {
    id: 'kb-algo-stack-queue-confuse',
    source: 'local',
    domain: 'algorithm',
    type: 'concept',
    title: '栈与队列的混淆点',
    tags: ['stack', 'queue', 'data-structure', 'algorithm'],
    summary: '栈是 LIFO 队列是 FIFO，题目描述里 "先进先出 / 后进先出" 一字之差就是不同数据结构。',
    chunks: [
      {
        id: 'kb-algo-stack-queue-confuse-ch1',
        text: '栈 (stack) LIFO 后进先出，类比一摞盘子；队列 (queue) FIFO 先进先出，类比排队买饭。Java/C++ 用 ArrayDeque 实现栈和队列性能都比 Stack/LinkedList 好。栈适合 DFS / 括号匹配 / 表达式求值；队列适合 BFS / 滑动窗口 / 任务调度。',
      },
    ],
    agentHint: '当 profile 显示"数据结构"维度低于 60 时，ResourceAgent 应优先推荐用"生活类比"讲解的数据结构入门资源。',
  },
  {
    id: 'kb-algo-hash-collision',
    source: 'local',
    domain: 'algorithm',
    type: 'concept',
    title: '哈希冲突 — 拉链法 vs 开放地址',
    tags: ['hash', 'collision', 'algorithm'],
    summary: '哈希冲突不可避免，工程上主要用拉链法和开放地址法两类策略。',
    chunks: [
      {
        id: 'kb-algo-hash-collision-ch1',
        text: '哈希冲突的两大解决思路：拉链法（同槽位用链表串起来，Java HashMap 早期版本用这个）和开放地址法（冲突了就往后找空槽位，Python dict 用这个）。负载因子是核心调优参数，超过 0.75 性能急剧下降，必须扩容。',
      },
    ],
    agentHint: 'TutorAgent 讲解哈希时应主动提"负载因子"和"扩容时机"。',
  },
  {
    id: 'kb-algo-tree-traversal',
    source: 'local',
    domain: 'algorithm',
    type: 'concept',
    title: '二叉树遍历 — 前中后序的递归与迭代转换',
    tags: ['binary-tree', 'traversal', 'algorithm'],
    summary: '前中后序的本质区别是"根节点在什么时候被访问"，和左右子树的递归顺序无关。',
    chunks: [
      {
        id: 'kb-algo-tree-traversal-ch1',
        text: '前序 = 根左右；中序 = 左根右；后序 = 左右根。三种遍历只是"根"的访问时机不同，左右子树的递归顺序永远不变。Morris 遍历能把空间复杂度降到 O(1)，原理是临时修改叶子节点的 right 指针指向祖先，遍历完再恢复。',
      },
    ],
    agentHint: 'TutorAgent 讲解二叉树时推荐"根的位置"记忆法；ResourceAgent 应提供 Morris 遍历专题。',
  },
  {
    id: 'kb-algo-shortest-path',
    source: 'local',
    domain: 'algorithm',
    type: 'concept',
    title: '最短路算法选型 — Dijkstra / Floyd / SPFA / Bellman-Ford',
    tags: ['graph', 'shortest-path', 'algorithm'],
    summary: '选算法看三个变量：边权是否为负、是否单源、是否稠密图。',
    chunks: [
      {
        id: 'kb-algo-shortest-path-ch1',
        text: '四个最短路算法的选型：Dijkstra 适合非负权单源稠密图（O(V²) 或 O(E+VlogV) 用堆优化）；Bellman-Ford 适合有负权但无负环；SPFA 是 Bellman-Ford 的队列优化，平均快但最坏 O(VE)；Floyd 适合多源稠密小图（O(V³)）。记住"非负+单源→Dijkstra；负权→Bellman；多源稠密小图→Floyd"。',
      },
    ],
    agentHint: 'TutorAgent 收到最短路问题时优先引导算法选型再讲实现。',
  },
  {
    id: 'kb-english-tense',
    source: 'local',
    domain: 'english',
    type: 'misconception',
    title: '英语时态选择 — 现在完成时 vs 一般过去时',
    tags: ['english', 'tense', 'grammar'],
    summary: '现在完成时强调"对现在有影响"，一般过去时只陈述过去事实。',
    chunks: [
      {
        id: 'kb-english-tense-ch1',
        text: '中国学生写作最容易混的两个时态：现在完成时 (have done) 和一般过去时 (did)。关键区别是"过去动作对现在的影响"——I have lived here for 5 years (我现在还住这里，影响仍在)；I lived here for 5 years (我现在不住这里，只是陈述过去)。',
      },
    ],
    agentHint: 'TutorAgent 收到英语时态问题时优先给出"对现在有影响 vs 陈述过去"的判别框架。',
  },
  {
    id: 'kb-english-subjunctive',
    source: 'local',
    domain: 'english',
    type: 'concept',
    title: '虚拟语气 — if I were / if I had been',
    tags: ['english', 'subjunctive', 'grammar'],
    summary: '虚拟语气表示与事实相反的假设，主句和从句都有固定时态搭配。',
    chunks: [
      {
        id: 'kb-english-subjunctive-ch1',
        text: '虚拟语气三套核心搭配：与现在事实相反 (If I were you, I would...)；与过去事实相反 (If I had known, I would have...)；与将来事实相反 (If I should / were to..., I would...)。be 动词在所有虚拟语气中都写成 were，不管主语是 he/she/it。',
      },
    ],
    agentHint: 'ResourceAgent 应在虚拟语气练习题里同时给出"判断正误 + 改错"两类题型。',
  },
  {
    id: 'kb-english-reading',
    source: 'local',
    domain: 'english',
    type: 'teaching-strategy',
    title: '英语阅读定位 — 关键词定位 vs 同义替换',
    tags: ['english', 'reading', 'comprehension'],
    summary: '阅读题答案往往不是原词重现，而是同义替换或反向表述。',
    chunks: [
      {
        id: 'kb-english-reading-ch1',
        text: '英语阅读题的答案在原文中的位置有两种：(1) 直接复现关键词，定位简单；(2) 同义替换或反向表述，定位需要理解语义。做题策略：先看题干定位词，回原文找同义复现；如果找不到就考虑"否定+反义词"组合。',
      },
    ],
    agentHint: 'TutorAgent 讲阅读题应让学生标注"题干关键词 → 原文同义复现"的对应关系。',
  },
  {
    id: 'kb-english-writing',
    source: 'local',
    domain: 'english',
    type: 'teaching-strategy',
    title: '英语写作结构 — 总分总 vs 问题解决',
    tags: ['english', 'writing', 'structure'],
    summary: '议论文和图表作文有不同的标准结构，混用会扣分。',
    chunks: [
      {
        id: 'kb-english-writing-ch1',
        text: '英语写作两类标准结构：(1) 议论文 总分总 (总观点 → 理由 1+例 → 理由 2+例 → 重申观点)；(2) 图表作文 问题解决 (描述图表 → 分析原因 → 影响 → 建议)。每段必须有 topic sentence，所有论点都要有具体例证支撑。',
      },
    ],
    agentHint: 'ResourceAgent 生成写作资源时应根据 topic 类型自动选择结构模板。',
  },
  {
    id: 'kb-english-vocab',
    source: 'local',
    domain: 'english',
    type: 'teaching-strategy',
    title: '词汇记忆 — 间隔重复 + 语境化',
    tags: ['english', 'vocab', 'memory'],
    summary: '背单词的死循环是只看不复，间隔重复 + 语境例句才能真正记住。',
    chunks: [
      {
        id: 'kb-english-vocab-ch1',
        text: '词汇记忆三原则：(1) 间隔重复——Anki 1/3/7/14/30 天复习曲线比"每天全背一遍"高效 5 倍；(2) 语境化——背"resign"必须记"resign from the position"，孤立背单词记得快忘得更快；(3) 输出检验——用新词造一个自己的句子，比抄 10 遍有效。',
      },
    ],
    agentHint: 'ResourceAgent 收到词汇类请求时优先推荐"语境例句 + 复习间隔建议"。',
  },
  {
    id: 'kb-pedagogy-error-diagnosis',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '错因诊断三步法',
    tags: ['pedagogy', 'error-diagnosis', 'mistake', 'evaluation'],
    summary: '错因诊断要走"现象 → 根因 → 补救"三步，缺一步就会变成只贴答案。',
    chunks: [
      {
        id: 'kb-pedagogy-error-diagnosis-ch1',
        text: '错题分析必须走三步：(1) 现象——错在第几步、错的结果是什么；(2) 根因——是概念不清、步骤遗漏、还是边界条件没考虑；(3) 补救——下次遇到同类题用什么策略。跳到第 3 步直接看答案是最常见的学习浪费。',
      },
    ],
    agentHint: 'ReflectionAgent 生成"错因记录"时强制走三步；TutorAgent 收到错题时也要先问根因再讲正解。',
  },
  {
    id: 'kb-pedagogy-active-recall',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '主动回忆补救 — 15-25 分钟闭环',
    tags: ['pedagogy', 'active-recall', 'remediation'],
    summary: '薄弱知识点应用短时主动回忆闭环，比单纯重读笔记效率高 3 倍。',
    chunks: [
      {
        id: 'kb-pedagogy-active-recall-ch1',
        text: '当学生某个知识点掌握度低于 60 时，最有效的补救不是再读一遍教材，而是 15-25 分钟的主动回忆闭环：5 分钟概念卡片自测 → 5 分钟一道典型例题手写 → 5 分钟三道变式题（不看书）→ 5 分钟复盘错因并写一句话总结。这个循环比 1 小时被动听课记忆留存率高 2-3 倍。',
      },
    ],
    agentHint: 'PathAgent 在薄弱知识点前必须插入这个主动回忆节点，而不是简单的"再看一遍"。',
  },
  {
    id: 'kb-pedagogy-socratic',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '苏格拉底式提问 — 不直接给答案',
    tags: ['pedagogy', 'socratic', 'tutor'],
    summary: '辅导时应通过连续提问引导学生自己找到答案，直接给答案会让学生形成依赖。',
    chunks: [
      {
        id: 'kb-pedagogy-socratic-ch1',
        text: '苏格拉底式提问的三层递进：(1) 你能用自己的话复述这个问题吗？(2) 你觉得哪一步最不确定？(3) 如果这一步错了，下一步会怎么变？学生卡住时不要直接给答案，而是给一个更小的子问题让他自己推出下一步。',
      },
    ],
    agentHint: 'TutorAgent 在 qa/solve 模式应优先用提问引导；只在学生明确说"直接告诉我答案"时才给完整解答。',
  },
  {
    id: 'kb-pedagogy-spaced-repetition',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '间隔重复 — 艾宾浩斯曲线的工程化',
    tags: ['pedagogy', 'spaced-repetition', 'memory'],
    summary: '间隔重复是把艾宾浩斯遗忘曲线变成可执行复习计划的方法。',
    chunks: [
      {
        id: 'kb-pedagogy-spaced-repetition-ch1',
        text: '间隔重复的核心：第一次学习后 1 天复习 → 3 天 → 7 天 → 14 天 → 30 天 → 90 天。每次复习不能只看"是否记得"，还要看"回忆速度"——回忆超过 10 秒就等于没记住，要缩短复习间隔。Anki、RemNote 都是成熟工具。',
      },
    ],
    agentHint: 'PathAgent 在规划复习节点时按 1/3/7/14/30 间隔排；ResourceAgent 应在错题本上自动标注下次复习日期。',
  },
  {
    id: 'kb-pedagogy-mindmap',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '概念图构建 — 把零散知识点串成网',
    tags: ['pedagogy', 'mindmap', 'concept'],
    summary: '学完一章后画概念图，比抄一遍笔记更能暴露知识盲区。',
    chunks: [
      {
        id: 'kb-pedagogy-mindmap-ch1',
        text: '概念图的核心是"节点 + 连线 + 关系标签"。节点是概念，连线是关系，标签必须写明是什么关系（"包含"、"导致"、"对比"、"前提"）。只画节点不写关系标签的思维导图毫无价值。',
      },
    ],
    agentHint: 'ResourceAgent 在生成"章节总结"类资源时应主动建议概念图形式。',
  },
  {
    id: 'kb-pedagogy-error-notebook',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '错题本使用 — 不抄题只抄根因',
    tags: ['pedagogy', 'error-notebook', 'mistake'],
    summary: '错题本的价值不在抄题而在归类根因和补救策略。',
    chunks: [
      {
        id: 'kb-pedagogy-error-notebook-ch1',
        text: '错题本三栏结构：错误题目简述（一行）→ 根因诊断（是哪类错误：概念/步骤/边界/计算）→ 下次遇到怎么办（一句话策略）。每两周回头分类统计，如果某一类错误反复出现，就回到对应知识点重学。',
      },
    ],
    agentHint: 'ReflectionAgent 生成的"错因报告"应按这三栏输出；不应只列错题。',
  },
  {
    id: 'kb-pedagogy-flow',
    source: 'local',
    domain: 'pedagogy',
    type: 'concept',
    title: '心流状态调节 — 学习效率的内在条件',
    tags: ['pedagogy', 'flow', 'motivation'],
    summary: '心流 = 挑战难度略高于当前能力 + 明确目标 + 即时反馈。',
    chunks: [
      {
        id: 'kb-pedagogy-flow-ch1',
        text: '心流三要素：(1) 挑战难度比当前能力高 10-20%——太简单无聊，太难焦虑；(2) 目标明确具体——"做完 5 道题"比"学会数据结构"更容易进入心流；(3) 即时反馈——每一步都能看到对错调整下一步。学习疲劳时切换"输入型"和"输出型"任务比硬撑更高效。',
      },
    ],
    agentHint: 'PathAgent 排路径时不应连续安排 3 个高难度任务，中间要插入轻量巩固任务。',
  },
  {
    id: 'kb-pedagogy-exam-prep',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '考前冲刺 — 错题复盘 > 刷新题',
    tags: ['pedagogy', 'exam', 'review'],
    summary: '考前一周刷新题的边际收益极低，复盘错题才是分数提升最快的方式。',
    chunks: [
      {
        id: 'kb-pedagogy-exam-prep-ch1',
        text: '考前一周的标准节奏：第 1-2 天只看错题本和概念图，不刷任何新题；第 3-4 天做两套完整模拟题（限时）训练时间分配；第 5 天回顾错题；第 6 天轻量浏览笔记；第 7 天休息。考前熬夜几乎必然降低 10-20 分的发挥。',
      },
    ],
    agentHint: 'PathAgent 在考前阶段应切换为"复盘模式"，不应继续推送新概念。',
  },
  {
    id: 'kb-method-feynman',
    source: 'local',
    domain: 'method',
    type: 'teaching-strategy',
    title: '费曼技巧 — 讲给小白听才算真懂',
    tags: ['method', 'feynman', 'comprehension'],
    summary: '费曼技巧四步：学 → 讲 → 卡 → 简。',
    chunks: [
      {
        id: 'kb-method-feynman-ch1',
        text: '费曼技巧四步：(1) 选择一个概念，写下来你想教给别人的内容；(2) 假装给一个完全不懂的人讲，用最简单的语言；(3) 卡住的地方就是你没真懂，回去重新学；(4) 简化语言，用类比替代术语。如果不能用大白话讲出来，就说明你对这个概念的理解是表面的。',
      },
    ],
    agentHint: 'TutorAgent 在 explain 模式应主动鼓励学生"用自己的话再讲一遍"。',
  },
  {
    id: 'kb-method-cornell',
    source: 'local',
    domain: 'method',
    type: 'teaching-strategy',
    title: '康奈尔笔记 — 三栏结构',
    tags: ['method', 'cornell', 'note'],
    summary: '康奈尔笔记把页面分成"笔记 / 关键词 / 总结"三栏，是听课和复习的最优结构。',
    chunks: [
      {
        id: 'kb-method-cornell-ch1',
        text: '康奈尔笔记页面分三栏：右侧大栏记课堂笔记（占 70%），左侧窄栏课后立刻提炼关键词和问题（占 20%），底部小栏课后 24 小时内写一段总结（占 10%）。只看左栏和底栏就能在不重读笔记的情况下完成复习。',
      },
    ],
    agentHint: 'ResourceAgent 在生成"学习档案"类资源时推荐康奈尔模板。',
  },
  {
    id: 'kb-method-pomodoro',
    source: 'local',
    domain: 'method',
    type: 'teaching-strategy',
    title: '番茄钟 — 25 分钟专注单元',
    tags: ['method', 'pomodoro', 'focus'],
    summary: '番茄钟的本质是"用结构化时间保护专注"，不是计时器。',
    chunks: [
      {
        id: 'kb-method-pomodoro-ch1',
        text: '番茄钟标准流程：25 分钟专注（不允许任何切换）→ 5 分钟休息（站起来、看远处、不刷手机）→ 每 4 个番茄后长休息 15-30 分钟。一个番茄必须做完一件事，不要"写到一半就停"。如果被打断，这个番茄作废，重新开始。',
      },
    ],
    agentHint: 'PathAgent 在生成"每日学习计划"时可建议切分为番茄单元。',
  },
  {
    id: 'kb-method-zettelkasten',
    source: 'local',
    domain: 'method',
    type: 'teaching-strategy',
    title: '双链笔记 — 用关联代替分类',
    tags: ['method', 'zettelkasten', 'note', 'obsidian'],
    summary: '双链笔记的核心是"一个想法只在一个地方写，其它地方用链接引用"。',
    chunks: [
      {
        id: 'kb-method-zettelkasten-ch1',
        text: '双链笔记 (Zettelkasten) 三个原则：(1) 原子化——一个笔记只写一个想法；(2) 自有语言——用自己的话重写而不是复制粘贴；(3) 主动链接——每写一条新笔记都要想它和已有哪几条相关并加链接。Obsidian、Logseq 是常用工具。',
      },
    ],
    agentHint: 'ResourceAgent 生成"长期沉淀"类资源时推荐双链笔记模板。',
  },
  {
    id: 'kb-method-project-driven',
    source: 'local',
    domain: 'method',
    type: 'teaching-strategy',
    title: '项目驱动学习 — 先用后学',
    tags: ['method', 'project', 'learning'],
    summary: '项目驱动学习的顺序是"先遇到问题 → 再去找答案"，比按章节顺序学更高效。',
    chunks: [
      {
        id: 'kb-method-project-driven-ch1',
        text: '项目驱动学习三步：(1) 选一个比当前能力高 20% 的小项目；(2) 边做边查，遇到问题再回去学对应知识点；(3) 完成后复盘哪些知识点是被动学到的、哪些是主动查到的。被动学到的记得最牢，因为有真实上下文。',
      },
    ],
    agentHint: 'PathAgent 在综合阶段必须安排至少一个项目实践节点。',
  },
  {
    id: 'kb-method-internalization',
    source: 'local',
    domain: 'method',
    type: 'concept',
    title: '知识内化四阶段 — 输入到输出',
    tags: ['method', 'internalization', 'learning'],
    summary: '知识从输入到真正内化要经过"理解 → 复述 → 应用 → 教学"四阶段。',
    chunks: [
      {
        id: 'kb-method-internalization-ch1',
        text: '知识内化四阶段：(1) 理解——能跟着讲解听懂；(2) 复述——能用自己的话讲出来；(3) 应用——能在新问题里用上；(4) 教学——能教别人。四阶段逐级提高，缺一个阶段知识就是"假懂"。能讲出来才算真懂，能教别人才算彻底掌握。',
      },
    ],
    agentHint: 'ReflectionAgent 评估"掌握度"时应分阶段给分，而不是只看做题正确率。',
  },
  {
    id: 'kb-general-time-estimate',
    source: 'local',
    domain: 'general',
    type: 'teaching-strategy',
    title: '时间估计 — 学习任务耗时评估',
    tags: ['time', 'estimate', 'planning'],
    summary: '学习任务实际耗时通常是估计的 2-3 倍，做计划时直接乘 2。',
    chunks: [
      {
        id: 'kb-general-time-estimate-ch1',
        text: '规划学习任务的经验法则：实际耗时 = 估计耗时 × 2。最容易低估的三类任务：(1) 阅读新概念材料（容易忘，要反复看）；(2) 写代码练习（编译调试占一半）；(3) 复习旧知识（要查错题本 + 重做错题）。计划阶段直接乘 2 比"留 buffer"更准确。',
      },
    ],
    agentHint: 'PathAgent 在生成每日计划时应把所有 estimatedMinutes × 1.5 作为更现实的预期。',
  },
  {
    id: 'kb-general-feedback-loop',
    source: 'local',
    domain: 'general',
    type: 'concept',
    title: '学习反馈环 — 计划→执行→评估→调整',
    tags: ['feedback', 'loop', 'evaluation'],
    summary: '学习闭环的最小单元是"计划→执行→评估→调整"四步，缺一步就是单向付出。',
    chunks: [
      {
        id: 'kb-general-feedback-loop-ch1',
        text: '学习闭环四步：(1) 计划——明确"今天做什么、做到什么程度"；(2) 执行——按计划做，不轻易切换；(3) 评估——做完对照预期看差异；(4) 调整——根据评估结果改下次计划。只执行不评估等于没学；只评估不调整等于浪费反馈。',
      },
    ],
    agentHint: 'ReflectionAgent 应引导用户写"调整"步骤，而不是只输出评估结果。',
  },
  {
    id: 'kb-systems-os-virtual-memory',
    source: 'local',
    domain: 'systems',
    type: 'concept',
    title: '操作系统虚拟内存 — 分页、页表、TLB 三层结构',
    tags: ['os', 'virtual-memory', 'paging', 'page-table', 'tlb', 'systems', 'tutor', 'concept'],
    summary: '虚拟内存是"逻辑地址→物理地址"的映射机制，由分页单位、页表存储、TLB 缓存三层构成，是 OS 最核心的抽象。',
    chunks: [
      {
        id: 'kb-systems-os-virtual-memory-ch1',
        text: '虚拟内存的本质是给每个进程一个"看起来连续、独占"的地址空间，但实际物理内存是碎片化、共享的。实现分两步：(1) 操作系统把内存切成等大小的页（典型 4KB），进程的逻辑地址被分成"页号 + 页内偏移"；(2) 通过页表（Page Table）把"逻辑页号"映射到"物理页框号"。MMU（内存管理单元）在硬件层做这个映射，CPU 每次访问内存都会自动查页表。',
      },
      {
        id: 'kb-systems-os-virtual-memory-ch2',
        text: '页表本身的存储开销是虚拟内存的隐藏成本。一个 32 位地址空间、4KB 页大小的进程，页表就有 2^20 = 100 万项，每项 4 字节就是 4MB。两层页表（页目录 + 页表）只装真正用到的部分，把开销从"全占用"降到"按需分配"。多级页表的代价是每次地址转换要查多次内存，性能被严重拖慢。',
      },
      {
        id: 'kb-systems-os-virtual-memory-ch3',
        text: 'TLB（Translation Lookaside Buffer）是页表的高速缓存。TLB 命中时一次硬件查表搞定地址转换；TLB 未命中时 MMU 必须访问内存查页表，延迟从纳秒级上升到百纳秒级，差距可达 100 倍。TLB 命中率是性能关键指标，常见优化：(1) 增大页（从 4KB 到 2MB 大页，减少 TLB 项数）；(2) 预取（hugetlbfs）；(3) 软件层减少跨页访问。',
      },
      {
        id: 'kb-systems-os-virtual-memory-ch4',
        text: '页面置换算法决定物理内存不够时淘汰哪些页。经典的 5 种算法对比：FIFO（最简单但 Belady 异常）→ LRU（理论最优但实现昂贵）→ Clock（近似 LRU 的环形指针）→ LFU（按访问频率淘汰抖动风险大）→ 工作集模型（按时间窗口内访问的页集合淘汰）。生产环境常用 Clock 的改进版（如 Linux 的 2Q、ARC），工程上没有银弹，只有适合场景的权衡。',
      },
      {
        id: 'kb-systems-os-virtual-memory-ch5',
        text: '诊断学生是否真懂虚拟内存的标准问题：(1) 32 位 / 64 位进程最大可用地址空间各是多少？(2) 一个数组 int a[1000] 占多少页？(3) fork 后父子进程改同一变量是否互相影响？答不全说明还停留在"知道有这回事"阶段，没有建立"逻辑地址 → MMU → 页表 → 物理地址"的完整链路。补救顺序：先画 4KB 页 × 5 页 × 页表的实物图，再做 fork + mmap 编程实验，最后看 Linux /proc/self/maps 输出。',
      },
    ],
    agentHint: 'TutorAgent 收到 OS/虚拟内存/分页类问题优先匹配；ResourceAgent 生成 OS 资源时按"概念→映射→TLB→置换→诊断"五段组织。',
  },
  {
    id: 'kb-systems-concurrency',
    source: 'local',
    domain: 'systems',
    type: 'misconception',
    title: '并发与同步 — 进程线程、死锁、内存模型',
    tags: ['concurrency', 'thread', 'process', 'mutex', 'semaphore', 'deadlock', 'systems'],
    summary: '并发的核心难点是"共享状态 + 多执行流"的组合，死锁、竞态、可见性是三大典型陷阱。',
    chunks: [
      {
        id: 'kb-systems-concurrency-ch1',
        text: '进程是资源分配的最小单位（独立地址空间），线程是 CPU 调度的最小单位（共享进程地址空间）。多线程共享堆内存但不共享栈，因此共享状态必须显式同步。Java 的 synchronized / ReentrantLock、Python 的 threading.Lock、C++ 的 std::mutex 本质都是"互斥锁"，保证临界区同一时刻只有一个线程进入。',
      },
      {
        id: 'kb-systems-concurrency-ch2',
        text: '死锁四个必要条件（缺一不可）：(1) 互斥——资源一次只能被一个线程占用；(2) 持有并等待——线程持有资源的同时等待其他资源；(3) 不可抢占——资源只能线程主动释放；(4) 循环等待——存在线程-资源的等待环路。破解方法：破坏任意一个——最常用"按统一顺序加锁"破坏循环等待，或"尝试获取锁失败就释放已持有的锁"破坏持有并等待。',
      },
      {
        id: 'kb-systems-concurrency-ch3',
        text: '内存模型（Memory Model）回答"线程 A 写入的变量，线程 B 什么时候能看到"。CPU 有缓存、写缓冲、指令重排，编译器也会重排指令。Java 的 volatile、C++ 的 std::atomic 是"可见性 + 禁止重排"的语义保证。没有这些保证时，线程 B 可能永远读到旧值（即便已经加了锁），因为锁只保证互斥，不保证其他 CPU 缓存立即失效。',
      },
      {
        id: 'kb-systems-concurrency-ch4',
        text: '高并发编程的工程实践：(1) 优先用无锁数据结构（ConcurrentHashMap、Disruptor）而不是裸锁；(2) 锁粒度尽量小，锁代码段不能包含 IO 或 sleep；(3) 用 thread pool 而不是每次 new Thread；(4) 避免共享状态，能用消息队列（Actor 模型）就用消息队列。诊断学生并发能力：让他口述"两个线程同时 ++ 一个共享 int 100 次，最终值范围"，答不出 100-200 区间就说明没建立内存模型直觉。',
      },
    ],
    agentHint: 'TutorAgent 收到并发/线程/锁类问题优先匹配；PathAgent 检测到"操作系统"维度低时插入本篇作为补救。',
  },
  {
    id: 'kb-systems-network-protocol',
    source: 'local',
    domain: 'systems',
    type: 'concept',
    title: '计算机网络协议栈 — TCP/IP、HTTP、三次握手',
    tags: ['network', 'tcp', 'udp', 'http', 'protocol', 'osi', 'systems'],
    summary: '网络协议是分层协作的，OSI 七层是教学模型，TCP/IP 四层是工程实现。',
    chunks: [
      {
        id: 'kb-systems-network-protocol-ch1',
        text: 'OSI 七层（应用 / 表示 / 会话 / 传输 / 网络 / 数据链路 / 物理）是教科书模型，实际工程用 TCP/IP 四层（应用 / 传输 / 网络 / 网络接口）。每层只关心相邻层的接口：应用层把数据交给传输层，传输层加上端口号变成 segment，网络层加上 IP 变成 packet，链路层加上 MAC 变成 frame。最关键的"端到端"语义由传输层（TCP/UDP）实现。',
      },
      {
        id: 'kb-systems-network-protocol-ch2',
        text: 'TCP 三次握手的本质是"双方各确认一次收发能力"。客户端发 SYN（我能发），服务端回 SYN+ACK（我能收也能发），客户端再回 ACK（我也能收）。少了任何一次都会有"单向确认"的盲区——比如两次握手，服务端无法确认客户端的接收能力。四次挥手（FIN+ACK、ACK、FIN+ACK、ACK）是"双向关闭 + 等待残留数据"，TIME_WAIT 状态是为了让对端收到最后的 ACK，避免重传丢包。',
      },
      {
        id: 'kb-systems-network-protocol-ch3',
        text: 'HTTP 是基于 TCP 的应用层协议。HTTP/1.1 一个连接一次只能处理一个请求（管线化也没解决队头阻塞），HTTP/2 多路复用（一个连接多 stream）才真正并发，HTTP/3 直接换成 UDP + QUIC 解决 TCP 队头阻塞。工程师排查网络问题三层切入：(1) ping/traceroute 看网络层；(2) tcpdump/Wireshark 看传输层；(3) curl -v 看应用层。',
      },
      {
        id: 'kb-systems-network-protocol-ch4',
        text: '网络协议学习的标准误区：死记端口号（80/443/22）但说不清 TCP 三次握手；会用 curl 但不知道 HTTP 报文结构。补救路径：先抓一个真实 HTTP 请求的报文（Wireshark 或 tcpdump），看清 TCP 三次握手 + HTTP request + response + 四次挥手的完整流程，再画一遍协议栈各层封装结构。理解协议的唯一方法是看一次真实数据流。',
      },
    ],
    agentHint: 'TutorAgent 收到 TCP/HTTP/网络协议类问题优先匹配；ResourceAgent 生成网络类资源时应提供"抓包实操"任务。',
  },
  {
    id: 'kb-systems-memory-leak',
    source: 'local',
    domain: 'systems',
    type: 'misconception',
    title: '内存泄漏与异常安全 — 谁分配谁释放',
    tags: ['memory-leak', 'gc', 'exception-safety', 'raii', 'systems', 'evaluation'],
    summary: '内存泄漏不是 GC 语言的免死金牌，异常路径才是泄漏的重灾区。',
    chunks: [
      {
        id: 'kb-systems-memory-leak-ch1',
        text: 'C/C++ 的内存泄漏来自"申请了但没释放"，根因是手动管理。Java/Python/Go 的 GC 自动回收"无引用"的对象，看似没问题，但"被引用但不再使用"的循环引用或长生命周期容器持有短生命周期对象，依然会泄漏——只是叫"逻辑泄漏"而不是"物理泄漏"。诊断 Java 内存泄漏的标准动作：jmap + jhat 看对象实例数 + 引用链，找出谁持有不该持有的对象。',
      },
      {
        id: 'kb-systems-memory-leak-ch2',
        text: '异常路径才是内存泄漏的高发区。考虑代码：malloc(buf) → read(fd, buf) → process(buf) → free(buf)。如果 process 抛异常或 read 返回 -1 提前 return，free 就不会执行。RAII（C++ 构造函数获取资源、析构函数释放）是 C++ 的标准解决方案。Java 的 try-with-resources、Python 的 with 语句、Go 的 defer 是同一思想的语言级实现，核心都是"无论是否异常，资源一定释放"。',
      },
      {
        id: 'kb-systems-memory-leak-ch3',
        text: '"谁分配谁释放"是内存管理的黄金原则。如果 A 函数 malloc 内存返回给 B 函数 free，会出现 B 函数因为参数校验失败提前 return 而忘了 free 的情况。正确的做法是 A 函数在内部完成整个生命周期管理，要么把所有权 move 给 B（B 必须接管），要么用 shared_ptr 让释放变成引用计数触发。诊断学生是否真懂：给他一段 malloc+多 early return 代码，让他数一共有几种泄漏路径。',
      },
    ],
    agentHint: 'EvaluationAgent 检测到"动态内存释放"类薄弱点时优先匹配；ResourceAgent 资源生成的 errorTip 应主动引用 RAII 思想。',
  },
  {
    id: 'kb-ai-deep-learning-foundations',
    source: 'local',
    domain: 'ai',
    type: 'concept',
    title: '深度学习基础 — 反向传播、梯度下降、正则化',
    tags: ['ai', 'deep-learning', 'neural-network', 'backprop', 'gradient', 'regularization', 'tutor'],
    summary: '深度学习的三大支柱：神经网络结构 + 反向传播算法 + 训练优化技巧，三者缺一不可。',
    chunks: [
      {
        id: 'kb-ai-deep-learning-foundations-ch1',
        text: '神经网络本质是"带激活函数的多层线性变换堆叠"。输入 x 经 W1·x + b1 再过 ReLU，再 W2·x + b2 再过 softmax……层数越深表达能力越强，但训练难度也越大。没有激活函数的多层线性变换等价于单层线性变换，这就是为什么 ReLU/Sigmoid/Tanh 是网络"非线性的来源"。',
      },
      {
        id: 'kb-ai-deep-learning-foundations-ch2',
        text: '反向传播是链式法则的高效实现。前向传播计算 loss，反向传播从 loss 开始逐层求 ∂L/∂W，借助链式法则把每个参数的梯度"算一遍"。计算图（Computational Graph）是 PyTorch/TensorFlow 的核心抽象，每个节点是一个运算，边是张量流动，前向建图、反向自动求导。理解反向传播的关键是手算一个 2 层网络的梯度公式，看清每一项的物理含义（误差信号 = 损失对激活的偏导）。',
      },
      {
        id: 'kb-ai-deep-learning-foundations-ch3',
        text: '梯度下降的三个变种：批量梯度下降（BGD，全量数据算梯度，稳定但慢）→ 随机梯度下降（SGD，单样本算梯度，快但震荡）→ 小批量梯度下降（Mini-batch GD，工程标配）。学习率是核心超参：太大学习震荡发散，太小收敛慢。优化器从 SGD → Momentum（加惯性）→ Adam（自适应学习率 + 动量）一路演进，Adam 是目前深度学习的默认选择。',
      },
      {
        id: 'kb-ai-deep-learning-foundations-ch4',
        text: '过拟合是深度学习的核心矛盾——模型复杂度和数据量的不匹配。诊断方法：训练 loss 持续下降但验证 loss 在某点后开始上升 = 典型过拟合。三大正则化武器：(1) L1/L2 正则化（损失函数加权重惩罚）；(2) Dropout（训练时随机屏蔽部分神经元，推理时全开）；(3) 数据增强（图像翻转裁剪、文本回译）。Batch Normalization 既是正则化也是加速器，是现代网络的标配。',
      },
      {
        id: 'kb-ai-deep-learning-foundations-ch5',
        text: '诊断学生是否真懂深度学习的标准问题：(1) 为什么 ReLU 比 Sigmoid 更适合深层网络？(2) batch size 变大/变小对训练有什么影响？(3) 训练 loss 下降但验证 loss 不降该怎么调？(4) Dropout 在推理时为什么要除以保留概率？答不全说明只停留在"调包侠"阶段。补救路径：先看 3Blue1Brown 神经网络可视化建立直觉，再用 PyTorch 手写一个 MNIST 分类器从零训练，最后读 ResNet 论文理解深层网络的工程优化。',
      },
    ],
    agentHint: 'TutorAgent 收到 ML/DL/神经网络/反向传播类问题优先匹配；ResourceAgent 生成 AI 资源按"结构→前向→反向→优化→正则化"五段组织。',
  },
  {
    id: 'kb-ai-transformer-architecture',
    source: 'local',
    domain: 'ai',
    type: 'concept',
    title: 'Transformer 架构 — 注意力机制、Self-Attention、位置编码',
    tags: ['ai', 'transformer', 'attention', 'self-attention', 'position-encoding', 'tutor', 'concept'],
    summary: 'Transformer 用 Self-Attention 替代 RNN 的序列建模，靠位置编码补回位置信息，是 GPT/BERT 的共同祖先。',
    chunks: [
      {
        id: 'kb-ai-transformer-architecture-ch1',
        text: 'Self-Attention 的核心是"序列中每个位置都和所有其他位置算相关性"。给定输入序列 X，对每个位置生成三个向量：Query（查询）、Key（键）、Value（值）。Attention(Q,K,V) = softmax(Q·K^T / √d)·V，其中 Q·K^T 给出"位置 i 对位置 j 的注意力权重"，√d 是缩放因子防止 softmax 饱和。Multi-Head Attention 把这个过程并行做 h 次，再拼起来，让模型能同时关注不同子空间。',
      },
      {
        id: 'kb-ai-transformer-architecture-ch2',
        text: 'Self-Attention 是"集合操作"——它对输入的排列不变！两个句子交换顺序，attention 输出按同样顺序交换，模型分不出"我在第几个"。位置编码（Positional Encoding）是补回位置信息的关键：sin/cos 位置编码（原始 Transformer）或可学习的位置向量（BERT/GPT）加到输入 embedding 上。RoPE（旋转位置编码）是 LLaMA 等现代模型的选择，让相对位置关系可被 attention 自然建模。',
      },
      {
        id: 'kb-ai-transformer-architecture-ch3',
        text: 'Transformer Encoder（BERT 类）和 Decoder（GPT 类）的区别在于 Mask。Encoder 是双向 attention（每个位置看所有其他位置），适合理解任务；Decoder 是单向 causal mask（每个位置只看左侧），适合生成任务。Encoder-Decoder（原始 Transformer、机器翻译）= Encoder 理解输入 + Decoder 生成输出，每一层 Decoder 还有一个 cross-attention 关注 Encoder 输出。',
      },
      {
        id: 'kb-ai-transformer-architecture-ch4',
        text: 'Transformer 训练的核心技巧：(1) 残差连接 + LayerNorm（每层输出 = x + Sublayer(x) 后做 Norm），让深层网络可训练；(2) Pre-LN vs Post-LN，Pre-LN 训练更稳定是现代 LLM 主流；(3) 混合精度训练（FP16/BF16）减少显存和加速；(4) Flash Attention 减少 attention 计算的内存访问。推理时 KV Cache 缓存历史 token 的 K/V，避免重复计算，让自回归生成从 O(n²) 降到 O(n)。',
      },
      {
        id: 'kb-ai-transformer-architecture-ch5',
        text: '诊断学生是否真懂 Transformer：(1) 为什么 attention 要除以 √d？(2) Self-attention 复杂度是 O(n²·d)，1000 token 的句子 attention 矩阵多大？(3) Decoder 的 causal mask 是什么形状？(4) 位置编码如果不加，模型能学到相对位置吗？答不全说明只记住了"Transformer 是 attention"这句话，没有理解每个设计选择的工程动机。',
      },
    ],
    agentHint: 'TutorAgent 收到 Transformer/Attention/GPT 类问题优先匹配；ResourceAgent 生成 AI 资源按"机制→位置→结构→训练→诊断"五段组织。',
  },
  {
    id: 'kb-se-version-control-git',
    source: 'local',
    domain: 'software-engineering',
    type: 'teaching-strategy',
    title: 'Git 版本控制 — 提交、分支、合并、冲突解决',
    tags: ['git', 'version-control', 'branch', 'merge', 'conflict', 'software-engineering', 'tutor'],
    summary: 'Git 的核心模型是"有向无环图（DAG）+ 内容寻址"，分支、合并、冲突都是这个模型的工程表达。',
    chunks: [
      {
        id: 'kb-se-version-control-git-ch1',
        text: 'Git 的本质不是"文件备份工具"，而是"内容寻址的有向无环图"。每个 commit 是一个节点，指向父 commit；每个文件内容算 SHA-1 哈希作为地址存到 .git/objects。branch 只是一个 41 字节的可移动指针，HEAD 指向当前 branch。这种设计的工程好处：(1) 分支创建/切换成本极低（O(1)）；(2) 完整性校验天然内建；(3) 离线操作全部支持。',
      },
      {
        id: 'kb-se-version-control-git-ch2',
        text: '三大工作区域：工作区（Working Directory，你看到的文件）→ 暂存区（Index/Stage，git add 后的快照）→ 仓库（Repository，git commit 后的永久记录）。git add 选片、git commit 提交、git diff 比较的分别是不同区域。理解了这三个区域，git reset / git checkout / git restore 就不再混乱——它们只是把文件在不同区域之间搬来搬去。',
      },
      {
        id: 'kb-se-version-control-git-ch3',
        text: '冲突（Conflict）只在 merge / rebase / cherry-pick 时出现，本质是"同一个文件的同一区域被不同分支各自修改"。Git 不会自动解决，只能人工裁决。冲突的标准动作：(1) 看冲突标记（<<<<<<< HEAD / ======= / >>>>>>> branch-name）；(2) 决定保留哪一方 / 合并双方 / 重写；(3) git add 标记解决；(4) git commit 完成合并。养成"小颗粒频繁提交 + 描述清晰的 commit message"能避免大部分冲突。',
      },
      {
        id: 'kb-se-version-control-git-ch4',
        text: 'Git 工作流选型：单人 / 小团队用 GitHub Flow（main + feature branch + PR）；大团队用 Git Flow（main / develop / feature / release / hotfix 五类分支）；超大型项目用 Trunk-Based Development（短生命周期分支 + 频繁合并到 main）。不存在"最好的工作流"，只有"最适合团队规模和发布节奏的"。诊断学生 Git 能力：让他现场解释 git rebase 和 git merge 的区别，答不出"rebase 改写历史 vs merge 保留历史"就说明还没理解 Git 的本质。',
      },
    ],
    agentHint: 'TutorAgent 收到 Git/版本控制/分支类问题优先匹配；ResourceAgent 资源生成的 exercise 题目应包含真实冲突场景。',
  },
  {
    id: 'kb-se-testing-strategy',
    source: 'local',
    domain: 'software-engineering',
    type: 'teaching-strategy',
    title: '软件测试 — 单元测试、集成测试、TDD、覆盖率',
    tags: ['testing', 'unit-test', 'integration-test', 'tdd', 'coverage', 'software-engineering', 'resource'],
    summary: '测试金字塔是工程共识：底层单元测试快而广，中层集成测试连真实组件，顶层端到端测试慢而精。',
    chunks: [
      {
        id: 'kb-se-testing-strategy-ch1',
        text: '测试金字塔（Mike Cohn 提出）从下到上：单元测试（数量多、速度快、覆盖函数/方法）→ 集成测试（验证模块间协作）→ 端到端测试（模拟真实用户场景）。比例经验：70% 单元 + 20% 集成 + 10% E2E。反模式"冰淇淋蛋筒反模式"——E2E 多单元少，运行慢、维护难、改一行代码就大面积红。',
      },
      {
        id: 'kb-se-testing-strategy-ch2',
        text: 'TDD（Test-Driven Development）的红绿重构循环：先写一个失败的测试（红）→ 写最少代码让测试通过（绿）→ 重构代码并保持测试通过（重构）。TDD 不是为了"测试覆盖率"，而是为了"逼迫 API 易测试 = 逼迫设计良好"。强依赖全局状态、私有方法、外部 IO 的代码都不好测试，所以 TDD 自然引导出"依赖注入 + 纯函数 + 显式接口"的代码风格。',
      },
      {
        id: 'kb-se-testing-strategy-ch3',
        text: '测试覆盖率是必要非充分条件。100% 行覆盖 ≠ 100% 质量——可能漏了所有边界条件。覆盖率指标组合：行覆盖（Line）+ 分支覆盖（Branch）+ 路径覆盖（Path）。工程目标通常是行覆盖 ≥ 80% + 关键模块分支覆盖 ≥ 90%。Mutation Testing（变异测试）是更严格的标准：往代码里故意注入 bug，看测试能否捕获，是测试质量的"反向指标"。',
      },
      {
        id: 'kb-se-testing-strategy-ch4',
        text: '常见测试反模式：(1) 测试调用了真实数据库/网络（应该 mock）；(2) 测试顺序依赖（test2 必须在 test1 之后跑）；(3) 一个 test 测了 N 件事（出问题不知道哪个断言挂了）；(4) 测试代码本身有 bug（"测试不工作的代码"）。诊断学生测试能力：让他为一个有 if/else 的纯函数写测试，如果没覆盖边界（空输入、极大输入、null）就是常见盲区。',
      },
    ],
    agentHint: 'ResourceAgent 生成 code 类型资源时强制包含单元测试模板；TutorAgent 收到"测试怎么写"类问题优先匹配。',
  },
  {
    id: 'kb-pedagogy-creativity',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '创造力培养 — 头脑风暴、SCAMPER、设计思维',
    tags: ['creativity', 'innovation', 'brainstorm', 'scamper', 'design-thinking', 'pedagogy', 'profile'],
    summary: '创造力不是天赋而是可训练的方法，SCAMPER + 设计思维是两条成熟路径。',
    chunks: [
      {
        id: 'kb-pedagogy-creativity-ch1',
        text: '创造力 = 跨域联想 × 选择性保留。先大量生成想法（横向广度），再用判断力筛选（纵向深度）。这与算法里的"广度优先搜索 + 启发式剪枝"是同构的。创造力的反义词不是"低智商"而是"过早收敛"——人在一个想法上停留太久，没有探索足够多的备选。诊断学生创造力：用"一物多用"测试（30 秒说砖头的用途），少于 10 个说明横向广度不足。',
      },
      {
        id: 'kb-pedagogy-creativity-ch2',
        text: 'SCAMPER 是七类改造动作的首字母缩写：(S) Substitute 替换——能换成什么？(C) Combine 合并——能和什么组合？(A) Adapt 适配——能借鉴其他领域吗？(M) Modify 改造——放大/缩小/反转？(P) Put to other use 改变用途——还能做什么？(E) Eliminate 删减——去掉什么？(R) Reverse 重组——顺序能换吗？对一个产品/概念依次过七问，平均能产出 20+ 新想法。',
      },
      {
        id: 'kb-pedagogy-creativity-ch3',
        text: '设计思维（Design Thinking）五步：Empathize（共情用户）→ Define（定义问题）→ Ideate（发散构思）→ Prototype（快速原型）→ Test（验证迭代）。这套方法把创造力变成可重复的工程流程。创造力的核心训练是"延迟判断"——Ideate 阶段禁止批评任何想法，先追求数量（一次 100 个想法），再在 Prototype 阶段筛选。',
      },
      {
        id: 'kb-pedagogy-creativity-ch4',
        text: 'ProfileAgent 检测到学生"创造力"维度低于 50 时，应推荐三类资源：(1) SCAMPER 模板（结构化发散）；(2) 一物多用日常练习（每天一题 30 秒）；(3) 跨领域类比训练（把 A 领域概念迁移到 B 领域）。PathAgent 应在"专题深入"阶段插入一个跨学科项目，让学生体验"在 A 领域学的方案搬到 B 领域"的顿悟时刻。',
      },
    ],
    agentHint: 'ProfileAgent 创造力维度低于 50 时优先匹配；PathAgent 在专题阶段插入跨学科项目节点。',
  },
  {
    id: 'kb-pedagogy-self-discipline',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '自律力训练 — 习惯回路、拖延应对、承诺机制',
    tags: ['self-discipline', 'habit', 'procrastination', 'commitment', 'pedagogy', 'profile'],
    summary: '自律不是"意志力强"，而是设计环境让正确行为阻力最小、错误行为阻力最大。',
    chunks: [
      {
        id: 'kb-pedagogy-self-discipline-ch1',
        text: '习惯回路（Habit Loop）三步：Cue（提示）→ Routine（惯常行为）→ Reward（奖赏）。培养新习惯的核心是让 Cue 明确、Routine 简单、Reward 即时。看书 30 分钟太难——拆分到"打开书看 1 页"足够小，Cue 是"坐到书桌前"，Reward 是"打勾"。用最小行动绕过"启动阻力"，是习惯养成的工程化做法。',
      },
      {
        id: 'kb-pedagogy-self-discipline-ch2',
        text: '拖延的本质是"当下情绪 vs 未来收益"的不等价交换。大脑的折扣函数让"现在玩手机的快乐"远大于"未来考试的收益"。破解拖延的三招：(1) 把任务切小到"5 分钟能完成"——降低启动阻力；(2) 设定具体时间地点（"明早 9 点在图书馆"）——消除决策成本；(3) 找 accountability partner——社会承诺比自我承诺强 10 倍。',
      },
      {
        id: 'kb-pedagogy-self-discipline-ch3',
        text: '承诺机制（Commitment Device）是诺奖得主托马斯·谢林的经典想法：预先给自己"如果做不到就付出代价"的约束。比如"每天不学 1 小时就捐款 100 元"。Odyssey、Beeminder、StickK 都是工具化实现。关键设计：代价要足够痛但不至于破产。诊断学生自律力：让他自我评估"过去 30 天有几次主动拒绝了娱乐"，少于 5 次说明承诺机制设计失败。',
      },
      {
        id: 'kb-pedagogy-self-discipline-ch4',
        text: 'ProfileAgent 检测到"自律力"维度低于 50 时的诊断三步：(1) 是拖延问题（启动阻力大）还是中断问题（开始后被频繁打断）？(2) 给出对应方案——拖延用"5 分钟启动法"，中断用"番茄钟 + 通知隔离"；(3) 设置 14 天最小行动计划，每天打勾。PathAgent 应在薄弱维度补救路径中插入这个 14 天训练节点。',
      },
    ],
    agentHint: 'ProfileAgent 自律力维度低于 50 时优先匹配；PathAgent 在自律力补救阶段插入 14 天最小行动节点。',
  },
  {
    id: 'kb-pedagogy-debug-methodology',
    source: 'local',
    domain: 'pedagogy',
    type: 'teaching-strategy',
    title: '系统化调试方法论 — 二分定位、最小复现、根因分析',
    tags: ['debug', 'debugging', 'binary-search', 'root-cause', 'minimum-reproduction', 'pedagogy', 'tutor', 'method'],
    summary: '调试是"假设—验证"的科学方法，不是"盯着代码看"的玄学；二分法是最强的定位武器。',
    chunks: [
      {
        id: 'kb-pedagogy-debug-methodology-ch1',
        text: '调试的核心是"科学方法"——观察现象 → 提出假设 → 设计验证 → 修改代码 → 重复。多数学生调试慢是因为跳过了"假设"直接改代码——改一行看看，不行再改一行，效率极低。专业调试员的第一动作不是动键盘，而是把现象写成"在 X 条件下执行 Y 操作，期望 Z 但得到 W"的一句话 bug 报告。',
      },
      {
        id: 'kb-pedagogy-debug-methodology-ch2',
        text: '二分法是定位 bug 的核武器。给定一段可疑代码（比如 100 行），不要逐行读；在中间插入断点/print，看是前半段错还是后半段错；定位到 50 行后，再在 25 行切；4-5 轮就能把 bug 范围缩到 5 行内。对 git bisect 同样适用：从已知好的 commit 出发，对当前 commit 做二分定位引入 bug 的具体提交，能在 O(log n) 步内找到。',
      },
      {
        id: 'kb-pedagogy-debug-methodology-ch3',
        text: '最小复现（Minimum Reproduction）是协作调试的基础。把"在我的环境能跑但生产挂了"缩减到 10 行代码、5 个变量的最小案例。最小复现有三个好处：(1) 排除无关因素的干扰；(2) 方便发给同事/Stack Overflow 求助；(3) 复现过程本身经常直接揭示根因——"为了让现象出现，必须去掉这行代码" = 这行代码就是 bug。',
      },
      {
        id: 'kb-pedagogy-debug-methodology-ch4',
        text: '根因分析（Root Cause Analysis）的 5-Why 方法：连续问"为什么"至少 5 次，直到找到系统性原因而不是表面症状。例：用户付款失败 → 因为支付接口超时 → 因为接口限流 → 因为流量突增未扩容 → 因为没有告警机制 → 因为监控体系缺位。第五层才到根因，前四层都是症状。诊断学生调试能力：给他一个 bug 让他口述 5-Why，停在症状层说明还需要训练系统性思维。',
      },
    ],
    agentHint: 'TutorAgent 在 debug-guide 模式优先匹配；ResourceAgent code 类型资源应包含最小复现训练；PathAgent 检测到调试相关弱点时插入。',
  },
]