export default function ResultsSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, index) => (
        <div className="skeleton-row" key={index}>
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
