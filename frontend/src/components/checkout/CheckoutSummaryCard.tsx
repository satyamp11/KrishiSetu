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
  showPayButton?: boolean;
  isBuyer?: boolean;
}

export const CheckoutSummaryCard: React.FC<CheckoutSummaryCardProps> = ({
  orderId,
  amount,
  priceBreakdown,
  escrowStatus,
  onPay,
  isLoading = false,
  showPayButton = true,
  isBuyer = true,
}) => {
  // Map ALL paymentStatus values to visual steps correctly
  // Step 0 = Paid, Step 1 = Held in Escrow, Step 2 = Delivered/Released
  const getStepState = (stepIndex: number): 'completed' | 'active' | 'pending' => {
    switch (escrowStatus) {
      case 'RELEASED':
        return 'completed'; // All 3 steps complete
      case 'HELD_FOR_ORDER':
        if (stepIndex <= 1) return 'completed'; // Paid + Held done
        return 'pending'; // Delivered not yet
      case 'REFUNDED':
        return stepIndex === 0 ? 'completed' : 'pending'; // Only paid step shows
      case 'PENDING':
      default:
        return stepIndex === 0 ? 'active' : 'pending'; // Awaiting payment
    }
  };

  const isHeld = escrowStatus === 'HELD_FOR_ORDER';
  const isReleased = escrowStatus === 'RELEASED';
  const isRefunded = escrowStatus === 'REFUNDED';
  const progressWidth = isReleased ? '100%' : isHeld ? '50%' : '0%';

  const isTestMode = import.meta.env.VITE_RAZORPAY_TEST_MODE === 'true' || import.meta.env.DEV;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col">
      {/* Escrow Trust Banner */}
      <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-black text-emerald-900">Hold & Pay — Secure Escrow Protection</h4>
          <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
            {isBuyer 
              ? "Your payment is held securely and only released to the farmer after you confirm delivery. This protects you from fraud and protects farmers from non-payment."
              : "Payment is secured and held by KrishiSetu. It will be released to you automatically once the buyer confirms delivery."}
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* REFUNDED banner */}
        {isRefunded && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 text-center">
            <p className="text-xs font-bold text-red-700">⚠️ This order was refunded. No payment held.</p>
          </div>
        )}

        {/* 3-Step Horizontal Progress */}
        <div className="flex items-start justify-between px-2 sm:px-6 relative">
          <div className="absolute left-10 right-10 top-4 h-0.5 bg-slate-100 -z-10" />
          
          <div
            className="absolute left-10 top-4 h-0.5 bg-emerald-500 -z-10 transition-all duration-700"
            style={{ width: progressWidth }}
          />

          {/* Step 1: Paid */}
          <div className="flex flex-col items-center gap-1.5 bg-white px-1 max-w-[80px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              getStepState(0) !== 'pending'
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              <Check className="w-4 h-4" />
            </div>
            <span className={`text-[10px] font-bold text-center ${getStepState(0) !== 'pending' ? 'text-slate-900' : 'text-slate-400'}`}>
              Paid
            </span>
          </div>

          {/* Step 2: Held in Escrow */}
          <div className="flex flex-col items-center gap-1.5 bg-white px-1 max-w-[120px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              getStepState(1) === 'completed'
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : getStepState(1) === 'active'
                ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              <Lock className="w-4 h-4" />
            </div>
            <div className="text-center">
              <span className={`text-[10px] font-bold block ${getStepState(1) !== 'pending' ? 'text-slate-900' : 'text-slate-400'}`}>
                {isReleased ? 'Held ✓' : 'Held in Escrow'}
              </span>
              {/* Only show the "not sent to farmer" caption when actually HELD, not after release */}
              {isHeld && (
                <span className="text-[8px] font-semibold text-amber-600 leading-tight hidden sm:block mt-0.5">
                  Money safely held, not yet sent
                </span>
              )}
            </div>
          </div>

          {/* Step 3: Released / Delivered */}
          <div className="flex flex-col items-center gap-1.5 bg-white px-1 max-w-[80px]">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              getStepState(2) === 'completed'
                ? 'border-emerald-500 bg-emerald-500 text-white'
                : 'border-slate-200 bg-slate-50 text-slate-400'
            }`}>
              {isReleased ? <Check className="w-4 h-4" /> : <Truck className="w-4 h-4" />}
            </div>
            <span className={`text-[10px] font-bold text-center ${getStepState(2) === 'completed' ? 'text-emerald-700' : 'text-slate-400'}`}>
              {isReleased ? 'Released ✓' : 'Delivered'}
            </span>
          </div>
        </div>

        {/* Dynamic Price Breakdown */}
        <PriceBreakdown {...priceBreakdown} />
      </div>

      {/* Footer / CTA Actions */}
      {showPayButton && (
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
      )}
    </div>
  );
};
