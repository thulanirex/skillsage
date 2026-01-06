"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/stripe";

interface CreditTrackerProps {
  userId: string;
  compact?: boolean;
}

interface CreditStatus {
  creditsUsed: number;
  creditsLimit: number;
  minutesUsed: number;
  plan: string;
}

const CreditTracker = ({ userId, compact = false }: CreditTrackerProps) => {
  const [creditStatus, setCreditStatus] = useState<CreditStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch(`/api/credits?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setCreditStatus({
            creditsUsed: data.creditsUsed || 0,
            creditsLimit: data.creditsLimit || 1,
            minutesUsed: data.minutesUsed || 0,
            plan: data.plan || 'FREE',
          });
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCredits();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className={`${compact ? 'p-3' : 'p-6'} bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 animate-pulse`}>
        <div className="h-4 bg-dark-300 rounded w-24 mb-2"></div>
        <div className="h-8 bg-dark-300 rounded w-16"></div>
      </div>
    );
  }

  if (!creditStatus) {
    return null;
  }

  const { creditsUsed, creditsLimit, minutesUsed, plan } = creditStatus;
  const creditsRemaining = Math.max(0, creditsLimit - creditsUsed);
  const percentUsed = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;
  const minutesRemaining = creditsRemaining * 5;
  
  const planInfo = PLANS[plan as keyof typeof PLANS] || PLANS.FREE;
  
  // Determine color based on usage
  const getProgressColor = () => {
    if (percentUsed >= 100) return 'bg-red-500';
    if (percentUsed >= 75) return 'bg-orange-500';
    if (percentUsed >= 50) return 'bg-yellow-500';
    return 'bg-primary-200';
  };

  const getTextColor = () => {
    if (percentUsed >= 100) return 'text-red-400';
    if (percentUsed >= 75) return 'text-orange-400';
    return 'text-primary-200';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-dark-200/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-dark-300/50">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${getTextColor()}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span className={`font-medium ${getTextColor()}`}>
            {creditsRemaining}/{creditsLimit}
          </span>
          <span className="text-gray-400 text-sm">credits</span>
        </div>
        <div className="w-20 h-2 bg-dark-300 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-300`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl p-6 border border-dark-300/50 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-lg ${percentUsed >= 100 ? 'bg-red-500/20' : 'bg-primary-200/20'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${getTextColor()}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h3 className="text-gray-400 font-medium">Monthly Credits</h3>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          plan === 'PROFESSIONAL' ? 'bg-primary-200/20 text-primary-200' :
          plan === 'STANDARD' ? 'bg-blue-500/20 text-blue-400' :
          'bg-gray-500/20 text-gray-400'
        }`}>
          {planInfo.name}
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-bold ${getTextColor()}`}>{creditsRemaining}</span>
          <span className="text-gray-400">/ {creditsLimit} credits remaining</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {minutesRemaining} minutes of interview time left
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full h-3 bg-dark-300 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{creditsUsed} used</span>
          <span>{Math.round(percentUsed)}% of limit</span>
        </div>
      </div>

      {/* Warning or upgrade prompt */}
      {percentUsed >= 100 ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>You've used all your credits this month</span>
          </div>
        </div>
      ) : percentUsed >= 75 ? (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 text-orange-400 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span>Running low on credits</span>
          </div>
        </div>
      ) : null}

      {plan === 'FREE' && (
        <Link 
          href="/billing" 
          className="block w-full text-center bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          Upgrade for More Credits
        </Link>
      )}

      {plan !== 'FREE' && percentUsed >= 100 && (
        <Link 
          href="/billing" 
          className="block w-full text-center bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium rounded-lg px-4 py-2.5 transition-colors"
        >
          Upgrade Plan
        </Link>
      )}
    </div>
  );
};

export default CreditTracker;
