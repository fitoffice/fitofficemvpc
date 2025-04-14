import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Eye, ChevronDown, Link2, Users } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import Button from '../Common/Button';

interface CSVPopupProps {
  onClose: () => void;
  onImportSuccess: () => void;
}

interface CSVPreviewData {
  headers: string[];
  rows: string[][];
  totalRows: number;
}

// Interfaz para el mapeo de campos
interface CSVFieldMapping {
  [key: string]: string;
}

const CSVPopup: React.FC<CSVPopupProps> = ({ onClose, onImportSuccess }) => {
  const { theme } = useTheme();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewData, setPreviewData] = useState<CSVPreviewData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [showServiceModal, setShowServiceModal] = useState<number | null>(null);
  const [showBulkServiceModal, setShowBulkServiceModal] = useState(false);
  // Estado para el mapeo de columnas a campos
  const [fieldMapping, setFieldMapping] = useState<CSVFieldMapping>({});

  // Función para generar mapeo por defecto según los headers
  const generateDefaultMapping = (headers: string[]): CSVFieldMapping => {
    const mapping: CSVFieldMapping = {};
    headers.forEach((header, index) => {
      const headerLower = header.toLowerCase();
      if (headerLower.includes("apellido")) {
        mapping[index.toString()] = "apellidos";
      } else if (headerLower.includes("nombre")) {
        mapping[index.toString()] = "nombre";
      } else if (headerLower.includes("email")) {
        mapping[index.toString()] = "email";
      } else if (headerLower.includes("tel")) {
        mapping[index.toString()] = "telefono";
      } else if (headerLower.includes("fecha") && headerLower.includes("nacimiento")) {
        mapping[index.toString()] = "fechaNacimiento";
      } else if (headerLower.includes("genero")) {
        mapping[index.toString()] = "genero";
      } else if (headerLower.includes("altura")) {
        mapping[index.toString()] = "altura";
      } else if (headerLower.includes("peso")) {
        mapping[index.toString()] = "peso";
      } else if (headerLower.includes("calle")) {
        mapping[index.toString()] = "direccion.calle";
      } else if (headerLower.includes("ciudad")) {
        mapping[index.toString()] = "direccion.ciudad";
      } else if (headerLower.includes("postal") || headerLower.includes("codigo")) {
        mapping[index.toString()] = "direccion.codigoPostal";
      } else if (headerLower.includes("pais")) {
        mapping[index.toString()] = "direccion.pais";
      } else if (headerLower.includes("condicion")) {
        mapping[index.toString()] = "condicionesMedicas";
      } else if (headerLower.includes("instagram") || headerLower.includes("ig")) {
        mapping[index.toString()] = "redesSociales.instagram";
      } else if (headerLower.includes("facebook") || headerLower.includes("fb")) {
        mapping[index.toString()] = "redesSociales.facebook";
      } else if (headerLower.includes("twitter") || headerLower.includes("tw") || headerLower.includes("x")) {
        mapping[index.toString()] = "redesSociales.twitter";
      } else {
        mapping[index.toString()] = "";
      }
    });
    return mapping;
  };

  // Función para cambiar el mapeo de un header
  const handleFieldMappingChange = (headerIndex: string, value: string) => {
    setFieldMapping(prev => ({
      ...prev,
      [headerIndex]: value
    }));
  };

  // Función para validar que se hayan mapeado todos los campos obligatorios
  const validateMapping = () => {
    const requiredFields = [
      "nombre",
      "apellidos",
      "email",
      "telefono",
      "fechaNacimiento",
      "genero",
      "altura",
      "peso",
      "direccion.calle",
      "direccion.ciudad",
      "direccion.codigoPostal",
      "direccion.pais",
      "condicionesMedicas"
      // Las redes sociales no son obligatorias, por lo que no se incluyen aquí
    ];
    const mappedFields = Object.values(fieldMapping);
    const missingFields = requiredFields.filter(field => !mappedFields.includes(field));
    return missingFields;
  };

  // Función simple para parsear el CSV
  const parseCSV = (csvText: string): CSVPreviewData => {
    const lines = csvText.split(/\r\n|\n/);
    const headers = lines[0].split(',').map(header => header.trim());
    const totalRows = lines.slice(1).filter(line => line.trim()).length;
    const rows: string[][] = [];
    for (let i = 1; i < Math.min(lines.length, 6); i++) {
      if (lines[i].trim()) {
        rows.push(lines[i].split(',').map(cell => cell.trim()));
      }
    }
    return { headers, rows, totalRows };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const csvText = event.target?.result as string;
            const data = parseCSV(csvText);
            setPreviewData(data);
            setShowPreview(true);
            // Configurar el mapeo por defecto según los headers
            setFieldMapping(generateDefaultMapping(data.headers));
          } catch (err) {
            console.error('Error parsing CSV:', err);
            setError('Error al analizar el archivo CSV. Verifique el formato.');
            setPreviewData(null);
          }
        };
        reader.readAsText(selectedFile);
      } else {
        setFile(null);
        setError('Por favor, selecciona un archivo CSV válido.');
        setPreviewData(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const csvText = event.target?.result as string;
            const data = parseCSV(csvText);
            setPreviewData(data);
            setShowPreview(true);
            setFieldMapping(generateDefaultMapping(data.headers));
          } catch (err) {
            console.error('Error parsing CSV:', err);
            setError('Error al analizar el archivo CSV. Verifique el formato.');
            setPreviewData(null);
          }
        };
        reader.readAsText(droppedFile);
      } else {
        setFile(null);
        setError('Por favor, selecciona un archivo CSV válido.');
        setPreviewData(null);
      }
    }
  };

  const toggleRowSelection = (rowIndex: number) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(rowIndex)) {
      newSelection.delete(rowIndex);
    } else {
      newSelection.add(rowIndex);
    }
    setSelectedRows(newSelection);
  };

  const toggleAllRows = () => {
    if (previewData) {
      if (selectedRows.size === previewData.rows.length) {
        setSelectedRows(new Set());
      } else {
        const allRows = new Set(previewData.rows.map((_, index) => index));
        setSelectedRows(allRows);
      }
    }
  };

  const handleAssociateService = (rowIndex: number) => {
    setShowServiceModal(rowIndex);
    console.log(`Associate service for row ${rowIndex}`);
  };

  const closeServiceModal = () => {
    setShowServiceModal(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    // Validar que se hayan mapeado todos los campos obligatorios
    const missingFields = validateMapping();
    if (missingFields.length > 0) {
      setError("Falta mapear los siguientes campos: " + missingFields.join(", "));
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }

      const formData = new FormData();
      formData.append('file', file);
      // Agregar el mapeo de campos al formulario
      formData.append('mapping', JSON.stringify(fieldMapping));

      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);

      const response = await fetch('https://fitofficecrm-7d2801a52c4c.herokuapp.com/api/clientes/import-csv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al importar el archivo CSV');
      }

      const data = await response.json();
      console.log('CSV import successful:', data);
      
      setTimeout(() => {
        onImportSuccess();
      }, 1000);
    } catch (err) {
      console.error('Error importing CSV:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al importar el archivo');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBulkAssociateService = () => {
    if (selectedRows.size > 1) {
      setShowBulkServiceModal(true);
    }
  };

  const closeBulkServiceModal = () => {
    setShowBulkServiceModal(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div 
        className={`relative w-full max-w-6xl p-6 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto
          ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold mb-6">Importar contactos</h2>
        
        {showPreview && previewData && (
          <div className="mb-6">
            {/* Información de filas seleccionadas */}
            <div className="flex justify-between items-center mb-4">
              <div>
                {selectedRows.size > 0 && (
                  <span className="text-sm">
                    {selectedRows.size} {selectedRows.size === 1 ? 'contacto seleccionado' : 'contactos seleccionados'}
                  </span>
                )}
              </div>
              {/* Se ha eliminado el botón de asociar servicio masivamente */}
            </div>

            {/* Sección de Mapeo de Campos */}
            <div className="mb-6 p-4 rounded-xl border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Mapeo de Campos</h3>
              <p className="text-sm mb-4">Asigna cada columna del CSV a un campo correspondiente del cliente:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewData.headers.map((header, index) => (
                  <div key={index} className="flex flex-col p-3 rounded-lg border">
                    <label className="text-sm font-medium mb-1">
                      {header}
                      {(fieldMapping[index.toString()] === "nombre" ||
                        fieldMapping[index.toString()] === "apellidos" ||
                        fieldMapping[index.toString()] === "email") && (
                        <span className="ml-2 text-xs font-normal text-green-600">(Obligatorio)</span>
                      )}
                    </label>
                    <select
                      value={fieldMapping[index.toString()] || ""}
                      onChange={(e) => handleFieldMappingChange(index.toString(), e.target.value)}
                      className="p-2 rounded-md border"
                    >
                      <option value="">No mapear</option>
                      <option value="nombre">Nombre</option>
                      <option value="apellidos">Apellidos</option>
                      <option value="email">Email</option>
                      <option value="telefono">Teléfono</option>
                      <option value="fechaNacimiento">Fecha de Nacimiento</option>
                      <option value="genero">Género</option>
                      <option value="altura">Altura</option>
                      <option value="peso">Peso</option>
                      <option value="direccion.calle">Calle</option>
                      <option value="direccion.ciudad">Ciudad</option>
                      <option value="direccion.codigoPostal">Código Postal</option>
                      <option value="direccion.pais">País</option>
                      <option value="condicionesMedicas">Condiciones Médicas</option>
                      <option value="redesSociales.instagram">Instagram</option>
                      <option value="redesSociales.facebook">Facebook</option>
                      <option value="redesSociales.twitter">Twitter</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            {/* Vista previa del CSV */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="font-medium text-left p-3 border-b w-10">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.size === previewData.rows.length && previewData.rows.length > 0}
                        onChange={toggleAllRows}
                        className="w-4 h-4 rounded"
                      />
                    </th>
                    {previewData.headers.map((header, index) => (
                      <th 
                        key={index} 
                        className={`font-medium text-left p-3 border-b ${
                          fieldMapping[index.toString()] 
                            ? theme === 'dark' 
                              ? 'bg-blue-900/30' 
                              : 'bg-blue-100'
                            : ''
                        }`}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center space-x-1 text-sm">
                            <span>{header}</span>
                            <ChevronDown className="w-4 h-4" />
                          </div>
                          {fieldMapping[index.toString()] && (
                            <span className="text-xs text-green-600 font-medium mt-1">
                              {fieldMapping[index.toString()].replace('direccion.', '')}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="font-medium text-left p-3 border-b w-24">
                      <span className="text-sm">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b last:border-b-0">
                      <td className="p-3 text-sm">
                        <input 
                          type="checkbox" 
                          checked={selectedRows.has(rowIndex)}
                          onChange={() => toggleRowSelection(rowIndex)}
                          className="w-4 h-4 rounded"
                        />
                      </td>
                      {row.map((cell, cellIndex) => (
                        <td 
                          key={cellIndex} 
                          className={`p-3 text-sm ${
                            fieldMapping[cellIndex.toString()] 
                              ? theme === 'dark' 
                                ? 'bg-blue-900/20' 
                                : 'bg-blue-50'
                              : ''
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                      <td className="p-3 text-sm">
                        <button
                          onClick={() => handleAssociateService(rowIndex)}
                          className={`p-1 rounded text-xs flex items-center ${
                            theme === 'dark' 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                          }`}
                        >
                          <Link2 className="w-3 h-3 mr-1" />
                          <span>Asociar</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <div>
                <p className="text-gray-500">{previewData.rows.length} líneas de previsualización</p>
                <p className="text-gray-500">{previewData.totalRows} Elementos a importar</p>
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  variant="secondary" 
                  onClick={onClose}
                  disabled={isUploading}
                >
                  Volver
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleUpload}
                  disabled={!file || isUploading}
                >
                  {isUploading ? (
                    <span>Procesando...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Importar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para asociación de servicio individual */}
        {showServiceModal !== null && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`relative w-full max-w-md p-6 rounded-xl shadow-xl max-h-[80vh] overflow-y-auto
              ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
              <button 
                onClick={closeServiceModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X className="w-5 h-5" />
              </button>
              
              <h3 className="text-lg font-bold mb-4">Asociar Servicio</h3>
              <p className="mb-4 text-sm">
                Seleccione un servicio para asociar con el contacto: 
                <span className="font-medium">
                  {previewData?.rows[showServiceModal]?.[0] || 'Contacto'}
                </span>
              </p>
              
              <div className={`p-3 mb-4 border rounded-lg 
                ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <select 
                  className={`w-full p-2 rounded border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  }`}
                >
                  <option value="">Seleccionar servicio...</option>
                  <option value="hosting">Hosting</option>
                  <option value="dominio">Dominio</option>
                  <option value="desarrollo">Desarrollo Web</option>
                  <option value="seo">SEO</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="secondary" 
                  onClick={closeServiceModal}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => {
                    closeServiceModal();
                  }}
                >
                  Asociar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Vista inicial para seleccionar el archivo CSV */}
        {!showPreview && (
          <>
            <div 
              className={`border-2 border-dashed rounded-lg p-8 mb-4 text-center cursor-pointer
                ${theme === 'dark' 
                  ? 'border-gray-600 hover:border-gray-500' 
                  : 'border-gray-300 hover:border-gray-400'
                } transition-colors`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden" 
              />
              
              {file ? (
                <div className="flex flex-col items-center">
                  <FileText className="w-12 h-12 text-blue-500 mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                  {previewData && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowPreview(!showPreview);
                      }}
                      className="mt-2 flex items-center text-blue-500 hover:text-blue-600 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Ver vista previa
                    </button>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="font-medium">Arrastra y suelta tu archivo CSV aquí</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    o haz clic para seleccionar un archivo
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className={`p-3 mb-4 rounded-lg flex items-center 
                ${theme === 'dark' ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'}`}>
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {isUploading && (
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Subiendo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <Button 
                variant="secondary" 
                onClick={onClose}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex items-center"
              >
                {isUploading ? (
                  <span>Procesando...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    <span>Importar</span>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              <p>Formato esperado: El archivo CSV debe contener columnas para nombre, apellidos, email, teléfono, fecha de nacimiento, género, altura, peso, dirección y condiciones médicas.</p>
              <p className="mt-1">Tamaño máximo: 5MB</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CSVPopup;
