// Design Ref: §3.1 .aidev.json Schema — 연동 config 완전한 타입 정의

export type SdlcPhase =
  | "plan"
  | "design"
  | "implement"
  | "verify"
  | "deploy"
  | "maintain";

export type PersonaRole = "pm" | "techlead" | "dev" | "qa" | "devops";

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
  personas: PersonaConfig[];
  rules: TeamRules;
}

// DB 모델 타입 (bkend.ai 컬렉션 기반)

export interface ProjectRecord {
  _id: string;
  name: string;
  description: string;
  sdlcPhase: SdlcPhase;
  gitUrl?: string | null;
  activePersonas: PersonaRole[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonaRecord {
  _id: string;
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

// API 응답 래퍼
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

// 폼 타입
export type CreateProjectInput = Pick<
  ProjectRecord,
  "name" | "description" | "sdlcPhase" | "gitUrl"
>;

export type UpdateProjectInput = Partial<CreateProjectInput> & {
  activePersonas?: PersonaRole[];
};

export type CreatePersonaInput = Omit<
  PersonaRecord,
  "_id" | "createdBy" | "createdAt" | "updatedAt"
>;

export type UpdatePersonaInput = Partial<CreatePersonaInput>;

// SDLC 단계 메타데이터
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
