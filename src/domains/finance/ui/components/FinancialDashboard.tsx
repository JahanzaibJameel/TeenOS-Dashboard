import React, { useEffect, useState } from 'react';
import { FinancialSummary } from '../../types/FinanceTypes';
import { FinanceService } from '../../services/FinanceService';
import { useFinanceStore } from '../../data/FinanceStore';

interface FinancialDashboardProps {
  userId: string;
}

const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ userId }) => {
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [spendingByCategory, setSpendingByCategory] = useState<Record<string, number>>({});
  const [savingsProgress, setSavingsProgress] = useState({ completed: 0, inProgress: 0, total: 0 });
  const { transactions, budgets, savingsGoals } = useFinanceStore();

  useEffect(() => {
    // Load financial data
    const summary = FinanceService.getFinancialSummary(userId);
    setFinancialSummary(summary);
    
    const spending = FinanceService.getSpendingByCategory(userId);
    setSpendingByCategory(spending);
    
    const progress = FinanceService.getSavingsProgress(userId);
    setSavingsProgress(progress);
  }, [userId, transactions, budgets, savingsGoals]);

  if (!financialSummary) {
    return <div>Loading financial data...</div>;
  }

  return (
    <div className="financial-dashboard">
      <div className="dashboard-grid">
        <div className="card summary-card">
          <h3>Financial Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span>Total Income</span>
              <strong>${financialSummary.totalIncome.toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Total Expenses</span>
              <strong>${financialSummary.totalExpenses.toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Net Balance</span>
              <strong className={financialSummary.netBalance >= 0 ? 'positive' : 'negative'}>
                ${financialSummary.netBalance.toFixed(2)}
              </strong>
            </div>
            <div className="summary-item">
              <span>Savings Rate</span>
              <strong>{financialSummary.savingsRate.toFixed(2)}%</strong>
            </div>
          </div>
        </div>

        <div className="card monthly-summary-card">
          <h3>Monthly Summary</h3>
          <div className="summary-items">
            <div className="summary-item">
              <span>Monthly Income</span>
              <strong>${financialSummary.monthlyIncome.toFixed(2)}</strong>
            </div>
            <div className="summary-item">
              <span>Monthly Expenses</span>
              <strong>${financialSummary.monthlyExpenses.toFixed(2)}</strong>
            </div>
          </div>
        </div>

        <div className="card savings-progress-card">
          <h3>Savings Goals Progress</h3>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-number">{savingsProgress.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">{savingsProgress.inProgress}</span>
              <span className="stat-label">In Progress</span>
            </div>
            <div className="stat">
              <span className="stat-number">{savingsProgress.total}</span>
              <span className="stat-label">Total Goals</span>
            </div>
          </div>
        </div>

        <div className="card budget-utilization-card">
          <h3>Budget Utilization</h3>
          <div className="budget-list">
            {Object.entries(financialSummary.budgetUtilization).map(([category, data]) => {
              const percentage = data.budgeted > 0 ? (data.spent / data.budgeted) * 100 : 0;
              return (
                <div key={category} className="budget-item">
                  <div className="budget-header">
                    <span>{category}</span>
                    <span>${data.spent.toFixed(2)} / ${data.budgeted.toFixed(2)}</span>
                  </div>
                  <div className="budget-bar">
                    <div 
                      className={`budget-progress ${percentage > 100 ? 'over-budget' : ''}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="budget-percentage">{percentage.toFixed(1)}%</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="card spending-categories-card">
          <h3>Spending by Category</h3>
          <div className="category-list">
            {Object.entries(spendingByCategory).map(([category, amount]) => (
              <div key={category} className="category-item">
                <span>{category}</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;