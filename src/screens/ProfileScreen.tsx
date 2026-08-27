import React from 'react';
import { 
  Sprout, History, Sun, Globe, CheckCircle2, LogOut, User, MapPin, Phone
} from 'lucide-react';
import type { Language, FarmerProfile, OutbreakReport } from '../types';
import { translations } from '../translations';

interface ProfileScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  farmer: FarmerProfile;
  submittedReports: OutbreakReport[];
  sunlightMode: boolean;
  onToggleSunlightMode: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  language,
  onLanguageChange,
  farmer,
  submittedReports,
  sunlightMode,
  onToggleSunlightMode,
  onLogout
}) => {
  const t = translations[language];

  return (
    <div className={`w-full min-h-screen transition-colors ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
        
        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div>
            <span className="font-script text-3xl text-[#2d6a4f] font-bold block mb-1">
              Farmer Account
            </span>
            <h1 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#1b4332] flex items-center gap-3">
              <User className="w-8 h-8 text-[#2d6a4f]" />
              <span>{t.profileTitle}</span>
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2 rounded-full text-xs font-bold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* Multi-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Farmer Profile Summary & Settings */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Profile Info Card */}
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-5">
              <div className="flex items-center gap-4">
                <img
                  src={farmer.avatar}
                  alt={farmer.name}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-[#e8f5e9] shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif-title font-extrabold text-2xl text-slate-900">{farmer.name}</h2>
                    <CheckCircle2 className="w-5 h-5 text-[#2d6a4f] fill-current" />
                  </div>
                  <p className="text-xs text-[#2d6a4f] font-bold mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {farmer.village}, {farmer.district}
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    +91 {farmer.phone}
                  </p>
                </div>
              </div>

              {/* Registered Crops */}
              <div className="bg-[#f4f7f4] rounded-2xl p-4 border border-[#2d6a4f]/20 space-y-2">
                <h3 className="font-bold text-xs text-[#1b4332] uppercase tracking-wider flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-[#2d6a4f]" />
                  <span>Registered Farm Crops</span>
                </h3>
                <div className="flex flex-wrap gap-2 pt-1">
                  {farmer.mainCrops.map((crop: string, i: number) => (
                    <span key={i} className="bg-white text-[#1b4332] text-xs font-bold px-3 py-1.5 rounded-full border border-slate-200 shadow-sm">
                      🌾 {crop}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preferences & Settings */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-slate-900 text-sm">App Preferences:</h4>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold text-slate-800">Sunlight High-Contrast Mode</span>
                  </div>
                  <button
                    onClick={onToggleSunlightMode}
                    className={`w-12 h-6 rounded-full transition-colors relative ${
                      sunlightMode ? 'bg-[#1b4332]' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      sunlightMode ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-[#2d6a4f]" />
                    <span className="text-xs font-bold text-slate-800">Primary Language</span>
                  </div>
                  <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as Language)}
                    className="bg-white border border-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl text-[#1b4332]"
                  >
                    <option value="hi">हिंदी</option>
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Submitted Reports History */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
              
              <div className="flex items-center justify-between">
                <h3 className="font-serif-title font-bold text-2xl text-[#1b4332] flex items-center gap-2">
                  <History className="w-6 h-6 text-[#2d6a4f]" />
                  <span>My Disease Outbreak Reports</span>
                </h3>
                <span className="text-xs font-bold text-[#1b4332] bg-[#e8f5e9] px-3 py-1 rounded-full">
                  {submittedReports.length} Submitted
                </span>
              </div>

              <div className="space-y-4">
                {submittedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#1b4332] bg-[#e8f5e9] px-2.5 py-0.5 rounded-full">
                        {report.crop}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">
                        {language === 'hi' ? report.diseaseHindi : report.diseaseName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        📍 {report.village}, {report.district} • {report.timestamp}
                      </p>
                    </div>

                    <span className="text-xs font-extrabold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                      ✓ Broadcasted
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
