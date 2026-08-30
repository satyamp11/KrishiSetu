export interface CommunityAlertItem {
  id: string;
  diseaseName: string;
  diseaseHindi: string;
  crop: string;
  state: string;
  district: string;
  centerVillage: string;
  severity: 'Critical' | 'Warning' | 'Low';
  reportCount: number;
  description: string;
  descriptionHindi: string;
  recommendations: string[];
  recommendationsHindi: string[];
  createdAt: string;
}

const SAMPLE_ALERTS: CommunityAlertItem[] = [
  {
    id: 'alert-gkp-1',
    diseaseName: 'Tomato Early Blight',
    diseaseHindi: 'टमाटर अगेती झुलसा प्रकोप',
    crop: 'Tomato',
    state: 'Uttar Pradesh',
    district: 'Gorakhpur',
    centerVillage: 'Sahjanwa',
    severity: 'Critical',
    reportCount: 5,
    description: 'High humidity in Gorakhpur has triggered early blight spread in tomato fields.',
    descriptionHindi: 'गोरखपुर में उच्च आर्द्रता के कारण टमाटर के खेतों में अगेती झुलसा रोग तेजी से फैल रहा है।',
    recommendations: ['Apply Mancozeb 75% WP spray', 'Ensure field drainage'],
    recommendationsHindi: ['मैनकोज़ेब 75% डब्लूपी का छिड़काव करें', 'खेत में पानी निकासी सुनिश्चित करें'],
    createdAt: new Date().toISOString()
  },
  {
    id: 'alert-gkp-2',
    diseaseName: 'Wheat Yellow Rust',
    diseaseHindi: 'गेहूं पीला रतुआ चेतावनी',
    crop: 'Wheat',
    state: 'Uttar Pradesh',
    district: 'Gorakhpur',
    centerVillage: 'Pipraich',
    severity: 'Warning',
    reportCount: 3,
    description: 'Yellow stripe rust symptoms observed in wheat beds near Pipraich.',
    descriptionHindi: 'पिपराइच के पास गेहूं की क्यारियों में पीले रतुआ के लक्षण देखे गए हैं।',
    recommendations: ['Apply Propiconazole 25% EC at first sight of yellow spots'],
    recommendationsHindi: ['पीले धब्बे दिखाई देने पर प्रोपिकोनाज़ोल 25% ईसी का छिड़काव करें'],
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'alert-pb-1',
    diseaseName: 'Paddy Bacterial Leaf Blight',
    diseaseHindi: 'धान जीवाणु पर्ण अंगमारी',
    crop: 'Rice',
    state: 'Punjab',
    district: 'Ludhiana',
    centerVillage: 'Samrala',
    severity: 'Warning',
    reportCount: 4,
    description: 'Bacterial blight detected in paddy nurseries.',
    descriptionHindi: 'धान की नर्सरी में जीवाणु अंगमारी के लक्षण देखे गए हैं।',
    recommendations: ['Avoid excess nitrogen fertilizer'],
    recommendationsHindi: ['अत्यधिक नाइट्रोजन उर्वरक के प्रयोग से बचें'],
    createdAt: new Date().toISOString()
  }
];

export const alertService = {
  getRelevantAlerts(state?: string, district?: string, crop?: string): CommunityAlertItem[] {
    let results = [...SAMPLE_ALERTS];

    if (state && state !== 'All') {
      results = results.filter((a) => a.state.toLowerCase() === state.toLowerCase());
    }

    if (district && district !== 'All') {
      results = results.filter((a) => a.district.toLowerCase() === district.toLowerCase());
    }

    if (crop && crop !== 'All') {
      results = results.filter((a) => a.crop.toLowerCase().includes(crop.toLowerCase()));
    }

    // Fallback if zero district matches exist
    if (results.length === 0) {
      return SAMPLE_ALERTS.slice(0, 2);
    }

    return results;
  }
};
