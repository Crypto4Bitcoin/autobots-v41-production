import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ ok: true, source: 'stub' });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ ok: true, received: body });
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return NextResponse.json({ ok: true });
  }
}
