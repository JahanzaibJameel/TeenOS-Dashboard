import React, { useState } from 'react'
import { useAuth } from '../context/AuthProvider'

interface LoginFormProps {
  onLoginSuccess?: () => void
  onSwitchToRegister?: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading, error: authError } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    try {
      await login(email, password)
      onLoginSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="auth-form">
      <h2>Login to TeenOS</h2>
      <form onSubmit={handleSubmit}>
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
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className="auth-switch">
        <p>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister} disabled={isLoading}>
            Register here
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginForm