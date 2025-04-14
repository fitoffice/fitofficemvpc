import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Routine {
  _id?: string;
  name: string;
  description: string;
  tags: string[];
  notes: string;
  exercises: any[]; // Puedes reemplazar "any" por la interfaz específica de Exercise si la tienes
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AIRoutineModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  pendingAIRoutine: Routine | null;
  setPendingAIRoutine: React.Dispatch<React.SetStateAction<Routine | null>>;
}

const AIRoutineModalContext = createContext<AIRoutineModalContextType | undefined>(undefined);

export const useAIRoutineModal = () => {
  const context = useContext(AIRoutineModalContext);
  if (!context) {
    throw new Error('useAIRoutineModal debe ser usado dentro de un AIRoutineModalProvider');
  }
  return context;
};

interface AIRoutineModalProviderProps {
  children: ReactNode;
}

export const AIRoutineModalProvider: React.FC<AIRoutineModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [pendingAIRoutine, setPendingAIRoutine] = useState<Routine | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <AIRoutineModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        pendingAIRoutine,
        setPendingAIRoutine,
      }}
    >
      {children}
    </AIRoutineModalContext.Provider>
  );
};

