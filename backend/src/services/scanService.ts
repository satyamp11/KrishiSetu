import { Scan, IScan } from '../models/Scan.js';
import { CropScan, CreateScanDTO } from '../models/CropScan.js';

export const scanService = {
  async createScan(farmerId: string, dto: CreateScanDTO): Promise<CropScan> {
    try {
      const newScan = new Scan({
        userId: farmerId,
        cropName: dto.cropName,
        diseaseName: dto.diseaseName,
        diseaseHindi: dto.diseaseHindi || dto.diseaseName,
        confidence: dto.confidence || 95,
        imageUrl: dto.imageUrl || '',
        severity: dto.result === 'Healthy' ? 'Low' : 'Medium',
        symptoms: dto.recommendations || [],
        precautions: dto.recommendationsHindi || [],
        treatment: dto.recommendations || []
      });

      const saved = await newScan.save();
      return {
        id: saved._id.toString(),
        farmerId: saved.userId.toString(),
        cropName: saved.cropName,
        diseaseName: saved.diseaseName,
        diseaseHindi: saved.diseaseHindi || saved.diseaseName,
        confidence: saved.confidence,
        imageUrl: saved.imageUrl,
        result: dto.result,
        recommendations: dto.recommendations || [],
        recommendationsHindi: dto.recommendationsHindi || [],
        createdAt: saved.createdAt.toISOString()
      };
    } catch (err) {
      console.error('Error saving scan to MongoDB, returning memory object:', err);
      return {
        id: `scan_${Date.now()}`,
        farmerId,
        cropName: dto.cropName,
        diseaseName: dto.diseaseName,
        diseaseHindi: dto.diseaseHindi || dto.diseaseName,
        confidence: dto.confidence || 95,
        imageUrl: dto.imageUrl || '',
        result: dto.result,
        recommendations: dto.recommendations || [],
        recommendationsHindi: dto.recommendationsHindi || [],
        createdAt: new Date().toISOString()
      };
    }
  },

  async getFarmerScans(farmerId: string, page = 1, limit = 20): Promise<{ total: number; scans: CropScan[] }> {
    try {
      const total = await Scan.countDocuments({ userId: farmerId });
      const mongoScans = await Scan.find({ userId: farmerId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      const scans: CropScan[] = mongoScans.map((s) => ({
        id: s._id.toString(),
        farmerId: s.userId.toString(),
        cropName: s.cropName,
        diseaseName: s.diseaseName,
        diseaseHindi: s.diseaseHindi || s.diseaseName,
        confidence: s.confidence,
        imageUrl: s.imageUrl,
        result: s.severity === 'Low' ? 'Healthy' : 'Infected',
        recommendations: s.symptoms || [],
        recommendationsHindi: s.precautions || [],
        createdAt: s.createdAt.toISOString()
      }));

      return { total, scans };
    } catch (err) {
      console.error('Error fetching farmer scans from MongoDB:', err);
      return { total: 0, scans: [] };
    }
  }
};
