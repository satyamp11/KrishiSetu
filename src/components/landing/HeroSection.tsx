import React from 'react';
import { Scan, CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Radio, Cpu } from 'lucide-react';
import type { Language } from '../../types';
import { HeroFrameCanvas } from './HeroFrameCanvas';

interface HeroSectionProps {
  language: Language;
  onCheckCrop: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  language,
  onCheckCrop,
  onLearnMore,
}) => {
  return (
    <section
      id="hero"
      className="relative w-full min-h-screen md:min-h-[750px] flex flex-col justify-center overflow-hidden pt-24 pb-16 bg-slate-950"
    >
      {/* 1. FULL-SCREEN CANVAS ANIMATION BACKGROUND */}
      <HeroFrameCanvas totalFrames={300} targetFps={25} fullScreenBackground={true} />

      {/* 2. SUBTLE NEUTRAL OVERLAY (Minimal green tint for maximum animation clarity) */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-black/70 via-black/25 to-transparent" />
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/50 via-transparent to-black/30" />


      {/* 3. HERO CONTENT CONTAINER (ABOVE ANIMATION Z-20) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black tracking-wide backdrop-blur-md shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'hi' ? 'एआई-संचालित फसल सुरक्षा' : 'AI-Powered Crop Protection'}</span>
            </div>

            {/* Main Heading (Manrope 800) */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-serif-title drop-shadow-lg">
              {language === 'hi' ? (
                <>
                  शुरुआती पहचान,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-200">
                    बेहतर फसल सुरक्षा।
                  </span>
                </>
              ) : (
                <>
                  Early Detection,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-amber-200">
                    Better Crop Protection.
                  </span>
                </>
              )}
            </h1>

            {/* English Supporting Line (Inter) */}
            <p className="text-lg sm:text-xl font-bold text-emerald-100 tracking-wide font-sans-body drop-shadow">
              Detect crop diseases early. Protect your harvest with AI-powered community alerts.
            </p>

            {/* Short Explanation Description */}
            <p className="text-base sm:text-lg text-emerald-200/90 max-w-2xl leading-relaxed font-medium font-sans-body drop-shadow-sm">
              {language === 'hi'
                ? 'कृषि शील्ड AI किसानों को शुरुआती चरण में ही फसल रोगों की पहचान करने में मदद करता है और संभावित बीमारी का पता चलने पर आसपास के किसानों को सतर्क करता है।'
                : 'Krishi Shield AI helps farmers identify crop diseases at an early stage and alerts nearby farmers when a potential disease outbreak is detected.'}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onCheckCrop}
                className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-[#1b4332] hover:from-emerald-400 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-emerald-950/50 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group border border-emerald-400/40"
              >
                <Scan className="w-5 h-5 text-emerald-200 group-hover:scale-110 transition-transform" />
                <span>{language === 'hi' ? 'अपनी फसल की जांच करें' : 'Check Your Crop'}</span>
                <ArrowRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLearnMore}
                className="bg-slate-900/60 hover:bg-slate-900/80 text-emerald-100 border border-emerald-400/30 hover:border-emerald-400 px-7 py-4 rounded-2xl font-bold text-base backdrop-blur-md shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'hi' ? 'जानें यह कैसे काम करता है' : 'Learn How It Works'}</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-extrabold text-emerald-200/80 border-t border-emerald-500/20">
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Built for Farmers</span>
              </div>
              <span className="text-emerald-500/50">•</span>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Powered by AI</span>
              </div>
              <span className="text-emerald-500/50">•</span>
              <div className="flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Community Driven</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: FLOATING AI INFORMATION INDICATORS OVER ANIMATION */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex flex-col gap-4 items-start lg:items-end">
            
            {/* Indicator 1: AI Crop Sentinel */}
            <div className="bg-black/50 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 text-white max-w-xs animate-bounce-slow">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <p className="text-xs font-black text-emerald-200">AI Field Sentinel</p>
                </div>
                <p className="text-[11px] font-bold text-slate-300 mt-0.5">Real-Time Crop Health Monitoring</p>
              </div>
            </div>

            {/* Indicator 2: 5km Protection Shield */}
            <div className="bg-black/50 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 text-white max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-black text-amber-200">5 km Village Protection Shield</p>
                <p className="text-[11px] font-bold text-slate-300 mt-0.5">Early Outbreak Signal Active</p>
              </div>
            </div>

            {/* Indicator 3: Live Radar Alert */}
            <div className="bg-black/50 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-white/20 shadow-2xl flex items-center gap-3 text-white max-w-xs">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center shrink-0">
                <Radio className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-black text-teal-200">Community Warning Network</p>
                <p className="text-[11px] font-bold text-slate-300 mt-0.5">Instant Farmer Alerts Broadcast</p>
              </div>
            </div>


          </div>

        </div>
      </div>
    </section>
  );
};
