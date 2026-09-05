import React from 'react';
import { Home, Camera, MapPin, AlertTriangle, User } from 'lucide-react';
import type { TabType, Language } from '../types';
import { translations } from '../translations';

interface BottomNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  unreadAlertsCount: number;
  sunlightMode: boolean;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  language,
  unreadAlertsCount,
  sunlightMode
}) => {
  const t = translations[language];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 w-full z-40 border-t transition-colors shadow-2xl safe-pb ${
      sunlightMode 
        ? 'bg-black border-yellow-400 text-white' 
        : 'bg-white/95 backdrop-blur-md border-slate-200 text-slate-700 font-sans-body'
    }`}>
      <div className="flex items-center justify-around h-16 px-1 sm:px-2 relative max-w-lg mx-auto pb-[env(safe-area-inset-bottom,0px)]">
        
        {/* Tab 1: Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            activeTab === 'home' 
              ? (sunlightMode ? 'text-yellow-400 font-extrabold' : 'text-[#1b4332] font-bold scale-105')
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-semibold">{t.navHome}</span>
        </button>

        {/* Tab 2: Map */}
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            activeTab === 'map' 
              ? (sunlightMode ? 'text-yellow-400 font-extrabold' : 'text-[#1b4332] font-bold scale-105')
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <MapPin className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-semibold">{t.navMap}</span>
        </button>

        {/* Tab 3: Center Elevated SCAN Button */}
        <div className="flex-1 flex justify-center -mt-6">
          <button
            onClick={() => onTabChange('scan')}
            className={`w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-xl border-4 transition-transform active:scale-90 ${
              sunlightMode 
                ? 'bg-yellow-400 border-black text-black font-extrabold' 
                : 'bg-[#1b4332] hover:bg-[#2d6a4f] border-white text-white font-black shadow-[#1b4332]/40'
            } ${activeTab === 'scan' ? 'ring-4 ring-emerald-500/40 scale-105' : ''}`}
          >
            <Camera className="w-6 h-6" />
            <span className="text-[9px] uppercase tracking-wider font-extrabold leading-none mt-0.5">
              {t.navScan}
            </span>
          </button>
        </div>

        {/* Tab 4: Alerts */}
        <button
          onClick={() => onTabChange('alerts')}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all ${
            activeTab === 'alerts' 
              ? (sunlightMode ? 'text-yellow-400 font-extrabold' : 'text-amber-600 font-bold scale-105')
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <AlertTriangle className="w-5 h-5 mb-0.5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-500 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow">
                {unreadAlertsCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold">{t.navAlerts}</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => onTabChange('profile')}
          className={`flex flex-col items-center justify-center flex-1 h-full transition-all ${
            activeTab === 'profile' 
              ? (sunlightMode ? 'text-yellow-400 font-extrabold' : 'text-[#1b4332] font-bold scale-105')
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-semibold">{t.navProfile}</span>
        </button>

      </div>
    </nav>
  );
};
