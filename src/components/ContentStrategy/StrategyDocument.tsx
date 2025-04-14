import React, { useState } from 'react';
import { FileText, Download, Share2, Save } from 'lucide-react';

interface Platform {
  name: string;
  contentTypes: string[];
  postingFrequency: string;
}

interface ContentIdea {
  title: string;
  description: string;
  platform: string;
  type: string;
}

interface CalendarItem {
  date: string;
  platform: string;
  content: string;
}

interface StrategyDocumentProps {
  clientName: string;
  date: string;
  executiveSummary: string;
  businessGoals: string[];
  targetAudience: string;
  platforms: Platform[];
  contentIdeas: ContentIdea[];
  calendarItems: CalendarItem[];
  recommendations: string[];
  onSave?: () => void;
  onExport?: () => void;
}

const StrategyDocument: React.FC<StrategyDocumentProps> = ({
  clientName = 'ada',
  date = new Date().toLocaleDateString(),
  executiveSummary = 'Esta estrategia de contenido ha sido desarrollada específicamente para ada para ayudar a lograr los objetivos de negocio a través del marketing de contenido dirigido en Instagram, Facebook, YouTube, Twitter, LinkedIn, Blog, Podcast, Newsletter. La estrategia se centra en involucrar a las audiencias con contenido valioso y relevante.',
  businessGoals = ['Aumentar el reconocimiento de marca', 'Generar leads', 'Establecer liderazgo de pensamiento'],
  targetAudience = 'Entusiastas del fitness de 25 a 45 años que buscan entrenamiento personalizado y consejos de nutrición.',
  platforms = [
    { name: 'Instagram', contentTypes: ['carousel', 'reel'], postingFrequency: '3x por semana' },
    { name: 'Facebook', contentTypes: ['post'], postingFrequency: '2x por mes' },
    { name: 'YouTube', contentTypes: ['video'], postingFrequency: '1x por semana' },
    { name: 'Twitter', contentTypes: ['tweet'], postingFrequency: '2x por mes' },
    { name: 'LinkedIn', contentTypes: ['post'], postingFrequency: '2x por mes' },
    { name: 'Blog', contentTypes: ['artículo'], postingFrequency: '2x por mes' },
    { name: 'Podcast', contentTypes: ['episodio'], postingFrequency: '2x por mes' },
    { name: 'Newsletter', contentTypes: ['email'], postingFrequency: '2x por mes' }
  ],
  contentIdeas = [
    {
      title: 'Historia de Éxito de Cliente',
      description: 'Comparte una historia de transformación de uno de tus clientes con resultados de antes/después.',
      platform: 'Instagram',
      type: 'carousel'
    },
    {
      title: 'Consejos Rápidos de Entrenamiento',
      description: 'Crea un video corto demostrando 3 ejercicios rápidos que se pueden hacer en cualquier lugar.',
      platform: 'Instagram',
      type: 'reel'
    }
  ],
  calendarItems = [
    { date: '2023-06-01', platform: 'Instagram', content: 'Consejos Rápidos de Entrenamiento' },
    { date: '2023-06-05', platform: 'YouTube', content: 'Entrenamiento Completo para Madres Ocupadas' },
    { date: '2023-06-10', platform: 'Blog', content: 'Consejos de Nutrición para Energía Durante Todo el Día' }
  ],
  recommendations = ['Mantener una marca consistente en todas las plataformas', 'Interactuar regularmente con los comentarios de la audiencia', 'Analizar métricas de rendimiento mensualmente y ajustar la estrategia según sea necesario'],
  onSave,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit' | 'customize'>('preview');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold">Documento de Estrategia</h1>
        <div className="flex space-x-2">
          <div className="relative">
            <select 
              className="appearance-none bg-white border border-gray-300 rounded-md py-1 pl-3 pr-8 text-sm"
              defaultValue="Documento PDF"
            >
              <option>Documento PDF</option>
              <option>Documento Word</option>
              <option>Google Doc</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          <button 
            onClick={onExport}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-300 rounded-md text-sm hover:bg-gray-50">
            <Share2 className="w-4 h-4" />
            Compartir
          </button>
          <button 
            onClick={onSave}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>
      
      <div className="border-b">
        <div className="flex">
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
              activeTab === 'preview' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('preview')}
          >
            <FileText className="w-4 h-4" />
            Vista Previa
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
              activeTab === 'edit' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('edit')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium flex items-center gap-1 ${
              activeTab === 'customize' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('customize')}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Personalizar
          </button>
        </div>
      </div>
      
      <div className="p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white p-6 rounded-lg mb-8">
            <h1 className="text-2xl font-bold mb-1">Plan de Estrategia de Contenido - {clientName}</h1>
            <p className="text-sm opacity-80">Preparado para: {clientName} | {date}</p>
          </div>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Resumen Ejecutivo</h2>
            <p className="text-gray-700">{executiveSummary}</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Objetivos de Negocio</h2>
            <ul className="list-disc pl-5 space-y-1">
              {businessGoals.map((goal, index) => (
                <li key={index} className="text-gray-700">{goal}</li>
              ))}
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Audiencia Objetivo</h2>
            <p className="text-gray-700">{targetAudience}</p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Estrategia de Plataformas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {platforms.map((platform, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">{platform.name}</h3>
                  <div className="text-sm text-gray-600">
                    <div className="mb-1">
                      <span className="font-medium">Tipos de Contenido:</span> {platform.contentTypes.join(', ')}
                    </div>
                    <div>
                      <span className="font-medium">Frecuencia de Publicación:</span> {platform.postingFrequency}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Ideas de Contenido</h2>
            <div className="space-y-4">
              {contentIdeas.map((idea, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold">{idea.title}</h3>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">{idea.platform}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{idea.description}</p>
                  <div className="mt-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Tipo: {idea.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Calendario Editorial</h2>
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-2 px-4 border text-left text-sm font-medium text-gray-500">FECHA</th>
                  <th className="py-2 px-4 border text-left text-sm font-medium text-gray-500">PLATAFORMA</th>
                  <th className="py-2 px-4 border text-left text-sm font-medium text-gray-500">CONTENIDO</th>
                </tr>
              </thead>
              <tbody>
                {calendarItems.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 border text-sm">{formatDate(item.date)}</td>
                    <td className="py-2 px-4 border text-sm">{item.platform}</td>
                    <td className="py-2 px-4 border text-sm">{item.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">Recomendaciones</h2>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="text-gray-700">{recommendation}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StrategyDocument;