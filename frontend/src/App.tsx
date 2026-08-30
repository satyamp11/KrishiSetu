import { useState } from 'react';
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
import { KrishiLandingPage } from './components/landing/KrishiLandingPage';

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

export function App() {
  // App State - Default to 'landing' for Homepage
  const [activeTab, setActiveTab] = useState<TabType>('landing');
  const [language, setLanguage] = useState<Language>('hi');
  const [sunlightMode, setSunlightMode] = useState<boolean>(false);

  
  // Data State
  const [farmer, setFarmer] = useState<FarmerProfile>(INITIAL_FARMER);
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
    // Step 1: Elevate risk level
    setRiskLevel('outbreak');
    setUnreadAlertsCount(prev => prev + 1);

    // Step 2: Add severe outbreak cluster
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

    // Step 3: Trigger push notification banner
    setDemoNotification('⚠️ HIGH RISK OUTBREAK ALERT: 5 farmers in your village reported Tomato Blight within 3.2 km!');

    // Navigate to Alerts screen to show live emergency response
    setActiveTab('alerts');

    // Auto hide notification banner after 6 seconds
    setTimeout(() => {
      setDemoNotification(null);
    }, 8000);
  };

  const showHeaderAndNav = activeTab !== 'splash' && activeTab !== 'login' && activeTab !== 'landing';

  return (
    <MobileFrameWrapper sunlightMode={sunlightMode}>
      
      {/* Top Header Bar (When in App Dashboard view) */}
      {showHeaderAndNav && (
        <HeaderBar
          language={language}
          onLanguageChange={setLanguage}
          sunlightMode={sunlightMode}
          onToggleSunlightMode={() => setSunlightMode(!sunlightMode)}
          onTriggerDemo={() => setIsSimulatorOpen(true)}
          unreadAlertsCount={unreadAlertsCount}
          activeTab={activeTab}
          onTabChange={setActiveTab}
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
        {activeTab === 'landing' && (
          <KrishiLandingPage
            language={language}
            onLanguageChange={setLanguage}
            onLaunchApp={() => setActiveTab('home')}
            onLaunchScanner={() => setActiveTab('scan')}
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
            onNavigateToScan={() => setActiveTab('scan')}
            onNavigateToMap={() => setActiveTab('map')}
            onNavigateToAlerts={() => setActiveTab('alerts')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'scan' && (
          <CropScanner
            language={language}
            onScanComplete={handleScanComplete}
            onBack={() => setActiveTab('home')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'result' && (
          <ScanResult
            language={language}
            disease={currentDiagnosis}
            scannedImage={scannedImage}
            onReportCase={() => setActiveTab('report')}
            onBack={() => setActiveTab('scan')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'map' && (
          <CommunityMap
            language={language}
            clusters={clusters}
            reports={reports}
            sunlightMode={sunlightMode}
            onNavigateToScan={() => setActiveTab('scan')}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsScreen
            language={language}
            clusters={clusters}
            onNavigateToScan={() => setActiveTab('scan')}
            onNavigateToMap={() => setActiveTab('map')}
            sunlightMode={sunlightMode}
          />
        )}

        {activeTab === 'report' && (
          <ReportScreen
            language={language}
            farmer={farmer}
            initialDisease={currentDiagnosis}
            onReportSubmitted={handleReportSubmitted}
            onBack={() => setActiveTab('result')}
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
            onLogout={() => setActiveTab('login')}
          />
        )}
      </div>

      {/* Bottom Navigation Bar */}
      {showHeaderAndNav && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
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

    </MobileFrameWrapper>
  );
}

export default App;
