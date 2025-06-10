import { NextResponse } from 'next/server';
import { getPrices } from '@/lib/crypto-utils';

// This endpoint handles conversion between cryptocurrencies and USD
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const fromCrypto = url.searchParams.get('from');
    const toCrypto = url.searchParams.get('to');
    const amount = url.searchParams.get('amount');

    if (!fromCrypto || !toCrypto || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: from, to, amount' },
        { status: 400 },
      );
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) {
      return NextResponse.json(
        { error: 'Amount must be a valid number' },
        { status: 400 },
      );
    }

    const prices = await getPrices();

    let result: number;
    let rate: number;

    // Converting from USD to crypto
    if (fromCrypto === 'usd' && toCrypto in prices) {
      result = numAmount / prices[toCrypto].usd;
      rate = 1 / prices[toCrypto].usd;
    }
    // Converting from crypto to USD
    else if (toCrypto === 'usd' && fromCrypto in prices) {
      result = numAmount * prices[fromCrypto].usd;
      rate = prices[fromCrypto].usd;
    }
    // Converting between cryptos
    else if (fromCrypto in prices && toCrypto in prices) {
      result = (numAmount * prices[fromCrypto].usd) / prices[toCrypto].usd;
      rate = prices[fromCrypto].usd / prices[toCrypto].usd;
    } else {
      return NextResponse.json(
        { error: 'Invalid cryptocurrency specified' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      from: fromCrypto,
      to: toCrypto,
      amount: numAmount,
      result: result,
      rate: rate,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error converting currencies:', error);
    return NextResponse.json(
      { error: 'Error converting currencies' },
      { status: 500 },
    );
  }
}
