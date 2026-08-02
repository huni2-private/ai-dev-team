// Design Ref: §5.3 PersonaForm — 3-파트 시스템 프롬프트 편집기 (ROLE/SCOPE/GUARD)

"use client";

import { useState } from "react";

function parse(prompt: string) {
  const roleMatch = prompt.match(/^ROLE:\s*([\s\S]*?)(?=\n\nSCOPE:|$)/m);
  const scopeMatch = prompt.match(/\nSCOPE:\s*([\s\S]*?)(?=\n\nGUARD:|$)/);
  const guardMatch = prompt.match(/\nGUARD:\s*([\s\S]*?)$/);
  return {
    role: roleMatch?.[1]?.trim() ?? "",
    scope: scopeMatch?.[1]?.trim() ?? "",
    guard: guardMatch?.[1]?.trim() ?? "",
  };
}

function assemble(role: string, scope: string, guard: string) {
  return `ROLE: ${role}\n\nSCOPE: ${scope}\n\nGUARD: ${guard}`;
}

interface Props {
  defaultValue?: string;
}

export function SystemPromptEditor({ defaultValue = "" }: Props) {
  const parsed = parse(defaultValue);
  const [role, setRole] = useState(parsed.role);
  const [scope, setScope] = useState(parsed.scope);
  const [guard, setGuard] = useState(parsed.guard);

  return (
    <div className="space-y-4">
      <input type="hidden" name="systemPrompt" value={assemble(role, scope, guard)} />

      <div className="rounded-md border border-blue-200 bg-blue-50 p-4">
        <label className="block text-xs font-semibold text-blue-700 uppercase tracking-wide mb-2">
          ROLE — 역할 선언
        </label>
        <textarea
          value={role}
          onChange={(e) => setRole(e.target.value)}
          rows={2}
          className="w-full bg-canvas border border-blue-200 rounded-md px-3 py-2 text-caption text-ink font-mono focus:outline-none focus:ring-2 focus:ring-blue-400 resize-y"
          placeholder="나는 Senior Developer다. 설계 문서 기반 구현 전문가."
        />
      </div>

      <div className="rounded-md border border-purple-200 bg-purple-50 p-4">
        <label className="block text-xs font-semibold text-purple-700 uppercase tracking-wide mb-2">
          SCOPE — 담당 범위
        </label>
        <textarea
          value={scope}
          onChange={(e) => setScope(e.target.value)}
          rows={4}
          className="w-full bg-canvas border border-purple-200 rounded-md px-3 py-2 text-caption text-ink font-mono focus:outline-none focus:ring-2 focus:ring-purple-400 resize-y"
          placeholder={"할 수 있는 것:\n- 설계 문서 기반 코드 구현\n- 기술적 문제 해결\n- 코드 품질 유지"}
        />
      </div>

      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <label className="block text-xs font-semibold text-red-700 uppercase tracking-wide mb-2">
          GUARD — 역할 가드
        </label>
        <textarea
          value={guard}
          onChange={(e) => setGuard(e.target.value)}
          rows={4}
          className="w-full bg-canvas border border-red-200 rounded-md px-3 py-2 text-caption text-ink font-mono focus:outline-none focus:ring-2 focus:ring-red-400 resize-y"
          placeholder={"할 수 없는 것:\n- 아키텍처 결정 → TechLead에게 위임\n- 요구사항 변경 → PM에게 위임\n- 배포 → DevOps에게 위임"}
        />
      </div>
    </div>
  );
}
