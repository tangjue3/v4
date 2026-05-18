import http from 'node:http'
import { URL } from 'node:url'
import {
  analyzeProfile,
  buildChatReply,
  buildTutoringReply,
  getChatHistory,
  getEvaluationPayload,
  getLearningPathPayload,
  getLatestProfileResult,
  getRecommendedResources,
  getResources,
  getTutoringHistory,
  getTutoringTopics,
  saveChatHistoryEntry,
  saveProfileResult,
  saveTutoringHistoryEntry,
} from './data.js'
import { callAgent, getAgentStatus, listAgents } from './agents.js'
import { chatCompletion, chatCompletionJson, getLlmInfo } from './llm.js'

const PORT = Number(process.env.PORT || 8787)
const MAX_BODY_SIZE = 1024 * 1024
const DEFAULT_COURSE = '机器学习导论'

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  })
  res.end(JSON.stringify(payload))
}

function notFound(res) {
  sendJson(res, 404, { error: 'Not Found' })
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0

    req.on('data', chunk => {
      size += chunk.length
      if (size > MAX_BODY_SIZE) {
        const error = new Error('Payload too large')
        error.statusCode = 413
        req.destroy(error)
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        error.statusCode = 400
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function listResources(searchParams) {
  const type = searchParams.get('type')
  const q = (searchParams.get('q') || '').trim().toLowerCase()
  const resources = getResources()

  return resources.filter(item => {
    if (type && type !== 'all' && item.type !== type) {
      return false
    }
    if (!q) {
      return true
    }
    return item.title.toLowerCase().includes(q) || item.tags.some(tag => tag.toLowerCase().includes(q))
  })
}

function getStudentProfileText() {
  const profile = getLatestProfileResult()
  if (!profile) return '暂无学习画像'
  const dims = (profile.dimensions || []).map(d => `${d.label}:${d.value}`).join('，')
  return `综合评分:${profile.totalScore}，${dims}`
}

function fallbackQuestionBank(body) {
  const topic = body.target_topic || '核心知识点'
  const count = Math.max(1, Math.min(Number(body.question_count || 5), 8))
  return {
    title: `${topic} 练习题`,
    course_name: body.course_name || DEFAULT_COURSE,
    target_topic: topic,
    summary: '当前为本地降级题库结果，用于在 agent 不可用时保持页面可用。',
    questions: Array.from({ length: count }, (_, index) => ({
      id: `fallback-q-${index + 1}`,
      type: 'single_choice',
      difficulty: index < 2 ? 'easy' : index < 5 ? 'medium' : 'hard',
      knowledge_point: topic,
      stem: `${topic} 的第 ${index + 1} 题示例，以下哪项描述更合理？`,
      options: ['选项 A', '选项 B', '选项 C', '选项 D'],
      answer: '选项 A',
      analysis: `这是一道用于降级兜底的 ${topic} 示例题，方便前端继续联调。`,
      mistake_alert: '注意区分概念定义、适用场景和实现细节。',
    })),
  }
}

function fallbackPptResult(body) {
  const topic = body.target_topic || '课程主题'
  return {
    ppt_title: `${topic} 教学讲义`,
    slide_count: 10,
    file_path: `/mock/${encodeURIComponent(topic)}.pptx`,
    download_url: `/mock/${encodeURIComponent(topic)}.pptx`,
  }
}

function fallbackXmindResult(body) {
  const topic = body.target_topic || '课程主题'
  return {
    file_path: `/mock/${encodeURIComponent(topic)}.xmind`,
    download_url: `/mock/${encodeURIComponent(topic)}.xmind`,
  }
}

function fallbackContentCheck(body) {
  const original = String(body.original_content || '')
  return {
    title: '内容审核结果',
    content_type: body.content_type || '讲义',
    original_issues: original ? ['未检测到 agent，当前为本地降级审核结果。'] : ['原始内容为空，无法进行完整审核。'],
    corrected_content: original || '请补充待审核内容。',
    safety_score: 82,
    suggestions: [
      '补充更明确的知识定义和边界条件。',
      '增加一个最小示例帮助学生建立直觉。',
      '如果是课程讲义，建议补上常见误区提醒。',
    ],
  }
}

function fallbackKnowledgeSearch(body) {
  const question = body.question || '未提供问题'
  return {
    agent_result: `当前未接入知识检索 agent，以下是针对“${question}”的本地降级结果。`,
    results: [
      {
        content: `${question} 通常需要从定义、公式直觉和应用场景三个层次理解。`,
        source: 'local-fallback-note',
        score: 0.88,
      },
      {
        content: `建议进一步结合 ${body.course_name || DEFAULT_COURSE} 的课程上下文查看示例代码或图示。`,
        source: 'local-fallback-guide',
        score: 0.76,
      },
    ],
    used_llm: false,
  }
}

function fallbackOperationPlan(body) {
  const topic = body.target_topic || '课程主题'
  return {
    title: `${topic} 实操方案`,
    course_name: body.course_name || DEFAULT_COURSE,
    target_topic: topic,
    project_type: body.project_type || 'mini-project',
    implementation_steps: [
      `整理 ${topic} 的输入输出与评价目标。`,
      '先做一个最小可运行版本，再逐步补实验记录。',
      '最后补上结果分析和误差复盘。',
    ],
    code_framework: 'Python + Jupyter / scikit-learn',
    scoring_criteria: ['能否跑通', '结果是否可解释', '是否完成复盘'],
    common_errors: ['数据预处理遗漏', '指标选择不匹配', '只给结果不解释原因'],
  }
}

function fallbackResourcePlan(body) {
  const topic = body.target_knowledge_points || body.target_topic || '课程主题'
  return {
    result: `建议围绕 ${topic} 按“概念讲解 -> 代码示例 -> 练习巩固”的顺序安排资源。`,
    model: 'local-fallback',
    usage: {
      prompt_tokens: 0,
      completion_tokens: 0,
      total_tokens: 0,
    },
  }
}

function fallbackStudyRoute(body) {
  const topic = body.target_topic || '课程学习路径'
  return {
    title: `${topic} 学习路径`,
    course_name: body.course_name || DEFAULT_COURSE,
    target_topic: topic,
    phases: [
      { title: '基础理解', period: '第 1 周', tasks: ['建立概念地图', '完成基础阅读'] },
      { title: '代码实践', period: '第 2 周', tasks: ['跑通最小示例', '记录问题与现象'] },
      { title: '巩固提升', period: '第 3 周', tasks: ['做练习题', '补一轮复盘总结'] },
    ],
    weekly_goals: ['每周至少完成 2 次练习', '每周输出 1 次总结'],
  }
}

function fallbackEffectEvaluation(body) {
  const topic = body.target_topic || '课程效果评估'
  return {
    title: `${topic} 学习评估`,
    course_name: body.course_name || DEFAULT_COURSE,
    target_topic: topic,
    summary: '当前为本地降级评估结果，用于在 agent 不可用时维持页面与接口可用。',
    mastered_content: ['基础概念理解', '核心流程认知'],
    basic_or_partial_mastery: ['部分实现细节', '指标解释能力'],
    weak_content: ['复杂场景迁移', '错误复盘深度'],
    typical_issues: ['容易只记结论，不追溯原因', '练习数量不足时掌握不稳定'],
    knowledge_mastery: '整体掌握中等偏上，适合继续进入案例练习。',
    accuracy_analysis: '当前练习正确率具备基础，但稳定性仍需通过更多题目验证。',
    engagement_analysis: '学习投入稳定，建议增加主动总结环节。',
    resource_usage_analysis: '视频与练习结合效果较好，可适当增加文档阅读。',
    question_pattern_analysis: '概念题表现较好，综合应用题仍有提升空间。',
    trend_analysis: '整体趋势向上，但需要更连续的实战输出来稳固掌握。',
    profile_update: ['提升实践频率', '增加一次系统复盘'],
    route_adjustments: ['下阶段增加项目化练习', '把薄弱点拆成更小任务逐个击破'],
  }
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    notFound(res)
    return
  }

  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    })
    res.end()
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)
  const { pathname, searchParams } = url

  try {
    if (req.method === 'GET' && pathname === '/api/health') {
      sendJson(res, 200, { ok: true, llm: getLlmInfo() })
      return
    }

    if (req.method === 'GET' && pathname === '/api/llm/info') {
      sendJson(res, 200, getLlmInfo())
      return
    }

    if (req.method === 'GET' && pathname === '/api/agents/status') {
      const status = await getAgentStatus()
      sendJson(res, 200, { agents: status })
      return
    }

    if (req.method === 'GET' && pathname === '/api/agents/list') {
      sendJson(res, 200, { agents: listAgents() })
      return
    }

    if (req.method === 'POST' && pathname === '/api/profile/analyze') {
      const body = await readJson(req)

      const agentResult = await callAgent('study-profile', '/', {
        method: 'POST',
        body: {
          history_dialogue: JSON.stringify(body),
          source_type: 'survey',
          student_id: 'v4-user',
          baseInfo: {
            name: '学生',
            major: body.field || body.customField || '未填写',
            grade: body.level || '未填写',
            course: DEFAULT_COURSE,
            experience: body.experience || '未填写',
            motivation: body.motivation || '未填写',
            weeklyHours: body.weeklyHours || '未填写',
            learningPace: body.learningPace || '未填写',
            resourcePreference: body.resourcePreference || '未填写',
            bestTime: body.bestTime || '未填写',
          },
        },
      })

      if (agentResult.ok) {
        const profile = agentResult.data
        const result = analyzeProfile(body)
        if (profile && profile.student_profile) {
          result.agentProfile = profile.student_profile
          result.needFollowup = profile.need_followup || false
          result.followUpQuestions = profile.follow_up_questions || []
        }
        saveProfileResult(result)
        sendJson(res, 200, result)
        return
      }

      const result = analyzeProfile(body)
      saveProfileResult(result)
      sendJson(res, 200, result)
      return
    }

    if (req.method === 'GET' && pathname === '/api/profile/latest') {
      sendJson(res, 200, { result: getLatestProfileResult() })
      return
    }

    if (req.method === 'POST' && pathname === '/api/chat') {
      const body = await readJson(req)
      const message = String(body.message || '').trim()

      const agentResult = await callAgent('intelligent-tutor', '/generate', {
        method: 'POST',
        body: {
          student_profile: getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || message.slice(0, 30),
          student_question: message,
        },
      })

      if (agentResult.ok && agentResult.data && agentResult.data.result) {
        const reply = {
          content: agentResult.data.result,
          resources: [
            { type: 'doc', title: '算法原理速查', color: '#00d4ff' },
            { type: 'mindmap', title: '知识脉络图', color: '#7c3aed' },
            { type: 'exercise', title: '配套练习', color: '#06d6a0' },
          ],
          suggestions: ['用更简单的话解释', '给我一个代码示例', '顺便出 3 道练习题'],
        }
        saveChatHistoryEntry(message, reply)
        sendJson(res, 200, reply)
        return
      }

      const reply = buildChatReply(message)
      try {
        const llmResult = await chatCompletion([
          { role: 'system', content: `你是"${DEFAULT_COURSE}"课程的智能教学助手（Tutor Agent）。请用清晰、专业的方式回答学生关于机器学习算法原理（如梯度下降、逻辑回归、SVM核函数、PCA降维等）、Python编程实现、Scikit-learn/PyTorch使用等方面的问题，适当给出代码示例。你的角色是帮助学生理解算法背后的数学直觉和工程实践。` },
          { role: 'user', content: message },
        ], { maxTokens: 1500 })
        reply.content = llmResult.content
        reply.suggestions = ['用更简单的话解释', '给我一个代码示例', '顺便出 3 道练习题']
      } catch { /* keep mock reply */ }
      saveChatHistoryEntry(message, reply)
      sendJson(res, 200, reply)
      return
    }

    if (req.method === 'GET' && pathname === '/api/chat/history') {
      sendJson(res, 200, { items: getChatHistory() })
      return
    }

    if (req.method === 'POST' && pathname === '/api/tutoring/ask') {
      const body = await readJson(req)
      const question = String(body.question || '').trim() || '未提供问题'
      const mode = body.mode || 'qa'
      const scenario = body.scenario || 'preview'

      const agentResult = await callAgent('intelligent-tutor', '/generate', {
        method: 'POST',
        body: {
          student_profile: getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || question.slice(0, 30),
          student_question: question,
          expected_style: mode === 'explain' ? '概念精讲' : mode === 'solve' ? '解题助手' : '自由问答',
        },
      })

      if (agentResult.ok && agentResult.data && agentResult.data.result) {
        const reply = {
          answer: agentResult.data.result,
          time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        }
        saveTutoringHistoryEntry({ question, answer: reply.answer, mode, scenario })
        sendJson(res, 200, reply)
        return
      }

      const reply = buildTutoringReply(question, mode)
      try {
        const modePrompt = mode === 'explain' ? '请用概念精讲的方式，从定义、原理、例子三个层次详细解释' : mode === 'solve' ? '请作为解题助手，给出详细的解题步骤和思路' : '请用自由问答的方式回答'
        const llmResult = await chatCompletion([
          { role: 'system', content: `你是"${DEFAULT_COURSE}"课程的智能教学助手（Tutor Agent）。${modePrompt}。回答要聚焦机器学习算法原理（梯度下降、逻辑回归、SVM、PCA、神经网络等）、Python代码实现和Scikit-learn/PyTorch使用，适当给出代码示例。你的角色是帮助学生从数学直觉到工程实践全面掌握算法。` },
          { role: 'user', content: question },
        ], { maxTokens: 1500 })
        reply.answer = llmResult.content
        reply.time = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      } catch { /* keep mock reply */ }
      saveTutoringHistoryEntry({ question, answer: reply.answer, mode, scenario })
      sendJson(res, 200, reply)
      return
    }

    if (req.method === 'GET' && pathname === '/api/tutoring/history') {
      sendJson(res, 200, { items: getTutoringHistory() })
      return
    }

    if (req.method === 'GET' && pathname === '/api/tutoring/topics') {
      sendJson(res, 200, { topics: getTutoringTopics() })
      return
    }

    if (req.method === 'GET' && pathname === '/api/resources') {
      sendJson(res, 200, { items: listResources(searchParams) })
      return
    }

    if (req.method === 'GET' && pathname === '/api/resources/recommended') {
      sendJson(res, 200, { items: getRecommendedResources() })
      return
    }

    if (req.method === 'GET' && pathname === '/api/learning-path') {
      const agentResult = await callAgent('study-route-plan', '/generate-structured', {
        method: 'POST',
        body: {
          student_profile: getStudentProfileText(),
          course_name: DEFAULT_COURSE,
          target_topic: '机器学习导论课程学习路径',
          learning_objectives: '从Python基础到机器学习实战的系统化学习',
        },
      })

      if (agentResult.ok && agentResult.data && agentResult.data.study_route_plan) {
        const plan = agentResult.data.study_route_plan
        const phases = (plan.phases || []).map((phase, i) => ({
          title: phase.title || `阶段${i + 1}`,
          period: phase.period || `第 ${(i * 4) + 1}-${(i + 1) * 4} 周`,
          progress: 0,
          status: i === 0 ? 'active' : 'locked',
          color: ['#00d4ff', '#7c3aed', '#06d6a0', '#f59e0b'][i % 4],
          nodes: (phase.tasks || phase.topics || []).map(task => ({
            name: typeof task === 'string' ? task : task.name || task.title || '',
            progress: 0,
            duration: typeof task === 'string' ? '1 周' : task.duration || '1 周',
            resources: typeof task === 'string' ? 0 : task.resources || 0,
          })),
        }))
        const weeklyGoals = (plan.weekly_goals || []).map(goal => ({
          label: typeof goal === 'string' ? goal : goal.label || goal.title || '',
          progress: 0,
          target: typeof goal === 'string' ? '进行中' : goal.target || '进行中',
        }))
        sendJson(res, 200, { phases, weeklyGoals })
        return
      }

      sendJson(res, 200, getLearningPathPayload())
      return
    }

    if (req.method === 'POST' && pathname === '/api/learning-path/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('study-route-plan', '/generate-structured', {
        method: 'POST',
        body: {
          student_profile: body.student_profile || getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || '机器学习导论课程学习路径',
          learning_objectives: body.learning_objectives || '从Python基础到机器学习实战的系统化学习',
          weak_points: body.weak_points || '',
          available_resources: body.available_resources || '',
          available_time: body.available_time || '',
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '学习路径生成成功', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '学习路径生成降级返回', result: fallbackStudyRoute(body) })
      return
    }

    if (req.method === 'GET' && pathname === '/api/evaluation') {
      const agentResult = await callAgent('effect-evaluation', '/generate-structured', {
        method: 'POST',
        body: {
          student_profile: getStudentProfileText(),
          course_name: DEFAULT_COURSE,
          target_topic: '机器学习导论课程效果评估',
          practice_results: '基于当前学习进度的综合评估',
        },
      })

      if (agentResult.ok && agentResult.data && agentResult.data.effect_evaluation) {
        const evalData = agentResult.data.effect_evaluation
        const stats = [
          { label: '知识掌握度', value: evalData.knowledge_mastery ? '评估中' : '待评估', change: '+0%', icon: 'Brain', color: '#00d4ff' },
          { label: '学习投入', value: evalData.engagement_analysis ? '评估中' : '待评估', change: '+0%', icon: 'Zap', color: '#3b82f6' },
          { label: '薄弱项', value: String((evalData.weak_content || []).length), change: '项', icon: 'BarChart3', color: '#f59e0b' },
          { label: '进步趋势', value: evalData.trend_analysis ? '评估中' : '待评估', change: '+0%', icon: 'TrendingUp', color: '#06d6a0' },
        ]
        const suggestions = [
          ...(evalData.weak_content || []).map(item => ({ text: item, type: 'weakness' })),
          ...(evalData.mastered_content || []).slice(0, 1).map(item => ({ text: `${item} 掌握较好，可以继续深入。`, type: 'strength' })),
          ...(evalData.route_adjustments || []).map(item => ({ text: item, type: 'action' })),
        ]
        sendJson(res, 200, { generatedAt: new Date().toISOString().slice(0, 10), stats, suggestions })
        return
      }

      sendJson(res, 200, getEvaluationPayload())
      return
    }

    if (req.method === 'POST' && pathname === '/api/evaluation/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('effect-evaluation', '/generate-structured', {
        method: 'POST',
        body: {
          student_profile: body.student_profile || getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || '机器学习导论课程效果评估',
          practice_results: body.practice_results || '基于当前学习进度的综合评估',
          learning_behavior: body.learning_behavior || '',
          question_records: body.question_records || '',
          resource_usage: body.resource_usage || '',
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '学习效果评估生成成功', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '学习效果评估降级返回', result: fallbackEffectEvaluation(body) })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/question-generator/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('question-generator', '/generate-structured', {
        method: 'POST',
        body: {
          student_profile: body.student_profile || getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || '',
          resource_plan_result: body.resource_plan_result || '按学生当前水平生成习题',
          learning_objectives: body.learning_objectives || '',
          preferred_question_types: body.preferred_question_types || [],
          question_count: body.question_count || 8,
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '习题生成成功', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '习题生成降级返回', result: fallbackQuestionBank(body) })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/ppt-generator/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('ppt-generator', '/generate-file', {
        method: 'POST',
        body: {
          student_profile: body.student_profile || getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || '',
          resource_plan_result: body.resource_plan_result || '按学生当前水平生成讲义',
          learning_objectives: body.learning_objectives || '',
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: 'PPT生成成功', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: 'PPT生成降级返回', result: fallbackPptResult(body) })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/xmind-generator/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('xmind-generator', '/generate-file', {
        method: 'POST',
        body: {
          student_profile: body.student_profile || getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || '',
          resource_plan_result: body.resource_plan_result || '按学生当前水平生成思维导图',
          learning_objectives: body.learning_objectives || '',
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '思维导图生成成功', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '思维导图生成降级返回', result: fallbackXmindResult(body) })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/content-check/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('content-check', '/generate-structured', {
        method: 'POST',
        body: {
          content_type: body.content_type || '讲义',
          original_content: body.original_content || '',
          reference_basis: body.reference_basis || '',
          target_audience: body.target_audience || '',
          review_focus: body.review_focus || '',
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '内容审核完成', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '内容审核降级返回', result: fallbackContentCheck(body) })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/knowledge-search/query') {
      const body = await readJson(req)
      const agentResult = await callAgent('knowledge-search', '/agent/knowledge/query', {
        method: 'POST',
        body: {
          kb_id: body.kb_id || '',
          question: body.question || '',
          course_name: body.course_name || DEFAULT_COURSE,
          top_k: body.top_k || 5,
          use_llm: body.use_llm !== false,
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '知识检索完成', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '知识检索降级返回', result: fallbackKnowledgeSearch(body) })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/knowledge-search/upload') {
      const agentResult = await callAgent('knowledge-search', '/kb/upload', {
        method: 'POST',
        body: {},
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '知识库上传完成', result: agentResult.data })
        return
      }

      sendJson(res, agentResult.status || 502, { error: agentResult.error || '知识库上传失败' })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/operation-generator/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('operation-generator', '/generate-structured', {
        method: 'POST',
        body: {
          student_profile: body.student_profile || getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_topic: body.target_topic || '',
          resource_plan_result: body.resource_plan_result || '按学生当前水平生成实操方案',
          learning_objectives: body.learning_objectives || '',
          project_type: body.project_type || '',
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '实操方案生成成功', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '实操方案降级返回', result: fallbackOperationPlan(body) })
      return
    }

    if (req.method === 'POST' && pathname === '/api/agents/resource-planner/generate') {
      const body = await readJson(req)
      const agentResult = await callAgent('resource-planner', '/generate', {
        method: 'POST',
        body: {
          student_profile: body.student_profile || getStudentProfileText(),
          course_name: body.course_name || DEFAULT_COURSE,
          target_knowledge_points: body.target_knowledge_points || '',
          learning_objectives: body.learning_objectives || '',
        },
      })

      if (agentResult.ok) {
        sendJson(res, 200, { message: '资源策划生成成功', result: agentResult.data })
        return
      }

      sendJson(res, 200, { message: '资源策划降级返回', result: fallbackResourcePlan(body) })
      return
    }

    notFound(res)
  } catch (error) {
    const statusCode = error instanceof Error && 'statusCode' in error ? error.statusCode : 500
    sendJson(res, statusCode, {
      error: statusCode === 413 ? 'Payload Too Large' : statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

server.listen(PORT, () => {
  console.log(`AIRI-ML API server listening on http://localhost:${PORT}`)
  console.log(`Agent gateway enabled, host: ${process.env.AGENT_HOST || '127.0.0.1'}`)
  console.log(`Course: ${DEFAULT_COURSE} | 面向《机器学习导论》的个性化学习多智能体系统`)
})
