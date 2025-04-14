import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SessionContextType {
  sessionId: string | null;
  setSessionId: (id: string | null) => void;
}

export const SESSION_CHANGE_EVENT = 'sessionIdChanged';

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [sessionId, setSessionIdState] = useState<string | null>(() => {
    const storedId = localStorage.getItem('sessionId');
    console.log('SessionContext: Initializing with stored session id:', storedId);
    return storedId;
  });

  const setSessionId = (id: string | null) => {
    console.log('SessionContext: Setting sessionId to:', id);
    setSessionIdState(id);

    if (id) {
      localStorage.setItem('sessionId', id);
    } else {
      localStorage.removeItem('sessionId');
    }

    try {
      const event = new CustomEvent(SESSION_CHANGE_EVENT, {
        detail: { sessionId: id },
        bubbles: true,
      });
      window.dispatchEvent(event);
      console.log('SessionContext: Dispatched session change event');
    } catch (error) {
      console.error('SessionContext: Error dispatching event:', error);
    }
  };

  useEffect(() => {
    console.log('SessionContext: Context value updated to:', sessionId);
  }, [sessionId]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sessionId') {
        console.log('SessionContext: Storage event detected, new value:', e.newValue);
        setSessionIdState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleSessionChange = (e: CustomEvent) => {
      console.log('SessionContext: Received custom event, updating sessionId to:', e.detail.sessionId);
      setSessionIdState(e.detail.sessionId);
    };

    window.addEventListener(SESSION_CHANGE_EVENT, handleSessionChange as EventListener);
    return () => {
      window.removeEventListener(SESSION_CHANGE_EVENT, handleSessionChange as EventListener);
    };
  }, []);

  const contextValue = {
    sessionId,
    setSessionId,
  };

  return (
    <SessionContext.Provider value={contextValue}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};