import { NextResponse } from 'next/server';
import {
  createAgentArtProduct,
  createVehiclePlaceholder,
  createRealWorldUpload,
  registerMarketAgent,
  autoposterReleaseNext,
  updateAutoposterControl,
} from '@/lib/autobots-market';

export async function POST() {
  try {
    registerMarketAgent({ agentId: 'AG-FORSALE-001', role: 'forsale' });
    registerMarketAgent({ agentId: 'AG-MARKET-001', role: 'marketer' });
    registerMarketAgent({ agentId: 'AG-ART-001', role: 'artist' });
    registerMarketAgent({ agentId: 'AG-CAR-001', role: 'vehicle-builder' });
    registerMarketAgent({ agentId: 'AG-UPLOAD-001', role: 'uploader' });

    createAgentArtProduct({
      teamId: 'TEAM-ART-001',
      title: 'Neon City Agent Canvas',
      description: 'Collaborative art made by multiple agent teams.',
      sellerAgentId: 'AG-FORSALE-001',
      marketerAgentId: 'AG-MARKET-001',
      price: 45,
    });

    createVehiclePlaceholder({
      creatorId: 'TEAM-CAR-001',
      title: 'Black Market Sedan',
      description: 'Vehicle placeholder using IPFS picture storage.',
    });

    createRealWorldUpload({
      userId: 'REAL-USER-001',
      title: 'Real User Product Upload',
      description: 'A real-world user product sent into IPFS-backed market storage.',
      kind: 'product',
    });

    updateAutoposterControl({
      mode: 'all',
      enabled: true,
    });

    const release = autoposterReleaseNext();

    return NextResponse.json({
      ok: true,
      release,
    });
  } catch (error) {
    console.error('market seed error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to seed market.' },
      { status: 500 }
    );
  }
}
