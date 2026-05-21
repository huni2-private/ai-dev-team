// Design Ref: §5.1 Dashboard (/) — 프로젝트 목록 + SDLC 상태
// Plan SC: FR-07 대시보드 페이지

import Link from "next/link";
import { db as bkend } from "@/lib/db";
import { ProjectCard } from "@/components/project/ProjectCard";
import type { ProjectRecord } from "@/types/aidev";

export default async function DashboardPage() {
  let projects: ProjectRecord[] = [];
  let error: string | null = null;

  if (!bkend.isConfigured) {
    error =
      "Supabase 환경 변수가 설정되지 않았습니다. .env.local에 NEXT_PUBLIC_SUPABASE_URL과 SUPABASE_SERVICE_ROLE_KEY를 설정하세요.";
  } else {
    try {
      const res = await bkend.projects.list();
      projects = res.data;
    } catch (e) {
      error = e instanceof Error ? e.message : "프로젝트를 불러오지 못했습니다.";
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">AI Dev Team</h1>
          <p className="text-sm text-gray-500 mt-1">
            Claude Code 기반 페르소나 개발팀 프레임워크
          </p>
        </div>
        <Link
          href="/projects/new"
          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          + 새 프로젝트
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          <strong>Supabase 연결 필요:</strong> {error}
        </div>
      )}

      {!error && projects.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <p className="text-gray-400 text-sm">
            프로젝트가 없습니다. 첫 프로젝트를 만들어보세요.
          </p>
          <Link
            href="/projects/new"
            className="mt-4 inline-block px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            프로젝트 시작하기
          </Link>
        </div>
      )}

      {projects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
