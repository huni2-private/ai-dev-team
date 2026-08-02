// Design Ref: §5.1 Project Detail — 활성 페르소나 목록 (role 배지 + on/off 토글)

"use client";

import { useState, useTransition } from "react";
import { setActivePersonas } from "@/app/actions";
import type { PersonaRecord, TeamPersonaRecord, PersonaRole } from "@/types/aidev";
import { PERSONA_LABELS } from "@/types/aidev";
import { Badge } from "@/components/ui/Badge";

interface Props {
  projectId: string;
  allPersonas: PersonaRecord[];
  activePersonas: PersonaRole[];
}

export function PersonaToggleList({ projectId, allPersonas, activePersonas: initial }: Props) {
  const [active, setActive] = useState(new Set(initial));
  const [isPending, startTransition] = useTransition();

  // 팀 페르소나만 SDLC 토글 대상
  const teamPersonas = allPersonas.filter(
    (p): p is TeamPersonaRecord => p.personaType === "team"
  );

  function toggle(role: PersonaRole) {
    const next = new Set(active);
    if (next.has(role)) next.delete(role);
    else next.add(role);
    setActive(next);
    startTransition(() => {
      setActivePersonas(projectId, Array.from(next));
    });
  }

  if (teamPersonas.length === 0) {
    return (
      <p className="text-caption text-ink-muted-48">
        페르소나가 없습니다.{" "}
        <a href="/personas/new" className="text-primary hover:underline">
          페르소나 추가
        </a>
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {teamPersonas.map((persona) => {
        const isActive = active.has(persona.role);
        return (
          <div
            key={persona._id}
            className="flex items-center justify-between py-2 border-b border-divider-soft last:border-0"
          >
            <div className="flex items-center gap-2">
              <Badge variant="role" value={persona.role} />
              <span className="text-caption text-ink">{persona.displayName}</span>
              <span className="text-xs text-ink-muted-48">{PERSONA_LABELS[persona.role]}</span>
            </div>
            <button
              onClick={() => toggle(persona.role)}
              disabled={isPending}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-50 ${
                isActive ? "bg-primary" : "bg-hairline"
              }`}
              aria-label={isActive ? "비활성화" : "활성화"}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-[18px]" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        );
      })}
      {isPending && (
        <p className="text-xs text-ink-muted-48 pt-1">저장 중...</p>
      )}
    </div>
  );
}
