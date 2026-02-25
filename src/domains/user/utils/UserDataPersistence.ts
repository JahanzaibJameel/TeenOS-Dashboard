import Dexie, { Table } from 'dexie'
import { UserProfile, UserPreferences } from '../types'

export interface UserDBSchema {
  profiles: UserProfile
  preferences: UserPreferences & { userId: string }
}

export class UserDataPersistence extends Dexie {
  profiles!: Table<UserProfile>
  preferences!: Table<UserPreferences & { userId: string }>

  constructor() {
    super('UserDataDB')
    this.version(1).stores({
      profiles: 'id, userId, createdAt, updatedAt',
      preferences: 'userId', // Composite key isn't needed for preferences since userId is unique
    })
    
    // Bind tables to the instance
    this.profiles = this.table('profiles')
    this.preferences = this.table('preferences')
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await this.transaction('rw', this.profiles, async () => {
      await this.profiles.put(profile)
    })
  }

  async getProfile(userId: string): Promise<UserProfile | undefined> {
    return await this.profiles.where('userId').equals(userId).first()
  }

  async savePreferences(userId: string, preferences: UserPreferences): Promise<void> {
    await this.transaction('rw', this.preferences, async () => {
      await this.preferences.put({ ...preferences, userId })
    })
  }

  async getPreferences(userId: string): Promise<UserPreferences | undefined> {
    return await this.preferences.where('userId').equals(userId).first()
  }

  async syncWithServer(): Promise<void> {
    // This method would synchronize local data with server
    // Implementation would depend on the specific synchronization strategy
    console.log('Syncing user data with server...')
  }

  async clearUserData(): Promise<void> {
    await this.transaction('rw', this.profiles, this.preferences, async () => {
      await this.profiles.clear()
      await this.preferences.clear()
    })
  }
}

export const userDataDB = new UserDataPersistence()