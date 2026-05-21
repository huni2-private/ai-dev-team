// Design Ref: §5.1 /personas/[id] — 페르소나 편집

import { notFound } from "next/navigation";
import { db as bkend } from "@/lib/db";
import { updatePersona, deletePersona } from "@/app/actions";
import { PersonaForm } from "@/components/persona/PersonaForm";
import { Badge } from "@/components/ui/Badge";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PersonaEditPage({ params }: Props) {
  const { id } = await params;

  if (!bkend.isConfigured) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          Supabase가 설정되지 않았습니다.
        </div>
      </div>
    );
  }

  let persona;
  try {
    const res = await bkend.personas.get(id);
    persona = res.data;
  } catch {
    notFound();
  }

  const boundUpdate = updatePersona.bind(null, id);
  const boundDelete = deletePersona.bind(null, id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <a href="/personas" className="text-sm text-gray-400 hover:text-gray-600">
          ← 페르소나 목록
        </a>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-2xl font-bold">{persona.displayName}</h1>
          <Badge variant="role" value={persona.role} />
          {persona.isDefault && (
            <span className="text-xs text-gray-400">기본 제공</span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
        <PersonaForm
          defaultValues={persona}
          action={boundUpdate}
          submitLabel="저장"
        />
      </div>

      {!persona.isDefault && (
        <form action={boundDelete}>
          <button
            type="submit"
            className="text-sm text-red-600 hover:text-red-800 hover:underline"
          >
            이 페르소나 삭제
          </button>
        </form>
      )}
    </div>
  );
}
