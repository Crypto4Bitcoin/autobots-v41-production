
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { randomUUID } = require('crypto');

// MOCKED REPOS
const territoryRepo = {
  items: [],
  create: async t => { territoryRepo.items.push(t); return t; },
  list: async () => territoryRepo.items,
  getById: async id => territoryRepo.items.find(x => x.id === id) || null,
  update: async (id, p) => {
    const t = territoryRepo.items.find(x => x.id === id);
    if (!t) return null;
    Object.assign(t, p, { updatedAt: new Date().toISOString() });
    return t;
  }
};

const influenceRepo = {
  items: [],
  create: async e => { influenceRepo.items.push(e); return e; },
  listByTerritory: async id => influenceRepo.items.filter(x => x.territoryId === id)
};

const conflictRepo = {
  items: [],
  create: async c => { conflictRepo.items.push(c); return c; }
};

// SERVICE LOGIC
const territoryService = {
  createTerritory: async input => {
    const t = {
      id: randomUUID(),
      ...input,
      state: 'forming',
      influenceScore: 0,
      marketReachScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return territoryRepo.create(t);
  },
  recordInfluence: async input => {
    const event = await influenceRepo.create({
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    });

    const territory = await territoryRepo.getById(input.territoryId);
    if (!territory) return event;

    const nextInfluence = territory.influenceScore + input.engagementScore;

    let state = territory.state;
    if (nextInfluence > 500) state = 'dominant';
    else if (nextInfluence > 200) state = 'active';

    await territoryRepo.update(territory.id, {
      influenceScore: nextInfluence,
      state,
    });

    return event;
  },
  createConflict: async (a, b, reason) => {
    return conflictRepo.create({
      id: randomUUID(),
      territoryA: a,
      territoryB: b,
      reason,
      createdAt: new Date().toISOString(),
    });
  },
  metrics: async () => {
    const list = await territoryRepo.list();
    let top = null;
    for (const t of list) {
      if (!top || t.influenceScore > top.influenceScore) top = t;
    }
    return {
      totalTerritories: list.length,
      dominantTerritories: list.filter(t => t.state === 'dominant').length,
      contestedTerritories: list.filter(t => t.state === 'contested').length,
      topTerritory: top ? top.title : null,
    };
  }
};

async function runDrill() {
  console.log('--- STARTING V38 NARRATIVE TERRITORY DRILL ---');

  // 1. Create Territory
  const t1 = await territoryService.createTerritory({
    title: 'HVAC Narrative Sovereignty',
    skillTrack: 'HVAC',
    narrativeTheme: 'Precision Maintenance',
    cellIds: [randomUUID()]
  });
  console.log('Territory created: ' + t1.title + ' (State: ' + t1.state + ')');

  // 2. Record Influence (Move to Active)
  await territoryService.recordInfluence({
    territoryId: t1.id,
    cellId: t1.cellIds[0],
    artifactId: randomUUID(),
    platform: 'facebook',
    engagementScore: 250
  });
  const t1Active = await territoryRepo.getById(t1.id);
  console.log('Influence recorded. New State: ' + t1Active.state + ' (Score: ' + t1Active.influenceScore + ')');

  // 3. Record More Influence (Move to Dominant)
  await territoryService.recordInfluence({
    territoryId: t1.id,
    cellId: t1.cellIds[0],
    artifactId: randomUUID(),
    platform: 'youtube',
    engagementScore: 300
  });
  const t1Dominant = await territoryRepo.getById(t1.id);
  console.log('Influence recorded. New State: ' + t1Dominant.state + ' (Score: ' + t1Dominant.influenceScore + ')');

  // 4. Create Competition and Conflict
  const t2 = await territoryService.createTerritory({
    title: 'HVAC Efficiency Narrative',
    skillTrack: 'HVAC',
    narrativeTheme: 'Energy Savings',
    cellIds: [randomUUID()]
  });
  console.log('Competing Territory created: ' + t2.title);

  const conflict = await territoryService.createConflict(t1.id, t2.id, 'Narrative overlap in energy savings sector.');
  console.log('Conflict recorded: ' + conflict.reason);

  // 5. Final Metrics
  const metrics = await territoryService.metrics();
  console.log('Final Territory Metrics:', JSON.stringify(metrics, null, 2));

  console.log('--- V38 NARRATIVE TERRITORY DRILL SUCCESS ---');
  process.exit(0);
}

runDrill().catch(err => { console.error(err); process.exit(1); });
