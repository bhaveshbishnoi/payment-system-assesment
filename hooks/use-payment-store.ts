import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { PaymentStatus, Transaction } from '../types/payment';

interface PaymentState {
  // Current Payment State
  status: PaymentStatus;
  currentTransactionId: string | null;
  attemptCount: number;
  error: string | null;
  
  // History
  transactions: Transaction[];
  
  // Actions
  setStatus: (status: PaymentStatus) => void;
  setCurrentTransactionId: (id: string | null) => void;
  incrementAttempt: () => void;
  resetAttempts: () => void;
  setError: (error: string | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransactionStatus: (id: string, status: PaymentStatus, failureReason?: string) => void;
  clearHistory: () => void;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set) => ({
      status: 'idle',
      currentTransactionId: null,
      attemptCount: 0,
      error: null,
      transactions: [],

      setStatus: (status) => set({ status }),
      setCurrentTransactionId: (id) => set({ currentTransactionId: id }),
      incrementAttempt: () => set((state) => ({ attemptCount: state.attemptCount + 1 })),
      resetAttempts: () => set({ attemptCount: 0 }),
      setError: (error) => set({ error }),
      addTransaction: (transaction) => 
        set((state) => ({ 
          transactions: [transaction, ...state.transactions] 
        })),
      updateTransactionStatus: (id, status, failureReason) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, status, failureReason } : t
          ),
        })),
      clearHistory: () => set({ transactions: [] }),
    }),
    {
      name: 'payment-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
);
