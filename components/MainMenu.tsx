
import React from 'react';
import Button from './common/Button';

interface MainMenuProps {
  onStart: () => void;
  onRules: () => void;
  onLeaderboard: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onRules, onLeaderboard }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-8 bg-gradient-to-b from-blue-900 via-indigo-900 to-black overflow-y-auto">
      <div className="text-center mt-4 md:mt-0">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-2 md:mb-4 animate-pulse drop-shadow-lg" style={{textShadow: '0 0 15px rgba(255,255,255,0.3)'}}>
          <span className="text-red-400">Доставка</span> Подарков
        </h1>
        <p className="text-lg sm:text-xl md:text-3xl text-blue-200 mb-8 md:mb-16 drop-shadow-md px-4">Помогите Деду Морозу доставить подарки!</p>
      </div>
      
      <div className="flex flex-col space-y-4 md:space-y-8 w-full max-w-xs md:max-w-sm px-2 md:px-0 z-10">
        <Button onClick={onStart}>Начать игру</Button>
        <Button onClick={onRules}>Правила</Button>
        <Button onClick={onLeaderboard}>Таблица рекордов</Button>
      </div>

      <div className="mt-8 md:mt-16 p-4 md:p-8 bg-black bg-opacity-50 rounded-lg text-blue-200 w-full max-w-2xl text-center shadow-2xl mb-8">
        <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">Управление</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left px-2">
            <div className="hidden md:block">
                <h4 className="font-semibold text-white text-base md:text-lg">🖥️ Компьютер:</h4>
                <ul className="list-none ml-2 space-y-2 mt-2 text-sm md:text-base">
                    <li><kbd className="bg-gray-700 px-2 py-0.5 rounded">Пробел</kbd> - Взлёт</li>
                    <li><kbd className="bg-gray-700 px-2 py-0.5 rounded">Ctrl</kbd> - Сброс подарка</li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-white text-base md:text-lg">📱 Мобильные:</h4>
                <ul className="list-none ml-2 space-y-2 mt-2 text-sm md:text-base">
                    <li><span className="font-semibold text-white">Касание</span> - Взлёт</li>
                    <li><span className="font-semibold text-white">Кнопка 🎁</span> - Сброс</li>
                </ul>
            </div>
        </div>
      </div>
      
       <footer className="hidden md:block absolute bottom-4 text-gray-500 text-sm">
        Сделано с React & Canvas
      </footer>
    </div>
  );
};

export default MainMenu;
