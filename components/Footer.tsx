import { JOBS } from '@/lib/jobs';
import { Mark } from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <p>
          <Mark size={18} tone="quiet" />
          JobMatch — find jobs that fit you, and know which ones are worth your time.
        </p>
        <p>{JOBS.length} listings · updated daily</p>
      </div>
    </footer>
  );
}
