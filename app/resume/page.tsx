'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ResumeSheet from '@/components/ResumeSheet';
import StateBlock from '@/components/StateBlock';
import { useToast } from '@/components/Toast';
import { ResumeEducation, ResumeExperience, useApp } from '@/lib/store';

type Tab = 'edit' | 'preview';

export default function ResumePage() {
  const router = useRouter();
  const toast = useToast();
  const { hydrated, loggedIn, profile, resume, patchResume } = useApp();
  const [tab, setTab] = useState<Tab>('edit');

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace('/login');
  }, [hydrated, loggedIn, router]);

  if (!hydrated) return null;

  if (!loggedIn) {
    return (
      <div className="wrap wrap-narrow page">
        <StateBlock title="The Resume Builder is a member tool." text="It is optional — matching works without it.">
          <Link href="/login" className="btn btn-primary">Continue with account →</Link>
        </StateBlock>
      </div>
    );
  }

  const patchExperience = (index: number, patch: Partial<ResumeExperience>) =>
    patchResume({ experiences: resume.experiences.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)) });

  const patchEducation = (index: number, patch: Partial<ResumeEducation>) =>
    patchResume({ education: resume.education.map((entry, i) => (i === index ? { ...entry, ...patch } : entry)) });

  return (
    <div className="wrap">
      <div className="resume-head">
        <div>
          <p className="label" style={{ marginBottom: 8 }}>Optional tool</p>
          <h1 className="display" style={{ fontSize: 'clamp(30px, 3.8vw, 46px)' }}>Resume Builder</h1>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <div className="segmented resume-tabs" style={{ width: 180 }}>
            <button type="button" aria-pressed={tab === 'edit'} onClick={() => setTab('edit')}>Edit</button>
            <button type="button" aria-pressed={tab === 'preview'} onClick={() => setTab('preview')}>Preview</button>
          </div>
          <button type="button" className="btn btn-outline btn-sm" onClick={() => { toast('Opening print view — PDF export is optional'); window.print(); }}>
            Export PDF
          </button>
        </div>
      </div>

      <div className="resume-layout">
        <div className="editor" data-tab={tab}>
          <section>
            <p className="label label-ink" style={{ marginBottom: 14 }}>Personal details</p>
            <div className="field-grid">
              <label className="field">Full name<input className="input" value={resume.name} onChange={(event) => patchResume({ name: event.target.value })} style={{ height: 40 }} /></label>
              <label className="field">Email<input className="input" value={resume.email} onChange={(event) => patchResume({ email: event.target.value })} style={{ height: 40 }} /></label>
              <label className="field">Phone<input className="input" value={resume.phone} onChange={(event) => patchResume({ phone: event.target.value })} style={{ height: 40 }} /></label>
              <label className="field">City<input className="input" value={resume.city} onChange={(event) => patchResume({ city: event.target.value })} style={{ height: 40 }} /></label>
            </div>
          </section>

          <section>
            <p className="label label-ink" style={{ marginBottom: 14 }}>Target role</p>
            <input className="input" value={resume.role} onChange={(event) => patchResume({ role: event.target.value })} style={{ height: 40 }} />
          </section>

          <section>
            <p className="label label-ink" style={{ marginBottom: 14 }}>Professional summary</p>
            <textarea className="textarea" rows={4} value={resume.summary} onChange={(event) => patchResume({ summary: event.target.value })} />
          </section>

          <section>
            <p className="label label-ink" style={{ marginBottom: 12 }}>Skills</p>
            <p className="small" style={{ marginBottom: 12 }}>Pulled from your Match Profile — click to include or exclude.</p>
            <div className="chips">
              {profile.skills.map((skill) => {
                const on = resume.skills.includes(skill);
                return (
                  <button
                    type="button"
                    key={skill}
                    className="chip"
                    aria-pressed={on}
                    onClick={() => patchResume({ skills: on ? resume.skills.filter((item) => item !== skill) : [...resume.skills, skill] })}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="spread" style={{ alignItems: 'baseline', marginBottom: 14 }}>
              <p className="label label-ink">Experience</p>
              <button
                type="button"
                className="link-btn"
                onClick={() => patchResume({ experiences: [...resume.experiences, { role: '', company: '', dates: '', description: '' }] })}
              >
                + Add experience
              </button>
            </div>
            <div className="stack" style={{ gap: 14 }}>
              {resume.experiences.map((entry, index) => (
                <div className="entry" key={index}>
                  <div className="field-grid">
                    <input className="input" aria-label="Role" placeholder="Role" value={entry.role} onChange={(event) => patchExperience(index, { role: event.target.value })} style={{ height: 38 }} />
                    <input className="input" aria-label="Company" placeholder="Company" value={entry.company} onChange={(event) => patchExperience(index, { company: event.target.value })} style={{ height: 38 }} />
                    <input className="input" aria-label="Dates" placeholder="2022 — now" value={entry.dates} onChange={(event) => patchExperience(index, { dates: event.target.value })} style={{ height: 38 }} />
                  </div>
                  <textarea className="textarea" rows={2} aria-label="Description" placeholder="What you did" value={entry.description} onChange={(event) => patchExperience(index, { description: event.target.value })} />
                  <button
                    type="button"
                    className="link-quiet"
                    style={{ justifySelf: 'start' }}
                    onClick={() => patchResume({ experiences: resume.experiences.filter((_, i) => i !== index) })}
                  >
                    Remove entry
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="spread" style={{ alignItems: 'baseline', marginBottom: 14 }}>
              <p className="label label-ink">Education</p>
              <button
                type="button"
                className="link-btn"
                onClick={() => patchResume({ education: [...resume.education, { program: '', school: '', dates: '' }] })}
              >
                + Add education
              </button>
            </div>
            <div className="stack" style={{ gap: 14 }}>
              {resume.education.map((entry, index) => (
                <div className="entry" key={index}>
                  <div className="field-grid">
                    <input className="input" aria-label="Programme" placeholder="Programme" value={entry.program} onChange={(event) => patchEducation(index, { program: event.target.value })} style={{ height: 38 }} />
                    <input className="input" aria-label="School" placeholder="School" value={entry.school} onChange={(event) => patchEducation(index, { school: event.target.value })} style={{ height: 38 }} />
                    <input className="input" aria-label="Dates" placeholder="2018 — 2021" value={entry.dates} onChange={(event) => patchEducation(index, { dates: event.target.value })} style={{ height: 38 }} />
                  </div>
                  <button
                    type="button"
                    className="link-quiet"
                    style={{ justifySelf: 'start' }}
                    onClick={() => patchResume({ education: resume.education.filter((_, i) => i !== index) })}
                  >
                    Remove entry
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="sheet-wrap" data-tab={tab}>
          <ResumeSheet resume={resume} />
          <p className="small" style={{ marginTop: 12, paddingLeft: 4 }}>
            Preview updates as you type. Export is optional — your profile works without it.
          </p>
        </div>
      </div>
    </div>
  );
}
