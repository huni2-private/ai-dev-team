// Design Ref: §4.2 GET /api/config/[projectId] — .aidev.json 생성 & 반환
// Plan SC: FR-10 연동 config 생성 & 다운로드

import { NextResponse } from "next/server";
import { db as bkend } from "@/lib/db";
import { generateAiDevConfig } from "@/lib/config-generator";
import type { PersonaRecord, PersonaRole } from "@/types/aidev";
import { DEFAULT_PERSONAS } from "@/lib/default-personas";

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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  if (!bkend.isConfigured) {
    return NextResponse.json(
      { error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." },
      { status: 503 }
    );
  }

  try {
    const projectRes = await bkend.projects.get(projectId);
    const project = projectRes.data;

    let personas: PersonaRecord[];
    try {
      const personasRes = await bkend.personas.list();
      personas = personasRes.data.length > 0 ? personasRes.data : defaultPersonasAsRecords();
    } catch {
      personas = defaultPersonasAsRecords();
    }

    // 프로젝트에 activePersonas가 없으면 현재 단계 담당 페르소나만 활성화
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

    const config = generateAiDevConfig(project, personas);

    return NextResponse.json(config, {
      headers: {
        "Content-Disposition": `attachment; filename=".aidev.json"`,
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Config generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
