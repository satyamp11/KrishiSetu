import React from 'react';
import { Sprout, ArrowRight } from 'lucide-react';
import type { Language } from '../../types';

interface CTASectionProps {
  language?: Language;
  onExploreMarketplace?: () => void;
  onJoinKrishiSetu?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({
  onExploreMarketplace = () => {},
  onJoinKrishiSetu = () => {},
}) => {
  return (
    <section className="py-20 bg-[#1b4332] text-white font-sans border-t border-emerald-900 relative overflow-hidden">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
        
        <div className="w-14 h-14 rounded-3xl bg-emerald-800 text-emerald-300 flex items-center justify-center mx-auto shadow-lg border border-emerald-700">
          <Sprout className="w-8 h-8" />
        </div>

        <h2 className="text-4xl sm:text-5xl font-extrabold font-sans tracking-tight text-white leading-tight">
          Build a Fairer Food Supply Chain.
        </h2>

        <p className="text-base sm:text-lg text-emerald-100 max-w-2xl mx-auto font-medium">
          Connect directly. Trade transparently. Deliver intelligently.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onExploreMarketplace}
            className="bg-white text-[#1b4332] hover:bg-emerald-50 px-8 py-4 rounded-2xl font-black text-base shadow-lg transition-all flex items-center justify-center gap-2 border border-emerald-200 w-full sm:w-auto"
          >
            <span>Explore Marketplace</span>
            <ArrowRight className="w-5 h-5 text-[#1b4332]" />
          </button>

          <button
            onClick={onJoinKrishiSetu}
            className="bg-emerald-800 hover:bg-emerald-700 text-white border-2 border-emerald-500 px-8 py-4 rounded-2xl font-extrabold text-base shadow-md transition-all w-full sm:w-auto"
          >
            <span>Join KrishiSetu</span>
          </button>
        </div>

      </div>
    </section>
  );
};
