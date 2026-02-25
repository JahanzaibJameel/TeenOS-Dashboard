import { WeeklySuggestion, ProductivityInsight, AdvisorConfig, AdvisorFeedback } from '../types'

export interface AdvisorEngine {
  /**
   * Get personalized weekly suggestions for the user
   */
  getWeeklySuggestion(userId: string): Promise<WeeklySuggestion[]>

  /**
   * Get productivity insights based on user's activity and progress
   */
  getProductivityInsights(userId: string): Promise<ProductivityInsight[]>

  /**
   * Get advisor configuration for the user
   */
  getConfig(userId: string): Promise<AdvisorConfig>

  /**
   * Update advisor configuration for the user
   */
  updateConfig(userId: string, config: Partial<AdvisorConfig>): Promise<AdvisorConfig>

  /**
   * Submit feedback on a suggestion or insight
   */
  submitFeedback(userId: string, feedback: Omit<AdvisorFeedback, 'id' | 'createdAt'>): Promise<AdvisorFeedback>

  /**
   * Initialize the advisor for a user
   */
  initializeUser(userId: string): Promise<void>

  /**
   * Process user activity and generate insights
   */
  processActivity(userId: string, activity: any): Promise<void>
}