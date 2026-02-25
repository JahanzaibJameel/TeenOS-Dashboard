import React from 'react'
import { useAuth } from '../context/AuthProvider'

interface LogoutButtonProps {
  onLogout?: () => void
  className?: string
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ onLogout, className = '' }) => {
  const { logout, isLoading } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
      onLogout?.()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <button 
      type="button" 
      onClick={handleLogout}
      disabled={isLoading}
      className={`logout-button ${className}`}
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  )
}

export default LogoutButton