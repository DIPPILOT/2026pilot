# Day 10 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Full Integration, QA & Service Launch
- **AI 역할:** QA Engineer / Release Reviewer
- **입력:** Day 1~9의 MD Context와 통합 POC
- **통합 산출물:** 최종 E2E POC, Test Report, Release 문서, 발표 자료, AI 활용 회고

## 추가 Task

### ADD-D10-T01 — 전체 서비스 E2E Scenario와 QA

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-INT` `TECH-QA`
- **AI 활용 Skill:** `AI-CTX` `AI-QA` `AI-DBG`
- **수행 내용:** Signup → Upload → Campaign → Login → Search → Play → Ad → Billing → Analytics 전체 흐름을 실행한다.
- **AI 활용 방식:** AI에게 Domain별 기대 상태, 실패 주입 지점, 회귀 Test를 생성하게 하고 실제 결과를 비교한다.
- **완료 기준:** 핵심 E2E와 주요 실패·복구 Scenario가 재현 가능하게 통과한다.

### ADD-D10-T02 — Release Readiness와 문서 Context 완성

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-OPS` `TECH-QA` `TECH-ARCH`
- **AI 활용 Skill:** `AI-REV` `AI-DOC` `AI-ORCH`
- **수행 내용:** README부터 요구사항·Domain·Flow·ERD·API·UI·Rule·Security·Test·Release 문서를 연결한다.
- **AI 활용 방식:** Codex와 Antigravity가 동일 MD Context를 기준으로 작업했는지 검토하고 문서·구현 불일치를 찾는다.
- **완료 기준:** 12종 프로젝트 문서와 POC가 상호 추적되고 Release Checklist가 완료된다.

### ADD-D10-T03 — 설계 Decision·AI 활용·Demo 발표

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-BA` `TECH-ARCH` `TECH-OPS`
- **AI 활용 Skill:** `AI-DOC` `AI-REV` `AI-CTX`
- **수행 내용:** 문제, Domain 구조, 핵심 Decision, AI 활용, 구현 결과, 수정·검증 과정, Demo를 발표한다.
- **AI 활용 방식:** AI에게 발표 Reviewer 역할을 부여해 근거 부족·과장·누락을 점검하고 사람이 최종 메시지를 확정한다.
- **완료 기준:** 발표가 결과뿐 아니라 판단 근거, AI 제안의 검증 과정, 개선 방향을 설명한다.

## LMS 반영용 마킹 예시

```text
[ADD-D10-T01] 전체 서비스 E2E Scenario와 QA
영역: TECH
TECH: TECH-INT, TECH-QA
AI: AI-CTX, AI-QA, AI-DBG
```
