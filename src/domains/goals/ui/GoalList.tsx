import React from 'react';
import { Goal, GoalStatus } from '../types';

interface GoalListProps {
  goals: Goal[];
  onToggleSelection: (goalId: string) => void;
  selectedIds: string[];
}

export const GoalList: React.FC<GoalListProps> = ({ 
  goals, 
  onToggleSelection,
  selectedIds
}) => {
  return (
    <div className="goal-list">
      {goals.length === 0 ? (
        <div className="empty-state">
          <p>No goals yet. Add your first goal to get started!</p>
        </div>
      ) : (
        <ul className="goals-grid">
          {goals.map((goal) => (
            <li 
              key={goal.id} 
              className={`goal-item ${goal.status === GoalStatus.COMPLETED ? 'completed' : ''} ${selectedIds.includes(goal.id) ? 'selected' : ''}`}
            >
              <div className="goal-checkbox">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(goal.id)}
                  onChange={() => onToggleSelection(goal.id)}
                />
              </div>
              <div className="goal-content">
                <h3 className={goal.status === GoalStatus.COMPLETED ? 'completed-title' : ''}>
                  {goal.title}
                </h3>
                <p className="goal-description">{goal.description}</p>
                
                <div className="goal-meta">
                  <span className="goal-category">{goal.category}</span>
                  <span className="goal-priority">{goal.priority}</span>
                </div>
                
                <div className="goal-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${goal.progressPercentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">{goal.progressPercentage}%</span>
                </div>
                
                {goal.dueDate && (
                  <div className="goal-due-date">
                    Due: {new Date(goal.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GoalList;