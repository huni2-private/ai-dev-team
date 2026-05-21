# ai-dev-team Design Document

> **Summary**: CC Native 페르소나 프레임워크 + Next.js/bkend.ai 웹 대시보드 — Option C 아키텍처
>
> **Project**: ai-dev-team
> **Version**: 0.1.0
> **Author**: changhun
> **Date**: 2026-05-21
> **Status**: Draft
> **Planning Doc**: [ai-dev-team.plan.md](../01-plan/features/ai-dev-team.plan.md)

---

## Context Anchor

> Copied from Plan document. Ensures strategic context survives Design→Do handoff.

| Key | Value |
|-----|-------|
| **WHY** | AI 협업 시 역할 혼재·할루시네이션·방향 이탈 문제를 구조적으로 해결 |
| **WHO** | 1차: 본인 (개인 프로젝트 전반). 2차: 공개 배포 후 CC 사용자 전반 |
| **RISK** | 페르소나 역할 강제가 LLM 특성상 완벽하지 않을 수 있음 |
| **SUCCESS** | 신규 프로젝트 연동 5분 이내 / 역할 이탈 감지율 90%+ / 연동 커맨드 1개 |
| **SCOPE** | v1: CC 프레임워크 코어 + 웹 대시보드(현황+연동설정). v2: 웹 AI 직접 호출 |

---

## 1. Overview

### 1.1 Design Goals

- **CC Native First**: 웹 없이도 `.claude/` + `CLAUDE.md`만으로 완전히 동작
- **One-way Integration**: 웹 대시보드 → `.aidev.json` 생성 → 프로젝트에 복사 (단방향, 복잡도 최소화)
- **Role Enforcement by Prompt Design**: 시스템 프롬프트 3-파트 구조로 역할 강제
- **Public Distribution Ready**: bkit처럼 `.claude/` 폴더 채로 배포 가능한 구조

### 1.2 Design Principles

- **오프라인 우선**: CC Native Layer는 인터넷 없이 동작해야 함
- **단방향 데이터 흐름**: 웹 → config 파일 → CC (역방향 없음, 복잡도 제거)
- **역할 범위 명시**: 각 페르소나의 CAN DO / CANNOT DO / DELEGATE TO를 명시적으로 선언
- **YAGNI**: v1에서 웹소켓, 실시간 동기화, AI 직접 호출 없음

---

## 2. Architecture

### 2.0 Architecture Comparison

| Criteria | Option A: CC Only | Option B: Custom Backend | Option C: CC + BaaS ✅ |
|----------|:-:|:-:|:-:|
| 웹 대시보드 | ❌ | ✅ | ✅ |
| 구축 시간 | 1-2일 | 1-2주 | 3-4일 |
| 오프라인 동작 | ✅ | ❌ | ✅ |
| 인프라 관리 | 없음 | 직접 | BaaS 위임 |
| 확장성 | 낮음 | 높음 | 중간 |
| v1 적합성 | 부분 | 과도 | **최적** |

**Selected**: Option C — CC Native + bkend.ai BaaS Dashboard
**Rationale**: 웹 대시보드 필수 + 빠른 구축 + 오프라인 동작 모두 충족. bkend.ai로 인증/DB 인프라 위임.

### 2.1 전체 시스템 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    Layer 1: CC Native                        │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  CLAUDE.md   │  │   .claude/   │  │  .aidev.json     │  │
│  │  (팀 규칙)   │  │  (CC 스킬)   │  │  (연동 config)   │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│           ↑ Claude Code가 세션 시작 시 로드                  │
└─────────────────────────────────────────────────────────────┘
                              ↑
                   .aidev.json 복사 (단방향)
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Layer 2: Web Dashboard                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Next.js App Router                                  │   │
│  │  /dashboard  /projects  /personas  /connect          │   │
│  └────────────────────┬─────────────────────────────────┘   │
│                       │ API calls                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  bkend.ai BaaS                                       │   │
│  │  Auth + Projects DB + Personas DB + Config Storage   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 연동 플로우 (핵심)

```
1. 사용자 → 웹 대시보드에서 프로젝트 생성 & 페르소나 설정
2. "연동 Config 다운로드" → .aidev.json 생성
3. .aidev.json → 대상 프로젝트 루트에 복사
4. 대상 프로젝트 CLAUDE.md 상단에 한 줄 추가:
   "ai-dev-team 프레임워크를 사용합니다. .aidev.json을 읽어 팀 규칙 적용."
5. CC 세션 시작 → CLAUDE.md 읽고 → .aidev.json 로드 → 팀 규칙 활성화
```

### 2.3 주요 의존성

| Component | Depends On | Purpose |
|-----------|-----------|---------|
| Web Dashboard | bkend.ai | 인증, Project/Persona CRUD |
| Config Generator | bkend.ai Projects + Personas | .aidev.json 생성 |
| CC Skills | .aidev.json | 역할 전환, 상태 확인 |
| CLAUDE.md | .aidev.json | 페르소나 규칙 로드 |

---

## 3. Data Model

### 3.1 .aidev.json 스키마 (핵심 연동 포맷)

```typescript
interface AiDevConfig {
  version: string;              // "1.0"
  team: string;                 // "ai-dev-team"
  generatedAt: string;          // ISO timestamp
  project: {
    id: string;
    name: string;
    description: string;
    sdlcPhase: SdlcPhase;       // 현재 단계
    gitUrl?: string;
  };
  personas: PersonaConfig[];
  rules: TeamRules;
}

type SdlcPhase = "plan" | "design" | "implement" | "verify" | "deploy" | "maintain";

interface PersonaConfig {
  role: PersonaRole;
  active: boolean;
  displayName: string;
  systemPrompt: string;         // 3-파트 구조
  canDo: string[];              // 허용 작업 목록
  cannotDo: string[];           // 금지 작업 목록
  delegateTo?: PersonaRole;     // 역할 초과 시 위임 대상
}

type PersonaRole = "pm" | "techlead" | "dev" | "qa" | "devops";

interface TeamRules {
  requireDesignBeforeImplement: boolean;  // default: true
  driftDetection: boolean;               // default: true
  roleEnforcement: boolean;              // default: true
  handoffChecklist: boolean;             // default: true
}
```

### 3.2 페르소나 시스템 프롬프트 — 3-파트 구조

각 페르소나의 시스템 프롬프트는 3개의 파트로 구성:

```
ROLE:    [역할 선언] — 나는 {role} 이다. 20년 경력 전문가.
SCOPE:   [담당 범위] — 내가 할 수 있는 것: {canDo}
GUARD:   [역할 가드] — 내가 할 수 없는 것: {cannotDo}
         요청이 범위를 벗어나면: "{delegateTo}에게 이 작업을 맡겨야 합니다."
```

**예시 — Dev 페르소나:**
```
ROLE: 나는 Senior Developer다. 설계 문서 기반 구현 전문가.

SCOPE: 할 수 있는 것:
- TechLead의 설계 문서(design.md)를 기반으로 코드 구현
- 구현 중 발생하는 기술적 문제 해결
- 코드 품질 유지 (네이밍, 구조, 테스트)

GUARD: 할 수 없는 것 (요청 즉시 거부):
- 아키텍처 결정 → TechLead에게 위임
- 요구사항 변경 → PM에게 위임
- 설계 문서 없는 구현 시작 → TechLead에게 설계 요청
- 배포 → DevOps에게 위임
```

### 3.3 bkend.ai 데이터 모델 (웹 대시보드)

**Project 컬렉션:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | auto | |
| name | String | ✅ | 프로젝트 명 |
| description | String | | |
| sdlcPhase | Enum | ✅ | 현재 SDLC 단계 |
| gitUrl | String | | Git 저장소 URL |
| activePersonas | String[] | | 활성화된 persona role 목록 |
| createdBy | String | auto | bkend.ai user ID |
| createdAt | Date | auto | |
| updatedAt | Date | auto | |

**Persona 컬렉션:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | auto | |
| role | Enum | ✅ | pm/techlead/dev/qa/devops |
| displayName | String | ✅ | |
| systemPrompt | String | ✅ | 3-파트 구조 텍스트 |
| canDo | String[] | ✅ | 허용 작업 |
| cannotDo | String[] | ✅ | 금지 작업 |
| delegateTo | Enum | | 위임 대상 role |
| isDefault | Boolean | | 기본 제공 페르소나 여부 |
| createdBy | String | auto | |

### 3.4 엔티티 관계

```
User (bkend.ai Auth)
  │
  └──1:N── Project
               │
               └──M:N── Persona (ProjectPersona 연결)
```

---

## 4. API Specification

bkend.ai 자동 생성 REST API 사용. 추가 커스텀 엔드포인트:

### 4.1 bkend.ai 자동 생성 엔드포인트

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | /api/projects | 내 프로젝트 목록 | Required |
| POST | /api/projects | 프로젝트 생성 | Required |
| PUT | /api/projects/:id | 프로젝트 수정 | Required |
| DELETE | /api/projects/:id | 프로젝트 삭제 | Required |
| GET | /api/personas | 페르소나 목록 | Required |
| POST | /api/personas | 페르소나 생성 | Required |
| PUT | /api/personas/:id | 페르소나 수정 | Required |
| DELETE | /api/personas/:id | 페르소나 삭제 | Required |

### 4.2 커스텀 엔드포인트 (Next.js Route Handler)

#### `GET /api/config/[projectId]`
**.aidev.json 생성 & 반환**

**Response (200):**
```json
{
  "version": "1.0",
  "team": "ai-dev-team",
  "generatedAt": "2026-05-21T00:00:00Z",
  "project": {
    "id": "proj_xxx",
    "name": "my-project",
    "sdlcPhase": "design"
  },
  "personas": [...],
  "rules": {
    "requireDesignBeforeImplement": true,
    "driftDetection": true,
    "roleEnforcement": true
  }
}
```

---

## 5. UI/UX Design

### 5.1 페이지 구조

```
/                           → 대시보드 (프로젝트 목록 + SDLC 상태)
/projects/new               → 프로젝트 생성
/projects/[id]              → 프로젝트 상세 (SDLC 현황, 연결된 페르소나)
/projects/[id]/connect      → 연동 config 생성 & 다운로드
/personas                   → 페르소나 목록
/personas/new               → 페르소나 생성
/personas/[id]              → 페르소나 편집
/login                      → 로그인
```

### 5.2 핵심 사용자 플로우

```
신규 사용자:
회원가입 → 기본 페르소나 5개 자동 생성 → 대시보드

신규 프로젝트 연동:
프로젝트 생성 → 페르소나 선택 → config 다운로드 → 
대상 프로젝트에 .aidev.json 복사 → 완료

기존 프로젝트 참여:
프로젝트 등록 → 현재 SDLC 단계 설정 → config 다운로드 → 
.aidev.json 복사 → /activate-persona [role]로 역할 시작
```

### 5.3 컴포넌트 목록

| Component | Location | Responsibility |
|-----------|----------|----------------|
| ProjectCard | components/project/ | SDLC 단계 배지 + 프로젝트 요약 |
| SdlcStatusBar | components/project/ | Plan→Design→Dev→QA→Deploy 시각화 |
| PersonaCard | components/persona/ | 역할 + canDo/cannotDo 미리보기 |
| PersonaForm | components/persona/ | 시스템 프롬프트 3-파트 편집기 |
| ConfigGenerator | components/connect/ | .aidev.json 미리보기 + 다운로드 |
| IntegrationGuide | components/connect/ | 5단계 연동 가이드 |

### 5.4 Page UI Checklist

#### Dashboard (/)
- [ ] 프로젝트 목록 카드 (이름, SDLC 단계 배지, 업데이트 시간)
- [ ] SDLC 단계 필터 (전체/plan/design/implement/verify/deploy)
- [ ] "새 프로젝트" 버튼
- [ ] 빈 상태: "첫 프로젝트를 만들어보세요" + CTA 버튼
- [ ] 각 카드에 "연동 Config 다운로드" 바로가기

#### Project Detail (/projects/[id])
- [ ] SDLC 단계 시각화 바 (현재 단계 하이라이트)
- [ ] SDLC 단계 변경 버튼
- [ ] 활성 페르소나 목록 (role 배지 + on/off 토글)
- [ ] "연동 Config 생성" 버튼 → /connect로 이동
- [ ] 핸드오프 체크리스트 (현재 단계의 완료 조건)

#### Persona List (/personas)
- [ ] 페르소나 카드 목록 (role 배지, displayName, canDo 요약)
- [ ] 기본 제공 5개 페르소나 (수정 가능, 삭제 불가)
- [ ] "커스텀 페르소나 추가" 버튼
- [ ] 역할별 필터 탭

#### Persona Form (/personas/new, /personas/[id])
- [ ] Role 선택 드롭다운 (pm/techlead/dev/qa/devops/custom)
- [ ] displayName 입력
- [ ] 3-파트 시스템 프롬프트 편집기 (ROLE / SCOPE / GUARD 섹션)
- [ ] canDo 태그 입력 (추가/삭제)
- [ ] cannotDo 태그 입력 (추가/삭제)
- [ ] delegateTo 선택 드롭다운
- [ ] "미리보기" — 실제 CC에서 보일 시스템 프롬프트 렌더링

#### Connect (/projects/[id]/connect)
- [ ] .aidev.json 미리보기 (JSON 뷰어, 복사 버튼)
- [ ] "다운로드" 버튼 (.aidev.json 파일 다운로드)
- [ ] 5단계 연동 가이드 (번호 매긴 인라인 가이드)
- [ ] CLAUDE.md 추가 스니펫 (복사 버튼 포함)

---

## 6. Error Handling

| Code | Message | Cause | Handling |
|------|---------|-------|----------|
| 400 | Invalid config | 필드 누락/잘못된 role | 필드 에러 표시 |
| 401 | Unauthorized | bkend.ai 토큰 만료 | 로그인 페이지 리다이렉트 |
| 404 | Project not found | 삭제된 프로젝트 | 대시보드로 리다이렉트 |
| 500 | Config generation failed | bkend.ai API 오류 | 재시도 버튼 + 에러 메시지 |

---

## 7. Security Considerations

- [ ] bkend.ai 인증 토큰으로 모든 API 요청 보호
- [ ] 프로젝트/페르소나는 createdBy 기준 소유권 격리
- [ ] .aidev.json에 민감 정보(API 키 등) 포함 금지
- [ ] `NEXT_PUBLIC_` 변수에 서버 시크릿 노출 금지

---

## 8. Test Plan

### 8.1 Test Scope

| Type | Target | Tool | Phase |
|------|--------|------|-------|
| L1: API | bkend.ai CRUD + config 생성 | curl | Do |
| L2: UI | 페르소나 폼, config 다운로드 | Playwright | Do |
| L3: E2E | 전체 연동 플로우 | Playwright | Do |

### 8.2 L1: API Test Scenarios

| # | Endpoint | Method | Test | Expected |
|---|----------|--------|------|----------|
| 1 | /api/projects | GET | 내 프로젝트 목록 조회 | 200, `.data` array |
| 2 | /api/projects | POST | 프로젝트 생성 | 201, `.data.id` 존재 |
| 3 | /api/config/[id] | GET | .aidev.json 생성 | 200, `version`, `personas` 배열 포함 |
| 4 | /api/config/[id] | GET | 비인증 요청 | 401 |
| 5 | /api/personas | POST | 필수 필드 누락 | 400, fieldErrors |

### 8.3 L2: UI Test Scenarios

| # | Page | Action | Expected |
|---|------|--------|----------|
| 1 | Dashboard | 페이지 로드 | 프로젝트 카드 목록 렌더링 |
| 2 | Persona Form | 3-파트 편집 후 저장 | 성공 메시지, 목록으로 이동 |
| 3 | Connect | "다운로드" 클릭 | .aidev.json 파일 다운로드 시작 |
| 4 | Connect | "복사" 클릭 | 클립보드에 JSON 복사 |

### 8.4 L3: E2E Scenarios

| # | Scenario | Steps | Success Criteria |
|---|----------|-------|-----------------|
| 1 | 신규 연동 | 프로젝트 생성 → 페르소나 설정 → config 다운로드 | .aidev.json 파일 생성됨 |
| 2 | 인증 플로우 | 회원가입 → 로그인 → 대시보드 진입 | 401 없이 보호 페이지 접근 |
| 3 | SDLC 단계 전환 | 프로젝트 상세 → 단계 변경 → 저장 | 새 단계 배지 표시 |

---

## 9. Clean Architecture

### 9.1 레이어 구조 (Layer 2: Web)

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Presentation | `web/app/`, `web/components/` | 페이지, UI 컴포넌트 |
| Application | `web/app/api/`, `web/lib/services/` | 비즈니스 로직, config 생성 |
| Domain | `web/types/` | AiDevConfig, PersonaConfig 타입 |
| Infrastructure | `web/lib/bkend.ts` | bkend.ai API 클라이언트 |

### 9.2 전체 파일 구조

```
ai-dev-team/
├── CLAUDE.md                        ← CC 코어 규칙 (standalone)
├── .claude/
│   ├── settings.json
│   └── commands/
│       ├── activate-persona.md      ← 역할 전환
│       ├── team-status.md           ← SDLC 상태 확인
│       ├── drift-detect.md          ← 방향 이탈 감지 [신규]
│       └── generate-config.md       ← 로컬 config 생성 [신규]
├── .aidev.json                      ← 연동 config (대시보드가 생성)
├── docs/
│   ├── personas/
│   │   ├── pm.md                    ← PM 페르소나 상세 정의
│   │   ├── techlead.md
│   │   ├── dev.md
│   │   ├── qa.md
│   │   └── devops.md
│   └── workflows/
│       └── sdlc.md
└── web/                             ← Next.js 웹 대시보드
    ├── package.json
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                 ← Dashboard
    │   ├── (auth)/
    │   │   ├── login/page.tsx
    │   │   └── signup/page.tsx
    │   ├── projects/
    │   │   ├── page.tsx             ← 프로젝트 목록
    │   │   ├── new/page.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx         ← 프로젝트 상세
    │   │       └── connect/page.tsx ← Config 생성
    │   ├── personas/
    │   │   ├── page.tsx
    │   │   ├── new/page.tsx
    │   │   └── [id]/page.tsx
    │   └── api/
    │       └── config/
    │           └── [projectId]/route.ts ← .aidev.json 생성
    ├── components/
    │   ├── ui/                      ← shadcn/ui
    │   ├── project/
    │   │   ├── ProjectCard.tsx
    │   │   ├── SdlcStatusBar.tsx
    │   │   └── ProjectForm.tsx
    │   ├── persona/
    │   │   ├── PersonaCard.tsx
    │   │   ├── PersonaForm.tsx      ← 3-파트 편집기
    │   │   └── SystemPromptEditor.tsx
    │   └── connect/
    │       ├── ConfigGenerator.tsx
    │       └── IntegrationGuide.tsx
    ├── lib/
    │   ├── bkend.ts                 ← bkend.ai 클라이언트
    │   ├── config-generator.ts      ← .aidev.json 생성 로직
    │   └── default-personas.ts      ← 기본 5개 페르소나 정의
    └── types/
        └── aidev.ts                 ← AiDevConfig, PersonaConfig 등
```

---

## 10. Coding Conventions

| Target | Convention | Example |
|--------|-----------|---------|
| Components | PascalCase | `ProjectCard.tsx` |
| Functions | camelCase | `generateConfig()` |
| Types | PascalCase + 접미사 | `PersonaConfig`, `AiDevConfig` |
| Folders (web) | kebab-case | `connect/`, `system-prompt/` |
| CC 스킬 파일 | kebab-case, 동사-명사 | `activate-persona.md`, `drift-detect.md` |
| .aidev.json 필드 | camelCase | `sdlcPhase`, `systemPrompt` |

---

## 11. Implementation Guide

### 11.1 구현 순서

```
Phase 1: CC Native Layer 완성
  1. 페르소나 정의 문서 5개 (docs/personas/*.md)
  2. drift-detect.md 스킬 작성
  3. generate-config.md 스킬 작성
  4. .aidev.json 기본 템플릿 생성
  5. CLAUDE.md 업데이트 (.aidev.json 로드 규칙 추가)

Phase 2: 웹 기반 설정 (bkend.ai + Next.js)
  6. Next.js 프로젝트 초기화 (web/)
  7. bkend.ai 테넌트 생성 + Project/Persona 컬렉션 설정
  8. bkend.ts 클라이언트 + 인증 연동
  9. types/aidev.ts 타입 정의

Phase 3: 웹 대시보드 UI
  10. shadcn/ui 설치 + 레이아웃
  11. Dashboard 페이지 (프로젝트 목록)
  12. Project 상세 + SDLC 단계 관리
  13. Persona 목록 + 3-파트 편집 폼
  14. Connect 페이지 + .aidev.json 다운로드

Phase 4: Config 생성 & 연동 완성
  15. /api/config/[projectId] Route Handler
  16. config-generator.ts 로직
  17. IntegrationGuide 컴포넌트
  18. 기본 5개 페르소나 시드 데이터
```

### 11.2 Session Guide

#### Module Map

| Module | Scope Key | Description | 예상 턴수 |
|--------|-----------|-------------|:---------:|
| CC Native Layer | `module-1` | 페르소나 정의 + 스킬 + .aidev.json | 30-40 |
| bkend.ai Setup | `module-2` | DB 컬렉션 + 인증 + 타입 | 20-25 |
| Web Dashboard UI | `module-3` | Dashboard + Project + Persona 페이지 | 40-50 |
| Config & Connect | `module-4` | config 생성 API + Connect 페이지 | 20-30 |

#### Recommended Session Plan

| Session | Scope | 목표 |
|---------|-------|------|
| Session 1 | `module-1` | CC만으로 동작하는 프레임워크 완성 |
| Session 2 | `module-2` | bkend.ai 연동 + 인증 동작 |
| Session 3 | `module-3` | 웹 대시보드 UI 완성 |
| Session 4 | `module-4` | config 생성 + 전체 E2E 플로우 |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-21 | Initial draft (Option C) | changhun |
