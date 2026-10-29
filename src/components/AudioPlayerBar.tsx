'use client';

import React from 'react';
import { Play, Pause, Volume2, X, Gauge } from 'lucide-react';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export const AudioPlayerBar: React.FC = () => {
  const {
    currentArticle,
    isPlaying,
    progress,
    playbackRate,
    currentSentence,
    togglePlay,
    stopAudio,
    setRate,
    seekTo,
  } = useAudioPlayer();

  if (!currentArticle) return null;

  const speeds = [1, 1.25, 1.5, 2];
  const cycleSpeed = () => {
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setRate(speeds[nextIdx]);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    seekTo(pct);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 border-t border-slate-800 text-white shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom duration-300">
      {/* Clickable Progress Bar */}
      <div
        className="h-1 bg-slate-700/60 w-full cursor-pointer relative group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-emerald-500 transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity shadow"
          style={{ left: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3.5 py-2.5 sm:px-6 flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Article Details */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0 hidden sm:block border border-slate-700">
            <img
              src={currentArticle.coverImage}
              alt={currentArticle.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60 shrink-0">
                <Volume2 className={`w-3 h-3 ${isPlaying ? 'animate-pulse text-emerald-300' : 'text-slate-400'}`} />
                <span>{isPlaying ? 'Narration' : 'Paused'}</span>
              </span>
              <span className="text-[11px] text-slate-400 hidden xs:inline shrink-0">
                {currentArticle.readTime}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-100 truncate mt-0.5">
              {currentArticle.title}
            </p>
            {currentSentence && (
              <p className="text-[11px] text-emerald-300/80 italic truncate max-w-md hidden md:block">
                &ldquo;{currentSentence}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={togglePlay}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" />
            )}
          </button>

          <button
            onClick={cycleSpeed}
            className="px-2 py-1 text-xs font-semibold rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors shrink-0"
            title="Adjust Playback Speed"
          >
            <Gauge className="w-3 h-3 text-emerald-400" />
            {playbackRate}x
          </button>
        </div>

        {/* Close Audio Player */}
        <div className="flex items-center shrink-0">
          <button
            onClick={stopAudio}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Close Audio Player"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
