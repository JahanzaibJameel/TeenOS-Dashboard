import { AdvisorEngine } from '../core/AdvisorEngine'
import { 
  WeeklySuggestion, 
  ProductivityInsight, 
  AdvisorConfig, 
  AdvisorFeedback 
} from '../types'
import { useGoalsStore } from '../../goals/store/goalsStore'
import { useHabitsStore } from '../../habits/store/habitsStore'
import { useSkillsStore } from '../../skills/store/skillsStore'

export class RuleBasedAdvisor implements AdvisorEngine {
  private static instance: RuleBasedAdvisor
  private configMap: Map<string, AdvisorConfig> = new Map()
  private feedbackMap: Map<string, AdvisorFeedback[]> = new Map()

  private constructor() {}

  public static getInstance(): RuleBasedAdvisor {
    if (!RuleBasedAdvisor.instance) {
      RuleBasedAdvisor.instance = new RuleBasedAdvisor()
    }
    return RuleBasedAdvisor.instance
  }

  async getWeeklySuggestion(userId: string): Promise<WeeklySuggestion[]> {
    // Fetch user data from stores
    const goalsStore = useGoalsStore.getState()
    const habitsStore = useHabitsStore.getState()
    const skillsStore = useSkillsStore.getState()

    const suggestions: WeeklySuggestion[] = []

    // Suggest goals to focus on based on due dates and progress
    const urgentGoals = goalsStore.goals
      .filter(g => g.status === 'in_progress' && g.dueDate && new Date(g.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
      .slice(0, 2)

    for (const goal of urgentGoals) {
      suggestions.push({
        id: `suggestion-${Date.now()}-${Math.random()}`,
        userId,
        week: new Date(),
        title: `Focus on "${goal.title}"`,
        description: `This goal is due soon and needs attention. Current progress: ${goal.progressPercentage}%`,
        category: 'goals',
        priority: goal.priority === 'urgent' ? 'critical' : 'high',
        recommendation: `Allocate dedicated time this week to work on "${goal.title}". Consider breaking it down into smaller tasks.`,
        supportingData: { goalId: goal.id, progress: goal.progressPercentage },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // Suggest habits to improve based on completion rate
    const lowCompletionHabits = habitsStore.habits
      .filter(h => h.completionRate < 70 && h.status === 'active')
      .sort((a, b) => a.completionRate - b.completionRate)
      .slice(0, 2)

    for (const habit of lowCompletionHabits) {
      suggestions.push({
        id: `suggestion-${Date.now()}-${Math.random()}`,
        userId,
        week: new Date(),
        title: `Improve "${habit.name}" habit`,
        description: `Your completion rate for this habit is ${habit.completionRate.toFixed(1)}%. Consider adjusting your approach.`,
        category: 'habits',
        priority: habit.priority === 'urgent' ? 'critical' : 'medium',
        recommendation: `Reflect on what's preventing you from completing this habit. Try setting a specific reminder time or linking it to an existing routine.`,
        supportingData: { habitId: habit.id, completionRate: habit.completionRate },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    // Suggest skills to practice based on inactivity
    const inactiveSkills = skillsStore.skills
      .filter(s => s.lastPracticed && 
        new Date().getTime() - new Date(s.lastPracticed).getTime() > 7 * 24 * 60 * 60 * 1000 && // More than 7 days
        s.level !== 'expert'
      )
      .slice(0, 2)

    for (const skill of inactiveSkills) {
      suggestions.push({
        id: `suggestion-${Date.now()}-${Math.random()}`,
        userId,
        week: new Date(),
        title: `Practice "${skill.name}" skill`,
        description: `It's been a while since you practiced this skill. Consistent practice helps maintain and improve abilities.`,
        category: 'skills',
        priority: 'medium',
        recommendation: `Dedicate at least 15-30 minutes this week to practicing "${skill.name}". Even short sessions can make a difference.`,
        supportingData: { skillId: skill.id, lastPracticed: skill.lastPracticed },
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }

    return suggestions
  }

  async getProductivityInsights(userId: string): Promise<ProductivityInsight[]> {
    const goalsStore = useGoalsStore.getState()
    const habitsStore = useHabitsStore.getState()
    const skillsStore = useSkillsStore.getState()

    const insights: ProductivityInsight[] = []

    // Insight about goal completion trends
    const completedGoalsThisWeek = goalsStore.goals.filter(g => 
      g.status === 'completed' && 
      g.completedDate && 
      new Date(g.completedDate).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length

    const completedGoalsLastWeek = goalsStore.goals.filter(g => 
      g.status === 'completed' && 
      g.completedDate && 
      new Date(g.completedDate).getTime() > Date.now() - 14 * 24 * 60 * 60 * 1000 &&
      new Date(g.completedDate).getTime() < Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length

    if (completedGoalsThisWeek !== completedGoalsLastWeek) {
      const trend = completedGoalsThisWeek > completedGoalsLastWeek ? 'improving' : 'declining'
      insights.push({
        id: `insight-${Date.now()}-${Math.random()}`,
        userId,
        period: new Date(),
        insightType: 'trend',
        title: 'Goal Completion Trend',
        description: `You completed ${completedGoalsThisWeek} goals this week compared to ${completedGoalsLastWeek} last week.`,
        data: {
          metric: 'goal_completion',
          currentValue: completedGoalsThisWeek,
          previousValue: completedGoalsLastWeek,
          trend,
          significance: 'moderate'
        },
        recommendations: [
          `Keep up the momentum!`,
          `Consider setting more challenging goals if you're consistently exceeding expectations.`
        ],
        createdAt: new Date()
      })
    }

    // Insight about habit consistency
    const avgCompletionRate = habitsStore.habits.length > 0 
      ? habitsStore.habits.reduce((sum, h) => sum + h.completionRate, 0) / habitsStore.habits.length
      : 0

    if (avgCompletionRate < 70) {
      insights.push({
        id: `insight-${Date.now()}-${Math.random()}`,
        userId,
        period: new Date(),
        insightType: 'pattern',
        title: 'Habit Consistency',
        description: `Your average habit completion rate is ${avgCompletionRate.toFixed(1)}%, which is below the recommended threshold.`,
        data: {
          metric: 'habit_consistency',
          currentValue: avgCompletionRate,
          trend: 'stable',
          significance: 'high'
        },
        recommendations: [
          `Focus on fewer habits at a time to increase your success rate.`,
          `Review your habit list and consider pausing low-priority habits temporarily.`
        ],
        createdAt: new Date()
      })
    }

    // Insight about skill development
    const recentlyPracticedSkills = skillsStore.skills.filter(s => 
      s.lastPracticed && 
      new Date().getTime() - new Date(s.lastPracticed).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length

    if (recentlyPracticedSkills === 0) {
      insights.push({
        id: `insight-${Date.now()}-${Math.random()}`,
        userId,
        period: new Date(),
        insightType: 'anomaly',
        title: 'Skill Development Gap',
        description: `You haven't practiced any skills in the past week.`,
        data: {
          metric: 'skill_practice_frequency',
          currentValue: 0,
          trend: 'declining',
          significance: 'high'
        },
        recommendations: [
          `Schedule time this week to practice at least one skill.`,
          `Consider setting up a regular practice routine to maintain consistency.`
        ],
        createdAt: new Date()
      })
    }

    return insights
  }

  async getConfig(userId: string): Promise<AdvisorConfig> {
    if (!this.configMap.has(userId)) {
      // Return default config
      return {
        userId,
        enabled: true,
        weeklySuggestionEnabled: true,
        productivityInsightsEnabled: true,
        notificationFrequency: 'weekly',
        preferredCategories: ['goals', 'habits', 'skills'],
        dataCollectionLevel: 'standard'
      }
    }
    return this.configMap.get(userId)!
  }

  async updateConfig(userId: string, config: Partial<AdvisorConfig>): Promise<AdvisorConfig> {
    const currentConfig = await this.getConfig(userId)
    const updatedConfig = { ...currentConfig, ...config }
    this.configMap.set(userId, updatedConfig)
    return updatedConfig
  }

  async submitFeedback(userId: string, feedback: Omit<AdvisorFeedback, 'id' | 'createdAt'>): Promise<AdvisorFeedback> {
    const newFeedback: AdvisorFeedback = {
      ...feedback,
      id: `feedback-${Date.now()}-${Math.random()}`,
      createdAt: new Date()
    }

    if (!this.feedbackMap.has(userId)) {
      this.feedbackMap.set(userId, [])
    }

    const userFeedback = this.feedbackMap.get(userId)!
    userFeedback.push(newFeedback)

    return newFeedback
  }

  async initializeUser(userId: string): Promise<void> {
    // Initialize default config for user
    const defaultConfig: AdvisorConfig = {
      userId,
      enabled: true,
      weeklySuggestionEnabled: true,
      productivityInsightsEnabled: true,
      notificationFrequency: 'weekly',
      preferredCategories: ['goals', 'habits', 'skills'],
      dataCollectionLevel: 'standard'
    }
    
    this.configMap.set(userId, defaultConfig)
  }

  async processActivity(userId: string, activity: any): Promise<void> {
    // In a real implementation, this would analyze user activity and potentially trigger insights
    // For now, we'll just log the activity for demonstration purposes
    console.log(`Processing activity for user ${userId}:`, activity)
    
    // Future enhancement: Analyze activity patterns and adjust suggestions accordingly
  }
}