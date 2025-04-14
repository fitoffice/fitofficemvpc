import React, { useState } from 'react';
import { X, Search, Plus, Filter, ArrowUpDown, Tag, Info, Trash2, Edit2 } from 'lucide-react';
import NewIngredientForm from './NewIngredientForm';

export interface Ingredient {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servingSize: string;
  allergens: string[];
  tags: string[];
}

interface IngredientsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (ingredient: Ingredient) => void;
}

export default function IngredientsPopup({ isOpen, onClose, onSave }: IngredientsPopupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isNewIngredientFormOpen, setIsNewIngredientFormOpen] = useState(false);
  const [ingredientToEdit, setIngredientToEdit] = useState<Ingredient | null>(null);
  
  // Sample ingredient data - in a real app, this would come from a database or API
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    {
      id: '1',
      name: 'Pechuga de pollo',
      category: 'proteínas',
      calories: 165,
      protein: 31,
      carbs: 0,
      fats: 3.6,
      servingSize: '100g',
      allergens: [],
      tags: ['bajo en grasa', 'alto en proteína']
    },
    {
      id: '2',
      name: 'Arroz integral',
      category: 'carbohidratos',
      calories: 112,
      protein: 2.6,
      carbs: 23.5,
      fats: 0.9,
      servingSize: '100g cocido',
      allergens: [],
      tags: ['integral', 'fibra']
    },
    {
      id: '3',
      name: 'Aguacate',
      category: 'grasas',
      calories: 160,
      protein: 2,
      carbs: 8.5,
      fats: 14.7,
      servingSize: '100g',
      allergens: [],
      tags: ['grasa saludable', 'omega-3']
    },
    {
      id: '4',
      name: 'Leche de almendras',
      category: 'lácteos y alternativas',
      calories: 30,
      protein: 1.1,
      carbs: 3.5,
      fats: 2.5,
      servingSize: '240ml',
      allergens: ['frutos secos'],
      tags: ['vegano', 'sin lactosa']
    },
    {
      id: '5',
      name: 'Espinacas',
      category: 'verduras',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fats: 0.4,
      servingSize: '100g',
      allergens: [],
      tags: ['verde', 'hierro', 'vitamina K']
    },
    {
      id: '6',
      name: 'Plátano',
      category: 'frutas',
      calories: 89,
      protein: 1.1,
      carbs: 22.8,
      fats: 0.3,
      servingSize: '100g',
      allergens: [],
      tags: ['potasio', 'energía']
    }
  ]);

  // Filter and sort ingredients
  const filteredIngredients = ingredients
    .filter(ingredient => {
      const matchesSearch = ingredient.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || ingredient.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'calories') {
        comparison = a.calories - b.calories;
      } else if (sortBy === 'protein') {
        comparison = a.protein - b.protein;
      } else if (sortBy === 'carbs') {
        comparison = a.carbs - b.carbs;
      } else if (sortBy === 'fats') {
        comparison = a.fats - b.fats;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleIngredientSelect = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    if (selectedIngredient?.id === id) {
      setSelectedIngredient(null);
    }
  };

  const handleAddIngredient = (newIngredient: Ingredient) => {
    // Check if we're editing an existing ingredient
    if (ingredientToEdit) {
      setIngredients(ingredients.map(ing => 
        ing.id === newIngredient.id ? newIngredient : ing
      ));
      setIngredientToEdit(null);
    } else {
      // Add new ingredient
      setIngredients([...ingredients, newIngredient]);
    }
    
    // If onSave prop exists, call it
    if (onSave) {
      onSave(newIngredient);
    }
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setIngredientToEdit(ingredient);
    setIsNewIngredientFormOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-slate-700 animate-fade-in">
        <div className="p-6 flex justify-between items-center border-b border-slate-700">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Biblioteca de Alimentos
            </span>
            <span className="text-sm font-normal px-2 py-1 bg-yellow-500/20 rounded-full border border-yellow-400/20">
              {ingredients.length} Alimentos
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

        <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-80px)]">
          {/* Left panel - Search and filters */}
          <div className="p-6 border-r border-slate-700 md:col-span-1 overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar alimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-slate-400"
                />
              </div>
              
              {/* Category filter */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-300">
                  <Filter className="w-4 h-4" />
                  <h3 className="font-medium">Filtrar por categoría</h3>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white"
                >
                  <option value="all">Todas las categorías</option>
                  <option value="proteínas">Proteínas</option>
                  <option value="carbohidratos">Carbohidratos</option>
                  <option value="grasas">Grasas</option>
                  <option value="lácteos y alternativas">Lácteos y alternativas</option>
                  <option value="verduras">Verduras</option>
                  <option value="frutas">Frutas</option>
                </select>
              </div>
              
              {/* Sort options */}
              <div>
                <div className="flex items-center gap-2 mb-3 text-slate-300">
                  <ArrowUpDown className="w-4 h-4" />
                  <h3 className="font-medium">Ordenar por</h3>
                </div>
                <div className="space-y-2">
                  {['name', 'calories', 'protein', 'carbs', 'fats'].map((field) => (
                    <button
                      key={field}
                      onClick={() => handleSortChange(field)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors ${
                        sortBy === field
                          ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                          : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600'
                      }`}
                    >
                      <span className="capitalize">
                        {field === 'name' ? 'Nombre' : 
                         field === 'calories' ? 'Calorías' : 
                         field === 'protein' ? 'Proteínas' : 
                         field === 'carbs' ? 'Carbohidratos' : 'Grasas'}
                      </span>
                      {sortBy === field && (
                        <span className="text-xs">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Add new ingredient button */}
              <button 
                onClick={() => setIsNewIngredientFormOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all text-white font-medium"
              >
                <Plus className="w-5 h-5" />
                <span>Nuevo Alimento</span>
              </button>
            </div>
          </div>
          
          {/* Middle panel - Ingredient list */}
          <div className="p-6 border-r border-slate-700 md:col-span-1 overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-medium text-slate-300 mb-4">Resultados ({filteredIngredients.length})</h3>
            
            {filteredIngredients.length > 0 ? (
              <div className="space-y-3">
                {filteredIngredients.map(ingredient => (
                  <div
                    key={ingredient.id}
                    onClick={() => handleIngredientSelect(ingredient)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                      selectedIngredient?.id === ingredient.id
                        ? 'bg-yellow-500/20 border border-yellow-500/30'
                        : 'bg-slate-800/80 border border-slate-700 hover:border-yellow-500/30 hover:shadow-lg hover:shadow-yellow-500/5'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{ingredient.name}</h4>
                        <p className="text-sm text-slate-400 capitalize">{ingredient.category}</p>
                      </div>
                      <div className="bg-slate-700/70 px-2 py-1 rounded-lg text-white text-sm">
                        {ingredient.calories} kcal
                      </div>
                    </div>
                    
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="bg-slate-700/50 p-2 rounded-lg text-center">
                        <div className="text-sm text-white">{ingredient.protein}g</div>
                        <div className="text-xs text-slate-400">Proteína</div>
                      </div>
                      <div className="bg-slate-700/50 p-2 rounded-lg text-center">
                        <div className="text-sm text-white">{ingredient.carbs}g</div>
                        <div className="text-xs text-slate-400">Carbos</div>
                      </div>
                      <div className="bg-slate-700/50 p-2 rounded-lg text-center">
                        <div className="text-sm text-white">{ingredient.fats}g</div>
                        <div className="text-xs text-slate-400">Grasas</div>
                      </div>
                    </div>
                    
                    {ingredient.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {ingredient.tags.slice(0, 2).map((tag, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-slate-700/50 rounded-lg text-xs text-slate-300">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                        {ingredient.tags.length > 2 && (
                          <span className="inline-flex items-center px-2 py-1 bg-slate-700/50 rounded-lg text-xs text-slate-300">
                            +{ingredient.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No se encontraron alimentos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
          
          {/* Right panel - Ingredient details */}
          <div className="p-6 md:col-span-1 overflow-y-auto custom-scrollbar">
            {selectedIngredient ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{selectedIngredient.name}</h3>
                  <div className="flex gap-2">
                    <button 
                      className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                      onClick={() => handleEditIngredient(selectedIngredient)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 hover:text-red-300 transition-colors"
                      onClick={() => handleDeleteIngredient(selectedIngredient.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-slate-300">Información Nutricional</h4>
                    <span className="text-sm text-slate-400">Por {selectedIngredient.servingSize}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                      <span className="text-white">Calorías</span>
                      <span className="font-medium text-white">{selectedIngredient.calories} kcal</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                      <span className="text-white">Proteínas</span>
                      <span className="font-medium text-white">{selectedIngredient.protein}g</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                      <span className="text-white">Carbohidratos</span>
                      <span className="font-medium text-white">{selectedIngredient.carbs}g</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-white">Grasas</span>
                      <span className="font-medium text-white">{selectedIngredient.fats}g</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                  <h4 className="font-medium text-slate-300 mb-3">Categoría</h4>
                  <div className="inline-block px-3 py-1 bg-slate-700 rounded-lg text-white capitalize">
                    {selectedIngredient.category}
                  </div>
                </div>
                
                {selectedIngredient.allergens.length > 0 && (
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-red-400" />
                      <h4 className="font-medium text-slate-300">Alérgenos</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredient.allergens.map((allergen, idx) => (
                        <span key={idx} className="px-3 py-1 bg-red-500/20 text-red-300 rounded-lg text-sm">
                          {allergen}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedIngredient.tags.length > 0 && (
                  <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-4">
                    <h4 className="font-medium text-slate-300 mb-3">Etiquetas</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedIngredient.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700 rounded-lg text-sm text-slate-300">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl hover:from-yellow-600 hover:to-amber-700 transition-all text-white font-medium">
                  <Plus className="w-5 h-5" />
                  <span>Añadir a la Dieta</span>
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4">
                  <Info className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Selecciona un alimento</h3>
                <p className="text-slate-400 max-w-xs">
                  Haz clic en un alimento de la lista para ver sus detalles nutricionales completos.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <NewIngredientForm 
        isOpen={isNewIngredientFormOpen}
        onClose={() => {
          setIsNewIngredientFormOpen(false);
          setIngredientToEdit(null);
        }}
        onSave={handleAddIngredient}
        ingredientToEdit={ingredientToEdit}
      />
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