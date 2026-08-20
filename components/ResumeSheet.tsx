import { Resume } from '@/lib/store';
import { Mark } from './Logo';

export default function ResumeSheet({ resume }: { resume: Resume }) {
  const contact = [resume.email, resume.phone, resume.city].filter(Boolean).join('  ·  ');

  return (
    <div className="sheet">
      <div className="sheet-head">
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 500, letterSpacing: '-0.015em' }}>{resume.name}</p>
          {resume.role ? <p style={{ marginTop: 4, fontSize: 14, color: 'var(--plum-2)' }}>{resume.role}</p> : null}
          {contact ? <p className="small" style={{ marginTop: 10 }}>{contact}</p> : null}
        </div>
        <Mark size={20} tone="mono" />
      </div>

      {resume.summary ? (
        <div className="sheet-block">
          <p className="sheet-label">Summary</p>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-2)' }}>{resume.summary}</p>
        </div>
      ) : null}

      {resume.skills.length > 0 ? (
        <div className="sheet-block">
          <p className="sheet-label">Skills</p>
          <p style={{ fontSize: 13.5, color: 'var(--ink-2)' }}>{resume.skills.join(' · ')}</p>
        </div>
      ) : null}

      {resume.experiences.length > 0 ? (
        <div className="sheet-block">
          <p className="sheet-label">Experience</p>
          <div className="stack" style={{ gap: 16 }}>
            {resume.experiences.map((entry, index) => (
              <div key={index}>
                <p className="sheet-entry">
                  <span style={{ fontWeight: 600 }}>{[entry.role, entry.company].filter(Boolean).join(' — ')}</span>
                  <span>{entry.dates}</span>
                </p>
                {entry.description ? (
                  <p style={{ marginTop: 5, fontSize: 13, lineHeight: 1.55, color: 'var(--ink-3)' }}>{entry.description}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {resume.education.length > 0 ? (
        <div className="sheet-block">
          <p className="sheet-label">Education</p>
          <div className="stack" style={{ gap: 10 }}>
            {resume.education.map((entry, index) => (
              <p className="sheet-entry" key={index}>
                <span>{[entry.program, entry.school].filter(Boolean).join(', ')}</span>
                <span>{entry.dates}</span>
              </p>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
