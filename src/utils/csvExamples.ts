import { CSVFormat } from '../types/csv';

/**
 * Generates example CSV content based on the specified format
 * @param format The CSV format to generate an example for
 * @returns A string containing the CSV content
 */
export const generateExampleCSV = (format: CSVFormat): string => {
  switch (format) {
    case 'commaDelimited':
      return generateCommaDelimitedExample();
    case 'sameVariable':
      return generateSameVariableExample();
    case 'exercisePerSet':
      return generateExercisePerSetExample();
    default:
      return generateCommaDelimitedExample();
  }
};

/**
 * Generates an example CSV where each set is delimited by commas
 */
const generateCommaDelimitedExample = (): string => {
  const headers = 'Ejercicio,Series,Repeticiones,Peso,Descanso\n';
  const rows = [
    'Press de Banca,"3,4,5","10,8,6","60,70,80","90,90,120"',
    'Sentadilla,"3,3,3","12,12,12","80,80,80","90,90,90"',
    'Peso Muerto,"5,5","5,5","100,110","120,120"',
    'Dominadas,"3,3,3","8,8,8","0,0,0","60,60,60"',
    'Curl de Bíceps,"4,4,4,4","12,10,8,6","15,17.5,20,22.5","60,60,60,60"'
  ].join('\n');
  
  return headers + rows;
};

/**
 * Generates an example CSV where the same variable is used for all sets
 */
const generateSameVariableExample = (): string => {
  const headers = 'Ejercicio,Series,Repeticiones,Peso,Descanso\n';
  const rows = [
    'Press de Banca,4,10,60,90',
    'Sentadilla,3,12,80,90',
    'Peso Muerto,5,5,100,120',
    'Dominadas,3,8,0,60',
    'Curl de Bíceps,4,12,15,60'
  ].join('\n');
  
  return headers + rows;
};

/**
 * Generates an example CSV where each row represents a single set
 */
const generateExercisePerSetExample = (): string => {
  const headers = 'Ejercicio,Serie,Repeticiones,Peso,Descanso\n';
  const rows = [
    'Press de Banca,1,10,60,90',
    'Press de Banca,2,8,70,90',
    'Press de Banca,3,6,80,120',
    'Sentadilla,1,12,80,90',
    'Sentadilla,2,12,80,90',
    'Sentadilla,3,12,80,90',
    'Peso Muerto,1,5,100,120',
    'Peso Muerto,2,5,110,120',
    'Dominadas,1,8,0,60',
    'Dominadas,2,8,0,60',
    'Dominadas,3,8,0,60',
    'Curl de Bíceps,1,12,15,60',
    'Curl de Bíceps,2,10,17.5,60',
    'Curl de Bíceps,3,8,20,60',
    'Curl de Bíceps,4,6,22.5,60'
  ].join('\n');
  
  return headers + rows;
};