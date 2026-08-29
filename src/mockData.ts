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

export const FARMER_IMAGES = {
  farmerPrimary: "/hero.jpg",
  farmerInspect: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
  farmerGroup: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80",
  cropWheat: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80",
  cropTomato: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=800&q=80",
  cropField: "/hero.jpg"
};


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


export const MOCK_MARKET_RATES: import('./types').MarketRate[] = [
  {
    id: "mkt-wheat",
    name: "Wheat",
    nameHindi: "गेहूं",
    category: "Grains",
    price: 2450,
    unit: "Quintal",
    unitHindi: "क्विंटल",
    mandi: "Rohtak Mandi",
    mandiHindi: "रोहतक मंडी",
    state: "Haryana",
    priceChange: 2.4,
    lastUpdated: "Today, 10:30 AM",
    trend7d: [2380, 2400, 2410, 2425, 2430, 2440, 2450],
    trend30d: [2300, 2320, 2350, 2380, 2400, 2420, 2450],
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "mkt-rice",
    name: "Basmati Rice",
    nameHindi: "बासमती धान",
    category: "Grains",
    price: 3180,
    unit: "Quintal",
    unitHindi: "क्विंटल",
    mandi: "Karnal Mandi",
    mandiHindi: "करनाल मंडी",
    state: "Haryana",
    priceChange: -0.8,
    lastUpdated: "Today, 10:15 AM",
    trend7d: [3220, 3210, 3200, 3195, 3190, 3185, 3180],
    trend30d: [3300, 3280, 3250, 3220, 3200, 3190, 3180],
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "mkt-tomato",
    name: "Tomato",
    nameHindi: "टमाटर",
    category: "Vegetables",
    price: 32,
    unit: "Kg",
    unitHindi: "किग्रा",
    mandi: "Azadpur Mandi",
    mandiHindi: "आज़ादपुर मंडी",
    state: "Delhi",
    priceChange: 4.1,
    lastUpdated: "Today, 09:45 AM",
    trend7d: [28, 29, 29, 30, 31, 31, 32],
    trend30d: [22, 24, 25, 27, 29, 30, 32],
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "mkt-potato",
    name: "Potato",
    nameHindi: "आलू",
    category: "Vegetables",
    price: 18,
    unit: "Kg",
    unitHindi: "किग्रा",
    mandi: "Agra Mandi",
    mandiHindi: "आगरा मंडी",
    state: "Uttar Pradesh",
    priceChange: 1.2,
    lastUpdated: "Today, 11:00 AM",
    trend7d: [17, 17.2, 17.5, 17.5, 17.8, 17.9, 18],
    trend30d: [15, 15.5, 16, 16.5, 17, 17.5, 18],
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "mkt-onion",
    name: "Onion",
    nameHindi: "प्याज",
    category: "Vegetables",
    price: 28,
    unit: "Kg",
    unitHindi: "किग्रा",
    mandi: "Nashik Mandi",
    mandiHindi: "नाशिक मंडी",
    state: "Maharashtra",
    priceChange: -2.5,
    lastUpdated: "Today, 10:00 AM",
    trend7d: [30, 29.5, 29, 28.8, 28.5, 28.2, 28],
    trend30d: [34, 33, 32, 30, 29, 28.5, 28],
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "mkt-mustard",
    name: "Mustard",
    nameHindi: "सरसों",
    category: "Oilseeds",
    price: 5650,
    unit: "Quintal",
    unitHindi: "क्विंटल",
    mandi: "Bharatpur Mandi",
    mandiHindi: "भरतपुर मंडी",
    state: "Rajasthan",
    priceChange: 3.8,
    lastUpdated: "Today, 10:45 AM",
    trend7d: [5420, 5460, 5500, 5530, 5580, 5610, 5650],
    trend30d: [5200, 5300, 5380, 5450, 5520, 5600, 5650],
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "mkt-maize",
    name: "Maize",
    nameHindi: "मक्का",
    category: "Grains",
    price: 2120,
    unit: "Quintal",
    unitHindi: "क्विंटल",
    mandi: "Ludhiana Mandi",
    mandiHindi: "लुधियाना मंडी",
    state: "Punjab",
    priceChange: 0.5,
    lastUpdated: "Today, 09:30 AM",
    trend7d: [2100, 2105, 2110, 2110, 2115, 2118, 2120],
    trend30d: [2050, 2060, 2080, 2090, 2100, 2110, 2120],
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=300&q=80"
  },
  {
    id: "mkt-chana",
    name: "Gram (Chana)",
    nameHindi: "चना",
    category: "Pulses",
    price: 5800,
    unit: "Quintal",
    unitHindi: "क्विंटल",
    mandi: "Indore Mandi",
    mandiHindi: "इंदौर मंडी",
    state: "Madhya Pradesh",
    priceChange: 1.9,
    lastUpdated: "Today, 11:15 AM",
    trend7d: [5690, 5710, 5730, 5750, 5765, 5780, 5800],
    trend30d: [5500, 5550, 5600, 5680, 5720, 5760, 5800],
    image: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=300&q=80"
  }
];

