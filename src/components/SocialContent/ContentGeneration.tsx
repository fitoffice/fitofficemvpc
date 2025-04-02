import { useState } from 'react';

interface ContentGenerationProps {
  strategy: string;
  plan: {
    platforms: string[];
    frequency: string;
    contentMix: string[];
  };
  onGenerate: (content: string) => void;
}

const ContentGeneration: React.FC<ContentGenerationProps> = ({ 
  strategy, 
  plan, 
  onGenerate 
}) => {
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const generatedContent = `Estrategia: ${strategy}\n\n` +
        `Plataformas: ${plan.platforms.join(', ')}\n` +
        `Frecuencia: ${plan.frequency}\n` +
        `Mix de Contenido: ${plan.contentMix.join(', ')}\n\n` +
        `Contenido generado basado en estos parámetros...`;
      setContent(generatedContent);
      onGenerate(generatedContent);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
        Generación de Contenido
      </h3>

      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h4 className="font-medium mb-2">Resumen:</h4>
        <p>Estrategia: {strategy}</p>
        <p>Plataformas: {plan.platforms.join(', ')}</p>
        <p>Frecuencia: {plan.frequency}</p>
        <p>Mix de Contenido: {plan.contentMix.join(', ')}</p>
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        {isGenerating ? 'Generando...' : 'Generar Contenido'}
      </button>

      {content && (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium mb-2">Contenido Generado:</h4>
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      )}
    </div>
  );
};

export default ContentGeneration;