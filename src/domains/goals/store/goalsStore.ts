import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Goal, CreateGoalData, UpdateGoalData, GoalProgressUpdate, GoalFilterOptions } from '../types'
import GoalsService from '../services/GoalsService'
import { useAuthStore } from '../../auth/store/authStore'

interface GoalsState {
  goals: Goal[]
  filteredGoals: Goal[]
  selectedGoal: Goal | null
  isLoading: boolean
  error: string | null
  filters: GoalFilterOptions
  
  // Actions
  fetchGoals: (filters?: GoalFilterOptions) => Promise<void>
  fetchGoalById: (goalId: string) => Promise<void>
  createGoal: (data: CreateGoalData) => Promise<void>
  updateGoal: (goalId: string, data: UpdateGoalData) => Promise<void>
  deleteGoal: (goalId: string) => Promise<void>
  updateGoalProgress: (goalId: string, progress: GoalProgressUpdate) => Promise<void>
  markGoalComplete: (goalId: string) => Promise<void>
  markGoalIncomplete: (goalId: string) => Promise<void>
  setSelectedGoal: (goal: Goal | null) => void
  setFilters: (filters: GoalFilterOptions) => void
  setError: (error: string | null) => void
}

const goalsService = GoalsService.getInstance()

export const useGoalsStore = create<GoalsState>()(
  persist(
    immer((set) => ({
      goals: [],
      filteredGoals: [],
      selectedGoal: null,
      isLoading: false,
      error: null,
      filters: {},

      fetchGoals: async (filters) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const goals = await goalsService.getAllGoals(userId, filters)
          set({ 
            goals, 
            filteredGoals: goals, 
            isLoading: false,
            filters: filters || {}
          })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch goals', isLoading: false })
          throw error
        }
      },

      fetchGoalById: async (goalId) => {
        set({ isLoading: true, error: null })
        
        try {
          const goal = await goalsService.getGoalById(goalId)
          set({ selectedGoal: goal, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch goal', isLoading: false })
          throw error
        }
      },

      createGoal: async (data) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const newGoal = await goalsService.createGoal(userId, data)
          set(state => ({
            goals: [...state.goals, newGoal],
            filteredGoals: [...state.filteredGoals, newGoal],
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to create goal', isLoading: false })
          throw error
        }
      },

      updateGoal: async (goalId, data) => {
        set({ isLoading: true, error: null })
        
        try {
          const updatedGoal = await goalsService.updateGoal(goalId, data)
          set(state => ({
            goals: state.goals.map(g => g.id === goalId ? updatedGoal : g),
            filteredGoals: state.filteredGoals.map(g => g.id === goalId ? updatedGoal : g),
            selectedGoal: state.selectedGoal?.id === goalId ? updatedGoal : state.selectedGoal,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to update goal', isLoading: false })
          throw error
        }
      },

      deleteGoal: async (goalId) => {
        set({ isLoading: true, error: null })
        
        try {
          await goalsService.deleteGoal(goalId)
          set(state => ({
            goals: state.goals.filter(g => g.id !== goalId),
            filteredGoals: state.filteredGoals.filter(g => g.id !== goalId),
            selectedGoal: state.selectedGoal?.id === goalId ? null : state.selectedGoal,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to delete goal', isLoading: false })
          throw error
        }
      },

      updateGoalProgress: async (goalId, progress) => {
        set({ isLoading: true, error: null })
        
        try {
          const updatedGoal = await goalsService.updateGoalProgress(goalId, progress)
          set(state => ({
            goals: state.goals.map(g => g.id === goalId ? updatedGoal : g),
            filteredGoals: state.filteredGoals.map(g => g.id === goalId ? updatedGoal : g),
            selectedGoal: state.selectedGoal?.id === goalId ? updatedGoal : state.selectedGoal,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to update goal progress', isLoading: false })
          throw error
        }
      },

      markGoalComplete: async (goalId) => {
        set({ isLoading: true, error: null })
        
        try {
          const updatedGoal = await goalsService.markGoalComplete(goalId)
          set(state => ({
            goals: state.goals.map(g => g.id === goalId ? updatedGoal : g),
            filteredGoals: state.filteredGoals.map(g => g.id === goalId ? updatedGoal : g),
            selectedGoal: state.selectedGoal?.id === goalId ? updatedGoal : state.selectedGoal,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to mark goal as complete', isLoading: false })
          throw error
        }
      },

      markGoalIncomplete: async (goalId) => {
        set({ isLoading: true, error: null })
        
        try {
          const updatedGoal = await goalsService.markGoalIncomplete(goalId)
          set(state => ({
            goals: state.goals.map(g => g.id === goalId ? updatedGoal : g),
            filteredGoals: state.filteredGoals.map(g => g.id === goalId ? updatedGoal : g),
            selectedGoal: state.selectedGoal?.id === goalId ? updatedGoal : state.selectedGoal,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to mark goal as incomplete', isLoading: false })
          throw error
        }
      },

      setSelectedGoal: (goal) => {
        set({ selectedGoal: goal })
      },

      setFilters: (filters) => {
        set({ filters })
      },

      setError: (error) => {
        set({ error })
      }
    })),
    {
      name: 'goals-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)