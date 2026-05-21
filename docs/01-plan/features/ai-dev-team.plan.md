# ai-dev-team Planning Document

> **Summary**: Claude Code 기반 페르소나 개발팀 프레임워크 — 역할 강제 + SDLC 자동화 + 웹 대시보드
>
> **Project**: ai-dev-team
> **Version**: 0.1.0
> **Author**: changhun
> **Date**: 2026-05-21
> **Status**: Draft

---

## Executive Summary

| Perspective | Content |
|-------------|---------|
| **Problem** | AI와 작업할 때 역할 혼재, 할루시네이션, 방향 이탈이 반복됨. 프로젝트마다 처음부터 컨텍스트를 세팅해야 하는 비효율. |
| **Solution** | PM/TechLead/Dev/QA/DevOps 페르소나를 CLAUDE.md + CC skills로 구현. 설계 문서 없이 구현 시작 불가, 역할 범위 이탈 시 자동 중단. |
| **Function/UX Effect** | 개발자는 CC에서 `/activate-persona dev`로 즉시 역할 전환. 웹 대시보드로 전체 프로젝트 SDLC 현황 파악. 신규 프로젝트에 5분 내 연동. |
| **Core Value** | 개인 AI 개발팀을 여러 프로젝트에 일관되게 재사용. 공개 배포 가능한 bkit 스타일 CC 프레임워크. |

---

## Context Anchor

> Auto-generated from Executive Summary. Propagated to Design/Do documents for context continuity.

| Key | Value |
|-----|-------|
| **WHY** | AI 협업 시 역할 혼재·할루시네이션·방향 이탈 문제를 구조적으로 해결 |
| **WHO** | 1차: 본인 (개인 프로젝트 전반). 2차: 공개 배포 후 CC 사용자 전반 |
| **RISK** | 페르소나 역할 강제가 CC 환경에서 기술적으로 완벽하지 않을 수 있음 (LLM 특성) |
| **SUCCESS** | 신규 프로젝트 연동 5분 이내 / 페르소나 전환 1 커맨드 / 방향 이탈 감지율 측정 가능 |
| **SCOPE** | v1: CC 프레임워크 코어 + 웹 대시보드(현황+연동 설정). v2: 웹에서 AI 직접 호출 |

---

## 1. Overview

### 1.1 Purpose

AI(Claude Code)와 협업할 때 발생하는 세 가지 핵심 문제를 해결한다:

1. **역할 혼재**: Dev가 아키텍처를 결정하거나, PM이 코드를 쓰는 현상
2. **방향 이탈**: 설계 문서와 다른 방향으로 구현이 진행되는 현상
3. **컨텍스트 손실**: 프로젝트마다 처음부터 팀 규칙을 세팅해야 하는 비효율

### 1.2 Background

bkit가 PDCA 방법론 프레임워크를 제공하듯, ai-dev-team은 **역할 기반 AI 팀 운영** 프레임워크를 제공한다. CLAUDE.md + `.claude/` 패턴으로 Claude Code 생태계에 네이티브하게 통합되며, 웹 대시보드로 비개발자도 프로젝트 현황을 파악할 수 있다.

공개 배포를 염두에 두고 설계하여 나중에 다른 CC 사용자들도 사용할 수 있게 한다.

### 1.3 Related Documents

- CLAUDE.md: 팀 페르소나 핵심 규칙
- docs/workflows/sdlc.md: SDLC 워크플로우 정의
- bkit: 참조 아키텍처 (CC 플러그인 패턴)

---

## 2. Scope

### 2.1 In Scope (v1)

**코어 프레임워크 (CC Native)**
- [ ] 5개 페르소나 정의 (PM/TechLead/Dev/QA/DevOps) — CLAUDE.md
- [ ] `/activate-persona` 스킬 (역할 전환 커맨드)
- [ ] `/team-status` 스킬 (SDLC 상태 점검)
- [ ] 역할 강제 규칙 (역할 범위 이탈 시 중단 + 담당 페르소나 위임)
- [ ] 방향 이탈 감지 트리거 (설계 문서 없는 구현 시도 시 알림)
- [ ] 다른 프로젝트 연동 패턴 (`.claude/` 복사 + CLAUDE.md 참조)
- [ ] `.aidev.json` 연동 config 포맷 정의

**웹 대시보드 (Next.js + bkend.ai)**
- [ ] 프로젝트 목록 & SDLC 현황 뷰
- [ ] 페르소나 정의 관리 (CRUD)
- [ ] 연동 config 생성기 (`.aidev.json` 다운로드)
- [ ] 인증 (본인 + 공개 배포 대비 멀티유저)

### 2.2 Out of Scope (v2+)

- 웹에서 AI 직접 호출 (브라우저 ↔ Claude API)
- 실시간 다중 사용자 협업
- CI/CD 자동 트리거
- MCP 서버 자동 설치

---

## 3. Requirements

### 3.1 Functional Requirements

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-01 | 5개 페르소나 정의 (PM/TechLead/Dev/QA/DevOps) CLAUDE.md에 명시 | High | Pending |
| FR-02 | `/activate-persona [role]` 커맨드로 페르소나 전환 | High | Pending |
| FR-03 | 각 페르소나는 역할 범위 밖 작업 요청 시 거부 & 위임 | High | Pending |
| FR-04 | 설계 문서(design.md) 없는 상태에서 구현 시도 시 경고 | High | Pending |
| FR-05 | `/team-status` 커맨드로 현재 SDLC 단계 & 다음 액션 확인 | High | Pending |
| FR-06 | SDLC 핸드오프 체크리스트 (각 단계 전환 조건) | Medium | Pending |
| FR-07 | 다른 프로젝트에 연동하는 `.aidev.json` 포맷 정의 | High | Pending |
| FR-08 | 웹 대시보드 — 프로젝트 목록 & SDLC 현황 | High | Pending |
| FR-09 | 웹 대시보드 — 페르소나 정의 CRUD | Medium | Pending |
| FR-10 | 웹 대시보드 — 연동 config 생성 & 다운로드 | High | Pending |
| FR-11 | 인증 (이메일 로그인, 향후 멀티유저 대비) | Medium | Pending |
| FR-12 | 방향 이탈 감지: 설계 이탈 시 자동 중단 규칙 | High | Pending |

### 3.2 Non-Functional Requirements

| Category | Criteria | Measurement Method |
|----------|----------|-------------------|
| 연동 용이성 | 신규 프로젝트 연동 5분 이내 | 직접 측정 |
| 역할 강제율 | 페르소나 역할 이탈 요청의 90% 이상 거부 | 시나리오 테스트 |
| 공개 배포 준비 | README + 설치 가이드 완성 | 문서 체크리스트 |
| 웹 성능 | 대시보드 LCP < 2.5s | Lighthouse |

---

## 4. Success Criteria

### 4.1 Definition of Done

- [ ] 5개 페르소나 CLAUDE.md에 정의 완료
- [ ] `/activate-persona`, `/team-status` 스킬 동작 확인
- [ ] 역할 이탈 시나리오 3개 테스트 통과
- [ ] 설계 문서 없는 구현 시도 시 경고 동작 확인
- [ ] 다른 프로젝트 연동 테스트 (신규 프로젝트 1개에 적용)
- [ ] 웹 대시보드 프로젝트 목록 + 연동 config 생성 동작
- [ ] README 작성 (공개 배포 기준)

### 4.2 Quality Criteria

- [ ] 페르소나 역할 강제 시나리오 테스트 90% 이상
- [ ] 연동 과정 5분 이내 완료 (직접 측정)
- [ ] Lighthouse 성능 90점 이상

---

## 5. Risks and Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| LLM이 역할 강제를 무시 | High | Medium | 시스템 프롬프트 강화 + 구체적 거부 템플릿 |
| 웹-CC 연동 복잡도 증가 | Medium | Medium | v1은 단방향 (웹→config 파일 생성)으로 단순화 |
| 공개 배포 시 다양한 CC 환경 호환성 | Medium | Low | CC 버전 최소 요구사항 명시 + 테스트 매트릭스 |
| 페르소나 정의가 너무 rigid해서 오히려 방해 | Medium | Medium | 역할 강제 on/off 설정 지원 |

---

## 6. Impact Analysis

### 6.1 Changed Resources

| Resource | Type | Change Description |
|----------|------|--------------------|
| CLAUDE.md | Config | 페르소나 정의 & 워크플로우 규칙 추가 |
| .claude/settings.json | Config | 훅 & 권한 설정 |
| .claude/commands/ | Skills | 신규 CC 커맨드 파일들 |
| .aidev.json | Config | 다른 프로젝트 연동용 포맷 (신규) |

### 6.2 Current Consumers

| Resource | Operation | Code Path | Impact |
|----------|-----------|-----------|--------|
| CLAUDE.md | READ | 모든 CC 세션 시작 시 | 기존 내용 덮어쓰지 않게 주의 |
| .claude/commands/ | READ | `/activate-persona`, `/team-status` 호출 시 | 신규 파일, 충돌 없음 |

### 6.3 Verification

- [ ] 기존 프로젝트에서 CLAUDE.md 충돌 없음 확인
- [ ] CC 버전 호환성 확인 (v2.1.71+)

---

## 7. Architecture Considerations

### 7.1 Project Level Selection

| Level | Characteristics | Selected |
|-------|-----------------|:--------:|
| Starter | Static, no backend | ☐ |
| **Dynamic** | Feature-based, BaaS integration | ✅ |
| Enterprise | Microservices, strict layers | ☐ |

**선택 이유**: 웹 대시보드 + 인증 + DB 필요. bkend.ai로 빠르게 구성. 마이크로서비스 수준은 불필요.

### 7.2 Key Architectural Decisions

| Decision | Options | Selected | Rationale |
|----------|---------|----------|-----------|
| 웹 프레임워크 | Next.js / Remix / Vue | Next.js App Router | 가장 익숙, bkit과 일관성 |
| Backend/DB | bkend.ai / Supabase / Custom | bkend.ai | BaaS로 빠른 구성, 인증 내장 |
| CC 코어 포맷 | CLAUDE.md / JSON / YAML | CLAUDE.md + JSON | CC 네이티브 패턴 |
| 페르소나 저장 | DB만 / 파일만 / 양쪽 | 양쪽 (DB + .aidev.json) | 오프라인 사용 + 중앙 관리 |
| 스타일링 | Tailwind / CSS Modules | Tailwind | 빠른 개발 |
| 인증 | bkend.ai Auth | bkend.ai Auth | BaaS 인증 내장 |

### 7.3 두 개의 레이어 구조

```
Layer 1: CC Native Framework (오프라인, 모든 환경)
├── CLAUDE.md              ← 팀 규칙 + 페르소나 정의
├── .claude/settings.json  ← 훅 + 권한
├── .claude/commands/      ← CC 스킬들
└── .aidev.json            ← 연동 config

Layer 2: Web Dashboard (온라인, 관리 도구)
├── 프로젝트 목록 + SDLC 상태
├── 페르소나 CRUD
├── 연동 config 생성기
└── 인증 (bkend.ai)
```

---

## 8. Convention Prerequisites

### 8.1 Conventions to Define

| Category | To Define | Priority |
|----------|-----------|:--------:|
| 페르소나 시스템 프롬프트 포맷 | 역할/금지/위임 3-파트 구조 | High |
| 연동 config (.aidev.json) 스키마 | 버전, 페르소나 목록, 워크플로우 설정 | High |
| CC 스킬 파일 네이밍 | kebab-case, 동사-명사 | Medium |
| 웹 컴포넌트 구조 | features/ 기반 | Medium |

### 8.2 Environment Variables

| Variable | Purpose | Scope |
|----------|---------|-------|
| `NEXT_PUBLIC_BKEND_URL` | bkend.ai API URL | Client |
| `BKEND_API_KEY` | bkend.ai 서버 키 | Server |
| `NEXTAUTH_SECRET` | 세션 시크릿 | Server |

---

## 9. Next Steps

1. [ ] `/pdca design ai-dev-team` — 아키텍처 설계 (페르소나 시스템 + 웹 구조)
2. [ ] 페르소나 시스템 프롬프트 3-파트 구조 정의
3. [ ] `.aidev.json` 스키마 확정
4. [ ] Next.js + bkend.ai 프로젝트 초기화

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 0.1 | 2026-05-21 | Initial draft | changhun |
