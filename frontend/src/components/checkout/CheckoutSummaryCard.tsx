import React from 'react';
import { Lock, ShieldCheck, Truck, Check, Info } from 'lucide-react';
import { Button } from '../ui';
import { PriceBreakdown, PriceBreakdownProps } from '../ui/PriceBreakdown';

export type EscrowStatus = 'PENDING' | 'HELD_FOR_ORDER' | 'RELEASED' | 'REFUNDED';

export interface CheckoutSummaryCardProps {
  orderId?: string; // Optional if we haven't created the order yet
  amount: number;
  priceBreakdown: Omit<PriceBreakdownProps, 'className'>;
  escrowStatus: EscrowStatus;
  onPay: () => void;
  isLoading?: boolean;
}

export const CheckoutSummaryCard: React.FC<CheckoutSummaryCardProps> = ({
  orderId,
  amount,
  priceBreakdown,
  escrowStatus,
  onPay,
  isLoading = false,
}) => {
  // Determine current step in escrow flow
  const getStepState = (stepIndex: number) => {
    if (escrowStatus === 'RELEASED') return 'completed';
    if (escrowStatus === 'HELD_FOR_ORDER') {
      return stepIndex <= 1 ? 'completed' : 'pending';
    }
    // PENDING status
    return stepIndex === 0 ? 'active' : 'pending';
  };

  const isTestMode = import.meta.env.VITE_RAZORPAY_TEST_MODE === 'true' || import.meta.env.DEV;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
      {/* Escrow Trust Banner */}
      <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-black text-emerald-900">100% Escrow Protection</h4>
          <p className="text-xs text-emerald-700 mt-0.5">
            Your payment stays in a secure escrow account and is only released to the farmer after delivery is confirmed.
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* 3-Step Horizontal Progress */}
        <div className="flex items-center justify-between px-2 sm:px-6 relative">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-slate-100 -z-10" />
          
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-0.5 bg-emerald-500 -z-10 transition-all duration-500" 
               style={{ width: escrowStatus === 'RELEASED' ? '100%' : escrowStatus === 'HELD_FOR_ORDER' ? '50%' : '0%' }} 
          />

          {/* Step 1: Paid */}
          <div className="flex flex-col items-center gap-2 bg-white px-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              getStepState(0) === 'completed' || getStepState(0) === 'active' 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              <Check className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-bold ${getStepState(0) === 'completed' || getStepState(0) === 'active' ? 'text-slate-900' : 'text-slate-400'}`}>
              Paid
            </span>
          </div>

          {/* Step 2: Held in Escrow */}
          <div className="flex flex-col items-center gap-2 bg-white px-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              getStepState(1) === 'completed' || getStepState(1) === 'active' 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-bold ${getStepState(1) === 'completed' || getStepState(1) === 'active' ? 'text-slate-900' : 'text-slate-400'}`}>
              Held in Escrow
            </span>
          </div>

          {/* Step 3: Delivered */}
          <div className="flex flex-col items-center gap-2 bg-white px-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              getStepState(2) === 'completed' || getStepState(2) === 'active' 
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              <Truck className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-bold ${getStepState(2) === 'completed' || getStepState(2) === 'active' ? 'text-slate-900' : 'text-slate-400'}`}>
              Delivered
            </span>
          </div>
        </div>

        {/* Dynamic Price Breakdown */}
        <PriceBreakdown {...priceBreakdown} />
      </div>

      {/* Footer / CTA Actions */}
      <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col gap-3">
        <Button
          variant="primary"
          size="lg"
          className="w-full relative shadow-emerald-500/20 shadow-lg hover:shadow-emerald-500/30 transition-all text-sm h-12"
          onClick={onPay}
          isLoading={isLoading}
          disabled={isLoading || escrowStatus !== 'PENDING'}
          leftIcon={<Lock className="w-4 h-4 text-emerald-100" />}
        >
          {escrowStatus === 'PENDING' 
            ? `Pay ₹${amount.toLocaleString()} Securely` 
            : `Payment Secured in Escrow`}
        </Button>

        <div className="flex items-center justify-between text-[10px] px-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secured by Razorpay
          </div>
          
          {isTestMode && (
            <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              <Info className="w-3 h-3" />
              Test Mode
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
