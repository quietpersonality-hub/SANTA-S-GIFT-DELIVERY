
import React from 'react';
import Button from './common/Button';

interface RulesScreenProps {
  onBack: () => void;
}

const RuleItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
    <div className="flex items-center space-x-4 md:space-x-6 p-3 md:p-5 bg-white/10 rounded-lg shadow-md backdrop-blur-sm border border-white/5">
        <span className="text-3xl md:text-5xl shrink-0">{icon}</span>
        <p className="text-lg md:text-2xl text-gray-100 leading-tight">{text}</p>
    </div>
);

const RulesScreen: React.FC<RulesScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-800 to-black overflow-y-auto">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg mt-4">Правила</h1>
      <div className="space-y-3 md:space-y-6 max-w-3xl w-full mb-8">
        <RuleItem icon="🎅" text="Помоги Деду Морозу долететь до финиша!" />
        <RuleItem icon="👆" text="Нажимай на экран, чтобы лететь вверх." />
        <RuleItem icon="🎁" text="Жми кнопку подарка над трубами." />
        <RuleItem icon="💎" text="Собирай кристаллы для бонусов." />
        <RuleItem icon="💥" text="Не врезайся в трубы и землю!" />
      </div>
      <div className="w-full max-w-xs px-4 pb-8">
        <Button onClick={onBack}>Всё понятно!</Button>
      </div>
    </div>
  );
};

export default RulesScreen;
