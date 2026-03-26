import { notFound } from 'next/navigation';
import { DivisionPage } from '@/components/DivisionPage';
import { loadDashboard } from '@/lib/dashboard';

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const dashboard = await loadDashboard('memetic-systems', {
    q: typeof params.q === 'string' ? params.q : undefined,
    status: typeof params.status === 'string' ? params.status : undefined,
    verifier: typeof params.verifier === 'string' ? params.verifier : undefined,
  });

  if (!dashboard) {
    notFound();
  }

  return <DivisionPage dashboard={dashboard} />;
}
