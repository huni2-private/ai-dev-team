// Design Ref: §5.1 Project Detail — SDLC 단계 변경 버튼

"use client";

import { useTransition } from "react";
import { updateProjectPhase } from "@/app/actions";
import type { SdlcPhase } from "@/types/aidev";
import { SDLC_PHASES } from "@/types/aidev";

const PHASES_ORDER = Object.keys(SDLC_PHASES) as SdlcPhase[];

interface Props {
  projectId: string;
  currentPhase: SdlcPhase;
}

export function ProjectPhaseSelect({ projectId, currentPhase }: Props) {
  const [isPending, startTransition] = useTransition();
  const currentIdx = PHASES_ORDER.indexOf(currentPhase);
  const nextPhase = PHASES_ORDER[currentIdx + 1] as SdlcPhase | undefined;

  function handleAdvance() {
    if (!nextPhase) return;
    startTransition(() => {
      updateProjectPhase(projectId, nextPhase);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <select
        disabled={isPending}
        defaultValue={currentPhase}
        onChange={(e) => {
          startTransition(() => {
            updateProjectPhase(projectId, e.target.value as SdlcPhase);
          });
        }}
        className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white disabled:opacity-50"
      >
        {PHASES_ORDER.map((phase) => (
          <option key={phase} value={phase}>
            {SDLC_PHASES[phase].label}
          </option>
        ))}
      </select>

      {nextPhase && (
        <button
          onClick={handleAdvance}
          disabled={isPending}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {isPending ? "저장 중..." : `→ ${SDLC_PHASES[nextPhase].label} 진행`}
        </button>
      )}
    </div>
  );
}
