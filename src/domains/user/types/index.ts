export interface UserProfile {
  id: string
  userId: string
  firstName: string
  lastName: string
  displayName: string
  bio?: string
  avatar?: string
  dateOfBirth?: Date
  gender?: string
  location?: string
  timezone?: string
  language?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: {
    email: boolean
    push: boolean
    inApp: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private'
    dataSharing: boolean
  }
  accessibility: {
    highContrast: boolean
    fontSize: 'small' | 'medium' | 'large'
  }
}

export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  displayName?: string
  bio?: string
  avatar?: string
  dateOfBirth?: Date
  gender?: string
  location?: string
  timezone?: string
  language?: string
}

export interface UpdatePreferencesData {
  theme?: 'light' | 'dark' | 'auto'
  notifications?: {
    email?: boolean
    push?: boolean
    inApp?: boolean
  }
  privacy?: {
    profileVisibility?: 'public' | 'friends' | 'private'
    dataSharing?: boolean
  }
  accessibility?: {
    highContrast?: boolean
    fontSize?: 'small' | 'medium' | 'large'
  }
}