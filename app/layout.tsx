import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import { Inter } from "next/font/google";

import "./globals.css";

const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSage",
  description: "Master Your Interview Skills with AI-Powered Practice",
  icons: {
    icon: "/skillsage-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${monaSans.className} ${inter.className} antialiased pattern`}>
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
