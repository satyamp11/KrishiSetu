import { MarketRate } from '../models/MarketRate.js';
import { INITIAL_MARKET_RATES, ALL_INDIAN_STATES } from '../utils/seedData.js';

let ratesStore: MarketRate[] = [...INITIAL_MARKET_RATES];

export const marketRatesService = {
  getRates(query?: { state?: string; mandi?: string; category?: string; search?: string }) {
    let result = [...ratesStore];
    const selectedState = typeof query?.state === 'string' ? query.state : 'All';
    const selectedMandi = typeof query?.mandi === 'string' ? query.mandi : 'All';
    const selectedCategory = typeof query?.category === 'string' ? query.category : 'All';
    const searchQuery = typeof query?.search === 'string' ? query.search.trim().toLowerCase() : '';

    if (selectedState !== 'All') {
      const exactMatches = result.filter(
        (r) => r.state.toLowerCase() === selectedState.toLowerCase()
      );

      if (exactMatches.length > 0) {
        result = exactMatches;
      } else {
        // Dynamically generate representative rates for requested state
        result = [
          {
            id: `gen-1-${selectedState}`,
            name: "Basmati Rice (Paddy)",
            nameHindi: "बासमती धान",
            category: "Grains",
            price: 2850,
            unit: "Quintal",
            unitHindi: "क्विंटल",
            mandi: `${selectedState} Central Mandi`,
            mandiHindi: `${selectedState} मुख्य मंडी`,
            state: selectedState,
            priceChange: 1.8,
            lastUpdated: "Today, 10:30 AM",
            trend7d: [2800, 2810, 2820, 2830, 2840, 2845, 2850],
            trend30d: [2700, 2730, 2760, 2790, 2820, 2840, 2850],
            image: "/images/crops/rice.jpg"
          },
          {
            id: `gen-2-${selectedState}`,
            name: "Fresh Tomato",
            nameHindi: "ताज़ा टमाटर",
            category: "Vegetables",
            price: 34,
            unit: "Kg",
            unitHindi: "किग्रा",
            mandi: `${selectedState} Vegetable Market`,
            mandiHindi: `${selectedState} सब्जी मंडी`,
            state: selectedState,
            priceChange: 3.5,
            lastUpdated: "Today, 09:45 AM",
            trend7d: [30, 31, 31, 32, 33, 33, 34],
            trend30d: [25, 27, 28, 30, 31, 33, 34],
            image: "/images/crops/tomato.jpg"
          },
          {
            id: `gen-3-${selectedState}`,
            name: "Wheat",
            nameHindi: "गेहूं",
            category: "Grains",
            price: 2410,
            unit: "Quintal",
            unitHindi: "क्विंटल",
            mandi: `${selectedState} District Hub`,
            mandiHindi: `${selectedState} जिला मंडी`,
            state: selectedState,
            priceChange: 0.9,
            lastUpdated: "Today, 11:00 AM",
            trend7d: [2380, 2385, 2390, 2395, 2400, 2405, 2410],
            trend30d: [2320, 2340, 2360, 2380, 2395, 2405, 2410],
            image: "/images/crops/wheat.jpg"
          },
          {
            id: `gen-4-${selectedState}`,
            name: "Mustard Oilseed",
            nameHindi: "सरसों",
            category: "Oilseeds",
            price: 5480,
            unit: "Quintal",
            unitHindi: "क्विंटल",
            mandi: `${selectedState} Kisan Mandi`,
            mandiHindi: `${selectedState} किसान मंडी`,
            state: selectedState,
            priceChange: 2.1,
            lastUpdated: "Today, 10:15 AM",
            trend7d: [5350, 5380, 5400, 5420, 5440, 5460, 5480],
            trend30d: [5150, 5200, 5280, 5350, 5400, 5450, 5480],
            image: "/images/crops/mustard.jpg"
          }
        ];
      }
    }

    if (searchQuery) {
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(searchQuery) ||
          (r.nameHindi && r.nameHindi.toLowerCase().includes(searchQuery)) ||
          r.mandi.toLowerCase().includes(searchQuery) ||
          (r.mandiHindi && r.mandiHindi.toLowerCase().includes(searchQuery)) ||
          r.state.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedCategory !== 'All') {
      result = result.filter((r) => r.category === selectedCategory);
    }

    if (selectedMandi !== 'All') {
      result = result.filter((r) => r.mandi === selectedMandi);
    }

    return {
      success: true,
      total: result.length,
      states: ['All', ...ALL_INDIAN_STATES],
      categories: ['All', 'Grains', 'Vegetables', 'Oilseeds', 'Pulses'],
      rates: result
    };
  },

  refreshPrices() {
    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    ratesStore = ratesStore.map((item) => {
      const jitter = (Math.random() - 0.5) * 10;
      const newPrice = Math.max(10, Math.round((item.price + jitter) * 10) / 10);
      return {
        ...item,
        price: newPrice,
        lastUpdated: `Just now (${currentTime})`
      };
    });

    return {
      success: true,
      lastUpdated: `Just now (${currentTime})`,
      rates: ratesStore
    };
  }
};
