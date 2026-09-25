# Day 04 교육 내용 요약서 (Codex AI Workspace)

<!-- LMS_SYNC:START -->
## LMS 커리큘럼 기준

- **일차:** Day 4
- **LMS 주제:** API 설계와 인터페이스 명세
- **문서 역할:** 일차별 학습 요약 및 강사·학습자 공통 기준
- **강의실·교재 범위:** API Design & Interface Specification
- **학습 범위:** 화면·데이터 설계를 API 계약으로 전환하고 Swagger/OpenAPI 관점에서 정합성, 변경 영향, 테스트 시나리오를 검증한다.

### LMS Task

#### AI Agent 활용 Task
1. Task 1: API 계약서 생성 (API Contract Generation)
2. Task 2: API 불일치 검출 (API Consistency Audit)
3. Task 3: API 변경 영향 분석 (API Change Impact Sync)

#### Skill Task
4. Skill Task 1 (ADD-D04-T01): Domain Boundary 기반 Endpoint 설계
5. Skill Task 2 (ADD-D04-T02): Request·Response·Error Contract 작성
6. Skill Task 3 (ADD-D04-T03): API Contract Consistency Review

### LMS Mission

1. Mission 1: API 리뷰 및 개선 (API Review & Optimization)
2. Mission 2: API 테스트 시나리오 생성 (API Test Scenario Generation)
3. Mission 3 (Skill Mission 1): 핀테크 오픈뱅킹 API & OpenAPI 명세
4. Mission 4 (Skill Mission 2): 실시간 배달 주문-라이더 API Audit

### 완료 산출물

- API 명세서
- 정합성·변경 영향 리포트
- API 테스트 시나리오

> 이 문서는 `docs/index.html`, Day 4 강의실, 교재 및 Codex 실습 페이지를 통합 기준으로 동기화했습니다. 세부 실습 데이터와 예시는 아래 기존 본문을 사용합니다.
<!-- LMS_SYNC:END -->

본 요약서는 Day 4 **"기술설계 (API 설계 및 인터페이스 정의)"** 교육 세션을 진행하는 강사 및 참가자들을 위한 최종 종합 요약 가이드라인입니다. 요구사항 정의서와 화면 정의서를 바탕으로 기획과 개발의 연결 약속인 API 계약서(API Contract)를 작성하고, 각 문서 간의 불일치 및 누락 항목을 식별하며, 변경에 따른 UI 및 API 종속 영향 분석과 테스팅을 자동화하는 최첨단 인터페이스 협업 아키텍처에 대한 핵심 요약 정보를 담고 있습니다.

---

## 📌 Part 1. 도입 배경 및 필요성

### 1. API 설계의 병목 현상
* **개발 불일치**: 기획 문서나 화면 디자인과 실제 배포된 API Spec의 필드가 달라 통신 에러가 나거나 화면에 특정 값이 나오지 않는 결함이 속출합니다.
* **커뮤니케이션 오차**: 프론트엔드와 백엔드 개발자 간의 구두 약속으로만 필드를 정의해 개발하다가, 이름(Camel vs Snake Case)이나 형식이 맞지 않아 매번 회의를 반복하게 됩니다.
* **변경 관리 병목**: 가격이나 주문 단계 등 비즈니스 요구사항 하나만 바뀌어도 이에 연결된 API와 프론트 화면, 테스트 코드까지 어떤 수정 범위가 발생하는지 확인하는 데 막대한 분석 코스트가 발생합니다.

### 2. ChatGPT vs Codex Client (Workspace 기반)
| 비교 항목 | ChatGPT (일반 대화형 AI) | Codex Client (Workspace 기반 AI) |
|---|---|---|
| **컨텍스트 인지** | 일회성 API 코드 템플릿만 대충 구성해 줌 | 기획서, 화면 설계서, 백엔드 API 명세 파일 간의 실제 필드 매핑 및 기능 부합 여부 교차 검증 |
| **불일치 자동 감지** | 사용자가 수작업으로 입력한 단일 텍스트만 감사 | 기획-화면-API로 이어지는 다중 산출물의 속성을 추적하여 평점, 에러 코드 누락 등을 입체적으로 검출 |
| **테스트 시나리오** | 단순 성공(200 OK) 위주의 더미 시나리오 생성 | API 스펙의 필수 제약 조건과 경계값을 분석해 400 Bad Request, 비인가 에러 등 다양한 Sad Path 검증안 빌드 |

---

## 📌 Part 2. 오늘 실습의 목표 및 결과물 요약

### 1. 오늘 만들 최종 결과물
* **Task 01. API 계약서 생성**: 화면 UI와 기획 요구사항을 분석하여 작성한 **RESTful API 명세 규격서** (출력: `api-contract.md`)
* **Task 02. API 불일치 검출**: 기획-화면-API 문서의 차이를 전수 조사해 정리한 **API 정합성 검토 보고서** (출력: `api-consistency-report.md`)
* **Task 03. API 변경 영향 분석**: 예약 프로세스 단계 세분화 변경 시 개정 대상과 UI 수정 액션을 도출한 **API 변경 영향 분석서** (출력: `api-impact-analysis.md`)
* **Mission 01. API 리뷰 및 개선**: 명명법 위배, HTTP 상태 코드 파편화 등을 바로잡은 **API Review Report** (출력: `api-review-report.md`)
* **Mission 02. API 테스트 시나리오 생성**: 인증 만료, 한계 초과, 형식 오류 검증 항목을 구조화한 **API Test Scenario & Checklist** (출력: `api-test-scenario.md`)

---

## 📌 Part 3. 따라하기 (Step-by-Step 실습 가이드)

### STEP 1. Task 01 - API 계약서 생성
* **행동**: `day4_requirements.md`와 `day4_screen_definition.md`를 준비한 후 아래 명령을 Codex에 전달합니다.
  > "제공된 요구사항 정의서와 화면 정의서 내용을 기반으로, 필요한 API 목록을 도출하고 요청(Request) 및 응답(Response) 필드의 타입과 영문 변수명을 정의하여 표준 API 계약서(API Contract)를 작성해 주세요."
* **확인**: 예약 및 전문가 조회 등 화면 표시에 핵심적인 API 목록과 Request/Response JSON 스펙이 REST 표준 구조로 도출되었는지 확인합니다.

### STEP 2. Task 02 - API 불일치 검출
* **행동**: 기획 요구사항서, 화면 설계서, 그리고 API 명세서 초안(`day4_api_specification_v1.md`)을 대조하여 아래 명령을 줍니다.
  > "제공된 day4_requirements.md, day4_screen_definition.md, day4_api_specification_v1.md 파일들을 교차 대조하여 기획 요구사항이나 화면 UI 설계와 불일치하거나 누락된 API 엔드포인트 및 필드를 찾아 검토 보고서를 작성해 주세요."
* **확인**: 전문가 화면 카드에는 평점이 있으나 API Response에는 평점 데이터가 누락된 점, 예약 승인/거절 API가 스펙에서 누락된 점이 보고서에 명확히 표기되는지 점검합니다.

### STEP 3. Task 03 - API 변경 영향 분석
* **행동**: 금액 정보가 예약 신청에서 결제 단계로 이관되는 변경 건(`day4_api_change_request.md`)을 제시하고 아래 명령을 빌드합니다.
  > "제공된 API 변경 요청서(day4_api_change_request.md) 내용을 분석하여, 예약 신청 API 수정 시 영향을 받는 다른 시스템 영역과 문서의 목록을 도출하고, 팀원들에게 즉시 작업 공유가 가능한 API 영향도 분석서를 작성해 주세요."
* **확인**: Reservations 테이블 스펙 변경, 프론트엔드 입력 폼 숨김 조치, 결제 처리 API 신설 조치 등 영향 도메인과 작업 목록이 구조화되었는지 검증합니다.

### Mission 1. API 리뷰 및 개선 (API Review)
* **행동**: 리뷰 미팅 회의록(`day4_api_review_dialogue.md`)을 가동하여 아래 프롬프트를 전송합니다.
  > "제공된 day4_api_specification_v1.md의 API 명세서를 검토하여, REST API 설계 표준(HTTP Method 용도, URL 명명법), 일관된 오류 처리 구조, 확장성을 기준으로 개선점을 분석하고 API 리뷰 보고서를 작성해 주세요."
* **확인**: `/api/v1/getExperts` ➔ `/api/v1/experts` 로의 리소스 중심 네이밍 보완점 및 HTTP 401 Unauthorized 등 RFC 표준 에러 명세 도입 권장안이 서술되었는지 확인합니다.

### Mission 2. API 테스트 시나리오 생성 (API Test Scenario)
* **행동**: 완성된 API 계약서 스펙을 기반으로 아래 검증 명령을 빌드합니다.
  > "현재 정의된 예약 및 결제 API 명세를 기반으로, 정상 등록 흐름(Happy Path)과 필수 파라미터 누락, 날짜 형식 오류, 한도 초과 및 권한 만료 등의 예외 케이스를 모두 포함하는 API 테스트 시나리오 및 검증 체크리스트를 작성해 주세요."
* **확인**: 정상 흐름(201 Created), 날짜 형식 오류(400 Bad Request), 비인가 요청(401 Unauthorized) 등의 Happy/Sad Path가 검증 절차 및 기대 결과와 함께 논리적으로 나열되었는지 점검합니다.

---

## 📌 Part 4. 작동 원리 및 의의

### 1. 인터페이스 계약 자동화 (API First Architecture)
* 자연어로 구술된 화면 흐름과 기능 정의서로부터 백엔드의 논리적 API Endpoint와 전송 데이터 규격(Schema)을 역추론하여 계약서를 자동 작성해 주는 지능형 파싱 방식입니다.

### 2. 다차원 명세 오딧 (Multi-Dimensional Spec Auditing)
* 기획서 ➔ 화면 ➔ API의 서로 다른 3대 문서 간의 불일치를 논리 단위로 교차 대조하여, 사람이 대조할 때 발생하는 '눈속임 누락'을 100% 잡아내는 의미론적 정합성 매핑 기술입니다.

### 3. 다섯 가지 Task/Mission의 기술설계 시너지
```text
[API 인터페이스 계약] (Task 01. 스펙 도출)
         │
         ▼
[기획-API 불일치 검증] (Task 02. 정합성 감사)
         │
         ▼
[설계 변경 여파 자동 추적] (Task 03. 영향도 관리)
         │
         ▼
[REST 아키텍처 품질 고도화] (Mission 01. 구조 리뷰)
         │
         ▼
[Happy/Sad Path 테스트 커버리지] (Mission 02. 시나리오 방어)
```
이 인터페이스 검증 파이프라인은 코드를 단 한 줄도 짜기 전에 모든 오차와 설계 모순을 제거하여, 프론트와 백엔드가 한 번에 통합 빌드에 성공할 수 있도록 완성도 높은 인터페이스 품질을 확보해 줍니다.

---

## 📌 Part 5. 교육 세션 가이드

### 💡 교육 설계 스펙
* **난이도**: ★★★★☆ (상급 - RESTful 아키텍처 및 HTTP 예외 설계 포함)
* **예상 실습 시간**: 1시간 30분 ~ 2시간 (종합 인터페이스 실습)
* **실무 활용도**: ★★★★★
* **학습자 질문/토의 주제**:
  1. "에러 발생 시 HTTP Status를 무조건 200 OK로 전달하고 본문에 에러 상세 코드를 표기하는 관례(Custom Error)와 HTTP 표준 Status(4xx, 5xx)를 이용하는 구조 중, 마이크로서비스 아키텍처(MSA) 관점에서의 장단점은 무엇일까요?"
  2. "API 변경이 생겼을 때, 수동으로 기획서를 고치지 않고 Swagger/OpenAPI Spec 파일에서 실제 코드와 문서의 동기화를 실시간으로 자동화할 수 있는 빌드 체계는 어떻게 구성해야 할까요?"

---

## 📌 Part 6. 기술설계 (API 인터페이스) 단계 최종 교육 Task

| Task | 주제 | AI 활용 |
|---|---|---|
| Task 01 | API 계약서 생성 | 기획서와 화면 설계를 분석하여 RESTful API 계약서 스펙 자동 도출 |
| Task 02 | API 불일치 검출 | 기획 명세와 API 스펙의 불일치(평점 누락 등)를 자동으로 잡아내어 리포트 생성 |
| Task 03 | API 변경 영향 분석 | API 파라미터나 상태 변경 시 연동해야 할 화면 및 스펙의 연쇄 영향 추적 |
| Mission 01 | API 리뷰 및 개선 | 명사형 네이밍 규칙, 일관된 RFC 예외 스키마 등 RESTful 표준 품질 향상 |
| Mission 02 | API 테스트 시나리오 생성 | 정상 작동 흐름뿐 아니라 필수 키 누락, 포맷 에러에 대응하는 예외 테스트 매트릭스 도출 |

<!-- ADDITIONAL_SKILL_TASKS:START -->
---

## 📌 추가 Skill Task 요약 — Domain-Based API Contract

기존 Day 4 커리큘럼에 기술 전문성과 AI 협업 역량을 명시적으로 연결하기 위해 다음 3개 Task를 추가합니다. 기존 Task와 Mission의 목표·산출물은 유지하며, 추가 Task는 기존 결과물을 더 깊게 설계·구현·검증하는 확장 단계입니다.

### 1. 추가 Task 및 Skill Map

| Task ID | 추가 Task | 영역 | 기술 Skill | AI 활용 Skill |
|---|---|---|---|---|
| `ADD-D04-T01` | Domain Boundary 기반 Endpoint 설계 | `TECH` | `TECH-DDD` `TECH-API` | `AI-ANA` `AI-DES` |
| `ADD-D04-T02` | Request·Response·Error Contract 작성 | `HYBRID` | `TECH-API` `TECH-DATA` | `AI-CTX` `AI-DES` `AI-DOC` |
| `ADD-D04-T03` | API Contract Consistency Review | `AI` | `TECH-API` `TECH-QA` | `AI-REV` `AI-QA` |

### 2. 학습 연결 흐름

`ADD-D04-T01` Domain Boundary 기반 Endpoint 설계 → `ADD-D04-T02` Request·Response·Error Contract 작성 → `ADD-D04-T03` API Contract Consistency Review

- **입력 Context:** Domain Map, Sequence, ERD
- **Day 통합 산출물:** Domain별 REST API 목록, OpenAPI Spec, 오류 Contract
- **권장 제출 파일:** `07_API_SPEC.md`
- **AI 역할:** API Architect

### 3. 평가 기준

| 평가 영역 | 비중 | 확인 기준 |
|---|---:|---|
| 기술 Skill | 40% | Domain·설계·코드·데이터·보안 등 해당 기술 기준을 충족했는가 |
| AI 활용 Skill | 30% | Context와 역할을 명확히 제공하고 결과를 비판적으로 검토했는가 |
| 검증 가능성 | 20% | 정상·경계·실패 조건과 완료 기준을 실제로 확인할 수 있는가 |
| 문서화·인계 | 10% | 판단 근거와 산출물이 다음 Task에서 재사용 가능한가 |

### 4. 공통 완료 Checklist

- [ ] 3개 추가 Task의 결과가 기존 Day 4 산출물과 연결되어 있다.
- [ ] 모든 Task에 기술 Skill과 AI 활용 Skill의 수행 증거가 있다.
- [ ] AI가 제안한 내용의 수용·수정·거절 근거가 기록되어 있다.
- [ ] 추측과 확정 사실이 구분되어 있다.
- [ ] 결과물이 다음 Day의 입력으로 재사용 가능하다.

### 5. 다음 Day 연결

API Contract를 Day 5 화면 기능·Component·UI State 설계와 연결한다.
<!-- ADDITIONAL_SKILL_TASKS:END -->
