import React, { useState, useEffect } from 'react'
import { useUserStore } from '../store/userStore'

const UserPreferencesForm: React.FC = () => {
  const { preferences, fetchPreferences, updatePreferences, isLoading, error } = useUserStore()
  const [formData, setFormData] = useState({
    theme: 'auto' as 'light' | 'dark' | 'auto',
    notifications: {
      email: true,
      push: true,
      inApp: true,
    },
    privacy: {
      profileVisibility: 'public' as 'public' | 'friends' | 'private',
      dataSharing: true,
    },
    accessibility: {
      highContrast: false,
      fontSize: 'medium' as 'small' | 'medium' | 'large',
    },
  })

  useEffect(() => {
    if (!preferences) {
      fetchPreferences()
    } else {
      setFormData({
        theme: preferences.theme,
        notifications: { ...preferences.notifications },
        privacy: { ...preferences.privacy },
        accessibility: { ...preferences.accessibility },
      })
    }
  }, [preferences, fetchPreferences])

  const handleChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updatePreferences(formData)
    } catch (err) {
      console.error('Failed to update preferences:', err)
    }
  }

  return (
    <div className="user-preferences-form">
      <h2>User Preferences</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Theme Settings */}
        <div className="form-section">
          <h3>Theme</h3>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="theme"
                value="light"
                checked={formData.theme === 'light'}
                onChange={(e) => handleChange('theme', e.target.value)}
              />
              Light
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="dark"
                checked={formData.theme === 'dark'}
                onChange={(e) => handleChange('theme', e.target.value)}
              />
              Dark
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="auto"
                checked={formData.theme === 'auto'}
                onChange={(e) => handleChange('theme', e.target.value)}
              />
              Auto
            </label>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="form-section">
          <h3>Notifications</h3>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.notifications.email}
                onChange={(e) => handleChange('notifications.email', e.target.checked)}
              />
              Email Notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.notifications.push}
                onChange={(e) => handleChange('notifications.push', e.target.checked)}
              />
              Push Notifications
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.notifications.inApp}
                onChange={(e) => handleChange('notifications.inApp', e.target.checked)}
              />
              In-App Notifications
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="form-section">
          <h3>Privacy</h3>
          <div className="form-group">
            <label>
              Profile Visibility:
              <select
                value={formData.privacy.profileVisibility}
                onChange={(e) => handleChange('privacy.profileVisibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.privacy.dataSharing}
                onChange={(e) => handleChange('privacy.dataSharing', e.target.checked)}
              />
              Allow Data Sharing
            </label>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="form-section">
          <h3>Accessibility</h3>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.accessibility.highContrast}
                onChange={(e) => handleChange('accessibility.highContrast', e.target.checked)}
              />
              High Contrast Mode
            </label>
            <label>
              Font Size:
              <select
                value={formData.accessibility.fontSize}
                onChange={(e) => handleChange('accessibility.fontSize', e.target.value)}
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </label>
          </div>
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  )
}

export default UserPreferencesForm