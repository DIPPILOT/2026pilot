# Day 1 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Business Understanding & Domain Discovery
- **AI 역할:** Domain Analyst
- **입력:** 서비스 아이디어, 기존 Day 1 요구사항 산출물, 사용자 후보
- **통합 산출물:** Service Overview, Persona, Feature List, Domain Map, Responsibility Map

## 추가 Task

### ADD-D01-T01 — 서비스 문제와 Persona 정의

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-BA` `TECH-DDD`
- **AI 활용 Skill:** `AI-CTX` `AI-ANA` `AI-DOC`
- **수행 내용:** Viewer·Creator·Advertiser·Admin의 목표, 행동, 기능, 필요 데이터를 정의한다.
- **AI 활용 방식:** AI에게 Domain Analyst 역할과 서비스 시나리오를 제공하고 Persona 간 목표 충돌·누락을 찾아달라고 요청한다.
- **완료 기준:** Persona별 목표·행동·기능·데이터가 표로 정리되고 서로 구분된다.

### ADD-D01-T02 — Feature를 Domain으로 분류

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-BA` `TECH-DDD`
- **AI 활용 Skill:** `AI-ANA` `AI-REV`
- **수행 내용:** 회원, Channel, Video, Playback, Engagement, Advertising, Ad Serving, Billing, Analytics 기능을 책임 Domain에 배치한다.
- **AI 활용 방식:** AI에게 기능별 책임 후보와 대안을 제시하게 한 뒤 사람이 최종 경계를 선택하고 근거를 기록한다.
- **완료 기준:** 모든 핵심 기능에 하나의 주 책임 Domain이 지정되고 중복 책임은 별도로 표시된다.

### ADD-D01-T03 — Domain Map과 책임 경계 검토

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-DDD` `TECH-ARCH`
- **AI 활용 Skill:** `AI-CTX` `AI-REV` `AI-DOC`
- **수행 내용:** Domain 간 선후 관계, 의존성, 데이터 소유권을 시각화하고 Bounded Context 초안을 만든다.
- **AI 활용 방식:** ‘책임이 중복되거나 누락된 Domain을 분석하라’는 Review Prompt로 AI 검토를 수행하고 수정 전후를 남긴다.
- **완료 기준:** Domain Map, 책임표, 핵심 Entity 후보와 AI 검토 반영 내역이 남는다.

## LMS 반영용 마킹 예시

```text
[ADD-D01-T01] 서비스 문제와 Persona 정의
영역: HYBRID
TECH: TECH-BA, TECH-DDD
AI: AI-CTX, AI-ANA, AI-DOC
```
