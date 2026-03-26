import { describe, expect, it } from 'vitest';
import { divisions, divisionMap } from '../lib/divisions';
import { buildGridCellCount } from '../lib/scoring';

describe('division registry', () => {
  it('has unique slugs', () => {
    const slugs = divisions.map((item) => item.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('matches the division map size', () => {
    expect(divisionMap.size).toBe(divisions.length);
  });

  it('keeps the 9x9x9 grid count stable', () => {
    expect(buildGridCellCount()).toBe(729);
  });
});
