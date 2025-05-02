import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";

const ProfilePage = async () => {
  const user = await getCurrentUser();
  
  // Fetch user interviews for statistics
  const userInterviews = await getInterviewsByUserId(user?.id);
  const totalInterviews = userInterviews?.length || 0;
  
  // Calculate average score
  let totalScore = 0;
  let completedInterviews = 0;
  
  if (userInterviews && userInterviews.length > 0) {
    userInterviews.forEach(interview => {
      if (interview.feedback && interview.feedback.totalScore) {
        totalScore += Number(interview.feedback.totalScore);
        completedInterviews++;
      }
    });
  }
  
  const averageScore = completedInterviews > 0 ? Math.round(totalScore / completedInterviews) : 0;
  
  // Calculate interviews this month
  const interviewsThisMonth = userInterviews?.filter(interview => {
    const interviewDate = new Date(interview.createdAt);
    const today = new Date();
    return interviewDate.getMonth() === today.getMonth() && 
           interviewDate.getFullYear() === today.getFullYear();
  }).length || 0;
  
  // Calculate member since date
  const memberSince = user?.createdAt ? new Date(user.createdAt) : new Date();
  const memberSinceFormatted = memberSince.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long'
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">Profile</h1>
          <p className="text-gray-400">Manage your account details and preferences</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-dark-300 text-gray-300 hover:text-white">
            <Link href="/settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </Link>
          </Button>
          <form action="/api/auth/signout" method="post">
            <Button type="submit" variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30 hover:text-red-300 border-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Log Out
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-primary-200 to-primary-300 flex items-center justify-center text-white text-4xl font-medium shadow-lg">
                {user?.name?.[0]?.toUpperCase() || "U"}
              </div>
              <Button className="w-full bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">Change Photo</Button>
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-3 text-white">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                    <div className="p-3 bg-dark-300/80 rounded-md border border-dark-300/50 text-white">{user?.name}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                    <div className="p-3 bg-dark-300/80 rounded-md border border-dark-300/50 text-white">{user?.email}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3 text-white">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Account Type</label>
                    <div className="p-3 bg-dark-300/80 rounded-md border border-dark-300/50 text-white flex items-center">
                      <span className="mr-2">Free Plan</span>
                      <span className="px-2 py-0.5 bg-primary-200/20 rounded-full text-xs font-medium text-primary-100">Active</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Member Since</label>
                    <div className="p-3 bg-dark-300/80 rounded-md border border-dark-300/50 text-white">{memberSinceFormatted}</div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <Button className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">Update Profile</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 text-white">Interview Statistics</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-dark-300/80 p-4 rounded-md border border-dark-300/50 hover:border-primary-200/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-400 text-sm">Total Interviews</p>
                <div className="w-8 h-8 rounded-full bg-primary-200/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{totalInterviews}</p>
            </div>
            <div className="bg-dark-300/80 p-4 rounded-md border border-dark-300/50 hover:border-primary-200/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-400 text-sm">Average Score</p>
                <div className="w-8 h-8 rounded-full bg-primary-200/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{averageScore}%</p>
            </div>
            <div className="bg-dark-300/80 p-4 rounded-md border border-dark-300/50 hover:border-primary-200/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <p className="text-gray-400 text-sm">This Month</p>
                <div className="w-8 h-8 rounded-full bg-primary-200/20 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{interviewsThisMonth}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-8 bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-md overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4 text-white">Recent Activity</h3>
          {userInterviews && userInterviews.length > 0 ? (
            <div className="space-y-4">
              {userInterviews.slice(0, 3).map((interview) => (
                <div key={interview.id} className="bg-dark-300/80 p-4 rounded-md border border-dark-300/50 hover:border-primary-200/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-white">{interview.role} Interview</h4>
                      <p className="text-gray-400 text-sm">{interview.createdAt ? formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true }) : 'Recently'}</p>
                    </div>
                    <div className="flex items-center">
                      {interview.feedback ? (
                        <div className="flex items-center">
                          <span className="text-lg font-bold mr-2 text-white">{interview.feedback.totalScore}%</span>
                          <Link href={`/interview/${interview.id}/feedback`} className="text-primary-200 hover:text-primary-300 text-sm transition-colors">
                            View Feedback
                          </Link>
                        </div>
                      ) : (
                        <Link href={`/interview/${interview.id}`} className="text-primary-200 hover:text-primary-300 text-sm transition-colors">
                          Continue Interview
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-dark-300/80 p-6 rounded-md border border-dark-300/50 text-center">
              <p className="text-gray-400">No recent activity</p>
              <Button asChild className="mt-4 bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">
                <Link href="/interview">Start an Interview</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
