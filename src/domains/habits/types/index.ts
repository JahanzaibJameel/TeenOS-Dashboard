export enum HabitFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

export enum HabitPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum HabitStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
}

export interface Habit {
  id: string
  userId: string
  name: string
  description?: string
  frequency: HabitFrequency
  priority: HabitPriority
  status: HabitStatus
  targetStreak: number // Target number of consecutive days/weeks/months
  currentStreak: number // Current streak
  longestStreak: number // Longest streak achieved
  completedCount: number // Total times completed
  completionRate: number // Percentage of successful completions
  lastCompletedDate?: Date
  nextDueDate: Date
  reminderTime?: string // Time for reminders in HH:MM format
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface HabitCompletion {
  id: string
  habitId: string
  userId: string
  date: Date
  notes?: string
  rating?: number // 1-5 scale
  createdAt: Date
}

export interface CreateHabitData {
  name: string
  description?: string
  frequency: HabitFrequency
  priority: HabitPriority
  targetStreak: number
  reminderTime?: string
  tags?: string[]
}

export interface UpdateHabitData {
  name?: string
  description?: string
  frequency?: HabitFrequency
  priority?: HabitPriority
  status?: HabitStatus
  targetStreak?: number
  reminderTime?: string
  tags?: string[]
}

export interface CompleteHabitData {
  habitId: string
  notes?: string
  rating?: number
}

export interface HabitFilterOptions {
  status?: HabitStatus[]
  frequency?: HabitFrequency[]
  priority?: HabitPriority[]
  searchQuery?: string
  sortBy?: 'completionRate' | 'currentStreak' | 'priority' | 'nextDueDate' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}