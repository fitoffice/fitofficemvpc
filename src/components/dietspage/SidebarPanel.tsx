import React, { useState, useEffect, useRef } from 'react';
import { Apple, Scale, Beef, Wheat, Droplet, Plus, Edit2, Save, X } from 'lucide-react';
import { Ingredient } from './views/types';
import ClientInfoPanel from './ClientInfoPanel'; // Import the new component

// Update the Ingredient interface to include peso
interface Ingredient {
  nombre: string;
  peso: number;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

// Add interface for client data
interface ClientData {
  _id: string;
  nombre: string;
  email: string;
  genero: string;
  telefono: string;
  altura: number;
  peso: Array<{
    valor: number;
    fecha: string;
    _id: string;
  }>;
}

interface SidebarPanelProps {
  sidebarOpen: boolean;
  activeTab: 'client' | 'recipe';
  setActiveTab: (tab: 'client' | 'recipe') => void;
  dietData: any;
  comidas?: any[];
  setComida?: (comida: any) => void;
  setComidaHorario?: (horario: string) => void;
  setComidaPreparacion?: (preparacion: string) => void;
  setComidaNombre?: (nombre: string) => void;
  setComidaPorcion?: (porcion: number) => void;
  selectedDate?: Date;
  onRecipeAdded?: (recipe: any) => void; // Add this new prop
}

const SidebarPanel: React.FC<SidebarPanelProps> = ({
  sidebarOpen,
  activeTab,
  setActiveTab,
  dietData,
  comidas = [],
  setComida,
  setComidaHorario,
  setComidaPreparacion,
  setComidaNombre,
  setComidaPorcion,
  selectedDate,
  onRecipeAdded // Add this to the destructuring
}) => {
  // Estado para la receta
  const [recipe, setRecipe] = useState({
    nombre: '',
    ingredientes: '',
    instrucciones: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    tiempoPreparacion: '00:30' // Change from number to string format
  });

  // Estado para cliente
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extraer el ID de la dieta de la URL
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Extraer el ID de la URL
        const url = window.location.href;
        const urlParts = url.split('/');
        const dietId = urlParts[urlParts.length - 1];
        
        if (!dietId) {
          throw new Error('No se pudo obtener el ID de la dieta de la URL');
        }
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }
        
        const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/dietas/${dietId}/cliente`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Error al obtener los datos del cliente');
        }
        
        const data = await response.json();
        setClientData(data.cliente);
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };
    
    fetchClientData();
  }, []);

  // Estado para ingredientes
  const [currentIngredient, setCurrentIngredient] = useState<Ingredient>({
    nombre: '',
    peso: 0,
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });
  
  const [ingredientes, setIngredientes] = useState<Ingredient[]>([]);
  
  // Estado para edición de ingredientes
  const [editingIngredientIndex, setEditingIngredientIndex] = useState<number | null>(null);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient>({
    nombre: '',
    peso: 0,
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });
  
  // Nuevo estado para sugerencias de recetas
  const [recipeSuggestions, setRecipeSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Función para obtener sugerencias de recetas
  const fetchRecipeSuggestions = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setRecipeSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://fitofficecrm-7d2801a52c4c.herokuapp.com/api/comidas`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener recetas');
      }

      const data = await response.json();
      
      // Filtrar recetas que coincidan con el término de búsqueda
      const filteredRecipes = data.filter((recipe: any) => 
        recipe.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setRecipeSuggestions(filteredRecipes);
      setShowSuggestions(filteredRecipes.length > 0);
    } catch (error) {
      console.error('Error al buscar recetas:', error);
    }
  };

  // Manejar selección de receta sugerida
  const handleSelectRecipe = (selectedRecipe: any) => {
    // Actualizar el estado de la receta con los datos de la receta seleccionada
    setRecipe({
      ...recipe,
      nombre: selectedRecipe.nombre,
      calorias: selectedRecipe.macronutrientes.calorias,
      proteinas: selectedRecipe.macronutrientes.proteinas,
      carbohidratos: selectedRecipe.macronutrientes.carbohidratos,
      grasas: selectedRecipe.macronutrientes.grasas
    });

    // Actualizar ingredientes si existen
    if (selectedRecipe.alimentos && selectedRecipe.alimentos.length > 0) {
      const formattedIngredients = selectedRecipe.alimentos.map((alimento: any) => ({
        nombre: alimento.nombre,
        peso: alimento.peso || 0, // Añadir peso con valor por defecto
        calorias: alimento.calorias,
        proteinas: alimento.proteinas,
        carbohidratos: alimento.carbohidratos,
        grasas: alimento.grasas
      }));
      
      setIngredientes(formattedIngredients);
    }

    // Ocultar sugerencias
    setShowSuggestions(false);
  };

  // Modificar handleInputChange para el campo nombre
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipe({
      ...recipe,
      [name]: name === 'calorias' || name === 'proteinas' || name === 'carbohidratos' || name === 'grasas' 
        ? Number(value) 
        : value // Remove tiempoPreparacion from number conversion
    });
    // Si es el campo nombre, buscar sugerencias
    if (name === 'nombre') {
      fetchRecipeSuggestions(value);
    }
  };

  // Función para calcular totales
  const calcularTotales = (ingredientes: Ingredient[]) => {
    const totalCalorias = ingredientes.reduce((acc, ing) => acc + ing.calorias, 0);
    const totalProteinas = ingredientes.reduce((acc, ing) => acc + ing.proteinas, 0);
    const totalCarbohidratos = ingredientes.reduce((acc, ing) => acc + ing.carbohidratos, 0);
    const totalGrasas = ingredientes.reduce((acc, ing) => acc + ing.grasas, 0);

    return {
      calorias: totalCalorias,
      proteinas: totalProteinas,
      carbohidratos: totalCarbohidratos,
      grasas: totalGrasas
    };
  };

  // Manejar cambios en los campos

  // Manejar cambios en el ingrediente actual
  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentIngredient({
      ...currentIngredient,
      [name]: name === 'nombre' ? value : Number(value)
    });
  };

  // Manejar cambios en el ingrediente que se está editando
  const handleEditingIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditingIngredient({
      ...editingIngredient,
      [name]: name === 'nombre' ? value : Number(value)
    });
  };

  // Iniciar edición de un ingrediente
  const startEditingIngredient = (index: number) => {
    setEditingIngredientIndex(index);
    setEditingIngredient({...ingredientes[index]});
  };

  // Guardar cambios de un ingrediente
  const saveEditingIngredient = () => {
    if (editingIngredientIndex === null) return;
    
    const updatedIngredientes = [...ingredientes];
    updatedIngredientes[editingIngredientIndex] = editingIngredient;
    
    setIngredientes(updatedIngredientes);
    
    // Recalcular totales
    const totales = calcularTotales(updatedIngredientes);
    setRecipe({
      ...recipe,
      calorias: totales.calorias,
      proteinas: totales.proteinas,
      carbohidratos: totales.carbohidratos,
      grasas: totales.grasas
    });
    
    // Cancelar edición
    setEditingIngredientIndex(null);
  };

  // Cancelar edición de un ingrediente
  const cancelEditingIngredient = () => {
    setEditingIngredientIndex(null);
  };

  // Añadir ingrediente
  const handleAddIngredient = () => {
    if (currentIngredient.nombre.trim() === '') return;

    const newIngredient = {
      nombre: currentIngredient.nombre,
      peso: Number(currentIngredient.peso),
      calorias: Number(currentIngredient.calorias),
      proteinas: Number(currentIngredient.proteinas),
      carbohidratos: Number(currentIngredient.carbohidratos),
      grasas: Number(currentIngredient.grasas)
    };

    const newIngredientes = [...ingredientes, newIngredient];
    setIngredientes(newIngredientes);

    // Recalcular totales
    const totales = calcularTotales(newIngredientes);
    setRecipe({
      ...recipe,
      calorias: totales.calorias,
      proteinas: totales.proteinas,
      carbohidratos: totales.carbohidratos,
      grasas: totales.grasas
    });

    // Resetear el ingrediente actual
    setCurrentIngredient({
      nombre: '',
      peso: 0,
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });
  };

  // Guardar receta
  const handleSaveRecipe = async () => {
    if (!recipe.nombre.trim()) {
      alert('Por favor, ingrese un nombre para la receta');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Extraer el ID de la dieta de la URL
      const url = window.location.href;
      const urlParts = url.split('/');
      const dietId = urlParts[urlParts.length - 1];
      
      if (!dietId) {
        throw new Error('No se pudo obtener el ID de la dieta de la URL');
      }
      
      // Usar la fecha seleccionada o la fecha actual como respaldo
      let fecha;
      if (selectedDate) {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        fecha = `${year}-${month}-${day}`;
      } else {
        // Obtener la fecha actual en formato YYYY-MM-DD como respaldo
        const today = new Date();
        fecha = today.toISOString().split('T')[0];
      }
      
      const finalRecipe = {
        nombre: recipe.nombre,
        ingredientes: ingredientes,
        instrucciones: recipe.instrucciones,
        macronutrientes: {
          calorias: recipe.calorias,
          proteinas: recipe.proteinas,
          carbohidratos: recipe.carbohidratos,
          grasas: recipe.grasas
        },
        tiempoPreparacion: recipe.tiempoPreparacion
      };

      console.log(`Enviando receta para la fecha: ${fecha}`);
      
      // Enviar la receta a la API
      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/dietas/${dietId}/dias/${fecha}/comidas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(finalRecipe)
      });

      if (!response.ok) {
        throw new Error('Error al guardar la receta');
      }

      const savedRecipe = await response.json();
      console.log('✅ Receta guardada correctamente:', savedRecipe);
      
      // Call the onRecipeAdded callback if it exists
      if (onRecipeAdded) {
        onRecipeAdded(savedRecipe);
      }
      
      // Actualizar la comida en el componente padre si existe la función
      if (setComida && savedRecipe.comida) {
        setComida(savedRecipe.comida);
      }
      
      // Actualizar otros campos relacionados con la comida si existen las funciones
      if (setComidaNombre && savedRecipe.comida) {
        setComidaNombre(savedRecipe.comida.nombre);
      }
      
      if (setComidaPreparacion && savedRecipe.comida) {
        setComidaPreparacion(savedRecipe.comida.metodoPreparacion || '');
      }
      
      if (setComidaHorario && savedRecipe.comida) {
        setComidaHorario(savedRecipe.comida.horario || '');
      }
      
      if (setComidaPorcion && savedRecipe.comida) {
        setComidaPorcion(savedRecipe.comida.porcion || 1);
      }

      // Resetear el formulario
      setRecipe({
        nombre: '',
        ingredientes: '',
        instrucciones: '',
        calorias: 0,
        proteinas: 0,
        carbohidratos: 0,
        grasas: 0,
        tiempoPreparacion: 30
      });
      setIngredientes([]);
      
      // Mostrar mensaje de éxito
      alert('Receta añadida correctamente a la dieta');
    } catch (error) {
      console.error('❌ Error al guardar la receta:', error);
      alert('Error al guardar la receta: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  };

  return (
    // Remove any overflow-x properties and ensure content doesn't cause horizontal scrolling
    <div className="h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-lg border border-gray-100 dark:border-gray-700 overflow-y-auto overflow-x-hidden">
      <div className="p-5">
        {/* Pestañas con diseño mejorado */}
        <div className="flex bg-gray-100 dark:bg-gray-700/50 rounded-lg p-1 mb-5">
          <button
            className={`py-2 px-4 rounded-md font-medium text-sm flex-1 transition-all duration-200 ${activeTab === 'client' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'}`}
            onClick={() => setActiveTab('client')}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              Cliente
            </div>
          </button>
          <button
            className={`py-2 px-4 rounded-md font-medium text-sm flex-1 transition-all duration-200 ${activeTab === 'recipe' ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'}`}
            onClick={() => setActiveTab('recipe')}
          >
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Receta
            </div>
          </button>
        </div>
        
        {/* Contenido de las pestañas */}
        {activeTab === 'client' ? (
          <ClientInfoPanel 
            loading={loading}
            error={error}
            clientData={clientData}
            dietData={dietData}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Añadir Receta</h3>
            </div>
            
            <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm">
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Nombre de la Receta</label>
                <div className="relative">
                  <input 
                    type="text"
                    name="nombre"
                    value={recipe.nombre}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                    placeholder="Ej: Ensalada de pollo"
                  />
                  
                  {/* Sugerencias de recetas */}
                  {showSuggestions && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {recipeSuggestions.map((suggestion, index) => (
                        <div 
                          key={suggestion._id || index}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-800 dark:text-gray-200"
                          onClick={() => handleSelectRecipe(suggestion)}
                        >
                          {suggestion.nombre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Lista de ingredientes añadidos */}
              {ingredientes.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ingredientes añadidos</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    {ingredientes.map((ing, index) => (
                      <div key={index} className="text-sm p-2 bg-white dark:bg-gray-700 rounded-md shadow-sm">
                        {editingIngredientIndex === index ? (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <input
                                type="text"
                                name="nombre"
                                value={editingIngredient.nombre}
                                onChange={handleEditingIngredientChange}
                                className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded"
                              />
                              <div className="flex space-x-1 ml-1">
                                <button 
                                  onClick={saveEditingIngredient}
                                  className="p-1 text-green-500 hover:text-green-600"
                                >
                                  <Save size={14} />
                                </button>
                                <button 
                                  onClick={cancelEditingIngredient}
                                  className="p-1 text-red-500 hover:text-red-600"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">Peso (g)</label>
                                <input
                                  type="number"
                                  name="peso"
                                  value={editingIngredient.peso}
                                  onChange={handleEditingIngredientChange}
                                  className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">Calorías</label>
                                <input
                                  type="number"
                                  name="calorias"
                                  value={editingIngredient.calorias}
                                  onChange={handleEditingIngredientChange}
                                  className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">Proteínas</label>
                                <input
                                  type="number"
                                  name="proteinas"
                                  value={editingIngredient.proteinas}
                                  onChange={handleEditingIngredientChange}
                                  className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">Carbos</label>
                                <input
                                  type="number"
                                  name="carbohidratos"
                                  value={editingIngredient.carbohidratos}
                                  onChange={handleEditingIngredientChange}
                                  className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500 dark:text-gray-400">Grasas</label>
                                <input
                                  type="number"
                                  name="grasas"
                                  value={editingIngredient.grasas}
                                  onChange={handleEditingIngredientChange}
                                  className="w-full px-2 py-1 text-xs bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded"
                                />
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between">
                              <div className="font-medium text-gray-800 dark:text-gray-200">{ing.nombre}</div>
                              <button 
                                onClick={() => startEditingIngredient(index)}
                                className="text-blue-500 hover:text-blue-600"
                              >
                                <Edit2 size={14} />
                              </button>
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex flex-wrap gap-2">
                              <span>{ing.peso}g</span>
                              <span>•</span>
                              <span>{ing.calorias} kcal</span>
                              <span>•</span>
                              <span>{ing.proteinas}g prot</span>
                              <span>•</span>
                              <span>{ing.carbohidratos}g carbs</span>
                              <span>•</span>
                              <span>{ing.grasas}g grasas</span>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Añadir ingrediente individual */}
              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Apple className="w-4 h-4 mr-1 text-green-600" />
                  Añadir ingrediente
                </h4>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={currentIngredient.nombre}
                      onChange={handleIngredientChange}
                      placeholder="Nombre del ingrediente"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Peso (g)</label>
                    <input
                      type="number"
                      name="peso"
                      value={currentIngredient.peso}
                      onChange={handleIngredientChange}
                      placeholder="Peso en gramos"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Calorías (kcal)</label>
                    <input
                      type="number"
                      name="calorias"
                      value={currentIngredient.calorias}
                      onChange={handleIngredientChange}
                      placeholder="Calorías"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Proteínas (g)</label>
                    <input
                      type="number"
                      name="proteinas"
                      value={currentIngredient.proteinas}
                      onChange={handleIngredientChange}
                      placeholder="Proteínas"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Carbohidratos (g)</label>
                    <input
                      type="number"
                      name="carbohidratos"
                      value={currentIngredient.carbohidratos}
                      onChange={handleIngredientChange}
                      placeholder="Carbohidratos"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Grasas (g)</label>
                    <input
                      type="number"
                      name="grasas"
                      value={currentIngredient.grasas}
                      onChange={handleIngredientChange}
                      placeholder="Grasas"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white text-sm"
                    />
                  </div>
                </div>
                
                <button 
                  type="button"
                  onClick={handleAddIngredient}
                  className="w-full py-2 px-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md hover:bg-green-200 dark:hover:bg-green-800/40 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Añadir ingrediente
                </button>
              </div>
              
              {/* Recuadro de Macros total */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Calorías</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="calorias"
                      value={recipe.calorias}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 text-xs">kcal</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Proteínas</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="proteinas"
                      value={recipe.proteinas}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 text-xs">g</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Carbohidratos</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="carbohidratos"
                      value={recipe.carbohidratos}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 text-xs">g</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Grasas</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      name="grasas"
                      value={recipe.grasas}
                      onChange={handleInputChange}
                      className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="text-gray-400 text-xs">g</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Instrucciones</label>
                <textarea 
                  name="instrucciones"
                  value={recipe.instrucciones}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  rows={3}
                  placeholder="Ej: 1. Cocer el pollo. 2. Lavar y cortar las verduras..."
                ></textarea>
              </div>
              
              <div className="mb-5">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Horario de Consumo</label>
                <div className="relative">
                <input 
                type="time" 
                name="tiempoPreparacion"
                value={recipe.tiempoPreparacion}
                onChange={handleInputChange}
                className="w-full pl-3 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
              />
                </div>
              </div>
              
              <button 
                onClick={handleSaveRecipe}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-md shadow-sm transition-all duration-200 font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir Receta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarPanel;