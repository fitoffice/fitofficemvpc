// src/contexts/Periodocontext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface PeriodoContextType {
  periodoId: string | null;
  setPeriodoId: (id: string | null) => void;
}

// Create a custom event name for period changes
export const PERIODO_CHANGE_EVENT = 'periodoIdChanged';

const PeriodoContext = createContext<PeriodoContextType | undefined>(undefined);

export const PeriodoProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state with the value saved in localStorage (if it exists)
  const [periodoId, setPeriodoIdState] = useState<string | null>(() => {
    const storedId = localStorage.getItem('periodoId');
    console.log('PeriodoContext: Initializing with stored ID:', storedId);
    return storedId;
  });

  // Function to update state and synchronize with localStorage
  const setPeriodoId = (id: string | null) => {
    console.log('PeriodoContext: Setting periodoId to:', id);
    
    // Update state
    setPeriodoIdState(id);
    
    // Update localStorage
    if (id) {
      localStorage.setItem('periodoId', id);
    } else {
      localStorage.removeItem('periodoId');
    }
    
    // Dispatch a custom event to notify components
    try {
      const event = new CustomEvent(PERIODO_CHANGE_EVENT, { 
        detail: { periodoId: id } 
      });
      window.dispatchEvent(event);
      console.log('PeriodoContext: Dispatched period change event');
    } catch (error) {
      console.error('PeriodoContext: Error dispatching event:', error);
    }
  };

  // Log when the context value changes
  useEffect(() => {
    console.log('PeriodoContext: Context value updated to:', periodoId);
  }, [periodoId]);

  // Listen for storage events (for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'periodoId') {
        console.log('PeriodoContext: Storage event detected, new value:', e.newValue);
        setPeriodoIdState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Create the context value object
  const contextValue = {
    periodoId,
    setPeriodoId
  };

  return (
    <PeriodoContext.Provider value={contextValue}>
      {children}
    </PeriodoContext.Provider>
  );
};

export const usePeriodo = () => {
  const context = useContext(PeriodoContext);
  if (!context) {
    throw new Error("usePeriodo must be used within a PeriodoProvider");
  }
  return context;
};