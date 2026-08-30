import React, { useState } from 'react';
import { 
  Radio, MapPin, CheckCircle2, ArrowLeft, Send
} from 'lucide-react';
import type { Language, DiseaseInfo, FarmerProfile } from '../types';
import { translations } from '../translations';

interface ReportScreenProps {
  language: Language;
  farmer: FarmerProfile;
  initialDisease?: DiseaseInfo | null;
  onReportSubmitted: (newReport: any) => void;
  onBack: () => void;
  sunlightMode: boolean;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  language,
  farmer,
  initialDisease,
  onReportSubmitted,
  onBack,
  sunlightMode
}) => {
  const t = translations[language];

  const [crop, setCrop] = useState(initialDisease ? initialDisease.crop : farmer.mainCrops[0] || 'Tomato');
  const [diseaseName, setDiseaseName] = useState(initialDisease ? initialDisease.nameHindi : 'टमाटर अगेती झुलसा');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  const handleFinish = () => {
    onReportSubmitted({
      id: `rep-${Date.now()}`,
      farmerName: farmer.name,
      village: farmer.village,
      district: farmer.district,
      crop,
      diseaseName: initialDisease ? initialDisease.name : 'Tomato Early Blight',
      diseaseHindi: diseaseName,
      severity: 'High',
      distanceKm: 0.5,
      timestamp: 'Just now',
      lat: 28.8955,
      lng: 76.6066,
      status: 'verified'
    });
  };

  return (
    <div className={`w-full min-h-screen transition-colors ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <span className="font-script text-3xl text-[#2d6a4f] font-bold block mb-1">
              Early Warning Broadcast
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#1b4332] flex items-center gap-3">
              <Radio className="w-8 h-8 text-red-600 animate-pulse" />
              <span>{t.reportTitle}</span>
            </h1>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-5 py-2 rounded-full text-xs font-bold shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
          
          {/* Location Lock Banner */}
          <div className="bg-[#e8f5e9] rounded-2xl p-4 border border-[#2d6a4f]/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#2d6a4f]" />
              <div>
                <h4 className="font-bold text-[#1b4332] text-xs">Verified GPS Location Node</h4>
                <p className="text-xs text-slate-600 font-medium">{farmer.village}, {farmer.district}</p>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase text-[#1b4332] bg-white px-3 py-1 rounded-full border">
              GPS Verified
            </span>
          </div>

          {/* Crop Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Select Affected Crop:
            </label>
            <input
              type="text"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              required
            />
          </div>

          {/* Disease Name */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Diagnosed Disease Name:
            </label>
            <input
              type="text"
              value={diseaseName}
              onChange={(e) => setDiseaseName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
              required
            />
          </div>

          {/* Additional Field Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-[#1b4332] uppercase tracking-wider">
              Field Observations / Symptoms:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Yellowing leaf borders noticed across 2 acres..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 font-medium text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4332]"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#1b4332] hover:bg-[#143326] text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-transform transform active:scale-98"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Broadcasting...' : t.submitReportButton}</span>
          </button>

        </form>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-6 shadow-2xl border border-slate-100">
              <div className="w-20 h-20 bg-emerald-100 text-[#1b4332] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
              </div>
              <h3 className="font-serif-title font-bold text-2xl text-[#1b4332]">
                Report Broadcasted!
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Your outbreak report has been broadcasted to all farmers within 5 km of {farmer.village}.
              </p>
              <button
                onClick={handleFinish}
                className="w-full py-4 bg-[#1b4332] text-white font-bold text-sm rounded-2xl shadow-lg"
              >
                View Community Map
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
