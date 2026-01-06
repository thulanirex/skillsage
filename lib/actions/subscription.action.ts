import { db } from "@/firebase/admin";
import { stripe, PlanType, PLANS, MINUTES_PER_CREDIT } from "@/lib/stripe";

interface UpdateUserSubscriptionParams {
  userId: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  plan?: PlanType;
  status?: 'active' | 'canceled' | 'incomplete' | 'past_due' | 'trialing' | 'unpaid';
  currentPeriodEnd?: number;
}

export async function updateUserSubscription({
  userId,
  stripeCustomerId,
  stripeSubscriptionId,
  plan = 'FREE',
  status = 'active',
  currentPeriodEnd,
}: UpdateUserSubscriptionParams) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    // Calculate limits based on plan
    const interviewsLimit = PLANS[plan].maxInterviews;
    const creditsLimit = PLANS[plan].monthlyCredits;
    
    // Get current subscription data if it exists
    const userData = userDoc.data();
    const currentInterviewsUsed = userData?.subscription?.interviewsUsed || 0;
    const currentCreditsUsed = userData?.subscription?.creditsUsed || 0;
    const currentMinutesUsed = userData?.subscription?.minutesUsed || 0;

    // Update user subscription data
    await userRef.update({
      subscription: {
        status,
        plan,
        stripeCustomerId: stripeCustomerId || userData?.subscription?.stripeCustomerId,
        stripeSubscriptionId: stripeSubscriptionId || userData?.subscription?.stripeSubscriptionId,
        currentPeriodEnd: currentPeriodEnd || userData?.subscription?.currentPeriodEnd,
        interviewsUsed: currentInterviewsUsed,
        interviewsLimit,
        creditsUsed: currentCreditsUsed,
        creditsLimit,
        minutesUsed: currentMinutesUsed,
        updatedAt: Date.now(),
      }
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating user subscription:', error);
    return { success: false, error };
  }
}

export async function incrementInterviewCount(userId: string) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userData = userDoc.data();
    const currentInterviewsUsed = userData?.subscription?.interviewsUsed || 0;
    const interviewsLimit = userData?.subscription?.interviewsLimit || PLANS.FREE.maxInterviews;
    const plan = userData?.subscription?.plan || 'FREE';

    // Check if user has reached their limit
    if (plan === 'FREE' && currentInterviewsUsed >= interviewsLimit) {
      return { 
        success: false, 
        limitReached: true,
        message: `You've reached your limit of ${interviewsLimit} interviews for the month on the Free plan.`
      };
    }

    // Increment interview count
    await userRef.update({
      'subscription.interviewsUsed': currentInterviewsUsed + 1
    });

    return { 
      success: true, 
      interviewsUsed: currentInterviewsUsed + 1,
      interviewsLimit,
      remainingInterviews: interviewsLimit - (currentInterviewsUsed + 1)
    };
  } catch (error) {
    console.error('Error incrementing interview count:', error);
    return { success: false, error };
  }
}

export async function getUserSubscription(userId: string) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userData = userDoc.data();
    const plan = userData?.subscription?.plan || 'FREE';
    const planConfig = PLANS[plan as keyof typeof PLANS] || PLANS.FREE;
    
    const subscription = {
      status: userData?.subscription?.status || 'active',
      plan,
      interviewsUsed: userData?.subscription?.interviewsUsed || 0,
      interviewsLimit: userData?.subscription?.interviewsLimit || planConfig.maxInterviews,
      creditsUsed: userData?.subscription?.creditsUsed || 0,
      creditsLimit: userData?.subscription?.creditsLimit || planConfig.monthlyCredits,
      minutesUsed: userData?.subscription?.minutesUsed || 0,
      stripeCustomerId: userData?.subscription?.stripeCustomerId,
      stripeSubscriptionId: userData?.subscription?.stripeSubscriptionId,
      currentPeriodEnd: userData?.subscription?.currentPeriodEnd,
    };

    const remainingCredits = subscription.creditsLimit - subscription.creditsUsed;
    const remainingMinutes = remainingCredits * MINUTES_PER_CREDIT;

    return { 
      success: true, 
      subscription,
      remainingInterviews: subscription.interviewsLimit - subscription.interviewsUsed,
      remainingCredits,
      remainingMinutes
    };
  } catch (error) {
    console.error('Error getting user subscription:', error);
    return { 
      success: false, 
      error,
      subscription: {
        status: 'active',
        plan: 'FREE',
        interviewsUsed: 0,
        interviewsLimit: PLANS.FREE.maxInterviews,
        creditsUsed: 0,
        creditsLimit: PLANS.FREE.monthlyCredits,
        minutesUsed: 0
      },
      remainingCredits: PLANS.FREE.monthlyCredits,
      remainingMinutes: PLANS.FREE.monthlyCredits * MINUTES_PER_CREDIT
    };
  }
}

export async function getBillingHistory(userId: string) {
  try {
    // Get user's Stripe customer ID
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userData = userDoc.data();
    const stripeCustomerId = userData?.subscription?.stripeCustomerId;

    if (!stripeCustomerId) {
      return { success: true, invoices: [], charges: [] };
    }

    // Get invoices from Stripe
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
      limit: 10,
    });

    // Get charges (receipts) from Stripe
    const charges = await stripe.charges.list({
      customer: stripeCustomerId,
      limit: 10,
    });

    // Format invoices
    const formattedInvoices = invoices.data.map(invoice => ({
      id: invoice.id,
      amount: invoice.amount_paid / 100, // Convert from cents to dollars
      status: invoice.status,
      date: invoice.created,
      pdfUrl: invoice.invoice_pdf,
      description: invoice.description || 'Subscription invoice',
      type: 'invoice'
    }));

    // Format charges (receipts)
    const formattedCharges = charges.data.map(charge => ({
      id: charge.id,
      amount: charge.amount / 100, // Convert from cents to dollars
      status: charge.status,
      date: charge.created,
      pdfUrl: charge.receipt_url,
      description: charge.description || 'Payment receipt',
      type: 'receipt'
    }));

    // Combine and sort by date (newest first)
    const allTransactions = [...formattedInvoices, ...formattedCharges]
      .sort((a, b) => b.date - a.date);

    return { 
      success: true, 
      invoices: formattedInvoices,
      charges: formattedCharges,
      transactions: allTransactions
    };
  } catch (error) {
    console.error('Error getting billing history:', error);
    return { success: false, error, invoices: [], charges: [], transactions: [] };
  }
}

export async function resetInterviewCount(userId: string) {
  try {
    const userRef = db.collection('users').doc(userId);
    
    await userRef.update({
      'subscription.interviewsUsed': 0,
      'subscription.creditsUsed': 0,
      'subscription.minutesUsed': 0
    });

    return { success: true };
  } catch (error) {
    console.error('Error resetting interview count:', error);
    return { success: false, error };
  }
}

// Deduct credits based on minutes used in an interview
export async function deductCredits(userId: string, minutesUsed: number) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userData = userDoc.data();
    const plan = userData?.subscription?.plan || 'FREE';
    const planConfig = PLANS[plan as keyof typeof PLANS] || PLANS.FREE;
    
    const currentCreditsUsed = userData?.subscription?.creditsUsed || 0;
    const creditsLimit = userData?.subscription?.creditsLimit || planConfig.monthlyCredits;
    const currentMinutesUsed = userData?.subscription?.minutesUsed || 0;
    
    // Calculate credits to deduct (1 credit = 5 minutes)
    const creditsToDeduct = minutesUsed / MINUTES_PER_CREDIT;
    const newCreditsUsed = currentCreditsUsed + creditsToDeduct;
    const newMinutesUsed = currentMinutesUsed + minutesUsed;

    // Update credits
    await userRef.update({
      'subscription.creditsUsed': newCreditsUsed,
      'subscription.minutesUsed': newMinutesUsed
    });

    return { 
      success: true, 
      creditsUsed: newCreditsUsed,
      creditsLimit,
      remainingCredits: creditsLimit - newCreditsUsed,
      minutesUsed: newMinutesUsed,
      remainingMinutes: (creditsLimit - newCreditsUsed) * MINUTES_PER_CREDIT
    };
  } catch (error) {
    console.error('Error deducting credits:', error);
    return { success: false, error };
  }
}

// Check if user has enough credits for an interview
export async function checkCredits(userId: string) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userData = userDoc.data();
    const plan = userData?.subscription?.plan || 'FREE';
    const planConfig = PLANS[plan as keyof typeof PLANS] || PLANS.FREE;
    
    const creditsUsed = userData?.subscription?.creditsUsed || 0;
    const creditsLimit = userData?.subscription?.creditsLimit || planConfig.monthlyCredits;
    const remainingCredits = creditsLimit - creditsUsed;
    const remainingMinutes = remainingCredits * MINUTES_PER_CREDIT;

    // Check if user has at least some credits remaining
    const hasCredits = remainingCredits > 0;

    return { 
      success: true, 
      hasCredits,
      creditsUsed,
      creditsLimit,
      remainingCredits,
      remainingMinutes,
      plan
    };
  } catch (error) {
    console.error('Error checking credits:', error);
    return { 
      success: false, 
      error,
      hasCredits: false,
      creditsUsed: 0,
      creditsLimit: 0,
      remainingCredits: 0,
      remainingMinutes: 0,
      plan: 'FREE'
    };
  }
}
