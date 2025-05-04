import { ReactNode } from "react";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { isAuthenticated } from "@/lib/actions/auth.action";
import TextLogo from "@/components/TextLogo";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-dark-100 flex flex-col md:flex-row">
      {/* Left panel with background image and branding - hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-dark-300 to-dark-200 p-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary-300/10 to-primary-400/5 opacity-50"></div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <Link href="/" className="inline-block mb-6">
              <TextLogo />
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Ace Your Next <span className="text-primary-200">Interview</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-md">
              Practice with our AI-powered interview platform and build the confidence you need to succeed.  
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-200/20 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">AI-Powered Interviews</h3>
                  <p className="text-gray-400">Practice with realistic interview scenarios tailored to your experience level.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-200/20 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Detailed Feedback</h3>
                  <p className="text-gray-400">Get personalized feedback and actionable insights to improve your interview skills.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-md">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-200/20 rounded-full p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-white">Practice Anytime</h3>
                  <p className="text-gray-400">Access our platform 24/7 and practice at your own pace, whenever you want.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center text-gray-500 text-sm pt-8">
            <p>© {new Date().getFullYear()} SkillSage. All rights reserved.</p>
          </div>
        </div>
      </div>
      
      {/* Right panel with auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
