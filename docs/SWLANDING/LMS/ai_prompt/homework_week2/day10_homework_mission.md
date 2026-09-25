# Day 10 숙제 미션 — 서비스 런칭과 최종 발표

개인 제출 / 숙제 2개 / 권장 총 90~120분. 제출 규칙은 [운영 안내](README.md)를 따른다.

학습 근거: [기존 Mission](../day10_codex_mission.md), [Summation](../day10_codex_summation.md), [추가 Skill Task](../skill_tasks/day10_skill_tasks.md).

## HW-D10-01 — 전사 핵심 E2E 통합 QA 및 Launch Readiness 평가

- 영역: TEST / QA
- 기술 Skill: TECH-QA, TECH-E2E
- AI Skill: AI-TEST, AI-DOC, AI-REV
- 예상 시간: 45~60분

### 문제 상황

글로벌 런칭 D-3. 시청자, 창작자, 광고주가 참여하는 핵심 비즈니스 루프(회원가입 → 예산 충전 → 영상 업로드/인코딩 → 광고 삽입 재생 → 시청 통계 및 광고비 차감/정산)에 대한 전사 통합 E2E 테스트와 정식 배포 승인을 위한 Go/No-Go 판정 체계를 수립해야 한다.

### 해결해야 할 문제

1. 4대 역할이 상호작용하는 5대 크리티컬 유저 저니에 대한 E2E 테스트 시나리오 명세서(`e2e_test_scenarios.md`)를 작성하라.
2. 기능, 보안, 성능, 운영 관점의 20개 점검 항목과 Go/No-Go 판정 기준표(`launch_readiness_checklist.md`)를 작성하라.
3. Playwright/Cypress 기반으로 비디오 재생 → 광고 노출 → 정산 이벤트를 검증하는 자동화 스크립트(`e2e_core_flow.spec.js`)를 작성하라.
4. AI가 작성한 테스트 시나리오 중 실제 브라우저 환경에서 발생할 수 있는 엣지 케이스(쿠키 차단, 네트워크 스로틀링)를 보완한 결과를 `ai_review.md`에 기록하라.

### 제출물

`e2e_test_scenarios.md`, `launch_readiness_checklist.md`, `e2e_core_flow.spec.js`, `ai_review.md`

### 평가 기준 — 50점

E2E 비즈니스 루프 시나리오 완성도 15점; Launch Readiness 판정 기준 명확성 15점; E2E 자동화 스크립트 실행성 10점; AI QA 조언 검증 및 리스크 분석 10점.

---

## HW-D10-02 — 대규모 트래픽 장애 대비 서킷 브레이커 & 무중단 롤백

- 영역: CODE / SRE
- 기술 Skill: TECH-SRE, TECH-RESIL
- AI Skill: AI-CODE, AI-REV, AI-AUDIT
- 예상 시간: 45~60분

### 문제 상황

런칭 당일 동시 접속자가 15만 명으로 폭증하며 추천 엔진 및 광고 서버 지연(8초)으로 인해 메인 비디오 스트리밍 API 스레드가 고갈되어 전체 서비스가 다운되는 연쇄 장애 위기에 직면했다. 장애 전파 차단을 위한 서킷 브레이커(우아한 기능 저하)와 배포 결함 시 1분 내 무손실 롤백 런북이 필요하다.

### 해결해야 할 문제

1. 서킷 브레이커 3상태(Closed → Open → Half-Open) 전이 및 Fallback 캐시 반환 규칙을 명시한 아키텍처 설계서(`circuit_breaker_architecture.md`)를 작성하라.
2. 외부 서비스 장애 발생 시 즉시 서킷을 열고 기본 로컬 캐시를 반환하는 서킷 브레이커 미들웨어(`CircuitBreaker.js` 또는 `.py`)를 구현하라.
3. 배포 장애 발생 시 1분 내에 이전 안정 버전으로 트래픽을 즉시 전환하고 DB 스키마 하위 호환성을 유지하는 무중단 롤백 운영 런북(`zero_downtime_rollback_runbook.md`)을 작성하라.
4. AI와 함께 카오스 엔지니어링(광고 서버 강제 다운) 시뮬레이션을 수행하고 메인 스트리밍의 무중단 유지 여부를 검증한 결과를 `ai_review.md`에 기록하라.

### 제출물

`circuit_breaker_architecture.md`, `CircuitBreaker.js`(또는 .py), `zero_downtime_rollback_runbook.md`, `ai_review.md`

### 평가 기준 — 50점

서킷 브레이커 아키텍처 및 Fallback 15점; 회복 탄력성(Resilience) 구현 코드 15점; 무중단 롤백 런북의 실효성 10점; AI 카오스 테스트 검증 및 판단 10점.
