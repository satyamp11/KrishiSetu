import React from 'react';
import { Sprout, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate = () => {} }) => {
  return (
    <footer className="bg-[#0f281e] text-slate-300 font-sans border-t border-emerald-950 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-800 flex items-center justify-center text-white border border-emerald-700">
                <Sprout className="w-6 h-6 text-emerald-300" />
              </div>
              <span className="text-2xl font-black font-serif tracking-tight text-white">
                Krishi<span className="text-emerald-400 font-sans">Setu</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Connecting farms directly to the people who need them. Eliminating middleman markups through transparent trade, smart logistics, and AI insights.
            </p>

            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>SIH 26033 Problem Statement Platform Solution</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li><button onClick={() => onNavigate('landing')} className="hover:text-emerald-400">Home</button></li>
              <li><button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400">Marketplace</button></li>
              <li><button onClick={() => onNavigate('role-dashboard')} className="hover:text-emerald-400">Farmers & FPOs</button></li>
              <li><button onClick={() => onNavigate('role-dashboard')} className="hover:text-emerald-400">Bulk Buyers</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-300">
              <li><button onClick={() => onNavigate('role-dashboard')} className="hover:text-emerald-400">AI Insights</button></li>
              <li><button onClick={() => onNavigate('mandi')} className="hover:text-emerald-400">Market Prices</button></li>
              <li><button onClick={() => onNavigate('logistics')} className="hover:text-emerald-400">Logistics VRP</button></li>
              <li><button onClick={() => onNavigate('orders')} className="hover:text-emerald-400">Orders & Escrow</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Support & Contact</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 1800 266 7388 (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@krishisetu.gov.in</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Krishi Bhawan, New Delhi</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
          <p>© 2026 KrishiSetu Direct Agriculture Platform. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-emerald-400">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-400">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-emerald-400">Escrow Guidelines</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
