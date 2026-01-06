import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { PLANS, PlanType } from "@/lib/stripe";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import CheckoutButton from "@/components/CheckoutButton";
import SubscriptionStatus from "@/components/SubscriptionStatus";
import BillingHistory from "@/components/BillingHistory";

const BillingPage = async () => {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Billing & Subscription</h1>
        <p className="text-gray-400">Manage your subscription and payment methods</p>
      </div>
      
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Current Plan Section */}
        <div className="lg:col-span-4">
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-dark-300/50">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 16l-4-4 4-4"></path>
                  <path d="M4 8l4 4-4 4"></path>
                  <path d="M16 4l-8 16"></path>
                </svg>
                Current Plan
              </h2>
            </div>
            
            <div className="p-6">
              <SubscriptionStatus userId={user?.id || ""} />
            </div>
          </div>
        </div>
        
        {/* Available Plans Section */}
        <div className="lg:col-span-8">
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden mb-8">
            <div className="p-6 border-b border-dark-300/50">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 16l-4-4 4-4"></path>
                  <path d="M4 8l4 4-4 4"></path>
                  <path d="M16 4l-8 16"></path>
                </svg>
                Available Plans
              </h2>
            </div>
            
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Free Plan */}
                <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl border border-dark-300 p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">{PLANS.FREE.name} Plan</h3>
                    <p className="text-gray-300 text-sm mb-4">Get started for free</p>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-bold text-white">${PLANS.FREE.price}</span>
                      <span className="text-sm text-gray-300 ml-1">/month</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {PLANS.FREE.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-400 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button className="w-full bg-dark-400 hover:bg-dark-500 text-white" disabled>
                      Current Plan
                    </Button>
                  </div>
                </div>

                {/* Standard Plan */}
                <div className="bg-dark-300/50 backdrop-blur-sm rounded-xl border border-dark-300 p-6 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">{PLANS.STANDARD.name} Plan</h3>
                    <p className="text-gray-300 text-sm mb-4">For regular practice</p>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-bold text-white">${PLANS.STANDARD.price}</span>
                      <span className="text-sm text-gray-300 ml-1">/month</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {PLANS.STANDARD.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <CheckoutButton priceId={PLANS.STANDARD.stripePriceId} userEmail={user.email} />
                  </div>
                  
                  <div className="absolute top-0 right-0 h-24 w-24 -mr-8 -mt-8 bg-primary-200/10 rounded-full blur-xl"></div>
                </div>
                
                {/* Professional Plan */}
                <div className="bg-gradient-to-br from-primary-200/30 to-primary-400/20 backdrop-blur-sm rounded-xl border border-primary-300/30 p-6 relative overflow-hidden">
                  <div className="absolute top-3 right-3">
                    <span className="bg-primary-200 text-dark-100 text-xs px-2.5 py-1 rounded-full font-medium">BEST VALUE</span>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white mb-2">{PLANS.PROFESSIONAL.name} Plan</h3>
                    <p className="text-gray-300 text-sm mb-4">For serious job seekers</p>
                    
                    <div className="flex items-baseline mb-6">
                      <span className="text-3xl font-bold text-white">${PLANS.PROFESSIONAL.price}</span>
                      <span className="text-sm text-gray-300 ml-1">/month</span>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {PLANS.PROFESSIONAL.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <CheckoutButton 
                      priceId={PLANS.PROFESSIONAL.stripePriceId}
                      userEmail={user.email}
                      className="w-full bg-gradient-to-r from-primary-200 to-primary-300 hover:from-primary-300 hover:to-primary-400 text-dark-100 font-medium py-2.5"
                    >
                      Upgrade to Professional
                    </CheckoutButton>
                  </div>
                  
                  <div className="absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 bg-primary-200/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Payment Methods Section */}
          <div className="bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-dark-300/50">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" x2="23" y1="10" y2="10"></line>
                </svg>
                Billing
              </h2>
            </div>
            
            <div className="p-6">
              <BillingHistory userId={user?.id || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
