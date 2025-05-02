import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/firebase/admin';
import { updateUserSubscription } from '@/lib/actions/subscription.action';

export async function POST(req: NextRequest) {
  const body = await req.text();
  // Get the signature directly from the request header instead of using headers()
  const signature = req.headers.get('stripe-signature');
  
  if (!signature) {
    return new Response('No signature found', { status: 400 });
  }

  // Use environment variable or hardcoded webhook secret for testing
  const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_f8e8a553b284e61836f1f2f80e556b96fa07c9f9e0a39240b7c904693a2b23b4';
  
  if (!STRIPE_WEBHOOK_SECRET) {
    return new Response('Webhook secret not configured', { status: 500 });
  }

  let event;

  try {
    console.log('Attempting to construct webhook event...');
    console.log('Signature:', signature.substring(0, 20) + '...');
    console.log('Body length:', body.length);
    
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
    
    console.log('Webhook event constructed successfully');
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
  
  console.log(`Webhook received: ${event.type}`);

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const checkoutSession = event.data.object as any;
        
        if (checkoutSession.metadata?.userId) {
          const userId = checkoutSession.metadata.userId;
          const planId = checkoutSession.metadata.planId;
          const customerId = checkoutSession.customer as string;
          
          console.log(`Checkout session completed for user ${userId}, plan ${planId}`);
          
          // Update the user's subscription status in your database
          await updateUserSubscription({
            userId,
            stripeCustomerId: customerId,
            plan: planId as any,
            status: 'active',
            currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          });
        }
        break;
      }
        
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any;
        const subscriptionId = invoice.subscription;

        if (subscriptionId) {
          // Get the subscription details
          const subscriptionData = await stripe.subscriptions.retrieve(subscriptionId);
          const customerId = subscriptionData.customer as string;

          // Find the user with this customer ID
          const usersSnapshot = await db.collection('users')
            .where('subscription.stripeCustomerId', '==', customerId)
            .get();

          if (!usersSnapshot.empty) {
            const userId = usersSnapshot.docs[0].id;
            
            // Update the subscription information
            await updateUserSubscription({
              userId,
              stripeSubscriptionId: subscriptionId,
              status: 'active',
              currentPeriodEnd: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
            });
            
            console.log(`Invoice paid for user ${userId}, subscription ${subscriptionId}`);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        
        // Find the user with this customer ID
        const usersSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .get();
        
        if (!usersSnapshot.empty) {
          const userId = usersSnapshot.docs[0].id;
          
          // Update the subscription status
          await updateUserSubscription({
            userId,
            status: subscription.status as any,
            currentPeriodEnd: subscription.current_period_end,
          });
          
          console.log(`Subscription updated for user ${userId}, status: ${subscription.status}`);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any;
        const customerId = subscription.customer as string;
        
        // Find the user with this customer ID
        const usersSnapshot = await db.collection('users')
          .where('subscription.stripeCustomerId', '==', customerId)
          .get();
        
        if (!usersSnapshot.empty) {
          const userId = usersSnapshot.docs[0].id;
          
          // Update the subscription status
          await updateUserSubscription({
            userId,
            status: 'canceled',
            plan: 'FREE',
          });
          
          console.log(`Subscription canceled for user ${userId}`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(`Webhook processing error: ${error.message}`, { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
