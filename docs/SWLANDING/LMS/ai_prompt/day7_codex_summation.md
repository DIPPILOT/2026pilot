# Day 07 교육 내용 요약서 (Codex AI Workspace)

<!-- LMS_SYNC:START -->
## LMS 커리큘럼 기준

- **일차:** Day 7
- **LMS 주제:** 기능 연결과 사용자 시나리오 완성
- **문서 역할:** 일차별 학습 요약 및 강사·학습자 공통 기준
- **강의실·교재 범위:** Backend Logic & Data Integration
- **학습 범위:** 정적 화면에 이벤트와 저장소를 연결하고, 상태 복원·중복 제출 방지·E2E 시나리오로 기능 완성도를 검증한다.

### LMS Task

#### AI Agent 활용 Task
1. Task 1: 기능 연결하기 (Feature Integration)
2. Task 2: 사용자 시나리오 검증하기 (User Scenario Validation)
3. Task 3: 기능 오류 찾기 (Edge Case & Logic Error Audit)

#### Skill Task
4. Skill Task 1 (ADD-D07-T01): Business Rule 명세
5. Skill Task 2 (ADD-D07-T02): Domain Service와 Repository 구현
6. Skill Task 3 (ADD-D07-T03): Transaction·Validation·Exception 검증

### LMS Mission

1. Mission 1: AI와 함께 서비스 완성도 점검 (Service Quality Check)
2. Mission 2: 처음부터 끝까지 사용해보기 (End-to-End User Flow Test)
3. Mission 3 (Skill Mission 1): e-Commerce 주문-결제 Domain Business Rule 구현
4. Mission 4 (Skill Mission 2): 핀테크 이상 금융 거래(FDS) Exception & Validation Audit

### 완료 산출물

- 기능 연결 화면
- 검증 및 예외 처리 코드
- 서비스 품질·E2E 검증 보고서

> 이 문서는 `docs/index.html`, Day 7 강의실, 교재 및 Codex 실습 페이지를 통합 기준으로 동기화했습니다. 세부 실습 데이터와 예시는 아래 기존 본문을 사용합니다.
<!-- LMS_SYNC:END -->

본 요약서는 Day 7 **"개발 (AI와 함께 기능 완성하기)"** 교육 세션을 진행하는 강사 및 참가자들을 위한 최종 종합 요약 가이드라인입니다. Day 6가 빈 화면에서 화면 구조 뼈대를 구성하는 것(정적 렌더링)이 중심이었다면, Day 7은 사용자의 클릭 동작, 입력 전송, 데이터 적재 흐름을 완성(동적 기능 연결, Task 01)하고, 이전 상태값 유실 등 유입 흐름의 단절을 막는 사용자 시나리오 검증(Task 02)과 연타 버튼 중복 유입 및 시간 바운더리 등 로직 오작동을 차단하는 기능 검증(Task 03)을 통해 온전하고 튼튼하게 작동하는 실무형 소프트웨어 기능을 조립해 내는 핵심 요약 가이드라인을 제공합니다.

---

## 📌 Part 1. 도입 배경 및 필요성

### 1. 기능 연동 단계의 비개발 주니어 극복 장벽
* **정적 화면의 껍데기 한계**: 퍼블리싱 화면은 완벽하지만, 클릭 액션 및 폼 전송 이벤트와 상태 저장 장치가 없으면 실제 사용자에게 아무 가치도 주지 못합니다.
* **사용자 여정(Journey)의 파편화**: 회원가입 개별 함수와 예약 목록 렌더러 함수는 각각 잘 돌지만, 사용자가 목록을 갔다 상세 페이지로 돌아갈 때 필터 정보가 날아가거나 상태 백업이 누락되는 등의 흐름 연결 결함이 흔히 발생합니다.
* **예외 입력(Abuse)으로 인한 시스템 붕괴**: 버튼을 빠르게 여러 번 누르는 연속 유입(Double Submit)이나 과거 날짜 예약 신청 등 이상 범주 입력에 대한 안전 장치(Disabled state, Data Validation)가 부재하면 데이터베이스 무결성이 연쇄 붕괴합니다.

### 2. ChatGPT vs Codex Client (Workspace 기반)
| 비교 항목 | ChatGPT (일반 대화형 AI) | Codex Client (Workspace 기반 AI) |
|---|---|---|
| **이벤트 연결 제안** | HTML 조각만 보고 단일 버튼의 이벤트 바인딩 영작 제공 | 회원가입 폼 양식 제출부터 대시보드 화면 전환, 로컬 스토리지 적재까지 화면 간 데이터 이동 체계를 총체적으로 제시 |
| **시나리오 갭 검증** | "뒤로 가기 정보가 사라지네요"에 대한 단편적 해결 코드 제시 | 전체 화면 맵(`day7_user_flow.md`)을 읽어들여 목록 회귀, 상세 예약 진입, 가상 결제 상태 변화의 정보 유실 취약 구간을 구조 분석 |
| **이상 연타 예외 차단** | 단순 setTimeout 사용 디바운스 코드만 기계적 리턴 | 로딩 상태값 락 지시 및 HTML 태그의 `disabled` 속성을 유기적으로 동기화하여 연속 데이터 유입을 원천 예방하는 실무 로직 빌드 |

---

## 📌 Part 2. 오늘 실습의 목표 및 결과물 요약

### 1. 오늘 만들 최종 결과물
* **Task 01. 기능 연결하기**: 폼 클릭 제출 시 로컬 스토리지에 데이터를 적재하고 정상 화면 전환을 제어하는 **동적 이벤트 스크립트** (출력: `day7_unconnected_feature.html` 기반 완성 코드)
* **Task 02. 사용자 시나리오 검증하기**: 화면 뒤로가기 시 필터링 설정 정보를 보존하는 **세션 백업 로직** (출력: `day7_user_flow.md` 기반 대안 코드)
* **Task 03. 기능 오류 찾기**: 중복 연타 차단 락(Lock) 변수 및 과거일자 예외 검증 가드를 탑재한 **보안 및 무결성 검증 소스** (출력: `day7_feature_validation.js` 수정본)
* **Mission 01. AI와 함께 서비스 완성도 점검하기**: 로딩 피드백(Spinner) 누락 및 스토리지 예외 감지를 우선순위 평점으로 기록한 **서비스 품질 점검 보고서** (출력: `day7_service_audit.md`)
* **Mission 02. 처음부터 끝까지 사용해보기**: 스마트폰 조작이 낯선 페르소나의 동선 오류를 수렴해 보완한 **End-to-End 유저 시나리오 종합 검증서** (출력: `day7_e2e_validation.md`)

---

## 📌 Part 3. 따라하기 (Step-by-Step 실습 가이드)

### STEP 1. Task 01 - 기능 연결하기
* **행동**: 기능이 미동작하는 회원가입 마크업 `day7_unconnected_feature.html`을 마련하고 아래 질문을 Codex에 제출합니다.
  > "제공된 day7_unconnected_feature.html의 회원가입 화면 코드에 JavaScript 기능을 연결하려고 합니다. 1) 가입 완료 버튼 클릭 시 입력값 유효성을 검사하고, 2) 브라우저 로컬 스토리지에 정보를 저장하며, 3) 성공 시 대시보드 화면으로 이동하는 연동 스크립트를 작성해 주세요. 누락된 취소 버튼 반응이나 중복 가입 체크 로직도 함께 제안해 주세요."
* **확인**: 가입 버튼 제출 시 브라우저 내 경고 메시지 창이 정상 점등하고, 개발자 도구 Application 탭의 LocalStorage 영역에 입력했던 email 데이터가 적재되는지 검증합니다.

### STEP 2. Task 02 - 사용자 시나리오 검증하기
* **행동**: 가입, 목록, 상세 여정을 정리한 `day7_user_flow.md` 명세를 기준으로 전 구간의 정보 유실 원인을 질문합니다.
  > "제공된 day7_user_flow.md 명세(가입 ➔ 전문가 검색 ➔ 상세 예약 ➔ 가상 결제)의 단계별 호출 순서를 분석하여, 사용자가 이 동선을 탈 때 정보 유실이 일어나기 가장 쉬운 2가지 핵심 구간을 진단하고, 이를 방지하기 위한 상태 보존 로직 구조를 대안 코드로 제안해 주세요."
* **확인**: 목록 복귀 시 기존 검색 카테고리 필터링이 초기화되는 문제에 대응하여 `sessionStorage.setItem` 캐싱 헬퍼 함수가 알맞게 추출되었는지 검증합니다.

### STEP 3. Task 03 - 기능 오류 찾기
* **행동**: 버튼 연타 중복 에러 유발 소스 `day7_feature_validation.js`를 마련한 뒤 예외 방지 패치를 지시합니다.
  > "제공된 day7_feature_validation.js 파일 내의 예약 신청 로직을 검토해 주세요. 1) 예약 요청의 중복 유입(버튼 연타) 취약점, 2) 예약 일자의 과거 시점 신청 에러 가능성을 검출하고, 이를 방어하기 위해 비활성화(Disabled state) 처리와 날짜 유효 기간 대조문이 추가된 최종 검증 코드를 제안해 주세요."
* **확인**: 락을 지칭하는 불리언 변수 `isSubmitting` 상태 감지가 작동하는지 보고, 타겟 엘리먼트 버튼의 `.disabled = true` 제어가 정상 처리되는지 점검합니다.

### Mission 1. AI와 함께 서비스 완성도 점검하기
* **행동**: 자신이 완성한 `day7_feature_validation.js` 통합 스크립트의 품질 감사를 전송합니다.
  > "제공된 코드 전량과 화면 이동 흐름을 기반으로, 서비스 QA 관점에서 작동 상 누락된 로딩 피드백이나 예외 핸들링을 분석해 점검 보고서(Service Audit)를 우선순위와 함께 생성해 주세요."
* **확인**: 스토리지 용량 초과 방지 `try-catch` 권유 및 85% 대의 가상 완성도 평가가 기재된 `day7_service_audit.md` 파일이 확보되었는지 점검합니다.

### Mission 2. 처음부터 끝까지 사용해보기 (E2E Walkthrough)
* **행동**: 50대 초보 자영업자 페르소나를 부여해 모의 E2E 여정 롤플레잉 테스트를 진행합니다.
  > "당신은 모바일 앱 예약 결제가 낯선 50대 초보 자영업자입니다. 가입부터 결제 완료에 이르는 E2E 시나리오를 사용한다고 가정할 때, 제 로직에서 불편을 유발하거나 중간에 이탈할 위험 구간이 있는지 생생한 유저 시나리오 검증서(E2E Validation)를 뽑아주세요."
* **확인**: 과거 날짜 신청 불가가 화면에 친절히 명시되지 않았을 때 느낄 피로 등을 교정한 내용이 반영되어 `day7_e2e_validation.md` 검증 결과서로 출력되었는지 파악합니다.

---

## 📌 Part 4. 작동 원리 및 의의

### 1. 클라이언트 스토리지 영속화 (Storage Persistence & State Control)
* 서버와의 직접 데이터베이스 교신 이전에, 브라우저가 보장하는 로컬/세션 캐싱 스토리지를 제어하여 정보를 보존하고 이탈을 예방하는 화면 흐름 설계 기법입니다.

### 2. 연속 제출 락 기법 (Debouncing & Disabled Guard)
* 마우스 연타 클릭으로 인해 생성되는 중복 이벤트 큐를 제어하고 비활성화 플래그를 동기화하여 불필요한 트랜잭션과 데이터 훼손을 예방하는 튼튼한 개발 실무 원칙입니다.

### 3. 다섯 가지 기능 완성도 향상 마일스톤
```text
[정적 마크업 이벤트 연결] (Task 01. 버튼에 생명력 주입)
         │
         ▼
[사용자 전체 여정 흐름 추적] (Task 02. 상태 보존성 확보)
         │
         ▼
[비정상 연타 및 가드 코딩] (Task 03. 견고함 오디팅)
         │
         ▼
[사용성 보장 QA 종합 검사] (Mission 01. 스코어링 진단)
         │
         ▼
[가상 고객 페르소나 E2E 완료] (Mission 02. 여정 완주 증명)
```
이 기능 조립 및 검증 훈련을 통해 학생들은 **"화면이 완성되는 것과 서비스가 실존하는 것의 차이"**를 명확히 이해하고, 어떻게 하면 더 친절하고 안전한 애플리케이션을 완성할 수 있을지 스스로 조율해 나가는 소프트웨어 설계 및 개발 능력을 주도적으로 체득하게 됩니다.

---

## 📌 Part 5. 교육 세션 가이드

### 💡 교육 설계 스펙
* **난이도**: ★★☆☆☆ (초급 - 비전공자도 로컬스토리지와 기본 자바스크립트 개념으로 가볍게 습득)
* **예상 실습 시간**: 1시간 30분 ~ 2시간
* **실무 활용도**: ★★★★★ (버그 없는 튼튼한 애플리케이션을 빌드하기 위한 핵심 기초)
* **학습자 질문/토의 주제**:
  1. "사용자가 예약 완료 버튼을 누른 지 5초가 지나도 응답이 오지 않는다면, 이것은 프론트엔드의 이벤트 처리 실패(오류)일까요, 아니면 백엔드 서버의 처리 지연일까요? 두 상황을 구별하여 사용자에게 화면 메시지를 주려면 이벤트 로직을 어떻게 수정해야 할까요?"
  2. "브라우저 로컬 스토리지(LocalStorage)는 사용자 컴퓨터에 데이터를 영구 저장하므로 편리하지만, 보안에 매우 취약합니다. 그렇다면 사용자의 어떤 정보가 로컬 스토리지에 저장되어도 안전하고, 어떤 정보는 절대 저장되어서는 안 될까요?"

<!-- ADDITIONAL_SKILL_TASKS:START -->
---

## 📌 추가 Skill Task 요약 — Back-End & Domain Business Logic

기존 Day 7 커리큘럼에 기술 전문성과 AI 협업 역량을 명시적으로 연결하기 위해 다음 3개 Task를 추가합니다. 기존 Task와 Mission의 목표·산출물은 유지하며, 추가 Task는 기존 결과물을 더 깊게 설계·구현·검증하는 확장 단계입니다.

### 1. 추가 Task 및 Skill Map

| Task ID | 추가 Task | 영역 | 기술 Skill | AI 활용 Skill |
|---|---|---|---|---|
| `ADD-D07-T01` | Business Rule 명세 | `TECH` | `TECH-BIZ` `TECH-DDD` | `AI-ANA` `AI-REV` `AI-DOC` |
| `ADD-D07-T02` | Domain Service와 Repository 구현 | `HYBRID` | `TECH-BE` `TECH-BIZ` `TECH-DATA` | `AI-CTX` `AI-GEN` `AI-REV` |
| `ADD-D07-T03` | Transaction·Validation·Exception 검증 | `AI` | `TECH-BE` `TECH-BIZ` `TECH-QA` | `AI-QA` `AI-DBG` `AI-REV` |

### 2. 학습 연결 흐름

`ADD-D07-T01` Business Rule 명세 → `ADD-D07-T02` Domain Service와 Repository 구현 → `ADD-D07-T03` Transaction·Validation·Exception 검증

- **입력 Context:** API Contract, ERD, Front-End Flow
- **Day 통합 산출물:** Business Rule 문서, Domain Service, DB 연결, Rule Test
- **권장 제출 파일:** `09_BUSINESS_RULE.md`, `Back-End Source`
- **AI 역할:** Domain Reviewer / Backend Engineer

### 3. 평가 기준

| 평가 영역 | 비중 | 확인 기준 |
|---|---:|---|
| 기술 Skill | 40% | Domain·설계·코드·데이터·보안 등 해당 기술 기준을 충족했는가 |
| AI 활용 Skill | 30% | Context와 역할을 명확히 제공하고 결과를 비판적으로 검토했는가 |
| 검증 가능성 | 20% | 정상·경계·실패 조건과 완료 기준을 실제로 확인할 수 있는가 |
| 문서화·인계 | 10% | 판단 근거와 산출물이 다음 Task에서 재사용 가능한가 |

### 4. 공통 완료 Checklist

- [ ] 3개 추가 Task의 결과가 기존 Day 7 산출물과 연결되어 있다.
- [ ] 모든 Task에 기술 Skill과 AI 활용 Skill의 수행 증거가 있다.
- [ ] AI가 제안한 내용의 수용·수정·거절 근거가 기록되어 있다.
- [ ] 추측과 확정 사실이 구분되어 있다.
- [ ] 결과물이 다음 Day의 입력으로 재사용 가능하다.

### 5. 다음 Day 연결

Domain Service와 Business Rule을 Day 8 인증·인가 및 Role 검증의 보호 대상으로 사용한다.
<!-- ADDITIONAL_SKILL_TASKS:END -->
