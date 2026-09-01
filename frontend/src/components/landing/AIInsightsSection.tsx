import React from 'react';
import { Cpu, TrendingUp, Truck, Sparkles, Sprout, ArrowRight } from 'lucide-react';

interface AIInsightsSectionProps {
  onExploreAI?: () => void;
}

export const AIInsightsSection: React.FC<AIInsightsSectionProps> = ({
  onExploreAI = () => {},
}) => {
  const cards = [
    {
      icon: Cpu,
      title: 'AI Demand Forecast',
      subtitle: 'Predict Upcoming Demand Spikes',
      description:
        'Analyzes regional crop yields, climate patterns, and consumer purchasing spikes to recommend optimal harvest timing.',
      badge: 'Demand Intelligence',
    },
    {
      icon: TrendingUp,
      title: 'Price Insights',
      subtitle: 'Understand Market Rate Trends',
      description:
        'Tracks real-time mandi prices across states to advise farmers when and where to list produce for maximum profit.',
      badge: 'Mandi Benchmarks',
    },
    {
      icon: Truck,
      title: 'Smart Route Optimization',
      subtitle: 'Reduce Transit Distance & Cost',
      description:
        'Uses Vehicle Routing Problem (VRP) algorithms to optimize multi-stop pickup routes and lower logistics fees.',
      badge: 'Logistics VRP Engine',
    },
  ];

  return (
    <section id="ai-insights" className="py-16 bg-[#e8f2e6] border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>INTELLIGENT AGRICULTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#143022] font-sans tracking-tight">
            AI That Helps Farmers Decide Better.
          </h2>
          <p className="text-sm text-slate-600">
            Practical AI models designed specifically for smallholders and FPOs to eliminate post-harvest waste and maximize income.
          </p>
        </div>

        {/* 3 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-stone-200 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1b4332] flex items-center justify-center border border-emerald-200">
                      <Icon className="w-6 h-6 text-emerald-700" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full border border-emerald-200">
                      {c.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-slate-900">{c.title}</h3>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">{c.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">{c.description}</p>
                </div>

                <button
                  onClick={onExploreAI}
                  className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-black text-[#1b4332] hover:text-emerald-700 w-full"
                >
                  <span>Explore AI Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
