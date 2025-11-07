
import React from 'react';
import Button from './common/Button';

interface RulesScreenProps {
  onBack: () => void;
}

const RuleItem: React.FC<{ icon: string; text: string }> = ({ icon, text }) => (
    <div className="flex items-center space-x-4 p-3 bg-white/10 rounded-lg">
        <span className="text-3xl">{icon}</span>
        <p className="text-lg">{text}</p>
    </div>
);

const RulesScreen: React.FC<RulesScreenProps> = ({ onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-800 to-black">
      <h1 className="text-5xl font-bold text-white mb-8">Как играть?</h1>
      <div className="space-y-4 max-w-lg w-full mb-8">
        <RuleItem icon="🎅" text="Помогите Санте в его рождественском путешествии!" />
        <RuleItem icon="👆" text="Нажимайте, чтобы Санта летел вверх." />
        <RuleItem icon="🎁" text="Нажимайте Ctrl (или 🎁), чтобы сбросить подарок в трубу." />
        <RuleItem icon="💎" text="Собирайте ледяные кристаллы для бонусных очков." />
        <RuleItem icon="💥" text="Избегайте столкновений с трубами." />
        <RuleItem icon="🏁" text="Доберитесь до финиша за 500 метров!" />
      </div>
      <div className="w-64">
        <Button onClick={onBack}>Понятно</Button>
      </div>
    </div>
  );
};

export default RulesScreen;