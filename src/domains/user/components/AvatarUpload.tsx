import React, { useRef } from 'react'
import { useUserStore } from '../store/userStore'

interface AvatarUploadProps {
  className?: string
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ className = '' }) => {
  const { profile, uploadAvatar, isLoading, error } = useUserStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      try {
        await uploadAvatar(file)
      } catch (err) {
        console.error('Failed to upload avatar:', err)
      }
    }
  }

  return (
    <div className={`avatar-upload ${className}`}>
      <div className="avatar-container" onClick={handleAvatarClick}>
        {profile?.avatar ? (
          <img 
            src={profile.avatar} 
            alt="User Avatar" 
            className="avatar-image"
          />
        ) : (
          <div className="avatar-placeholder">
            <span>{profile ? `${profile.firstName?.charAt(0)}${profile.lastName?.charAt(0)}` : '?'}</span>
          </div>
        )}
        <div className="avatar-overlay">
          <span>Edit</span>
        </div>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {error && <div className="error">{error}</div>}
      {isLoading && <div className="loading">Uploading...</div>}
    </div>
  )
}

export default AvatarUpload