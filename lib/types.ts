export interface Company {
  id: string
  name: string
  description: string
  website: string
  industry: string
  stage: 'Seed' | 'Series A' | 'Series B' | 'Late Stage'
  funding: number
  signals: 'High' | 'Medium' | 'Low'
  founders: string[]
  employees: number
  yearFounded: number
}

export interface EnrichedCompany extends Company {
  summary: string
  whatTheyDo: string
  keywords: string[]
  signals: {
    type: string
    confidence: number
    timestamp: string
  }[]
  sources: {
    url: string
    title: string
    timestamp: string
  }[]
}

export interface SavedList {
  id: string
  name: string
  description: string
  companies: string[]
  createdAt: string
  updatedAt: string
}

export interface SavedSearch {
  id: string
  name: string
  filters: {
    stage?: string[]
    industry?: string[]
    signals?: string[]
    fundingMin?: number
    fundingMax?: number
  }
  createdAt: string
}
