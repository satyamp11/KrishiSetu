import React, { useState, FormEvent, useEffect } from 'react';
import { Search, X, SlidersHorizontal, MapPin, Mic } from 'lucide-react';
import { Button } from './Button';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { parseVoiceCommand } from '../../utils/voiceCommandParser';
import type { Language } from '../../types';
import { translations } from '../../translations';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string, category: string, location: string) => void;
  categories?: string[];
  locations?: string[];
  initialCategory?: string;
  initialLocation?: string;
  className?: string;
  enableVoice?: boolean;
  language?: Language;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'Search crops, wheat, rice, pulses, organic produce...',
  onSearch,
  categories = ['All Crops', 'Grains', 'Vegetables', 'Pulses', 'Oilseeds', 'Spices', 'Organic'],
  locations = ['All States', 'Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Maharashtra'],
  initialCategory = 'All Crops',
  initialLocation = 'All States',
  className = '',
  enableVoice = false,
  language = 'en',
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const t = translations[language] || translations.en;

  const handleVoiceResult = (transcript: string) => {
    const parsed = parseVoiceCommand(transcript);
    setQuery(parsed.productKeyword);
    // Auto submit search on voice result
    onSearch(parsed.productKeyword, category, location);
  };

  const { isListening, isSupported, startListening, stopListening, error } = useVoiceSearch({
    language,
    onResult: handleVoiceResult,
    onError: (err) => console.error(err)
  });

  // Display error toast could be done here, but omitting for simplicity per requirements
  useEffect(() => {
    if (error) {
      console.warn("Voice search error:", error);
    }
  }, [error]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query, category, location);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('', category, location);
  };

  const toggleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white rounded-xl border border-slate-200/90 shadow-md p-2 flex flex-col md:flex-row items-center gap-2 ${className}`}
    >
      {/* Category Dropdown (Desktop/Tablet) */}
      <div className="hidden md:flex items-center px-3 border-r border-slate-200 text-sm shrink-0">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer py-2 pr-2"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Location Dropdown (Desktop/Tablet) */}
      <div className="hidden lg:flex items-center gap-1 px-3 border-r border-slate-200 text-sm shrink-0 text-slate-600">
        <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="bg-transparent text-slate-700 font-medium focus:outline-none cursor-pointer py-2 pr-2"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Search Input Field */}
      <div className="relative flex-1 w-full flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-3 shrink-0" />
        <input
          type="text"
          value={isListening ? t.voiceListening : query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-2.5 text-sm text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-none"
          disabled={isListening}
        />
        
        <div className="absolute right-2 flex items-center gap-1">
          {query && !isListening && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {enableVoice && isSupported && (
            <button
              type="button"
              onClick={toggleVoiceSearch}
              className={`p-1.5 rounded-full transition-all flex items-center justify-center ${
                isListening 
                  ? 'bg-emerald-100 text-emerald-600 shadow-[0_0_0_4px_rgba(16,185,129,0.2)] animate-pulse' 
                  : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
              title={t.voiceTapToSearch}
              aria-label={t.voiceAriaLabel}
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Filter Toggle Button */}
      <button
        type="button"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="md:hidden flex items-center justify-center p-2.5 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 w-full"
      >
        <SlidersHorizontal className="w-4 h-4 mr-2" />
        <span className="text-xs font-semibold">Filter Category & Location</span>
      </button>

      {/* Mobile Filter Drawer / Collapse */}
      {isFilterOpen && (
        <div className="md:hidden w-full space-y-2 pt-2 border-t border-slate-100 px-1">
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Crop Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm text-slate-800"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase">Region / State</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full mt-1 border border-slate-200 rounded-lg p-2 text-sm text-slate-800"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Search Submit Button */}
      <Button type="submit" variant="primary" size="md" className="w-full md:w-auto shrink-0" disabled={isListening}>
        Search Produce
      </Button>
    </form>
  );
};

