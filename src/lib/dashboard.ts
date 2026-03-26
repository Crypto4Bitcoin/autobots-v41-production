import { dashboardRepository } from '@/lib/data-access';
import type { DashboardFilters } from '@/lib/types';

export async function loadDashboard(slug: string, filters?: DashboardFilters) {
  return dashboardRepository.getDashboard(slug, filters);
}
