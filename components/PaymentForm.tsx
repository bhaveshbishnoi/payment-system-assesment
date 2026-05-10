'use client';

import React, { useState, useEffect } from 'react';
import { PaymentFormData, Currency } from '../types/payment';
import { 
  formatCardNumber, 
  detectCardType, 
  validateCardNumber, 
  validateExpiry, 
  validateCVV 
} from '../utils/payment-utils';
import { CreditCard, User, Calendar, Lock, IndianRupee, DollarSign } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PaymentFormProps {
  onFormUpdate: (data: PaymentFormData) => void;
  onSubmit: (data: PaymentFormData) => void;
  disabled?: boolean;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ onFormUpdate, onSubmit, disabled }) => {
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    amount: '',
    currency: 'INR' as Currency,
  });

  const [errors, setErrors] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryDate: '',
    cvv: '',
    amount: '',
  });

  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const cardType = detectCardType(formData.cardNumber);

  useEffect(() => {
    onFormUpdate({
      ...formData,
      amount: parseFloat(formData.amount) || 0,
      cardType,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'cardNumber':
        return validateCardNumber(value) ? '' : 'Invalid card number';
      case 'cardholderName':
        return value.trim().length >= 3 ? '' : 'Name too short';
      case 'expiryDate':
        return validateExpiry(value) ? '' : 'Invalid expiry (MM/YY)';
      case 'cvv':
        return validateCVV(value, cardType) ? '' : 'Invalid CVV';
      case 'amount':
        return parseFloat(value) > 0 ? '' : 'Amount must be greater than 0';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'cardNumber') {
      newValue = formatCardNumber(value);
    } else if (name === 'expiryDate') {
      // Auto-format MM/YY
      newValue = value.replace(/\D/g, '').slice(0, 4);
      if (newValue.length >= 2) {
        newValue = newValue.slice(0, 2) + '/' + newValue.slice(2);
      }
    } else if (name === 'cvv') {
      newValue = value.replace(/\D/g, '').slice(0, cardType === 'amex' ? 4 : 3);
    }

    const updatedFormData = { ...formData, [name]: newValue };
    setFormData(updatedFormData);
    
    // Notify parent for live preview
    onFormUpdate({
      ...updatedFormData,
      amount: parseFloat(updatedFormData.amount) || 0,
      cardType: detectCardType(updatedFormData.cardNumber),
    });

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, newValue) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const isValid = 
    !errors.cardNumber && formData.cardNumber &&
    !errors.cardholderName && formData.cardholderName &&
    !errors.expiryDate && formData.expiryDate &&
    !errors.cvv && formData.cvv &&
    !errors.amount && formData.amount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount),
        cardType,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Amount & Currency */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Payment Amount</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                {formData.currency === 'INR' ? (
                  <IndianRupee className="h-4 w-4 text-slate-400" />
                ) : (
                  <DollarSign className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                className={cn(
                  "block w-full rounded-xl border-slate-200 bg-white py-3 pl-10 pr-3 text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                  errors.amount && touched.amount && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                )}
                disabled={disabled}
              />
            </div>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="rounded-xl border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              disabled={disabled}
            >
              <option value="INR">INR</option>
              <option value="USD">USD</option>
            </select>
          </div>
          {errors.amount && touched.amount && (
            <p className="mt-1 text-xs text-red-500" id="amount-error">{errors.amount}</p>
          )}
        </div>

        {/* Card Number */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Card Number</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <CreditCard className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="0000 0000 0000 0000"
              className={cn(
                "block w-full rounded-xl border-slate-200 bg-white py-3 pl-10 pr-3 text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors.cardNumber && touched.cardNumber && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              aria-describedby={errors.cardNumber ? "card-number-error" : undefined}
              disabled={disabled}
            />
            {cardType !== 'unknown' && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                  {cardType}
                </span>
              </div>
            )}
          </div>
          {errors.cardNumber && touched.cardNumber && (
            <p className="mt-1 text-xs text-red-500" id="card-number-error">{errors.cardNumber}</p>
          )}
        </div>

        {/* Cardholder Name */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-700">Cardholder Name</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <User className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="cardholderName"
              value={formData.cardholderName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="John Doe"
              className={cn(
                "block w-full rounded-xl border-slate-200 bg-white py-3 pl-10 pr-3 text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors.cardholderName && touched.cardholderName && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              disabled={disabled}
            />
          </div>
          {errors.cardholderName && touched.cardholderName && (
            <p className="mt-1 text-xs text-red-500" id="name-error">{errors.cardholderName}</p>
          )}
        </div>

        {/* Expiry Date */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Expiry Date</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Calendar className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="MM/YY"
              className={cn(
                "block w-full rounded-xl border-slate-200 bg-white py-3 pl-10 pr-3 text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors.expiryDate && touched.expiryDate && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              disabled={disabled}
            />
          </div>
          {errors.expiryDate && touched.expiryDate && (
            <p className="mt-1 text-xs text-red-500" id="expiry-error">{errors.expiryDate}</p>
          )}
        </div>

        {/* CVV */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">CVV</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="password"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="•••"
              className={cn(
                "block w-full rounded-xl border-slate-200 bg-white py-3 pl-10 pr-3 text-slate-900 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
                errors.cvv && touched.cvv && "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              )}
              disabled={disabled}
            />
          </div>
          {errors.cvv && touched.cvv && (
            <p className="mt-1 text-xs text-red-500" id="cvv-error">{errors.cvv}</p>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || disabled}
        className={cn(
          "w-full rounded-xl py-4 text-sm font-bold text-white shadow-lg transition-all active:scale-[0.98]",
          isValid && !disabled 
            ? "bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/20" 
            : "cursor-not-allowed bg-slate-300 shadow-none"
        )}
      >
        {disabled ? 'Processing...' : `Pay ${formData.currency} ${formData.amount || '0.00'}`}
      </button>
    </form>
  );
};

export default PaymentForm;
