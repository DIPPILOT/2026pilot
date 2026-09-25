# Day 07. 개발 (AI와 함께 기능 완성하기)

<!-- LMS_SYNC:START -->
## LMS 커리큘럼 기준

- **일차:** Day 7
- **LMS 주제:** 기능 연결과 사용자 시나리오 완성
- **문서 역할:** 상세 Task·Mission 수행 가이드
- **강의실·교재 범위:** Backend Logic & Data Integration
- **학습 범위:** 정적 화면에 이벤트와 저장소를 연결하고, 상태 복원·중복 제출 방지·E2E 시나리오로 기능 완성도를 검증한다.

### LMS Task

#### AI Agent 활용 Task
1. Task 1: 기능 연결하기 (Feature Integration)
2. Task 2: 사용자 시나리오 검증하기 (User Scenario Validation)
3. Task 3: 기능 오류 찾기 (Edge Case & Logic Error Audit)

#### Skill Task
4. Skill Task 1 (ADD-D07-T01): Business Rule 명세
5. Skill Task 2 (ADD-D07-T02): Domain Service와 Repository 구현
6. Skill Task 3 (ADD-D07-T03): Transaction·Validation·Exception 검증

### LMS Mission

1. Mission 1: AI와 함께 서비스 완성도 점검 (Service Quality Check)
2. Mission 2: 처음부터 끝까지 사용해보기 (End-to-End User Flow Test)
3. Mission 3 (Skill Mission 1): e-Commerce 주문-결제 Domain Business Rule 구현
4. Mission 4 (Skill Mission 2): 핀테크 이상 금융 거래(FDS) Exception & Validation Audit

### 완료 산출물

- 기능 연결 화면
- 검증 및 예외 처리 코드
- 서비스 품질·E2E 검증 보고서

> 이 문서는 `docs/index.html`, Day 7 강의실, 교재 및 Codex 실습 페이지를 통합 기준으로 동기화했습니다. 세부 실습 데이터와 예시는 아래 기존 본문을 사용합니다.
<!-- LMS_SYNC:END -->

웹 서비스 개발에서 가장 역동적인 순간은 정적인 화면에 생명령을 불어넣는 **"기능 구현 및 연동 단계"**입니다. Day 6 세션에서 HTML과 CSS를 활용해 브라우저에 대시보드와 카드의 형태를 그리는 데 성공했다면, Day 7 세션은 사용자가 예약 버튼을 누르고 데이터를 입력했을 때 시스템이 알맞게 반응하도록 기능을 유기적으로 연결하는 법을 배우는 과정입니다.

초급자 교육과정에서 백엔드 데이터베이스 통신이나 서버 API 아키텍처를 처음부터 끝까지 가르치는 것은 자칫 학업 흥미를 떨어뜨리는 장벽이 될 수 있습니다. 따라서 Day 7 과정은 **"버튼 클릭부터 성공 피드백까지 실제 서비스가 작동하는 통합적 흐름"**을 중심으로 진행됩니다. 즉, "화면을 그린다(Day 6)"에서 한 걸음 나아가 **"화면이 사용자의 행동에 맞춰 살아 숨 쉬게 만든다(Day 7)"**는 개념입니다.

참가자는 Codex AI를 유능한 기능 조력자 및 검증 파트너로 활용하여 정적 요소를 이벤트와 연결하고(Task 01), 사용자의 입장에서 가상의 가입·예약 신청 동선을 검증하며(Task 02), 복잡한 상태 천이 조건 속에서 숨어 있는 로직 결함(오류)을 선제 차단(Task 03)합니다. 이에 더해 AI 코치에게 전반적인 서비스 품질 체크를 의뢰하고(Mission 01), 실제 사용자의 행동 패턴을 모사해 시나리오를 끝까지 추적 및 개선(Mission 02)하는 워크플로우를 실습하게 됩니다.

---

# Task 01. 기능 연결하기 (Feature Integration)

## 1. 스토리 및 실습 배경

한 주니어 기획자가 로그인 화면과 예약 목록 화면 프로토타입을 완성했습니다. 하지만 회의 때 대표님이 로그인 버튼을 누르자 아무 반응도 일어나지 않고 정적 화면만 덩그러니 유지되었습니다. "화면은 예쁜데, 클릭하면 다음으로 넘어가지 않네요. 실제 예약 데이터가 저장되고 회원 정보가 세션에 기록되는 흐름은 언제 연결되나요?"라는 피드백을 듣고, 화면 구성과 데이터 제어 로직을 엮는 연동 작업이 시급하다는 것을 깨달았습니다.

이번 실습에서는 Codex AI를 활용하여 정적인 로그인 폼과 예약 등록 카드 컴포넌트에 이벤트 리스너(Click, Submit Event)를 달고, 데이터 저장소(Local Storage 등) 및 가상 API 함수 호출을 유기적으로 엮어 화면이 클릭 반응 및 데이터 적재 동작을 정상적으로 수행하도록 연결하는 방법을 학습합니다.

---

## 2. 학습 목표

* HTML 엘리먼트와 JavaScript 이벤트(Event Listener)를 적절히 연결할 수 있다.
* 사용자가 입력 폼에 기재한 데이터를 수집하여 가상 API 또는 스토리지에 적재할 수 있다.
* AI의 제안을 참고하여 기능 연결 중 누락되거나 빠진 예외 이벤트 처리 단계를 자가 보완할 수 있다.

---

## 3. 실습 미션

학습자는 동작하지 않는 정적 UI 컴포넌트 코드인 `day7_unconnected_feature.html`를 로컬에 마련하고, Codex Client에게 로직 완성을 의뢰합니다.

> "제공된 `day7_unconnected_feature.html`의 회원가입 화면 코드에 JavaScript 기능을 연결하려고 합니다. 1) 가입 완료 버튼 클릭 시 입력값 유효성을 검사하고, 2) 브라우저 로컬 스토리지에 정보를 저장하며, 3) 성공 시 대시보드 화면으로 이동하는 연동 스크립트를 작성해 주세요. 누락된 취소 버튼 반응이나 중복 가입 체크 로직도 함께 제안해 주세요."

---

## 4. 결과물 예시

Codex는 입력 폼 정보 추출 및 스토리지 동기화 흐름이 담긴 JavaScript 로직을 빌드합니다.

### 1) 이벤트 연결 스크립트 (JavaScript Interaction)
```javascript
// 회원가입 폼 전송 이벤트 연결
document.getElementById('signup-form').addEventListener('submit', function(event) {
  event.preventDefault(); // 기본 폼 전송 액션 차단
  
  const email = document.getElementById('user-email').value.trim();
  const nickname = document.getElementById('user-nickname').value.trim();
  
  // 1. 단순 유효성 검사 (Validation)
  if (!email || !nickname) {
    alert('이메일과 닉네임을 모두 입력해 주세요.');
    return;
  }
  
  // 2. 로컬 스토리지 데이터 적재 (Save to LocalStorage)
  const userData = { email, nickname, status: 'active', createdAt: new Date().toISOString() };
  localStorage.setItem('currentUser', JSON.stringify(userData));
  
  // 3. 페이지 전환 피드백
  alert('회원가입이 완료되었습니다!');
  window.location.href = '../day6/day6-ai-classroom.html';
});
```

---

## 5. AI 활용 포인트

* **동작 흐름 가이드**: 화면 단추가 눌렸을 때 브라우저 백그라운드에서 일어나는 상태 변경 단계를 순차적 알고리즘으로 도출합니다.
* **보조 분기 감지**: 가입 성공 처리뿐 아니라, 사용자가 실수로 빈 칸을 남겨둔 채 제출 버튼을 연타하는 경우 등의 '유효성 체크' 구문을 선제 제안합니다.

---

## 6. 학습 포인트

코딩을 처음 배우는 시점에는 복잡한 백엔드 API 연동을 하기에 앞서, 브라우저가 제공하는 `localStorage`나 메모리 변수를 제어해 보는 것이 로직 구성력을 다지는 데 아주 효과적입니다. AI 비서의 순서 처방에 따라 한 단계씩 이벤트 리스너를 조립해 가는 경험을 쌓습니다.

---

### 💡 교육 난이도

* **난이도:** ★★☆☆☆ (초급)
* **예상 실습 시간:** 25~35분
* **실무 활용도:** ★★★★★

---

# Task 02. 사용자 시나리오 검증하기 (User Scenario Review)

## 1. 스토리 및 실습 배경

개발팀에서 예약 상세 생성 기능을 완벽하게 만들었다고 배포했습니다. 그런데 베타테스터 한 분이 예약을 하려고 상세 예약을 고른 다음, 예약 확정 전에 담당 전문가의 평점을 다시 조회하기 위해 '뒤로 가기'를 눌렀습니다. 그러자 방금 전 입력했던 예약 슬롯 날짜 정보가 전부 공백으로 리셋되어 버려 사용자는 화가 나 앱을 종료했습니다.

개발자 입장에서는 데이터베이스에 예약 데이터를 저장하는 개별 함수가 잘 돈다고 생각했지만, 실제 사용자가 앱을 이용해 가입부터 전문가 검색, 시간 예약, 결제까지 하나의 긴 시나리오(User Journey Flow)를 타고 흐를 때는 이처럼 정보의 누락이나 학습 흐름의 붕괴가 자주 일어납니다. 이번 실습에서는 Codex AI를 활용하여 시나리오의 처음과 끝에 걸친 전 기능 흐름을 한 호흡으로 전수 추적하고, 동선 흐름상의 단절 구간을 찾아내 교정하는 방법을 실습합니다.

---

## 2. 학습 목표

* 단편적인 기능 단위 테스트를 넘어, 사용자의 여정(Scenario Flow)을 입체적으로 바라볼 수 있다.
* 연속된 기능 호출 구조 내에서 이전 상태 값이 어떻게 유지되고 소실되는지 흐름을 진단할 수 있다.
* AI 가이드를 활용하여 시나리오 점검 시 누락하기 쉬운 필수 확인 목록을 정형화할 수 있다.

---

## 3. 실습 미션

학습자는 회원 여정 시나리오 스펙을 명시한 `day7_user_flow.md`를 기재하고, Codex Client에게 전체적인 연결 검증을 요구합니다.

> "제공된 `day7_user_flow.md` 명세(가입 ➔ 전문가 검색 ➔ 상세 예약 ➔ 가상 결제)의 단계별 호출 순서를 분석하여, 사용자가 이 동선을 탈 때 정보 유실이 일어나기 가장 쉬운 2가지 핵심 구간을 진단하고, 이를 방지하기 위한 상태 보존 로직 구조를 대안 코드로 제안해 주세요."

---

## 4. 결과물 예시

Codex는 시나리오 분석을 토대로 취약 지점과 TO-BE 보완 패턴을 반환합니다.

### User Flow Vulnerability Review (사용자 흐름 진단서)

#### 1. 취약 지점 1: 전문가 목록 회귀 시 필터 리셋
- **현상**: 상세 페이지 진입 후 목록으로 리턴 시 기존에 설정한 필터 카테고리 정보가 초기화되어 사용자의 재검색 피로도 유발.
- **해결책**: `sessionStorage`에 임시 상태값을 백업하여 뒤로가기 시 복원하도록 개선.

#### 2. 상태 유지 제안 코드
```javascript
// 상세 페이지 이동 전 필터 설정 백업
function saveFilterState(filter) {
  sessionStorage.setItem('last_filter', JSON.stringify(filter));
}

// 목록 로딩 시 필터 복원
function restoreFilterState() {
  const saved = sessionStorage.getItem('last_filter');
  return saved ? JSON.parse(saved) : { category: 'all', rating: 0 };
}
```

---

## 5. AI 활용 포인트

* **시나리오 갭 식별**: 단일 소스만 보고서는 알아채지 못하는 다중 화면 스펙 간의 데이터 이동 병목과 복원 요소를 도출합니다.
* **사용자 경험 위협 요소 매핑**: "개발적으로 완벽한 로직" 뒤에 숨은 "사용자를 피곤하게 만드는 절차"를 AI가 제3자의 시선으로 지적합니다.

---

## 6. 학습 포인트

단순히 에러가 나지 않는 것이 기능 완성의 끝이 아닙니다. 실제 사용자의 이동 동선에 맞추어 상태가 안전하게 유입되고 흘러가는지 전체적 컨텍스트를 고려하는 시야를 넓힙니다.

---

### 💡 교육 난이도

* **난이도:** ★★☆☆☆ (초급)
* **예상 실습 시간:** 30~40분
* **실무 활용도:** ★★★★★

---

# Task 03. 기능 오류 찾기 (Feature Validation)

## 1. 스토리 및 실습 배경

결제 기능 연결까지 마친 예약 앱 배포 당일 밤, 경보가 울렸습니다. 데이터베이스 예약 목록에 동일인이 동일 시간대로 중복 예약되어 서버 에러가 빗발치고 있었습니다. 소스코드를 열어보니 예약 등록 함수는 정직하게 동작했으나, 성격 급한 고객이 결제 확인 페이지에서 '예약 확정' 버튼을 따닥- 두 번 연속 클릭(Double Click)하자, 중복 제출을 예방하는 락(Lock) 장치가 없어 디비에 중복 데이터가 삽입된 것이 원인이었습니다.

개발 완료 버튼을 눌렀다 하더라도, 비정상적이거나 예외적인 동작이 개입하면 기능은 순식간에 망가집니다. 이번 실습에서는 Codex AI를 오디터로 기용하여, 작성 완료한 예약 및 로그인 처리 함수 파일 `day7_feature_validation.js`를 대상으로 중복 클릭, 특수문자 삽입, 비정상 세션 만료 등의 이상 징후 상황을 전제로 모의 테스트를 실시하고 결함 유발 가능 지점의 차단 요령을 제공받습니다.

---

## 2. 학습 목표

* 올바른 데이터 입력 시나리오 외에 이상 징후(예외 상황)로 유발되는 기능 결함을 예단할 수 있다.
* 동일 데이터 중복 진입 방지(Debounce/Throttle) 및 입력값 차단 가드 코드를 설명할 수 있다.
* AI의 취약점 분석 결과를 활용하여 오류를 선제 방어하는 튼튼한 로직을 작성할 수 있다.

---

## 3. 실습 미션

학습자는 오류 취약점을 내장하고 있는 `day7_feature_validation.js` 파일을 열어 확인한 후, Codex Client에 진단을 의뢰합니다.

> "제공된 `day7_feature_validation.js` 파일 내의 예약 신청 로직을 검토해 주세요. 1) 예약 요청의 중복 유입(버튼 연타) 취약점, 2) 예약 일자의 과거 시점 신청 에러 가능성을 검출하고, 이를 방어하기 위해 비활성화(Disabled state) 처리와 날짜 유효 기간 대조문이 추가된 최종 검증 코드를 제안해 주세요."

---

## 4. 결과물 예시

Codex는 취약한 로직의 결함을 짚어내고 디버깅 락 장치가 가미된 완성본을 반환합니다.

### 1) 중복 유입 차단 및 시간 비교 개선 코드
```javascript
// AS-IS: 연속 호출 시 중복 생성되는 코드
// TO-BE: 로딩 락(Lock) 변수 도입 및 과거일자 필터링 적용
let isSubmitting = false;

function requestReservation(bookingData) {
  if (isSubmitting) {
    console.warn("현재 예약 처리 중입니다.");
    return;
  }
  
  const today = new Date().setHours(0, 0, 0, 0);
  const targetDate = new Date(bookingData.date).setHours(0, 0, 0, 0);
  
  if (targetDate < today) {
    alert("과거 일자로는 예약을 진행할 수 없습니다.");
    return;
  }
  
  isSubmitting = true; // 락 설정
  document.getElementById('confirm-btn').disabled = true; // 버튼 비활성화
  
  // 가상의 서버 통신 시뮬레이션
  setTimeout(() => {
    console.log("예약 완료:", bookingData);
    isSubmitting = false; // 락 해제
    document.getElementById('confirm-btn').disabled = false;
  }, 2000);
}
```

---

## 5. AI 활용 포인트

* **이상 조작(Abuse) 예측**: 정상 데이터 통로가 아닌 사용자 행동(연타, 빈 입력, 잘못된 형식)이 유도할 스크립트 충돌 지점을 추정해 줍니다.
* **유효성 정책 설계**: 과거 시각 차단 등 비즈니스 논리 상 당연히 차단해야 할 논리 구조(Logic Boundary)를 미리 점검해 작성해 줍니다.

---

## 6. 학습 포인트

좋은 애플리케이션은 단순히 기능이 도는 앱이 아니라, 사용자가 어떤 잘못된 조작을 하더라도 에러를 뿜으며 깨지지 않는 견고한 앱입니다. AI와 함께 예외 바운더리를 설정하는 훈련을 통해 안정적인 기능 빌드 철학을 배웁니다.

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (보통)
* **예상 실습 시간:** 30~45분
* **실무 활용도:** ★★★★★

---

# Mission 01. AI와 함께 서비스 완성도 점검하기 (Usability & Quality Review)

## 1. 미션 개요

대시보드와 가입, 예약 연동 로직의 기본적인 조립을 마치고, 작동 상의 누락 구간이나 디테일한 입력 장벽이 남았는지 Codex를 '서비스 QA 파트너' 삼아 다차원 완성도 감사를 요청하고 종합 보완 지침을 획득합니다.

---

## 2. 세부 수행 과제

1. **로컬 소스 스펙 준비**: 자신이 작성한 이벤트 스크립트(`day7_feature_validation.js` 등)를 한곳에 로드합니다.
2. **품질 오디팅 위임**: Codex Client에 코드 전량과 화면 이동 흐름을 기재한 뒤 종합 품질 감사를 전송합니다.
3. **가상 평가 피드백 분석**: AI가 지적한 경고 사항들(가령, 로딩 피드백(Spinner) 누락, 취소 모달 내 정보 확인 절차 생략 등)을 수렴합니다.
4. **점검 리포트 저장**: 수집된 감사의 지적 사항과 우선순위를 포함하여 `day7_service_audit.md` 리포트 파일로 빌드합니다.

---

## 3. 결과물 양식 (`day7_service_audit.md`)

```markdown
# [Day 7] AI 서비스 완성도 점검 보고서

## 1. 종합 완성도 진단 결과
- **완성도 스코어:** 85%
- **총평:** 입력 양식과 스토리지 저장은 훌륭하나, 사용자가 대기 시간이 긴 연산 수행 시 브라우저가 아무 응답을 주지 않아 통신이 멎었다고 오인할 확률이 큼.

## 2. 주요 개선점 및 우선순위
1. **[우선순위: 상]** 예약 신청 전송 시 '로딩 중(Spinner)' 표시 추가로 화면 굳음 착각 방지.
2. **[우선순위: 중]** 로컬 스토리지 한계 용량 초과 시 예외 처리 구문(`try-catch`) 추가.
3. **[우선순위: 하]** 가입 축하 문구 애니메이션 가미로 심리적 보상 강화.
```

---

### 💡 교육 난이도

* **난이도:** ★★★☆☆ (보통)
* **예상 실습 시간:** 30~45분
* **실무 활용도:** ★★★★★

---

# Mission 02. 처음부터 끝까지 사용해보기 (End-to-End Walkthrough Scenario)

## 1. 미션 개요

실제 고객이 앱스토어에서 앱을 받아 최초로 서비스를 열고 최종 예약을 마무리 짓기까지의 단절 없는 시나리오(End-to-End)를 Codex의 페르소나와 챗 형식으로 시뮬레이션하면서, 끊김 없이 흐르는 무결점 서비스를 최종 입증합니다.

---

## 2. 세부 수행 과제

1. **종합 시나리오 정의**: 가입 ➔ 프로필 보기 ➔ 슬롯 예약 ➔ 로컬 저장 확인 ➔ 결과 확인 페이지 회귀까지 전체 유저 시나리오를 구성합니다.
2. **E2E 챗 테스트 수행**: Codex에게 "가장 디지털 도구 사용이 낯선 신규 사용자 페르소나"를 부여하고 가상의 전 경로 이용 테스트 롤플레잉을 진행하여 반응을 채집합니다.
3. **병목 해결책 적용**: AI 사용자가 당혹감을 느낀 지점(예: "뒤로 가기 누르면 예약자가 사라져요")의 상태 전송 가드 로직을 확인해 소스코드에 삽입합니다.
4. **E2E 검증서 저장**: 검증 로그와 TO-BE 상태 전환 매트릭스를 `day7_e2e_validation.md` 파일로 제출합니다.

---

## 3. 결과물 양식 (`day7_e2e_validation.md`)

```markdown
# [Day 7] E2E 유저 시나리오 종합 검증 결과서

## 1. 검증 시나리오 개요
- **타겟 유저 페르소나:** 스마트폰 예약 결제가 서툰 50대 초보 자영업자
- **여정 범위:** 회원가입 ➔ 전문가 목록 필터 검색 ➔ 예약 양식 작성 ➔ 로컬스토리지 보존 확인

## 2. 구간별 검증 결과 목록
- **가입 단계:** 이메일 오타 체크 에러 가드 작동 확인 (OK)
- **필터링 단계:** 뒤로 가기 시 카테고리 설정값 소실 발견 (NG ➔ SessionStorage 캐싱 조치 완료)
- **예약 단계:** 예약 확정 시 로딩 스피너 및 중복 연타 락(disabled) 정상 가동 (OK)
```

---

# Mission 3 (Skill Mission 1). e-Commerce 주문-결제 Domain Business Rule 구현

## 1. 개요 및 배경
e-Commerce 주문 및 결제 도메인의 재고 차감, 할인 쿠폰 중복 적용, 포인트 한도, 결제 실패 시 자동 취소/복구 등 최소 10개 핵심 Business Rule을 명세하고 Domain Service로 구현합니다.

## 2. 입력 데이터
* `order-domain-spec.md` (주문/결제 도메인 요구사항)
* `order-erd-schema.sql` (주문/결제 ERD 및 데이터베이스 테이블)

## 3. 작성 산출물
* `09_BUSINESS_RULE.md` (Business Rule 명세서 및 예외 규칙)
* `OrderDomainService.js` (Domain Service 구현 코드)

## 4. 프롬프트 예시
```text
[역할]: Domain Reviewer / Backend Engineer
[프로젝트]: e-Commerce 주문-결제 시스템
[미션]:
1. order-domain-spec.md를 읽고 재고/할인/결제 관련 10개 Business Rule을 조건, 결과, 예외 구조로 명세하세요.
2. Controller-Service-Repository 구조로 책임을 분리하여 OrderDomainService.js 코드를 구현하세요.
```

---

# Mission 4 (Skill Mission 2). 핀테크 이상 금융 거래(FDS) Exception & Validation Audit

## 1. 개요 및 배경
핀테크 송금 및 이상 금융 거래 탐지(FDS) 서비스에서 동시 송금 요청, 1일 이체 한도 초과, 계좌 상태 전이 에러, DB 트랜잭션 실패 상황에 대응하는 Validation 및 Exception 예외 정책을 검증합니다.

## 2. 입력 데이터
* `transfer-api-contract.json` (송금 API 계약서)
* `fds-rule-engine.js` (FDS 및 송금 검증 로직 소스코드)

## 3. 작성 산출물
* `fds-validation-report.md` (트랜잭션 및 예외 검증 보고서)

## 4. 프롬프트 예시
```text
[역할]: Senior Backend & QA Specialist
[프로젝트]: 핀테크 실시간 송금 & FDS 시스템
[미션]:
1. fds-rule-engine.js의 동시성 이슈 및 한도 초과 예외 처리 결함을 Audit하고 테스트 케이스를 작성하세요.
2. DB 실패 및 상태 전이 오류 시 안전한 Rollback 정책 및 예외 처리 가이드를 제시하세요.
```

<!-- ADDITIONAL_SKILL_TASKS:START -->
---

# Day 7 추가 Skill Task — Back-End & Domain Business Logic

> 아래 Task는 기존 Day 7 Task와 Mission을 대체하지 않습니다. 기존 실습을 완료한 뒤 AI-Native SW Engineering 역량을 확장하기 위한 추가 과정입니다.

## 추가 Task 운영 원칙

1. 기존 프로젝트 산출물을 입력 Context로 재사용합니다.
2. 기술 Skill과 AI 활용 Skill을 별도로 평가합니다.
3. AI가 생성한 결과보다 학습자가 검증하고 판단한 근거를 평가합니다.
4. 모든 결과를 Markdown 또는 실행 가능한 코드·다이어그램으로 남깁니다.

## ADD-D07-T01 — Business Rule 명세

### 1. Task 목표

Campaign 상태, Budget, 기간, Target, Frequency Cap 등 최소 10개 Business Rule을 코드보다 먼저 문서화한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `TECH` |
| 기술 Skill | `TECH-BIZ` `TECH-DDD` |
| AI 활용 Skill | `AI-ANA` `AI-REV` `AI-DOC` |
| AI 역할 | Domain Reviewer / Backend Engineer |

### 3. 입력 및 제출 산출물

- **입력 Context:** API Contract, ERD, Front-End Flow
- **제출 산출물:** `09_BUSINESS_RULE.md`, `Back-End Source`
- **통합 결과:** Business Rule 문서, Domain Service, DB 연결, Rule Test

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `Domain Reviewer / Backend Engineer` 역할을 부여합니다.
3. Campaign 상태, Budget, 기간, Target, Frequency Cap 등 최소 10개 Business Rule을 코드보다 먼저 문서화한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-BIZ TECH-DDD)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 Domain Reviewer / Backend Engineer입니다.

[프로젝트 Context]
API Contract, ERD, Front-End Flow

[수행 Task]
Campaign 상태, Budget, 기간, Target, Frequency Cap 등 최소 10개 Business Rule을 코드보다 먼저 문서화한다.

[AI 활용 요구]
AI에게 Rule의 모순·누락·경계값을 검토하게 하고 최종 판단 근거를 사람이 확정한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 각 Rule에 조건, 결과, 예외, 검증 예시가 있다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 30~40분
- 검증·문서화·공유: 15분

---

## ADD-D07-T02 — Domain Service와 Repository 구현

### 1. Task 목표

Controller–Service–Repository 책임을 분리해 Rule과 DB 작업을 구현한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `HYBRID` |
| 기술 Skill | `TECH-BE` `TECH-BIZ` `TECH-DATA` |
| AI 활용 Skill | `AI-CTX` `AI-GEN` `AI-REV` |
| AI 역할 | Domain Reviewer / Backend Engineer |

### 3. 입력 및 제출 산출물

- **입력 Context:** API Contract, ERD, Front-End Flow
- **제출 산출물:** `09_BUSINESS_RULE.md`, `Back-End Source`
- **통합 결과:** Business Rule 문서, Domain Service, DB 연결, Rule Test

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `Domain Reviewer / Backend Engineer` 역할을 부여합니다.
3. Controller–Service–Repository 책임을 분리해 Rule과 DB 작업을 구현한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-BE TECH-BIZ TECH-DATA)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 Domain Reviewer / Backend Engineer입니다.

[프로젝트 Context]
API Contract, ERD, Front-End Flow

[수행 Task]
Controller–Service–Repository 책임을 분리해 Rule과 DB 작업을 구현한다.

[AI 활용 요구]
AI에게 ‘Business Rule이 Controller에 직접 구현된 부분’을 찾게 하고 리팩토링 전후를 비교한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- Controller가 입출력 조정에 집중하고 Rule은 Domain/Service 계층에서 테스트된다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 40~50분
- 검증·문서화·공유: 15분

---

## ADD-D07-T03 — Transaction·Validation·Exception 검증

### 1. Task 목표

동시 요청, Budget 소진, 잘못된 상태 전이, DB 실패를 포함한 테스트를 수행한다.

### 2. Skill 마킹

| 구분 | 마킹 |
|---|---|
| Task 영역 | `AI` |
| 기술 Skill | `TECH-BE` `TECH-BIZ` `TECH-QA` |
| AI 활용 Skill | `AI-QA` `AI-DBG` `AI-REV` |
| AI 역할 | Domain Reviewer / Backend Engineer |

### 3. 입력 및 제출 산출물

- **입력 Context:** API Contract, ERD, Front-End Flow
- **제출 산출물:** `09_BUSINESS_RULE.md`, `Back-End Source`
- **통합 결과:** Business Rule 문서, Domain Service, DB 연결, Rule Test

### 4. 수행 절차

1. 이전 Day 또는 기존 LMS Task에서 만든 입력 문서를 프로젝트 Workspace에 준비합니다.
2. 입력 문서의 확정 사항, 가정, 미결정 사항을 구분하고 AI에게 `Domain Reviewer / Backend Engineer` 역할을 부여합니다.
3. 동시 요청, Budget 소진, 잘못된 상태 전이, DB 실패를 포함한 테스트를 수행한다.
4. AI 결과를 그대로 채택하지 않고 기술 Skill 기준(TECH-BE TECH-BIZ TECH-QA)으로 사실·구조·예외를 검증합니다.
5. 최종 선택, 수정한 내용, 거절한 AI 제안과 이유를 제출 산출물에 기록합니다.

### 5. AI 활용 프롬프트

```text
당신은 이 프로젝트의 Domain Reviewer / Backend Engineer입니다.

[프로젝트 Context]
API Contract, ERD, Front-End Flow

[수행 Task]
동시 요청, Budget 소진, 잘못된 상태 전이, DB 실패를 포함한 테스트를 수행한다.

[AI 활용 요구]
AI가 생성한 경계·실패 테스트를 실제 코드에 실행하고 잘못된 가정은 수정한다.

[출력 형식]
1. 현재 Context에서 확인된 사실
2. 제안 결과와 판단 근거
3. 누락·충돌·위험 요소
4. 사람이 최종 결정해야 하는 질문
5. 검증 가능한 완료 Checklist

추측한 내용은 사실처럼 표현하지 말고 반드시 '가정'으로 표시하세요.
```

### 6. 완료 및 평가 기준

- 핵심 Rule의 정상·경계·실패 Test와 로그·예외 정책이 통과한다.
- 기술 산출물과 AI 검토 결과가 서로 추적 가능해야 합니다.
- AI 제안을 수용·수정·거절한 판단 근거가 최소 1개 이상 기록되어야 합니다.
- 다음 Task가 추가 질문 없이 결과물을 입력 Context로 재사용할 수 있어야 합니다.

### 7. 권장 운영 시간

- Context 준비: 10분
- 기술 수행 및 AI 협업: 30~40분
- 검증·문서화·공유: 15분
<!-- ADDITIONAL_SKILL_TASKS:END -->
