import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "CvSU Campus Event Management System",
  description: "A comprehensive web-based system for managing campus events at Cavite State University. Built as part of ITEC 106 Final Project.",
  keywords: ["CvSU", "Cavite State University", "Campus Events", "Event Management", "ITEC 106"],
  authors: [{ name: "ITEC 106 Class" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
