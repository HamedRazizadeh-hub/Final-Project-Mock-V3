'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const Ctx = createContext<(message: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState('');

  const show = useCallback((next: string) => setMessage(next), []);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(''), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);

  return (
    <Ctx.Provider value={show}>
      {children}
      {message ? (
        <div className="toast" role="status" aria-live="polite">
          {message}
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
