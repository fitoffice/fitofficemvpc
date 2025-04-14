import React, { useState } from 'react';
import { X, Search, Plus, ChevronDown, ChevronUp, Edit2, Trash2 } from 'lucide-react';
import NewRecipeForm from './NewRecipeForm';

export interface Ingrediente {
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

export interface Recipe {
  id: string;
  numero: number;
  peso: number;
  nombre: string;
  horario: string;
  porcion: number;
  metodoPreparacion: string;
  ingredientes: Ingrediente[];
  macronutrientes: {
    calorias: number;
    proteinas: number;
    carbohidratos: number;
    grasas: number;
  };
}

interface RecipePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (recipe: Recipe) => void;
}

export default function RecipePopup({ isOpen, onClose, onSave }: RecipePopupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedRecipe, setExpandedRecipe] = useState<string | null>(null);
  const [isNewRecipeFormOpen, setIsNewRecipeFormOpen] = useState(false);
  
  // Sample recipe data - in a real app, this would come from a database or API
  const [recipes, setRecipes] = useState<Recipe[]>([
    {
      id: '1',
      numero: 1,
      peso: 350,
      nombre: 'Ensalada de Quinoa',
      horario: '13:00',
      porcion: 4,
      metodoPreparacion: 'Cocinar la quinoa en agua hasta que esté tierna. Dejar enfriar. Mezclar con los vegetales picados y aliñar con aceite, limón, sal y pimienta.',
      ingredientes: [
        { nombre: 'Quinoa', calorias: 120, proteinas: 4, carbohidratos: 21, grasas: 2 },
        { nombre: 'Pepino', calorias: 15, proteinas: 0.5, carbohidratos: 3, grasas: 0.1 },
        { nombre: 'Tomate', calorias: 20, proteinas: 1, carbohidratos: 4, grasas: 0.2 },
        { nombre: 'Aceite de oliva', calorias: 120, proteinas: 0, carbohidratos: 0, grasas: 14 }
      ],
      macronutrientes: {
        calorias: 350,
        proteinas: 12,
        carbohidratos: 45,
        grasas: 14
      }
    },
    {
      id: '2',
      numero: 2,
      peso: 300,
      nombre: 'Batido de Proteínas',
      horario: '08:00',
      porcion: 1,
      metodoPreparacion: 'Combinar todos los ingredientes en una licuadora y mezclar hasta obtener una consistencia suave.',
      ingredientes: [
        { nombre: 'Proteína de suero', calorias: 120, proteinas: 25, carbohidratos: 3, grasas: 1 },
        { nombre: 'Plátano', calorias: 105, proteinas: 1, carbohidratos: 27, grasas: 0.4 },
        { nombre: 'Leche de almendras', calorias: 30, proteinas: 1, carbohidratos: 1, grasas: 2.5 },
        { nombre: 'Mantequilla de maní', calorias: 95, proteinas: 4, carbohidratos: 3, grasas: 8 }
      ],
      macronutrientes: {
        calorias: 280,
        proteinas: 30,
        carbohidratos: 20,
        grasas: 8
      }
    },
    {
      id: '3',
      numero: 3,
      peso: 450,
      nombre: 'Pollo al Horno con Verduras',
      horario: '20:00',
      porcion: 2,
      metodoPreparacion: 'Precalentar el horno a 200°C. Colocar el pollo y las verduras en una bandeja, rociar con aceite y especias. Hornear por 25-30 minutos.',
      ingredientes: [
        { nombre: 'Pechuga de pollo', calorias: 165, proteinas: 31, carbohidratos: 0, grasas: 3.6 },
        { nombre: 'Zanahoria', calorias: 25, proteinas: 0.6, carbohidratos: 6, grasas: 0.1 },
        { nombre: 'Calabacín', calorias: 17, proteinas: 1.2, carbohidratos: 3, grasas: 0.3 },
        { nombre: 'Cebolla', calorias: 40, proteinas: 1.1, carbohidratos: 9, grasas: 0.1 },
        { nombre: 'Aceite de oliva', calorias: 120, proteinas: 0, carbohidratos: 0, grasas: 14 }
      ],
      macronutrientes: {
        calorias: 420,
        proteinas: 35,
        carbohidratos: 25,
        grasas: 18
      }
    }
  ]);

  // Filter recipes based on search term and category
  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || getCategory(recipe.horario) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper function to determine category based on horario
  const getCategory = (horario: string): string => {
    const hour = parseInt(horario.split(':')[0]);
    if (hour >= 6 && hour < 11) return 'desayuno';
    if (hour >= 11 && hour < 15) return 'almuerzo';
    if (hour >= 15 && hour < 18) return 'merienda';
    if (hour >= 18 || hour < 6) return 'cena';
    return 'snack';
  };

  const toggleRecipeExpansion = (id: string) => {
    if (expandedRecipe === id) {
      setExpandedRecipe(null);
    } else {
      setExpandedRecipe(id);
    }
  };

  const handleDeleteRecipe = (id: string) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const handleAddNewRecipe = (newRecipe: Recipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700 animate-fade-in">
        <div className="p-6 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              Biblioteca de Recetas
            </span>
            <span className="text-sm font-normal px-2 py-1 bg-green-500/20 rounded-full border border-green-400/20">
              {recipes.length} Recetas
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        <div className="p-6">
          {/* Search and filter controls */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar recetas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-white placeholder-slate-400"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 text-white"
            >
              <option value="all">Todas las categorías</option>
              <option value="desayuno">Desayuno</option>
              <option value="almuerzo">Almuerzo</option>
              <option value="merienda">Merienda</option>
              <option value="cena">Cena</option>
              <option value="snack">Snack</option>
            </select>
            <button 
              onClick={() => setIsNewRecipeFormOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all text-white font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Nueva Receta</span>
            </button>
          </div>

          {/* Recipe list */}
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <div 
                  key={recipe.id}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl overflow-hidden hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
                >
                  <div 
                    className="p-4 flex justify-between items-center cursor-pointer"
                    onClick={() => toggleRecipeExpansion(recipe.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-400/20 to-emerald-500/20 flex items-center justify-center">
                        <span className="text-green-400 font-bold">{recipe.nombre.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{recipe.nombre}</h3>
                        <div className="flex items-center gap-2 text-sm text-slate-400">
                          <span className="capitalize">{getCategory(recipe.horario)}</span>
                          <span>•</span>
                          <span>{recipe.horario}</span>
                          <span>•</span>
                          <span>{recipe.macronutrientes.calorias} kcal</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-white">{recipe.macronutrientes.proteinas}g</span>
                        <span className="text-xs text-slate-400">P</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-white">{recipe.macronutrientes.carbohidratos}g</span>
                        <span className="text-xs text-slate-400">C</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg">
                        <span className="text-sm text-white">{recipe.macronutrientes.grasas}g</span>
                        <span className="text-xs text-slate-400">G</span>
                      </div>
                      {expandedRecipe === recipe.id ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                  
                  {expandedRecipe === recipe.id && (
                    <div className="p-4 pt-0 border-t border-slate-700 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Ingredientes</h4>
                          <ul className="list-disc pl-5 text-white space-y-1">
                            {recipe.ingredientes.map((ingrediente, idx) => (
                              <li key={idx} className="text-sm">
                                {ingrediente.nombre} - {ingrediente.calorias} kcal
                                <span className="text-xs text-slate-400 ml-1">
                                  (P: {ingrediente.proteinas}g, C: {ingrediente.carbohidratos}g, G: {ingrediente.grasas}g)
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-slate-400 mb-2">Método de Preparación</h4>
                          <p className="text-sm text-white">{recipe.metodoPreparacion}</p>
                          <div className="flex items-center gap-4 mt-4 text-sm text-slate-400">
                            <div>Peso: {recipe.peso}g</div>
                            <div>Porciones: {recipe.porcion}</div>
                            <div>Horario: {recipe.horario}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-2">
                        <button className="flex items-center gap-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-sm transition-colors">
                          <Edit2 className="w-4 h-4" />
                          <span>Editar</span>
                        </button>
                        <button 
                          className="flex items-center gap-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 text-sm transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRecipe(recipe.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No se encontraron recetas que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Recipe Form */}
      {isNewRecipeFormOpen && (
        <NewRecipeForm 
          isOpen={isNewRecipeFormOpen}
          onClose={() => setIsNewRecipeFormOpen(false)}
          onSave={handleAddNewRecipe}
        />
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.7);
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