'use client';

import { useCallback, useRef } from 'react';
import { usePaymentStore } from './use-payment-store';
import { PaymentResponse, Transaction, PaymentFormData } from '../types/payment';

const MAX_ATTEMPTS = 3;
const TIMEOUT_MS = 6000; // 6 seconds per requirement

export const usePayment = () => {
  const store = usePaymentStore();
  const abortControllerRef = useRef<AbortController | null>(null);

  const processPayment = useCallback(async (payload: PaymentFormData) => {
    // Generate transaction ID if not already present (idempotency)
    const transactionId = store.currentTransactionId || crypto.randomUUID();
    
    if (!store.currentTransactionId) {
      store.setCurrentTransactionId(transactionId);
    }

    store.setStatus('processing');
    store.incrementAttempt();
    store.setError(null);

    const attemptCount = store.attemptCount + 1;

    // Create initial transaction entry if it's the first attempt
    if (attemptCount === 1) {
      const newTransaction: Transaction = {
        id: transactionId,
        amount: payload.amount,
        currency: payload.currency,
        status: 'processing',
        timestamp: Date.now(),
        cardholderName: payload.cardholderName,
        lastFourDigits: payload.cardNumber.slice(-4),
        cardType: payload.cardType,
      };
      store.addTransaction(newTransaction);
    }

    // Setup AbortController for timeout
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    const timeoutId = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }, TIMEOUT_MS);

    try {
      const response = await fetch('/api/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId,
          ...payload,
          attemptCount,
        }),
        signal,
      });

      clearTimeout(timeoutId);

      const data: PaymentResponse = await response.json();

      if (data.success) {
        store.setStatus('success');
        store.updateTransactionStatus(transactionId, 'success');
      } else {
        store.setStatus(data.status);
        store.setError(data.message || 'Payment failed');
        store.updateTransactionStatus(transactionId, data.status, data.message);
      }
    } catch (error: unknown) {
      clearTimeout(timeoutId);
      
      const errorMessage = error instanceof Error ? error.name : 'UnknownError';
      
      if (errorMessage === 'AbortError') {
        store.setStatus('timeout');
        store.setError('Payment request timed out after 6 seconds.');
        store.updateTransactionStatus(transactionId, 'timeout', 'Request timed out');
      } else {
        store.setStatus('failed');
        store.setError('A network error occurred. Please check your connection.');
        store.updateTransactionStatus(transactionId, 'failed', 'Network error');
      }
    } finally {
      abortControllerRef.current = null;
    }
  }, [store]);

  const resetPayment = useCallback(() => {
    store.setStatus('idle');
    store.setCurrentTransactionId(null);
    store.resetAttempts();
    store.setError(null);
  }, [store]);

  return {
    status: store.status,
    transactions: store.transactions,
    attemptCount: store.attemptCount,
    maxAttempts: MAX_ATTEMPTS,
    error: store.error,
    processPayment,
    resetPayment,
  };
};
