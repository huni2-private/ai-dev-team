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
                    ? "bg-primary text-white border-primary"
                    : isDone
                    ? "bg-ink text-white border-ink"
                    : "bg-canvas text-ink-muted-48 border-hairline"
                )}
              >
                {isDone ? "✓" : idx + 1}
              </div>
              <span
                className={clsx(
                  "text-xs whitespace-nowrap",
                  isActive ? "font-semibold text-ink" : "text-ink-muted-48"
                )}
              >
                {SDLC_PHASES[phase].label}
              </span>
            </div>
            {!isLast && (
              <div
                className={clsx(
                  "h-0.5 w-8 -mt-4",
                  idx < currentIdx ? "bg-ink" : "bg-hairline"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
