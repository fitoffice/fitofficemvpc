import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { toast } from 'react-hot-toast';
import { 
  ClipboardList, 
  RefreshCw, 
  Edit3, 
  Save, 
<<<<<<< HEAD
=======
  X, 
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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

<<<<<<< HEAD
// Interfaz de notas (ejemplo)
=======
// Add this interface near the top of the file with other interfaces
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}
<<<<<<< HEAD

interface PanelPersonalProps {
  cliente: any;
  clientId?: string; // Prop opcional
  // onEdit debe actualizar el estado global (y realizar la llamada a la API, si es necesario)
  onEdit: (cliente: any) => Promise<void>;
=======
interface PanelPersonalProps {
  cliente: any;
  clientId?: string; // Añadido clientId como prop opcional
  onEdit: (cliente: any) => void;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
}

const PanelPersonal: React.FC<PanelPersonalProps> = ({ cliente, clientId, onEdit }) => {
  const { theme } = useTheme();
<<<<<<< HEAD

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
=======
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [cuestionario, setCuestionario] = useState<Cuestionario | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('all');

  const handleAddNote = async (note: Omit<Note, '_id'>) => {
    try {
      const clienteActualizado = {
        ...cliente,
        notas: [...(cliente.notas || []), { ...note, _id: Date.now().toString() }]
      };
      await onEdit(clienteActualizado);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      toast.success('Nota agregada correctamente');
    } catch (error) {
      toast.error('Error al agregar la nota');
    }
  };

  const handleEditNote = async (id: string, updatedNote: Partial<Note>) => {
<<<<<<< HEAD
    const updatedNotes = (clienteData.notas || []).map((note: Note) =>
      note._id === id ? { ...note, ...updatedNote } : note
    );
    const updatedData = { ...clienteData, notas: updatedNotes };
    setClienteData(updatedData);
    try {
      await onEdit(updatedData);
=======
    try {
      const clienteActualizado = {
        ...cliente,
        notas: (cliente.notas || []).map(note => 
          note._id === id ? { ...note, ...updatedNote } : note
        )
      };
      await onEdit(clienteActualizado);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      toast.success('Nota actualizada correctamente');
    } catch (error) {
      toast.error('Error al actualizar la nota');
    }
  };

  const handleDeleteNote = async (id: string) => {
<<<<<<< HEAD
    const updatedNotes = (clienteData.notas || []).filter((note: Note) => note._id !== id);
    const updatedData = { ...clienteData, notas: updatedNotes };
    setClienteData(updatedData);
    try {
      await onEdit(updatedData);
=======
    try {
      const clienteActualizado = {
        ...cliente,
        notas: (cliente.notas || []).filter(note => note._id !== id)
      };
      await onEdit(clienteActualizado);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      toast.success('Nota eliminada correctamente');
    } catch (error) {
      toast.error('Error al eliminar la nota');
    }
  };

<<<<<<< HEAD
  // ----------------------------------------------------------------
  // Cuestionario
  // ----------------------------------------------------------------
  const verCuestionario = () => {
    if (clienteData.cuestionarioId && cuestionario) {
=======
  // ... existing useEffect and functions remain unchanged ...

  // Add the missing functions
  const verCuestionario = () => {
    if (cliente.cuestionarioId && cuestionario) {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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
<<<<<<< HEAD
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
=======

    const clienteActualizado = { ...cliente };
    
    // Autocompletar datos básicos si están disponibles en el cuestionario
    if (cuestionario.edad) {
      const fechaNacimiento = new Date();
      fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - cuestionario.edad);
      clienteActualizado.fechaNacimiento = fechaNacimiento.toISOString().split('T')[0];
    }
    
    if (cuestionario.genero) {
      clienteActualizado.genero = cuestionario.genero as any;
    }
    
    // Autocompletar datos físicos
    if (cuestionario.peso) {
      clienteActualizado.peso = cuestionario.peso;
    }
    
    if (cuestionario.altura) {
      clienteActualizado.altura = cuestionario.altura;
    }
    
    // Autocompletar condiciones médicas
    if (cuestionario.condicionesMedicas && cuestionario.condicionesMedicas.length > 0) {
      clienteActualizado.condicionesMedicas = [
        ...new Set([...clienteActualizado.condicionesMedicas, ...cuestionario.condicionesMedicas])
      ];
    }
    
    onEdit(clienteActualizado);
    toast.success('Datos autocompletados desde el cuestionario');
  };

  const handleSave = async () => {
    setIsLoading(true);
    setErrors({});

    try {
      const newErrors: any = {};
      if (!cliente.nombre) newErrors.nombre = 'El nombre es requerido';
      if (!cliente.email) newErrors.email = 'El email es requerido';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        toast.error('Por favor, corrija los errores antes de guardar');
        return;
      }

      await onEdit(cliente);
      setEditMode(false);
      toast.success('Cambios guardados correctamente');
    } catch (error) {
      toast.error('Error al guardar los cambios');
    } finally {
      setIsLoading(false);
    }
  };

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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
<<<<<<< HEAD
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
=======
          overflow-hidden transition-colors duration-300 ease-in-out
        `}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">{cliente.nombre}</h2>
              <p className="text-blue-100">{cliente.email}</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {editMode ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full transition-all shadow-md flex items-center"
                  >
                    <Save size={18} className="mr-2" />
                    {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                  <Button
                    onClick={() => setEditMode(false)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all shadow-md flex items-center"
                  >
                    <X size={18} className="mr-2" />
                    Cancelar
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full transition-all shadow-md flex items-center"
                >
                  <Edit3 size={18} className="mr-2" />
                  Editar Información
                </Button>
              )}
            </div>
          </div>
          
          {/* Section tabs */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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

<<<<<<< HEAD
        {/* Acciones del cuestionario */}
=======
        {/* Cuestionario actions */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        <div className="p-4 bg-blue-50 dark:bg-gray-700 border-b border-blue-100 dark:border-gray-600">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Cuestionario:
            </span>
            <Button
              variant="normal"
              onClick={verCuestionario}
<<<<<<< HEAD
              disabled={!clienteData.cuestionarioId || !cuestionario}
              className={`
                ${(!clienteData.cuestionarioId || !cuestionario) 
=======
              disabled={!cliente.cuestionarioId || !cuestionario}
              className={`
                ${!cliente.cuestionarioId || !cuestionario 
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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
<<<<<<< HEAD
            {clienteData.cuestionarioId && !cuestionario && (
=======
            {cliente.cuestionarioId && !cuestionario && (
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              <span className="text-xs text-amber-600 dark:text-amber-400 animate-pulse">
                Cargando cuestionario...
              </span>
            )}
          </div>
        </div>

<<<<<<< HEAD
        {/* Contenido principal */}
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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
<<<<<<< HEAD
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
=======
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-500" />
                        Información Básica
                      </h3>
                      <InfoBasicaSection
                        data={{
                          nombre: cliente.nombre,
                          email: cliente.email,
                          fechaNacimiento: cliente.fechaNacimiento,
                          genero: cliente.genero,
                          telefono: cliente.telefono
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                        }}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
<<<<<<< HEAD
                        onChange={(data) => handleChange(data)}
                        clientId={clientId || clienteData._id}
                      />                    
                    </motion.div>
                    {/* Cuestionario */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600 relative"
=======
                        onChange={(data) => onEdit({ ...cliente, ...data })}
                        clientId={clientId || cliente._id}
                      />                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                    >
                      <CuestionarioSection
                        cuestionario={cuestionario}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onVerCuestionario={verCuestionario}
<<<<<<< HEAD
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
=======
                        hasCuestionario={!!cliente.cuestionarioId && !!cuestionario}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                        <Activity className="w-5 h-5 mr-2 text-green-500" />
                        Información Física
                      </h3>
                      <InfoFisicaSection
                        data={{
                          altura: cliente.altura || 0,
                          peso: Array.isArray(cliente.peso) ? 
                            (cliente.peso.length > 0 ? cliente.peso[cliente.peso.length - 1] : 0) : 
                            (cliente.peso || 0)
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                        }}
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(data) => {
<<<<<<< HEAD
                          let updatedPeso = data.peso;
                          if (Array.isArray(clienteData.peso)) {
                            updatedPeso = [...clienteData.peso];
=======
                          // If peso is an array in the client data, update the last value or add a new one
                          let updatedPeso = data.peso;
                          if (Array.isArray(cliente.peso)) {
                            updatedPeso = [...cliente.peso];
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                            if (updatedPeso.length > 0) {
                              updatedPeso[updatedPeso.length - 1] = data.peso;
                            } else {
                              updatedPeso.push(data.peso);
                            }
                          }
<<<<<<< HEAD
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
=======
                          
                          onEdit({ 
                            ...cliente, 
                            altura: data.altura,
                            peso: updatedPeso
                          });
                        }}
                        clientId={clientId || cliente._id}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <CondicionesMedicasSection
                        condiciones={cliente.condicionesMedicas}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
<<<<<<< HEAD
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
=======
                        onChange={(condiciones) => onEdit({ ...cliente, condicionesMedicas: condiciones })}
                        clientId={clientId || cliente._id}
                      />
                    </motion.div>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                                             <RedesSocialesSection
                        redes={cliente.redesSociales?.reduce((acc, red) => {
                          acc[red.platform] = red.username;
                          return acc;
                        }, {} as Record<string, string>) || {}}
                        clientId={clientId || cliente._id}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
                        onChange={(redes) => {
<<<<<<< HEAD
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
=======
                          // Convert from object format back to array format
                          const redesArray = Object.entries(redes).map(([platform, username]) => ({
                            platform,
                            username
                          }));
                          onEdit({ ...cliente, redesSociales: redesArray });
                        }}
                      />

                   </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.2 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <ContactoSection
                        direccion={cliente.direccion}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
<<<<<<< HEAD
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
=======
                        onChange={(direccion) => onEdit({ ...cliente, direccion })}
                        clientId={clientId || cliente._id}
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.3 } }}
                      className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                    >
                      <TagsSection
                        tags={cliente.tags}
                        activo={cliente.activo}
                        estado={cliente.estado} // Added estado prop
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                        editMode={editMode}
                        theme={theme || 'light'}
                        errors={errors}
                        isLoading={isLoading}
                        onSave={handleSave}
<<<<<<< HEAD
                        onChange={({ tags, activo, estado }) => handleChange({ tags, activo, estado })}
                        clientId={clientId || clienteData._id}
=======
                        onChange={({ tags, activo, estado }) => onEdit({ 
                          ...cliente, 
                          tags, 
                          activo,
                          estado // Added estado to the onChange handler
                        })}
                        clientId={clientId || cliente._id}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                      />
                    </motion.div>
                  </div>
                </div>
              )}
<<<<<<< HEAD
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
=======

              {(activeSection === 'all' || activeSection === 'physical') && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.4 } }}                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5 border border-gray-100 dark:border-gray-600"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-green-500" />
                      Notas del Cliente
                    </h3>
                    <NotasSection
                    notas={cliente.notas || []}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                    editMode={editMode}
                    theme={theme || 'light'}
                    errors={errors}
                    isLoading={isLoading}
                    onSave={handleSave}
                    onAddNote={handleAddNote}
                    onEditNote={handleEditNote}
                    onDeleteNote={handleDeleteNote}
<<<<<<< HEAD
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
=======
                    onChange={(notas) => onEdit({ ...cliente, notas })}
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
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
