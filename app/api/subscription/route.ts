import { NextResponse } from 'next/server';
import { getUserSubscription, getBillingHistory } from '@/lib/actions/subscription.action';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const result = await getUserSubscription(user.id);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { action } = await request.json();
    
    if (action === 'getBillingHistory') {
      const result = await getBillingHistory(user.id);
      return NextResponse.json(result);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error processing subscription action:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
