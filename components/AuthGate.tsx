'use client';

import Link from 'next/link';
import { createContext, useCallback, useContext, useState, ReactNode } from 'react';
import { useApp } from '@/lib/store';
import { Mark } from './Logo';

type GateApi = {
  /** Returns true when the member-only action may proceed. */
  requireAccount: () => boolean;
  openGate: () => void;
};

const Ctx = createContext<GateApi>({ requireAccount: () => false, openGate: () => {} });

/** Elegant inline gate — never a full-page interruption. */
export function AuthGateProvider({ children }: { children: ReactNode }) {
  const { loggedIn, logIn } = useApp();
  const [open, setOpen] = useState(false);

  const requireAccount = useCallback(() => {
    if (loggedIn) return true;
    setOpen(true);
    return false;
  }, [loggedIn]);

  return (
    <Ctx.Provider value={{ requireAccount, openGate: () => setOpen(true) }}>
      {children}
      {open ? (
        <div className="scrim" onClick={() => setOpen(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-label="Unlock your match" onClick={(event) => event.stopPropagation()}>
            <div style={{ marginBottom: 18 }}>
              <Mark size={26} />
            </div>
            <p className="h2" style={{ marginBottom: 10 }}>Unlock your match</p>
            <p style={{ marginBottom: 22, fontSize: 14.5, color: 'var(--ink-3)' }}>
              Create a free account to see how this role fits your profile, save jobs and track applications.
            </p>
            <div className="stack" style={{ gap: 10 }}>
              <button
                type="button"
                className="btn btn-primary btn-block"
                onClick={() => {
                  logIn();
                  setOpen(false);
                }}
              >
                Continue with account →
              </button>
              <button type="button" className="btn btn-outline btn-block" onClick={() => setOpen(false)}>
                Keep browsing
              </button>
            </div>
            <p className="small" style={{ marginTop: 14 }}>
              Prefer the full page? <Link href="/register">Create an account</Link>
            </p>
          </div>
        </div>
      ) : null}
    </Ctx.Provider>
  );
}

export const useAuthGate = () => useContext(Ctx);
