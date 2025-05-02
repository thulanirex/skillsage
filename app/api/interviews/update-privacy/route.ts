import { NextRequest } from 'next/server';
import { updateInterviewPrivacy } from '@/lib/actions/general.action';
import { getCurrentUser } from '@/lib/actions/auth.action';

export async function POST(req: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser();
    
    if (!user) {
      return new Response(JSON.stringify({ success: false, message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Parse the request body
    const body = await req.json();
    const { interviewId, isPublic } = body;
    
    if (!interviewId) {
      return new Response(JSON.stringify({ success: false, message: 'Interview ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Update the interview privacy
    const result = await updateInterviewPrivacy({
      interviewId,
      userId: user.id,
      isPublic: !!isPublic // Ensure boolean
    });
    
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating interview privacy:', error);
    return new Response(JSON.stringify({ success: false, message: 'Failed to update interview privacy' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
