import React, { useState } from 'react'
import { useUserStore } from '../store/userStore'
import { UpdateProfileData } from '../types'

const ProfileInformation: React.FC = () => {
  const { profile, updateProfile, isLoading, error } = useUserStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    dateOfBirth: undefined,
    gender: '',
    location: '',
    timezone: '',
    language: ''
  })

  React.useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        displayName: profile.displayName,
        bio: profile.bio || '',
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender || '',
        location: profile.location || '',
        timezone: profile.timezone || '',
        language: profile.language || ''
      })
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateProfile(formData)
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to update profile:', err)
    }
  }

  if (!profile) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="profile-information">
      <div className="profile-header">
        <h2>Profile Information</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Edit
          </button>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Display Name:</label>
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Bio:</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dateOfBirth">Date of Birth:</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gender">Gender:</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location">Location:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="timezone">Timezone:</label>
              <input
                type="text"
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="language">Language:</label>
            <input
              type="text"
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="profile-display">
          <div className="profile-field">
            <strong>Name:</strong> {profile.firstName} {profile.lastName}
          </div>
          <div className="profile-field">
            <strong>Display Name:</strong> {profile.displayName}
          </div>
          {profile.bio && (
            <div className="profile-field">
              <strong>Bio:</strong> {profile.bio}
            </div>
          )}
          {profile.dateOfBirth && (
            <div className="profile-field">
              <strong>Date of Birth:</strong> {new Date(profile.dateOfBirth).toLocaleDateString()}
            </div>
          )}
          {profile.gender && (
            <div className="profile-field">
              <strong>Gender:</strong> {profile.gender}
            </div>
          )}
          {profile.location && (
            <div className="profile-field">
              <strong>Location:</strong> {profile.location}
            </div>
          )}
          {profile.timezone && (
            <div className="profile-field">
              <strong>Timezone:</strong> {profile.timezone}
            </div>
          )}
          {profile.language && (
            <div className="profile-field">
              <strong>Language:</strong> {profile.language}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProfileInformation