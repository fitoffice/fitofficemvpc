import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion } from 'framer-motion';
import MetricCard from '../../components/Economics/Planes/MetricCard';
import IngresoGrafico from '../../components/Economics/Cashflow/IngresoGrafico';
import IngresosTabla from '../../components/Economics/Cashflow/IngresosTabla';
import GraficoCashflow from '../../components/Economics/Cashflow/GraficoCashflow';
import GastoWidget from '../../components/Economics/Cashflow/GastoWidget';
import { MetricsProvider } from '../../components/Economics/Metrics/MetricsProvider';
import { useFormattedMetrics } from '../../hooks/useFormattedMetrics';

const CashflowPageContent: React.FC = () => {
  const { theme } = useTheme();
  const { metricData } = useFormattedMetrics();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}
    >
      <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">
        Cashflow
      </h2>
      
      {/* MetricCards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricData.slice(0, 6).map((metric, index) => (
          <MetricCard
            key={index}
            title={metric.title}
            value={metric.value}
            icon={metric.icon}
            change={metric.change}
          />
        ))}
      </div>

      {/* Gráficos y Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4">
            <IngresoGrafico />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="p-4">
            <IngresosTabla />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="p-4">
            <GraficoCashflow />
          </div>
        </motion.div>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden lg:col-span-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="p-4">
            <GastoWidget />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const CashflowPage: React.FC = () => {
  return (
    <MetricsProvider>
      <CashflowPageContent />
    </MetricsProvider>
  );
};

export default CashflowPage;