import { CSVFormat } from '../types/csv';

export interface CSVPreviewData {
  headers: string[];
  rows: string[][];
}

export interface ParsedRoutineData {
  exercises: string[];
  series: number[];
  repetitions: number[];
  weight: number[];
  rest: number[];
  // Additional fields that might be mapped
  rpe?: number[];
  rir?: number[];
  rpm?: number[];
  speed?: number[];
  cadence?: number[];
  distance?: number[];
  height?: number[];
  calories?: number[];
  round?: number[];
  pace?: string[];
}

export interface FormattedExerciseSet {
  reps?: number;
  weight?: number;
  rest?: number;
  rpe?: number;
  rir?: number;
  rpm?: number;
  speed?: number;
  cadence?: number;
  distance?: number;
  height?: number;
  calories?: number;
  round?: number;
  pace?: string;
}

export interface FormattedExercise {
  name: string;
  notes?: string;
  sets: FormattedExerciseSet[];
}

export interface FormattedRoutineData {
  exercises: FormattedExercise[];
  renderConfig: {
    campo1: string;
    campo2: string;
    campo3: string;
  };
}

/**
 * Parse CSV file with the selected format
 * @param file The CSV file to parse
 * @param format The selected format (commaDelimited, sameVariable, exercisePerSet)
 * @param fieldMapping The mapping of CSV columns to routine fields
 * @returns Promise with the parsed data
 */
export const parseCSVWithFormat = async (
  file: File,
  format: CSVFormat,
  fieldMapping: {[key: string]: string}
): Promise<FormattedRoutineData> => {
  // First get the raw CSV data
  const csvData = await readCSVFile(file);
  
  // Then parse according to the selected format
  let parsedData: ParsedRoutineData;
  switch (format) {
    case 'commaDelimited':
      parsedData = parseCommaDelimitedFormat(csvData, fieldMapping);
      break;
    case 'sameVariable':
      parsedData = parseSameVariableFormat(csvData, fieldMapping);
      break;
    case 'exercisePerSet':
      parsedData = parseExercisePerSetFormat(csvData, fieldMapping);
      break;
    default:
      throw new Error('Formato de CSV no válido');
  }
  
  // Format the parsed data into the required structure
  return formatRoutineData(parsedData, fieldMapping);
};

/**
 * Format the parsed data into the required structure
 */
export const formatRoutineData = (
  parsedData: ParsedRoutineData,
  fieldMapping: {[key: string]: string}
): FormattedRoutineData => {
  const exerciseMap = new Map<string, FormattedExercise>();
  
  // Get the mapped fields for renderConfig
  const mappedFields = Object.values(fieldMapping).filter(value => 
    value !== '' && value !== 'ejercicios'
  );
  
  // Create renderConfig with the first 3 mapped fields (or less if fewer fields are mapped)
  const renderConfig = {
    campo1: mappedFields[0] || 'repeticiones',
    campo2: mappedFields.length > 1 ? mappedFields[1] : 'peso',
    campo3: mappedFields.length > 2 ? mappedFields[2] : 'descanso'
  };
  
  // Group exercises by name
  for (let i = 0; i < parsedData.exercises.length; i++) {
    const exerciseName = parsedData.exercises[i];
    
    if (!exerciseMap.has(exerciseName)) {
      exerciseMap.set(exerciseName, {
        name: exerciseName,
        sets: []
      });
    }
    
    const exercise = exerciseMap.get(exerciseName)!;
    
    // Create a set with all available data
    const set: FormattedExerciseSet = {};
    
    if (parsedData.repetitions && parsedData.repetitions[i] !== undefined) {
      set.reps = parsedData.repetitions[i];
    }
    
    if (parsedData.weight && parsedData.weight[i] !== undefined) {
      set.weight = parsedData.weight[i];
    }
    
    if (parsedData.rest && parsedData.rest[i] !== undefined) {
      set.rest = parsedData.rest[i];
    }
    
    if (parsedData.rpe && parsedData.rpe[i] !== undefined) {
      set.rpe = parsedData.rpe[i];
    }
    
    if (parsedData.rir && parsedData.rir[i] !== undefined) {
      set.rir = parsedData.rir[i];
    }
    
    if (parsedData.rpm && parsedData.rpm[i] !== undefined) {
      set.rpm = parsedData.rpm[i];
    }
    
    if (parsedData.speed && parsedData.speed[i] !== undefined) {
      set.speed = parsedData.speed[i];
    }
    
    if (parsedData.cadence && parsedData.cadence[i] !== undefined) {
      set.cadence = parsedData.cadence[i];
    }
    
    if (parsedData.distance && parsedData.distance[i] !== undefined) {
      set.distance = parsedData.distance[i];
    }
    
    if (parsedData.height && parsedData.height[i] !== undefined) {
      set.height = parsedData.height[i];
    }
    
    if (parsedData.calories && parsedData.calories[i] !== undefined) {
      set.calories = parsedData.calories[i];
    }
    
    if (parsedData.round && parsedData.round[i] !== undefined) {
      set.round = parsedData.round[i];
    }
    
    if (parsedData.pace && parsedData.pace[i] !== undefined) {
      set.pace = parsedData.pace[i];
    }
    
    exercise.sets.push(set);
  }
  
  return {
    exercises: Array.from(exerciseMap.values()),
    renderConfig
  };
};

/**
 * Read CSV file and return the raw data
 */
export const readCSVFile = (file: File): Promise<CSVPreviewData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => 
          row.split(',').map(cell => cell.trim())
        );
        
        if (rows.length < 2) {
          reject(new Error('El archivo CSV debe contener al menos una fila de encabezados y una fila de datos'));
          return;
        }
        
        const headers = rows[0];
        const dataRows = rows.slice(1).filter(row => row.length === headers.length && row.some(cell => cell !== ''));
        
        if (dataRows.length === 0) {
          reject(new Error('No se encontraron datos válidos en el archivo CSV'));
          return;
        }
        
        resolve({
          headers,
          rows: dataRows
        });
      } catch (err) {
        reject(new Error('Error al analizar el archivo CSV'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo CSV'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Parse CSV in comma delimited format
 * Each row represents an exercise with multiple sets separated by commas
 */
const parseCommaDelimitedFormat = (
  csvData: CSVPreviewData, 
  fieldMapping: {[key: string]: string}
): ParsedRoutineData => {
  const result: ParsedRoutineData = {
    exercises: [],
    series: [],
    repetitions: [],
    weight: [],
    rest: []
  };
  
  // Get the indices for each mapped field
  const mappedFields = Object.entries(fieldMapping)
    .filter(([_, value]) => value !== '')
    .reduce((acc, [key, value]) => {
      acc[value] = parseInt(key);
      return acc;
    }, {} as {[key: string]: number});
  
  // Process each row (each row is an exercise)
  csvData.rows.forEach(row => {
    // Get the exercise name
    if ('ejercicios' in mappedFields) {
      const exerciseName = row[mappedFields['ejercicios']];
      result.exercises.push(exerciseName);
      
      // For each mapped field, add the corresponding value
      Object.entries(mappedFields).forEach(([fieldName, columnIndex]) => {
        if (fieldName === 'ejercicios') return; // Skip exercise name
        
        const value = row[columnIndex];
        
        // Add the value to the corresponding array
        if (fieldName === 'series') {
          result.series.push(parseInt(value) || 0);
        } else if (fieldName === 'repeticiones') {
          result.repetitions.push(parseInt(value) || 0);
        } else if (fieldName === 'peso') {
          result.weight.push(parseFloat(value) || 0);
        } else if (fieldName === 'descanso') {
          result.rest.push(parseInt(value) || 0);
        } else if (fieldName === 'ritmo') {
          result.pace = result.pace || [];
          result.pace.push(value);
        } else if (fieldName === 'rpe') {
          result.rpe = result.rpe || [];
          result.rpe.push(parseInt(value) || 0);
        } else if (fieldName === 'rpm') {
          result.rpm = result.rpm || [];
          result.rpm.push(parseInt(value) || 0);
        } else if (fieldName === 'rir') {
          result.rir = result.rir || [];
          result.rir.push(parseInt(value) || 0);
        } else if (fieldName === 'speed') {
          result.speed = result.speed || [];
          result.speed.push(parseFloat(value) || 0);
        } else if (fieldName === 'cadence') {
          result.cadence = result.cadence || [];
          result.cadence.push(parseInt(value) || 0);
        } else if (fieldName === 'distance') {
          result.distance = result.distance || [];
          result.distance.push(parseFloat(value) || 0);
        } else if (fieldName === 'height') {
          result.height = result.height || [];
          result.height.push(parseFloat(value) || 0);
        } else if (fieldName === 'calories') {
          result.calories = result.calories || [];
          result.calories.push(parseInt(value) || 0);
        } else if (fieldName === 'round') {
          result.round = result.round || [];
          result.round.push(parseInt(value) || 0);
        }
      });
    }
  });
  
  return result;
};

/**
 * Parse CSV in same variable format
 * Each row represents an exercise with the same values for all sets
 */
const parseSameVariableFormat = (
  csvData: CSVPreviewData, 
  fieldMapping: {[key: string]: string}
): ParsedRoutineData => {
  const result: ParsedRoutineData = {
    exercises: [],
    series: [],
    repetitions: [],
    weight: [],
    rest: []
  };
  
  // Get the indices for each mapped field
  const mappedFields = Object.entries(fieldMapping)
    .filter(([_, value]) => value !== '')
    .reduce((acc, [key, value]) => {
      acc[value] = parseInt(key);
      return acc;
    }, {} as {[key: string]: number});
  
  // Process each row (each row is an exercise)
  csvData.rows.forEach(row => {
    // Get the exercise name
    if ('ejercicios' in mappedFields) {
      const exerciseName = row[mappedFields['ejercicios']];
      const seriesCount = 'series' in mappedFields ? parseInt(row[mappedFields['series']]) || 1 : 1;
      
      // Repeat the exercise for each set
      for (let i = 0; i < seriesCount; i++) {
        result.exercises.push(exerciseName);
        
        // For each mapped field, add the corresponding value
        Object.entries(mappedFields).forEach(([fieldName, columnIndex]) => {
          if (fieldName === 'ejercicios' || fieldName === 'series') return; // Skip exercise name and series count
          
          const value = row[columnIndex];
          
          // Add the value to the corresponding array
          if (fieldName === 'repeticiones') {
            result.repetitions.push(parseInt(value) || 0);
          } else if (fieldName === 'peso') {
            result.weight.push(parseFloat(value) || 0);
          } else if (fieldName === 'descanso') {
            result.rest.push(parseInt(value) || 0);
          } else if (fieldName === 'ritmo') {
            result.pace = result.pace || [];
            result.pace.push(value);
          } else if (fieldName === 'rpe') {
            result.rpe = result.rpe || [];
            result.rpe.push(parseInt(value) || 0);
          } else if (fieldName === 'rpm') {
            result.rpm = result.rpm || [];
            result.rpm.push(parseInt(value) || 0);
          } else if (fieldName === 'rir') {
            result.rir = result.rir || [];
            result.rir.push(parseInt(value) || 0);
          } else if (fieldName === 'speed') {
            result.speed = result.speed || [];
            result.speed.push(parseFloat(value) || 0);
          } else if (fieldName === 'cadence') {
            result.cadence = result.cadence || [];
            result.cadence.push(parseInt(value) || 0);
          } else if (fieldName === 'distance') {
            result.distance = result.distance || [];
            result.distance.push(parseFloat(value) || 0);
          } else if (fieldName === 'height') {
            result.height = result.height || [];
            result.height.push(parseFloat(value) || 0);
          } else if (fieldName === 'calories') {
            result.calories = result.calories || [];
            result.calories.push(parseInt(value) || 0);
          } else if (fieldName === 'round') {
            result.round = result.round || [];
            result.round.push(parseInt(value) || 0);
          }
        });
        
        // Add series number
        result.series.push(i + 1);
      }
    }
  });
  
  return result;
};

/**
 * Parse CSV in exercise per set format
 * Each row represents a single set of an exercise
 */
const parseExercisePerSetFormat = (
  csvData: CSVPreviewData, 
  fieldMapping: {[key: string]: string}
): ParsedRoutineData => {
  const result: ParsedRoutineData = {
    exercises: [],
    series: [],
    repetitions: [],
    weight: [],
    rest: []
  };
  
  // Get the indices for each mapped field
  const mappedFields = Object.entries(fieldMapping)
    .filter(([_, value]) => value !== '')
    .reduce((acc, [key, value]) => {
      acc[value] = parseInt(key);
      return acc;
    }, {} as {[key: string]: number});
  
  // Track current exercise and set number
  let currentExercise = '';
  let currentSetNumber = 1;
  
  // Process each row (each row is a set)
  csvData.rows.forEach(row => {
    // Get the exercise name
    if ('ejercicios' in mappedFields) {
      const exerciseName = row[mappedFields['ejercicios']];
      
      // If exercise name changes, reset set number
      if (exerciseName !== currentExercise) {
        currentExercise = exerciseName;
        currentSetNumber = 1;
      }
      
      result.exercises.push(exerciseName);
      result.series.push(currentSetNumber);
      
      // For each mapped field, add the corresponding value
      Object.entries(mappedFields).forEach(([fieldName, columnIndex]) => {
        if (fieldName === 'ejercicios') return; // Skip exercise name
        
        const value = row[columnIndex];
        
        // Add the value to the corresponding array
        if (fieldName === 'repeticiones') {
          result.repetitions.push(parseInt(value) || 0);
        } else if (fieldName === 'peso') {
          result.weight.push(parseFloat(value) || 0);
        } else if (fieldName === 'descanso') {
          result.rest.push(parseInt(value) || 0);
        } else if (fieldName === 'ritmo') {
          result.pace = result.pace || [];
          result.pace.push(value);
        } else if (fieldName === 'rpe') {
          result.rpe = result.rpe || [];
          result.rpe.push(parseInt(value) || 0);
        } else if (fieldName === 'rpm') {
          result.rpm = result.rpm || [];
          result.rpm.push(parseInt(value) || 0);
        } else if (fieldName === 'rir') {
          result.rir = result.rir || [];
          result.rir.push(parseInt(value) || 0);
        } else if (fieldName === 'speed') {
          result.speed = result.speed || [];
          result.speed.push(parseFloat(value) || 0);
        } else if (fieldName === 'cadence') {
          result.cadence = result.cadence || [];
          result.cadence.push(parseInt(value) || 0);
        } else if (fieldName === 'distance') {
          result.distance = result.distance || [];
          result.distance.push(parseFloat(value) || 0);
        } else if (fieldName === 'height') {
          result.height = result.height || [];
          result.height.push(parseFloat(value) || 0);
        } else if (fieldName === 'calories') {
          result.calories = result.calories || [];
          result.calories.push(parseInt(value) || 0);
        } else if (fieldName === 'round') {
          result.round = result.round || [];
          result.round.push(parseInt(value) || 0);
        }
      });
      
      // Increment set number for next row with same exercise
      currentSetNumber++;
    }
  });
  
  return result;
};