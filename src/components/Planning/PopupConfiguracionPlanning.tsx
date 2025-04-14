<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
=======
import React from 'react';
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Planning } from '../../pages/types/planning';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

interface PopupConfiguracionPlanningProps {
  planning: Planning | null;
  setPlanning: React.Dispatch<React.SetStateAction<Planning | null>>;
  onClose: () => void;
  isOpen: boolean;
}

const PopupConfiguracionPlanning: React.FC<PopupConfiguracionPlanningProps> = ({
  planning,
  setPlanning,
  onClose,
  isOpen
}) => {
  const { theme } = useTheme();
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
  // Extract planning ID from URL
  const getPlanningIdFromUrl = () => {
    const path = location.pathname;
    const segments = path.split('/');
    return segments[segments.length - 1];
  };
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  
  if (!isOpen || !planning) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlanning({
      ...planning,
      nombre: e.target.value
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlanning({
      ...planning,
      descripcion: e.target.value
    });
  };

  const handleWeeksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weeks = parseInt(e.target.value);
    if (!isNaN(weeks) && weeks > 0) {
      setPlanning({
        ...planning,
        semanas: weeks
      });
    }
  };

<<<<<<< HEAD
  const handleSave = async () => {
    if (!planning) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      
      // Use the planning ID from URL instead of planning.id
      const planningId = getPlanningIdFromUrl();
      
      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/plannings/${planningId}/configuracion`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: planning.nombre,
          descripcion: planning.descripcion,
          semanas: planning.semanas
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al actualizar la configuración');
      }
      
      // Actualización exitosa
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la configuración');
      console.error('Error al guardar la configuración:', err);
    } finally {
      setIsLoading(false);
    }
  };

=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className={`relative w-full max-w-2xl p-6 rounded-xl shadow-2xl ${
          theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Configuración de Planificación
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre de la planificación</label>
            <input
              type="text"
              value={planning.nombre}
              onChange={handleNameChange}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Descripción</label>
            <textarea
              value={planning.descripcion}
              onChange={handleDescriptionChange}
              rows={4}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>

<<<<<<< HEAD
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
=======
          <div>
            <label className="block text-sm font-medium mb-2">Número de semanas</label>
            <input
              type="number"
              min="1"
              value={planning.semanas || 4}
              onChange={handleWeeksChange}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

          <div className="flex justify-end space-x-4 mt-8">
            <Button
              variant="danger"
              onClick={onClose}
              className="px-6 py-2.5"
<<<<<<< HEAD
              disabled={isLoading}
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
            >
              Cancelar
            </Button>
            <Button
              variant="create"
<<<<<<< HEAD
              onClick={handleSave}
              className="px-6 py-2.5"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
=======
              onClick={onClose}
              className="px-6 py-2.5"
            >
              Guardar
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PopupConfiguracionPlanning;