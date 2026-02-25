export enum GoalStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ON_HOLD = 'on_hold',
  CANCELLED = 'cancelled'
}

export enum GoalPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum GoalCategory {
  PERSONAL = 'personal',
  PROFESSIONAL = 'professional',
  HEALTH = 'health',
  EDUCATION = 'education',
  FINANCIAL = 'financial',
  RELATIONSHIP = 'relationship',
  CREATIVE = 'creative'
}

export interface Goal {
  id: string
  userId: string
  title: string
  description?: string
  category: GoalCategory
  priority: GoalPriority
  status: GoalStatus
  startDate: Date
  dueDate?: Date
  completedDate?: Date
  targetValue?: number
  currentValue?: number
  progressPercentage: number
  notes?: string
  tags: string[]
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateGoalData {
  title: string
  description?: string
  category: GoalCategory
  priority: GoalPriority
  startDate: Date
  dueDate?: Date
  targetValue?: number
  tags?: string[]
  parentId?: string
}

export interface UpdateGoalData {
  title?: string
  description?: string
  category?: GoalCategory
  priority?: GoalPriority
  status?: GoalStatus
  dueDate?: Date
  targetValue?: number
  currentValue?: number
  notes?: string
  tags?: string[]
}

export interface GoalProgressUpdate {
  value: number
  notes?: string
  date?: Date
}

export interface GoalFilterOptions {
  status?: GoalStatus[]
  category?: GoalCategory[]
  priority?: GoalPriority[]
  searchQuery?: string
  startDateFrom?: Date
  startDateTo?: Date
  dueDateFrom?: Date
  dueDateTo?: Date
  sortBy?: 'dueDate' | 'priority' | 'progress' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
}