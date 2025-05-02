import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { updateUserSubscription } from '@/lib/actions/subscription.action';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }
    
    console.log(`Verifying payment for session: ${sessionId}`);
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    // Check if the payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ 
        error: `Payment not completed. Status: ${session.payment_status}` 
      }, { status: 400 });
    }
    
    // Get the customer ID and subscription ID
    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;
    
    // Determine which plan was purchased
    let planId = 'FREE';
    
    if (session.metadata?.planId) {
      planId = session.metadata.planId;
    } else {
      // Try to determine the plan from the line items
      const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
      
      if (lineItems.data.length > 0) {
        const priceId = lineItems.data[0].price?.id;
        
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) {
          planId = 'PRO';
        } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
          planId = 'ENTERPRISE';
        }
      }
    }
    
    console.log(`Updating subscription for user: ${user.id}, plan: ${planId}`);
    
    // Update the user's subscription in your database
    await updateUserSubscription({
      userId: user.id,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      plan: planId as any,
      status: 'active',
      currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
    });
    
    return NextResponse.json({ 
      success: true,
      message: 'Payment verified and subscription updated',
      plan: planId
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ 
      error: `Error verifying payment: ${error.message}` 
    }, { status: 500 });
  }
}
