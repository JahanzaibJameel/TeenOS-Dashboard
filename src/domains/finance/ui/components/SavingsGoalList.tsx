import React from 'react';

import { FinanceService } from '../../services/FinanceService';

interface SavingsGoalListProps {
  userId: string;
}

const SavingsGoalList: React.FC<SavingsGoalListProps> = ({ userId }) => {
  const savingsGoals = FinanceService.getSavingsGoals().filter(sg => sg.userId === userId);

  // Sort goals by deadline (closest first)
  const sortedGoals = [...savingsGoals].sort((a, b) => 
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const handleCompleteGoal = (id: string) => {
    FinanceService.completeSavingsGoal(id);
  };

  return (
    <div className="savings-goal-list">
      <h3>Savings Goals</h3>
      {sortedGoals.length === 0 ? (
        <p>No savings goals set up yet.</p>
      ) : (
        <div className="savings-goals-grid">
          {sortedGoals.map((goal) => {
            const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const daysLeft = Math.ceil(
              (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <div key={goal.id} className={`savings-card ${goal.completed ? 'completed' : ''}`}>
                <div className="savings-header">
                  <h4>{goal.title}</h4>
                  {goal.completed && <span className="completed-badge">Completed!</span>}
                </div>
                
                <div className="savings-info">
                  <div className="savings-amount">
                    <span className="current">${goal.currentAmount.toFixed(2)}</span>
                    <span className="separator">/</span>
                    <span className="target">${goal.targetAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="savings-percentage">
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="savings-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>
                
                <div className="savings-details">
                  <div className="days-left">
                    {daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Due today!' : `${Math.abs(daysLeft)} days overdue`}
                  </div>
                  <div className="savings-description">
                    {goal.description || 'No description'}
                  </div>
                </div>
                
                {!goal.completed && daysLeft >= 0 && (
                  <div className="savings-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        // Add money to goal - in a real app this would be more complex
                        const amountToAdd = prompt("How much would you like to add?");
                        if (amountToAdd) {
                          const numericAmount = parseFloat(amountToAdd);
                          if (!isNaN(numericAmount) && numericAmount > 0) {
                            FinanceService.updateSavingsGoal(goal.id, {
                              currentAmount: goal.currentAmount + numericAmount
                            });
                          }
                        }
                      }}
                    >
                      Add Money
                    </button>
                    {percentage >= 100 && (
                      <button 
                        className="btn btn-success"
                        onClick={() => handleCompleteGoal(goal.id)}
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavingsGoalList;