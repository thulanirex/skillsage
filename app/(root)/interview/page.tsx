import { getCurrentUser } from "@/lib/actions/auth.action";
import InterviewSetup from "@/components/InterviewSetup";
import { getInterviewsByUserId } from "@/lib/actions/general.action";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const Page = async () => {
  const user = await getCurrentUser();
  // Log the user ID for debugging
  console.log('User ID from getCurrentUser:', user?.id);
  const interviews = await getInterviewsByUserId(user?.id || "");

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Generate Interview</h1>
          <p className="text-gray-400">Create a new AI interview tailored to your needs</p>
        </div>
        
        <div className="hidden md:flex items-center gap-2 bg-dark-200/60 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-dark-300/50">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className="text-sm text-gray-300">Average setup time: ~2 min</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Interview Setup Area */}
        <div className="lg:col-span-2">
          <InterviewSetup
            userName={user?.name || "User"}
            userId={user?.id || ""}
          />
        </div>
        
        {/* Sidebar with Tips and User's Interviews */}
        <div className="space-y-6">
          {/* How It Works Section */}
          <div className="bg-gradient-to-br from-primary-300/30 to-primary-400/20 backdrop-blur-sm rounded-xl p-6 border border-primary-300/30 shadow-sm">
            <h3 className="text-lg font-medium text-white mb-4 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              How It Works
            </h3>
            <ol className="space-y-4 text-gray-200 text-sm">
              <li className="flex items-start">
                <div className="flex items-center justify-center bg-primary-200/20 rounded-full w-6 h-6 mr-3 mt-0.5 text-xs font-medium text-primary-100">1</div>
                <div>
                  <p className="font-medium text-white">Enter your target position</p>
                  <p className="text-gray-300 mt-1">Any job title, any industry - we support them all</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center bg-primary-200/20 rounded-full w-6 h-6 mr-3 mt-0.5 text-xs font-medium text-primary-100">2</div>
                <div>
                  <p className="font-medium text-white">Add relevant skills</p>
                  <p className="text-gray-300 mt-1">List the skills you want to be tested on</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex items-center justify-center bg-primary-200/20 rounded-full w-6 h-6 mr-3 mt-0.5 text-xs font-medium text-primary-100">3</div>
                <div>
                  <p className="font-medium text-white">Start practicing!</p>
                  <p className="text-gray-300 mt-1">AI generates personalized questions for your interview</p>
                </div>
              </li>
            </ol>
          </div>
          
          {/* Tips Section */}
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-sm">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <line x1="10" y1="9" x2="8" y2="9"></line>
              </svg>
              Pro Tips
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                Paste the actual job description for best results
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                Be specific with skills for targeted questions
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                Works for any role - tech, healthcare, finance, etc.
              </li>
            </ul>
          </div>
          
          {/* Recent Interviews Section */}
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl overflow-hidden border border-dark-300/50 shadow-sm">
            <div className="p-5 border-b border-dark-300/50 flex justify-between items-center">
              <h3 className="text-lg font-medium text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
                Your Recent Interviews
              </h3>
              <Link href="/dashboard" className="text-xs text-primary-200 hover:text-primary-100 transition-colors">
                View All
              </Link>
            </div>
            
            <div className="max-h-72 overflow-y-auto">
              {interviews && interviews.length > 0 ? (
                <div className="divide-y divide-dark-300/50">
                  {interviews.slice(0, 5).map((interview) => (
                    <Link 
                      key={interview.id} 
                      href={`/interview/${interview.id}`}
                      className="flex items-center justify-between p-4 hover:bg-dark-300/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-dark-300 rounded-full p-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-white font-medium capitalize">{interview.role} Interview</p>
                          <p className="text-xs text-gray-400">
                            {interview.createdAt ? formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true }) : 'Recently'}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-primary-200/20 text-primary-100 rounded-full">
                        {interview.type}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-dark-300/50 p-3 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <p className="text-gray-400 text-sm">No interviews yet</p>
                  <p className="text-gray-500 text-xs mt-1">Generate your first interview to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
