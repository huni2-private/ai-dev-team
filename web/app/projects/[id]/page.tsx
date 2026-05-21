// Design Ref: §5.1 /projects/[id] — 프로젝트 상세 (SDLC 현황, 연결된 페르소나)

import Link from "next/link";
import { notFound } from "next/navigation";
import { db as bkend } from "@/lib/db";
import { SdlcStatusBar } from "@/components/project/SdlcStatusBar";
import { Badge } from "@/components/ui/Badge";
import { ProjectPhaseSelect } from "@/components/project/ProjectPhaseSelect";
import { PersonaToggleList } from "@/components/persona/PersonaToggleList";
import { SDLC_PHASES } from "@/types/aidev";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  if (!bkend.isConfigured) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Supabase가 설정되지 않았습니다. .env.local에 환경 변수를 설정하세요.
        </div>
      </div>
    );
  }

  let project;
  try {
    const res = await bkend.projects.get(id);
    project = res.data;
  } catch {
    notFound();
  }

  const personasRes = await bkend.personas.list().catch(() => ({ data: [] }));
  const personas = personasRes.data;

  const currentPhaseInfo = SDLC_PHASES[project.sdlcPhase];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600">
              ← 대시보드
            </Link>
          </div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1">{project.description}</p>
          )}
          {project.gitUrl && (
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
            >
              {project.gitUrl}
            </a>
          )}
        </div>
        <Link
          href={`/projects/${id}/connect`}
          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors shrink-0"
        >
          연동 Config 생성
        </Link>
      </div>

      {/* SDLC 상태 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">SDLC 단계</h2>
        <SdlcStatusBar current={project.sdlcPhase} />
        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm text-gray-500">현재 담당:</span>
          <Badge variant="role" value={currentPhaseInfo.persona} />
        </div>
        <div className="mt-4">
          <ProjectPhaseSelect projectId={id} currentPhase={project.sdlcPhase} />
        </div>
      </div>

      {/* 페르소나 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700">활성 페르소나</h2>
          <Link href="/personas" className="text-xs text-gray-400 hover:text-gray-700">
            페르소나 관리 →
          </Link>
        </div>
        <PersonaToggleList
          projectId={id}
          allPersonas={personas}
          activePersonas={project.activePersonas}
        />
      </div>
    </div>
  );
}
