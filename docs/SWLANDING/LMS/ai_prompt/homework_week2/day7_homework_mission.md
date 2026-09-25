# Day 7 숙제 미션 — 기능 연결과 사용자 시나리오 완성

개인 제출 / 숙제 2개 / 권장 총 90~120분. 제출 규칙은 [운영 안내](README.md)를 따른다.

학습 근거: [기존 Mission](../day7_codex_mission.md), [Summation](../day7_codex_summation.md), [추가 Skill Task](../skill_tasks/day07_skill_tasks.md).

## HW-D07-01 — 대용량 동영상 업로드-인코딩 비동기 파이프라인

- 영역: CODE / BE
- 기술 Skill: TECH-BE, TECH-ASYNC
- AI Skill: AI-CODE, AI-REV, AI-DOC
- 예상 시간: 45~60분

### 문제 상황

크리에이터가 2GB~5GB 대용량 4K 비디오를 올릴 때 5MB 단위 청크 멀티파트 업로드를 수행한다. 그러나 와이파이 단절 시 청크 중복 전송, 버튼 다중 클릭으로 인한 중복 인코딩 작업 등록 등 동시성 장애로 인코딩 서버 비용이 낭비되는 사고가 발생했다.

### 해결해야 할 문제

1. 청크 업로드 세션 생성, 조립, 인코딩 큐 등록의 상태 전이 명세서(`upload_state_spec.md`)를 작성하라.
2. `Idempotency-Key` 헤더와 청크 인덱스를 검증해 중복 요청을 방지하고 원자적 카운팅으로 단 1회만 인코딩 큐를 발행하는 도메인 서비스(`UploadService.js` 또는 `.py`)를 구현하라.
3. 전체 청크 조립 후 원본 파일 해시와 비교하는 SHA-256 체크섬 무결성 검증 함수를 작성하라.
4. 동일 청크 동시 전송 시의 Race Condition 방어 로직을 AI와 함께 검토하고 그 증거를 `ai_review.md`에 기록하라.

### 제출물

`upload_state_spec.md`, `UploadService.js`(또는 .py), `ai_review.md`

### 평가 기준 — 50점

청크 조립 및 멱등성 보장 15점; 상태 머신 전이 무결성 15점; 체크섬 무결성 검증 코드 10점; AI 리뷰 및 예외 방어 논리 10점.

---

## HW-D07-02 — 어뷰징(FDS) 예외 탐지 및 보정 트랜잭션 구현

- 영역: CODE / LOGIC
- 기술 Skill: TECH-DDD, TECH-FDS
- AI Skill: AI-REV, AI-AUDIT, AI-LOGIC
- 예상 시간: 45~60분

### 문제 상황

매크로 봇 계정이 헤드리스 브라우저로 광고가 포함된 영상을 초당 수십 회 새로고침하여 월 1,500만 원의 부정 정산금을 편취한 정황이 발견되었다. 플랫폼 회계 원칙상 이미 기록된 원장을 `DELETE`할 수 없으므로, 비정상 요청 실시간 차단과 사후 마이너스 보정 전표(Compensating Transaction)를 구현해야 한다.

### 해결해야 할 문제

1. 최소 시청 시간(15초), 동일 IP 재시청 쿨타임(10분), 인터랙션 여부를 반영한 FDS 탐지 규칙 명세서(`fds_business_rules.md`)를 작성하라.
2. 재생 메타데이터를 검증하여 이상 징후 발생 시 청구 이벤트 발행을 차단하는 도메인 규칙 엔진(`ViewValidator.js` 또는 `.py`)을 구현하라.
3. 사후 감사에서 적발된 부정 정산 건에 대해 기존 원장을 보존한 채 `ADJUSTMENT_NEGATIVE` 보정 전표를 발행하는 트랜잭션 로직을 작성하라.
4. AI가 제안한 단순 삭제 모델을 비판하고 복식 부기 보정 모델을 채택한 회계적 근거를 `ai_review.md`에 기록하라.

### 제출물

`fds_business_rules.md`, `ViewValidator.js`(또는 .py), `ai_review.md`

### 평가 기준 — 50점

FDS 탐지 규칙의 정밀성 15점; 회계 원장 보정 트랜잭션 무결성 15점; 오탐 방지 및 예외 처리 10점; AI 비판적 감사 및 의사결정 10점.
