import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Check,
  X,
  Filter,
  Tag,
  BookOpen,
  Dumbbell,
  Apple,
  StickyNote,
  DollarSign,
  Search,
  Edit2,
  Save,
  ChevronRight,
} from 'lucide-react';
import Button from '../Common/Button';
import Calendar from 'react-calendar';
import './PanelAgenda.css';
import EventoPopup from './EventoPopup';
import { useNotes } from '../../contexts/NotesContext';

interface PanelAgendaProps {
  clienteId: string;
  clienteName?: string;
  notas?: Note[];
  onAddNote?: (note: Omit<Note, '_id'>) => void;
  onEditNote?: (id: string, note: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
}

interface Evento {
  id: string;
  fecha: Date;
  hora: string;
  tipo: 'entrenamiento' | 'nutricion' | 'finanzas' | 'otro';
  titulo: string;
  descripcion?: string;
  esDelEntrenador: boolean;
}

interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}
interface Nota {
  id: string;
  fecha: Date;
  titulo: string;
  contenido: string;
  tags: string[];
  categoria: 'nutricion' | 'entrenamiento' | 'finanzas' | 'general';
}
const categoryColors = {
  general: 'bg-gray-500',
  training: 'bg-blue-500',
  diet: 'bg-green-500',
  medical: 'bg-red-500'
};

const categoryLabels = {
  general: 'General',
  training: 'Entrenamiento',
  diet: 'Nutrición',
  medical: 'Médico'
};

const PanelAgenda: React.FC<PanelAgendaProps> = ({ 
  clienteId, 
  clienteName, 
  notas = [], 
  onAddNote, 
  onEditNote, 
  onDeleteNote 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'calendario' | 'notas'>('calendario');
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [notasLocales, setNotasLocales] = useState<Nota[]>([]);
  const [filtroCategoria, setFiltroCategoria] = useState<string>('todos');
  const [mostrarFormularioEvento, setMostrarFormularioEvento] = useState(false);
  const [mostrarFormularioNota, setMostrarFormularioNota] = useState(false);
  const [mostrarPopupEvento, setMostrarPopupEvento] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [nuevoEvento, setNuevoEvento] = useState<Partial<Evento>>({
    fecha: new Date(),
    hora: '',
    tipo: 'entrenamiento',
    esDelEntrenador: false,
  });
  const [nuevaNota, setNuevaNota] = useState<Partial<Nota>>({
    fecha: new Date(),
    titulo: '',
    contenido: '',
    tags: [],
    categoria: 'general',
  });
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Note['categoria']>('general');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [localNotes, setLocalNotes] = useState<Note[]>(notas);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notesContext = useNotes();
  const [hasInitialized, setHasInitialized] = useState(false);

<<<<<<< HEAD
  // MODIFICADO: Solo se ejecuta al montar o cambiar clienteId, sin sincronizar continuamente con la prop "notas"
  useEffect(() => {
    if (clienteId && !hasInitialized) {
      // Establecer el clientId en el contexto
      notesContext.setClientId(clienteId);
      
      // Si existen notas iniciales por props y el contexto aún está vacío, se cargan
      if (clienteId && notas.length > 0 && notesContext.notes.length === 0) {
        notesContext.setClientNotes(notas);
      } else if (notesContext.notes.length === 0) {
        // Si no hay notas en el contexto, se realiza la petición para obtenerlas
        notesContext.fetchClientNotes(clienteId);
      }
      
      // Marcar que ya se inicializó para evitar sobrescribir el estado posteriormente
      setHasInitialized(true);
    }
  }, [clienteId, hasInitialized]); // Se elimina "notas" y "notesContext" del array de dependencias
=======

  useEffect(() => {
    if (clienteId && !hasInitialized) {
      notesContext.setClientId(clienteId);
      // Only fetch notes if we don't already have them in the context
      if (!notesContext.notes || notesContext.notes.length === 0) {
        notesContext.fetchClientNotes(clienteId);
      }
      setHasInitialized(true);
    }
  }, [clienteId, notesContext, hasInitialized]);
  
  // Update the context notes when the prop notes change
  useEffect(() => {
    if (notas.length > 0 && clienteId) {
      notesContext.setClientNotes(notas);
    }
  }, [notas, notesContext, clienteId]);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25

  const safeNotes = Array.isArray(notesContext.notes) ? notesContext.notes : [];

  const categoriasNotas = [
    { valor: 'nutricion', icono: <Apple size={18} />, color: 'bg-green-100 text-green-600' },
    { valor: 'entrenamiento', icono: <Dumbbell size={18} />, color: 'bg-blue-100 text-blue-600' },
    { valor: 'finanzas', icono: <DollarSign size={18} />, color: 'bg-yellow-100 text-yellow-600' },
    { valor: 'general', icono: <BookOpen size={18} />, color: 'bg-gray-100 text-gray-600' },
  ];

  const tiposEvento = [
    { valor: 'entrenamiento', color: 'bg-blue-500' },
    { valor: 'nutricion', color: 'bg-green-500' },
    { valor: 'finanzas', color: 'bg-yellow-500' },
    { valor: 'otro', color: 'bg-purple-500' },
  ];
  const handleAddNote = async () => {
    if (newNote.trim()) {
      setIsSubmitting(true);
      try {
        const newNoteData = {
          texto: newNote,
          fechaCreacion: new Date().toISOString(),
          version: 1,
          categoria: selectedCategory
        };
        
<<<<<<< HEAD
        // Se usa la función del context para agregar la nota
=======
        // Use the context's addNote function
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
        await notesContext.addNote(newNoteData);
        setNewNote('');
      } catch (error) {
        console.error('Error adding note:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleDeleteNote = (id: string) => {
    if (onDeleteNote) {
      onDeleteNote(id);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note._id);
    setEditContent(note.texto);
  };

  const handleSaveEdit = (id: string) => {
    if (onEditNote) {
      onEditNote(id, { texto: editContent });
      setEditingNote(null);
    }
  };

  // Función para formatear la fecha (igual que en Notes.tsx)
  const formatearFecha = (fecha: string | undefined) => {
    try {
      // If fecha is undefined, use current date
      const dateToFormat = fecha ? new Date(fecha) : new Date();
      
      if (isNaN(dateToFormat.getTime())) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }

      // Ajustar la fecha a la zona horaria local
      const fechaLocal = new Date(dateToFormat.getTime() - (dateToFormat.getTimezoneOffset() * 60000));
      
      return fechaLocal.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  };
  const filtrarEventosPorFecha = (fecha: Date) => {
    return eventos.filter(evento => 
      evento.fecha.toDateString() === fecha.toDateString()
    );
  };

  const filtrarNotas = () => {
    let notasFiltradas = notasLocales;
    
    if (filtroCategoria !== 'todos') {
      notasFiltradas = notasFiltradas.filter(nota => nota.categoria === filtroCategoria);
    }
    
    if (searchTerm.trim() !== '') {
      const termLower = searchTerm.toLowerCase();
      notasFiltradas = notasFiltradas.filter(nota => 
        nota.titulo.toLowerCase().includes(termLower) || 
        nota.contenido.toLowerCase().includes(termLower) ||
        nota.tags.some(tag => tag.toLowerCase().includes(termLower))
      );
    }
    
    return notasFiltradas;
  };
  const agregarEvento = () => {
    if (nuevoEvento.titulo && nuevoEvento.hora) {
      const eventoCompleto: Evento = {
        id: Date.now().toString(),
        fecha: nuevoEvento.fecha || new Date(),
        hora: nuevoEvento.hora,
        tipo: nuevoEvento.tipo || 'otro',
        titulo: nuevoEvento.titulo,
        descripcion: nuevoEvento.descripcion,
        esDelEntrenador: nuevoEvento.esDelEntrenador || false,
      };
      setEventos([...eventos, eventoCompleto]);
      setMostrarFormularioEvento(false);
      setNuevoEvento({
        fecha: new Date(),
        hora: '',
        tipo: 'entrenamiento',
        esDelEntrenador: false,
      });
    }
  };

  const agregarNota = () => {
    if (nuevaNota.titulo && nuevaNota.contenido) {
      const notaCompleta: Nota = {
        id: Date.now().toString(),
        fecha: new Date(),
        titulo: nuevaNota.titulo,
        contenido: nuevaNota.contenido,
        tags: nuevaNota.tags || [],
        categoria: nuevaNota.categoria || 'general',
      };
      setNotasLocales([...notasLocales, notaCompleta]);
      setMostrarFormularioNota(false);
      setNuevaNota({
        fecha: new Date(),
        titulo: '',
        contenido: '',
        tags: [],
        categoria: 'general',
      });
    }
  };

  const handleCrearEvento = (eventoNuevo: Evento) => {
    setEventos([...eventos, eventoNuevo]);
    setMostrarPopupEvento(false);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('es-ES', options);
  };

  return (
<<<<<<< HEAD
    <div className="panel-agenda rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden h-full flex flex-col">
=======
    <div className="panel-agenda rounded-lg shadow-lg bg-white dark:bg-gray-800 overflow-hidden">
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      <div className="tabs-container p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Agenda Personal</h2>
          <div className="flex space-x-2">
            <button
              className={`tab-button px-4 py-2 rounded-full transition-all ${
                activeTab === 'calendario' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'bg-blue-600 bg-opacity-30 hover:bg-opacity-40'
              }`}
              onClick={() => setActiveTab('calendario')}
            >
              <div className="flex items-center">
                <CalendarIcon size={18} className="mr-2" />
                <span>Calendario</span>
              </div>
            </button>
            <button
              className={`tab-button px-4 py-2 rounded-full transition-all ${
                activeTab === 'notas' 
                  ? 'bg-white text-blue-600 shadow-md' 
                  : 'bg-blue-600 bg-opacity-30 hover:bg-opacity-40'
              }`}
              onClick={() => setActiveTab('notas')}
            >
              <div className="flex items-center">
                <BookOpen size={18} className="mr-2" />
                <span>Notas</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'calendario' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="calendario-container p-4 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="calendar-wrapper md:col-span-1 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                className="custom-calendar"
                tileContent={({ date }) => {
                  const eventosDelDia = filtrarEventosPorFecha(date);
                  return eventosDelDia.length > 0 ? (
                    <div className="evento-indicator flex justify-center items-center">
                      <span className="w-6 h-6 flex items-center justify-center bg-blue-500 text-white text-xs rounded-full">
                        {eventosDelDia.length}
                      </span>
                    </div>
                  ) : null;
                }}
              />
            </div>

            <div className="eventos-del-dia md:col-span-2 bg-white dark:bg-gray-700 rounded-lg shadow p-4">
              <div className="header-eventos flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                  {formatDate(selectedDate)}
                </h3>
                <Button
                  onClick={() => setMostrarPopupEvento(true)}
                  className="btn-agregar-popup bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-all shadow-md"
                >
                  <Plus size={18} className="mr-2" />
                  Añadir Evento
                </Button>
              </div>

              <div className="lista-eventos space-y-3">
                {filtrarEventosPorFecha(selectedDate).length > 0 ? (
                  filtrarEventosPorFecha(selectedDate).map(evento => {
                    const tipoEvento = tiposEvento.find(t => t.valor === evento.tipo);
                    return (
                      <motion.div 
                        key={evento.id} 
                        className={`evento-card rounded-lg p-4 border-l-4 ${tipoEvento?.color.replace('bg-', 'border-')} bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all flex`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className={`evento-hora-badge w-16 h-16 rounded-full ${tipoEvento?.color} text-white flex flex-col items-center justify-center mr-4 shadow-md`}>
                          <Clock size={16} />
                          <span className="text-sm font-bold">{evento.hora}</span>
                        </div>
                        <div className="evento-contenido flex-1">
                          <h4 className="text-lg font-bold text-gray-800 dark:text-white">{evento.titulo}</h4>
                          {evento.descripcion && <p className="text-gray-600 dark:text-gray-300 mt-1">{evento.descripcion}</p>}
                          <div className="flex mt-2">
                            {evento.esDelEntrenador && (
                              <span className="badge-entrenador bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full">
                                Entrenador
                              </span>
                            )}
                            <span className={`ml-2 text-xs px-2 py-1 rounded-full ${tipoEvento?.color} bg-opacity-20 text-${tipoEvento?.color.split('-')[1]}-600`}>
                              {evento.tipo.charAt(0).toUpperCase() + evento.tipo.slice(1)}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="empty-state p-8 text-center">
                    <div className="empty-icon mb-4 text-gray-300 dark:text-gray-600 flex justify-center">
                      <CalendarIcon size={64} />
                    </div>
                    <h4 className="text-lg font-medium text-gray-500 dark:text-gray-400">No hay eventos para este día</h4>
                    <p className="text-gray-400 dark:text-gray-500 mt-2">Haz clic en "Añadir Evento" para programar algo</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'notas' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
<<<<<<< HEAD
            className="notas-container p-4 flex-1 flex flex-col"
          >
            <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'} transition-all duration-300 flex-1 flex flex-col`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <StickyNote className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Notas del Cliente</h3> 
=======
            className="notas-container p-4"
          >
            <div className={`p-6 rounded-xl shadow-lg ${isDark ? 'bg-gray-800/50' : 'bg-white'} transition-all duration-300 mb-6`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <StickyNote className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Notas del Cliente</h3>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                </div>
                
                {/* Show loading indicator when context is loading */}
                {notesContext.loading && (
                  <div className="flex items-center text-blue-500">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span className="text-sm">Cargando...</span>
                  </div>
                )}
              </div>

              {/* Show error message if there's an error */}
              {notesContext.error && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
                  {notesContext.error}
                </div>
              )}

              {/* Input para nueva nota */}
              <div className="mb-6 space-y-2">
                <div className="flex space-x-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as Note['categoria'])}
                    className={`
                      px-3 py-2 rounded-lg
                      ${isDark
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-gray-100 text-gray-900 border-gray-200'
                      }
                      border focus:outline-none focus:ring-2 focus:ring-blue-500
                      transition-colors duration-200
                    `}
                    disabled={isSubmitting}
                  >
                    {Object.entries(categoryLabels).map(([value, label]) => (
<<<<<<< HEAD
                      <option key={value} value={value} className={isDark ? 'bg-gray-700' : 'bg-white'}>
=======
                      <option key={value} value={value} className={
                        isDark ? 'bg-gray-700' : 'bg-white'
                      }>
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Escribe una nueva nota..."
                    className={`
                      flex-1 p-2 rounded-lg
                      ${isDark
                        ? 'bg-gray-700 text-white placeholder-gray-400'
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                    disabled={isSubmitting}
                  />
                  <Button
<<<<<<< HEAD
                    variant="normal"
                    onClick={handleAddNote}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                    disabled={isSubmitting || !newNote.trim()}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>Agregar</span>
                  </Button>
=======
  variant="normal"
  onClick={handleAddNote}
  className="bg-blue-500 hover:bg-blue-600 text-white"
  disabled={isSubmitting || !newNote.trim()}
>
  {isSubmitting ? (
    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  ) : (
    <Plus className="w-4 h-4" />
  )}
  <span>Agregar</span>
</Button>

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categoryLabels).map(([category, label]) => (
                    <span
                      key={category}
                      onClick={() => !isSubmitting && setSelectedCategory(category as Note['categoria'])}
                      className={`
                        px-2 py-1 rounded-full text-xs cursor-pointer
                        transition-colors duration-200
                        ${selectedCategory === category
                          ? `${categoryColors[category as keyof typeof categoryColors]} text-white`
                          : isDark
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }
                        ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {/* Lista de notas */}
<<<<<<< HEAD
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
=======
              <div className="space-y-4">
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
                {notesContext.loading && !safeNotes.length ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">Cargando notas...</p>
                  </div>
                ) : safeNotes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No hay notas disponibles</p>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {safeNotes.map((note) => (
                      <motion.div
                        key={note._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className={`
                          p-4 rounded-lg
                          ${isDark ? 'bg-gray-700' : 'bg-gray-100'}
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            {editingNote === note._id ? (
                              <input
                                type="text"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className={`
                                  w-full p-2 rounded
                                  ${isDark
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-white text-gray-900'
                                  }
                                `}
                                disabled={isSubmitting}
                              />
                            ) : (
                              <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                                {note.texto}
                              </p>
                            )}
                            <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
                              <span>{formatearFecha(note.fechaCreacion)}</span>
                              <span>•</span>
                              <span className={`px-2 py-0.5 rounded ${categoryColors[note.categoria]} text-white`}>
                                {categoryLabels[note.categoria]}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            {editingNote === note._id ? (
                              <>
                                <Button
                                  variant="normal"
                                  onClick={async () => {
                                    setIsSubmitting(true);
                                    try {
                                      await notesContext.editNote(note._id, { texto: editContent });
                                      setEditingNote(null);
                                    } catch (error) {
                                      console.error('Error updating note:', error);
                                    } finally {
                                      setIsSubmitting(false);
                                    }
                                  }}
                                  className="text-green-500 hover:text-green-600"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Save className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="normal"
                                  onClick={() => setEditingNote(null)}
                                  className="text-gray-500 hover:text-gray-600"
                                  disabled={isSubmitting}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="normal"
                                  onClick={() => {
                                    setEditingNote(note._id);
                                    setEditContent(note.texto);
                                  }}
                                  className="text-blue-500 hover:text-blue-600"
                                  disabled={isSubmitting}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="normal"
                                  onClick={async () => {
                                    setIsSubmitting(true);
                                    try {
                                      await notesContext.deleteNote(note._id);
                                    } catch (error) {
                                      console.error('Error deleting note:', error);
                                    } finally {
                                      setIsSubmitting(false);
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-600"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? (
                                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <Trash2 className="w-4 h-4" />
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
<<<<<<< HEAD
      {/* Modal para nuevo evento (existente) */}
      {mostrarFormularioEvento && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nuevo Evento</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Título del evento"
                  value={nuevoEvento.titulo || ''}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora</label>
                <input
                  type="time"
                  value={nuevoEvento.hora || ''}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                <select
                  value={nuevoEvento.tipo || 'entrenamiento'}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="entrenamiento">Entrenamiento</option>
                  <option value="nutricion">Nutrición</option>
                  <option value="finanzas">Finanzas</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (opcional)</label>
                <textarea
                  placeholder="Descripción del evento"
                  value={nuevoEvento.descripcion || ''}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                />
              </div>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nuevoEvento.esDelEntrenador || false}
                  onChange={e => setNuevoEvento({ ...nuevoEvento, esDelEntrenador: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Evento del entrenador</span>
              </label>
            </div>
            
            <div className="modal-actions flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setMostrarFormularioEvento(false)}
                className="btn-cancelar bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all"
              >
                <X size={18} className="mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={agregarEvento} 
                className="btn-guardar bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
              >
                <Check size={18} className="mr-2" />
                Guardar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
  
      {/* Nuevo popup de evento usando el componente externo */}
      {mostrarPopupEvento && (
        <EventoPopup 
          onClose={() => setMostrarPopupEvento(false)}
          onSave={handleCrearEvento}
          fechaSeleccionada={selectedDate}
        />
      )}
  
      {/* Modal para nueva nota */}
      {mostrarFormularioNota && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nueva Nota</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                <input
                  type="text"
                  placeholder="Título de la nota"
                  value={nuevaNota.titulo || ''}
                  onChange={e => setNuevaNota({ ...nuevaNota, titulo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                <select
                  value={nuevaNota.categoria || 'general'}
                  onChange={e => setNuevaNota({ ...nuevaNota, categoria: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categoriasNotas.map(cat => (
                    <option key={cat.valor} value={cat.valor}>
                      {cat.valor.charAt(0).toUpperCase() + cat.valor.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
                <textarea
                  placeholder="Contenido de la nota"
                  value={nuevaNota.contenido || ''}
                  onChange={e => setNuevaNota({ ...nuevaNota, contenido: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (separados por comas)</label>
                <input
                  type="text"
                  placeholder="ej: importante, seguimiento, revisión"
                  value={nuevaNota.tags?.join(', ') || ''}
                  onChange={e => setNuevaNota({
                    ...nuevaNota,
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="modal-actions flex justify-end space-x-3 mt-6">
              <Button
                onClick={() => setMostrarFormularioNota(false)}
                className="btn-cancelar bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all"
              >
                <X size={18} className="mr-2" />
                Cancelar
              </Button>
              <Button 
                onClick={agregarNota} 
                className="btn-guardar bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
              >
                <Check size={18} className="mr-2" />
                Guardar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PanelAgenda;
=======
        {/* Modal para nuevo evento (existente) */}
        {mostrarFormularioEvento && (
          <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nuevo Evento</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    placeholder="Título del evento"
                    value={nuevoEvento.titulo || ''}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hora</label>
                  <input
                    type="time"
                    value={nuevoEvento.hora || ''}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, hora: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                  <select
                    value={nuevoEvento.tipo || 'entrenamiento'}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, tipo: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entrenamiento">Entrenamiento</option>
                    <option value="nutricion">Nutrición</option>
                    <option value="finanzas">Finanzas</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción (opcional)</label>
                  <textarea
                    placeholder="Descripción del evento"
                    value={nuevoEvento.descripcion || ''}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nuevoEvento.esDelEntrenador || false}
                    onChange={e => setNuevoEvento({ ...nuevoEvento, esDelEntrenador: e.target.checked })}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Evento del entrenador</span>
                </label>
              </div>
              
              <div className="modal-actions flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setMostrarFormularioEvento(false)}
                  className="btn-cancelar bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all"
                >
                  <X size={18} className="mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={agregarEvento} 
                  className="btn-guardar bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                >
                  <Check size={18} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
  
        {/* Nuevo popup de evento usando el componente externo */}
        {mostrarPopupEvento && (
          <EventoPopup 
            onClose={() => setMostrarPopupEvento(false)}
            onSave={handleCrearEvento}
            fechaSeleccionada={selectedDate}
          />
        )}
  
        {/* Modal para nueva nota */}
        {mostrarFormularioNota && (
          <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="modal bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Nueva Nota</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título</label>
                  <input
                    type="text"
                    placeholder="Título de la nota"
                    value={nuevaNota.titulo || ''}
                    onChange={e => setNuevaNota({ ...nuevaNota, titulo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                  <select
                    value={nuevaNota.categoria || 'general'}
                    onChange={e => setNuevaNota({ ...nuevaNota, categoria: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categoriasNotas.map(cat => (
                      <option key={cat.valor} value={cat.valor}>
                        {cat.valor.charAt(0).toUpperCase() + cat.valor.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenido</label>
                  <textarea
                    placeholder="Contenido de la nota"
                    value={nuevaNota.contenido || ''}
                    onChange={e => setNuevaNota({ ...nuevaNota, contenido: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (separados por comas)</label>
                  <input
                    type="text"
                    placeholder="ej: importante, seguimiento, revisión"
                    value={nuevaNota.tags?.join(', ') || ''}
                    onChange={e => setNuevaNota({
                      ...nuevaNota,
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="modal-actions flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setMostrarFormularioNota(false)}
                  className="btn-cancelar bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-all"
                >
                  <X size={18} className="mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={agregarNota} 
                  className="btn-guardar bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-all"
                >
                  <Check size={18} className="mr-2" />
                  Guardar
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    );
  };
  
  export default PanelAgenda;
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
