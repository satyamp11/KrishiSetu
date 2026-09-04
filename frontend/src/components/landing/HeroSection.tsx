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
      className="relative w-full min-h-[700px] bg-[#f2f7f0] pt-28 lg:pt-36 pb-16 font-sans overflow-hidden border-b border-stone-200 flex items-center"
    >
      {/* Animated PNG Frame Sequence Background */}
      <HeroFrameCanvas totalFrames={300} targetFps={25} fullScreenBackground={true} />

      {/* Subtle light gradient overlay with minimal opacity for maximum animation visibility and clear text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/20 to-transparent pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-2xl lg:max-w-3xl space-y-6 text-left">
          
          {/* Small Green Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-black">
            <Sprout className="w-3.5 h-3.5 text-emerald-700" />
            <span>{language === 'hi' ? 'स्मार्ट कृषि डिजिटल बाज़ार' : 'SMART AGRICULTURE MARKETPLACE'}</span>
          </div>

          {/* Headline */}
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
              className="bg-[#1b4332] hover:bg-[#143022] text-white px-8 py-4 rounded-2xl font-black text-base shadow-md transition-all flex items-center justify-center gap-3 group border border-emerald-900 cursor-pointer"
            >
              <span>{language === 'hi' ? 'मंडी बाज़ार देखें' : 'Explore Marketplace'}</span>
              <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onJoinAsFarmer}
              className="bg-white hover:bg-emerald-50 text-[#1b4332] border-2 border-[#1b4332] px-7 py-4 rounded-2xl font-extrabold text-base shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'hi' ? 'किसान के रूप में जुड़ें' : 'Join as Farmer'}</span>
            </button>
          </div>

          {/* Bottom 5 Icon Pill Items */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 border-t border-emerald-900/10 max-w-3xl">
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
      </div>
    </section>
  );
};

