// Design Ref: §5.1 /projects/[id] — 프로젝트 상세 (SDLC 현황, 연결된 페르소나)

import Link from "next/link";
import { notFound } from "next/navigation";
import { db as bkend } from "@/lib/db";
import { SdlcStatusBar } from "@/components/project/SdlcStatusBar";
import { Badge } from "@/components/ui/Badge";
import { ProjectPhaseSelect } from "@/components/project/ProjectPhaseSelect";
import { PersonaToggleList } from "@/components/persona/PersonaToggleList";
import { ProjectDomainSelect } from "@/components/project/ProjectDomainSelect";
import { SDLC_PHASES } from "@/types/aidev";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  if (!bkend.isConfigured) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-caption text-amber-800">
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
            <Link href="/dashboard" className="text-caption text-ink-muted-48 hover:text-ink">
              ← 대시보드
            </Link>
          </div>
          <h1 className="text-display-md text-ink">{project.name}</h1>
          {project.description && (
            <p className="text-caption text-ink-muted-48 mt-1">{project.description}</p>
          )}
          {project.gitUrl && (
            <a
              href={project.gitUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline mt-1 inline-block"
            >
              {project.gitUrl}
            </a>
          )}
        </div>
        <Link
          href={`/projects/${id}/connect`}
          className="px-[22px] py-[11px] bg-primary text-white text-body rounded-full hover:bg-primary/90 active:scale-95 transition-all shrink-0"
        >
          연동 Config 생성
        </Link>
      </div>

      {/* SDLC 상태 */}
      <div className="bg-canvas rounded-lg border border-hairline p-6 mb-6">
        <h2 className="text-caption-strong text-ink-muted-80 mb-4">SDLC 단계</h2>
        <SdlcStatusBar current={project.sdlcPhase} />
        <div className="mt-4 flex items-center gap-3">
          <span className="text-caption text-ink-muted-48">현재 담당:</span>
          <Badge variant="role" value={currentPhaseInfo.persona} />
        </div>
        <div className="mt-4">
          <ProjectPhaseSelect projectId={id} currentPhase={project.sdlcPhase} />
        </div>
      </div>

      {/* 팀 페르소나 */}
      <div className="bg-canvas rounded-lg border border-hairline p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-caption-strong text-ink-muted-80">팀 페르소나</h2>
            <p className="text-xs text-ink-muted-48 mt-0.5">SDLC 각 단계의 담당 역할을 활성화합니다.</p>
          </div>
          <Link href="/personas" className="text-xs text-ink-muted-48 hover:text-ink">
            페르소나 관리 →
          </Link>
        </div>
        <PersonaToggleList
          projectId={id}
          allPersonas={personas}
          activePersonas={project.activePersonas}
        />
      </div>

      {/* 도메인 페르소나 */}
      <div className="bg-canvas rounded-lg border border-hairline p-6">
        <div className="mb-4">
          <h2 className="text-caption-strong text-ink-muted-80">도메인 컨텍스트</h2>
          <p className="text-xs text-ink-muted-48 mt-0.5">
            이 프로젝트가 속한 업무 맥락을 선택합니다. 선택한 도메인의 이해관계자 페르소나가 Config에 포함됩니다.
          </p>
        </div>
        <ProjectDomainSelect projectId={id} domains={project.domains} />
      </div>
    </div>
  );
}
