import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
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
    <section id="farmers" className="relative w-full py-20 min-h-[580px] bg-stone-900 overflow-hidden font-sans border-b border-stone-200 flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <img
          src="/images/novakrishi-empowering-farmers.jpg"
          alt="NovaKrishi Empowering Farmers in Green Fields"
          className="w-full h-full object-cover object-center"
        />
        {/* White gradient mask strictly on left ~52% to keep text readable while leaving right photo 100% clear */}
        <div className="absolute inset-y-0 left-0 w-full md:w-3/5 lg:w-[52%] bg-gradient-to-r from-white via-white/90 to-transparent z-0" />
      </div>

      {/* Content Container (Constrained on Left) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-md lg:max-w-lg space-y-6 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-black">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'किसानों का सशक्तिकरण' : 'EMPOWERING PRODUCERS'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#143022] font-sans tracking-tight leading-tight">
            {language === 'hi' ? (
              <>बेहतर बाज़ार।<br /><span className="text-emerald-700">बेहतर कमाई।</span></>
            ) : (
              <>Better Markets.<br /><span className="text-emerald-700">Better Earnings.</span></>
            )}
          </h2>

          <p className="text-base text-slate-700 leading-relaxed font-medium">
            {language === 'hi'
              ? 'नोवाकृषि किसानों और एफपीओ (FPOs) को सीधे खरीदारों से जोड़ता है, जिससे पारदर्शी मंडी भाव और अधिक मुनाफा मिलता है।'
              : 'NovaKrishi equips farmers and agricultural producer organizations (FPOs) with direct buyer connections, fair mandi price benchmarks, and smart logistics to maximize revenue.'}
          </p>

          {/* Benefit Bullets */}
          <div className="space-y-4 pt-2 text-xs font-extrabold text-slate-800">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-sm text-slate-900 block">{language === 'hi' ? 'सीधे खरीदारों तक पहुंचें' : 'Reach More Direct Buyers'}</span>
                <span className="text-slate-600 font-medium">{language === 'hi' ? 'ग्राहकों, थोक खरीदारों व रेस्टोरेंट्स को सीधे अपनी फसल बेचें।' : 'Sell directly to retail consumers, restaurants, processors, and bulk buyers.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-sm text-slate-900 block">{language === 'hi' ? 'असली मंडी भाव जानें' : 'Discover Real Mandi Prices'}</span>
                <span className="text-slate-600 font-medium">{language === 'hi' ? 'फसल की कीमत तय करने से पहले लाइव मंडी भाव की जानकारी प्राप्त करें।' : 'Access live mandi benchmark prices before pricing your harvest.'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-black text-sm text-slate-900 block">{language === 'hi' ? 'बिचौलियों से मुक्ति' : 'Eliminate Intermediary Dependency'}</span>
                <span className="text-slate-600 font-medium">{language === 'hi' ? 'बिना किसी दलाल कटौती या छिपे हुए कमीशन के व्यापार।' : 'No village agent deductions or undisclosed commission cuts.'}</span>
              </div>
            </div>
          </div>

          {/* Green CTA Button */}
          <div className="pt-4">
            <button
              onClick={onStartSelling}
              className="bg-[#1b4332] hover:bg-[#143022] text-white px-8 py-4 rounded-2xl font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 group border border-emerald-900 cursor-pointer"
            >
              <span>{language === 'hi' ? 'बिक्री शुरू करें' : 'Start Selling'}</span>
              <ArrowRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
