
import React from 'react';
import { GAME_CONFIG } from '../game/config';

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const GiftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5V9a1 1 0 10-2 0v1H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
        <path d="M9 11H3v5a2 2 0 002 2h4v-7zM11 18h4a2 2 0 002-2v-5h-6v7z" />
    </svg>
);

interface HUDProps {
  distance: number;
  gifts: number;
  crystals: number;
  progress: number;
  onPause: () => void;
  onGiftDrop: () => void;
}

const HUD: React.FC<HUDProps> = ({ distance, gifts, crystals, progress, onPause, onGiftDrop }) => {
  return (
    <>
      {/* Top Left: Distance */}
      <div className="absolute top-2 left-2 md:top-5 md:left-5 z-10">
          <div className="bg-black/50 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3 rounded-xl border border-white/10 shadow-lg">
            <span className="text-sm md:text-xl font-bold text-blue-100 block">
                {distance.toFixed(0)} <span className="text-xs md:text-base font-normal text-gray-300">/ {GAME_CONFIG.finishDistance} м</span>
            </span>
          </div>
      </div>

      {/* Top Center/Right: Stats */}
      <div className="absolute top-2 right-14 md:right-auto md:left-1/2 md:-translate-x-1/2 z-10 flex space-x-2 md:space-x-4">
        <div className="bg-black/50 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3 rounded-xl border border-white/10 shadow-lg flex items-center space-x-2">
             <span className="text-lg md:text-2xl">🎁</span>
             <span className="text-sm md:text-xl font-bold text-yellow-300">{gifts}</span>
        </div>
        <div className="bg-black/50 backdrop-blur-sm px-3 py-2 md:px-4 md:py-3 rounded-xl border border-white/10 shadow-lg flex items-center space-x-2">
             <span className="text-lg md:text-2xl">💎</span>
             <span className="text-sm md:text-xl font-bold text-cyan-300">{crystals}</span>
        </div>
      </div>

      {/* Top Right: Pause Button */}
      <button 
        onClick={onPause} 
        className="absolute top-2 right-2 md:top-5 md:right-5 text-white/80 hover:text-white hover:scale-110 transition-all z-50 p-1 md:p-2 bg-black/30 rounded-full"
        aria-label="Pause"
      >
          <PauseIcon />
      </button>

      {/* Bottom Right: Mobile Gift Button */}
      <button 
          onClick={(e) => { e.stopPropagation(); onGiftDrop(); }} 
          className="md:hidden absolute bottom-8 right-6 z-50 bg-gradient-to-br from-red-500 to-red-700 text-white rounded-full w-20 h-20 md:w-24 md:h-24 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.5)] active:scale-95 transition-transform border-4 border-red-400/50 animate-pulse-slow"
          aria-label="Сбросить подарок"
      >
          <GiftIcon />
      </button>

      {/* Bottom Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-2 md:h-4 bg-gray-800/80 z-0">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 transition-all duration-200 ease-linear shadow-[0_0_10px_rgba(100,100,255,0.5)]"
          style={{ width: `${progress * 100}%` }}
        ></div>
        <div className="absolute -top-6 right-2 text-[10px] md:text-xs text-white font-semibold bg-black/50 px-2 py-0.5 rounded">ФИНИШ</div>
      </div>
    </>
  );
};

export default HUD;
