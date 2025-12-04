import { useState, useCallback, useEffect, useMemo } from 'react';

// Languages that don't have good TTS support in browsers
const UNSUPPORTED_TTS_LANGUAGES = ['am', 'om'];

interface UseTextToSpeechReturn {
  speak: (text: string) => void;
  stop: () => void;
  isSpeaking: boolean;
  isSupported: boolean;
  isLanguageSupported: boolean;
  unsupportedMessage: string | null;
  voices: SpeechSynthesisVoice[];
  setVoice: (voice: SpeechSynthesisVoice) => void;
  currentVoice: SpeechSynthesisVoice | null;
}

export const useTextToSpeech = (lang: string = 'en-US'): UseTextToSpeechReturn => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  
  // Check if the current language has TTS support
  const isLanguageSupported = useMemo(() => {
    return !UNSUPPORTED_TTS_LANGUAGES.includes(lang);
  }, [lang]);

  // Message to show when language is not supported
  const unsupportedMessage = useMemo(() => {
    if (lang === 'am') {
      return 'Voice is not available for Amharic. The text response is shown above.';
    }
    if (lang === 'om') {
      return 'Voice is not available for Afan Oromo. The text response is shown above.';
    }
    return null;
  }, [lang]);

  // Load available voices
  useEffect(() => {
    if (!isSupported) return;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice based on language
      const langCode = lang === 'am' ? 'am' : lang === 'om' ? 'om' : 'en';
      const defaultVoice = availableVoices.find(v => v.lang.startsWith(langCode)) 
        || availableVoices.find(v => v.lang.startsWith('en'))
        || availableVoices[0];
      
      if (defaultVoice) {
        setCurrentVoice(defaultVoice);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [isSupported, lang]);

  // CRITICAL: Stop speech on unmount or page navigation
  useEffect(() => {
    if (!isSupported) return;

    // Stop speech when component unmounts
    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [isSupported]);

  // Also stop on page visibility change (tab switch) and before unload
  useEffect(() => {
    if (!isSupported) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    };

    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.speechSynthesis.cancel();
    };
  }, [isSupported]);

  const speak = useCallback((text: string) => {
    // Don't speak if not supported or language not supported
    if (!isSupported || !text || !isLanguageSupported) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (currentVoice) {
      utterance.voice = currentVoice;
    }
    
    // Use English voice as default for better quality
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [isSupported, isLanguageSupported, currentVoice]);

  const stop = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, [isSupported]);

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    setCurrentVoice(voice);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    isLanguageSupported,
    unsupportedMessage,
    voices,
    setVoice,
    currentVoice,
  };
};
