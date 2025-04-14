import React, { useState } from 'react';
import { Filter, ThumbsUp, ThumbsDown, Trash } from 'lucide-react';

interface ContentIdea {
  id: string;
  title: string;
  platforms: string[];
  platformTypes: string[];
  description: string;
  selected: boolean;
}

interface ContentIdeaGenerationProps {
  onSave: (selectedIdeas: ContentIdea[]) => void;
  initialPlatforms?: string[];
}

const ContentIdeaGeneration: React.FC<ContentIdeaGenerationProps> = ({ 
  onSave,
  initialPlatforms = []
}) => {
  const [activeTab, setActiveTab] = useState<'suggested' | 'custom'>('suggested');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('Todas las Plataformas');
  const [selectedIdeas, setSelectedIdeas] = useState<ContentIdea[]>([]);
  
  // Sample content ideas - in a real app, these would come from an API
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([
    {
      id: '1',
      title: 'Historia de Éxito de Cliente',
      platforms: ['Instagram'],
      platformTypes: ['carousel'],
      description: 'Comparte una historia de transformación de uno de tus clientes con resultados de antes/después.',
      selected: false
    },
    {
      id: '2',
      title: 'Consejos Rápidos de Entrenamiento',
      platforms: ['Instagram'],
      platformTypes: ['reel'],
      description: 'Crea un video corto demostrando 3 ejercicios rápidos que se pueden hacer en cualquier lugar.',
      selected: false
    },
    {
      id: '3',
      title: 'Desmintiendo Mitos Nutricionales',
      platforms: ['Facebook'],
      platformTypes: ['post'],
      description: 'Desmiente mitos comunes sobre nutrición con evidencia científica y consejos prácticos.',
      selected: false
    },
    {
      id: '4',
      title: 'Sesión Completa de Entrenamiento',
      platforms: ['YouTube'],
      platformTypes: ['video'],
      description: 'Graba una sesión completa de entrenamiento de 30 minutos que los espectadores puedan seguir.',
      selected: false
    },
    {
      id: '5',
      title: 'Guía de Recetas Saludables',
      platforms: ['Blog'],
      platformTypes: ['article'],
      description: 'Escribe un artículo detallado con 5 recetas saludables incluyendo ingredientes, instrucciones e información nutricional.',
      selected: false
    }
  ]);

  // Get unique platforms for the filter dropdown
  const platforms = ['Todas las Plataformas', ...Array.from(new Set(contentIdeas.flatMap(idea => idea.platforms)))];

  const toggleIdeaSelection = (id: string) => {
    const updatedIdeas = contentIdeas.map(idea => 
      idea.id === id ? { ...idea, selected: !idea.selected } : idea
    );
    setContentIdeas(updatedIdeas);
    
    const newSelectedIdeas = updatedIdeas.filter(idea => idea.selected);
    setSelectedIdeas(newSelectedIdeas);
  };

  const markIdeaAsUseful = (id: string) => {
    // In a real app, this would send feedback to the backend
    console.log('Marcado como útil:', id);
  };

  const markIdeaAsNotUseful = (id: string) => {
    // In a real app, this would send feedback to the backend
    console.log('Marcado como no útil:', id);
  };

  const removeIdea = (id: string) => {
    setContentIdeas(prev => prev.filter(idea => idea.id !== id));
  };

  const handleSave = () => {
    onSave(selectedIdeas);
  };

  const filteredIdeas = contentIdeas.filter(idea => 
    selectedPlatformFilter === 'Todas las Plataformas' || idea.platforms.includes(selectedPlatformFilter)
  );

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Generación de Ideas de Contenido</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <select
            value={selectedPlatformFilter}
            onChange={(e) => setSelectedPlatformFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors">
          <Filter className="w-4 h-4" />
          Filtrar
        </button>
      </div>

      <div className="flex border-b mb-6">
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === 'suggested'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('suggested')}
        >
          Ideas Sugeridas
        </button>
        <button
          className={`px-6 py-3 font-medium ${
            activeTab === 'custom'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('custom')}
        >
          Ideas Personalizadas
        </button>
      </div>

      <div className="mb-4 text-right text-sm text-gray-500">
        {selectedIdeas.length} ideas seleccionadas
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredIdeas.map(idea => (
          <div 
            key={idea.id}
            className={`bg-white rounded-lg border-2 transition-all duration-200 overflow-hidden hover:shadow-md ${
              idea.selected ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-lg">{idea.title}</h3>
                <button
                  onClick={() => toggleIdeaSelection(idea.id)}
                  className={`w-5 h-5 border rounded flex items-center justify-center ${
                    idea.selected 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300'
                  }`}
                >
                  {idea.selected && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {idea.platforms.map((platform, idx) => (
                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md">
                    {platform}
                  </span>
                ))}
                {idea.platformTypes.map((type, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-md">
                    {type}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{idea.description}</p>
              
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <button 
                    onClick={() => markIdeaAsUseful(idea.id)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => markIdeaAsNotUseful(idea.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
                <button 
                  onClick={() => removeIdea(idea.id)}
                  className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <button
              onClick={() => toggleIdeaSelection(idea.id)}
              className={`w-full py-2 text-center text-sm font-medium transition-colors ${
                idea.selected
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {idea.selected ? 'Seleccionada' : 'Seleccionar'}
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          className="px-6 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
        >
          Atrás
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
        >
          Guardar Ideas de Contenido
        </button>
      </div>
    </div>
  );
};

export default ContentIdeaGeneration;