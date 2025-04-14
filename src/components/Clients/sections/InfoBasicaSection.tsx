<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { toast } from 'react-hot-toast';
=======
import React, { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

interface InfoBasicaData {
  nombre: string;
  email: string;
  fechaNacimiento: string;
  genero: 'Masculino' | 'Femenino' | 'Otro' | 'Prefiero no decirlo';
  telefono: string;
}

interface InfoBasicaSectionProps {
  data: InfoBasicaData;
<<<<<<< HEAD
  // Aunque se recibe editMode, usaremos nuestro estado local
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: () => void;
  onChange: (data: InfoBasicaData) => void;
  clientId: string;
}

const InfoBasicaSection: React.FC<InfoBasicaSectionProps> = ({
  data,
<<<<<<< HEAD
  // editMode, // ignoramos el editMode recibido para usar el estado local
=======
  editMode,
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  theme,
  errors,
  isLoading,
  onSave,
  onChange,
  clientId,
}) => {
<<<<<<< HEAD
  // Estado local para la información básica y para controlar el modo edición de este componente
  const [localData, setLocalData] = useState<InfoBasicaData>(data);
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sincronizamos el estado local con la prop data
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Actualiza el estado local y notifica al padre
  const handleChange = (field: keyof InfoBasicaData, value: string) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onChange(updatedData);
  };

  // Función para guardar la información básica en el servidor
  const handleSave = async () => {
    if (!clientId) {
      toast.error("ID de cliente no disponible");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token no disponible");
      }
      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes/${clientId}/info-basica`, {
=======
  // Local state to track input values
  const [localData, setLocalData] = useState<InfoBasicaData>({
    nombre: '',
    email: '',
    fechaNacimiento: '',
    genero: 'Prefiero no decirlo',
    telefono: ''
  });

  // Update local state when props change
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  const handleChange = (field: keyof InfoBasicaData, value: string) => {
    console.log(`Changing ${field} to:`, value);
    
    // Update local state first
    const updatedData = {
      ...localData,
      [field]: value
    };
    
    setLocalData(updatedData);
    console.log('Updated data:', updatedData);
    
    // Then notify parent component
    onChange(updatedData);
  };

  // Function to save data to API
  const saveInfoBasica = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${clientId}/info-basica`, {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: localData.nombre || '',
          email: localData.email || '',
          fechaNacimiento: localData.fechaNacimiento || '',
          genero: localData.genero || 'Prefiero no decirlo',
          telefono: localData.telefono || ''
        }),
      });
<<<<<<< HEAD
      if (!response.ok) {
        throw new Error('Error al guardar la información básica');
      }
      // Notifica al padre para actualizar el estado global
      onSave();
      setIsEditingLocal(false);
      toast.success("Información básica guardada correctamente");
    } catch (error) {
      console.error('Error saving basic info:', error);
      toast.error('Error al guardar la información básica');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para alternar entre modo edición y guardar
  const handleButtonClick = () => {
    if (!isEditingLocal) {
      setIsEditingLocal(true);
    } else {
      handleSave();
=======

      if (!response.ok) {
        throw new Error('Error al guardar la información básica');
      }

      // Call the onSave callback to notify parent component
      onSave();
    } catch (error) {
      console.error('Error saving basic info:', error);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
    }
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-blue-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  const errorClasses = "text-sm text-red-500 mt-1 animate-pulse";

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
        title="Información Básica"
        Icon={User}
        theme={theme}
<<<<<<< HEAD
        editMode={isEditingLocal}
        onSave={handleButtonClick}
        isLoading={isLoading || isSaving}
=======
        editMode={editMode}
        onSave={saveInfoBasica}
        isLoading={isLoading}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        iconColor="blue"
      />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Nombre</label>
<<<<<<< HEAD
            {isEditingLocal ? (
=======
            {editMode ? (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              <input
                type="text"
                value={localData.nombre || ''}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={`${inputClasses} ${errors?.nombre ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ingrese el nombre"
              />
            ) : (
              <p className="text-lg font-semibold">{localData.nombre}</p>
            )}
<<<<<<< HEAD
            {errors?.nombre && <p className={errorClasses}>{errors.nombre}</p>}
=======
            {errors?.nombre && (
              <p className={errorClasses}>{errors.nombre}</p>
            )}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Email</label>
<<<<<<< HEAD
            {isEditingLocal ? (
=======
            {editMode ? (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              <input
                type="email"
                value={localData.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`${inputClasses} ${errors?.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="ejemplo@correo.com"
              />
            ) : (
              <p className="text-lg">{localData.email}</p>
            )}
<<<<<<< HEAD
            {errors?.email && <p className={errorClasses}>{errors.email}</p>}
=======
            {errors?.email && (
              <p className={errorClasses}>{errors.email}</p>
            )}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Fecha de Nacimiento</label>
<<<<<<< HEAD
            {isEditingLocal ? (
=======
            {editMode ? (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              <input
                type="date"
                value={localData.fechaNacimiento || ''}
                onChange={(e) => handleChange('fechaNacimiento', e.target.value)}
                className={`${inputClasses} ${errors?.fechaNacimiento ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
              />
            ) : (
<<<<<<< HEAD
              <p className="text-lg">
                {localData.fechaNacimiento 
                  ? new Date(localData.fechaNacimiento).toLocaleDateString() 
                  : ''}
              </p>
            )}
            {errors?.fechaNacimiento && <p className={errorClasses}>{errors.fechaNacimiento}</p>}
=======
              <p className="text-lg">{localData.fechaNacimiento ? new Date(localData.fechaNacimiento).toLocaleDateString() : ''}</p>
            )}
            {errors?.fechaNacimiento && (
              <p className={errorClasses}>{errors.fechaNacimiento}</p>
            )}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Género</label>
<<<<<<< HEAD
            {isEditingLocal ? (
=======
            {editMode ? (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              <select
                value={localData.genero || 'Prefiero no decirlo'}
                onChange={(e) => handleChange('genero', e.target.value as any)}
                className={`${inputClasses} ${errors?.genero ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
            ) : (
              <p className="text-lg">{localData.genero}</p>
            )}
<<<<<<< HEAD
            {errors?.genero && <p className={errorClasses}>{errors.genero}</p>}
=======
            {errors?.genero && (
              <p className={errorClasses}>{errors.genero}</p>
            )}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Teléfono</label>
<<<<<<< HEAD
            {isEditingLocal ? (
=======
            {editMode ? (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              <input
                type="tel"
                value={localData.telefono || ''}
                onChange={(e) => handleChange('telefono', e.target.value)}
                className={`${inputClasses} ${errors?.telefono ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="+34 XXX XXX XXX"
              />
            ) : (
              <p className="text-lg">{localData.telefono}</p>
            )}
<<<<<<< HEAD
            {errors?.telefono && <p className={errorClasses}>{errors.telefono}</p>}
=======
            {errors?.telefono && (
              <p className={errorClasses}>{errors.telefono}</p>
            )}
          </div>
        </div>

        <div className={`
          mt-6 p-4 rounded-lg
          ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'}
          backdrop-blur-sm
          transition-all duration-300 ease-in-out
        `}>
          <div className="flex items-center space-x-3">
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            )}
            <span className="font-medium">{localData.nombre || ''}</span>
            <span className="text-gray-500">•</span>
            <span className="text-sm text-gray-500">{localData.email || ''}</span>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoBasicaSection;