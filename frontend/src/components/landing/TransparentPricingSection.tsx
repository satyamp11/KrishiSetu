import React from 'react';
import { DollarSign, ShieldCheck, ArrowRight, TrendingUp } from 'lucide-react';
import { PriceBreakdown } from '../ui/PriceBreakdown';

export const TransparentPricingSection: React.FC = () => {
  return (
    <section id="pricing-breakdown" className="py-16 bg-[#f4f6f0] border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>DIRECT FARMER REVENUE MODEL</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#143022] font-sans tracking-tight">
            Where Your Money Goes
          </h2>
          <p className="text-sm text-slate-600">
            Eliminating multi-tiered APMC broker commissions so farmers earn 78% of retail value instead of just 40%.
          </p>
        </div>

        {/* Dynamic Infographic Card */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase">Example Transaction</span>
              <h3 className="text-lg font-black text-slate-900">₹100 Retail Consumer Purchase</h3>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-right">
              <span className="text-[10px] font-bold text-slate-500 block">Farmer Share</span>
              <span className="text-sm font-black text-emerald-800">78% Payout</span>
            </div>
          </div>

          {/* Infographic Visual Bar */}
          <div className="space-y-2">
            <div className="flex h-8 rounded-xl overflow-hidden shadow-2xs font-extrabold text-xs text-white text-center leading-8">
              <div className="bg-[#1b4332] w-[78%] transition-all" title="Farmer Earnings (78%)">
                Farmer (₹78)
              </div>
              <div className="bg-amber-600 w-[15%]" title="Logistics (15%)">
                ₹15
              </div>
              <div className="bg-emerald-600 w-[7%]" title="Platform Fee (7%)">
                ₹7
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold pt-2">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                <span className="text-emerald-900 block font-black text-base">₹78</span>
                <span className="text-[11px] text-slate-600">Farmer Receives</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-100">
                <span className="text-amber-900 block font-black text-base">₹15</span>
                <span className="text-[11px] text-slate-600">Logistics & Route</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-stone-200">
                <span className="text-slate-900 block font-black text-base">₹7</span>
                <span className="text-[11px] text-slate-600">Platform Facilitation</span>
              </div>
            </div>
          </div>

          {/* Savings Callout */}
          <div className="p-4 bg-[#edf2ea] rounded-2xl border border-emerald-200 text-xs text-emerald-900 font-medium flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>
              <strong>+₹35 Extra Income for Farmer:</strong> In traditional APMC mandi chains, 40–50% is lost to 4–6 layers of village agents, commission brokers, and wholesalers.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
