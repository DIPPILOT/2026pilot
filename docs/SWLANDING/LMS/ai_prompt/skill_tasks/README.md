# 추가 Skill Task 문서

> 이 디렉터리는 기존 LMS Task를 대체하지 않는다. 기존 Task를 유지한 상태에서 개발자가 기술을 직접 익히는 추가 Task 설계안이다. AI는 구현을 대신 수행하는 Agent가 아니라 개념 Tutor, 초안 Reviewer, 반례·테스트 생성기로 제한한다.

## 8일 기준안의 10일 LMS 매핑

| LMS Day | 추가 역량 축 | AI 보조 역할 | 문서 |
|---:|---|---|---|
| 1 | Business Understanding & Domain Discovery | Domain Analyst | [day01_skill_tasks.md](./day01_skill_tasks.md) |
| 2 | User Flow & Sequence Modeling | System Analyst | [day02_skill_tasks.md](./day02_skill_tasks.md) |
| 3 | Entity Discovery & ERD | Data Architect | [day03_skill_tasks.md](./day03_skill_tasks.md) |
| 4 | Domain-Based API Contract | API Architect | [day04_skill_tasks.md](./day04_skill_tasks.md) |
| 5 | Persona-Based UI/UX & Prototype | UX Reviewer / Front-End Assistant | [day05_skill_tasks.md](./day05_skill_tasks.md) |
| 6 | Front-End & Domain API Integration | Pair Programmer | [day06_skill_tasks.md](./day06_skill_tasks.md) |
| 7 | Back-End & Domain Business Logic | Domain Reviewer / Backend Engineer | [day07_skill_tasks.md](./day07_skill_tasks.md) |
| 8 | Identity, Role & Authorization | Security Reviewer | [day08_skill_tasks.md](./day08_skill_tasks.md) |
| 9 | Advertising, Billing & Analytics Integration | Platform Architect | [day09_skill_tasks.md](./day09_skill_tasks.md) |
| 10 | Full Integration, QA & Service Launch | QA Engineer / Release Reviewer | [day10_skill_tasks.md](./day10_skill_tasks.md) |

## Task 영역 마킹

| 마킹 | 의미 |
|---|---|
| `TECH` | 기술 설계·구현 판단이 중심이며 AI는 보조 도구로 사용 |
| `AI` | AI에 Context·역할을 주고 결과를 검토·개선하는 역량이 중심 |
| `HYBRID` | 기술 수행과 AI 협업이 동일한 비중으로 결합 |

## Skill 코드

| 코드 | 영역 |
|---|---|
| `TECH-BA` | 비즈니스·요구사항 분석 |
| `TECH-DDD` | Domain 발견·책임·경계 설계 |
| `TECH-ARCH` | 서비스·소프트웨어 아키텍처 |
| `TECH-FLOW` | User Flow·Sequence 모델링 |
| `TECH-DATA` | Entity·ERD·정규화·데이터 모델링 |
| `TECH-API` | REST·OpenAPI·API Contract |
| `TECH-UX` | 정보구조·화면 흐름·UI/UX |
| `TECH-FE` | Front-End·상태·API Binding |
| `TECH-BE` | Back-End·Service·Repository |
| `TECH-BIZ` | Business Rule·Validation·Transaction |
| `TECH-SEC` | 인증·인가·Role·API Security |
| `TECH-INT` | Domain 통합·Event·E2E Integration |
| `TECH-QA` | Test·QA·검증·품질 |
| `TECH-OPS` | Release·운영·관측·문서화 |
| `AI-CTX` | Context Engineering·역할 부여 |
| `AI-ANA` | 요구사항·Domain·데이터 분석 |
| `AI-DES` | 설계안·다이어그램·명세 생성 |
| `AI-GEN` | 코드·프로토타입 생성 |
| `AI-REV` | 설계·코드·산출물 Review |
| `AI-DBG` | 오류 분석·Debug·개선 |
| `AI-SEC` | 보안·권한 검토 |
| `AI-QA` | 테스트·예외 시나리오 생성 |
| `AI-DOC` | 의사결정·결과 문서화 |
| `AI-ORCH` | Codex·Antigravity 역할 분담과 연계 |

## LMS 적용 규칙

1. 기존 Task ID와 문구는 유지한다.
2. 추가 Task는 `ADD-DNN-TNN` ID를 사용해 기존 Task와 구분한다.
3. 카드 또는 상세 페이지에 `Task 영역`, `기술 Skill`, `AI 활용 Skill`을 함께 표시한다.
4. 개발자가 AI 사용 전에 자신의 초안 또는 가설을 작성하고, AI 생성 결과가 아니라 직접 수정한 결과·판단 근거·검증 기록을 완료 기준에 포함한다.
5. 각 Day 산출물은 다음 Day의 입력 문서가 되며 동일 프로젝트 폴더에 누적한다.
6. Mission은 기획자와 개발자가 AI Agent 활용 중 발생한 누락·가정·해석 차이·책임 문제를 함께 해결하고 공동 Decision Log를 남기는 과제로 구성한다.

## 공통 프로젝트 문서 체계

```text
/project
├── README.md
├── 01_SERVICE_OVERVIEW.md
├── 02_REQUIREMENTS.md
├── 03_DOMAIN_MAP.md
├── 04_USER_FLOW.md
├── 05_SEQUENCE.md
├── 06_ERD.md
├── 07_API_SPEC.md
├── 08_UI_SPEC.md
├── 09_BUSINESS_RULE.md
├── 10_SECURITY.md
├── 11_TEST_SCENARIO.md
└── 12_RELEASE.md
```
