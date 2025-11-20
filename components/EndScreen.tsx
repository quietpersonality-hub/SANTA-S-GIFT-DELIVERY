
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

  const title = isVictory ? "🎉 Поздравляем! 🎉" : "Будь осторожен!";
  const subtitle = isVictory ? "Ты помог Деду Морозу!" : "Попробуй еще раз!";

  return (
    <div className={`relative w-full h-full flex flex-col items-center justify-center p-8 text-center overflow-hidden ${isVictory ? 'bg-gradient-to-b from-green-800 to-black' : 'bg-gradient-to-b from-red-800 to-black'}`}>
      {isVictory && <Confetti />}
      <div className="relative z-10 flex flex-col items-center justify-center w-full">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-lg">{title}</h1>
        <p className={`text-2xl md:text-3xl text-gray-200 drop-shadow-md ${isVictory ? 'mb-6' : 'mb-12'}`}>{subtitle}</p>

        {isVictory && (
            <h2 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-12 drop-shadow-lg animate-pulse" style={{textShadow: '0 0 20px rgba(255,215,0,0.5)'}}>
                Поздравляем тебя с Новым годом!
            </h2>
        )}

        <div className="bg-black bg-opacity-60 p-8 rounded-lg shadow-2xl mb-12 text-left w-full max-w-2xl">
          <h3 className="text-3xl font-bold mb-6 text-center">📊 СТАТИСТИКА ПРОХОЖДЕНИЯ</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-xl">
            <div>Пройдено:</div><div className="font-semibold text-right">{distance.toFixed(0)} м</div>
            <div>Доставлено подарков:</div><div className="font-semibold text-right">{deliveredGifts}</div>
            <div>Собрано кристаллов:</div><div className="font-semibold text-right">{crystals}</div>
            <div>Время:</div><div className="font-semibold text-right">{(time / 1000).toFixed(2)} с</div>
            <div className="text-3xl mt-6 col-span-2 border-t-2 border-white/20 pt-6 flex justify-between">
              <span>Итоговый счет:</span>
              <span className="font-bold">{score}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 w-96 max-w-full px-4">
          <Button onClick={onRestart}>{isVictory ? 'Играть еще раз' : 'Попробовать снова'}</Button>
          <Button onClick={onMenu}>
            В главное
            <br />
            меню
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EndScreen;
