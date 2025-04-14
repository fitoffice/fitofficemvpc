import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Tag, Plus, X, CheckCircle, Edit2 } from 'lucide-react';
=======
import { Tag, Plus, X, CheckCircle, XCircle, Edit2 } from 'lucide-react';
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
import SectionHeader from '../common/SectionHeader';
import Button from '../../Common/Button';
import { toast } from 'react-hot-toast';

<<<<<<< HEAD
interface TagItem {
=======
interface Tag {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  name: string;
  color: string;
  _id?: string;
}

interface TagsSectionProps {
<<<<<<< HEAD
  tags: TagItem[];
  activo: boolean;
  estado?: string;
  // editMode se ignora y se usa nuestro estado local
=======
  tags: Tag[];
  activo: boolean;
  estado?: string;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  editMode: boolean;
  theme: string;
  errors: any;
  isLoading: boolean;
  clientId?: string;
  onSave: () => void;
<<<<<<< HEAD
  onChange: (data: { tags: TagItem[]; activo: boolean; estado?: string }) => void;
=======
  onChange: (data: { tags: Tag[]; activo: boolean; estado?: string }) => void;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
}

const TagsSection: React.FC<TagsSectionProps> = ({
  tags,
  activo,
  estado = 'Pendiente',
<<<<<<< HEAD
  // editMode, // lo reemplazamos por el estado local
=======
  editMode,
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  theme,
  errors,
  isLoading,
  clientId,
  onSave,
  onChange,
}) => {
<<<<<<< HEAD
  // Estado local para controlar el modo edición en este componente
  const [isEditingLocal, setIsEditingLocal] = useState(false);
  
  // Estados locales para la administración de tags y estado
  const [nuevoTag, setNuevoTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [editingTag, setEditingTag] = useState<{ index: number; tag: TagItem } | null>(null);
  const [localEstado, setLocalEstado] = useState(estado);
  const [localTags, setLocalTags] = useState<TagItem[]>(tags);
=======
  const [nuevoTag, setNuevoTag] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366f1');
  const [editingTag, setEditingTag] = useState<{ index: number; tag: Tag } | null>(null);
  const [localEstado, setLocalEstado] = useState(estado);
  const [localTags, setLocalTags] = useState<Tag[]>(tags);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const [isSaving, setIsSaving] = useState(false);
  
  const estadoOptions = ['Pendiente', 'Activo', 'Inactivo', 'Completado', 'Cancelado'];

<<<<<<< HEAD
  // Sincroniza los estados locales con las props
=======
  // Update local state when props change
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  useEffect(() => {
    setLocalEstado(estado);
    setLocalTags(tags);
  }, [estado, tags]);

  const handleAddTag = () => {
<<<<<<< HEAD
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
=======
    if (nuevoTag.trim() && !localTags.some(tag => tag.name === nuevoTag.trim())) {
      const newTag = { 
        name: nuevoTag.trim(), 
        color: selectedColor 
      };
      
      const updatedTags = [...localTags, newTag];
      setLocalTags(updatedTags);
      
      // Update parent component state
      onChange({ 
        tags: updatedTags, 
        activo,
        estado: localEstado
      });
      
      // Reset input
      setNuevoTag('');
      setSelectedColor('#6366f1');
      
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      console.log('Tag added locally:', newTag);
    }
  };

  const handleRemoveTag = (index: number) => {
    const updatedTags = localTags.filter((_, i) => i !== index);
    setLocalTags(updatedTags);
<<<<<<< HEAD
    onChange({ tags: updatedTags, activo, estado: localEstado });
=======
    
    onChange({
      tags: updatedTags,
      activo,
      estado: localEstado
    });
    
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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

<<<<<<< HEAD
=======
  const toggleActivo = () => {
    onChange({ tags: localTags, activo: !activo, estado: localEstado });
  };

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newEstado = e.target.value;
    setLocalEstado(newEstado);
    onChange({ tags: localTags, activo, estado: newEstado });
  };

<<<<<<< HEAD
  const handleEditTag = (tag: TagItem, index: number) => {
=======
  const handleEditTag = (tag: Tag, index: number) => {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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
<<<<<<< HEAD
      setLocalTags(updatedTags);
      onChange({ tags: updatedTags, activo, estado: localEstado });
      setNuevoTag('');
      setSelectedColor('#6366f1');
      setEditingTag(null);
=======
      
      setLocalTags(updatedTags);
      
      onChange({ 
        tags: updatedTags, 
        activo,
        estado: localEstado
      });
      
      setNuevoTag('');
      setSelectedColor('#6366f1');
      setEditingTag(null);
      
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      console.log('Tag edited at index:', editingTag.index);
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setNuevoTag('');
    setSelectedColor('#6366f1');
  };

<<<<<<< HEAD
  // Función para guardar los tags y el estado en el servidor
=======
  // Function to save tags to the server
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const handleSaveTags = async () => {
    if (!clientId) {
      toast.error("ID de cliente no disponible");
      return;
    }
<<<<<<< HEAD
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
=======

    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Format the tags as required by the API
      const tagsPayload = {
        tags: localTags.map(tag => ({
          name: tag.name,
          color: tag.color
        }))
      };
      
      console.log('Sending tags to server:', tagsPayload);
      
      const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${clientId}/tags`, {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
<<<<<<< HEAD
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
=======
        body: JSON.stringify(tagsPayload),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Tags saved successfully:', data);
      
      toast.success('Tags guardados correctamente');
      
      // Call the original onSave function
      onSave();
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
    } catch (error) {
      console.error('Error saving tags:', error);
      toast.error('Error al guardar los tags');
    } finally {
      setIsSaving(false);
    }
  };

<<<<<<< HEAD
  // Función para alternar entre activar modo edición y guardar cambios
  const handleButtonClick = () => {
    if (!isEditingLocal) {
      setIsEditingLocal(true);
    } else {
      handleSaveTags();
    }
  };

=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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
<<<<<<< HEAD
        editMode={isEditingLocal}
        onSave={handleButtonClick}
=======
        editMode={editMode}
        onSave={handleSaveTags}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        isLoading={isLoading || isSaving}
        iconColor="indigo"
      />
      <div className="p-6">
        <div className="space-y-6">
<<<<<<< HEAD
          {/* Sección de Estado */}
=======
          {/* Estado section */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                Estado del Cliente
              </h3>
            </div>
<<<<<<< HEAD
            {isEditingLocal ? (
=======
            {editMode ? (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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

<<<<<<< HEAD
          {/* Sección de Tags */}
=======
          {/* Tags section */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          <div>
            <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              Tags
            </h3>
            
<<<<<<< HEAD
            {/* Formulario para agregar o editar tags */}
            {isEditingLocal && (
=======
            {/* Add new tag form */}
            {editMode && (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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

<<<<<<< HEAD
            {/* Lista de tags */}
=======
            {/* Tags list */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
            {localTags.length === 0 ? (
              <p className={`text-center w-full py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                No hay tags agregados
              </p>
            ) : (
<<<<<<< HEAD
              <div className={`space-y-2 ${isEditingLocal ? 'flex flex-col' : 'flex flex-wrap gap-2'}`}>
=======
              <div className={`space-y-2 ${editMode ? 'flex flex-col' : 'flex flex-wrap gap-2'}`}>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                {localTags.map((tag, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-center justify-between px-3 py-2 rounded-lg text-sm
                      transition-all duration-300 ease-in-out
<<<<<<< HEAD
                      ${isEditingLocal ? 'w-full' : 'rounded-full inline-flex'}
=======
                      ${editMode ? 'w-full' : 'rounded-full inline-flex'}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                    `}
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color
                    }}
                  >
                    <span>{tag.name}</span>
<<<<<<< HEAD
                    {isEditingLocal && (
=======
                    {editMode && (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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