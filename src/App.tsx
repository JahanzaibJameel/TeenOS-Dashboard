import React, { useEffect } from 'react'
import { AuthProvider, useAuth } from './domains/auth/context/AuthProvider'
import { useAuthStore } from './domains/auth/store/authStore'
import { useUserStore } from './domains/user/store/userStore'
import { useGoalsStore } from './domains/goals/store/goalsStore'
import { useSkillsStore } from './domains/skills/store/skillsStore'
import { useHabitsStore } from './domains/habits/store/habitsStore'
import { useGamificationStore } from './domains/gamification/store/gamificationStore'
import { AdvisorFactory, AdvisorType } from './domains/ai-advisor/core/AdvisorFactory'
import { AnalyticsManager } from './domains/analytics/core/AnalyticsManager'
import FinanceDomain from './domains/finance/ui/FinanceDomain'
import './App.scss'

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const { fetchProfile } = useUserStore()
  const { fetchGoals } = useGoalsStore()
  const { fetchSkills } = useSkillsStore()
  const { fetchHabits } = useHabitsStore()
  const { fetchUserProfile } = useGamificationStore()

  useEffect(() => {
    const analyticsManager = AnalyticsManager.getInstance()
    
    if (isAuthenticated && !isLoading) {
      const user = useAuthStore.getState().user
      if (user) {
        analyticsManager.identify(user.id, {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`
        })
        
        fetchProfile()
        fetchGoals()
        fetchSkills()
        fetchHabits()
        fetchUserProfile()
        
        AdvisorFactory.getAdvisor(user.id, AdvisorType.RULE_BASED)
      }
    }
    
    analyticsManager.track('app_load', {
      timestamp: new Date().toISOString()
    })
    
    return () => {
      analyticsManager.close()
    }
  }, [isAuthenticated, isLoading, fetchProfile, fetchGoals, fetchSkills, fetchHabits, fetchUserProfile])

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="spinner">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="app-unauthenticated">
        <h1>Welcome to TeenOS</h1>
        <p>Your Growth Operating System for Teens</p>
        <div className="login-container">
          <button 
            onClick={async () => {
              try {
                await useAuthStore.getState().login({ 
                  email: 'test@example.com', 
                  password: 'password' 
                });
              } catch (error) {
                console.error('Login error:', error);
              }
            }}
            className="btn btn-primary"
          >
            Login as Test User
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app-authenticated">
      <header className="app-header">
        <h1>TeenOS Dashboard</h1>
        <nav className="main-nav">
          <ul>
            <li><a href="#goals" className="active">Goals</a></li>
            <li><a href="#skills">Skills</a></li>
            <li><a href="#habits">Habits</a></li>
            <li><a href="#gamification">Gamification</a></li>
            <li><a href="#advisor">AI Advisor</a></li>
            <li><a href="#finance">Finance</a></li>
          </ul>
        </nav>
      </header>
      
      <div className="app-main">
        <div className="dashboard-content">
          <div className="dashboard-grid">
            <section id="goals" className="dashboard-section">
              <h2>🎯 Your Goals</h2>
              <p>Track and manage your personal and academic goals</p>
              <div className="section-content">
                <p>Focus on achieving your most important objectives</p>
              </div>
            </section>
            
            <section id="skills" className="dashboard-section">
              <h2>🧠 Skill Development</h2>
              <p>Learn and improve important life and career skills</p>
              <div className="section-content">
                <p>Expand your abilities and knowledge base</p>
              </div>
            </section>
            
            <section id="habits" className="dashboard-section">
              <h2>🔄 Daily Habits</h2>
              <p>Build positive routines and track your consistency</p>
              <div className="section-content">
                <p>Develop lasting positive behaviors</p>
              </div>
            </section>
            
            <section id="gamification" className="dashboard-section">
              <h2>⭐ Progress & Rewards</h2>
              <p>Earn points, badges, and climb the leaderboard</p>
              <div className="section-content">
                <p>Stay motivated with achievements and recognition</p>
              </div>
            </section>
            
            <section id="advisor" className="dashboard-section">
              <h2>🤖 AI Advisor</h2>
              <p>Get personalized recommendations for growth</p>
              <div className="section-content">
                <p>Receive tailored advice for your development</p>
              </div>
            </section>
            
            <section id="finance" className="dashboard-section">
              <h2>💰 Finance Management</h2>
              <p>Track spending, save money, and reach financial goals</p>
              <div className="section-content">
                <FinanceDomain />
              </div>
            </section>
          </div>
        </div>
        
        <aside className="sidebar">
          <h3>Quick Stats</h3>
          
          <div className="quick-stats">
            <div className="stat-card">
              <div className="stat-value">5</div>
              <div className="stat-label">Active Goals</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">Skills</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">87%</div>
              <div className="stat-label">Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">1,250</div>
              <div className="stat-label">Points</div>
            </div>
          </div>
          
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button>Add New Goal</button>
            <button>Log Activity</button>
            <button>Check Insights</button>
          </div>
        </aside>
      </div>
      
      <footer className="app-footer">
        <p>TeenOS Growth Operating System © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App