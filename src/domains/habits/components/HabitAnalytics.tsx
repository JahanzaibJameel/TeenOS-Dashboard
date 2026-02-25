import React from 'react'
import { Habit, HabitCompletion } from '../types'

interface HabitAnalyticsProps {
  habit: Habit
  completions: HabitCompletion[]
  className?: string
}

const HabitAnalytics: React.FC<HabitAnalyticsProps> = ({ habit, completions, className = '' }) => {
  // Calculate analytics
  const completionRate = habit.completionRate
  const consistency = completions.length > 1 
    ? (completions.filter(c => c.rating && c.rating >= 4).length / completions.length) * 100 
    : 0
  const averageRating = completions.length > 0
    ? completions.reduce((sum, c) => sum + (c.rating || 0), 0) / completions.length
    : 0

  // Get completion frequency by day of week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const completionByDay = daysOfWeek.map(day => ({
    day,
    count: 0
  }))

  completions.forEach(completion => {
    const dayIndex = new Date(completion.date).getDay()
    completionByDay[dayIndex].count++
  })

  return (
    <div className={`habit-analytics ${className}`}>
      <h3>Analytics</h3>
      
      <div className="analytics-summary">
        <div className="metric">
          <div className="metric-value">{completionRate.toFixed(1)}%</div>
          <div className="metric-label">Completion Rate</div>
        </div>
        
        <div className="metric">
          <div className="metric-value">{habit.currentStreak}</div>
          <div className="metric-label">Current Streak</div>
        </div>
        
        <div className="metric">
          <div className="metric-value">{habit.longestStreak}</div>
          <div className="metric-label">Longest Streak</div>
        </div>
        
        <div className="metric">
          <div className="metric-value">{averageRating.toFixed(1)}</div>
          <div className="metric-label">Avg Rating</div>
        </div>
      </div>
      
      <div className="analytics-charts">
        <div className="chart">
          <h4>Completion by Day</h4>
          <div className="bar-chart">
            {completionByDay.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.day}</div>
                <div 
                  className="bar"
                  style={{ height: `${Math.min(item.count * 10, 50)}px` }}
                >
                  <div className="bar-value">{item.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="chart">
          <h4>Consistency</h4>
          <div className="consistency-circle">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path
                className="circle-bg"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#eee"
                strokeWidth="3"
              />
              <path
                className="circle"
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="3"
                strokeDasharray={`${consistency}, 100`}
              />
              <text x="18" y="20.5" className="percentage">{consistency.toFixed(0)}%</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HabitAnalytics