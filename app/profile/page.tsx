'use client';

import Link from 'next/link';
import { useState } from 'react';
import StateBlock from '@/components/StateBlock';
import { CITIES, EMPLOYMENT_TYPES, type EmploymentType, SKILL_LIBRARY, WORK_MODES, type WorkMode } from '@/lib/jobs';
import { useApp } from '@/lib/store';

export default function ProfilePage() {
  const { loggedIn, profile, patchProfile, completion } = useApp();
  const [roleDraft, setRoleDraft] = useState('');
  const [skillDraft, setSkillDraft] = useState('');

  if (!loggedIn) {
    return (
      <div className="wrap wrap-narrow page">
        <StateBlock
          title="Your Match Profile lives in your account."
          text="It's the information we use to understand which jobs fit you. Nothing is public."
        >
          <Link href="/login" className="btn btn-primary">
            Continue with account →
          </Link>
        </StateBlock>
      </div>
    );
  }

  const addRole = () => {
    const value = roleDraft.trim();
    if (!value || profile.roles.includes(value)) return;
    patchProfile({ roles: [...profile.roles, value] });
    setRoleDraft('');
  };

  const toggle = <T extends string>(list: T[], value: T) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const suggestions = SKILL_LIBRARY.filter(
    (skill) => !profile.skills.includes(skill) && skill.toLowerCase().includes(skillDraft.toLowerCase()),
  ).slice(0, 8);
  const hasExperienceAnswer = profile.experienceYears !== null;
  const experienceYears = profile.experienceYears ?? 0;

  return (
    <div className="wrap wrap-narrow page">
      <div className="profile-head">
        <div>
          <h1 className="display h1" style={{ marginBottom: 10 }}>
            Your Match Profile
          </h1>
          <p className="lede" style={{ maxWidth: '44ch' }}>
            The information we use to understand which jobs fit you.
          </p>
        </div>
        <div style={{ minWidth: 200 }}>
          <p className="spread" style={{ alignItems: 'baseline' }}>
            <span className="label">Complete</span>
            <span className="num" style={{ fontSize: 26 }}>
              {completion}%
            </span>
          </p>
          <div className="meter" style={{ marginTop: 10 }}>
            <span style={{ width: `${completion}%`, background: 'var(--plum-2)' }} />
          </div>
        </div>
      </div>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Target roles</p>
          <p className="profile-why">What roles are you interested in? Used to rank titles close to yours.</p>
        </div>
        <div>
          <div className="chips">
            {profile.roles.map((role) => (
              <span className="chip chip-static" key={role}>
                {role}
                <button
                  type="button"
                  className="chip-remove"
                  aria-label={`Remove ${role}`}
                  onClick={() => patchProfile({ roles: profile.roles.filter((item) => item !== role) })}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="row" style={{ gap: 8, marginTop: 12, maxWidth: 420 }}>
            <input
              className="input"
              value={roleDraft}
              aria-label="Add a target role"
              placeholder="Add a role…"
              onChange={(event) => setRoleDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  addRole();
                }
              }}
              style={{ flex: 1, height: 40 }}
            />
            <button type="button" className="btn btn-outline btn-sm" onClick={addRole}>
              Add
            </button>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Skills</p>
          <p className="profile-why">Used to compare your skills with job requirements.</p>
        </div>
        <div>
          <div className="chips">
            {profile.skills.map((skill) => (
              <span className="chip chip-have" key={skill}>
                {skill}
                <button
                  type="button"
                  className="chip-remove"
                  aria-label={`Remove ${skill}`}
                  onClick={() => patchProfile({ skills: profile.skills.filter((item) => item !== skill) })}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            className="input"
            value={skillDraft}
            aria-label="Search skills"
            placeholder="Search skills to add…"
            onChange={(event) => setSkillDraft(event.target.value)}
            style={{ maxWidth: 420, height: 40, marginTop: 12 }}
          />
          {suggestions.length > 0 ? (
            <div className="chips" style={{ marginTop: 10 }}>
              {suggestions.map((skill) => (
                <button
                  type="button"
                  className="chip"
                  key={skill}
                  onClick={() => {
                    patchProfile({ skills: [...profile.skills, skill] });
                    setSkillDraft('');
                  }}
                >
                  + {skill}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Preferred cities</p>
          <p className="profile-why">Used to prioritize jobs in cities you prefer.</p>
        </div>
        <div className="chips">
          {CITIES.map((city) => (
            <button
              type="button"
              className="chip"
              key={city}
              aria-pressed={profile.cities.includes(city)}
              onClick={() => patchProfile({ cities: toggle(profile.cities, city) })}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Work &amp; employment</p>
          <p className="profile-why">Treated as preference, not a hard filter.</p>
        </div>
        <div className="stack" style={{ gap: 22, maxWidth: 520 }}>
          <div>
            <p className="meta" style={{ marginBottom: 9, color: 'var(--ink-3)' }}>
              Work mode
            </p>
            <div className="chips">
              {WORK_MODES.map((mode) => (
                <button
                  type="button"
                  className="chip"
                  key={mode}
                  aria-pressed={profile.workModes.includes(mode)}
                  onClick={() => patchProfile({ workModes: toggle<WorkMode>(profile.workModes, mode) })}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="meta" style={{ marginBottom: 9, color: 'var(--ink-3)' }}>
              Employment preference
            </p>
            <div className="chips">
              {EMPLOYMENT_TYPES.map((type) => (
                <button
                  type="button"
                  className="chip"
                  key={type}
                  aria-pressed={profile.employmentTypes.includes(type)}
                  onClick={() =>
                    patchProfile({ employmentTypes: toggle<EmploymentType>(profile.employmentTypes, type) })
                  }
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="meta" style={{ marginBottom: 9, color: 'var(--ink-3)' }}>
              Years of relevant experience
            </p>
            <div className="stepper">
              <button
                type="button"
                aria-label="Fewer years"
                onClick={() => patchProfile({ experienceYears: Math.max(0, experienceYears - 1) })}
              >
                –
              </button>
              <output
                className="num"
                aria-label={hasExperienceAnswer ? `${experienceYears} years` : 'Experience not answered'}
              >
                {hasExperienceAnswer ? experienceYears : '—'}
              </output>
              <button
                type="button"
                aria-label="More years"
                onClick={() => patchProfile({ experienceYears: Math.min(30, experienceYears + 1) })}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Optional</p>
          <p className="profile-why">Leave blank and nothing is counted against you.</p>
        </div>
        <div className="stack" style={{ gap: 18, maxWidth: 460 }}>
          <label className="field">
            Salary expectation
            <input
              className="input"
              value={profile.salaryExpectation}
              placeholder="e.g. EUR 58k minimum"
              onChange={(event) => patchProfile({ salaryExpectation: event.target.value })}
              style={{ height: 40 }}
            />
          </label>
          <label className="check" style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={profile.visaSponsorship}
              onChange={() => patchProfile({ visaSponsorship: !profile.visaSponsorship })}
            />
            <span>I need visa sponsorship</span>
          </label>
        </div>
      </section>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Tools</p>
          <p className="profile-why">Separate from matching.</p>
        </div>
        <div className="tool-card">
          <div className="spread" style={{ alignItems: 'baseline' }}>
            <p className="h3">Create a Resume</p>
            <span className="label">Optional</span>
          </div>
          <p style={{ margin: '8px 0 16px', fontSize: 14, color: 'var(--ink-3)' }}>
            Turn your profile into a professional resume for external applications.
          </p>
          <Link href="/resume" className="btn btn-light btn-sm">
            Create Resume →
          </Link>
        </div>
      </section>
    </div>
  );
}
