import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MetricsContextType {
  loading: boolean;
  error: string | null;
  totalGastos: number;
  totalIngresos: number;
  ingresoMensual: number;
  gastoMensual: number;
  proyeccionMensual: number;
  beneficioNeto: number;
  margenGanancia: number;
  clientesNuevos: number;
  totalClientes: number;
  fetchData: () => Promise<void>;
}

const MetricsContext = createContext<MetricsContextType | undefined>(undefined);

export const useMetrics = () => {
  const context = useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics debe ser usado dentro de un MetricsProvider');
  }
  return context;
};

interface MetricsProviderProps {
  children: ReactNode;
}

export const MetricsProvider: React.FC<MetricsProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalGastos, setTotalGastos] = useState(0);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [ingresoMensual, setIngresoMensual] = useState(0);
  const [gastoMensual, setGastoMensual] = useState(0);
  const [clientesNuevos, setClientesNuevos] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);

  const getToken = () => localStorage.getItem('token');

  const fetchGastos = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/gastos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los gastos.');
      }

      const responseData = await response.json();
      const gastos = responseData.data.gastos;
      
      if (!Array.isArray(gastos)) {
        throw new Error('Los datos de gastos no tienen el formato esperado');
      }
      
      // Calcular total de gastos
      const total = gastos.reduce((sum, gasto) => {
        const valor = gasto.monto || gasto.importe || 0;
        return sum + valor;
      }, 0);
      
      setTotalGastos(total);
      
      // Calcular gastos mensuales
      const ahora = new Date();
      const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const gastosMes = gastos.filter((gasto) => {
        const fechaGasto = new Date(gasto.fecha);
        return fechaGasto >= primerDiaMes && fechaGasto <= ahora;
      });

      const totalGastosMes = gastosMes.reduce((sum, gasto) => {
        return sum + (gasto.monto || gasto.importe || 0);
      }, 0);

      setGastoMensual(totalGastosMes);
      
    } catch (err: any) {
      console.error('Error al obtener gastos:', err);
      setError(err.message || 'Error desconocido.');
    }
  };

  const fetchIngresos = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/ingresos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los ingresos.');
      }

      const ingresos = await response.json();
      
      // Calcular ingreso total
      const total = ingresos.reduce((sum, ingreso) => {
        return sum + (ingreso.monto || ingreso.importe || 0);
      }, 0);
      setTotalIngresos(total);

      // Calcular ingreso mensual
      const ahora = new Date();
      const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const ingresosMes = ingresos.filter((ingreso) => {
        const fechaIngreso = new Date(ingreso.fecha);
        return fechaIngreso >= primerDiaMes;
      });

      const totalMes = ingresosMes.reduce((sum, ingreso) => {
        return sum + (ingreso.monto || ingreso.importe || 0);
      }, 0);
      setIngresoMensual(totalMes);
    } catch (err: any) {
      console.error('Error al obtener ingresos:', err);
      setError(err.message || 'Error desconocido.');
    }
  };

  const fetchClientes = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('Token no encontrado. Por favor, inicia sesión nuevamente.');
      }

      const response = await fetch('https://fitoffice2-ff8035a9df10.herokuapp.com/api/clientes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener los clientes');
      }

      const clientes = await response.json();
      
      // Total de clientes
      setTotalClientes(clientes.length);

      // Clientes nuevos del mes actual
      const ahora = new Date();
      const primerDiaMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const clientesDelMes = clientes.filter((cliente) => {
        const fechaRegistro = new Date(cliente.fechaRegistro);
        return fechaRegistro >= primerDiaMes;
      });

      setClientesNuevos(clientesDelMes.length);
    } catch (err: any) {
      console.error('Error al obtener clientes:', err);
      setError(err.message || 'Error desconocido.');
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        fetchGastos(),
        fetchIngresos(),
        fetchClientes()
      ]);
    } catch (err: any) {
      console.error('Error al obtener datos:', err);
      setError(err.message || 'Error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cálculos derivados
  const beneficioNeto = totalIngresos - totalGastos;
  const proyeccionMensual = ingresoMensual - gastoMensual;
  const margenGanancia = totalIngresos === 0 ? 0 : ((totalIngresos - totalGastos) / totalIngresos) * 100;

  const value = {
    loading,
    error,
    totalGastos,
    totalIngresos,
    ingresoMensual,
    gastoMensual,
    proyeccionMensual,
    beneficioNeto,
    margenGanancia,
    clientesNuevos,
    totalClientes,
    fetchData
  };

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
};

export default MetricsProvider;