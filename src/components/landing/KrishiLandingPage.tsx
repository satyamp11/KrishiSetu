import React from 'react';
import type { Language } from '../../types';

import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { ProblemSolutionSection } from './ProblemSolutionSection';
import { HowItWorksSection } from './HowItWorksSection';
import { DiseaseDetectionSection } from './DiseaseDetectionSection';
import { CommunityNetworkSection } from './CommunityNetworkSection';
import { MarketRatesSection } from './MarketRatesSection';
import { MarketTrendsSection } from './MarketTrendsSection';
import { FarmerBenefitsSection } from './FarmerBenefitsSection';
import { FarmerImpactSection } from './FarmerImpactSection';
import { CTASection } from './CTASection';
import { Footer } from './Footer';

interface KrishiLandingPageProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLaunchApp: () => void;
  onLaunchScanner: () => void;
}

export const KrishiLandingPage: React.FC<KrishiLandingPageProps> = ({
  language,
  onLanguageChange,
  onLaunchApp,
  onLaunchScanner,
}) => {
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans-body selection:bg-emerald-700 selection:text-white">
      
      {/* 1. STICKY NAVBAR */}
      <Navbar
        language={language}
        onLanguageChange={onLanguageChange}
        onGetStarted={onLaunchApp}
        onNavigateSection={scrollToSection}
      />

      {/* 2. HERO SECTION */}
      <HeroSection
        language={language}
        onCheckCrop={onLaunchScanner}
        onLearnMore={() => scrollToSection('how-it-works')}
      />

      {/* 3. PROBLEM / SOLUTION SECTION */}
      <ProblemSolutionSection language={language} />

      {/* 4. HOW KRISHI SHIELD AI WORKS */}
      <HowItWorksSection language={language} />

      {/* 5. AI DISEASE DETECTION SECTION */}
      <DiseaseDetectionSection
        language={language}
        onTryScan={onLaunchScanner}
      />

      {/* 6. COMMUNITY EARLY WARNING NETWORK */}
      <CommunityNetworkSection language={language} />

      {/* 7. LIVE MARKET RATES SECTION */}
      <MarketRatesSection language={language} />

      {/* 8. MARKET TREND VISUALIZATION */}
      <MarketTrendsSection language={language} />

      {/* 9. FARMER BENEFITS SECTION */}
      <FarmerBenefitsSection language={language} />

      {/* 10. FARMER STORY & IMPACT */}
      <FarmerImpactSection language={language} />

      {/* 11. CALL TO ACTION SECTION */}
      <CTASection
        language={language}
        onCheckCrop={onLaunchScanner}
        onExploreRates={() => scrollToSection('market-rates')}
      />

      {/* 12. FOOTER */}
      <Footer
        language={language}
        onLanguageChange={onLanguageChange}
        onNavigateSection={scrollToSection}
      />

    </div>
  );
};
