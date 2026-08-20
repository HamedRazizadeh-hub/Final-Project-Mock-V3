'use client';

import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { EmploymentType, WorkMode } from './jobs';
import { BASE_SKILLS } from './jobs';

/* ── Product state, unchanged from V2 ────────────────────────────────────────
   Five job states, guest/member split, external apply, optional resume.
   Persisted to localStorage; no backend required to run the prototype.
*/

export type JobState = 'SAVED' | 'APPLIED' | 'REJECTED' | 'ACCEPTED' | 'DECLINED';

export const JOB_STATES: JobState[] = ['SAVED', 'APPLIED', 'REJECTED', 'ACCEPTED', 'DECLINED'];

export const JOB_STATE_LABELS: Record<JobState, string> = {
  SAVED: 'Saved',
  APPLIED: 'Applied',
  REJECTED: 'Rejected',
  ACCEPTED: 'Accepted',
  DECLINED: 'Declined',
};

export type MatchProfile = {
  roles: string[];
  skills: string[];
  cities: string[];
  workModes: WorkMode[];
  employmentTypes: EmploymentType[];
  experienceYears: number;
  salaryExpectation: string;
  visaSponsorship: boolean;
};

export type ResumeExperience = { id: string; role: string; company: string; dates: string; description: string };
export type ResumeEducation = { id: string; program: string; school: string; dates: string };

export type Resume = {
  name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  summary: string;
  skills: string[];
  experiences: ResumeExperience[];
  education: ResumeEducation[];
};

type State = {
  loggedIn: boolean;
  profile: MatchProfile;
  saved: Record<string, JobState>;
  resume: Resume;
};

const STORAGE_KEY = 'jobmatch.v3.state';

export const ACCOUNT = {
  name: 'Alex Morgan',
  firstName: 'Alex',
  initials: 'AM',
  email: 'alex.morgan@example.com',
};

const initialState: State = {
  loggedIn: false,
  profile: {
    roles: ['Frontend Developer', 'React Developer', 'UI Developer'],
    skills: BASE_SKILLS,
    cities: ['Utrecht', 'Amsterdam', 'Rotterdam'],
    workModes: ['Hybrid', 'Remote'],
    employmentTypes: ['Full-time', 'Contract'],
    experienceYears: 4,
    salaryExpectation: '',
    visaSponsorship: false,
  },
  saved: { j2: 'APPLIED', j5: 'SAVED', j14: 'SAVED', j31: 'REJECTED' },
  resume: {
    name: ACCOUNT.name,
    email: ACCOUNT.email,
    phone: '+31 6 0000 0000',
    city: 'Utrecht, Netherlands',
    role: 'Frontend Developer',
    summary:
      'Frontend developer with four years building product interfaces in React. Looking for a hybrid senior role in or around Utrecht.',
    skills: BASE_SKILLS,
    experiences: [
      {
        id: 'exp-demo-1',
        role: 'Frontend Developer',
        company: 'Demo Studio',
        dates: '2022 — now',
        description: 'Owned the component library and rebuilt the customer portal with a small product team.',
      },
      {
        id: 'exp-demo-2',
        role: 'Junior Developer',
        company: 'Example Digital',
        dates: '2020 — 2022',
        description: 'Shipped marketing sites and internal tools, moved the team onto a shared design system.',
      },
    ],
    education: [
      { id: 'edu-demo-1', program: 'Software Engineering', school: 'Example University', dates: '2016 — 2020' },
    ],
  },
};

type Api = State & {
  hydrated: boolean;
  logIn: () => void;
  logOut: () => void;
  toggleSave: (id: string) => void;
  setStatus: (id: string, status: JobState) => void;
  isSaved: (id: string) => boolean;
  patchProfile: (patch: Partial<MatchProfile>) => void;
  patchResume: (patch: Partial<Resume>) => void;
  completion: number;
};

const Ctx = createContext<Api | null>(null);

function normalize(next: State): State {
  const saved: Record<string, JobState> = {};
  Object.entries(next.saved ?? {}).forEach(([id, status]) => {
    saved[id] = JOB_STATES.includes(status as JobState) ? (status as JobState) : 'SAVED';
  });
  const resume = {
    ...next.resume,
    experiences: (next.resume.experiences ?? []).map((entry, index) => ({
      ...entry,
      id: entry.id ?? `exp-${index}`,
    })),
    education: (next.resume.education ?? []).map((entry, index) => ({
      ...entry,
      id: entry.id ?? `edu-${index}`,
    })),
  };
  return { ...next, saved, resume };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState((current) => normalize({ ...current, ...(JSON.parse(raw) as Partial<State>) }));
    } catch {
      /* corrupted storage is ignored on purpose */
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [hydrated, state]);

  const patch = useCallback((next: Partial<State>) => setState((current) => ({ ...current, ...next })), []);

  const api = useMemo<Api>(() => {
    const { profile } = state;
    const checks = [
      profile.roles.length > 0,
      profile.skills.length > 0,
      profile.cities.length > 0,
      profile.workModes.length > 0,
      profile.employmentTypes.length > 0,
      profile.experienceYears > 0,
    ];

    return {
      ...state,
      hydrated,
      logIn: () => patch({ loggedIn: true }),
      logOut: () => patch({ loggedIn: false }),
      toggleSave: (id) =>
        setState((current) => {
          const saved = { ...current.saved };
          if (saved[id]) delete saved[id];
          else saved[id] = 'SAVED';
          return { ...current, saved };
        }),
      setStatus: (id, status) => setState((current) => ({ ...current, saved: { ...current.saved, [id]: status } })),
      isSaved: (id) => Boolean(state.saved[id]),
      patchProfile: (next) => setState((current) => ({ ...current, profile: { ...current.profile, ...next } })),
      patchResume: (next) => setState((current) => ({ ...current, resume: { ...current.resume, ...next } })),
      completion: Math.round((checks.filter(Boolean).length / checks.length) * 100),
    };
  }, [hydrated, patch, state]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>');
  return ctx;
}
