import { NextRequest, NextResponse } from 'next/server';
import { createPortalSession } from '@/lib/stripe';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { db } from '@/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Get the user's Stripe customer ID from Firestore
    const userDoc = await db.collection('users').doc(user.id).get();
    const userData = userDoc.data();
    
    if (!userData?.stripeCustomerId) {
      return new Response(
        JSON.stringify({ error: 'No Stripe customer found for this user' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    // Get the origin for the return URL
    const origin = req.headers.get('origin') || 'http://localhost:3000';
    
    const session = await createPortalSession(
      userData.stripeCustomerId,
      origin
    );

    // If the session URL is available, redirect to it
    if (session.url) {
      return NextResponse.redirect(session.url);
    }
    
    // Fallback to JSON response if no URL
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to create portal session' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
