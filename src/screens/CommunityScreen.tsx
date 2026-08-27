import React from 'react';
import { 
  Users, TrendingUp, Lightbulb, Award
} from 'lucide-react';
import type { Language, CommunityActivity } from '../types';
import { translations } from '../translations';

interface CommunityScreenProps {
  language: Language;
  activities: CommunityActivity[];
  sunlightMode: boolean;
}

export const CommunityScreen: React.FC<CommunityScreenProps> = ({
  language,
  activities: _activities,
  sunlightMode
}) => {
  const t = translations[language];

  return (
    <div className={`w-full min-h-screen transition-colors ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="font-script text-3xl text-[#2d6a4f] font-bold block mb-1">
              Farmer Community Network
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#1b4332] flex items-center gap-3">
              <Users className="w-8 h-8 text-[#2d6a4f]" />
              <span>{t.communityTitle}</span>
            </h1>
          </div>

          <span className="self-start md:self-auto bg-[#e8f5e9] text-[#1b4332] font-extrabold text-xs px-4 py-2 rounded-full border border-[#2d6a4f]/20">
            42 Active Farmers in Kheri Sadh Node
          </span>
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Network Metric & Trends */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Defense Score Banner */}
            <div className="bg-[#1b4332] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center gap-2 text-amber-300 font-extrabold text-xs uppercase tracking-wider">
                <Award className="w-4 h-4" />
                <span>Collective Village Defense Score</span>
              </div>
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extrabold font-serif-title text-white">96%</span>
                <span className="text-sm text-emerald-200 font-bold">Crop Early Detection Coverage</span>
              </div>
              <p className="text-xs text-emerald-100 font-medium leading-relaxed bg-[#2d6a4f]/50 p-4 rounded-2xl border border-emerald-400/20">
                "12 farmers in your village radius are actively monitoring Tomato Leaf Blight today."
              </p>
            </div>

            {/* Regional Disease Analytics Trend */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif-title font-bold text-xl text-[#1b4332] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <span>{t.regionalTrends}</span>
                </h3>
                <span className="text-xs text-slate-500 font-bold">District Rohtak</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">Tomato Early Blight</span>
                    <span className="text-red-600">High Risk (+42% this week)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-red-600 rounded-full w-[78%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800">Wheat Yellow Rust</span>
                    <span className="text-amber-600">Moderate Risk (+15%)</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full w-[45%]" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Agronomist Advisory */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-5">
              
              <div className="flex items-center gap-2 text-xs font-black text-[#1b4332] uppercase tracking-wider">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <span>{t.agronomistTip}</span>
              </div>

              <blockquote className="text-xs text-slate-700 leading-relaxed font-medium bg-[#f4f7f4] p-5 rounded-2xl border border-[#2d6a4f]/20 space-y-2">
                <p>
                  "Due to morning mist and night temperature drops, check tomato stems for dark rings before 9 AM. Early neem oil spray prevents spore colonization."
                </p>
                <cite className="text-[11px] font-bold text-[#1b4332] block text-right not-italic">
                  — Dr. K.S. Verma, Senior Agronomist (KVK Haryana)
                </cite>
              </blockquote>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
