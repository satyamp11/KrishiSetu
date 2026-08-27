import React, { useState } from 'react';
import { Volume2, Play, Square, Sparkles } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../translations';

interface AudioNarrationPlayerProps {
  textToNarrate: string;
  language: Language;
}

export const AudioNarrationPlayer: React.FC<AudioNarrationPlayerProps> = ({
  textToNarrate,
  language
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const t = translations[language];

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      setIsPlaying(true);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToNarrate);
        utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
        utterance.rate = 0.9;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback simulation timer if SpeechSynthesis API is disabled in headless browser
        setTimeout(() => setIsPlaying(false), 5000);
      }
    }
  };

  return (
    <div className="bg-emerald-950/80 border border-emerald-700/60 rounded-xl p-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className={`p-2 rounded-lg ${isPlaying ? 'bg-emerald-500 text-slate-950 animate-pulse' : 'bg-emerald-800 text-emerald-200'}`}>
          <Volume2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-100 flex items-center gap-1">
            <span>{t.listenAudio}</span>
            <Sparkles className="w-3 h-3 text-amber-400" />
          </p>
          <p className="text-[10px] text-emerald-300">
            {isPlaying ? 'Playing voice narration...' : 'Tap play to listen to audio diagnosis'}
          </p>
        </div>
      </div>

      <button
        onClick={handleTogglePlay}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all transform active:scale-95 ${
          isPlaying 
            ? 'bg-red-500 hover:bg-red-600 text-white' 
            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
        }`}
      >
        {isPlaying ? (
          <>
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>Stop</span>
          </>
        ) : (
          <>
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play</span>
          </>
        )}
      </button>
    </div>
  );
};
