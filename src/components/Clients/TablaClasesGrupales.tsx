// TablaClasesGrupales.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash, ChevronRight, Plus } from 'lucide-react';
import TablaPlanesServicio from './TablaPlanesServicio';
import EditPopupClaseGrupal from '../modals/EditPopupClaseGrupal';
import type { ClaseGrupal, PlanPago } from '../types/servicios';

interface Props {
  datos: ClaseGrupal[];
  isDarkMode: boolean;
  onEditClase?: (claseId: string) => void;
  onDeletePlan?: (planId: string) => void;
  onAddPaymentPlan?: (claseId: string, nuevoPlan: PlanPago) => void;
  onOpenPaymentPlan?: (claseId: string) => void;
  onOpenAsociarPlanCliente?: (paymentPlanId: string) => void;
  onDeleteClase?: (claseId: string) => void; // Add this prop for parent component updates
}

const TablaClasesGrupales: React.FC<Props> = ({ 
  datos, 
  isDarkMode, 
  onEditClase,
  onDeletePlan,
  onAddPaymentPlan,
  onOpenPaymentPlan,
  onOpenAsociarPlanCliente,
  onDeleteClase
}) => {
  const [claseExpandida, setClaseExpandida] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [claseEditando, setClaseEditando] = useState<ClaseGrupal | null>(null);
  const [clasesLocales, setClasesLocales] = useState<ClaseGrupal[]>(datos);

  // Update local state when props change
  React.useEffect(() => {
    setClasesLocales(datos);
  }, [datos]);

  const handleEditClick = (claseId: string) => {
    if (onEditClase) {
      onEditClase(claseId);
    }
  };

  const handleDeleteClick = (claseId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta clase grupal?')) {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/servicios/services/${claseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar la clase grupal');
          }
          return response.json();
        })
        .then(data => {
          console.log('Clase grupal eliminada con éxito:', data);
          
          // Remove the deleted class from the local state
          setClasesLocales(prevClases => prevClases.filter(clase => clase._id !== claseId));
          
          // If expanded class is the deleted one, collapse it
          if (claseExpandida === claseId) {
            setClaseExpandida(null);
          }
          
          // Notify parent component if callback exists
          if (onDeleteClase) {
            onDeleteClase(claseId);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('No se pudo eliminar la clase grupal');
        });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setClaseEditando(null);
  };

  const handleUpdateClase = (claseActualizada: ClaseGrupal) => {
    if (onEditClase) {
      onEditClase(claseActualizada._id);
    }
    handleModalClose();
  };

  return (
    <div className="overflow-x-auto p-6">
      <div className="rounded-lg overflow-hidden shadow">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th className={`px-6 py-4 text-left text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Clase
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Capacidad
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Planes de Pago
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {clasesLocales.map((clase, index) => {
              const planes = clase.planesDePago || [];
              return (
                <React.Fragment key={clase._id}>
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={isDarkMode ? 'bg-gray-900' : 'bg-white'}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => setClaseExpandida(claseExpandida === clase._id ? null : clase._id)}
                          className={`mr-2 transform transition-transform duration-200 ${
                            claseExpandida === clase._id ? 'rotate-90' : ''
                          }`}
                        >
                          <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                        </button>
                        <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                          {clase.nombre}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span className={isDarkMode ? 'text-gray-200' : 'text-gray-900'}>
                        {clase.capacidad}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 text-sm rounded-full ${
                          planes.length > 0
                            ? isDarkMode
                              ? 'bg-green-900/30 text-green-400'
                              : 'bg-green-100 text-green-800'
                            : isDarkMode
                            ? 'bg-gray-800 text-gray-400'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {planes.length}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {onOpenPaymentPlan && (
                          <button
                            onClick={() => onOpenPaymentPlan(clase._id)}
                            className={`p-1.5 rounded-lg transition-colors duration-150 ${
                              isDarkMode
                                ? 'hover:bg-blue-900/30 text-blue-400'
                                : 'hover:bg-blue-100 text-blue-600'
                            }`}
                            title="Añadir plan de pago"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(clase._id)}
                          className={`p-1.5 rounded-lg transition-colors duration-150 ${
                            isDarkMode
                              ? 'hover:bg-gray-800 text-gray-300'
                              : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(clase._id)}
                          className={`p-1.5 rounded-lg transition-colors duration-150 ${
                            isDarkMode
                              ? 'hover:bg-red-900/30 text-red-400'
                              : 'hover:bg-red-100 text-red-600'
                          }`}
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>

                  {claseExpandida === clase._id && planes.length > 0 && (
                    <tr>
                      <td colSpan={3} className={`px-6 py-4 ${isDarkMode ? 'bg-gray-800/50' : 'bg-gray-50/50'}`}>
                        <TablaPlanesServicio
                          planes={planes}
                          isDarkMode={isDarkMode}
                          onDeletePlan={onDeletePlan}
                          onAsociarPlanCliente={onOpenAsociarPlanCliente}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <EditPopupClaseGrupal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        clase={claseEditando}
        onSubmit={handleUpdateClase}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default TablaClasesGrupales;
