import React, { useState } from 'react';

import { FinanceService } from '../../services/FinanceService';

interface TransactionFormProps {
  userId: string;
  onSuccess?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ userId, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      setError('Amount and category are required');
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Amount must be a positive number');
      return;
    }

    FinanceService.addTransaction({
      userId,
      amount: numericAmount,
      type,
      category,
      description,
      date: new Date(date),
    });

    // Reset form
    setAmount('');
    setType('expense');
    setCategory('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setError('');
    
    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="finance-form">
      <h3>Add Transaction</h3>
      {error && <div className="error">{error}</div>}
      
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
        <label htmlFor="type">Type:</label>
        <select 
          id="type" 
          value={type} 
          onChange={(e) => setType(e.target.value as 'income' | 'expense')}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="category">Category:</label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Food, Salary, Rent"
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="date">Date:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" className="btn btn-primary">
        Add Transaction
      </button>
    </form>
  );
};

export default TransactionForm;