import React from 'react';
import { Sun, Sparkles, Globe, Search, User, Bell } from 'lucide-react';
import type { Language, TabType } from '../types';
import { translations } from '../translations';

interface HeaderBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  sunlightMode: boolean;
  onToggleSunlightMode: () => void;
  onTriggerDemo: () => void;
  unreadAlertsCount?: number;
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  language,
  onLanguageChange,
  sunlightMode,
  onToggleSunlightMode,
  onTriggerDemo,
  unreadAlertsCount = 0,
  activeTab = 'home',
  onTabChange
}) => {
  const t = translations[language];

  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
      sunlightMode 
        ? 'bg-black text-yellow-300 border-yellow-400' 
        : 'bg-white text-slate-900 border-slate-200/80 shadow-sm'
    }`}>
      
      {/* Top Green Notification Ticker */}
      <div className="bg-[#1b4332] text-white text-xs px-4 py-1.5 flex justify-between items-center font-sans-body">
        <div className="flex items-center gap-2 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-200 font-semibold">{t.appSubhead}</span>
          <span className="hidden md:inline text-emerald-400">• Real-Time Crop Protection Platform</span>
        </div>

        <button
          onClick={onTriggerDemo}
          className="flex items-center gap-1.5 bg-[#2d6a4f] hover:bg-[#40916c] text-white font-bold px-3 py-0.5 rounded-full text-[11px] transition-all transform active:scale-95 shadow-sm"
        >
          <Sparkles className="w-3 h-3 text-amber-300" />
          <span>Outbreak Simulator</span>
        </button>
      </div>

      {/* Main GreenBasket Style Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left: Krishi Shield AI Brand Logo */}
        <button 
          onClick={() => onTabChange?.('home')}
          className="flex items-center gap-3 text-left group"
        >
          <img 
            src="/logo.png" 
            alt="NovaKrishi Logo" 
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
            className="h-12 w-auto object-contain rounded-xl shadow-sm group-hover:scale-105 transition-transform" 
          />
          <div>
            <h1 className="font-serif-title font-extrabold text-2xl text-[#1b4332] leading-none tracking-tight flex items-center gap-1.5">
              <span>NovaKrishi</span>
              <span className="text-[10px] font-sans-body font-black uppercase px-2 py-0.5 rounded-full bg-[#e8f5e9] text-[#1b4332] border border-[#2d6a4f]/30">
                AI Defense
              </span>
            </h1>
            <p className="text-[11px] font-script text-[#2d6a4f] font-semibold tracking-wide">
              {t.tagline}
            </p>
          </div>
        </button>

        {/* Center: Desktop Navigation Links (GreenBasket Underline Style) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold">
          {[
            { id: 'landing', label: '🌐 Homepage' },
            { id: 'home', label: t.navHome },
            { id: 'scan', label: 'AI Crop Scan' },
            { id: 'map', label: t.navMap },
            { id: 'alerts', label: t.navAlerts, badge: unreadAlertsCount },
            { id: 'community', label: 'Community Hub' },
          ].map((item) => {

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange?.(item.id as TabType)}
                className={`relative py-1 transition-colors flex items-center gap-1 font-semibold ${
                  isActive
                    ? 'text-[#1b4332] font-bold border-b-2 border-[#1b4332]'
                    : 'text-slate-600 hover:text-[#1b4332]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && item.badge > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>

        {/* Right: Action Controls (Icons + Language & Sunlight) */}
        <div className="flex items-center gap-3">
          
          {/* Quick Action Icons */}
          <button 
            onClick={() => onTabChange?.('scan')}
            title="Search / Scan"
            className="p-2 text-slate-700 hover:text-[#1b4332] hover:bg-slate-100 rounded-full transition-all"
          >
            <Search className="w-5 h-5" />
          </button>

          <button 
            onClick={() => onTabChange?.('alerts')}
            title="Alerts"
            className="p-2 text-slate-700 hover:text-[#1b4332] hover:bg-slate-100 rounded-full transition-all relative"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button 
            onClick={() => onTabChange?.('profile')}
            title="Farmer Profile"
            className="p-2 text-slate-700 hover:text-[#1b4332] hover:bg-slate-100 rounded-full transition-all"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Sunlight Mode Toggle */}
          <button
            onClick={onToggleSunlightMode}
            title={t.sunlightMode}
            className={`p-2 rounded-full transition-all ${
              sunlightMode 
                ? 'bg-yellow-400 text-black ring-2 ring-yellow-300' 
                : 'bg-[#e8f5e9] text-[#1b4332] hover:bg-[#d8f3dc]'
            }`}
          >
            <Sun className="w-4.5 h-4.5" />
          </button>

          {/* Language Switcher */}
          <div className="relative flex items-center bg-[#e8f5e9] text-[#1b4332] rounded-full px-2 py-1 border border-[#2d6a4f]/20">
            <Globe className="w-3.5 h-3.5 text-[#1b4332] mr-1" />
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value as Language)}
              className="bg-transparent text-[#1b4332] font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="hi" className="bg-white text-slate-900">हिंदी</option>
              <option value="en" className="bg-white text-slate-900">English</option>
              <option value="mr" className="bg-white text-slate-900">मराठी</option>
            </select>
          </div>

        </div>

      </div>
    </header>
  );
};
