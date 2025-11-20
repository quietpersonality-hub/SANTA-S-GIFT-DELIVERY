
import React from 'react';
import Button from './common/Button';

interface MainMenuProps {
  onStart: () => void;
  onRules: () => void;
  onLeaderboard: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onRules, onLeaderboard }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-blue-900 via-indigo-900 to-black">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 animate-pulse drop-shadow-lg" style={{textShadow: '0 0 15px rgba(255,255,255,0.3)'}}>
          <span className="text-red-400">Доставка</span> Подарков
        </h1>
        <p className="text-2xl md:text-3xl text-blue-200 mb-20 drop-shadow-md">Помогите Деду Морозу доставить подарки в каждый дом</p>
      </div>
      <div className="flex flex-col space-y-8 w-96 max-w-full px-4">
        <Button onClick={onStart}>Начать игру</Button>
        <Button onClick={onRules}>Правила</Button>
        <Button onClick={onLeaderboard}>Таблица рекордов</Button>
      </div>

      <div className="mt-16 p-8 bg-black bg-opacity-50 rounded-lg text-blue-200 w-full max-w-2xl text-center shadow-2xl">
        <h3 className="text-2xl font-bold mb-4 text-white">Управление</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left px-4">
            <div>
                <h4 className="font-semibold text-white text-lg">🖥️ Компьютер:</h4>
                <ul className="list-none ml-2 space-y-2 mt-2">
                    <li><kbd className="inline-block px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">Пробел</kbd> - Взлёт</li>
                    <li><kbd className="inline-block px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">Ctrl</kbd> - Сбросить подарок</li>
                    <li><kbd className="inline-block px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">P</kbd> - Пауза</li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-white text-lg">📱 Мобильные:</h4>
                <ul className="list-none ml-2 space-y-2 mt-2">
                    <li><span className="font-semibold">Нажатие</span> - Взлёт</li>
                    <li><span className="font-semibold">Кнопка 🎁</span> - Сбросить подарок</li>
                    <li><span className="font-semibold">Иконка ⏸</span> - Пауза</li>
                </ul>
            </div>
        </div>
        <p className="mt-6 text-sm text-gray-400">Нажмите <kbd className="inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">Esc</kbd> в игре, чтобы вернуться в меню.</p>
      </div>


       <footer className="absolute bottom-4 text-gray-500 text-sm">
        Сделано с React & Canvas
      </footer>
    </div>
  );
};

export default MainMenu;
