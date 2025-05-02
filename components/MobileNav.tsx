"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface MobileNavProps {
  items: NavItem[];
  user: any;
}

export default function MobileNav({ items, user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="bg-gradient-to-r from-dark-300 to-dark-200 shadow-lg md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center">
            <div className="bg-gradient-to-r from-primary-200 to-primary-100 rounded-lg p-1.5 mr-2 shadow-md">
              <Image src="/logo.svg" alt="SkillSage Logo" width={24} height={24} />
            </div>
            <h2 className="text-lg font-bold text-white">SkillSage</h2>
          </Link>
          
          {/* Mobile Menu Button */}
          <button 
            className="text-light-300 hover:text-primary-100 focus:outline-none"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-dark-100/80 backdrop-blur-sm"
            onClick={toggleMenu}
          ></div>
          
          {/* Side Menu */}
          <div className="fixed top-0 right-0 h-full w-72 bg-gradient-to-b from-dark-300 to-dark-200 shadow-xl p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-r from-primary-200 to-primary-100 rounded-lg p-1.5 mr-2 shadow-md">
                  <Image src="/logo.svg" alt="InterviewAce Logo" width={24} height={24} />
                </div>
                <h2 className="text-xl font-bold text-white">Menu</h2>
              </div>
              <button 
                className="text-light-300 hover:text-primary-100 focus:outline-none p-2 rounded-full hover:bg-dark-300/50 transition-colors"
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                {LucideIcons.X && <LucideIcons.X className="h-6 w-6" />}
              </button>
            </div>
            
            {/* Divider */}
            <div className="mb-6 border-b border-dark-300/60"></div>
            
            <nav className="space-y-1.5 mb-8 px-2">
              {items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-4 py-3.5 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? "bg-gradient-to-r from-primary-200/30 to-primary-100/10 text-white font-medium shadow-sm" 
                        : "text-gray-200 hover:bg-dark-300/70 hover:text-white"
                    }`}
                    onClick={toggleMenu}
                  >
                    {(() => {
                      const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
                      return IconComponent && (
                        <div className={`flex items-center justify-center w-8 h-8 rounded-md mr-3 transition-colors ${isActive ? "bg-primary-200/30 text-white" : "bg-dark-300/80 text-gray-200 group-hover:text-white"}`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                      );
                    })()} 
                    <span>{item.name}</span>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="ml-auto w-1.5 h-8 bg-primary-100 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Divider before user profile */}
            <div className="mb-4 border-b border-dark-300/60"></div>
            
            {/* User Profile in Mobile Menu */}
            {user && (
              <div className="p-3 rounded-xl bg-dark-300/50 backdrop-blur-sm shadow-inner mx-2">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-200 to-primary-100 flex items-center justify-center text-dark-100 font-bold text-lg shadow-md">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="ml-3 flex-1 truncate">
                    <p className="text-sm font-medium text-white truncate">{user.name}</p>
                    <p className="text-xs text-light-400 truncate">{user.email}</p>
                  </div>
                  <button className="p-2 rounded-md hover:bg-dark-200 transition-colors" title="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-light-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
