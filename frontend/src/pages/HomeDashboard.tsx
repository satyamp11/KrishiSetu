import React from 'react';
import { 
  ShieldCheck, AlertTriangle, CloudSun, 
  ChevronRight, ArrowRight, CheckCircle2, Phone, MessageSquare, MapPin,
  Leaf, Award, Truck
} from 'lucide-react';
import type { Language, FarmerProfile, WeatherData, OutbreakCluster, CommunityActivity, RiskLevel } from '../types';
import { translations } from '../translations';

interface HomeDashboardProps {
  language: Language;
  farmer: FarmerProfile;
  weather: WeatherData;
  riskLevel: RiskLevel;
  activeClusters: OutbreakCluster[];
  activities: CommunityActivity[];
  onNavigateToScan: () => void;
  onNavigateToMap: () => void;
  onNavigateToAlerts: () => void;
  sunlightMode: boolean;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  language,
  farmer,
  weather,
  riskLevel,
  activeClusters,
  activities: _activities,
  onNavigateToScan,
  onNavigateToMap,
  onNavigateToAlerts,
  sunlightMode
}) => {
  const t = translations[language];

  return (
    <div className={`w-full min-h-screen transition-colors ${
      sunlightMode ? 'bg-white text-black' : 'bg-[#faf9f6] text-slate-900'
    }`}>
      
      {/* 0. TOP ACTIVE VILLAGE & RISK STATUS BANNER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <div className={`rounded-2xl p-4 shadow-sm border transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${
          riskLevel === 'safe'
            ? 'bg-[#e8f5e9] border-[#2d6a4f]/30 text-[#1b4332]'
            : 'bg-red-50 border-red-300 text-red-950 animate-beacon'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${
              riskLevel === 'safe' ? 'bg-[#1b4332] text-white' : 'bg-red-600 text-white animate-bounce'
            }`}>
              {riskLevel === 'safe' ? (
                <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
              ) : (
                <AlertTriangle className="w-7 h-7 stroke-[2.2]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  riskLevel === 'safe' ? 'bg-[#2d6a4f] text-white' : 'bg-red-600 text-white'
                }`}>
                  📍 {farmer.village} ({farmer.district})
                </span>
                <span className="text-xs text-[#2d6a4f] font-bold">• GPS Node Connected ({activeClusters.length} Clusters Active)</span>
              </div>
              <h2 className="text-lg font-extrabold text-[#1b4332] mt-0.5 font-serif-title">
                {riskLevel === 'safe' ? t.farmStatusSafe : t.farmStatusAlert}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="bg-white/80 backdrop-blur px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <div>
                <span className="font-bold text-slate-800">{weather.temp}°C {weather.condition}</span>
                <span className="text-[10px] text-slate-500 ml-1.5">💧 {weather.humidity}% Hum</span>
              </div>
            </div>
            {riskLevel !== 'safe' && (
              <button
                onClick={onNavigateToAlerts}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-bold rounded-xl shadow flex items-center gap-1"
              >
                <span>View Affected Zone</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 1. GREENBASKET HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Script Subhead Tag */}
            <div className="flex items-center gap-2">
              <span className="font-script text-3xl sm:text-4xl text-[#2d6a4f] font-bold">
                Farm Protection 
              </span>
              <Leaf className="w-6 h-6 text-[#2d6a4f] stroke-[2.2]" />
            </div>

            {/* Massive Elegant Serif Headline */}
            <h1 className="font-serif-title text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b4332] leading-[1.05] tracking-tight">
              Good crops <br />
              <span className="text-[#2d6a4f]">Good harvest</span> <br />
              Good life
            </h1>

            {/* Paragraph Subtitle */}
            <p className="text-slate-600 text-base sm:text-lg max-w-lg font-medium leading-relaxed">
              AI-powered crop diagnosis, real-time outbreak mapping & disease remedies delivered directly to your farm.
            </p>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onNavigateToScan}
                className="bg-[#1b4332] hover:bg-[#143326] text-white px-7 py-3.5 rounded-full font-bold shadow-lg shadow-[#1b4332]/25 flex items-center gap-3 text-base transition-transform transform active:scale-95 group"
              >
                <span>Scan Crop Now</span>
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </button>

              <button
                onClick={onNavigateToMap}
                className="border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 px-7 py-3.5 rounded-full font-bold text-base transition-colors shadow-sm"
              >
                Explore Outbreak Map
              </button>
            </div>

            {/* 3 Feature Badges Row */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80">
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-[#e8f5e9] text-[#1b4332] shrink-0 mt-0.5">
                  <Award className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#1b4332]">100% AI Accuracy</h4>
                  <p className="text-[11px] text-slate-500">Certified & Natural</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-[#e8f5e9] text-[#1b4332] shrink-0 mt-0.5">
                  <Truck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#1b4332]">Fast Outbreak Alerts</h4>
                  <p className="text-[11px] text-slate-500">On-Time, Every Time</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-[#e8f5e9] text-[#1b4332] shrink-0 mt-0.5">
                  <Leaf className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#1b4332]">Community Sourced</h4>
                  <p className="text-[11px] text-slate-500">Good for Farmers</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column Visual Banner Photo */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gradient-to-tr from-[#1b4332] to-[#2d6a4f] p-2">
              <img 
                src="/hero.jpg" 
                alt="Krishi Shield AI - Farmer Protection & Healthy Harvest" 
                className="w-full h-[400px] sm:h-[480px] object-cover rounded-2xl transform hover:scale-105 transition-transform duration-500"
              />

              
              {/* Floating GreenBasket Badge on Image */}
              <div className="absolute bottom-6 left-6 bg-[#1b4332]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/20">
                <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center text-emerald-300">
                  <Leaf className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-200 font-extrabold block">AI Certified</span>
                  <span className="font-serif-title font-bold text-base text-white">Always Protected</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY CATEGORY / CROP DEFENSE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-black tracking-widest text-[#1b4332] uppercase">
            EXPLORE BY CROP
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-[#1b4332]">
            Best of Nature, Handpicked for You
          </h2>
        </div>

        {/* 5 Crop Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            {
              title: 'Vegetables',
              subtitle: 'Blight & Leaf Spot',
              icon: '🥬',
              image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'
            },
            {
              title: 'Fruits',
              subtitle: 'Mildew & Rot Shield',
              icon: '🍎',
              image: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=400&q=80'
            },
            {
              title: 'Wheat & Grains',
              subtitle: 'Rust & Smut Warning',
              icon: '🌾',
              image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80'
            },
            {
              title: 'Pulses & Mustard',
              subtitle: 'Wilt & Rot Advisory',
              icon: '🫘',
              image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=400&q=80'
            },
            {
              title: 'Cotton & Cash Crops',
              subtitle: 'Bollworm & Red Rot',
              icon: '🌱',
              image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=400&q=80'
            }
          ].map((cat, idx) => (
            <div 
              key={idx}
              onClick={onNavigateToScan}
              className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container with Badge */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-[#f4f7f4] mb-3">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80";
                  }}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur w-9 h-9 rounded-full flex items-center justify-center text-lg shadow">
                  {cat.icon}
                </div>
              </div>

              {/* Title & Arrow */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-[#1b4332] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{cat.subtitle}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#1b4332] group-hover:text-white text-slate-700 flex items-center justify-center transition-all">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. TRACKING & FEATURE HIGHLIGHT SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column Text & Feature Bullets */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="font-script text-3xl text-[#2d6a4f] font-bold block mb-1">
                From Our Farm
              </span>
              <h2 className="font-serif-title text-4xl sm:text-5xl font-extrabold text-[#1b4332] leading-tight">
                To Your Home, <br />
                Fresh & Fast
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
              We ensure that every order and outbreak report is processed with care and broadcasted instantly to protect your village.
            </p>

            {/* 3 Feature Bullets */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Real-Time Outbreak Tracking</h4>
                  <p className="text-xs text-slate-500 font-medium">Track your disease alerts in real-time</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Freshness & Remedy Guaranteed</h4>
                  <p className="text-xs text-slate-500 font-medium">100% quality checked AI diagnosis</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Easy Alerts & Advisory</h4>
                  <p className="text-xs text-slate-500 font-medium">Hassle-free community protection</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onNavigateToScan}
                className="bg-[#1b4332] hover:bg-[#143326] text-white px-7 py-3.5 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform transform active:scale-95"
              >
                <span>Scan Crop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: GreenBasket Track Your Order Live Card Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative overflow-hidden">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-lg">Track Your Order</h3>
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Live
                </span>
              </div>

              {/* Delivery Partner Profile */}
              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <img 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" 
                    alt="Rahul Sharma" 
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80";
                    }}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Rahul Sharma</h4>
                    <p className="text-xs text-slate-500 font-medium">Your delivery partner</p>
                    <div className="flex items-center gap-1 mt-0.5 text-amber-500 text-xs">
                      {'★'.repeat(5)}
                      <span className="text-slate-700 font-bold ml-1">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="w-9 h-9 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700 transition-colors">
                    <Phone className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 rounded-full bg-[#1b4332] text-white flex items-center justify-center transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Step Progress Line */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>On the way</span>
                  <span className="text-slate-500">Arriving in 15 min</span>
                </div>

                <div className="relative py-4">
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 transform -translate-y-1/2 z-0" />
                  <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-[#1b4332] transform -translate-y-1/2 z-0" />

                  <div className="relative z-10 flex justify-between items-center text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xs font-bold shadow">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">Confirmed</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xs font-bold shadow">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">Packed</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center text-xs font-bold shadow-lg ring-4 ring-emerald-100">
                        🚚
                      </div>
                      <span className="text-[10px] font-bold text-[#1b4332]">On the way</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-xs font-bold">
                        🏠
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Footer Box */}
              <div className="bg-emerald-50/60 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <MapPin className="w-4 h-4 text-[#1b4332]" />
                  <span>123, Green Avenue, Your Street, City - 560001</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. GREENBASKET DEEP GREEN FOOTER STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16">
        <div className="bg-[#0b3b24] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center space-y-8">
          
          <div className="space-y-1">
            <h3 className="font-serif-title font-bold text-xl sm:text-2xl text-emerald-100">
              Trusted by Thousands of Happy Customers
            </h3>
            <p className="text-emerald-400 text-xs">♡</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif-title">10K+</div>
              <div className="text-xs text-emerald-200 font-medium">Happy Customers</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif-title">500+</div>
              <div className="text-xs text-emerald-200 font-medium">Organic Products</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif-title">50+</div>
              <div className="text-xs text-emerald-200 font-medium">Local Farmers</div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-serif-title">99%</div>
              <div className="text-xs text-emerald-200 font-medium">Positive Feedback</div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
