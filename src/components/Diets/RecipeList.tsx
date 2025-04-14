import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Search, Clock, MoreVertical, Utensils, Users, AlertCircle } from 'lucide-react';
import CreateRecipePopup from './CreateRecipePopup';

interface Alimento {
  nombre: string;
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
  fibra: number;
}

interface Recipe {
  _id: string;
  nombre: string;
  alimentos: Alimento[];
  macronutrientes: Macronutrientes;
  createdAt: string;
  updatedAt: string;
  numero?: number;
  horario?: string;
  tipo?: string;
}

const RecipeList: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatePopupOpen, setIsCreatePopupOpen] = useState(false);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('No se encontró el token de autenticación');
        }

        const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/comidas', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Error al obtener recetas: ${response.status}`);
        }

        const data = await response.json();
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching recipes:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las recetas');
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => 
    recipe.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.tipo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRecipe = (newRecipe: Recipe) => {
    setRecipes([newRecipe, ...recipes]);
  };

  return (
    <div className="space-y-6">
      {/* Search and Add Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`flex-1 relative ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <input
            type="text"
            placeholder="Buscar recetas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-amber-500/50`}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        
        <button 
          onClick={() => setIsCreatePopupOpen(true)}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
            isDarkMode
              ? 'bg-amber-600 hover:bg-amber-700 text-white'
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Receta</span>
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <div className="animate-spin w-8 h-8 border-4 border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent rounded-full mx-auto mb-4"></div>
          <p>Cargando recetas...</p>
        </div>
      )}

      {error && !loading && (
        <div className={`rounded-xl p-4 flex items-center gap-3 ${
          isDarkMode ? 'bg-red-900/20 text-red-300' : 'bg-red-100 text-red-700'
        }`}>
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div 
                key={recipe._id} 
                className={`rounded-2xl border p-5 ${
                  isDarkMode 
                    ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } transition-all duration-300 hover:shadow-lg`}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    {recipe.nombre}
                  </h3>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3">
                  {recipe.tipo && (
                    <div className="flex items-center gap-2">
                      <Utensils className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {recipe.tipo}
                      </span>
                    </div>
                  )}
                  
                  {recipe.horario && (
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {recipe.horario}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <Users className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      {recipe.alimentos.length} ingredientes
                    </span>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <h4 className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Macronutrientes
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-medium">Calorías:</span> {recipe.macronutrientes.calorias} kcal
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-medium">Proteínas:</span> {recipe.macronutrientes.proteinas}g
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-medium">Carbos:</span> {recipe.macronutrientes.carbohidratos}g
                      </div>
                      <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        <span className="font-medium">Grasas:</span> {recipe.macronutrientes.grasas}g
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={`col-span-full text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>No se encontraron recetas que coincidan con tu búsqueda.</p>
            </div>
          )}
        </div>
           )}
           <CreateRecipePopup 
             isOpen={isCreatePopupOpen}
             onClose={() => setIsCreatePopupOpen(false)}
             onCreateRecipe={handleCreateRecipe}
           />
         </div>
       );
     };
     
     export default RecipeList;