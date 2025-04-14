import React, { useState, useEffect } from 'react';
import DietList from '../components/Diets/DietList';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Apple, BookOpen } from 'lucide-react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

// Assuming you'll create these components later
import FoodList from '../components/Diets/FoodList';
import RecipeList from '../components/Diets/RecipeList';

const tabs = [
  {
    id: 'dietas',
    label: 'Dietas',
    icon: Utensils,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'alimentos',
    label: 'Alimentos',
    icon: Apple,
    color: 'from-red-500 to-rose-500'
  },
  {
    id: 'recetas',
    label: 'Recetas',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-500'
  }
];

const DietManagementPage: React.FC = () => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('dietas');
  const isDarkMode = theme === 'dark';
  const [runTour, setRunTour] = useState(false);
  
  // Define the tour steps
  const steps: Step[] = [
    {
      target: '.tab-dietas',
      content: 'Aquí puedes ver y gestionar tus dietas personalizadas. Por defecto, empiezas en esta pestaña al entrar a la sección de nutrición.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.tab-alimentos',
      content: 'En esta pestaña puedes ver y gestionar todos los alimentos disponibles con su información nutricional.',
      placement: 'bottom',
    },
    {
      target: '.tab-recetas',
      content: 'Aquí puedes ver y gestionar tus recetas favoritas y crear nuevas combinaciones.',
      placement: 'bottom',
    },
    {
      target: '.tabs-container',
      content: 'Puedes cambiar entre las diferentes pestañas haciendo clic en estos botones.',
      placement: 'bottom',
    },
  ];

  // Start the tour when component mounts
  useEffect(() => {
    // Check if the tour has been shown before
    const tourShown = localStorage.getItem('dietsTourShown');
    if (!tourShown) {
      setRunTour(true);
    }
  }, []);

  // Handle tour callbacks
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      // Save that the tour has been shown
      localStorage.setItem('dietsTourShown', 'true');
    }
  };

  return (
    <>
      {/* Bloque de estilos globales para anular cualquier filtro o efecto de desenfoque en los tooltips de Joyride */}
      <style>{`
        .react-joyride__tooltip,
        .react-joyride__tooltip * {
          filter: none !important;
          backdrop-filter: none !important;
        }
      `}</style>

      <div className="w-full space-y-6 animate-fadeIn">
        {/* Joyride Tour */}
        <Joyride
          steps={steps}
          run={runTour}
          continuous
          showSkipButton
          showProgress
          disableOverlayClose
          spotlightClicks
          disableAnimation={true}
          floaterProps={{
            disableAnimation: true,
          }}
          disableScrolling
          scrollToFirstStep={false}
          callback={handleJoyrideCallback}
          styles={{
            options: {
              primaryColor: isDarkMode ? '#10b981' : '#059669',
              backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
              textColor: isDarkMode ? '#e5e7eb' : '#374151',
              arrowColor: isDarkMode ? '#1f2937' : '#ffffff',
              zIndex: 999999, // z-index alto para asegurar que el tooltip quede por encima de otros elementos
            },
            buttonNext: {
              backgroundColor: isDarkMode ? '#10b981' : '#059669',
              fontWeight: 'normal',
            },
            buttonBack: {
              color: isDarkMode ? '#10b981' : '#059669',
              fontWeight: 'normal',
            },
            buttonSkip: {
              color: isDarkMode ? '#9ca3af' : '#6b7280',
              fontWeight: 'normal',
            },
            tooltip: {
              fontSize: '14px',
              padding: '16px',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
              fontWeight: 'normal',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              filter: 'none',
              WebkitFilter: 'none',
              transform: 'none',
              WebkitTransform: 'none',
              textRendering: 'optimizeLegibility',
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
              transition: 'none',
            },
            tooltipContainer: {
              textAlign: 'left',
              filter: 'none',
              WebkitFilter: 'none',
              transform: 'none',
              WebkitTransform: 'none',
              transition: 'none',
            },
            tooltipContent: {
              padding: '8px 0',
              filter: 'none',
              WebkitFilter: 'none',
              fontWeight: 'normal',
              transition: 'none',
            },
            tooltipTitle: {
              fontSize: '16px',
              fontWeight: 'normal',
              marginBottom: '8px',
              filter: 'none',
              WebkitFilter: 'none',
              transition: 'none',
            },
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'none',
              WebkitBackdropFilter: 'none',
              transition: 'none',
            },
            spotlight: {
              borderRadius: '12px',
              boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
              transition: 'none',
            }
          }}
          callback={handleJoyrideCallback}
          locale={{
            back: 'Anterior',
            close: 'Cerrar',
            last: 'Finalizar',
            next: 'Siguiente',
            skip: 'Saltar',
          }}
        />

      {/* Header Section */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between ${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="relative">
            <h2 className={`text-4xl font-extrabold ${
              isDarkMode
                ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400'
                : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600'
            } bg-clip-text text-transparent tracking-tight`}>
              {activeTab === 'alimentos' 
                ? 'Alimentos'
                : activeTab === 'recetas'
                  ? 'Recetas'
                  : 'Dietas'}
            </h2>
            <div className={`absolute -bottom-2 left-0 w-full h-1.5 ${
              isDarkMode
                ? 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400'
                : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600'
            } rounded-full opacity-60 animate-pulse`}></div>
          </div>
          <span className={`
            text-sm font-semibold
            ${isDarkMode
              ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 border border-gray-600/30'
              : 'bg-gradient-to-r from-green-50 to-emerald-50 text-gray-700 border border-green-100/50'
            }
            px-4 py-2 rounded-full
            flex items-center gap-2
            shadow-lg
            hover:shadow-xl
            transform hover:scale-105
            transition-all duration-300 ease-out
            animate-fadeIn
            relative
            overflow-hidden
            group
          `}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            <Utensils className={`w-4 h-4 ${isDarkMode ? 'text-green-400' : 'text-green-600'} animate-pulse transform group-hover:rotate-12 transition-all duration-300`} />
            <span className="relative">Gestión Nutricional</span>
          </span>
        </div>
        
        {/* Tour Button */}
        <button
          onClick={() => setRunTour(true)}
          className={`
            px-4 py-2 rounded-full
            flex items-center gap-2
            ${isDarkMode
              ? 'bg-gradient-to-r from-emerald-600 to-green-600 text-white border border-emerald-500/30'
              : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border border-emerald-400/50'
            }
            shadow-lg
            hover:shadow-xl
            transform hover:scale-105
            transition-all duration-300 ease-out
            animate-fadeIn
            relative
            overflow-hidden
            group
            text-sm font-medium
          `}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4 mr-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <span className="relative">Iniciar Tour</span>
        </button>
      </div>

      {/* Tabs Section */}
      <div className={`${
        isDarkMode
          ? 'bg-gray-800/90 border-gray-700/50'
          : 'bg-white/90 border-white/50'
      } backdrop-blur-xl p-6 rounded-3xl shadow-lg border hover:shadow-xl transition-all duration-300`}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 tabs-container">
          {tabs.map((tab) => (
            <motion.div
              key={tab.id}
              className={`
                tab-${tab.id}
                relative flex items-center gap-4 px-6 py-5
                ${activeTab === tab.id 
                  ? `${isDarkMode
                      ? `bg-gradient-to-br ${tab.color}/20 border-${tab.color.split('-')[1]}/30 shadow-[0_0_15px_rgba(139,92,246,0.15)]` 
                      : `bg-gradient-to-br ${tab.color.replace('500', '50')}/60 border-${tab.color.split('-')[1]}/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]`
                    }`
                  : `${isDarkMode
                      ? 'hover:bg-gray-800/30 border-gray-600/30' 
                      : 'hover:bg-white/60 border-gray-200/60'
                    }`
                }
                group
                border rounded-3xl cursor-pointer
                backdrop-blur-sm
                transition-all duration-500 ease-out
                hover:shadow-lg hover:shadow-${tab.color.split('-')[1]}/5
                ${activeTab === tab.id ? 'scale-[1.01]' : ''}
              `}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ 
                scale: activeTab === tab.id ? 1.02 : 1.01,
                y: -2,
              }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`
                p-3 rounded-2xl
                ${activeTab === tab.id
                  ? `${isDarkMode
                      ? `bg-gradient-to-br ${tab.color}/20 shadow-md shadow-${tab.color.split('-')[1]}/10`
                      : `bg-gradient-to-br ${tab.color.replace('500', '100')}/50 shadow-md shadow-${tab.color.split('-')[1]}/5`
                    }`
                  : `${isDarkMode
                      ? 'bg-gray-800/30 group-hover:bg-gray-700/30' 
                      : 'bg-white/40 group-hover:bg-gray-50/40'
                    }`
                }
                transition-all duration-300 ease-in-out
              `}>
                <tab.icon className={`w-6 h-6 transform transition-all duration-300 ${
                  activeTab === tab.id
                    ? `text-${tab.color.split('-')[1]}-300 scale-105 rotate-3`
                    : isDarkMode
                      ? `text-gray-400 group-hover:text-${tab.color.split('-')[1]}-400/50`
                      : `text-gray-500 group-hover:text-${tab.color.split('-')[1]}-500/50`
                }`} />
              </div>
              <span className={`
                font-medium text-sm tracking-wide
                ${activeTab === tab.id
                  ? `${isDarkMode
                      ? `text-${tab.color.split('-')[1]}-300/90`
                      : `text-${tab.color.split('-')[1]}-600/80`
                    }`
                  : `${isDarkMode
                      ? `text-gray-400 group-hover:text-${tab.color.split('-')[1]}-400/50`
                      : `text-gray-500 group-hover:text-${tab.color.split('-')[1]}-500/50`
                    }`
                }
                transition-all duration-300
              `}>
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <motion.div
                  className={`
                    absolute -bottom-1 left-1/2 transform -translate-x-1/2
                    w-1.5 h-1.5 rounded-full
                    ${isDarkMode ? `bg-${tab.color.split('-')[1]}-400/70` : `bg-${tab.color.split('-')[1]}-500/60`}
                  `}
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.4, type: "spring" }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Content Section */}
        <div className={`rounded-2xl ${
          isDarkMode
            ? 'bg-gray-900/50 border-gray-700/50'
            : 'bg-gray-50/50 border-gray-200/50'
        } border backdrop-blur-sm p-4`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dietas' && <DietList />}
              {activeTab === 'alimentos' && <FoodList />}
              {activeTab === 'recetas' && <RecipeList />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </>
  );
};

export default DietManagementPage;
