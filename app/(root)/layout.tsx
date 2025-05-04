// app/(root)/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import UserProfileDropdown from "@/components/UserProfileDropdown";
import SidebarNav from "@/components/SidebarNav";
import MobileNav from "@/components/MobileNav";
import TextLogo from "@/components/TextLogo";

// We'll use icon names as strings instead of importing the components directly
// This avoids the server component to client component serialization issue

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  
  const user = await getCurrentUser();

  // Navigation items for the sidebar with string icon names
  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Generate Interview", href: "/interview", icon: "MessageSquare" },
    { name: "My Interviews", href: "/my-interviews", icon: "FolderOpen" },
    { name: "Profile", href: "/profile", icon: "Users" },
    { name: "Billing", href: "/billing", icon: "CreditCard" },
    { name: "Settings", href: "/settings", icon: "Settings" },
  ];

  return (
    <div className="flex h-screen bg-dark-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-gradient-to-b from-dark-300 to-dark-200 border-r border-dark-300/50 shadow-xl">
          {/* Logo */}
          <div className="flex items-center justify-center px-4 mb-10">
            <Link href="/dashboard" className="flex items-center">
              <TextLogo />
            </Link>
          </div>
          
          {/* Divider */}
          <div className="mx-6 mb-6 border-b border-dark-300/60"></div>
          
          {/* Navigation Links - Using SidebarNav component */}
          <SidebarNav items={navItems} />
          
          {/* Divider before user profile */}
          <div className="mx-6 mt-auto mb-4 border-b border-dark-300/60"></div>
          
          {/* Logout Button */}
          <form action="/api/auth/signout" method="post" className="px-6 mb-6">
            <button 
              type="submit" 
              className="flex items-center w-full px-4 py-3.5 rounded-lg text-red-400 hover:bg-dark-300/70 hover:text-red-300 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-md mr-3 bg-red-500/20 text-red-400 group-hover:text-red-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" x2="9" y1="12" y2="12" />
                </svg>
              </div>
              <span>Log Out</span>
            </button>
          </form>
          
          {/* User Profile Section */}
          <div className="mx-6 mb-6 p-3 rounded-xl bg-dark-300/50 backdrop-blur-sm shadow-inner">
            {user && (
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center text-dark-100 font-bold text-lg shadow-md">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div className="ml-3 flex-1 truncate">
                  <p className="text-sm font-medium text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-200 truncate">{user.email}</p>
                </div>
                <button className="p-2 rounded-md hover:bg-dark-200 transition-colors" title="Settings">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Header & Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Navigation - Using MobileNav component */}
        <MobileNav items={navItems} user={user} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-dark-100">
          <div className="py-6 px-6 sm:px-10">
            <div className="max-w-7xl mx-auto">
              {/* Page content container with subtle styling */}
              <div className="bg-dark-200/50 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-dark-300/30">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;