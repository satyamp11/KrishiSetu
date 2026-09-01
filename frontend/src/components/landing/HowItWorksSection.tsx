import React from 'react';
import { Sprout, Search, ShoppingBag, Truck, CheckCircle2, DollarSign } from 'lucide-react';
import type { Language } from '../../types';

interface HowItWorksProps {
  language: Language;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ language }) => {
  const steps = [
    {
      step: '01',
      title: 'Farmer Lists Produce',
      description: 'Farmers and FPOs list harvested produce with quantity, harvest date, and baseline price.',
      icon: Sprout,
    },
    {
      step: '02',
      title: 'Buyer Discovers',
      description: 'Consumers & bulk buyers search fresh produce directly from verified regional producers.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Order Placed & Escrow Held',
      description: 'Buyer places an order; funds are securely locked in transparent Escrow protection.',
      icon: ShoppingBag,
    },
    {
      step: '04',
      title: 'Smart Logistics Dispatch',
      description: 'AI route optimization assigns nearest cold-chain vehicle for door-to-door dispatch.',
      icon: Truck,
    },
    {
      step: '05',
      title: 'Delivery & Quality Inspection',
      description: 'Buyer inspects fresh produce upon arrival and confirms order fulfillment.',
      icon: CheckCircle2,
    },
    {
      step: '06',
      title: 'Farmer Gets Paid Instantly',
      description: 'Escrow automatically releases 100% payout directly into the farmer bank account.',
      icon: DollarSign,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
            TRANSPARENT DIRECT WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#143022] font-sans tracking-tight">
            How KrishiSetu Works
          </h2>
          <p className="text-sm text-slate-600">
            A seamless 6-step agricultural trade workflow connecting farmers directly with buyers.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#f4f6f0] p-6 rounded-3xl border border-stone-200 relative hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#1b4332] flex items-center justify-center font-black shadow-2xs border border-stone-200">
                    <Icon className="w-5 h-5 text-emerald-700" />
                  </div>
                  <span className="text-2xl font-black text-emerald-800/40 font-serif">{item.step}</span>
                </div>

                <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
