# Day 06. 개발 (AI와 함께 화면 만들기)

<!-- LMS_SYNC:START -->
## LMS 커리큘럼 기준

- **일차:** Day 6
- **LMS 주제:** 프론트엔드 개발과 API 연동
- **문서 역할:** 상세 Task·Mission 수행 가이드
- **강의실·교재 범위:** Frontend & UI Development
- **학습 범위:** 기획·디자인 산출물을 HTML/CSS/JavaScript 화면으로 구현하고, API 데이터 바인딩·오류 처리·리팩토링을 수행한다.

### LMS Task

#### AI Agent 활용 Task
1. Task 1: 화면 초안 빠르게 만들기 (Rapid UI Prototyping)
2. Task 2: 오류 해결 도우미 (AI Debugging Assistant)
3. Task 3: 코드 개선하기 (Code Refactoring & Optimization)

#### Skill Task
4. Skill Task 1 (ADD-D06-T01): 화면–API Binding 구현
5. Skill Task 2 (ADD-D06-T02): 상태 관리와 실패 UX 구현
6. Skill Task 3 (ADD-D06-T03): Front-End Debugging과 Refactoring

### LMS Mission

1. Mission 1: AI와 함께 오류 해결하기 (Interactive Debugging Mission)
2. Mission 2: AI 코드 리뷰 받기 (Automated Code Review Mission)
3. Mission 3 (Skill Mission 1): 리얼타임 웹소켓 채팅 화면-API 바인딩
4. Mission 4 (Skill Mission 2): 핀테크 자산 관리 대시보드 FE Debugging

### 완료 산출물

- 반응형 화면 초안
- 디버깅 결과 보고서
- 리팩토링 코드 및 코드 리뷰 요약

> 이 문서는 `docs/index.html`, Day 6 강의실, 교재 및 Codex 실습 페이지를 통합 기준으로 동기화했습니다. 세부 실습 데이터와 예시는 아래 기존 본문을 사용합니다.
<!-- LMS_SYNC:END -->

개발을 처음 시작할 때 학습자들을 가장 막막하게 만드는 것은 **"빈 화면(blank page)에서 무엇부터 어떻게 코딩해야 할지 모르는 막연함"**입니다. 문법을 배우고 예제를 보았어도, 실제 내가 구상한 화면을 코드로 구현하려고 하면 첫 줄을 적는 것조차 거대한 장벽으로 다가옵니다.

Day 6 과정은 단순히 완성된 코드를 기계적으로 복사하거나 프레임워크를 다루는 기술 습득이 목적이 아닙니다. 대신, **"AI를 유능한 페어 프로그래머(Pair Programmer)로 활용해 빈 화면에서 빠르게 초안을 만들고, 개발 중 마주치는 오류를 스스로 진단·해결하며, 코드를 가독성 있게 정돈하는 일련의 협업 개발 프로세스"**를 경험하는 데 중점을 둡니다.

학습자는 AI의 도움을 받아 기획서 내용을 작동 가능한 화면 초안으로 신속하게 변환하고(Task 01), 오류 메시지를 판독하고 해결책을 찾아가는 디버깅 가이드를 훈련하며(Task 02), 복잡하고 난해한 코드를 깔끔하게 정돈(Task 03)합니다. 또한 가상의 실제 오류 발생 케이스를 AI와 함께 파고들고(Mission 01), 완성된 최종 코드를 다각도에서 리뷰받아 품질을 높이는(Mission 02) 실습을 통해 AI 시대의 똑똑한 소프트웨어 빌더로서 첫발을 내딛게 됩니다.

---

# Task 01. 화면 초안 빠르게 만들기 (Prototype Generation)

## 1. 스토리 및 실습 배경

스타트업의 한 주니어가 예약 관리 시스템을 개발하라는 지시를 받았습니다. 기획서에는 예약 상태별 달력과 리스트 뷰가 화려하게 그려져 있었지만, 로컬 에디터를 열고 빈 HTML 파일을 보니 막막함이 밀려왔습니다. 레이아웃 그리드는 어떻게 짜야 할지, CSS 스타일 파일은 어떻게 분리해야 할지 고민만 하다 하루가 지나갔습니다.

이처럼 처음 개발을 시작할 때 초기 구조 설정(Boilerplate)과 컴포넌트 레이아웃의 뼈대를 직접 그리는 일은 매우 비효율적이며 사기를 떨어뜨립니다. 이번 실습에서는 Codex에게 화면 기획 명세(Figma 레이아웃)를 텍스트로 설명하고, 작동 가능한 반응형 화면 초안과 컴포넌트 코드를 단 몇 초 만에 생성하여 개발의 초도 속도를 폭발적으로 높이는 방법을 학습합니다.

---

## 2. 학습 목표

* AI를 활용하여 요구사항 명세로부터 화면 초안(HTML/CSS)을 자동으로 생성할 수 있다.
* 기획 내용 및 레이아웃 정의서를 실제 브라우저에서 동작하는 화면 구조로 변환할 수 있다.
* 프로젝트의 기본 보일러플레이트 구조를 이해하고 개발의 첫 단계를 신속히 시작할 수 있다.

---

## 3. 실습 미션

학습자는 로컬 프로젝트 폴더 내에 화면 요구사항 기술서인 `day6_layout_spec.md`를 준비하고 Codex Client에 아래 프롬프트를 전송하여 화면 초안 코드를 빌드합니다.

> "제공된 레이아웃 명세를 기반으로, 예약 현황을 볼 수 있는 반응형 대시보드 화면의 HTML 마크업과 CSS 그리드 스타일 초안을 생성해 주세요. 예약 상태를 나타내는 대기/승인/완료 카드 컴포넌트와 좌측 네비게이션 바를 포함한 초기 프로젝트 구조를 제안해 주세요."

---

## 4. 결과물 예시

Codex는 레이아웃 명세를 분석하여 아래와 같은 웹 페이지 구조와 작동 가능한 프로토타입 코드를 도출합니다.

### 1) 프로토타입 화면 구조 (HTML skeleton)
```html
<div class="dashboard-container">
  <aside class="sidebar">
    <nav class="nav-menu">...</nav>
  </aside>
  <main class="content-area">
    <header class="dashboard-header">...</header>
    <section class="stats-grid">
      <div class="card status-pending">대기 12건</div>
      <div class="card status-approved">승인 8건</div>
      <div class="card status-completed">완료 24건</div>
    </section>
    <section class="booking-table">...</section>
  </main>
</div>
```

### 2) CSS 레이아웃 구조 (CSS Grid/Flex)
```css
.dashboard-container {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
```

---

## 5. AI 활용 포인트

* **보일러플레이트 자동 생성**: 개발환경 구성에 지치지 않도록 적합한 기본 HTML 구조와 반응형 CSS Flexbox/Grid 구조 뼈대를 제공합니다.
* **컴포넌트 추상화**: 텍스트 설명 속의 '상태별 요약 카드'나 '테이블 목록' 등의 요소를 클래스 단위 컴포넌트로 규격화해 생성해 줍니다.

---

## 6. 학습 포인트

코딩의 첫 단추를 채울 때 불필요하게 타이핑 속도나 오타로 시간을 낭비하는 대신, AI를 사용해 뼈대를 생성하고 아키텍처 흐름을 파악하는 데 두뇌 자원을 더 집중하는 법을 훈련하는 것이 중요합니다.

---

### 💡 교육 난이도

* **난이도:** ★★☆☆☆ (초급)
* **예상 실습 시간:** 25~35분
* **실무 활용도:** ★★★★★

---

# Task 02. 오류 해결 도우미 (AI Debug Assistant)

## 1. 스토리 및 실습 배경

화면을 띄우고 신나게 API 데이터를 가져오도록 JavaScript 코드를 작성했습니다. 그런데 브라우저 새로고침을 누르자 화면이 하얗게 멈추고 콘솔(Console)창에 `TypeError: Cannot read properties of undefined (reading 'map')`라는 에러 메시지가 붉은색으로 가득 찼습니다. 주니어 개발자는 원인을 몰라 코드만 수십 번 쳐다보고, 구글 검색창에 메시지를 쳐봐도 내 상황과 맞지 않는 영어 답변만 쏟아져 결국 좌절감에 빠졌습니다.

개발의 절반 이상은 오류를 찾아내고 고치는 '디버깅' 과정입니다. 초급자는 에러의 단서인 에러 로그를 읽고 해석하는 능력이 부족해 많은 시간을 낭비합니다. 이번 실습에서는 Codex에게 발생한 오류 현상과 에러 로그, 그리고 실행 코드를 전달하여 문제의 근본적인 발생 지점을 정확히 짚어내고 즉시 고쳐 쓸 수 있는 조치 요령을 처방받는 실습을 진행합니다.

---

## 2. 학습 목표

* 브라우저 콘솔 및 서버 로그의 에러 메시지를 읽고 문제의 유형을 판별할 수 있다.
* 에러가 발생한 원인과 발생 경로(Stack Trace)를 분석하는 논리적 디버깅 습관을 기른다.
* AI가 제안한 오류 분석 보고서를 바탕으로 안전한 방어적 코드(Defensive Coding)를 직접 적용할 수 있다.

---

## 3. 실습 미션

학습자는 실행 시 에러를 유발하는 로컬 코드 `day6_debug_source.js`를 열고 콘솔 에러 로그를 확인한 후, Codex Client에 진단을 의뢰합니다.

> "작성한 코드에서 'TypeError: Cannot read properties of undefined (reading 'map')' 에러가 발생했습니다. 제공된 소스코드 `day6_debug_source.js`와 콘솔 에러 로그를 대조해 에러가 발생한 원인(Why)을 초보자 눈높이에서 설명해 주고, 해당 에러를 완벽히 통제할 수 있는 방어 코드가 가미된 수정 소스를 제시해 주세요."

---

## 4. 결과물 예시

Codex는 에러 로그의 문맥을 읽어 발생 지점과 처방전을 명쾌하게 작성합니다.

### Error Analysis & Solution Report (디버깅 진단서)

#### 1. 에러 발생 원인
* **원인**: `fetch` API 호출 후 서버로부터 데이터를 채 수신하기도 전에, 혹은 네트워크 지연으로 인해 데이터가 빈 값(`undefined`)인 상태에서 즉시 `.map()` 반복 함수를 실행하여 에러가 발생하였습니다.

#### 2. 방어 코드 적용 가이드
* 데이터 배열의 유무를 사전에 안전하게 검증하는 옵셔널 체이닝(`?.`) 패턴이나 빈 배열 대비책(`|| []`)을 결합하여 데이터가 없는 찰나의 순간에도 앱이 크래시(Crash)되지 않도록 통제해야 합니다.

#### 3. 수정 권장 코드
```javascript
// AS-IS: 위험한 직접 접근
const renderList = (data) => {
  return data.map(item => `<li>${item.name}</li>`);
};

// TO-BE: 안전한 방어적 코드 적용
const renderList = (data) => {
  if (!data) return '<p>로딩 중이거나 데이터가 없습니다.</p>';
  return data.map(item => `<li>${item.name}</li>`).join('');
};
```

---

## 5. AI 활용 포인트

* **에러 문맥 분석**: 단순 오타(Syntax) 에러뿐 아니라, 호출 순서나 비동기 실행 타이밍(Asynchronous Flow)으로 발생하는 비정형 런타임 예외 현상의 맥락을 유추해 냅니다.
* **디버깅 과정 가이드**: 단순 해결 코드만 주는 것이 아닌, "왜 이 줄에서 에러가 터졌는가?"에 대한 개념 교육적 해설을 제공합니다.

---

## 6. 학습 포인트

에러 메시지는 개발자를 꾸짖는 경고창이 아니라 문제를 알려주는 가장 친절한 힌트입니다. AI 도우미를 가이드 삼아 에러의 단서를 추적하는 역량을 기르면, 모르는 기술 스택도 빠르게 익혀나갈 수 있습니다.

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (보통)
* **예상 실습 시간:** 30~45분
* **실무 활용도:** ★★★★★

---

# Task 03. 코드 개선하기 (Code Refactoring)

## 1. 스토리 및 실습 배경

우여곡절 끝에 화면도 잘 뜨고 에러도 나지 않는 코드를 완성했습니다. 작동은 잘 되니 모든 게 끝났다고 생각했으나, 팀장님이 코드를 확인하고 한숨을 쉬었습니다. "여기에 쓴 중복 함수들이 너무 많고, 변수명이 무엇을 의미하는지 도무지 모르겠어요. 이대로 배포하면 한 달만 지나도 본인도 고치기 힘든 쓰레기 코드가 될 겁니다."

프로그램이 정상 작동하는 것은 개발의 '최소 요건'일 뿐이며, 코드가 난잡하고 스파게티처럼 꼬여 있다면 비즈니스 확장에 발목을 잡게 됩니다. 이번 실습에서는 Codex에게 작성된 코드를 리뷰받아, 중복된 로직을 재사용 가능한 함수로 묶고, 직관적인 네이밍 규칙(Naming Convention)을 적용하여 가독성과 유지보수성이 극대화된 클린 코드(Clean Code)로 정돈하는 실습을 진행합니다.

---

## 2. 학습 목표

* 동작만 하는 복잡한 코드와 읽기 쉬운 유지보수형 코드의 구조적 차이를 이해할 수 있다.
* 중복되는 기능과 하드코딩된 값들을 추출하여 재사용 구조로 개선할 수 있다.
* AI의 코드 리뷰 제안을 바탕으로 변수/함수 이름을 명확하게 변경하고 리팩토링할 수 있다.

---

## 3. 실습 미션

학습자는 다수의 동일 기능 함수가 얽혀 있는 `day6_dirty_code.js` 파일을 준비하고, Codex Client에 코드 정리와 구조 개선을 요구합니다.

> "제공된 `day6_dirty_code.js` 파일의 소스를 분석하여, 1) 중복된 마크업 바인딩 로직을 공통 유틸 함수로 분리하고, 2) 모호한 변수명(ex: `a`, `temp`, `fn`)을 실무용 단어로 교정하고, 3) 향후 유지보수가 쉽도록 적절한 한 줄 주석을 작성하여 개선된 버전의 클린 코드로 리팩토링해 주세요."

---

## 4. 결과물 예시

Codex는 난잡한 코드의 개선 포인트를 도출하여 다음과 같이 리팩토링된 버전을 반환합니다.

### Refactored Clean Code (개선본)

#### 1. 주요 리팩토링 내역
* **중복 제거**: 예약 카드 정보를 렌더링할 때 반복되던 HTML 조작 코드를 `createCardTemplate` 공통 헬퍼 함수로 통합했습니다.
* **가독성 확보**: 의미를 파악하기 어려웠던 변수 `fn`을 `formatUserPhoneNumber`로, `a`를 `activeReservations`로 정명(Rename) 조치하였습니다.

#### 2. 리팩토링 결과 소스
```javascript
// 1. 숫자로 된 전화번호 포맷 가공 헬퍼 함수
const formatUserPhoneNumber = (phone) => {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

// 2. 예약 상태 카드 HTML 템플릿 생성 공통 유틸
const createCardTemplate = (reservation) => {
  const formattedPhone = formatUserPhoneNumber(reservation.phone);
  return `
    <article class="reservation-card" data-id="${reservation.id}">
      <h3>${reservation.userName}</h3>
      <p>연락처: ${formattedPhone}</p>
      <span class="status-tag">${reservation.status}</span>
    </article>
  `;
};
```

---

## 5. AI 활용 포인트

* **코드 스멜(Code Smell) 감지**: 가독성이 떨어지는 긴 메서드, 중복된 분기문, 부적절한 매개변수 구조를 찾아냅니다.
* **주석 자동 생성**: 핵심 알고리즘이나 상태 판단 구문에 복잡한 설명 대신 타 개발자가 한눈에 파악할 수 있는 요약 주석을 추가합니다.

---

## 6. 학습 포인트

동작하는 코드를 만드는 것보다 중요한 것은 **"내일의 내가 쉽게 읽고 고칠 수 있는 코드를 만드는 것"**입니다. AI 비서의 코드 오디팅 의견을 적극적으로 수용하며 점진적으로 코드의 완성도를 조율하는 프로페셔널한 태도를 배웁니다.

---

### 💡 교육 난이도

* **난이도:** ★★☆☆☆ (초급)
* **예상 실습 시간:** 20~30분
* **실무 활용도:** ★★★★★

---

# Mission 01. AI와 함께 오류 해결하기 (Error Troubleshooting Session)

## 1. 미션 개요

화면 프로토타입 작성 후 API 데이터 fetch 기능을 구현하여 가상의 서버 연동을 테스트하던 도중 예기치 못한 에러가 연쇄적으로 발생하였습니다. 해당 에러에 대해 Codex의 진단 처방을 받아 에러 요인을 추적하고, 최종적으로 안정적으로 구동되는 결과물을 입증합니다.

---

## 2. 세부 수행 과제

1. **상황 로그 수집**: 브라우저 개발자 도구의 콘솔 창에서 붉은 에러 문장(예: `CORS policy`, `SyntaxError: Unexpected token < in JSON`)을 그대로 복사하여 텍스트로 보관합니다.
2. **원인 규명 챗**: Codex Client에 수집한 에러 문장과 내 원본 코드를 넘겨주어 문제의 구조적 인과관계를 설명하도록 유도합니다.
3. **패치 코드 적용**: AI가 원인을 진단하고 제안한 수정 지침을 로컬 소스에 수동으로 수정해 적용합니다.
4. **학습 노트 정리**: 오류 분석 보고서 양식에 발생 배경, 해결법, 유사 문제 방재안을 정리하여 `day6_error_report.md` 파일로 저장합니다.

---

## 3. 결과물 양식 (`day6_error_report.md`)

```markdown
# [Day 6] AI 디버깅 결과 보고서

## 1. 문제 상황
- **발생 오류:** `SyntaxError: Unexpected token < in JSON at position 0`
- **발생 시점:** 목록 새로고침 시 API Response 데이터를 파싱하는 구문

## 2. 근본적 오류 원인 (Why)
- 서버 측 엔드포인트 URL 경로에 오타가 생겨 404 HTML 에러 페이지가 반환되었는데, 클라이언트가 이를 정상적인 JSON 데이터 형식으로 오인하여 `JSON.parse`를 수행하려 하다가 HTML의 시작 문자인 `<`를 파싱하려 해 발생한 현상입니다.

## 3. 조치 내용 & 수정 코드
- 서버 호출 URL을 `/api/reservations`로 올바르게 교정하고, Response의 `content-type` 헤더가 json인지 사전에 검사하는 조건식을 삽입했습니다.
```

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (보통)
* **예상 실습 시간:** 30~45분
* **실무 활용도:** ★★★★★

---

# Mission 02. AI 코드 리뷰 받기 (AI-Assisted Code Quality Review)

## 1. 미션 개요

학습자가 대시보드 예약 제어 로직을 구현하며 다소 두서없이 임시로 적었던 최종 소스코드를 Codex에게 전문 코드 검토관(Code Reviewer) 자격으로 전체 감사(Audit)를 받도록 요청하고, 지적받은 개선 권고를 수정 코드에 완전히 수렴하여 고품질의 코드 리팩토링 버전을 제출합니다.

---

## 2. 세부 수행 과제

1. **코드 피드백 요청**: 직접 작성하여 작동에 성공한 소스 코드를 Codex에 전송하며 "읽기 쉬운가?", "변수명이 타인에게 직관적인가?", "하드코딩이나 중복 코드는 없는가?" 등의 다면 평가를 요청합니다.
2. **리뷰 분석**: Codex가 제공하는 구조 개선 지적(ex: 복잡한 삼항 연산자를 간소화하고 전역 변수 오염을 최소화하라는 권고)을 분석합니다.
3. **코드 고도화**: 지적사항에 근거하여 코드를 최종 업데이트하고 버그 가능성을 미리 방지하는 안정적이고 우아한 버전을 완성합니다.
4. **리뷰 노트 저장**: 지적받은 코드 스멜과 개선된 최종 버전을 `day6_code_review.md` 파일로 보관합니다.

---

## 3. 결과물 양식 (`day6_code_review.md`)

```markdown
# [Day 6] AI 코드 리뷰 피드백 & 리팩토링 요약

## 1. 코드 리뷰어 피드백 (주요 지적사항)
- **전역 변수 남용**: 예약 카운트 상태를 전역 객체 변수로 무분별하게 참조하여 다른 모듈에서 임의 훼손할 위험이 큼.
- **반복 분기문**: `if (status === 'wait') ... else if` 형태가 난립해 신규 상태 코드가 늘어날 때 확장하기 불리함.

## 2. 최종 개선 코드
- 전역 오염을 최소화하기 위해 즉시실행함수(IIFE) 또는 예약 상태 관리 객체 모듈 구조로 캡슐화 처리하고, 상태 처리는 객체 매핑 맵(Map) 형식으로 전환.
```

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (보통)
* **예상 실습 시간:** 30~40분
---

# Mission 3 (Skill Mission 1). 리얼타임 웹소켓 채팅 화면-API 바인딩

## 1. 개요 및 배경
실시간 멀티룸 채팅 애플리케이션의 프론트엔드 UI를 WebSocket/REST API 규격과 바인딩하고, 재연결 및 재시도 UX를 구현합니다.

## 2. 입력 데이터
* `chat-api-contract.md` (채팅 메시지 및 방 생성 API 스펙)
* `chat-ui-prototype.html` (채팅 목록 및 대화창 UI 프론트엔드 코드)

## 3. 작성 산출물
* `chat-binding-app.html` (동작하는 WebSocket/REST 채팅 웹 앱 코드)

## 4. 프롬프트 예시
```text
[역할]: Senior Front-End Engineer
[프로젝트]: 실시간 멀티룸 채팅 웹 앱
[미션]:
1. chat-ui-prototype.html에 REST API 바인딩 및 WebSocket 연결/해제 인터랙션을 구현하세요.
2. 소켓 단절 시 3초 간격 자동 재연결(Reconnection) 토스트 피드백 UI를 추가하세요.
```

---

# Mission 4 (Skill Mission 2). 핀테크 자산 관리 대시보드 FE Debugging & Refactoring

## 1. 개요 및 배경
핀테크 대시보드 웹 앱의 메모리 누수, 무한 랜더링 루프, 콘솔 오류를 디버깅하고 6대 실패 UX 상태를 보완하는 리팩토링을 수행합니다.

## 2. 입력 데이터
* `asset-dashboard.js` (성능 병목 및 콘솔 오류가 포함된 소스 코드)
* `error-ux-guide.md` (6대 실패 UX 가이드라인)

## 3. 작성 산출물
* `asset-dashboard-refactored.js` (리팩토링 코드 및 디버깅 판정 보고서)

## 4. 프롬프트 예시
```text
[역할]: Front-End Performance & QA Specialist
[프로젝트]: 핀테크 자산 통합 관리 대시보드
[미션]:
1. asset-dashboard.js에서 무한 루프 및 전역 변수 오염 원인을 디버깅하고 수정된 코드를 제시하세요.
2. Loading, Timeout, Server Error 6대 실패 상태 복구 버튼 동작을 구현하세요.
```

<!-- ADDITIONAL_SKILL_TASKS:START -->
---

# Day 6 추가 Skill Task — Front-End & Domain API Integration

> 아래 Task는 기존 Day 6 Task와 Mission을 대체하지 않습니다. 기존 실습을 완료한 뒤 AI-Native SW Engineering 역량을 확장하기 위한 추가 과정입니다.

## 추가 Task 운영 원칙

1. 기존 프로젝트 산출물을 입력 Context로 재사용합니다.
2. 기술 Skill과 AI 활용 Skill을 별도로 평가합니다.
3. AI가 생성한 결과보다 학습자가 검증하고 판단한 근거를 평가합니다.
4. 모든 결과를 Markdown 또는 실행 가능한 코드·다이어그램으로 남깁니다.

## ADD-D06-T01 — 화면–API Binding 구현

### 1. Task 목표

Viewer Flow 또는 Advertiser Flow의 화면을 실제 API Contract와 연결한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `TECH` |
| 기술 Skill | `TECH-FE` `TECH-API` |
| AI 활용 Skill | `AI-CTX` `AI-GEN` `AI-ORCH` |
| AI 역할 | Pair Programmer |

### 3. 입력 및 제출 산출물

- **입력 Context:** UI Prototype, API Contract, Test Data
- **제출 산출물:** `Front-End Source`, `11_TEST_SCENARIO.md`
- **통합 결과:** 동작하는 Viewer 또는 Advertiser Flow, 상태 처리, Front-End Review

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `Pair Programmer` 역할을 부여합니다.
3. Viewer Flow 또는 Advertiser Flow의 화면을 실제 API Contract와 연결한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-FE TECH-API)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 Pair Programmer입니다.

[프로젝트 Context]
UI Prototype, API Contract, Test Data

[수행 Task]
Viewer Flow 또는 Advertiser Flow의 화면을 실제 API Contract와 연결한다.

[AI 활용 요구]
Codex는 데이터 흐름·코드 초안, Antigravity는 Component·Interaction 구현을 담당하도록 Context와 역할을 분리한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 선택한 Flow가 Mock 또는 실제 API로 시작부터 완료까지 동작한다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 30~40분
- 검증·문서화·공유: 15분

---

## ADD-D06-T02 — 상태 관리와 실패 UX 구현

### 1. Task 목표

Loading, Empty, Validation, Unauthorized, Timeout, Server Error 상태를 구현한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `HYBRID` |
| 기술 Skill | `TECH-FE` `TECH-QA` |
| AI 활용 Skill | `AI-GEN` `AI-DBG` `AI-QA` |
| AI 역할 | Pair Programmer |

### 3. 입력 및 제출 산출물

- **입력 Context:** UI Prototype, API Contract, Test Data
- **제출 산출물:** `Front-End Source`, `11_TEST_SCENARIO.md`
- **통합 결과:** 동작하는 Viewer 또는 Advertiser Flow, 상태 처리, Front-End Review

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `Pair Programmer` 역할을 부여합니다.
3. Loading, Empty, Validation, Unauthorized, Timeout, Server Error 상태를 구현한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-FE TECH-QA)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 Pair Programmer입니다.

[프로젝트 Context]
UI Prototype, API Contract, Test Data

[수행 Task]
Loading, Empty, Validation, Unauthorized, Timeout, Server Error 상태를 구현한다.

[AI 활용 요구]
AI에게 E2E 실패 Scenario를 생성하게 하고 각 상태가 사용자에게 복구 행동을 제공하는지 검증한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 최소 6개 상태와 재시도·수정·로그인 등 복구 동작이 확인된다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 40~50분
- 검증·문서화·공유: 15분

---

## ADD-D06-T03 — Front-End Debugging과 Refactoring

### 1. Task 목표

콘솔 오류, 중복 코드, 전역 상태 오염, 접근성·성능 문제를 찾아 개선한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `AI` |
| 기술 Skill | `TECH-FE` `TECH-QA` |
| AI 활용 Skill | `AI-DBG` `AI-REV` `AI-DOC` |
| AI 역할 | Pair Programmer |

### 3. 입력 및 제출 산출물

- **입력 Context:** UI Prototype, API Contract, Test Data
- **제출 산출물:** `Front-End Source`, `11_TEST_SCENARIO.md`
- **통합 결과:** 동작하는 Viewer 또는 Advertiser Flow, 상태 처리, Front-End Review

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `Pair Programmer` 역할을 부여합니다.
3. 콘솔 오류, 중복 코드, 전역 상태 오염, 접근성·성능 문제를 찾아 개선한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-FE TECH-QA)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 Pair Programmer입니다.

[프로젝트 Context]
UI Prototype, API Contract, Test Data

[수행 Task]
콘솔 오류, 중복 코드, 전역 상태 오염, 접근성·성능 문제를 찾아 개선한다.

[AI 활용 요구]
AI에게 코드 Reviewer 역할을 부여하되 제안별 수용·수정·거절 근거를 기록한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 오류 재현, 원인, 패치, 회귀 테스트, Review Decision이 남는다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 30~40분
- 검증·문서화·공유: 15분
<!-- ADDITIONAL_SKILL_TASKS:END -->
