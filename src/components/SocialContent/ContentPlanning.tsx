import { useState } from 'react';

interface ContentPlanningProps {
  onPlanSubmit: (plan: {
    platforms: string[];
    frequency: string;
    contentMix: string[];
  }) => void;
}

const ContentPlanning: React.FC<ContentPlanningProps> = ({ onPlanSubmit }) => {
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [frequency, setFrequency] = useState('Semanal');
  const [contentMix, setContentMix] = useState<string[]>([]);

  const platformOptions = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Twitter'];
  const contentMixOptions = [
    'Educativo',
    'Entretenimiento',
    'Promocional',
    'User Generated',
    'Behind the Scenes'
  ];

  const handleSubmit = () => {
    onPlanSubmit({
      platforms,
      frequency,
      contentMix
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Planificación de Contenido
      </h3>
      
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Plataformas
        </label>
        <div className="flex flex-wrap gap-2">
          {platformOptions.map((platform) => (
            <button
              key={platform}
              type="button"
              onClick={() => setPlatforms(prev => 
                prev.includes(platform) 
                  ? prev.filter(p => p !== platform) 
                  : [...prev, platform]
              )}
              className={`px-4 py-2 rounded-full text-sm ${
                platforms.includes(platform)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Frecuencia
        </label>
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
        >
          <option value="Diaria">Diaria</option>
          <option value="Semanal">Semanal</option>
          <option value="Mensual">Mensual</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Mix de Contenido
        </label>
        <div className="flex flex-wrap gap-2">
          {contentMixOptions.map((mix) => (
            <button
              key={mix}
              type="button"
              onClick={() => setContentMix(prev => 
                prev.includes(mix) 
                  ? prev.filter(m => m !== mix) 
                  : [...prev, mix]
              )}
              className={`px-4 py-2 rounded-full text-sm ${
                contentMix.includes(mix)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {mix}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        Confirmar Plan
      </button>
    </div>
  );
};

export default ContentPlanning;