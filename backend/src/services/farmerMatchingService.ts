import { Product, IProduct } from '../models/Product.js';

export interface MatchCriteria {
  productTitle?: string;
  productCategory?: string;
  quantity?: number;
  buyerDistrict?: string;
  buyerState?: string;
  qualityPreference?: 'organic' | 'fpo_verified' | 'any';
}

export type FarmerMatchResult = Partial<IProduct> & {
  id: string;
  score: number;
  matchReasons: string[];
};

// Scoring weights and constants
const SCORING = {
  PRICE_WEIGHT: 40,
  LOCATION_WEIGHT: 30,
  QUALITY_WEIGHT: 30,
  
  MAX_SCORE: 100,
  
  SAME_DISTRICT_SCORE: 30,
  SAME_STATE_SCORE: 15,
  DIFFERENT_STATE_SCORE: 0,
  
  FPO_VERIFIED_SCORE: 15,
  ORGANIC_SCORE: 15,
};

export const farmerMatchingService = {
  async findMatchingFarmers(criteria: MatchCriteria): Promise<FarmerMatchResult[]> {
    const query: any = { status: 'available' };

    if (criteria.productTitle || criteria.productCategory) {
      const orConditions = [];
      if (criteria.productTitle) {
        orConditions.push({ title: { $regex: criteria.productTitle, $options: 'i' } });
      }
      if (criteria.productCategory) {
        orConditions.push({ category: { $regex: criteria.productCategory, $options: 'i' } });
      }
      if (orConditions.length > 0) {
        query.$or = orConditions;
      }
    }

    if (criteria.quantity) {
      query.availableQuantity = { $gte: criteria.quantity };
    }

    if (criteria.qualityPreference === 'organic') {
      query.isOrganicCertified = true;
    } else if (criteria.qualityPreference === 'fpo_verified') {
      query.isVerifiedFPO = true;
    }

    const products = await Product.find(query).limit(50);

    const matches: FarmerMatchResult[] = products.map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Price Competitiveness
      let priceScore = 0;
      if (p.mandiBenchmarkPrice && p.mandiBenchmarkPrice > 0) {
        const diffPercent = ((p.mandiBenchmarkPrice - p.price) / p.mandiBenchmarkPrice) * 100;
        if (diffPercent >= 10) {
          priceScore = SCORING.PRICE_WEIGHT; // Full points if 10%+ cheaper than Mandi
          reasons.push(`${Math.round(diffPercent)}% below mandi price`);
        } else if (diffPercent > 0) {
          priceScore = (diffPercent / 10) * SCORING.PRICE_WEIGHT;
          reasons.push(`${Math.round(diffPercent)}% below mandi price`);
        } else if (diffPercent === 0) {
          priceScore = SCORING.PRICE_WEIGHT * 0.5; // Half points for matching Mandi
          reasons.push(`Matches mandi benchmark`);
        } else {
          // Above mandi price
          priceScore = 0;
        }
      } else {
        // No benchmark, assume fair pricing
        priceScore = SCORING.PRICE_WEIGHT * 0.5;
        reasons.push('Competitive market price');
      }
      score += priceScore;

      // 2. Location Proximity
      let locationScore = 0;
      if (criteria.buyerDistrict && p.location?.district && criteria.buyerDistrict.toLowerCase() === p.location.district.toLowerCase()) {
        locationScore = SCORING.SAME_DISTRICT_SCORE;
        reasons.push('Same district (Near you)');
      } else if (criteria.buyerState && p.location?.state && criteria.buyerState.toLowerCase() === p.location.state.toLowerCase()) {
        locationScore = SCORING.SAME_STATE_SCORE;
        reasons.push('Same state');
      } else {
        locationScore = SCORING.DIFFERENT_STATE_SCORE;
      }
      score += locationScore;

      // 3. Quality Signals
      let qualityScore = 0;
      if (p.isVerifiedFPO) {
        qualityScore += SCORING.FPO_VERIFIED_SCORE;
        reasons.push('FPO verified');
      }
      if (p.isOrganicCertified) {
        qualityScore += SCORING.ORGANIC_SCORE;
        reasons.push('Organic certified');
      }
      score += qualityScore;

      // Ensure score does not exceed 100
      score = Math.min(score, SCORING.MAX_SCORE);

      const productJson = p.toJSON();
      return {
        ...productJson,
        id: p._id.toString(),
        score: Math.round(score),
        matchReasons: reasons
      };
    });

    // Sort by score descending
    matches.sort((a: any, b: any) => b.score - a.score);

    return matches;
  }
};
