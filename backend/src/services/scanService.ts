import fs from 'fs';
import path from 'path';
import { CropScan, CreateScanDTO } from '../models/CropScan.js';

const DATA_DIR = path.resolve(process.cwd(), 'src/data');
const SCANS_FILE = path.join(DATA_DIR, 'scansStore.json');

function ensureScansStoreFile(): CropScan[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(SCANS_FILE)) {
      // Seed initial sample scan records for initial demonstration
      const initialScans: CropScan[] = [
        {
          id: 'scan_101',
          farmerId: 'usr_default',
          cropName: 'Wheat (गेहूं)',
          diseaseName: 'Healthy Crop',
          diseaseHindi: 'स्वस्थ फसल (कोई बीमारी नहीं)',
          confidence: 98,
          result: 'Healthy',
          recommendations: ['Maintain regular watering', 'Apply balanced NPK fertilizer'],
          recommendationsHindi: ['नियमित सिंचाई बनाए रखें', 'संतुलित एनपीके उर्वरक का प्रयोग करें'],
          createdAt: new Date(Date.now() - 86400000 * 1).toISOString() // 1 day ago
        },
        {
          id: 'scan_102',
          farmerId: 'usr_default',
          cropName: 'Tomato (टमाटर)',
          diseaseName: 'Tomato Early Blight',
          diseaseHindi: 'टमाटर अगेती झुलसा प्रकोप',
          confidence: 94,
          result: 'Infected',
          recommendations: ['Spray Mancozeb fungicide 2g/L', 'Remove infected lower leaves'],
          recommendationsHindi: ['मैनकोज़ेब कवकनाशी 2g/L का छिड़काव करें', 'संक्रमित निचली पत्तियों को हटा दें'],
          createdAt: new Date(Date.now() - 86400000 * 3).toISOString() // 3 days ago
        }
      ];
      fs.writeFileSync(SCANS_FILE, JSON.stringify(initialScans, null, 2), 'utf-8');
      return initialScans;
    }
    const content = fs.readFileSync(SCANS_FILE, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    console.error('Error reading scans store file:', err);
    return [];
  }
}

function saveScansStore(scans: CropScan[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(SCANS_FILE, JSON.stringify(scans, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving scans store file:', err);
  }
}

let scansStore: CropScan[] = ensureScansStoreFile();

export const scanService = {
  createScan(farmerId: string, dto: CreateScanDTO): CropScan {
    const newScan: CropScan = {
      id: `scan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      farmerId,
      cropName: dto.cropName,
      diseaseName: dto.diseaseName,
      diseaseHindi: dto.diseaseHindi,
      confidence: dto.confidence || 95,
      imageUrl: dto.imageUrl || '',
      result: dto.result,
      recommendations: dto.recommendations || [],
      recommendationsHindi: dto.recommendationsHindi || [],
      createdAt: new Date().toISOString()
    };

    scansStore.unshift(newScan);
    saveScansStore(scansStore);
    return newScan;
  },

  getFarmerScans(farmerId: string, page = 1, limit = 20): { total: number; scans: CropScan[] } {
    // Filter scans specifically for this farmer + default demo scans
    const filtered = scansStore.filter((s) => s.farmerId === farmerId || s.farmerId === 'usr_default');
    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return { total, scans: paginated };
  }
};
