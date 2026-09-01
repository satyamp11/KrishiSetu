import React, { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // e.g. +12.5 or -3.4
  changeLabel?: string; // e.g. "vs Mandi avg"
  icon?: ReactNode;
  variant?: 'emerald' | 'amber' | 'slate' | 'earth';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel = 'vs benchmark',
  icon,
  variant = 'emerald',
  className = '',
}) => {
  const iconBackgrounds = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-800',
    slate: 'bg-slate-100 text-slate-700',
    earth: 'bg-stone-200 text-stone-800',
  };

  const getTrendBadge = () => {
    if (change === undefined) return null;
    if (change > 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>+{change}%</span>
        </span>
      );
    }
    if (change < 0) {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>{change}%</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
        <Minus className="w-3.5 h-3.5" />
        <span>0%</span>
      </span>
    );
  };

  return (
    <div className={`bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
          <div className="text-2xl font-black text-slate-900 mt-1 tracking-tight">{value}</div>
        </div>
        {icon && (
          <div className={`p-2.5 rounded-xl shrink-0 ${iconBackgrounds[variant]}`}>
            {icon}
          </div>
        )}
      </div>

      {(change !== undefined || subtitle) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change !== undefined && (
            <div className="flex items-center gap-2">
              {getTrendBadge()}
              {changeLabel && <span className="text-slate-500 font-medium">{changeLabel}</span>}
            </div>
          )}
          {subtitle && <span className="text-slate-500 font-medium ml-auto">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
