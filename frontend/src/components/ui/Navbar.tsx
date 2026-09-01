import React, { useState } from 'react';
import {
  Sprout,
  Search,
  User,
  Menu,
  X,
  ShoppingBag,
  TrendingUp,
  Truck,
  Sparkles,
  ShieldCheck,
  Globe,
  ShoppingCart,
  Package,
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export interface NavbarProps {
  activeTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenAuth?: (mode: 'login' | 'register') => void;
  onOpenCart?: () => void;
  user?: { name: string; role?: string } | null;
  onLogout?: () => void;
  language?: string;
  onLanguageChange?: (lang: 'en' | 'hi') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab = 'landing',
  onNavigate = () => {},
  onOpenAuth = () => {},
  onOpenCart = () => {},
  user = null,
  onLogout = () => {},
  language = 'en',
  onLanguageChange = () => {},
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { id: 'landing', label: 'Home', icon: <Sprout className="w-4 h-4" /> },
    { id: 'marketplace', label: 'Produce Marketplace', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'orders', label: 'My Orders & Escrow', icon: <Package className="w-4 h-4" /> },
    { id: 'mandi', label: 'Mandi Live Rates', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'role-dashboard', label: 'Role Dashboard', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" /> },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => handleNavClick('landing')}>
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  Krishi<span className="text-emerald-700">Setu</span>
                </span>
                <Badge variant="primary" size="sm" className="hidden sm:inline-flex">
                  SIH 26033
                </Badge>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hidden sm:block">
                Direct Agricultural Marketplace
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Desktop Search, Cart & Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Quick Search trigger */}
            <div className="relative">
              <div className="flex items-center border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-1 focus-within:ring-emerald-600 transition-all">
                <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search wheat, rice, pulses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-36 lg:w-44"
                />
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 relative"
            >
              <ShoppingCart className="w-4 h-4 text-emerald-700" />
              <span>Cart</span>
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-lg px-2 py-1 bg-white text-xs font-semibold text-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
                className="hover:text-emerald-700 uppercase"
              >
                {language === 'en' ? 'EN | हिंदी' : 'हिंदी | EN'}
              </button>
            </div>

            {/* User Profile or Login/Signup */}
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <User className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                </div>
                <Button variant="ghost" size="xs" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => onOpenAuth('login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => onOpenAuth('register')}>
                  Join Marketplace
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onOpenCart}
              className="p-2 rounded-lg text-slate-700 border border-slate-200 bg-slate-50"
            >
              <ShoppingCart className="w-5 h-5 text-emerald-700" />
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2">
          {/* Mobile Navigation Links */}
          <div className="space-y-1 py-2">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile User Auth Buttons */}
          <div className="pt-3 border-t border-slate-100 flex flex-col space-y-2">
            {user ? (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2">
                  <User className="w-5 h-5 text-emerald-700" />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase">{user.role || 'Farmer'}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" fullWidth onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="md" onClick={() => onOpenAuth('login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="md" onClick={() => onOpenAuth('register')}>
                  Join Now
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
