import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Dev Team",
  description: "Claude Code 기반 페르소나 개발팀 프레임워크 대시보드",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <nav className="border-b bg-white sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-bold text-sm tracking-tight">
              AI Dev Team
            </Link>
            <div className="flex items-center gap-6 text-sm">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                프로젝트
              </Link>
              <Link
                href="/personas"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                페르소나
              </Link>
              <Link
                href="/login"
                className="px-3 py-1.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                로그인
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
