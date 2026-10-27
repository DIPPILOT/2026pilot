# 미션 3. 문서를 기준으로 AI와 사이트를 구현하라

## 1. 미션 카드

| 항목 | 내용 |
|---|---|
| 목표 | 미션 2의 문서를 구현 계약으로 사용해 대표 사용자 흐름을 완성한다 |
| 권장 시간 | 6~10시간 |
| 배점 | 30점 |
| 입력 | `OPPORTUNITY.md`, `BUSINESS_MODEL.md`, `BASE_ARCHITECTURE.md` |
| 출력 | 실행 가능한 웹사이트, 테스트, README, AI 작업 기록 |
| 완료 신호 | 새 환경에서 실행되고 대표 흐름과 실패 흐름이 검증됨 |

AI가 많은 코드를 만들었다는 사실은 평가 대상이 아닙니다. 문서와 일치하고, 직접 실행해 확인했으며, 문제가 생겼을 때 원인을 설명할 수 있어야 합니다.

## 2. 시작 전 환경 점검

터미널에서 다음 명령을 실행합니다.

```bash
node --version
npm --version
git --version
```

명령을 찾을 수 없으면 다음 공식 문서를 사용합니다.

- [Node.js 다운로드](https://nodejs.org/en/download)
- [Git 설치](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [GitHub 저장소 빠른 시작](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories)

Next.js의 현재 시스템 요구사항과 생성 명령은 [공식 설치 문서](https://nextjs.org/docs/app/getting-started/installation)를 우선합니다. 이 미션의 명령과 공식 문서가 다르면 공식 문서를 따르고 `ADR-###`에 변경 이유를 적습니다.

## 3. 구현 기준선 고정하기

개발 전에 `development/README.md`에 아래 표를 작성합니다.

| 구현 대상 | 연결 ID | 완료 확인 방법 | 상태 |
|---|---|---|---|
| 대표 흐름 시작 화면 | PRD-___ | 첫 화면에서 대상과 CTA 확인 | 예정 |
| 핵심 상호작용 | PRD-___ / BM-___ | 클릭 또는 입력 후 상태 변경 | 예정 |
| 완료 피드백 | PRD-___ | 완료 메시지와 다음 행동 표시 | 예정 |
| 분석 이벤트 | ADR-___ | 개발 로그 또는 테스트로 발생 확인 | 예정 |

이번 미션에서 구현하지 않을 항목도 적습니다. AI가 범위를 임의로 확대하지 못하게 하기 위한 장치입니다.

## 4. Next.js 앱 초기화하기

프로젝트 루트에서 실행합니다. `development/apps/web` 폴더 안에 중요한 파일이 있다면 먼저 백업하고, 비어 있는지 확인합니다.

```bash
npx create-next-app@latest development/apps/web
```

질문이 나오면 다음을 권장합니다.

```text
TypeScript: Yes
Linter: ESLint
Tailwind CSS: Yes
src directory: Yes
App Router: Yes
Import alias: @/*
```

설치 후 실행합니다.

```bash
cd development/apps/web
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 첫 화면이 보이면 설치 성공입니다. 터미널에 오류가 있다면 다음 단계로 넘어가지 않습니다.

## 5. 구현 폴더 확인하기

```text
development/apps/web/
├── public/images/               # 직접 제작했거나 사용 권한이 있는 이미지
└── src/
    ├── app/                     # 페이지, 레이아웃, 메타데이터
    ├── components/common/       # 버튼, 헤더, 상태 UI
    ├── components/sections/     # 서비스 섹션 단위
    ├── lib/                     # 데이터, 검증, 분석 이벤트
    └── styles/                  # 전역 스타일과 토큰
```

폴더가 설계와 달라졌다면 코드를 억지로 옮기기 전에 `BASE_ARCHITECTURE.md`의 ADR을 갱신합니다.

## 6. 세 번의 수직 구현 사이클

각 사이클은 `계획 → AI 요청 → 코드 검토 → 실행 → 테스트 → 기록` 순서로 진행합니다.

### 사이클 1: 가치 이해

완료 조건:

- 사용자가 5초 안에 서비스 대상과 가치를 설명할 수 있습니다.
- 대표 행동으로 가는 CTA가 하나 명확하게 보입니다.
- 모바일 360px에서 제목과 CTA가 잘리지 않습니다.

### 사이클 2: 핵심 행동

완료 조건:

- 사용자가 콘텐츠를 탐색하거나 입력해 상태를 바꿀 수 있습니다.
- 로딩, 빈 결과, 잘못된 입력 중 필요한 상태를 구현합니다.
- 행동 결과가 화면에 즉시 설명됩니다.

### 사이클 3: 완료와 다음 행동

완료 조건:

- 대표 과업의 완료 상태가 명확합니다.
- 재방문, 저장, 공유, 다음 탐색 중 성장 가설과 연결된 행동이 있습니다.
- `primary_flow_complete` 같은 핵심 이벤트가 정의됩니다.

## 7. AI 작업 요청 방식

한 번에 사이트 전체를 요청하지 않습니다. 한 사이클씩 다음 형식을 사용합니다.

```text
역할: Next.js 개발 파트너

목표:
[이번 사이클의 사용자 결과]

반드시 지킬 문서:
- PRD-___: [요약]
- BM-___: [요약]
- ADR-___: [요약]

수정 가능한 경로:
[파일 또는 폴더]

완료 기준:
- [화면에서 확인할 조건]
- [실패 상태]
- [모바일/접근성 조건]
- [테스트 조건]

금지:
- 새 기능 추가
- 원본 브랜드·문구·이미지 복제
- 확인하지 않은 패키지 설치
- 비밀 값이나 실제 개인정보 사용

먼저 작업 계획과 수정 파일을 제안하고, 내가 확인한 뒤 구현해줘.
```

AI가 제안한 명령은 목적과 현재 위치를 확인한 뒤 실행합니다. 파일 삭제, 강제 초기화, 비밀 값 출력 명령은 실행하지 않습니다.

## 8. AI 작업 로그 작성하기

각 작업 후 `reports/AI_BUILD_LOG.md`에 기록합니다.

```markdown
## AI-001 — [작업 제목]
- 일시:
- 연결 ID: PRD-___ / BM-___ / ADR-___
- 사용 도구:
- 요청 목표와 제약:
- 변경 파일:
- 실행한 검증:
- AI 결과의 오류 또는 누락:
- 사람이 직접 수정한 내용:
- 채택하지 않은 제안과 이유:
```

최소 5개의 작업 기록이 있어야 하며, “문제 없음”만 반복해서 쓰면 검증 기록으로 인정하지 않습니다.

## 9. 기능 테스트하기

### 수동 테스트

- [ ] 첫 화면에서 대표 사용자가 누구인지 알 수 있다.
- [ ] CTA를 키보드 `Tab`과 `Enter`로 사용할 수 있다.
- [ ] 핵심 흐름을 새로고침 후 다시 완료할 수 있다.
- [ ] 잘못된 입력 또는 빈 상태에 해결 방법이 표시된다.
- [ ] 360px와 1440px에서 가로 스크롤이 생기지 않는다.
- [ ] 콘솔에 설명하지 못하는 오류가 없다.

### 코드 검사

```bash
npm run lint
npm run build
```

두 명령이 성공해야 합니다. 실패했다면 오류의 첫 원인을 해결한 뒤 다시 실행합니다.

### E2E 테스트 선택 사항

대표 흐름을 자동화하려면 [Playwright 테스트 작성 안내](https://playwright.dev/docs/writing-tests)를 사용합니다. 테스트는 사용자가 보는 역할, 이름, 텍스트를 기준으로 작성하고 내부 클래스명에 의존하지 않습니다.

최소 테스트 시나리오:

```text
Given 사용자가 첫 화면을 연다
When 핵심 CTA를 선택하고 대표 과업을 수행한다
Then 완료 피드백과 다음 행동이 보인다
```

## 10. 접근성·성능 점검하기

Chrome DevTools에서 Lighthouse를 실행합니다. [Lighthouse 공식 안내](https://developer.chrome.com/docs/lighthouse)를 참고합니다.

기록할 항목:

- 측정 일시와 URL
- 모바일 또는 데스크톱 조건
- Performance, Accessibility, Best Practices, SEO 점수
- 가장 큰 문제 3개
- 수정 전·후 결과

점수 100 자체가 목표는 아닙니다. 대표 흐름을 방해하는 문제를 설명하고 개선하는 것이 목표입니다. 접근성 판단에는 [WCAG 2.2 빠른 참조](https://www.w3.org/WAI/WCAG22/quickref/)를 사용합니다.

## 11. 고장 해결 순서

1. 실행한 명령과 현재 폴더를 확인합니다.
2. 오류 메시지의 첫 번째 원인을 읽습니다.
3. 마지막으로 바꾼 파일의 diff를 확인합니다.
4. 최소 재현 절차를 적습니다.
5. AI에는 전체 프로젝트 대신 오류, 관련 파일, 재현 절차를 제공합니다.
6. 수정 후 `lint`, `build`, 대표 흐름을 다시 검증합니다.

AI 질문 예시:

```text
아래 오류의 원인을 먼저 설명해줘. 아직 코드를 바꾸지 마.
재현 명령, 관련 파일, 오류 원문을 기준으로 가능한 원인을 최대 3개로 좁히고,
각 원인을 확인할 가장 작은 진단 방법을 알려줘.
```

## 12. 제출물

- `development/apps/web/` 실행 가능한 소스
- `development/README.md`: 설치, 실행, 검사, 테스트 방법
- 대표 흐름 테스트 또는 재현 가능한 수동 테스트 기록
- `reports/AI_BUILD_LOG.md`: `AI-###` 5건 이상
- Lighthouse 전·후 기록

README에는 최소한 다음 명령이 있어야 합니다.

```bash
npm install
npm run dev
npm run lint
npm run build
```

## 13. 제출 전 자기점검

- [ ] 새 터미널에서 README만 보고 실행할 수 있다.
- [ ] 대표 흐름을 처음부터 끝까지 완료할 수 있다.
- [ ] 실패·빈·완료 상태 중 필요한 상태를 구현했다.
- [ ] 모바일과 키보드로 핵심 기능을 사용할 수 있다.
- [ ] `npm run lint`와 `npm run build`가 성공한다.
- [ ] 코드와 테스트가 PRD/BM/ADR에 연결된다.
- [ ] AI 작업 5건 이상에 사람의 검증과 수정이 기록되었다.
- [ ] 원본 브랜드와 저작물을 복제하지 않았다.

## 14. 미션 3 채점표, 30점

| 평가 요소 | 배점 | 만점 기준 |
|---|---:|---|
| 대표 사용자 흐름 | 10 | 시작·핵심 행동·완료·오류 복구가 안정적으로 동작 |
| 문서 일치 | 6 | 구현과 테스트가 PRD/BM/ADR에 연결되고 변경 이유가 기록됨 |
| 품질 | 6 | 반응형·접근성·성능·오류 상태를 직접 검증하고 개선함 |
| 테스트 | 4 | 핵심 정상·실패 흐름이 자동 또는 재현 가능한 방식으로 검증됨 |
| AI 사용 책임성 | 4 | 작업·오류·사람의 검증·기각 결정이 구체적으로 기록됨 |

세부 성취 수준은 [전체 평가 루브릭](EVALUATION_RUBRIC.md)을 사용합니다.

## 15. 공식 참고 링크

- [Next.js 설치와 시작](https://nextjs.org/docs/app/getting-started/installation)
- [Node.js 다운로드](https://nodejs.org/en/download)
- [Git 설치](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [GitHub 저장소 빠른 시작](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories)
- [Playwright 테스트 작성](https://playwright.dev/docs/writing-tests)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse)
- [Core Web Vitals](https://web.dev/explore/learn-core-web-vitals)
- [WCAG 2.2 빠른 참조](https://www.w3.org/WAI/WCAG22/quickref/)

[이전 미션](MISSION_2_DOCUMENTATION.md) · [학생 안내서](PBL_MISSIONS.md) · [다음 미션](MISSION_4_COMPARISON.md)

