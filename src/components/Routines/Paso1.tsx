import React from 'react';

interface Paso1Props {
  nombre: string;
  setNombre: (value: string) => void;
  descripcion: string;
  setDescripcion: (value: string) => void;
  fechaInicio: string;
  setFechaInicio: (value: string) => void;
  meta: string;
  setMeta: (value: string) => void;
  otraMeta: string;
  setOtraMeta: (value: string) => void;
  semanas: number;
  handleSemanasChange: (value: number) => void;
  tipo: string;
  setTipo: (value: string) => void;
  clienteId: string;
  setClienteId: (value: string) => void;
  clientes: any[];
  periodizarCiclos?: boolean;
  setPeriodizarCiclos?: (value: boolean) => void;
}

const Paso1: React.FC<Paso1Props> = ({
  nombre,
  setNombre,
  descripcion,
  setDescripcion,
  fechaInicio,
  setFechaInicio,
  meta,
  setMeta,
  otraMeta,
  setOtraMeta,
  semanas,
  handleSemanasChange,
  tipo,
  setTipo,
  clienteId,
  setClienteId,
  clientes,
  periodizarCiclos = false,
  setPeriodizarCiclos = () => {},
}) => {
  return (
    <>
      {/* Nombre Field */}
      <div>
        <label htmlFor="nombre" className="block text-sm font-semibold mb-2">
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   dark:bg-gray-700 dark:text-white transition-colors"
          required
        />
      </div>

      {/* Descripción Field */}
      <div>
        <label htmlFor="descripcion" className="block text-sm font-semibold mb-2">
          Descripción
        </label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   dark:bg-gray-700 dark:text-white transition-colors"
          rows={4}
          required
        />
      </div>

      {/* Tipo Field */}
      <div>
        <label htmlFor="tipo" className="block text-sm font-semibold mb-2">
          Tipo
        </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   dark:bg-gray-700 dark:text-white transition-colors"
        >
          <option value="Planificacion">Planificación</option>
          <option value="Plantilla">Plantilla</option>
        </select>
      </div>

      {/* Cliente Field */}
      {tipo === 'Planificacion' && (
        <div>
          <label htmlFor="clienteId" className="block text-sm font-semibold mb-2">
            Cliente (opcional)
          </label>
          <select
            id="clienteId"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white transition-colors"
          >
            <option value="">Sin cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre} ({cliente.email})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Periodizar en Ciclos Checkbox */}
      

      {/* Meta Field */}
      <div>
        <label htmlFor="meta" className="block text-sm font-semibold mb-2">
          Meta
        </label>
        <select
          id="meta"
          value={meta}
          onChange={(e) => {
            setMeta(e.target.value);
            if (e.target.value !== 'Otra') setOtraMeta('');
          }}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   dark:bg-gray-700 dark:text-white transition-colors"
          required
        >
          <option value="">Selecciona una meta</option>
          <option value="Cardio">Cardio</option>
          <option value="Fuerza">Fuerza</option>
          <option value="Hipertrofia">Hipertrofia</option>
          <option value="Resistencia">Resistencia</option>
          <option value="Movilidad">Movilidad</option>
          <option value="Coordinación">Coordinación</option>
          <option value="Definición">Definición</option>
          <option value="Recomposición">Recomposición</option>
          <option value="Rehabilitación">Rehabilitación</option>
          <option value="Otra">Otra</option>
        </select>
      </div>

      {/* Otra Meta Field */}
      {meta === 'Otra' && (
        <div>
          <label htmlFor="otraMeta" className="block text-sm font-semibold mb-2">
            Especifica la meta
          </label>
          <input
            type="text"
            id="otraMeta"
            value={otraMeta}
            onChange={(e) => setOtraMeta(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white transition-colors"
            required
            placeholder="Describe la meta específica"
          />
        </div>
      )}

      {/* Fecha de Inicio Field */}
      {tipo === 'Planificacion' && (
        <div>
          <label htmlFor="fechaInicio" className="block text-sm font-semibold mb-2">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="fechaInicio"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     dark:bg-gray-700 dark:text-white transition-colors"
            required
          />
        </div>
      )}

      {/* Semanas Field */}
      <div>
        <label htmlFor="semanas" className="block text-sm font-semibold mb-2">
          Semanas
        </label>
        <input
          type="number"
          id="semanas"
          value={semanas}
          onChange={(e) => handleSemanasChange(parseInt(e.target.value))}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   dark:bg-gray-700 dark:text-white transition-colors"
          min="1"
          required
        />
      </div>
      <div className="mt-4 mb-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="periodizarCiclos"
            checked={periodizarCiclos}
            onChange={(e) => setPeriodizarCiclos(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                     focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                     focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label htmlFor="periodizarCiclos" className="ml-2 text-sm font-medium">
            Periodizar planificación en Ciclos
          </label>
        </div>
      </div>
    </>
  );
};

export default Paso1;