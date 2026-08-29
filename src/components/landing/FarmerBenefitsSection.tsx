import React from 'react';
import { Scan, Users, BrainCircuit, Store, CheckCircle2 } from 'lucide-react';
import type { Language } from '../../types';

interface FarmerBenefitsProps {
  language: Language;
}

export const FarmerBenefitsSection: React.FC<FarmerBenefitsProps> = ({ language }) => {
  const benefits = [
    {
      icon: Scan,
      titleEn: "Early Detection",
      titleHi: "शुरुआती पहचान",
      descEn: "Catch potential problems sooner before crop damage spreads across fields.",
      descHi: "खेत में नुकसान फैलने से पहले ही बीमारी की समय रहते पहचान करें।",
      image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: Users,
      titleEn: "Community Protection",
      titleHi: "सामुदायिक फसल रक्षा",
      descEn: "Warn nearby farmers within 5 km before disease spreads to adjacent land.",
      descHi: "रोग फैलने से पहले ही 5 किमी दायरे के पड़ोसियों को समय पर सूचित करें।",
      image: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: BrainCircuit,
      titleEn: "Smart Decisions",
      titleHi: "स्मार्ट निर्णय",
      descEn: "Use AI and agricultural information to make better treatment decisions.",
      descHi: "एआई और कृषि विशेषज्ञ सलाह से सही स्प्रे और उपचार का चयन करें।",
      image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=400&q=80"
    },
    {
      icon: Store,
      titleEn: "Market Awareness",
      titleHi: "मंडी भाव जागरूकता",
      descEn: "Track current crop and vegetable market prices across state mandis.",
      descHi: "विभिन्न मंडियों के ताज़ा भाव जानकर फसल को सही दाम पर बेचें।",
      image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            {language === 'hi' ? 'किसान-केंद्रित विशेषताएं' : 'Farmer-First Advantages'}
          </span>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4332] tracking-tight font-serif-title">
            {language === 'hi' ? 'किसान हित में निर्मित' : 'Built Around the Farmer'}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium">
            {language === 'hi'
              ? 'कृषि शील्ड AI की हर तकनीक किसान की ज़रूरतों को ध्यान में रखकर तैयार की गई है।'
              : 'Every feature of Krishi Shield AI is designed to protect farmer livelihoods and maximize yield.'}
          </p>
        </div>

        {/* 4 Benefits Cards with Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <div
                key={idx}
                className="bg-[#faf9f6] rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="h-40 relative overflow-hidden bg-slate-200">
                    <img
                      src={benefit.image}
                      alt={benefit.titleEn}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-emerald-800 flex items-center justify-center shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-6 space-y-2">
                    <h3 className="text-xl font-bold text-[#1b4332] group-hover:text-emerald-700 transition-colors">
                      {language === 'hi' ? benefit.titleHi : benefit.titleEn}
                    </h3>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {language === 'hi' ? benefit.descHi : benefit.descEn}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 flex items-center gap-1.5 text-xs font-extrabold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Verified Advantage</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
