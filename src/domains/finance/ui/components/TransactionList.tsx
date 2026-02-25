import React from 'react';

import { FinanceService } from '../../services/FinanceService';

interface TransactionListProps {
  userId: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ userId }) => {
  const transactions = FinanceService.getTransactions().filter(t => t.userId === userId);

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="transaction-list">
      <h3>Recent Transactions</h3>
      {sortedTransactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>
                  <span className={`transaction-type ${transaction.type}`}>
                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                  </span>
                </td>
                <td>{transaction.category}</td>
                <td>{transaction.description || '-'}</td>
                <td>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;