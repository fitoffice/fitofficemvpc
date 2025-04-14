import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import '../../styles/scrollbar.css';

// Import all ContentStrategy components
import ProfileSetup, { ProfileData } from './ProfileSetup';
import PlatformSelection from './PlatformSelection';
import ContentIdeaGeneration from './ContentIdeaGeneration';
import EditorialCalendar from './EditorialCalendar';
import StrategyDocument from './StrategyDocument';

interface ContentStrategyProps {
  onClose: () => void;
  isVisible: boolean;
}

interface ContentIdea {
  id: string;
  title: string;
  platforms: string[];
  platformTypes: string[];
  description: string;
  selected: boolean;
}

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  type: string;
  scheduled?: Date;
}

interface CalendarItem {
  date: string;
  platform: string;
  content: string;
}

interface Platform {
  name: string;
  contentTypes: string[];
  postingFrequency: string;
}

interface StatusMessage {
  type: 'success' | 'error' | null;
  message: string;
}

export const ContentStrategy: React.FC<ContentStrategyProps> = ({ onClose, isVisible }) => {
  // Workflow state
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>({ type: null, message: '' });
  
  // Data states for each step
  const [profileData, setProfileData] = useState<ProfileData>({
    coachInfo: { name: '', businessName: '', brandVoice: '' },
    audience: { targetAudience: '', contentGoals: '' },
    branding: { logoUrl: '', brandColors: '' }
  });
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedContentIdeas, setSelectedContentIdeas] = useState<ContentIdea[]>([]);
  const [scheduledItems, setScheduledItems] = useState<ContentItem[]>([]);
  const [platformFrequencies, setPlatformFrequencies] = useState<Record<string, string>>({});
  
  // Final strategy document data
  const [strategyDocument, setStrategyDocument] = useState({
    clientName: '',
    date: new Date().toISOString(),
    executiveSummary: '',
    businessGoals: [''],
    targetAudience: '',
    platforms: [] as Platform[],
    contentIdeas: [] as any[],
    calendarItems: [] as CalendarItem[],
    recommendations: ['']
  });

  // Handle profile data save
  const handleProfileSave = (data: ProfileData) => {
    setProfileData(data);
    setCurrentStep(1);
  };

  // Handle platform selection save
  const handlePlatformSave = (platforms: string[]) => {
    setSelectedPlatforms(platforms);
    setCurrentStep(2);
  };

  // Handle content ideas save
  const handleContentIdeasSave = (ideas: ContentIdea[]) => {
    setSelectedContentIdeas(ideas);
    setCurrentStep(3);
  };

  // Handle editorial calendar save
  const handleCalendarSave = (items: ContentItem[], frequencies: Record<string, string>) => {
    setScheduledItems(items);
    setPlatformFrequencies(frequencies);
    
    // Generate strategy document data
    generateStrategyDocument(items, frequencies);
  };

  // Generate strategy document from collected data
  const generateStrategyDocument = (items: ContentItem[], frequencies: Record<string, string>) => {
    setIsLoading(true);
    
    try {
      // Transform platforms data
      const platforms: Platform[] = selectedPlatforms.map(platform => ({
        name: platform,
        contentTypes: selectedContentIdeas
          .filter(idea => idea.platforms.includes(platform))
          .flatMap(idea => idea.platformTypes),
        postingFrequency: frequencies[platform] || 'Semanal'
      }));
      
      // Transform calendar items
      const calendarItems: CalendarItem[] = items.map(item => ({
        date: item.scheduled ? item.scheduled.toISOString() : new Date().toISOString(),
        platform: item.platform,
        content: item.title
      }));
      
      // Transform content ideas
      const contentIdeas = selectedContentIdeas.map(idea => ({
        title: idea.title,
        description: idea.description,
        platform: idea.platforms[0],
        type: idea.platformTypes[0]
      }));
      
      // Create business goals from profile data
      const businessGoals = profileData.audience.contentGoals
        ? profileData.audience.contentGoals.split('\n').filter(Boolean)
        : ['Aumentar el reconocimiento de marca', 'Generar leads', 'Establecer liderazgo de pensamiento'];
      
      // Create executive summary
      const executiveSummary = `Esta estrategia de contenido ha sido desarrollada específicamente para ${profileData.coachInfo.businessName || 'tu negocio'} para ayudar a lograr los objetivos de negocio a través del marketing de contenido dirigido en ${selectedPlatforms.join(', ')}. La estrategia se centra en involucrar a las audiencias con contenido valioso y relevante.`;
      
      setStrategyDocument({
        clientName: profileData.coachInfo.name || 'Cliente',
        date: new Date().toISOString(),
        executiveSummary,
        businessGoals,
        targetAudience: profileData.audience.targetAudience || 'Entusiastas del fitness que buscan entrenamiento personalizado',
        platforms,
        contentIdeas,
        calendarItems,
        recommendations: [
          'Mantener una marca consistente en todas las plataformas',
          'Interactuar regularmente con los comentarios de la audiencia',
          'Analizar métricas de rendimiento mensualmente y ajustar la estrategia según sea necesario'
        ]
      });
      
      setCurrentStep(4);
      setStatusMessage({
        type: 'success',
        message: 'Documento de estrategia generado exitosamente'
      });
    } catch (error) {
      console.error('Error al generar el documento de estrategia:', error);
      setStatusMessage({
        type: 'error',
        message: 'Error al generar el documento de estrategia. Por favor, inténtalo de nuevo.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document save
  const handleDocumentSave = () => {
    setStatusMessage({
      type: 'success',
      message: 'Documento de estrategia guardado exitosamente'
    });
  };

  // Handle document export
  const handleDocumentExport = () => {
    setStatusMessage({
      type: 'success',
      message: 'Documento de estrategia exportado exitosamente'
    });
  };

  // Handle back navigation
  const handleBack = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 max-w-6xl w-[98%] max-h-[95vh] overflow-y-auto relative border border-gray-200/30"
      >
        {/* Header */}
        <div className="relative mb-6">
          <div className="absolute top-0 right-0">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Estrategia de Contenido
          </h2>
          <p className="text-gray-600 mt-2">Define tu estrategia paso a paso</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-100 h-2 rounded-full mb-8">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / 5) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 0 && (
                <ProfileSetup onSave={handleProfileSave} />
              )}
              
              {currentStep === 1 && (
                <PlatformSelection 
                  onSave={handlePlatformSave} 
                  initialSelected={selectedPlatforms} 
                />
              )}
              
              {currentStep === 2 && (
                <ContentIdeaGeneration 
                  onSave={handleContentIdeasSave} 
                  initialPlatforms={selectedPlatforms} 
                />
              )}
              
              {currentStep === 3 && (
                <EditorialCalendar 
                  contentItems={selectedContentIdeas.map(idea => ({
                    id: idea.id,
                    title: idea.title,
                    platform: idea.platforms[0],
                    type: idea.platformTypes[0]
                  }))}
                  selectedPlatforms={selectedPlatforms}
                  onSave={handleCalendarSave}
                />
              )}
              
              {currentStep === 4 && (
                <StrategyDocument 
                  {...strategyDocument}
                  onSave={handleDocumentSave}
                  onExport={handleDocumentExport}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              currentStep === 0
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
            Anterior
          </button>
          
          {currentStep < 4 && currentStep !== 3 && (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Status Message */}
        {statusMessage.type && (
          <div
            className={`mt-4 p-4 rounded-lg flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {statusMessage.message}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContentStrategy;