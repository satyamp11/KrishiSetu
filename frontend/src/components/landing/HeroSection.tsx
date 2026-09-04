import React from 'react';
import { ArrowRight, Sprout, ShieldCheck, MapPin, Truck } from 'lucide-react';
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
      className="relative w-full min-h-[720px] bg-[#f2f7f0] pt-8 pb-16 font-sans overflow-hidden border-b border-stone-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Small Green Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-black">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'स्मार्ट कृषि डिजिटल बाज़ार' : 'SMART AGRICULTURE MARKETPLACE'}</span>
            </div>

            {/* Simple Headline Font */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#143022] tracking-tight leading-[1.15] font-sans">
              {language === 'hi' ? (
                <>खेत से बाज़ार तक,<br /><span className="text-emerald-700">बिना किसी बिचौलिए के।</span></>
              ) : (
                <>From Farm to Market,<br /><span className="text-emerald-700">Without the Middlemen.</span></>
              )}
            </h1>

            {/* Paragraph */}
            <p className="text-base sm:text-lg text-slate-700 max-w-xl leading-relaxed font-medium">
              {language === 'hi'
                ? 'किसानों, FPOs, ग्राहकों और थोक खरीदारों को पारदर्शी डिजिटल मंडी, स्मार्ट लॉजिस्टिक्स और AI सलाह से सीधे जोड़ें।'
                : 'Connect directly with farmers, FPOs, consumers and bulk buyers through a transparent digital marketplace powered by intelligent logistics and AI-driven insights.'}
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onExploreMarketplace}
                className="bg-[#1b4332] hover:bg-[#143022] text-white px-8 py-4 rounded-2xl font-black text-base shadow-md transition-all flex items-center justify-center gap-3 group border border-emerald-900"
              >
                <span>{language === 'hi' ? 'मंडी बाज़ार देखें' : 'Explore Marketplace'}</span>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onJoinAsFarmer}
                className="bg-white hover:bg-emerald-50 text-[#1b4332] border-2 border-[#1b4332] px-7 py-4 rounded-2xl font-extrabold text-base shadow-2xs transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'hi' ? 'किसान के रूप में जुड़ें' : 'Join as Farmer'}</span>
              </button>
            </div>

            {/* Bottom 5 Icon Pill Items */}
            <div className="pt-8 grid grid-cols-5 gap-2 border-t border-emerald-900/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight">Direct Farmer Connection</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs">
                  ₹
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight">Transparent Pricing</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight">AI-Powered Insights</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight">Smart Logistics</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-black text-slate-800 leading-tight">Secure Payments</span>
              </div>
            </div>

          </div>

          {/* RIGHT VISUAL HERO IMAGE & UI MOCKUP OVERLAY */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[500px]">
            
            {/* Background Farmer Photo */}
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80"
                alt="Happy Indian Farmer with Fresh Produce Basket"
                className="w-full h-[520px] object-cover"
              />
            </div>

            {/* Overlaid Mobile Phone App Mockup */}
            <div className="absolute right-4 sm:right-12 top-6 w-64 sm:w-72 bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 text-slate-900 font-sans z-20 hover:scale-105 transition-transform">
              <div className="bg-[#0f281e] text-white p-3 rounded-t-[30px] flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black tracking-tight">NovaKrishi</span>
                </div>
              </div>

              <div className="bg-white p-3 space-y-2 text-xs rounded-b-[30px]">
                <p className="text-[10px] font-bold text-slate-500">Welcome back, Farmer!</p>

                {/* Today's Price Insights */}
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-black text-slate-700 block">Today's Price Insights</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-md bg-red-100 flex items-center justify-center text-[10px]">🍅</div>
                      <div>
                        <span className="font-extrabold text-[10px] block">Tomato</span>
                        <span className="text-[9px] text-slate-500">₹32 / kg</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1 rounded">▲ 8.4%</span>
                  </div>
                  <span className="text-[8px] font-bold text-emerald-700 block">High Demand</span>
                </div>

                {/* Orders Card */}
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 block">Orders</span>
                    <span className="font-black text-sm">12 <span className="text-[9px] font-normal text-slate-400">This Week</span></span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600">+8%</span>
                </div>

                {/* Earnings Card */}
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-500 block">Earnings</span>
                    <span className="font-black text-sm">₹18,450 <span className="text-[9px] font-normal text-slate-400">This Week</span></span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600">+12%</span>
                </div>

                {/* AI Demand Forecast Mini Chart */}
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[9px] font-black text-slate-700 block">AI Demand Forecast</span>
                  <div className="flex items-center justify-between text-[9px] text-slate-500">
                    <span>Tomato (Next 7 Days)</span>
                    <span className="font-black text-emerald-700">+22%</span>
                  </div>
                  <div className="h-6 w-full bg-emerald-100/50 rounded flex items-end p-0.5">
                    <svg className="w-full h-full text-emerald-600" viewBox="0 0 100 30" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M0 25 L25 20 L50 15 L75 8 L100 2" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlaid Delivery Truck Graphic */}
            <div className="absolute -right-6 bottom-4 w-48 sm:w-56 bg-white p-2 rounded-2xl shadow-xl border border-stone-200 z-10 hidden sm:block">
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80"
                  alt="NovaKrishi Delivery Truck"
                  className="w-full h-24 object-cover"
                />
                <div className="absolute top-1 right-1 bg-[#1b4332] text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                  Smart Logistics
                </div>
              </div>
            </div>

            {/* Overlaid Floating Location Pins */}
            <div className="absolute right-36 top-2 bg-white px-2.5 py-1 rounded-xl shadow-md border border-stone-200 flex items-center gap-1.5 text-[10px] font-black text-slate-800 z-20">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>From Farm</span>
            </div>

            <div className="absolute right-4 bottom-2 bg-white px-2.5 py-1 rounded-xl shadow-md border border-stone-200 flex items-center gap-1.5 text-[10px] font-black text-slate-800 z-20">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>To Your Doorstep</span>
            </div>

            {/* Overlaid 100% Safe & Secure Escrow Badge */}
            <div className="absolute left-2 bottom-2 bg-white p-3 rounded-2xl shadow-xl border border-emerald-200 z-30 flex items-center gap-3 max-w-xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-xs text-slate-900 block">100% Safe & Secure</span>
                <span className="text-[10px] text-slate-500 block leading-tight">Escrow Protected Payments. No Middlemen. Fair Prices.</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
