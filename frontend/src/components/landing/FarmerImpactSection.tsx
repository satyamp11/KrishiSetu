import React from 'react';
import { Sprout, CheckCircle2, ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import type { Language } from '../../types';

interface FarmerImpactProps {
  language: Language;
  onStartSelling?: () => void;
}

export const FarmerImpactSection: React.FC<FarmerImpactProps> = ({
  language,
  onStartSelling = () => {},
}) => {
  return (
    <section id="farmers" className="py-16 bg-white border-b border-stone-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: AGRICULTURAL IMAGE */}
          <div className="lg:col-span-6 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80"
                alt="Indian Farmer in Green Fields"
                className="w-full h-[460px] object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Overlay Badge */}
            <div className="absolute -bottom-6 -right-4 bg-emerald-950 text-white p-5 rounded-3xl shadow-xl border border-emerald-800 hidden sm:block max-w-xs">
              <div className="flex items-center gap-2 mb-1">
                <Sprout className="w-5 h-5 text-emerald-400" />
                <span className="font-black text-sm text-emerald-300">NovaKrishi Impact</span>
              </div>
              <p className="text-xs text-slate-300">
                140+ Verified FPOs connected across UP, Maharashtra, and MP.
              </p>
            </div>
          </div>

          {/* RIGHT: TEXT & VALUE PROPOSITION */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>EMPOWERING PRODUCERS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#143022] font-sans tracking-tight leading-tight">
              Better Markets.<br />
              <span className="text-emerald-700">Better Earnings.</span>
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              NovaKrishi equips farmers and agricultural producer organizations (FPOs) with direct buyer connections, fair mandi price benchmarks, and smart logistics to maximize revenue.
            </p>

            {/* Benefit Bullets */}
            <div className="space-y-3 pt-2 text-xs font-extrabold text-slate-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-sm text-slate-900 block">Reach More Direct Buyers</span>
                  <span className="text-slate-500 font-medium">Sell directly to retail consumers, restaurants, processors, and bulk buyers.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-sm text-slate-900 block">Discover Real Mandi Prices</span>
                  <span className="text-slate-500 font-medium">Access live mandi benchmark prices before pricing your harvest.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-black text-sm text-slate-900 block">Eliminate Intermediary Dependency</span>
                  <span className="text-slate-500 font-medium">No village agent deductions or undisclosed commission cuts.</span>
                </div>
              </div>
            </div>

            {/* Green CTA Button */}
            <div className="pt-4">
              <button
                onClick={onStartSelling}
                className="bg-[#1b4332] hover:bg-[#143022] text-white px-8 py-4 rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group border border-emerald-900"
              >
                <span>Start Selling</span>
                <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
