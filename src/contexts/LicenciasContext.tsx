import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface Licencia {
  _id: string;
  nombre: string;
  fechaExpiracion: string;
  estado: 'Activa' | 'Expirada' | 'Suspendida' | 'En Proceso';
  descripcion: string;
  campo: string;
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  status: string;
  results: number;
  data: {
    licenses: Licencia[];
  };
}

interface LicenciasContextType {
  licencias: Licencia[];
  isLoading: boolean;
  error: string | null;
  fetchLicencias: () => Promise<void>;
  addLicencia: (licencia: Omit<Licencia, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLicencia: (id: string, licencia: Partial<Licencia>) => Promise<void>;
  deleteLicencia: (id: string) => Promise<void>;
}

const LicenciasContext = createContext<LicenciasContextType | undefined>(undefined);

export const useLicencias = () => {
  const context = useContext(LicenciasContext);
  if (!context) {
    throw new Error('useLicencias must be used within a LicenciasProvider');
  }
  return context;
};

interface LicenciasProviderProps {
  children: ReactNode;
}

export const LicenciasProvider: React.FC<LicenciasProviderProps> = ({ children }) => {
  const [licencias, setLicencias] = useState<Licencia[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLicencias = async () => {
    try {
      setIsLoading(true);
      console.log('Iniciando la obtención de licencias desde el contexto...');
      const token = localStorage.getItem('token');
      
      const response = await axios.get<ApiResponse>(
<<<<<<< HEAD
        'https://fitoffice2-ff8035a9df10.herokuapp.com/api/licenses',
=======
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/licenses',
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log('Respuesta de la API (contexto):', response.data);
      const licenciasData = response.data.data.licenses || [];
      console.log('Licencias obtenidas (contexto):', licenciasData.length);
      setLicencias(licenciasData);
      setError(null);
    } catch (error) {
      console.error('Error al obtener licencias (contexto):', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error (contexto):', error.response?.data);
        console.error('Estado HTTP (contexto):', error.response?.status);
        setError(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        setError('Error desconocido al obtener licencias');
      }
      setLicencias([]);
    } finally {
      setIsLoading(false);
      console.log('Proceso de obtención de licencias finalizado (contexto)');
    }
  };

  const addLicencia = async (licencia: Omit<Licencia, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
<<<<<<< HEAD
        'https://fitoffice2-ff8035a9df10.herokuapp.com/api/licenses',
=======
        'https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/licenses',
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        licencia,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Refetch all licenses to ensure we have the latest data
        await fetchLicencias();
      } else {
        setError('Error al crear la licencia');
      }
    } catch (error: any) {
      console.error('Error al añadir licencia:', error);
      setError(error.response?.data?.message || 'Error al crear la licencia');
    } finally {
      setIsLoading(false);
    }
  };

  const updateLicencia = async (id: string, licencia: Partial<Licencia>) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.put(
<<<<<<< HEAD
        `https://fitoffice2-ff8035a9df10.herokuapp.com/api/licenses/${id}`,
=======
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/licenses/${id}`,
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        licencia,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        }
      );
      
      if (response.data.status === 'success') {
        // Refetch all licenses to ensure we have the latest data
        await fetchLicencias();
      } else {
        setError('Error al actualizar la licencia');
      }
    } catch (error: any) {
      console.error('Error al actualizar licencia:', error);
      setError(error.response?.data?.message || 'Error al actualizar la licencia');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLicencia = async (id: string) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.delete(
<<<<<<< HEAD
        `https://fitoffice2-ff8035a9df10.herokuapp.com/api/licenses/${id}`,
=======
        `https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/licenses/${id}`,
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.status === 200 || response.status === 204) {
        // Update the local state by removing the deleted license
        setLicencias(prevLicencias => prevLicencias.filter(lic => lic._id !== id));
        setError(null);
      } else {
        setError('Error al eliminar la licencia');
      }
    } catch (error: any) {
      console.error('Error al eliminar licencia:', error);
      setError(error.response?.data?.message || 'Error al eliminar la licencia');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchLicencias();
  }, []);

  const value = {
    licencias,
    isLoading,
    error,
    fetchLicencias,
    addLicencia,
    updateLicencia,
    deleteLicencia
  };

  return (
    <LicenciasContext.Provider value={value}>
      {children}
    </LicenciasContext.Provider>
  );
};

export default LicenciasContext;