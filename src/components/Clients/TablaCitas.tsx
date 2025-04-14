// TablaCitas.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash } from 'lucide-react';
import type { Cita } from '../../types/servicios';

interface Props {
  datos: Cita[];
  isDarkMode: boolean;
  onEditCita?: (citaId: string) => void;
  onDeleteCita?: (citaId: string) => void;
}

const TablaCitas = ({ datos, isDarkMode, onEditCita, onDeleteCita }: Props) => {
  const [citasLocales, setCitasLocales] = useState<Cita[]>(datos);

  // Update local state when props change
  useEffect(() => {
    setCitasLocales(datos);
  }, [datos]);

  const handleEditClick = (citaId: string) => {
    if (onEditCita) {
      onEditCita(citaId);
    }
  };

  const handleDeleteClick = (citaId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/servicios/services/${citaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Error al eliminar la cita');
          }
          return response.json();
        })
        .then(data => {
          console.log('Cita eliminada con éxito:', data);
          
          // Remove the deleted appointment from the local state
          setCitasLocales(prevCitas => prevCitas.filter(cita => cita._id !== citaId));
          
          // Notify parent component if callback exists
          if (onDeleteCita) {
            onDeleteCita(citaId);
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('No se pudo eliminar la cita');
        });
    }
  };

  const getEstadoColor = (estado: string | undefined) => {
    if (!estado) return 'bg-gray-100 text-gray-800';

    switch (estado.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'completada':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto p-6">
      <div className="rounded-lg overflow-hidden shadow">
        <table className={`min-w-full divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <thead className={isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}>
            <tr>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Nombre
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Descripción
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Número de Citas
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Estado
              </th>
              <th scope="col" className={`px-6 py-3 text-left text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDarkMode ? 'divide-gray-700 bg-gray-900' : 'divide-gray-200 bg-white'}`}>
            {citasLocales.map((cita) => (
              <tr key={cita._id} className={isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'}>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {cita.nombre || 'Sin nombre'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {cita.descripcion || 'Sin descripción'}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                  {cita.numeroCitas || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(cita.estado)}`}>
                    {cita.estado || 'Pendiente'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEditClick(cita._id)}
                      className={`${
                        isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'
                      } transition-colors duration-150`}
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteClick(cita._id)}
                      className={`${
                        isDarkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'
                      } transition-colors duration-150`}
                    >
                      <Trash className="w-5 h-5" />
                    </motion.button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaCitas;
