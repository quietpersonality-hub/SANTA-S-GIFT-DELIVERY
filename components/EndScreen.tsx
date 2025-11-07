
import React, { useEffect } from 'react';
import { GameResult } from '../types';
import Button from './common/Button';
import { saveScore } from '../services/leaderboardService';

interface EndScreenProps {
  result: GameResult;
  isVictory: boolean;
  onRestart: () => void;
  onMenu: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ result, isVictory, onRestart, onMenu }) => {
  const { distance, deliveredGifts, crystals, score, time } = result;

  useEffect(() => {
    if(score > 0) {
      saveScore({ score, deliveredGifts, crystals, date: new Date().toISOString() });
    }
  }, [score, deliveredGifts, crystals]);

  const title = isVictory ? "🎉 Поздравляем! 🎉" : "Упс! Санта врезался!";
  const subtitle = isVictory ? "Вы достигли финиша!" : "Попробуйте еще раз!";

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center p-4 text-center ${isVictory ? 'bg-gradient-to-b from-green-800 to-black' : 'bg-gradient-to-b from-red-800 to-black'}`}>
      <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4">{title}</h1>
      <p className="text-lg md:text-xl text-gray-200 mb-8">{subtitle}</p>

      <div className="bg-black bg-opacity-40 p-6 rounded-lg shadow-lg mb-8 text-left w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4 text-center">📊 СТАТИСТИКА ПРОХОЖДЕНИЯ</h3>
        <div className="grid grid-cols-2 gap-4 text-lg">
          <div>Пройдено:</div><div className="font-semibold text-right">{distance.toFixed(0)} м</div>
          <div>Доставлено подарков:</div><div className="font-semibold text-right">{deliveredGifts}</div>
          <div>Собрано кристаллов:</div><div className="font-semibold text-right">{crystals}</div>
          <div>Время:</div><div className="font-semibold text-right">{(time / 1000).toFixed(2)} с</div>
          <div className="text-2xl mt-4">Итоговый счет:</div><div className="text-2xl font-bold mt-4 text-right">{score}</div>
        </div>
      </div>

      {isVictory && (
        <a 
          href="https://www.youtube.com/watch?v=r6lJA0QTQkI" 
          target="_blank" 
          rel="noopener noreferrer"
          className="mb-8 p-6 w-full max-w-md text-2xl font-bold bg-red-600 text-white rounded-lg animate-pulse shadow-lg hover:animate-none hover:bg-red-700 transition-colors"
        >
          💌 Тебе сообщение, скорее жми!
        </a>
      )}

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-72">
        <Button onClick={onRestart}>{isVictory ? 'Играть еще раз' : 'Попробовать снова'}</Button>
        <Button onClick={onMenu}>В главное меню</Button>
      </div>
    </div>
  );
};

export default EndScreen;