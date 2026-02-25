import { 
  UserGamificationProfile, 
  Achievement, 
  UserAchievement, 
  Badge, 
  UserBadge, 
  Reward, 
  UserReward, 
  LeaderboardEntry, 
  LeaderboardFilterOptions,
  ActivityLog
} from '../types'
import { authInterceptor } from '../../auth/utils/authInterceptor'

class GamificationService {
  private static instance: GamificationService
  private baseUrl: string

  private constructor() {
    // Simple fallback approach that works in both environments
    this.baseUrl = '/api'; // Default fallback
  }

  public static getInstance(): GamificationService {
    if (!GamificationService.instance) {
      GamificationService.instance = new GamificationService()
    }
    return GamificationService.instance
  }

  async getUserProfile(userId: string): Promise<UserGamificationProfile> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/profile`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return a mock profile for testing
      return {
        id: `profile-${Date.now()}`,
        userId,
        level: 1,
        xp: 0,
        totalXp: 0,
        points: 0,
        badges: [],
        achievements: [],
        currentStreak: 0,
        longestStreak: 0,
        dailyLoginStreak: 0,
        weeklyChallengeCompletions: 0,
        monthlyChallengeCompletions: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    }
  }

  async getAchievements(userId: string): Promise<Achievement[]> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/achievements`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/user-achievements`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async getBadges(userId: string): Promise<Badge[]> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/badges`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async getUserBadges(userId: string): Promise<UserBadge[]> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/user-badges`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async getRewards(userId: string): Promise<Reward[]> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/rewards`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async getUserRewards(userId: string): Promise<UserReward[]> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/user-rewards`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async getLeaderboard(filters?: LeaderboardFilterOptions): Promise<LeaderboardEntry[]> {
    const params = new URLSearchParams()
    if (filters?.timePeriod) params.append('timePeriod', filters.timePeriod)
    if (filters?.category) params.append('category', filters.category)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())

    const queryString = params.toString()
    const url = `${this.baseUrl}/gamification/leaderboard${queryString ? `?${queryString}` : ''}`

    const response = await authInterceptor.authenticatedFetch(url)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async getRecentActivity(userId: string, limit: number = 10): Promise<ActivityLog[]> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/activity?limit=${limit}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return empty array for testing
      return [];
    }
  }

  async claimReward(userId: string, rewardId: string): Promise<UserReward> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/rewards/${rewardId}/claim`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return a mock reward for testing
      return {
        id: `user-reward-${Date.now()}`,
        userId,
        rewardId,
        reward: {} as Reward, // Mock reward object
        claimedDate: new Date(),
        isRedeemed: true,
        createdAt: new Date()
      };
    }
  }

  async equipBadge(userId: string, badgeId: string): Promise<UserBadge> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/badges/${badgeId}/equip`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return a mock user badge for testing
      return {
        id: `user-badge-${Date.now()}`,
        userId,
        badgeId,
        badge: {} as Badge, // Mock badge object
        earnedDate: new Date(),
        isEquipped: true,
        createdAt: new Date()
      };
    }
  }

  async unequipBadge(userId: string, badgeId: string): Promise<UserBadge> {
    const response = await authInterceptor.authenticatedFetch(`${this.baseUrl}/users/${userId}/gamification/badges/${badgeId}/unequip`, {
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      // Return a mock user badge for testing
      return {
        id: `user-badge-${Date.now()}`,
        userId,
        badgeId,
        badge: {} as Badge, // Mock badge object
        earnedDate: new Date(),
        isEquipped: false,
        createdAt: new Date()
      };
    }
  }

  async calculateLevel(xp: number): Promise<number> {
    // Simple level calculation: each level requires 100 more XP than the previous
    // Level 1: 0 XP, Level 2: 100 XP, Level 3: 300 XP, Level 4: 600 XP, etc.
    let level = 1;
    let xpNeeded = 100;
    let totalXpRequired = 0;
    
    while (xp >= totalXpRequired + xpNeeded) {
      totalXpRequired += xpNeeded;
      level++;
      xpNeeded = 100 * level; // Increase XP requirement per level
    }
    
    return level;
  }

  async getXpToNextLevel(currentXp: number): Promise<number> {
    const currentLevel = await this.calculateLevel(currentXp);
    const xpForNextLevel = this.getXpForLevel(currentLevel + 1);
    
    return xpForNextLevel - currentXp;
  }

  private getXpForLevel(level: number): number {
    // Calculate total XP needed to reach a specific level
    let totalXp = 0;
    for (let i = 1; i < level; i++) {
      totalXp += 100 * i;
    }
    return totalXp;
  }
}

export default GamificationService