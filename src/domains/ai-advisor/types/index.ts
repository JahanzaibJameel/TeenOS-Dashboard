export interface WeeklySuggestion {
  id: string
  userId: string
  week: Date
  title: string
  description: string
  category: 'goals' | 'habits' | 'skills' | 'productivity' | 'wellness'
  priority: 'low' | 'medium' | 'high' | 'critical'
  recommendation: string
  supportingData?: any
  createdAt: Date
  updatedAt: Date
}

export interface ProductivityInsight {
  id: string
  userId: string
  period: Date
  insightType: 'pattern' | 'trend' | 'anomaly' | 'comparison'
  title: string
  description: string
  data: {
    metric: string
    currentValue: number
    previousValue?: number
    trend: 'improving' | 'declining' | 'stable'
    significance: 'low' | 'moderate' | 'high'
  }
  recommendations: string[]
  createdAt: Date
}

export interface AdvisorConfig {
  userId: string
  enabled: boolean
  weeklySuggestionEnabled: boolean
  productivityInsightsEnabled: boolean
  notificationFrequency: 'daily' | 'weekly' | 'biweekly' | 'monthly'
  preferredCategories: ('goals' | 'habits' | 'skills' | 'productivity' | 'wellness')[]
  dataCollectionLevel: 'minimal' | 'standard' | 'comprehensive'
}

export interface AdvisorFeedback {
  id: string
  suggestionId?: string
  insightId?: string
  feedbackType: 'positive' | 'negative' | 'neutral' | 'suggestion' | 'report'
  comment?: string
  rating?: number // 1-5 scale
  createdAt: Date
}