import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="wrap page">
      <div className="state-block">
        <p className="h2">We couldn&apos;t find that page.</p>
        <p style={{ fontSize: 14.5, color: 'var(--ink-3)' }}>The link may be old, or the listing may have been taken down.</p>
        <Link href="/jobs" className="btn btn-primary">Browse jobs →</Link>
      </div>
    </div>
  );
}
