import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';

interface Food {
  id?: number;
  nombre: string;
  calorias: number;
  proteinas: number;
  carbohidratos: number;
  grasas: number;
}

const FoodList: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/comidas/ingredients/all');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setFoods(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching foods:', err);
        setError('Error al cargar los alimentos. Por favor, intente de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const filteredFoods = foods.filter(food => 
    food.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className={`flex-1 relative ${
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        }`}>
          <input
            type="text"
            placeholder="Buscar alimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500' 
                : 'bg-white border-gray-200 text-gray-700 placeholder-gray-400'
            } focus:outline-none focus:ring-2 focus:ring-green-500/50`}
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
        
        <button className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
          isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
        }`}>
          <Filter className="w-4 h-4" />
          <span>Filtrar</span>
        </button>
        
        <button className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
          isDarkMode
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}>
          <Plus className="w-4 h-4" />
          <span>Nuevo Alimento</span>
        </button>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className={`text-center py-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          <p>Cargando alimentos...</p>
        </div>
      )}
      
      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Foods List */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className={`min-w-full divide-y ${
            isDarkMode ? 'divide-gray-700 text-gray-200' : 'divide-gray-200 text-gray-700'
          }`}>
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Calorías</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Proteínas (g)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Carbohidratos (g)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Grasas (g)</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredFoods.length > 0 ? (
                filteredFoods.map((food, index) => (
                  <tr key={index} className={`hover:${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                    <td className="px-6 py-4 whitespace-nowrap">{food.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{food.calorias}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{food.proteinas}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{food.carbohidratos}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{food.grasas}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    No se encontraron alimentos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FoodList;