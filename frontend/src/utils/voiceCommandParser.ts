export interface VoiceCommandResult {
  productKeyword: string;
  quantity?: number;
  action?: string;
}

const KNOWN_PRODUCTS = [
  'wheat', 'rice', 'tomato', 'potato', 'onion', 'garlic', 'ginger',
  'black pepper', 'chana', 'chickpeas', 'mustard', 'soybean', 'cotton',
  'sugarcane', 'maize', 'corn', 'apple', 'mango', 'banana'
];

const HINDI_PRODUCTS: Record<string, string> = {
  'gehu': 'wheat', 'gehun': 'wheat',
  'chawal': 'rice', 'dhan': 'rice',
  'tamatar': 'tomato',
  'aloo': 'potato', 'alu': 'potato',
  'pyaz': 'onion', 'pyaaz': 'onion', 'kanda': 'onion',
  'lahsun': 'garlic',
  'adrak': 'ginger',
  'kali mirch': 'black pepper',
  'chana': 'chickpeas',
  'sarso': 'mustard', 'sarson': 'mustard',
  'soyabean': 'soybean',
  'kapas': 'cotton',
  'ganna': 'sugarcane',
  'makka': 'maize', 'bhutta': 'maize',
  'seb': 'apple',
  'aam': 'mango',
  'kela': 'banana'
};

const ACTION_WORDS = ['khareedo', 'buy', 'dikhao', 'show', 'search', 'chahiye', 'need'];

export function parseVoiceCommand(transcript: string): VoiceCommandResult {
  const lowerTranscript = transcript.toLowerCase().trim();
  const words = lowerTranscript.split(/\s+/);
  
  let productKeyword = '';
  let quantity: number | undefined = undefined;
  let action: string | undefined = undefined;

  // 1. Try to find a quantity (number followed by unit like kilo, ton, quintal)
  // Simple regex for number followed by optional space and unit
  const quantityMatch = lowerTranscript.match(/(\d+)\s*(kilo|kg|ton|quintal|gram|g)/);
  if (quantityMatch) {
    quantity = parseInt(quantityMatch[1], 10);
  } else {
    // Just look for any number as a fallback for quantity
    const numMatch = lowerTranscript.match(/(\d+)/);
    if (numMatch) {
      quantity = parseInt(numMatch[1], 10);
    }
  }

  // 2. Try to find action words
  for (const word of ACTION_WORDS) {
    if (words.includes(word)) {
      action = word;
      break;
    }
  }

  // 3. Find product keyword
  // First check exact multi-word matches like "black pepper" or "kali mirch"
  for (const prod of KNOWN_PRODUCTS) {
    if (lowerTranscript.includes(prod)) {
      productKeyword = prod;
      break;
    }
  }
  
  if (!productKeyword) {
    for (const [hi, en] of Object.entries(HINDI_PRODUCTS)) {
      if (lowerTranscript.includes(hi)) {
        productKeyword = en;
        break;
      }
    }
  }

  // If no known product matched, use the longest word that isn't a number or action word as a fallback
  if (!productKeyword) {
    const candidateWords = words.filter(w => 
      !ACTION_WORDS.includes(w) && 
      !w.match(/\d+/) && 
      w !== 'kilo' && w !== 'kg' && w !== 'ton' && w !== 'quintal' &&
      w.length > 2
    );
    if (candidateWords.length > 0) {
      // Use the first significant word as a fallback search term
      productKeyword = candidateWords[0];
    } else {
      productKeyword = transcript; // Fallback to entire transcript if nothing else works
    }
  }

  return {
    productKeyword,
    quantity,
    action
  };
}
