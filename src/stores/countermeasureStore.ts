import { create } from 'zustand';
import type { CountermeasureRoute, ThreatType, ThreatLevel } from '@/types/countermeasures';
import { createCountermeasureRoute } from '@/lib/world/countermeasureRouter';
import { useDefenseDistrictStore } from '@/stores/defenseDistrictStore';
import { useMetaOversightStore } from '@/stores/metaOversightStore';
import { useSecurityReplayStore } from '@/stores/securityReplayStore';

type CountermeasureState = {
  routes: CountermeasureRoute[];
};

type CountermeasureActions = {
  queueRoute: (input: {
    cellId: string;
    threatType: ThreatType;
    threatLevel: ThreatLevel;
  }) => CountermeasureRoute;
  dispatchRoute: (routeId: string) => void;
  resolveRoute: (routeId: string, note?: string) => void;
  failRoute: (routeId: string, note?: string) => void;
  autoRouteBreaches: () => CountermeasureRoute[];
};

export type CountermeasureStoreType = CountermeasureState & CountermeasureActions;

export const useCountermeasureStore = create<CountermeasureStoreType>((set, get) => ({
  routes: [],

  queueRoute: ({ cellId, threatType, threatLevel }) => {
    const route = createCountermeasureRoute({
      cellId,
      threatType,
      threatLevel,
    });

    set((state) => ({
      routes: [route, ...state.routes].slice(0, 50),
    }));

    useSecurityReplayStore.getState().logEvent({
      domain: 'fabric',
      type: 'countermeasure_queued',
      payload: {
        routeId: route.id,
        cellId,
        threatType,
        threatLevel,
      },
    });

    return route;
  },

  dispatchRoute: (routeId) => {
    set((state) => {
      const nextRoutes = state.routes.map((route) =>
        route.id === routeId ? { ...route, status: 'dispatched' as const } : route
      );
      const target = nextRoutes.find((route) => route.id === routeId);
      
      if (target) {
        useDefenseDistrictStore.getState().reinforceCell(
          target.cellId,
          target.assignedAgents,
          [target.primaryClass, ...target.supportClasses]
        );

        useSecurityReplayStore.getState().logEvent({
          domain: 'fabric',
          type: 'countermeasure_dispatched',
          payload: {
            routeId: target.id,
            primaryClass: target.primaryClass,
            assignedAgents: target.assignedAgents,
          },
        });
      }
      return { routes: nextRoutes };
    });
  },

  resolveRoute: (routeId, note) => {
    set((state) => ({
      routes: state.routes.map((route) =>
        route.id === routeId
          ? {
              ...route,
              status: 'resolved' as const,
              notes: note ? [...route.notes, note] : route.notes,
            }
          : route
      ),
    }));
  },

  failRoute: (routeId, note) => {
    set((state) => {
      const nextRoutes = state.routes.map((route) =>
        route.id === routeId
          ? {
              ...route,
              status: 'failed' as const,
              notes: note ? [...route.notes, note] : route.notes,
            }
          : route
      );
      const route = nextRoutes.find((r) => r.id === routeId);
      if (route) {
        useMetaOversightStore.getState().triggerAlert({
          severity: route.threatLevel === 'critical' ? 'critical' : 'high',
          source: 'countermeasure-router',
          message: `Route ${route.id} failed for cell ${route.cellId}.`,
        });
      }
      return { routes: nextRoutes };
    });
  },

  autoRouteBreaches: () => {
    const defense = useDefenseDistrictStore.getState();
    const breachCells = defense.cells.filter((cell) => cell.status === 'breach' || cell.status === 'alert');

    const created: CountermeasureRoute[] = [];

    for (const cell of breachCells) {
      const existingOpen = get().routes.find(
        (route) =>
          route.cellId === cell.id &&
          ['queued', 'dispatched', 'active'].includes(route.status)
      );

      if (existingOpen) continue;

      const route = get().queueRoute({
        cellId: cell.id,
        threatType: 'breach',
        threatLevel: breachCells.length >= 6 ? 'critical' : breachCells.length >= 3 ? 'high' : 'medium',
      });

      created.push(route);
    }

    for (const route of created) {
      get().dispatchRoute(route.id);
    }

    return created;
  },
}));
