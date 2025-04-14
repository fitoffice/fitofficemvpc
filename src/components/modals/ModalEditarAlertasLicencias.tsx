import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { createPortal } from 'react-dom';
import { useAlertContext } from '../../contexts/AlertContext';

interface ModalEditarAlertasLicenciasProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AlertaLicencia) => void;
  setError?: (error: string) => void;
  setSuccessMessage?: (message: string) => void;
  alertToEdit: AlertaLicencia | null;
}

interface AlertaLicencia {
  id?: string;
  _id?: string;
  nombre: string;
  fechaExpiracion: string;
  fechaFinAlerta?: string;
  fechaFinalizacion?: string;
  descripcion?: string;
  notas?: string;
  tipo?: string;
  estado?: string;
  contrato?: any;
  trainer?: any;
}

const ModalEditarAlertasLicencias: React.FC<ModalEditarAlertasLicenciasProps> = ({
  isOpen,
  onClose,
  onSubmit,
  setError,
  setSuccessMessage,
  alertToEdit
}) => {
  const { theme } = useTheme();
  const { updateAlert } = useAlertContext();
  const [formData, setFormData] = useState<AlertaLicencia>({
    nombre: '',
    fechaExpiracion: '',
    fechaFinalizacion: '',
    notas: ''
  });
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when alertToEdit changes
  useEffect(() => {
    if (alertToEdit) {
      console.log('Datos recibidos en ModalEditarAlertasLicencias:', alertToEdit);
      setFormData({
        id: alertToEdit.id || alertToEdit._id,
        _id: alertToEdit._id || alertToEdit.id,
        nombre: alertToEdit.nombre || '',
        fechaExpiracion: alertToEdit.fechaExpiracion ? new Date(alertToEdit.fechaExpiracion).toISOString().split('T')[0] : '',
        fechaFinalizacion: alertToEdit.fechaFinalizacion ? new Date(alertToEdit.fechaFinalizacion).toISOString().split('T')[0] : '',
        notas: alertToEdit.notas || '',
        tipo: alertToEdit.tipo || '',
        estado: alertToEdit.estado || '',
        contrato: alertToEdit.contrato || null,
        trainer: alertToEdit.trainer || null
      });
    }
  }, [alertToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Get the alert ID
      const alertId = formData._id || formData.id;
      const token = localStorage.getItem('token');

      // Make a PATCH request to the API endpoint
      const response = await fetch(`https://fitoffice2-ff8035a9df10.herokuapp.com/api/economic-alerts/${alertId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${token}`,

          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        if (setSuccessMessage) {
          setSuccessMessage('Alerta actualizada exitosamente');
          setTimeout(() => setSuccessMessage(''), 3000);
        }
        
        // Notify parent component
        onSubmit(formData);
        
        // Close the modal
        onClose();
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Error al actualizar la alerta';
        
        if (setError) {
          setError(errorMessage);
        } else {
          setLocalError(errorMessage);
        }
      }
    } catch (error: any) {
      const errorMessage = `Error al actualizar la alerta: ${error.message}`;
      if (setError) {
        setError(errorMessage);
      } else {
        setLocalError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`w-full max-w-md p-6 rounded-lg shadow-xl relative z-[10000] ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Editar Alerta de Licencia</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {localError && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              theme === 'dark' ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-800'
            }`}>
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Nombre de la Alerta
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                placeholder="Ingrese el nombre de la alerta"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha de la alerta
              </label>
              <input
                type="date"
                name="fechaExpiracion"
                value={formData.fechaExpiracion}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Fecha Expiracion de Alerta
              </label>
              <input
                type="date"
                name="fechaFinalizacion"
                value={formData.fechaFinalizacion}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Descripción (Opcional)
              </label>
              <textarea
                name="notas"
                value={formData.notas}
                onChange={handleChange}
                className={`w-full p-2 rounded-md border ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-300'
                }`}
                rows={3}
                placeholder="Añade una descripción para la alerta..."
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 rounded-md ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar Alerta'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default ModalEditarAlertasLicencias;