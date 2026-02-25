import React from 'react'
import { useGamificationStore } from '../store/gamificationStore'
import { AchievementType, BadgeTier } from '../types'

interface AchievementsListProps {
  className?: string
}

const AchievementsList: React.FC<AchievementsListProps> = ({ className = '' }) => {
  const { userAchievements, achievements, fetchUserAchievements, fetchAchievements, isLoading, error } = useGamificationStore()

  React.useEffect(() => {
    fetchUserAchievements()
    fetchAchievements()
  }, [fetchUserAchievements, fetchAchievements])

  const getBadgeColor = (tier: BadgeTier | undefined) => {
    switch(tier) {
      case 'bronze': return '#CD7F32'
      case 'silver': return '#C0C0C0'
      case 'gold': return '#FFD700'
      case 'platinum': return '#E5E4E2'
      case 'diamond': return '#B9F2FF'
      default: return '#888'
    }
  }

  const getAchievementIcon = (type: AchievementType) => {
    switch(type) {
      case 'milestone': return '🎯'
      case 'streak': return '🔥'
      case 'completion': return '✅'
      case 'participation': return ' участие'
      case 'social': return '👥'
      case 'mastery': return '⭐'
      default: return '🏆'
    }
  }

  return (
    <div className={`achievements-list ${className}`}>
      <h3>Your Achievements</h3>
      {error && <div className="error">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading achievements...</div>
      ) : (
        <div className="achievements-grid">
          {userAchievements.map(userAchievement => {
            const achievement = achievements.find(a => a.id === userAchievement.achievementId)
            if (!achievement) return null
            
            return (
              <div 
                key={userAchievement.id} 
                className={`achievement-card ${userAchievement.isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div 
                  className="achievement-badge" 
                  style={{ backgroundColor: getBadgeColor(achievement.badgeTier) }}
                >
                  {getAchievementIcon(achievement.type)}
                </div>
                <div className="achievement-details">
                  <h4>{achievement.name}</h4>
                  <p>{achievement.description}</p>
                  <div className="achievement-meta">
                    <span className="points-reward">+{achievement.pointsReward} pts</span>
                    <span className="xp-reward">+{achievement.xpReward} XP</span>
                  </div>
                  <div className="achievement-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${(userAchievement.progress / achievement.requirements[0]?.targetValue) * 100}%` }} 
                      />
                    </div>
                    <span className="progress-text">
                      {userAchievement.progress}/{achievement.requirements[0]?.targetValue}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {userAchievements.length === 0 && !isLoading && (
        <p className="no-achievements">No achievements yet. Start completing goals, habits, and skills to earn rewards!</p>
      )}
    </div>
  )
}

export default AchievementsList