import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { Skill, SkillProgress, CreateSkillData, UpdateSkillData, LogPracticeData, SkillFilterOptions } from '../types'
import SkillsService from '../services/SkillsService'
import { useAuthStore } from '../../auth/store/authStore'

interface SkillsState {
  skills: Skill[]
  filteredSkills: Skill[]
  selectedSkill: Skill | null
  skillProgressHistory: SkillProgress[]
  isLoading: boolean
  error: string | null
  filters: SkillFilterOptions
  
  // Actions
  fetchSkills: (filters?: SkillFilterOptions) => Promise<void>
  fetchSkillById: (skillId: string) => Promise<void>
  fetchSkillProgressHistory: (skillId: string, startDate?: Date, endDate?: Date) => Promise<void>
  createSkill: (data: CreateSkillData) => Promise<void>
  updateSkill: (skillId: string, data: UpdateSkillData) => Promise<void>
  deleteSkill: (skillId: string) => Promise<void>
  logPractice: (data: LogPracticeData) => Promise<void>
  setSelectedSkill: (skill: Skill | null) => void
  setFilters: (filters: SkillFilterOptions) => void
  setError: (error: string | null) => void
}

const skillsService = SkillsService.getInstance()

export const useSkillsStore = create<SkillsState>()(
  persist(
    immer((set, get) => ({
      skills: [],
      filteredSkills: [],
      selectedSkill: null,
      skillProgressHistory: [],
      isLoading: false,
      error: null,
      filters: {},

      fetchSkills: async (filters) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const skills = await skillsService.getAllSkills(userId, filters)
          set({ 
            skills, 
            filteredSkills: skills, 
            isLoading: false,
            filters: filters || {}
          })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch skills', isLoading: false })
          throw error
        }
      },

      fetchSkillById: async (skillId) => {
        set({ isLoading: true, error: null })
        
        try {
          const skill = await skillsService.getSkillById(skillId)
          set({ selectedSkill: skill, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch skill', isLoading: false })
          throw error
        }
      },

      fetchSkillProgressHistory: async (skillId, startDate, endDate) => {
        set({ isLoading: true, error: null })
        
        try {
          const progressHistory = await skillsService.getSkillProgressHistory(skillId, startDate, endDate)
          set({ skillProgressHistory: progressHistory, isLoading: false })
        } catch (error: any) {
          set({ error: error.message || 'Failed to fetch skill progress history', isLoading: false })
          throw error
        }
      },

      createSkill: async (data) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const newSkill = await skillsService.createSkill(userId, data)
          set(state => ({
            skills: [...state.skills, newSkill],
            filteredSkills: [...state.filteredSkills, newSkill],
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to create skill', isLoading: false })
          throw error
        }
      },

      updateSkill: async (skillId, data) => {
        set({ isLoading: true, error: null })
        
        try {
          const updatedSkill = await skillsService.updateSkill(skillId, data)
          set(state => ({
            skills: state.skills.map(s => s.id === skillId ? updatedSkill : s),
            filteredSkills: state.filteredSkills.map(s => s.id === skillId ? updatedSkill : s),
            selectedSkill: state.selectedSkill?.id === skillId ? updatedSkill : state.selectedSkill,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to update skill', isLoading: false })
          throw error
        }
      },

      deleteSkill: async (skillId) => {
        set({ isLoading: true, error: null })
        
        try {
          await skillsService.deleteSkill(skillId)
          set(state => ({
            skills: state.skills.filter(s => s.id !== skillId),
            filteredSkills: state.filteredSkills.filter(s => s.id !== skillId),
            selectedSkill: state.selectedSkill?.id === skillId ? null : state.selectedSkill,
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to delete skill', isLoading: false })
          throw error
        }
      },

      logPractice: async (data) => {
        const userId = useAuthStore.getState().user?.id
        if (!userId) {
          set({ error: 'User not authenticated' })
          return
        }

        set({ isLoading: true, error: null })
        
        try {
          const progress = await skillsService.logPractice(userId, data)
          // Update the skill's progress in the store
          const updatedSkills = get().skills.map(skill => {
            if (skill.id === data.skillId) {
              // Update skill with new progress
              return {
                ...skill,
                lastPracticed: new Date(),
                totalPracticeHours: skill.totalPracticeHours + (data.duration / 60),
                xp: skill.xp + progress.xpGained,
                masteryScore: skill.masteryScore + progress.masteryScoreChange
              }
            }
            return skill
          })
          
          set(state => ({
            skills: updatedSkills,
            filteredSkills: updatedSkills,
            skillProgressHistory: [...state.skillProgressHistory, progress],
            isLoading: false
          }))
        } catch (error: any) {
          set({ error: error.message || 'Failed to log practice', isLoading: false })
          throw error
        }
      },

      setSelectedSkill: (skill) => {
        set({ selectedSkill: skill })
      },

      setFilters: (filters) => {
        set({ filters })
      },

      setError: (error) => {
        set({ error })
      }
    })),
    {
      name: 'skills-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)