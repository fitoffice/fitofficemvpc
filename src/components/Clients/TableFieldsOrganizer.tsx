import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, GripVertical } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

// Define all available columns
const ALL_COLUMNS = [
  'Nombre',
  'Email',
  'Teléfono',
  'Estado',
  'Tag',
  'Plan de Pago',
  'Servicio',
  'Último Checkin',
  'Alertas',
  'Fecha Registro',
];

interface TableFieldsOrganizerProps {
  visibleColumns: string[];
  setVisibleColumns: (columns: string[]) => void;
  onClose: () => void;
}

const TableFieldsOrganizer: React.FC<TableFieldsOrganizerProps> = ({
    visibleColumns,
    setVisibleColumns,
    onClose,
  }) => {
    const { theme } = useTheme();
    const [localColumns, setLocalColumns] = useState<string[]>([...visibleColumns]);
    const [availableColumns, setAvailableColumns] = useState<string[]>(
      ALL_COLUMNS.filter(col => !visibleColumns.includes(col))
    );
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
  
  // Reset local columns when visible columns change
  useEffect(() => {
    setLocalColumns([...visibleColumns]);
    setAvailableColumns(ALL_COLUMNS.filter(col => !visibleColumns.includes(col)));
  }, [visibleColumns]);

  const toggleColumn = (column: string) => {
    if (localColumns.includes(column)) {
      // Don't allow removing all columns - at least one must remain
      if (localColumns.length > 1) {
        setLocalColumns(localColumns.filter(col => col !== column));
      }
    } else {
      setLocalColumns([...localColumns, column]);
    }
  };

  const handleDragStart = (column: string) => {
    setDraggedItem(column);
  };

  const handleDragOver = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetColumn) return;

    const draggedIndex = localColumns.indexOf(draggedItem);
    const targetIndex = localColumns.indexOf(targetColumn);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a new array with the item moved to the new position
    const newColumns = [...localColumns];
    newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, draggedItem);

    setLocalColumns(newColumns);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const applyChanges = () => {
    setVisibleColumns(localColumns);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`absolute right-0 top-full mt-2 z-50 w-72 p-4 rounded-xl shadow-lg border ${
        theme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Organizar columnas
        </h3>
        <button
          onClick={onClose}
          className={`p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700`}
        >
          <X size={18} />
        </button>
      </div>

      <div className="mb-4">
        <p className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Selecciona y ordena las columnas visibles:
        </p>
        
        <div className={`p-2 rounded-lg mb-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Columnas visibles ({localColumns.length})
          </p>
          <div className="space-y-2">
            {localColumns.map((column) => (
              <div
                key={column}
                draggable
                onDragStart={() => handleDragStart(column)}
                onDragOver={(e) => handleDragOver(e, column)}
                onDragEnd={handleDragEnd}
                className={`flex items-center justify-between p-2 rounded-lg cursor-move ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                } ${draggedItem === column ? 'opacity-50' : 'opacity-100'}`}
              >
                <div className="flex items-center">
                  <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                    {column}
                  </span>
                </div>
                <button
                  onClick={() => toggleColumn(column)}
                  className={`p-1 rounded-full ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <p className={`text-xs font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            Columnas disponibles ({ALL_COLUMNS.length - localColumns.length})
          </p>
          <div className="space-y-2">
            {ALL_COLUMNS.filter(col => !localColumns.includes(col)).map((column) => (
              <div
                key={column}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleColumn(column)}
              >
                <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
                  {column}
                </span>
                <button
                  className={`p-1 rounded-full ${
                    theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                >
                  <Check size={16} className="text-green-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={onClose}
          className={`px-3 py-1.5 text-sm rounded-lg ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Cancelar
        </button>
        <button
          onClick={applyChanges}
          className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Aplicar
        </button>
      </div>
    </motion.div>
  );
};

export default TableFieldsOrganizer;