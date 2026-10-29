'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { Article } from '../types';
import { useToast } from './ToastContext';

interface AudioPlayerContextType {
  currentArticle: Article | null;
  isPlaying: boolean;
  progress: number;
  playbackRate: number;
  currentSentence: string;
  playArticle: (article: Article) => void;
  pauseAudio: () => void;
  resumeAudio: () => void;
  togglePlay: () => void;
  stopAudio: () => void;
  setRate: (rate: number) => void;
  seekTo: (percent: number) => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextType>({
  currentArticle: null,
  isPlaying: false,
  progress: 0,
  playbackRate: 1,
  currentSentence: '',
  playArticle: () => {},
  pauseAudio: () => {},
  resumeAudio: () => {},
  togglePlay: () => {},
  stopAudio: () => {},
  setRate: () => {},
  seekTo: () => {},
});

// Helper to split text into sentences
function splitIntoSentences(text: string): string[] {
  return text
    .replace(/([.?!])\s+(?=[A-Z])/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function extractSentencesFromArticle(article: Article): string[] {
  const sentences: string[] = [];

  sentences.push(article.title + '.');
  if (article.subtitle) sentences.push(article.subtitle + '.');
  if (article.excerpt) sentences.push(...splitIntoSentences(article.excerpt));

  if (article.keyTakeaways && article.keyTakeaways.length > 0) {
    sentences.push('Key strategic takeaways.');
    article.keyTakeaways.forEach((t, i) => {
      sentences.push(...splitIntoSentences(`Point ${i + 1}: ${t}`));
    });
  }

  if (article.sections && article.sections.length > 0) {
    article.sections.forEach((s) => {
      if (s.title) {
        sentences.push(s.title.endsWith('.') ? s.title : `${s.title}.`);
      }
      if (Array.isArray(s.content)) {
        s.content.forEach((c) => {
          if (c && !c.startsWith('IMAGE::')) {
            sentences.push(...splitIntoSentences(c));
          }
        });
      } else if (typeof s.content === 'string' && !s.content.startsWith('IMAGE::')) {
        sentences.push(...splitIntoSentences(s.content));
      }
      if (s.quote && s.quote.text) {
        sentences.push(...splitIntoSentences(`Quote by ${s.quote.author || 'Author'}: ${s.quote.text}`));
      }
    });
  }

  return sentences.filter((s) => s.length > 0);
}

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [currentSentence, setCurrentSentence] = useState('');

  const sentencesRef = useRef<string[]>([]);
  const currentIndexRef = useRef(0);
  const isPlayingRef = useRef(false);
  const isPausedRef = useRef(false);
  const rateRef = useRef(1);

  useEffect(() => {
    rateRef.current = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const initVoices = () => {
      window.speechSynthesis.getVoices();
    };
    initVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = initVoices;
    }
  }, []);

  const getBestVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const preferred = ['Samantha', 'Daniel', 'Karen', 'Alex', 'Serena', 'Oliver', 'Moira', 'Tessa', 'Arthur', 'Natural', 'Neural'];
    const localPreferred = voices.find((v) => v.lang.startsWith('en') && v.localService && preferred.some((p) => v.name.includes(p)));
    if (localPreferred) return localPreferred;

    const enPreferred = voices.find((v) => v.lang.startsWith('en') && preferred.some((p) => v.name.includes(p)));
    if (enPreferred) return enPreferred;

    const enLocal = voices.find((v) => v.lang.startsWith('en') && v.localService);
    if (enLocal) return enLocal;

    const enDefault = voices.find((v) => v.lang.startsWith('en') && v.default);
    if (enDefault) return enDefault;

    return voices.find((v) => v.lang.startsWith('en')) || voices.find((v) => v.default) || voices[0] || null;
  }, []);

  const speakSentence = useCallback(
    (index: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        showToast('Web Speech is not supported in this browser.', 'error');
        setIsPlaying(false);
        isPlayingRef.current = false;
        return;
      }

      if (index >= sentencesRef.current.length) {
        setIsPlaying(false);
        isPlayingRef.current = false;
        setProgress(100);
        setCurrentSentence('Narration finished');
        showToast('Audio narration completed.', 'info');
        return;
      }

      currentIndexRef.current = index;
      const text = sentencesRef.current[index];
      setCurrentSentence(text);

      const total = sentencesRef.current.length;
      const pct = Math.min(100, Math.round((index / total) * 100));
      setProgress(pct);

      try {
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (err) {
        console.warn('Speech cancel warning:', err);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = getBestVoice();
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || 'en-US';
      } else {
        utterance.lang = 'en-US';
      }
      utterance.rate = rateRef.current;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsPlaying(true);
        isPlayingRef.current = true;
        isPausedRef.current = false;
      };

      utterance.onend = () => {
        if (!isPausedRef.current && isPlayingRef.current) {
          speakSentence(index + 1);
        }
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn(`Speech error on sentence ${index}:`, e.error);
          if (!isPausedRef.current && isPlayingRef.current && index + 1 < sentencesRef.current.length) {
            setTimeout(() => speakSentence(index + 1), 80);
          } else {
            setIsPlaying(false);
            isPlayingRef.current = false;
          }
        }
      };

      try {
        window.speechSynthesis.speak(utterance);
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
      } catch (e) {
        console.error('Speech synthesis speak error:', e);
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    },
    [getBestVoice, showToast]
  );

  const playArticle = useCallback(
    (article: Article) => {
      if (currentArticle?.id === article.id) {
        if (isPlayingRef.current) {
          isPausedRef.current = true;
          isPlayingRef.current = false;
          setIsPlaying(false);
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
          }
        } else {
          isPausedRef.current = false;
          isPlayingRef.current = true;
          setIsPlaying(true);
          speakSentence(currentIndexRef.current);
        }
        return;
      }

      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        showToast('Web Speech is not supported in this browser.', 'error');
        return;
      }

      const extracted = extractSentencesFromArticle(article);
      if (extracted.length === 0) {
        showToast('No readable text found for this article.', 'error');
        return;
      }

      sentencesRef.current = extracted;
      currentIndexRef.current = 0;
      setCurrentArticle(article);
      setCurrentSentence(extracted[0]);
      setProgress(0);
      setIsPlaying(true);
      isPlayingRef.current = true;
      isPausedRef.current = false;

      showToast(`Audio narration started: "${article.title.slice(0, 32)}..."`, 'info');
      speakSentence(0);
    },
    [currentArticle?.id, showToast, speakSentence]
  );

  const pauseAudio = useCallback(() => {
    isPausedRef.current = true;
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const resumeAudio = useCallback(() => {
    if (!currentArticle || sentencesRef.current.length === 0) return;
    isPausedRef.current = false;
    isPlayingRef.current = true;
    setIsPlaying(true);
    speakSentence(currentIndexRef.current);
  }, [currentArticle, speakSentence]);

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      pauseAudio();
    } else {
      resumeAudio();
    }
  }, [pauseAudio, resumeAudio]);

  const stopAudio = useCallback(() => {
    isPausedRef.current = true;
    isPlayingRef.current = false;
    setIsPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setCurrentArticle(null);
    setProgress(0);
    setCurrentSentence('');
    currentIndexRef.current = 0;
    sentencesRef.current = [];
  }, []);

  const setRate = useCallback(
    (rate: number) => {
      setPlaybackRate(rate);
      rateRef.current = rate;
      if (isPlayingRef.current && sentencesRef.current.length > 0) {
        speakSentence(currentIndexRef.current);
      }
    },
    [speakSentence]
  );

  const seekTo = useCallback(
    (percent: number) => {
      const pct = Math.max(0, Math.min(100, percent));
      setProgress(pct);
      if (sentencesRef.current.length > 0) {
        const target = Math.min(
          sentencesRef.current.length - 1,
          Math.floor((pct / 100) * sentencesRef.current.length)
        );
        currentIndexRef.current = target;
        if (isPlayingRef.current) {
          speakSentence(target);
        } else {
          setCurrentSentence(sentencesRef.current[target]);
        }
      }
    },
    [speakSentence]
  );

  // Chrome speech synthesis keeps pausing bug fix
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentArticle,
        isPlaying,
        progress,
        playbackRate,
        currentSentence,
        playArticle,
        pauseAudio,
        resumeAudio,
        togglePlay,
        stopAudio,
        setRate,
        seekTo,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
