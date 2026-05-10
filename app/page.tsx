'use client';

import React, { useState } from 'react';
import CardPreview from '../components/CardPreview';
import PaymentForm from '../components/PaymentForm';
import StatusScreen from '../components/StatusScreen';
import TransactionHistory from '../components/TransactionHistory';
import { usePayment } from '../hooks/use-payment';
import { PaymentFormData } from '../types/payment';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, History, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function Home() {
  const {
    status,
    transactions,
    attemptCount,
    maxAttempts,
    error,
    processPayment,
    resetPayment,
  } = usePayment();

  const [previewData, setPreviewData] = useState<PaymentFormData>({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    amount: 0,
    currency: 'INR',
    cardType: 'unknown',
  });

  const [lastSubmittedPayload, setLastSubmittedPayload] = useState<PaymentFormData | null>(null);

  const handleFormUpdate = React.useCallback((data: PaymentFormData) => {
    setPreviewData(data);
  }, []);

  const handleSubmit = React.useCallback((payload: PaymentFormData) => {
    setLastSubmittedPayload(payload);
    processPayment(payload);
  }, [processPayment]);

  const handleRetry = React.useCallback(() => {
    if (lastSubmittedPayload) {
      processPayment(lastSubmittedPayload);
    }
  }, [lastSubmittedPayload, processPayment]);

  return (
    <main className="min-h-screen bg-[#F8FAFC] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 md:text-4xl">
              Secure Checkout
            </h1>
            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Complete your transaction securely with our encrypted gateway.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-600">
            <ShieldCheck className="h-4 w-4" />
            Bank-level Security
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Payment Section */}
          <div className="lg:col-span-7">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/50 md:rounded-[2.5rem] md:p-12">
              <AnimatePresence mode="wait">
                {status === 'idle' ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-10"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Card Details</h2>
                      </div>
                      <CardPreview
                        cardNumber={previewData.cardNumber}
                        cardholderName={previewData.cardholderName}
                        expiryDate={previewData.expiryDate}
                        cardType={previewData.cardType}
                      />
                    </div>

                    <PaymentForm
                      onFormUpdate={handleFormUpdate}
                      onSubmit={handleSubmit}
                      disabled={status !== 'idle'}
                    />
                  </motion.div>
                ) : (
                  <StatusScreen
                    key="status"
                    status={status}
                    attemptCount={attemptCount}
                    maxAttempts={maxAttempts}
                    error={error}
                    onRetry={handleRetry}
                    onReset={resetPayment}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar / History */}
          <div className="lg:col-span-5">
            <div className="sticky top-12 space-y-8">
              {/* Transaction History Card */}
              <div className="rounded-[2rem] bg-slate-100/50 p-6 md:rounded-[2.5rem] md:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/20">
                    <History className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">History</h2>
                </div>
                <TransactionHistory transactions={transactions} />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">PCI DSS</p>
                  <p className="text-xs font-bold text-slate-900">Compliant</p>
                </div>
                <div className="rounded-3xl bg-white p-6 text-center shadow-sm">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <Lock className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">256-bit</p>
                  <p className="text-xs font-bold text-slate-900">Encryption</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <footer className="mt-20 border-t border-slate-200 pt-10 text-center">
        <p className="text-sm font-medium text-slate-400">
          Powered by <span className="font-bold text-slate-900">GravityPay</span> Secure Gateway
        </p>
      </footer>
    </main>
  );
}

