import React, { useState, useEffect } from 'react';
import { Scale, ArrowDown, ArrowUp, Percent, Dumbbell, Sparkles, Activity, Book } from 'lucide-react';
import { Switch } from '../ui/switch';

// Define interfaces
interface PeriodoExercise {
  name: string;
  multiplier: string;
}

interface ExerciseAdjustment {
  type: 'maintain' | 'decrease' | 'increase';
  unit: 'kg' | 'percent';
  value: string;
}

interface Exercise {
  _id: string;
  nombre: string;
  grupoMuscular: string[];
  descripcion: string;
  equipo: string[];
  fechaCreacion: string;
}

interface MultiplicadoresEjerciciosProps {
  periodoIndex: number;
  modoMultiplicadorSimple: boolean;
  multiplicadorGeneral?: string;
  exercises: PeriodoExercise[];
  onToggleModoMultiplicador: (periodoIndex: number) => void;
  onUpdateMultiplicadorGeneral: (periodoIndex: number, value: string) => void;
  onUpdateExerciseMultiplier: (periodoIndex: number, exerciseIndex: number, value: string) => void;
  modoReglaUnica?: boolean; // Nuevo prop para el modo de regla única
  onToggleModoReglaUnica?: () => void; // Función para alternar el modo de regla única
}

const MultiplicadoresEjercicios: React.FC<{
  periodoIndex?: number; // Añadir periodoIndex como prop opcional
  modoMultiplicadorSimple?: boolean;
  multiplicadorGeneral?: string;
  exercises: PeriodoExercise[];
  onToggleModoMultiplicador?: (periodoIndex?: number) => void;
  onUpdateMultiplicadorGeneral: (periodoIndex: number, value: string) => void;
  onUpdateExerciseMultiplier: (periodoIndex: number, exerciseIndex: number, value: string) => void;
  modoReglaUnica?: boolean;
  onToggleModoReglaUnica?: () => void;
}> = ({
  periodoIndex = 0, // Valor predeterminado para periodoIndex
  modoMultiplicadorSimple = false,
  multiplicadorGeneral,
  exercises,
  onToggleModoMultiplicador = () => {}, // Provide default empty function
  onUpdateMultiplicadorGeneral,
  onUpdateExerciseMultiplier,
  modoReglaUnica = false, // Valor predeterminado para el modo de regla única
  onToggleModoReglaUnica = () => {}, // Función predeterminada vacía
}) => {
  // General adjustment for simple mode
  const [generalAdjustment, setGeneralAdjustment] = useState<ExerciseAdjustment>({
    type: 'maintain',
    unit: 'kg',
    value: ''
  });
  
  // Individual adjustments for each exercise
  const [exerciseAdjustments, setExerciseAdjustments] = useState<ExerciseAdjustment[]>([]);
  const [localMultiplicador, setLocalMultiplicador] = useState(multiplicadorGeneral || '');
  useEffect(() => {
    setLocalMultiplicador(multiplicadorGeneral || '');
  }, [multiplicadorGeneral]);

  // State for API exercises
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [localExercises, setLocalExercises] = useState<PeriodoExercise[]>(exercises);

  // Estado para la regla única
  const [reglaUnica, setReglaUnica] = useState<{
    nombre: string;
    descripcion: string;
    multiplicador: string;
    ajuste: ExerciseAdjustment;
  }>({
    nombre: "Regla General",
    descripcion: "Aplicar a todos los ejercicios",
    multiplicador: "",
    ajuste: {
      type: 'maintain',
      unit: 'kg',
      value: ''
    }
  });
  useEffect(() => {
    setLocalExercises(exercises);
  }, [exercises]);
  // Fetch exercises from API
  useEffect(() => {
    const fetchExercises = async () => {
      // ... existing code ...
      setIsLoading(true);
      setError(null);
      
      try {
        // Get token from localStorage or wherever it's stored in your app
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/exercises', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        setAvailableExercises(result.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching exercises');
        console.error('Error fetching exercises:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExercises();
  }, []);
  
  // Add a handler function to safely call the toggle function
  const handleToggleModoMultiplicador = () => {
    try {
      if (typeof onToggleModoMultiplicador === 'function') {
        // Llamar a la función sin parámetro o con el índice correcto si está disponible
        onToggleModoMultiplicador();
      } else {
        console.warn('onToggleModoMultiplicador is not a function or not provided');
      }
    } catch (error) {
      console.error('Error toggling modo multiplicador:', error);
    }
  };
  
  // Manejador para alternar el modo de regla única
  const handleToggleModoReglaUnica = () => {
    try {
      if (typeof onToggleModoReglaUnica === 'function') {
        onToggleModoReglaUnica();
      } else {
        console.warn('onToggleModoReglaUnica is not a function or not provided');
      }
    } catch (error) {
      console.error('Error toggling modo regla única:', error);
    }
  };
  
  // Initialize exercise adjustments when exercises change
  useEffect(() => {
    // ... existing code ...
    // Create default adjustments for each exercise
    const newAdjustments = exercises.map(() => ({
      type: 'maintain' as const,
      unit: 'kg' as const,
      value: ''
    }));
    
    setExerciseAdjustments(newAdjustments);
  }, [exercises.length]); // Only re-run if the number of exercises changes
  
  // Update a specific exercise's adjustment
  const updateExerciseAdjustment = (exerciseIndex: number, field: keyof ExerciseAdjustment, value: any) => {
    // ... existing code ...
    setExerciseAdjustments(prev => {
      const newAdjustments = [...prev];
      if (newAdjustments[exerciseIndex]) {
        newAdjustments[exerciseIndex] = {
          ...newAdjustments[exerciseIndex],
          [field]: value
        };
      }
      return newAdjustments;
    });
  };
  
  // Actualizar un campo específico de la regla única
  const updateReglaUnica = (field: keyof typeof reglaUnica, value: any) => {
    setReglaUnica(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Actualizar un campo específico del ajuste de la regla única
  const updateReglaUnicaAjuste = (field: keyof ExerciseAdjustment, value: any) => {
    setReglaUnica(prev => ({
      ...prev,
      ajuste: {
        ...prev.ajuste,
        [field]: value
      }
    }));
  };
  
  return (
    <div className="mt-6 bg-gradient-to-br from-gray-50/90 to-white dark:from-gray-800/90 dark:to-gray-800/70 p-6 rounded-2xl shadow-lg border border-gray-100/80 dark:border-gray-700/80 backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
      <h6 className="text-base font-extrabold text-gray-800 dark:text-white flex items-center gap-2.5">
        <div className="flex items-center justify-center w-9 h-9 bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full shadow-sm">
          <Activity className="w-5 h-5" />
        </div>
        <span className="bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
          Multiplicadores de Ejercicios
        </span>
      </h6>
      
      {/* Display loading state or error if applicable */}
      {isLoading && (
        <div className="text-sm text-blue-600 dark:text-blue-400">
          Cargando ejercicios...
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-600 dark:text-red-400">
          Error: {error}
        </div>
      )}
      
      <div className="flex items-center gap-3">
        {/* Switch para modo multiplicador simple/individual */}
        <div className="flex items-center gap-3 bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-md border border-gray-100/80 dark:border-gray-700/80 transition-all duration-300 hover:shadow-lg">
          <label className="text-xs font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
            {modoMultiplicadorSimple ? (
              <>
                <div className="flex items-center justify-center w-6 h-6 bg-amber-100/80 dark:bg-amber-900/30 text-amber-500 rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <span>Único</span>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center w-6 h-6 bg-blue-100/80 dark:bg-blue-900/30 text-blue-500 rounded-full">
                  <Dumbbell className="w-3.5 h-3.5" />
                </div>
                <span>Individual</span>
              </>
            )}
          </label>

          <Switch 
            checked={modoMultiplicadorSimple}
            onCheckedChange={handleToggleModoMultiplicador}
            className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-amber-500 data-[state=checked]:to-orange-500 data-[state=unchecked]:bg-gradient-to-r data-[state=unchecked]:from-blue-500 data-[state=unchecked]:to-indigo-500"
          />
        </div>
        
        {/* Switch para modo regla única */}

      </div>
    </div>
    
    <div className="space-y-5 mt-4">
      {modoReglaUnica ? (
        // Modo de Regla Única
        <div className="bg-gradient-to-br from-purple-50/90 via-indigo-50/90 to-blue-50/90 dark:from-purple-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 rounded-2xl p-7 border border-purple-100/80 dark:border-purple-800/30 shadow-xl shadow-purple-100/30 dark:shadow-purple-900/10 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-100/40 dark:hover:shadow-purple-900/20">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-extrabold bg-gradient-to-r from-purple-700 to-indigo-700 dark:from-purple-300 dark:to-indigo-300 bg-clip-text text-transparent flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full shadow-sm">
                  <Book className="w-4.5 h-4.5" />
                </div>
                Regla Única
              </label>
              
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 px-3 py-1 rounded-full">
                Aplicar a todos los ejercicios
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Nombre de la regla */}
              <div className="relative transition-all duration-300 group">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                    <Book className="w-3 h-3" />
                  </div>
                  Nombre de la Regla
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/80 to-indigo-500/80 rounded-lg blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <input
                    type="text"
                    placeholder="Nombre de la regla"
                    value={reglaUnica.nombre}
                    onChange={(e) => updateReglaUnica('nombre', e.target.value)}
                    className="relative w-full px-4 py-3 rounded-lg border border-purple-300/90 dark:border-purple-600/90
                           focus:ring-3 focus:ring-purple-500/50 focus:border-purple-500
                           dark:bg-gray-700/90 dark:text-white transition-all duration-300 text-sm shadow-md group-hover:shadow-lg"
                  />
                </div>
              </div>
              
              {/* Descripción de la regla */}
              <div className="relative transition-all duration-300 group">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                    <Book className="w-3 h-3" />
                  </div>
                  Descripción
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/80 to-indigo-500/80 rounded-lg blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <textarea
                    placeholder="Descripción de la regla"
                    value={reglaUnica.descripcion}
                    onChange={(e) => updateReglaUnica('descripcion', e.target.value)}
                    className="relative w-full px-4 py-3 rounded-lg border border-purple-300/90 dark:border-purple-600/90
                           focus:ring-3 focus:ring-purple-500/50 focus:border-purple-500
                           dark:bg-gray-700/90 dark:text-white transition-all duration-300 text-sm shadow-md group-hover:shadow-lg"
                    rows={3}
                  />
                </div>
              </div>
              
              {/* Multiplicador */}
              <div className="relative transition-all duration-300 group">
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-purple-100/80 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
                    <Scale className="w-3 h-3" />
                  </div>
                  Multiplicador (%)
                </label>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/80 to-indigo-500/80 rounded-lg blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <input
                    type="text"
                    placeholder="Multiplicador"
                    value={reglaUnica.multiplicador}
                    onChange={(e) => updateReglaUnica('multiplicador', e.target.value)}
                    className="relative w-full px-4 py-3 rounded-lg border border-purple-300/90 dark:border-purple-600/90
                           focus:ring-3 focus:ring-purple-500/50 focus:border-purple-500
                           dark:bg-gray-700/90 dark:text-white transition-all duration-300 text-sm shadow-md group-hover:shadow-lg"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 font-medium">
                    %
                  </div>
                </div>
              </div>
              
              {/* Ajuste de peso para la regla única */}
              <div className="bg-white/95 dark:bg-gray-800/90 rounded-xl p-6 border border-purple-100/80 dark:border-purple-800/30 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl mt-5">
                <p className="text-sm font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-5 flex items-center justify-center gap-2.5">
                  <div className="flex items-center justify-center w-7 h-7 bg-purple-100/80 dark:bg-purple-900/30 text-purple-500 dark:text-purple-400 rounded-full shadow-sm">
                    <Scale className="w-4 h-4" />
                  </div>
                  Ajuste de peso
                </p>
                
                <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateReglaUnicaAjuste('type', 'maintain')}
                    className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md rounded-xl text-sm ${
                      reglaUnica.ajuste.type === 'maintain' 
                        ? 'bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 border border-purple-200 dark:border-purple-800/50 text-purple-700 dark:text-purple-300 font-medium' 
                        : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Scale className={`w-4.5 h-4.5 ${reglaUnica.ajuste.type === 'maintain' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span>Mantener</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateReglaUnicaAjuste('type', 'decrease')}
                    className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md rounded-xl text-sm ${
                      reglaUnica.ajuste.type === 'decrease' 
                        ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 font-medium' 
                        : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ArrowDown className={`w-4.5 h-4.5 ${reglaUnica.ajuste.type === 'decrease' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span>Bajar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateReglaUnicaAjuste('type', 'increase')}
                    className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md rounded-xl text-sm ${
                      reglaUnica.ajuste.type === 'increase' 
                        ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 font-medium' 
                        : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ArrowUp className={`w-4.5 h-4.5 ${reglaUnica.ajuste.type === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
                    <span>Subir</span>
                  </button>
                </div>
                
                <div className="mt-5 flex justify-center gap-2.5">
                  {reglaUnica.ajuste.type !== 'maintain' && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateReglaUnicaAjuste('unit', 'kg')}
                        className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 rounded-xl text-sm ${
                          reglaUnica.ajuste.unit === 'kg' 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-lg' 
                            : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Scale className="w-4.5 h-4.5" />
                        <span>Kilogramos</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateReglaUnicaAjuste('unit', 'percent')}
                        className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 rounded-xl text-sm ${
                          reglaUnica.ajuste.unit === 'percent' 
                            ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium shadow-lg' 
                            : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Percent className="w-4.5 h-4.5" />
                        <span>Porcentaje</span>
                      </button>
                    </>
                  )}
                </div>
                
                {reglaUnica.ajuste.type !== 'maintain' && (
                  <div className="mt-5 relative max-w-xs mx-auto">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/80 to-indigo-500/80 rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                    <input
                      type="number"
                      placeholder="Ajuste de peso"
                      value={reglaUnica.ajuste.value}
                      onChange={(e) => updateReglaUnicaAjuste('value', e.target.value)}
                      className="relative w-full p-4 border border-gray-200/90 dark:border-gray-700/90 rounded-xl focus:ring-3 focus:ring-indigo-500/50 dark:focus:ring-indigo-600/50 focus:border-indigo-500 dark:focus:border-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg bg-white/95 dark:bg-gray-800/95 text-base font-medium"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                      {reglaUnica.ajuste.unit === 'kg' ? 'kg' : '%'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : modoMultiplicadorSimple ? (
        // ... existing code for simple mode ...
        <div className="bg-gradient-to-br from-blue-50/90 via-indigo-50/90 to-purple-50/90 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-7 border border-blue-100/80 dark:border-blue-800/30 shadow-xl shadow-blue-100/30 dark:shadow-blue-900/10 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-100/40 dark:hover:shadow-blue-900/20">
          <div className="mb-6">
            <label className="block text-sm font-extrabold mb-3.5 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-300 dark:to-indigo-300 bg-clip-text text-transparent flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full shadow-sm">
                <Scale className="w-4.5 h-4.5" />
              </div>
              Multiplicador general (%)
            </label>
            <div className="relative transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/80 to-indigo-500/80 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <input
    type="text"
    inputMode="decimal"
    placeholder="Ingrese % del RM"
    value={localMultiplicador}
    onChange={(e) => {
      const value = e.target.value;
      if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
        setLocalMultiplicador(value);
        onUpdateMultiplicadorGeneral(periodoIndex, value);
      }
    }}
    className="relative w-full p-4 border-2 border-blue-100/90 dark:border-indigo-800/50 rounded-xl focus:ring-4 focus:ring-indigo-200/50 dark:focus:ring-indigo-800/30 focus:border-indigo-500 dark:focus:border-indigo-600 transition-all duration-300 shadow-sm group-hover:shadow-md bg-white/95 dark:bg-gray-800/95 text-lg font-medium"
  />              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 font-bold text-lg">%</div>
            </div>
          </div>
          
          {/* ... rest of simple mode code ... */}
          <div className="space-y-4">
            <div className="bg-white/95 dark:bg-gray-800/90 rounded-xl p-6 border border-blue-100/80 dark:border-blue-800/30 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
              <p className="text-sm font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-5 flex items-center justify-center gap-2.5">
                <div className="flex items-center justify-center w-7 h-7 bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400 rounded-full shadow-sm">
                  <Scale className="w-4 h-4" />
                </div>
                Ajuste de peso
              </p>
              
              <div className="mt-4 flex flex-wrap justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setGeneralAdjustment(prev => ({ ...prev, type: 'maintain' }))}
                  className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md rounded-xl text-sm ${
                    generalAdjustment.type === 'maintain' 
                      ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 font-medium' 
                      : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Scale className={`w-4.5 h-4.5 ${generalAdjustment.type === 'maintain' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span>Mantener</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGeneralAdjustment(prev => ({ ...prev, type: 'decrease' }))}
                  className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md rounded-xl text-sm ${
                    generalAdjustment.type === 'decrease' 
                      ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 font-medium' 
                      : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ArrowDown className={`w-4.5 h-4.5 ${generalAdjustment.type === 'decrease' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span>Bajar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setGeneralAdjustment(prev => ({ ...prev, type: 'increase' }))}
                  className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-md rounded-xl text-sm ${
                    generalAdjustment.type === 'increase' 
                      ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 font-medium' 
                      : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <ArrowUp className={`w-4.5 h-4.5 ${generalAdjustment.type === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  <span>Subir</span>
                </button>
              </div>
              
              <div className="mt-5 flex justify-center gap-2.5">
                {generalAdjustment.type !== 'maintain' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setGeneralAdjustment(prev => ({ ...prev, unit: 'kg' }))}
                      className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 rounded-xl text-sm ${
                        generalAdjustment.unit === 'kg' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg' 
                          : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Scale className="w-4.5 h-4.5" />
                      <span>Kilogramos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setGeneralAdjustment(prev => ({ ...prev, unit: 'percent' }))}
                      className={`px-4 py-3 flex items-center gap-2 transition-all duration-300 rounded-xl text-sm ${
                        generalAdjustment.unit === 'percent' 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg' 
                          : 'bg-gray-50 dark:bg-gray-700/80 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Percent className="w-4.5 h-4.5" />
                      <span>Porcentaje</span>
                    </button>
                  </>
                )}
              </div>
              
              {generalAdjustment.type !== 'maintain' && (
                <div className="mt-5 relative max-w-xs mx-auto">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/80 to-indigo-500/80 rounded-xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                  <input
                    type="number"
                    placeholder="Ajuste de peso"
                    value={generalAdjustment.value}
                    onChange={(e) => setGeneralAdjustment(prev => ({ ...prev, value: e.target.value }))}
                    className="relative w-full p-4 border border-gray-200/90 dark:border-gray-700/90 rounded-xl focus:ring-3 focus:ring-indigo-500/50 dark:focus:ring-indigo-600/50 focus:border-indigo-500 dark:focus:border-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg bg-white/95 dark:bg-gray-800/95 text-base font-medium"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                    {generalAdjustment.unit === 'kg' ? 'kg' : '%'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/95 dark:bg-gray-800/90 rounded-xl border border-gray-200/80 dark:border-gray-700/80 overflow-hidden shadow-xl divide-y divide-gray-200/80 dark:divide-gray-700/80 transition-all duration-300 hover:shadow-2xl">
          {/* Display available exercises from API if they exist */}
          {availableExercises.length > 0 ? (
            availableExercises.map((apiExercise, exerciseIndex) => (
              <div 
                key={apiExercise._id} 
                className="p-6 transition-all duration-300 hover:bg-gray-50/90 dark:hover:bg-gray-700/50"
              >
                <div className="flex items-center justify-between mb-5">
                  <label className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2.5">
                    <div className="flex items-center justify-center w-9 h-9 bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full shadow-sm">
                      <Dumbbell className="w-4.5 h-4.5" />
                    </div>
                    <span className="bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
                      {apiExercise.nombre}
                    </span>
                  </label>
                  <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100/80 dark:bg-gray-700/80 px-3 py-1 rounded-full">
                    {apiExercise.grupoMuscular.join(', ')}
                  </div>
                </div>
                
                <div className="space-y-5">
                  <div className="relative transition-all duration-300 group">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2.5 flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        <Scale className="w-3 h-3" />
                      </div>
                      Multiplicador (%)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/80 to-indigo-500/80 rounded-lg blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                      <input
                        type="text"
                        placeholder="Mult."
                        value={localExercises[exerciseIndex]?.multiplier || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Only allow numbers and decimal point
                          if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
                            // Update local state first
                            const updatedExercises = [...localExercises];
                            if (updatedExercises[exerciseIndex]) {
                              updatedExercises[exerciseIndex] = {
                                ...updatedExercises[exerciseIndex],
                                multiplier: value
                              };
                            }
                            setLocalExercises(updatedExercises);
                            
                            // Try to update parent state if function exists
                            if (typeof onUpdateExerciseMultiplier === 'function') {
                              onUpdateExerciseMultiplier(periodoIndex, exerciseIndex, value);
                            } else {
                              console.warn('onUpdateExerciseMultiplier is not a function');
                            }
                          }
                        }}
                        className="relative w-full px-4 py-3 rounded-lg border border-gray-300/90 dark:border-gray-600/90
                               focus:ring-3 focus:ring-blue-500/50 focus:border-blue-500
                               dark:bg-gray-700/90 dark:text-white transition-all duration-300 text-sm shadow-md group-hover:shadow-lg"
                      />
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 dark:text-indigo-400 font-medium">
                        %
                      </div>
                    </div>
                  </div>
                  
                  {/* Ajuste de peso para ejercicio individual */}
                  <div className="bg-gradient-to-br from-gray-50/90 to-white/90 dark:from-gray-800/80 dark:to-gray-800/70 rounded-xl p-5 border border-gray-200/80 dark:border-gray-700/80 shadow-md transition-all duration-300 hover:shadow-lg">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                      <div className="flex items-center justify-center w-5 h-5 bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        <Scale className="w-3 h-3" />
                      </div>
                      Ajuste de peso
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        type="button"
                        onClick={() => updateExerciseAdjustment(exerciseIndex, 'type', 'maintain')}
                        className={`px-3 py-2 flex items-center gap-1.5 text-xs rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          exerciseAdjustments[exerciseIndex]?.type === 'maintain' 
                            ? 'bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 border border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 font-medium shadow-md' 
                            : 'bg-gray-100/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200/90 dark:hover:bg-gray-600/90'
                        }`}
                      >
                        <Scale className={`w-3.5 h-3.5 ${exerciseAdjustments[exerciseIndex]?.type === 'maintain' ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                        <span>Mantener</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateExerciseAdjustment(exerciseIndex, 'type', 'decrease')}
                        className={`px-3 py-2 flex items-center gap-1.5 text-xs rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          exerciseAdjustments[exerciseIndex]?.type === 'decrease' 
                            ? 'bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 font-medium shadow-md' 
                            : 'bg-gray-100/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200/90 dark:hover:bg-gray-600/90'
                        }`}
                      >
                        <ArrowDown className={`w-3.5 h-3.5 ${exerciseAdjustments[exerciseIndex]?.type === 'decrease' ? 'text-red-600 dark:text-red-400' : 'text-red-500'}`} />
                        <span>Bajar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => updateExerciseAdjustment(exerciseIndex, 'type', 'increase')}
                        className={`px-3 py-2 flex items-center gap-1.5 text-xs rounded-lg transition-all duration-300 transform hover:scale-105 ${
                          exerciseAdjustments[exerciseIndex]?.type === 'increase' 
                            ? 'bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 font-medium shadow-md' 
                            : 'bg-gray-100/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200/90 dark:hover:bg-gray-600/90'
                        }`}
                      >
                        <ArrowUp className={`w-3.5 h-3.5 ${exerciseAdjustments[exerciseIndex]?.type === 'increase' ? 'text-green-600 dark:text-green-400' : 'text-green-500'}`} />
                        <span>Subir</span>
                      </button>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                      {exerciseAdjustments[exerciseIndex]?.type !== 'maintain' && (
                        <>
                          <button
                            type="button"
                            onClick={() => updateExerciseAdjustment(exerciseIndex, 'unit', 'kg')}
                            className={`px-3 py-2 flex items-center gap-1.5 text-xs rounded-lg transition-all duration-300 ${
                              exerciseAdjustments[exerciseIndex]?.unit === 'kg' 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md' 
                                : 'bg-gray-100/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200/90 dark:hover:bg-gray-600/90'
                            }`}
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Kg</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => updateExerciseAdjustment(exerciseIndex, 'unit', 'percent')}
                            className={`px-3 py-2 flex items-center gap-1.5 text-xs rounded-lg transition-all duration-300 ${
                              exerciseAdjustments[exerciseIndex]?.unit === 'percent' 
                                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-md' 
                                : 'bg-gray-100/90 dark:bg-gray-700/90 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200/90 dark:hover:bg-gray-600/90'
                            }`}
                          >
                            <Percent className="w-3.5 h-3.5" />
                            <span>%</span>
                          </button>
                        </>
                      )}
                    </div>
                    
                    {exerciseAdjustments[exerciseIndex]?.type !== 'maintain' && (
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Ajuste"
                          value={exerciseAdjustments[exerciseIndex]?.value || ''}
                          onChange={(e) => updateExerciseAdjustment(exerciseIndex, 'value', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300/90 dark:border-gray-600/90
                                   focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                                   dark:bg-gray-700/90 dark:text-white transition-all duration-300 text-sm shadow-md"
                        />
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
                          {exerciseAdjustments[exerciseIndex]?.unit === 'kg' ? 'kg' : '%'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100/80 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full shadow-sm">
                  <Dumbbell className="w-8 h-8" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  {isLoading ? 'Cargando ejercicios...' : 'No hay ejercicios disponibles'}
                </p>
                {error && (
                  <p className="text-sm text-red-500 dark:text-red-400">
                    {error}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
  );
};

export default MultiplicadoresEjercicios;