export interface CropScan {
  id: string;
  farmerId: string;
  cropName: string;
  diseaseName: string;
  diseaseHindi: string;
  confidence: number;
  imageUrl?: string;
  result: 'Healthy' | 'Infected';
  recommendations?: string[];
  recommendationsHindi?: string[];
  createdAt: string;
}

export interface CreateScanDTO {
  cropName: string;
  diseaseName: string;
  diseaseHindi: string;
  confidence: number;
  imageUrl?: string;
  result: 'Healthy' | 'Infected';
  recommendations?: string[];
  recommendationsHindi?: string[];
}
