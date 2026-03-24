// eslint-disable-next-line @typescript-eslint/no-require-imports
const { UnifiedReliabilityLoopService } = require('../lib/services/unified-reliability-loop.service');

async function runSimulation() {
  console.log('--- STARTING E2E UNIFIED RELIABILITY LOOP SIMULATION (JS) ---');
  
  const mockSignal = {
    type: 'web_error',
    error_code: '404',
    message: 'Global Console sidebar link broken',
    trace_id: 'trace-unique-123',
    source: 'SentinelAgent'
  };

  try {
    console.log('[Simulation] Injecting failure signal...');
    await UnifiedReliabilityLoopService.processSignal(mockSignal);
    console.log('--- SIMULATION FINISHED SUCCESS ---');
  } catch (err) {
    console.error('--- SIMULATION FAILED ---', err);
  }
}

runSimulation();
