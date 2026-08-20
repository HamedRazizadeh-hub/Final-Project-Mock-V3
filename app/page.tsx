'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { JOBS } from '@/lib/jobs';
import { relevanceRank, scoreJob } from '@/lib/match';
import { JOB_STATES, useApp } from '@/lib/store';

const SUGGESTIONS = ['React', 'Data Analyst', 'Remote', 'Utrecht'];
const MATCH_COLOR = { strong: 'var(--match)', fair: 'var(--plum-2)', low: 'var(--amber-ink)' } as const;

export default function HomePage() {
  const router = useRouter();
  const { account, loggedIn, profile, saved, completion } = useApp();
  const [query, setQuery] = useState('');

  const search = (value: string) => router.push(value.trim() ? `/jobs?q=${encodeURIComponent(value.trim())}` : '/jobs');

  const topMatches = useMemo(
    () => [...JOBS].sort((a, b) => relevanceRank(b, profile) - relevanceRank(a, profile)).slice(0, 3),
    [profile],
  );

  const tracked = Object.keys(saved).length;
  const applied = Object.values(saved).filter((status) => status === 'APPLIED').length;

  if (loggedIn) {
    return (
      <div className="wrap wrap-narrow">
        <div className="member-home">
          <div>
            <p className="label" style={{ marginBottom: 18 }}>
              Your career workspace
            </p>
            <h1 className="display" style={{ fontSize: 'clamp(38px, 5vw, 64px)', marginBottom: 12 }}>
              Good morning, {account.firstName}.
            </h1>
            <p style={{ marginBottom: 34, fontSize: 18, color: 'var(--ink-3)' }}>Ready to find your next match?</p>
            <div className="row" style={{ gap: 12 }}>
              <Link href="/jobs" className="btn btn-primary" style={{ height: 48, padding: '0 22px' }}>
                Find Jobs
              </Link>
              <Link href="/profile" className="btn btn-outline" style={{ height: 48 }}>
                Update Match Profile
              </Link>
            </div>
            <p style={{ marginTop: 18 }}>
              <Link href="/resume" className="link-quiet" style={{ fontSize: 13.5 }}>
                Build Resume — optional
              </Link>
            </p>
          </div>

          <div className="stack" style={{ gap: 16 }}>
            {completion < 100 ? (
              <div className="panel" style={{ padding: 22 }}>
                <div className="spread" style={{ alignItems: 'baseline' }}>
                  <p className="label">Your Match Profile</p>
                  <span className="num" style={{ fontSize: 20 }}>
                    {completion}%
                  </span>
                </div>
                <div className="meter" style={{ margin: '14px 0 12px' }}>
                  <span style={{ width: `${completion}%`, background: 'var(--plum-2)' }} />
                </div>
                <p style={{ marginBottom: 14, fontSize: 13.5, color: 'var(--ink-3)' }}>
                  Add a salary expectation to sharpen your recommendations.
                </p>
                <Link href="/profile" className="link-btn">
                  Complete profile →
                </Link>
              </div>
            ) : null}

            <div className="panel" style={{ padding: 22 }}>
              <div className="spread" style={{ marginBottom: 16, alignItems: 'baseline' }}>
                <p className="label">Top matches today</p>
                <Link href="/jobs" className="link-quiet">
                  See all
                </Link>
              </div>
              <div className="mini-list">
                {topMatches.map((job) => {
                  const score = scoreJob(job, profile);
                  return (
                    <button type="button" key={job.id} onClick={() => router.push(`/jobs/${job.id}`)}>
                      <span>
                        <span className="mini-title">{job.title}</span>
                        <span className="small" style={{ display: 'block' }}>
                          {[job.company, job.city, job.workMode].join(' · ')}
                        </span>
                      </span>
                      <span className="row" style={{ gap: 5, alignItems: 'baseline' }}>
                        <span className="num" style={{ fontSize: 22, color: MATCH_COLOR[score.tone] }}>
                          {score.match}
                        </span>
                        <span className="match-cap" style={{ marginTop: 0 }}>
                          MATCH
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="stat-tiles">
              <button type="button" className="stat-tile" onClick={() => router.push('/saved')}>
                <b className="num">{tracked}</b>
                <span className="small">in your pipeline</span>
              </button>
              <button type="button" className="stat-tile" onClick={() => router.push('/saved')}>
                <b className="num">{applied}</b>
                <span className="small">applications sent</span>
              </button>
            </div>
            <p className="small">
              {JOB_STATES.length} tracking states, exactly as before: saved, applied, rejected, accepted, declined.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="wrap">
        <section className="hero">
          <div>
            <p className="label" style={{ marginBottom: 26 }}>
              Career decisions, with evidence
            </p>
            <h1 className="display hero-title" style={{ marginBottom: 22 }}>
              Find work
              <br />
              that <em className="em">actually</em>
              <br />
              fits you.
            </h1>
            <p className="lede" style={{ maxWidth: '34ch' }}>
              Relevant jobs. Transparent matches.
              <br />
              Fresh listings. Less wasted time.
            </p>
          </div>

          <div>
            <div className="search-card">
              <p className="label" style={{ marginBottom: 14 }}>
                Search
              </p>
              <form
                className="search-row"
                onSubmit={(event) => {
                  event.preventDefault();
                  search(query);
                }}
              >
                <input
                  className="input"
                  type="search"
                  aria-label="Search roles, skills or keywords"
                  placeholder="Search roles, skills or keywords…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Find jobs →
                </button>
              </form>
              <div className="suggests">
                <span className="small">Try</span>
                {SUGGESTIONS.map((suggestion) => (
                  <button type="button" key={suggestion} onClick={() => search(suggestion)}>
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
            <p className="small" style={{ marginTop: 14, paddingLeft: 2 }}>
              No location needed yet — you filter by city once you see the results.
            </p>
          </div>
        </section>
      </div>

      <section className="value-band">
        <div className="wrap">
          <div className="value-grid">
            <div className="value-cell">
              <p className="label" style={{ marginBottom: 18 }}>
                Match
              </p>
              <p className="row" style={{ gap: 10, alignItems: 'baseline' }}>
                <span className="num value-num" style={{ color: 'var(--match)' }}>
                  87
                </span>
                <span style={{ fontSize: 13, color: 'var(--ink-3)' }}>Strong fit</span>
              </p>
              <div className="meter" style={{ marginTop: 14, maxWidth: 200 }}>
                <span style={{ width: '87%', background: 'var(--match)' }} />
              </div>
              <p style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-3)', maxWidth: '30ch' }}>
                How this role lines up with your skills, city and work mode.
              </p>
            </div>
            <div className="value-cell">
              <p className="label" style={{ marginBottom: 18 }}>
                Freshness
              </p>
              <p className="row" style={{ gap: 9 }}>
                <span className="dot" style={{ background: 'var(--fresh)' }} />
                <span className="h2">Fresh</span>
              </p>
              <p style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-3)' }}>4 days old · last checked today</p>
              <p style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-3)', maxWidth: '30ch' }}>
                Listing quality is scored separately from your fit.
              </p>
            </div>
            <div className="value-cell">
              <p className="label" style={{ marginBottom: 18 }}>
                Insight
              </p>
              <p className="h2">7 matching skills</p>
              <div className="chips" style={{ marginTop: 12 }}>
                <span className="chip chip-have">React</span>
                <span className="chip chip-have">TypeScript</span>
                <span className="chip chip-missing">Docker missing</span>
              </div>
              <p style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-3)', maxWidth: '30ch' }}>
                Every score is explained, line by line.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="wrap">
        <section className="explain">
          <h2 className="display" style={{ fontSize: 'clamp(28px, 3.4vw, 42px)', lineHeight: 1.1, maxWidth: '22ch' }}>
            Two questions, answered before you apply.
          </h2>
          <div>
            <div className="explain-row">
              <span className="i">01</span>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Does this job fit me?</p>
                <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  Your skills, city, work mode and experience against what the listing asks for.
                </p>
              </div>
            </div>
            <div className="explain-row">
              <span className="i">02</span>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Is this listing worth my time?</p>
                <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  Age, re-posting and last check — so you skip the ones that go nowhere.
                </p>
              </div>
            </div>
            <div className="explain-row">
              <span className="i">03</span>
              <div>
                <p style={{ fontWeight: 600, marginBottom: 4 }}>Then keep track of it.</p>
                <p style={{ fontSize: 14, color: 'var(--ink-3)' }}>
                  Apply on the company site, come back, and mark where it stands.
                </p>
              </div>
            </div>
            <p style={{ marginTop: 24 }}>
              <Link href="/jobs" className="link-btn" style={{ fontSize: 15 }}>
                Explore jobs →
              </Link>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
