export interface ValidationResult {
  path: string;
  status: 'ok' | 'error' | 'warning';
  message?: string;
  timestamp: string;
}

export class FrontendValidationService {
  private static pathsToCheck = [
    '/',
    '/dashboard',
    '/dashboard/instant',
    '/dashboard/results',
    '/workers',
    '/builder',
    '/marketplace',
    '/briefings'
  ];

  static async scanAllRoutes(): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    for (const path of this.pathsToCheck) {
      try {
        const response = await fetch(path, { method: 'HEAD' });
        if (response.ok) {
          results.push({
            path,
            status: 'ok',
            timestamp: new Date().toISOString()
          });
        } else {
          results.push({
            path,
            status: 'error',
            message: `HTTP ${response.status}`,
            timestamp: new Date().toISOString()
          });
        }
      } catch (e: unknown) {
        results.push({
          path,
          status: 'error',
          message: e.message || String(e),
          timestamp: new Date().toISOString()
        });
      }
    }
    
    return results;
  }
}
