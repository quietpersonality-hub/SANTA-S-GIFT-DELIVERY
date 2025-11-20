
import React from 'react';
import Button from './common/Button';

interface RulesScreenProps {
  onBack: () => void;
}

const RuleItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
    <div className="flex items-center space-x-6 p-5 bg-white/20 rounded-lg shadow-md">
        <span className="text-5xl">{icon}</span>
        <p className="text-2xl">{text}</p>
    </div>
);

const RulesScreen: React.FC<RulesScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gray-800 to-black">
      <h1 className="text-6xl font-bold text-white mb-12 drop-shadow-lg">Как играть?</h1>
      <div className="space-y-6 max-w-3xl w-full mb-12">
        <RuleItem icon="🎅" text="Помогите Деду Морозу в его новогоднем путешествии!" />
        <RuleItem icon="👆" text="Нажимайте, чтобы Дед Мороз летел вверх." />
        <RuleItem icon="🎁" text="Нажимайте Ctrl (или 🎁), чтобы сбросить подарок в трубу." />
        <RuleItem icon="💎" text="Собирайте ледяные кристаллы для бонусных очков." />
        <RuleItem icon="💥" text="Избегайте столкновений с трубами." />
        <RuleItem icon="🏁" text="Доберитесь до финиша за 500 метров!" />
      </div>
      <div className="w-96 max-w-full px-4">
        <Button onClick={onBack}>Понятно</Button>
      </div>
    </div>
  );
};

export default RulesScreen;