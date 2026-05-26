import type { LearningPath } from '../types'

export const learningPaths: LearningPath[] = [
  {
    id: 'ai-engineer',
    name: 'AI工程师快车道',
    description: '从Python编程基础出发，系统掌握概率统计、人工智能导论、机器学习、深度学习、自然语言处理、计算机视觉与强化学习，成为全能AI工程师。',
    targetRole: 'AI工程师',
    courseSequence: [2, 15, 16, 17, 18, 19, 20, 21],
    estimatedWeeks: 24,
  },
  {
    id: 'fullstack',
    name: '全栈开发者路线',
    description: '从Python入门到Java面向对象，再到数据库、网络、软件工程与大数据，打造全栈开发能力。',
    targetRole: '全栈开发者',
    courseSequence: [2, 3, 11, 10, 12, 24],
    estimatedWeeks: 20,
  },
  {
    id: 'systems-eng',
    name: '系统工程师路线',
    description: '从C语言底层编程出发，深入C++面向对象、数据结构、计算机组成原理、操作系统与编译原理，构建扎实的系统工程能力。',
    targetRole: '系统工程师',
    courseSequence: [1, 4, 5, 8, 9, 7],
    estimatedWeeks: 22,
  },
  {
    id: 'data-scientist',
    name: '数据科学家路线',
    description: '从Python编程与概率统计起步，掌握数据库系统、机器学习、大数据云计算与信息安全，成为数据驱动决策专家。',
    targetRole: '数据科学家',
    courseSequence: [2, 15, 11, 17, 24, 23],
    estimatedWeeks: 20,
  },
]
