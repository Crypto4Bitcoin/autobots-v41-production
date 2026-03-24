export interface ContextReference {
  id: string;
  type: 'workflow' | 'artifact' | 'node';
  title?: string;
  timestamp: string;
}

export class ConversationContextService {
  private static recentReferences: ContextReference[] = [];
  private static sessionFocus: ContextReference | null = null;

  /**
   * Records a reference to an object in the current session.
   */
  static recordReference(ref: ContextReference) {
    this.recentReferences.unshift(ref);
    if (this.recentReferences.length > 10) this.recentReferences.pop();
    this.sessionFocus = ref;
  }

  /**
   * Resolves a contextual reference (e.g., "the second one").
   */
  static resolveOrdinalReference(indexStr: string): ContextReference | null {
    if (indexStr === "index_last") return this.recentReferences[0] || null;
    
    // Ordinals are 1-based in speech: "first" = index 0.
    const match = indexStr.match(/index_(\d+)/);
    if (match) {
      const idx = parseInt(match[1]) - 1;
      return this.recentReferences[idx] || null;
    }
    
    return null;
  }

  /**
   * Gets the current active focus of the conversation.
   */
  static getActiveFocus(): ContextReference | null {
    return this.sessionFocus;
  }

  /**
   * Seeds some mock context for Phase 11.5 verification.
   */
  static seedMockContext() {
    this.recentReferences = [
      { id: "wf-1", type: "workflow", title: "Media Brief v1", timestamp: new Date().toISOString() },
      { id: "wf-2", type: "workflow", title: "Social Content DAG", timestamp: new Date().toISOString() },
      { id: "art-1", type: "artifact", title: "Today's Video.mp4", timestamp: new Date().toISOString() }
    ];
    this.sessionFocus = this.recentReferences[0];
  }
}
