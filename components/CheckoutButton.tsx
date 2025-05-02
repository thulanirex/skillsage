"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";

interface CheckoutButtonProps {
  priceId: string;
  userEmail: string;
  children?: React.ReactNode;
  className?: string;
}

const CheckoutButton = ({ priceId, userEmail, children, className }: CheckoutButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      
      // Create checkout session on the server
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId, userEmail }),
      });
      
      const data = await response.json();
      
      if (data.url) {
        // Redirect to the checkout URL
        window.location.href = data.url;
      } else {
        console.error("Failed to create checkout session:", data.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout} 
      disabled={isLoading}
      className={className || "w-full bg-primary-200 hover:bg-primary-300 text-dark-100 font-medium"}
    >
      {isLoading ? "Loading..." : (children || "Subscribe Now")}
    </Button>
  );
};

export default CheckoutButton;
