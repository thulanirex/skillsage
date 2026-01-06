import { NextResponse } from 'next/server';
import { checkRateLimit, rateLimitConfigs, getClientIP } from '@/lib/rate-limit';
import { verifyRecaptcha } from '@/lib/recaptcha';

// POST - Verify sign-up attempt (rate limit + reCAPTCHA)
export async function POST(request: Request) {
  try {
    const clientIP = getClientIP(request);
    
    // Check rate limit
    const rateLimit = checkRateLimit(`signup:${clientIP}`, rateLimitConfigs.signUp);
    
    if (!rateLimit.allowed) {
      const resetMinutes = Math.ceil(rateLimit.resetIn / 60000);
      return NextResponse.json(
        { 
          error: 'Too many sign-up attempts', 
          message: `Please try again in ${resetMinutes} minutes`,
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

    const { recaptchaToken } = await request.json();

    // Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'signup');
    
    if (!recaptchaResult.success) {
      return NextResponse.json(
        { 
          error: 'Security verification failed', 
          message: 'Please try again. If the problem persists, refresh the page.',
          details: recaptchaResult.error 
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      score: recaptchaResult.score,
      remaining: rateLimit.remaining 
    });
  } catch (error) {
    console.error('Error verifying sign-up:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
