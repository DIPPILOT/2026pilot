# Day 6 숙제 미션 — 프론트엔드 개발과 API 연동

개인 제출 / 숙제 2개 / 권장 총 90~120분. 제출 규칙은 [운영 안내](README.md)를 따른다.

학습 근거: [기존 Mission](../day6_codex_mission.md), [Summation](../day6_codex_summation.md), [추가 Skill Task](../skill_tasks/day06_skill_tasks.md).

## HW-D06-01 — 실시간 비디오 재생기 & 상태 바인딩 UI 구현

- 영역: CODE / FE
- 기술 Skill: TECH-FE, TECH-STATE
- AI Skill: AI-CODE, AI-REV, AI-TEST
- 예상 시간: 45~60분

### 문제 상황

VidAce 웹 플랫폼에서 4K/FHD 고화질 스트리밍을 제공하는 비디오 플레이어 UI 컴포넌트를 개발 중이다. 플레이어는 단순 재생/일시정지 외에 복합 비동기 상태를 하나의 화면에서 처리해야 한다.
- 재생 상태 라이프사이클: IDLE → LOADING → PLAYING → BUFFERING → ERROR → ENDED
- 광고 노출 상태: 프리롤 광고(5초 카운트다운 후 '광고 건너뛰기' 활성화), 미드롤 광고 삽입 시 플레이어 일시정지 및 광고 전용 프로그레스바 전환
- 시청 통계 및 통신: 1초마다 발생하는 timeupdate 이벤트를 그대로 전송하면 서버 폭주 위험 → 5초 간격 쓰로틀링(Throttling) 및 배치 비동기 전송 필수

### 해결해야 할 문제

1. 비디오 본편 상태와 광고 상태 간 전이 규칙을 정의한 상태 머신 명세서(`player_state_machine.md`)를 작성하라.
2. HTML5 Video 요소를 제어하고, 이벤트 리스너와 5초 스킵 카운트다운, 5초 주기 시청 데이터 배치 전송 로직을 포함한 핵심 플레이어 컨트롤러(`VideoPlayer.js` 또는 `.html`)를 구현하라.
3. 브라우저 탭 전환이나 창 닫기 시 마지막 재생 위치를 유실 없이 전송하는 `visibilitychange` / `navigator.sendBeacon` 핸들러를 포함하라.
4. AI에게 코드 리뷰를 요청하여 이벤트 리스너 메모리 누수나 상태 경쟁 상태(Race Condition)를 검증하고 보완한 과정을 `ai_review.md`에 기록하라.

### 제출물

`player_state_machine.md`, `VideoPlayer.js`(또는 HTML), `ai_review.md`

### 평가 기준 — 50점

FSM 상태 전이 무결성 15점; 쓰로틀링 및 Beacon 동기화 코드 15점; 광고 5초 스킵 UI 바인딩 10점; AI 검토와 자기 판단 증거 10점.

---

## HW-D06-02 — AdBlock 차단 및 네트워크 단절 대응 Fallback UX

- 영역: CODE / UX
- 기술 Skill: TECH-FE, TECH-UX
- AI Skill: AI-CTX, AI-DEBUG, AI-REV
- 예상 시간: 45~60분

### 문제 상황

베타 테스트 결과 시청자의 35%가 브라우저 광고 차단기(AdBlock)를 사용 중이다. 이로 인해 광고 API 호출이 `ERR_BLOCKED_BY_CLIENT`로 차단되어 비디오 플레이어의 비동기 체인이 멈추고 검은 화면(Black Screen)으로 굳어버리는 치명적 결함이 발생했다. 광고 실패 시에도 메인 비디오 재생을 차단하지 않고 대체 하우스 광고나 즉시 재생으로 우회해야 한다.

### 해결해야 할 문제

1. 정상 광고, AdBlock 차단, 네트워크 단절, CDN 장애에 따른 의사결정 트리 및 Fallback 대응 플로우차트(`fallback_flow.md`)를 작성하라.
2. 광고 API 오류가 전체 플레이어 동작을 중단시키지 않도록 예외를 격리하고, 대체 로컬 배너 또는 무광고 즉시 재생을 보장하는 탄력적 코드(`ad_fallback_handler.js`)를 구현하라.
3. 오프라인 상태 감지 시 '네트워크 연결 재시도 중...' 토스트 및 지수 백오프(Exponential Backoff) 재연결 UI를 구현하라.
4. AI와 수익성 vs 사용자 경험 트레이드오프를 논의하고 최종 Fallback 정책 결정 근거를 `ai_review.md`에 기록하라.

### 제출물

`fallback_flow.md`, `ad_fallback_handler.js`, `ai_review.md`

### 평가 기준 — 50점

비동기 에러 격리 및 무멈춤 재생 15점; Fallback 분기 플로우 완성도 15점; 네트워크 재시도 백오프 로직 10점; 비즈니스 판단 증거 및 AI 검토 10점.
