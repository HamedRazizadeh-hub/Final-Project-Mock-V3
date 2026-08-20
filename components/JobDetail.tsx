'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type Job, listingSignal } from '@/lib/jobs';
import { scoreJob } from '@/lib/match';
import { useApp } from '@/lib/store';
import { useAuthGate } from './AuthGate';
import StatusChips from './StatusChips';
import { useToast } from './Toast';

const SIGNAL_COLOR = { fresh: 'var(--fresh)', watch: 'var(--amber)', old: 'var(--terracotta)' } as const;
const MATCH_COLOR = { strong: 'var(--match)', fair: 'var(--plum-2)', low: 'var(--amber-ink)' } as const;
const TONE_COLOR = { good: 'var(--match)', neutral: 'var(--ink-3)', attention: 'var(--amber)' } as const;

export default function JobDetail({ job }: { job: Job }) {
  const router = useRouter();
  const { loggedIn, profile, saved, toggleSave, setStatus } = useApp();
  const { requireAccount, openGate } = useAuthGate();
  const toast = useToast();
  const [breakdownOpen, setBreakdownOpen] = useState(true);
  const [askApply, setAskApply] = useState(false);

  const score = scoreJob(job, profile);
  const signal = listingSignal(job);
  const status = saved[job.id];

  const facts: [string, string][] = [
    ['Location', job.city],
    ['Work mode', job.workMode],
    ['Employment', job.employmentType],
    ['Experience', `${job.experienceYears}+ years`],
    ['Seniority', job.level],
    ['Salary', job.salary ?? 'Not provided'],
  ];

  return (
    <>
      <div className="wrap" style={{ paddingTop: 'clamp(20px, 3vw, 32px)' }}>
        <Link href="/jobs" className="link-quiet" style={{ textDecoration: 'underline' }}>
          ← Back to results
        </Link>

        <div className="detail-head">
          <div>
            <div className="row" style={{ gap: 12, marginBottom: 14 }}>
              <span
                className="logo"
                style={{ width: 40, height: 40, background: job.logoBg, color: job.logoFg, fontSize: 12.5 }}
                aria-hidden="true"
              >
                {job.logoInitials}
              </span>
              <span style={{ fontSize: 14.5, fontWeight: 500 }}>{job.company}</span>
            </div>
            <h1 className="display detail-title">{job.title}</h1>
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--ink-3)' }}>
              {[job.city, job.workMode, job.employmentType, `via ${job.source}`].join(' · ')}
            </p>
          </div>

          <div className="row" style={{ gap: 10, justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                window.open('https://example.com/apply', '_blank', 'noopener');
                if (loggedIn) setAskApply(true);
              }}
            >
              Apply externally →
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (!requireAccount()) return;
                toggleSave(job.id);
                toast(status ? 'Removed from your pipeline' : 'Saved to your pipeline');
              }}
            >
              {status ? 'Saved' : 'Save job'}
            </button>
          </div>
        </div>

        <div className="detail-layout">
          <div className="detail-main">
            <section>
              <p className="label" style={{ marginBottom: 12 }}>
                About the role
              </p>
              <p className="prose">{job.about}</p>
            </section>

            <section>
              <p className="label" style={{ marginBottom: 14 }}>
                Requirements
              </p>
              <div className="req-list">
                {job.requirements.map((requirement) => (
                  <p key={requirement}>{requirement}</p>
                ))}
              </div>
            </section>

            <section>
              <p className="label" style={{ marginBottom: 14 }}>
                Skills in this listing
              </p>
              {score.hasSkillData ? (
                <div className="stack" style={{ gap: 20, maxWidth: '62ch' }}>
                  <div>
                    <p className="meta" style={{ marginBottom: 9, color: 'var(--ink-3)' }}>
                      You have
                    </p>
                    <div className="chips">
                      {score.have.length > 0 ? (
                        score.have.map((skill) => (
                          <span key={skill} className="chip chip-have">
                            ✓ {skill}
                          </span>
                        ))
                      ) : (
                        <span className="small">None of the listed skills are on your profile yet.</span>
                      )}
                    </div>
                  </div>
                  {score.missing.length > 0 ? (
                    <div>
                      <p className="meta" style={{ marginBottom: 9, color: 'var(--ink-3)' }}>
                        Also requested
                      </p>
                      <div className="chips">
                        {score.missing.map((skill) => (
                          <span key={skill} className="chip chip-missing">
                            – {skill}
                          </span>
                        ))}
                      </div>
                      <p className="small" style={{ marginTop: 10 }}>
                        Not a rejection — most listings ask for more than they require.
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p style={{ fontSize: 14.5, color: 'var(--ink-3)' }}>
                  This listing doesn&apos;t state its skills. Your match is based on the rest of the posting.
                </p>
              )}
            </section>

            <section>
              <p className="label" style={{ marginBottom: 14 }}>
                Job details
              </p>
              <div className="kv-grid">
                {facts.map(([key, value]) => (
                  <p className="kv" key={key}>
                    <span>{key}</span>
                    <span>{value}</span>
                  </p>
                ))}
              </div>
            </section>
          </div>

          <aside className="decision">
            {loggedIn ? (
              <>
                <p className="match-big">
                  <b className="num" style={{ color: MATCH_COLOR[score.tone] }}>
                    {score.match}
                  </b>
                  <span className="label">{score.label}</span>
                </p>
                <div className="meter" style={{ marginTop: 14 }}>
                  <span style={{ width: `${score.match}%`, background: MATCH_COLOR[score.tone] }} />
                </div>
                <p className="small" style={{ marginTop: 12 }}>
                  Match based on available job information.
                </p>

                <div className="decision-block">
                  <button
                    type="button"
                    className="rail-toggle"
                    onClick={() => setBreakdownOpen((open) => !open)}
                    aria-expanded={breakdownOpen}
                  >
                    <span className="label" style={{ color: 'var(--ink-3)' }}>
                      Breakdown
                    </span>
                    <span style={{ color: 'var(--ink-4)' }}>{breakdownOpen ? '–' : '+'}</span>
                  </button>
                  {breakdownOpen ? (
                    <div style={{ marginTop: 12 }}>
                      {score.breakdown.map((row) => (
                        <p className="kv" key={row.key} style={{ borderTopColor: 'var(--rule)', fontSize: 13.5 }}>
                          <span style={{ color: 'var(--ink-2)' }}>{row.key}</span>
                          <span style={{ color: TONE_COLOR[row.tone], fontWeight: 500 }}>{row.verdict}</span>
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="decision-block">
                  <p className="label" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>
                    Why this matches
                  </p>
                  <div className="stack" style={{ gap: 7 }}>
                    {score.reasons.map((reason) => (
                      <p className="reason" key={reason}>
                        <i style={{ color: 'var(--match)' }}>✓</i>
                        {reason}
                      </p>
                    ))}
                  </div>
                  {score.considerations.length > 0 ? (
                    <div style={{ marginTop: 16 }}>
                      <p className="label" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>
                        Things to consider
                      </p>
                      <div className="stack" style={{ gap: 7 }}>
                        {score.considerations.map((item) => (
                          <p className="reason consider" key={item}>
                            <i style={{ color: 'var(--amber)' }}>–</i>
                            {item}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {score.match < 50 ? (
                  <div className="low-match">
                    <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>
                      Some requirements don&apos;t align with your profile. That&apos;s information, not a verdict.
                    </p>
                    <button
                      type="button"
                      className="btn btn-light btn-sm btn-block"
                      onClick={() => router.push('/jobs')}
                    >
                      Back to results
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm btn-block"
                      onClick={() => router.push('/jobs?sort=best')}
                    >
                      View better matches →
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <p className="h2" style={{ marginBottom: 8 }}>
                  Unlock your match
                </p>
                <p style={{ marginBottom: 18, fontSize: 14, color: 'var(--ink-3)' }}>
                  Create a free account to see how this role fits your profile — score, reasons and gaps.
                </p>
                <button type="button" className="btn btn-primary btn-block" onClick={openGate}>
                  Continue with account →
                </button>
                <p className="small" style={{ marginTop: 12 }}>
                  Listing signal below is public — no account needed.
                </p>
              </>
            )}

            <div className="decision-block strong">
              <p className="label" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>
                Listing signal
              </p>
              <p className="row" style={{ gap: 8 }}>
                <span className="dot" style={{ background: SIGNAL_COLOR[signal.tone] }} />
                <span className="h3">{signal.label}</span>
              </p>
              <div className="stack" style={{ gap: 5, marginTop: 10 }}>
                {signal.lines.map((line) => (
                  <p key={line} style={{ fontSize: 13, color: 'var(--ink-3)' }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {loggedIn && status ? (
              <div className="decision-block">
                <p className="label" style={{ color: 'var(--ink-3)', marginBottom: 10 }}>
                  Your status
                </p>
                <StatusChips
                  value={status}
                  onChange={(next) => {
                    setStatus(job.id, next);
                    toast(`Marked as ${next.charAt(0)}${next.slice(1).toLowerCase()}`);
                  }}
                />
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {askApply ? (
        <div className="prompt" role="dialog" aria-label="Did you apply?">
          <p style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Did you apply?</p>
          <p style={{ fontSize: 13, color: 'var(--ink-3)', marginBottom: 14 }}>
            {job.title} at {job.company}
          </p>
          <div className="stack" style={{ gap: 8 }}>
            <button
              type="button"
              className="btn btn-green btn-sm btn-block"
              onClick={() => {
                setStatus(job.id, 'APPLIED');
                setAskApply(false);
                router.push('/saved');
              }}
            >
              Yes, mark as Applied
            </button>
            <button type="button" className="btn btn-outline btn-sm btn-block" onClick={() => setAskApply(false)}>
              Not yet
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
