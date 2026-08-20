'use client';

import { JOB_STATE_LABELS, JOB_STATES, type JobState } from '@/lib/store';

export default function StatusChips({ value, onChange }: { value?: JobState; onChange: (status: JobState) => void }) {
  return (
    <fieldset className="status-chips" aria-label="Application status">
      {JOB_STATES.map((status) => (
        <button
          key={status}
          type="button"
          className="status-chip"
          aria-pressed={value === status}
          onClick={() => onChange(status)}
        >
          {JOB_STATE_LABELS[status].toUpperCase()}
        </button>
      ))}
    </fieldset>
  );
}
