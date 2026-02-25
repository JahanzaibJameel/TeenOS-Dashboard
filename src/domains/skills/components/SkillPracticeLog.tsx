import React, { useState } from 'react'
import { useSkillsStore } from '../store/skillsStore'
import { LogPracticeData } from '../types'

interface SkillPracticeLogProps {
  skillId: string
  className?: string
}

const SkillPracticeLog: React.FC<SkillPracticeLogProps> = ({ skillId, className = '' }) => {
  const { logPractice, isLoading, error } = useSkillsStore()
  const [duration, setDuration] = useState<number>(30)
  const [notes, setNotes] = useState<string>('')
  const [activities, setActivities] = useState<string>('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const logData: LogPracticeData = {
      skillId,
      duration,
      notes: notes || undefined,
      activities: activities ? activities.split(',').map(a => a.trim()) : []
    }
    
    try {
      await logPractice(logData)
      // Reset form
      setDuration(30)
      setNotes('')
      setActivities('')
    } catch (err) {
      console.error('Failed to log practice:', err)
    }
  }

  return (
    <div className={`skill-practice-log ${className}`}>
      <h3>Log Practice Session</h3>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="duration">Duration (minutes):</label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="1"
            max="1440" // Max 24 hours
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="activities">Activities (comma separated):</label>
          <input
            type="text"
            id="activities"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            placeholder="e.g., reading, exercises, projects"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any additional notes about this practice session..."
            rows={3}
          />
        </div>
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging...' : 'Log Practice'}
        </button>
      </form>
    </div>
  )
}

export default SkillPracticeLog