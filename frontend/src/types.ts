export type RAGCategory = 
  | 'medical'
  | 'food_water'
  | 'shelter'
  | 'security'
  | 'tools'
  | 'navigation'
  | 'communication'
  | 'psychology'
  | null

export interface QueryResponse {
  answer: string
  category?: RAGCategory
  triggers?: CrossRAGTrigger[]
}

export interface CrossRAGTrigger {
  source: RAGCategory
  target: RAGCategory
  reason: string
  priority: 'low' | 'serious' | 'critical'
}

export interface SectionData {
  title: string
  content: string
  isDanger?: boolean
  isWarning?: boolean
}

