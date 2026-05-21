# ai-dev-team module-2 Gap Analysis

> **Scope**: module-2 — bkend.ai Setup (Next.js 기반 + BaaS 클라이언트 + 타입 정의)
> **Date**: 2026-05-21
> **Phase**: Check
> **Analyzer**: gap-detector (static-only — no server running)

---

## Context Anchor

| Key | Value |
|-----|-------|
| **WHY** | AI 협업 시 역할 혼재·할루시네이션·방향 이탈 문제를 구조적으로 해결 |
| **WHO** | 1차: 본인 (개인 프로젝트 전반). 2차: 공개 배포 후 CC 사용자 전반 |
| **RISK** | 페르소나 역할 강제가 LLM 특성상 완벽하지 않을 수 있음 |
| **SUCCESS** | 신규 프로젝트 연동 5분 이내 / 역할 이탈 감지율 90%+ / 연동 커맨드 1개 |
| **SCOPE** | v1: CC 프레임워크 코어 + 웹 대시보드(현황+연동설정). v2: 웹 AI 직접 호출 |

---

## 1. Strategic Alignment

| Check | Status | Evidence |
|-------|--------|----------|
| PRD core problem addressed | ✅ | 타입 + BaaS 클라이언트로 웹 대시보드 기반 완성 |
| Plan FR-08~11 on track | ✅ | bkend.ts CRUD, types/aidev.ts, Next.js 초기화 완료 |
| Design Option C followed | ✅ | CC Native 레이어 독립, BaaS 인프라 위임 |

---

## 2. Structural Match

**Module-2 required files** (Design §11.1 Phase 2 + §9.2):

| File | Expected | Actual | Status |
|------|----------|--------|--------|
| `web/package.json` | ✅ | ✅ | ✅ |
| `web/next.config.ts` | ✅ | ✅ | ✅ |
| `web/tsconfig.json` | ✅ | ✅ | ✅ |
| `web/postcss.config.mjs` | ✅ | ✅ | ✅ |
| `web/app/globals.css` | ✅ | ✅ | ✅ |
| `web/app/layout.tsx` | ✅ | ✅ | ✅ |
| `web/app/page.tsx` | ✅ | ✅ | ✅ |
| `web/lib/bkend.ts` | ✅ | ✅ | ✅ |
| `web/types/aidev.ts` | ✅ | ✅ | ✅ |
| `web/.env.example` | ✅ | ✅ | ✅ |
| `web/lib/default-personas.ts` | Phase 4 prep | ✅ | ✅ (bonus) |
| `web/lib/config-generator.ts` | Phase 4 prep | ✅ | ✅ (bonus) |

**Structural Score: 10/10 required = 100%**

---

## 3. Functional Depth

### `web/types/aidev.ts`
| Item | Status |
|------|--------|
| `SdlcPhase` 6-value union type | ✅ |
| `PersonaRole` 5-value union type | ✅ |
| `PersonaConfig` interface (7 fields) | ✅ |
| `TeamRules` interface (4 boolean fields) | ✅ |
| `AiDevProject` + `AiDevConfig` interfaces | ✅ |
| `ProjectRecord` + `PersonaRecord` (DB model) | ✅ |
| `ApiResponse<T>` + `ApiListResponse<T>` (with pagination) | ✅ |
| Form types: Create/Update for Project & Persona | ✅ |
| `SDLC_PHASES` constant (label, persona, next chain) | ✅ |
| `PERSONA_LABELS` constant | ✅ |

### `web/lib/bkend.ts`
| Item | Status |
|------|--------|
| `BkendClient` class with private `request()` | ✅ |
| `projects.list/get/create/update/delete` | ✅ |
| `personas.list/get/create/update/delete` | ✅ |
| Auth header `Authorization: Bearer {apiKey}` | ✅ |
| Error extraction from JSON response | ✅ |
| `isConfigured` getter | ✅ |
| `bkend` singleton export | ✅ |
| Environment variable TODO comments | ✅ |

### `web/app/layout.tsx` + `page.tsx`
| Item | Status |
|------|--------|
| `Metadata` export (title, description) | ✅ |
| `RootLayout` with Tailwind base classes | ✅ |
| Dashboard stub with module-3 TODO comment | ✅ |
| Header + "새 프로젝트" button + empty state CTA | ✅ |

**Functional Score: 100%**

---

## 4. API Contract

Design §4.1 vs `bkend.ts` client method mapping:

| Design Endpoint | Client Method | Response Type | Status |
|-----------------|---------------|---------------|--------|
| GET /api/projects | `bkend.projects.list()` | `ApiListResponse<ProjectRecord>` | ✅ |
| POST /api/projects | `bkend.projects.create()` | `ApiResponse<ProjectRecord>` | ✅ |
| PUT /api/projects/:id | `bkend.projects.update()` | `ApiResponse<ProjectRecord>` | ✅ |
| DELETE /api/projects/:id | `bkend.projects.delete()` | `ApiResponse<{deleted: boolean}>` | ✅ |
| GET /api/personas | `bkend.personas.list()` | `ApiListResponse<PersonaRecord>` | ✅ |
| POST /api/personas | `bkend.personas.create()` | `ApiResponse<PersonaRecord>` | ✅ |
| PUT /api/personas/:id | `bkend.personas.update()` | `ApiResponse<PersonaRecord>` | ✅ |
| DELETE /api/personas/:id | `bkend.personas.delete()` | `ApiResponse<{deleted: boolean}>` | ✅ |

> Note: `GET /api/config/[projectId]` (Design §4.2) is module-4 scope — not evaluated here.

**Contract Score: 100%**

---

## 5. Match Rate

| Axis | Weight (static-only) | Score | Contribution |
|------|---------------------|-------|-------------|
| Structural | 0.20 | 100% | 20.0 |
| Functional | 0.40 | 100% | 40.0 |
| Contract | 0.40 | 100% | 40.0 |
| **Overall** | | | **100%** |

---

## 6. Gaps

**No gaps found.** ✅

**Bonus items implemented ahead of schedule:**
- `web/lib/default-personas.ts` — Phase 4 prep (5 default personas seed data)
- `web/lib/config-generator.ts` — Phase 4 prep (.aidev.json generation logic)

These will accelerate module-4 implementation.

---

## 7. Plan Success Criteria (module-2)

| Criteria | Status | Evidence |
|----------|--------|----------|
| FR-08: 프로젝트 CRUD (bkend.ai) | ✅ | `bkend.projects.*` 5개 메서드 |
| FR-09: 페르소나 CRUD | ✅ | `bkend.personas.*` 5개 메서드 |
| FR-10: .aidev.json 생성 | ⚠️ Partial | lib/config-generator.ts 구현, API route는 module-4 |
| FR-11: 타입 안전성 | ✅ | types/aidev.ts TypeScript strict 타입 완비 |

---

## 8. Conclusion

Module-2 완료. 매치율 **100%**. 이터레이션 불필요.

다음 단계: `/pdca do ai-dev-team --scope module-3` (Web Dashboard UI)
