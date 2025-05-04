"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { addToWaitlist } from "@/lib/actions/waitlist.action";

export default function WaitlistPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to Firebase using the server action
      const result = await addToWaitlist({ name, email });
      
      if (result.success) {
        setIsSubmitted(true);
        toast.success("Thank you for joining our waitlist!");
      } else {
        // Handle specific error cases
        if (result.message.includes("already exists")) {
          toast.info("This email is already on our waitlist.");
        } else {
          toast.error(result.message || "Something went wrong. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error submitting to waitlist:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="w-full max-w-md space-y-8 bg-dark-200/60 backdrop-blur-sm rounded-xl border border-dark-300/50 p-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Join Our Waitlist</h1>
          <p className="text-gray-300 mb-6">
            We're currently in private beta. Join our waitlist to get early access when spots become available.
          </p>
        </div>

        {isSubmitted ? (
          <div className="space-y-6">
            <div className="bg-primary-200/20 rounded-lg p-4">
              <p className="text-white">
                Thank you for joining our waitlist! We'll notify you when you're granted access.
              </p>
            </div>
            <Link 
              href="/"
              className="block w-full bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium rounded-lg px-4 py-3 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 text-left mb-1">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-transparent text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 text-left mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-300 border border-dark-400 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-transparent text-white"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium rounded-lg px-4 py-3 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </button>
          </form>
        )}
        
        <div className="mt-4">
          <p className="text-sm text-gray-400">
            Already have access? <Link href="/sign-in" className="text-primary-200 hover:text-primary-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
