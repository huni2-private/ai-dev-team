// Design Ref: §5.3 PersonaCard — 역할 + canDo/cannotDo 미리보기

import Link from "next/link";
import type { PersonaRecord } from "@/types/aidev";
import { PERSONA_LABELS } from "@/types/aidev";
import { Badge } from "@/components/ui/Badge";

interface Props {
  persona: PersonaRecord;
}

export function PersonaCard({ persona }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-400 transition-colors group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="role" value={persona.role} />
            {persona.isDefault && (
              <span className="text-xs text-gray-400">기본 제공</span>
            )}
          </div>
          <Link href={`/personas/${persona._id}`}>
            <h3 className="font-semibold text-gray-900 group-hover:underline">
              {persona.displayName}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">
            {PERSONA_LABELS[persona.role]}
          </p>
        </div>
        <Link
          href={`/personas/${persona._id}`}
          className="text-xs text-gray-400 hover:text-gray-700 shrink-0"
        >
          편집 →
        </Link>
      </div>

      {persona.canDo.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-gray-500 mb-1">할 수 있는 것</p>
          <ul className="space-y-0.5">
            {persona.canDo.slice(0, 3).map((item, i) => (
              <li key={i} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
            {persona.canDo.length > 3 && (
              <li className="text-xs text-gray-400">+{persona.canDo.length - 3}개 더</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
