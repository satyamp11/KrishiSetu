import React from 'react';
import { ShieldCheck, Scan, AlertTriangle, MapPin, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import type { Language } from '../../types';
import { FARMER_IMAGES } from '../../mockData';

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
    <section id="hero" className="relative pt-6 pb-16 md:py-24 bg-gradient-to-b from-[#f4f9f4] via-[#fbfbf7] to-white overflow-hidden">
      
      {/* Organic Background Leaf & Flare Accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT CONTENT COLUMN */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300/80 text-emerald-900 text-xs font-black tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'hi' ? 'एआई-संचालित फसल सुरक्षा' : 'AI-Powered Crop Protection'}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1b4332] tracking-tight leading-[1.15] font-serif-title">
              {language === 'hi' ? (
                <>
                  शुरुआती पहचान,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d6a4f] via-emerald-600 to-[#1b4332]">
                    बेहतर फसल सुरक्षा।
                  </span>
                </>
              ) : (
                <>
                  Early Detection,<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2d6a4f] via-emerald-600 to-[#1b4332]">
                    Better Crop Protection.
                  </span>
                </>
              )}
            </h1>

            {/* English Supporting Line */}
            <p className="text-lg sm:text-xl font-bold text-slate-800 tracking-wide">
              Detect crop diseases early. Protect your harvest with AI-powered community alerts.
            </p>

            {/* Short Explanation Description */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-medium">
              {language === 'hi'
                ? 'कृषि शील्ड AI किसानों को शुरुआती चरण में ही फसल रोगों की पहचान करने में मदद करता है और संभावित बीमारी का पता चलने पर आसपास के किसानों को सतर्क करता है।'
                : 'Krishi Shield AI helps farmers identify crop diseases at an early stage and alerts nearby farmers when a potential disease outbreak is detected.'}
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onCheckCrop}
                className="bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#40916c] hover:from-[#2d6a4f] hover:to-[#1b4332] text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-emerald-950/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
              >
                <Scan className="w-5 h-5 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>{language === 'hi' ? 'अपनी फसल की जांच करें' : 'Check Your Crop'}</span>
                <ArrowRight className="w-5 h-5 text-white/80 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLearnMore}
                className="bg-white hover:bg-emerald-50 text-[#1b4332] border-2 border-[#2d6a4f]/30 hover:border-[#2d6a4f] px-7 py-4 rounded-2xl font-bold text-base shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>{language === 'hi' ? 'जानें यह कैसे काम करता है' : 'Learn How It Works'}</span>
              </button>
            </div>

            {/* Small Trust Indicator Below */}
            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-extrabold text-slate-600 border-t border-slate-200/80">
              <div className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Built for Farmers</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Powered by AI</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Community Driven</span>
              </div>
            </div>

          </div>

          {/* RIGHT COMPOSITION COLUMN */}
          <div className="lg:col-span-5 relative mt-6 lg:mt-0">
            
            {/* Main Visual Image Container with Soft Rounded Card Frame */}
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-400/20 via-amber-300/20 to-emerald-600/20 rounded-[36px] blur-xl" />

              {/* Main Image Frame */}
              <div className="relative rounded-[32px] overflow-hidden border-4 border-white shadow-2xl bg-white group">
                <img
                  src={FARMER_IMAGES.farmerPrimary}
                  alt="Indian Farmer inspecting crop field"
                  className="w-full h-[460px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Gradient Overlay for card readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b4332]/60 via-transparent to-black/10" />

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/50 shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold">
                      <ShieldCheck className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-[#1b4332]">
                        {language === 'hi' ? 'खेती और किसान सुरक्षा' : 'Empowering Indian Farmers'}
                      </p>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {language === 'hi' ? 'सटीक एआई जांच और 5km कम्युनिटी नेटवर्क' : 'Precision AI Scans & 5km Village Shield'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FLOATING UI CARDS AROUND IMAGE */}
              
              {/* Card 1: AI Disease Detection (Top Left) */}
              <div className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3 px-4 rounded-2xl border border-emerald-100 shadow-xl flex items-center gap-3 animate-bounce-slow">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md">
                  <Scan className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">AI Disease Detection</p>
                  <p className="text-[10px] font-bold text-emerald-700">94% Confidence Rating</p>
                </div>
              </div>

              {/* Card 2: Early Warning (Top Right) */}
              <div className="absolute -top-3 -right-3 sm:-right-5 bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300/80 p-3 px-4 rounded-2xl shadow-xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center animate-pulse">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-amber-950">Early Warning</p>
                  <p className="text-[10px] font-bold text-amber-800">Prevent Spreading</p>
                </div>
              </div>

              {/* Card 3: 5 km Community Alert (Bottom Right) */}
              <div className="absolute bottom-16 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3 px-4 rounded-2xl border border-emerald-200 shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-900">5 km Community Alert</p>
                  <p className="text-[10px] font-bold text-slate-500">Village Radius Protection</p>
                </div>
              </div>

              {/* Card 4: Crop Protected (Middle Left) */}
              <div className="hidden sm:flex absolute bottom-24 -left-6 bg-[#1b4332] text-white p-2.5 px-3.5 rounded-xl shadow-xl items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">Crop Protected</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
