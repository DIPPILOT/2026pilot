# Day 5 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Persona-Based UI/UX & Prototype
- **AI 역할:** UX Reviewer / Front-End Assistant
- **입력:** Persona, User Flow, API Contract
- **통합 산출물:** 화면 목록, Screen Flow, Component Map, Persona별 Prototype

## 추가 Task

### ADD-D05-T01 — Persona별 Information Architecture 설계

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-UX` `TECH-BA`
- **AI 활용 Skill:** `AI-ANA` `AI-DES`
- **수행 내용:** Viewer·Creator·Advertiser의 목표에 맞춰 화면 목록, 메뉴, Screen Flow를 설계한다.
- **AI 활용 방식:** AI에게 Persona별 필수 화면과 불필요한 단계, 권한에 맞지 않는 진입점을 찾게 한다.
- **완료 기준:** 각 화면이 Persona 목표와 User Flow 단계에 연결된다.

### ADD-D05-T02 — Component와 UI State 정의

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-UX` `TECH-FE`
- **AI 활용 Skill:** `AI-DES` `AI-GEN` `AI-REV`
- **수행 내용:** 공통 Component, Form, Loading, Empty, Error, Disabled, Success 상태를 UI Spec으로 정의한다.
- **AI 활용 방식:** Codex로 Component 구조를 만들고 Antigravity로 Layout·Interaction Prototype을 구현한 뒤 역할 분담을 기록한다.
- **완료 기준:** UI Spec과 Prototype에 핵심 상태가 모두 표현된다.

### ADD-D05-T03 — 초보 사용자 UX Walkthrough

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-UX` `TECH-QA`
- **AI 활용 Skill:** `AI-CTX` `AI-REV` `AI-QA`
- **수행 내용:** 처음 방문한 사용자가 영상 재생 또는 Campaign 생성까지 완료하는 과정을 점검한다.
- **AI 활용 방식:** AI에게 초보 Persona를 부여해 혼란 지점, 용어, 피드백 부족, 이탈 구간을 평가하게 한다.
- **완료 기준:** 발견 이슈가 심각도·근거·개선안과 함께 정리되고 Prototype에 반영된다.

## LMS 반영용 마킹 예시

```text
[ADD-D05-T01] Persona별 Information Architecture 설계
영역: TECH
TECH: TECH-UX, TECH-BA
AI: AI-ANA, AI-DES
```
