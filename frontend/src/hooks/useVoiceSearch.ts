import { useState, useEffect, useCallback, useRef } from 'react';
import type { Language } from '../types';

export interface UseVoiceSearchProps {
  language: Language;
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

export interface UseVoiceSearchResult {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
}

export function useVoiceSearch({ language, onResult, onError }: UseVoiceSearchProps): UseVoiceSearchResult {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Use ref to hold the recognition instance so it doesn't get recreated on every render
  const recognitionRef = useRef<any>(null);
  // Use refs for callbacks to avoid re-initializing recognition on every render
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set language
    const langMap: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      mr: 'mr-IN'
    };
    recognition.lang = langMap[language] || 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const resultTranscript = event.results[current][0].transcript;
      setTranscript(resultTranscript);
      if (onResultRef.current) {
        onResultRef.current(resultTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      let errorMessage = 'An error occurred with voice search.';
      if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied. Please allow microphone access.';
      } else if (event.error === 'no-speech') {
        errorMessage = 'No speech detected.';
      }
      
      setError(errorMessage);
      setIsListening(false);
      if (onErrorRef.current) {
        onErrorRef.current(errorMessage);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [language]); // Only re-init when language changes, not on every callback change

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('Voice search not supported on this browser');
      return;
    }
    
    setError(null);
    setTranscript('');
    
    try {
      recognitionRef.current?.start();
    } catch (e) {
      // If already started, this might throw
      console.error('Speech recognition error:', e);
    }
  }, [isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening
  };
}
