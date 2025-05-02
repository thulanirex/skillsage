import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getUserInterviewsWithFeedback } from "@/lib/actions/general.action";
import InterviewPrivacyToggle from "@/components/InterviewPrivacyToggle";

export default async function MyInterviewsPage() {
  const user = await getCurrentUser();
  const { interviews, feedbackMap } = await getUserInterviewsWithFeedback(user?.id);
  
  // Separate interviews into completed and pending
  const completedInterviews = interviews.filter(interview => feedbackMap[interview.id]);
  const pendingInterviews = interviews.filter(interview => !feedbackMap[interview.id]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">My Interviews</h1>
          <p className="text-gray-400">View and manage all your interviews and feedback</p>
        </div>
        
        <Button asChild className="bg-orange-100 hover:bg-orange-200 text-white">
          <Link href="/interview">Create New Interview</Link>
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50">
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
        
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50">
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
        
        <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50">
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
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Interviews</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          {interviews.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {interviews.map((interview) => (
                <InterviewCard 
                  key={interview.id}
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
            <div className="grid grid-cols-1 gap-4">
              {completedInterviews.map((interview) => (
                <InterviewCard 
                  key={interview.id}
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
            <div className="grid grid-cols-1 gap-4">
              {pendingInterviews.map((interview) => (
                <InterviewCard 
                  key={interview.id}
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
    </div>
  );
}

// Interview Card Component
function InterviewCard({ interview, feedback, userId }: any) {
  const isCompleted = !!feedback;
  
  return (
    <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden hover:border-blue-100/30 transition-all">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="bg-dark-300/80 rounded-lg px-3 py-1 text-xs font-medium text-gray-300 capitalize">
              {interview.type}
            </div>
            <div className={`rounded-lg px-3 py-1 text-xs font-medium ${
              isCompleted ? "bg-green-500/20 text-green-400" : "bg-orange-100/20 text-orange-100"
            }`}>
              {isCompleted ? "Completed" : "Pending"}
            </div>
          </div>
          <div className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true })}
          </div>
        </div>
        
        <h3 className="text-lg font-medium text-white mb-2 capitalize">{interview.role} Interview</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {interview.techstack?.map((tech: string, index: number) => (
            <span key={index} className="bg-dark-300/50 rounded-full px-2 py-1 text-xs text-gray-300">
              {tech}
            </span>
          ))}
        </div>
        
        {feedback && (
          <div className="mt-4 pt-4 border-t border-dark-300/50">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium text-white">Overall Score</h4>
              <div className="text-lg font-bold text-orange-100">{feedback.totalScore}/100</div>
            </div>
            
            <div className="space-y-2">
              {feedback.categoryScores && typeof feedback.categoryScores === 'object' && Object.entries(feedback.categoryScores).map(([category, score]: [string, any]) => {
                // Skip if score is an object instead of a number
                if (typeof score === 'object') return null;
                
                return (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 capitalize">{category.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span className="text-xs font-medium text-gray-300">{typeof score === 'number' ? `${score}/100` : 'N/A'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-6 border-t border-dark-300/50 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <InterviewPrivacyToggle 
              interviewId={interview.id}
              userId={userId}
              isPublic={interview.isPublic || false}
            />
          </div>
          
          <div className="flex space-x-3">
            {isCompleted ? (
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href={`/interview/${interview.id}/feedback`}>View Feedback</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline" className="text-xs">
                <Link href={`/interview/${interview.id}`}>Continue Interview</Link>
              </Button>
            )}
          </div>
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
