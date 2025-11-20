
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
        <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-900 to-black overflow-y-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg mt-4">Рекорды</h1>
            <div className="w-full max-w-3xl bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-8 shadow-2xl border border-white/10">
                <div className="hidden md:grid grid-cols-5 text-center font-bold pb-4 border-b border-white/20 mb-4 text-xl text-purple-200">
                    <span>Место</span>
                    <span>Очки</span>
                    <span>Подарки</span>
                    <span>Кристаллы</span>
                    <span>Дата</span>
                </div>
                <div className="space-y-3">
                    {scores.length > 0 ? scores.map((entry, index) => (
                        <div key={index} className="flex flex-col md:grid md:grid-cols-5 md:text-center md:items-center p-3 bg-black/30 rounded-lg border border-white/5">
                            <div className="flex justify-between md:block items-center mb-1 md:mb-0">
                                <span className="md:hidden text-gray-400 text-sm">Место</span>
                                <span className="font-bold text-xl md:text-2xl text-yellow-400">#{index + 1}</span>
                            </div>
                            <div className="flex justify-between md:block items-center mb-1 md:mb-0">
                                <span className="md:hidden text-gray-400 text-sm">Счет</span>
                                <span className="text-white font-bold">{entry.score}</span>
                            </div>
                            <div className="flex justify-between md:block items-center text-sm md:text-base text-gray-300">
                                <span className="md:hidden text-gray-400">Подарки</span>
                                <span>🎁 {entry.deliveredGifts}</span>
                            </div>
                            <div className="flex justify-between md:block items-center text-sm md:text-base text-gray-300">
                                <span className="md:hidden text-gray-400">Кристаллы</span>
                                <span>💎 {entry.crystals}</span>
                            </div>
                            <div className="flex justify-between md:block items-center text-xs md:text-sm text-gray-500">
                                <span className="md:hidden text-gray-400">Дата</span>
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center text-gray-400 p-8 text-xl">Пока нет рекордов. Будьте первым!</p>
                    )}
                </div>
            </div>
            <div className="mt-8 w-full max-w-xs px-4 pb-8">
                <Button onClick={onBack}>Вернуться</Button>
            </div>
        </div>
    );
};

export default Leaderboard;
