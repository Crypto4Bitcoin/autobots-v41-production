import { randomUUID } from 'crypto';
import {
  civilizationExchangeStore,
  memoryStoreV30,
  ventureStoreV30,
  workerStoreV30,
} from './repositories/v26-v30-repositories';
import {
  v26CivicLegitimacyAgent,
  v27SyntheticMarketIntelligenceAgent,
  v28AutonomousTreatyAgent,
  v29ContinuitySuccessionAgent,
  v30CivilizationExchangeAgent,
} from './agents/v26-v30-agents';

async function runV30Demo() {
  const ventureA = await ventureStoreV30.create({
    id: randomUUID(),
    name: 'BANKINYOURPOCKET Civic Venture',
    niche: 'automation audience media monetization',
    strategy: 'Legitimate growth with public trust.',
    treasuryCents: 900000,
    status: 'active',
    reputationScore: 88,
    roiScore: 82,
    productIds: ['product-1', 'product-2'],
    workerIds: [],
    memoryVaultId: randomUUID(),
    createdAt: new Date().toISOString(),
  });

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ventureB = await ventureStoreV30.create({
    id: randomUUID(),
    name: 'BANKINYOURPOCKET Exchange Venture',
    niche: 'automation audience media monetization',
    strategy: 'Trade trust and distribution across sovereign networks.',
    treasuryCents: 1250000,
    status: 'active',
    reputationScore: 91,
    roiScore: 86,
    productIds: ['product-3'],
    workerIds: [],
    memoryVaultId: randomUUID(),
    createdAt: new Date().toISOString(),
  });

  const leader = await workerStoreV30.create({
    id: randomUUID(),
    name: 'Lead Governor',
    sourceAcademyId: 'academy-1',
    role: 'governor',
    ventureId: ventureA.id,
    skills: ['governance', 'operations', 'media'],
    skillScore: 87,
    reliabilityScore: 92,
    publishingScore: 71,
    monetizationScore: 74,
    constitutionalScore: 95,
    active: true,
  });

  const successor = await workerStoreV30.create({
    id: randomUUID(),
    name: 'Deputy Operator',
    sourceAcademyId: 'academy-2',
    role: 'treasurer',
    ventureId: ventureA.id,
    skills: ['treasury', 'operations', 'handover'],
    skillScore: 84,
    reliabilityScore: 88,
    publishingScore: 66,
    monetizationScore: 86,
    constitutionalScore: 94,
    active: true,
  });

  await memoryStoreV30.create({
    id: randomUUID(),
    ventureId: ventureA.id,
    title: 'Civic operating playbook',
    body: 'Appeals, public disclosures, and action explanations.',
    sourceOrigin: 'venture',
    sourceId: ventureA.id,
    tags: ['civic', 'governance'],
    createdAt: new Date().toISOString(),
  });

  const appeal = await v26CivicLegitimacyAgent.fileAppeal({
    ventureId: ventureA.id,
    filedBy: 'community:public-review',
    title: 'Appeal on treasury allocation transparency',
    body: 'Request clearer explanation on budget reallocation.',
    severity: 'medium',
  });

  const explanation = await v26CivicLegitimacyAgent.explainAction({
    ventureId: ventureA.id,
    actionType: 'treasury_rebalance',
    actionId: randomUUID(),
    reason: 'Reserve preservation and continuity planning.',
    policyBasis: ['TRUTH_FIRST', 'SAFE_GROWTH', 'REINVEST_FOR_CONTINUITY'],
  });

  const disclosure = await v26CivicLegitimacyAgent.publishDisclosure(ventureA.id);

  await v27SyntheticMarketIntelligenceAgent.ingestSignal({
    niche: ventureA.niche,
    signalType: 'demand',
    label: 'Search demand rising',
    score: 84,
    direction: 'up',
    notes: 'Interest rising across automation and monetization niches.',
  });

  await v27SyntheticMarketIntelligenceAgent.ingestSignal({
    niche: ventureA.niche,
    signalType: 'pricing',
    label: 'Pricing pressure moderate',
    score: 43,
    direction: 'stable',
    notes: 'Competitive pricing is manageable.',
  });

  await v27SyntheticMarketIntelligenceAgent.ingestSignal({
    niche: ventureA.niche,
    signalType: 'competition',
    label: 'Competitor motion increasing',
    score: 58,
    direction: 'up',
    notes: 'Rivals are entering adjacent content automation lanes.',
  });

  await v27SyntheticMarketIntelligenceAgent.ingestSignal({
    niche: ventureA.niche,
    signalType: 'narrative',
    label: 'Narrative timing favorable',
    score: 79,
    direction: 'up',
    notes: 'Public appetite for self-sustaining systems is rising.',
  });

  const forecast = await v27SyntheticMarketIntelligenceAgent.buildForecast(ventureA.id);

  const treaty = await v28AutonomousTreatyAgent.draftTreaty({
    originVentureId: ventureA.id,
    counterpartType: 'platform',
    counterpartId: 'platform:distribution-hub-01',
    title: 'Distribution access treaty',
    terms: [
      'Shared distribution without asset theft',
      'Revenue reporting every 24 hours',
      'Pause treaty on trust breach',
    ],
    trustThreshold: 80,
    treasuryCommitmentCents: 150000,
  });

  const activeTreaty = await v28AutonomousTreatyAgent.activateTreaty(treaty.id);

  const successors = await v29ContinuitySuccessionAgent.assessSuccessors(ventureA.id);
  const snapshot = await v29ContinuitySuccessionAgent.createSnapshot({
    ventureId: ventureA.id,
    leaderWorkerId: leader.id,
    successorWorkerId: successor.id,
  });

  const handover = await v29ContinuitySuccessionAgent.executeHandover({
    ventureId: ventureA.id,
    successorWorkerId: successor.id,
  });

  const civA = await v30CivilizationExchangeAgent.registerNode({
    civilizationId: 'civ-alpha',
    name: 'Alpha Civilization',
    treasuryCents: 1400000,
    trustScore: 90,
    audienceCount: 25000,
  });

  const civB = await v30CivilizationExchangeAgent.registerNode({
    civilizationId: 'civ-beta',
    name: 'Beta Civilization',
    treasuryCents: 1000000,
    trustScore: 87,
    audienceCount: 18000,
  });

  const listing = await v30CivilizationExchangeAgent.listAsset({
    civilizationId: 'civ-alpha',
    ventureId: ventureA.id,
    assetType: 'distribution',
    title: 'Premium distribution lanes',
    quantity: 20,
    priceCents: 15000,
    reputationRequirement: 80,
  });

  const trade = await v30CivilizationExchangeAgent.executeTrade({
    buyerCivilizationId: 'civ-beta',
    sellerCivilizationId: 'civ-alpha',
    listingId: listing.id,
    quantity: 4,
  });

  return {
    appeal,
    explanation,
    disclosure,
    forecast,
    treaty,
    activeTreaty,
    successors,
    snapshot,
    handover,
    civA,
    civB,
    listing,
    trade,
    exchangeState: {
      nodes: await civilizationExchangeStore.listNodes(),
      listings: await civilizationExchangeStore.listListings(),
      trades: await civilizationExchangeStore.listTrades(),
    },
  };
}

runV30Demo()
  .then((result) => {
    console.log(JSON.stringify(result, null, 2));
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
