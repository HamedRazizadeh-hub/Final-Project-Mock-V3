'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job, listingSignal } from '@/lib/jobs';
import { scoreJob } from '@/lib/match';
import { useApp } from '@/lib/store';
import { useAuthGate } from './AuthGate';
import { useToast } from './Toast';

const SIGNAL_COLOR = { fresh: 'var(--fresh)', watch: 'var(--amber)', old: 'var(--terracotta)' } as const;
const MATCH_COLOR = { strong: 'var(--match)', fair: 'var(--plum-2)', low: 'var(--amber-ink)' } as const;

export default function JobRow({ job }: { job: Job }) {
  const router = useRouter();
  const { loggedIn, profile, saved, toggleSave } = useApp();
  const { requireAccount, openGate } = useAuthGate();
  const toast = useToast();
  const [justSaved, setJustSaved] = useState(false);

  const score = scoreJob(job, profile);
  const signal = listingSignal(job);
  const isSaved = Boolean(saved[job.id]);

  return (
    <article className="job-row">
      <span className="logo" style={{ background: job.logoBg, color: job.logoFg }} aria-hidden="true">
        {job.logoInitials}
      </span>

      <div className="job-body">
        <button type="button" className="job-title" onClick={() => router.push(`/jobs/${job.id}`)}>
          {job.title}
        </button>
        <p style={{ fontSize: 14, color: 'var(--ink-2)' }}>{job.company}</p>
        <p className="meta">{[job.city, job.workMode, job.employmentType].join(' · ')}</p>
        {job.req.length > 0 ? <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>{job.req.join(' · ')}</p> : null}
        {job.salary ? <p className="small">{job.salary}</p> : null}
      </div>

      <div className="job-side">
        <div>
          {loggedIn ? (
            <>
              <span className="match-num num" style={{ color: MATCH_COLOR[score.tone] }}>
                {score.match}
              </span>
              <span className="match-cap">MATCH</span>
              <span className="match-meter">
                <span style={{ width: `${score.match}%`, background: MATCH_COLOR[score.tone] }} />
              </span>
            </>
          ) : (
            <button type="button" className="link-quiet" onClick={openGate} style={{ color: 'var(--plum-2)' }}>
              See your match
            </button>
          )}
        </div>

        <div>
          <span className="signal-line" style={{ color: SIGNAL_COLOR[signal.tone] }}>
            <span className="dot" style={{ background: SIGNAL_COLOR[signal.tone] }} />
            {signal.label}
          </span>
          <span className="small" style={{ display: 'block', marginTop: 2 }}>{signal.detail}</span>
        </div>

        <button
          type="button"
          className={`bookmark${justSaved ? ' just-saved' : ''}`}
          aria-label={isSaved ? `Remove ${job.title} from your pipeline` : `Save ${job.title}`}
          aria-pressed={isSaved}
          onClick={() => {
            if (!requireAccount()) return;
            toggleSave(job.id);
            setJustSaved(!isSaved);
            toast(isSaved ? 'Removed from your pipeline' : 'Saved to your pipeline');
          }}
        >
          <svg width="16" height="18" viewBox="0 0 16 18" fill={isSaved ? 'var(--plum)' : 'none'} stroke={isSaved ? 'var(--plum)' : 'var(--ink-5)'} strokeWidth="1.5">
            <path d="M2 2.5h12v13l-6-4.2-6 4.2z" />
          </svg>
        </button>
      </div>
    </article>
  );
}
