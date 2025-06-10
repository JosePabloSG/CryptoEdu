import { NextResponse } from 'next/server';
import { getPrices } from '@/lib/crypto-utils';

export async function GET() {
  try {
    const prices = await getPrices();
    return NextResponse.json(prices);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching prices' },
      { status: 500 },
    );
  }
}
