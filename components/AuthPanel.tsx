'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/lib/store';
import { Mark } from './Logo';

/**
 * Log in / create account. The prototype has no backend: submitting flips the
 * member flag in local state, which is what unlocks match, saving and tracking.
 */
export default function AuthPanel({ mode }: { mode: 'login' | 'register' }) {
  const router = useRouter();
  const { logIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const register = mode === 'register';

  return (
    <div className="wrap page" style={{ display: 'grid', placeItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ marginBottom: 22 }}>
          <Mark size={28} />
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(30px, 3.6vw, 42px)', marginBottom: 10 }}>
          {register ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="lede" style={{ marginBottom: 28, fontSize: 15.5 }}>
          {register
            ? 'Your Match Profile, saved jobs and application tracking live here.'
            : 'Sign in to see your match scores and your job pipeline.'}
        </p>

        <form
          className="stack"
          style={{ gap: 14 }}
          onSubmit={(event) => {
            event.preventDefault();
            logIn();
            router.push(register ? '/profile' : '/');
          }}
        >
          <label className="field">
            Email
            <input
              className="input"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className="field">
            Password
            <input
              className="input"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
            />
          </label>
          <button type="submit" className="btn btn-primary btn-block">
            {register ? 'Create account →' : 'Log in →'}
          </button>
        </form>

        <p className="small" style={{ marginTop: 18 }}>
          {register ? (
            <>
              Already have an account? <Link href="/login">Log in</Link>
            </>
          ) : (
            <>
              New to JobMatch? <Link href="/register">Create a free account</Link>
            </>
          )}
        </p>
        <p className="small" style={{ marginTop: 10 }}>
          No CV upload, ever. Matching uses your Match Profile only.
        </p>
      </div>
    </div>
  );
}
