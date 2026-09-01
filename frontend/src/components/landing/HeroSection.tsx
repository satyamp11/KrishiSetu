import React from 'react';
import { ArrowRight, CheckCircle2, ShieldCheck, Sprout, Sparkles, Truck, DollarSign, Users } from 'lucide-react';
import type { Language } from '../../types';

interface HeroSectionProps {
  language: Language;
  onExploreMarketplace?: () => void;
  onJoinAsFarmer?: () => void;
  onLearnMore?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onExploreMarketplace = () => {},
  onJoinAsFarmer = () => {},
  onLearnMore = () => {},
}) => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-[700px] flex flex-col justify-center pt-12 pb-20 bg-[#f4f6f0] overflow-hidden font-sans border-b border-stone-200"
    >
      {/* Background Subtle Organic Leaf Pattern Overlay */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#2e7d32_0.75px,transparent_0.75px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Label Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-[#1b4332] text-xs font-black tracking-wide shadow-2xs">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>SMART AGRICULTURE MARKETPLACE</span>
            </div>

            {/* Large Bold Serif Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#143022] tracking-tight leading-[1.12] font-serif">
              From Farm to Market,<br />
              <span className="text-emerald-700 font-serif italic">Without the Middlemen.</span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-slate-700 max-w-2xl leading-relaxed font-medium">
              Connect directly with farmers, FPOs, consumers and bulk buyers through a transparent digital marketplace powered by intelligent logistics and AI-driven insights.
            </p>

            {/* CTA Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExploreMarketplace}
                className="bg-[#1b4332] hover:bg-[#143022] text-white px-8 py-4 rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group border border-emerald-900"
              >
                <span>Explore Marketplace</span>
                <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onJoinAsFarmer}
                className="bg-white hover:bg-emerald-50 text-[#1b4332] border-2 border-[#1b4332] px-7 py-4 rounded-2xl font-extrabold text-base shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Join as Farmer</span>
              </button>
            </div>

            {/* Small Trust Indicators */}
            <div className="pt-6 border-t border-emerald-900/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-extrabold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Direct Farmer Connection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Transparent Pricing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Smart Logistics</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Secure Payments</span>
              </div>
            </div>

          </div>

          {/* RIGHT VISUAL HERO IMAGE COLUMN */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
              <img
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80"
                alt="Fresh Agricultural Harvest"
                className="w-full h-[420px] object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl text-slate-900 shadow-lg border border-emerald-100 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm text-[#1b4332]">Green Valley Producer FPO</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">Fresh Tomatoes • Nashik, MH • ₹32/kg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Organic Quality Badge */}
            <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-stone-200 hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                100%
              </div>
              <div className="text-left">
                <p className="text-[11px] font-black text-slate-900 leading-tight">Direct Produce</p>
                <p className="text-[10px] text-slate-500">Zero Middleman Markup</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
