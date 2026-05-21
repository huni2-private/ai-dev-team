// Design Ref: §4.1 bkend.ai CRUD + §9.1 Application Layer
"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db as bkend } from "@/lib/db";
import type { SdlcPhase, PersonaRole } from "@/types/aidev";

// ── Project Actions ───────────────────────────────────────────────

export async function createProject(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sdlcPhase = formData.get("sdlcPhase") as SdlcPhase;
  const gitUrl = (formData.get("gitUrl") as string) || undefined;

  const res = await bkend.projects.create({ name, description, sdlcPhase, gitUrl });
  revalidatePath("/");
  redirect(`/projects/${res.data._id}`);
}

export async function updateProject(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sdlcPhase = formData.get("sdlcPhase") as SdlcPhase;
  const gitUrl = (formData.get("gitUrl") as string) || undefined;

  await bkend.projects.update(id, { name, description, sdlcPhase, gitUrl });
  revalidatePath("/");
  revalidatePath(`/projects/${id}`);
  redirect(`/projects/${id}`);
}

export async function deleteProject(id: string) {
  await bkend.projects.delete(id);
  revalidatePath("/");
  redirect("/");
}

export async function updateProjectPhase(id: string, sdlcPhase: SdlcPhase) {
  await bkend.projects.update(id, { sdlcPhase });
  revalidatePath(`/projects/${id}`);
  revalidatePath("/");
}

export async function setActivePersonas(id: string, activePersonas: PersonaRole[]) {
  await bkend.projects.update(id, { activePersonas });
  revalidatePath(`/projects/${id}`);
}

// ── Persona Actions ───────────────────────────────────────────────

export async function createPersona(formData: FormData) {
  const role = formData.get("role") as PersonaRole;
  const displayName = formData.get("displayName") as string;
  const systemPrompt = formData.get("systemPrompt") as string;
  const delegateTo = (formData.get("delegateTo") as PersonaRole) || undefined;

  const parseLines = (raw: string) =>
    raw.split("\n").map((s) => s.trim()).filter(Boolean);

  await bkend.personas.create({
    role,
    displayName,
    systemPrompt,
    canDo: parseLines(formData.get("canDo") as string),
    cannotDo: parseLines(formData.get("cannotDo") as string),
    delegateTo,
    isDefault: false,
  });
  revalidatePath("/personas");
  redirect("/personas");
}

export async function updatePersona(id: string, formData: FormData) {
  const role = formData.get("role") as PersonaRole;
  const displayName = formData.get("displayName") as string;
  const systemPrompt = formData.get("systemPrompt") as string;
  const delegateTo = (formData.get("delegateTo") as PersonaRole) || undefined;

  const parseLines = (raw: string) =>
    raw.split("\n").map((s) => s.trim()).filter(Boolean);

  await bkend.personas.update(id, {
    role,
    displayName,
    systemPrompt,
    canDo: parseLines(formData.get("canDo") as string),
    cannotDo: parseLines(formData.get("cannotDo") as string),
    delegateTo,
  });
  revalidatePath(`/personas/${id}`);
  revalidatePath("/personas");
  redirect("/personas");
}

export async function deletePersona(id: string) {
  await bkend.personas.delete(id);
  revalidatePath("/personas");
  redirect("/personas");
}
