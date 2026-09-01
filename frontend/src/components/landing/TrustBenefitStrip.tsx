import React from 'react';
import { Sprout, DollarSign, Cpu, Truck, ShieldCheck } from 'lucide-react';

export const TrustBenefitStrip: React.FC = () => {
  const benefits = [
    {
      icon: Sprout,
      title: 'Direct From Farmers',
      subtitle: 'Zero APMC broker markups',
    },
    {
      icon: DollarSign,
      title: 'Transparent Prices',
      subtitle: 'Dynamic cost breakdown',
    },
    {
      icon: Cpu,
      title: 'AI-Powered Insights',
      subtitle: 'Demand & price forecasts',
    },
    {
      icon: Truck,
      title: 'Smart Delivery',
      subtitle: 'Cold-chain GPS tracking',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      subtitle: '100% Escrow protected',
    },
  ];

  return (
    <div className="bg-[#edf2ea] border-b border-stone-200 py-6 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
        {benefits.map((b, idx) => {
          const Icon = b.icon;
          return (
            <div key={idx} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/60 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center shadow-2xs border border-emerald-200/80 shrink-0">
                <Icon className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-900 leading-snug">{b.title}</h4>
                <p className="text-[10px] font-bold text-slate-500">{b.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
