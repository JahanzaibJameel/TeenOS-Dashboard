import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, Budget, SavingsGoal } from '../types/FinanceTypes';

interface FinanceState {
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Omit<Transaction, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBudget: (id: string, budget: Partial<Omit<Budget, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteBudget: (id: string) => void;
  addSavingsGoal: (savingsGoal: Omit<SavingsGoal, 'id' | 'completed' | 'createdAt' | 'updatedAt'>) => void;
  updateSavingsGoal: (id: string, savingsGoal: Partial<Omit<SavingsGoal, 'id' | 'userId' | 'createdAt'>>) => void;
  deleteSavingsGoal: (id: string) => void;
  completeSavingsGoal: (id: string) => void;
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: [],
      budgets: [],
      savingsGoals: [],
      
      addTransaction: (transactionData) => set((state) => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: `txn_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return { transactions: [...state.transactions, newTransaction] };
      }),
      
      updateTransaction: (id, transactionData) => set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === id ? { ...t, ...transactionData, updatedAt: new Date() } : t
        )
      })),
      
      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),
      
      addBudget: (budgetData) => set((state) => {
        const newBudget: Budget = {
          ...budgetData,
          id: `bud_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return { budgets: [...state.budgets, newBudget] };
      }),
      
      updateBudget: (id, budgetData) => set((state) => ({
        budgets: state.budgets.map(b => 
          b.id === id ? { ...b, ...budgetData, updatedAt: new Date() } : b
        )
      })),
      
      deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter(b => b.id !== id)
      })),
      
      addSavingsGoal: (savingsGoalData) => set((state) => {
        const newSavingsGoal: SavingsGoal = {
          ...savingsGoalData,
          id: `sg_${Date.now()}`,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        return { savingsGoals: [...state.savingsGoals, newSavingsGoal] };
      }),
      
      updateSavingsGoal: (id, savingsGoalData) => set((state) => ({
        savingsGoals: state.savingsGoals.map(sg => 
          sg.id === id ? { ...sg, ...savingsGoalData, updatedAt: new Date() } : sg
        )
      })),
      
      deleteSavingsGoal: (id) => set((state) => ({
        savingsGoals: state.savingsGoals.filter(sg => sg.id !== id)
      })),
      
      completeSavingsGoal: (id) => set((state) => ({
        savingsGoals: state.savingsGoals.map(sg => 
          sg.id === id ? { ...sg, completed: true, updatedAt: new Date() } : sg
        )
      })),
    }),
    {
      name: 'finance-storage',
    }
  )
);