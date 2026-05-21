---
description: 현재 구현이 설계 문서(design.md)에서 이탈했는지 감지하고 보고한다
---

# Design Ref: §2 Architecture — 단방향, CC Native Layer가 핵심 가드

현재 프로젝트의 구현이 설계 문서에서 이탈했는지 점검해줘.

## 점검 단계

### 1. 설계 문서 확인
`docs/02-design/features/` 아래에 design.md가 있는지 확인한다.
없으면: "설계 문서가 없습니다. /activate-persona techlead로 먼저 설계를 완성하세요." 출력 후 중단.

### 2. 이탈 감지 항목

**구조적 이탈** — 설계에 명시된 파일/폴더가 없거나 다른 위치에 있는 경우:
- design.md §9(File Structure)에 명시된 파일 목록 vs 실제 파일 존재 여부
- 누락된 파일 목록 출력

**기능적 이탈** — 설계에 없는 기능이 추가되었거나, 설계 기능이 누락된 경우:
- design.md §5.4(Page UI Checklist) 항목 vs 실제 구현
- design.md §3(Data Model)의 필드 vs 실제 코드의 타입/스키마

**API 이탈** — 설계된 API 계약과 실제 구현이 다른 경우:
- design.md §4(API Spec)의 엔드포인트 vs 실제 route 파일
- 요청/응답 스키마 불일치

**방향 이탈** — 설계에 없는 라이브러리, 패턴, 기술 스택 사용:
- 설계에서 결정된 기술 스택 외 추가 사용 여부

### 3. 심각도 분류

| 심각도 | 기준 | 액션 |
|--------|------|------|
| Critical | API 계약 변경, 데이터 모델 이탈 | 즉시 중단, TechLead 확인 |
| High | 누락된 기능, 잘못된 파일 구조 | TechLead 확인 후 계속 |
| Medium | 마이너 구현 차이 | 기록 후 계속 |
| Low | 스타일, 네이밍 차이 | 기록만 |

### 4. 보고 형식

```
🔍 Drift Detection Report
──────────────────────────────
설계 문서: docs/02-design/features/{feature}.design.md
점검 시각: {timestamp}

[Critical] 없음 / 있음: {목록}
[High]     없음 / 있음: {목록}
[Medium]   없음 / 있음: {목록}

전체 일치율: {N}%

권고:
- Critical/High 항목이 있으면 구현 중단 후 TechLead와 확인
- Medium 이하는 계속 구현 가능
```

### 5. Critical 이탈 발견 시 메시지

"설계 이탈이 감지되었습니다.
이탈 항목: {항목}
설계 문서: design.md §{section}

TechLead(/activate-persona techlead)와 확인 후 계속 진행하세요."
