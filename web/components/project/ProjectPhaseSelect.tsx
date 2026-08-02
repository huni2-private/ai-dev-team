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
        className="border border-hairline rounded-md px-3 py-1.5 text-caption text-ink focus:outline-none focus:ring-2 focus:ring-primary-focus bg-canvas disabled:opacity-50"
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
          className="px-[15px] py-2 text-button-utility bg-ink text-white rounded-sm hover:bg-ink/90 active:scale-95 transition-all disabled:opacity-50"
        >
          {isPending ? "저장 중..." : `→ ${SDLC_PHASES[nextPhase].label} 진행`}
        </button>
      )}
    </div>
  );
}
