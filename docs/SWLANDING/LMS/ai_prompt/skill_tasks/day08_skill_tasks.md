# Day 8 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Identity, Role & Authorization
- **AI 역할:** Security Reviewer
- **입력:** Persona, Role 요구사항, API Contract
- **통합 산출물:** Role Matrix, Signup/Login, Token 인증, API Authorization, Security Review

## 추가 Task

### ADD-D08-T01 — Role·Permission Matrix 설계

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-SEC` `TECH-BA`
- **AI 활용 Skill:** `AI-ANA` `AI-REV`
- **수행 내용:** Viewer·Creator·Advertiser·Admin별 화면·API·데이터 권한을 Matrix로 정의한다.
- **AI 활용 방식:** AI에게 과도한 권한, 누락된 소유권 검사, 역할 충돌을 찾아달라고 요청한다.
- **완료 기준:** 모든 보호 기능에 허용 Role과 소유권 조건이 명시된다.

### ADD-D08-T02 — Authentication Flow 구현

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-SEC` `TECH-BE` `TECH-FE`
- **AI 활용 Skill:** `AI-GEN` `AI-DBG` `AI-QA`
- **수행 내용:** Signup, Login, Password 처리, Token/JWT 발급·만료·갱신과 Front-End 세션 흐름을 구현한다.
- **AI 활용 방식:** AI에게 정상·실패·만료·재사용 Scenario와 안전한 구현 Checklist를 생성하게 한다.
- **완료 기준:** 인증 흐름과 Token 정책이 동작하고 민감정보가 로그·저장소에 노출되지 않는다.

### ADD-D08-T03 — Authorization Negative Test와 Security Audit

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-SEC` `TECH-QA`
- **AI 활용 Skill:** `AI-CTX` `AI-SEC` `AI-QA`
- **수행 내용:** 다른 사용자의 Video/Campaign 수정, Admin API 접근, Role 위조 등을 시도한다.
- **AI 활용 방식:** AI를 Security Reviewer로 지정해 인증 누락·권한 누락·공개 API·Role 검증 오류를 감사한다.
- **완료 기준:** 권한 우회 Test가 차단되고 발견 사항·조치·잔여 위험이 기록된다.

## LMS 반영용 마킹 예시

```text
[ADD-D08-T01] Role·Permission Matrix 설계
영역: TECH
TECH: TECH-SEC, TECH-BA
AI: AI-ANA, AI-REV
```
