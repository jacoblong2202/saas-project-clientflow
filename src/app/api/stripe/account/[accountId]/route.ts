import { NextRequest, NextResponse } from 'next/server';
import { getConnectAccount, getAccountBalance } from '@/lib/stripe';

export async function GET(
  request: NextRequest,
  { params }: { params: { accountId: string } }
) {
  try {
    const { accountId } = params;

    if (!accountId) {
      return NextResponse.json({ error: 'Account ID is required' }, { status: 400 });
    }

    // Get account details
    const account = await getConnectAccount(accountId);
    
    // Get account balance
    const balance = await getAccountBalance(accountId);

    return NextResponse.json({
      account,
      balance,
    });
  } catch (error) {
    console.error('Stripe account error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch account data' },
      { status: 500 }
    );
  }
} 