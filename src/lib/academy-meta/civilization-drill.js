
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { randomUUID } = require('crypto');

// MOCKED STORES FOR CIVILIZATION SCALE VERIFICATION
const ventureStore = {
    ventures: [],
    create: async (v) => { ventureStore.ventures.push(v); return v; },
    getById: async (id) => ventureStore.ventures.find(v => v.id === id)
};

const workerStore = {
    workers: [],
    create: async (w) => { workerStore.workers.push(w); return w; },
    listByVenture: async (vid) => workerStore.workers.filter(w => w.ventureId === vid)
};

const civicStore = {
    appeals: [],
    disclosures: [],
    explanations: [],
    createAppeal: async (a) => { civicStore.appeals.push(a); return a; },
    createDisclosure: async (d) => { civicStore.disclosures.push(d); return d; },
    createExplanation: async (e) => { civicStore.explanations.push(e); return e; }
};

const marketIntelStore = {
    signals: [],
    forecasts: [],
    createSignal: async (s) => { marketIntelStore.signals.push(s); return s; },
    listSignalsByNiche: async (n) => marketIntelStore.signals.filter(s => s.niche === n),
    createForecast: async (f) => { marketIntelStore.forecasts.push(f); return f; }
};

const treatyStore = {
    treaties: [],
    create: async (t) => { treatyStore.treaties.push(t); return t; },
    getById: async (id) => treatyStore.treaties.find(t => t.id === id),
    update: async (id, p) => {
        const t = treatyStore.treaties.find(x => x.id === id);
        if (t) Object.assign(t, p, { updatedAt: new Date().toISOString() });
        return t;
    }
};

const continuityStore = {
    successors: [],
    snapshots: [],
    createSuccessor: async (s) => { continuityStore.successors.push(s); return s; },
    createSnapshot: async (s) => { continuityStore.snapshots.push(s); return s; }
};

const civilizationExchangeStore = {
    nodes: [],
    listings: [],
    trades: [],
    createNode: async (n) => { civilizationExchangeStore.nodes.push(n); return n; },
    getNodeByCivilization: async (id) => civilizationExchangeStore.nodes.find(n => n.civilizationId === id),
    createListing: async (l) => { civilizationExchangeStore.listings.push(l); return l; },
    getListing: async (id) => civilizationExchangeStore.listings.find(l => l.id === id),
    updateListing: async (id, p) => {
        const l = civilizationExchangeStore.listings.find(x => x.id === id);
        if (l) Object.assign(l, p);
        return l;
    },
    createTrade: async (t) => { civilizationExchangeStore.trades.push(t); return t; }
};

async function runCivilizationDemo() {
    console.log('--- STARTING OMEGA ACADEMY V26-V30 CIVILIZATION DRILL ---');

    console.log('Step 1: Civic Legitimacy (V26)');
    const venture = await ventureStore.create({
        id: randomUUID(),
        name: 'BANKINYOURPOCKET Civic Venture',
        niche: 'automation',
        treasuryCents: 900000,
        reputationScore: 88,
        status: 'active'
    });

    const appeal = await civicStore.createAppeal({
        id: randomUUID(),
        ventureId: venture.id,
        filedBy: 'community',
        title: 'Transparency Appeal',
        status: 'filed',
        createdAt: new Date().toISOString()
    });
    console.log('Civic appeal filed: ' + appeal.title);

    const disclosure = await civicStore.createDisclosure({
        id: randomUUID(),
        ventureId: venture.id,
        title: venture.name + ' trust disclosure',
        constitutionalScore: 98,
        publishedAt: new Date().toISOString()
    });
    console.log('Trust disclosure published. Score: ' + disclosure.constitutionalScore);

    console.log('Step 2: Synthetic Market Intelligence (V27)');
    await marketIntelStore.createSignal({
        id: randomUUID(),
        niche: 'automation',
        signalType: 'demand',
        score: 84,
        createdAt: new Date().toISOString()
    });
    
    const forecast = await marketIntelStore.createForecast({
        id: randomUUID(),
        ventureId: venture.id,
        demandScore: 84,
        expansionReadinessScore: 78,
        createdAt: new Date().toISOString()
    });
    console.log('Market forecast generated. Readiness: ' + forecast.expansionReadinessScore);

    console.log('Step 3: Autonomous Treaty (V28)');
    const treaty = await treatyStore.create({
        id: randomUUID(),
        originVentureId: venture.id,
        title: 'Distribution Treaty',
        status: 'draft',
        createdAt: new Date().toISOString()
    });
    await treatyStore.update(treaty.id, { status: 'active' });
    console.log('Autonomous treaty activated: ' + treaty.title);

    console.log('Step 4: Continuity & Succession (V29)');
    const worker = await workerStore.create({
        id: randomUUID(),
        ventureId: venture.id,
        name: 'Lead Governor',
        skillScore: 87
    });

    const successor = await continuityStore.createSuccessor({
        id: randomUUID(),
        ventureId: venture.id,
        workerId: worker.id,
        readinessScore: 85,
        createdAt: new Date().toISOString()
    });
    console.log('Successor assessed. Readiness: ' + successor.readinessScore);

    const snapshot = await continuityStore.createSnapshot({
        id: randomUUID(),
        ventureId: venture.id,
        status: 'healthy',
        createdAt: new Date().toISOString()
    });
    console.log('Continuity snapshot secured: ' + snapshot.status);

    console.log('Step 5: Civilization Exchange (V30)');
    const civAlpha = await civilizationExchangeStore.createNode({
        civilizationId: 'civ-alpha',
        name: 'Alpha Civilization',
        treasuryCents: 1400000,
        trustScore: 90
    });
    const civBeta = await civilizationExchangeStore.createNode({
        civilizationId: 'civ-beta',
        name: 'Beta Civilization',
        treasuryCents: 1000000,
        trustScore: 87
    });

    const listing = await civilizationExchangeStore.createListing({
        id: randomUUID(),
        civilizationId: 'civ-alpha',
        assetType: 'distribution',
        priceCents: 15000,
        quantity: 20
    });
    console.log('Asset listed on Civilization Exchange: ' + (listing?.assetType || 'distribution'));

    const trade = await civilizationExchangeStore.createTrade({
        id: randomUUID(),
        buyerCivilizationId: 'civ-beta',
        sellerCivilizationId: 'civ-alpha',
        totalPriceCents: 15000 * 4,
        createdAt: new Date().toISOString()
    });

    civBeta.treasuryCents -= trade.totalPriceCents;
    civAlpha.treasuryCents += trade.totalPriceCents;
    await civilizationExchangeStore.updateListing(listing.id, { quantity: 16 });

    console.log('Civilization trade executed. Beta Treasury: ' + civBeta.treasuryCents);

    console.log('--- CIVILIZATION DRILL SUCCESS ---');
    process.exit(0);
}

runCivilizationDemo().catch(err => {
    console.error(err);
    process.exit(1);
});
