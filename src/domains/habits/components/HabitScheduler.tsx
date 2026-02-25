import React, { useState } from 'react'
import { useHabitsStore } from '../store/habitsStore'
import { UpdateHabitData } from '../types'

interface HabitSchedulerProps {
  habitId: string
  className?: string
}

const HabitScheduler: React.FC<HabitSchedulerProps> = ({ habitId, className = '' }) => {
  const { selectedHabit, updateHabit, isLoading, error } = useHabitsStore()
  const [reminderTime, setReminderTime] = useState<string>(selectedHabit?.reminderTime || '')
  const [frequency, setFrequency] = useState<string>(selectedHabit?.frequency || 'daily')
  const [priority, setPriority] = useState<string>(selectedHabit?.priority || 'medium')

  const handleSaveSchedule = async () => {
    const updateData: UpdateHabitData = {
      reminderTime: reminderTime || undefined,
      frequency: frequency as any,
      priority: priority as any
    }

    try {
      await updateHabit(habitId, updateData)
    } catch (err) {
      console.error('Failed to update schedule:', err)
    }
  }

  return (
    <div className={`habit-scheduler ${className}`}>
      <h3>Habit Schedule</h3>
      {error && <div className="error">{error}</div>}
      
      <div className="schedule-controls">
        <div className="form-group">
          <label htmlFor="frequency">Frequency:</label>
          <select
            id="frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority:</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="reminderTime">Reminder Time:</label>
          <input
            type="time"
            id="reminderTime"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
          />
          <small>Leave empty to disable reminders</small>
        </div>
        
        <button 
          onClick={handleSaveSchedule} 
          disabled={isLoading}
          className="save-schedule-btn"
        >
          {isLoading ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>
    </div>
  )
}

export default HabitScheduler