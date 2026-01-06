import { NextResponse } from 'next/server';
import { checkRateLimit, rateLimitConfigs, getClientIP } from '@/lib/rate-limit';

// POST - Verify sign-in attempt (rate limit only, no reCAPTCHA for sign-in)
export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    const { email } = await request.json();
    
    // Rate limit by IP + email combination to prevent brute force
    const identifier = `signin:${clientIP}:${email?.toLowerCase() || 'unknown'}`;
    const rateLimit = checkRateLimit(identifier, rateLimitConfigs.auth);
    
    if (!rateLimit.allowed) {
      const resetMinutes = Math.ceil(rateLimit.resetIn / 60000);
      return NextResponse.json(
        { 
          error: 'Too many sign-in attempts', 
          message: `Account temporarily locked. Please try again in ${resetMinutes} minutes.`,
          resetIn: rateLimit.resetIn 
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Date.now() + rateLimit.resetIn),
          }
        }
      );
    }

    return NextResponse.json({ 
      success: true, 
      remaining: rateLimit.remaining 
    });
  } catch (error) {
    console.error('Error verifying sign-in:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
