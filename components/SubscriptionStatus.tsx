"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PLANS } from "@/lib/stripe";

interface SubscriptionStatusProps {
  userId: string;
}

const SubscriptionStatus = ({ userId }: SubscriptionStatusProps) => {
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [remainingInterviews, setRemainingInterviews] = useState(0);
  const [percentUsed, setPercentUsed] = useState(0);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/subscription');
        const result = await response.json();
        
        if (result.success) {
          setSubscription(result.subscription);
          setRemainingInterviews(result.remainingInterviews);
          
          // Calculate percentage used
          const total = result.subscription.interviewsLimit || PLANS.FREE.maxInterviews;
          const used = result.subscription.interviewsUsed || 0;
          setPercentUsed(Math.min(Math.round((used / total) * 100), 100));
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubscription();
    }
  }, [userId]);

  const handleManageSubscription = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error accessing billing portal:", error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-200"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl border border-dark-300 p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">
                {subscription?.plan || "FREE"} Plan
              </h3>
              <p className="text-sm text-gray-400">
                {subscription?.status === "active"
                  ? "Active subscription"
                  : subscription?.status === "canceled"
                  ? "Canceled subscription"
                  : "Free tier"}
              </p>
            </div>
            
            {subscription?.plan !== "FREE" && (
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                subscription?.status === "active" 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-amber-500/20 text-amber-400"
              }`}>
                {subscription?.status === "active" ? "ACTIVE" : subscription?.status.toUpperCase()}
              </div>
            )}
          </div>
          
          {/* Usage Statistics */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-300">Interviews Used</span>
              <span className="text-white font-medium">
                {subscription?.interviewsUsed || 0} / {subscription?.interviewsLimit || PLANS.FREE.maxInterviews}
              </span>
            </div>
            <Progress value={percentUsed} className="h-2 bg-dark-400" indicatorClassName="bg-primary-200" />
            
            <p className="text-xs text-gray-400 mt-1">
              {remainingInterviews} {remainingInterviews === 1 ? "interview" : "interviews"} remaining this month
            </p>
          </div>
          
          {/* Plan Features */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-white mb-3">Plan Features</h4>
            <ul className="space-y-2">
              {PLANS[(subscription?.plan as keyof typeof PLANS) || "FREE"].features.map((feature: string, index: number) => (
                <li key={index} className="flex items-start text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary-200 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {subscription?.plan === "FREE" ? (
              <Button 
                onClick={() => window.location.href = "/billing"} 
                className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium"
              >
                Upgrade Plan
              </Button>
            ) : (
              <Button 
                onClick={handleManageSubscription} 
                className="bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium"
              >
                Manage Subscription
              </Button>
            )}
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 bg-primary-200/10 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default SubscriptionStatus;
