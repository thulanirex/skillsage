import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession, PlanType, PLANS } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function POST(req: NextRequest) {
  try {
    console.log('Stripe checkout request received');
    
    const user = await getCurrentUser();
    
    if (!user) {
      console.log('User not authenticated');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    console.log('User authenticated:', user.id);

    // Handle both form submissions and JSON requests
    let planId: PlanType;
    let userEmail: string | null = null;
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      // JSON request
      const body = await req.json();
      
      // Handle both old planId and new priceId parameters
      if (body.priceId) {
        // Find the plan that matches this priceId
        const planEntry = Object.entries(PLANS).find(
          ([_, planDetails]: [string, any]) => planDetails.stripePriceId === body.priceId
        );
        
        if (!planEntry) {
          return new Response(JSON.stringify({ error: 'Invalid price ID' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        
        planId = planEntry[0] as PlanType;
        userEmail = body.userEmail || null;
      } else {
        // Fallback to old parameter name
        planId = body.planId as PlanType;
      }
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      // Form submission
      const formData = await req.formData();
      planId = formData.get('planId') as PlanType;
    } else {
      return new Response(JSON.stringify({ error: 'Unsupported content type' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    console.log('Processing checkout for plan:', planId);
    
    // Get the origin for the return URL
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const session = await createCheckoutSession(
      user.id,
      planId,
      origin,
      userEmail || user.email
    );

    // Return the checkout URL as JSON instead of redirecting
    if (session.url) {
      console.log('Checkout session created with URL:', session.url);
      
      // Return the URL as JSON
      return new Response(JSON.stringify({
        success: true,
        url: session.url,
        sessionId: session.id
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
    
    // Fallback to JSON response if no URL
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
