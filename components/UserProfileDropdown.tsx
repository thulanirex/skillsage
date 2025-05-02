"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { auth } from "@/firebase/client";
import { signOut as firebaseSignOut } from "firebase/auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserProfileDropdownProps = {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
};

const UserProfileDropdown = ({ user }: UserProfileDropdownProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      
      // Call server-side signOut API first
      await fetch('/api/auth/signout', { 
        method: 'POST',
        credentials: 'include'
      });
      
      // Then sign out from Firebase client
      await firebaseSignOut(auth);

      toast.success("Signed out successfully");
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-all duration-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-r from-primary-200 to-primary-300 flex items-center justify-center text-white font-medium shadow-md">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <span className="text-sm font-medium hidden md:block text-white">{user.name}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-light-300 hidden md:block"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-dark-200 border border-dark-300 shadow-xl rounded-lg p-1">
        <div className="px-2 py-1.5 mb-1">
          <p className="text-sm font-medium text-white">{user.name}</p>
          <p className="text-xs text-light-400 truncate">{user.email}</p>
        </div>
        <DropdownMenuSeparator className="bg-dark-300" />
        <DropdownMenuItem asChild className="focus:bg-dark-300 rounded-md">
          <Link href="/profile" className="cursor-pointer px-2 py-1.5 text-light-300 hover:text-white">
            <div className="flex items-center gap-2 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Profile</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-dark-300 rounded-md">
          <Link href="/settings" className="cursor-pointer px-2 py-1.5 text-light-300 hover:text-white">
            <div className="flex items-center gap-2 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <span>Settings</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-dark-300 rounded-md">
          <Link href="/billing" className="cursor-pointer px-2 py-1.5 text-light-300 hover:text-white">
            <div className="flex items-center gap-2 w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-100">
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
              <span>Billing</span>
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-dark-300" />
        <DropdownMenuItem 
          onClick={handleSignOut} 
          disabled={isLoading} 
          className="cursor-pointer px-2 py-1.5 text-destructive-100 hover:text-white hover:bg-destructive-100/10 focus:bg-destructive-100/10 rounded-md"
        >
          <div className="flex items-center gap-2 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            <span>{isLoading ? "Signing out..." : "Sign out"}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileDropdown;
