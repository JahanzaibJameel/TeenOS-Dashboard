import React from 'react';

import { FinanceService } from '../../services/FinanceService';

interface BudgetListProps {
  userId: string;
}

const BudgetList: React.FC<BudgetListProps> = ({ userId }) => {
  const budgets = FinanceService.getBudgets().filter(b => b.userId === userId);

  // Sort budgets by end date (closest expiration first)
  const sortedBudgets = [...budgets].sort((a, b) => 
    new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
  );

  return (
    <div className="budget-list">
      <h3>Active Budgets</h3>
      {sortedBudgets.length === 0 ? (
        <p>No budgets set up yet.</p>
      ) : (
        <table className="budgets-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Period</th>
              <th>Budgeted</th>
              <th>Used</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedBudgets.map((budget) => {
              // Calculate spent amount based on transactions in the budget period
              const transactions = FinanceService.getTransactions().filter(t => 
                t.userId === userId &&
                t.type === 'expense' &&
                t.category === budget.category &&
                new Date(t.date) >= new Date(budget.startDate) &&
                new Date(t.date) <= new Date(budget.endDate)
              );
              
              const spent = transactions.reduce((sum, t) => sum + t.amount, 0);
              const remaining = budget.amount - spent;
              const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
              
              return (
                <tr key={budget.id}>
                  <td>{budget.category}</td>
                  <td>{budget.period}</td>
                  <td>${budget.amount.toFixed(2)}</td>
                  <td>${spent.toFixed(2)}</td>
                  <td className={remaining >= 0 ? 'positive' : 'negative'}>
                    ${Math.abs(remaining).toFixed(2)} {remaining >= 0 ? 'left' : 'over'}
                  </td>
                  <td>
                    <div className="budget-status">
                      <div 
                        className={`budget-progress ${percentage > 100 ? 'over-budget' : ''}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                      <span>{percentage.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BudgetList;
