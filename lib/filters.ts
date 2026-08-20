import type { EmploymentType, Job, Level, WorkMode } from './jobs';
import type { MatchProfile } from './store';
import { relevanceRank, scoreJob } from './match';

export type SortKey = 'Most relevant' | 'Best match' | 'Newest';
export type PostedKey = 'Any time' | 'Last 24 hours' | 'Last 7 days' | 'Last 30 days';

/** No Province, by product decision. City only. */
export type Filters = {
  query: string;
  cities: string[];
  workModes: WorkMode[];
  employmentType: EmploymentType | 'Any type';
  level: Level | 'All levels';
  posted: PostedKey;
  salaryOnly: boolean;
  sort: SortKey;
};

export const EMPTY_FILTERS: Filters = {
  query: '',
  cities: [],
  workModes: [],
  employmentType: 'Any type',
  level: 'All levels',
  posted: 'Any time',
  salaryOnly: false,
  sort: 'Most relevant',
};

const MAX_DAYS: Record<PostedKey, number> = {
  'Any time': 9999,
  'Last 24 hours': 1,
  'Last 7 days': 7,
  'Last 30 days': 30,
};

function haystack(job: Job) {
  return [job.field, job.title, job.company, job.city, job.workMode, job.employmentType, job.level, job.about, ...job.req]
    .join(' ')
    .toLowerCase();
}

export function applyFilters(jobs: Job[], filters: Filters, profile: MatchProfile) {
  const query = filters.query.trim().toLowerCase();
  const maxDays = MAX_DAYS[filters.posted];

  const list = jobs.filter((job) => {
    if (query && !haystack(job).includes(query)) return false;
    if (filters.cities.length && !filters.cities.includes(job.city)) return false;
    if (filters.workModes.length && !filters.workModes.includes(job.workMode)) return false;
    if (filters.employmentType !== 'Any type' && job.employmentType !== filters.employmentType) return false;
    if (filters.level !== 'All levels' && job.level !== filters.level) return false;
    if (filters.salaryOnly && !job.salary) return false;
    if (job.days > maxDays) return false;
    return true;
  });

  if (filters.sort === 'Best match') {
    return [...list].sort((a, b) => scoreJob(b, profile).match - scoreJob(a, profile).match);
  }
  if (filters.sort === 'Newest') {
    return [...list].sort((a, b) => a.days - b.days);
  }
  return [...list].sort((a, b) => relevanceRank(b, profile) - relevanceRank(a, profile));
}

export type FilterToken = { label: string; clear: () => void };

export function activeTokens(filters: Filters, set: (next: Filters) => void): FilterToken[] {
  const tokens: FilterToken[] = [];
  if (filters.query.trim()) tokens.push({ label: `"${filters.query.trim()}"`, clear: () => set({ ...filters, query: '' }) });
  filters.cities.forEach((city) =>
    tokens.push({ label: city, clear: () => set({ ...filters, cities: filters.cities.filter((c) => c !== city) }) }),
  );
  filters.workModes.forEach((mode) =>
    tokens.push({ label: mode, clear: () => set({ ...filters, workModes: filters.workModes.filter((m) => m !== mode) }) }),
  );
  if (filters.employmentType !== 'Any type') tokens.push({ label: filters.employmentType, clear: () => set({ ...filters, employmentType: 'Any type' }) });
  if (filters.level !== 'All levels') tokens.push({ label: filters.level, clear: () => set({ ...filters, level: 'All levels' }) });
  if (filters.posted !== 'Any time') tokens.push({ label: filters.posted, clear: () => set({ ...filters, posted: 'Any time' }) });
  if (filters.salaryOnly) tokens.push({ label: 'Salary listed', clear: () => set({ ...filters, salaryOnly: false }) });
  return tokens;
}
