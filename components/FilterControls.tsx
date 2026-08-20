'use client';

import { useState } from 'react';
import { CITIES, EMPLOYMENT_TYPES, EmploymentType, jobsPerCity, LEVELS, Level, WORK_MODES } from '@/lib/jobs';
import { Filters, PostedKey } from '@/lib/filters';

type Props = { filters: Filters; onChange: (next: Filters) => void; onClear: () => void; variant?: 'rail' | 'sheet' };

const POSTED: PostedKey[] = ['Any time', 'Last 24 hours', 'Last 7 days', 'Last 30 days'];
const EMPLOYMENT: (EmploymentType | 'Any type')[] = ['Any type', ...EMPLOYMENT_TYPES];
const SENIORITY: (Level | 'All levels')[] = ['All levels', ...LEVELS];

export default function FilterControls({ filters, onChange, onClear, variant = 'rail' }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => onChange({ ...filters, [key]: value });
  const sheet = variant === 'sheet';

  const toggleCity = (city: string) =>
    set('cities', filters.cities.includes(city) ? filters.cities.filter((c) => c !== city) : [...filters.cities, city]);

  return (
    <div>
      {sheet ? null : (
        <div className="rail-head">
          <p className="label" style={{ color: 'var(--ink-3)' }}>Refine</p>
          <button type="button" className="link-quiet" onClick={onClear}>Clear all</button>
        </div>
      )}

      <div className="rail-block">
        <p>Work mode</p>
        <div className="segmented">
          {WORK_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={filters.workModes.includes(mode)}
              onClick={() =>
                set('workModes', filters.workModes.includes(mode) ? filters.workModes.filter((m) => m !== mode) : [...filters.workModes, mode])
              }
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="rail-block">
        <p>City</p>
        {sheet ? (
          <div className="chips">
            {CITIES.map((city) => (
              <button key={city} type="button" className="chip" aria-pressed={filters.cities.includes(city)} onClick={() => toggleCity(city)}>
                {city}
              </button>
            ))}
          </div>
        ) : (
          <div className="rail-scroll">
            {CITIES.map((city) => (
              <label key={city} className="check">
                <input type="checkbox" checked={filters.cities.includes(city)} onChange={() => toggleCity(city)} />
                <span>{city}</span>
                <span className="check-count">{jobsPerCity(city)}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="rail-block">
        <p>Employment type</p>
        <div className="chips">
          {EMPLOYMENT.map((type) => (
            <button key={type} type="button" className="chip" aria-pressed={filters.employmentType === type} onClick={() => set('employmentType', type)}>
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="rail-block">
        <p>Date posted</p>
        {sheet ? (
          <div className="chips">
            {POSTED.map((option) => (
              <button key={option} type="button" className="chip" aria-pressed={filters.posted === option} onClick={() => set('posted', option)}>
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="stack" style={{ gap: 8 }}>
            {POSTED.map((option) => (
              <label key={option} className="check">
                <input type="radio" name="posted" checked={filters.posted === option} onChange={() => set('posted', option)} />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="rail-block">
        {sheet ? <p>Experience &amp; salary</p> : (
          <button type="button" className="rail-toggle" onClick={() => setMoreOpen((open) => !open)} aria-expanded={moreOpen}>
            <span>Experience &amp; salary</span>
            <span style={{ color: 'var(--ink-4)' }}>{moreOpen ? '–' : '+'}</span>
          </button>
        )}

        {sheet || moreOpen ? (
          <div className="stack" style={{ gap: 18, marginTop: sheet ? 0 : 16 }}>
            <div>
              <p className="meta" style={{ marginBottom: 9 }}>Seniority</p>
              <div className="chips">
                {SENIORITY.map((level) => (
                  <button key={level} type="button" className="chip" aria-pressed={filters.level === level} onClick={() => set('level', level)}>
                    {level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="check">
                <input type="checkbox" checked={filters.salaryOnly} onChange={() => set('salaryOnly', !filters.salaryOnly)} />
                <span>Only listings with salary</span>
              </label>
              <p className="small" style={{ marginTop: 8 }}>Salary is shown only where the listing states it.</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
