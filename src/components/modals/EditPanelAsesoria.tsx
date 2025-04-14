import React, { useState, useEffect } from 'react';
<<<<<<< HEAD
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
import { ServicioAsesoriaSubscripcion } from '../../types/servicios';
import { useTheme } from '../../contexts/ThemeContext';

interface EditPanelAsesoriaProps {
  isOpen: boolean;
  onClose: () => void;
  asesoria: ServicioAsesoriaSubscripcion | null;
  onUpdate: (updatedAsesoria: ServicioAsesoriaSubscripcion) => void;
}

const EditPanelAsesoria: React.FC<EditPanelAsesoriaProps> = ({
  isOpen,
  onClose,
  asesoria,
  onUpdate,
}) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const [formData, setFormData] = useState<Partial<ServicioAsesoriaSubscripcion>>({
    nombre: '',
    descripcion: '',
    precio: 0,
    duracion: '',
    tipo: 'asesoria',
<<<<<<< HEAD
    serviciosAdicionales: [],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

=======
  });

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  useEffect(() => {
    if (asesoria) {
      setFormData({
        nombre: asesoria.nombre,
        descripcion: asesoria.descripcion,
        precio: asesoria.precio,
        duracion: asesoria.duracion,
        tipo: asesoria.tipo,
<<<<<<< HEAD
        serviciosAdicionales: asesoria.serviciosAdicionales || [],
=======
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      });
    }
  }, [asesoria]);

<<<<<<< HEAD
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
=======
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'precio' ? parseFloat(value) : value,
    }));
  };

<<<<<<< HEAD
  const handleServicioAdicionalChange = (servicio: 'Pack de Citas' | 'Planificacion' | 'Dietas') => {
    setFormData(prev => {
      const servicios = prev.serviciosAdicionales?.includes(servicio)
        ? prev.serviciosAdicionales.filter(s => s !== servicio)
        : [...(prev.serviciosAdicionales || []), servicio];
      return { ...prev, serviciosAdicionales: servicios };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (asesoria && formData) {
        onUpdate({
          ...asesoria,
          ...formData,
        });
      }
      onClose();
    } catch (error) {
      console.error('Error al actualizar la asesoría:', error);
      setError(error instanceof Error ? error.message : 'Error al actualizar la asesoría');
    } finally {
      setIsLoading(false);
    }
=======
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (asesoria && formData) {
      onUpdate({
        ...asesoria,
        ...formData,
      });
    }
    onClose();
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  };

  if (!isOpen) return null;

  return (
<<<<<<< HEAD
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl transform transition-all`}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Editar Asesoría Individual
                  </h3>
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    onClick={onClose}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
                    <p className="font-medium">Error</p>
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nombre Field */}
                  <div>
                    <label htmlFor="nombre" className="block text-sm font-semibold mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Nombre de la asesoría"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Descripción Field */}
                  <div>
                    <label htmlFor="descripcion" className="block text-sm font-semibold mb-2">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Describe la asesoría"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Precio Field */}
                  <div>
                    <label htmlFor="precio" className="block text-sm font-semibold mb-2">
                      Precio
                    </label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      required
                      placeholder="Precio de la asesoría"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               dark:bg-gray-700 dark:text-white transition-colors"
                    />
                  </div>

                  {/* Duración Field */}
                  

                  {/* Servicios Adicionales Field */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Servicios Adicionales
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {(['Pack de Citas', 'Planificacion', 'Dietas'] as const).map((servicio) => (
                        <label
                          key={servicio}
                          className={`flex items-center p-3 rounded-lg border ${
                            formData.serviciosAdicionales?.includes(servicio)
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                          } cursor-pointer transition-colors`}
                        >
                          <input
                            type="checkbox"
                            checked={formData.serviciosAdicionales?.includes(servicio) || false}
                            onChange={() => handleServicioAdicionalChange(servicio)}
                            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className={`text-sm ${
                            formData.serviciosAdicionales?.includes(servicio)
                              ? 'text-blue-600 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300'
                          }`}>
                            {servicio}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-6 py-2 rounded-lg font-medium transition-colors
                               bg-gray-100 hover:bg-gray-200 text-gray-700
                               dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-2 rounded-lg font-medium text-white 
                               bg-gradient-to-r from-blue-600 to-blue-400 
                               hover:from-blue-700 hover:to-blue-500 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Actualizando...
                        </span>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EditPanelAsesoria;
=======
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className={`relative p-6 rounded-lg shadow-lg w-full max-w-md ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Editar Asesoría Individual</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Descripción:</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Precio:</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div>
            <label className="block mb-1">Duración:</label>
            <input
              type="text"
              name="duracion"
              value={formData.duracion}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              }`}
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded ${
                isDarkMode
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPanelAsesoria;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
