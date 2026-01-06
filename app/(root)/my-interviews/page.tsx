import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserInterviewsWithFeedback } from "@/lib/actions/general.action";
import InterviewPrivacyToggle from "@/components/InterviewPrivacyToggle";

export default async function MyInterviewsPage() {
  const user = await getCurrentUser();
  
  // Add debugging to log the user ID
  console.log('MyInterviewsPage - User ID:', user?.id);
  
  const { interviews, feedbackMap } = await getUserInterviewsWithFeedback(user?.id);
  
  // Log the number of interviews returned
  console.log(`MyInterviewsPage - Received ${interviews.length} interviews`);
  if (interviews.length > 0) {
    console.log('First interview:', {
      id: interviews[0].id,
      userId: interviews[0].userId,
      role: interviews[0].role
    });
  }
  
  // Check for and log duplicate interview IDs
  const seen = new Set<string>();
  const duplicateIds = new Set<string>();
  
  interviews.forEach(interview => {
    if (seen.has(interview.id)) {
      duplicateIds.add(interview.id);
      console.log(`Found duplicate interview ID: ${interview.id}`);
    }
    seen.add(interview.id);
  });
  
  console.log(`Found ${duplicateIds.size} duplicate interview IDs`);
  
  // Separate interviews into completed and pending
  // For each interview, ensure we use a unique key in the render function
  const completedInterviews = interviews.filter(interview => feedbackMap[interview.id]);
  const pendingInterviews = interviews.filter(interview => !feedbackMap[interview.id]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Interviews</h1>
          <p className="text-gray-200">View and manage all your interviews and feedback</p>
        </div>
        
        <Button asChild className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium">
          <Link href="/interview">Create New Interview</Link>
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 hover:border-primary-200/30 transition-all">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-blue-100/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Total Interviews</h3>
          </div>
          <p className="text-3xl font-bold text-white">{interviews.length}</p>
        </div>
        
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 hover:border-green-400/30 transition-all">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-white">{completedInterviews.length}</p>
        </div>
        
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 hover:border-primary-200/30 transition-all">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-orange-100/20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-white">Pending</h3>
          </div>
          <p className="text-3xl font-bold text-white">{pendingInterviews.length}</p>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Interviews</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <Input 
                type="text" 
                placeholder="Search interviews..." 
                className="pl-10 bg-dark-300/50 border-dark-300/70 text-gray-100 placeholder:text-gray-500"
              />
            </div>
            
            <Select defaultValue="newest">
              <SelectTrigger className="w-full sm:w-40 bg-dark-300/50 border-dark-300/70 text-gray-100">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-dark-200 border-dark-300/70 text-gray-100">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="score-high">Highest Score</SelectItem>
                <SelectItem value="score-low">Lowest Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="all" className="space-y-6">
          {interviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interviews.map((interview, index) => (
                <InterviewCard 
                  key={`all-tab-${interview.id}-${index}`}
                  interview={interview}
                  feedback={feedbackMap[interview.id]}
                  userId={user?.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-6">
          {completedInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedInterviews.map((interview, index) => (
                <InterviewCard 
                  key={`completed-tab-${interview.id}-${index}`}
                  interview={interview}
                  feedback={feedbackMap[interview.id]}
                  userId={user?.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="completed" />
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-6">
          {pendingInterviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingInterviews.map((interview, index) => (
                <InterviewCard 
                  key={`pending-tab-${interview.id}-${index}`}
                  interview={interview}
                  feedback={feedbackMap[interview.id]}
                  userId={user?.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState type="pending" />
          )}
        </TabsContent>
      </Tabs>
      
      {/* Pagination UI */}
      {interviews.length > 9 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center gap-1">
            <button className="w-10 h-10 rounded-md flex items-center justify-center bg-dark-300/50 border border-dark-300/70 text-gray-300 hover:bg-dark-300/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <button className="w-10 h-10 rounded-md flex items-center justify-center bg-primary-200/20 border border-primary-200/30 text-white font-medium">
              1
            </button>
            
            <button className="w-10 h-10 rounded-md flex items-center justify-center bg-dark-300/50 border border-dark-300/70 text-gray-300 hover:bg-dark-300/80 transition-colors">
              2
            </button>
            
            <button className="w-10 h-10 rounded-md flex items-center justify-center bg-dark-300/50 border border-dark-300/70 text-gray-300 hover:bg-dark-300/80 transition-colors">
              3
            </button>
            
            <span className="px-2 text-gray-400">...</span>
            
            <button className="w-10 h-10 rounded-md flex items-center justify-center bg-dark-300/50 border border-dark-300/70 text-gray-300 hover:bg-dark-300/80 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

// Interview Card Component
function InterviewCard({ interview, feedback, userId }: any) {
  const isCompleted = !!feedback;
  
  // Determine score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-primary-200";
    return "text-red-400";
  };
  
  // Get a color for the interview type
  const typeColors: Record<string, string> = {
    behavioral: "bg-blue-500/20 text-blue-400",
    technical: "bg-green-500/20 text-green-400",
    mixed: "bg-purple-500/20 text-purple-400",
    default: "bg-primary-200/20 text-primary-200"
  };
  
  const typeColor = typeColors[interview.type?.toLowerCase()] || typeColors.default;
  
  return (
    <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden hover:border-primary-200/30 transition-all h-full flex flex-col">
      {/* Card Header */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-2">
            <div className={`rounded-lg px-3 py-1 text-xs font-medium ${typeColor} flex items-center gap-1.5`}>
              {interview.type === "behavioral" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
                  <circle cx="12" cy="11" r="3"></circle>
                  <path d="M17.5 15.5L19 19H5l1.5-3.5"></path>
                </svg>
              ) : interview.type === "technical" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
              )}
              <span className="capitalize">{interview.type}</span>
            </div>
            <div className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              isCompleted ? "bg-green-500/20 text-green-400" : "bg-orange-100/20 text-orange-100"
            } flex items-center gap-1`}>
              {isCompleted ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>Pending</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-white mb-3 capitalize">{interview.role} Interview</h3>
        
        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {interview.techstack?.slice(0, 4).map((tech: string, index: number) => (
            <span key={index} className="bg-dark-300/50 rounded-full px-2 py-0.5 text-xs text-gray-200">
              {tech}
            </span>
          ))}
          {interview.techstack?.length > 4 && (
            <span className="bg-dark-300/50 rounded-full px-2 py-0.5 text-xs text-gray-200">
              +{interview.techstack.length - 4} more
            </span>
          )}
        </div>
        
        {/* Date */}
        <div className="flex items-center text-xs text-gray-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true })}
        </div>
        
        {/* Feedback Section */}
        {feedback ? (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">Overall Score</h4>
              <div className={`text-lg font-bold ${getScoreColor(Number(feedback.totalScore))}`}>
                {feedback.totalScore}/100
              </div>
            </div>
            
            {/* Score Meter */}
            <div className="w-full h-2 bg-dark-300/70 rounded-full overflow-hidden mb-3">
              <div 
                className={`h-full ${Number(feedback.totalScore) >= 80 ? 'bg-green-400' : Number(feedback.totalScore) >= 60 ? 'bg-primary-200' : 'bg-red-400'}`}
                style={{ width: `${feedback.totalScore}%` }}
              ></div>
            </div>
            
            {/* Top Categories */}
            {feedback.categoryScores && typeof feedback.categoryScores === 'object' && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(feedback.categoryScores)
                  .filter(([_, score]) => typeof score === 'number')
                  .slice(0, 2)
                  .map(([category, score]: [string, any], index: number) => (
                    <div key={`${interview.id}-${category}-${index}`} className="bg-dark-300/40 rounded-lg p-2">
                      <div className="text-xs text-gray-300 capitalize mb-1">{category.replace(/([A-Z])/g, ' $1').trim()}</div>
                      <div className={`text-sm font-medium ${getScoreColor(Number(score))}`}>
                        {score}/100
                      </div>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4 py-2">
            <p className="text-gray-300 text-sm">This interview is ready to be taken. Start practicing to improve your skills.</p>
          </div>
        )}
      </div>
      
      {/* Card Footer */}
      <div className="mt-auto bg-dark-300/80 p-3 flex items-center justify-between border-t border-dark-300/50">
        <div className="flex items-center space-x-2">
          <InterviewPrivacyToggle 
            interviewId={interview.id}
            userId={userId}
            isPublic={interview.isPublic || false}
          />
        </div>
        
        <div>
          {isCompleted ? (
            <Button asChild size="sm" variant="outline" className="text-xs bg-primary-200/10 border-primary-200/30 text-primary-200 hover:bg-primary-200/20 hover:text-white">
              <Link href={`/interview/${interview.id}/feedback`}>View Feedback</Link>
            </Button>
          ) : (
            <Button asChild size="sm" variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-white">
              <Link href={`/interview/${interview.id}`}>Continue</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// Empty State Component
function EmptyState({ type = "all" }: { type?: string }) {
  let title = "No interviews yet";
  let description = "Create your first interview to get started";
  
  if (type === "completed") {
    title = "No completed interviews";
    description = "Complete an interview to see your feedback and results";
  } else if (type === "pending") {
    title = "No pending interviews";
    description = "Create an interview to start practicing";
  }
  
  return (
    <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-8 text-center border border-dark-300/50">
      <div className="flex flex-col items-center justify-center py-4">
        <div className="bg-dark-300/80 rounded-full p-4 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h3 className="font-medium text-xl mb-2 text-white">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        <Button asChild className="bg-orange-100 hover:bg-orange-200 text-white">
          <Link href="/interview">Create Interview</Link>
        </Button>
      </div>
    </div>
  );
}
