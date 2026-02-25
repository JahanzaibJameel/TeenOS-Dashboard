import React from 'react'
import { useGamificationStore } from '../store/gamificationStore'

interface LevelProgressionProps {
  className?: string
}

const LevelProgression: React.FC<LevelProgressionProps> = ({ className = '' }) => {
  const { userProfile, isLoading } = useGamificationStore()
  
  if (isLoading) {
    return <div className="loading">Loading profile...</div>
  }
  
  if (!userProfile) {
    return <div className="no-data">No gamification profile available</div>
  }

  // Calculate XP needed for next level
  let currentLevel = userProfile.level;
  let xpForCurrentLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    xpForCurrentLevel += 100 * i;
  }
  const xpForNextLevel = 100 * currentLevel;
  const xpInCurrentLevel = userProfile.xp - xpForCurrentLevel;
  const progressToNextLevel = (xpInCurrentLevel / xpForNextLevel) * 100;

  return (
    <div className={`level-progression ${className}`}>
      <div className="level-info">
        <div className="level-display">
          <span className="level-label">Level</span>
          <span className="level-number">{userProfile.level}</span>
        </div>
        
        <div className="xp-display">
          <span className="xp-current">{userProfile.xp.toLocaleString()}</span>
          <span className="xp-divider">/</span>
          <span className="xp-next">{(xpForCurrentLevel + xpForNextLevel).toLocaleString()}</span>
        </div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${Math.min(progressToNextLevel, 100)}%`,
              backgroundColor: '#4CAF50'
            }}
          />
        </div>
        <div className="progress-text">
          {xpInCurrentLevel.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP to Level {userProfile.level + 1}
        </div>
      </div>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{userProfile.points.toLocaleString()}</div>
          <div className="stat-label">Points</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{userProfile.currentStreak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-value">{userProfile.longestStreak}</div>
          <div className="stat-label">Longest Streak</div>
        </div>
      </div>
    </div>
  )
}

export default LevelProgression