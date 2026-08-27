import type { DiseaseInfo, OutbreakCluster, OutbreakReport, WeatherData, CommunityActivity, FarmerProfile } from './types';

// High-quality SVG Data URIs for realistic crop sample photos
export const CROP_IMAGES = {
  tomatoBlight: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=600&q=80",
  wheatRust: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
  healthyWheat: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
  potatoBlight: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
  cottonBacterial: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=600&q=80",
};

export const INITIAL_FARMER: FarmerProfile = {
  name: "Rajesh Kumar",
  phone: "9876543210",
  village: "Kheri Sadh",
  district: "Rohtak",
  state: "Haryana",
  mainCrops: ["Tomato", "Wheat", "Cotton"],
  locationPermission: true,
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
};

export const INITIAL_WEATHER: WeatherData = {
  temp: 31,
  condition: "Humid & Overcast",
  conditionHindi: "नम एवं बादलों भरा",
  humidity: 88,
  diseaseRiskIndex: "High",
  riskMessage: "High moisture level creates ideal conditions for Late Blight germination.",
  riskMessageHindi: "उच्च नमी के कारण फंगल लीफ ब्लाइट फैलने का अत्यधिक जोखिम है।"
};

export const DISEASE_DATABASE: Record<string, DiseaseInfo> = {
  tomato_blight: {
    id: "tomato_blight",
    name: "Tomato Early Blight",
    nameHindi: "टमाटर अगेती झुलसा रोग",
    crop: "Tomato",
    cropHindi: "टमाटर",
    confidence: 94,
    severity: "High",
    symptoms: [
      "Concentric ring dark brown spots on lower leaves",
      "Yellowing halo around infected leaf tissue",
      "Premature leaf drop and stem lesions"
    ],
    symptomsHindi: [
      "निचली पत्तियों पर गोल भूरे छल्लेदार धब्बे",
      "संक्रमित भाग के चारों ओर पीला घेरा",
      "पत्तियों का असमय गिरना एवं तने पर घाव"
    ],
    organicAction: [
      "Spray 5% Neem leaf extract or Neem oil solution (5ml/L water) every 7 days",
      "Remove and safely burn lower infected leaves to curb spore travel",
      "Apply Trichoderma viride bio-fungicide to root zone"
    ],
    organicActionHindi: [
      "5% नीम की पत्ती का अर्क या नीम तेल (5ml/लीटर) प्रति सप्ताह छिड़कें",
      "संक्रमित निचली पत्तियों को तोड़कर खेत से दूर जला दें",
      "ट्राइकोडर्मा विरिडी जैव-फफूंदनाशी जड़ों में दें"
    ],
    chemicalAction: [
      "Spray Mancozeb 75% WP @ 2g per Liter of water immediately",
      "Follow up with Copper Oxychloride 50% WP @ 3g/L after 10 days"
    ],
    chemicalActionHindi: [
      "मैनकोज़ेब 75% डब्लूपी (2 ग्राम/लीटर पानी) का तुरंत छिड़काव करें",
      "10 दिनों के बाद कॉपर ऑक्सीक्लोराइड 50% डब्लूपी (3 ग्राम/लीटर) छिड़कें"
    ],
    prevention: [
      "Maintain 60cm row spacing for adequate air flow",
      "Avoid overhead sprinkler irrigation late in the evening"
    ],
    preventionHindi: [
      "हवा के संचार के लिए कतारों में 60 सेमी की दूरी रखें",
      "शाम के समय ऊपर से पानी के छिड़काव से बचें"
    ],
    sampleImage: CROP_IMAGES.tomatoBlight
  },
  wheat_rust: {
    id: "wheat_rust",
    name: "Yellow Rust of Wheat",
    nameHindi: "गेहूं का पीला रतुआ (हल्दी रोग)",
    crop: "Wheat",
    cropHindi: "गेहूं",
    confidence: 91,
    severity: "Critical",
    symptoms: [
      "Bright yellow powdery pustules arranged in linear stripes on leaves",
      "Yellow dust rub-off on hands when leaf is touched",
      "Rapid wilting of leaf blades during cool humid conditions"
    ],
    symptomsHindi: [
      "पत्तियों पर पीली पाउडर जैसी धारियां",
      "पत्ती को छूने पर हाथों में पीला पाउडर लगना",
      "ठंडे और नम मौसम में पत्तियों का तेजी से सूखना"
    ],
    organicAction: [
      "Spray fermented sour buttermilk (Lassi) solution (1L in 10L water)",
      "Dust wood ash mixed with sulfur over the crop canopy early morning"
    ],
    organicActionHindi: [
      "खट्टी छाछ/लस्सी का घोल (1 लीटर प्रति 10 लीटर पानी) छिड़कें",
      "सुबह तड़के राख और सल्फर का छिड़काव करें"
    ],
    chemicalAction: [
      "Spray Propiconazole 25% EC (Tilt) @ 1 ml per Liter of water immediately",
      "Repeat spray after 15 days if yellow stripes persist"
    ],
    chemicalActionHindi: [
      "प्रोपिकोनाज़ोल 25% ईसी (टिल-ट) 1 मि.ली. प्रति लीटर पानी का तुरंत छिड़काव करें",
      "यदि रोग बना रहे तो 15 दिन बाद दोबारा छिड़कें"
    ],
    prevention: [
      "Inspect border rows weekly during cold foggy mornings",
      "Alert village group immediately if yellow dust is observed"
    ],
    preventionHindi: [
      "कोहरे वाली सुबह खेत की मेड़ों की साप्ताहिक जांच करें",
      "पीली धूल दिखते ही तुरंत गांव के ग्रुप को सूचित करें"
    ],
    sampleImage: CROP_IMAGES.wheatRust
  },
  healthy_crop: {
    id: "healthy_crop",
    name: "Healthy Wheat Canopy",
    nameHindi: "स्वस्थ गेहूं की फसल",
    crop: "Wheat",
    cropHindi: "गेहूं",
    confidence: 98,
    severity: "Low",
    symptoms: ["No visible pathogens, clean green foliage", "Vigorous stem and uniform leaf coloration"],
    symptomsHindi: ["कोई बीमारी नहीं, हरी-भरी स्वस्थ पत्तियां", "मजबूत तना एवं एकसमान रंग"],
    organicAction: ["Continue standard organic compost application and balanced watering"],
    organicActionHindi: ["नियमित रूप से संतुलित सिंचाई और जैविक खाद देते रहें"],
    chemicalAction: ["No chemical pesticide needed at present stage"],
    chemicalActionHindi: ["वर्तमान में किसी रासायनिक छिड़काव की आवश्यकता नहीं है"],
    prevention: ["Keep farm borders free from wild weeds"],
    preventionHindi: ["खेत की मेड़ों को खरपतवार मुक्त रखें"],
    sampleImage: CROP_IMAGES.healthyWheat
  }
};

export const INITIAL_CLUSTERS: OutbreakCluster[] = [
  {
    id: "cluster-1",
    diseaseName: "Tomato Early Blight",
    diseaseHindi: "टमाटर अगेती झुलसा",
    crop: "Tomato",
    cropHindi: "टमाटर",
    centerVillage: "Kheri Sadh",
    lat: 28.8955,
    lng: 76.6066,
    radiusKm: 3.5,
    reportCount: 4,
    severity: "High",
    lastReportTime: "25 mins ago",
    recommendations: [
      "Inspect lower leaves of tomato plants immediately",
      "Apply preventive Mancozeb 75% WP spray if humidity >80%"
    ],
    recommendationsHindi: [
      "तुरंत अपने टमाटर के पौधों की निचली पत्तियों की जांच करें",
      "यदि हवा में नमी >80% है तो मैनकोज़ेब का निरोधात्मक छिड़काव करें"
    ]
  },
  {
    id: "cluster-2",
    diseaseName: "Yellow Rust of Wheat",
    diseaseHindi: "गेहूं का पीला रतुआ",
    crop: "Wheat",
    cropHindi: "गेहूं",
    centerVillage: "Sampla",
    lat: 28.7845,
    lng: 76.7725,
    radiusKm: 6.0,
    reportCount: 7,
    severity: "Critical",
    lastReportTime: "1 hour ago",
    recommendations: [
      "Apply Propiconazole spray to wheat crop within 24 hours",
      "Check northern borders of field facing incoming wind"
    ],
    recommendationsHindi: [
      "24 घंटे के भीतर गेहूं की फसल में प्रोपिकोनाज़ोल छिड़कें",
      "हवा की दिशा वाली उत्तरी मेड़ों की विशेष जांच करें"
    ]
  }
];

export const INITIAL_REPORTS: OutbreakReport[] = [
  {
    id: "rep-101",
    farmerName: "Suresh P.",
    village: "Kheri Sadh",
    district: "Rohtak",
    crop: "Tomato",
    diseaseName: "Tomato Early Blight",
    diseaseHindi: "टमाटर अगेती झुलसा",
    severity: "High",
    distanceKm: 1.2,
    timestamp: "25 mins ago",
    lat: 28.8920,
    lng: 76.6010,
    status: "verified"
  },
  {
    id: "rep-102",
    farmerName: "Balwan Singh",
    village: "Kheri Sadh",
    district: "Rohtak",
    crop: "Tomato",
    diseaseName: "Tomato Early Blight",
    diseaseHindi: "टमाटर अगेती झुलसा",
    severity: "High",
    distanceKm: 2.4,
    timestamp: "45 mins ago",
    lat: 28.8980,
    lng: 76.6120,
    status: "verified"
  },
  {
    id: "rep-103",
    farmerName: "Vikram R.",
    village: "Kheri Sadh",
    district: "Rohtak",
    crop: "Tomato",
    diseaseName: "Tomato Early Blight",
    diseaseHindi: "टमाटर अगेती झुलसा",
    severity: "Medium",
    distanceKm: 3.1,
    timestamp: "2 hours ago",
    lat: 28.9010,
    lng: 76.5980,
    status: "verified"
  },
  {
    id: "rep-104",
    farmerName: "Amit Kumar",
    village: "Sampla",
    district: "Rohtak",
    crop: "Wheat",
    diseaseName: "Yellow Rust of Wheat",
    diseaseHindi: "गेहूं का पीला रतुआ",
    severity: "Critical",
    distanceKm: 5.8,
    timestamp: "1 hour ago",
    lat: 28.7845,
    lng: 76.7725,
    status: "verified"
  }
];

export const COMMUNITY_ACTIVITIES: CommunityActivity[] = [
  {
    id: "act-1",
    village: "Kheri Sadh",
    district: "Rohtak",
    crop: "Tomato",
    diseaseName: "Tomato Early Blight",
    timeAgo: "10m ago",
    actionType: "report"
  },
  {
    id: "act-2",
    village: "Sampla",
    district: "Rohtak",
    crop: "Wheat",
    diseaseName: "Yellow Rust",
    timeAgo: "25m ago",
    actionType: "scan"
  },
  {
    id: "act-3",
    village: "Ismaila",
    district: "Rohtak",
    crop: "Cotton",
    diseaseName: "Healthy Crop verified",
    timeAgo: "1h ago",
    actionType: "contained"
  },
  {
    id: "act-4",
    village: "Kansala",
    district: "Rohtak",
    crop: "Potato",
    diseaseName: "Late Blight check",
    timeAgo: "2h ago",
    actionType: "scan"
  }
];
