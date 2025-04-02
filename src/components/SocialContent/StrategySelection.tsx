import { useState } from 'react';

interface StrategySelectionProps {
  onStrategySelect: (strategy: string) => void;
}

const StrategySelection: React.FC<StrategySelectionProps> = ({ onStrategySelect }) => {
  const strategies = [
    'Crecimiento de audiencia',
    'Engagement',
    'Conversiones',
    'Educación',
    'Brand Awareness'
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Selección de Estrategia
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {strategies.map((strategy) => (
          <button
            key={strategy}
            type="button"
            onClick={() => onStrategySelect(strategy)}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {strategy}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StrategySelection;