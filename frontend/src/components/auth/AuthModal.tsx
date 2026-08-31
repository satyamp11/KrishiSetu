import React, { useState, useEffect, useRef } from 'react';
import { X, Mail, User, MapPin, Sprout, AlertCircle, RefreshCw, LogIn, UserPlus, ShieldCheck, CheckCircle2, KeyRound, ArrowRight } from 'lucide-react';
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
  const { authModalMode, closeAuthModal, openAuthModal, sendOtp, verifyOtp } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(authModalMode === 'register' ? 'register' : 'login');
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');

  useEffect(() => {
    if (authModalMode) {
      setActiveTab(authModalMode);
      setStep('identifier');
      setErrorMessage(null);
      setSuccessMessage(null);
      setOtp('');
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
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [district, setDistrict] = useState('Gorakhpur');
  const [village, setVillage] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  
  const [districtsList, setDistrictsList] = useState<string[]>(['Gorakhpur', 'Lucknow', 'Kanpur Nagar', 'Agra', 'Varanasi', 'Prayagraj']);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 45-Second Resend Countdown Timer State
  const [resendTimer, setResendTimer] = useState<number>(45);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsTimerActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, resendTimer]);

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

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!emailOrPhone.trim()) {
      setErrorMessage(language === 'hi' ? 'कृपया ईमेल या 10 अंकों का मोबाइल नंबर दर्ज करें' : 'Please enter your email address or 10-digit mobile number.');
      return;
    }

    if (activeTab === 'register') {
      if (!name.trim() || name.trim().length < 2) {
        setErrorMessage(language === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें' : 'Full name must be at least 2 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await sendOtp(emailOrPhone.trim());
      if (res.success) {
        setStep('otp');
        setSuccessMessage(res.message || (language === 'hi' ? 'OTP सफलतापूर्वक भेजा गया।' : 'OTP sent successfully.'));
        setResendTimer(45);
        setIsTimerActive(true);
      } else {
        setErrorMessage(res.message || (language === 'hi' ? 'OTP भेजने में विफलता' : 'Failed to send OTP. Please try again.'));
      }
    } catch (err) {
      setErrorMessage(language === 'hi' ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।' : 'Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setErrorMessage(language === 'hi' ? 'कृपया 6 अंकों का OTP दर्ज करें' : 'Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp({
        identifier: emailOrPhone.trim(),
        otp: otp.trim(),
        name: activeTab === 'register' ? name.trim() : undefined,
        state: activeTab === 'register' ? state : undefined,
        district: activeTab === 'register' ? district : undefined,
        village: activeTab === 'register' ? village : undefined,
        primaryCrop: activeTab === 'register' ? primaryCrop : undefined
      });

      if (res.success) {
        setSuccessMessage(language === 'hi' ? 'सफलतापूर्वक सत्यापित (Verified successfully)' : 'Verified successfully. Redirecting to dashboard...');
      } else {
        setErrorMessage(res.message || (language === 'hi' ? 'OTP सत्यापन विफल' : 'Invalid OTP. Please check and try again.'));
      }
    } catch (err) {
      setErrorMessage(language === 'hi' ? 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।' : 'Network error verifying OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Click Handler
  const handleResendOtp = async () => {
    if (isTimerActive) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const res = await sendOtp(emailOrPhone.trim());
      if (res.success) {
        setSuccessMessage(res.message || (language === 'hi' ? 'नया OTP भेजा गया।' : 'New OTP sent successfully.'));
        setResendTimer(45);
        setIsTimerActive(true);
      } else {
        setErrorMessage(res.message || 'Unable to resend OTP.');
      }
    } catch (err) {
      setErrorMessage('Network error resending OTP.');
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
                  ? (language === 'hi' ? 'किसान OTP लॉगिन' : 'Farmer OTP Login')
                  : (language === 'hi' ? 'नया खाता (OTP Verification)' : 'Farmer Account OTP Setup')}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-medium">
            {step === 'identifier'
              ? (language === 'hi' ? 'सुरक्षित OTP सत्यापन के साथ कृषि शील्ड नेटवर्क तक पहुंचें।' : 'Secure 6-digit OTP verification for instant farm access.')
              : (language === 'hi' ? 'आपके पंजीकृत मोबाइल/ईमेल पर 6-अंकों का कोड भेजा गया है।' : 'Enter the 6-digit OTP code sent to your contact.')}
          </p>

          {/* Tab Switcher Toolbar (Only on Step 1) */}
          {step === 'identifier' && (
            <div className="flex bg-[#122e22] p-1 rounded-2xl mt-5 border border-white/10">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  openAuthModal('login');
                  setErrorMessage(null);
                  setSuccessMessage(null);
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
                  setSuccessMessage(null);
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
          )}
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

          {/* Success Banner */}
          {successMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: Enter Identifier & Send OTP */}
          {step === 'identifier' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              
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
                  {language === 'hi' ? 'ईमेल या मोबाइल नंबर / EMAIL OR MOBILE' : 'EMAIL OR 10-DIGIT MOBILE NUMBER'} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder={language === 'hi' ? '9876543210 या farmer@gmail.com' : 'e.g. 9876543210 or farmer@gmail.com'}
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>

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
                        {language === 'hi' ? 'गांव / VILLAGE' : 'VILLAGE'}
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
                        {language === 'hi' ? 'मुख्य फसल / CROP' : 'PRIMARY CROP'}
                      </label>
                      <div className="relative">
                        <Sprout className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder={language === 'hi' ? 'उदा. गेहूं / धान' : 'e.g. Wheat, Rice'}
                          value={primaryCrop}
                          onChange={(e) => setPrimaryCrop(e.target.value)}
                          className="w-full h-11 pl-10 pr-3 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none font-semibold text-slate-800"
                        />
                      </div>
                    </div>

                  </div>
                </>
              )}

              {/* Submit Action Button: Send OTP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>{language === 'hi' ? 'OTP भेजा जा रहा है...' : 'Sending OTP...'}</span>
                  </>
                ) : (
                  <>
                    <span>{language === 'hi' ? 'OTP प्राप्त करें (Send OTP)' : 'Send OTP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}

          {/* STEP 2: Enter 6-digit OTP & Verify */}
          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                    {language === 'hi' ? '6-अंकों का OTP कोड दर्ज करें' : 'ENTER 6-DIGIT OTP CODE'} *
                  </label>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Sent to: {emailOrPhone}
                  </span>
                </div>

                <div className="relative">
                  <KeyRound className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full h-13 pl-12 pr-4 text-center tracking-[0.4em] font-black text-xl bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              {/* Submit Action Button: Verify OTP */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-[#1b4332] hover:bg-[#2d6a4f] text-white font-black text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>{language === 'hi' ? 'सत्यापित हो रहा है...' : 'Verifying OTP...'}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{language === 'hi' ? 'OTP सत्यापित करें (Verify OTP)' : 'Verify OTP'}</span>
                  </>
                )}
              </button>

              {/* Resend OTP & Change Contact toolbar */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep('identifier');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-bold text-slate-500 hover:text-slate-800"
                >
                  ← {language === 'hi' ? 'नंबर/ईमेल बदलें' : 'Change Number / Email'}
                </button>

                <button
                  type="button"
                  disabled={isTimerActive || loading}
                  onClick={handleResendOtp}
                  className={`font-black transition-colors ${
                    isTimerActive
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-emerald-700 hover:underline'
                  }`}
                >
                  {isTimerActive
                    ? (language === 'hi' ? `${resendTimer}s में पुन: भेजें` : `Resend OTP in ${resendTimer}s`)
                    : (language === 'hi' ? 'OTP पुन: भेजें (Resend OTP)' : 'Resend OTP')}
                </button>
              </div>

            </form>
          )}

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
                    setStep('identifier');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-700 font-extrabold hover:underline"
                >
                  {language === 'hi' ? 'यहाँ पंजीकरण करें' : 'Register now'}
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
                    setStep('identifier');
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="text-emerald-700 font-extrabold hover:underline"
                >
                  {language === 'hi' ? 'लॉगइन करें' : 'Sign in here'}
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
