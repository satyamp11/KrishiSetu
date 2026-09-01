import React from 'react';
import { ShieldCheck, ArrowRight, TrendingUp, Sparkles, Truck, Sprout, Info } from 'lucide-react';
import { Badge } from './Badge';

export interface PriceBreakdownProps {
  consumerTotal: number;
  farmerEarnings: number;
  logisticsCost: number;
  platformFee: number;
  intermediarySavings: number;
  className?: string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  consumerTotal,
  farmerEarnings,
  logisticsCost,
  platformFee,
  intermediarySavings,
  className = '',
}) => {
  const farmerPercent = Math.round((farmerEarnings / (consumerTotal || 1)) * 100);
  const logisticsPercent = Math.round((logisticsCost / (consumerTotal || 1)) * 100);
  const platformPercent = 100 - farmerPercent - logisticsPercent;

  return (
    <div className={`bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-300">
            Transparent Direct Trade Breakdown
          </h4>
        </div>
        <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />}>
          Zero Intermediary Margins
        </Badge>
      </div>

      {/* Primary Consumer Total vs Farmer Share */}
      <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consumer Pays</span>
          <span className="text-xl font-black text-white">₹{consumerTotal.toLocaleString()}</span>
        </div>
        <div className="text-right border-l border-slate-800 pl-3">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Farmer Receives</span>
          <span className="text-xl font-black text-emerald-400">₹{farmerEarnings.toLocaleString()}</span>
        </div>
      </div>

      {/* Allocation Progress Bar */}
      <div className="space-y-1.5">
        <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
          <div className="bg-emerald-500 h-full transition-all" style={{ width: `${farmerPercent}%` }} />
          <div className="bg-amber-500 h-full transition-all" style={{ width: `${logisticsPercent}%` }} />
          <div className="bg-indigo-500 h-full transition-all" style={{ width: `${Math.max(5, platformPercent)}%` }} />
        </div>
        <div className="flex justify-between text-[10px] font-bold text-slate-400">
          <span className="text-emerald-400">🌾 Farmer: {farmerPercent}%</span>
          <span className="text-amber-400">🚚 Logistics: {logisticsPercent}%</span>
          <span className="text-indigo-400">⚡ Platform: {platformPercent}%</span>
        </div>
      </div>

      {/* Detailed Line Items */}
      <div className="space-y-2 text-xs pt-1 border-t border-slate-800/60">
        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Producer / Farmer Share</span>
          </span>
          <span className="font-bold text-white">₹{farmerEarnings.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Logistics & Route Dispatch</span>
          </span>
          <span className="font-bold text-white">₹{logisticsCost.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>Platform Facilitation Fee</span>
          </span>
          <span className="font-bold text-white">₹{platformFee.toLocaleString()}</span>
        </div>
      </div>

      {/* Middleman Savings Callout */}
      <div className="bg-emerald-950/80 p-3 rounded-xl border border-emerald-800 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-emerald-200 font-medium">Intermediary Broker Savings:</span>
        </div>
        <span className="font-black text-emerald-300 bg-emerald-900/90 px-2 py-0.5 rounded-lg border border-emerald-700">
          +₹{intermediarySavings.toLocaleString()} saved
        </span>
      </div>
    </div>
  );
};
