// Design Ref: §4.2 GET /api/config/[projectId] — .aidev.json 생성 로직
// Plan SC: FR-10 연동 config 생성 & 다운로드

import type { AiDevConfig, ProjectRecord, PersonaRecord } from "@/types/aidev";
import { DEFAULT_RULES } from "./default-personas";

export function generateAiDevConfig(
  project: ProjectRecord,
  personas: PersonaRecord[]
): AiDevConfig {
  return {
    version: "1.0",
    team: "ai-dev-team",
    generatedAt: new Date().toISOString(),
    project: {
      id: project._id,
      name: project.name,
      description: project.description,
      sdlcPhase: project.sdlcPhase,
      gitUrl: project.gitUrl ?? null,
    },
    personas: personas.map((p) => ({
      role: p.role,
      active: project.activePersonas.includes(p.role),
      displayName: p.displayName,
      systemPrompt: p.systemPrompt,
      canDo: p.canDo,
      cannotDo: p.cannotDo,
      delegateTo: p.delegateTo,
    })),
    rules: DEFAULT_RULES,
  };
}

export function configToJson(config: AiDevConfig): string {
  return JSON.stringify(config, null, 2);
}

/** 다운로드용 Blob 생성 (브라우저 환경) */
export function configToBlob(config: AiDevConfig): Blob {
  return new Blob([configToJson(config)], { type: "application/json" });
}

/** CLAUDE.md에 삽입할 연동 스니펫 생성 */
export function generateClaudeSnippet(projectName: string): string {
  return `# AI Dev Team Framework
이 프로젝트는 ai-dev-team 프레임워크를 사용합니다.
세션 시작 시 .aidev.json을 읽어 팀 페르소나와 워크플로우 규칙을 적용합니다.
프로젝트: ${projectName}
규칙: 설계 없는 구현 금지 / 역할 이탈 시 담당 페르소나에게 위임
커맨드: /activate-persona [role] | /team-status | /drift-detect`;
}
