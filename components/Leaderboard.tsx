
import React, { useState, useEffect } from 'react';
import Button from './common/Button';
import { getScores } from '../services/leaderboardService';
import { LeaderboardEntry } from '../types';

interface LeaderboardProps {
  onBack: () => void;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onBack }) => {
    const [scores, setScores] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        setScores(getScores());
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-purple-900 to-black">
            <h1 className="text-6xl font-bold text-white mb-12 drop-shadow-lg">Топ-5 рекордов</h1>
            <div className="w-full max-w-3xl bg-white/20 rounded-lg p-8 shadow-2xl">
                <div className="grid grid-cols-5 text-center font-bold pb-4 border-b border-white/20 mb-4 text-xl">
                    <span>Место</span>
                    <span>Очки</span>
                    <span>Подарки</span>
                    <span>Кристаллы</span>
                    <span>Дата</span>
                </div>
                <div className="space-y-4 text-lg">
                    {scores.length > 0 ? scores.map((entry, index) => (
                        <div key={index} className="grid grid-cols-5 text-center items-center p-4 bg-white/10 rounded-md">
                            <span className="font-bold text-2xl">#{index + 1}</span>
                            <span>{entry.score}</span>
                            <span>{entry.deliveredGifts}</span>
                            <span>{entry.crystals}</span>
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 p-8 text-xl">Пока нет рекордов. Будьте первым!</p>
                    )}
                </div>
            </div>
            <div className="mt-12 w-96 max-w-full px-4">
                <Button onClick={onBack}>Вернуться</Button>
            </div>
        </div>
    );
};

export default Leaderboard;
