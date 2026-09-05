import React from 'react';
import { ArrowRight, Sprout, ShieldCheck, Truck } from 'lucide-react';
import type { Language } from '../../types';
import { HeroFrameCanvas } from './HeroFrameCanvas';

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
      className="relative w-full min-h-[640px] sm:min-h-[720px] lg:min-h-[760px] bg-[#f2f7f0] pt-32 sm:pt-36 lg:pt-40 pb-16 font-sans overflow-hidden border-b border-stone-200 flex flex-col justify-center"
    >
      {/* 1. Animated PNG Frame Sequence Background (Full Screen Cover) */}
      <HeroFrameCanvas totalFrames={300} targetFps={25} fullScreenBackground={true} />

      {/* 2. Responsive Calibrated Scrim Overlays for Maximum Animation Visibility */}
      {/* Desktop overlay: subtle right fade so the live farmer and delivery truck are vibrant and clear */}
      <div className="absolute inset-0 hidden sm:block bg-gradient-to-r from-[#f2f7f0]/50 via-[#f2f7f0]/20 to-transparent pointer-events-none z-0" />
      {/* Mobile overlay: light vertical scrim giving full transparency to the animation while keeping text sharp */}
      <div className="absolute inset-0 sm:hidden bg-gradient-to-b from-[#f2f7f0]/50 via-[#f2f7f0]/20 to-transparent pointer-events-none z-0" />

      {/* 3. Hero Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 text-left p-4 sm:p-0 rounded-3xl bg-white/40 sm:bg-transparent backdrop-blur-[2px] sm:backdrop-blur-none border border-white/50 sm:border-none shadow-xs sm:shadow-none">
          
          {/* Top Pill with Live Simulation Indicator */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/95 border border-emerald-300 text-emerald-950 text-xs font-black shadow-xs">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'स्मार्ट कृषि डिजिटल बाज़ार' : 'SMART AGRICULTURE MARKETPLACE'}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-bold border border-slate-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>300 FPS Simulation</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#0f2d1d] tracking-tight leading-[1.15] font-sans drop-shadow-[0_2px_8px_rgba(255,255,255,0.9)]">
            {language === 'hi' ? (
              <>खेत से बाज़ार तक,<br /><span className="text-emerald-700">बिना किसी बिचौलिए के।</span></>
            ) : (
              <>From Farm to Market,<br /><span className="text-emerald-700">Without the Middlemen.</span></>
            )}
          </h1>

          {/* Paragraph */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-900 max-w-xl leading-relaxed font-semibold drop-shadow-[0_1px_4px_rgba(255,255,255,0.95)]">
            {language === 'hi'
              ? 'किसानों, FPOs, ग्राहकों और थोक खरीदारों को पारदर्शी डिजिटल मंडी, स्मार्ट लॉजिस्टिक्स और AI सलाह से सीधे जोड़ें।'
              : 'Connect directly with farmers, FPOs, consumers and bulk buyers through a transparent digital marketplace powered by intelligent logistics and AI-driven insights.'}
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <button
              onClick={onExploreMarketplace}
              className="bg-[#1b4332] hover:bg-[#143022] text-white px-8 py-4 rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group border border-emerald-900 cursor-pointer active:scale-95"
            >
              <span>{language === 'hi' ? 'मंडी बाज़ार देखें' : 'Explore Marketplace'}</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onJoinAsFarmer}
              className="bg-white hover:bg-emerald-50 text-[#1b4332] border-2 border-[#1b4332] px-7 py-4 rounded-2xl font-extrabold text-base shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>{language === 'hi' ? 'किसान के रूप में जुड़ें' : 'Join as Farmer'}</span>
            </button>
          </div>

          {/* Bottom 5 Icon Pill Items */}
          <div className="pt-6 sm:pt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 border-t border-emerald-900/15 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-slate-900 leading-tight">Direct Farmer Connection</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 font-bold text-xs shadow-2xs">
                ₹
              </div>
              <span className="text-[11px] font-black text-slate-900 leading-tight">Transparent Pricing</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-slate-900 leading-tight">AI-Powered Insights</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                <Truck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-slate-900 leading-tight">Smart Logistics</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-black text-slate-900 leading-tight">Secure Payments</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
