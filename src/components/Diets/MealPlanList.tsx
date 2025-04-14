import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Plus, Search, Calendar, MoreVertical, User } from 'lucide-react';

const MealPlanList: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for meal plans
  const mockMealPlans = [
    { 
      id: 1, 
      name: 'Plan Pérdida de Peso', 
      client: 'María García', 
      startDate: '2023-10-01', 
      endDate: '2023-12-31',
      totalCalories: 1800,
      status: 'Activo'
    },
    { 
      id: 2, 
      name: 'Plan Ganancia Muscular', 
      client: 'Juan Pérez', 
      startDate: '2023-09-15', 
      endDate: '2023-11-15',
      totalCalories: 2800,
      status: 'Activo'
    },
    { 
      id: 3, 
      name: 'Plan Mantenimiento', 
      client: 'Ana Rodríguez', 
      startDate: '2023-08-01', 
      endDate: '2023-10-31',
      totalCalories: 2200,
      status: 'Completado'
    },
    { 
      id: 4, 
      name: 'Plan Vegetariano', 
      client: 'Carlos Sánchez', 
      startDate: '2023-10-15', 
      endDate: '2024-01-15',
      totalCalories: 2000,
      status: 'Pendiente'
    },
  ];

  const filteredPlans = mockMealPlans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'activo':
        return isDarkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800';
      case 'completado':
        return isDarkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-100 text-amber-800';
      default:
        return isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-800';
    }
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
            placeholder="Buscar planificaciones..."
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
        
        <button className={`px-4 py-2 rounded-xl flex items-center gap-2 ${
          isDarkMode
            ? 'bg-amber-600 hover:bg-amber-700 text-white'
            : 'bg-amber-500 hover:bg-amber-600 text-white'
        }`}>
          <Plus className="w-4 h-4" />
          <span>Nueva Planificación</span>
        </button>
      </div>

      {/* Meal Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlans.map((plan) => (
          <div 
            key={plan.id} 
            className={`rounded-2xl border p-5 ${
              isDarkMode 
                ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-800/80' 
                : 'bg-white border-gray-200 hover:bg-gray-50'
            } transition-all duration-300 hover:shadow-lg`}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`font-bold text-lg ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                {plan.name}
              </h3>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {plan.client}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {new Date(plan.startDate).toLocaleDateString()} - {new Date(plan.endDate).toLocaleDateString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                  {plan.totalCalories} kcal/día
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(plan.status)}`}>
                  {plan.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlanList;