import React from 'react';
import { Scan, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Language } from '../../types';

interface CTASectionProps {
  language: Language;
  onCheckCrop: () => void;
  onExploreRates: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  language,
  onCheckCrop,
  onExploreRates,
}) => {
  return (
    <section className="py-10 sm:py-14 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Deep Forest Green Container */}
        <div className="relative rounded-[36px] sm:rounded-[40px] bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white p-6 sm:p-10 md:p-12 shadow-2xl overflow-hidden border border-emerald-600/30 text-center">
          
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl pointer-events-none" />

          {/* Core Content */}
          <div className="relative z-10 max-w-3xl mx-auto space-y-4 sm:space-y-5">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{language === 'hi' ? 'तुरंत सुरक्षा शुरू करें' : 'Start Crop Protection Now'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight font-serif-title leading-tight text-white">
              {language === 'hi' ? (
                <>बीमारी फैलने से पहले अपनी फसल को सुरक्षित करें।</>
              ) : (
                <>Protect Your Crop Before Disease Spreads.</>
              )}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-emerald-100 font-medium leading-relaxed max-w-2xl mx-auto">
              {language === 'hi'
                ? 'फसल की फोटो अपलोड करें, बीमारी का जोखिम जांचें और अपने कृषि समुदाय से हमेशा जुड़े रहें।'
                : 'Upload a crop image, check the risk, and stay informed about your farming community.'}
            </p>

            {/* Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={onCheckCrop}
                className="w-full sm:w-auto bg-emerald-400 hover:bg-emerald-300 text-[#1b4332] px-7 py-3.5 rounded-2xl font-black text-sm sm:text-base shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group"
              >
                <Scan className="w-5 h-5 text-[#1b4332]" />
                <span>{language === 'hi' ? 'अपनी फसल की जांच करें' : 'Check Your Crop'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreRates}
                className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border border-white/30 px-7 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-5 h-5 text-amber-300" />
                <span>{language === 'hi' ? 'मंडी भाव देखें' : 'Explore Market Rates'}</span>
              </button>
            </div>

            {/* Micro Trust Text */}
            <p className="text-[11px] sm:text-xs text-emerald-200/80 font-semibold pt-2">
              Free for Farmers • Instant Camera AI Analysis • 5km Local Outbreak Alert
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
