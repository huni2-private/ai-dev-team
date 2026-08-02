// 페르소나 편집 페이지
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
        <div className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-caption text-amber-800">
          Firebase가 설정되지 않았습니다.
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
        <a href="/personas" className="text-caption text-ink-muted-48 hover:text-ink">
          ← 페르소나 목록
        </a>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-display-md text-ink">{persona.displayName}</h1>
          {persona.personaType === "team" ? (
            <Badge variant="role" value={persona.role} />
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-tight bg-purple-100 text-purple-700">
              {persona.domain}
            </span>
          )}
          {persona.isDefault && (
            <span className="text-xs text-ink-muted-48">기본 제공</span>
          )}
        </div>
      </div>

      <div className="bg-canvas rounded-lg border border-hairline p-6 mb-4">
        {persona.personaType === "team" ? (
          <PersonaForm
            defaultValues={persona}
            action={boundUpdate}
            submitLabel="저장"
          />
        ) : (
          <div className="text-caption text-ink-muted-48">
            도메인 페르소나 편집 폼은 준비 중입니다.
          </div>
        )}
      </div>

      {!persona.isDefault && (
        <form action={boundDelete}>
          <button
            type="submit"
            className="text-caption text-red-600 hover:text-red-800 hover:underline"
          >
            이 페르소나 삭제
          </button>
        </form>
      )}
    </div>
  );
}
