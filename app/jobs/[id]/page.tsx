import { notFound } from 'next/navigation';
import JobDetail from '@/components/JobDetail';
import { getJob, JOBS } from '@/lib/jobs';

/** Next 16: route params arrive as a Promise. */
export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = getJob(id);
  if (!job) notFound();
  return <JobDetail job={job} />;
}

export function generateStaticParams() {
  return JOBS.map((job) => ({ id: job.id }));
}
