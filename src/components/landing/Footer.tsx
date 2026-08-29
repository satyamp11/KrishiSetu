import React from 'react';
import { Globe, Heart } from 'lucide-react';
import type { Language } from '../../types';


interface FooterProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onLanguageChange,
  onNavigateSection,
}) => {
  const quickLinks = [
    { id: 'hero', labelEn: 'Home', labelHi: 'मुख्य पृष्ठ' },
    { id: 'problem', labelEn: 'About', labelHi: 'हमारे बारे में' },
    { id: 'how-it-works', labelEn: 'How It Works', labelHi: 'यह कैसे काम करता है' },
    { id: 'detection', labelEn: 'Disease Detection', labelHi: 'रोग पहचान' },
    { id: 'market-rates', labelEn: 'Market Rates', labelHi: 'मंडी भाव' },
    { id: 'community', labelEn: 'Community Alerts', labelHi: 'सामुदायिक अलर्ट' },
    { id: 'contact', labelEn: 'Contact', labelHi: 'संपर्क' },
  ];

  return (
    <footer id="contact" className="bg-[#1b4332] text-white pt-16 pb-12 border-t border-emerald-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-emerald-800/80">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="Krishi Shield AI Logo" 
                className="h-12 w-auto object-contain bg-white/10 p-1.5 rounded-xl border border-emerald-500/30"
              />
              <span className="text-2xl font-black font-serif-title tracking-tight text-white">
                कृषि शील्ड <span className="text-emerald-400 font-sans-body text-lg">AI</span>
              </span>
            </div>


            {/* Tagline */}
            <p className="text-sm font-bold text-amber-300 tracking-wide">
              {language === 'hi'
                ? 'शुरुआती पहचान | पास में सतर्कता | फसल सुरक्षा'
                : 'Detect Early | Alert Nearby | Protect Harvest'}
            </p>

            <p className="text-xs text-emerald-200/80 font-medium leading-relaxed max-w-sm">
              Krishi Shield AI is an intelligent agricultural early-warning system empowering rural farmers with crop disease detection, spatial neighborhood alert signals, and live mandi market prices.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {language === 'hi' ? 'त्वरित लिंक' : 'Quick Navigation'}
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs font-semibold text-emerald-100">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => onNavigateSection(link.id)}
                    className="hover:text-amber-300 transition-colors py-1 text-left"
                  >
                    {language === 'hi' ? link.labelHi : link.labelEn}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Language & Contact Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {language === 'hi' ? 'भाषा एवं सहायता' : 'Language & Support'}
            </h4>
            
            <div className="flex items-center gap-2 text-xs font-bold bg-emerald-900/80 p-1.5 rounded-xl border border-emerald-700/60 inline-flex">
              <Globe className="w-4 h-4 text-emerald-300 ml-1" />
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'hi' ? 'bg-emerald-500 text-[#1b4332]' : 'text-emerald-200 hover:text-white'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  language === 'en' ? 'bg-emerald-500 text-[#1b4332]' : 'text-emerald-200 hover:text-white'
                }`}
              >
                English
              </button>
            </div>

            <p className="text-[11px] text-emerald-300/80">
              Helpline: 1800-180-1551 (Kisan Call Center)<br />
              Email: support@krishishield.ai
            </p>
          </div>

        </div>

        {/* Bottom Legal & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-medium text-emerald-300/70 gap-4">
          <p className="flex items-center gap-1">
            <span>© 2026 कृषि शील्ड AI (Krishi Shield AI).</span>
            <span className="hidden sm:inline">• Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-400 fill-current inline" />
            <span className="hidden sm:inline">for Farmers.</span>
          </p>

          <div className="flex items-center gap-6 text-[11px]">
            <a href="#privacy" className="hover:text-amber-300 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-amber-300 transition-colors">Terms of Service</a>
            <a href="#agmarknet" className="hover:text-amber-300 transition-colors">Agmarknet Data</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
