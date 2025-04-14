import React, { useState } from 'react';

interface ConfirmApplyPeriodModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmApplyPeriodModal: React.FC<ConfirmApplyPeriodModalProps> = ({ onConfirm, onCancel }) => {
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('normal');
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirmar Aplicar Periodo</h2>
        <p className="mb-4">¿Estás seguro de que deseas aplicar este periodo?</p>
        
        {/* Example fields added */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de aplicación
          </label>
          <input 
            type="date" 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Baja</option>
            <option value="normal">Normal</option>
            <option value="high">Alta</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notas adicionales
          </label>
          <textarea 
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Añade notas sobre este periodo..."
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <button onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">
            Cancelar
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-indigo-600 text-white rounded-md">
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmApplyPeriodModal;
