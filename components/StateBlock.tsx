import type { ReactNode } from 'react';

export default function StateBlock({ title, text, children }: { title: string; text?: string; children?: ReactNode }) {
  return (
    <div className="state-block">
      <p className="h2">{title}</p>
      {text ? <p style={{ fontSize: 14.5, color: 'var(--ink-3)' }}>{text}</p> : null}
      {children}
    </div>
  );
}
