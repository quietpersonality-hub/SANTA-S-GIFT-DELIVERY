
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

const ConfettiPiece: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
    <div className="absolute" style={style}></div>
);

const Confetti: React.FC = () => {
    const [pieces, setPieces] = React.useState<React.CSSProperties[]>([]);

    React.useEffect(() => {
        const newPieces = Array.from({ length: 150 }).map(() => ({
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 3 + 4}s`,
            animationDelay: `${Math.random() * 3}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
            width: `${Math.random() * 8 + 6}px`,
            height: `${Math.random() * 12 + 8}px`,
            opacity: Math.random() * 0.7 + 0.3,
            transform: `rotate(${Math.random() * 360}deg)`,
            animationName: 'confetti-fall',
            animationTimingFunction: 'linear',
            animationIterationCount: 'infinite',
        }));
        setPieces(newPieces);
    }, []);

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
            {pieces.map((style, index) => (
                <ConfettiPiece key={index} style={style} />
            ))}
            <style>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-10vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(110vh) rotate(720deg);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};


const EndScreen: React.FC<EndScreenProps> = ({ result, isVictory, onRestart, onMenu }) => {
  const { distance, deliveredGifts, crystals, score, time } = result;

  useEffect(() => {
    if(score > 0) {
      saveScore({ score, deliveredGifts, crystals, date: new Date().toISOString() });
    }
  }, [score, deliveredGifts, crystals]);

  const title = isVictory ? "🎉 Победа! 🎉" : "Ой-ой!";
  const subtitle = isVictory ? "Новый год спасен!" : "Попробуй еще раз!";

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-4 text-center overflow-y-auto ${isVictory ? 'bg-gradient-to-b from-green-900 to-black' : 'bg-gradient-to-b from-red-900 to-black'}`}>
      {isVictory && <Confetti />}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-2 drop-shadow-lg">{title}</h1>
        <p className={`text-xl md:text-3xl text-gray-200 drop-shadow-md ${isVictory ? 'mb-4' : 'mb-8'}`}>{subtitle}</p>

        {isVictory && (
            <h2 className="text-2xl md:text-5xl font-bold text-yellow-400 mb-8 drop-shadow-lg animate-pulse px-4 leading-tight" style={{textShadow: '0 0 20px rgba(255,215,0,0.5)'}}>
                Поздравляем тебя с Новым годом!
            </h2>
        )}

        <div className="bg-black bg-opacity-70 backdrop-blur-md p-4 md:p-8 rounded-xl shadow-2xl mb-8 w-full max-w-lg border border-white/10">
          <h3 className="text-xl md:text-3xl font-bold mb-4 text-center text-blue-200">📊 Статистика</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm md:text-xl text-gray-100">
            <div className="text-left text-gray-400">Пройдено:</div><div className="font-semibold text-right">{distance.toFixed(0)} м</div>
            <div className="text-left text-gray-400">Подарки:</div><div className="font-semibold text-right">{deliveredGifts}</div>
            <div className="text-left text-gray-400">Кристаллы:</div><div className="font-semibold text-right">{crystals}</div>
            <div className="text-left text-gray-400">Время:</div><div className="font-semibold text-right">{(time / 1000).toFixed(1)} с</div>
            
            <div className="col-span-2 mt-4 pt-4 border-t border-white/20 flex justify-between items-center">
              <span className="text-lg md:text-2xl text-yellow-400 font-bold">СЧЕТ:</span>
              <span className="text-3xl md:text-4xl font-black text-white">{score}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
          <Button onClick={onRestart} style={{minHeight: '60px'}}>🔄 Играть снова</Button>
          <Button onClick={onMenu} style={{minHeight: '60px'}}>🏠 В меню</Button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
