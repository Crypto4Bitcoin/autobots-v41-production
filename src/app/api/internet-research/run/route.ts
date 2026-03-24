import { NextResponse } from 'next/server';
import {
  composeMarketPostPack,
  createMarketPack,
  gatherInternetAssets,
  verifyResearchAssets,
} from '@/lib/research/internetResearchPipeline';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = String(body.query ?? '');

    if (!query) {
      return NextResponse.json(
        { ok: false, message: 'Missing query.' },
        { status: 400 }
      );
    }

    const assets = await gatherInternetAssets(query);
    const verified = await verifyResearchAssets(assets);
    const composedPack = await composeMarketPostPack(query, verified);
    const marketPack = await createMarketPack(query, composedPack, verified.length);

    return NextResponse.json({
      ok: true,
      query,
      assets: verified,
      composedPack,
      marketPack,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : 'Internet research route failed.',
      },
      { status: 500 }
    );
  }
}
