import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Trash,
  Download,
  Share2,
  Plus,
<<<<<<< HEAD
  Columns, // Added Columns icon
  Upload, // Added Upload icon for CSV import
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';
import FilterPanel from './FilterPanel';
<<<<<<< HEAD
import TableFieldsOrganizer from './TableFieldsOrganizer'; // Import the new component
import CSVPopup from './CSVPopup'; // Import the new CSVPopup component
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

interface Filters {
  estado: string;
  tag: string;
  tipoPlan: string;
  clase: string;
  servicio: string;
}

interface ClientListHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterOpen: boolean;
  setFilterOpen: (open: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  selectedClientsCount: number;
  viewMode: 'table' | 'simple';
  setViewMode: (mode: 'table' | 'simple') => void;
  onCreateClient: () => void;
  selectedClients: string[]; // Add this prop to receive selected client IDs
  refreshClients: () => void; // Add this prop to refresh the client list after deletion
<<<<<<< HEAD
  visibleColumns?: string[]; // Add this prop
  setVisibleColumns?: (columns: string[]) => void; // Add this prop
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
}

const ClientListHeader: React.FC<ClientListHeaderProps> = ({
  searchTerm,
  setSearchTerm,
  filterOpen,
  setFilterOpen,
  filters,
  setFilters,
  selectedClientsCount,
  viewMode,
  setViewMode,
  onCreateClient,
  selectedClients, // Destructure the new prop
<<<<<<< HEAD
  refreshClients,
  visibleColumns, // Add these props to the destructuring
  setVisibleColumns,
}) => {
  const { theme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
  const [tableFieldsOpen, setTableFieldsOpen] = useState(false);
  const [csvPopupOpen, setCsvPopupOpen] = useState(false); // Add state for CSV popup
=======
  refreshClients, // Destructure the refresh function
}) => {
  const { theme } = useTheme();
  const [isDeleting, setIsDeleting] = useState(false);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

  // Function to handle deleting multiple clients
  const handleDeleteMultipleClients = async () => {
    if (selectedClients.length === 0) return;
    
    if (!confirm(`¿Estás seguro de que deseas eliminar ${selectedClientsCount} cliente${selectedClientsCount !== 1 ? 's' : ''}?`)) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log("Selected client IDs for deletion:", selectedClients);
      
      // Track successful deletions
      let successCount = 0;
      let failedIds = [];
      
      // Process each client ID individually
      for (const clientId of selectedClients) {
        try {
          console.log(`Sending DELETE request for client ID: ${clientId}`);
          
          // Log the complete request information for this client
<<<<<<< HEAD
          console.log(`DELETE Request to: https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes/${clientId}`);
=======
          console.log(`DELETE Request to: https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${clientId}`);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          console.log("Headers:", {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          });
          
<<<<<<< HEAD
          const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes/${clientId}`, {
=======
          const response = await fetch(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clientes/${clientId}`, {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          
          if (!response.ok) {
            console.error(`Failed to delete client ${clientId}: ${response.status} ${response.statusText}`);
            failedIds.push(clientId);
          } else {
            successCount++;
            console.log(`Successfully deleted client ${clientId}`);
          }
        } catch (err) {
          console.error(`Error deleting client ${clientId}:`, err);
          failedIds.push(clientId);
        }
      }
      
      // Show appropriate message based on results
      if (successCount === selectedClients.length) {
        alert(`${successCount} cliente${successCount !== 1 ? 's' : ''} eliminado${successCount !== 1 ? 's' : ''} correctamente.`);
      } else if (successCount > 0) {
        alert(`${successCount} de ${selectedClients.length} cliente${selectedClients.length !== 1 ? 's' : ''} eliminado${successCount !== 1 ? 's' : ''} correctamente. Algunos clientes no pudieron ser eliminados.`);
      } else {
        alert('No se pudo eliminar ningún cliente. Por favor, inténtalo de nuevo.');
      }
      
      // Refresh the client list regardless of partial success
      refreshClients();
    } catch (error) {
      console.error('Error in delete operation:', error);
      alert(`Error al eliminar clientes: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsDeleting(false);
    }
  };  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-white'
                  : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('simple')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'simple'
                  ? 'bg-blue-500 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
          </div>

<<<<<<< HEAD
          {/* CSV Import Button */}
          <Button 
            variant="filter" 
            onClick={() => setCsvPopupOpen(true)}
            className="flex items-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            Importar CSV
          </Button>

=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          <div className="relative">
            <Button
              variant="filter"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtros
            </Button>
            {filterOpen && <FilterPanel filters={filters} setFilters={setFilters} />}
          </div>

<<<<<<< HEAD
          {/* Add Table Fields Organizer Button */}
          {viewMode === 'table' && setVisibleColumns && (
            <div className="relative">
              <Button
                variant="filter"
                onClick={() => setTableFieldsOpen(!tableFieldsOpen)}
                className="flex items-center"
              >
                <Columns className="w-5 h-5 mr-2" />
                Columnas
              </Button>
              {tableFieldsOpen && visibleColumns && (
                <TableFieldsOrganizer 
                  visibleColumns={visibleColumns} 
                  setVisibleColumns={setVisibleColumns}
                  onClose={() => setTableFieldsOpen(false)}
                />
              )}
            </div>
          )}

=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
          {/* Botón "Nuevo Cliente" con onClick */}
          <Button variant="create" onClick={onCreateClient} className="flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

<<<<<<< HEAD
      {/* CSV Popup */}
      {csvPopupOpen && (
        <CSVPopup 
          onClose={() => setCsvPopupOpen(false)} 
          onImportSuccess={() => {
            refreshClients();
            setCsvPopupOpen(false);
          }}
        />
      )}

=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      {selectedClientsCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`flex items-center justify-between p-4 rounded-xl border 
            ${theme === 'dark' 
              ? 'bg-gray-800/90 border-gray-700 shadow-lg shadow-gray-900/20' 
              : 'bg-white/90 border-gray-200 shadow-lg shadow-gray-200/40'
            } backdrop-blur-sm backdrop-filter`}
        >
          <div className="flex items-center space-x-2">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg 
              ${theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
              <span className="text-sm font-semibold text-blue-500">
                {selectedClientsCount}
              </span>
            </div>
            <span className="text-sm font-medium">
              cliente{selectedClientsCount !== 1 && 's'}{' '}
              seleccionado{selectedClientsCount !== 1 && 's'}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              variant="csv" 
              size="sm" 
              className={`flex items-center transition-all duration-200 hover:scale-105
                ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <Download className="w-4 h-4 mr-2 text-gray-500" />
              <span>Exportar</span>
            </Button>
            <Button 
              variant="danger" 
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteMultipleClients}
              className="flex items-center transition-all duration-200 hover:scale-105 hover:bg-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ClientListHeader;
