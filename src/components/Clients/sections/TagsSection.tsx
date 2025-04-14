import React, { useState, useEffect } from 'react';
import { Tag, Plus, X, CheckCircle, Edit2 } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import Button from '../../Common/Button';
import { toast } from 'react-hot-toast';

interface TagItem {
  name: string;
  color: string;
  _id?: string;
}

interface TagsSectionProps {
  tags: TagItem[];
  activo: boolean;
  estado?: string;
  // editMode se ignora y se usa nuestro estado local
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  clientId?: string;
  onSave: () => void;
  onChange: (data: { tags: TagItem[]; activo: boolean; estado?: string }) => void;
}

const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  activo,
  estado = 'Pendiente',
  // editMode, // lo reemplazamos por el estado local
  theme,
  errors,
  isLoading,
  clientId,
  onSave,
  onChange,
}) => {
  // Estado local para controlar el modo edición en este componente
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  
  // Estados locales para la administración de tags y estado
  const [nuevoTag, setNuevoTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [editingTag, setEditingTag] = useState<{ index: number; tag: TagItem } | null>(null);
  const [localEstado, setLocalEstado] = useState(estado);
  const [localTags, setLocalTags] = useState<TagItem[]>(tags);
  const [isSaving, setIsSaving] = useState(false);
  
  const estadoOptions = ['Pendiente', 'Activo', 'Inactivo', 'Completado', 'Cancelado'];

  // Sincroniza los estados locales con las props
  useEffect(() => {
    setLocalEstado(estado);
    setLocalTags(tags);
  }, [estado, tags]);

  const handleAddTag = () => {
    const trimmed = nuevoTag.trim();
    if (trimmed && !localTags.some(tag => tag.name === trimmed)) {
      const newTag = { 
        name: trimmed, 
        color: selectedColor 
      };
      const updatedTags = [...localTags, newTag];
      setLocalTags(updatedTags);
      // Actualiza el estado en el padre
      onChange({ tags: updatedTags, activo, estado: localEstado });
      setNuevoTag('');
      setSelectedColor('#6366f1');
      console.log('Tag added locally:', newTag);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = localTags.filter((_, i) => i !== index);
    setLocalTags(updatedTags);
    onChange({ tags: updatedTags, activo, estado: localEstado });
    console.log('Tag removed at index:', index);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (editingTag) {
        handleSaveEditTag();
      } else {
        handleAddTag();
      }
    }
  };

  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstado = e.target.value;
    setLocalEstado(newEstado);
    onChange({ tags: localTags, activo, estado: newEstado });
  };

  const handleEditTag = (tag: TagItem, index: number) => {
    setEditingTag({ tag: { ...tag }, index });
    setNuevoTag(tag.name);
    setSelectedColor(tag.color);
  };

  const handleSaveEditTag = () => {
    if (editingTag && nuevoTag.trim()) {
      const updatedTags = [...localTags];
      updatedTags[editingTag.index] = { 
        ...editingTag.tag, 
        name: nuevoTag.trim(), 
        color: selectedColor 
      };
      setLocalTags(updatedTags);
      onChange({ tags: updatedTags, activo, estado: localEstado });
      setNuevoTag('');
      setSelectedColor('#6366f1');
      setEditingTag(null);
      console.log('Tag edited at index:', editingTag.index);
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setNuevoTag('');
    setSelectedColor('#6366f1');
  };

  // Función para guardar los tags y el estado en el servidor
  const handleSaveTags = async () => {
    if (!clientId) {
      toast.error("ID de cliente no disponible");
      return;
    }
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Token no disponible");
      // Se formatea el payload incluyendo tags, estado y activo
      const payload = {
        tags: localTags.map(tag => ({
          name: tag.name,
          color: tag.color
        })),
        estado: localEstado,
        activo: activo
      };
      
      console.log('Sending payload to server:', payload);
      
      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes/${clientId}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      console.log('Tags saved successfully:', data);
      
      toast.success('Tags y estado guardados correctamente');
      onSave();
      setIsEditingLocal(false);
    } catch (error) {
      console.error('Error saving tags:', error);
      toast.error('Error al guardar los tags');
    } finally {
      setIsSaving(false);
    }
  };

  // Función para alternar entre activar modo edición y guardar cambios
  const handleButtonClick = () => {
    if (!isEditingLocal) {
      setIsEditingLocal(true);
    } else {
      handleSaveTags();
    }
  };

  const inputClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
    focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
    transition-all duration-300 ease-in-out
    placeholder-gray-400
    hover:border-indigo-400
  `;

  const selectClasses = `
    w-full p-3 rounded-lg border-2 
    ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'}
    focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
    transition-all duration-300 ease-in-out
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
        title="Tags y Estado"
        Icon={Tag}
        theme={theme}
        editMode={isEditingLocal}
        onSave={handleButtonClick}
        isLoading={isLoading || isSaving}
        iconColor="indigo"
      />
      <div className="p-6">
        <div className="space-y-6">
          {/* Sección de Estado */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Estado del Cliente
              </h3>
            </div>
            {isEditingLocal ? (
              <select 
                value={localEstado} 
                onChange={handleEstadoChange}
                className={selectClasses}
              >
                {estadoOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <div className={`
                inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                ${localEstado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                  localEstado === 'Activo' ? 'bg-green-100 text-green-800' : 
                  localEstado === 'Inactivo' ? 'bg-gray-100 text-gray-800' :
                  localEstado === 'Completado' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'}
              `}>
                {localEstado}
              </div>
            )}
          </div>

          {/* Sección de Tags */}
          <div>
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Tags
            </h3>
            
            {/* Formulario para agregar o editar tags */}
            {isEditingLocal && (
              <div className="mb-4">
                <div className="flex space-x-2">
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={nuevoTag}
                      onChange={(e) => setNuevoTag(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={editingTag ? "Editar tag" : "Agregar nuevo tag"}
                      className={inputClasses}
                    />
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-12 h-12 p-1 rounded-lg cursor-pointer"
                      title="Seleccionar color del tag"
                    />
                  </div>
                  {editingTag ? (
                    <>
                      <Button
                        variant="primary"
                        onClick={handleSaveEditTag}
                        disabled={!nuevoTag.trim()}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={handleCancelEdit}
                        className="bg-gray-500 hover:bg-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleAddTag}
                      disabled={!nuevoTag.trim()}
                      className="flex-shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  )}
                </div>
                {errors?.tags && (
                  <p className="text-sm text-red-500 mt-2 animate-pulse">{errors.tags}</p>
                )}
              </div>
            )}

            {/* Lista de tags */}
            {localTags.length === 0 ? (
              <p className={`text-center w-full py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay tags agregados
              </p>
            ) : (
              <div className={`space-y-2 ${isEditingLocal ? 'flex flex-col' : 'flex flex-wrap gap-2'}`}>
                {localTags.map((tag, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg text-sm
                      transition-all duration-300 ease-in-out
                      ${isEditingLocal ? 'w-full' : 'rounded-full inline-flex'}
                    `}
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color
                    }}
                  >
                    <span>{tag.name}</span>
                    {isEditingLocal && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditTag(tag, index)}
                          className="rounded-full p-1 hover:bg-black/10"
                          title="Editar tag"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveTag(index)}
                          className="rounded-full p-1 hover:bg-black/10"
                          title="Eliminar tag"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TagsSection;