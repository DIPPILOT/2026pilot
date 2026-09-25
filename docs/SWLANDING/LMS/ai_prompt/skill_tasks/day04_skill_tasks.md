# Day 4 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Domain-Based API Contract
- **AI 역할:** API Architect
- **입력:** Domain Map, Sequence, ERD
- **통합 산출물:** Domain별 REST API 목록, OpenAPI Spec, 오류 Contract

## 추가 Task

### ADD-D04-T01 — Domain Boundary 기반 Endpoint 설계

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-DDD` `TECH-API`
- **AI 활용 Skill:** `AI-ANA` `AI-DES`
- **수행 내용:** Video, Playback, Campaign, Ad Serving 중 최소 4개 Domain의 Resource와 Endpoint를 설계한다.
- **AI 활용 방식:** AI에게 Endpoint가 어느 Domain 책임인지 질문하고 경계를 넘는 API를 식별하게 한다.
- **완료 기준:** 각 Endpoint에 책임 Domain, Method, URI, 사용 Scenario가 연결된다.

### ADD-D04-T02 — Request·Response·Error Contract 작성

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-API` `TECH-DATA`
- **AI 활용 Skill:** `AI-CTX` `AI-DES` `AI-DOC`
- **수행 내용:** 입력 Schema, 응답 Schema, Status Code, Validation Error, 인증 요구사항을 정의하고 OpenAPI로 표현한다.
- **AI 활용 방식:** Codex로 OpenAPI 초안을 만들되 ERD와 이름·타입·필수값을 대조해 사람이 승인한다.
- **완료 기준:** 최소 4개 Domain의 API Contract가 정상·실패 예시를 포함한다.

### ADD-D04-T03 — API Contract Consistency Review

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-API` `TECH-QA`
- **AI 활용 Skill:** `AI-REV` `AI-QA`
- **수행 내용:** API가 Sequence·ERD·Domain Rule과 일치하는지 검토하고 Breaking Change 후보를 찾는다.
- **AI 활용 방식:** AI에게 소비자 관점의 부정 테스트와 버전 호환성 위험을 생성하게 한다.
- **완료 기준:** 불일치·Breaking Change·부정 테스트가 추적 가능한 Review Report로 남는다.

## LMS 반영용 마킹 예시

```text
[ADD-D04-T01] Domain Boundary 기반 Endpoint 설계
영역: TECH
TECH: TECH-DDD, TECH-API
AI: AI-ANA, AI-DES
```
