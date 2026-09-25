# Day 9 숙제 미션 — 결제 서비스와 체크아웃 경험

개인 제출 / 숙제 2개 / 권장 총 90~120분. 제출 규칙은 [운영 안내](README.md)를 따른다.

학습 근거: [기존 Mission](../day9_codex_mission.md), [Summation](../day9_codex_summation.md), [추가 Skill Task](../skill_tasks/day09_skill_tasks.md).

## HW-D09-01 — 광고주 캠페인 예산 충전 & PG 결제 파이프라인

- 영역: CODE / PAY
- 기술 Skill: TECH-PAY, TECH-TX
- AI Skill: AI-CODE, AI-REV, AI-DOC
- 예상 시간: 45~60분

### 문제 상황

기업 광고주가 1,000만 원 상당의 비디오 광고 예산을 카드 결제할 때, 클라이언트에서 결제 금액을 임의 변조하거나 버튼 더블 클릭으로 이중 결제가 발생하는 사고를 방지해야 한다. 서버 사전 주문 생성, PG 승인 전 금액 무결성 검증, 멱등성 보장이 필수적이다.

### 해결해야 할 문제

1. 브라우저, 백엔드, PG사 간의 결제 요청, 금액 검증, 승인, 예산 반영을 나타낸 Mermaid 시퀀스 다이어그램(`payment_pipeline.md`)을 작성하라.
2. 결제 사전 준비(Prepare), 금액 검증 및 승인(Confirm), 예산 원장 기록(Credit Deposit)을 원자적 트랜잭션으로 처리하는 체크아웃 서비스(`CheckoutService.js` 또는 `.py`)를 구현하라.
3. 변조된 금액 결제 시도와 동일 멱등성 키의 중복 승인 요청을 차단하는 테스트 코드를 작성하라.
4. AI가 제안한 결제 코드의 트랜잭션 격리 수준(Isolation Level)과 데드락 가능성을 점검하고 보완한 내용을 `ai_review.md`에 기록하라.

### 제출물

`payment_pipeline.md`, `CheckoutService.js`(또는 .py), `ai_review.md`

### 평가 기준 — 50점

시퀀스 다이어그램 및 설계 완성도 15점; 금액 위변조 방지 및 멱등성 코드 15점; 트랜잭션 원자성 및 예외 테스트 10점; AI 결제 검토 및 의사결정 증거 10점.

---

## HW-D09-02 — 결제 타임아웃 보상 트랜잭션(Saga) 및 정산 대사

- 영역: CODE / ARCH
- 기술 Skill: TECH-PAY, TECH-DIST
- AI Skill: AI-REV, AI-AUDIT, AI-LOGIC
- 예상 시간: 45~60분

### 문제 상황

PG사 승인 API 호출 도중 HTTP 504 타임아웃이 발생하여 서버는 결제를 실패 처리했으나 광고주의 카드는 승인되는 '유령 결제'가 발생했다. 분산 환경에서 2PC가 불가능하므로 Saga 패턴의 보상 트랜잭션과 주기적 정산 대사(Reconciliation Worker)를 통해 자동 복구해야 한다.

### 해결해야 할 문제

1. PENDING, TIMEOUT, AUTO_RECONCILED, COMPENSATING_CANCELLED 상태 전이 다이어그램 및 복구 정책(`payment_recovery_state.md`)을 작성하라.
2. 미확정 결제 건을 PG사 거래 조회 API와 대조하여 자동 잔액 적립 또는 PG 승인 취소를 실행하는 대사 배치 워커(`PaymentReconciliationWorker.js` 또는 `.py`)를 구현하라.
3. 자동 복구 실패 시 관리자 대시보드에 알림을 전송하고 수동 개입을 유도하는 DLQ 예외 처리기를 작성하라.
4. 단순 Retry 방식의 한계를 비판하고 Saga 보상 트랜잭션을 선택한 기술적 근거를 `ai_review.md`에 기록하라.

### 제출물

`payment_recovery_state.md`, `PaymentReconciliationWorker.js`(또는 .py), `ai_review.md`

### 평가 기준 — 50점

복구 상태 머신 설계의 정합성 15점; 정산 대사 워커 및 보상 취소 코드 15점; DLQ 및 예외 알림 체계 10점; AI 분산 트랜잭션 비판적 검토 10점.
