export type WorkMode = 'Remote' | 'Hybrid' | 'On-site';
export type Level = 'Junior' | 'Mid' | 'Senior';
export type EmploymentType = 'Full-time' | 'Part-time' | 'Contract';

export type Job = {
  id: string;
  field: string;
  title: string;
  company: string;
  city: string;
  workMode: WorkMode;
  employmentType: EmploymentType;
  posted: string;
  days: number;
  source: string;
  level: Level;
  experienceYears: number;
  /** Optional: many real listings do not state a salary. */
  salary?: string;
  reposts?: number;
  activeSignal?: string;
  logoInitials: string;
  logoBg: string;
  logoFg: string;
  /** Skills the listing asks for. May be empty. */
  req: string[];
  about: string;
  requirements: string[];
};

export const CITIES = [
  'Amsterdam',
  'Utrecht',
  'Rotterdam',
  'Eindhoven',
  'Den Haag',
  'Groningen',
  'Tilburg',
  'Maastricht',
];
export const WORK_MODES: WorkMode[] = ['Remote', 'Hybrid', 'On-site'];
export const EMPLOYMENT_TYPES: EmploymentType[] = ['Full-time', 'Part-time', 'Contract'];
export const LEVELS: Level[] = ['Junior', 'Mid', 'Senior'];

const COMPANIES = [
  'Mollie',
  'Adyen',
  'Picnic',
  'Bunq',
  'WeTransfer',
  'Coolblue',
  'Eneco',
  'DEPT',
  'Booking.com',
  'TomTom',
  'Bol.com',
  'KPN',
  'ASML',
  'ING',
  'Philips',
  'Randstad',
  'Exact',
  'MessageBird',
  'Swapfiets',
  'Felyx',
  'Rituals',
  'Tony Chocolonely',
  'VanMoof Labs',
  'NN Group',
  'PostNL',
  'Takeaway',
  'Backbase',
  'Elastic',
];
const CYCLE_WORK: WorkMode[] = ['Hybrid', 'Remote', 'On-site'];
const CYCLE_EMPLOYMENT: EmploymentType[] = ['Full-time', 'Full-time', 'Contract', 'Part-time'];
const SOURCES = ['Company site', 'LinkedIn', 'Indeed', 'Glassdoor'];
const LOGO_COLORS: [string, string][] = [
  ['#F1EAF0', '#4A2742'],
  ['#E4EFE7', '#1B5C44'],
  ['#F5EEE2', '#856222'],
  ['#EFE7DA', '#6A5433'],
  ['#E9E6F0', '#453B63'],
  ['#EEEAE4', '#4A443D'],
];

type JobGroup = {
  key: string;
  count: number;
  titles: string[];
  skills: string[];
  about: string;
  requirements: string[];
};

const GROUPS: JobGroup[] = [
  {
    key: 'Frontend',
    count: 10,
    titles: ['Frontend Developer', 'React Developer', 'UI Developer', 'Next.js Engineer', 'Senior Frontend Developer'],
    skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML', 'Next.js', 'Testing', 'Design systems'],
    about:
      'Build polished product interfaces, reusable components and accessible user flows for customer-facing platforms.',
    requirements: [
      'Strong frontend fundamentals',
      'Experience with component-based UI',
      'Care for accessibility and performance',
    ],
  },
  {
    key: 'Backend',
    count: 8,
    titles: ['Backend Developer', 'Node.js Engineer', 'API Developer', 'Platform Backend Engineer'],
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'GraphQL', 'Azure'],
    about: 'Design APIs, data models and service integrations used by product and operations teams.',
    requirements: [
      'Experience building production APIs',
      'Comfortable with databases',
      'Writes maintainable backend services',
    ],
  },
  {
    key: 'Full-stack',
    count: 12,
    titles: ['Full-stack Developer', 'Product Engineer', 'Full-stack TypeScript Engineer', 'SaaS Engineer'],
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Testing', 'Docker'],
    about: 'Work across frontend and backend features from discovery through release.',
    requirements: [
      'Comfortable across the stack',
      'Can ship features end to end',
      'Collaborates closely with product teams',
    ],
  },
  {
    key: 'Data',
    count: 16,
    titles: ['Data Analyst', 'BI Analyst', 'Analytics Engineer', 'Data Engineer', 'Product Analyst'],
    skills: ['SQL', 'Python', 'Azure', 'PostgreSQL', 'Testing'],
    about: 'Turn business and product data into clear dashboards, analysis and reliable decision support.',
    requirements: ['Strong SQL skills', 'Can explain insights clearly', 'Experience with data quality checks'],
  },
  {
    key: 'Cloud',
    count: 14,
    titles: ['Cloud Engineer', 'Azure Engineer', 'Cloud Support Engineer', 'Infrastructure Engineer'],
    skills: ['Azure', 'Docker', 'Node.js', 'SQL', 'Git'],
    about: 'Support cloud platforms, deployments and migration projects for growing product teams.',
    requirements: [
      'Cloud platform experience',
      'Understands deployment workflows',
      'Comfortable troubleshooting production issues',
    ],
  },
  {
    key: 'DevOps',
    count: 12,
    titles: ['DevOps Engineer', 'Site Reliability Engineer', 'CI/CD Engineer', 'Platform Operations Engineer'],
    skills: ['Docker', 'Azure', 'Git', 'Testing', 'Node.js'],
    about: 'Improve reliability, deployment automation and operational visibility across product systems.',
    requirements: [
      'Experience with CI/CD',
      'Infrastructure troubleshooting skills',
      'Focus on reliability and observability',
    ],
  },
  {
    key: 'QA',
    count: 10,
    titles: ['QA Engineer', 'Test Automation Engineer', 'Quality Analyst', 'Software Tester'],
    skills: ['Testing', 'JavaScript', 'TypeScript', 'Git', 'SQL'],
    about: 'Create test coverage, automate regression checks and help teams release with confidence.',
    requirements: ['Testing mindset', 'Experience with automated test suites', 'Clear bug reporting'],
  },
  {
    key: 'Product',
    count: 10,
    titles: ['Product Manager', 'Associate Product Manager', 'Product Owner', 'Technical Product Manager'],
    skills: ['SQL', 'Design systems', 'Testing', 'Git'],
    about: 'Shape product priorities, coordinate delivery and keep teams focused on user outcomes.',
    requirements: [
      'Strong product judgement',
      'Can work with engineering and design',
      'Comfortable using data in decisions',
    ],
  },
  {
    key: 'UX',
    count: 9,
    titles: ['UX Designer', 'Product Designer', 'UX Researcher', 'Design Systems Designer'],
    skills: ['Design systems', 'CSS', 'HTML', 'React'],
    about: 'Design clear product experiences, test interaction patterns and improve usability across workflows.',
    requirements: [
      'Portfolio with product work',
      'Strong interaction design',
      'Comfortable collaborating with engineers',
    ],
  },
  {
    key: 'Marketing',
    count: 10,
    titles: ['Growth Marketer', 'SEO Specialist', 'Content Marketer', 'Marketing Analyst'],
    skills: ['SQL', 'HTML', 'CSS', 'Testing'],
    about: 'Plan campaigns, improve acquisition funnels and measure performance across digital channels.',
    requirements: ['Understands funnel metrics', 'Can run structured experiments', 'Writes clear campaign briefs'],
  },
  {
    key: 'Sales',
    count: 10,
    titles: [
      'Account Executive',
      'Sales Development Representative',
      'Customer Success Manager',
      'Partnership Manager',
    ],
    skills: ['SQL', 'GraphQL'],
    about: 'Work with prospects and customers to understand needs, close opportunities and grow accounts.',
    requirements: ['Strong communication skills', 'Comfortable with CRM workflows', 'Commercial mindset'],
  },
  {
    key: 'Support',
    count: 8,
    titles: [
      'Customer Support Specialist',
      'Technical Support Specialist',
      'Support Engineer',
      'Client Operations Associate',
    ],
    skills: ['SQL', 'HTML', 'CSS', 'Git'],
    about: 'Help customers solve issues, document recurring problems and improve support operations.',
    requirements: ['Patient customer communication', 'Structured troubleshooting', 'Can document support patterns'],
  },
  {
    key: 'Finance',
    count: 8,
    titles: ['Financial Analyst', 'Business Controller', 'Finance Operations Analyst', 'Risk Analyst'],
    skills: ['SQL', 'Python', 'PostgreSQL'],
    about: 'Analyse financial performance, automate reporting and support planning decisions.',
    requirements: ['Analytical finance background', 'Comfortable with reporting data', 'Attention to detail'],
  },
  {
    key: 'HR',
    count: 7,
    titles: ['Recruiter', 'People Operations Specialist', 'Talent Acquisition Partner', 'HR Coordinator'],
    skills: ['Testing', 'SQL'],
    about: 'Support hiring, onboarding and people operations for growing teams.',
    requirements: ['Organised hiring process skills', 'Clear stakeholder communication', 'Candidate-friendly mindset'],
  },
  {
    key: 'Operations',
    count: 8,
    titles: [
      'Operations Analyst',
      'Business Operations Specialist',
      'Process Improvement Lead',
      'Logistics Coordinator',
    ],
    skills: ['SQL', 'Python', 'Testing'],
    about: 'Improve internal workflows, monitor operational metrics and coordinate cross-team execution.',
    requirements: [
      'Operational problem solving',
      'Comfortable with spreadsheets and data',
      'Process improvement mindset',
    ],
  },
  {
    key: 'Security',
    count: 7,
    titles: [
      'Security Engineer',
      'Application Security Analyst',
      'Cloud Security Specialist',
      'Security Operations Engineer',
    ],
    skills: ['Azure', 'Docker', 'Node.js', 'Git', 'Testing'],
    about: 'Improve application and cloud security while helping product teams ship responsibly.',
    requirements: ['Security fundamentals', 'Can review technical risk', 'Experience with secure delivery practices'],
  },
  {
    key: 'Mobile',
    count: 8,
    titles: ['Mobile Developer', 'React Native Developer', 'iOS Product Engineer', 'Mobile QA Engineer'],
    skills: ['React Native', 'TypeScript', 'JavaScript', 'Testing', 'Git'],
    about: 'Build and improve mobile product experiences used by customers on the go.',
    requirements: [
      'Mobile app delivery experience',
      'Strong debugging habits',
      'Care for performance and release quality',
    ],
  },
];

export const SKILL_LIBRARY = [
  'React',
  'TypeScript',
  'CSS',
  'JavaScript',
  'HTML',
  'Git',
  'Next.js',
  'Testing',
  'Node.js',
  'PostgreSQL',
  'Docker',
  'React Native',
  'Design systems',
  'GraphQL',
  'Python',
  'SQL',
  'Azure',
];

export const BASE_SKILLS = ['React', 'CSS', 'JavaScript', 'HTML', 'Git'];

function postedLabel(days: number) {
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  if (days === 7) return '1 week ago';
  return `${days} days ago`;
}

function initialsOf(company: string) {
  return company
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function salaryFor(index: number, level: Level, employmentType: EmploymentType) {
  if (index % 5 === 0) return undefined;
  if (employmentType === 'Contract') return `EUR ${520 + (index % 7) * 35}–${650 + (index % 8) * 35} day rate`;
  const base = level === 'Senior' ? 68 : level === 'Mid' ? 52 : 36;
  return `EUR ${base + (index % 6) * 2}k–${base + 14 + (index % 6) * 3}k`;
}

function makeJob(group: JobGroup, groupIndex: number, indexInGroup: number, absoluteIndex: number): Job {
  const company = COMPANIES[(absoluteIndex + groupIndex) % COMPANIES.length];
  const city = CITIES[(absoluteIndex * 3 + groupIndex) % CITIES.length];
  const workMode = CYCLE_WORK[(absoluteIndex + indexInGroup) % CYCLE_WORK.length];
  const employmentType = CYCLE_EMPLOYMENT[(absoluteIndex + groupIndex) % CYCLE_EMPLOYMENT.length];
  const level = LEVELS[(absoluteIndex + groupIndex + indexInGroup) % LEVELS.length];
  const daysPattern = [0, 1, 2, 3, 4, 5, 6, 7, 9, 12, 18, 24, 31, 45, 60, 75];
  const days = daysPattern[(absoluteIndex + groupIndex) % daysPattern.length];
  const [logoBg, logoFg] = LOGO_COLORS[(absoluteIndex + groupIndex) % LOGO_COLORS.length];
  const skillCount = absoluteIndex % 17 === 0 ? 0 : 2 + (absoluteIndex % Math.min(4, group.skills.length));
  const req = group.skills.slice(0, skillCount);
  const experienceYears = level === 'Senior' ? 5 + (indexInGroup % 3) : level === 'Mid' ? 2 + (indexInGroup % 3) : 1;

  return {
    id: `j${absoluteIndex + 1}`,
    field: group.key,
    title: group.titles[indexInGroup % group.titles.length],
    company,
    city,
    workMode,
    employmentType,
    posted: postedLabel(days),
    days,
    source: SOURCES[(absoluteIndex + groupIndex) % SOURCES.length],
    level,
    experienceYears,
    salary: salaryFor(absoluteIndex, level, employmentType),
    reposts: days > 30 ? 1 + (absoluteIndex % 4) : undefined,
    activeSignal: days <= 2 ? 'Recently refreshed by employer' : undefined,
    logoInitials: initialsOf(company),
    logoBg,
    logoFg,
    req,
    about: group.about,
    requirements: [
      `${experienceYears}+ years of relevant experience`,
      ...group.requirements.slice(0, 2),
      req.length ? `Useful skills include ${req.slice(0, 3).join(', ')}` : 'The listing has limited skill detail',
    ],
  };
}

export const JOBS: Job[] = GROUPS.flatMap((group, groupIndex) =>
  Array.from({ length: group.count }, (_, indexInGroup) => {
    const absoluteIndex = GROUPS.slice(0, groupIndex).reduce((sum, item) => sum + item.count, 0) + indexInGroup;
    return makeJob(group, groupIndex, indexInGroup, absoluteIndex);
  }),
);

export const getJob = (id: string) => JOBS.find((job) => job.id === id);

export const jobsPerCity = (city: string) => JOBS.filter((job) => job.city === city).length;

/* ── Listing signal ───────────────────────────────────────────────────────────
   Listing quality is deliberately separate from Match. Backend fields are
   translated into human language here — never surfaced raw.
*/
export type SignalTone = 'fresh' | 'watch' | 'old';

export type ListingSignal = {
  label: string;
  detail: string;
  tone: SignalTone;
  lines: string[];
};

export function listingSignal(job: Job): ListingSignal {
  const tone: SignalTone = job.days <= 7 ? 'fresh' : job.days <= 30 ? 'watch' : 'old';
  const label =
    job.days <= 2
      ? 'Recently verified'
      : job.days <= 7
        ? 'Fresh'
        : job.days <= 30
          ? 'Worth checking'
          : (job.reposts ?? 0) > 1
            ? 'Frequently reposted'
            : 'Older listing';

  const lines = [`Posted ${job.posted.toLowerCase()}`];
  if (job.activeSignal) lines.push('Refreshed by the employer recently');
  lines.push(job.days <= 2 ? 'Last checked today' : `Last checked ${Math.max(1, Math.round(job.days / 6))} days ago`);
  if (job.reposts) lines.push(`Seen reposted ${job.reposts} ${job.reposts === 1 ? 'time' : 'times'}`);
  lines.push(`Applications go directly to ${job.company}`);

  return { label, detail: job.days <= 2 ? 'checked today' : `${job.days} days`, tone, lines };
}
