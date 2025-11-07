import React from 'react';
import { GAME_CONFIG } from '../game/config';

const PauseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
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
      <div className="absolute top-4 left-4 md:top-5 md:left-5 text-lg md:text-xl font-bold bg-black bg-opacity-40 p-2 md:p-3 rounded-lg text-shadow">
        <span>Расстояние: {distance.toFixed(0)}/{GAME_CONFIG.finishDistance} м</span>
      </div>
      <div className="absolute top-4 right-4 md:top-5 md:right-5 text-lg md:text-xl font-bold bg-black bg-opacity-40 p-2 md:p-3 rounded-lg text-shadow flex items-center space-x-4">
        <span>🎁 Подарки: {gifts}</span>
        <span className="border-l border-white/50 h-6"></span>
        <span>💎 Кристаллы: {crystals}</span>
      </div>
       <button onClick={onPause} className="absolute bottom-4 left-4 md:top-5 md:left-auto md:right-48 text-white opacity-80 hover:opacity-100 transition-opacity z-50">
          <PauseIcon />
       </button>
      <button 
          onClick={onGiftDrop} 
          className="md:hidden absolute bottom-4 right-4 bg-red-600 bg-opacity-70 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-lg active:bg-red-700"
          aria-label="Сбросить подарок"
      >
          🎁
      </button>
      <div className="absolute bottom-0 left-0 w-full h-4 bg-gray-700 bg-opacity-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-200 ease-linear"
          style={{ width: `${progress * 100}%` }}
        ></div>
        <div className="absolute top-0 right-2 text-xs text-white font-semibold">ФИНИШ</div>
      </div>
    </>
  );
};

export default HUD;