// Design Ref: §5.1 /personas/new — 페르소나 생성

import { createPersona } from "@/app/actions";
import { PersonaForm } from "@/components/persona/PersonaForm";

export default function NewPersonaPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <a href="/personas" className="text-sm text-gray-400 hover:text-gray-600">
          ← 페르소나 목록
        </a>
        <h1 className="text-2xl font-bold mt-3">새 페르소나</h1>
        <p className="text-sm text-gray-500 mt-1">
          3-파트 시스템 프롬프트로 역할을 정확히 정의하세요.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <PersonaForm action={createPersona} submitLabel="페르소나 생성" />
      </div>
    </div>
  );
}
