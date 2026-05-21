// Supabase database layer — mirrors old bkend API shape so callers need no changes.
// Server-side only: uses SUPABASE_SERVICE_ROLE_KEY, never exposed to the browser.

import { createClient } from "@supabase/supabase-js";
import type {
  ProjectRecord,
  PersonaRecord,
  ApiResponse,
  ApiListResponse,
  CreateProjectInput,
  UpdateProjectInput,
  CreatePersonaInput,
  UpdatePersonaInput,
} from "@/types/aidev";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

function getClient() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

function mapProject(row: Record<string, unknown>): ProjectRecord {
  return {
    _id: row.id as string,
    name: row.name as string,
    description: (row.description as string) ?? "",
    sdlcPhase: row.sdlc_phase as ProjectRecord["sdlcPhase"],
    gitUrl: (row.git_url as string) ?? undefined,
    activePersonas: (row.active_personas as ProjectRecord["activePersonas"]) ?? [],
    createdBy: (row.created_by as string) ?? "anonymous",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function mapPersona(row: Record<string, unknown>): PersonaRecord {
  return {
    _id: row.id as string,
    role: row.role as PersonaRecord["role"],
    displayName: row.display_name as string,
    systemPrompt: (row.system_prompt as string) ?? "",
    canDo: (row.can_do as string[]) ?? [],
    cannotDo: (row.cannot_do as string[]) ?? [],
    delegateTo: (row.delegate_to as PersonaRecord["delegateTo"]) ?? undefined,
    isDefault: (row.is_default as boolean) ?? false,
    createdBy: (row.created_by as string) ?? "anonymous",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ── Projects ──────────────────────────────────────────────────────────────────

const projects = {
  list: async (): Promise<ApiListResponse<ProjectRecord>> => {
    const { data, error, count } = await getClient()
      .from("projects")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });
    throwIfError(error);
    return {
      data: (data ?? []).map(mapProject),
      pagination: { total: count ?? 0, page: 1, limit: 100 },
    };
  },

  get: async (id: string): Promise<ApiResponse<ProjectRecord>> => {
    const { data, error } = await getClient()
      .from("projects")
      .select("*")
      .eq("id", id)
      .single();
    throwIfError(error);
    return { data: mapProject(data as Record<string, unknown>) };
  },

  create: async (input: CreateProjectInput): Promise<ApiResponse<ProjectRecord>> => {
    const { data, error } = await getClient()
      .from("projects")
      .insert({
        name: input.name,
        description: input.description,
        sdlc_phase: input.sdlcPhase,
        git_url: input.gitUrl ?? null,
        active_personas: [],
        created_by: "anonymous",
      })
      .select()
      .single();
    throwIfError(error);
    return { data: mapProject(data as Record<string, unknown>) };
  },

  update: async (id: string, input: UpdateProjectInput): Promise<ApiResponse<ProjectRecord>> => {
    const patch: Record<string, unknown> = {};
    if (input.name !== undefined) patch.name = input.name;
    if (input.description !== undefined) patch.description = input.description;
    if (input.sdlcPhase !== undefined) patch.sdlc_phase = input.sdlcPhase;
    if ("gitUrl" in input) patch.git_url = input.gitUrl ?? null;
    if (input.activePersonas !== undefined) patch.active_personas = input.activePersonas;

    const { data, error } = await getClient()
      .from("projects")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    throwIfError(error);
    return { data: mapProject(data as Record<string, unknown>) };
  },

  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const { error } = await getClient().from("projects").delete().eq("id", id);
    throwIfError(error);
    return { data: { deleted: true } };
  },
};

// ── Personas ──────────────────────────────────────────────────────────────────

const personas = {
  list: async (): Promise<ApiListResponse<PersonaRecord>> => {
    const { data, error, count } = await getClient()
      .from("personas")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: true });
    throwIfError(error);
    return {
      data: (data ?? []).map(mapPersona),
      pagination: { total: count ?? 0, page: 1, limit: 100 },
    };
  },

  get: async (id: string): Promise<ApiResponse<PersonaRecord>> => {
    const { data, error } = await getClient()
      .from("personas")
      .select("*")
      .eq("id", id)
      .single();
    throwIfError(error);
    return { data: mapPersona(data as Record<string, unknown>) };
  },

  create: async (input: CreatePersonaInput): Promise<ApiResponse<PersonaRecord>> => {
    const { data, error } = await getClient()
      .from("personas")
      .insert({
        role: input.role,
        display_name: input.displayName,
        system_prompt: input.systemPrompt,
        can_do: input.canDo,
        cannot_do: input.cannotDo,
        delegate_to: input.delegateTo ?? null,
        is_default: input.isDefault,
        created_by: "anonymous",
      })
      .select()
      .single();
    throwIfError(error);
    return { data: mapPersona(data as Record<string, unknown>) };
  },

  update: async (id: string, input: UpdatePersonaInput): Promise<ApiResponse<PersonaRecord>> => {
    const patch: Record<string, unknown> = {};
    if (input.role !== undefined) patch.role = input.role;
    if (input.displayName !== undefined) patch.display_name = input.displayName;
    if (input.systemPrompt !== undefined) patch.system_prompt = input.systemPrompt;
    if (input.canDo !== undefined) patch.can_do = input.canDo;
    if (input.cannotDo !== undefined) patch.cannot_do = input.cannotDo;
    if ("delegateTo" in input) patch.delegate_to = input.delegateTo ?? null;

    const { data, error } = await getClient()
      .from("personas")
      .update(patch)
      .eq("id", id)
      .select()
      .single();
    throwIfError(error);
    return { data: mapPersona(data as Record<string, unknown>) };
  },

  delete: async (id: string): Promise<ApiResponse<{ deleted: boolean }>> => {
    const { error } = await getClient().from("personas").delete().eq("id", id);
    throwIfError(error);
    return { data: { deleted: true } };
  },
};

// ── Export ────────────────────────────────────────────────────────────────────

export const db = {
  isConfigured: Boolean(SUPABASE_URL && SERVICE_ROLE_KEY),
  projects,
  personas,
};
