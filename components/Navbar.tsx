'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/store';
import { Mark } from './Logo';

const LINKS = [
  { href: '/jobs', label: 'Explore Jobs' },
  { href: '/saved', label: 'Saved' },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { account, loggedIn, logOut, completion } = useApp();

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link href="/" className="brand" aria-label="JobMatch home">
          <Mark size={24} />
          <span className="brand-word">JobMatch</span>
        </Link>

        <nav className="nav-links" aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
              aria-current={path === link.href ? 'page' : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/profile" className="nav-link" aria-current={path === '/profile' ? 'page' : undefined}>
            Profile
            {loggedIn ? <small>{completion}% complete</small> : null}
          </Link>
        </nav>

        {loggedIn ? (
          <div className="nav-account">
            <span className="row" style={{ gap: 9 }}>
              <span className="avatar" aria-hidden="true">
                {account.initials}
              </span>
              <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{account.firstName}</span>
            </span>
            <button
              type="button"
              className="link-quiet"
              onClick={() => {
                logOut();
                router.push('/');
              }}
            >
              Log out
            </button>
          </div>
        ) : (
          <div className="nav-account">
            <Link
              href="/login"
              style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-3)', textDecoration: 'none' }}
            >
              Log in
            </Link>
            <Link href="/register" className="btn btn-primary btn-sm">
              Create account
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
