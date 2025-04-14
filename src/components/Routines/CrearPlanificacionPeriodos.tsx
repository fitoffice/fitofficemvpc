import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Calendar, Dumbbell, Scale, Percent, ArrowDown, ArrowUp, User, X, HelpCircle, Info } from 'lucide-react';
import Button from '../Common/Button';
import { Switch } from '../ui/switch';
import WeekGridCrearPlanificaciones from '../Planning/vistasplanning/weekgridcrearplanificacionescrear';
import MultiplicadoresEjercicios from './MultiplicadoresEjercicios';
import ClientInfoPeriodosClientes from './ClientInfoPeriodosClientes';

// Define an interface for exercise with multiplier
interface PeriodoExercise {
  name: string;
  multiplier: string;
}

interface Periodo {
  nombre: string;
  diaInicio: number;
  semanaInicio: number;
  diaFin: number;
  semanaFin: number;
  exercises: PeriodoExercise[];
  multiplicadorGeneral?: string;
  modoMultiplicadorSimple: boolean;
}

interface CrearPlanificacionPeriodosProps {
  totalSemanas: number;
  numPeriodos: number; // Add this new prop
  onChange: (periodos: Periodo[]) => void;
  periodos: Periodo[];
  clienteInfo?: any; // Add client info prop
}

const defaultExercises = [
  { name: 'Press Banca', multiplier: '' },
  { name: 'Sentadilla', multiplier: '' },
  { name: 'Peso Muerto', multiplier: '' },
  { name: 'Peso Rumano', multiplier: '' },
  { name: 'Curl de Biceps', multiplier: '' }
];

const CrearPlanificacionPeriodos: React.FC<CrearPlanificacionPeriodosProps> = ({
  totalSemanas,
  numPeriodos,
  onChange,
  periodos,
  clienteInfo,
}) => {
  // Add console logs to see what props are being received
  console.log('CrearPlanificacionPeriodos - Props received:', { 
    totalSemanas, 
    numPeriodos, 
    periodos: periodos ? periodos.length : 'undefined/null',
    periodosValue: periodos,
    clienteInfo
  });
  
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [initialSetupComplete, setInitialSetupComplete] = useState(false);
  const [mostrarInfoCliente, setMostrarInfoCliente] = useState(false);
  const [modoMultiplicadorSimple, setModoMultiplicadorSimple] = useState(false);
const [modoReglaUnica, setModoReglaUnica] = useState(false);

  // Ensure periodos length matches the expected number from mesociclo
  useEffect(() => {
    console.log('useEffect triggered with:', { 
      totalSemanas, 
      numPeriodos,
      periodos: periodos ? periodos.length : 'undefined/null',
      initialSetupComplete
    });
    
    // Skip if we've already done the initial setup or if we don't have required data
    if (initialSetupComplete || !totalSemanas || totalSemanas <= 0) {
      return;
    }
    
    // Check if we need to convert the periodos format
    if (periodos && periodos.length > 0 && 'semanas' in periodos[0]) {
      console.log('Converting periodos format from semanas to semanaInicio/semanaFin');
      
      // Convert from the format with 'semanas' to the format with semanaInicio/semanaFin
      const convertedPeriodos: Periodo[] = [];
      let currentWeekStart = 1;
      
      periodos.forEach((periodo: any, index: number) => {
        const weekEnd = Math.min(currentWeekStart + periodo.semanas - 1, totalSemanas);
        
        convertedPeriodos.push({
          nombre: periodo.nombre || `Periodo ${index + 1}`,
          diaInicio: 1,
          semanaInicio: currentWeekStart,
          diaFin: 7,
          semanaFin: weekEnd,
          exercises: [...defaultExercises],
          multiplicadorGeneral: '',
          modoMultiplicadorSimple: false
        });
        
        // Update start week for next period
        currentWeekStart = weekEnd + 1;
      });
      
      console.log('Converted periodos:', convertedPeriodos);
      // Use setTimeout to prevent immediate form submission
      setTimeout(() => {
        onChange(convertedPeriodos);
        setInitialSetupComplete(true);
      }, 0);
      return;
    }
    
    // Only initialize if we have totalSemanas and either no periods or incorrect number of periods
    if ((!periodos || periodos.length === 0)) {
      console.log('Creating initial periods with:', { totalSemanas, numPeriodos });
      
      // Create initial periods with even distribution of weeks
      const initialPeriodos: Periodo[] = [];
      
      // Use the numPeriodos prop if available, otherwise default to 2
      const periodsToCreate = numPeriodos || 2;
      console.log('Will create this many periods:', periodsToCreate);
      
      // Calculate weeks per period (distribute evenly)
      const weeksPerPeriod = Math.floor(totalSemanas / periodsToCreate);
      const remainderWeeks = totalSemanas % periodsToCreate;
      
      let currentWeekStart = 1;
      
      for (let i = 0; i < periodsToCreate; i++) {
        // Add extra week from remainder if needed
        const periodWeeks = weeksPerPeriod + (i < remainderWeeks ? 1 : 0);
        const weekEnd = Math.min(currentWeekStart + periodWeeks - 1, totalSemanas);
        
        initialPeriodos.push({
          nombre: `Periodo ${i + 1}`,
          diaInicio: 1,
          semanaInicio: currentWeekStart,
          diaFin: 7,
          semanaFin: weekEnd,
          exercises: [...defaultExercises],
          multiplicadorGeneral: '',
          modoMultiplicadorSimple: false
        });
        
        // Update start week for next period
        currentWeekStart = weekEnd + 1;
      }
      
      console.log('Created initial periods:', initialPeriodos);
      // Use setTimeout to prevent immediate form submission
      setTimeout(() => {
        onChange(initialPeriodos);
        setInitialSetupComplete(true);
      }, 0);
    }
  }, [totalSemanas, numPeriodos, onChange, periodos, initialSetupComplete]);
    console.log('Before calcularSemanasAsignadas, periodos:', periodos);
  
  const calcularSemanasAsignadas = () => {
    // Safety check to prevent errors if periodos is undefined
    if (!periodos || !Array.isArray(periodos)) {
      console.log('calcularSemanasAsignadas: periodos is not an array', periodos);
      return 0;
    }
    
    // Check if we're using the old format with 'semanas'
    if (periodos.length > 0 && 'semanas' in periodos[0]) {
      let totalSemanas = 0;
      periodos.forEach((periodo: any) => {
        totalSemanas += periodo.semanas || 0;
      });
      return totalSemanas;
    }
    
    // Otherwise use the new format with semanaInicio/semanaFin
    let diasTotales = 0;
    periodos.forEach(periodo => {
      if (periodo.semanaInicio && periodo.semanaFin) {
        const diasInicio = (periodo.semanaInicio - 1) * 7 + periodo.diaInicio;
        const diasFin = (periodo.semanaFin - 1) * 7 + periodo.diaFin;
        if (diasFin >= diasInicio) {
          diasTotales += (diasFin - diasInicio) + 1;
        }
      }
    });
    return Math.ceil(diasTotales / 7);
  };
  const semanasAsignadas = calcularSemanasAsignadas();
  const semanasDisponibles = totalSemanas - semanasAsignadas;
  
  console.log('Calculated values:', { semanasAsignadas, semanasDisponibles });
  
  // Add console log before rendering
  console.log('Before rendering, periodos:', periodos);
  // Define all handler functions before using them
  const handleAddPeriodo = () => {
    if (semanasDisponibles <= 0) return;
    
    // Find the last assigned week
    let lastAssignedWeek = 0;
    periodos.forEach(periodo => {
      if (periodo.semanaFin > lastAssignedWeek) {
        lastAssignedWeek = periodo.semanaFin;
      }
    });
    
    // Start the new period after the last assigned week
    const startWeek = Math.min(lastAssignedWeek + 1, totalSemanas);
    const endWeek = Math.min(startWeek, totalSemanas);
    
    const nuevoPeriodo: Periodo = {
      nombre: `Periodo ${periodos.length + 1}`,
      diaInicio: 1,
      semanaInicio: startWeek,
      diaFin: 7,
      semanaFin: endWeek,
      exercises: [...defaultExercises],
      multiplicadorGeneral: '',
      modoMultiplicadorSimple: false
    };
    
    onChange([...periodos, nuevoPeriodo]);
  };

  const handleRemovePeriodo = (index: number) => {
    const nuevosPeriodos = [...periodos];
    nuevosPeriodos.splice(index, 1);
    
    // Rename remaining periods to maintain sequential numbering
    nuevosPeriodos.forEach((periodo, idx) => {
      periodo.nombre = `Periodo ${idx + 1}`;
    });
    
    onChange(nuevosPeriodos);
  };

  const handleUpdatePeriodo = (index: number, field: keyof Periodo, value: string | number) => {
    const nuevosPeriodos = [...periodos];
    nuevosPeriodos[index] = {
      ...nuevosPeriodos[index],
      [field]: value,
    };
    
    // Validate date ranges
    if (field === 'semanaInicio' || field === 'diaInicio') {
      const periodo = nuevosPeriodos[index];
      // Ensure end date is not before start date
      const startDay = (periodo.semanaInicio - 1) * 7 + periodo.diaInicio;
      const endDay = (periodo.semanaFin - 1) * 7 + periodo.diaFin;
      
      if (endDay < startDay) {
        // Adjust end date to match start date
        periodo.semanaFin = periodo.semanaInicio;
        periodo.diaFin = periodo.diaInicio;
      }
    } else if (field === 'semanaFin' || field === 'diaFin') {
      const periodo = nuevosPeriodos[index];
      // Ensure start date is not after end date
      const startDay = (periodo.semanaInicio - 1) * 7 + periodo.diaInicio;
      const endDay = (periodo.semanaFin - 1) * 7 + periodo.diaFin;
      
      if (startDay > endDay) {
        // Adjust start date to match end date
        periodo.semanaInicio = periodo.semanaFin;
        periodo.diaInicio = periodo.diaFin;
      }
    }
    
    onChange(nuevosPeriodos);
  };

  const handleUpdateExerciseMultiplier = (periodoIndex: number, exerciseIndex: number, value: string) => {
    const nuevosPeriodos = [...periodos];
    nuevosPeriodos[periodoIndex].exercises[exerciseIndex].multiplier = value;
    onChange(nuevosPeriodos);
  };

  const handleToggleModoMultiplicador = (periodoIndex?: number) => {
    setModoMultiplicadorSimple(prev => !prev);
  };
  
  const handleToggleModoReglaUnica = () => {
    setModoReglaUnica(prev => !prev);
  };
  
  const handleUpdateMultiplicadorGeneral = (periodoIndex: number, value: string) => {
    const nuevosPeriodos = [...periodos];
    nuevosPeriodos[periodoIndex].multiplicadorGeneral = value;
    onChange(nuevosPeriodos);
  };

  // Convertir periodos al formato que espera WeekGrid
  const convertirPeriodosAWeekGridFormat = () => {
    return periodos.map(periodo => {
      const start = (periodo.semanaInicio - 1) * 7 + periodo.diaInicio;
      const end = (periodo.semanaFin - 1) * 7 + periodo.diaFin;
      return {
        start,
        end,
        name: periodo.nombre
      };
    });
  };

  // Generar dias para el WeekGrid
  const generarDias = () => {
    const dias = [];
    for (let i = 1; i <= totalSemanas * 7; i++) {
      dias.push({
        id: `day-${i}`,
        dayNumber: i
      });
    }
    return dias;
  };

  // Manejar la selección de un dia en el WeekGrid
  const handleWeekSelect = (dayNumber: number) => {
    if (!selectionStart) {
      setSelectionStart(dayNumber);
    } else {
      // Crear un nuevo periodo
      const start = Math.min(selectionStart, dayNumber);
      const end = Math.max(selectionStart, dayNumber);
      
      const startSemana = Math.ceil(start / 7);
      const startDia = ((start - 1) % 7) + 1;
      const endSemana = Math.ceil(end / 7);
      const endDia = ((end - 1) % 7) + 1;
      
      const nuevoPeriodo: Periodo = {
        nombre: `Periodo ${periodos.length + 1}`,
        diaInicio: startDia,
        semanaInicio: startSemana,
        diaFin: endDia,
        semanaFin: endSemana,
        exercises: [...defaultExercises],
        multiplicadorGeneral: '',
        modoMultiplicadorSimple: false
      };
      
      onChange([...periodos, nuevoPeriodo]);
      setSelectionStart(null);
    }
  };

  // Obtener el rango de previsualización
  const getPreviewRange = () => {
    if (!selectionStart || !hoveredWeek) return null;
    
    return {
      start: Math.min(selectionStart, hoveredWeek),
      end: Math.max(selectionStart, hoveredWeek),
      name: 'Nuevo periodo'
    };
  };

  // Add state to track which periods are expanded
  const [expandedPeriods, setExpandedPeriods] = useState<Record<number, boolean>>({});
  
  // Toggle period expansion
  const togglePeriodExpansion = (periodoIndex: number) => {
    setExpandedPeriods(prev => ({
      ...prev,
      [periodoIndex]: !prev[periodoIndex]
    }));
  };
  
  return (
    <div className={`space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 ${mostrarInfoCliente ? 'flex flex-col md:flex-row gap-6' : ''}`}>
      {/* Client info sidebar - only shown when mostrarInfoCliente is true */}
      {mostrarInfoCliente && (
                <ClientInfoPeriodosClientes 
                clienteInfo={clienteInfo} 
                onClose={() => setMostrarInfoCliente(false)} 
              />
      
      )}
      
      {/* Main content - adjust width based on sidebar visibility */}
      <div className={`${mostrarInfoCliente ? 'w-full md:w-3/4' : 'w-full'}`}>
        {/* Header and controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-bold text-gray-800 dark:text-white">Periodos de Planificación</h4>
            <button
              type="button"
              onClick={() => setMostrarInfoCliente(!mostrarInfoCliente)}
              className={`flex items-center gap-1 px-2 py-1.5 text-gray-700 hover:text-blue-600 bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors ${mostrarInfoCliente ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300' : ''}`}
              aria-label="Mostrar información del cliente"
              title="Ver información del cliente"
            >
              <User className="w-4 h-4" />
              <span className="text-xs font-medium">Info Cliente</span>
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <span className="text-sm font-medium px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
              {semanasAsignadas}/{totalSemanas} semanas asignadas
            </span>
            
            {/* Add period button */}
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddPeriodo}
              disabled={semanasDisponibles <= 0}
              className="flex items-center text-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Añadir Periodo
            </Button>
          </div>
        </div>

        {/* Guia explicativa sobre periodos */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
            <Info className="w-5 h-5 mr-2" /> 
            Guia de Periodos de Planificación
          </h5>
          <div className="text-sm text-blue-600 dark:text-blue-200 space-y-2">
            <p>
              <strong>i¿Qué son los periodos?</strong> Los periodos son fases especificas de entrenamiento dentro de tu planificación. 
              Cada periodo puede tener diferentes objetivos y cargas de entrenamiento.
            </p>
            <p>
              <strong>i¿Cómo funcionan?</strong> Basado en el mesociclo que definiste en el paso anterior, hemos creado {numPeriodos} periodos 
              distribuidos a lo largo de las {totalSemanas} semanas de tu planificación.
            </p>
            <p>
              <strong>Multiplicadores:</strong> Para cada ejercicio, puedes definir un multiplicador que ajustará la carga de entrenamiento 
              basada en el RM del cliente. Por ejemplo, un multiplicador de 0.8 significa que el cliente trabajará al 80% de su RM.
            </p>
            <p>
              <strong>Modo simple:</strong> Si activas el modo simple, podrás definir un único multiplicador para todos los ejercicios del periodo.
            </p>
          </div>
        </div>

        {/* Calendar view */}
        {mostrarCalendario && (
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl border border-gray-100 dark:border-gray-700 mb-6">
            {/* Calendar component */}
          </div>
        )}

        {/* Empty state */}
        {periodos.length === 0 ? (
          <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
            <Dumbbell className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
            <h5 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No hay periodos configurados</h5>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Los periodos te permiten dividir tu planificación en fases con diferentes objetivos y cargas.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleAddPeriodo}
              className="flex items-center mx-auto"
            >
              <Plus className="w-4 h-4 mr-1" /> AÃ±adir Primer Periodo
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Two-column grid for periods */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {periodos && periodos.length > 0 ? (
                periodos.map((periodo: any, periodoIndex: number) => {
                  // Check if we're using the old format with 'semanas'
                  const isOldFormat = 'semanas' in periodo;
                  
                  return (
                    <div key={periodoIndex} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden transition-all hover:shadow-md">
                      {/* Period header */}
                      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                        <h5 className="font-semibold text-gray-800 dark:text-white flex items-center">
                          <span className="flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs mr-2">
                            {periodoIndex + 1}
                          </span>
                          <input
                            type="text"
                            value={periodo.nombre}
                            onChange={(e) => handleUpdatePeriodo(periodoIndex, 'nombre', e.target.value)}
                            className="bg-transparent border-none focus:ring-0 p-0 font-semibold text-gray-800 dark:text-white"
                            placeholder="Nombre del periodo"
                            aria-label="Nombre del periodo"
                          />
                        </h5>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => togglePeriodExpansion(periodoIndex)}
                            className="p-1.5 text-gray-500 hover:text-blue-500 bg-white dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors"
                            aria-label={expandedPeriods[periodoIndex] ? "Contraer periodo" : "Expandir periodo"}
                          >
                            {expandedPeriods[periodoIndex] ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePeriodo(periodoIndex)}
                            className="p-1.5 text-gray-500 hover:text-red-500 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                            aria-label="Eliminar periodo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Period content - only show if expanded */}
                      {(expandedPeriods[periodoIndex] !== false) && (
                        <div className="p-4">
                          {/* Explicación del periodo */}
                          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                            <p>
                              <strong>Objetivo:</strong> Define las semanas que abarca este periodo y los multiplicadores para cada ejercicio.
                              Estos multiplicadores determinarán la intensidad del entrenamiento en relación al RM del cliente.
                            </p>
                          </div>
                          
                          {/* Period dates */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Semana de inicio
                              </label>
                              <input
                                type="number"
                                value={isOldFormat ? periodoIndex * periodo.semanas + 1 : periodo.semanaInicio}
                                onChange={(e) => handleUpdatePeriodo(periodoIndex, 'semanaInicio', parseInt(e.target.value))}
                                min={1}
                                max={totalSemanas}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Semana en la que comienza este periodo</span>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Semana de fin
                              </label>
                              <input
                                type="number"
                                value={isOldFormat ? (periodoIndex + 1) * periodo.semanas : periodo.semanaFin}
                                onChange={(e) => handleUpdatePeriodo(periodoIndex, 'semanaFin', parseInt(e.target.value))}
                                min={1}
                                max={totalSemanas}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              />
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">Semana en la que termina este periodo</span>
                            </div>
                          </div>
                          
                          {/* Exercise multipliers */}
                          {!isOldFormat && periodo.exercises && (
                            <div className="mt-4">
                              <div className="mb-3">
                                <h6 className="font-medium text-gray-800 dark:text-white mb-1">Multiplicadores de Ejercicios</h6>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Define la intensidad de cada ejercicio como porcentaje del RM. Por ejemplo, 0.8 = 80% del RM.
                                </p>
                              </div>
                              
                              {/* Explicación detallada de multiplicadores */}
                              <div className="mb-4 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                                <h6 className="font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center">
                                  <HelpCircle className="w-4 h-4 mr-1 text-blue-500 dark:text-blue-300" /> 
                                  i¿Cómo funcionan los multiplicadores?
                                </h6>
                                <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
                                  <li className="flex items-start">
                                    <span className="text-blue-500 dark:text-blue-300 mr-1.5">•</span>
                                    <span><strong>Propósito:</strong> Los multiplicadores determinan qué porcentaje del RM (Repetición Máxima) utilizará el cliente en cada ejercicio durante este periodo.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-blue-500 dark:text-blue-300 mr-1.5">•</span>
                                    <span><strong>Formato:</strong> Usa valores decimales entre 0 y 1. Por ejemplo, 0.7 significa que el cliente trabajará al 70% de su RM.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-blue-500 dark:text-blue-300 mr-1.5">•</span>
                                    <span><strong>Progresión:</strong> Tipicamente, los periodos iniciales usan multiplicadores más bajos (0.6-0.7) para adaptación, mientras que los periodos avanzados usan valores más altos (0.8-0.9) para intensidad.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-blue-500 dark:text-blue-300 mr-1.5">•</span>
                                    <span><strong>Modo simple:</strong> Activa esta opción para aplicar un único multiplicador a todos los ejercicios, ideal para periodos con intensidad uniforme.</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="text-blue-500 dark:text-blue-300 mr-1.5">•</span>
                                    <span><strong>Ejemplo práctico:</strong> Si el RM de Press Banca del cliente es 100kg y el multiplicador es 0.75, trabajará con 75kg durante este periodo.</span>
                                  </li>
                                </ul>
                              </div>
                              
                              <MultiplicadoresEjercicios
                                exercises={periodo.exercises}
                                onUpdateMultiplier={(exerciseIndex, value) => 
                                  handleUpdateExerciseMultiplier(periodoIndex, exerciseIndex, value)
                                }
                                onToggleModoReglaUnica={handleToggleModoReglaUnica}
                                modoMultiplicadorSimple={modoMultiplicadorSimple}
                                onToggleModoMultiplicador={handleToggleModoMultiplicador}
                                modoReglaUnica={modoReglaUnica}
                                modoSimple={periodo.modoMultiplicadorSimple}
                                onToggleModoSimple={() => handleToggleModoMultiplicador(periodoIndex)}
                                multiplicadorGeneral={periodo.multiplicadorGeneral || ''}
                                onUpdateMultiplicadorGeneral={(value) => 
                                  handleUpdateMultiplicadorGeneral(periodoIndex, value)
                                }
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No hay periodos configurados.</p>
                </div>
              )}
            </div>
            
            {/* Resumen de la planificación */}
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mt-6">
              <h5 className="font-semibold text-gray-800 dark:text-white mb-2">Resumen de la Planificación</h5>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Total de semanas: <span className="font-medium">{totalSemanas}</span></li>
                <li>• Periodos configurados: <span className="font-medium">{periodos.length}</span></li>
                <li>• Semanas asignadas: <span className="font-medium">{semanasAsignadas}</span></li>
                <li>• Semanas sin asignar: <span className="font-medium">{semanasDisponibles}</span></li>
              </ul>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Asegúrate de que todas las semanas estén asignadas a algún periodo antes de crear la planificación.
              </p>
            </div>
            
            {/* Add "Crear Planificación" button at the bottom */}
            <div className="flex justify-center mt-8">
              <Button 
                variant="primary" 
                size="lg"
                className="w-full sm:w-auto"
              >
                Crear Planificación
              </Button>
            </div>
          </div>
        )}
        
        {/* Add "Crear Planificación" button at the very bottom of the component */}
        {periodos.length === 0 && (
          <div className="flex justify-center mt-8">
            <Button 
              variant="primary" 
              size="lg"
              className="w-full sm:w-auto"
            >
              Crear Planificación
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrearPlanificacionPeriodos;
