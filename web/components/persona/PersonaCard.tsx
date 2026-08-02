// 팀/도메인 페르소나 카드 컴포넌트
import Link from "next/link";
import type { PersonaRecord } from "@/types/aidev";
import { PERSONA_LABELS } from "@/types/aidev";
import { Badge } from "@/components/ui/Badge";

interface Props {
  persona: PersonaRecord;
}

export function PersonaCard({ persona }: Props) {
  if (persona.personaType === "domain") {
    return (
      <div className="bg-canvas rounded-lg border border-hairline p-6 hover:border-ink-muted-48 transition-colors group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight bg-purple-100 text-purple-700">
                {persona.domain}
              </span>
              {persona.isDefault && (
                <span className="text-xs text-ink-muted-48">기본 제공</span>
              )}
            </div>
            <Link href={`/personas/${persona._id}`}>
              <h3 className="text-tagline text-ink group-hover:underline">
                {persona.displayName}
              </h3>
            </Link>
            <p className="text-xs text-ink-muted-48 mt-0.5">{persona.perspective}</p>
          </div>
          <Link
            href={`/personas/${persona._id}`}
            className="text-xs text-ink-muted-48 hover:text-ink shrink-0"
          >
            편집 →
          </Link>
        </div>

        {persona.painPoints.length > 0 && (
          <div className="mt-3">
            <p className="text-xs font-medium text-ink-muted-48 mb-1">주요 페인포인트</p>
            <ul className="space-y-0.5">
              {persona.painPoints.slice(0, 3).map((item, i) => (
                <li key={i} className="text-xs text-ink-muted-80 flex items-start gap-1">
                  <span className="text-red-400 mt-0.5 shrink-0">!</span>
                  <span className="line-clamp-1">{item}</span>
                </li>
              ))}
              {persona.painPoints.length > 3 && (
                <li className="text-xs text-ink-muted-48">+{persona.painPoints.length - 3}개 더</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-canvas rounded-lg border border-hairline p-6 hover:border-ink-muted-48 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="role" value={persona.role} />
            {persona.isDefault && (
              <span className="text-xs text-ink-muted-48">기본 제공</span>
            )}
          </div>
          <Link href={`/personas/${persona._id}`}>
            <h3 className="text-tagline text-ink group-hover:underline">
              {persona.displayName}
            </h3>
          </Link>
          <p className="text-xs text-ink-muted-48 mt-0.5">{PERSONA_LABELS[persona.role]}</p>
        </div>
        <Link
          href={`/personas/${persona._id}`}
          className="text-xs text-ink-muted-48 hover:text-ink shrink-0"
        >
          편집 →
        </Link>
      </div>

      {persona.canDo.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-ink-muted-48 mb-1">할 수 있는 것</p>
          <ul className="space-y-0.5">
            {persona.canDo.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-ink-muted-80 flex items-start gap-1">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {persona.canDo.length > 3 && (
              <li className="text-xs text-ink-muted-48">+{persona.canDo.length - 3}개 더</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
