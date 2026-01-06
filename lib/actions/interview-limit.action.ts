"use server";

import { db } from "@/firebase/admin";
import { PLANS, PlanType } from "@/lib/stripe";

interface CheckInterviewLimitResult {
  canCreate: boolean;
  interviewsUsed: number;
  interviewsLimit: number;
  remainingInterviews: number;
  plan: PlanType;
  message?: string;
}

export async function checkInterviewLimit(userId: string): Promise<CheckInterviewLimitResult> {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      // New user - initialize with free plan
      return {
        canCreate: true,
        interviewsUsed: 0,
        interviewsLimit: PLANS.FREE.maxInterviews,
        remainingInterviews: PLANS.FREE.maxInterviews,
        plan: 'FREE',
      };
    }

    const userData = userDoc.data();
    const subscription = userData?.subscription || {
      plan: 'FREE',
      interviewsUsed: 0,
      interviewsLimit: PLANS.FREE.maxInterviews,
    };

    const plan = (subscription.plan || 'FREE') as PlanType;
    const interviewsUsed = subscription.interviewsUsed || 0;
    const interviewsLimit = subscription.interviewsLimit || PLANS[plan].maxInterviews;
    const remainingInterviews = Math.max(0, interviewsLimit - interviewsUsed);

    // Check if user has reached their limit
    if (interviewsUsed >= interviewsLimit) {
      return {
        canCreate: false,
        interviewsUsed,
        interviewsLimit,
        remainingInterviews: 0,
        plan,
        message: `You've used all ${interviewsLimit} interview${interviewsLimit === 1 ? '' : 's'} for this month. Upgrade your plan to continue practicing.`,
      };
    }

    return {
      canCreate: true,
      interviewsUsed,
      interviewsLimit,
      remainingInterviews,
      plan,
    };
  } catch (error) {
    console.error('Error checking interview limit:', error);
    // Default to allowing the interview if there's an error
    return {
      canCreate: true,
      interviewsUsed: 0,
      interviewsLimit: PLANS.FREE.maxInterviews,
      remainingInterviews: PLANS.FREE.maxInterviews,
      plan: 'FREE',
      message: 'Could not verify interview limit',
    };
  }
}

export async function initializeUserSubscription(userId: string) {
  try {
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const userData = userDoc.data();
    
    // Only initialize if subscription doesn't exist
    if (!userData?.subscription) {
      await userRef.update({
        subscription: {
          status: 'active',
          plan: 'FREE',
          interviewsUsed: 0,
          interviewsLimit: PLANS.FREE.maxInterviews,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error initializing user subscription:', error);
    return { success: false, error };
  }
}
