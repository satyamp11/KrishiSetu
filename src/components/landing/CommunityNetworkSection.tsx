import React from 'react';
import { MapPin, Radio, ShieldCheck, UserCheck, Smartphone, Cpu, ArrowDown } from 'lucide-react';
import type { Language } from '../../types';

interface CommunityNetworkProps {
  language: Language;
}

export const CommunityNetworkSection: React.FC<CommunityNetworkProps> = ({ language }) => {
  const networkSteps = [
    {
      labelEn: "Farmer A",
      labelHi: "किसान अ (खेत में)",
      descEn: "Observes initial leaf discoloration",
      descHi: "पत्ती पर शुरुआती धब्बे देखता है",
      icon: UserCheck,
      color: "bg-emerald-100 text-emerald-800 border-emerald-300"
    },
    {
      labelEn: "Uploads Crop Scan",
      labelHi: "फोटो अपलोड",
      descEn: "Captures crop photo on smartphone",
      descHi: "मोबाइल से फोटो खींचता है",
      icon: Smartphone,
      color: "bg-blue-100 text-blue-800 border-blue-300"
    },
    {
      labelEn: "AI Detection",
      labelHi: "एआई जांच",
      descEn: "Identifies early disease risk pattern",
      descHi: "एआई 94% सटीकता से बीमारी पहचानता है",
      icon: Cpu,
      color: "bg-purple-100 text-purple-800 border-purple-300"
    },
    {
      labelEn: "Disease Alert",
      labelHi: "ऑटो अलर्ट जारी",
      descEn: "Generates geo-tagged alert signal",
      descHi: "स्थान-आधारित चेतावनी संकेत जारी करता है",
      icon: Radio,
      color: "bg-amber-100 text-amber-900 border-amber-300"
    },
    {
      labelEn: "Nearby Farmers",
      labelHi: "पास के किसान (5km)",
      descEn: "Receive push warning on phone",
      descHi: "5 किमी दायरे के किसानों को संदेश मिलता है",
      icon: MapPin,
      color: "bg-emerald-100 text-emerald-900 border-emerald-300"
    },
    {
      labelEn: "Community Protection",
      labelHi: "सामुदायिक फसल सुरक्षा",
      descEn: "Whole village inspects crops early",
      descHi: "पूरा गांव समय पर बचाव उपाय करता है",
      icon: ShieldCheck,
      color: "bg-emerald-700 text-white border-emerald-800"
    }
  ];

  return (
    <section id="community" className="py-20 bg-gradient-to-b from-white via-[#f4f9f4] to-[#fbfbf7] relative overflow-hidden">
      
      {/* Map Grid Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1b4332_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
            {language === 'hi' ? 'सामुदायिक रक्षा कवच' : 'Community Early Warning Network'}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1b4332] tracking-tight font-serif-title">
            {language === 'hi' ? 'एक किसान से पूरे गांव की सुरक्षा' : 'From One Farmer to the Whole Community'}
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-medium">
            {language === 'hi'
              ? 'जब एक किसान बीमारी की रिपोर्ट दर्ज करता है, तो कृषि शील्ड AI 5 किमी दायरे में आने वाले सभी किसानों को समय रहते अलर्ट करता है।'
              : 'When one farmer reports a potential crop disease, Krishi Shield AI instantly alerts farmers within a 5 km radius around the village.'}
          </p>
        </div>

        {/* Highlighted Core Concept Card */}
        <div className="mt-10 max-w-3xl mx-auto bg-gradient-to-r from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-emerald-600/30 text-center relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 text-xs font-bold mb-3 border border-emerald-400/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-amber-300" />
            <span>Community Early Warning</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-black mb-2 font-serif-title text-amber-200">
            {language === 'hi' ? '5 किमी गांव सुरक्षा का घेरा' : '5 km Village Defense Radius'}
          </h3>

          <p className="text-sm sm:text-base text-emerald-100 font-medium max-w-xl mx-auto">
            {language === 'hi'
              ? 'संभावित प्रकोप का पता चलने पर आपके गांव के 5 किलोमीटर के दायरे में स्थित सभी किसानों को तुरंत सतर्क करता है।'
              : 'Protects farmers within a defined 5 km radius when a potential disease outbreak is detected in your village.'}
          </p>
        </div>

        {/* VISUAL NETWORK FLOW */}
        <div className="mt-16 max-w-4xl mx-auto">
          
          {/* Desktop Flow: 6 Step Horizontal Pipeline */}
          <div className="hidden md:grid grid-cols-6 gap-3 items-center relative">
            {networkSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <React.Fragment key={idx}>
                  <div className="flex flex-col items-center text-center group">
                    <div className={`w-14 h-14 rounded-2xl ${step.color} border-2 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform mb-3`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-slate-900 leading-tight">
                      {language === 'hi' ? step.labelHi : step.labelEn}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">
                      {language === 'hi' ? step.descHi : step.descEn}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile Flow: Vertical Stack with Connecting Arrows */}
          <div className="md:hidden space-y-4">
            {networkSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-full p-4 rounded-2xl ${step.color} border-2 flex items-center gap-4 shadow-md`}>
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black">{language === 'hi' ? step.labelHi : step.labelEn}</p>
                      <p className="text-xs font-medium opacity-90">{language === 'hi' ? step.descHi : step.descEn}</p>
                    </div>
                  </div>

                  {idx < networkSteps.length - 1 && (
                    <ArrowDown className="w-5 h-5 text-emerald-600 my-1 animate-bounce" />
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
