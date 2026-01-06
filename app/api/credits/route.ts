import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/actions/auth.action';
import { checkCredits, deductCredits } from '@/lib/actions/subscription.action';

// GET - Check user's credit balance
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await checkCredits(user.id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking credits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Deduct credits after interview
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { minutesUsed } = await request.json();
    
    if (typeof minutesUsed !== 'number' || minutesUsed < 0) {
      return NextResponse.json({ error: 'Invalid minutesUsed value' }, { status: 400 });
    }
    
    const result = await deductCredits(user.id, minutesUsed);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error deducting credits:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
