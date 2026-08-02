// 연동 config 생성 & 다운로드 페이지
import Link from "next/link";
import { notFound } from "next/navigation";
import { db as bkend } from "@/lib/db";
import { generateAiDevConfig } from "@/lib/config-generator";
import { DEFAULT_TEAM_PERSONAS, DEFAULT_DOMAIN_PERSONAS } from "@/lib/default-personas";
import { ConfigGenerator } from "@/components/connect/ConfigGenerator";
import { IntegrationGuide } from "@/components/connect/IntegrationGuide";
import type { PersonaRecord, PersonaRole } from "@/types/aidev";

function defaultPersonasAsRecords(): PersonaRecord[] {
  const now = new Date().toISOString();
  const team: PersonaRecord[] = DEFAULT_TEAM_PERSONAS.map((p, i) => ({
    ...p,
    _id: `default-team-${i}`,
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
  }));
  const domain: PersonaRecord[] = DEFAULT_DOMAIN_PERSONAS.map((p, i) => ({
    ...p,
    _id: `default-domain-${i}`,
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
  }));
  return [...team, ...domain];
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
          <Link href={`/projects/${id}`} className="text-caption text-ink-muted-48 hover:text-ink">
            ← 프로젝트 상세
          </Link>
          <h1 className="text-display-md text-ink mt-3">연동 Config</h1>
        </div>
        <div className="rounded-md bg-amber-50 border border-amber-200 px-5 py-4 text-caption text-amber-800">
          <p className="font-semibold mb-1">Firebase 연결이 필요합니다</p>
          <p>
            .env.local에{" "}
            <code className="font-mono bg-amber-100 px-1 rounded-xs">FIREBASE_PROJECT_ID</code>,{" "}
            <code className="font-mono bg-amber-100 px-1 rounded-xs">FIREBASE_CLIENT_EMAIL</code>,{" "}
            <code className="font-mono bg-amber-100 px-1 rounded-xs">FIREBASE_PRIVATE_KEY</code>를
            설정한 후 서버를 재시작하세요.
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
        <Link href={`/projects/${id}`} className="text-caption text-ink-muted-48 hover:text-ink">
          ← 프로젝트 상세
        </Link>
        <h1 className="text-display-md text-ink mt-3">연동 Config</h1>
        <p className="text-caption text-ink-muted-48 mt-1">
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
