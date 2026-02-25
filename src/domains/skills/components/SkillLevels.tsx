import React from 'react'
import { SkillLevel } from '../types'

interface SkillLevelsProps {
  level: SkillLevel
  levelNumber: number
  progressToNextLevel: number
  className?: string
}

const SkillLevels: React.FC<SkillLevelsProps> = ({ 
  level, 
  levelNumber, 
  progressToNextLevel, 
  className = '' 
}) => {
  const getLevelColor = (level: SkillLevel) => {
    switch(level) {
      case 'beginner': return '#ff6b6b'
      case 'developing': return '#ffd166'
      case 'competent': return '#06d6a0'
      case 'proficient': return '#118ab2'
      case 'expert': return '#073b4c'
      default: return '#888'
    }
  }

  const getLevelName = (level: SkillLevel) => {
    switch(level) {
      case 'beginner': return 'Beginner'
      case 'developing': return 'Developing'
      case 'competent': return 'Competent'
      case 'proficient': return 'Proficient'
      case 'expert': return 'Expert'
      default: return level
    }
  }

  return (
    <div className={`skill-levels ${className}`}>
      <div className="level-indicator">
        <div className="level-badge" style={{ backgroundColor: getLevelColor(level) }}>
          {getLevelName(level)}
        </div>
        <div className="level-number">Level {levelNumber}</div>
      </div>
      
      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${progressToNextLevel}%`,
              backgroundColor: getLevelColor(level)
            }}
          />
        </div>
        <div className="progress-text">{progressToNextLevel.toFixed(0)}% to next level</div>
      </div>
    </div>
  )
}

export default SkillLevels