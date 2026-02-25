# Finance Domain

The Finance domain provides comprehensive financial management capabilities for TeenOS users.

## Features

### 1. Transaction Management
- **Add Income/Expenses**: Track all financial transactions with categories and descriptions
- **Transaction Types**: Distinguish between income and expense transactions
- **Date Tracking**: Record transaction dates for accurate financial reporting
- **CRUD Operations**: Create, read, update, and delete transactions

### 2. Budget Management
- **Category-based Budgets**: Set budgets for different spending categories
- **Flexible Periods**: Daily, weekly, monthly, or yearly budget periods
- **Budget Tracking**: Monitor spending against budget limits
- **Visual Progress**: See budget utilization with progress bars

### 3. Savings Goals
- **Goal Setting**: Create specific savings goals with target amounts
- **Progress Tracking**: Monitor current savings progress toward goals
- **Deadline Management**: Set deadlines for financial goals
- **Completion Status**: Mark goals as completed when achieved

### 4. Financial Analytics
- **Summary Dashboard**: Overview of total income, expenses, and net balance
- **Monthly Statistics**: Track monthly income and spending patterns
- **Savings Rate**: Calculate personal savings rate percentage
- **Spending Analysis**: View spending breakdown by category
- **Budget Utilization**: Monitor how well you're sticking to budgets

## Data Structure

### Transaction
```typescript
interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Budget
```typescript
interface Budget {
  id: string;
  userId: string;
  category: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Savings Goal
```typescript
interface SavingsGoal {
  id: string;
  userId: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Components

### FinanceDomain
Main component that orchestrates the entire finance management experience with tabbed navigation.

### TransactionForm
Form for adding new income and expense transactions with validation.

### BudgetForm
Form for creating new budgets with category, amount, and period selection.

### SavingsGoalForm
Form for setting up new savings goals with targets and deadlines.

### FinancialDashboard
Comprehensive dashboard showing financial summaries, progress statistics, and analytics.

### TransactionList
Table view of recent transactions with sorting and filtering capabilities.

### BudgetList
Display of active budgets with progress tracking and utilization metrics.

### SavingsGoalList
Visual representation of savings goals with progress bars and action buttons.

## Services

### FinanceService
Central service handling all finance-related business logic:
- Transaction management (add, update, delete)
- Budget operations
- Savings goal management
- Financial calculations and analytics
- Data retrieval and filtering

## Data Persistence
Uses Zustand with persist middleware for local storage, ensuring data survives page refreshes and is available offline.

## Usage Example

```typescript
// Add a transaction
FinanceService.addTransaction({
  userId: 'user123',
  amount: 1500,
  type: 'income',
  category: 'Salary',
  description: 'Monthly salary',
  date: new Date()
});

// Create a budget
FinanceService.addBudget({
  userId: 'user123',
  category: 'Food',
  amount: 400,
  period: 'monthly',
  startDate: new Date(),
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
});

// Set a savings goal
FinanceService.addSavingsGoal({
  userId: 'user123',
  title: 'New Laptop',
  targetAmount: 1200,
  currentAmount: 200,
  deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
  description: 'Save for a new laptop'
});

// Get financial summary
const summary = FinanceService.getFinancialSummary('user123');
console.log(`Net Balance: $${summary.netBalance}`);
console.log(`Savings Rate: ${summary.savingsRate}%`);
```

## Future Enhancements
- Financial goal reminders and notifications
- Integration with banking APIs for automatic transaction import
- Advanced financial reporting and export capabilities
- Multi-currency support
- Financial planning tools
- Investment tracking features