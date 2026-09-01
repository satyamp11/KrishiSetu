import React from 'react';
import { Sprout, PhoneCall, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { Badge } from './Badge';

export interface FooterProps {
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate = () => {} }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('landing')}>
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
                <Sprout className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Krishi<span className="text-emerald-400">Setu</span>
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Empowering Indian Farmers & FPOs by eliminating multiple intermediaries. KrishiSetu connects produce producers directly with consumers and bulk buyers with AI-driven demand forecasting and route optimization.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="primary" size="sm">
                SIH Problem Statement ID 26033
              </Badge>
              <Badge variant="earth" size="sm" icon={<ShieldCheck className="w-3 h-3 text-emerald-400" />}>
                Government Mandi Feed
              </Badge>
            </div>
          </div>

          {/* Quick Links - Marketplace */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">Marketplace</h4>
            <ul className="space-y-2 text-xs font-medium text-stone-400">
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Direct Produce Directory
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Bulk B2B Contracts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mandi')} className="hover:text-emerald-400 transition-colors">
                  Real-time Mandi Rates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('marketplace')} className="hover:text-emerald-400 transition-colors">
                  Verified FPO Listings
                </button>
              </li>
            </ul>
          </div>

          {/* Solutions & AI Tools */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">AI Platform</h4>
            <ul className="space-y-2 text-xs font-medium text-stone-400">
              <li>
                <button onClick={() => onNavigate('ai-forecast')} className="hover:text-emerald-400 transition-colors">
                  AI Demand Forecasting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('logistics')} className="hover:text-emerald-400 transition-colors">
                  Logistics Route Optimizer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('scan')} className="hover:text-emerald-400 transition-colors">
                  Crop Health Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-emerald-400 transition-colors">
                  Outbreak Warning Map
                </button>
              </li>
            </ul>
          </div>

          {/* Platform Roles & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">Platform Roles</h4>
            <ul className="space-y-2 text-xs font-medium text-stone-400">
              <li>Farmer & FPO Portal</li>
              <li>Consumer Direct Store</li>
              <li>Bulk Buyer Portal</li>
              <li>Delivery Partner Dispatch</li>
              <li>Admin Control Center</li>
            </ul>
            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <div className="flex items-center gap-1.5">
                <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kisan Helpline: 1800-KRISHI-SETU</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                <span>support@krishisetu.gov.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 KrishiSetu Platform. Smart India Hackathon Project. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-stone-300">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-stone-300">
              Terms of Service
            </a>
            <span>•</span>
            <span className="flex items-center gap-1 text-stone-400">
              Built with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Indian Agriculture
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
