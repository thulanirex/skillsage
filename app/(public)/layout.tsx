import { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-dark-100">

      <main className="flex-grow">
        {children}
      </main>
      
    </div>
  );
}
