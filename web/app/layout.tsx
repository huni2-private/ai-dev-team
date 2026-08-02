import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { NavLink } from "@/components/ui/NavLink";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Dev Team",
  description: "Claude Code 기반 페르소나 개발팀 프레임워크 대시보드",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body className="min-h-screen bg-parchment text-ink antialiased font-sans">
        <nav className="bg-surface-black sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-11 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" aria-hidden>
                <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill="#ffffff" />
                <text
                  x="12" y="16"
                  fontFamily="var(--font-sans)" fontSize="8" fontWeight="700"
                  fill="#000000" textAnchor="middle"
                >
                  AI
                </text>
              </svg>
              <span className="text-nav-link text-white tracking-tight">AI Dev Team</span>
            </Link>

            <div className="flex items-center gap-5">
              <NavLink href="/" exact>홈</NavLink>
              <NavLink href="/dashboard">대시보드</NavLink>
              <NavLink href="/personas">페르소나</NavLink>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
