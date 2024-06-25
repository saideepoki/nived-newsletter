"use client"

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/helpers/AuthProvider";
import { Toaster } from "@/components/ui/toaster"
import { BackgroundBeams } from "@/components/ui/background-beams";
import Logo from "@/components/Logo";
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en" className = "dark">
      <AuthProvider>
      <body className={inter.className}>
       {pathname === '/' ? '' : <Logo/>}
      {children}
      <Toaster/>
      <BackgroundBeams className = "absolute w-screen left- 0 pointer-events-none"/>
      </body>
      </AuthProvider>
    </html>
  );
}
