# Day 9 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Advertising, Billing & Analytics Integration
- **AI 역할:** Platform Architect
- **입력:** Campaign API, Business Rule, Identity, Playback Flow
- **통합 산출물:** Ad Serving Rule, Billing·Analytics Event, 통합 광고 Flow

## 추가 Task

### ADD-D09-T01 — 광고 후보 검색과 선택 Rule 구현

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-BIZ` `TECH-BE` `TECH-INT`
- **AI 활용 Skill:** `AI-ANA` `AI-GEN` `AI-REV`
- **수행 내용:** Active, Budget, Target Match, Frequency Cap을 만족하는 Campaign 후보와 선택 순서를 구현한다.
- **AI 활용 방식:** AI에게 Rule 우선순위, 동일 점수, 후보 없음, Budget 경계 상황을 검토하게 한다.
- **완료 기준:** 선택 결과가 Rule 근거와 함께 재현 가능하고 후보 없음도 안전하게 처리된다.

### ADD-D09-T02 — Billing·Analytics Domain Event 연결

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-ARCH` `TECH-DATA` `TECH-INT`
- **AI 활용 Skill:** `AI-DES` `AI-GEN` `AI-QA`
- **수행 내용:** AdRequested, AdServed, Impression, Click, Charge 이벤트와 비용·분석 데이터 흐름을 설계한다.
- **AI 활용 방식:** AI에게 중복 이벤트, 순서 역전, 유실, 재처리 Scenario를 만들게 하고 멱등성을 검토한다.
- **완료 기준:** 이벤트 소유 Domain, Payload, 멱등성 키, 실패·재처리 정책이 정의된다.

### ADD-D09-T03 — Viewer–Ad–Billing E2E 검증

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-INT` `TECH-QA` `TECH-BIZ`
- **AI 활용 Skill:** `AI-CTX` `AI-QA` `AI-DBG` `AI-DOC`
- **수행 내용:** 영상 선택부터 광고 노출, 재생, 비용 차감, Analytics 반영까지 통합 실행한다.
- **AI 활용 방식:** AI가 관찰자 역할로 기대 상태와 실제 상태를 비교하고 불일치의 원인 후보를 좁힌다.
- **완료 기준:** E2E 실행 증거와 Domain별 상태 변화, 실패 복구 결과가 남는다.

## LMS 반영용 마킹 예시

```text
[ADD-D09-T01] 광고 후보 검색과 선택 Rule 구현
영역: TECH
TECH: TECH-BIZ, TECH-BE, TECH-INT
AI: AI-ANA, AI-GEN, AI-REV
```
