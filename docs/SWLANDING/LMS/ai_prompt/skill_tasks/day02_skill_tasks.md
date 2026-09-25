# Day 2 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** User Flow & Sequence Modeling
- **AI 역할:** System Analyst
- **입력:** Day 1 Domain Map·Persona·Feature List
- **통합 산출물:** User Flow 3종, Sequence Diagram 3종, 예외 흐름 목록

## 추가 Task

### ADD-D02-T01 — 핵심 사용자 Flow 설계

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-BA` `TECH-FLOW`
- **AI 활용 Skill:** `AI-ANA` `AI-DES`
- **수행 내용:** Video Upload, Video Playback, Advertising 세 가지 사용자 흐름을 시작 조건부터 완료 조건까지 설계한다.
- **AI 활용 방식:** AI에게 정상 흐름의 누락 단계와 사용자·시스템 책임 혼합 여부를 분석하게 한다.
- **완료 기준:** 세 Flow 모두 Actor, 시작 조건, 단계, 완료 조건을 포함한다.

### ADD-D02-T02 — Domain 간 Sequence Diagram 작성

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-FLOW` `TECH-ARCH`
- **AI 활용 Skill:** `AI-CTX` `AI-DES` `AI-REV`
- **수행 내용:** 각 Flow를 Domain·Service·DB·외부 시스템 간 메시지 순서로 변환한다.
- **AI 활용 방식:** Codex로 Mermaid Sequence 초안을 생성하고 호출 방향, 응답, 실패·타임아웃을 사람이 검증한다.
- **완료 기준:** 정상 흐름과 최소 2개 예외 흐름이 포함된 Sequence 3종이 완성된다.

### ADD-D02-T03 — 광고 반복 노출과 예외 규칙 발견

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-FLOW` `TECH-BIZ` `TECH-DATA`
- **AI 활용 Skill:** `AI-ANA` `AI-REV` `AI-DOC`
- **수행 내용:** 동일 광고의 과다 노출을 막기 위한 Frequency Capping 데이터와 Rule을 정의한다.
- **AI 활용 방식:** AI에게 필요한 상태·시간창·식별자·예외를 질문하고 근거가 약한 제안을 반박·보완한다.
- **완료 기준:** Frequency Cap 규칙, 필요 데이터, 예외 조건, 검증 시나리오가 문서화된다.

## LMS 반영용 마킹 예시

```text
[ADD-D02-T01] 핵심 사용자 Flow 설계
영역: TECH
TECH: TECH-BA, TECH-FLOW
AI: AI-ANA, AI-DES
```
