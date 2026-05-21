// Design Ref: §5.1 /personas — 페르소나 목록

import Link from "next/link";
import { db as bkend } from "@/lib/db";
import { DEFAULT_PERSONAS } from "@/lib/default-personas";
import { PersonaCard } from "@/components/persona/PersonaCard";
import type { PersonaRecord } from "@/types/aidev";

export default async function PersonasPage() {
  let personas: PersonaRecord[] = [];
  let isConfigured = bkend.isConfigured;

  if (isConfigured) {
    try {
      const res = await bkend.personas.list();
      personas = res.data;
    } catch {
      isConfigured = false;
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">페르소나</h1>
          <p className="text-sm text-gray-500 mt-1">
            역할별 AI 전문가 페르소나를 관리합니다.
          </p>
        </div>
        <Link
          href="/personas/new"
          className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
        >
          + 페르소나 추가
        </Link>
      </div>

      {!isConfigured && (
        <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Supabase가 설정되지 않아 기본 페르소나 템플릿을 표시합니다.
        </div>
      )}

      {isConfigured && personas.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <p className="text-gray-400 text-sm">페르소나가 없습니다.</p>
          <Link
            href="/personas/new"
            className="mt-4 inline-block px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
          >
            첫 페르소나 만들기
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isConfigured
          ? personas.map((p) => <PersonaCard key={p._id} persona={p} />)
          : DEFAULT_PERSONAS.map((p, i) => (
              <PersonaCard
                key={i}
                persona={{
                  _id: `default-${i}`,
                  role: p.role,
                  displayName: p.displayName,
                  systemPrompt: p.systemPrompt,
                  canDo: p.canDo,
                  cannotDo: p.cannotDo,
                  delegateTo: p.delegateTo,
                  isDefault: true,
                  createdBy: "system",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                }}
              />
            ))}
      </div>
    </div>
  );
}
