import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import StrategySelection from './StrategySelection';
import ContentPlanning from './ContentPlanning';
import ContentGeneration from './ContentGeneration';

interface SocialContentCreatorProps {
  isVisible: boolean;
  onClose: () => void;
}

const SocialContentCreator: React.FC<SocialContentCreatorProps> = ({
  isVisible,
  onClose,
}) => {
  const [currentStep, setCurrentStep] = useState<'strategy' | 'planning' | 'generation'>('strategy');
  const [strategy, setStrategy] = useState('');
  const [plan, setPlan] = useState({
    platforms: [] as string[],
    frequency: 'Semanal',
    contentMix: [] as string[],
  });

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="sticky top-0 z-10">
          <div className="p-6 rounded-t-2xl bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Generador de Contenido Social
            </h2>
            <p className="text-purple-100">Crea contenido estratégico para tus redes sociales</p>
          </div>
        </div>

        <div className="p-8">
          {currentStep === 'strategy' && (
            <StrategySelection 
              onStrategySelect={(selectedStrategy) => {
                setStrategy(selectedStrategy);
                setCurrentStep('planning');
              }} 
            />
          )}

          {currentStep === 'planning' && (
            <ContentPlanning 
              onPlanSubmit={(contentPlan) => {
                setPlan(contentPlan);
                setCurrentStep('generation');
              }}
            />
          )}

          {currentStep === 'generation' && (
            <ContentGeneration 
              strategy={strategy}
              plan={plan}
              onGenerate={(content) => {
                console.log('Content generated:', content);
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SocialContentCreator;