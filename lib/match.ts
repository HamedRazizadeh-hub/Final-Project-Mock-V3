import type { Job } from './jobs';
import type { MatchProfile } from './store';

export type MatchLabel = 'Strong match' | 'Fair match' | 'Lower match';
export type BreakdownVerdict =
  | 'Strong'
  | 'Partial'
  | 'Limited'
  | 'Match'
  | 'Adjacent'
  | 'Not stated'
  | 'Not provided'
  | 'Listed'
  | string;

export type BreakdownRow = {
  key: string;
  verdict: BreakdownVerdict;
  /** 'good' | 'neutral' | 'attention' — never 'bad'. Missing data is not a mismatch. */
  tone: 'good' | 'neutral' | 'attention';
};

export type Score = {
  match: number;
  label: MatchLabel;
  tone: 'strong' | 'fair' | 'low';
  have: string[];
  missing: string[];
  hasSkillData: boolean;
  reasons: string[];
  considerations: string[];
  breakdown: BreakdownRow[];
};

/**
 * The match model, unchanged from V2: profile skills against the skills the
 * listing asks for. Missing information never counts as a mismatch — when a
 * listing states no skills we fall back to a neutral baseline and say so.
 */
export function scoreJob(job: Job, profile: MatchProfile): Score {
  const have = job.req.filter((skill) => profile.skills.includes(skill));
  const missing = job.req.filter((skill) => !profile.skills.includes(skill));
  const hasSkillData = job.req.length > 0;
  const match = hasSkillData ? Math.round((have.length / job.req.length) * 100) : 62;
  const label: MatchLabel = match >= 75 ? 'Strong match' : match >= 50 ? 'Fair match' : 'Lower match';
  const tone = match >= 75 ? 'strong' : match >= 50 ? 'fair' : 'low';

  const cityMatch = profile.cities.includes(job.city);
  const workMatch = profile.workModes.includes(job.workMode);
  const employmentMatch = profile.employmentTypes.includes(job.employmentType);
  const experienceYears = profile.experienceYears;
  const hasExperienceData = experienceYears !== null;
  const experienceMatch = hasExperienceData && job.experienceYears <= experienceYears;
  const roleMatch = profile.roles.some((role) => {
    const head = role.split(' ')[0].toLowerCase();
    return job.title.toLowerCase().includes(head);
  });

  const reasons: string[] = [];
  if (have.length) reasons.push(`${have.length} matching ${have.length === 1 ? 'skill' : 'skills'}`);
  if (cityMatch) reasons.push(`Preferred city — ${job.city}`);
  if (workMatch) reasons.push(`${job.workMode} matches your work mode`);
  if (employmentMatch) reasons.push(`${job.employmentType} matches your preference`);
  if (experienceMatch) reasons.push('Experience requirement met');

  const considerations: string[] = [
    ...missing.map((skill) => `${skill} is listed as requested`),
    ...(job.salary ? [] : ['Salary is not provided in this listing']),
    ...(hasSkillData ? [] : ['Listing has limited skill detail']),
    ...(cityMatch ? [] : [`${job.city} is outside your preferred cities`]),
  ];

  const breakdown: BreakdownRow[] = [
    {
      key: 'Skills',
      verdict: hasSkillData ? (match >= 75 ? 'Strong' : match >= 50 ? 'Partial' : 'Limited') : 'Not stated',
      tone: hasSkillData ? (match >= 50 ? 'good' : 'attention') : 'neutral',
    },
    { key: 'Role', verdict: roleMatch ? 'Strong' : 'Adjacent', tone: roleMatch ? 'good' : 'neutral' },
    { key: 'Location', verdict: cityMatch ? 'Match' : job.city, tone: cityMatch ? 'good' : 'neutral' },
    { key: 'Work mode', verdict: workMatch ? 'Match' : job.workMode, tone: workMatch ? 'good' : 'neutral' },
    {
      key: 'Experience',
      verdict: !hasExperienceData ? 'Not provided' : experienceMatch ? 'Match' : `${job.experienceYears}+ years asked`,
      tone: !hasExperienceData ? 'neutral' : experienceMatch ? 'good' : 'attention',
    },
    { key: 'Salary', verdict: job.salary ? 'Listed' : 'Not provided', tone: 'neutral' },
  ];

  return { match, label, tone, have, missing, hasSkillData, reasons, considerations, breakdown };
}

/** Default ordering: strong matches first, with a gentle penalty for stale listings. */
export function relevanceRank(job: Job, profile: MatchProfile) {
  return scoreJob(job, profile).match - job.days * 0.6;
}
