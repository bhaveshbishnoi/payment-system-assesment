'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Clock, Loader2, RefreshCcw, ArrowLeft } from 'lucide-react';
import { PaymentStatus } from '../types/payment';

interface StatusScreenProps {
  status: PaymentStatus;
  attemptCount: number;
  maxAttempts: number;
  error?: string | null;
  onRetry: () => void;
  onReset: () => void;
}

const StatusScreen: React.FC<StatusScreenProps> = ({
  status,
  attemptCount,
  maxAttempts,
  error,
  onRetry,
  onReset,
}) => {
  const isFinalFailure = attemptCount >= maxAttempts;

  const renderContent = () => {
    switch (status) {
      case 'processing':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Loader2 className="h-16 w-16 text-blue-600" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Processing Payment</h3>
              <p className="text-slate-500">Please do not refresh the page or close the window.</p>
            </div>
            {attemptCount > 1 && (
              <div className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                Attempt {attemptCount} of {maxAttempts}
              </div>
            )}
          </div>
        );

      case 'success':
        return (
          <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              <CheckCircle2 className="h-20 w-20 text-green-500" />
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">Payment Successful!</h3>
              <p className="text-slate-500">Your transaction has been completed successfully.</p>
            </div>
            <button
              onClick={onReset}
              className="mt-4 flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3 font-bold text-white transition-all hover:bg-slate-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Make Another Payment
            </button>
          </div>
        );

      case 'failed':
      case 'timeout':
        const isTimeout = status === 'timeout';
        return (
          <div className="flex flex-col items-center justify-center space-y-6 py-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
            >
              {isTimeout ? (
                <Clock className="h-20 w-20 text-orange-500" />
              ) : (
                <XCircle className="h-20 w-20 text-red-500" />
              )}
            </motion.div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900">
                {isTimeout ? 'Payment Timed Out' : 'Payment Failed'}
              </h3>
              <p className="text-slate-500">
                {error || (isTimeout ? 'The request took too long to process.' : 'An error occurred during processing.')}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4">
              {!isFinalFailure ? (
                <>
                  <div className="text-sm font-medium text-slate-500">
                    Attempt {attemptCount} of {maxAttempts}
                  </div>
                  <button
                    onClick={onRetry}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-bold text-white transition-all hover:bg-blue-700"
                  >
                    <RefreshCcw className="h-4 w-4" />
                    Try Again
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700">
                    Maximum retry attempts reached. Please contact support or try a different card.
                  </div>
                  <button
                    onClick={onReset}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 px-8 py-3 font-bold text-slate-600 transition-all hover:bg-slate-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Form
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="w-full"
    >
      {renderContent()}
    </motion.div>
  );
};

export default StatusScreen;
