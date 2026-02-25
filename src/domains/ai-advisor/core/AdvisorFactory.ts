import { AdvisorEngine } from './AdvisorEngine'
import { RuleBasedAdvisor } from '../implementations/RuleBasedAdvisor'
import { MLAdvisor } from '../implementations/MLAdvisor'

export enum AdvisorType {
  RULE_BASED = 'rule_based',
  ML_BASED = 'ml_based'
}

export class AdvisorFactory {
  private static advisors: Map<string, AdvisorEngine> = new Map()

  /**
   * Get or create an advisor instance for a user
   * @param userId The user ID
   * @param advisorType The type of advisor to use
   * @returns An AdvisorEngine instance
   */
  static getAdvisor(userId: string, advisorType: AdvisorType = AdvisorType.RULE_BASED): AdvisorEngine {
    const key = `${userId}_${advisorType}`
    
    if (!this.advisors.has(key)) {
      let advisor: AdvisorEngine
      
      switch (advisorType) {
        case AdvisorType.ML_BASED:
          // For ML advisor, we'll use the placeholder that falls back to RuleBasedAdvisor
          const ruleBasedAdvisor = RuleBasedAdvisor.getInstance()
          advisor = MLAdvisor.getInstance(ruleBasedAdvisor)
          break
        case AdvisorType.RULE_BASED:
        default:
          advisor = RuleBasedAdvisor.getInstance()
          break
      }
      
      // Initialize the advisor for the user if needed
      advisor.initializeUser(userId).catch(error => {
        console.error(`Failed to initialize advisor for user ${userId}:`, error)
      })
      
      this.advisors.set(key, advisor)
    }
    
    return this.advisors.get(key)!
  }

  /**
   * Set a specific advisor instance for a user
   * @param userId The user ID
   * @param advisor The advisor instance to use
   */
  static setAdvisor(userId: string, advisor: AdvisorEngine): void {
    const key = `${userId}_${AdvisorType.RULE_BASED}` // Use a generic key for custom advisors
    this.advisors.set(key, advisor)
  }

  /**
   * Get the current advisor type for a user
   * @param userId The user ID
   * @returns The current advisor type
   */
  static getAdvisorType(userId: string): AdvisorType | null {
    for (const [key] of this.advisors.entries()) {
      if (key.startsWith(`${userId}_`)) {
        if (key.endsWith(AdvisorType.RULE_BASED)) {
          return AdvisorType.RULE_BASED
        } else if (key.endsWith(AdvisorType.ML_BASED)) {
          return AdvisorType.ML_BASED
        }
      }
    }
    return null
  }

  /**
   * Switch advisor type for a user
   * @param userId The user ID
   * @param newType The new advisor type to use
   */
  static switchAdvisor(userId: string, newType: AdvisorType): void {
    // Remove the old advisor
    for (const key of this.advisors.keys()) {
      if (key.startsWith(`${userId}_`)) {
        this.advisors.delete(key)
      }
    }
    
    // Create and store the new advisor
    this.getAdvisor(userId, newType)
  }

  /**
   * Clear all advisors (useful for testing or cleanup)
   */
  static clearAdvisors(): void {
    this.advisors.clear()
  }
}