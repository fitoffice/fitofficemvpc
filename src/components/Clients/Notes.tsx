import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { StickyNote, Plus, Trash2, Edit2, Save, X, Loader } from 'lucide-react';
import Button from '../Common/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotes, Note } from '../../contexts/NotesContext';

// Keep the existing categoryColors and categoryLabels
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

// Update the NotesProps interface
interface NotesProps {
  notes?: Note[];
  onAddNote?: (note: Omit<Note, '_id'>) => void;
  onEditNote?: (id: string, note: Partial<Note>) => void;
  onDeleteNote?: (id: string) => void;
  useContextNotes?: boolean;
  clientId?: string;
}

const Notes: React.FC<NotesProps> = ({ 
  notes = [], 
  onAddNote, 
  onEditNote, 
  onDeleteNote,
  useContextNotes = true,
  clientId
}) => {
  const { theme } = useTheme();
  const [newNote, setNewNote] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Note['categoria']>('general');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get notes from context
  const notesContext = useNotes();
  
  // Set client ID in context if provided
  useEffect(() => {
    if (useContextNotes && clientId) {
      notesContext.setClientId(clientId);
    }
  }, [clientId, useContextNotes, notesContext]);
  
  // Use either context notes or prop notes based on the flag
  const [localNotes, setLocalNotes] = useState<Note[]>(
    useContextNotes ? notesContext.notes : notes
  );

  // Update localNotes when either context notes or prop notes change
  useEffect(() => {
    if (useContextNotes) {
      setLocalNotes(notesContext.notes);
    } else {
      setLocalNotes(notes);
    }
  }, [useContextNotes, notesContext.notes, notes]);

  const handleAddNote = async () => {
    if (newNote.trim()) {
      setIsSubmitting(true);
      
      const newNoteData = {
        texto: newNote,
        fechaCreacion: new Date().toISOString(),
        version: 1,
        categoria: selectedCategory
      };
      
      try {
        if (useContextNotes) {
          await notesContext.addNote(newNoteData);
        } else if (onAddNote) {
          onAddNote(newNoteData);
          // Add to local state with a temporary ID
          setLocalNotes([...localNotes, { ...newNoteData, _id: Date.now().toString() }]);
        }
        
        setNewNote('');
      } catch (error) {
        console.error('Error adding note:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      if (useContextNotes) {
        await notesContext.deleteNote(id);
      } else if (onDeleteNote) {
        onDeleteNote(id);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note._id);
    setEditContent(note.texto);
  };

  const handleSaveEdit = async (id: string) => {
    setIsSubmitting(true);
    
    try {
      if (useContextNotes) {
        await notesContext.editNote(id, { texto: editContent });
      } else if (onEditNote) {
        onEditNote(id, { texto: editContent });
      }
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keep the existing formatearFecha function
  const formatearFecha = (fecha: string) => {
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) {
        console.error('Fecha inválida:', fecha);
        return 'Fecha inválida';
      }

      // Ajustar la fecha a la zona horaria local
      const fechaLocal = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      
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

  return (
    <div className={`p-6 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'} transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold">Notas</h3>
        </div>
        
        {/* Show loading indicator when context is loading */}
        {useContextNotes && notesContext.loading && (
          <div className="flex items-center text-blue-500">
            <Loader className="w-4 h-4 animate-spin mr-2" />
            <span className="text-sm">Cargando...</span>
          </div>
        )}
      </div>

      {/* Show error message if there's an error */}
      {useContextNotes && notesContext.error && (
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
              ${theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-gray-100 text-gray-900 border-gray-200'
              }
              border focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors duration-200
            `}
            disabled={isSubmitting}
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value} className={
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }>
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
              ${theme === 'dark'
                ? 'bg-gray-700 text-white placeholder-gray-400'
                : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            disabled={isSubmitting}
          />
          <Button
            variant="normal"
            onClick={handleAddNote}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            disabled={isSubmitting || !newNote.trim()}
          >
            {isSubmitting ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span>Agregar</span>
          </Button>
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
                  : theme === 'dark'
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
      <div className="space-y-4">
        {useContextNotes && notesContext.loading && !localNotes.length ? (
          <div className="text-center py-8">
            <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-500">Cargando notas...</p>
          </div>
        ) : localNotes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <StickyNote className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No hay notas disponibles</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {localNotes.map((note) => (
              <motion.div
                key={note._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`
                  p-4 rounded-lg
                  ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}
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
                          ${theme === 'dark'
                            ? 'bg-gray-600 text-white'
                            : 'bg-white text-gray-900'
                          }
                        `}
                        disabled={isSubmitting}
                      />
                    ) : (
                      <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>
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
                          onClick={() => handleSaveEdit(note._id)}
                          className="text-green-500 hover:text-green-600"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <Loader className="w-4 h-4 animate-spin" />
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
                          onClick={() => handleEditNote(note)}
                          className="text-blue-500 hover:text-blue-600"
                          disabled={isSubmitting}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="normal"
                          onClick={() => handleDeleteNote(note._id)}
                          className="text-red-500 hover:text-red-600"
                          disabled={isSubmitting}
                        >
                          <Trash2 className="w-4 h-4" />
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
  );
};

export default Notes;