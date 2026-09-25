# Day 7 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Back-End & Domain Business Logic
- **AI 역할:** Domain Reviewer / Backend Engineer
- **입력:** API Contract, ERD, Front-End Flow
- **통합 산출물:** Business Rule 문서, Domain Service, DB 연결, Rule Test

## 추가 Task

### ADD-D07-T01 — Business Rule 명세

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-BIZ` `TECH-DDD`
- **AI 활용 Skill:** `AI-ANA` `AI-REV` `AI-DOC`
- **수행 내용:** Campaign 상태, Budget, 기간, Target, Frequency Cap 등 최소 10개 Business Rule을 코드보다 먼저 문서화한다.
- **AI 활용 방식:** AI에게 Rule의 모순·누락·경계값을 검토하게 하고 최종 판단 근거를 사람이 확정한다.
- **완료 기준:** 각 Rule에 조건, 결과, 예외, 검증 예시가 있다.

### ADD-D07-T02 — Domain Service와 Repository 구현

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-BE` `TECH-BIZ` `TECH-DATA`
- **AI 활용 Skill:** `AI-CTX` `AI-GEN` `AI-REV`
- **수행 내용:** Controller–Service–Repository 책임을 분리해 Rule과 DB 작업을 구현한다.
- **AI 활용 방식:** AI에게 ‘Business Rule이 Controller에 직접 구현된 부분’을 찾게 하고 리팩토링 전후를 비교한다.
- **완료 기준:** Controller가 입출력 조정에 집중하고 Rule은 Domain/Service 계층에서 테스트된다.

### ADD-D07-T03 — Transaction·Validation·Exception 검증

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-BE` `TECH-BIZ` `TECH-QA`
- **AI 활용 Skill:** `AI-QA` `AI-DBG` `AI-REV`
- **수행 내용:** 동시 요청, Budget 소진, 잘못된 상태 전이, DB 실패를 포함한 테스트를 수행한다.
- **AI 활용 방식:** AI가 생성한 경계·실패 테스트를 실제 코드에 실행하고 잘못된 가정은 수정한다.
- **완료 기준:** 핵심 Rule의 정상·경계·실패 Test와 로그·예외 정책이 통과한다.

## LMS 반영용 마킹 예시

```text
[ADD-D07-T01] Business Rule 명세
영역: TECH
TECH: TECH-BIZ, TECH-DDD
AI: AI-ANA, AI-REV, AI-DOC
```
