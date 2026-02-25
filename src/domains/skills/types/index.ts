export enum SkillLevel {
  BEGINNER = 'beginner',
  DEVELOPING = 'developing',
  COMPETENT = 'competent',
  PROFICIENT = 'proficient',
  EXPERT = 'expert'
}

export enum SkillCategory {
  TECHNICAL = 'technical',
  SOFT = 'soft',
  CREATIVE = 'creative',
  LEADERSHIP = 'leadership',
  COMMUNICATION = 'communication',
  PROBLEM_SOLVING = 'problem_solving',
  ANALYTICAL = 'analytical',
  FINANCIAL = 'financial',
  HEALTH_WELLNESS = 'health_wellness'
}

export interface Skill {
  id: string
  userId: string
  name: string
  description?: string
  category: SkillCategory
  level: SkillLevel
  levelNumber: number // Numeric representation of level (1-5)
  xp: number // Experience points
  xpToNextLevel: number
  progressToNextLevel: number // Percentage (0-100)
  lastPracticed?: Date
  totalPracticeHours: number
  masteryScore: number // Score representing overall mastery (0-100)
  tags: string[]
  prerequisites: string[] // IDs of prerequisite skills
  createdAt: Date
  updatedAt: Date
}

export interface SkillProgress {
  skillId: string
  userId: string
  date: Date
  practiceDuration: number // in minutes
  practiceNotes?: string
  xpGained: number
  masteryScoreChange: number
  activities: string[]
}

export interface CreateSkillData {
  name: string
  description?: string
  category: SkillCategory
  tags?: string[]
  prerequisites?: string[]
}

export interface UpdateSkillData {
  name?: string
  description?: string
  category?: SkillCategory
  tags?: string[]
  prerequisites?: string[]
}

export interface LogPracticeData {
  skillId: string
  duration: number // in minutes
  notes?: string
  activities: string[]
}

export interface SkillFilterOptions {
  category?: SkillCategory[]
  level?: SkillLevel[]
  searchQuery?: string
  minMastery?: number
  maxMastery?: number
  sortBy?: 'masteryScore' | 'xp' | 'level' | 'lastPracticed' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}