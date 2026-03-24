import type { MemoryFragment } from './agent-memory.store';

export class MemoryRelevanceEngine {
  static scoreAndFilter(candidates: MemoryFragment[], query: string): MemoryFragment[] {
    return candidates.map(c => ({...c, relevance: this.calculateRelevance(c, query)})).filter(c => c.relevance > 0.4).sort((a, b) => b.relevance - a.relevance).slice(0, 5);
  }
  private static calculateRelevance(fragment: MemoryFragment, query: string): number {
    const keywords = query.toLowerCase().split(' ');
    const fact = fragment.fact.toLowerCase();
    let score = 0.2;
    keywords.forEach(kw => { if (fact.includes(kw)) score += 0.3; });
    const ageDays = (Date.now() - fragment.timestamp) / (24 * 60 * 60 * 1000);
    const recencyWeight = Math.max(0.5, 1 - (ageDays / 365));
    return Math.min(1.0, score * recencyWeight);
  }
}
