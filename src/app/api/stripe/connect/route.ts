import { NextRequest, NextResponse } from 'next/server';
import { createConnectAccount, createConnectAccountLink } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { email, country = 'US' } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Create a Connect account
    const account = await createConnectAccount(email, country);

    // Create an account link for onboarding
    const accountLink = await createConnectAccountLink(
      account.id,
      `${process.env.NEXTAUTH_URL}/dashboard?refresh=true`,
      `${process.env.NEXTAUTH_URL}/dashboard?success=true`
    );

    return NextResponse.json({
      accountId: account.id,
      accountLink: accountLink.url,
    });
  } catch (error) {
    console.error('Stripe Connect error:', error);
    return NextResponse.json(
      { error: 'Failed to create Connect account' },
      { status: 500 }
    );
  }
} 