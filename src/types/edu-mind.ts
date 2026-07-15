export type ResourceCategory = '全部' | '文档' | '思维导图' | '流程图' | '习题' | '视频' | '代码'

export type Difficulty = '全部难度' | '初级' | '中级' | '高级'

export interface Slide {
  title: string
  subtitle?: string
  content: string
  icon?: string
  image?: string
  keyPoints?: string[]
  example?: string
  tip?: string
}

export interface Resource {
  id: string
  title: string
  description: string
  category: ResourceCategory
  tags: string[]
  date: string
  views: number
  starred: boolean
  featured?: boolean
  difficulty: Difficulty
  author: string
  rating?: number
  estimatedTime?: string
  contentMarkdown?: string
  slides?: Slide[]
  color?: string
  domain?: string
  topic?: string
  stage?: string
  sourceType?: 'doc' | 'video' | 'exercise' | 'code'
  bilibiliBvid?: string
  bilibiliQuery?: string
}

export interface Recommendation {
  id: string
  title: string
  category: ResourceCategory
  views: number
  starred: boolean
  iconType: string
}

export interface CollectionItem {
  id: string
  title: string
  category: ResourceCategory
  date: string
}
