import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css"; // Import KaTeX CSS globally
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { FloatingStationery } from "@/components/effects/FloatingStationery";
import { AIChatbot } from "@/components/ai/AIChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SocraticAI - Gamified Learning Platform",
  description: "Learn, play, and grow with our gamified educational platform. Master subjects through interactive courses, quizzes, and achievements.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        <ThemeProvider>
          {/* Global floating stationery background */}
          <FloatingStationery />

          {/* Main content */}
          <main className="relative z-10">
            {children}
          </main>

          {/* Global AI Chatbot */}
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
