import { Transaction, Budget, SavingsGoal, FinancialSummary } from '../types/FinanceTypes';
import { useFinanceStore } from '../data/FinanceStore';

export class FinanceService {
  static addTransaction(transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
    useFinanceStore.getState().addTransaction(transaction);
  }

  static updateTransaction(id: string, transaction: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt'>>) {
    useFinanceStore.getState().updateTransaction(id, transaction);
  }

  static deleteTransaction(id: string) {
    useFinanceStore.getState().deleteTransaction(id);
  }

  static addBudget(budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) {
    useFinanceStore.getState().addBudget(budget);
  }

  static updateBudget(id: string, budget: Partial<Omit<Budget, 'id' | 'userId' | 'createdAt'>>) {
    useFinanceStore.getState().updateBudget(id, budget);
  }

  static deleteBudget(id: string) {
    useFinanceStore.getState().deleteBudget(id);
  }

  static addSavingsGoal(savingsGoal: Omit<SavingsGoal, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) {
    useFinanceStore.getState().addSavingsGoal(savingsGoal);
  }

  static updateSavingsGoal(id: string, savingsGoal: Partial<Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>>) {
    useFinanceStore.getState().updateSavingsGoal(id, savingsGoal);
  }

  static deleteSavingsGoal(id: string) {
    useFinanceStore.getState().deleteSavingsGoal(id);
  }

  static completeSavingsGoal(id: string) {
    useFinanceStore.getState().completeSavingsGoal(id);
  }

  static getTransactions(): Transaction[] {
    return useFinanceStore.getState().transactions;
  }

  static getBudgets(): Budget[] {
    return useFinanceStore.getState().budgets;
  }

  static getSavingsGoals(): SavingsGoal[] {
    return useFinanceStore.getState().savingsGoals;
  }

  static getFinancialSummary(userId: string): FinancialSummary {
    const transactions = this.getTransactions().filter(t => t.userId === userId);
    const budgets = this.getBudgets().filter(b => b.userId === userId);
    // const savingsGoals = this.getSavingsGoals().filter(sg => sg.userId === userId);

    // Calculate totals
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    // Calculate monthly income and expenses
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyIncome = transactions
      .filter(t => t.type === 'income' && t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.getMonth() === currentMonth && t.date.getFullYear() === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate savings rate
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Calculate budget utilization
    const budgetUtilization: Record<string, { spent: number; budgeted: number }> = {};
    budgets.forEach(budget => {
      const spent = transactions
        .filter(t => 
          t.type === 'expense' && 
          t.category === budget.category &&
          t.date >= budget.startDate &&
          t.date <= budget.endDate
        )
        .reduce((sum, t) => sum + t.amount, 0);
      
      budgetUtilization[budget.category] = {
        spent,
        budgeted: budget.amount
      };
    });

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      monthlyIncome,
      monthlyExpenses,
      savingsRate,
      budgetUtilization
    };
  }

  static getSpendingByCategory(userId: string, startDate?: Date, endDate?: Date): Record<string, number> {
    let filteredTransactions = this.getTransactions().filter(t => t.userId === userId && t.type === 'expense');

    if (startDate) {
      filteredTransactions = filteredTransactions.filter(t => t.date >= startDate);
    }

    if (endDate) {
      filteredTransactions = filteredTransactions.filter(t => t.date <= endDate);
    }

    const spendingByCategory: Record<string, number> = {};

    filteredTransactions.forEach(transaction => {
      if (!spendingByCategory[transaction.category]) {
        spendingByCategory[transaction.category] = 0;
      }
      spendingByCategory[transaction.category] += transaction.amount;
    });

    return spendingByCategory;
  }

  static getSavingsProgress(userId: string): { completed: number; inProgress: number; total: number } {
    const savingsGoals = this.getSavingsGoals().filter(sg => sg.userId === userId);
    const completed = savingsGoals.filter(sg => sg.completed).length;
    const inProgress = savingsGoals.filter(sg => !sg.completed).length;
    
    return {
      completed,
      inProgress,
      total: savingsGoals.length
    };
  }
}