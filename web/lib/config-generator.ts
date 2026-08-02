// .aidev.json 생성 로직
import type {
  AiDevConfig,
  ProjectRecord,
  PersonaRecord,
  TeamPersonaRecord,
  DomainPersonaRecord,
} from "@/types/aidev";
import { DEFAULT_RULES } from "./default-personas";

export function generateAiDevConfig(
  project: ProjectRecord,
  personas: PersonaRecord[]
): AiDevConfig {
  const teamPersonas = personas.filter(
    (p): p is TeamPersonaRecord => p.personaType === "team"
  );
  const domainPersonas = personas.filter(
    (p): p is DomainPersonaRecord =>
      p.personaType === "domain" && project.domains.includes(p.domain)
  );

  return {
    version: "2.0",
    team: "ai-dev-team",
    generatedAt: new Date().toISOString(),
    project: {
      id: project._id,
      name: project.name,
      description: project.description,
      sdlcPhase: project.sdlcPhase,
      gitUrl: project.gitUrl ?? null,
    },
    teamPersonas: teamPersonas.map((p) => ({
      role: p.role,
      active: project.activePersonas.includes(p.role),
      displayName: p.displayName,
      systemPrompt: p.systemPrompt,
      canDo: p.canDo,
      cannotDo: p.cannotDo,
      delegateTo: p.delegateTo,
    })),
    domainPersonas: domainPersonas.map((p) => ({
      domain: p.domain,
      perspective: p.perspective,
      displayName: p.displayName,
      systemPrompt: p.systemPrompt,
      painPoints: p.painPoints,
      goals: p.goals,
    })),
    rules: DEFAULT_RULES,
  };
}

export function configToJson(config: AiDevConfig): string {
  return JSON.stringify(config, null, 2);
}

export function configToBlob(config: AiDevConfig): Blob {
  return new Blob([configToJson(config)], { type: "application/json" });
}

export function generateClaudeSnippet(projectName: string): string {
  return `# AI Dev Team Framework
이 프로젝트는 ai-dev-team 프레임워크를 사용합니다.
세션 시작 시 .aidev.json을 읽어 팀 페르소나와 워크플로우 규칙을 적용합니다.
프로젝트: ${projectName}

## 팀 페르소나 (SDLC 워크플로우)
역할 범위 밖의 요청은 담당 페르소나에게 위임합니다.
커맨드: /activate-persona [pm|techlead|dev|qa|devops]

## 도메인 페르소나 (이해관계자 시뮬레이터)
고객·이해관계자 관점의 요구사항 검증에 사용합니다.
커맨드: /activate-persona [perspective] (예: "행사 주최사")

## 공통 규칙
- 설계 없는 구현 금지
- 역할 이탈 시 담당 페르소나에게 위임
- /team-status | /drift-detect 로 현황 확인`;
}
