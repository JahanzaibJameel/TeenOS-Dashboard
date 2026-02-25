import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
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
import GamificationService from '../services/GamificationService'
import { useAuthStore } from '../../auth/store/authStore'

interface GamificationState {
    userProfile: UserGamificationProfile | null
    achievements: Achievement[]
    userAchievements: UserAchievement[]
    badges: Badge[]
    userBadges: UserBadge[]
    rewards: Reward[]
    userRewards: UserReward[]
    leaderboard: LeaderboardEntry[]
    recentActivity: ActivityLog[]
    isLoading: boolean
    error: string | null
    filters: LeaderboardFilterOptions

    // Actions
    fetchUserProfile: () => Promise<void>
    fetchAchievements: () => Promise<void>
    fetchUserAchievements: () => Promise<void>
    fetchBadges: () => Promise<void>
    fetchUserBadges: () => Promise<void>
    fetchRewards: () => Promise<void>
    fetchUserRewards: () => Promise<void>
    fetchLeaderboard: (filters?: LeaderboardFilterOptions) => Promise<void>
    fetchRecentActivity: (limit?: number) => Promise<void>
    claimReward: (rewardId: string) => Promise<void>
    equipBadge: (badgeId: string) => Promise<void>
    unequipBadge: (badgeId: string) => Promise<void>
    setFilters: (filters: LeaderboardFilterOptions) => void
    setError: (error: string | null) => void
}

const gamificationService = GamificationService.getInstance()

export const useGamificationStore = create<GamificationState>()(
    persist(
        immer((set) => ({
            userProfile: null,
            achievements: [],
            userAchievements: [],
            badges: [],
            userBadges: [],
            rewards: [],
            userRewards: [],
            leaderboard: [],
            recentActivity: [],
            isLoading: false,
            error: null,
            filters: {},

            fetchUserProfile: async () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const profile = await gamificationService.getUserProfile(userId)
                    set({ userProfile: profile, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch user profile', isLoading: false })
                    throw error
                }
            },

            fetchAchievements: async () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const achievements = await gamificationService.getAchievements(userId)
                    set({ achievements, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch achievements', isLoading: false })
                    throw error
                }
            },

            fetchUserAchievements: async () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const userAchievements = await gamificationService.getUserAchievements(userId)
                    set({ userAchievements, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch user achievements', isLoading: false })
                    throw error
                }
            },

            fetchBadges: async () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const badges = await gamificationService.getBadges(userId)
                    set({ badges, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch badges', isLoading: false })
                    throw error
                }
            },

            fetchUserBadges: async () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const userBadges = await gamificationService.getUserBadges(userId)
                    set({ userBadges, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch user badges', isLoading: false })
                    throw error
                }
            },

            fetchRewards: async () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const rewards = await gamificationService.getRewards(userId)
                    set({ rewards, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch rewards', isLoading: false })
                    throw error
                }
            },

            fetchUserRewards: async () => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const userRewards = await gamificationService.getUserRewards(userId)
                    set({ userRewards, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch user rewards', isLoading: false })
                    throw error
                }
            },

            fetchLeaderboard: async (filters) => {
                set({ isLoading: true, error: null })

                try {
                    const leaderboard = await gamificationService.getLeaderboard(filters)
                    set({
                        leaderboard,
                        isLoading: false,
                        filters: filters || {}
                    })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch leaderboard', isLoading: false })
                    throw error
                }
            },

            fetchRecentActivity: async (limit = 10) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const activity = await gamificationService.getRecentActivity(userId, limit)
                    set({ recentActivity: activity, isLoading: false })
                } catch (error: any) {
                    set({ error: error.message || 'Failed to fetch recent activity', isLoading: false })
                    throw error
                }
            },

            claimReward: async (rewardId) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const userReward = await gamificationService.claimReward(userId, rewardId)
                    // Update the stores
                    set(state => ({
                        userRewards: [...state.userRewards, userReward],
                        rewards: state.rewards.map(r =>
                            r.id === rewardId ? { ...r, claimedCount: r.claimedCount + 1 } : r
                        ),
                        isLoading: false
                    }))
                } catch (error: any) {
                    set({ error: error.message || 'Failed to claim reward', isLoading: false })
                    throw error
                }
            },

            equipBadge: async (badgeId) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    const userBadge = await gamificationService.equipBadge(userId, badgeId)
                    // Update the stores
                    set(state => ({
                        userBadges: state.userBadges.map(b =>
                            b.badgeId === badgeId ? { ...b, isEquipped: true } :
                                b.isEquipped ? { ...b, isEquipped: false } : b
                        ).concat([userBadge]),
                        isLoading: false
                    }))
                } catch (error: any) {
                    set({ error: error.message || 'Failed to equip badge', isLoading: false })
                    throw error
                }
            },

            unequipBadge: async (badgeId) => {
                const userId = useAuthStore.getState().user?.id
                if (!userId) {
                    set({ error: 'User not authenticated' })
                    return
                }

                set({ isLoading: true, error: null })

                try {
                    // const userBadge = await gamificationService.unequipBadge(userId, badgeId)
                    // Update the stores
                    set(state => ({
                        userBadges: state.userBadges.map(b =>
                            b.badgeId === badgeId ? { ...b, isEquipped: false } : b
                        ),
                        isLoading: false
                    }))
                } catch (error: any) {
                    set({ error: error.message || 'Failed to unequip badge', isLoading: false })
                    throw error
                }
            },

            setFilters: (filters) => {
                set({ filters })
            },

            setError: (error) => {
                set({ error })
            }
        })),
        {
            name: 'gamification-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)