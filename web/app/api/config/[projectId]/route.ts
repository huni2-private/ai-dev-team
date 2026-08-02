// GET /api/config/[projectId] — .aidev.json 생성 & 반환
import { NextResponse } from "next/server";
import { db as bkend } from "@/lib/db";
import { generateAiDevConfig } from "@/lib/config-generator";
import { DEFAULT_TEAM_PERSONAS, DEFAULT_DOMAIN_PERSONAS } from "@/lib/default-personas";
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

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  if (!bkend.isConfigured) {
    return NextResponse.json(
      { error: "Firebase not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY." },
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
