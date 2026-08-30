import React from 'react';
import { ShieldCheck, Heart, Radio, Cpu, Clock } from 'lucide-react';
import type { Language } from '../../types';
import { FARMER_IMAGES } from '../../mockData';

interface FarmerImpactProps {
  language: Language;
}

export const FarmerImpactSection: React.FC<FarmerImpactProps> = ({ language }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-[#f4f9f4] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: EMOTIONAL CONTENT & STATS */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
              <Heart className="w-4 h-4 text-emerald-700 fill-current" />
              <span>{language === 'hi' ? 'किसान सुरक्षा और विश्वास' : 'Empowering Farmer Futures'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4332] tracking-tight font-serif-title leading-tight">
              {language === 'hi' ? 'तकनीक, जो किसान के काम आए' : 'Technology That Works for the Farmer'}
            </h2>

            {/* Short Emotional Message */}
            <p className="text-lg sm:text-xl font-semibold text-slate-800 leading-relaxed italic border-l-4 border-emerald-600 pl-4 py-1 bg-white/60 rounded-r-2xl">
              {language === 'hi'
                ? '"सही समय पर सही जानकारी मिलने से किसान अपनी फसल बचा सकते हैं, नुकसान कम कर सकते हैं और सुरक्षित भविष्य का निर्माण कर सकते हैं।"'
                : '"Better information at the right time can help farmers protect their crops, reduce losses, and build a more secure future."'}
            </p>

            <p className="text-base text-slate-600 font-medium leading-relaxed">
              {language === 'hi'
                ? 'कृषि शील्ड AI किसी जटिल प्रणाली की तरह नहीं, बल्कि किसान के हर दिन के साथी की तरह काम करता है — आसान भाषा और त्वरित सूचनाओं के साथ।'
                : 'Designed with maximum clarity for rural farmers, combining instant camera scans with automatic neighborhood alert broadcasts.'}
            </p>

            {/* STATISTICS CARDS (Prompt specified exact specs: 5 km, AI, Early) */}
            <div className="pt-4 grid grid-cols-3 gap-4">
              
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                  <Radio className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#1b4332] font-serif-title">5 km</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                  {language === 'hi' ? 'सामुदायिक अलर्ट दायरा' : 'Community Alert Radius'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-2">
                  <Cpu className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#1b4332] font-serif-title">AI</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                  {language === 'hi' ? 'फसल विश्लेषण' : 'Crop Analysis'}
                </p>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-2">
                  <Clock className="w-4 h-4 text-amber-700" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-[#1b4332] font-serif-title">Early</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mt-0.5">
                  {language === 'hi' ? 'रोग चेतावनी' : 'Disease Warning'}
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT: FARMER COLLAGE / GRID */}
          <div className="lg:col-span-6 relative">
            <div className="grid grid-cols-2 gap-4">
              
              {/* Farmer Image 1 */}
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-slate-200 h-52">
                  <img
                    src={FARMER_IMAGES.farmerInspect}
                    alt="Indian Farmer inspecting crop"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-slate-900">Prevent Outbreaks</p>
                    <p className="text-[10px] text-slate-500 font-medium">Protect village crops early</p>
                  </div>
                </div>
              </div>

              {/* Farmer Image 2 */}
              <div className="space-y-4 pt-6">
                <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-white bg-slate-200 h-64">
                  <img
                    src={FARMER_IMAGES.farmerGroup}
                    alt="Group of Indian farmers"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
