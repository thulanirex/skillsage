"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    
    if (!sessionId) {
      setLoading(false);
      setError("No session ID found. Please try again.");
      return;
    }

    const verifyPayment = async () => {
      try {
        setLoading(true);
        
        // Call an API to verify the payment and update the user's subscription
        const response = await fetch("/api/stripe/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setSuccess(true);
        } else {
          setError(data.error || "Failed to verify payment. Please contact support.");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setError("An unexpected error occurred. Please contact support.");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="container py-16">
      <div className="max-w-2xl mx-auto text-center">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-200"></div>
            <p className="text-lg text-gray-300">Verifying your payment...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h1 className="text-2xl font-bold text-white mb-4">Payment Verification Failed</h1>
            <p className="text-gray-300 mb-6">{error}</p>
            <Button 
              onClick={() => router.push("/billing")}
              className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium"
            >
              Return to Billing
            </Button>
          </div>
        ) : (
          <div className="bg-green-500/20 backdrop-blur-sm rounded-xl border border-green-500/30 p-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-green-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <h1 className="text-2xl font-bold text-white mb-4">Payment Successful!</h1>
            <p className="text-gray-300 mb-6">
              Thank you for your subscription. Your account has been upgraded and you now have access to all the premium features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => router.push("/dashboard")}
                className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium"
              >
                Go to Dashboard
              </Button>
              <Button 
                onClick={() => router.push("/billing")}
                className="bg-dark-300 hover:bg-dark-400 text-white"
              >
                View Subscription Details
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
