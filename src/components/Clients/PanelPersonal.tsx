import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { 
  ClipboardList, 
  RefreshCw, 
  Edit3, 
  Save, 
  User, 
  FileText,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfoBasicaSection from './sections/InfoBasicaSection';
import InfoFisicaSection from './sections/InfoFisicaSection';
import CondicionesMedicasSection from './sections/CondicionesMedicasSection';
import RedesSocialesSection from './sections/RedesSocialesSection';
import ContactoSection from './sections/ContactoSection';
import TagsSection from './sections/TagsSection';
import NotasSection from './sections/NotasSection';
import Button from '../Common/Button';
import PopupCuestionarios from './PopupCuestionarios';
import CuestionarioSection from './sections/CuestionarioSection';

// Interfaz de notas (ejemplo)
interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}

interface PanelPersonalProps {
  cliente: any;
  clientId?: string; // Prop opcional
  // onEdit debe actualizar el estado global (y realizar la llamada a la API, si es necesario)
  onEdit: (cliente: any) => Promise<void>;
}

const PanelPersonal: React.FC<PanelPersonalProps> = ({ cliente, clientId, onEdit }) => {
  const { theme } = useTheme();

  // Estado local para mantener los datos del cliente y lograr actualizaciones inmediatas
  const [clienteData, setClienteData] = useState(cliente);
  useEffect(() => {
    setClienteData(cliente);
  }, [cliente]);

  // Modo edición global (puedes adaptarlo por secciones si lo prefieres)
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [cuestionario, setCuestionario] = useState<any>(null); // Ajusta el tipo según corresponda
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');

  // Función para actualizar el estado local cuando se edite algún dato en los hijos
  const handleChange = (data: any) => {
    setClienteData((prev: any) => ({ ...prev, ...data }));
  };

  // Función para guardar los cambios; actualiza el estado global vía onEdit
  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});
    try {
      // Validaciones mínimas
      const newErrors: any = {};
      if (!clienteData.nombre) newErrors.nombre = 'El nombre es requerido';
      if (!clienteData.email) newErrors.email = 'El email es requerido';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error('Por favor, corrija los errores antes de guardar');
        return;
      }
      // Llamada a la función del padre para actualizar en BD o estado global
      await onEdit(clienteData);
      setEditMode(false);
      toast.success('Cambios guardados correctamente');
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------------------------------------------------------
  // Manejo de notas
  // ----------------------------------------------------------------
  const handleAddNote = async (note: Omit<Note, '_id'>) => {
    const updatedNotes = [...(clienteData.notas || []), { ...note, _id: Date.now().toString() }];
    const updatedData = { ...clienteData, notas: updatedNotes };
    setClienteData(updatedData);
    try {
      await onEdit(updatedData);
      toast.success('Nota agregada correctamente');
    } catch (error) {
      toast.error('Error al agregar la nota');
    }
  };

  const handleEditNote = async (id: string, updatedNote: Partial<Note>) => {
    const updatedNotes = (clienteData.notas || []).map((note: Note) =>
      note._id === id ? { ...note, ...updatedNote } : note
    );
    const updatedData = { ...clienteData, notas: updatedNotes };
    setClienteData(updatedData);
    try {
      await onEdit(updatedData);
      toast.success('Nota actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la nota');
    }
  };

  const handleDeleteNote = async (id: string) => {
    const updatedNotes = (clienteData.notas || []).filter((note: Note) => note._id !== id);
    const updatedData = { ...clienteData, notas: updatedNotes };
    setClienteData(updatedData);
    try {
      await onEdit(updatedData);
      toast.success('Nota eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la nota');
    }
  };

  // ----------------------------------------------------------------
  // Cuestionario
  // ----------------------------------------------------------------
  const verCuestionario = () => {
    if (clienteData.cuestionarioId && cuestionario) {
      setIsPopupOpen(true);
    } else {
      toast.error('No hay cuestionario disponible para este cliente');
    }
  };

  const autocompletarDesdeCuestionario = () => {
    if (!cuestionario) {
      toast.error('No hay cuestionario disponible para autocompletar');
      return;
    }
    const updatedData = { ...clienteData };
    if (cuestionario.edad) {
      const fechaNacimiento = new Date();
      fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - cuestionario.edad);
      updatedData.fechaNacimiento = fechaNacimiento.toISOString().split('T')[0];
    }
    if (cuestionario.genero) {
      updatedData.genero = cuestionario.genero;
    }
    if (cuestionario.peso) {
      updatedData.peso = cuestionario.peso;
    }
    if (cuestionario.altura) {
      updatedData.altura = cuestionario.altura;
    }
    if (cuestionario.condicionesMedicas && cuestionario.condicionesMedicas.length > 0) {
      updatedData.condicionesMedicas = [
        ...new Set([...(updatedData.condicionesMedicas || []), ...cuestionario.condicionesMedicas])
      ];
    }
    setClienteData(updatedData);
    onEdit(updatedData);
    toast.success('Datos autocompletados desde el cuestionario');
  };

  // ----------------------------------------------------------------
  // Tabs (ejemplo)
  // ----------------------------------------------------------------
  const sections = [
    { id: 'all', name: 'Todo', icon: <FileText size={18} /> },
    { id: 'basic', name: 'Información Básica', icon: <User size={18} /> },
    { id: 'physical', name: 'Datos Físicos', icon: <Activity size={18} /> },
  ];

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`
          w-full rounded-lg shadow-lg 
          ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
          transition-colors duration-300 ease-in-out
          relative
        `}
        style={{ overflow: 'visible' }}
      >
        {/* Cabecera con gradiente */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{clienteData.nombre}</h2>
              <p className="text-blue-100">{clienteData.email}</p>
            </div>
            <button 
              onClick={() => {
                if (editMode) {
                  handleSave();
                } else {
                  setEditMode(true);
                }
              }}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full hover:opacity-90 transition"
            >
              {editMode ? <Save size={16} /> : <Edit3 size={16} />}
              {editMode ? 'Guardar' : 'Editar'}
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  px-4 py-2 rounded-full transition-all flex items-center
                  ${activeSection === section.id 
                    ? 'bg-white text-blue-600 shadow-md' 
                    : 'bg-blue-600 bg-opacity-30 hover:bg-opacity-40 text-white'}
                `}
              >
                {section.icon}
                <span className="ml-2">{section.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Acciones del cuestionario */}
        <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Cuestionario:
            </span>
            <Button
              variant="normal"
              onClick={verCuestionario}
              disabled={!clienteData.cuestionarioId || !cuestionario}
              className={`
                ${(!clienteData.cuestionarioId || !cuestionario) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-100 dark:hover:bg-gray-600'}
                bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300
                border border-blue-200 dark:border-gray-600
                shadow-sm rounded-full px-3 py-1.5 text-sm
                transition-all duration-300 flex items-center
              `}
            >
              <ClipboardList className="w-4 h-4 mr-2" />
              Ver Cuestionario
            </Button>
            <Button
              variant="secondary"
              onClick={autocompletarDesdeCuestionario}
              disabled={!cuestionario}
              className={`
                ${!cuestionario 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-blue-100 dark:hover:bg-gray-600'}
                bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-300
                border border-blue-200 dark:border-gray-600
                shadow-sm rounded-full px-3 py-1.5 text-sm
                transition-all duration-300 flex items-center
              `}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Autocompletar
            </Button>
            {clienteData.cuestionarioId && !cuestionario && (
              <span className="text-xs text-amber-600 dark:text-amber-400 animate-pulse">
                Cargando cuestionario...
              </span>
            )}
          </div>
        </div>

        {/* Contenido principal */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {(activeSection === 'all' || activeSection === 'basic') && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    {/* Info Básica */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                    >
                      <InfoBasicaSection
                        data={{
                          nombre: clienteData.nombre,
                          email: clienteData.email,
                          fechaNacimiento: clienteData.fechaNacimiento,
                          genero: clienteData.genero,
                          telefono: clienteData.telefono
                        }}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(data) => handleChange(data)}
                        clientId={clientId || clienteData._id}
                      />                    
                    </motion.div>
                    {/* Cuestionario */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                    >
                      <CuestionarioSection
                        cuestionario={cuestionario}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onVerCuestionario={verCuestionario}
                        hasCuestionario={!!clienteData.cuestionarioId && !!cuestionario}
                      />
                    </motion.div>
                    {/* Info Física */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                    >
                      <InfoFisicaSection
                        data={{
                          altura: clienteData.altura || 0,
                          peso: Array.isArray(clienteData.peso) 
                            ? (clienteData.peso.length > 0 ? clienteData.peso[clienteData.peso.length - 1] : 0)
                            : (clienteData.peso || 0)
                        }}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(data) => {
                          let updatedPeso = data.peso;
                          if (Array.isArray(clienteData.peso)) {
                            updatedPeso = [...clienteData.peso];
                            if (updatedPeso.length > 0) {
                              updatedPeso[updatedPeso.length - 1] = data.peso;
                            } else {
                              updatedPeso.push(data.peso);
                            }
                          }
                          handleChange({ altura: data.altura, peso: updatedPeso });
                        }}
                        clientId={clientId || clienteData._id}
                      />
                    </motion.div>
                    {/* Condiciones Médicas */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                    >
                      <CondicionesMedicasSection
                        condiciones={clienteData.condicionesMedicas}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(condiciones) => handleChange({ condicionesMedicas: condiciones })}
                        clientId={clientId || clienteData._id}
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-6">
                    {/* Redes Sociales */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                    >
                      <RedesSocialesSection
                        redes={
                          clienteData.redesSociales?.reduce((acc, red) => {
                            if (red && red.platform) {
                              acc[red.platform] = red.username || '';
                            }
                            return acc;
                          }, {} as Record<string, string>) || {}
                        }
                        clientId={clientId || clienteData._id}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(redes) => {
                          const redesArray = Object.entries(redes)
                            .filter(([_, username]) => username)
                            .map(([platform, username]) => ({
                              platform,
                              username: username?.trim() || "",
                              _id: clienteData.redesSociales?.find((r: any) => r.platform === platform)?._id
                            }));
                          handleChange({ redesSociales: redesArray });
                        }}
                      />
                    </motion.div>
                    {/* Información de Contacto */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                    >
                      <ContactoSection
                        direccion={clienteData.direccion}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(direccion) => handleChange({ direccion })}
                        clientId={clientId || clienteData._id}
                      />
                    </motion.div>
                    {/* Tags y Estado */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                    >
                      <TagsSection
                        tags={clienteData.tags}
                        activo={clienteData.activo}
                        estado={clienteData.estado}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={({ tags, activo, estado }) => handleChange({ tags, activo, estado })}
                        clientId={clientId || clienteData._id}
                      />
                    </motion.div>
                  </div>
                </div>
              )}
              {(activeSection === 'all' || activeSection === 'physical') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
                >
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-500" />
                    Notas del Cliente
                  </h3>
                  <NotasSection
                    notas={clienteData.notas || []}
                    editMode={editMode}
                    theme={theme || 'light'}
                    errors={errors}
                    isLoading={isLoading}
                    onSave={handleSave}
                    onAddNote={handleAddNote}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
                    onChange={(notas) => handleChange({ notas })}
                  />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
  
      {isPopupOpen && (
        <PopupCuestionarios
          cuestionario={cuestionario}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </>
  );
};

export default PanelPersonal;