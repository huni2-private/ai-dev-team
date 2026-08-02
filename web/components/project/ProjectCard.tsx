import Link from "next/link";
import type { ProjectRecord, PersonaRole } from "@/types/aidev";
import { SDLC_PHASES, PERSONA_LABELS } from "@/types/aidev";
import { Badge } from "@/components/ui/Badge";

const ROLE_SHORT: Record<PersonaRole, string> = {
  pm: "PM",
  techlead: "TL",
  dev: "Dev",
  qa: "QA",
  devops: "Ops",
};

interface Props {
  project: ProjectRecord;
}

export function ProjectCard({ project }: Props) {
  const currentPersonaRole = SDLC_PHASES[project.sdlcPhase]?.persona;
  const updatedAt = new Date(project.updatedAt).toLocaleDateString("ko-KR");

  const activePersonas: PersonaRole[] =
    project.activePersonas.length > 0
      ? project.activePersonas
      : currentPersonaRole
      ? [currentPersonaRole]
      : [];

  return (
    <div className="bg-canvas rounded-lg border border-hairline p-6 hover:border-ink-muted-48 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0 flex-1">
          <Link href={`/projects/${project._id}`}>
            <h3 className="text-tagline text-ink group-hover:underline truncate">
              {project.name}
            </h3>
          </Link>
          {project.description && (
            <p className="text-caption text-ink-muted-48 mt-0.5 line-clamp-1">{project.description}</p>
          )}
        </div>
        <Badge variant="sdlc" value={project.sdlcPhase} />
      </div>

      {/* 활성 페르소나 칩 */}
      {activePersonas.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {activePersonas.map((role) => {
            const isCurrent = role === currentPersonaRole;
            return (
              <span
                key={role}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-xs font-semibold transition-colors ${
                  isCurrent
                    ? "bg-ink text-white"
                    : "bg-parchment text-ink-muted-48"
                }`}
              >
                {isCurrent && <span className="text-[10px]">▶</span>}
                {ROLE_SHORT[role]}
              </span>
            );
          })}
          <span className="text-xs text-ink-muted-48 ml-0.5">
            {PERSONA_LABELS[currentPersonaRole!]} 담당
          </span>
        </div>
      )}

      <div className="flex items-center justify-between text-fine-print text-ink-muted-48 pt-3 border-t border-divider-soft">
        <span>{updatedAt}</span>
        <div className="flex items-center gap-3">
          <Link
            href={`/projects/${project._id}/connect`}
            className="text-primary hover:underline font-medium"
          >
            Config 생성
          </Link>
          <Link
            href={`/projects/${project._id}`}
            className="text-ink-muted-80 hover:text-ink font-medium"
          >
            상세 →
          </Link>
        </div>
      </div>
    </div>
  );
}
