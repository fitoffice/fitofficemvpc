import React, { useState, useEffect } from 'react';
import { Ruler } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';

interface InfoFisicaData {
  altura: number;
  // El campo peso puede venir en distintos formatos
  peso: number | { valor: number; fecha: string; _id: string } | Array<{ valor: number; fecha: string; _id: string }>;
}

interface InfoFisicaSectionProps {
  data: InfoFisicaData;
  // Aunque se recibe un editMode, lo reemplazamos por nuestro estado local
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  clientId: string;
  onSave: () => void;
  onChange: (data: InfoFisicaData) => void;
}

const InfoFisicaSection: React.FC<InfoFisicaSectionProps> = ({
  data,
  // editMode, // ignoramos el editMode recibido
  theme,
  errors,
  isLoading,
  clientId,
  onSave,
  onChange,
}) => {
  // Estado local para el componente y su modo edición
  const [localData, setLocalData] = useState<InfoFisicaData>(data);
  const [isEditing, setIsEditing] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper para obtener el valor de peso en formato numérico
  const getPesoValue = (peso: InfoFisicaData['peso']): number => {
    if (typeof peso === 'number') {
      return peso;
    } else if (Array.isArray(peso) && peso.length > 0) {
      return peso[peso.length - 1].valor;
    } else if (peso && typeof peso === 'object' && 'valor' in peso) {
      return peso.valor;
    }
    return 0;
  };

  // Sincronizamos localData con la prop data
  useEffect(() => {
    setLocalData({
      ...data,
      altura: data.altura || 0,
      peso: getPesoValue(data.peso)
    });
  }, [data]);

  // Maneja los cambios en los inputs
  const handleChange = (field: keyof InfoFisicaData, value: string) => {
    const parsedValue = parseFloat(value) || 0;
    const updatedData = { ...localData, [field]: parsedValue };
    setLocalData(updatedData);
    onChange(updatedData);
  };

  // Función que realiza la llamada a la API para guardar la información física
  const handleSave = async () => {
    if (!clientId) {
      setSaveError("ID de cliente no disponible");
      return;
    }
    setIsSaving(true);
    setSaveError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token no disponible");
      }
      // Se prepara la data a enviar: se crea una nueva entrada de peso
      const infoFisicaData = {
        altura: localData.altura,
        peso: {
          valor: typeof localData.peso === 'number' ? localData.peso : getPesoValue(localData.peso),
          fecha: new Date().toISOString()
        }
      };

      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/clients/${clientId}/info-fisica`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(infoFisicaData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      // Se asume que la API retorna el objeto actualizado o se notifica al padre
      onSave();
      setIsEditing(false);
    } catch (error) {
      console.error('Error al guardar información física:', error);
      setSaveError(error instanceof Error ? error.message : 'Error al guardar');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para alternar entre entrar en modo edición y guardar
  const handleButtonClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      handleSave();
    }
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-green-500/50 focus:border-green-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-green-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  const errorClasses = "text-sm text-red-500 mt-1 animate-pulse";

  const calculateIMC = () => {
    const pesoValue = typeof localData.peso === 'number' ? localData.peso : getPesoValue(localData.peso);
    if (localData.altura && pesoValue) {
      const alturaEnMetros = localData.altura / 100;
      const imc = pesoValue / (alturaEnMetros * alturaEnMetros);
      return imc.toFixed(1);
    }
    return null;
  };

  const getIMCCategory = (imc: number) => {
    if (imc < 18.5) return { text: 'Bajo peso', color: 'yellow' };
    if (imc < 25) return { text: 'Peso normal', color: 'green' };
    if (imc < 30) return { text: 'Sobrepeso', color: 'orange' };
    return { text: 'Obesidad', color: 'red' };
  };

  const imc = calculateIMC();
  const imcCategory = imc ? getIMCCategory(parseFloat(imc)) : null;
  const currentPesoValue = typeof localData.peso === 'number' ? localData.peso : getPesoValue(localData.peso);

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
        title="Información Física"
        Icon={Ruler}
        theme={theme}
        editMode={isEditing}
        onSave={handleButtonClick}
        isLoading={isLoading || isSaving}
        iconColor="green"
      />
      <div className="p-6">
        {saveError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {saveError}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Altura (cm)</label>
            {isEditing ? (
              <input
                type="number"
                value={localData.altura || ''}
                onChange={e => handleChange('altura', e.target.value)}
                className={`${inputClasses} ${errors?.altura ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ingrese la altura en cm"
                min="0"
                step="1"
              />
            ) : (
              <p className="text-lg">{localData.altura} cm</p>
            )}
            {errors?.altura && <p className={errorClasses}>{errors.altura}</p>}
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Peso (kg)</label>
            {isEditing ? (
              <input
                type="number"
                value={currentPesoValue || ''}
                onChange={e => handleChange('peso', e.target.value)}
                className={`${inputClasses} ${errors?.peso ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ingrese el peso en kg"
                min="0"
                step="0.1"
              />
            ) : (
              <p className="text-lg">{currentPesoValue} kg</p>
            )}
            {errors?.peso && <p className={errorClasses}>{errors.peso}</p>}
          </div>
        </div>

        {localData.altura && currentPesoValue > 0 && (
          <div className={`
            mt-6 p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
            backdrop-blur-sm
            transition-all duration-300 ease-in-out
          `}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">IMC (Índice de Masa Corporal)</span>
                <span className="text-lg font-bold">{calculateIMC()}</span>
              </div>
              {imc && (
                <div className={`
                  px-3 py-1 rounded-full text-sm font-medium
                  bg-${imcCategory?.color}-500/20 text-${imcCategory?.color}-600
                  dark:bg-${imcCategory?.color}-500/30 dark:text-${imcCategory?.color}-400
                  inline-flex items-center space-x-1 self-start
                `}>
                  <span>{imcCategory?.text}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InfoFisicaSection;