import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Plus,
  Filter,
  Dumbbell,
  Target,
  Clock,
  Users,
  Calendar,
  TrendingUp,
  Pencil,
  Trash2,
  FileUp
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Table from '../../components/Common/Table';
import { useTheme } from '../../contexts/ThemeContext';
import { useModal } from '../../context/ModalContext';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import FilterMenu from '../../components/Routines/FilterMenu';
import { useAIRoutineModal } from '../../contexts/AIRoutineModalContext';
import { useRoutineCreation } from '../../contexts/RoutineCreationContext';
import CSVRoutinePopup from '../../components/Routines/CSVRoutinePopup';
import EditRoutineModal from '../../components/Routines/EditRoutineModal';
<<<<<<< HEAD
import AIRoutineModal from '../../components/Routines/AIRoutineModal';
import { useRoutines } from '../../contexts/RoutineContext';
=======
import AIRoutineModal from '../../components/Routines/AIRoutineModal'; // Importa el modal de IA
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

interface Metric {
  type: string;
  value: string;
  _id: string;
}

interface Exercise {
  name: string;
  metrics: Metric[];
  notes: string;
  _id: string;
}

<<<<<<< HEAD
export interface Routine {
=======
interface Routine {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  _id: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  exercises: Exercise[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

<<<<<<< HEAD
const WorkoutList: React.FC = () => {
  const { theme } = useTheme();
  const { openRoutineModal } = useModal();
=======
// Import the useRoutines hook at the top with other imports
import { useRoutines } from '../../contexts/RoutineContext';

const WorkoutList: React.FC = () => {
  const { theme } = useTheme();
  const { openRoutineModal } = useModal();

  // Extraemos del contexto de IA:
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const {
    pendingAIRoutine,
    setPendingAIRoutine,
    openModal: openAIModal,
    isOpen,
    closeModal
  } = useAIRoutineModal();
<<<<<<< HEAD
=======

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const { routines, setRoutines, addRoutine, updateRoutine, deleteRoutine } = useRoutines();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { pendingRoutine, setPendingRoutine, hasPendingRoutine } = useRoutineCreation();
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    difficulty: '',
    muscleGroup: '',
    duration: ''
  });
<<<<<<< HEAD
  const filterButtonRef = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState({});
  const [attributes, setAttributes] = useState({});
=======
  // Remove the ref from here since we'll handle it differently
  // const filterButtonRef = useRef<HTMLButtonElement>(null);
  const filterButtonRef = useRef<HTMLDivElement>(null);
  const [styles, setStyles] = useState({});
  const [attributes, setAttributes] = useState({});
  // Estado para controlar la visibilidad del popup CSV
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const [showCSVPopup, setShowCSVPopup] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadRoutines = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

<<<<<<< HEAD
        const response = await axios.get('https://fitoffice2-ff8035a9df10.herokuapp.com/api/routines/routines', {
          headers: { 'Authorization': `Bearer ${token}` }
=======
        const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines/routines', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        });

        if (response.data.status === 'success') {
          setRoutines(response.data.data);
        } else {
          throw new Error('Error al obtener las rutinas');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las rutinas');
      } finally {
        setLoading(false);
      }
    };

    loadRoutines();
  }, [setRoutines]);

  const handleCreateRoutine = () => {
    openRoutineModal({
      theme,
      onSave: (routineData: any) => {
<<<<<<< HEAD
        setPendingRoutine({
          ...routineData,
          _id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return true;
=======
        // Guardamos la rutina creada temporalmente en el context de creación manual
        setPendingRoutine({
          ...routineData,
          _id: `temp-${Date.now()}`, // ID temporal hasta que se guarde en backend
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        return true; // Cierra el modal
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      }
    });
  };

<<<<<<< HEAD
=======
  // Efecto para agregar la rutina pendiente creada manualmente
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  useEffect(() => {
    if (hasPendingRoutine && pendingRoutine) {
      addRoutine(pendingRoutine);
      setPendingRoutine(null);
    }
  }, [hasPendingRoutine, pendingRoutine, addRoutine, setPendingRoutine]);

<<<<<<< HEAD
=======
  // Efecto para agregar la rutina pendiente generada con IA
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  useEffect(() => {
    if (pendingAIRoutine) {
      addRoutine(pendingAIRoutine);
      setPendingAIRoutine(null);
    }
  }, [pendingAIRoutine, addRoutine, setPendingAIRoutine]);

  const handleEditRoutine = (routine: Routine) => {
    setSelectedRoutine(routine);
    setIsEditModalOpen(true);
  };

  const handleUpdateRoutineInList = (updatedRoutine: Routine) => {
    updateRoutine(updatedRoutine._id, updatedRoutine);
    setIsEditModalOpen(false);
  };

<<<<<<< HEAD
  // Actualización inmediata en el estado global y la rutina seleccionada
  const handleImmediateUpdate = (updatedRoutine: Routine) => {
    updateRoutine(updatedRoutine._id, updatedRoutine);
    if (selectedRoutine && selectedRoutine._id === updatedRoutine._id) {
      setSelectedRoutine(updatedRoutine);
    }
  };

  const handleDeleteRoutine = async (routineId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No se encontró el token de autenticación');

      await axios.delete(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/routines/routines/${routineId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
=======
  const handleDeleteRoutine = async (routineId: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines/routines/${routineId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      deleteRoutine(routineId);
    } catch (err) {
      console.error('Error deleting routine:', err);
    }
  };

  const handleImportCSV = async (file: File) => {
    try {
      const reader = new FileReader();
<<<<<<< HEAD
=======

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      return new Promise<void>((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const text = e.target?.result as string;
            const rows = text.split('\n').map(row => row.split(','));
<<<<<<< HEAD
            const data = rows.slice(1);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No se encontró el token de autenticación');

            for (const row of data) {
              if (row.length < 1) continue;
=======
            const headers = rows[0];
            const data = rows.slice(1);

            const token = localStorage.getItem('token');
            if (!token) {
              throw new Error('No se encontró el token de autenticación');
            }

            for (const row of data) {
              if (row.length < headers.length) continue; // Omitir filas vacías

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              const routineData = {
                name: JSON.parse(row[0] || '""'),
                description: JSON.parse(row[1] || '""'),
                tags: JSON.parse(row[2] || '""').split(',').map((tag: string) => tag.trim()),
                notes: JSON.parse(row[3] || '""'),
<<<<<<< HEAD
                exercises: []
              };
              try {
                await axios.post('https://fitoffice2-ff8035a9df10.herokuapp.com/api/routines/routines', routineData, {
                  headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
=======
                exercises: [] // Por ahora se dejan los ejercicios vacíos
              };

              try {
                await axios.post('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines/routines', routineData, {
                  headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                  }
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                });
              } catch (error) {
                console.error('Error al importar rutina:', error);
                reject(new Error('Error al importar algunas rutinas'));
              }
            }
<<<<<<< HEAD
            const loadRoutines = async () => {
              try {
                const response = await axios.get('https://fitoffice2-ff8035a9df10.herokuapp.com/api/routines/routines', {
                  headers: { 'Authorization': `Bearer ${token}` }
                });
=======

            // Recargar las rutinas después de importar
            const loadRoutines = async () => {
              try {
                const response = await axios.get('https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/routines/routines', {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                if (response.data.status === 'success') {
                  setRoutines(response.data.data);
                  resolve();
                } else {
                  throw new Error('Error al obtener las rutinas');
                }
              } catch (err) {
                reject(err);
              }
            };
<<<<<<< HEAD
=======

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
            await loadRoutines();
          } catch (error) {
            reject(error);
          }
        };
<<<<<<< HEAD
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
=======

        reader.onerror = () => {
          reject(new Error('Error al leer el archivo'));
        };

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        reader.readAsText(file);
      });
    } catch (error) {
      console.error('Error al procesar el archivo CSV:', error);
      throw error;
    }
  };

  const handleFilterChange = (filterType: string, value: string) => {
<<<<<<< HEAD
    setSelectedFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const filteredRoutines = routines.filter(routine => {
    if (!searchTerm.trim()) return true;
    const searchLower = searchTerm.toLowerCase().trim();
=======
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Add the filtering function here, before return statement
  const filteredRoutines = routines.filter(routine => {
    if (!searchTerm.trim()) return true;
    
    const searchLower = searchTerm.toLowerCase().trim();
    
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
    return (
      (routine.name && routine.name.toLowerCase().includes(searchLower)) ||
      (routine.description && routine.description.toLowerCase().includes(searchLower)) ||
      (routine.notes && routine.notes.toLowerCase().includes(searchLower)) ||
      (routine.tags && routine.tags.some(tag => tag.toLowerCase().includes(searchLower)))
    );
  });

  return (
    <div className={`p-6 min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
<<<<<<< HEAD
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
=======
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Dumbbell className={`w-8 h-8 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Rutinas de Entrenamiento
              </h2>
              <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Crea y gestiona rutinas personalizadas para tus clientes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
<<<<<<< HEAD
=======
            {/* Botón para abrir el popup de CSV */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
            <Button
              onClick={() => setShowCSVPopup(true)}
              variant="secondary"
              className={`flex items-center gap-2 text-white ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
            >
              <FileUp className="w-5 h-5" />
              Importar CSV
            </Button>
<<<<<<< HEAD
            <Button onClick={handleCreateRoutine} variant="create" className="flex items-center gap-2">
=======
            <Button
              onClick={handleCreateRoutine}
              variant="create"
              className="flex items-center gap-2"
            >
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              <Plus className="w-5 h-5" />
              Nueva Rutina
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/50 backdrop-blur-sm border border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Target className={`w-6 h-6 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Total Rutinas
            </h3>
          </div>
          <p className="text-3xl font-bold text-blue-500">{routines.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/50 backdrop-blur-sm border border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Clock className={`w-6 h-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Última Actualización
            </h3>
          </div>
          <p className="text-lg font-medium text-purple-500">
            {routines.length > 0 ? new Date(routines[0].updatedAt).toLocaleDateString() : 'Sin datos'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`p-6 rounded-xl ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/50 backdrop-blur-sm border border-gray-200'} shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <Users className={`w-6 h-6 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`} />
            <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
              Rutinas Activas
            </h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{routines.length}</p>
        </motion.div>
      </div>

<<<<<<< HEAD
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-row items-center justify-between gap-4 mb-6">
=======
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-row items-center justify-between gap-4 mb-6"
      >
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar rutinas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
=======
            className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          />
          <Search className={`absolute left-3 top-2.5 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center space-x-4 relative">
<<<<<<< HEAD
            <Button onClick={openAIModal} className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
              <Plus size={20} />
              Crear con IA
            </Button>
=======
            <Button
              onClick={openAIModal}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={20} />
              Crear con IA
            </Button>
            {/* Wrap the Button in a div that has the ref */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
            <div ref={filterButtonRef}>
              <Button
                variant="filter"
                onClick={() => setShowFilters(!showFilters)}
<<<<<<< HEAD
                className={`flex items-center gap-2 px-4 py-2 ${showFilters ? 'bg-blue-500 text-white' : ''} ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-gray-50/50'}`}
=======
                className={`flex items-center gap-2 px-4 py-2 ${showFilters ? 'bg-blue-500 text-white' : ''} ${
                  theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white/50 hover:bg-gray-50/50'
                }`}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
              >
                <Filter className="w-5 h-5" />
                Filtros
              </Button>
            </div>
            
            <AnimatePresence>
              {showFilters && (
                <FilterMenu
                  selectedFilters={selectedFilters}
                  onFilterChange={handleFilterChange}
<<<<<<< HEAD
                  style={{ position: 'absolute', top: '100%', marginTop: '0.5rem', right: 0 }}
=======
                  style={{
                    position: 'absolute',
                    top: '100%',
                    marginTop: '0.5rem',
                    right: 0,
                  }}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

<<<<<<< HEAD
      {loading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center items-center p-12">
          <div className="animate-bounce">
            <Dumbbell className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>
      ) : error ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100/50'} border ${theme === 'dark' ? 'border-red-800' : 'border-red-200'} text-center`}>
          <p className={`text-lg ${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>{error}</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`rounded-xl shadow-lg overflow-hidden ${theme === 'dark' ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700' : 'bg-white/50 backdrop-blur-sm border border-gray-200'}`}>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/50'}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Nombre
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Descripción
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Tags/Categorías
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Notas Adicionales
                  </th>
                  <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredRoutines.map((routine, idx) => (
                  <motion.tr 
                    key={routine._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50/50'} transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        {routine.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {routine.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {routine.tags &&
                          routine.tags.map((tag, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                tag.toLowerCase().includes('fuerza')
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                                  : tag.toLowerCase().includes('cardio')
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                  : tag.toLowerCase().includes('hipertrofia')
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                                  : tag.toLowerCase().includes('resistencia')
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                              } hover:scale-105`}
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {routine.notes}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-3 items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditRoutine(routine)}
                          className={`p-2 rounded-lg ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-100/50'} transition-colors duration-150`}
                          aria-label={`Editar ${routine.name}`}
                        >
                          <Pencil className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteRoutine(routine._id)}
                          className={`p-2 rounded-lg ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100/50'} transition-colors duration-150`}
                          aria-label={`Eliminar ${routine.name}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
=======
      <>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center items-center p-12"
          >
            <div className="animate-bounce">
              <Dumbbell className="w-8 h-8 text-blue-500" />
            </div>
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/50' : 'bg-red-100/50'} border ${
              theme === 'dark' ? 'border-red-800' : 'border-red-200'
            } text-center`}
          >
            <p className={`text-lg ${theme === 'dark' ? 'text-red-200' : 'text-red-600'}`}>
              {error}
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-xl shadow-lg overflow-hidden ${
              theme === 'dark'
                ? 'bg-gray-800/50 backdrop-blur-sm border border-gray-700'
                : 'bg-white/50 backdrop-blur-sm border border-gray-200'
            }`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50/50'}`}>
                  <tr>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Nombre
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Descripción
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Tags/Categorías
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Notas Adicionales
                    </th>
                    <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRoutines.map((routine, idx) => (
                    <motion.tr
                      key={routine._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-blue-50/50'} transition-colors duration-200`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                          {routine.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {routine.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {routine.tags &&
                            routine.tags.map((tag, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                                  tag.toLowerCase().includes('fuerza')
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                                    : tag.toLowerCase().includes('cardio')
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'
                                    : tag.toLowerCase().includes('hipertrofia')
                                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
                                    : tag.toLowerCase().includes('resistencia')
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
                                } hover:scale-105`}
                              >
                                {tag}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                          {routine.notes}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center space-x-3 items-center">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditRoutine(routine)}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-100/50'} transition-colors duration-150`}
                            aria-label={`Editar ${routine.name}`}
                          >
                            <Pencil className="w-5 h-5" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteRoutine(routine._id)}
                            className={`p-2 rounded-lg ${theme === 'dark' ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-100/50'} transition-colors duration-150`}
                            aria-label={`Eliminar ${routine.name}`}
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

      {selectedRoutine && (
        <EditRoutineModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleUpdateRoutineInList}
<<<<<<< HEAD
          onImmediateChange={handleImmediateUpdate}
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          routine={selectedRoutine}
          theme={theme}
        />
      )}

<<<<<<< HEAD
=======
      {/* Componente CSVRoutinePopup */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      <CSVRoutinePopup
        isOpen={showCSVPopup}
        onClose={() => setShowCSVPopup(false)}
        onImport={handleImportCSV}
      />

<<<<<<< HEAD
=======
      {/* Renderizamos el modal de creación con IA */}
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      {isOpen && <AIRoutineModal isOpen={isOpen} onClose={closeModal} theme={theme} />}
    </div>
  );
};

export default WorkoutList;