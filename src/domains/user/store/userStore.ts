import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { UserProfile, UserPreferences, UpdateProfileData, UpdatePreferencesData } from '../types'
import UserProfileService from '../services/UserProfileService'
import { useAuthStore } from '../../auth/store/authStore'

interface UserState {
  profile: UserProfile | null
  preferences: UserPreferences | null
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchProfile: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  fetchPreferences: () => Promise<void>
  updatePreferences: (data: UpdatePreferencesData) => Promise<void>
  uploadAvatar: (file: File) => Promise<void>
  setProfile: (profile: UserProfile | null) => void
  setPreferences: (preferences: UserPreferences | null) => void
  setError: (error: string | null) => void
}

const userProfileService = UserProfileService.getInstance()

export const useUserStore = create<UserState>()(
  persist(
    immer((set, get) => ({
      profile: null,
      preferences: null,
      isLoading: false,
      error: null,

      fetchProfile: async () => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const profile = await userProfileService.getProfile(userId)
          set({ profile, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch profile', isLoading: false })
          throw error
        }
      },

      updateProfile: async (data) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const profile = await userProfileService.updateProfile(userId, data)
          set({ profile, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to update profile', isLoading: false })
          throw error
        }
      },

      fetchPreferences: async () => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const preferences = await userProfileService.getPreferences(userId)
          set({ preferences, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch preferences', isLoading: false })
          throw error
        }
      },

      updatePreferences: async (data) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const preferences = await userProfileService.updatePreferences(userId, data)
          set({ preferences, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to update preferences', isLoading: false })
          throw error
        }
      },

      uploadAvatar: async (file) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const result = await userProfileService.uploadAvatar(userId, file)
          
          // Update the profile with the new avatar URL
          const updatedProfile = { ...get().profile!, avatar: result.avatar } as UserProfile
          set({ profile: updatedProfile, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to upload avatar', isLoading: false })
          throw error
        }
      },

      setProfile: (profile) => {
        set({ profile })
      },

      setPreferences: (preferences) => {
        set({ preferences })
      },

      setError: (error) => {
        set({ error })
      }
    })),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)