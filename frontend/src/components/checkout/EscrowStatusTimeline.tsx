import React from 'react';
import { Clock, Lock, CheckCircle, ArrowLeftCircle, ShieldCheck } from 'lucide-react';

export interface EscrowTimelineEntry {
  status: string;
  timestamp: string | Date;
  note?: string;
  triggeredBy?: string;
}

export interface EscrowStatusTimelineProps {
  timeline: EscrowTimelineEntry[];
  currentPaymentState?: string;
  className?: string;
}

export const EscrowStatusTimeline: React.FC<EscrowStatusTimelineProps> = ({
  timeline = [],
  currentPaymentState = 'PENDING',
  className = '',
}) => {
  // Sort by timestamp descending (newest first)
  const sortedTimeline = [...timeline].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'PENDING_PAYMENT':
        return {
          icon: Clock,
          color: 'text-slate-500',
          bgColor: 'bg-slate-100',
          borderColor: 'border-slate-200',
          label: 'Payment Pending',
        };
      case 'HELD_FOR_ORDER':
      case 'HELD':
        return {
          icon: Lock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          label: 'Funds Held in Escrow',
        };
      case 'RELEASED':
        return {
          icon: CheckCircle,
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          label: 'Funds Released to Farmer',
        };
      case 'REFUNDED':
        return {
          icon: ArrowLeftCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Payment Refunded',
        };
      default:
        return {
          icon: ShieldCheck,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          borderColor: 'border-indigo-200',
          label: status,
        };
    }
  };

  const formatTime = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="text-sm font-black text-slate-900">Escrow Audit Log</h3>
        </div>
        <div className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg uppercase tracking-wider">
          Current: {currentPaymentState.replace(/_/g, ' ')}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {sortedTimeline.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-medium">
            No payment events recorded yet.
          </div>
        ) : (
          <div className="relative space-y-0">
            {/* Vertical Line */}
            <div className="absolute left-4 top-2 bottom-6 w-0.5 bg-slate-100 z-0" />

            {sortedTimeline.map((entry, idx) => {
              const isLatest = idx === 0;
              const config = getStatusConfig(entry.status);
              const Icon = config.icon;

              return (
                <div key={idx} className="relative z-10 flex gap-4 pb-6 last:pb-0 group">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-white
                    ${isLatest ? config.borderColor : 'border-slate-200'}
                  `}>
                    <Icon className={`w-4 h-4 ${isLatest ? config.color : 'text-slate-400'}`} />
                  </div>
                  
                  <div className="flex-1 pt-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className={`text-xs font-black ${isLatest ? 'text-slate-900' : 'text-slate-600'}`}>
                        {config.label}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400 tabular-nums">
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    
                    {entry.note && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1.5">
                        {entry.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
