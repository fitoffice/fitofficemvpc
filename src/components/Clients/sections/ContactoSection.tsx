import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import { toast } from 'react-hot-toast';

interface DireccionData {
  calle: string;
  ciudad: string;
  codigoPostal: string;
  pais: string;
}

interface ContactoSectionProps {
  direccion: DireccionData;
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  onSave: (updatedDireccion?: DireccionData) => void;
  onChange: (direccion: DireccionData) => void;
  clientId: string;
}

const ContactoSection: React.FC<ContactoSectionProps> = ({
  direccion,
  theme,
  errors,
  isLoading,
  onSave,
  onChange,
  clientId,
}) => {
  const [localDireccion, setLocalDireccion] = useState<DireccionData>({
    calle: '',
    ciudad: '',
    codigoPostal: '',
    pais: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (direccion) {
      setLocalDireccion(direccion);
    }
  }, [direccion]);

  const handleChange = (field: keyof DireccionData, value: string) => {
    const updatedDireccion = { ...localDireccion, [field]: value };
    setLocalDireccion(updatedDireccion);
    onChange(updatedDireccion);
  };

  const saveDireccion = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Token no disponible");
      }
      console.log("Guardando dirección para el cliente:", clientId);
      console.log("Datos enviados:", localDireccion);

      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes/${clientId}/contacto`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(localDireccion),
      });

      const responseData = await response.json();
      console.log('Respuesta del servidor:', responseData);

      if (!response.ok) {
        throw new Error(`Error al guardar, código ${response.status}: ${responseData.message || ''}`);
      }
      
      // Se notifica al padre con la dirección actualizada (si la API la devuelve)
      onSave(responseData.direccion || localDireccion);
      setIsEditing(false);
      toast.success("Dirección guardada correctamente");
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Error al guardar la dirección');
    } finally {
      setIsSaving(false);
    }
  };

  const handleButtonClick = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      saveDireccion();
    }
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-emerald-400
  `;

  const labelClasses = `
    block text-sm font-medium mb-2
    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}
  `;

  const errorClasses = "text-sm text-red-500 mt-1 animate-pulse";

  const getGoogleMapsUrl = () => {
    const address = `${localDireccion.calle}, ${localDireccion.ciudad}, ${localDireccion.codigoPostal}, ${localDireccion.pais}`;
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

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
        title="Información de Contacto"
        Icon={MapPin}
        theme={theme}
        editMode={isEditing}
        onSave={handleButtonClick}
        isLoading={isLoading || isSaving}
        iconColor="emerald"
      />
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Calle */}
          <div className="space-y-1">
            <label className={labelClasses}>Calle</label>
            {isEditing ? (
              <input
                type="text"
                value={localDireccion.calle || ''}
                onChange={e => handleChange('calle', e.target.value)}
                className={`${inputClasses} ${errors?.calle ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Nombre de la calle y número"
              />
            ) : (
              <p className="text-lg">{localDireccion.calle}</p>
            )}
            {errors?.calle && <p className={errorClasses}>{errors.calle}</p>}
          </div>
          {/* Ciudad */}
          <div className="space-y-1">
            <label className={labelClasses}>Ciudad</label>
            {isEditing ? (
              <input
                type="text"
                value={localDireccion.ciudad || ''}
                onChange={e => handleChange('ciudad', e.target.value)}
                className={`${inputClasses} ${errors?.ciudad ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Ciudad"
              />
            ) : (
              <p className="text-lg">{localDireccion.ciudad}</p>
            )}
            {errors?.ciudad && <p className={errorClasses}>{errors.ciudad}</p>}
          </div>
          {/* Código Postal */}
          <div className="space-y-1">
            <label className={labelClasses}>Código Postal</label>
            {isEditing ? (
              <input
                type="text"
                value={localDireccion.codigoPostal || ''}
                onChange={e => handleChange('codigoPostal', e.target.value)}
                className={`${inputClasses} ${errors?.codigoPostal ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="Código Postal"
              />
            ) : (
              <p className="text-lg">{localDireccion.codigoPostal}</p>
            )}
            {errors?.codigoPostal && <p className={errorClasses}>{errors.codigoPostal}</p>}
          </div>
          {/* País */}
          <div className="space-y-1">
            <label className={labelClasses}>País</label>
            {isEditing ? (
              <input
                type="text"
                value={localDireccion.pais || ''}
                onChange={e => handleChange('pais', e.target.value)}
                className={`${inputClasses} ${errors?.pais ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                placeholder="País"
              />
            ) : (
              <p className="text-lg">{localDireccion.pais}</p>
            )}
            {errors?.pais && <p className={errorClasses}>{errors.pais}</p>}
          </div>
        </div>
        {!isEditing && Object.values(localDireccion).every(value => value) && (
          <div className="mt-6">
            <a
              href={getGoogleMapsUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center space-x-2 p-4 rounded-lg
                ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-600/50' : 'bg-gray-100/50 hover:bg-gray-200/50'}
                transition-all duration-300 ease-in-out group
                backdrop-blur-sm
              `}
            >
              <MapPin className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform duration-300" />
              <span className="flex-1">Ver en Google Maps</span>
              <span className="text-sm text-gray-500">↗</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default ContactoSection;