import React from 'react';
import Button from './common/Button';

interface PauseMenuProps {
  onContinue: () => void;
  onRestart: () => void;
  onExit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onContinue, onRestart, onExit }) => {
  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
      <h2 className="text-5xl font-bold text-white mb-8">ПАУЗА</h2>
      <div className="flex flex-col space-y-4 w-64">
        <Button onClick={onContinue}>Продолжить</Button>
        <Button onClick={onRestart}>Перезапустить</Button>
        <Button onClick={onExit}>Выход в меню</Button>
      </div>
    </div>
  );
};

export default PauseMenu;