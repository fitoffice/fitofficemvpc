import React from 'react';

// Interface for client data
interface ClientData {
  _id: string;
  nombre: string;
  email: string;
  genero: string;
  telefono: string;
  altura: number;
  peso: Array<{
    valor: number;
    fecha: string;
    _id: string;
  }>;
}

interface ClientInfoPanelProps {
  loading: boolean;
  error: string | null;
  clientData: ClientData | null;
  dietData: any;
}

const ClientInfoPanel: React.FC<ClientInfoPanelProps> = ({
  loading,
  error,
  clientData,
  dietData
}) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Información del Cliente</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg text-red-700 dark:text-red-400">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800/50 rounded-xl p-4 shadow-sm">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Nombre</label>
            <p className="text-gray-800 dark:text-white font-medium">
              {clientData?.nombre || dietData?.cliente?.nombre || 'No disponible'}
            </p>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email</label>
            <p className="text-gray-800 dark:text-white font-medium">
              {clientData?.email || dietData?.cliente?.email || 'No disponible'}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Peso</label>
              <p className="text-gray-800 dark:text-white font-medium">
                {clientData?.peso && clientData.peso.length > 0 
                  ? `${clientData.peso[0].valor} kg` 
                  : dietData?.cliente?.peso 
                    ? `${dietData.cliente.peso} kg` 
                    : 'No disponible'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Altura</label>
              <p className="text-gray-800 dark:text-white font-medium">
                {clientData?.altura 
                  ? `${clientData.altura} cm` 
                  : dietData?.cliente?.altura 
                    ? `${dietData.cliente.altura} cm` 
                    : 'No disponible'}
              </p>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Género</label>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              <p className="text-gray-800 dark:text-white font-medium">
                {clientData?.genero || dietData?.cliente?.genero || 'No disponible'}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <div className="flex items-center space-x-2 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd" />
          </svg>
          <h4 className="text-md font-semibold text-gray-800 dark:text-white">Valores Calculados</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">BMR</label>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              1,745 <span className="text-xs font-normal text-gray-500 dark:text-gray-400">kcal</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">TDEE</label>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              2,705 <span className="text-xs font-normal text-gray-500 dark:text-gray-400">kcal</span>
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">MET</label>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              1.55
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800/50 rounded-lg p-3 shadow-sm">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">BMI</label>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              23.1
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfoPanel;