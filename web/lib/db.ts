// Firestore CRUD — 서버 사이드 전용
import { getDb, isConfigured } from "./firebase";
import type {
  ProjectRecord,
  PersonaRecord,
  TeamPersonaRecord,
  DomainPersonaRecord,
  ApiResponse,
  ApiListResponse,
  CreateProjectInput,
  UpdateProjectInput,
  CreatePersonaInput,
  UpdatePersonaInput,
} from "@/types/aidev";

function nowIso() {
  return new Date().toISOString();
}

function mapProject(id: string, data: FirebaseFirestore.DocumentData): ProjectRecord {
  return {
    _id: id,
    name: data.name,
    description: data.description ?? "",
    sdlcPhase: data.sdlcPhase,
    gitUrl: data.gitUrl ?? null,
    activePersonas: data.activePersonas ?? [],
    domains: data.domains ?? [],
    createdBy: data.createdBy ?? "anonymous",
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? nowIso(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? nowIso(),
  };
}

function mapPersona(id: string, data: FirebaseFirestore.DocumentData): PersonaRecord {
  if (data.personaType === "domain") {
    return {
      _id: id,
      personaType: "domain",
      domain: data.domain,
      perspective: data.perspective,
      displayName: data.displayName,
      systemPrompt: data.systemPrompt ?? "",
      painPoints: data.painPoints ?? [],
      goals: data.goals ?? [],
      isDefault: data.isDefault ?? false,
      createdBy: data.createdBy ?? "anonymous",
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? nowIso(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? nowIso(),
    } satisfies DomainPersonaRecord;
  }
  return {
    _id: id,
    personaType: "team",
    role: data.role,
    displayName: data.displayName,
    systemPrompt: data.systemPrompt ?? "",
    canDo: data.canDo ?? [],
    cannotDo: data.cannotDo ?? [],
    delegateTo: data.delegateTo ?? undefined,
    isDefault: data.isDefault ?? false,
    createdBy: data.createdBy ?? "anonymous",
    createdAt: data.createdAt?.toDate?.()?.toISOString() ?? data.createdAt ?? nowIso(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() ?? data.updatedAt ?? nowIso(),
  } satisfies TeamPersonaRecord;
}

// ── Projects ──────────────────────────────────────────────────────────────────

const projects = {
  list: async (): Promise<ApiListResponse<ProjectRecord>> => {
    const snap = await getDb()
      .collection("projects")
      .orderBy("createdAt", "desc")
      .get();
    const data = snap.docs.map((d) => mapProject(d.id, d.data()));
    return { data, pagination: { total: data.length, page: 1, limit: 100 } };
  },

  get: async (id: string): Promise<ApiResponse<ProjectRecord>> => {
    const doc = await getDb().collection("projects").doc(id).get();
    if (!doc.exists) throw new Error("Project not found");
    return { data: mapProject(doc.id, doc.data()!) };
  },

  create: async (input: CreateProjectInput): Promise<ApiResponse<ProjectRecord>> => {
    const now = nowIso();
    const ref = await getDb().collection("projects").add({
      name: input.name,
      description: input.description,
      sdlcPhase: input.sdlcPhase,
      gitUrl: input.gitUrl ?? null,
      activePersonas: [],
      domains: [],
      createdBy: "anonymous",
      createdAt: now,
      updatedAt: now,
    });
    const doc = await ref.get();
    return { data: mapProject(doc.id, doc.data()!) };
  },

  update: async (
    id: string,
    input: UpdateProjectInput
  ): Promise<ApiResponse<ProjectRecord>> => {
    const patch: Record<string, unknown> = { updatedAt: nowIso() };
    if (input.name !== undefined) patch.name = input.name;
    if (input.description !== undefined) patch.description = input.description;
    if (input.sdlcPhase !== undefined) patch.sdlcPhase = input.sdlcPhase;
    if ("gitUrl" in input) patch.gitUrl = input.gitUrl ?? null;
    if (input.activePersonas !== undefined) patch.activePersonas = input.activePersonas;
    if (input.domains !== undefined) patch.domains = input.domains;

    await getDb().collection("projects").doc(id).update(patch);
    const doc = await getDb().collection("projects").doc(id).get();
    return { data: mapProject(doc.id, doc.data()!) };
  },

  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    await getDb().collection("projects").doc(id).delete();
    return { data: { deleted: true } };
  },
};

// ── Personas ──────────────────────────────────────────────────────────────────

const personas = {
  list: async (): Promise<ApiListResponse<PersonaRecord>> => {
    const snap = await getDb()
      .collection("personas")
      .orderBy("createdAt", "asc")
      .get();
    const data = snap.docs.map((d) => mapPersona(d.id, d.data()));
    return { data, pagination: { total: data.length, page: 1, limit: 100 } };
  },

  get: async (id: string): Promise<ApiResponse<PersonaRecord>> => {
    const doc = await getDb().collection("personas").doc(id).get();
    if (!doc.exists) throw new Error("Persona not found");
    return { data: mapPersona(doc.id, doc.data()!) };
  },

  create: async (input: CreatePersonaInput): Promise<ApiResponse<PersonaRecord>> => {
    const now = nowIso();
    const ref = await getDb()
      .collection("personas")
      .add({ ...input, createdBy: "anonymous", createdAt: now, updatedAt: now });
    const doc = await ref.get();
    return { data: mapPersona(doc.id, doc.data()!) };
  },

  update: async (
    id: string,
    input: UpdatePersonaInput
  ): Promise<ApiResponse<PersonaRecord>> => {
    await getDb()
      .collection("personas")
      .doc(id)
      .update({ ...input, updatedAt: nowIso() });
    const doc = await getDb().collection("personas").doc(id).get();
    return { data: mapPersona(doc.id, doc.data()!) };
  },

  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    await getDb().collection("personas").doc(id).delete();
    return { data: { deleted: true } };
  },
};

// ── Export ────────────────────────────────────────────────────────────────────

export const db = {
  isConfigured,
  projects,
  personas,
};
