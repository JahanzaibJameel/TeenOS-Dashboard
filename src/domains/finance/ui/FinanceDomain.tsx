import React, { useState } from 'react';
import TransactionForm from './components/TransactionForm';
import BudgetForm from './components/BudgetForm';
import SavingsGoalForm from './components/SavingsGoalForm';
import FinancialDashboard from './components/FinancialDashboard';
import TransactionList from './components/TransactionList';
import BudgetList from './components/BudgetList';
import SavingsGoalList from './components/SavingsGoalList';
import { useAuth } from '../../../domains/auth/context/AuthProvider';

const FinanceDomain: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'savings'>('dashboard');

  if (!user) {
    return <div>Please log in to access your finances.</div>;
  }

  return (
    <div className="finance-domain">
      <h2>Finance Management</h2>
      
      <div className="finance-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'transactions' ? 'active' : ''}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button 
          className={activeTab === 'budgets' ? 'active' : ''}
          onClick={() => setActiveTab('budgets')}
        >
          Budgets
        </button>
        <button 
          className={activeTab === 'savings' ? 'active' : ''}
          onClick={() => setActiveTab('savings')}
        >
          Savings Goals
        </button>
      </div>

      <div className="finance-content">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <FinancialDashboard userId={user.id} />
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="tab-content">
            <div className="forms-section">
              <TransactionForm userId={user.id} onSuccess={() => setActiveTab('transactions')} />
            </div>
            <TransactionList userId={user.id} />
          </div>
        )}

        {activeTab === 'budgets' && (
          <div className="tab-content">
            <div className="forms-section">
              <BudgetForm userId={user.id} />
            </div>
            <BudgetList userId={user.id} />
          </div>
        )}

        {activeTab === 'savings' && (
          <div className="tab-content">
            <div className="forms-section">
              <SavingsGoalForm userId={user.id} />
            </div>
            <SavingsGoalList userId={user.id} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FinanceDomain;