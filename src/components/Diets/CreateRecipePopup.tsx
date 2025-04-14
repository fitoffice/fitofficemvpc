import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { X, Plus, Minus } from 'lucide-react';

interface Alimento {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

interface CreateRecipePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRecipe: (recipeData: any) => void;
}

const CreateRecipePopup: React.FC<CreateRecipePopupProps> = ({ isOpen, onClose, onCreateRecipe }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find or create portal root element
    let element = document.getElementById('recipe-portal-root');
    if (!element) {
      element = document.createElement('div');
      element.id = 'recipe-portal-root';
      document.body.appendChild(element);
    }
    setPortalElement(element);

    // Cleanup function
    return () => {
      if (element && element.parentNode && element.childNodes.length === 0) {
        document.body.removeChild(element);
      }
    };
  }, []);

  const [recipeName, setRecipeName] = useState('');
  const [recipeType, setRecipeType] = useState('');
  const [recipeTime, setRecipeTime] = useState('');
  
  const [macros, setMacros] = useState({
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0,
    fibra: 0
  });

  const [alimentos, setAlimentos] = useState<Alimento[]>([
    { nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
  ]);

  const handleMacroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMacros({
      ...macros,
      [name]: parseFloat(value) || 0
    });
  };

  const handleAlimentoChange = (index: number, field: keyof Alimento, value: string) => {
    const newAlimentos = [...alimentos];
    if (field === 'nombre') {
      newAlimentos[index][field] = value;
    } else {
      newAlimentos[index][field] = parseFloat(value) || 0;
    }
    setAlimentos(newAlimentos);
  };

  const addAlimento = () => {
    setAlimentos([...alimentos, { nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }]);
  };

  const removeAlimento = (index: number) => {
    if (alimentos.length > 1) {
      const newAlimentos = [...alimentos];
      newAlimentos.splice(index, 1);
      setAlimentos(newAlimentos);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty alimentos
    const validAlimentos = alimentos.filter(a => a.nombre.trim() !== '');
    
    if (validAlimentos.length === 0) {
      alert('Debes agregar al menos un alimento');
      return;
    }

    if (!recipeName.trim()) {
      alert('El nombre de la receta es obligatorio');
      return;
    }

    const recipeData = {
      nombre: recipeName,
      tipo: recipeType || undefined,
      horario: recipeTime || undefined,
      macronutrientes: macros,
      alimentos: validAlimentos
    };

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/comidas', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipeData)
      });

      if (!response.ok) {
        throw new Error(`Error al crear la receta: ${response.status}`);
      }

      const data = await response.json();
      onCreateRecipe(data);
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error creating recipe:', err);
      alert(err instanceof Error ? err.message : 'Error al crear la receta');
    }
  };
  const resetForm = () => {
    setRecipeName('');
    setRecipeType('');
    setRecipeTime('');
    setMacros({
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0,
      fibra: 0
    });
    setAlimentos([{ nombre: '', calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }]);
  };

  if (!isOpen || !portalElement) return null;

  const popupContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl ${
        isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
      } p-6 shadow-xl`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
          Crear Nueva Receta
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Nombre *
              </label>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Tipo
              </label>
              <input
                type="text"
                value={recipeType}
                onChange={(e) => setRecipeType(e.target.value)}
                placeholder="Desayuno, Almuerzo, etc."
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
              />
            </div>
            
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Horario
              </label>
              <input
                type="text"
                value={recipeTime}
                onChange={(e) => setRecipeTime(e.target.value)}
                placeholder="Mañana, Tarde, etc."
                className={`w-full px-3 py-2 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-700'
                } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
              />
            </div>
          </div>
          
          {/* Macronutrientes */}
          <div>
            <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Macronutrientes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Calorías (kcal)
                </label>
                <input
                  type="number"
                  name="calorias"
                  value={macros.calorias}
                  onChange={handleMacroChange}
                  min="0"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Proteínas (g)
                </label>
                <input
                  type="number"
                  name="proteinas"
                  value={macros.proteinas}
                  onChange={handleMacroChange}
                  min="0"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Carbohidratos (g)
                </label>
                <input
                  type="number"
                  name="carbohidratos"
                  value={macros.carbohidratos}
                  onChange={handleMacroChange}
                  min="0"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Grasas (g)
                </label>
                <input
                  type="number"
                  name="grasas"
                  value={macros.grasas}
                  onChange={handleMacroChange}
                  min="0"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                />
              </div>
              
              <div className="space-y-2">
                <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Fibra (g)
                </label>
                <input
                  type="number"
                  name="fibra"
                  value={macros.fibra}
                  onChange={handleMacroChange}
                  min="0"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-200' 
                      : 'bg-white border-gray-300 text-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                />
              </div>
            </div>
          </div>
          
          {/* Alimentos */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Alimentos
              </h3>
              <button
                type="button"
                onClick={addAlimento}
                className={`px-3 py-1 rounded-lg flex items-center gap-1 text-sm ${
                  isDarkMode
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span>Añadir</span>
              </button>
            </div>
            
            {alimentos.map((alimento, index) => (
              <div key={index} className={`p-4 rounded-lg mb-4 ${
                isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <h4 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    Alimento {index + 1}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeAlimento(index)}
                    className={`p-1 rounded-full ${
                      isDarkMode
                        ? 'bg-gray-600 hover:bg-gray-500 text-gray-300'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                    }`}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="md:col-span-1 space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={alimento.nombre}
                      onChange={(e) => handleAlimentoChange(index, 'nombre', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Calorías
                    </label>
                    <input
                      type="number"
                      value={alimento.calorias}
                      onChange={(e) => handleAlimentoChange(index, 'calorias', e.target.value)}
                      min="0"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Proteínas
                    </label>
                    <input
                      type="number"
                      value={alimento.proteinas}
                      onChange={(e) => handleAlimentoChange(index, 'proteinas', e.target.value)}
                      min="0"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Carbohidratos
                    </label>
                    <input
                      type="number"
                      value={alimento.carbohidratos}
                      onChange={(e) => handleAlimentoChange(index, 'carbohidratos', e.target.value)}
                      min="0"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Grasas
                    </label>
                    <input
                      type="number"
                      value={alimento.grasas}
                      onChange={(e) => handleAlimentoChange(index, 'grasas', e.target.value)}
                      min="0"
                      className={`w-full px-3 py-2 rounded-lg border ${
                        isDarkMode 
                          ? 'bg-gray-600 border-gray-500 text-gray-200' 
                          : 'bg-white border-gray-300 text-gray-700'
                      } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end pt-4">
          <button
              type="button"
              onClick={(e) => handleSubmit(e as any)}
              className={`px-6 py-2 rounded-xl font-medium ${
                isDarkMode
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              Crear Receta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  return createPortal(popupContent, portalElement);
};

export default CreateRecipePopup;