import React, { useState, useEffect } from 'react';
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero');
      const heroHeight = heroElement ? heroElement.offsetHeight : window.innerHeight;
      // Remain transparent throughout hero section; turn white only after scrolling past full hero
      setIsScrolled(window.scrollY > (heroHeight - 90));
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-emerald-100/80 text-slate-900 shadow-md'
          : 'bg-slate-950/40 backdrop-blur-md border-b border-white/10 text-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLinkClick('hero')}>
            <img 
              src="/logo.png" 
              alt="Krishi Shield AI Logo" 
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
              className="h-12 w-auto object-contain hover:scale-105 transition-transform filter drop-shadow-md"
            />
            <div className="flex flex-col">
              <span className={`text-xl font-extrabold tracking-tight leading-none flex items-center gap-1.5 font-serif-title transition-colors ${
                isScrolled ? 'text-[#1b4332]' : 'text-white'
              }`}>
                कृषि शील्ड <span className="text-emerald-400 font-sans-body text-base font-black px-1.5 py-0.5 bg-emerald-950/80 rounded-md border border-emerald-500/30">AI</span>
              </span>
              <span className={`text-[11px] font-medium tracking-wide mt-0.5 transition-colors ${
                isScrolled ? 'text-emerald-800' : 'text-emerald-200'
              }`}>
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
                className={`px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                  isScrolled
                    ? 'text-slate-700 hover:text-[#1b4332] hover:bg-emerald-50/80'
                    : 'text-emerald-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {language === 'hi' ? link.labelHi : link.labelEn}
              </button>
            ))}
          </nav>

          {/* Desktop Right Actions: Language Selector & CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Switcher */}
            <div className={`flex items-center p-1 rounded-full text-xs font-bold transition-colors ${
              isScrolled
                ? 'bg-slate-100 border border-slate-200 text-slate-800'
                : 'bg-slate-900/60 border border-white/20 text-white'
            }`}>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  language === 'hi'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>हिंदी</span>
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  language === 'en'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : isScrolled ? 'text-slate-600 hover:text-slate-900' : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>English</span>
              </button>
            </div>

            {/* Get Started Button */}
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-[#1b4332] hover:from-[#2d6a4f] hover:to-[#1b4332] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group border border-emerald-400/30"
            >
              <span>{language === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => onLanguageChange(language === 'hi' ? 'en' : 'hi')}
              className={`px-2.5 py-1 text-xs font-bold rounded-full border flex items-center gap-1 ${
                isScrolled
                  ? 'bg-emerald-100 text-[#1b4332] border-emerald-300'
                  : 'bg-emerald-900/60 text-emerald-200 border-emerald-500/40'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'ENG' : 'हिंदी'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-slate-700 hover:text-[#1b4332] hover:bg-emerald-50'
                  : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200 ${
          isScrolled
            ? 'bg-white border-emerald-100 text-slate-900'
            : 'bg-slate-950/95 border-emerald-900/50 text-white backdrop-blur-xl'
        }`}>
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`block w-full text-left px-4 py-2.5 text-base font-semibold rounded-xl transition-all ${
                isScrolled
                  ? 'hover:bg-emerald-50 hover:text-[#1b4332] text-slate-800'
                  : 'hover:bg-white/10 hover:text-emerald-300 text-emerald-100'
              }`}
            >
              {language === 'hi' ? link.labelHi : link.labelEn}
            </button>
          ))}
          <div className="pt-4 border-t border-slate-700/50 flex flex-col gap-3">
            <button
              onClick={() => {
                onGetStarted();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-center shadow-md flex items-center justify-center gap-2"
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
