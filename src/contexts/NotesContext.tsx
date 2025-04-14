import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import axios from 'axios';

export interface Note {
  _id: string;
  texto: string;
  fechaCreacion: string;
  version: number;
  categoria: 'general' | 'training' | 'diet' | 'medical';
}

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

interface NotesProviderProps {
  children: ReactNode;
}

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
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
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar una nota y persistir en localStorage
  const addNote = async (note: Omit<Note, '_id'>) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }

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

  // Función para editar una nota y actualizar localStorage
  const editNote = async (id: string, updatedNote: Partial<Note>) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }

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
      });
    } catch (err) {
      console.error('Error editing note:', err);
      setError('Error al editar la nota');
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar una nota y actualizar localStorage
  const deleteNote = async (id: string) => {
    if (!clientId) {
      setError('No hay cliente seleccionado');
      return;
    }

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
      });
    } catch (err) {
      console.error('Error deleting note:', err);
      setError('Error al eliminar la nota');
    } finally {
      setLoading(false);
    }
  };

  // Función para establecer todas las notas y persistirlas
  const setClientNotes = (clientNotes: Note[]) => {
    const safeNotes = Array.isArray(clientNotes) ? clientNotes : [];
    setNotes(safeNotes);
    if (clientId) {
      notesCache.current[clientId] = safeNotes;
      localStorage.setItem(`notes_${clientId}`, JSON.stringify(safeNotes));
    }
  };

  const refreshNotes = async () => {
    if (clientId) {
      await fetchClientNotes(clientId);
    }
  };

  const contextValue: NotesContextType = {
    notes: Array.isArray(notes) ? notes : [],
    addNote,
    editNote,
    deleteNote,
    setClientNotes,
    clientId,
    setClientId: (id: string | null) => {
      setClientId(id);
      if (id && notesCache.current[id]) {
        setNotes(notesCache.current[id]);
      } else if (id === null) {
        setNotes([]);
      }
    },
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

export const useNotes = () => useContext(NotesContext);
