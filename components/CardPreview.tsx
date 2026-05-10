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
      className="card-gradient card-glow relative aspect-[1.6/1] w-full overflow-hidden rounded-2xl p-6 text-white shadow-2xl"
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="h-10 w-12 rounded-md bg-yellow-400/80 shadow-inner" />
          <div className="flex h-10 items-center">{getCardIcon()}</div>
        </div>

        <div className="space-y-6">
          <div className="text-xl tracking-[0.2em] md:text-2xl">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div className="flex justify-between">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-white/60">Card Holder</p>
              <p className="max-w-[200px] truncate font-medium tracking-wide">
                {displayName.toUpperCase()}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] uppercase tracking-wider text-white/60">Expires</p>
              <p className="font-medium tracking-wide">{displayExpiry}</p>
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
