"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to waitlist page
    router.replace("/waitlist");
  }, [router]);

  // Return a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-white">Redirecting to waitlist...</p>
    </div>
  );
};

export default Page;
