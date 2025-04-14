<<<<<<< HEAD
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import axios from 'axios';

=======
import React, { createContext, useState, useContext, ReactNode, useEffect, useRef } from 'react';
import axios from 'axios';

// Define the Note interface (same as in your components)
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
export interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}

<<<<<<< HEAD
interface NotesContextType {
  notes: Note[];
  addNote: (note: Omit<Note, '_id'>) => Promise<void>;
  editNote: (id: string, note: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  setClientNotes: (notes: Note[]) => void;
  clientId: string | null;
  setClientId: (id: string | null) => void;
  fetchClientNotes: (clientId: string, signal?: AbortSignal) => Promise<void>;
  refreshNotes: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  addNote: async () => {},
  editNote: async () => {},
  deleteNote: async () => {},
  setClientNotes: () => {},
  clientId: null,
  setClientId: () => {},
  fetchClientNotes: async () => {},
  refreshNotes: async () => {},
  loading: false,
  error: null,
});

=======
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
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
<<<<<<< HEAD
  const [notes, setNotes] = useState<Note[]>([]);
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const notesCache = useRef<Record<string, Note[]>>({});

  // Función para obtener las notas, ahora leyendo primero del localStorage
  const fetchClientNotes = async (id: string, signal?: AbortSignal) => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      // Primero revisamos el localStorage
      const storedNotes = localStorage.getItem(`notes_${id}`);
      if (storedNotes) {
        const notesArray = JSON.parse(storedNotes);
        notesCache.current[id] = notesArray;
        if (clientId === id) {
          setNotes(notesArray);
        }
        setLoading(false);
        return;
      }

      // Si no hay datos en localStorage, se realiza la petición a la API
      const response = await axios.get(
        `https://fitoffice2-ff8035a9df10.herokuapp.com/api/clients/${id}/notas`,
        { signal }
      );
      const responseData = response.data;
      const notesArray = Array.isArray(responseData) ? responseData : [];

      // Cacheamos y guardamos en localStorage
      notesCache.current[id] = notesArray;
      if (clientId === id) {
        setNotes(notesArray);
        localStorage.setItem(`notes_${id}`, JSON.stringify(notesArray));
      }
    } catch (err: any) {
      if (err.name === 'CanceledError') {
        console.log('La petición fue cancelada');
      } else {
        console.error('Error fetching notes:', err);
        setError('Error al cargar las notas');
        if (clientId === id) {
          setNotes([]);
        }
=======
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
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      }
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Función para agregar una nota y persistir en localStorage
=======
  // Function to fetch notes for a client
  // Function to add a new note
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const addNote = async (note: Omit<Note, '_id'>) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }
<<<<<<< HEAD

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://fitoffice2-ff8035a9df10.herokuapp.com/api/clients/${clientId}/notas`,
        note
      );
      const newNote = response.data;

      setNotes((prevNotes) => {
        const updatedNotes = [
          ...(Array.isArray(prevNotes) ? prevNotes : []),
          newNote,
        ];
        if (clientId) {
          notesCache.current[clientId] = updatedNotes;
          localStorage.setItem(`notes_${clientId}`, JSON.stringify(updatedNotes));
=======
    
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
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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
<<<<<<< HEAD

  // Función para editar una nota y actualizar localStorage
=======
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
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const editNote = async (id: string, updatedNote: Partial<Note>) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }
<<<<<<< HEAD

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `https://fitoffice2-ff8035a9df10.herokuapp.com/api/clients/${clientId}/notas/${id}`,
        updatedNote
      );
      const editedNote = response.data;

      setNotes((prevNotes) => {
        const safeNotes = Array.isArray(prevNotes) ? prevNotes : [];
        const updatedNotes = safeNotes.map((note) =>
          note._id === id ? { ...note, ...editedNote } : note
        );
        if (clientId) {
          notesCache.current[clientId] = updatedNotes;
          localStorage.setItem(`notes_${clientId}`, JSON.stringify(updatedNotes));
        }
        return updatedNotes;
=======
    
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
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      });
    } catch (err) {
      console.error('Error editing note:', err);
      setError('Error al editar la nota');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Función para eliminar una nota y actualizar localStorage
=======
  // Function to delete a note
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const deleteNote = async (id: string) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }
<<<<<<< HEAD

    setLoading(true);
    setError(null);

    try {
      await axios.delete(
        `https://fitoffice2-ff8035a9df10.herokuapp.com/api/clients/${clientId}/notas/${id}`
      );
      setNotes((prevNotes) => {
        const safeNotes = Array.isArray(prevNotes) ? prevNotes : [];
        const updatedNotes = safeNotes.filter((note) => note._id !== id);
        if (clientId) {
          notesCache.current[clientId] = updatedNotes;
          localStorage.setItem(`notes_${clientId}`, JSON.stringify(updatedNotes));
        }
        return updatedNotes;
=======
    
    setLoading(true);
    setError(null);
    
    try {
      await axios.delete(`https://fitoffice-a7ed6ea26ba4.herokuapp.com/api/clients/${clientId}/notas/${id}`);
      setNotes(prevNotes => {
        // Ensure prevNotes is an array before filtering
        const safeNotes = Array.isArray(prevNotes) ? prevNotes : [];
        return safeNotes.filter(note => note._id !== id);
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
      });
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Error al eliminar la nota');
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // Función para establecer todas las notas y persistirlas
  const setClientNotes = (clientNotes: Note[]) => {
    const safeNotes = Array.isArray(clientNotes) ? clientNotes : [];
    setNotes(safeNotes);
    if (clientId) {
      notesCache.current[clientId] = safeNotes;
      localStorage.setItem(`notes_${clientId}`, JSON.stringify(safeNotes));
    }
  };

=======
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
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
  const refreshNotes = async () => {
    if (clientId) {
      await fetchClientNotes(clientId);
    }
  };

<<<<<<< HEAD
  const contextValue: NotesContextType = {
    notes: Array.isArray(notes) ? notes : [],
=======
  // The context value
  const contextValue: NotesContextType = {
    notes: Array.isArray(notes) ? notes : [], // Ensure notes is always an array
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
    addNote,
    editNote,
    deleteNote,
    setClientNotes,
    clientId,
<<<<<<< HEAD
    setClientId: (id: string | null) => {
      setClientId(id);
      if (id && notesCache.current[id]) {
        setNotes(notesCache.current[id]);
      } else if (id === null) {
        setNotes([]);
      }
    },
=======
    setClientId: setClientIdSafe, // Use our safe version
>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
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

<<<<<<< HEAD
export const useNotes = () => useContext(NotesContext);
=======
// Custom hook to use the notes context
export const useNotes = () => useContext(NotesContext);

>>>>>>> 264be574fa9db2ca7c87c3d8b1e8ddad2d870b25
