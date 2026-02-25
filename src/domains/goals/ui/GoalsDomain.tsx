import React, { useState } from 'react';
import { useGoalsStore } from '../store/goalsStore';
import { GoalForm } from './GoalForm';
import { GoalList } from './GoalList';
import { BulkGoalProcessor } from '../components/BulkGoalProcessor';
import { Goal, CreateGoalData } from '../types';

export const GoalsDomain: React.FC = () => {
  const { goals, createGoal, updateGoal } = useGoalsStore();
  const [showForm, setShowForm] = useState(false);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const handleGoalSubmit = (goalData: CreateGoalData) => {
    // In a real implementation, userId would come from auth context
    // For now, we'll let the store handle the userId
    createGoal(goalData);
    setShowForm(false);
  };

  const toggleGoalSelection = (goalId: string) => {
    setSelectedGoals(prev =>
      prev.includes(goalId)
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const selectedGoalObjects = goals.filter(goal => selectedGoals.includes(goal.id));

  const handleBulkOperationComplete = (updatedGoals: Goal[]) => {
    // Update the store with the processed goals
    updatedGoals.forEach(updatedGoal => {
      updateGoal(updatedGoal.id, updatedGoal);
    });
    setSelectedGoals([]); // Clear selection after operation
  };

  return (
    <div className="goals-domain">
      <div className="goals-header">
        <h2>🎯 Goals Management</h2>
        <div className="goals-actions">
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Add Goal'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="goal-form-container">
          <GoalForm onSubmit={handleGoalSubmit} onCancel={() => setShowForm(false)} />
        </div>
      )}

      {selectedGoals.length > 0 && (
        <div className="bulk-actions">
          <h3>Bulk Operations ({selectedGoals.length} selected)</h3>
          <BulkGoalProcessor 
            goals={selectedGoalObjects} 
            onProcessComplete={handleBulkOperationComplete} 
          />
        </div>
      )}

      <div className="goals-content">
        <GoalList 
          goals={goals} 
          onToggleSelection={toggleGoalSelection}
          selectedIds={selectedGoals}
        />
      </div>
    </div>
  );
};

export default GoalsDomain;