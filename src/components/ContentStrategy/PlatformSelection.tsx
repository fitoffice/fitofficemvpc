import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, Twitter, Linkedin, FileText, Mic, Mail } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

interface PlatformSelectionProps {
  onSave: (selectedPlatforms: string[]) => void;
  initialSelected?: string[];
}

const PlatformSelection: React.FC<PlatformSelectionProps> = ({ 
  onSave, 
  initialSelected = [] 
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(initialSelected);

  const platforms: Platform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      description: 'Plataforma de contenido visual ideal para entrenadores que comparten contenido inspirador y tutoriales cortos.',
      icon: <Instagram className="w-6 h-6" />
    },
    {
      id: 'facebook',
      name: 'Facebook',
      description: 'Plataforma para construir comunidad, publicaciones más largas, eventos y discusiones grupales.',
      icon: <Facebook className="w-6 h-6" />
    },
    {
      id: 'youtube',
      name: 'YouTube',
      description: 'Plataforma de video para tutoriales detallados, testimonios de clientes y contenido educativo más extenso.',
      icon: <Youtube className="w-6 h-6" />
    },
    {
      id: 'twitter',
      name: 'Twitter',
      description: 'Actualizaciones rápidas, noticias del sector y participación con tu audiencia a través de mensajes cortos.',
      icon: <Twitter className="w-6 h-6" />
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      description: 'Red profesional para establecer autoridad, compartir artículos y conectar con clientes potenciales.',
      icon: <Linkedin className="w-6 h-6" />
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Tu propia plataforma para publicar artículos detallados, guías y establecer liderazgo de pensamiento.',
      icon: <FileText className="w-6 h-6" />
    },
    {
      id: 'podcast',
      name: 'Podcast',
      description: 'Contenido de audio para entrevistas, discusiones profundas y construir una comunidad de oyentes comprometidos.',
      icon: <Mic className="w-6 h-6" />
    },
    {
      id: 'newsletter',
      name: 'Newsletter',
      description: 'Canal de comunicación directa para entregar contenido valioso directamente a la bandeja de entrada de tu audiencia.',
      icon: <Mail className="w-6 h-6" />
    }
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSave = () => {
    onSave(selectedPlatforms);
  };

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Selecciona tus Plataformas de Contenido</h1>
        <p className="text-gray-600 mt-2">
          Elige las plataformas donde quieres crear y distribuir tu contenido. Tu estrategia se adaptará según tus selecciones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {platforms.map((platform) => (
          <div 
            key={platform.id}
            className="bg-white rounded-lg border-2 transition-all duration-200 overflow-hidden hover:shadow-md"
            style={{ 
              borderColor: selectedPlatforms.includes(platform.id) ? '#3b82f6' : '#e5e7eb'
            }}
          >
            <button
              onClick={() => togglePlatform(platform.id)}
              className="w-full h-full text-left p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`p-2 rounded-full ${selectedPlatforms.includes(platform.id) ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                    {platform.icon}
                  </div>
                  <h3 className="ml-3 font-semibold text-gray-800">{platform.name}</h3>
                </div>
                {selectedPlatforms.includes(platform.id) && (
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-600">{platform.description}</p>
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Continuar con {selectedPlatforms.length} plataforma{selectedPlatforms.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
};

export default PlatformSelection;