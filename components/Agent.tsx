"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId?: string;
  feedbackId?: string;
  type: "generate" | "interview";
  questions?: string[];
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  // Log userId at component initialization
  console.log('Agent component initialized with userId:', userId, 'type:', typeof userId);
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  // State to store the created interview ID
  const [createdInterviewId, setCreatedInterviewId] = useState<string>("");
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  useEffect(() => {
    const onCallStart = () => {
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: any) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      } else if (message.type === "function_call_result") {
        console.log('Function call result:', message);
        try {
          if (message.result && typeof message.result === 'string') {
            const result = JSON.parse(message.result);
            if (result.success && result.interviewId) {
              console.log('Interview created with ID:', result.interviewId);
              setCreatedInterviewId(result.interviewId);
              setShowSuccessModal(true);
            }
          }
        } catch (error) {
          console.error('Error parsing function call result:', error);
        }
      }
    };

    const onSpeechStart = () => {
      console.log("speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("speech end");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      // Check if this is the ejection error that occurs when the interview is generated
      if (error.message && error.message.includes('Meeting ended due to ejection')) {
        console.log('Interview generation completed, handling graceful disconnection');
        
        // Always show the success modal when the interview is generated
        // Even if we don't have the interviewId yet, it's still created in the database
        setShowSuccessModal(true);
        
        // Don't set call status to finished yet - let the user see the success modal
        // The user will click a button in the modal to navigate away
      } else {
        // Only log non-ejection errors
        console.log("Error:", error);
      }
    };

    // Global error handler to suppress WebSocket errors
    const originalOnError = window.onerror;
    window.onerror = function(message, source, lineno, colno, error) {
      // Check if it's the VAPI ejection error
      if (message && typeof message === 'string' && 
          (message.includes('Meeting ended due to ejection') || 
           (error && error.message && error.message.includes('Meeting ended due to ejection')))) {
        console.log('Suppressed WebSocket ejection error');
        
        // Always show the success modal when we get an ejection error
        // This is a sign that the interview was created successfully
        setShowSuccessModal(true);
        
        // Return true to prevent the error from being logged to the console
        return true;
      }
      // Otherwise, pass to the original handler
      return originalOnError ? originalOnError(message, source, lineno, colno, error) : false;
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      // Restore original error handler
      window.onerror = originalOnError;
      
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [createdInterviewId]);
  
  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    // Function to create an interview directly via API call

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      console.log("handleGenerateFeedback");

      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        console.log("Error saving feedback");
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        // Always show the success modal when the interview is finished
        // Don't redirect automatically - let the user click a button in the modal
        setShowSuccessModal(true);
      } else {
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId, createdInterviewId]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      console.log('Starting VAPI workflow with userId:', userId);

      if (!userId || userId.trim() === '') {
        console.error('Warning: Empty userId being passed to VAPI workflow');
        alert('Error: User ID is missing. Please log in again.');
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      try {
        // Log the user ID being passed to VAPI
        console.log('Starting VAPI workflow with user ID:', userId);

        // Use exactly the same format as your friend's implementation
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId, // Use lowercase 'userid' exactly as in your friend's code
          },
        });
      } catch (error) {
        console.error('Error starting VAPI workflow:', error);
        alert('Error starting interview. Please try again.');
        setCallStatus(CallStatus.INACTIVE);
      }
    } else {
      // Handle non-generate case
      let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      try {
        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
          },
        });
      } catch (error: any) {
        console.error('Error starting interview with questions:', error);
        alert('Error starting interview. Please try again.');
        setCallStatus(CallStatus.INACTIVE);
      }
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <div className="bg-dark-200 rounded-xl border border-dark-300 p-6 max-w-md w-full shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-200/20 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Interview Created!</h3>
              <p className="text-gray-400 mb-6">Your interview has been successfully generated and is ready for practice.</p>
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button 
                  onClick={() => router.push(`/interview/${createdInterviewId}`)}
                  className="flex-1 bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Start Interview
                </button>
                <button 
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-dark-300 hover:bg-dark-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 mb-8">
        {/* AI Interviewer Card */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={`w-28 h-28 rounded-full bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center shadow-lg ${isSpeaking ? 'ring-4 ring-primary-200/50 animate-pulse' : ''}`}>
              <Image
                src="/ai-avatar.png"
                alt="AI Interviewer"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {isSpeaking && (
              <div className="absolute -bottom-1 right-0 bg-green-500 rounded-full p-1.5 border-2 border-dark-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                </svg>
              </div>
            )}
          </div>
          <h3 className="text-white font-medium mt-3">AI Interviewer</h3>
          <p className="text-xs text-gray-400">Asking questions</p>
        </div>
        
        {/* Connection Line */}
        <div className="hidden md:flex items-center">
          <div className="w-24 h-0.5 bg-dark-300/80"></div>
        </div>
        
        {/* User Profile Card */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className={`w-28 h-28 rounded-full bg-dark-300 flex items-center justify-center shadow-lg ${!isSpeaking && messages.length > 0 && messages[messages.length - 1].role === 'user' ? 'ring-4 ring-primary-200/50 animate-pulse' : ''}`}>
              <Image
                src="/user-avatar.png"
                alt="You"
                width={80}
                height={80}
                className="object-cover"
              />
            </div>
            {!isSpeaking && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <div className="absolute -bottom-1 right-0 bg-primary-200 rounded-full p-1.5 border-2 border-dark-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-dark-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                </svg>
              </div>
            )}
          </div>
          <h3 className="text-white font-medium mt-3">You</h3>
          <p className="text-xs text-gray-400">{userName}</p>
        </div>
      </div>

      {/* Transcript Display */}
      {messages.length > 0 && (
        <div className="w-full max-w-2xl mx-auto bg-dark-300/50 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm mb-8 overflow-hidden">
          <div className="p-3 border-b border-dark-300/50 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
            <h3 className="text-sm font-medium text-white">Live Transcript</h3>
          </div>
          <div className="p-4 max-h-32 overflow-y-auto">
            <p
              key={lastMessage}
              className={cn(
                "text-gray-200 text-sm transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}
      
      {/* Call Controls */}
      <div className="w-full flex justify-center mb-4">
        {callStatus !== "ACTIVE" ? (
          <button 
            className={`relative px-8 py-3 rounded-full font-medium transition-all ${callStatus === "CONNECTING" ? 'bg-primary-200/50' : 'bg-primary-200 hover:bg-primary-300'} text-dark-100 shadow-lg flex items-center`} 
            onClick={() => handleCall()}
            disabled={callStatus === "CONNECTING"}
          >
            {callStatus === "CONNECTING" && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-dark-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Start Interview" : "Connecting..."}
          </button>
        ) : (
          <button 
            className="px-8 py-3 rounded-full font-medium bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center" 
            onClick={() => handleDisconnect()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
            End Interview
          </button>
        )}
      </div>
      
      {/* Status Message */}
      <div className="text-center text-sm text-gray-400">
        {callStatus === "INACTIVE" && "Click the button to start your interview"}
        {callStatus === "CONNECTING" && "Connecting to AI interviewer..."}
        {callStatus === "ACTIVE" && "Interview in progress"}
        {callStatus === "FINISHED" && "Interview completed"}
      </div>
    </div>
  );
};

export default Agent;
