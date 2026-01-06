"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/client";
import { sendEmailVerification, onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import TextLogo from "@/components/TextLogo";
import Link from "next/link";

const VerifyEmailPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setEmail(user.email);
        
        // Reload user to get latest verification status
        await user.reload();
        
        if (user.emailVerified) {
          setIsVerified(true);
          toast.success("Email verified! Redirecting...");
          setTimeout(() => {
            router.push("/billing");
          }, 1500);
        }
      } else {
        // No user, redirect to sign-in
        router.push("/sign-in");
      }
      setCheckingStatus(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Poll for verification status
  useEffect(() => {
    if (isVerified) return;

    const interval = setInterval(async () => {
      const user = auth.currentUser;
      if (user) {
        await user.reload();
        if (user.emailVerified) {
          setIsVerified(true);
          toast.success("Email verified! Redirecting...");
          clearInterval(interval);
          setTimeout(() => {
            router.push("/billing");
          }, 1500);
        }
      }
    }, 3000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [isVerified, router]);

  const handleResendEmail = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please sign in again");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error: any) {
      if (error.code === "auth/too-many-requests") {
        toast.error("Too many requests. Please wait a few minutes before trying again.");
      } else {
        toast.error("Failed to send verification email. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("Please sign in again");
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      await user.reload();
      if (user.emailVerified) {
        setIsVerified(true);
        toast.success("Email verified! Redirecting...");
        setTimeout(() => {
          router.push("/billing");
        }, 1500);
      } else {
        toast.error("Email not verified yet. Please check your inbox.");
      }
    } catch (error) {
      toast.error("Failed to check verification status.");
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-200"></div>
        <p className="text-gray-400">Checking verification status...</p>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-white">Email Verified!</h2>
        <p className="text-gray-400">Redirecting to choose your plan...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
      <div className="flex items-center justify-center mb-2">
        <TextLogo />
      </div>

      <div className="w-full bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-lg overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-primary-200/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-gray-400 mb-6">
            We've sent a verification email to{" "}
            <span className="text-primary-200 font-medium">{email}</span>
          </p>

          <div className="bg-dark-300/50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-300">
              Click the link in the email to verify your account. If you don't see it, check your spam folder.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleCheckVerification}
              className="w-full bg-primary-200 hover:bg-primary-300 text-dark-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </>
              ) : (
                "I've Verified My Email"
              )}
            </Button>

            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full border-dark-300 text-gray-300 hover:bg-dark-300/50"
              disabled={isLoading}
            >
              Resend Verification Email
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t border-dark-300/50">
            <p className="text-sm text-gray-500">
              Wrong email?{" "}
              <Link href="/sign-up" className="text-primary-200 hover:text-primary-100">
                Sign up again
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} SkillSage. All rights reserved.</p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
