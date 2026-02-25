import React from 'react'
import { Skill } from '../types'

interface SkillAchievementsProps {
  skill: Skill
  className?: string
}

const SkillAchievements: React.FC<SkillAchievementsProps> = ({ skill, className = '' }) => {
  // Determine achievements based on skill properties
  const achievements = []
  
  if (skill.level === 'expert') {
    achievements.push({
      id: 'expert',
      title: 'Expert Level',
      description: 'Reached expert level in this skill',
      icon: '🎓',
      earned: true
    })
  }
  
  if (skill.totalPracticeHours >= 100) {
    achievements.push({
      id: 'century',
      title: 'Century Club',
      description: 'Practiced for 100+ hours',
      icon: '💯',
      earned: true
    })
  }
  
  if (skill.masteryScore >= 90) {
    achievements.push({
      id: 'master',
      title: 'Mastery Achieved',
      description: 'Mastered this skill with 90%+ score',
      icon: '👑',
      earned: true
    })
  }
  
  if (skill.xp >= 1000) {
    achievements.push({
      id: 'thousand',
      title: 'Thousand XP',
      description: 'Earned 1000+ experience points',
      icon: '⭐',
      earned: true
    })
  }
  
  // Add more achievements based on specific criteria
  if (skill.lastPracticed && 
      new Date().getTime() - new Date(skill.lastPracticed).getTime() < 24 * 60 * 60 * 1000) {
    achievements.push({
      id: 'daily',
      title: 'Daily Practice',
      description: 'Practiced this skill today',
      icon: '📅',
      earned: true
    })
  }
  
  if (skill.levelNumber >= 3) {
    achievements.push({
      id: 'intermediate',
      title: 'Intermediate',
      description: 'Reached intermediate level or higher',
      icon: '📈',
      earned: true
    })
  }

  return (
    <div className={`skill-achievements ${className}`}>
      <h3>Achievements</h3>
      {achievements.length > 0 ? (
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div key={achievement.id} className="achievement-card">
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-details">
                <h4>{achievement.title}</h4>
                <p>{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No achievements yet. Keep practicing to earn rewards!</p>
      )}
    </div>
  )
}

export default SkillAchievements