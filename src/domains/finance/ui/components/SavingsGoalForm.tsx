import React, { useState } from 'react';

import { FinanceService } from '../../services/FinanceService';

interface SavingsGoalFormProps {
  userId: string;
  onSuccess?: () => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({ userId, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !targetAmount) {
      setError('Title and target amount are required');
      return;
    }

    const numericAmount = parseFloat(targetAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Target amount must be a positive number');
      return;
    }

    const deadlineDate = new Date(deadline);
    if (deadlineDate < new Date()) {
      setError('Deadline cannot be in the past');
      return;
    }

    FinanceService.addSavingsGoal({
      userId,
      title,
      targetAmount: numericAmount,
      currentAmount: 0, // Starting with 0
      deadline: deadlineDate,
      description,
    });

    // Reset form
    setTitle('');
    setTargetAmount('');
    setDeadline(new Date().toISOString().split('T')[0]);
    setDescription('');
    setError('');
    
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="finance-form">
      <h3>Add Savings Goal</h3>
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. New Phone, Trip to Paris"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="targetAmount">Target Amount:</label>
        <input
          type="number"
          id="targetAmount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="deadline">Deadline:</label>
        <input
          type="date"
          id="deadline"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        Add Savings Goal
      </button>
    </form>
  );
};

export default SavingsGoalForm;