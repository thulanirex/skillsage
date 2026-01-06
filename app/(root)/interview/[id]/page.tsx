import Image from "next/image";
import { redirect } from "next/navigation";

import Agent from "@/components/Agent";
import { getRandomInterviewCover } from "@/lib/utils";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { formatDistanceToNow } from "date-fns";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

const InterviewDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/dashboard");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 capitalize">
            {interview.role} Interview
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-gray-400">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span className="text-sm">
                {interview.createdAt 
                  ? formatDistanceToNow(new Date(interview.createdAt), { addSuffix: true })
                  : 'Recently created'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span className="text-sm capitalize">{(interview as any).level || (interview as any).experience || 'All'} level</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span className="text-sm">{interview.questions?.length || 0} questions</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-dark-300/50">
            <DisplayTechIcons techStack={interview.techstack} />
          </div>
          
          <div className="bg-primary-200/20 text-primary-100 px-4 py-2 rounded-lg border border-primary-200/30">
            {interview.type}
          </div>
        </div>
      </div>
      
      {/* Interview Instructions */}
      <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-primary-200/20 rounded-full p-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Interview Instructions</h3>
            <p className="text-gray-300 mb-4">
              You're about to start a mock interview for a {interview.role} position. 
              The AI interviewer will ask you questions based on your experience level and the selected technologies.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span className="text-gray-300">Speak clearly and at a moderate pace</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span className="text-gray-300">Structure your answers with examples (STAR method)</span>
              </li>
              <li className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"></polyline>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                </svg>
                <span className="text-gray-300">After completion, you'll receive detailed feedback on your performance</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interview Component */}
      <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-dark-300/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={getRandomInterviewCover()}
              alt="Interview"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-white">Live Interview Session</h2>
              <p className="text-gray-400 text-sm">Click the button below to begin your interview</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-2 bg-dark-300/50 rounded-lg px-3 py-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="text-sm text-gray-300">Average duration: 15-20 min</span>
          </div>
        </div>
        
        <div className="p-8">
          <Agent
            userName={user?.name!}
            userId={user?.id}
            interviewId={id}
            type="interview"
            questions={interview.questions}
            feedbackId={feedback?.id}
          />
        </div>
      </div>
    </div>
  );
};

export default InterviewDetails;