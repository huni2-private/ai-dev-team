// Design Ref: §5.1 /projects/[id]/connect — 연동 config 생성 & 다운로드
// Plan SC: FR-10 연동 config 생성 & 다운로드

import Link from "next/link";
import { notFound } from "next/navigation";
import { db as bkend } from "@/lib/db";
import { generateAiDevConfig } from "@/lib/config-generator";
import { DEFAULT_PERSONAS } from "@/lib/default-personas";
import { ConfigGenerator } from "@/components/connect/ConfigGenerator";
import { IntegrationGuide } from "@/components/connect/IntegrationGuide";
import type { PersonaRecord, PersonaRole } from "@/types/aidev";

function defaultPersonasAsRecords(): PersonaRecord[] {
  return DEFAULT_PERSONAS.map((p, i) => ({
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
  }));
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ConnectPage({ params }: Props) {
  const { id } = await params;

  if (!bkend.isConfigured) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <Link href={`/projects/${id}`} className="text-sm text-gray-400 hover:text-gray-600">
            ← 프로젝트 상세
          </Link>
          <h1 className="text-2xl font-bold mt-3">연동 Config</h1>
        </div>
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-5 py-4 text-sm text-amber-800">
          <p className="font-semibold mb-1">bkend.ai 연결이 필요합니다</p>
          <p>
            .env.local에 <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code>과{" "}
            <code className="font-mono bg-amber-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code>를 설정한 후 서버를 재시작하세요.
          </p>
        </div>
      </div>
    );
  }

  let project;
  try {
    const res = await bkend.projects.get(id);
    project = res.data;
  } catch {
    notFound();
  }

  // activePersonas가 비어있으면 현재 단계 담당 페르소나 기본 선택
  if (project.activePersonas.length === 0) {
    const phasePersonaMap: Record<string, PersonaRole> = {
      plan: "pm",
      design: "techlead",
      implement: "dev",
      verify: "qa",
      deploy: "devops",
      maintain: "devops",
    };
    project.activePersonas = [phasePersonaMap[project.sdlcPhase] ?? "dev"];
  }

  let personas: PersonaRecord[];
  try {
    const personasRes = await bkend.personas.list();
    personas = personasRes.data.length > 0 ? personasRes.data : defaultPersonasAsRecords();
  } catch {
    personas = defaultPersonasAsRecords();
  }

  const config = generateAiDevConfig(project, personas);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link href={`/projects/${id}`} className="text-sm text-gray-400 hover:text-gray-600">
          ← 프로젝트 상세
        </Link>
        <h1 className="text-2xl font-bold mt-3">연동 Config</h1>
        <p className="text-sm text-gray-500 mt-1">
          .aidev.json을 생성하고 대상 프로젝트에 복사하면 AI Dev Team을 사용할 수 있습니다.
        </p>
      </div>

      <div className="space-y-6">
        <ConfigGenerator config={config} />
        <IntegrationGuide projectName={project.name} />
      </div>
    </div>
  );
}
