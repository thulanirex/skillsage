"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User } from "firebase/auth";
import TextLogo from "./TextLogo";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  
  // Check if we're on a public page
  const isPublicPage = pathname === '/' || pathname === '/sign-in' || pathname === '/sign-up';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Check for user authentication
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-dark-200/80 backdrop-blur-md py-3 shadow-lg"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <TextLogo />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isPublicPage ? (
              // Public pages navigation
              <>
                <Link href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">
                  How It Works
                </Link>
                <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                  Features
                </Link>
                <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                  Pricing
                </Link>
                <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors">
                  Testimonials
                </Link>
              </>
            ) : (
              // Authenticated user navigation
              <>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/my-interviews" className="text-gray-300 hover:text-white transition-colors">
                  My Interviews
                </Link>
                <Link href="/interview" className="text-gray-300 hover:text-white transition-colors">
                  New Interview
                </Link>
              </>
            )}
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              // User is logged in
              <>
                <Link
                  href="/dashboard"
                  className="text-white hover:text-primary-100 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/api/auth/sign-out"
                  className="bg-orange-100 hover:bg-orange-200 text-white font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  Sign Out
                </Link>
              </>
            ) : (
              // User is not logged in
              <>
                <Link href="/sign-in" className="text-white hover:text-primary-100 transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-orange-100 hover:bg-orange-200 text-white font-medium rounded-lg px-4 py-2 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              {isPublicPage ? (
                // Public pages navigation for mobile
                <>
                  <Link 
                    href="#how-it-works" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    How It Works
                  </Link>
                  <Link 
                    href="#features" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Features
                  </Link>
                  <Link 
                    href="#pricing" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="#testimonials" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Testimonials
                  </Link>
                </>
              ) : (
                // Authenticated user navigation for mobile
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/my-interviews" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    My Interviews
                  </Link>
                  <Link 
                    href="/interview" 
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    New Interview
                  </Link>
                </>
              )}
              
              <div className="pt-4 flex flex-col space-y-3">
                {user ? (
                  // User is logged in (mobile)
                  <>
                    <Link 
                      href="/dashboard" 
                      className="text-white hover:text-primary-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/api/auth/sign-out"
                      className="bg-orange-100 hover:bg-orange-200 text-white font-medium rounded-lg px-4 py-2 transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Out
                    </Link>
                  </>
                ) : (
                  // User is not logged in (mobile)
                  <>
                    <Link 
                      href="/sign-in" 
                      className="text-white hover:text-primary-100 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      className="bg-orange-100 hover:bg-orange-200 text-white font-medium rounded-lg px-4 py-2 transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
