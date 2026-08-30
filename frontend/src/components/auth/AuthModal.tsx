import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Mail, User, MapPin, Sprout, AlertCircle, RefreshCw, LogIn, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';
import type { Language } from '../../types';

interface AuthModalProps {
  language: Language;
}

const ALL_INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const AuthModal: React.FC<AuthModalProps> = ({ language }) => {
  const { authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalMode === 'register' ? 'register' : 'login');
  
  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
    }
  }, [authModalMode]);

  // Lock background body scroll when AuthModal is open & restore on close/unmount
  useEffect(() => {
    if (!authModalMode) return;

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, [authModalMode]);

  // Form Fields
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Gorakhpur');
  const [village, setVillage] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [districtsList, setDistrictsList] = useState<string[]>(['Gorakhpur', 'Lucknow', 'Kanpur Nagar', 'Agra', 'Varanasi', 'Prayagraj']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inline Password Mismatch Error State & Ref for smooth scrolling
  const [passwordMismatchError, setPasswordMismatchError] = useState<string | null>(null);
  const confirmPasswordRef = useRef<HTMLDivElement>(null);

  // Realtime error clearing when passwords match or are edited
  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (passwordMismatchError && (val === confirmPassword || !val || !confirmPassword)) {
      setPasswordMismatchError(null);
    }
  };

  const handleConfirmPasswordChange = (val: string) => {
    setConfirmPassword(val);
    if (passwordMismatchError && (password === val || !val || !password)) {
      setPasswordMismatchError(null);
    }
  };

  // Fetch districts whenever state changes
  useEffect(() => {
    async function loadDistricts() {
      if (state) {
        const dists = await apiService.getDistricts(state);
        const filtered = dists.filter((d) => d !== 'All');
        setDistrictsList(filtered.length > 0 ? filtered : ['Gorakhpur', 'Lucknow', 'Kanpur Nagar']);
        if (filtered.length > 0 && !filtered.includes(district)) {
          setDistrict(filtered[0]);
        }
      }
    }
    loadDistricts();
  }, [state]);

  if (!authModalMode) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setPasswordMismatchError(null);
    setLoading(true);

    try {
      if (activeTab === 'login') {
        if (!emailOrPhone.trim()) {
          setErrorMessage(language === 'hi' ? 'कृपया ईमेल या मोबाइल नंबर दर्ज करें' : 'Please enter your email or mobile number.');
          setLoading(false);
          return;
        }
        if (!password) {
          setErrorMessage(language === 'hi' ? 'कृपया पासवर्ड दर्ज करें' : 'Please enter your password.');
          setLoading(false);
          return;
        }

        const res = await login({ emailOrPhone, password });
        if (!res.success) {
          setErrorMessage(res.message || (language === 'hi' ? 'अमान्य क्रेडेंशियल' : 'Invalid credentials. Please check and try again.'));
        }
      } else {
        // Register Validation
        if (!name.trim() || name.trim().length < 2) {
          setErrorMessage(language === 'hi' ? 'कृपया अपना नाम दर्ज करें (न्यूनतम 2 अक्षर)' : 'Full name must be at least 2 characters.');
          setLoading(false);
          return;
        }
        if (!emailOrPhone.trim()) {
          setErrorMessage(language === 'hi' ? 'कृपया ईमेल या 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Valid email or mobile number is required.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setErrorMessage(language === 'hi' ? 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए' : 'Password must be at least 6 characters.');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setPasswordMismatchError(
            language === 'hi'
              ? 'पासवर्ड मेल नहीं खाते हैं। कृपया सुनिश्चित करें कि दोनों पासवर्ड समान हैं।'
              : 'Passwords do not match. Please make sure both passwords are identical.'
          );
          setLoading(false);
          setTimeout(() => {
            confirmPasswordRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }, 50);
          return;
        }
        if (!state) {
          setErrorMessage(language === 'hi' ? 'कृपया राज्य चुनें' : 'Please select your State.');
          setLoading(false);
          return;
        }
        if (!district) {
          setErrorMessage(language === 'hi' ? 'कृपया जिला चुनें' : 'Please select your District.');
          setLoading(false);
          return;
        }

        const res = await register({
          name,
          emailOrPhone,
          password,
          state,
          district,
          village,
          primaryCrop
        });

        if (!res.success) {
          setErrorMessage(res.message || (language === 'hi' ? 'पंजीकरण विफल' : 'Registration failed. Please try again.'));
        }
      }
    } catch (err) {
      setErrorMessage(language === 'hi' ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।' : 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md animate-fadeIn overscroll-contain">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] overscroll-contain">
        
        {/* Modal Header */}
        <div className="bg-[#1b4332] p-6 text-white relative shrink-0">
          <button
            onClick={closeAuthModal}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest block">Krishi Shield AI Auth</span>
              <h3 className="text-xl sm:text-2xl font-black font-serif-title">
                {activeTab === 'login' 
                  ? (language === 'hi' ? 'किसान लॉगिन' : 'Farmer Login')
                  : (language === 'hi' ? 'नया खाता बनाएं' : 'Create Farmer Account')}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            {activeTab === 'login'
              ? (language === 'hi' ? 'मंडी भाव, फसल सुरक्षा रिपोर्ट और अलर्ट प्रबंधित करें।' : 'Access your Mandi alerts, disease reports, and personal farm insights.')
              : (language === 'hi' ? 'भारत के अग्रणी कृषि AI नेटवर्क का हिस्सा बनें।' : 'Join India’s AI-powered agricultural protection network.')}
          </p>

          {/* Tab Switcher Toolbar */}
          <div className="flex bg-[#122e22] p-1 rounded-2xl mt-5 border border-white/10">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                openAuthModal('login');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'login'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'लॉगिन' : 'Login'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                openAuthModal('register');
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'register'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'पंजीकरण (Register)' : 'Register'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto overscroll-contain touch-pan-y space-y-4">
          
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-xs font-bold flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* REGISTER: Full Name */}
            {activeTab === 'register' && (
              <div className="flex flex-col space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  {language === 'hi' ? 'पूरा नाम / FULL NAME' : 'FULL NAME / पूरा नाम'} *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'hi' ? 'उदा. राम कुमार' : 'e.g. Ramesh Singh'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>
            )}

            {/* EMAIL OR MOBILE */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                {language === 'hi' ? 'ईमेल या मोबाइल नंबर / EMAIL OR PHONE' : 'EMAIL OR PHONE NUMBER'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? '9876543210 या farmer@gmail.com' : 'Mobile number or email address'}
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                {language === 'hi' ? 'पासवर्ड / PASSWORD' : 'PASSWORD'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full h-11 pl-10 pr-10 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:bg-white focus:outline-none font-semibold text-slate-800 transition-colors ${
                    passwordMismatchError
                      ? 'border-red-400 ring-2 ring-red-400/20'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* REGISTER: Confirm Password */}
            {activeTab === 'register' && (
              <div ref={confirmPasswordRef} className="flex flex-col space-y-1">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                  {language === 'hi' ? 'पासवर्ड की पुष्टि करें / CONFIRM PASSWORD' : 'CONFIRM PASSWORD'} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                    className={`w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:bg-white focus:outline-none font-semibold text-slate-800 transition-colors ${
                      passwordMismatchError
                        ? 'border-red-500 ring-2 ring-red-500/20'
                        : 'border-slate-300 focus:ring-emerald-500'
                    }`}
                  />
                </div>

                {/* Inline Password Mismatch Error Banner */}
                {passwordMismatchError && (
                  <div className="mt-1.5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-start gap-2 animate-shake shadow-sm">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="leading-tight">
                      <span className="block font-black text-red-900">
                        {language === 'hi' ? '⚠️ पासवर्ड मेल नहीं खाते' : '⚠️ Passwords do not match.'}
                      </span>
                      <span className="text-[11px] font-medium text-red-700">
                        {language === 'hi'
                          ? 'कृपया सुनिश्चित करें कि दोनों पासवर्ड समान हैं।'
                          : 'Please make sure both passwords are identical.'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* REGISTER LOCATION & CROP FIELDS */}
            {activeTab === 'register' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* State Select */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                      {language === 'hi' ? 'राज्य / STATE' : 'STATE'} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-11 pl-10 pr-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-bold text-slate-800 cursor-pointer"
                      >
                        {ALL_INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* District Select */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                      {language === 'hi' ? 'जिला / DISTRICT' : 'DISTRICT'} *
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full h-11 pl-10 pr-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-bold text-slate-800 cursor-pointer"
                      >
                        {districtsList.map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Village (Optional) */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                      {language === 'hi' ? 'गांव / VILLAGE (वैकल्पिक)' : 'VILLAGE (OPTIONAL)'}
                    </label>
                    <input
                      type="text"
                      placeholder={language === 'hi' ? 'उदा. रामपुर' : 'e.g. Rampur'}
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      className="w-full h-11 px-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                    />
                  </div>

                  {/* Primary Crop (Optional) */}
                  <div className="flex flex-col space-y-1">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                      {language === 'hi' ? 'मुख्य फसल / PRIMARY CROP' : 'PRIMARY CROP'}
                    </label>
                    <div className="relative">
                      <Sprout className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder={language === 'hi' ? 'उदा. गेहूं / धान' : 'e.g. Wheat, Rice, Sugarcane'}
                        value={primaryCrop}
                        onChange={(e) => setPrimaryCrop(e.target.value)}
                        className="w-full h-11 pl-10 pr-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                      />
                    </div>
                  </div>

                </div>
              </>
            )}

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{language === 'hi' ? 'प्रसंस्करण हो रहा है...' : 'Processing...'}</span>
                </>
              ) : (
                <span>
                  {activeTab === 'login'
                    ? (language === 'hi' ? 'लॉगिन करें (Sign In)' : 'Sign In to Account')
                    : (language === 'hi' ? 'खाता बनाएं (Create Account)' : 'Create Farmer Account')}
                </span>
              )}
            </button>

          </form>

          {/* Footer toggle note */}
          <div className="pt-2 text-center text-xs font-semibold text-slate-500">
            {activeTab === 'login' ? (
              <p>
                {language === 'hi' ? 'नया खाता चाहिए?' : "Don't have an account yet?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    openAuthModal('register');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-700 font-extrabold hover:underline"
                >
                  {language === 'hi' ? 'यहां पंजीकरण करें' : 'Register now'}
                </button>
              </p>
            ) : (
              <p>
                {language === 'hi' ? 'पहले से खाता है?' : 'Already registered?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    openAuthModal('login');
                    setErrorMessage(null);
                  }}
                  className="text-emerald-700 font-extrabold hover:underline"
                >
                  {language === 'hi' ? 'लॉगिन करें' : 'Sign in here'}
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
