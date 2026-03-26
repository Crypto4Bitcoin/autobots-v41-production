'use server';

import { executeAction } from '@/lib/action-executor';
import type { ActionIntent } from '@/lib/types';

export async function runDashboardAction(intent: ActionIntent, divisionSlug: string, targetId?: string) {
  return executeAction({ intent, divisionSlug, targetId });
}
