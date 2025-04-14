import React, { useState, useEffect } from 'react';
import SidebarPanel from './SidebarPanel';
import FormatoVista from './FormatoVista';

interface VistaAlimentacionProps {
  dietData: any;
}

// Updated interfaces to match the schema
interface Ingrediente {
  nombre: string;
  peso: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

interface Macronutrientes {
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

interface Comida {
  numero: number;
  peso: number;
  nombre: string;
  horario: string;
  porcion: number;
  metodoPreparacion?: string;
  ingredientes: Ingrediente[];
  macronutrientes: Macronutrientes;
}

interface DiaResponse {
  dieta: {
    id: string;
    nombre: string;
    cliente: {
      id: string;
      nombre: string;
      email: string;
    };
    objetivo: string;
  };
  dia: {
    restricciones: Macronutrientes;
    totales: Macronutrientes;
    fecha: string;
    comidas: Comida[];
    _id: string;
  };
}

const VistaAlimentacion: React.FC<VistaAlimentacionProps> = ({ dietData }) => {
  // Estado para semanas y días
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedDay, setSelectedDay] = useState<string>("Lunes");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState<boolean>(false);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dayData, setDayData] = useState<DiaResponse | null>(null);
  
  // Datos de semanas y días
  const weeks = [1, 2, 3, 4];
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  
  // Estado para comida actual (inicialmente null)
  const [comida, setComida] = useState<Comida | null>(null);
  
  const [newIngrediente, setNewIngrediente] = useState<Ingrediente>({
    nombre: '',
    peso: 0,
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  // Estado para editar horario y método de preparación
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [comidaHorario, setComidaHorario] = useState<string>('');
  const [comidaPreparacion, setComidaPreparacion] = useState<string>('');
  const [comidaNombre, setComidaNombre] = useState<string>('');
  const [comidaPorcion, setComidaPorcion] = useState<number>(1);
  
  // Estado para el panel lateral
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'client' | 'recipe'>('client');
  // Add a new state to track when a recipe is added
  const [recipeAdded, setRecipeAdded] = useState(false);

  // Add a new state to store all comidas for the day
  const [comidas, setComidas] = useState<Comida[]>([]);
  
  // Fetch day data when selectedDate changes or when a new recipe is added
  useEffect(() => {
    const fetchDayData = async () => {
      // Extract diet ID from URL
      const url = window.location.pathname;
      const urlParts = url.split('/');
      const dietId = urlParts[urlParts.length - 1];
      
      console.log('Extracted diet ID from URL:', dietId);
      
      if (!dietId) {
        console.log('No diet ID available in URL, falling back to prop');
        if (!dietData?.id) {
          console.log('No diet ID available in props either, skipping fetch');
          return;
        }
      }
      
      // Use the ID from URL or fallback to the prop
      const effectiveDietId = dietId || dietData?.id;
      
      setIsLoading(true);
      try {
        // Format date to maintain the selected day regardless of timezone
        // Create a date string in YYYY-MM-DD format to avoid timezone issues
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;
        
        console.log('Fetching data for diet ID:', effectiveDietId);
        console.log('Formatted date for request:', formattedDate);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error('No authentication token found');
          return;
        }
        
        console.log('Request URL:', `https://fitoffice2-ff8035a9df10.herokuapp.com/api/dietas/${effectiveDietId}/dias/${formattedDate}`);
        console.log('Request headers:', {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.substring(0, 10)}...` // Only log part of the token for security
        });
        
        const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/dietas/${effectiveDietId}/dias/${formattedDate}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        console.log('Response status:', response.status);
        
        // Inside the useEffect function where the 404 response is handled
        if (response.status === 404) {
        // If the day is not found, clear the current data to show empty state
        console.log('No data found for this day');
        setDayData({
        dieta: {
        id: effectiveDietId,
        nombre: dayData?.dieta.nombre || '',
        cliente: dayData?.dieta.cliente || { id: '', nombre: '', email: '' },
        objetivo: dayData?.dieta.objetivo || ''
        },
        dia: {
        restricciones: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
        totales: { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 },
        fecha: formattedDate,
        comidas: [],
        _id: ''
        }
        });
        // Clear the current comida
        setComida(null);
        setComidaHorario('');
        setComidaPreparacion('');
        setComidaNombre('');
        setComidaPorcion(1);
        setComidas([]); // Make sure to clear the comidas array too
        setIsLoading(false);
        return;
        }
        
        if (!response.ok) {
          console.error('Response not OK:', response.statusText);
          throw new Error(`Error fetching day data: ${response.statusText}`);
        }
        
        const data: DiaResponse = await response.json();
        console.log('Received data:', data);
        setDayData(data);
        
        // Store all comidas in the state
        if (data.dia.comidas && data.dia.comidas.length > 0) {
          console.log('Setting comidas:', data.dia.comidas);
          // Ensure ingredientes is always an array for each comida
          const comidasWithIngredientes = data.dia.comidas.map(comida => ({
            ...comida,
            ingredientes: comida.ingredientes || []
          }));
          setComidas(comidasWithIngredientes);
          
          // Set the first comida as the current one
          setComida(comidasWithIngredientes[0]);
          setComidaHorario(comidasWithIngredientes[0].horario);
          setComidaPreparacion(comidasWithIngredientes[0].metodoPreparacion || '');
          setComidaNombre(comidasWithIngredientes[0].nombre);
          setComidaPorcion(comidasWithIngredientes[0].porcion);
        } else {
          // If there are no comidas in the response, clear the current comida
          console.log('No comidas found in response');
          setComidas([]);
          setComida(null);
          setComidaHorario('');
          setComidaPreparacion('');
          setComidaNombre('');
          setComidaPorcion(1);
        }
      } catch (error) {
        console.error('Error fetching day data:', error);
        // In case of error, clear the current data to avoid showing stale data
        setComida(null);
        setDayData(null);
      } finally {
        setIsLoading(false);
        // Reset the recipeAdded flag after fetching
        if (recipeAdded) {
          setRecipeAdded(false);
        }
      }
    };
    
    console.log('useEffect triggered with date:', selectedDate, 'recipeAdded:', recipeAdded);
    fetchDayData();
  }, [selectedDate, dietData?.id, recipeAdded]);
  // Funciones para manejar los selectores
  const toggleWeekSelector = () => {
    setIsWeekSelectorOpen(!isWeekSelectorOpen);
    if (isDaySelectorOpen) setIsDaySelectorOpen(false);
  };
  const handleRecipeAdded = (newRecipe: any) => {
    console.log('New recipe added:', newRecipe);
    
    // If the response contains a comida object, update the current comida
    if (newRecipe && newRecipe.comida) {
      const comidaData = newRecipe.comida;
      
      // Ensure ingredientes is always an array
      const comidaWithIngredientes = {
        ...comidaData,
        ingredientes: comidaData.ingredientes || []
      };
      
      // Update all the related states
      setComida(comidaWithIngredientes);
      setComidaHorario(comidaWithIngredientes.horario || '');
      setComidaPreparacion(comidaWithIngredientes.metodoPreparacion || '');
      setComidaNombre(comidaWithIngredientes.nombre || '');
      setComidaPorcion(comidaWithIngredientes.porcion || 1);
      
      // Trigger a refresh of the day data
      setRecipeAdded(true);
    }
  };
  const toggleDaySelector = () => {
    setIsDaySelectorOpen(!isDaySelectorOpen);
  };

  const handleWeekSelect = (week: number) => {
    setSelectedWeek(week);
    setIsWeekSelectorOpen(false);
    setIsDaySelectorOpen(true);
  };

  const handleDaySelect = (day: string, date: Date) => {
    setSelectedDay(day);
    setSelectedDate(date);
    setIsDaySelectorOpen(false);
  };

  // Función para calcular macronutrientes totales
  const calcularMacronutrientes = (ingredientes: Ingrediente[]): Macronutrientes => {
    return ingredientes.reduce((total, ingrediente) => {
      return {
        calorias: total.calorias + ingrediente.calorias,
        proteinas: total.proteinas + ingrediente.proteinas,
        carbohidratos: total.carbohidratos + ingrediente.carbohidratos,
        grasas: total.grasas + ingrediente.grasas
      };
    }, { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 });
  };

  const handleAddIngrediente = () => {
    if (newIngrediente.nombre.trim() === '' || !comida) return;
    
    // Ensure ingredientes is always an array
    const currentIngredientes = comida.ingredientes || [];
    const updatedIngredientes = [...currentIngredientes, {...newIngrediente}];
    const updatedMacronutrientes = calcularMacronutrientes(updatedIngredientes);
    
    setComida({
      ...comida,
      ingredientes: updatedIngredientes,
      macronutrientes: updatedMacronutrientes
    });
    
    setNewIngrediente({
      nombre: '',
      peso: 0,
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });
  };

  const handleDeleteIngrediente = (index: number) => {
    if (!comida) return;
    
    // Ensure ingredientes is always an array
    const currentIngredientes = comida.ingredientes || [];
    const updatedIngredientes = currentIngredientes.filter((_, i) => i !== index);
    const updatedMacronutrientes = calcularMacronutrientes(updatedIngredientes);
    
    setComida({
      ...comida,
      ingredientes: updatedIngredientes,
      macronutrientes: updatedMacronutrientes
    });
  };
  const startEditing = () => {
    if (!comida) return;
    
    setIsEditing(true);
    setComidaHorario(comida.horario);
    setComidaPreparacion(comida.metodoPreparacion || '');
    setComidaNombre(comida.nombre);
    setComidaPorcion(comida.porcion);
  };

  const saveComidaDetails = () => {
    if (!comida) return;
    
    setComida({
      ...comida,
      nombre: comidaNombre,
      horario: comidaHorario,
      porcion: comidaPorcion,
      metodoPreparacion: comidaPreparacion.trim() === '' ? undefined : comidaPreparacion
    });
    
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngrediente(prev => ({
      ...prev,
      [name]: name === 'nombre' ? value : Number(value)
    }));
  };


  return (
    <div className="mt-6 flex relative">
      {/* Contenido principal */}
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md flex-grow transition-all duration-300 ${sidebarOpen ? 'mr-80' : 'mr-0'}`}>
        {/* Selector de semana y día - Estilizado */}
        <FormatoVista 
          selectedWeek={selectedWeek}
          selectedDay={selectedDay}
          isWeekSelectorOpen={isWeekSelectorOpen}
          isDaySelectorOpen={isDaySelectorOpen}
          weeks={weeks}
          days={days}
          toggleWeekSelector={toggleWeekSelector}
          toggleDaySelector={toggleDaySelector}
          handleWeekSelect={handleWeekSelect}
          handleDaySelect={handleDaySelect}
        />

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Plan Nutricional {dayData?.dieta.nombre ? `- ${dayData.dieta.nombre}` : ''}
              </h2>
              <div className="flex items-center">
               
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {sidebarOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            
            
            
            
            {/* Add a comida selector if there are multiple comidas */}
            
            
            {/* Replace the single comida display with a loop to show all comidas */}
            {comidas.length > 0 ? (
              <div>
                {comidas.map((comidaItem, index) => (
                  <div key={comidaItem._id || index} className="mb-8 border-b pb-6 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 inline-flex items-center">
                          Comida : {comidaItem.nombre}
                        </h3>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          {comidaItem.horario} • {comidaItem.peso}g 
                        </span>
                        <button 
                          onClick={() => {
                            setComida(comidaItem);
                            startEditing();
                          }}
                          className="ml-2 text-blue-500 hover:text-blue-700"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-100 dark:bg-gray-800">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-2/5">
                              Ingrediente
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Peso (g)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Calorías
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Proteína (g)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Carbos (g)
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              Grasa (g)
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                          {comidaItem.ingredientes && comidaItem.ingredientes.length > 0 ? (
                            comidaItem.ingredientes.map((ingrediente, idx) => (
                              <tr key={idx}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 dark:text-gray-200">
                                  {ingrediente.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                  {ingrediente.peso}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                  {ingrediente.calorias}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                  {ingrediente.proteinas}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                  {ingrediente.carbohidratos}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                  {ingrediente.grasas}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No hay ingredientes añadidos
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Método de preparación */}
                    {comidaItem.metodoPreparacion && (
                      <div className="mt-4 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                        <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">
                          Método de Preparación
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                          {comidaItem.metodoPreparacion}
                        </p>
                      </div>
                    )}
                    
                    {/* Resumen de macronutrientes */}
                    {comidaItem.macronutrientes && (
                      <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="text-md font-semibold mb-2 text-blue-800 dark:text-blue-300">
                          Macronutrientes de la Comida
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Calorías</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                              {comidaItem.macronutrientes.calorias.toFixed(1)} kcal
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Proteínas</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                              {comidaItem.macronutrientes.proteinas.toFixed(1)} g
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Carbohidratos</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                              {comidaItem.macronutrientes.carbohidratos.toFixed(1)} g
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Grasas</p>
                            <p className="text-lg font-bold text-gray-800 dark:text-white">
                              {comidaItem.macronutrientes.grasas.toFixed(1)} g
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Add new ingredient form only when a comida is selected */}
                {comida && (
                  <div className="mt-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                    <h3 className="text-md font-semibold mb-2 text-gray-800 dark:text-white">
                      Añadir ingrediente a {comida.nombre}
                    </h3>
                    <div className="grid grid-cols-6 gap-2">
                      <div className="col-span-2">
                        <input
                          type="text"
                          name="nombre"
                          placeholder="Nombre del ingrediente"
                          value={newIngrediente.nombre}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="peso"
                          placeholder="g"
                          value={newIngrediente.peso || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="calorias"
                          placeholder="kcal"
                          value={newIngrediente.calorias || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="proteinas"
                          placeholder="g"
                          value={newIngrediente.proteinas || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="carbohidratos"
                          placeholder="g"
                          value={newIngrediente.carbohidratos || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          name="grasas"
                          placeholder="g"
                          value={newIngrediente.grasas || ''}
                          onChange={handleInputChange}
                          className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleAddIngrediente}
                      className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                    >
                      Añadir ingrediente
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                <div className="text-center">
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No hay comidas para este día</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500">
                    Crea una nueva comida desde el panel lateral
                  </p>
                </div>
              </div>
            )}
            
            {/* Modal para editar horario y método de preparación */}
            {isEditing && comida && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
                    Editar detalles de la comida
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={comidaNombre}
                      onChange={(e) => setComidaNombre(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ej: Desayuno"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Horario
                    </label>
                    <input
                      type="text"
                      value={comidaHorario}
                      onChange={(e) => setComidaHorario(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ej: 08:00"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Porción
                    </label>
                    <input
                      type="number"
                      value={comidaPorcion}
                      onChange={(e) => setComidaPorcion(Number(e.target.value))}
                      min="0"
                      step="0.5"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ej: 1"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Método de preparación (opcional)
                    </label>
                    <textarea
                      value={comidaPreparacion}
                      onChange={(e) => setComidaPreparacion(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Describe cómo preparar esta comida..."
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                  <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={saveComidaDetails}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Método de preparación */}
            {comida && comida.metodoPreparacion && (
              <div className="mb-6 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  Método de Preparación
                </h3>
                <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">
                  {comida.metodoPreparacion}
                </p>
              </div>
            )}
            
            {/* Resumen de macronutrientes */}
                        {/* Resumen de macronutrientes */}
                        {comida && comida.macronutrientes && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-300">
                  Macronutrientes de la Comida
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Calorías</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {comida.macronutrientes.calorias.toFixed(1)} kcal
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Proteínas</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {comida.macronutrientes.proteinas.toFixed(1)} g
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Carbohidratos</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {comida.macronutrientes.carbohidratos.toFixed(1)} g
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Grasas</p>
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {comida.macronutrientes.grasas.toFixed(1)} g
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Panel lateral */}
      <div className={`absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out overflow-auto ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {sidebarOpen && (
          <SidebarPanel 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            dayData={dayData}
            comidas={comidas} // Fix: Pass the comidas array directly
            setComida={setComida}
            setComidaHorario={setComidaHorario}
            setComidaPreparacion={setComidaPreparacion}
            setComidaNombre={setComidaNombre}
            setComidaPorcion={setComidaPorcion}
            selectedDate={selectedDate}
            sidebarOpen={sidebarOpen}
            onRecipeAdded={handleRecipeAdded} // Add this new prop
          />
        )}
      </div>
    </div>
  );
};

export default VistaAlimentacion;

// Add this function to handle when a new recipe is added
