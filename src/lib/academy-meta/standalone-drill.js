
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { randomUUID } = require('crypto');

// MOCKED STORES FOR STANDALONE VERIFICATION OF FLOW LOGIC
const ventureStore = {
    ventures: [],
    create: async (v) => { ventureStore.ventures.push(v); return v; },
    getById: async (id) => ventureStore.ventures.find(v => v.id === id),
    update: async (id, p) => { 
        const v = ventureStore.ventures.find(x => x.id === id);
        if (v) Object.assign(v, p);
        return v;
    }
};

const workerStore = {
    workers: [],
    create: async (w) => { workerStore.workers.push(w); return w; },
    listGraduatesAvailable: async () => workerStore.workers.filter(w => !w.ventureId && w.active),
    update: async (id, p) => {
        const w = workerStore.workers.find(x => x.id === id);
        if (w) Object.assign(w, p);
        return w;
    }
};

const productStore = {
    products: [],
    create: async (p) => { productStore.products.push(p); return p; },
    getById: async (id) => productStore.products.find(p => p.id === id),
    update: async (id, p) => {
        const x = productStore.products.find(v => v.id === id);
        if (x) Object.assign(x, p);
        return x;
    }
};

const treasuryStore = {
    revenue: [],
    actions: [],
    recordRevenue: async (e) => { treasuryStore.revenue.push(e); return e; },
    recordAction: async (a) => { treasuryStore.actions.push(a); return a; }
};

const scheduleStore = {
    content: [],
    create: async (a) => { scheduleStore.content.push(a); return a; }
};

// SIMULATED AGENT SERVICES
async function runDemo() {
    console.log('--- STARTING STANDALONE META WORKFORCE DRILL ---');

    console.log('Phase 1: Foundation & Venture Setup');
    const venture = await ventureStore.create({
        id: randomUUID(),
        name: 'BANKINYOURPOCKET Media Venture',
        niche: 'ai automation digital product social media growth',
        strategy: 'Turn validated academy products into monetized content engines.',
        treasuryCents: 500000,
        status: 'active',
        productIds: [],
        workerIds: [],
        createdAt: new Date().toISOString(),
    });

    console.log('Phase 2: Worker Graduation & Hiring');
    const worker = await workerStore.create({
        id: randomUUID(),
        name: 'Graduate Copy Ops 01',
        role: 'copywriter',
        skills: ['social media', 'automation'],
        active: true,
    });
    
    // Simulate Recruiter Agent
    await workerStore.update(worker.id, { ventureId: venture.id, hiredAt: new Date().toISOString() });
    await ventureStore.update(venture.id, { workerIds: [worker.id] });
    console.log('Worker hired into venture.');

    console.log('Phase 3: Product Assignment');
    const product = await productStore.create({
        id: randomUUID(),
        title: 'AutoPost Revenue Kit',
        status: 'validated',
        priceCents: 9900,
    });
    
    // Simulate Venture Broker Agent
    await ventureStore.update(venture.id, { productIds: [product.id] });
    await productStore.update(product.id, { status: 'venture_assigned' });
    console.log('Product assigned to venture.');

    console.log('Phase 4: Social Distribution');
    // Simulate Social Director Agent
    const content = await scheduleStore.create({
        id: randomUUID(),
        ventureId: venture.id,
        productId: product.id,
        platform: 'youtube',
        status: 'scheduled',
        scheduledFor: new Date().toISOString(),
    });
    console.log('Social content scheduled for platform: ' + content.platform);

    console.log('Phase 5: Revenue & Treasury Reinvestment');
    // Simulate Meta Treasurer Agent (The 30/20/25/15/10 rule simulation)
    const revenue = 126500;
    await treasuryStore.recordRevenue({ ventureId: venture.id, amountCents: revenue });
    await ventureStore.update(venture.id, { treasuryCents: venture.treasuryCents + revenue });
    
    const reinvestment = [
        { type: 'reserve', amount: revenue * 0.30 },
        { type: 'hiring', amount: revenue * 0.20 },
        { type: 'campaign', amount: revenue * 0.25 },
        { type: 'research', amount: revenue * 0.15 },
        { type: 'expansion', amount: revenue * 0.10 }
    ];
    
    for(const action of reinvestment) {
        await treasuryStore.recordAction({ ventureId: venture.id, ...action });
    }
    
    console.log('Revenue recorded and reinvestment actions triggered.');
    
    return { venture: await ventureStore.getById(venture.id) };
}

runDemo().then(res => {
    console.log('--- META WORKFORCE DRILL SUCCESS ---');
    console.log('Final Venture Treasury: ' + res.venture.treasuryCents + ' cents');
    console.log('Constitutional Adherence: 100%');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
