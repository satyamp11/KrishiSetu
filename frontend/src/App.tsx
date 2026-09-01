import { useState, useEffect, useRef } from 'react';
import type { 
  TabType, Language, FarmerProfile, WeatherData, OutbreakCluster, 
  OutbreakReport, CommunityActivity, DiseaseInfo, RiskLevel 
} from './types';
import { 
  INITIAL_FARMER, INITIAL_WEATHER, INITIAL_CLUSTERS, 
  INITIAL_REPORTS, COMMUNITY_ACTIVITIES, DISEASE_DATABASE 
} from './mockData';

// Layout & Navigation Components
import { HeaderBar } from './components/HeaderBar';
import { BottomNavigation } from './components/BottomNavigation';
import { MobileFrameWrapper } from './layouts/MobileFrameWrapper';
import { OutbreakSimulatorModal } from './components/OutbreakSimulatorModal';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './context/AuthContext';
import { KrishiLandingPage } from './components/landing/KrishiLandingPage';
import { UIFoundationShowcase } from './pages/UIFoundationShowcase';
import { ToastProvider } from './components/ui/Toast';

// Page Components
import { SplashScreen } from './pages/SplashScreen';
import { LoginScreen } from './pages/LoginScreen';
import { HomeDashboard } from './pages/HomeDashboard';
import { CropScanner } from './pages/CropScanner';
import { ScanResult } from './pages/ScanResult';
import { CommunityMap } from './pages/CommunityMap';
import { AlertsScreen } from './pages/AlertsScreen';
import { ReportScreen } from './pages/ReportScreen';
import { CommunityScreen } from './pages/CommunityScreen';
import { ProfileScreen } from './pages/ProfileScreen';

import { apiService } from './services/apiService';

const PROTECTED_TABS: TabType[] = ['home', 'scan', 'result', 'map', 'alerts', 'report', 'community', 'profile'];

export function AppContent() {
  // App State - Default to 'ui-showcase' to showcase Phase 1 Design System or 'landing' for Homepage
  const [activeTab, setActiveTab] = useState<string>('ui-showcase');
  const [language, setLanguage] = useState<Language>('hi');
  const [sunlightMode, setSunlightMode] = useState<boolean>(false);

  const { user, token, isAuthenticated, isLoading, setOnAuthSuccessCallback, openAuthModal, logout } = useAuth();

  // Store intended destination tab for post-authentication redirect
  const pendingTabRef = useRef<string | null>(null);

  // Protected route guard logic
  const handleNavigateWithAuth = (targetTab: string) => {
    if (isAuthenticated || !PROTECTED_TABS.includes(targetTab as TabType)) {
      setActiveTab(targetTab);
    } else {
      pendingTabRef.current = targetTab;
      openAuthModal('login');
    }
  };

  // Route protection effect for direct tab access
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && PROTECTED_TABS.includes(activeTab as TabType)) {
      pendingTabRef.current = activeTab;
      setActiveTab('landing');
      openAuthModal('login');
    }
  }, [activeTab, isAuthenticated, isLoading, openAuthModal]);

  // Set post-login / post-registration redirect to intended destination
  useEffect(() => {
    setOnAuthSuccessCallback(() => {
      const destination = pendingTabRef.current || 'scan';
      pendingTabRef.current = null;
      setActiveTab(destination);
    });
  }, [setOnAuthSuccessCallback]);

  // Data State
  const [farmer, setFarmer] = useState<FarmerProfile>(INITIAL_FARMER);

  // Sync authenticated user into profile
  useEffect(() => {
    if (user) {
      setFarmer((prev) => ({
        ...prev,
        name: user.name,
        state: user.state,
        district: user.district,
        village: user.village || prev.village,
        mainCrops: user.primaryCrop ? [user.primaryCrop] : prev.mainCrops
      }));
    }
  }, [user]);
  const [weather] = useState<WeatherData>(INITIAL_WEATHER);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('warning');
  const [clusters, setClusters] = useState<OutbreakCluster[]>(INITIAL_CLUSTERS);
  const [reports, setReports] = useState<OutbreakReport[]>(INITIAL_REPORTS);
  const [activities, setActivities] = useState<CommunityActivity[]>(COMMUNITY_ACTIVITIES);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(2);

  // Active Diagnosis State
  const [currentDiagnosis, setCurrentDiagnosis] = useState<DiseaseInfo>(DISEASE_DATABASE.tomato_blight);
  const [scannedImage, setScannedImage] = useState<string>('');

  // Simulator Modal State
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [demoNotification, setDemoNotification] = useState<string | null>(null);

  // Handlers
  const handleLoginComplete = (profile: FarmerProfile) => {
    setFarmer(profile);
    setActiveTab('home');
  };

  const handleScanComplete = (result: DiseaseInfo, uploadedImage: string) => {
    setCurrentDiagnosis(result);
    setScannedImage(uploadedImage);
    setActiveTab('result');

    // Automatically save scan record to backend for authenticated farmer
    if (token) {
      apiService.saveCropScan(token, {
        cropName: result.crop || 'Crop',
        diseaseName: result.name,
        diseaseHindi: result.nameHindi,
        confidence: result.confidence || 95,
        imageUrl: uploadedImage,
        result: result.name.toLowerCase().includes('healthy') ? 'Healthy' : 'Infected',
        recommendations: result.chemicalAction || result.organicAction || [],
        recommendationsHindi: result.chemicalActionHindi || result.organicActionHindi || []
      });
    }
  };

  const handleReportSubmitted = (newReport: OutbreakReport) => {
    setReports([newReport, ...reports]);
    setActivities([
      {
        id: `act-${Date.now()}`,
        village: newReport.village,
        district: newReport.district,
        crop: newReport.crop,
        diseaseName: newReport.diseaseHindi,
        timeAgo: 'Just now',
        actionType: 'report'
      },
      ...activities
    ]);
    setActiveTab('map');
  };

  // Hackathon WOW Demo Trigger Flow
  const handleExecuteOutbreakDemo = () => {
    setRiskLevel('outbreak');
    setUnreadAlertsCount(prev => prev + 1);

    const newDemoCluster: OutbreakCluster = {
      id: `demo-cluster-${Date.now()}`,
      diseaseName: 'Tomato Early Blight',
      diseaseHindi: 'टमाटर अगेती झुलसा प्रकोप',
      crop: 'Tomato',
      cropHindi: 'टमाटर',
      centerVillage: 'Kheri Sadh',
      lat: 28.8955,
      lng: 76.6066,
      radiusKm: 3.2,
      reportCount: 5,
      severity: 'Critical',
      lastReportTime: 'Just now',
      recommendations: ['Apply Mancozeb spray immediately to border beds'],
      recommendationsHindi: ['तुरंत अपने खेत की सीमा पर मैनकोज़ेब का निरोधात्मक छिड़काव करें']
    };

    setClusters([newDemoCluster, ...clusters]);
    setDemoNotification('⚠️ HIGH RISK OUTBREAK ALERT: 5 farmers in your village reported Tomato Blight within 3.2 km!');
    handleNavigateWithAuth('alerts');

    setTimeout(() => {
      setDemoNotification(null);
    }, 8000);
  };

  const showHeaderAndNav = activeTab !== 'splash' && activeTab !== 'login' && activeTab !== 'landing' && activeTab !== 'ui-showcase';

  // Prevent flickering while checking stored authentication token
  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-3 text-white">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold text-emerald-200 tracking-wider">
          Checking farmer authentication status...
        </span>
      </div>
    );
  }

  return (
    <MobileFrameWrapper sunlightMode={sunlightMode}>
      
      {/* Top Header Bar (When in Mobile Dashboard view) */}
      {showHeaderAndNav && (
        <HeaderBar
          language={language}
          onLanguageChange={setLanguage}
          sunlightMode={sunlightMode}
          onToggleSunlightMode={() => setSunlightMode(!sunlightMode)}
          onTriggerDemo={() => setIsSimulatorOpen(true)}
          unreadAlertsCount={unreadAlertsCount}
          activeTab={activeTab as TabType}
          onTabChange={handleNavigateWithAuth}
        />
      )}

      {/* Emergency Push Notification Banner Bar */}
      {demoNotification && (
        <div className="bg-red-600 text-white p-3 text-xs font-black flex items-center justify-between shadow-2xl animate-beacon z-50 sticky top-[60px]">
          <div className="flex items-center gap-2">
            <span className="text-base animate-bounce">⚠️</span>
            <span>{demoNotification}</span>
          </div>
          <button
            onClick={() => setDemoNotification(null)}
            className="bg-black/30 hover:bg-black/50 text-white px-2 py-1 rounded text-[10px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Screen Router */}
      <div className={sunlightMode ? 'sunlight-mode' : ''}>
        {activeTab === 'ui-showcase' && (
          <UIFoundationShowcase />
        )}

        {activeTab === 'landing' && (
          <KrishiLandingPage
            language={language}
            onLanguageChange={setLanguage}
            onLaunchApp={() => handleNavigateWithAuth('home')}
            onLaunchScanner={() => handleNavigateWithAuth('scan')}
          />
        )}

        {activeTab === 'splash' && (
          <SplashScreen
            language={language}
            onLanguageSelect={setLanguage}
            onContinue={() => setActiveTab('login')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'login' && (
          <LoginScreen
            language={language}
            onLoginComplete={handleLoginComplete}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'home' && (
          <HomeDashboard
            language={language}
            farmer={farmer}
            weather={weather}
            riskLevel={riskLevel}
            activeClusters={clusters}
            activities={activities}
            onNavigateToScan={() => handleNavigateWithAuth('scan')}
            onNavigateToMap={() => handleNavigateWithAuth('map')}
            onNavigateToAlerts={() => handleNavigateWithAuth('alerts')}
            onNavigateToProfile={() => handleNavigateWithAuth('profile')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'scan' && (
          <CropScanner
            language={language}
            onScanComplete={handleScanComplete}
            onBack={() => handleNavigateWithAuth('home')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'result' && (
          <ScanResult
            language={language}
            disease={currentDiagnosis}
            scannedImage={scannedImage}
            onReportCase={() => handleNavigateWithAuth('report')}
            onBack={() => handleNavigateWithAuth('scan')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'map' && (
          <CommunityMap
            language={language}
            clusters={clusters}
            reports={reports}
            sunlightMode={sunlightMode}
            onNavigateToScan={() => handleNavigateWithAuth('scan')}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsScreen
            language={language}
            clusters={clusters}
            onNavigateToScan={() => handleNavigateWithAuth('scan')}
            onNavigateToMap={() => handleNavigateWithAuth('map')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'report' && (
          <ReportScreen
            language={language}
            farmer={farmer}
            initialDisease={currentDiagnosis}
            onReportSubmitted={handleReportSubmitted}
            onBack={() => handleNavigateWithAuth('result')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'community' && (
          <CommunityScreen
            language={language}
            activities={activities}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileScreen
            language={language}
            onLanguageChange={setLanguage}
            farmer={farmer}
            submittedReports={reports}
            sunlightMode={sunlightMode}
            onToggleSunlightMode={() => setSunlightMode(!sunlightMode)}
            onLogout={() => {
              logout();
              setActiveTab('landing');
            }}
          />
        )}
      </div>

      {/* Bottom Navigation Bar */}
      {showHeaderAndNav && (
        <BottomNavigation
          activeTab={activeTab as TabType}
          onTabChange={handleNavigateWithAuth}
          language={language}
          unreadAlertsCount={unreadAlertsCount}
          sunlightMode={sunlightMode}
        />
      )}

      {/* Hackathon Outbreak Simulator Guide Modal */}
      <OutbreakSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        onRunSimulation={handleExecuteOutbreakDemo}
        language={language}
      />

      {/* Global Authentication Modal */}
      <AuthModal language={language} />

    </MobileFrameWrapper>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}

export default App;
