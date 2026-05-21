---
description: 현재 프로젝트의 AI 개발팀 상태와 SDLC 단계를 확인한다
---

# Design Ref: §3.1 .aidev.json — project.sdlcPhase가 단계의 중앙 소스

현재 프로젝트의 AI Dev Team 상태를 점검해줘.

## 점검 순서

### 0. .aidev.json 로드 (최우선)
`.aidev.json`이 존재하면 읽어서 다음을 추출한다:
- `project.name`, `project.sdlcPhase` — 공식 현재 단계
- `personas` — 활성화된 페르소나 목록 (`active: true`)
- `rules` — 적용 중인 팀 규칙

`.aidev.json`이 없으면:
"⚠️ .aidev.json 없음. /generate-config로 먼저 프로젝트 config를 생성하세요."
이후 docs/ 폴더 구조로 단계를 추론한다 (fallback).

### 1. SDLC 현재 단계 확인
`.aidev.json`의 `project.sdlcPhase`를 기준으로 보고.
추가로 실제 docs/ 폴더와 대조해 일치 여부 확인:
- docs/01-plan/ 에 Plan 문서 있는지
- docs/02-design/ 에 Design 문서 있는지
- 구현 코드가 있는지 (src/ 또는 app/ 존재)

`.aidev.json` 단계와 실제 파일 구조가 불일치하면 경고 출력.

### 2. 활성 페르소나
`.aidev.json`의 `personas` 배열에서 `active: true`인 목록.
현재 SDLC 단계에 맞는 담당 페르소나가 누구인지 강조.
다음 단계로 넘어가기 위한 조건 충족 여부 확인.

### 3. 방향 이탈 위험 감지
- 최근 구현이 Design 문서와 일치하는지 (간략 확인)
- `.aidev.json`의 `rules.driftDetection: true`이면 경고 활성화
- 범위 초과(scope creep) 징후 여부

### 4. 보고 형식

```
📊 AI Dev Team Status
─────────────────────────────────────────
프로젝트: {project.name}
SDLC 단계: {project.sdlcPhase} (출처: .aidev.json)
담당 페르소나: {현재 단계 담당}
─────────────────────────────────────────
[plan] {✅/⏳} → [design] {✅/⏳} → [implement] {✅/⏳} 
  → [verify] {✅/⏳} → [deploy] {✅/⏳}
─────────────────────────────────────────
활성 페르소나: {active:true 목록}
적용 규칙:
  requireDesignBeforeImplement: {true/false}
  driftDetection: {true/false}
  roleEnforcement: {true/false}
─────────────────────────────────────────
⚡ 권고 액션:
  - 지금 당장: {현재 단계 기준 다음 할 일}
  - 다음 페르소나: /activate-persona {다음 담당}
```
