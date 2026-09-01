import React, { useState } from 'react';
import { Sprout, Globe, Menu, X, ArrowRight, User, LogIn, LogOut, ShoppingCart, Sparkles, Search } from 'lucide-react';
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
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();

  const navLinks = [
    { id: 'hero', labelEn: 'Home', labelHi: 'मुख्य पृष्ठ' },
    { id: 'marketplace-preview', labelEn: 'Marketplace', labelHi: 'मंडी बाज़ार' },
    { id: 'how-it-works', labelEn: 'How It Works', labelHi: 'यह कैसे काम करता है' },
    { id: 'live-prices', labelEn: 'Market Prices', labelHi: 'मंडी भाव' },
    { id: 'ai-insights', labelEn: 'AI Insights', labelHi: 'एआई सलाह' },
    { id: 'pricing-breakdown', labelEn: 'Fair Pricing', labelHi: 'पारदर्शी मूल्य' },
    { id: 'logistics-section', labelEn: 'Logistics', labelHi: 'लॉजिस्टिक्स' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-xs font-sans">
      {/* 1. Thin Top Announcement Bar */}
      <div className="bg-[#1b4332] text-emerald-100 py-1.5 px-4 text-[11px] font-bold text-center flex items-center justify-center gap-2 border-b border-emerald-900">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>Direct Trade Agricultural Marketplace • 100% Escrow Protected • Zero Intermediary Margins</span>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleLinkClick('hero')}>
            <div className="w-11 h-11 rounded-2xl bg-[#1b4332] flex items-center justify-center text-white shadow-xs border border-emerald-800">
              <Sprout className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black font-serif tracking-tight text-[#1b4332] flex items-center gap-1.5">
                Krishi<span className="text-emerald-600 font-sans">Setu</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                From Farm to Market, Without Middlemen
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className="px-3 py-2 text-xs font-extrabold text-slate-700 hover:text-[#1b4332] hover:bg-emerald-50/80 rounded-xl transition-all"
              >
                {language === 'hi' ? link.labelHi : link.labelEn}
              </button>
            ))}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-[#1b4332] px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50/50"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* User State & Actions */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onGetStarted}
                  className="px-4 py-2 text-xs font-bold bg-emerald-50 text-[#1b4332] rounded-xl border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{user.name} ({user.role.toUpperCase()})</span>
                </button>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-xl hover:bg-red-50"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 hover:text-[#1b4332] rounded-xl"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2 text-xs font-extrabold bg-[#1b4332] hover:bg-[#143022] text-white rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </button>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-[#1b4332] hover:bg-slate-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-stone-200 p-4 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-[#1b4332]"
            >
              {language === 'hi' ? link.labelHi : link.labelEn}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
