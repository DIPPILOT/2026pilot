# Day 8 숙제 미션 — 회원 서비스와 온보딩 경험

개인 제출 / 숙제 2개 / 권장 총 90~120분. 제출 규칙은 [운영 안내](README.md)를 따른다.

학습 근거: [기존 Mission](../day8_codex_mission.md), [Summation](../day8_codex_summation.md), [추가 Skill Task](../skill_tasks/day08_skill_tasks.md).

## HW-D08-01 — 멀티 테넌트 권한(RBAC/ABAC) 매트릭스 및 가드

- 영역: CODE / ARCH
- 기술 Skill: TECH-SEC, TECH-AUTH
- AI Skill: AI-CODE, AI-REV, AI-SEC
- 예상 시간: 45~60분

### 문제 상황

VidAce는 MCN 채널과 에이전시를 수용하는 멀티 테넌트 구조다. 채널 내에 OWNER, EDITOR, ANALYST 역할이 존재하며, 단순 전역 Role 검사만 수행할 경우 공격자가 요청 파라미터의 `video_id`를 타 채널 영상으로 변조해 삭제하는 BOLA(IDOR) 공격에 취약해진다.

### 해결해야 할 문제

1. 4대 주체(VIEWER, CREATOR, ADVERTISER, ADMIN) 및 채널 서브 역할별 15개 핵심 API 접근 권한 매트릭스(`role_permission_matrix.md`)를 작성하라.
2. 유저의 역할(RBAC)뿐만 아니라 대상 리소스의 채널 소속 및 소유권(ABAC)을 함께 검증하는 백엔드 인가 가드 미들웨어(`auth_guard.js` 또는 `.py`)를 구현하라.
3. 타 채널 영상 삭제 시도 등 5종의 BOLA 부정 접근 침투 테스트 케이스를 작성하라.
4. AI가 제안한 권한 로직의 파라미터 변조 취약점을 식별하고 보강한 과정을 `ai_review.md`에 기록하라.

### 제출물

`role_permission_matrix.md`, `auth_guard.js`(또는 .py), `ai_review.md`

### 평가 기준 — 50점

RBAC/ABAC 매트릭스 완성도 15점; BOLA(IDOR) 방어 인가 가드 코드 15점; 부정 접근 테스트 케이스 5종 10점; AI 보안 감사 및 설계 판단 10점.

---

## HW-D08-02 — OAuth2 토큰 탈취 방지 및 세션 보안 Audit

- 영역: CODE / AUDIT
- 기술 Skill: TECH-SEC, TECH-OAUTH
- AI Skill: AI-AUDIT, AI-REV, AI-DOC
- 예상 시간: 45~60분

### 문제 상황

소셜 로그인 도입 후 LocalStorage에 토큰을 저장하여 XSS 탈취 위험이 존재하며, Refresh Token 재사용 탐지 부재 및 CSRF state 검증 누락이 발견되었다. HttpOnly/Secure 쿠키 기반 Refresh Token Rotation(RTR) 및 침해 탐지 시 전체 세션 무효화 체계를 구축해야 한다.

### 해결해야 할 문제

1. 토큰 저장 방식별 위협 모델링 및 공격 벡터 분석 보고서(`security_audit_report.md`)를 작성하라.
2. Token Family를 발급하고, 토큰 갱신 시 기존 토큰 폐기 및 재사용 감지 시 해당 계정의 모든 세션을 즉시 파기하는 RTR 백엔드 서비스(`token_service.js` 또는 `.py`)를 구현하라.
3. OAuth2 소셜 로그인 콜백에서 CSRF 공격을 차단하는 state 및 PKCE 해시 검증 루틴을 작성하라.
4. AI 보안 조언의 성능/운영 제약(Redis 메모리 부하 등)을 평가하고 최종 조율한 근거를 `ai_review.md`에 기록하라.

### 제출물

`security_audit_report.md`, `token_service.js`(또는 .py), `ai_review.md`

### 평가 기준 — 50점

위협 모델링 보고서 깊이 15점; RTR 및 토큰 패밀리 만료 코드 15점; CSRF/PKCE 방어 로직 10점; AI 보안 조언 검증 및 판단 10점.
