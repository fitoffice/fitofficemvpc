import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
// Import the image
import welcomeImage from './imagenes/ChatGPT Image 3 abr 2025, 21_09_50.png';

interface WelcomePopupProps {
  isOpen: boolean;
  onClose: () => void;
  theme: string;
}

const WelcomePopup: React.FC<WelcomePopupProps> = ({ isOpen, onClose, theme }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [animateExit, setAnimateExit] = useState(false);
  
  const steps = [
    {
      title: "¡Bienvenido a FitOffice!",
      subtitle: "Gracias por ser parte de nuestros testers",
      content: "Estamos emocionados de que estés probando nuestra plataforma. Tu feedback es invaluable para mejorar FitOffice."
    },
    {
      title: "Gestiona tu Negocio",
      subtitle: "Todo lo que necesitas en un solo lugar",
      content: "En este ERP encontrarás todas las herramientas necesarias para gestionar tu negocio de manera eficiente y efectiva."
    },
    {
      title: "¿Necesitas Ayuda?",
      subtitle: "Estamos aquí para ti",
      content: "Si tienes alguna pregunta o sugerencia, no dudes en contactarnos. Nuestro equipo está listo para asistirte en cualquier momento."
    }
  ];

  const handleClose = () => {
    setAnimateExit(true);
    setTimeout(() => {
      onClose();
      setAnimateExit(false);
      setCurrentStep(0);
    }, 300);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${animateExit ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      <div className={`
        relative w-full max-w-lg p-6 rounded-3xl shadow-2xl transform transition-all duration-300
        ${animateExit ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        ${theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50 text-white' 
          : 'bg-gradient-to-br from-white to-blue-50 border border-blue-100/50 text-gray-800'}
      `}>
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Progress indicator */}
        <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-1/2">
          <div className="flex gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep 
                    ? 'bg-blue-500 w-6' 
                    : index < currentStep 
                      ? 'bg-green-500' 
                      : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={handleClose}
          className={`
            absolute top-4 right-4 p-2 rounded-full 
            ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100/70'}
            transition-colors duration-200
          `}
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Welcome Image */}
        <div className="flex justify-center mb-4">
          <img 
            src={welcomeImage} 
            alt="Welcome to FitOffice" 
            className="w-40 h-40 object-contain rounded-lg shadow-lg"
          />
        </div>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <Sparkles className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} animate-pulse`} />
          </div>
          <h2 className={`
            text-3xl font-bold mb-2
            ${theme === 'dark' 
              ? 'bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400' 
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600'}
            bg-clip-text text-transparent
          `}>
            {steps[currentStep].title}
          </h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            {steps[currentStep].subtitle}
          </p>
        </div>
        
        {/* Content */}
        <div className={`
          p-5 rounded-2xl mb-6
          ${theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'} 
          backdrop-blur-sm
          min-h-[120px] flex items-center justify-center
        `}>
          <p className="text-center text-lg">
            {steps[currentStep].content}
          </p>
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {currentStep + 1} de {steps.length}
          </div>
          
          <button
            onClick={nextStep}
            className={`
              px-6 py-3 rounded-xl font-semibold text-white
              flex items-center gap-2
              ${theme === 'dark'
                ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700'}
              transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5
              group
            `}
          >
            {currentStep < steps.length - 1 ? (
              <>
                <span>Siguiente</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            ) : (
              <>
                <span>Comenzar a explorar</span>
                <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;