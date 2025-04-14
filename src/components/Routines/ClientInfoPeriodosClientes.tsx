import React from 'react';
import { X, Mail, Phone, User, Calendar, Weight, Ruler, Award } from 'lucide-react';

interface ClientInfoProps {
  clienteInfo?: any;
  onClose: () => void;
}

// Datos de prueba para cuando no hay información de cliente
const datosClientePrueba = {
  nombre: "Juan",
  apellido: "Pérez García",
  edad: 32,
  peso: 78.5,
  altura: 182,
  telefono: "+34 612 345 678",
  email: "juan.perez@ejemplo.com",
  rms: [
    { ejercicio: "Press Banca", marca: "95 kg" },
    { ejercicio: "Sentadilla", marca: "120 kg" },
    { ejercicio: "Peso Muerto", marca: "140 kg" },
    { ejercicio: "Press Militar", marca: "65 kg" },
    { ejercicio: "Dominadas", marca: "15 reps" }
  ]
};

const ClientInfoPeriodosClientes: React.FC<ClientInfoProps> = ({ clienteInfo, onClose }) => {
  // Usar datos de prueba si no hay clienteInfo y estamos en desarrollo
  const infoMostrada = clienteInfo || (process.env.NODE_ENV === 'development' ? datosClientePrueba : null);
  
  return (
    <div className="w-full md:w-1/4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-700 h-fit shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h4 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-500" />
          Información del Cliente
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-500 hover:text-red-500 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        {infoMostrada ? (
          <>
            <div className="p-4 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-1">
                <User className="w-4 h-4 text-blue-500 mr-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Nombre completo</p>
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-white pl-6">
                {infoMostrada.nombre || 'N/A'} {infoMostrada.apellido || ''}
              </p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-1">
                <Mail className="w-4 h-4 text-blue-500 mr-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</p>
              </div>
              <p className="text-base text-gray-900 dark:text-white pl-6">{infoMostrada.email || 'N/A'}</p>
            </div>
            
            <div className="p-4 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-1">
                <Phone className="w-4 h-4 text-blue-500 mr-2" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</p>
              </div>
              <p className="text-base text-gray-900 dark:text-white pl-6">{infoMostrada.telefono || 'N/A'}</p>
            </div>

            <div className="p-4 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-3">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Datos físicos</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-center">
                  <div className="flex justify-center mb-1">
                    <Calendar className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Edad</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{infoMostrada.edad || 'N/A'} años</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-center">
                  <div className="flex justify-center mb-1">
                    <Weight className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Peso</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{infoMostrada.peso || 'N/A'} kg</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded-lg text-center">
                  <div className="flex justify-center mb-1">
                    <Ruler className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Altura</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{infoMostrada.altura || 'N/A'} cm</p>
                </div>
              </div>
            </div>

            {infoMostrada.rms && infoMostrada.rms.length > 0 && (
              <div className="p-4 bg-white dark:bg-gray-800/80 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-3">
                  <Award className="w-4 h-4 text-blue-500 mr-2" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">RMs y Marcas</p>
                </div>
                <div className="space-y-2 pl-6">
                  {infoMostrada.rms.map((rm: any, index: number) => (
                    <div key={index} className="flex justify-between text-sm p-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <span className="text-gray-700 dark:text-gray-300">{rm.ejercicio}</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{rm.marca}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-8 text-center">
            <User className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No hay información disponible del cliente
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientInfoPeriodosClientes;