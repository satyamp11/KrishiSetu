import React from 'react';
import { Search, Radio, Cpu, Compass, AlertCircle } from 'lucide-react';
import type { Language } from '../../types';

interface ProblemSolutionProps {
  language: Language;
}

export const ProblemSolutionSection: React.FC<ProblemSolutionProps> = ({ language }) => {
  const cards = [
    {
      icon: Search,
      titleEn: "Early Disease Detection",
      titleHi: "बीमारी की शुरुआती पहचान",
      descEn: "Identify possible crop diseases before they spread across the field.",
      descHi: "खेत में बीमारी फैलने से पहले ही शुरुआती लक्षणों को पहचानें।",
      badgeEn: "Early Diagnosis",
      badgeHi: "त्वरित पहचान",
      color: "from-emerald-500/10 to-emerald-600/5 text-emerald-800 border-emerald-200"
    },
    {
      icon: Radio,
      titleEn: "Community Warning",
      titleHi: "सामुदायिक चेतावनी (Alert)",
      descEn: "Alert nearby farmers when a disease outbreak is detected.",
      descHi: "बीमारी का प्रकोप मिलते ही 5 किमी दायरे के पड़ोसी किसानों को तुरंत सूचित करें।",
      badgeEn: "5km Radius Alert",
      badgeHi: "5 किमी सुरक्षा दायरा",
      color: "from-amber-500/10 to-amber-600/5 text-amber-900 border-amber-200"
    },
    {
      icon: Cpu,
      titleEn: "AI-Powered Analysis",
      titleHi: "एआई-आधारित विश्लेषण",
      descEn: "Use AI-assisted image analysis to identify potential crop health issues.",
      descHi: "पत्ती की फोटो से एआई द्वारा फसल के स्वास्थ्य और कीट-रोग का विश्लेषण प्राप्त करें।",
      badgeEn: "Neural Vision AI",
      badgeHi: "एआई न्यूरल विज़न",
      color: "from-teal-500/10 to-teal-600/5 text-teal-900 border-teal-200"
    },
    {
      icon: Compass,
      titleEn: "Better Decisions",
      titleHi: "सटीक और बेहतर निर्णय",
      descEn: "Give farmers useful information to make faster and smarter decisions.",
      descHi: "फसल उपचार, बचाव और मंडी भाव की सटीक जानकारी से सही निर्णय लें।",
      badgeEn: "Smart Farming",
      badgeHi: "स्मार्ट निर्णय",
      color: "from-green-500/10 to-emerald-600/5 text-emerald-950 border-emerald-200"
    }
  ];

  return (
    <section id="problem" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-900 text-xs font-black">
            <AlertCircle className="w-4 h-4 text-emerald-700" />
            <span>{language === 'hi' ? 'समस्या और समाधान' : 'Problem & Solution'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4332] tracking-tight font-serif-title">
            {language === 'hi' ? 'समय रहते फसल की सुरक्षा' : 'Protecting Crops Before It’s Too Late'}
          </h2>

          <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            {language === 'hi'
              ? 'अकेले किसान के लिए समय पर बीमारी पहचानना मुश्किल होता है। नोवाकृषि AI व्यक्तिगत जांच को पूरे गांव के सुरक्षा घेरे में बदल देता है।'
              : 'Traditional disease detection happens when crops are already damaged. NovaKrishi AI turns early detection into community-wide crop defense.'}
          </p>
        </div>

        {/* 4 Feature Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#faf9f6] rounded-3xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Badge */}
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-emerald-300" />
                    </div>
                    <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900">
                      {language === 'hi' ? card.badgeHi : card.badgeEn}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#1b4332] group-hover:text-emerald-700 transition-colors">
                    {language === 'hi' ? card.titleHi : card.titleEn}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {language === 'hi' ? card.descHi : card.descEn}
                  </p>
                </div>

                {/* Bottom Line Accent */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>Step 0{idx + 1}</span>
                  <span className="group-hover:translate-x-1 transition-transform">Learn more →</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
