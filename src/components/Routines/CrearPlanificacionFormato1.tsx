
import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../Common/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { usePlanning } from '../../contexts/PlanningContext';
import CrearPlanificacionPeriodos from './CrearPlanificacionPeriodos';
import Paso1 from './Paso1';
import Paso2 from './Paso2';

interface CrearPlanificacionFormato1Props {
  onPlanningCreated?: () => void;
  onCancel?: () => void;
}

// Define an interface for exercise RM
interface ExerciseRM {
  name: string;
  rm: string;
}

// Define an interface for periods
interface Periodo {
  nombre: string;
  semanas: number;
  descripcion: string;
}

const CrearPlanificacionFormato1: React.FC<CrearPlanificacionFormato1Props> = ({
  onPlanningCreated,
  onCancel,
}) => {
  const { theme } = useTheme();
  const { addPlanning } = usePlanning();
  
  // Add state for multi-step form
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState(formatDate(new Date()));
  const [meta, setMeta] = useState('');
  const [otraMeta, setOtraMeta] = useState('');
  const [semanas, setSemanas] = useState(1);
  const [clienteId, setClienteId] = useState('');
  const [tipo, setTipo] = useState('Planificacion');
  const [macrociclo, setMacrociclo] = useState('1');
  const [mesociclo, setMesociclo] = useState('');
  // Removing microciclo state
  const [showClientInfo, setShowClientInfo] = useState(false);
  const [clientInfo, setClientInfo] = useState<any>(null);
  
  // Function to update semanas and automatically set macrociclo
  const handleSemanasChange = (value: number) => {
    setSemanas(value);
    setMacrociclo(value.toString());
  };
  
  // Function to validate mesociclo input and update periodos
  // Function to validate mesociclo input and update periodos
  const handleMesocicloChange = (value: string) => {
    const mesocicloNum = parseInt(value);
    const macrocicloNum = parseInt(macrociclo);
    
    // Only set the mesociclo if it's less than or equal to macrociclo
    if (!value || (mesocicloNum > 0 && mesocicloNum <= macrocicloNum)) {
      setMesociclo(value);
      
      // Update periodos based on mesociclo value
      if (mesocicloNum > 0) {
        // Calculate weeks per period (distribute evenly)
        const weeksPerPeriod = Math.floor(macrocicloNum / mesocicloNum);
        const remainderWeeks = macrocicloNum % mesocicloNum;
        
        // Create new array of periodos with even distribution
        const nuevoPeriodos = [];
        let currentWeekStart = 1;
        
        for (let i = 0; i < mesocicloNum; i++) {
          // Add extra week from remainder if needed
          const periodWeeks = weeksPerPeriod + (i < remainderWeeks ? 1 : 0);
          
          nuevoPeriodos.push({
            nombre: `Periodo ${i + 1}`,
            semanas: periodWeeks,
            descripcion: ''
          });
        }
        
        setPeriodos(nuevoPeriodos);
      }
    }
  };
  // Add state for exercise RMs with predefined exercises  // Add state for exercise RMs with predefined exercises
  const [exerciseRMs, setExerciseRMs] = useState<ExerciseRM[]>([
    { name: 'Press Banca', rm: '' },
    { name: 'Sentadilla', rm: '' },
    { name: 'Peso Muerto', rm: '' },
    { name: 'Peso Rumano', rm: '' },
    { name: 'Curl de Bíceps', rm: '' }
  ]);

  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to go to next step
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  const toggleClientInfo = async () => {
    if (!clienteId) {
      setShowClientInfo(false);
      return;
    }
    
    if (!showClientInfo && !clientInfo) {
      // Fetch client info if not already loaded
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes/${clienteId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setClientInfo(data);
        }
      } catch (err) {
        console.error('Error al obtener información del cliente:', err);
      }
    }
    
    setShowClientInfo(!showClientInfo);
  };
  // Function to go to previous step
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.mensaje || 'Error al obtener los clientes');
        }

        const data = await response.json();
        setClientes(data);
      } catch (err: any) {
        console.error('Error al obtener los clientes:', err);
        setError(err.message);
      }
    };

    fetchClientes();
  }, []);

  // Function to add a new exercise RM field
  const addExerciseRMField = () => {
    setExerciseRMs([...exerciseRMs, { name: '', rm: '' }]);
  };

  // Function to remove an exercise RM field
  const removeExerciseRMField = (index: number) => {
    const updatedExerciseRMs = [...exerciseRMs];
    updatedExerciseRMs.splice(index, 1);
    setExerciseRMs(updatedExerciseRMs);
  };

  // Function to update an exercise RM field
  const updateExerciseRM = (index: number, field: 'name' | 'rm', value: string) => {
    const updatedExerciseRMs = [...exerciseRMs];
    updatedExerciseRMs[index][field] = value;
    setExerciseRMs(updatedExerciseRMs);
  };

  const [periodos, setPeriodos] = useState<Periodo[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if this is a real submission from the submit button
    const nativeEvent = e.nativeEvent as SubmitEvent;
    const isRealSubmission = nativeEvent.submitter?.getAttribute('name') === 'submit-button';
    
    if (!isRealSubmission) {
      console.log('Preventing unintended form submission');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      let endpoint = 'https://fitoffice2-ff8035a9df10.herokuapp.com/api/plannings';
      let requestBody: any = {
        nombre,
        descripcion,
        meta: meta === 'Otra' ? otraMeta : meta,
        semanas,
      };


      if (tipo === 'Planificacion') {
        requestBody.fechaInicio = fechaInicio;
        requestBody.tipo = tipo;
        requestBody.clienteId = clienteId || null;
        
        // Añadir macrociclo y mesociclo al cuerpo de la solicitud (removed microciclo)
        if (macrociclo) requestBody.macrociclo = macrociclo;
        if (mesociclo) requestBody.mesociclo = mesociclo;
        
        // Add exercise RMs to request body if they exist and are valid
        const validExerciseRMs = exerciseRMs.filter(ex => ex.name.trim() !== '' && ex.rm.trim() !== '');
        if (validExerciseRMs.length > 0) {
          requestBody.exerciseRMs = validExerciseRMs;
        }
        
        // Add periods to request body if they exist
        if (periodos.length > 0) {
          requestBody.periodos = periodos;
        }
      } else {
        // Si es una plantilla, usar el endpoint específico para plantillas
        endpoint = 'https://fitoffice2-ff8035a9df10.herokuapp.com/api/planningtemplate/templates';
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Error al crear la planificación');
      }

      console.log('✅ Planificación creada exitosamente:', data);

      // Add the new planning to the context
      addPlanning({
        _id: data._id,
        nombre,
        descripcion,
        fechaInicio,
        meta: meta === 'Otra' ? otraMeta : meta,
        semanas,
        tipo: tipo as 'Planificacion' | 'Plantilla',
        esqueleto: data.esqueleto || null, // Use esqueleto from response if available
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      if (onPlanningCreated) {
        onPlanningCreated();
      }
    } catch (err: any) {
      console.error('Error al crear la planificación:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const animationStyles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-in-out;
  }
`;
  // Render step progress indicator
  const renderStepIndicator = () => {
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400' 
                    : 'bg-gray-300 dark:bg-gray-600'}`}
              >
                {step}
              </div>
              <span className="mt-2 text-sm font-medium">
                {step === 1 ? 'Información Básica' : 
                 step === 2 ? 'RM de Ejercicios' : 'Periodos'}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 w-full bg-gray-200 dark:bg-gray-700">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render step 1: Basic information
  const renderStep1 = () => {
    return (
      <>
        {/* Nombre Field */}
        <Paso1
      nombre={nombre}
      setNombre={setNombre}
      descripcion={descripcion}
      setDescripcion={setDescripcion}
      fechaInicio={fechaInicio}
      setFechaInicio={setFechaInicio}
      meta={meta}
      setMeta={setMeta}
      otraMeta={otraMeta}
      setOtraMeta={setOtraMeta}
      semanas={semanas}
      handleSemanasChange={handleSemanasChange}
      tipo={tipo}
      setTipo={setTipo}
      clienteId={clienteId}
      setClienteId={setClienteId}
      clientes={clientes}
    />

      </>
    );
  };

  // Render step 2: Exercise RM
  const renderStep2 = () => {
    if (tipo !== 'Planificacion') {
      // If not a planning, skip to step 3
      nextStep();
      return null;
    }
    
    return (
      <Paso2
      exerciseRMs={exerciseRMs}
      addExerciseRMField={addExerciseRMField}
      removeExerciseRMField={removeExerciseRMField}
      updateExerciseRM={updateExerciseRM}
      macrociclo={macrociclo}
      setMacrociclo={setMacrociclo}
      mesociclo={mesociclo}
      handleMesocicloChange={handleMesocicloChange}
    />

    );
  };

  // Render step 3: Periods
  const renderStep3 = () => {
    if (tipo !== 'Planificacion') {
      return (
        <div className="text-center py-8">
          <p className="text-lg">Las plantillas no requieren periodos de planificación.</p>
        </div>
      );
    }
    
    return (
      <div className="relative">
        {/* Client info sidebar button - Más visible */}
        {clienteId && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
            <button
              type="button"
              onClick={toggleClientInfo}
              className="flex items-center w-full justify-between text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Información del Cliente
              </span>
              {showClientInfo ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L10 8.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        )}
        
        {/* Contenido principal - Periodos */}
        <div className="w-full">
          {/* Prevent form submission by using a type="button" wrapper */}
          <div onClick={(e) => e.preventDefault()}>
            <CrearPlanificacionPeriodos
              totalSemanas={parseInt(macrociclo)} 
              periodos={periodos || []} 
              onChange={(newPeriodos) => {
                // Only update if the array is different to prevent infinite loops
                if (JSON.stringify(newPeriodos) !== JSON.stringify(periodos)) {
                  setPeriodos(newPeriodos);
                }
              }}
              numPeriodos={parseInt(mesociclo) || 2}
            />
          </div>
        </div>
      </div>
    );
  };
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
  };

  // Render navigation buttons
  const renderNavButtons = () => {
    return (
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              variant="secondary"
              type="button"
              onClick={prevStep}
              className="px-6 py-3"
            >
              Anterior
            </Button>
          )}
        </div>
        
        <div className="flex space-x-4">
          {onCancel && (
            <Button
              variant="secondary"
              type="button"
              onClick={onCancel}
              className="px-6 py-3"
            >
              Cancelar
            </Button>
          )}
          
          {/* For Plantilla: Show "Crear" button on step 1 */}
          {tipo !== 'Planificacion' && currentStep === 1 && (
            <Button
              variant="create"
              type="submit"
              name="submit-button"
              disabled={loading}
              className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-400 
                       hover:from-blue-700 hover:to-blue-500 rounded-lg transform transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creando...
                </span>
              ) : (
                'Crear'
              )}
            </Button>
          )}
          
          {/* For Planificacion: Show "Siguiente" button on steps 1 and 2, no button on step 3 */}
          {tipo === 'Planificacion' && currentStep < totalSteps && (
            <Button
              variant="primary"
              type="button"
              onClick={nextStep}
              className="px-6 py-3 text-white bg-gradient-to-r from-blue-600 to-blue-400 
                       hover:from-blue-700 hover:to-blue-500 rounded-lg transform transition-all"
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full  mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          {tipo === 'Planificacion' ? 'Crear Planificación' : 'Crear Plantilla'}
        </h3>
      </div>

      {/* Content */}
      <div className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {renderStepIndicator()}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStepContent()}
          {renderNavButtons()}
        </form>
      </div>
    </div>
  );
};

export default CrearPlanificacionFormato1;