"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as LucideIcons from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

interface SidebarNavProps {
  items: NavItem[];
}

export default function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();
  
  return (
    <nav className="flex-1 px-6 space-y-1.5">
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        // Dynamically get the icon component
        const IconComponent = LucideIcons[item.icon as keyof typeof LucideIcons] as React.ComponentType<{ className?: string }>;
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3.5 rounded-lg transition-all duration-200 group ${
              isActive 
                ? "bg-gradient-to-r from-primary-200/40 to-primary-200/20 text-white font-medium shadow-sm" 
                : "text-gray-100 hover:bg-dark-300/70 hover:text-white"
            }`}
          >
            {IconComponent && (
              <div className={`flex items-center justify-center w-8 h-8 rounded-md mr-3 transition-colors ${isActive ? "bg-primary-200/40 text-white" : "bg-dark-300/80 text-gray-100 group-hover:text-white"}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            )}
            <span>{item.name}</span>
            
            {/* Active indicator */}
            {isActive && (
              <div className="ml-auto w-1.5 h-8 bg-primary-100 rounded-full"></div>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
