import React, { useState } from 'react';
import { Scan, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import type { Language } from '../../types';
import { CROP_IMAGES } from '../../mockData';

interface DiseaseDetectionProps {
  language: Language;
  onTryScan: () => void;
}

export const DiseaseDetectionSection: React.FC<DiseaseDetectionProps> = ({
  language,
  onTryScan,
}) => {
  const [selectedCropKey, setSelectedCropKey] = useState<'wheat' | 'tomato' | 'healthy'>('wheat');

  const cropSamples = {
    wheat: {
      cropEn: 'Wheat',
      cropHi: 'गेहूं',
      diseaseEn: 'Yellow Rust of Wheat',
      diseaseHi: 'गेहूं का पीला रतुआ (हल्दी रोग)',
      statusEn: 'Potential Disease Detected',
      statusHi: 'संभावित बीमारी पाई गई',
      confidence: '92%',
      riskEn: 'Medium / High',
      riskHi: 'मध्यम / उच्च',
      recommendationEn: 'Inspect nearby plants and apply preventive organic/chemical spray within 24 hours.',
      recommendationHi: 'पास के पौधों की जांच करें और 24 घंटे के भीतर निरोधात्मक छिड़काव करें।',
      image: CROP_IMAGES.wheatRust,
      isDanger: true,
    },
    tomato: {
      cropEn: 'Tomato',
      cropHi: 'टमाटर',
      diseaseEn: 'Tomato Early Blight',
      diseaseHi: 'टमाटर अगेती झुलसा रोग',
      statusEn: 'Potential Disease Detected',
      statusHi: 'संभावित बीमारी पाई गई',
      confidence: '94%',
      riskEn: 'High Risk',
      riskHi: 'उच्च जोखिम',
      recommendationEn: 'Isolate affected leaves and apply 5% Neem oil or Mancozeb solution.',
      recommendationHi: 'प्रभावित पत्तियों को तोड़ें और 5% नीम तेल या मैनकोज़ेब छिड़कें।',
      image: CROP_IMAGES.tomatoBlight,
      isDanger: true,
    },
    healthy: {
      cropEn: 'Wheat (Clean Canopy)',
      cropHi: 'गेहूं (स्वस्थ फसल)',
      diseaseEn: 'No Disease Detected',
      diseaseHi: 'फसल पूर्णतः स्वस्थ है',
      statusEn: 'Healthy Crop Verified',
      statusHi: 'फसल सुरक्षित और स्वस्थ',
      confidence: '98%',
      riskEn: 'Low Risk',
      riskHi: 'न्यूनतम जोखिम',
      recommendationEn: 'Continue regular organic compost and keep field borders clean.',
      recommendationHi: 'नियमित जैविक सिंचाई जारी रखें और मेड़ों को साफ रखें।',
      image: CROP_IMAGES.healthyWheat,
      isDanger: false,
    },
  };

  const activeSample = cropSamples[selectedCropKey];

  return (
    <section id="detection" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT: IMAGE SCAN PREVIEW */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-4 border-emerald-100 shadow-2xl bg-slate-900 group">
              <img
                src={activeSample.image}
                alt={activeSample.cropEn}
                className="w-full h-[420px] object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-90"
              />
              
              {/* Laser Scanning Line Animation Overlay */}
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 shadow-[0_0_15px_#10b981] animate-laser z-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />

              {/* Interactive Sample Selector Overlay */}
              <div className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between">
                <span className="text-xs font-black text-white bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  {language === 'hi' ? 'डेमो नमूना चुनें' : 'Test Interactive Demo'}
                </span>

                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md p-1 rounded-full border border-white/20">
                  <button
                    onClick={() => setSelectedCropKey('wheat')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                      selectedCropKey === 'wheat'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Wheat Rust
                  </button>
                  <button
                    onClick={() => setSelectedCropKey('tomato')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                      selectedCropKey === 'tomato'
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Tomato
                  </button>
                  <button
                    onClick={() => setSelectedCropKey('healthy')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition-all ${
                      selectedCropKey === 'healthy'
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    Healthy
                  </button>
                </div>
              </div>

              {/* Bottom Image Caption */}
              <div className="absolute bottom-4 left-4 right-4 z-30 text-white flex items-center justify-between">
                <div>
                  <p className="text-xs text-emerald-300 font-bold uppercase tracking-wider">
                    {language === 'hi' ? 'स्कैन फोटो' : 'Scanned Crop Specimen'}
                  </p>
                  <p className="text-lg font-black">{language === 'hi' ? activeSample.cropHi : activeSample.cropEn}</p>
                </div>
                <div className="px-3 py-1 bg-emerald-500/30 backdrop-blur-md rounded-lg border border-emerald-400/50 text-xs font-mono font-bold">
                  2048x1536 px
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: CONTENT & MOCK AI ANALYSIS CARD */}
          <div className="lg:col-span-6 space-y-6">
            
            <div className="space-y-3">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black">
                {language === 'hi' ? 'स्मार्ट विजन एआई' : 'AI Neural Assessment'}
              </span>

              <h2 className="text-3xl sm:text-4xl font-black text-[#1b4332] tracking-tight font-serif-title">
                {language === 'hi' ? 'एआई-संचालित फसल रोग पहचान' : 'AI-Powered Crop Disease Detection'}
              </h2>

              <p className="text-slate-600 text-base font-medium leading-relaxed">
                {language === 'hi'
                  ? 'किसान आसानी से फसल की फोटो खींचकर तुरंत एआई-आधारित प्राथमिक मूल्यांकन और निवारक उपाय प्राप्त कर सकते हैं।'
                  : 'Farmers can upload crop leaf photos and receive an instant AI-assisted health analysis with targeted action steps.'}
              </p>
            </div>

            {/* MOCK AI ANALYSIS CARD */}
            <div className={`p-6 rounded-3xl border-2 shadow-xl transition-all ${
              activeSample.isDanger 
                ? 'bg-gradient-to-br from-amber-50/90 via-white to-amber-50/50 border-amber-300' 
                : 'bg-gradient-to-br from-emerald-50/90 via-white to-emerald-50/50 border-emerald-300'
            }`}>
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    activeSample.isDanger ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {activeSample.isDanger ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">AI Diagnosis Result</p>
                    <p className="text-base font-black text-slate-900">
                      {language === 'hi' ? activeSample.diseaseHi : activeSample.diseaseEn}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold text-slate-500">Confidence</p>
                  <p className="text-lg font-black text-emerald-800">{activeSample.confidence}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 py-4 border-b border-slate-200/80 text-sm">
                <div>
                  <span className="text-xs text-slate-500 font-bold block">Crop / फसल:</span>
                  <span className="font-bold text-slate-900">{language === 'hi' ? activeSample.cropHi : activeSample.cropEn}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 font-bold block">Risk Level / स्थिति:</span>
                  <span className={`font-black ${activeSample.isDanger ? 'text-amber-800' : 'text-emerald-700'}`}>
                    {language === 'hi' ? activeSample.riskHi : activeSample.riskEn}
                  </span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="pt-4 space-y-1">
                <span className="text-xs font-bold text-slate-700 block">Recommended Action / उपचार:</span>
                <p className="text-xs sm:text-sm text-slate-800 font-semibold bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                  {language === 'hi' ? activeSample.recommendationHi : activeSample.recommendationEn}
                </p>
              </div>

            </div>

            {/* MANDATORY AI DISCLAIMER BANNER */}
            <div className="p-3.5 bg-amber-100/80 border border-amber-300 rounded-2xl flex items-start gap-3 text-amber-950 text-xs font-bold">
              <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                {language === 'hi'
                  ? 'ध्यान दें: यह एक एआई-सहायता प्राप्त मूल्यांकन है और कोई अंतिम कृषि-वैज्ञानिक निदान नहीं है। हमेशा स्थानीय कृषि अधिकारी या विशेषज्ञ से सलाह लें।'
                  : 'Important Note: This is an AI-assisted assessment and not a guaranteed agricultural diagnosis. Consult a local agronomist for definitive treatment.'}
              </span>
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={onTryScan}
                className="w-full sm:w-auto bg-[#1b4332] hover:bg-[#2d6a4f] text-white px-7 py-3.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
              >
                <Scan className="w-4 h-4 text-emerald-400" />
                <span>{language === 'hi' ? 'रोग पहचान आज़माएं (Try Scan)' : 'Try Disease Detection'}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
