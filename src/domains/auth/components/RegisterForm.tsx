import React, { useState } from 'react'
import { useAuth } from '../context/AuthProvider'

interface RegisterFormProps {
  onRegisterSuccess?: () => void
  onSwitchToLogin?: () => void
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { register, isLoading, error: authError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      await register(email, password, firstName, lastName)
      onRegisterSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <div className="auth-form">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name:</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name:</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        {authError && <div className="error">{authError}</div>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Register'}
        </button>
      </form>
      <div className="auth-switch">
        <p>
          Already have an account?{' '}
          <button type="button" onClick={onSwitchToLogin} disabled={isLoading}>
            Login here
          </button>
        </p>
      </div>
    </div>
  )
}

export default RegisterForm