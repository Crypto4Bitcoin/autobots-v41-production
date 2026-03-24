import { DESTINATION_MAP, Destination } from '../constants/destination-map.registry';

export class NavigationCompletionService {
  /**
   * Resolves a destination path or action.
   * Provides a fallback for intentional "Coming Soon" features.
   */
  static resolve(id: string): Destination {
    return DESTINATION_MAP[id] || {
      path: '#',
      label: 'Feature Unavailable',
      status: 'coming_soon',
      fallbackMessage: "We're still tuning this engine. This feature will be available in the next sector update."
    };
  }

  /**
   * Performs a virtual scan of all registered routes.
   */
  static validateAll(): { id: string; ok: boolean; error?: string }[] {
    return Object.entries(DESTINATION_MAP).map(([id, dest]) => {
      if (!dest.path || dest.path === '#') {
        return { id, ok: false, error: 'Incomplete destination' };
      }
      return { id, ok: true };
    });
  }
}
