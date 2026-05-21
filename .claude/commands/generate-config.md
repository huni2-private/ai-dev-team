---
description: 현재 프로젝트 상태를 기반으로 .aidev.json 연동 config를 생성한다
argument-hint: [project-name] [sdlc-phase]
---

# Design Ref: §2.2 연동 플로우 — 단방향, 웹 없이도 로컬에서 생성 가능

현재 프로젝트의 .aidev.json 연동 config를 생성해줘.

## 생성 단계

### 1. 프로젝트 정보 수집

다음 정보를 수집한다:
- 프로젝트 이름: $ARGUMENTS에서 첫 번째 인자, 없으면 현재 폴더명
- SDLC 단계: $ARGUMENTS에서 두 번째 인자, 없으면 현재 단계 추론
  - plan.md만 있음 → "plan"
  - design.md 있음 → "design"
  - 구현 코드 있음 → "implement"
  - 기본값 → "plan"
- git URL: `git remote get-url origin` 실행, 실패 시 null

### 2. 페르소나 목록 로드

`docs/personas/` 폴더에서 5개 페르소나 정의를 읽는다.
각 파일에서 다음을 추출:
- role (파일명에서)
- displayName (## 역할 선언의 bold 텍스트)
- systemPrompt (## 시스템 프롬프트 코드블록 내용)
- canDo (## canDo 목록)
- cannotDo (## cannotDo 목록)
- delegateTo (## delegateTo의 첫 번째 항목의 role)

### 3. .aidev.json 생성

다음 구조로 `.aidev.json` 파일을 생성한다:

```json
{
  "version": "1.0",
  "team": "ai-dev-team",
  "generatedAt": "{ISO timestamp}",
  "project": {
    "id": "{uuid-v4}",
    "name": "{project-name}",
    "description": "",
    "sdlcPhase": "{detected-phase}",
    "gitUrl": "{git-url 또는 null}"
  },
  "personas": [
    {
      "role": "pm",
      "active": true,
      "displayName": "Product Manager",
      "systemPrompt": "...",
      "canDo": [...],
      "cannotDo": [...],
      "delegateTo": "techlead"
    },
    {
      "role": "techlead",
      "active": true,
      "displayName": "Technical Lead",
      "systemPrompt": "...",
      "canDo": [...],
      "cannotDo": [...],
      "delegateTo": "pm"
    },
    {
      "role": "dev",
      "active": true,
      "displayName": "Senior Developer",
      "systemPrompt": "...",
      "canDo": [...],
      "cannotDo": [...],
      "delegateTo": "techlead"
    },
    {
      "role": "qa",
      "active": true,
      "displayName": "QA Engineer",
      "systemPrompt": "...",
      "canDo": [...],
      "cannotDo": [...],
      "delegateTo": "dev"
    },
    {
      "role": "devops",
      "active": true,
      "displayName": "DevOps Engineer",
      "systemPrompt": "...",
      "canDo": [...],
      "cannotDo": [...],
      "delegateTo": "qa"
    }
  ],
  "rules": {
    "requireDesignBeforeImplement": true,
    "driftDetection": true,
    "roleEnforcement": true,
    "handoffChecklist": true
  }
}
```

### 4. 완료 후 안내

".aidev.json 생성 완료!

다른 프로젝트에 연동하려면:
1. 이 파일을 대상 프로젝트 루트에 복사
2. 대상 프로젝트 CLAUDE.md 최상단에 추가:

---
# AI Dev Team Framework
이 프로젝트는 ai-dev-team 프레임워크를 사용합니다.
.aidev.json을 읽어 팀 페르소나와 워크플로우 규칙을 적용합니다.

규칙 요약:
- 설계 문서 없는 구현 시작 금지
- 역할 범위 이탈 시 해당 페르소나에게 위임
- /activate-persona [role]로 페르소나 전환
---

3. /activate-persona [role]로 역할 선택 후 시작"
