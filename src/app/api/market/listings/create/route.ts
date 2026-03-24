import { NextResponse } from 'next/server';
import { createForSaleListing } from '@/lib/autobots-market';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const listing = createForSaleListing({
      assetId: body.assetId,
      title: body.title || 'For Sale Listing',
      sellerAgentId: body.sellerAgentId || null,
      marketerAgentId: body.marketerAgentId || null,
      price: Number(body.price ?? 10),
      moneyType: body.moneyType || 'USD',
      featured: Boolean(body.featured ?? false),
    });

    if (!listing) {
      return NextResponse.json(
        { ok: false, message: 'Asset not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      listing,
    });
  } catch (error) {
    console.error('listing create error', error);

    return NextResponse.json(
      { ok: false, message: 'Failed to create listing.' },
      { status: 500 }
    );
  }
}
