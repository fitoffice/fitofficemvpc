import React from 'react';
import { Plus, Trash2, HelpCircle } from 'lucide-react';
import Button from '../Common/Button';

interface ExerciseRM {
  name: string;
  rm: string;
}

interface Paso2Props {
  exerciseRMs: ExerciseRM[];
  addExerciseRMField: () => void;
  removeExerciseRMField: (index: number) => void;
  updateExerciseRM: (index: number, field: 'name' | 'rm', value: string) => void;
  macrociclo: string;
  setMacrociclo: (value: string) => void;
  mesociclo: string;
  handleMesocicloChange: (value: string) => void;
}

const Paso2: React.FC<Paso2Props> = ({
  exerciseRMs,
  addExerciseRMField,
  removeExerciseRMField,
  updateExerciseRM,
  macrociclo,
  setMacrociclo,
  mesociclo,
  handleMesocicloChange,
}) => {
  return (
    <div className="space-y-4">
      {/* Ciclos de Entrenamiento - Movido arriba */}
      <div className="mb-8">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
            <HelpCircle className="w-4 h-4 mr-2" /> 
            Sobre los ciclos de entrenamiento
          </h5>
          <p className="text-sm text-blue-600 dark:text-blue-200 mb-2">
            <strong>Macrociclo:</strong> Es el ciclo más grande de entrenamiento, que puede durar varios meses. Define el número total de periodos que tendrá tu planificación.
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-200 mb-2">
            <strong>Mesociclo:</strong> Son ciclos más pequeños dentro del macrociclo. El valor que ingreses aquí determinará en cuántos periodos se dividirá tu planificación en el siguiente paso.
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-200">
            Estos valores te ayudarán a estructurar tu planificación en el siguiente paso, donde podrás definir los periodos específicos y sus multiplicadores de carga.
          </p>
        </div>
        
        <h4 className="text-lg font-semibold mb-4">Ciclos de Entrenamiento</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Macrociclo */}
          <div>
            <label htmlFor="macrociclo" className="block text-sm font-semibold mb-2">
              Macrociclo
            </label>
            <input
              type="number"
              id="macrociclo"
              value={macrociclo}
              onChange={(e) => setMacrociclo(e.target.value)}
              placeholder="Ej: 1"
              min="1"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Duración completa de la planificación
            </p>
          </div>
          
          {/* Mesociclo */}
          <div>
            <label htmlFor="mesociclo" className="block text-sm font-semibold mb-2">
              Mesociclo
            </label>
            <input
              type="number"
              id="mesociclo"
              value={mesociclo}
              onChange={(e) => handleMesocicloChange(e.target.value)}
              placeholder="Ej: 2"
              min="1"
              max={parseInt(macrociclo)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       dark:bg-gray-700 dark:text-white transition-colors"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              División de la Planificación en Ciclos/Periodos
            </p>
          </div>
        </div>
      </div>
      
      {/* Separador */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6"></div>
      
      {/* Información explicativa sobre RM */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <h5 className="font-semibold text-blue-700 dark:text-blue-300 mb-2 flex items-center">
          <HelpCircle className="w-4 h-4 mr-2" /> 
          ¿Qué son los RM de ejercicios?
        </h5>
        <p className="text-sm text-blue-600 dark:text-blue-200">
          Los RM (Repetición Máxima) son los pesos máximos que el cliente puede levantar en una repetición. 
          Estos valores servirán como base para calcular las cargas de entrenamiento en cada periodo de la planificación.
        </p>
      </div>
      
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">RM de tu Cliente</h4>
        <Button
          type="button"
          variant="secondary"
          onClick={addExerciseRMField}
          className="flex items-center text-sm px-3 py-1"
        >
          <Plus className="w-4 h-4 mr-1" /> Añadir Ejercicio
        </Button>
      </div>
      
      <div className="space-y-3">
        {exerciseRMs.map((exercise, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Nombre del ejercicio"
                value={exercise.name}
                onChange={(e) => updateExerciseRM(index, 'name', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <div className="w-24">
              <input
                type="text"
                placeholder="%1RM"
                value={exercise.rm}
                onChange={(e) => updateExerciseRM(index, 'rm', e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         dark:bg-gray-700 dark:text-white transition-colors"
              />
            </div>
            <button
              type="button"
              onClick={() => removeExerciseRMField(index)}
              className="p-2 text-red-500 hover:text-red-700 transition-colors"
              disabled={exerciseRMs.length === 1}
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Paso2;