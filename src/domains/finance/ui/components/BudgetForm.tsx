import React, { useState } from 'react';

import { FinanceService } from '../../services/FinanceService';

interface BudgetFormProps {
  userId: string;
  onSuccess?: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ userId, onSuccess }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !amount) {
      setError('Category and amount are required');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    // Calculate end date based on period
    const start = new Date(startDate);
    let end = new Date(start);

    switch (period) {
      case 'daily':
        end.setDate(start.getDate() + 1);
        break;
      case 'weekly':
        end.setDate(start.getDate() + 7);
        break;
      case 'monthly':
        end.setMonth(start.getMonth() + 1);
        break;
      case 'yearly':
        end.setFullYear(start.getFullYear() + 1);
        break;
    }

    FinanceService.addBudget({
      userId,
      category,
      amount: numericAmount,
      period,
      startDate: start,
      endDate: end,
    });

    // Reset form
    setCategory('');
    setAmount('');
    setPeriod('monthly');
    setStartDate(new Date().toISOString().split('T')[0]);
    setError('');
    
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="finance-form">
      <h3>Add Budget</h3>
      {error && <div className="error">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Food, Transport, Entertainment"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min="0.01"
          step="0.01"
          placeholder="0.00"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="period">Period:</label>
        <select 
          id="period" 
          value={period} 
          onChange={(e) => setPeriod(e.target.value as 'daily' | 'weekly' | 'monthly' | 'yearly')}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        Add Budget
      </button>
    </form>
  );
};

export default BudgetForm;