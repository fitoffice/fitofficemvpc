import React, { useState, useEffect } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import Button from '../../Common/Button';
<<<<<<< HEAD
import { toast } from 'react-hot-toast';

interface CondicionesMedicasSectionProps {
  condiciones: string[];
  // Ignoramos el editMode recibido por props y usaremos el estado local
=======

interface CondicionesMedicasSectionProps {
  condiciones: string[];
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
<<<<<<< HEAD
  clientId?: string;
=======
  clientId?: string; // Add clientId prop
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  onSave: () => void;
  onChange: (condiciones: string[]) => void;
}

const CondicionesMedicasSection: React.FC<CondicionesMedicasSectionProps> = ({
<<<<<<< HEAD
  condiciones = [],
  // editMode, // No usamos el editMode del padre
=======
  condiciones = [], // Add default empty array
  editMode,
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  theme,
  errors,
  isLoading,
  clientId,
  onSave,
  onChange,
}) => {
  const [nuevaCondicion, setNuevaCondicion] = useState('');
  const [localCondiciones, setLocalCondiciones] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
<<<<<<< HEAD
  const [isEditingLocal, setIsEditingLocal] = useState(false);

  // Actualizamos el estado local cuando cambian las condiciones en las props
=======

  // Update local state when props change
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  useEffect(() => {
    setLocalCondiciones(condiciones || []);
  }, [condiciones]);

  const handleAddCondicion = () => {
<<<<<<< HEAD
    const trimmed = nuevaCondicion.trim();
    if (trimmed && !localCondiciones.includes(trimmed)) {
      const updatedCondiciones = [...localCondiciones, trimmed];
      setLocalCondiciones(updatedCondiciones);
      onChange(updatedCondiciones);
      setNuevaCondicion('');
      console.log('Condición añadida:', trimmed);
=======
    if (nuevaCondicion.trim() && !localCondiciones.includes(nuevaCondicion.trim())) {
      const updatedCondiciones = [...localCondiciones, nuevaCondicion.trim()];
      setLocalCondiciones(updatedCondiciones);
      onChange(updatedCondiciones);
      setNuevaCondicion('');
      console.log('Condición añadida:', nuevaCondicion.trim());
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      console.log('Condiciones actualizadas:', updatedCondiciones);
    }
  };

  const handleRemoveCondicion = (index: number) => {
    const updatedCondiciones = localCondiciones.filter((_, i) => i !== index);
    setLocalCondiciones(updatedCondiciones);
    onChange(updatedCondiciones);
    console.log('Condición eliminada en índice:', index);
    console.log('Condiciones actualizadas:', updatedCondiciones);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCondicion();
    }
  };

<<<<<<< HEAD
  // Función para guardar las condiciones en la API
=======
  // Function to save directly to API
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const handleSave = async () => {
    if (!clientId) {
      setSaveError("ID de cliente no disponible");
      return;
    }
<<<<<<< HEAD
    setIsSaving(true);
    setSaveError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token no disponible");
      }
      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/clients/${clientId}/condiciones-medicas`, {
=======

    setIsSaving(true);
    setSaveError(null);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Make PUT request
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${clientId}/condiciones-medicas`, {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ condicionesMedicas: localCondiciones }),
      });
<<<<<<< HEAD
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Condiciones médicas guardadas:', data);
      toast.success('Condiciones médicas guardadas correctamente');
      onSave();
      setIsEditingLocal(false);
    } catch (error) {
      console.error('Error al guardar condiciones médicas:', error);
      setSaveError(error instanceof Error ? error.message : 'Error al guardar');
      toast.error('Error al guardar las condiciones médicas');
=======

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Call original onSave function
      onSave();
    } catch (error) {
      console.error('Error al guardar condiciones médicas:', error);
      setSaveError(error instanceof Error ? error.message : 'Error al guardar');
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
    } finally {
      setIsSaving(false);
    }
  };

<<<<<<< HEAD
  // Función que alterna entre entrar en modo edición y guardar los cambios
  const handleButtonClick = () => {
    if (!isEditingLocal) {
      setIsEditingLocal(true);
    } else {
      handleSave();
    }
  };

=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-red-500/50 focus:border-red-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-red-400
  `;

  return (
    <section className={`
      rounded-xl border-2 
      ${theme === 'dark' ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white/50'}
      shadow-lg hover:shadow-xl 
      transition-all duration-300 ease-in-out
      backdrop-blur-sm
      overflow-hidden
    `}>
      <SectionHeader
        title="Condiciones Médicas"
        Icon={Heart}
        theme={theme}
<<<<<<< HEAD
        editMode={isEditingLocal}
        onSave={handleButtonClick}
=======
        editMode={editMode}
        onSave={handleSave}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        isLoading={isLoading || isSaving}
        iconColor="red"
      />
      <div className="p-6">
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {saveError}
          </div>
        )}
        
<<<<<<< HEAD
        {isEditingLocal && (
=======
        {editMode && (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          <div className="mb-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={nuevaCondicion}
                onChange={(e) => setNuevaCondicion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Agregar condición médica"
                className={inputClasses}
              />
              <Button
                variant="primary"
                onClick={handleAddCondicion}
                disabled={!nuevaCondicion.trim()}
<<<<<<< HEAD
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform transition-all duration-300 ease-in-out hover:scale-105 active:scale-95"
=======
                className={`
                  flex-shrink-0
                  bg-gradient-to-r from-red-500 to-red-600
                  hover:from-red-600 hover:to-red-700
                  shadow-lg hover:shadow-xl
                  transform transition-all duration-300 ease-in-out
                  hover:scale-105 active:scale-95
                `}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            {errors?.condiciones && (
              <p className="text-sm text-red-500 mt-2 animate-pulse">{errors.condiciones}</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          {localCondiciones.length === 0 ? (
<<<<<<< HEAD
            <p className={`text-center w-full py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
=======
            <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              No hay condiciones médicas registradas
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {localCondiciones.map((condicion, index) => (
                <div
                  key={index}
                  className={`
<<<<<<< HEAD
                    flex items-center justify-between p-3 rounded-lg text-sm
                    transition-all duration-300 ease-in-out
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
                    group hover:bg-red-500/10 backdrop-blur-sm
                  `}
                >
                  <span className="font-medium">{condicion}</span>
                  {isEditingLocal && (
=======
                    flex items-center justify-between p-3 rounded-lg
                    ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
                    group hover:bg-red-500/10
                    transition-all duration-300 ease-in-out
                    backdrop-blur-sm
                  `}
                >
                  <span className="font-medium">{condicion}</span>
                  {editMode && (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                    <button
                      onClick={() => handleRemoveCondicion(index)}
                      className={`
                        p-1 rounded-full opacity-0 group-hover:opacity-100
                        ${theme === 'dark' ? 'hover:bg-red-500/20' : 'hover:bg-red-500/20'}
<<<<<<< HEAD
                        text-red-500 transition-all duration-300 ease-in-out
=======
                        text-red-500
                        transition-all duration-300 ease-in-out
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                      `}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CondicionesMedicasSection;