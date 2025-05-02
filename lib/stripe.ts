import Stripe from 'stripe';

// Use the provided Stripe secret key for test mode
const STRIPE_SECRET_KEY = 'sk_test_UHIrSchMy65wCHMMI5vUG7Wm00glpvGynv';
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_r1S7zTWUNFkmqzGEky6RSBxC002GJ9krGm';

// Make sure we're in test mode
const IS_TEST_MODE = true;

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil', // Updated to the latest API version as of May 2025
});

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: [
      '3 AI interviews per month',
      'Basic feedback',
      'Limited question types',
    ],
    stripePriceId: '',
    maxInterviews: 3,
  },
  PRO: {
    name: 'Pro',
    price: 19.99,
    features: [
      'Unlimited AI interviews',
      'Detailed feedback and analytics',
      'All question types',
      'Custom interview scenarios',
      'Priority support',
    ],
    stripePriceId: 'price_1RKQKYDYQwQyH52AU3XqkwNd', // Pro plan price ID
    maxInterviews: Infinity,
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 49.99,
    features: [
      'Everything in Pro',
      'Team management',
      'Custom branding',
      'Advanced analytics',
      'Dedicated account manager',
    ],
    stripePriceId: 'price_1RKQLTDYQwQyH52AUhTJjGh7', // Enterprise plan price ID
    maxInterviews: Infinity,
  },
};

export type PlanType = keyof typeof PLANS;

export async function createCheckoutSession(
  userId: string,
  planId: PlanType,
  returnUrl: string,
  userEmail?: string
) {
  const plan = PLANS[planId];
  
  if (!plan.stripePriceId) {
    throw new Error(`No Stripe Price ID found for plan: ${planId}`);
  }

  // Log the information for debugging
  console.log(`Creating checkout session for plan: ${planId}, price ID: ${plan.stripePriceId}`);
  
  // Create the checkout session with additional parameters for test mode
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.stripePriceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${returnUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${returnUrl}/billing?canceled=true`,
    metadata: {
      userId,
      planId,
    },
    // Use provided email or fallback to test email
    customer_email: userEmail || 'thulanirex@gmail.com',
  });

  return session;
}

export async function createPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/settings`,
  });

  return session;
}

export async function getSubscriptionStatus(userId: string) {
  // This is a placeholder - in a real implementation, you would query your database
  // to get the Stripe customer ID for this user, then use the Stripe API to get
  // their subscription status
  return {
    isActive: false,
    plan: 'FREE' as PlanType,
    endDate: null,
    startDate: null,
  };
}
