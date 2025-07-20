import Stripe from 'stripe';

// Initialize Stripe with your secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Connect configuration
export const STRIPE_CONNECT_CLIENT_ID = process.env.STRIPE_CONNECT_CLIENT_ID!;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY!;

// Helper function to create Connect account links
export async function createConnectAccountLink(accountId: string, refreshUrl: string, returnUrl: string) {
  return await stripe.accountLinks.create({
    account: accountId,
    refresh_url: refreshUrl,
    return_url: returnUrl,
    type: 'account_onboarding',
  });
}

// Helper function to create Connect accounts
export async function createConnectAccount(email: string, country: string = 'US') {
  return await stripe.accounts.create({
    type: 'express',
    country,
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });
}

// Helper function to get account details
export async function getConnectAccount(accountId: string) {
  return await stripe.accounts.retrieve(accountId);
}

// Helper function to get account balance
export async function getAccountBalance(accountId: string) {
  return await stripe.balance.retrieve({
    stripeAccount: accountId,
  });
} 