import { useMetrics } from '../components/Economics/Metrics/MetricsProvider';
import { TrendingUp, DollarSign, PieChart, Users } from 'lucide-react';
import React from 'react';

export const useFormattedMetrics = () => {
  const {
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
    totalClientes
  } = useMetrics();

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  const metricData = [
    { 
      id: 'proyeccionMes',
      title: "Proyección del mes", 
      value: loading ? "Cargando..." : formatCurrency(proyeccionMensual), 
      icon: <TrendingUp className="w-6 h-6 text-green-500" />, 
      change: proyeccionMensual >= 0 ? "↑" : "↓" 
    },
    { 
      id: 'gastoMensual',
      title: "Gasto Mensual", 
      value: loading ? "Cargando..." : error ? "Error" : formatCurrency(gastoMensual), 
      icon: <DollarSign className="w-6 h-6 text-red-500" />, 
      change: gastoMensual > 0 ? "↑" : "↓" 
    },
    { 
      id: 'beneficioNeto',
      title: "Beneficio neto", 
      value: loading ? "Cargando..." : formatCurrency(beneficioNeto), 
      icon: <TrendingUp className="w-6 h-6 text-blue-500" />, 
      change: beneficioNeto > 0 ? "↑" : "↓" 
    },
    { 
      id: 'ingresos',
      title: "Ingresos", 
      value: loading ? "Cargando..." : formatCurrency(totalIngresos), 
      icon: <DollarSign className="w-6 h-6 text-green-500" />, 
      change: totalIngresos > 0 ? "↑" : "↓" 
    },
    { 
      id: 'margenGanancia',
      title: "Margen de ganancia", 
      value: loading ? "Cargando..." : `${margenGanancia.toFixed(2)}%`, 
      icon: <PieChart className="w-6 h-6 text-purple-500" />, 
      change: margenGanancia > 0 ? "↑" : "↓" 
    },
    { 
      id: 'clientesNuevos',
      title: "Clientes Nuevos (este mes)", 
      value: loading ? "Cargando..." : clientesNuevos.toString(), 
      icon: <Users className="w-6 h-6 text-yellow-500" />, 
      change: clientesNuevos > 0 ? `↑ ${clientesNuevos}` : "↓" 
    },
    {
      id: 'clientesActuales',
      title: "Clientes Actuales",
      value: loading ? "Cargando..." : totalClientes.toString(),
      icon: <Users className="w-6 h-6 text-blue-500" />,
      change: totalClientes > 0 ? `↑ ${totalClientes}` : "↓"
    }
  ];

  return { metricData, loading, error };
};