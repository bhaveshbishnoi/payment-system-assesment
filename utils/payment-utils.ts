import { CardType } from '../types/payment';

export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return v;
  }
};

export const detectCardType = (cardNumber: string): CardType => {
  const cleanNumber = cardNumber.replace(/\D/g, '');
  if (/^4/.test(cleanNumber)) return 'visa';
  if (/^5[1-5]/.test(cleanNumber)) return 'mastercard';
  if (/^3[47]/.test(cleanNumber)) return 'amex';
  return 'unknown';
};

export const validateExpiry = (value: string): boolean => {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false;
  
  const [month, year] = value.split('/').map(Number);
  if (month < 1 || month > 12) return false;
  
  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;
  
  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;
  
  return true;
};

export const validateCVV = (cvv: string, cardType: CardType): boolean => {
  const length = cardType === 'amex' ? 4 : 3;
  return new RegExp(`^\\d{${length}}$`).test(cvv);
};

export const validateCardNumber = (number: string): boolean => {
  const cleanNumber = number.replace(/\D/g, '');
  return cleanNumber.length >= 13 && cleanNumber.length <= 19;
};
