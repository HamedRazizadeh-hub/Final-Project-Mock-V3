'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import FilterControls from '@/components/FilterControls';
import JobRow from '@/components/JobRow';
import ResultsSkeleton from '@/components/ResultsSkeleton';
import StateBlock from '@/components/StateBlock';
import { JOBS } from '@/lib/jobs';
import { activeTokens, applyFilters, EMPTY_FILTERS, Filters, SortKey } from '@/lib/filters';
import { useApp } from '@/lib/store';

const SORTS: SortKey[] = ['Most relevant', 'Best match', 'Newest'];

export default function JobsBrowser() {
  const params = useSearchParams();
  const { profile } = useApp();
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  /** Home search carries only a keyword — no location, by product decision. */
  useEffect(() => {
    const q = params.get('q');
    const sort = params.get('sort');
    setFilters((current) => ({
      ...current,
      query: q ?? current.query,
      sort: sort === 'best' ? 'Best match' : current.sort,
    }));
  }, [params]);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 480);
    return () => window.clearTimeout(timer);
  }, []);

  const results = useMemo(() => applyFilters(JOBS, filters, profile), [filters, profile]);
  const tokens = activeTokens(filters, setFilters);
  const clearAll = () => setFilters({ ...EMPTY_FILTERS, sort: filters.sort });

  return (
    <div className="wrap">
      <div className="jobs-head">
        <h1 className="display h1">Explore jobs</h1>
        <div className="row" style={{ gap: 10, flexWrap: 'nowrap' }}>
          <input
            className="input"
            type="search"
            aria-label="Search roles, skills or keywords"
            placeholder="Search roles, skills or keywords…"
            value={filters.query}
            onChange={(event) => setFilters({ ...filters, query: event.target.value })}
          />
          <button type="button" className="btn btn-outline btn-sm show-mobile" onClick={() => setSheetOpen(true)} style={{ whiteSpace: 'nowrap' }}>
            Filters{tokens.length ? ` (${tokens.length})` : ''}
          </button>
        </div>
      </div>

      <div className="jobs-layout">
        <aside className="rail" aria-label="Filters">
          <FilterControls filters={filters} onChange={setFilters} onClear={clearAll} />
        </aside>

        <section>
          <div className="results-head">
            <div>
              <p className="count">
                <b className="num">{results.length}</b>
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>{results.length === 1 ? 'job' : 'jobs'}</span>
              </p>
              {tokens.length > 0 ? (
                <div className="tokens">
                  {tokens.map((token) => (
                    <button type="button" className="token" key={token.label} onClick={token.clear}>
                      {token.label} <span style={{ color: '#8C7385' }}>×</span>
                    </button>
                  ))}
                  <button type="button" className="link-quiet" onClick={clearAll}>Clear all</button>
                </div>
              ) : null}
            </div>

            <div className="sort">
              <span className="label">Sort</span>
              <select
                className="select"
                aria-label="Sort results"
                value={filters.sort}
                onChange={(event) => setFilters({ ...filters, sort: event.target.value as SortKey })}
              >
                {SORTS.map((sort) => <option key={sort} value={sort}>{sort}</option>)}
              </select>
            </div>
          </div>

          {loading ? <ResultsSkeleton /> : null}

          {!loading && failed ? (
            <StateBlock title="We couldn't load these jobs." text="The connection dropped on our side. Nothing is wrong with your filters.">
              <button type="button" className="btn btn-primary" onClick={() => { setFailed(false); setLoading(true); window.setTimeout(() => setLoading(false), 480); }}>
                Try again →
              </button>
            </StateBlock>
          ) : null}

          {!loading && !failed && results.length === 0 ? (
            <StateBlock title="Nothing matches those filters." text="Try another city, widen the date range, or drop a work mode.">
              <button type="button" className="btn btn-outline" onClick={clearAll}>Clear all filters</button>
            </StateBlock>
          ) : null}

          {!loading && !failed && results.length > 0 ? (
            <div>
              {results.map((job) => <JobRow job={job} key={job.id} />)}
            </div>
          ) : null}
        </section>
      </div>

      {sheetOpen ? (
        <div className="drawer-scrim" onClick={() => setSheetOpen(false)}>
          <div className="drawer" role="dialog" aria-modal="true" aria-label="Refine results" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-head">
              <p className="h2">Refine</p>
              <button type="button" className="link-quiet" onClick={() => setSheetOpen(false)} aria-label="Close filters" style={{ fontSize: 20 }}>×</button>
            </div>
            <FilterControls filters={filters} onChange={setFilters} onClear={clearAll} variant="sheet" />
            <div className="stack" style={{ gap: 10, marginTop: 24 }}>
              <button type="button" className="btn btn-primary btn-block" onClick={() => setSheetOpen(false)}>
                Show {results.length} {results.length === 1 ? 'job' : 'jobs'}
              </button>
              <button type="button" className="btn btn-outline btn-block" onClick={clearAll}>Clear all</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
