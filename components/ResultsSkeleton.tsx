export default function ResultsSkeleton({ rows = 5 }: { rows?: number }) {
  const rowKeys = Array.from({ length: rows }, (_, index) => `skeleton-row-${index + 1}`);

  return (
    <div aria-busy="true" aria-live="polite">
      {rowKeys.map((key) => (
        <div className="skeleton-row" key={key}>
          <span className="skel" style={{ width: 44, height: 44, borderRadius: 10 }} />
          <span className="stack" style={{ gap: 9, alignContent: 'start' }}>
            <span className="skel" style={{ height: 14, width: '44%' }} />
            <span className="skel soft" style={{ height: 11, width: '28%' }} />
            <span className="skel soft" style={{ height: 11, width: '36%' }} />
          </span>
          <span className="stack" style={{ gap: 8, justifyItems: 'end' }}>
            <span className="skel" style={{ height: 24, width: 44 }} />
            <span className="skel soft" style={{ height: 10, width: 60 }} />
          </span>
        </div>
      ))}
    </div>
  );
}
