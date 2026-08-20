'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import StateBlock from '@/components/StateBlock';
import StatusChips from '@/components/StatusChips';
import { useToast } from '@/components/Toast';
import { getJob } from '@/lib/jobs';
import { JOB_STATE_LABELS, JOB_STATES, type JobState, useApp } from '@/lib/store';

const DOTS: Record<JobState, string> = {
  SAVED: 'var(--plum-2)',
  APPLIED: 'var(--fresh)',
  REJECTED: 'var(--terracotta)',
  ACCEPTED: 'var(--match)',
  DECLINED: 'var(--ink-4)',
};

export default function PipelinePage() {
  const router = useRouter();
  const toast = useToast();
  const { loggedIn, saved, setStatus, toggleSave } = useApp();
  const [filter, setFilter] = useState<JobState | 'ALL'>('ALL');

  const tracked = useMemo(
    () =>
      Object.keys(saved)
        .map((id) => getJob(id))
        .filter((job): job is NonNullable<ReturnType<typeof getJob>> => Boolean(job)),
    [saved],
  );

  const counts = useMemo(() => {
    const result = {} as Record<JobState, number>;
    JOB_STATES.forEach((status) => {
      result[status] = tracked.filter((job) => saved[job.id] === status).length;
    });
    return result;
  }, [saved, tracked]);

  const list = filter === 'ALL' ? tracked : tracked.filter((job) => saved[job.id] === filter);

  if (!loggedIn) {
    return (
      <div className="wrap wrap-narrow page">
        <StateBlock
          title="Saving and tracking needs an account."
          text="Keep the jobs you like, mark what you applied to, and see where each one stands."
        >
          <Link href="/login" className="btn btn-primary">
            Continue with account →
          </Link>
        </StateBlock>
      </div>
    );
  }

  return (
    <div className="wrap wrap-narrow page">
      <h1 className="display h1" style={{ marginBottom: 'clamp(20px, 3vw, 30px)' }}>
        Your Job Pipeline
      </h1>

      <div className="pipe-stats">
        <button
          type="button"
          className="pipe-stat total"
          aria-pressed={filter === 'ALL'}
          onClick={() => setFilter('ALL')}
        >
          <b className="num">{tracked.length}</b>
          <span>Tracked</span>
        </button>
        {JOB_STATES.map((status) => (
          <button
            key={status}
            type="button"
            className="pipe-stat"
            aria-pressed={filter === status}
            onClick={() => setFilter(filter === status ? 'ALL' : status)}
          >
            <span className="row" style={{ gap: 7 }}>
              <span className="dot" style={{ background: DOTS[status] }} />
              <b className="num">{counts[status]}</b>
            </span>
            <span>{JOB_STATE_LABELS[status]}</span>
          </button>
        ))}
      </div>

      {tracked.length === 0 ? (
        <StateBlock title="Nothing tracked yet." text="Save jobs you're interested in and manage them here.">
          <Link href="/jobs" className="btn btn-primary">
            Browse jobs →
          </Link>
        </StateBlock>
      ) : null}

      {tracked.length > 0 && list.length === 0 ? (
        <StateBlock title="Nothing in this status.">
          <button type="button" className="link-btn" onClick={() => setFilter('ALL')}>
            Show the full pipeline
          </button>
        </StateBlock>
      ) : null}

      {list.map((job) => (
        <article className="pipe-row" key={job.id}>
          <span
            className="logo"
            style={{ width: 42, height: 42, background: job.logoBg, color: job.logoFg, fontSize: 12.5 }}
            aria-hidden="true"
          >
            {job.logoInitials}
          </span>
          <div>
            <button
              type="button"
              className="job-title"
              style={{ fontSize: 21 }}
              onClick={() => router.push(`/jobs/${job.id}`)}
            >
              {job.title}
            </button>
            <p className="meta" style={{ marginTop: 4 }}>
              {[job.company, job.city, job.workMode].join(' · ')}
            </p>
          </div>
          <StatusChips
            value={saved[job.id]}
            onChange={(status) => {
              setStatus(job.id, status);
              toast(`Marked as ${JOB_STATE_LABELS[status]}`);
            }}
          />
          <button
            type="button"
            className="link-quiet"
            onClick={() => {
              toggleSave(job.id);
              toast('Removed from your pipeline');
            }}
          >
            Remove
          </button>
        </article>
      ))}
    </div>
  );
}
