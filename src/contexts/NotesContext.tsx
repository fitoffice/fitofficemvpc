import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import axios from 'axios';

// Define the Note interface (same as in your components)
export interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}

// Define the context interface
interface NotesContextType {
    notes: Note[];
    addNote: (note: Omit<Note, '_id'>) => Promise<void>;
    editNote: (id: string, note: Partial<Note>) => Promise<void>;
    deleteNote: (id: string) => Promise<void>;
    setClientNotes: (notes: Note[]) => void;
    clientId: string | null;
    setClientId: (id: string | null) => void;
    fetchClientNotes: (clientId: string) => Promise<void>;
    refreshNotes: () => Promise<void>; // New function to force refresh
    loading: boolean;
    error: string | null;
  }
  
// Create the context with default values
const NotesContext = createContext<NotesContextType>({
    notes: [],
    addNote: async () => {},
    editNote: async () => {},
    deleteNote: async () => {},
    setClientNotes: () => {},
    clientId: null,
    setClientId: () => {},
    fetchClientNotes: async () => {},
    refreshNotes: async () => {}, // Add default implementation
    loading: false,
    error: null,
  });
// Create a provider component
interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [clientId, setClientId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const notesCache = useRef<Record<string, Note[]>>({});
  
  // Fetch notes when clientId changes, but only if we haven't fetched for this client before
  const fetchClientNotes = async (id: string) => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${id}/notas`);
      // Ensure we're setting an array
      const responseData = response.data;
      const notesArray = Array.isArray(responseData) ? responseData : [];
      
      // Cache the notes
      notesCache.current[id] = notesArray;
      
      // Only update state if this is still the current client
      if (clientId === id) {
        setNotes(notesArray);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
      setError('Error al cargar las notas');
      if (clientId === id) {
        setNotes([]); // Reset to empty array on error
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch notes for a client
  // Function to add a new note
  const addNote = async (note: Omit<Note, '_id'>) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${clientId}/notas`, note);
      const newNote = response.data;
      
      // Update both state and cache
      setNotes(prevNotes => {
        const updatedNotes = [...(Array.isArray(prevNotes) ? prevNotes : []), newNote];
        // Also update the cache
        if (clientId) {
          notesCache.current[clientId] = updatedNotes;
        }
        return updatedNotes;
      });
    } catch (err) {
      console.error('Error adding note:', err);
      setError('Error al añadir la nota');
    } finally {
      setLoading(false);
    }
  };
    const setClientIdSafe = (id: string | null) => {
    setClientId(id);
    // If we have cached notes for this client, use them
    if (id && notesCache.current[id]) {
      setNotes(notesCache.current[id]);
    } else if (id === null) {
      // Clear notes when no client is selected
      setNotes([]);
    }
  };


  // Function to edit a note
  const editNote = async (id: string, updatedNote: Partial<Note>) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${clientId}/notas/${id}`, updatedNote);
      const editedNote = response.data;
      
      setNotes(prevNotes => {
        // Ensure prevNotes is an array before mapping
        const safeNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return safeNotes.map(note =>
          note._id === id ? { ...note, ...editedNote } : note
        );
      });
    } catch (err) {
      console.error('Error editing note:', err);
      setError('Error al editar la nota');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a note
  const deleteNote = async (id: string) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${clientId}/notas/${id}`);
      setNotes(prevNotes => {
        // Ensure prevNotes is an array before filtering
        const safeNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return safeNotes.filter(note => note._id !== id);
      });
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Error al eliminar la nota');
    } finally {
      setLoading(false);
    }
  };

  // Function to set all notes for a client
  const setClientNotes = (clientNotes: Note[]) => {
    // Ensure we're setting an array
    const safeNotes = Array.isArray(clientNotes) ? clientNotes : [];
    setNotes(safeNotes);
    
    // Also update the cache if we have a clientId
    if (clientId) {
      notesCache.current[clientId] = safeNotes;
    }
  };

  // Add a function to force refresh notes if needed
  const refreshNotes = async () => {
    if (clientId) {
      await fetchClientNotes(clientId);
    }
  };

  // The context value
  const contextValue: NotesContextType = {
    notes: Array.isArray(notes) ? notes : [], // Ensure notes is always an array
    addNote,
    editNote,
    deleteNote,
    setClientNotes,
    clientId,
    setClientId: setClientIdSafe, // Use our safe version
    fetchClientNotes,
    refreshNotes,
    loading,
    error,
  };

  return (
    <NotesContext.Provider value={contextValue}>
      {children}
    </NotesContext.Provider>
  );
};

// Custom hook to use the notes context
export const useNotes = () => useContext(NotesContext);

