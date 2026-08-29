import React, { useState } from 'react';
import { Globe, Menu, X, ArrowRight } from 'lucide-react';
import type { Language } from '../../types';


interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onGetStarted: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageChange,
  onGetStarted,
  onNavigateSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'hero', labelEn: 'Home', labelHi: 'मुख्य पृष्ठ' },
    { id: 'problem', labelEn: 'About', labelHi: 'हमारे बारे में' },
    { id: 'how-it-works', labelEn: 'How It Works', labelHi: 'यह कैसे काम करता है' },
    { id: 'detection', labelEn: 'Disease Detection', labelHi: 'रोग पहचान' },
    { id: 'market-rates', labelEn: 'Market Rates', labelHi: 'मंडी भाव' },
    { id: 'community', labelEn: 'Community Alerts', labelHi: 'सामुदायिक अलर्ट' },
    { id: 'contact', labelEn: 'Contact', labelHi: 'संपर्क' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLinkClick('hero')}>
            <img 
              src="/logo.png" 
              alt="Krishi Shield AI Logo" 
              className="h-12 w-auto object-contain hover:scale-105 transition-transform filter drop-shadow-md"
            />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#1b4332] tracking-tight leading-none flex items-center gap-1.5 font-serif-title">
                कृषि शील्ड <span className="text-emerald-600 font-sans-body text-base font-black px-1.5 py-0.5 bg-emerald-100 rounded-md">AI</span>
              </span>
              <span className="text-[11px] font-medium text-emerald-800 tracking-wide mt-0.5">
                Krishi Shield AI • Community Protection
              </span>
            </div>
          </div>


          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#1b4332] hover:bg-emerald-50/80 rounded-lg transition-all"
              >
                {language === 'hi' ? link.labelHi : link.labelEn}
              </button>
            ))}
          </nav>

          {/* Desktop Right Actions: Language Selector & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-full border border-slate-200 text-xs font-bold">
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  language === 'hi'
                    ? 'bg-[#1b4332] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>हिंदी</span>
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-[#1b4332] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>English</span>
              </button>
            </div>

            {/* Get Started Button */}
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:from-[#2d6a4f] hover:to-[#40916c] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all flex items-center gap-2 group"
            >
              <span>{language === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onLanguageChange(language === 'hi' ? 'en' : 'hi')}
              className="px-2.5 py-1 text-xs font-bold bg-emerald-100 text-[#1b4332] rounded-full border border-emerald-300 flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'ENG' : 'हिंदी'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-[#1b4332] hover:bg-emerald-50 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-emerald-100 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="block w-full text-left px-4 py-2.5 text-base font-semibold text-slate-800 hover:bg-emerald-50 hover:text-[#1b4332] rounded-xl transition-all"
            >
              {language === 'hi' ? link.labelHi : link.labelEn}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button
              onClick={() => {
                onGetStarted();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#1b4332] hover:bg-[#2d6a4f] text-white py-3 rounded-xl font-bold text-center shadow-md flex items-center justify-center gap-2"
            >
              <span>{language === 'hi' ? 'फसल जांच शुरू करें' : 'Get Started / Check Crop'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
