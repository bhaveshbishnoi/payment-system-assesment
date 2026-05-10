export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed' | 'timeout';

export type CardType = 'visa' | 'mastercard' | 'amex' | 'unknown';

export type Currency = 'INR' | 'USD';

export interface PaymentFormData {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  amount: number;
  currency: Currency;
  cardType: CardType;
}

export interface PaymentPayload extends PaymentFormData {
  transactionId: string;
  attemptCount: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  timestamp: number;
  cardholderName: string;
  lastFourDigits: string;
  cardType: CardType;
  failureReason?: string;
}

export interface PaymentResponse {
  success: boolean;
  status: PaymentStatus;
  message?: string;
}
