# Day 04. 기술설계 (API 설계 및 인터페이스 정의)

<!-- LMS_SYNC:START -->
## LMS 커리큘럼 기준

- **일차:** Day 4
- **LMS 주제:** API 설계와 인터페이스 명세
- **문서 역할:** 상세 Task·Mission 수행 가이드
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

스타트업의 MVP(Minimum Viable Product) 개발 프로세스에서 화면 설계와 데이터베이스 모델링이 완료된 후 백엔드와 프론트엔드가 실질적으로 맞물리는 핵심 연결고리는 **"API 설계 및 인터페이스 정의"**입니다. 화면과 DB 사이에서 어떤 형식으로 데이터를 주고받을지(Request/Response) 명확하게 합의하고 표준화하지 않으면, 통신 에러가 빈번하게 발생하고 프론트-백 개발자 간 커뮤니케이션 비용이 눈덩이처럼 불어나게 됩니다.

Day 4 실습은 Codex AI를 활용하여 요구사항 및 화면 설계를 바탕으로 API 계약서를 자동 생성(Task 01)하고, 설계 문서 간의 기능 누락 및 정합성 불일치를 자동으로 검출(Task 02)하며, 비즈니스 변경에 따른 API 스펙 수정의 영향 범위를 추적(Task 03)합니다. 나아가 아키텍처 관점에서 API 품질을 검토하고 개선안을 도출(Mission 01)하며, 다양한 예외 케이스를 커버하는 API 테스트 시나리오를 설계(Mission 02)하는 실무 지향형 API 인터페이스 개발 파이프라인을 경험합니다.

---

# Task 01. API 계약서 생성 (API Contract Generation)

## 1. 스토리 및 실습 배경

프로젝트에서 화면 설계가 완료되면 프론트엔드와 백엔드 개발자는 어떤 데이터를 주고받을지 먼저 협의해야 합니다. 하지만 구두 회의나 메모장 수준으로 API를 정의하다 보면 꼭 필요한 데이터 필드가 누락되거나, 필드의 영문 이름 및 데이터 타입(String, Number, Boolean)을 서로 다르게 정의하여 실제 화면을 그릴 때 API 통신 오류로 화면이 하얗게 굳어버리는 장애가 발생하곤 합니다.

이번 실습에서는 Codex를 활용하여 비정형화된 기획 요구사항 정의서와 화면 정의서를 기반으로 기획 의도와 100% 매핑되는 표준화된 **API 계약서(API Contract)**를 자동 생성하고, 프론트엔드와 백엔드가 동일한 규격을 공유하여 마찰 없이 개발을 시작할 수 있도록 돕는 워크플로우를 학습합니다.

---

## 2. 학습 목표

* 비정형 요구사항 명세에서 API 형태로 노출할 비즈니스 행위(Endpoint)를 도출할 수 있다.
* 화면 UI 컴포넌트와 API Request/Response 필드 간 매핑 관계를 정의할 수 있다.
* AI를 활용해 RESTful 규칙에 어긋남이 없는 API 명세서 초안을 고속으로 빌드할 수 있다.

---

## 3. 실습 미션

학습자는 로컬 프로젝트 폴더 내에 `day4_requirements.md`와 `day4_screen_definition.md`를 준비하고 Codex Client에 아래 프롬프트를 전송하여 API 계약서를 도출합니다.

> "제공된 요구사항 정의서와 화면 정의서 내용을 기반으로, 필요한 API 목록을 도출하고 요청(Request) 및 응답(Response) 필드의 타입과 영문 변수명을 정의하여 표준 API 계약서(API Contract)를 작성해 주세요."

---

## 4. 결과물 예시

Codex는 명세 데이터를 종합 분석하여 다음과 같이 정형화된 API 계약서를 작성합니다.

### API Contract (API 계약서 예시)

#### [POST] /api/v1/reservations (상담 예약 신청)
* **설명**: 일반 회원이 원하는 전문가와 시간대를 선택하여 예약을 신청합니다.
* **Request Header**: `Authorization: Bearer <JWT_TOKEN>`
* **Request Body (JSON)**:
```json
{
  "expert_id": "EXP-091",
  "reservation_date": "2026-07-20T14:00:00Z",
  "payment_amount": 50000
}
```
* **Response Body (JSON) - 201 Created**:
```json
{
  "reservation_id": "RES-2026-0001",
  "status": "WAIT_APPROVE",
  "created_at": "2026-07-16T10:00:00Z"
}
```

---

## 5. AI 활용 포인트

* **화면-데이터 필드 역추론**: 화면 기획상 표시되어야 하는 UI 정보(예: 전문가 정보, 날짜)를 기준으로 백엔드 응답(Response) 필드를 누락 없이 식별.
* **RESTful 네이밍 규칙 적용**: 동사 위주의 행동을 명사형 엔드포인트 규칙(`/api/v1/reservations`)과 적절한 HTTP Method(POST, GET)로 자동 변환.
* **데이터 타입 자율 규정**: 날짜 문자열(ISO-8601), 금액(Integer), ID식별자(String) 등의 데이터 타입을 비즈니스 성격에 맞게 정의.

---

## 6. 학습 포인트

프론트엔드와 백엔드의 병렬 개발을 위해 가장 먼저 합의되어야 하는 것은 API 계약입니다. AI 비서를 활용하여 명확한 필드명과 규격을 사전에 합의해 두면, 백엔드가 완성되지 않았더라도 프론트엔드가 가상 Mock 데이터를 기반으로 컴포넌트를 즉시 코딩할 수 있게 되어 프로젝트의 전체 리드 타임이 대폭 줄어듭니다.

---

### 💡 교육 난이도

* **난이도:** ★★☆☆☆ (초급)
* **예상 실습 시간:** 20~30분
* **실무 활용도:** ★★★★★

---

# Task 02. API 불일치 검출 (API Consistency Check)

## 1. 스토리 및 실습 배경

스타트업의 통합 테스트 기간. "전문가 목록 화면에서 평점과 전문 분야 해시태그가 안 나와요!"라는 기획자의 버그 신고가 들어옵니다. 확인해보니 프론트엔드 기획안에는 평점(star_rating) 필드가 있었으나, 백엔드 개발자가 작성해 둔 API 명세서에는 평점 정보가 아예 누락된 채 개발되어 있었던 것입니다. 

이처럼 프로젝트 문서가 파편화되면 기획서의 필수 요구사항이나 화면의 필요 필드가 정작 개발된 API 명세에 반영되지 못하는 **API 불일치(Inconsistency)** 현상이 발생하게 되고, 이는 전반적인 개발 재작업(Rework)을 야기합니다.

이번 실습에서는 Codex를 가동하여 요구사항 정의서, 화면 정의서, 그리고 현재 배포된 API 명세서 초안을 전수 교차 검증하고, 기획 누락 및 데이터 불일치 구간을 자동으로 색출해 내는 정합성 감사 기법을 학습합니다.

---

## 2. 학습 목표

* 요구사항 정의서와 API 명세서 간 기능적 누락을 체계적으로 검사할 수 있다.
* 화면 UI 필요 데이터와 실제 API Response 스펙 간의 불일치를 식별할 수 있다.
* AI 감사도우미를 통해 사람이 수작업으로 대조할 때 발생하는 검토 누락을 방어할 수 있다.

---

## 3. 실습 미션

학습자는 혼용 상태의 세 문서를 로컬 폴더에 배치하고 Codex Client에 아래 명령을 빌드합니다.

> "제공된 day4_requirements.md, day4_screen_definition.md, day4_api_specification_v1.md 파일들을 교차 대조하여 기획 요구사항이나 화면 UI 설계와 불일치하거나 누락된 API 엔드포인트 및 필드를 찾아 검토 보고서를 작성해 주세요."

---

## 4. 결과물 예시

### API 검토 보고서 (불일치 리포트)

| 구분 | 검출된 불일치 / 누락 사항 | 리스크 수준 | 추천 조치 사항 |
|---|---|---|---|
| **필드 누락** | `day4_screen_definition.md`의 전문가 카드에 평점(`star_rating`)과 해시태그(`tags`) 목록이 노출되어야 하나, API 응답 필드에는 해당 데이터가 누락됨. | **높음 (High)** | `GET /api/v1/experts` API Response에 `star_rating` 및 `tags` 필드를 배열로 추가 정의할 것. |
| **Endpoint 누락** | `day4_requirements.md`에서 상담사가 예약을 승인/거절할 수 있어야 한다는 명세가 있으나, API 목록 상에 전문가용 예약 승인 상태 갱신 API가 전무함. | **치명적 (High)** | `PATCH /api/v1/reservations/{reservation_id}/status` 형태의 상태 변경 API 신규 추가 설계 요망. |

---

## 5. AI 활용 포인트

* **다중 문서 맥락 대조**: 여러 문서(Markdown)의 계층 관계를 의미적으로 파악하여, 텍스트 일치율 검색 수준을 넘어선 논리적인 '데이터 필드 매핑 결여' 감지.
* **보완 권고안 자율 작성**: 불일치가 감지된 지점에 적용 가능한 RESTful 대응 설계안과 추가해야 할 세부 코드 스키마 제공.

---

## 6. 학습 포인트

기획 모순과 API 설계의 불일치를 테스트 및 배포 단계 이전에 빠르게 잡아내는 것은 개발 단가를 낮추는 데 극적인 효과를 줍니다. AI를 요구사항 정합성 감지 도구로 활용하면, 복잡하게 분산된 시스템 명세에서 기획과 API가 정확히 톱니바퀴처럼 굴러가도록 보증해 줍니다.

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (중급)
* **예상 실습 시간:** 20~30분
* **실무 활용도:** ★★★★★

---

# Task 03. API 변경 영향 분석 (API Impact Analysis)

## 1. 스토리 및 실습 배경

서비스가 궤도에 오르면서 신규 비즈니스 스펙 변경이 하달됩니다. "기존에는 예약 생성 시점에 바로 결제 금액을 실어 보냈으나, 결제 프로세스 투명성을 위해 예약 생성 시에는 결제 금액 필드를 제외하고 예약 생성 후 별도 결제 진행 시 금액을 입력받도록 흐름을 분리해 주세요."

이에 따라 백엔드 개발자는 예약 신청 API `POST /api/v1/reservations` 요청 값에서 `payment_amount` 필드를 삭제하기로 결정했습니다. 하지만 이 변경 사실이 프론트엔드 개발팀과 테스트 시나리오 문서 작성팀에 사전에 전파되지 않아, 프론트엔드는 없는 필드를 실어 보내 통신 에러가 나고, 테스트 코드 빌드 파이프라인은 깨져버렸습니다.

이번 실습에서는 Codex를 활용하여 API의 파라미터나 상태 흐름이 변경되었을 때 영향을 받는 화면 컴포넌트와 문서 영역을 전수 자동 역추적하고, 장애 없이 배포될 수 있는 팀 공유 리포트를 구성하는 방법을 실습합니다.

---

## 2. 학습 목표

* API 계약 규격의 사소한 변경(삭제, 추가, 명칭 변경)이 시스템에 가져올 여파를 분석할 수 있다.
* 변경의 영향을 받아 즉시 개정이나 수정이 요구되는 프론트엔드 뷰(View)를 식별할 수 있다.
* 동료 개발자들과 기획팀에 신속하게 수정 권장 작업을 공유할 영향도 보고서를 작성할 수 있다.

---

## 3. 실습 미션

학습자는 변경 요청 사안을 준비하고 Codex Client에 아래 분석 명령을 보냅니다.

> "제공된 API 변경 요청서(day4_api_change_request.md) 내용을 분석하여, 예약 신청 API 수정 시 영향을 받는 다른 시스템 영역과 문서의 목록을 도출하고, 팀원들에게 즉시 작업 공유가 가능한 API 영향도 분석서를 작성해 주세요."

---

## 4. 결과물 예시

### API 영향도 분석 보고서 (API Impact Analysis)

#### 1. 변경 요약
- **대상 API**: `POST /api/v1/reservations` (예약 생성)
- **변경 사항**: Request Body 내 `payment_amount` 필드 삭제

#### 2. 연쇄 영향 범위 및 액션 아이템
* **프론트엔드 UI**: 회원 예약 신청 폼 화면에서 결제 금액을 입력받는 입력 필드를 숨김 또는 `Payment API` 단계로 이관 처리.
* **결제 연동 API**: 예약을 일단 생성한 뒤, 결제를 요청하는 신규 API `POST /api/v1/payments`로 `amount` 전송 로직 이관.
* **설계 문서**: 기존 기획 명세 및 Swagger 스펙 파일 내 `POST /api/v1/reservations` 템플릿 필드 즉시 갱신.

---

## 5. AI 활용 포인트

* **인터페이스 전파 종속성 추론**: API 스키마 변경이 프론트엔드 UI 상태 및 백엔드 로직의 도메인 흐름에 끼칠 기능적 여파 자동 추출.
* **작업자 맞춤형 조치 사항 매핑**: 기획자, 퍼블리셔, 프론트엔드 개발자, QA 테스터가 각자의 스펙에서 고쳐야 할 Task를 나누어 정의.

---

## 6. 학습 포인트

API는 개발팀 내의 협업 약속입니다. 한쪽의 변경이 상대방의 작업을 깨뜨리지 않도록, API 수정 시 변경의 파장을 사전에 예측하고 선제 대응함으로써 프론트와 백엔드 간의 불필요한 마찰을 제거하는 아키텍처 예방 의식을 키울 수 있습니다.

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (중급)
* **예상 실습 시간:** 20~30분
* **실무 활용도:** ★★★★★

---

# Mission 01. API 리뷰 및 개선 (API Review)

## 1. 스토리 및 실습 배경

처음 빌드한 스타트업의 API 문서를 본 외부 아키텍처 자문가가 지적합니다. "URL 구조가 `/api/v1/getUsers` 처럼 동사로 되어 있고, 에러 발생 시 HTTP Status는 200 Ok로 준 채 Response Body 안에 에러 메시지를 넣어 보내고 있군요. 그리고 리소스를 수정할 때 PUT과 PATCH를 혼용하고 있습니다. 이 구조는 확장성과 범용 개발자 도구 규격을 준수하지 못해 추후 고도화 시 막대한 리팩토링 비용을 부릅니다."

설계 초기 단계에서 표준적인 API 설계 철학과 스타일 규칙(REST API 표준, 명명 규칙, 일관된 예외 규격)을 준수하지 않으면, 외부 연동(Payment PG, 외부 파트너십) 시 개발 장벽을 야기합니다.

이번 미션에서는 작성된 API 스펙 문서를 Codex에 위임하여 REST 규격 준수 여부를 철저하게 리뷰받고, 글로벌 협업이 가능한 깔끔한 인터페이스 품질로 끌어올리는 코드 외적 개선안 도출 프로세스를 학습합니다.

---

## 2. 실습 미션

학습자는 Codex Client에 현재 작성된 API 규격을 주입하고 아래와 같이 품질 검토 및 개선 제안을 요구합니다.

> "제공된 day4_api_specification_v1.md의 API 명세서를 검토하여, REST API 설계 표준(HTTP Method 용도, URL 명명법), 일관된 오류 처리 구조, 확장성을 기준으로 개선점을 분석하고 API 리뷰 보고서를 작성해 주세요."

---

## 3. 결과물 예시

### API Review Report (API 리뷰 및 제안서)

#### [리뷰 항목 1] Endpoint 명명법 개선
* **AS-IS**: `GET /api/v1/getExperts`, `POST /api/v1/createReservation`
- **TO-BE**: `GET /api/v1/experts`, `POST /api/v1/reservations`
- **사유**: RESTful 명세에 따라 행위(get, create)는 HTTP Method로 규정하고 URL 경로는 자원(Resource)의 명사형 복수 형태로 통일합니다.

#### [리뷰 항목 2] HTTP 상태 코드 및 예외 규격 통일
- **AS-IS**: 에러 발생 시 HTTP Status `200 OK` 응답 및 JSON body에 `{"error": "true", "message": "Auth Fail"}`
- **TO-BE**: HTTP Status `401 Unauthorized` 응답 및 RFC 7807 표준 규격 에러 스키마 통일.
```json
{
  "type": "https://api.experts.com/errors/unauthorized",
  "title": "Unauthorized Request",
  "status": 401,
  "detail": "Bearer 토큰이 누락되었거나 만료되었습니다."
}
```

---

## 4. AI 활용 포인트

* **글로벌 아키텍처 규칙 매핑**: REST API 표준(RESTful Maturity Model)을 기준으로 레거시 코딩 버릇이 묻은 설계안의 규칙 위배 항목 전수 적발.
* **에러 응답 아키텍처 수립**: 클라이언트 개발자가 일관되게 에러를 예외 처리(Try-Catch)할 수 있도록 표준 RFC 규격형 예외 모델 구성.

---

### 💡 교육 난이도

* **난이도:** ★★★★☆ (상급)
* **예상 실습 시간:** 20~30분
* **실무 활용도:** ★★★★★

---

# Mission 02. API 테스트 시나리오 생성 (API Test Scenario)

## 1. 스토리 및 실습 배경

드디어 백엔드 개발자가 API 구현을 마치고 스테이징 서버에 올렸습니다. 프론트엔드 개발자는 기쁜 마음으로 예약 API를 호출했으나 계속해서 500 내부 서버 에러가 뜹니다. 원인을 찾아보니 날짜 형식에 `YYYY-MM-DD`만 넣어야 하는데 `YYYY-MM-DDTHH:mm:ssZ` 형태로 데이터가 들어와 백엔드 서버 파서가 에러를 터트린 것이었습니다. 백엔드 개발자는 정상 상황(Happy Path)만 직접 날려보고 개발을 마쳤던 것입니다.

실전 서비스에서는 사용자의 비정상적인 입력, 잘못된 형식 전송, 필수 키 누락, 권한 없는 비인가 요청 등 수많은 예외 상황(Edge Cases)이 발생합니다. 이에 대응하는 API 테스트 시나리오를 미리 꼼꼼히 마련해두고 빌드하지 않으면 릴리즈 이후 실시간 모니터링 창에 적색 알람이 가득 차게 됩니다.

이번 미션에서는 완성된 API 스펙 계약서를 기반으로 정상 흐름은 물론 예외적인 조건과 경계값까지 모두 검증하는 **API 테스트 시나리오**를 자동 작성하여, 오류 없는 안정적인 서비스를 방어하는 능력을 키웁니다.

---

## 2. 실습 미션

학습자는 완성된 API 계약서 스펙을 Codex Client에 제공하고 아래 테스트 시나리오 생성을 요청합니다.

> "현재 정의된 예약 및 결제 API 명세를 기반으로, 정상 등록 흐름(Happy Path)과 필수 파라미터 누락, 날짜 형식 오류, 한도 초과 및 권한 만료 등의 예외 케이스를 모두 포함하는 API 테스트 시나리오 및 검증 체크리스트를 작성해 주세요."

---

## 3. 결과물 예시

### API 테스트 시나리오 및 체크리스트

#### [시나리오 ID]: `TC-API-RES-001` (예약 생성 정상 흐름)
- **전제 조건**: 정상 인증된 회원(JWT Bearer 토큰 탑재)
- **테스트 절차**: Request Body에 유효한 `expert_id`, `reservation_date` 전송
- **기대 결과**: HTTP Status 201 Created 및 신규 `reservation_id` 생성 확인

#### [시나리오 ID]: `TC-API-RES-002` (필수 파라미터 누락 예외)
- **전제 조건**: 정상 인증된 회원
- **테스트 절차**: Request Body에서 `expert_id` 필드를 빈 값 또는 누락하여 전송
- **기대 결과**: HTTP Status 400 Bad Request 반환 및 응답 본문에 'expert_id is required' 명시 확인

#### [시나리오 ID]: `TC-API-RES-003` (날짜 형식 오류 예외)
- **전제 조건**: 정상 인증된 회원
- **테스트 절차**: `reservation_date` 값에 비정상 문자열 `2026-99-99` 전송
- **기대 결과**: HTTP Status 400 Bad Request 및 유효하지 않은 날짜 포맷 에러 확인

---

## 4. AI 활용 포인트

* **화이트박스 기반 한계값 추정**: 파라미터의 타입 특성(날짜 포맷, 문자열 한계, 숫자 범위)을 분석해 에러를 유도할 비정상 입력값 자율 산출.
* **Happy/Sad Path 분리 설계**: 시스템이 보장해야 하는 정상 처리 흐름과 방어해야 하는 예외 처리 흐름을 분리하여 구조화된 테스트 매트릭스 도출.

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (중급)
* **예상 실습 시간:** 20~30분
* **실무 활용도:** ★★★★★

---

# Day 04 교육 구성 및 마일스톤

| 구분 | 주제 | Codex AI 핵심 액션 | 학습 기대 산출물 |
|---|---|---|---|
| **Task 01** | API 계약서 생성 | 기획 요구사항서 및 화면 정의서에서 API 스펙(Req/Res) 자동 도출 | `api-contract.md` |
| **Task 02** | API 불일치 검출 | 기획 문서와 API 명세를 상호 교차 비교하여 기능 누락 모순 색출 | `api-consistency-report.md` |
| **Task 03** | API 변경 영향 분석 | 비즈니스 로직 및 파라미터 변경 시 UI 및 연관 모듈 파장 범위 추적 | `api-impact-analysis.md` |
| **Mission 01** | API 리뷰 및 개선 | REST 아키텍처 규칙 준수 검토 및 예외 스키마 표준 제안 | `api-review-report.md` |
| **Mission 02** | API 테스트 시나리오 생성 | 정상 작동 및 각종 이상 입력, 경계값 기반 테스트 케이스 작성 | `api-test-scenario.md` |

---

# Day 04 실습용 원본 파일 데이터 내역

## 📄 day4_requirements.md
```markdown
# 전문가 상담 매칭 서비스 기능 요구사항 정의서 (v1.0)

* **REQ-001 (상담 예약 신청)**:
  - 일반 회원은 전문가 목록에서 원하는 상담사를 조회한 뒤 예약을 신청한다.
  - 예약 신청 시 상담사 식별자, 예약 희망 일시가 필수 정보로 전달되어야 한다.
  - 가입되지 않은 비회원은 예약을 신청할 수 없으며, 인증 토큰이 유효해야 한다.

* **REQ-002 (상담 예약 승인)**:
  - 등록된 전문가(상담사)는 본인에게 들어온 예약 신청을 조회하고 이를 승인하거나 반려할 수 있다.
  - 승인 시 예약 상태는 '결제 대기'로 전환된다.
  - 반려 시 반려 사유를 필수로 입력해야 하며, 상태는 '반려 완료'가 된다.
```

## 📄 day4_screen_definition.md
```markdown
# 전문가 상담 예약 서비스 화면 UI 정의 명세

* **SCR-010 (전문가 목록 및 카드 UI)**:
  - 카드 표기 요소: 전문가 닉네임, 상담 전문 태그(예: #심리, #커리어), 전문가 평균 평점(별점 표시).
  - '상담 신청' 버튼 클릭 시 상세 예약 폼 화면으로 이동한다.

* **SCR-020 (예약 신청 상세 폼)**:
  - 입력 요소: 예약 날짜 선택기(캘린더), 예약 시간 선택 슬롯, 결제 예상 금액 안내창.
  - '예약 요청하기' 버튼 클릭 시 서버로 예약 정보를 전송하고 대기 완료 토스트 팝업을 노출한다.
```

## 📄 day4_api_specification_v1.md
```markdown
# 전문가 상담 매칭 시스템 백엔드 API 명세서 초안 (v1.0)

* **GET /api/v1/getExperts**
  - **설명**: 등록된 전문가 리스트를 조회한다.
  - **Response (JSON)**:
    ```json
    [
      {
        "expert_id": "EXP-091",
        "name": "Jane Doe"
      }
    ]
    ```

* **POST /api/v1/createReservation**
  - **설명**: 회원이 상담사 예약을 신청한다.
  - **Request (JSON)**:
    ```json
    {
      "reservation_date": "2026-07-20T14:00:00Z"
    }
    ```
  - **Response (JSON)**:
    ```json
    {
      "reservation_id": "RES-2026-0001",
      "status": "WAIT_APPROVE"
    }
    ```
```

## 📄 day4_api_change_request.md
```markdown
# 요구사항 변경에 따른 API 변경 요청서 (Change Request)

* **요청인**: Lead Product Manager
* **변경 사유**: 
  - 기존에는 예약 생성시 예약 요청 데이터에 `payment_amount`를 포함해 한꺼번에 받았으나, 가격 정책 고도화(쿠폰 적용 등)에 따라 예약 생성(Reservations) 시에는 금액 필드를 제거함.
  - 예약이 정상 생성되어 전문가가 승인한 이후, 결제 요청 단계 API `POST /api/v1/payments`를 명확히 분리 호출하며 이 단계에서 최종 할인 적용된 금액(`amount`)을 전송하도록 구조를 개편함.
* **변경 사항**:
  - `POST /api/v1/reservations` Request Body 내 `payment_amount` 필드를 완전히 삭제할 것.
```

## 📄 day4_api_review_dialogue.md
```markdown
# API 설계 표준 리뷰 회의록 (7월 2주차)

* **참석자**: 프론트엔드 개발자 A, 백엔드 개발자 B
* **대화 내용**:
  - **개발자 A**: 현재 백엔드 API 에러 처리가 일관성이 없습니다. 토큰 만료 에러가 나도 HTTP Status는 200 OK로 오고 응답 본문 JSON에만 `{"success": false, "message": "Expired token"}` 이렇게 담겨 오니까 프론트엔드 통신 라이브러리(Axios)의 공통 인터셉터 예외 필터에서 감지가 안 됩니다. 에러 시에는 적절한 HTTP Status 코드(예: 401, 400, 500)를 보내주시고 에러 포맷도 단일 구조로 맞춰주시면 감사하겠습니다.
---

# Mission 3 (Skill Mission 1). 핀테크 오픈뱅킹 API & OpenAPI 명세

## 1. 개요 및 배경
핀테크 오픈뱅킹 송금, 계좌 잔액 조회, 거래 내역 조회 API 규격 및 OpenAPI (Swagger 3.0) 명세서를 구축합니다.

## 2. 입력 데이터
* `fintech-api-spec.md` (오픈뱅킹 엔드포인트 및 OAuth2 인증 파라미터)
* `banking-sequence.md` (송금 및 이체 시퀀스 흐름)

## 3. 작성 산출물
* `fintech-openapi-specification.yaml` (OpenAPI 3.0 YAML 스펙)

## 4. 프롬프트 예시
```text
[역할]: Senior API Architect
[프로젝트]: 핀테크 오픈뱅킹 API 플랫폼
[미션]:
1. 계좌 조회 및 이체 API의 OpenAPI 3.0 (Swagger) YAML 명세서를 생성하세요.
2. 401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity 에러 규격을 표준화하세요.
```

---

# Mission 4 (Skill Mission 2). 실시간 배달 주문-라이더 API Audit

## 1. 개요 및 배경
실시간 배달 플랫폼의 주문 생성, 라이더 매칭, 위치 추적 API의 Sequence-ERD 정합성 및 Breaking Change 여부를 오디팅합니다.

## 2. 입력 데이터
* `delivery-api-contract.md` (주문 및 매칭 API 명세 초안)
* `delivery-flow-sequence.md` (주문-라이더 위치 추적 흐름)

## 3. 작성 산출물
* `delivery-api-audit-report.md` (API 정합성 Audit 표 & Breaking Change 분석서)

## 4. 프롬프트 예시
```text
[역할]: API Quality & Security Reviewer
[프로젝트]: 실시간 배달 및 관제 API
[미션]:
1. 라이더 매칭 및 위치 추적 API가 ERD 속성 및 Sequence 메시지와 100% 일치하는지 오디팅하세요.
2. v1 -> v2 변경 시 소비자 관점의 Breaking Change 항목과 부정 테스트 시나리오를 작성하세요.
```

<!-- ADDITIONAL_SKILL_TASKS:START -->
---

# Day 4 추가 Skill Task — Domain-Based API Contract

> 아래 Task는 기존 Day 4 Task와 Mission을 대체하지 않습니다. 기존 실습을 완료한 뒤 AI-Native SW Engineering 역량을 확장하기 위한 추가 과정입니다.

## 추가 Task 운영 원칙

1. 기존 프로젝트 산출물을 입력 Context로 재사용합니다.
2. 기술 Skill과 AI 활용 Skill을 별도로 평가합니다.
3. AI가 생성한 결과보다 학습자가 검증하고 판단한 근거를 평가합니다.
4. 모든 결과를 Markdown 또는 실행 가능한 코드·다이어그램으로 남깁니다.

## ADD-D04-T01 — Domain Boundary 기반 Endpoint 설계

### 1. Task 목표

Video, Playback, Campaign, Ad Serving 중 최소 4개 Domain의 Resource와 Endpoint를 설계한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `TECH` |
| 기술 Skill | `TECH-DDD` `TECH-API` |
| AI 활용 Skill | `AI-ANA` `AI-DES` |
| AI 역할 | API Architect |

### 3. 입력 및 제출 산출물

- **입력 Context:** Domain Map, Sequence, ERD
- **제출 산출물:** `07_API_SPEC.md`
- **통합 결과:** Domain별 REST API 목록, OpenAPI Spec, 오류 Contract

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `API Architect` 역할을 부여합니다.
3. Video, Playback, Campaign, Ad Serving 중 최소 4개 Domain의 Resource와 Endpoint를 설계한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-DDD TECH-API)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 API Architect입니다.

[프로젝트 Context]
Domain Map, Sequence, ERD

[수행 Task]
Video, Playback, Campaign, Ad Serving 중 최소 4개 Domain의 Resource와 Endpoint를 설계한다.

[AI 활용 요구]
AI에게 Endpoint가 어느 Domain 책임인지 질문하고 경계를 넘는 API를 식별하게 한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 각 Endpoint에 책임 Domain, Method, URI, 사용 Scenario가 연결된다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 30~40분
- 검증·문서화·공유: 15분

---

## ADD-D04-T02 — Request·Response·Error Contract 작성

### 1. Task 목표

입력 Schema, 응답 Schema, Status Code, Validation Error, 인증 요구사항을 정의하고 OpenAPI로 표현한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `HYBRID` |
| 기술 Skill | `TECH-API` `TECH-DATA` |
| AI 활용 Skill | `AI-CTX` `AI-DES` `AI-DOC` |
| AI 역할 | API Architect |

### 3. 입력 및 제출 산출물

- **입력 Context:** Domain Map, Sequence, ERD
- **제출 산출물:** `07_API_SPEC.md`
- **통합 결과:** Domain별 REST API 목록, OpenAPI Spec, 오류 Contract

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `API Architect` 역할을 부여합니다.
3. 입력 Schema, 응답 Schema, Status Code, Validation Error, 인증 요구사항을 정의하고 OpenAPI로 표현한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-API TECH-DATA)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 API Architect입니다.

[프로젝트 Context]
Domain Map, Sequence, ERD

[수행 Task]
입력 Schema, 응답 Schema, Status Code, Validation Error, 인증 요구사항을 정의하고 OpenAPI로 표현한다.

[AI 활용 요구]
Codex로 OpenAPI 초안을 만들되 ERD와 이름·타입·필수값을 대조해 사람이 승인한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 최소 4개 Domain의 API Contract가 정상·실패 예시를 포함한다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 40~50분
- 검증·문서화·공유: 15분

---

## ADD-D04-T03 — API Contract Consistency Review

### 1. Task 목표

API가 Sequence·ERD·Domain Rule과 일치하는지 검토하고 Breaking Change 후보를 찾는다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `AI` |
| 기술 Skill | `TECH-API` `TECH-QA` |
| AI 활용 Skill | `AI-REV` `AI-QA` |
| AI 역할 | API Architect |

### 3. 입력 및 제출 산출물

- **입력 Context:** Domain Map, Sequence, ERD
- **제출 산출물:** `07_API_SPEC.md`
- **통합 결과:** Domain별 REST API 목록, OpenAPI Spec, 오류 Contract

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `API Architect` 역할을 부여합니다.
3. API가 Sequence·ERD·Domain Rule과 일치하는지 검토하고 Breaking Change 후보를 찾는다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-API TECH-QA)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 API Architect입니다.

[프로젝트 Context]
Domain Map, Sequence, ERD

[수행 Task]
API가 Sequence·ERD·Domain Rule과 일치하는지 검토하고 Breaking Change 후보를 찾는다.

[AI 활용 요구]
AI에게 소비자 관점의 부정 테스트와 버전 호환성 위험을 생성하게 한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 불일치·Breaking Change·부정 테스트가 추적 가능한 Review Report로 남는다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 30~40분
- 검증·문서화·공유: 15분
<!-- ADDITIONAL_SKILL_TASKS:END -->
