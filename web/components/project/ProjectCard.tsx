// Design Ref: §5.3 ProjectCard — SDLC 단계 배지 + 프로젝트 요약

import Link from "next/link";
import type { ProjectRecord } from "@/types/aidev";
import { SDLC_PHASES, PERSONA_LABELS } from "@/types/aidev";
import { Badge } from "@/components/ui/Badge";

interface Props {
  project: ProjectRecord;
}

export function ProjectCard({ project }: Props) {
  const phaseLabel = SDLC_PHASES[project.sdlcPhase]?.label ?? project.sdlcPhase;
  const personaLabel = SDLC_PHASES[project.sdlcPhase]?.persona;
  const updatedAt = new Date(project.updatedAt).toLocaleDateString("ko-KR");

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-400 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="sdlc" value={project.sdlcPhase} />
            {personaLabel && (
              <span className="text-xs text-gray-400">{PERSONA_LABELS[personaLabel]}</span>
            )}
          </div>
          <Link href={`/projects/${project._id}`}>
            <h3 className="font-semibold text-gray-900 group-hover:underline truncate">
              {project.name}
            </h3>
          </Link>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-gray-400">
        <span>업데이트: {updatedAt}</span>
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project._id}/connect`}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            연동 Config
          </Link>
          <Link
            href={`/projects/${project._id}`}
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            상세 →
          </Link>
        </div>
      </div>
    </div>
  );
}
