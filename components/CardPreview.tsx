'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CardType } from '../types/payment';
import { CreditCard } from 'lucide-react';

interface CardPreviewProps {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cardType: CardType;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  cardNumber,
  cardholderName,
  expiryDate,
  cardType,
}) => {
  const displayExpiry = expiryDate || 'MM/YY';
  const displayName = cardholderName || 'CARDHOLDER NAME';

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return <span className="text-2xl font-bold italic text-white">VISA</span>;
      case 'mastercard':
        return (
          <div className="flex -space-x-3">
            <div className="h-8 w-8 rounded-full bg-red-500 opacity-80" />
            <div className="h-8 w-8 rounded-full bg-yellow-500 opacity-80" />
          </div>
        );
      case 'amex':
        return <span className="text-xl font-bold text-white">AMEX</span>;
      default:
        return <CreditCard className="h-8 w-8 text-white/50" />;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="card-gradient card-glow relative aspect-[1.6/1] w-full overflow-hidden rounded-xl p-4 text-white shadow-2xl md:rounded-2xl md:p-6"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="h-8 w-10 rounded bg-yellow-400/80 shadow-inner md:h-10 md:w-12 md:rounded-md" />
          <div className="flex h-8 items-center md:h-10">{getCardIcon()}</div>
        </div>

        <div className="space-y-4 md:space-y-6">
          <div className="text-lg tracking-[0.15em] whitespace-nowrap md:text-2xl md:tracking-[0.2em]">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div className="flex justify-between gap-2">
            <div className="min-w-0 flex-1 space-y-1">
              <p className="text-[8px] uppercase tracking-wider text-white/60 md:text-[10px]">Card Holder</p>
              <p className="truncate text-sm font-medium tracking-wide md:text-base">
                {displayName.toUpperCase()}
              </p>
            </div>
            <div className="shrink-0 space-y-1 text-right">
              <p className="text-[8px] uppercase tracking-wider text-white/60 md:text-[10px]">Expires</p>
              <p className="text-sm font-medium tracking-wide md:text-base">{displayExpiry}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
    </motion.div>
  );
};

export default CardPreview;
