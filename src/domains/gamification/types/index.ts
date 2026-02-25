export enum AchievementType {
  MILESTONE = 'milestone',
  STREAK = 'streak',
  COMPLETION = 'completion',
  PARTICIPATION = 'participation',
  SOCIAL = 'social',
  MASTERY = 'mastery'
}

export enum BadgeTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

export enum RewardType {
  BADGE = 'badge',
  POINTS = 'points',
  DISCOUNT = 'discount',
  FEATURE = 'feature',
  PHYSICAL = 'physical'
}

export interface UserGamificationProfile {
  id: string
  userId: string
  level: number
  xp: number
  totalXp: number
  points: number
  badges: UserBadge[]
  achievements: UserAchievement[]
  currentStreak: number
  longestStreak: number
  dailyLoginStreak: number
  weeklyChallengeCompletions: number
  monthlyChallengeCompletions: number
  createdAt: Date
  updatedAt: Date
}

export interface Achievement {
  id: string
  name: string
  description: string
  type: AchievementType
  badgeTier?: BadgeTier
  pointsReward: number
  xpReward: number
  requirements: AchievementRequirement[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AchievementRequirement {
  id: string
  type: 'completed_goals' | 'completed_habits' | 'completed_skills' | 'login_days' | 'consecutive_login_days' | 'social_shares' | 'helped_others'
  targetValue: number
  currentValue: number
  description: string
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  achievement: Achievement
  earnedDate: Date
  isUnlocked: boolean
  progress: number
  createdAt: Date
}

export interface Badge {
  id: string
  name: string
  description: string
  tier: BadgeTier
  icon: string
  requirements: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserBadge {
  id: string
  userId: string
  badgeId: string
  badge: Badge
  earnedDate: Date
  isEquipped: boolean
  createdAt: Date
}

export interface Reward {
  id: string
  name: string
  description: string
  type: RewardType
  value: number | string // Could be discount percentage, feature name, physical item, etc.
  cost: number // Cost in points to redeem
  isActive: boolean
  quantity: number // Number of times available
  claimedCount: number
  createdAt: Date
  updatedAt: Date
}

export interface UserReward {
  id: string
  userId: string
  rewardId: string
  reward: Reward
  claimedDate: Date
  isRedeemed: boolean
  redemptionDetails?: string
  createdAt: Date
}

export interface LeaderboardEntry {
  id: string
  userId: string
  username: string
  level: number
  xp: number
  points: number
  rank: number
  lastUpdated: Date
}

export interface LeaderboardFilterOptions {
  timePeriod?: 'daily' | 'weekly' | 'monthly' | 'all_time'
  category?: 'overall' | 'goals' | 'habits' | 'skills'
  limit?: number
  offset?: number
}

export interface ActivityLog {
  id: string
  userId: string
  activityType: string
  description: string
  xpGained: number
  pointsGained: number
  badgesEarned: string[]
  timestamp: Date
  metadata: Record<string, any>
}