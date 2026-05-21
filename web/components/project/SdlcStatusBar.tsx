// Design Ref: §5.3 SdlcStatusBar — Plan→Design→Implement→Verify→Deploy→Maintain 시각화

import { clsx } from "clsx";
import type { SdlcPhase } from "@/types/aidev";
import { SDLC_PHASES } from "@/types/aidev";

const PHASES_ORDER: SdlcPhase[] = [
  "plan",
  "design",
  "implement",
  "verify",
  "deploy",
  "maintain",
];

interface Props {
  current: SdlcPhase;
}

export function SdlcStatusBar({ current }: Props) {
  const currentIdx = PHASES_ORDER.indexOf(current);

  return (
    <div className="flex items-center gap-0">
      {PHASES_ORDER.map((phase, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        const isLast = idx === PHASES_ORDER.length - 1;

        return (
          <div key={phase} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={clsx(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  isActive
                    ? "bg-black text-white border-black"
                    : isDone
                    ? "bg-gray-700 text-white border-gray-700"
                    : "bg-white text-gray-400 border-gray-300"
                )}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                className={clsx(
                  "text-xs whitespace-nowrap",
                  isActive ? "font-semibold text-black" : "text-gray-400"
                )}
              >
                {SDLC_PHASES[phase].label}
              </span>
            </div>
            {!isLast && (
              <div
                className={clsx(
                  "h-0.5 w-8 -mt-4",
                  idx < currentIdx ? "bg-gray-700" : "bg-gray-200"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
