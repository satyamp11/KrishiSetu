export interface DiseaseInfo {
  id: string;
  name: string;
  nameHindi: string;
  crop: string;
  cropHindi: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  symptoms: string[];
  symptomsHindi: string[];
  organicAction: string[];
  organicActionHindi: string[];
  chemicalAction: string[];
  chemicalActionHindi: string[];
  prevention: string[];
  preventionHindi: string[];
  sampleImage: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  conditionHindi: string;
  humidity: number;
  diseaseRiskIndex: 'Low' | 'Moderate' | 'High' | 'Critical';
  riskMessage: string;
  riskMessageHindi: string;
}
