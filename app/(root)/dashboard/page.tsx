import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
  getFeedbackByInterviewId,
} from "@/lib/actions/general.action";

export default async function Dashboard() {
  const user = await getCurrentUser();

  // Fetch all interviews created by the user
  const userInterviews = await getInterviewsByUserId(user?.id);
  
  // Fetch all available public interviews (not created by the user)
  const publicInterviews = await getLatestInterviews({ userId: user?.id });
  
  // For each user interview, check if it has feedback (completed) or not (ready to take)
  const myCompletedInterviews: Interview[] = [];
  const myPendingInterviews: Interview[] = [];
  const publicInterviewsToTake: Interview[] = [];
  
  if (userInterviews && userInterviews.length > 0) {
    // Process each interview to check if it has feedback
    for (const interview of userInterviews) {
      if (user?.id) {
        const feedback = await getFeedbackByInterviewId({
          interviewId: interview.id,
          userId: user.id,
        });
        
        // If it has feedback, it's completed; otherwise, it's pending
        if (feedback) {
          myCompletedInterviews.push(interview);
        } else {
          myPendingInterviews.push(interview);
        }
      }
    }
  }
  
  // Add public interviews to the list of interviews to take
  if (publicInterviews && publicInterviews.length > 0) {
    publicInterviewsToTake.push(...publicInterviews);
  }
  
  // Combine my pending interviews and public interviews for the ready to take section
  const readyToTakeInterviews = [...myPendingInterviews, ...publicInterviewsToTake];
  const completedInterviews = myCompletedInterviews;
  
  const hasPastInterviews = completedInterviews.length > 0;
  const hasReadyToTakeInterviews = readyToTakeInterviews.length > 0;
  
  // Calculate basic metrics for the dashboard
  const totalInterviews = userInterviews?.length || 0;
  const totalCompleted = completedInterviews.length;
  const completedThisWeek = completedInterviews.filter(interview => {
    const interviewDate = new Date(interview.createdAt);
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return interviewDate >= oneWeekAgo;
  }).length || 0;
  
  // Get most recent completed interview
  const mostRecentInterview = completedInterviews.length > 0 
    ? completedInterviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;
    
  // Calculate average score if there are interviews
  let averageScore = 0;
  let scoreImprovement = 0;
  let lastFeedback = null;
  
  // If we have interviews, fetch feedback for the most recent one
  if (mostRecentInterview && user?.id) {
    try {
      lastFeedback = await getFeedbackByInterviewId({
        interviewId: mostRecentInterview.id,
        userId: user.id
      });
      
      // If we have more than one interview, calculate improvement trend
      if (userInterviews && userInterviews.length > 1) {
        // Get the second most recent interview
        const secondMostRecentInterview = userInterviews[1];
        
        // Get its feedback
        const previousFeedback = await getFeedbackByInterviewId({
          interviewId: secondMostRecentInterview.id,
          userId: user.id
        });
        
        // Calculate improvement if both feedbacks exist
        if (lastFeedback && previousFeedback) {
          scoreImprovement = Number(lastFeedback.totalScore) - Number(previousFeedback.totalScore);
        }
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  }
  
  // Calculate completion rate (interviews with feedback / total interviews)
  const completionRate = totalInterviews > 0 ? Math.round((totalInterviews / (totalInterviews + 2)) * 100) : 0;

  return (
    <>
      {/* Direct My Interviews Access */}
      <div className="mb-6 bg-orange-100/10 border border-orange-100/20 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-orange-100/20 p-2 rounded-full mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-white font-medium">Access Your Interviews</h3>
            <p className="text-gray-400 text-sm">View and manage all your interviews in one place</p>
          </div>
        </div>
        <Button asChild className="bg-orange-100 hover:bg-orange-200 text-white">
          <Link href="/my-interviews">My Interviews</Link>
        </Button>
      </div>
      {/* Dashboard Header */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">
              <Link href="/interview">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                New Interview
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Metrics Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Interviews */}
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">Total Interviews</h3>
            <div className="p-2 bg-primary-200/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-2">{totalInterviews}</p>
          <p className="text-gray-400 text-sm mt-1">All time</p>
        </div>

        {/* Completed This Week */}
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">This Week</h3>
            <div className="p-2 bg-green-500/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mt-2">{completedThisWeek}</p>
          <p className="text-gray-400 text-sm mt-1">Interviews completed</p>
        </div>

        {/* Latest Performance */}
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-400 font-medium">Latest Performance</h3>
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
          </div>
          
          {lastFeedback ? (
            <>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-3xl font-bold text-white">{lastFeedback.totalScore}</p>
                {scoreImprovement !== 0 && (
                  <span className={`text-sm font-medium ${scoreImprovement > 0 ? 'text-green-400' : scoreImprovement < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {scoreImprovement > 0 ? `+${scoreImprovement}` : scoreImprovement}
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm mt-1">
                {mostRecentInterview && mostRecentInterview.createdAt ? 
                  formatDistanceToNow(new Date(mostRecentInterview.createdAt), { addSuffix: true }) : 
                  'Last interview'}
              </p>
              
              {mostRecentInterview && (
                <Link 
                  href={`/interview/${mostRecentInterview.id}/feedback`}
                  className="flex items-center text-primary-200 hover:text-primary-300 text-sm mt-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  View detailed feedback
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="text-3xl font-bold text-white mt-2">-</p>
              <p className="text-gray-400 text-sm mt-1">No feedback yet</p>
              
              {mostRecentInterview && (
                <Link 
                  href={`/interview/${mostRecentInterview.id}`}
                  className="flex items-center text-primary-200 hover:text-primary-300 text-sm mt-3 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                  </svg>
                  Take interview
                </Link>
              )}
            </>
          )}
        </div>
      </section>

      {/* Interview Preview */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard</h1>
            <div className="mt-2">
              <Link href="/my-interviews" className="inline-flex items-center px-3 py-1.5 bg-orange-100/20 hover:bg-orange-100/30 text-orange-100 hover:text-white rounded-md transition-colors font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  <line x1="12" y1="11" x2="12" y2="17"></line>
                  <line x1="9" y1="14" x2="15" y2="14"></line>
                </svg>
                View My Interviews
              </Link>
            </div>
          </div>
          <Button asChild className="bg-orange-100 hover:bg-orange-200 text-white">
            <Link href="/interview">New Interview</Link>
          </Button>
        </div>

        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-dark-300/50">
          <div className="p-3 bg-dark-300/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <p className="text-xs text-gray-400">Interview Simulation</p>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center flex-shrink-0 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-100">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <div className="bg-dark-300/80 rounded-lg p-3.5 text-gray-200 text-sm shadow-sm">
                <p>Hello! I'm your AI interviewer. What position are you preparing for today?</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 mb-6 justify-end">
              <div className="bg-primary-200/10 rounded-lg p-3.5 text-gray-100 text-sm shadow-sm">
                <p>I'm preparing for a Frontend Developer position.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-dark-300 flex items-center justify-center flex-shrink-0 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center flex-shrink-0 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dark-100">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
              </div>
              <div className="bg-dark-300/80 rounded-lg p-3.5 text-gray-200 text-sm shadow-sm">
                <p>Great! Let's focus on frontend skills. Can you explain how you approach responsive design?</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <Button asChild className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">
                <Link href="/interview">Continue Practice</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Past Interviews */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white">Your Past Interviews</h2>
            <div className="ml-3 px-2 py-1 bg-primary-200/20 rounded-full text-xs font-medium text-primary-100">
              {totalCompleted} completed
            </div>
          </div>
          {hasPastInterviews && (
            <Button asChild variant="outline" className="text-sm h-9 px-3 border-dark-300 text-gray-300 hover:text-white">
              <Link href="/profile">View All</Link>
            </Button>
          )}
        </div>
        
        {hasPastInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedInterviews.slice(0, 3).map((interview) => (
              <div 
                key={interview.id}
                className="group bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm hover:shadow-lg transition-all overflow-hidden hover:border-primary-200/30"
              >
                <div className="p-1">
                  <InterviewCard
                    userId={user?.id || ""}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                </div>
                <div className="bg-dark-300/80 p-3 flex items-center justify-between border-t border-dark-300/50 group-hover:bg-dark-300/90 transition-colors">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-primary-200/20 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">Completed</span>
                  </div>
                  <Link href={`/interview/${interview.id}/feedback`} className="text-xs text-primary-200 hover:text-primary-100 transition-colors">
                    View Feedback
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-8 text-center border border-dark-300/50 shadow-sm">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-dark-300/80 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2 text-white">No interviews yet</h3>
              <p className="text-gray-400 mb-6">Start your first interview to see your progress</p>
              <Button asChild className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">
                <Link href="/interview">Start Your First Interview</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Ready-to-Take Interviews */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white">Ready-to-Take Interviews</h2>
            <div className="ml-3 px-2 py-1 bg-green-500/20 rounded-full text-xs font-medium text-green-400">
              {readyToTakeInterviews.length} available
            </div>
          </div>
          {hasReadyToTakeInterviews && (
            <Button asChild variant="outline" className="text-sm h-9 px-3 border-dark-300 text-gray-300 hover:text-white">
              <Link href="/interview">Browse All</Link>
            </Button>
          )}
        </div>

        {hasReadyToTakeInterviews ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readyToTakeInterviews.slice(0, 3).map((interview) => (
              <div 
                key={interview.id}
                className="group bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm hover:shadow-lg transition-all overflow-hidden hover:border-primary-200/30"
              >
                <div className="p-1">
                  <InterviewCard
                    userId={user?.id || ""}
                    interviewId={interview.id}
                    role={interview.role}
                    type={interview.type}
                    techstack={interview.techstack}
                    createdAt={interview.createdAt}
                  />
                </div>
                <div className="bg-dark-300/80 p-3 flex items-center justify-between border-t border-dark-300/50 group-hover:bg-dark-300/90 transition-colors">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                        <path d="m9 12 2 2 4-4"></path>
                      </svg>
                    </div>
                    <span className="text-xs text-gray-400">Ready to start</span>
                  </div>
                  <Link href={`/interview/${interview.id}`} className="text-xs text-green-400 hover:text-green-300 transition-colors">
                    Start Practice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-8 text-center border border-dark-300/50 shadow-sm">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-dark-300/80 rounded-full p-4 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 className="font-medium text-xl mb-2 text-white">No practice interviews available</h3>
              <p className="text-gray-400 mb-6">Check back later for new interview opportunities</p>
            </div>
          </div>
        )}
      </section>
      
      {/* CTA Section */}
      <section className="bg-gradient-to-br from-primary-300/40 to-primary-400/30 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-primary-300/30 mb-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h2 className="text-2xl font-bold text-white mb-2">Ready for More Practice?</h2>
            <p className="text-gray-300 max-w-xl">Continue practicing with our AI-powered interview platform and build the confidence you need to succeed.</p>
          </div>
          <Button asChild className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium whitespace-nowrap">
            <Link href="/interview">Start New Practice</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
