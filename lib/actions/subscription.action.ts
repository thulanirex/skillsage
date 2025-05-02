import { db } from "@/firebase/admin";
import { stripe, PlanType, PLANS } from "@/lib/stripe";

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

    // Calculate interview limit based on plan
    const interviewsLimit = PLANS[plan].maxInterviews;
    
    // Get current subscription data if it exists
    const userData = userDoc.data();
    const currentInterviewsUsed = userData?.subscription?.interviewsUsed || 0;

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
    const subscription = userData?.subscription || {
      status: 'active',
      plan: 'FREE',
      interviewsUsed: 0,
      interviewsLimit: PLANS.FREE.maxInterviews
    };

    return { 
      success: true, 
      subscription,
      remainingInterviews: subscription.interviewsLimit - subscription.interviewsUsed
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
        interviewsLimit: PLANS.FREE.maxInterviews
      }
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
      'subscription.interviewsUsed': 0
    });

    return { success: true };
  } catch (error) {
    console.error('Error resetting interview count:', error);
    return { success: false, error };
  }
}
