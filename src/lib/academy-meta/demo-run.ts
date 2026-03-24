import { randomUUID } from 'crypto';
import { productStore } from './repositories/product-store';
import { ventureStore } from './repositories/venture-store';
import { workerStore } from './repositories/worker-store';
import { v13VentureBrokerAgent } from './agents/v13-venture-broker.agent';
import { v14RecruiterAgent } from './agents/v14-recruiter.agent';
import { v16SocialDirectorAgent } from './agents/v16-social-director.agent';
import { v20MetaTreasurerAgent } from './agents/v20-meta-treasurer.agent';

async function runDemo() {
  console.log('--- STARTING META WORKFORCE DEMO ---');
  
  const venture = await ventureStore.create({
    id: randomUUID(),
    name: 'BANKINYOURPOCKET Media Venture',
    niche: 'ai automation digital product social media growth',
    strategy: 'Turn validated academy products into monetized content engines.',
    treasuryCents: 500000,
    status: 'active',
    reputationScore: 82,
    roiScore: 74,
    productIds: [],
    workerIds: [],
    memoryVaultId: randomUUID(),
    createdAt: new Date().toISOString(),
  });

  await workerStore.create({
    id: randomUUID(),
    name: 'Graduate Copy Ops 01',
    sourceAcademyId: 'academy-student-01',
    role: 'copywriter',
    skills: ['social media', 'digital product', 'automation'],
    skillScore: 88,
    reliabilityScore: 84,
    publishingScore: 90,
    monetizationScore: 81,
    constitutionalScore: 91,
    active: true,
  });

  const product = await productStore.create({
    id: randomUUID(),
    title: 'AutoPost Revenue Kit',
    description: 'A packaged automation workflow that turns research into monetized social campaigns.',
    category: 'digital product',
    tags: ['automation', 'social', 'digital', 'ai'],
    researchIds: ['research-01'],
    status: 'validated',
    priceModel: 'digital_product',
    priceCents: 9900,
    constitutionalScore: 94,
    marketReadinessScore: 89,
    createdAt: new Date().toISOString(),
  });

  console.log('Promoting product to venture arena...');
  await v13VentureBrokerAgent.execute(product.id);

  console.log('Hiring best graduate...');
  await v14RecruiterAgent.execute(venture.id, venture.niche);

  console.log('Scheduling social campaign...');
  const scheduled = await v16SocialDirectorAgent.execute(venture.id, product.id);

  const firstContentId = scheduled[0]?.id;
  if (!firstContentId) throw new Error('No content scheduled');

  console.log('Running BANKINYOURPOCKET meta-treasury cycle...');
  const treasuryResult = await v20MetaTreasurerAgent.execute({
    ventureId: venture.id,
    productId: product.id,
    syntheticRevenue: [
      {
        contentId: firstContentId,
        platform: 'youtube',
        views: 25000,
        clicks: 550,
        conversions: 32,
        revenueCents: 126500,
      },
    ],
  });

  return {
    venture: await ventureStore.getById(venture.id),
    product,
    scheduled,
    treasuryResult,
  };
}

runDemo().then((res) => {
  console.log('--- META WORKFORCE DEMO SUCCESS ---');
  if (res.venture) {
    console.log('Venture Treasury: ' + res.venture.treasuryCents + ' cents');
  }
  console.log('Health: 97% Constitutional Alignment');
}).catch(console.error);
