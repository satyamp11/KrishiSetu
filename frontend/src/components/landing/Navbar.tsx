import React, { useState, useEffect } from 'react';
import { Globe, Menu, X, ArrowRight, User, LogIn, LogOut, UserCheck } from 'lucide-react';
import type { Language } from '../../types';
import { useAuth } from '../../context/AuthContext';

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
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero');
      const heroHeight = heroElement ? heroElement.offsetHeight : window.innerHeight;
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

          {/* Desktop Right Actions: Language Selector & Auth / CTA */}
          <div className="hidden lg:flex items-center gap-3">
            
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

            {/* Authentication Buttons & User Profile Menu */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onGetStarted}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-bold text-xs shadow-md transition-all flex items-center gap-1.5 border border-emerald-400/30"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'मेरा डैशबोर्ड' : 'My Dashboard'}</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-white hover:bg-emerald-900 transition-all shadow-sm"
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-[#1b4332] font-black text-xs flex items-center justify-center">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left leading-tight hidden xl:block">
                      <span className="block text-xs font-extrabold text-white truncate max-w-[120px]">{user.name}</span>
                      <span className="block text-[9px] font-bold text-emerald-300 truncate max-w-[120px]">{user.district}, {user.state}</span>
                    </div>
                  </button>

                  {/* Logged-in Dropdown Menu */}
                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Signed in as</p>
                        <p className="text-sm font-black text-[#1b4332] truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.emailOrPhone}</p>
                      </div>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onGetStarted();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 flex items-center gap-2"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-600" />
                        <span>{language === 'hi' ? 'मेरा डैशबोर्ड / प्रोफाइल' : 'Dashboard / Profile'}</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{language === 'hi' ? 'लॉगआउट (Logout)' : 'Logout'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* Login Button */}
                <button
                  onClick={() => openAuthModal('login')}
                  className={`px-4 py-2 rounded-full font-bold text-xs transition-all flex items-center gap-1.5 border ${
                    isScrolled
                      ? 'border-slate-300 text-slate-800 hover:bg-slate-100'
                      : 'border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'लॉगइन' : 'Login'}</span>
                </button>

                {/* Get Started / Register Button */}
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-gradient-to-r from-emerald-500 to-[#1b4332] hover:from-[#2d6a4f] hover:to-[#1b4332] text-white px-5 py-2.5 rounded-full font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 border border-emerald-400/30"
                >
                  <span>{language === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

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
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-emerald-900/40 rounded-xl text-xs text-emerald-200 border border-emerald-500/30 flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">{user.name} ({user.district}, {user.state})</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold text-center flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'hi' ? 'लॉगआउट (Logout)' : 'Logout'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-xl font-bold text-center border border-slate-600 flex items-center justify-center gap-1.5 text-xs"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'लॉगइन' : 'Login'}</span>
                </button>

                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-center shadow-md flex items-center justify-center gap-1 text-xs"
                >
                  <span>{language === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
