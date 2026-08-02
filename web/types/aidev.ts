// .aidev.json 스키마 + DB 모델 타입 정의

export type SdlcPhase =
  | "plan"
  | "design"
  | "implement"
  | "verify"
  | "deploy"
  | "maintain";

export type PersonaRole = "pm" | "techlead" | "dev" | "qa" | "devops";

// ── 팀 페르소나 (SDLC 워크플로우) ──────────────────────────────────────

export interface PersonaConfig {
  role: PersonaRole;
  active: boolean;
  displayName: string;
  /** 3-파트 구조: ROLE / SCOPE / GUARD */
  systemPrompt: string;
  canDo: string[];
  cannotDo: string[];
  delegateTo?: PersonaRole;
}

// ── 도메인 페르소나 (이해관계자 시뮬레이터) ───────────────────────────────

export interface DomainPersonaConfig {
  domain: string;       // e.g. "event", "ecommerce"
  perspective: string;  // e.g. "행사 주최사"
  displayName: string;
  systemPrompt: string;
  painPoints: string[];
  goals: string[];
}

export interface TeamRules {
  requireDesignBeforeImplement: boolean;
  driftDetection: boolean;
  roleEnforcement: boolean;
  handoffChecklist: boolean;
}

export interface AiDevProject {
  id: string;
  name: string;
  description: string;
  sdlcPhase: SdlcPhase;
  gitUrl?: string | null;
}

export interface AiDevConfig {
  version: string;
  team: "ai-dev-team";
  generatedAt: string;
  project: AiDevProject;
  teamPersonas: PersonaConfig[];
  domainPersonas: DomainPersonaConfig[];
  rules: TeamRules;
}

// ── DB 레코드 (Firestore) ──────────────────────────────────────────────

export interface ProjectRecord {
  _id: string;
  name: string;
  description: string;
  sdlcPhase: SdlcPhase;
  gitUrl?: string | null;
  activePersonas: PersonaRole[];
  domains: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 팀 페르소나 DB 레코드
export interface TeamPersonaRecord {
  _id: string;
  personaType: "team";
  role: PersonaRole;
  displayName: string;
  systemPrompt: string;
  canDo: string[];
  cannotDo: string[];
  delegateTo?: PersonaRole;
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// 도메인 페르소나 DB 레코드
export interface DomainPersonaRecord {
  _id: string;
  personaType: "domain";
  domain: string;
  perspective: string;
  displayName: string;
  systemPrompt: string;
  painPoints: string[];
  goals: string[];
  isDefault: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type PersonaRecord = TeamPersonaRecord | DomainPersonaRecord;

// ── API 응답 래퍼 ────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ApiListResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

// ── 폼 입력 타입 ─────────────────────────────────────────────────────────

export type CreateProjectInput = Pick<
  ProjectRecord,
  "name" | "description" | "sdlcPhase" | "gitUrl"
>;

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  activePersonas?: PersonaRole[];
  domains?: string[];
};

export type CreateTeamPersonaInput = Omit<
  TeamPersonaRecord,
  "_id" | "createdBy" | "createdAt" | "updatedAt"
>;

export type CreateDomainPersonaInput = Omit<
  DomainPersonaRecord,
  "_id" | "createdBy" | "createdAt" | "updatedAt"
>;

export type CreatePersonaInput = CreateTeamPersonaInput | CreateDomainPersonaInput;

export type UpdatePersonaInput =
  | Partial<Omit<TeamPersonaRecord, "_id" | "personaType" | "createdBy" | "createdAt" | "updatedAt">>
  | Partial<Omit<DomainPersonaRecord, "_id" | "personaType" | "createdBy" | "createdAt" | "updatedAt">>;

// ── 메타데이터 ────────────────────────────────────────────────────────────

export const SDLC_PHASES: Record<
  SdlcPhase,
  { label: string; persona: PersonaRole; next?: SdlcPhase }
> = {
  plan: { label: "Plan", persona: "pm", next: "design" },
  design: { label: "Design", persona: "techlead", next: "implement" },
  implement: { label: "Implement", persona: "dev", next: "verify" },
  verify: { label: "Verify", persona: "qa", next: "deploy" },
  deploy: { label: "Deploy", persona: "devops", next: "maintain" },
  maintain: { label: "Maintain", persona: "devops" },
};

export const PERSONA_LABELS: Record<PersonaRole, string> = {
  pm: "Product Manager",
  techlead: "Technical Lead",
  dev: "Developer",
  qa: "QA Engineer",
  devops: "DevOps Engineer",
};

export const DOMAINS: Record<string, { label: string; description: string }> = {
  event:    { label: "행사/컨퍼런스", description: "오프라인 행사, 컨퍼런스, 전시회, 박람회" },
  academic: { label: "학회/세미나",   description: "학술 학회, 세미나, 워크숍, 심포지엄" },
  internal: { label: "회사 내부용",   description: "사내 시스템, 내부 도구, 인트라넷, ERP" },
};
