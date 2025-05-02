import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";

import { cn } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const typeColors = {
    Behavioral: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
          <circle cx="12" cy="11" r="3"></circle>
          <path d="M17.5 15.5L19 19H5l1.5-3.5"></path>
        </svg>
      )
    },
    Mixed: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      )
    },
    Technical: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
      )
    }
  };

  const typeColor = typeColors[normalizedType as keyof typeof typeColors] || typeColors.Mixed;
  
  // Format date to relative time (e.g., "2 days ago")
  const relativeDate = formatDistanceToNow(new Date(feedback?.createdAt || createdAt || Date.now()), { addSuffix: true });
  
  // Format absolute date
  const absoluteDate = dayjs(feedback?.createdAt || createdAt || Date.now()).format("MMM D, YYYY");

  return (
    <div className="w-full overflow-hidden bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm hover:shadow-lg transition-all hover:border-primary-200/30">
      <div className="p-5">
        {/* Header with Role and Type */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-white capitalize">{role} Interview</h3>
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${typeColor.bg} ${typeColor.text} text-xs font-medium`}>
            {typeColor.icon}
            {normalizedType}
          </div>
        </div>
        
        {/* Tech Stack */}
        <div className="mb-4">
          <DisplayTechIcons techStack={techstack} />
        </div>
        
        {/* Date & Score */}
        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span title={absoluteDate}>{relativeDate}</span>
          </div>
          
          {feedback && (
            <div className="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className={`font-medium ${Number(feedback.totalScore) >= 70 ? 'text-green-400' : Number(feedback.totalScore) >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                {feedback.totalScore}/100
              </span>
            </div>
          )}
        </div>

        {/* Feedback or Placeholder Text */}
        <div className="mb-5">
          <p className="text-gray-300 text-sm line-clamp-2">
            {feedback?.finalAssessment ||
              "You haven't taken this interview yet. Take it now to improve your skills."}
          </p>
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="bg-dark-300/80 p-3 flex items-center justify-between border-t border-dark-300/50">
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full ${feedback ? 'bg-primary-200/20' : 'bg-green-500/20'} flex items-center justify-center mr-2`}>
            {feedback ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-400">{feedback ? 'Completed' : 'Ready to start'}</span>
        </div>
        
        <Link 
          href={feedback ? `/interview/${interviewId}/feedback` : `/interview/${interviewId}`}
          className={`text-xs ${feedback ? 'text-primary-200 hover:text-primary-100' : 'text-green-400 hover:text-green-300'} transition-colors font-medium`}
        >
          {feedback ? "View Feedback" : "Start Practice"}
        </Link>
      </div>
    </div>
  );
};

export default InterviewCard;
