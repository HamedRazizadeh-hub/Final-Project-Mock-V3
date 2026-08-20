import { Suspense } from 'react';
import JobsBrowser from '@/components/JobsBrowser';
import ResultsSkeleton from '@/components/ResultsSkeleton';

export const metadata = { title: 'Explore jobs — JobMatch' };

/** useSearchParams lives in the client child, so it needs a Suspense boundary. */
export default function JobsPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap" style={{ paddingTop: 44 }}>
          <ResultsSkeleton rows={6} />
        </div>
      }
    >
      <JobsBrowser />
    </Suspense>
  );
}
