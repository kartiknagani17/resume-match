import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Resume Match | AI-Powered Resume & Job Alignment",
  description:
    "Match your resume to job descriptions, get keyword suggestions, and find jobs that fit your profile — powered by Gemini AI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={jakarta.variable}>
      <body className="font-sans antialiased min-h-screen bg-white text-text-primary">
        {children}
      </body>
    </html>
  );
}
