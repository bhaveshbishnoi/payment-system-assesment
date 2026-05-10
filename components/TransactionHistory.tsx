'use client';

import React, { useState } from 'react';
import { Transaction } from '../types/payment';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ChevronRight, 
  Receipt,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'timeout':
        return <Clock className="h-5 w-5 text-orange-500" />;
      default:
        return <Clock className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Transaction History</h3>
        <span className="text-xs font-medium text-slate-500">{transactions.length} total</span>
      </div>

      {transactions.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center">
          <Receipt className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-2 text-sm text-slate-500">No transactions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <motion.button
              key={tx.id}
              layoutId={tx.id}
              onClick={() => setSelectedTransaction(tx)}
              className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  tx.status === 'success' ? "bg-green-50" : tx.status === 'failed' ? "bg-red-50" : "bg-orange-50"
                )}>
                  {getStatusIcon(tx.status)}
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900">
                    {tx.currency} {tx.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatTimestamp(tx.timestamp)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  tx.status === 'success' ? "text-green-600" : tx.status === 'failed' ? "text-red-600" : "text-orange-600"
                )}>
                  {tx.status}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Transaction Details Modal */}
      <AnimatePresence>
        {selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTransaction(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              layoutId={selectedTransaction.id}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
            >
              <div className="mb-6 flex flex-col items-center text-center">
                <div className={cn(
                  "mb-4 flex h-16 w-16 items-center justify-center rounded-full",
                  selectedTransaction.status === 'success' ? "bg-green-100" : selectedTransaction.status === 'failed' ? "bg-red-100" : "bg-orange-100"
                )}>
                  {getStatusIcon(selectedTransaction.status)}
                </div>
                <h4 className="text-2xl font-bold text-slate-900">
                  {selectedTransaction.currency} {selectedTransaction.amount.toFixed(2)}
                </h4>
                <p className={cn(
                  "text-sm font-bold uppercase tracking-widest",
                  selectedTransaction.status === 'success' ? "text-green-600" : selectedTransaction.status === 'failed' ? "text-red-600" : "text-orange-600"
                )}>
                  Payment {selectedTransaction.status}
                </p>
              </div>

              <div className="space-y-4 rounded-2xl bg-slate-50 p-6">
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-slate-500">Transaction ID</span>
                  <span className="text-xs font-bold text-slate-900">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-slate-500">Date & Time</span>
                  <span className="text-xs font-bold text-slate-900">{formatTimestamp(selectedTransaction.timestamp)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-slate-500">Cardholder</span>
                  <span className="text-xs font-bold text-slate-900">{selectedTransaction.cardholderName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-medium text-slate-500">Card</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-900">
                    <span className="capitalize">{selectedTransaction.cardType}</span> •••• {selectedTransaction.lastFourDigits}
                  </span>
                </div>
                {selectedTransaction.failureReason && (
                  <div className="flex justify-between">
                    <span className="text-xs font-medium text-slate-500">Reason</span>
                    <span className="text-xs font-bold text-red-600">{selectedTransaction.failureReason}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedTransaction(null)}
                className="mt-8 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition-all hover:bg-slate-800"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionHistory;
