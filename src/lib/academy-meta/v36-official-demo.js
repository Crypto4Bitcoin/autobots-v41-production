
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { randomUUID } = require('crypto');

// MOCKED REPOS
const agentRepo = { 
  items: [], 
  create: async r => { agentRepo.items.push(r); return r; }, 
  getById: async id => agentRepo.items.find(x => x.id === id), 
  update: async (id, p) => { const i = agentRepo.items.find(x => x.id === id); if (i) Object.assign(i, p); return i; },
  list: async () => agentRepo.items
};

const memoryRepo = { 
  items: [], 
  create: async r => { memoryRepo.items.push(r); return r; }, 
  getById: async id => memoryRepo.items.find(x => x.id === id), 
  update: async (id, p) => { const i = memoryRepo.items.find(x => x.id === id); if (i) Object.assign(i, p); return i; },
  list: async () => memoryRepo.items
};

const inheritanceRepo = { items: [], create: async r => { inheritanceRepo.items.push(r); return r; } };

// OFFICIAL AGENT LOGIC
const v36MemoryEcologyAgent = {
  createFromVerifiedOutput: async (input) => {
    const mem = {
      id: randomUUID(),
      ...input,
      verified: true,
      successScore: 70,
      reuseCount: 0,
      promotionState: 'active',
      decayScore: 0,
      createdAt: new Date().toISOString()
    };
    return memoryRepo.create(mem);
  },
  inheritMemory: async (input) => {
    return inheritanceRepo.create({ id: randomUUID(), ...input, inheritedAt: new Date().toISOString() });
  },
  reuseMemory: async (input) => {
    const mem = await memoryRepo.getById(input.memoryId);
    if (!mem) throw new Error('Memory not found');
    await memoryRepo.update(input.memoryId, { 
      reuseCount: mem.reuseCount + 1, 
      successScore: Math.min(100, mem.successScore + 5) 
    });
    const agent = await agentRepo.getById(input.agentId);
    if (agent) {
      await agentRepo.update(input.agentId, { 
        symbolicMoney: agent.symbolicMoney + 10, 
        level: agent.level + 1, 
        memoryRetainedScore: Math.min(100, agent.memoryRetainedScore + 5) 
      });
    }
    return { id: randomUUID(), ...input, timestamp: new Date().toISOString() };
  },
  promote: async () => {
    const mems = await memoryRepo.list();
    const promoted = mems.filter(m => m.reuseCount >= 3 && m.successScore >= 80);
    for (const m of promoted) await memoryRepo.update(m.id, { promotionState: 'core' });
    return promoted.length;
  },
  metrics: async () => {
    const mems = await memoryRepo.list();
    return {
      totalMemoryRecords: mems.length,
      coreMemories: mems.filter(m => m.promotionState === 'core').length,
      activeMemories: mems.filter(m => m.promotionState === 'active').length
    };
  }
};

async function runOfficialDemo() {
  console.log('--- STARTING OFFICIAL V36 MEMORY ECOLOGY DEMO ---');

  const agentA = await agentRepo.create({
    id: randomUUID(),
    name: 'KnowledgeBuilder-HVAC-01',
    level: 5,
    symbolicMoney: 100,
    memoryRetainedScore: 74,
    healthScore: 95,
    taskCount: 30,
  });

  const agentB = await agentRepo.create({
    id: randomUUID(),
    name: 'AutoPoster-HVAC-02',
    level: 3,
    symbolicMoney: 50,
    memoryRetainedScore: 62,
    healthScore: 92,
    taskCount: 12,
  });

  const createdMemory = await v36MemoryEcologyAgent.createFromVerifiedOutput({
    title: 'HVAC spring startup hook pattern',
    body: 'Verified content structure for HVAC spring startup educational posts.',
    sourceAgentId: agentA.id,
    skillTrack: 'HVAC',
    contentBoxId: randomUUID(),
    tags: ['HVAC', 'spring', 'startup'],
  });
  console.log('Memory Created: ' + createdMemory.title);

  await v36MemoryEcologyAgent.inheritMemory({
    targetAgentId: agentB.id,
    memoryId: createdMemory.id,
    influenceScore: 72,
  });
  console.log('Agent B inherited memory.');

  await v36MemoryEcologyAgent.reuseMemory({
    memoryId: createdMemory.id,
    agentId: agentB.id,
    taskType: 'daily_hvac_facebook_post',
    outcome: 'success',
    speedGainPercent: 22,
    qualityGainPercent: 18,
  });

  await v36MemoryEcologyAgent.reuseMemory({
    memoryId: createdMemory.id,
    agentId: agentB.id,
    taskType: 'daily_hvac_youtube_short',
    outcome: 'success',
    speedGainPercent: 20,
    qualityGainPercent: 24,
  });

  await v36MemoryEcologyAgent.reuseMemory({
    memoryId: createdMemory.id,
    agentId: agentA.id,
    taskType: 'hvac_marketplace_conversion_copy',
    outcome: 'success',
    speedGainPercent: 16,
    qualityGainPercent: 20,
  });
  console.log('Memory reused 3 times.');

  const promotedCount = await v36MemoryEcologyAgent.promote();
  console.log('Memories promoted to CORE: ' + promotedCount);

  const stats = await v36MemoryEcologyAgent.metrics();
  console.log('Final Metrics:', JSON.stringify(stats, null, 2));

  const updatedAgentB = await agentRepo.getById(agentB.id);
  console.log('Agent B Level Up: ' + updatedAgentB.level + ' (Was 3)');

  console.log('--- OFFICIAL V36 DEMO SUCCESS ---');
  process.exit(0);
}

runOfficialDemo().catch(err => { console.error(err); process.exit(1); });
