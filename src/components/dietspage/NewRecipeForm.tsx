import React, { useState } from 'react';
import { X, Plus, Minus, Save } from 'lucide-react';
import { Recipe, Ingrediente } from './RecipePopup';
import { useTheme } from '../../contexts/ThemeContext';

interface NewRecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

export default function NewRecipeForm({ isOpen, onClose, onSave }: NewRecipeFormProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [recipe, setRecipe] = useState<Omit<Recipe, 'id'>>({
    numero: 1,
    peso: 0,
    nombre: '',
    horario: '12:00',
    porcion: 1,
    metodoPreparacion: '',
    ingredientes: [],
    macronutrientes: {
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    }
  });

  const [newIngredient, setNewIngredient] = useState<Ingrediente>({
    nombre: '',
    calorias: 0,
    proteinas: 0,
    carbohidratos: 0,
    grasas: 0
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setRecipe({
        ...recipe,
        [parent]: {
          ...recipe[parent as keyof typeof recipe],
          [child]: parent === 'macronutrientes' ? parseFloat(value) || 0 : value
        }
      });
    } else {
      setRecipe({
        ...recipe,
        [name]: ['peso', 'porcion', 'numero'].includes(name) ? parseFloat(value) || 0 : value
      });
    }
  };

  const handleIngredientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewIngredient({
      ...newIngredient,
      [name]: name === 'nombre' ? value : parseFloat(value) || 0
    });
  };

  const addIngredient = () => {
    if (newIngredient.nombre.trim() === '') return;
    
    // Add the new ingredient
    const updatedIngredients = [...recipe.ingredientes, { ...newIngredient }];
    
    // Calculate total macros
    const totalMacros = updatedIngredients.reduce(
      (acc, curr) => {
        return {
          calorias: acc.calorias + curr.calorias,
          proteinas: acc.proteinas + curr.proteinas,
          carbohidratos: acc.carbohidratos + curr.carbohidratos,
          grasas: acc.grasas + curr.grasas
        };
      },
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
    
    // Update recipe with new ingredient and calculated macros
    setRecipe({
      ...recipe,
      ingredientes: updatedIngredients,
      macronutrientes: totalMacros
    });
    
    // Reset the new ingredient form
    setNewIngredient({
      nombre: '',
      calorias: 0,
      proteinas: 0,
      carbohidratos: 0,
      grasas: 0
    });
  };

  const removeIngredient = (index: number) => {
    const updatedIngredients = recipe.ingredientes.filter((_, i) => i !== index);
    
    // Recalculate macros
    const totalMacros = updatedIngredients.reduce(
      (acc, curr) => {
        return {
          calorias: acc.calorias + curr.calorias,
          proteinas: acc.proteinas + curr.proteinas,
          carbohidratos: acc.carbohidratos + curr.carbohidratos,
          grasas: acc.grasas + curr.grasas
        };
      },
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
    
    setRecipe({
      ...recipe,
      ingredientes: updatedIngredients,
      macronutrientes: totalMacros
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (recipe.nombre.trim() === '') {
      alert('Por favor, ingresa un nombre para la receta');
      return;
    }
    
    if (recipe.ingredientes.length === 0) {
      alert('Por favor, agrega al menos un ingrediente');
      return;
    }
    
    // Generate a unique ID and save the recipe
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString()
    };
    
    onSave(newRecipe);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className={`${
        isDark 
          ? 'bg-gray-800/95 border-gray-700' 
          : 'bg-white/95 border-gray-100'
      } rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border animate-fade-in`}>
        <div className={`p-6 flex justify-between items-center border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-2xl font-bold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">
              Nueva Receta
            </span>
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-full ${
              isDark 
                ? 'text-gray-400 hover:text-red-400' 
                : 'text-gray-500 hover:text-red-500'
            } transition-all duration-300 transform hover:rotate-90`}
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Recipe Information */}
            <div className="space-y-4">
              <div className="group">
                <label htmlFor="nombre" className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                } transition-colors`}>
                  Nombre de la Receta
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={recipe.nombre}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2.5 border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                      : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label htmlFor="horario" className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } transition-colors`}>
                    Horario
                  </label>
                  <input
                    type="time"
                    id="horario"
                    name="horario"
                    value={recipe.horario}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                </div>
                <div className="group">
                  <label htmlFor="numero" className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } transition-colors`}>
                    NÃºmero
                  </label>
                  <input
                    type="number"
                    id="numero"
                    name="numero"
                    value={recipe.numero}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label htmlFor="peso" className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } transition-colors`}>
                    Peso (g)
                  </label>
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    value={recipe.peso}
                    onChange={handleInputChange}
                    min="0"
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                </div>
                <div className="group">
                  <label htmlFor="porcion" className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                  } transition-colors`}>
                    Porciones
                  </label>
                  <input
                    type="number"
                    id="porcion"
                    name="porcion"
                    value={recipe.porcion}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2.5 border ${
                      isDark 
                        ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                        : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                    } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                </div>
              </div>
              
              <div className="group">
                <label htmlFor="metodoPreparacion" className={`block text-sm font-medium mb-1 ${
                  isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                } transition-colors`}>
                  MÃ©todo de PreparaciÃ³n
                </label>
                <textarea
                  id="metodoPreparacion"
                  name="metodoPreparacion"
                  value={recipe.metodoPreparacion}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full px-4 py-2.5 border ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                      : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                  } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-none`}
                />
              </div>
            </div>
            
            {/* Ingredients and Macros */}
            <div className="space-y-4">
              <div className={`${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
              } border rounded-xl p-4 shadow-sm`}>
                <h3 className={`text-lg font-medium mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                } border-b pb-2 flex items-center gap-2`}>
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Ingredientes
                </h3>
                
                {/* Add new ingredient form */}
                <div className="space-y-3 mb-4">
                  <div>
                    <label htmlFor="ingredientName" className={`block text-sm font-medium mb-1 ${
                      isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                    } transition-colors`}>
                      Nombre del Ingrediente
                    </label>
                    <input
                      type="text"
                      id="ingredientName"
                      name="nombre"
                      value={newIngredient.nombre}
                      onChange={handleIngredientChange}
                      className={`w-full px-4 py-2.5 border ${
                        isDark 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                          : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                      } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="ingredientCalorias" className={`block text-sm font-medium mb-1 ${
                        isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                      } transition-colors`}>
                        CalorÃ­as
                      </label>
                      <input
                        type="number"
                        id="ingredientCalorias"
                        name="calorias"
                        value={newIngredient.calorias}
                        onChange={handleIngredientChange}
                        min="0"
                        className={`w-full px-4 py-2.5 border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                            : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ingredientProteinas" className={`block text-sm font-medium mb-1 ${
                        isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                      } transition-colors`}>
                        ProteÃ­nas (g)
                      </label>
                      <input
                        type="number"
                        id="ingredientProteinas"
                        name="proteinas"
                        value={newIngredient.proteinas}
                        onChange={handleIngredientChange}
                        min="0"
                        step="0.1"
                        className={`w-full px-4 py-2.5 border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                            : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="ingredientCarbohidratos" className={`block text-sm font-medium mb-1 ${
                        isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                      } transition-colors`}>
                        Carbohidratos (g)
                      </label>
                      <input
                        type="number"
                        id="ingredientCarbohidratos"
                        name="carbohidratos"
                        value={newIngredient.carbohidratos}
                        onChange={handleIngredientChange}
                        min="0"
                        step="0.1"
                        className={`w-full px-4 py-2.5 border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                            : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                    </div>
                    <div>
                      <label htmlFor="ingredientGrasas" className={`block text-sm font-medium mb-1 ${
                        isDark ? 'text-gray-300 group-hover:text-blue-400' : 'text-gray-700 group-hover:text-blue-600'
                      } transition-colors`}>
                        Grasas (g)
                      </label>
                      <input
                        type="number"
                        id="ingredientGrasas"
                        name="grasas"
                        value={newIngredient.grasas}
                        onChange={handleIngredientChange}
                        min="0"
                        step="0.1"
                        className={`w-full px-4 py-2.5 border ${
                          isDark 
                            ? 'bg-gray-700 border-gray-600 text-gray-100 focus:border-blue-500 hover:border-blue-400' 
                            : 'border-gray-300 focus:border-blue-500 hover:border-blue-400'
                        } rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                      />
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={addIngredient}
                    className="px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center gap-2 transform hover:scale-105 w-full justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Ingrediente</span>
                  </button>
                </div>
                
                {/* Ingredient list */}
                {recipe.ingredientes.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {recipe.ingredientes.map((ingrediente, idx) => (
                      <div 
                        key={idx} 
                        className={`flex justify-between items-center ${
                          isDark ? 'bg-gray-700/30' : 'bg-gray-100'
                        } p-2 rounded-lg`}
                      >
                        <div>
                          <p className={`text-sm font-medium ${
                            isDark ? 'text-white' : 'text-gray-800'
                          }`}>{ingrediente.nombre}</p>
                          <p className={`text-xs ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {ingrediente.calorias} kcal | P: {ingrediente.proteinas}g | C: {ingrediente.carbohidratos}g | G: {ingrediente.grasas}g
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIngredient(idx)}
                          className={`p-1 rounded-full ${
                            isDark 
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30' 
                              : 'text-red-500 hover:text-red-700 hover:bg-red-50'
                          } transition-colors`}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm text-center py-2 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>No hay ingredientes agregados</p>
                )}
              </div>
              
              {/* Macronutrients summary */}
              <div className={`${
                isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700' 
                  : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
              } border rounded-xl p-4 shadow-sm`}>
                <h3 className={`text-lg font-medium mb-3 ${
                  isDark ? 'text-gray-200' : 'text-gray-800'
                } border-b pb-2 flex items-center gap-2`}>
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Macronutrientes Totales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>CalorÃ­as:</span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>{recipe.macronutrientes.calorias} kcal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>ProteÃ­nas:</span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>{recipe.macronutrientes.proteinas}g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Carbohidratos:</span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>{recipe.macronutrientes.carbohidratos}g</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className={`text-sm ${
                      isDark ? 'text-gray-300' : 'text-gray-600'
                    }`}>Grasas:</span>
                    <span className={`text-sm font-medium ${
                      isDark ? 'text-white' : 'text-gray-800'
                    }`}>{recipe.macronutrientes.grasas}g</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submit button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              <span>Guardar Receta</span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: ${isDark ? 'rgba(31, 41, 55, 0.1)' : 'rgba(229, 231, 235, 0.5)'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(107, 114, 128, 0.7)' : 'rgba(107, 114, 128, 0.7)'};
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
