
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
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900 to-black">
            <h1 className="text-5xl font-bold text-white mb-8">Топ-5 рекордов</h1>
            <div className="w-full max-w-lg bg-white/10 rounded-lg p-4">
                <div className="grid grid-cols-5 text-center font-bold pb-2 border-b border-white/20 mb-2">
                    <span>Место</span>
                    <span>Очки</span>
                    <span>Подарки</span>
                    <span>Кристаллы</span>
                    <span>Дата</span>
                </div>
                <div className="space-y-2">
                    {scores.length > 0 ? scores.map((entry, index) => (
                        <div key={index} className="grid grid-cols-5 text-center p-2 bg-white/5 rounded">
                            <span>#{index + 1}</span>
                            <span>{entry.score}</span>
                            <span>{entry.deliveredGifts}</span>
                            <span>{entry.crystals}</span>
                            <span>{new Date(entry.date).toLocaleDateString()}</span>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 p-4">Пока нет рекордов. Будьте первым!</p>
                    )}
                </div>
            </div>
            <div className="mt-8 w-64">
                <Button onClick={onBack}>Вернуться</Button>
            </div>
        </div>
    );
};

export default Leaderboard;