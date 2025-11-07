
import React from 'react';
import Button from './common/Button';

interface MainMenuProps {
  onStart: () => void;
  onRules: () => void;
  onLeaderboard: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onStart, onRules, onLeaderboard }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-900 via-indigo-900 to-black">
      <div className="text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 animate-pulse">
          <span className="text-red-400">Доставка</span> Подарков
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-12">Киберпанк Рождественское Приключение</p>
      </div>
      <div className="flex flex-col space-y-4 w-64">
        <Button onClick={onStart}>Начать игру</Button>
        <Button onClick={onRules}>Правила</Button>
        <Button onClick={onLeaderboard}>Таблица рекордов</Button>
      </div>

      <div className="mt-8 p-4 bg-black bg-opacity-30 rounded-lg text-blue-200 w-full max-w-lg text-center">
        <h3 className="text-xl font-bold mb-3 text-white">Управление</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left px-4">
            <div>
                <h4 className="font-semibold text-white">🖥️ Компьютер:</h4>
                <ul className="list-none ml-2 space-y-1 mt-1">
                    <li><kbd className="inline-block px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">Пробел</kbd> - Взлёт</li>
                    <li><kbd className="inline-block px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">Ctrl</kbd> - Сбросить подарок</li>
                    <li><kbd className="inline-block px-2 py-1 text-sm font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">P</kbd> - Пауза</li>
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-white">📱 Мобильные:</h4>
                <ul className="list-none ml-2 space-y-1 mt-1">
                    <li><span className="font-semibold">Нажатие</span> - Взлёт</li>
                    <li><span className="font-semibold">Кнопка 🎁</span> - Сбросить подарок</li>
                    <li><span className="font-semibold">Иконка ⏸</span> - Пауза</li>
                </ul>
            </div>
        </div>
        <p className="mt-4 text-sm text-gray-400">Нажмите <kbd className="inline-block px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-md shadow-sm">Esc</kbd> в игре, чтобы вернуться в меню.</p>
      </div>


       <footer className="absolute bottom-4 text-gray-500 text-sm">
        Сделано с React & Canvas
      </footer>
    </div>
  );
};

export default MainMenu;