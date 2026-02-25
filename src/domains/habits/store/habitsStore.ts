import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Habit, HabitCompletion, CreateHabitData, UpdateHabitData, CompleteHabitData, HabitFilterOptions } from '../types'
import HabitsService from '../services/HabitsService'
import { useAuthStore } from '../../auth/store/authStore'

interface HabitsState {
  habits: Habit[]
  filteredHabits: Habit[]
  selectedHabit: Habit | null
  habitCompletions: HabitCompletion[]
  habitsStats: {
    totalHabits: number
    activeHabits: number
    completionRate: number
    totalCompletions: number
  } | null
  isLoading: boolean
  error: string | null
  filters: HabitFilterOptions
  
  // Actions
  fetchHabits: (filters?: HabitFilterOptions) => Promise<void>
  fetchHabitById: (habitId: string) => Promise<void>
  fetchHabitCompletions: (habitId: string, startDate?: Date, endDate?: Date) => Promise<void>
  fetchHabitsStats: () => Promise<void>
  createHabit: (data: CreateHabitData) => Promise<void>
  updateHabit: (habitId: string, data: UpdateHabitData) => Promise<void>
  deleteHabit: (habitId: string) => Promise<void>
  completeHabit: (data: CompleteHabitData) => Promise<void>
  undoHabitCompletion: (completionId: string) => Promise<void>
  setSelectedHabit: (habit: Habit | null) => void
  setFilters: (filters: HabitFilterOptions) => void
  setError: (error: string | null) => void
}

const habitsService = HabitsService.getInstance()

export const useHabitsStore = create<HabitsState>()(
  persist(
    immer((set, get) => ({
      habits: [],
      filteredHabits: [],
      selectedHabit: null,
      habitCompletions: [],
      habitsStats: null,
      isLoading: false,
      error: null,
      filters: {},

      fetchHabits: async (filters) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const habits = await habitsService.getAllHabits(userId, filters)
          set({ 
            habits, 
            filteredHabits: habits, 
            isLoading: false,
            filters: filters || {}
          })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch habits', isLoading: false })
          throw error
        }
      },

      fetchHabitById: async (habitId) => {
        set({ isLoading: true, error: null })
        
        try {
          const habit = await habitsService.getHabitById(habitId)
          set({ selectedHabit: habit, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch habit', isLoading: false })
          throw error
        }
      },

      fetchHabitCompletions: async (habitId, startDate, endDate) => {
        set({ isLoading: true, error: null })
        
        try {
          const completions = await habitsService.getHabitCompletions(habitId, startDate, endDate)
          set({ habitCompletions: completions, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch habit completions', isLoading: false })
          throw error
        }
      },

      fetchHabitsStats: async () => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const stats = await habitsService.getHabitsStats(userId)
          set({ habitsStats: stats, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch habits stats', isLoading: false })
          throw error
        }
      },

      createHabit: async (data) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const newHabit = await habitsService.createHabit(userId, data)
          set(state => ({
            habits: [...state.habits, newHabit],
            filteredHabits: [...state.filteredHabits, newHabit],
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to create habit', isLoading: false })
          throw error
        }
      },

      updateHabit: async (habitId, data) => {
        set({ isLoading: true, error: null })
        
        try {
          const updatedHabit = await habitsService.updateHabit(habitId, data)
          set(state => ({
            habits: state.habits.map(h => h.id === habitId ? updatedHabit : h),
            filteredHabits: state.filteredHabits.map(h => h.id === habitId ? updatedHabit : h),
            selectedHabit: state.selectedHabit?.id === habitId ? updatedHabit : state.selectedHabit,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to update habit', isLoading: false })
          throw error
        }
      },

      deleteHabit: async (habitId) => {
        set({ isLoading: true, error: null })
        
        try {
          await habitsService.deleteHabit(habitId)
          set(state => ({
            habits: state.habits.filter(h => h.id !== habitId),
            filteredHabits: state.filteredHabits.filter(h => h.id !== habitId),
            selectedHabit: state.selectedHabit?.id === habitId ? null : state.selectedHabit,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to delete habit', isLoading: false })
          throw error
        }
      },

      completeHabit: async (data) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const completion = await habitsService.completeHabit(userId, data)
          // Update habit streak and stats in the store
          const updatedHabits = get().habits.map(habit => {
            if (habit.id === data.habitId) {
              return {
                ...habit,
                currentStreak: habit.currentStreak + 1,
                lastCompletedDate: new Date(),
                completedCount: habit.completedCount + 1,
                completionRate: ((habit.completedCount + 1) / (habit.completedCount + 1 + (habit.completionRate * habit.completedCount / 100))) * 100
              }
            }
            return habit
          })
          
          set(state => ({
            habits: updatedHabits,
            filteredHabits: updatedHabits,
            habitCompletions: [...state.habitCompletions, completion],
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to complete habit', isLoading: false })
          throw error
        }
      },

      undoHabitCompletion: async (completionId) => {
        set({ isLoading: true, error: null })
        
        try {
          await habitsService.undoHabitCompletion(completionId)
          // This would require refetching habit data to update streaks
          const updatedHabits = get().habits.map(habit => ({
            ...habit,
            currentStreak: Math.max(0, habit.currentStreak - 1)
          }))
          
          set(state => ({
            habits: updatedHabits,
            filteredHabits: updatedHabits,
            habitCompletions: state.habitCompletions.filter(c => c.id !== completionId),
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to undo habit completion', isLoading: false })
          throw error
        }
      },

      setSelectedHabit: (habit) => {
        set({ selectedHabit: habit })
      },

      setFilters: (filters) => {
        set({ filters })
      },

      setError: (error) => {
        set({ error })
      }
    })),
    {
      name: 'habits-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)