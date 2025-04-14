import React, { useState, useEffect } from 'react';
import { Edit, Save, TrendingUp, DollarSign, FileText, Users, PieChart, UserPlus } from 'lucide-react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import GastoWidget from '../../components/Economics/GastoWidget';
import AlertasWidget from '../../components/Economics/AlertasWidget';
import CuentaBancariaWidget from '../../components/Economics/CuentaBancariaWidget';
import CashflowWidget from '../../components/Economics/CashflowWidget';
import DocumentosWidget from '../../components/Economics/DocumentosWidget';
import FacturasWidget from '../../components/Economics/FacturasWidget';
import ServiciosWidget from '../../components/Economics/ServiciosWidget';
import IncomeChartWidget from '../../components/Economics/IncomeChartWidget';
import RecentSalesWidget from '../../components/PanelControl/RecentSalesWidget';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import GastoPopup from '../../components/modals/GastoPopup';
import FacturaPopup from '../../components/modals/FacturaPopup';
import EscanearFacturaPopup from '../../components/modals/EscanearFacturaPopup';
import DocumentoPopup from '../../components/modals/DocumentoPopup';
import BonoPopup from '../../components/modals/BonoPopup';
import ReportePopup from '../../components/modals/ReportePopup';
import ReporteActualPopup from '../../components/modals/ReporteActualPopup';
import ClientePopup from '../../components/modals/ClientePopup';
import ServicioPopup from '../../components/modals/ServicioPopup';
import { MetricsProvider } from '../../components/Economics/Metrics/MetricsProvider';
import { useFormattedMetrics } from '../../hooks/useFormattedMetrics';

const ResponsiveGridLayout = WidthProvider(Responsive);

// Definimos el tipo para el tema
type Theme = 'light' | 'dark';

interface PanelDeControlProps {
  theme: Theme;
  editMode: boolean;
  isFacturaPopupOpen: boolean;
  setIsFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleFacturaSubmit: (formData: any) => void;
  isEscanearFacturaPopupOpen: boolean;
  setIsEscanearFacturaPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEscanearFacturaSubmit: (formData: any) => void;
}

const PanelDeControlContent: React.FC<PanelDeControlProps> = ({
  theme,
  editMode,
  isFacturaPopupOpen,
  setIsFacturaPopupOpen,
  handleFacturaSubmit,
  isEscanearFacturaPopupOpen,
  setIsEscanearFacturaPopupOpen,
  handleEscanearFacturaSubmit,
 }) => {
  const [isEditMode, setIsEditMode] = useState(editMode);
  const [layout, setLayout] = useState(generateInitialLayout());
  const [isGastoPopupOpen, setIsGastoPopupOpen] = useState(false);
  const [isGastoFilterOpen, setIsGastoFilterOpen] = useState(false);
  const [isFacturaFilterOpen, setIsFacturaFilterOpen] = useState(false);
  const [facturaFilterOptions, setFacturaFilterOptions] = useState({
    estado: '',
    tipo: '',
    fechaInicio: '',
    fechaFin: '',
  });
  const [isDocumentoPopupOpen, setIsDocumentoPopupOpen] = useState(false);
  const [isBonoPopupOpen, setIsBonoPopupOpen] = useState(false);
  const [isReportePopupOpen, setIsReportePopupOpen] = useState(false);
  const [isReporteActualPopupOpen, setIsReporteActualPopupOpen] = useState(false);
  const [isClientePopupOpen, setIsClientePopupOpen] = useState(false);
  const { metricData } = useFormattedMetrics();
  const [isServicioPopupOpen, setIsServicioPopupOpen] = useState(false);
  const [balances, setBalances] = useState({
    bank: 1250.75,
    stripe: 850.50,
    cash: 325.25
  });

  const handleRemove = () => {
    // In a real app, you might want to show a confirmation dialog
    console.log('Widget removed');
  };

  const handleUpdate = (accountType: string, newValue: number) => {
    setBalances(prev => ({
      ...prev,
      [accountType]: newValue
    }));
  };
  
  const handleFacturaFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('PanelDeControl: Factura filter changed:', name, value);
    setFacturaFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    setIsEditMode(false);
    console.log('Layout guardado:', layout);
  };

  const handleLayoutChange = (newLayout: any) => {
    setLayout(newLayout);
    console.log('Nuevo layout:', newLayout);
  };

  function generateInitialLayout() {
    return [
      { i: 'proyeccionMes', x: 0, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'gastoMensual', x: 1, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'beneficioNeto', x: 2, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'ingresos', x: 3, y: 0, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'margenGanancia', x: 0, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'clientesNuevos', x: 1, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'clientesActuales', x: 2, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      { i: 'planesVendidos', x: 3, y: 1, w: 1, h: 1, minW: 1, minH: 1 },
      
      // The rest of the layout remains unchanged
      { i: 'incomeChart', x: 0, y: 2, w: 2, h: 3, minW: 2, minH: 2 },
      { i: 'recentSales', x: 2, y: 2, w: 2, h: 3, minW: 2, minH: 2 },
      { i: 'gastoWidget', x: 0, y: 5, w: 2, h: 3, minW: 1, minH: 2 },
      { i: 'alertasWidget', x: 2, y: 5, w: 2, h: 3, minW: 1, minH: 2 },
      { i: 'cuentaBancariaWidget', x: 0, y: 7, w: 2, h: 2, minW: 1, minH: 1 },
      { i: 'cashflowWidget', x: 2, y: 7, w: 2, h: 3, minW: 1, minH: 2 },
      { i: 'documentosWidget', x: 0, y: 9, w: 2, h: 3, minW: 1, minH: 2 },
      { i: 'facturasWidget', x: 2, y: 9, w: 2, h: 3, minW: 1, minH: 2 },
      { i: 'serviciosWidget', x: 0, y: 11, w: 2, h: 3, minW: 1, minH: 2 },
      { i: 'bonosWidget', x: 2, y: 11, w: 2, h: 2, minW: 1, minH: 1 },
    ];
  }

  const SmallWidget = ({ title, value, icon, subtitle }: { title: string; value: string; icon: React.ElementType; subtitle: string }) => (
    <div className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md p-4`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{title}</h3>
        {React.createElement(icon, { className: "w-5 h-5 text-blue-500" })}
      </div>
      <div className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{value}</div>
      <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mt-1`}>{subtitle}</div>
    </div>
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-md p-6 mb-8`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>Panel de Control</h2>
        <div className="flex space-x-2">
        </div>
      </div>

      <div className="relative">
        
      </div>
      <ResponsiveGridLayout
      className="layout"
      layouts={{ lg: layout }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
      rowHeight={150} // Mantén un tamaño constante
      isDraggable={isEditMode}
      isResizable={isEditMode}
      onLayoutChange={handleLayoutChange}
      containerPadding={[0, 0]}
      useCSSTransforms={false} // Desactiva las transformaciones visuales
      >
        {metricData.map((metric) => (
          <div key={metric.id}>
            <SmallWidget 
              title={metric.title} 
              value={metric.value} 
              icon={metric.icon.type} 
              subtitle={metric.change} 
            />
          </div>
        ))}

        <div key="planesVendidos">
          <SmallWidget title="Planes Vendidos" value="0" icon={FileText} subtitle="Total planes vendidos" />
        </div>

        <div key="gastoWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <GastoWidget
            title="Gastos"
            onAddClick={() => setIsGastoPopupOpen(true)}
            onFilterClick={() => setIsGastoFilterOpen(!isGastoFilterOpen)}
            isFilterOpen={isGastoFilterOpen}
          />
        </div>
        <div key="alertasWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <AlertasWidget
              
            isEditMode={isEditMode}
            onRemove={() => {}}
          />
        </div>
        <div key="cuentaBancariaWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        <CuentaBancariaWidget
            balances={balances}
            isEditMode={isEditMode}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        </div>
        <div key="cashflowWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden h-full p-4`}>
          <CashflowWidget
            ingresos={20000}
            gastos={15000}
            isEditMode={isEditMode}
            onUpdate={() => {}}
            onRemove={() => {}}
          />
        </div>
        <div key="documentosWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <DocumentosWidget
            documentos={[
              { id: 1, nombre: "Informe Q1", fecha: "2023-03-31" },
              { id: 2, nombre: "Presupuesto Anual", fecha: "2023-01-15" },
            ]}
            isEditMode={isEditMode}
            onRemove={() => {}}
            setIsDocumentoPopupOpen={setIsDocumentoPopupOpen}
          />
        </div>
        <div key="facturasWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
        {console.log('PanelDeControl: Rendering FacturasWidget with isFilterOpen:', isFacturaFilterOpen)}
        <FacturasWidget
              isEditMode={isEditMode}
              onRemove={() => {}}
              setIsEscanearFacturaPopupOpen={setIsEscanearFacturaPopupOpen}
              isFilterOpen={isFacturaFilterOpen}
              setIsFilterOpen={setIsFacturaFilterOpen}
              filterOptions={facturaFilterOptions}
            />
            
            {/* Position the filter dropdown inside the FacturasWidget container */}
            
            {isFacturaFilterOpen && (
              <div
                className={`absolute right-4 top-20 z-10 w-80 mb-4 p-4 ${
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600'
                    : 'bg-white border-gray-200'
                } border rounded-md shadow-lg space-y-3`}
              >
                <div className="space-y-3">
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Estado
                    </label>
                    <select
                      name="estado"
                      value={facturaFilterOptions.estado}
                      onChange={handleFacturaFilterChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      <option value="">Todos</option>
                      <option value="Pagada">Pagada</option>
                      <option value="Pendiente">Pendiente</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Tipo
                    </label>
                    <select
                      name="tipo"
                      value={facturaFilterOptions.tipo}
                      onChange={handleFacturaFilterChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    >
                      <option value="">Todos</option>
                      <option value="Emitida">Emitida</option>
                      <option value="Escaneada">Escaneada</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Fecha Inicio
                    </label>
                    <input
                      type="date"
                      name="fechaInicio"
                      value={facturaFilterOptions.fechaInicio}
                      onChange={handleFacturaFilterChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                      Fecha Fin
                    </label>
                    <input
                      type="date"
                      name="fechaFin"
                      value={facturaFilterOptions.fechaFin}
                      onChange={handleFacturaFilterChange}
                      className={`w-full px-3 py-2 border rounded-md ${
                        theme === 'dark'
                          ? 'bg-gray-600 border-gray-500 text-white'
                          : 'bg-white border-gray-300 text-gray-800'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
 
        <div key="serviciosWidget" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden h-full`}>
          <ServiciosWidget
            isEditMode={isEditMode}
            onRemove={() => {}}
            setIsServicioPopupOpen={setIsServicioPopupOpen} 
          />
        </div>
       
        <div key="incomeChart" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <IncomeChartWidget />
        </div>
        <div key="recentSales" className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
          <RecentSalesWidget />
        </div>
      </ResponsiveGridLayout>

      <ClientePopup isOpen={isClientePopupOpen} onClose={() => setIsClientePopupOpen(false)} onSubmit={() => {}} />
      <ServicioPopup isOpen={isServicioPopupOpen} onClose={() => setIsServicioPopupOpen(false)} onSubmit={() => {}} />
      <GastoPopup isOpen={isGastoPopupOpen} onClose={() => setIsGastoPopupOpen(false)} onSubmit={() => {}} />
      <FacturaPopup isOpen={isFacturaPopupOpen} onClose={() => setIsFacturaPopupOpen(false)} onSubmit={() => {}} />
      <EscanearFacturaPopup isOpen={isEscanearFacturaPopupOpen} onClose={() => setIsEscanearFacturaPopupOpen(false)} onSubmit={() => {}} />
      <DocumentoPopup isOpen={isDocumentoPopupOpen} onClose={() => setIsDocumentoPopupOpen(false)} onSubmit={() => {}} />
      <BonoPopup isOpen={isBonoPopupOpen} onClose={() => setIsBonoPopupOpen(false)} onSubmit={() => {}} />
      <ReportePopup isOpen={isReportePopupOpen} onClose={() => setIsReportePopupOpen(false)} onSubmit={() => {}} />
      <ReporteActualPopup isOpen={isReporteActualPopupOpen} onClose={() => setIsReporteActualPopupOpen(false)} onSubmit={() => {}} />
    </div>
  );
};

const PanelDeControl: React.FC<PanelDeControlProps> = (props) => {
  return (
    <MetricsProvider>
      <PanelDeControlContent {...props} />
    </MetricsProvider>
  );
};

export default PanelDeControl;