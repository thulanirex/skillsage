// Google reCAPTCHA v3 verification

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_THRESHOLD = 0.5; // Score threshold (0.0 - 1.0, higher = more likely human)

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  'error-codes'?: string[];
}

export async function verifyRecaptcha(token: string, expectedAction?: string): Promise<{
  success: boolean;
  score: number;
  error?: string;
}> {
  if (!RECAPTCHA_SECRET_KEY) {
    console.warn('RECAPTCHA_SECRET_KEY not configured - skipping verification');
    return { success: true, score: 1.0 };
  }

  if (!token) {
    return { success: false, score: 0, error: 'No reCAPTCHA token provided' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data: RecaptchaResponse = await response.json();

    if (!data.success) {
      return {
        success: false,
        score: 0,
        error: `reCAPTCHA verification failed: ${data['error-codes']?.join(', ') || 'Unknown error'}`,
      };
    }

    // Check action if provided
    if (expectedAction && data.action !== expectedAction) {
      return {
        success: false,
        score: data.score || 0,
        error: 'reCAPTCHA action mismatch',
      };
    }

    // Check score threshold
    const score = data.score || 0;
    if (score < RECAPTCHA_THRESHOLD) {
      return {
        success: false,
        score,
        error: `reCAPTCHA score too low: ${score}`,
      };
    }

    return { success: true, score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, score: 0, error: 'reCAPTCHA verification failed' };
  }
}
