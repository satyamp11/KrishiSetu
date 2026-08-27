import React from 'react';
import { 
  CheckCircle2, ArrowLeft, Radio, Sprout, AlertTriangle, ShieldCheck
} from 'lucide-react';
import type { Language, DiseaseInfo } from '../types';
import { translations } from '../translations';
import { AudioNarrationPlayer } from '../components/AudioNarrationPlayer';

interface ScanResultProps {
  language: Language;
  disease: DiseaseInfo;
  scannedImage: string;
  onReportCase: () => void;
  onBack: () => void;
  sunlightMode: boolean;
}

export const ScanResult: React.FC<ScanResultProps> = ({
  language,
  disease,
  scannedImage,
  onReportCase,
  onBack,
  sunlightMode
}) => {
  const t = translations[language];
  const isHindi = language === 'hi';

  const diseaseTitle = isHindi ? disease.nameHindi : disease.name;
  const symptomsList = isHindi ? disease.symptomsHindi : disease.symptoms;
  const organicList = isHindi ? disease.organicActionHindi : disease.organicAction;
  const chemicalList = isHindi ? disease.chemicalActionHindi : disease.chemicalAction;

  const audioText = `रोग का नाम: ${disease.nameHindi}। गंभीरता: ${disease.severity}। प्राथमिक समाधान: ${organicList[0] || ''}`;

  return (
    <div className={`w-full min-h-screen transition-colors ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="font-script text-3xl text-[#2d6a4f] font-bold block mb-1">
              AI Diagnostic Report
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#1b4332] flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
              <span>{t.scanResultTitle}</span>
            </h1>
          </div>

          <button
            onClick={onBack}
            className="self-start md:self-auto flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-5 py-2 rounded-full text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scanner</span>
          </button>
        </div>

        {/* Multi-column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Confidence Meter */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-5">
              
              <div className="relative rounded-2xl overflow-hidden h-72 bg-slate-950 border-4 border-slate-900">
                <img
                  src={scannedImage || disease.sampleImage}
                  alt={diseaseTitle}
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-4 left-4 bg-emerald-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-full shadow">
                  {disease.confidence}% AI Match
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur text-white p-3 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                  <span>Detected Crop: <strong className="text-emerald-400">{disease.crop}</strong></span>
                  <span className="text-amber-400 font-bold">Severity: {disease.severity}</span>
                </div>
              </div>

              {/* Audio Narration Voice Bar */}
              <div className="bg-[#f4f7f4] rounded-2xl p-4 border border-[#2d6a4f]/20">
                <AudioNarrationPlayer
                  language={language}
                  textToNarrate={audioText}
                />
              </div>

              {/* Broadcast Report Button */}
              <button
                onClick={onReportCase}
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-98"
              >
                <Radio className="w-5 h-5 animate-pulse" />
                <span>Broadcast Alert to Village ({t.reportTitle})</span>
              </button>

            </div>
          </div>

          {/* Right Column: Detailed Remedies (Organic & Chemical) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
              
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#2d6a4f] bg-[#e8f5e9] px-3 py-1 rounded-full">
                  Verified Diagnosis
                </span>
                <h2 className="font-serif-title font-extrabold text-3xl text-slate-900 mt-2">
                  {diseaseTitle}
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Crop: {disease.crop} • Severity: {disease.severity}
                </p>
              </div>

              {/* Symptoms */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-sm">Observed Leaf Symptoms:</h4>
                <div className="flex flex-wrap gap-2">
                  {symptomsList.map((sym, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-700 font-semibold px-3 py-1 rounded-full border border-slate-200">
                      • {sym}
                    </span>
                  ))}
                </div>
              </div>

              {/* Organic Remedy */}
              <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-100 space-y-2">
                <h4 className="font-bold text-[#1b4332] text-sm flex items-center gap-2">
                  <Sprout className="w-4.5 h-4.5 text-[#2d6a4f]" />
                  <span>Organic & Natural Remedies ({t.remedyOrganic}):</span>
                </h4>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  {organicList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Chemical Treatment */}
              <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-100 space-y-2">
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-600" />
                  <span>Recommended Fungicide Spray ({t.remedyChemical}):</span>
                </h4>
                <ul className="text-xs text-slate-700 space-y-2 font-medium">
                  {chemicalList.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
