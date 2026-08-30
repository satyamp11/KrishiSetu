import React from 'react';
import { Camera, Cpu, Bell, ShieldCheck, ArrowRight } from 'lucide-react';
import type { Language } from '../../types';

interface HowItWorksProps {
  language: Language;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({ language }) => {
  const steps = [
    {
      stepNum: "01",
      icon: Camera,
      titleEn: "Capture",
      titleHi: "फोटो खींचें",
      descEn: "Farmer uploads a photo of the affected crop or leaf.",
      descHi: "किसान अपने मोबाइल से प्रभावित पौधे या पत्ती की स्पष्ट फोटो अपलोड करते हैं।",
    },
    {
      stepNum: "02",
      icon: Cpu,
      titleEn: "AI Analysis",
      titleHi: "एआई विश्लेषण",
      descEn: "The system analyzes the image and identifies possible disease indicators.",
      descHi: "सिस्टम फोटो का विश्लेषण करके रोग के लक्षण और संभावित जोखिम की पहचान करता है।",
    },
    {
      stepNum: "03",
      icon: Bell,
      titleEn: "Disease Alert",
      titleHi: "बीमारी की चेतावनी",
      descEn: "If a potential disease is detected, the system generates an early warning.",
      descHi: "रोग पाए जाने पर सिस्टम तुरंत उपचार और शुरुआती चेतावनी जारी करता है।",
    },
    {
      stepNum: "04",
      icon: ShieldCheck,
      titleEn: "Community Protection",
      titleHi: "सामुदायिक सुरक्षा",
      descEn: "Nearby farmers within the defined alert radius receive a warning so they can inspect their crops early.",
      descHi: "5 किमी दायरे के पड़ोसी किसानों को अलर्ट मिलता है ताकि वे अपनी फसल समय रहते बचा सकें।",
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-b from-white via-[#f4f9f4] to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            {language === 'hi' ? '4-चरणों की प्रक्रिया' : 'Simple 4-Step Workflow'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4332] tracking-tight font-serif-title">
            {language === 'hi' ? 'कृषि शील्ड AI कैसे काम करता है' : 'How Krishi Shield AI Works'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            {language === 'hi'
              ? 'मोबाइल फोटो से लेकर पूरे गांव की सुरक्षा तक — सिर्फ 4 आसान चरण।'
              : 'From a single smartphone scan to whole-community crop defense in 4 simple steps.'}
          </p>
        </div>

        {/* Workflow Component: Horizontal on Desktop, Vertical on Mobile */}
        <div className="mt-16 relative">
          
          {/* Connecting Gradient Line (Desktop Only) */}
          <div className="hidden lg:block absolute top-1/2 left-12 right-12 h-1 bg-gradient-to-r from-emerald-300 via-emerald-500 to-emerald-700 -translate-y-12 z-0 rounded-full opacity-30" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative"
                >
                  {/* Step Badge & Icon */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Icon className="w-7 h-7 text-emerald-300" />
                      </div>
                      <span className="text-2xl font-black text-emerald-200 group-hover:text-emerald-600 transition-colors font-serif-title">
                        STEP {step.stepNum}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-xl font-bold text-[#1b4332] mb-3 group-hover:text-emerald-700 transition-colors">
                      {language === 'hi' ? step.titleHi : step.titleEn}
                    </h3>

                    {/* Step Description */}
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {language === 'hi' ? step.descHi : step.descEn}
                    </p>
                  </div>

                  {/* Arrow Indicator on Desktop except last */}
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-12 w-8 h-8 rounded-full bg-emerald-600 text-white items-center justify-center shadow-md z-20">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
