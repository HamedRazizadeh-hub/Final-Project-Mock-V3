'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import StateBlock from '@/components/StateBlock';
import { CITIES, EMPLOYMENT_TYPES, type EmploymentType, SKILL_LIBRARY, WORK_MODES, type WorkMode } from '@/lib/jobs';
import { type Account, type MatchProfile, useApp } from '@/lib/store';

function completionFor(profile: MatchProfile) {
  const checks = [
    profile.roles.length > 0,
    profile.skills.length > 0,
    profile.cities.length > 0,
    profile.workModes.length > 0,
    profile.employmentTypes.length > 0,
    profile.experienceYears !== null,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export default function ProfilePage() {
  const { loggedIn, account, profile, patchAccount, patchProfile, completion } = useApp();
  const [editing, setEditing] = useState(false);
  const [draftAccount, setDraftAccount] = useState<Account>(account);
  const [draftProfile, setDraftProfile] = useState<MatchProfile>(profile);
  const [roleDraft, setRoleDraft] = useState('');
  const [skillDraft, setSkillDraft] = useState('');

  useEffect(() => {
    if (!editing) {
      setDraftAccount(account);
      setDraftProfile(profile);
    }
  }, [account, editing, profile]);

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
    if (!editing || !value || draftProfile.roles.includes(value)) return;
    setDraftProfile((current) => ({ ...current, roles: [...current.roles, value] }));
    setRoleDraft('');
  };

  const saveProfile = () => {
    patchAccount({
      firstName: draftAccount.firstName.trim(),
      lastName: draftAccount.lastName.trim(),
      email: draftAccount.email.trim().toLowerCase(),
    });
    patchProfile(draftProfile);
    setRoleDraft('');
    setSkillDraft('');
    setEditing(false);
  };

  const cancelEditing = () => {
    setDraftAccount(account);
    setDraftProfile(profile);
    setRoleDraft('');
    setSkillDraft('');
    setEditing(false);
  };

  const updateAccountDraft = (patch: Partial<Account>) => setDraftAccount((current) => ({ ...current, ...patch }));
  const updateDraft = (patch: Partial<MatchProfile>) => setDraftProfile((current) => ({ ...current, ...patch }));

  const toggle = <T extends string>(list: T[], value: T) =>
    list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  const suggestions = SKILL_LIBRARY.filter(
    (skill) => !draftProfile.skills.includes(skill) && skill.toLowerCase().includes(skillDraft.toLowerCase()),
  ).slice(0, 8);
  const visibleAccount = editing ? draftAccount : account;
  const visibleProfile = editing ? draftProfile : profile;
  const visibleCompletion = editing ? completionFor(draftProfile) : completion;
  const hasExperienceAnswer = visibleProfile.experienceYears !== null;
  const experienceYears = visibleProfile.experienceYears ?? 0;

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
          <div className="row" style={{ gap: 8, marginTop: 18 }}>
            {editing ? (
              <>
                <button type="button" className="btn btn-primary btn-sm" onClick={saveProfile}>
                  Save
                </button>
                <button type="button" className="btn btn-outline btn-sm" onClick={cancelEditing}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>
                Edit profile
              </button>
            )}
          </div>
        </div>
        <div style={{ minWidth: 200 }}>
          <p className="spread" style={{ alignItems: 'baseline' }}>
            <span className="label">Complete</span>
            <span className="num" style={{ fontSize: 26 }}>
              {visibleCompletion}%
            </span>
          </p>
          <div className="meter" style={{ marginTop: 10 }}>
            <span style={{ width: `${visibleCompletion}%`, background: 'var(--plum-2)' }} />
          </div>
        </div>
      </div>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Account details</p>
          <p className="profile-why">Your personal account identity.</p>
        </div>
        <div className="field-grid" style={{ maxWidth: 620 }}>
          <label className="field">
            First name
            <input
              className="input"
              value={visibleAccount.firstName}
              readOnly={!editing}
              onChange={(event) => updateAccountDraft({ firstName: event.target.value })}
            />
          </label>
          <label className="field">
            Last name
            <input
              className="input"
              value={visibleAccount.lastName}
              readOnly={!editing}
              onChange={(event) => updateAccountDraft({ lastName: event.target.value })}
            />
          </label>
          <label className="field">
            Email
            <input
              className="input"
              type="email"
              value={visibleAccount.email}
              readOnly={!editing}
              onChange={(event) => updateAccountDraft({ email: event.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Target roles</p>
          <p className="profile-why">What roles are you interested in? Used to rank titles close to yours.</p>
        </div>
        <div>
          <div className="chips">
            {visibleProfile.roles.map((role) => (
              <span className="chip chip-static" key={role}>
                {role}
                {editing ? (
                  <button
                    type="button"
                    className="chip-remove"
                    aria-label={`Remove ${role}`}
                    onClick={() => updateDraft({ roles: draftProfile.roles.filter((item) => item !== role) })}
                  >
                    ×
                  </button>
                ) : null}
              </span>
            ))}
          </div>
          {editing ? (
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
          ) : null}
        </div>
      </section>

      <section className="profile-section">
        <div>
          <p className="label label-ink">Skills</p>
          <p className="profile-why">Used to compare your skills with job requirements.</p>
        </div>
        <div>
          <div className="chips">
            {visibleProfile.skills.map((skill) => (
              <span className="chip chip-have" key={skill}>
                {skill}
                {editing ? (
                  <button
                    type="button"
                    className="chip-remove"
                    aria-label={`Remove ${skill}`}
                    onClick={() => updateDraft({ skills: draftProfile.skills.filter((item) => item !== skill) })}
                  >
                    ×
                  </button>
                ) : null}
              </span>
            ))}
          </div>
          {editing ? (
            <>
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
                        updateDraft({ skills: [...draftProfile.skills, skill] });
                        setSkillDraft('');
                      }}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              ) : null}
            </>
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
              aria-pressed={visibleProfile.cities.includes(city)}
              disabled={!editing}
              onClick={() => updateDraft({ cities: toggle(draftProfile.cities, city) })}
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
                  aria-pressed={visibleProfile.workModes.includes(mode)}
                  disabled={!editing}
                  onClick={() => updateDraft({ workModes: toggle<WorkMode>(draftProfile.workModes, mode) })}
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
                  aria-pressed={visibleProfile.employmentTypes.includes(type)}
                  disabled={!editing}
                  onClick={() =>
                    updateDraft({ employmentTypes: toggle<EmploymentType>(draftProfile.employmentTypes, type) })
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
                disabled={!editing}
                onClick={() => updateDraft({ experienceYears: Math.max(0, experienceYears - 1) })}
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
                disabled={!editing}
                onClick={() => updateDraft({ experienceYears: Math.min(30, experienceYears + 1) })}
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
              value={visibleProfile.salaryExpectation}
              placeholder="e.g. EUR 58k minimum"
              readOnly={!editing}
              onChange={(event) => updateDraft({ salaryExpectation: event.target.value })}
              style={{ height: 40 }}
            />
          </label>
          <label className="check" style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={visibleProfile.visaSponsorship}
              disabled={!editing}
              onChange={() => updateDraft({ visaSponsorship: !draftProfile.visaSponsorship })}
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
