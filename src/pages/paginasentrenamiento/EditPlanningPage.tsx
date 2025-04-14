import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Planning, WeekPlan, DayPlan, Session } from '../types/planning';
import { planningService } from '../../services/planningService';
import EditPlanningPageCalendario from '../../components/Planning/EditPlanningPageCalendario';
import VistaSimplificada from '../../components/Planning/vistasplanning/VistaSimplificada';
import VistaCompleja from '../../components/Planning/vistasplanning/VistaCompleja';
import VistaExcel from '../../components/Planning/vistasplanning/VistaExcel';
import VistaResumen from '../../components/Planning/vistasplanning/VistaResumen';
import VistaEjerciciosDetallados from '../../components/Planning/vistasplanning/VistaEjerciciosDetallados';
import VistaProgreso from '../../components/Planning/vistasplanning/VistaProgreso';
import VistaEstadisticas from '../../components/Planning/vistasplanning/VistaEstadisticas';
import VistaNotas from '../../components/Planning/vistasplanning/VistaNotas';
import VistaRutinasPredefinidas from '../../../VistaRutinasPredefinidas';
import VistaConfiguracion from '../../components/Planning/vistasplanning/VistaConfiguracion';
import Button from '../../components/Common/Button';
import PopupConfiguracionPlanning from '../../components/Planning/PopupConfiguracionPlanning';
import {
  Grid,
  List,
  Save,
  ArrowLeft,
  PieChart,
  Dumbbell,
  TrendingUp,
  BarChart2,
  FileText,
  Library,
  Settings,
  X,
  Layout,
  LineChart,
  ClipboardList,
  Table,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Importar React-JoyRide
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const EditPlanningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [planning, setPlanning] = useState<Planning | null>(null);
  const [semanaActual, setSemanaActual] = useState(1);
  const [planSemanal, setPlanSemanal] = useState<{ [key: string]: DayPlan } | null>(null);
  const [vistaActual, setVistaActual] = useState<
    | 'simplificada'
    | 'compleja'
    | 'excel'
    | 'resumen'
    | 'ejercicios'
    | 'progreso'
    | 'estadisticas'
    | 'notas'
    | 'rutinas'
    | 'configuracion'
  >('simplificada');
  const [showConfig, setShowConfig] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCommandAssisterOpen, setIsCommandAssisterOpen] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  const [viewsCollapsed, setViewsCollapsed] = useState(false);

  // Estados para el tour guiado
  const [runTour, setRunTour] = useState(false);
  const [tourSteps, setTourSteps] = useState<Step[]>([]);

  const isHomeRoute = location.pathname === '/';

  // Configuración de los pasos del tour
  useEffect(() => {
    setTourSteps([
      {
        target: '#vista-selector',
        content: 'Bienvenido al editor de planificación. Aquí podrás gestionar todos los aspectos de tu plan de entrenamiento.',
        disableBeacon: true,
        placement: 'center',
      },
      // Vistas Principales - Explicación individual
      {
        target: '#vista-selector > div > div:nth-child(1) .space-y-3 > button:nth-child(1)',
        content: 'Vista Simplificada: Muestra tu planificación de forma sencilla y fácil de entender, ideal para una visión general rápida.',
        placement: 'bottom',
      },
      {
        target: '#vista-selector > div > div:nth-child(1) .space-y-3 > button:nth-child(2)',
        content: 'Vista Compleja: Ofrece una visualización detallada de tu planificación con más opciones de personalización y edición.',
        placement: 'bottom',
      },
      {
        target: '#vista-selector > div > div:nth-child(1) .space-y-3 > button:nth-child(3)',
        content: 'Vista Excel: Presenta tu planificación en formato de hoja de cálculo, permitiendo una organización tabular de tus entrenamientos.',
        placement: 'bottom',
      },
      
      // Análisis y Seguimiento - Explicación individual
      {
        target: '#vista-selector > div > div:nth-child(2) .space-y-3 > button:nth-child(1)',
        content: 'Ejercicios: Accede a información detallada sobre cada ejercicio incluido en tu planificación.',
        placement: 'bottom',
      },
      {
        target: '#vista-selector > div > div:nth-child(2) .space-y-3 > button:nth-child(2)',
        content: 'Rutinas: Explora y utiliza rutinas predefinidas que puedes incorporar a tu planificación actual.',
        placement: 'bottom',
      },
      {
        target: '#vista-selector > div > div:nth-child(2) .space-y-3 > button:nth-child(3)',
        content: 'Fórmulas: Consulta estadísticas y fórmulas relacionadas con tu entrenamiento para un análisis más profundo.',
        placement: 'bottom',
      },
      
      // Gestión y Recursos - Explicación individual
      {
        target: '#vista-selector > div > div:nth-child(3) .space-y-3 > button:nth-child(1)',
        content: 'RMS (Repetición Máxima): Realiza un seguimiento de tu progreso de fuerza con el cálculo de repetición máxima.',
        placement: 'bottom',
      },
      {
        target: '#vista-selector > div > div:nth-child(3) .space-y-3 > button:nth-child(2)',
        content: 'Notas: Añade y gestiona notas personales relacionadas con tu planificación de entrenamiento.',
        placement: 'bottom',
      },
      {
        target: '#vista-selector > div > div:nth-child(3) .space-y-3 > button:nth-child(3)',
        content: 'Resumen: Visualiza un resumen completo de tu planificación para tener una visión general de tu progreso.',
        placement: 'bottom',
      },
      
      // Navegación y configuración
      {
        target: '#week-navigation',
        content: 'Aquí puedes navegar entre las diferentes semanas de tu planificación y añadir nuevas semanas cuando lo necesites.',
        placement: 'top',
      },
      {
        target: '.flex.items-center.space-x-4 > button:last-child',
        content: 'Desde la configuración puedes personalizar todos los aspectos de tu planificación, como objetivos, métricas y preferencias visuales.',
        placement: 'left',
      },
    ]);
  }, []);

  // Manejador de eventos del tour
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
    }
  };

  // Fix for the useEffect hook with missing initializer
  useEffect(() => {
    const handleCommandAssisterChange = (event: CustomEvent) => {
      setIsCommandAssisterOpen(event.detail.isOpen);
    };

    window.addEventListener('commandAssisterStateChange', handleCommandAssisterChange as EventListener);
    return () => {
      window.removeEventListener('commandAssisterStateChange', handleCommandAssisterChange as EventListener);
    };
  }, []);

  const fetchPlanning = async (force: boolean = false) => {
    if (!id) return;
    
    if (force) {
      setLoading(true);
    }
  
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
  
    const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/plannings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      // Add cache busting parameter to prevent browser caching
      cache: 'no-store',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al obtener la planificación');
    }
  
    const data: Planning = await response.json();
    setPlanning(data);
    if (data.plan && data.plan[semanaActual - 1]) {
      setPlanSemanal(data.plan[semanaActual - 1].days);
    } else {
      setPlanSemanal(null);
    }
  } catch (err: any) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchPlanning();
}, [id, semanaActual]);

useEffect(() => {
  if (planning && planning.plan && planning.plan[semanaActual - 1]) {
    setPlanSemanal(planning.plan[semanaActual - 1].days);
  } else {
    setPlanSemanal(null);
  }
}, [semanaActual, planning]);

useEffect(() => {
  const handleViewChange = (event: CustomEvent) => {
    const { view } = event.detail;
    setVistaActual(view);
  };

  window.addEventListener('changeView', handleViewChange as EventListener);

  return () => {
    window.removeEventListener('changeView', handleViewChange as EventListener);
  };
}, []);

const handleAddWeek = async () => {
  if (!planning) return;
  
  try {
    const newWeek = await planningService.addWeekToPlan(planning._id);
    
    // Actualizar el estado local con la nueva semana
    setPlanning(prev => {
      if (!prev) return null;
      return {
        ...prev,
        plan: [...prev.plan, newWeek]
      };
    });
  
    // Cambiar a la nueva semana
    setSemanaActual(newWeek.weekNumber);
  } catch (error) {
    console.error('Error al añadir nueva semana:', error);
  }
};

const savePlanning = async (updatedPlanning: Planning) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
  
    const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/plannings/${updatedPlanning._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPlanning),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || 'Error al guardar la planificación');
    }
  
    const updatedPlanning: Planning = await response.json();
    setPlanning(updatedPlanning);
  } catch (error) {
    console.error('Error al guardar el planning:', error);
  }
};

const updatePlan = (updatedDays: { [key: string]: DayPlan }) => {
  if (planning && planning.plan) {
    const updatedPlanning = { ...planning };
    if (!updatedPlanning.plan[semanaActual - 1]) {
      updatedPlanning.plan[semanaActual - 1] = {
        weekNumber: semanaActual,
        days: {}
      };
    }
    
    updatedPlanning.plan[semanaActual - 1].days = updatedDays;
    updatedPlanning.updatedAt = new Date().toISOString();
  
    setPlanning(updatedPlanning);
    setPlanSemanal(updatedDays);
    setLastUpdate(Date.now()); // Add this line to trigger re-renders
    
    // Guardar en el backend
    savePlanning(updatedPlanning);
  } else {
    console.error('Error al actualizar plan:', {
      hasPlanning: !!planning,
      hasPlanArray: !!(planning?.plan),
      currentWeek: semanaActual
    });
  }
};

const handleSaveChanges = async () => {
  if (!planning) return;

  try {
    // Obtener el token JWT
    const token = localStorage.getItem('token'); // Asegúrate de que el token esté almacenado correctamente
  
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }
  
    const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/plannings/${planning._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // Incluir el token en los headers
      },
      body: JSON.stringify(planning),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error Data:', errorData);
      throw new Error(errorData.mensaje || 'Error al actualizar la planificación');
    }
  
    const updatedPlanning: Planning = await response.json();
    setPlanning(updatedPlanning);
    alert('Planificación actualizada exitosamente.');
  } catch (err: any) {
    console.error('Error al actualizar la planificación:', err);
    alert(`Error: ${err.message}`);
  }
};
const handleVistaChange = (newVista: typeof vistaActual) => {
  // If switching between simplificada and compleja, refresh data
  if ((vistaActual === 'simplificada' && newVista === 'compleja') || 
      (vistaActual === 'compleja' && newVista === 'simplificada')) {
    fetchPlanning(true);
  }
  setVistaActual(newVista);
};
const renderVistaActual = () => {
  if (!planSemanal) return null;

  const props = {
    semanaActual,
    planSemanal,
    updatePlan,
  };

  switch (vistaActual) {
    case 'simplificada':
      return <VistaSimplificada {...props} planningId={id} />;
    case 'compleja':
      return (
        <VistaCompleja
          semanaActual={semanaActual}
          planSemanal={planSemanal}
          updatePlan={updatePlan}
          onReload={fetchPlanning}
          planningId={id || ''}
          weekId={planning?.plan?.[semanaActual - 1]?._id} // Pass the actual week ID from the planning data
        />
      );
    case 'excel':
      return <VistaExcel 
        {...props} 
        planningId={id} 
        semanaActual={semanaActual}
      />;
    case 'resumen':
      return <VistaResumen {...props} />;
    case 'progreso':
      return <VistaProgreso 
        planSemanal={planSemanal} 
        clientId={planning?.clientId} 
        planningId={planning?._id}
      />;
    case 'estadisticas':
                  return (
        <VistaEstadisticas
          planningId={planning?._id}
          numberOfWeeks={planning?.semanas || 4}
          plan={planning?.plan || []}
          existingPeriods={planning?.periodos || []}
          onPeriodsChange={(newPeriods) => {
            if (planning) {
              const updatedPlanning = {
                ...planning,
                periodos: newPeriods
              };
              setPlanning(updatedPlanning);
              // Aquí puedes agregar la lógica para guardar en la base de datos
            }
          }}
          planning={planning} // Añadimos la planificación completa
        />
      );
    case 'ejercicios':
      return <VistaEjerciciosDetallados planSemanal={planSemanal} semanaActual={semanaActual} />;
    case 'notas':
      return <VistaNotas planningId={id} />;
    case 'rutinas':
      return <VistaRutinasPredefinidas 
        {...props} 
        planning={planning} 
        planningId={id || ''} 
        onReload={fetchPlanning}
      />;
    case 'configuracion':
      return (
        <VistaConfiguracion planning={planning} setPlanning={setPlanning} />
      );
    default:
      return null;
  }
};

const buttonSections = [
  {
    title: 'Vistas Principales',
    icon: Layout,
    buttons: [
      { icon: List, label: 'Simplificada', value: 'simplificada' },
      { icon: Grid, label: 'Compleja', value: 'compleja' },
      { icon: Table, label: 'Excel', value: 'excel' },
    ],
  },
  {
    title: 'Análisis y Seguimiento',
    icon: LineChart,
    buttons: [
      { icon: Dumbbell, label: 'Ejercicios', value: 'ejercicios' },
      { icon: Library, label: 'Rutinas', value: 'rutinas' },

      { icon: BarChart2, label: 'Formulas', value: 'estadisticas' },
    ],
  },
  {
    title: 'Gestión y Recursos',
    icon: ClipboardList,
    buttons: [
      { icon: TrendingUp, label: 'RMS', value: 'progreso' },
      { icon: FileText, label: 'Notas', value: 'notas' },
      { icon: PieChart, label: 'Resumen', value: 'resumen' },

    ],
  },
];

// Fix the indentation and structure of the if/return statements
if (loading) {
  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-center items-center h-full">
        <p>Cargando planificación...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className={`p-6 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
      <div className="flex justify-center items-center h-full">
        <p className="text-red-500">Error: {error}</p>
      </div>
    </div>
  );
}

return (
  <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
    {/* Tour de React-JoyRide */}
    <Joyride
      steps={tourSteps}
      run={runTour}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      scrollToFirstStep={false}
      disableScrolling={true}
      styles={{
        options: {
          primaryColor: theme === 'dark' ? '#6366f1' : '#4f46e5',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          textColor: theme === 'dark' ? '#f9fafb' : '#111827',
          arrowColor: theme === 'dark' ? '#1f2937' : '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        tooltip: {
          borderRadius: '8px',
          fontSize: '16px',
        },
        buttonNext: {
          backgroundColor: theme === 'dark' ? '#6366f1' : '#4f46e5',
          color: '#ffffff',
          fontSize: '14px',
          borderRadius: '4px',
          padding: '8px 16px',
        },
        buttonBack: {
          color: theme === 'dark' ? '#d1d5db' : '#4b5563',
          fontSize: '14px',
          marginRight: '8px',
        },
        buttonSkip: {
          color: theme === 'dark' ? '#d1d5db' : '#4b5563',
          fontSize: '14px',
        },
      }}
      locale={{
        back: 'Anterior',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar',
      }}
    />

    <div className={`transition-all duration-300 ${isCommandAssisterOpen ? 'ml-64' : 'ml-0'}`}>
      <div className="py-8 relative">
        <div className="flex justify-between items-center mb-8">
          <Button
            variant="danger"
            className="!bg-red-600 hover:!bg-red-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <div className="flex items-center space-x-4">
          <Button
              variant="normal"
              onClick={() => setRunTour(true)}
              className="flex items-center transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg font-semibold"
            >
              <LineChart className="w-5 h-5 mr-2" />
              Iniciar Tour
            </Button>
            <Button
              variant="normal"
              onClick={() => setShowConfig(true)}
              className="flex items-center transform hover:scale-105 transition-transform duration-300 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg font-semibold"
            >
              <Settings className="w-5 h-5 mr-2" />
              Configuración
            </Button>             
          </div>
        </div>
        <PopupConfiguracionPlanning
          planning={planning}
          setPlanning={setPlanning}
          onClose={() => setShowConfig(false)}
          isOpen={showConfig}
        />
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          {planning && (
            <>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                {planning.nombre}
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                {planning.descripcion}
              </p>
            </>
          )}
        </motion.div>

        {planning && planSemanal && (
          <>
            

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-12"
            >
              <div id="week-navigation">
                <EditPlanningPageCalendario
                  weeks={planning.plan || []}
                  semanaActual={semanaActual}
                  setSemanaActual={setSemanaActual}
                  onAddWeek={handleAddWeek}
                  planningId={planning._id}
                />
              </div>
            </motion.div>

            {/* Vistas de la planificación container */}
                     {/* Vistas de la planificación container */}
                     <div className="mb-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transition-all duration-300">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                    <Layout className="w-6 h-6 mr-2 text-blue-500" />
                    {viewsCollapsed ? 'Vistas de trabajo' : 'Vistas de la planificación'}
                  </h2>
                  <button 
                    onClick={() => setViewsCollapsed(!viewsCollapsed)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 hover:shadow-md"
                    aria-label={viewsCollapsed ? "Expandir vistas" : "Colapsar vistas"}
                  >
                    {viewsCollapsed ? (
                      <ArrowDown className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    ) : (
                      <ArrowUp className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    )}
                  </button>
                </div>
                
                <AnimatePresence>
                  {!viewsCollapsed && (
                    <motion.div 
                      id="vista-selector" 
                      className="mb-8"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {buttonSections.map((section, idx) => (
                          <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`p-6 rounded-xl ${
                              idx === 0 
                                ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-2 border-blue-200/50 dark:border-blue-500/30'
                                : theme === 'dark' ? 'bg-gray-700/80 border border-gray-600' : 'bg-gray-50 border border-gray-200'
                            } shadow-lg hover:shadow-xl transition-all duration-300`}
                          >
                            <div className="flex items-center space-x-3 mb-4">
                              <section.icon className={`w-5 h-5 ${idx === 0 ? 'text-blue-600 dark:text-blue-400' : 'text-blue-500 dark:text-blue-300'}`} />
                              <h3 className={`text-lg font-semibold ${idx === 0 ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                                {section.title}
                              </h3>
                            </div>
                            <div className="space-y-3">
                              {section.buttons.map(({ icon: Icon, label, value }) => (
                                <Button
                                  key={value}
                                  variant={idx === 0 ? 'mainView' : vistaActual === value ? 'create' : 'vistas'}
                                  onClick={() => handleVistaChange(value as typeof vistaActual)}                            
                                  className={`w-full justify-start transform transition-all duration-300 ${
                                    idx === 0 
                                      ? `hover:scale-105 py-3 ${
                                          vistaActual === value
                                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 shadow-md'
                                            : 'hover:bg-gradient-to-r hover:from-violet-500 hover:to-purple-500'
                                        }`
                                      : `hover:scale-102 ${
                                          vistaActual === value
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md'
                                            : ''
                                        }`
                                  }`}
                                >
                                  <Icon className={`w-5 h-5 mr-3 ${
                                    idx === 0 && !vistaActual.includes(value)
                                      ? 'text-violet-200'
                                      : ''
                                  }`} />
                                  <span className={`font-medium ${idx === 0 ? 'text-lg' : ''}`}>
                                    {label}
                                  </span>
                                </Button>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {viewsCollapsed && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-3 px-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-700/80 rounded-xl border border-blue-100 dark:border-gray-600"
                  >
                    <div className="flex flex-wrap gap-3 justify-center">
                      {buttonSections[0].buttons.map(({ icon: Icon, label, value }) => (
                        <Button
                          key={value}
                          variant={vistaActual === value ? 'create' : 'vistas'}
                          onClick={() => handleVistaChange(value as typeof vistaActual)}
                          className={`px-4 py-2.5 rounded-lg transform transition-all duration-300 ${
                            vistaActual === value 
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 shadow-md scale-105' 
                              : 'hover:scale-105 hover:shadow-md'
                          }`}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          <span className="font-medium">{label}</span>
                        </Button>
                      ))}
                    </div>
                    </motion.div>
                )}
              </div>
              
              {/* Content area for displaying the selected view */}
              <div className="mt-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={vistaActual}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {renderVistaActual()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
           
        </div>
      </div>
    </div>
  );
};

export default EditPlanningPage;