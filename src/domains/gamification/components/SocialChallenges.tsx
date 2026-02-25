import React, { useState } from 'react'
import { useGamificationStore } from '../store/gamificationStore'

interface SocialChallengesProps {
  className?: string
}

const SocialChallenges: React.FC<SocialChallengesProps> = ({ className = '' }) => {
  const { leaderboard, fetchLeaderboard, isLoading, error } = useGamificationStore()
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all_time'>('weekly')
  const [category, setCategory] = useState<'overall' | 'goals' | 'habits' | 'skills'>('overall')

  React.useEffect(() => {
    fetchLeaderboard({ timePeriod, category })
  }, [fetchLeaderboard, timePeriod, category])

  const handleFilterChange = () => {
    fetchLeaderboard({ timePeriod, category })
  }

  return (
    <div className={`social-challenges ${className}`}>
      <div className="challenges-header">
        <h3>Leaderboard</h3>
        
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="time-period">Time Period:</label>
            <select 
              id="time-period"
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as any)}
            >
              <option value="daily">Today</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="all_time">All Time</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="category">Category:</label>
            <select 
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="overall">Overall</option>
              <option value="goals">Goals</option>
              <option value="habits">Habits</option>
              <option value="skills">Skills</option>
            </select>
          </div>
          
          <button onClick={handleFilterChange} className="apply-filters">
            Apply
          </button>
        </div>
      </div>
      
      {error && <div className="error">{error}</div>}
      
      {isLoading ? (
        <div className="loading">Loading leaderboard...</div>
      ) : (
        <div className="leaderboard">
          {leaderboard.length > 0 ? (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Level</th>
                  <th>XP</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map(entry => (
                  <tr key={entry.id} className={entry.userId === 'current' ? 'current-user' : ''}>
                    <td className="rank-cell">
                      <span className={`rank-badge rank-${entry.rank}`}>
                        {entry.rank <= 3 ? 
                          (entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉') : 
                          entry.rank
                        }
                      </span>
                    </td>
                    <td className="username-cell">{entry.username}</td>
                    <td className="level-cell">{entry.level}</td>
                    <td className="xp-cell">{entry.xp.toLocaleString()}</td>
                    <td className="points-cell">{entry.points.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">No leaderboard data available</p>
          )}
        </div>
      )}
      
      <div className="challenge-actions">
        <button className="create-challenge-btn">
          Create Challenge
        </button>
        <button className="join-challenge-btn">
          Join Challenge
        </button>
      </div>
    </div>
  )
}

export default SocialChallenges