export interface StrategicPattern {
  id: string;
  workspaceId: string;
  triggerEvent: string;
  successfulResponse: string;
  confidence: number;
}

export class PatternLibraryService {
  private static patterns: Map<string, StrategicPattern[]> = new Map();

  /**
   * Stores validated recurring patterns.
   */
  static async storePattern(pattern: Omit<StrategicPattern, 'id'>) {
    const fullPattern: StrategicPattern = {
      ...pattern,
      id: `pat_${Math.random().toString(36).substr(2, 9)}`
    };

    const workspacePatterns = this.patterns.get(pattern.workspaceId) || [];
    workspacePatterns.push(fullPattern);
    this.patterns.set(pattern.workspaceId, workspacePatterns);
    
    console.log(`[PatternLibrary] Stored strategic pattern for workspace ${pattern.workspaceId}: ${pattern.triggerEvent}`);
  }

  static getPatterns(workspaceId: string): StrategicPattern[] {
    return this.patterns.get(workspaceId) || [];
  }
}

