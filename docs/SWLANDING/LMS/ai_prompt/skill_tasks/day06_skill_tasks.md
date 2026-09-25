# Day 6 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Front-End & Domain API Integration
- **AI 역할:** Pair Programmer
- **입력:** UI Prototype, API Contract, Test Data
- **통합 산출물:** 동작하는 Viewer 또는 Advertiser Flow, 상태 처리, Front-End Review

## 추가 Task

### ADD-D06-T01 — 화면–API Binding 구현

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-FE` `TECH-API`
- **AI 활용 Skill:** `AI-CTX` `AI-GEN` `AI-ORCH`
- **수행 내용:** Viewer Flow 또는 Advertiser Flow의 화면을 실제 API Contract와 연결한다.
- **AI 활용 방식:** Codex는 데이터 흐름·코드 초안, Antigravity는 Component·Interaction 구현을 담당하도록 Context와 역할을 분리한다.
- **완료 기준:** 선택한 Flow가 Mock 또는 실제 API로 시작부터 완료까지 동작한다.

### ADD-D06-T02 — 상태 관리와 실패 UX 구현

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-FE` `TECH-QA`
- **AI 활용 Skill:** `AI-GEN` `AI-DBG` `AI-QA`
- **수행 내용:** Loading, Empty, Validation, Unauthorized, Timeout, Server Error 상태를 구현한다.
- **AI 활용 방식:** AI에게 E2E 실패 Scenario를 생성하게 하고 각 상태가 사용자에게 복구 행동을 제공하는지 검증한다.
- **완료 기준:** 최소 6개 상태와 재시도·수정·로그인 등 복구 동작이 확인된다.

### ADD-D06-T03 — Front-End Debugging과 Refactoring

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-FE` `TECH-QA`
- **AI 활용 Skill:** `AI-DBG` `AI-REV` `AI-DOC`
- **수행 내용:** 콘솔 오류, 중복 코드, 전역 상태 오염, 접근성·성능 문제를 찾아 개선한다.
- **AI 활용 방식:** AI에게 코드 Reviewer 역할을 부여하되 제안별 수용·수정·거절 근거를 기록한다.
- **완료 기준:** 오류 재현, 원인, 패치, 회귀 테스트, Review Decision이 남는다.

## LMS 반영용 마킹 예시

```text
[ADD-D06-T01] 화면–API Binding 구현
영역: TECH
TECH: TECH-FE, TECH-API
AI: AI-CTX, AI-GEN, AI-ORCH
```
