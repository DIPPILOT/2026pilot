(function () {
  "use strict";

  function skill(title, card, concept, practice, artifact, check) {
    return { title: title, card: card, concept: concept, practice: practice, artifact: artifact, check: check };
  }

  function mission(title, card, issue, planner, developer, artifact) {
    return { title: title, card: card, issue: issue, planner: planner, developer: developer, artifact: artifact };
  }

  window.LMS_CURRICULUM = {
    1: {
      theme: "요구사항과 Domain Discovery",
      skills: [
        skill("서비스 문제와 Persona를 Domain 언어로 바꾸기", "개발자가 AI의 질문을 활용해 모호한 비즈니스 표현을 Actor·Goal·Data로 직접 모델링합니다.", "Persona, Goal, 행동, 데이터가 Domain 후보로 이어지는 원리를 설명할 수 있어야 합니다.", "원문에서 근거 문장을 먼저 표시한 뒤 직접 Persona 표를 작성하고, AI에는 누락 질문과 반례만 요청해 표를 수정합니다.", "persona-domain-notes.md", "AI가 만든 문장을 복사하지 않고 각 Domain 후보의 근거를 자신의 말로 설명합니다."),
        skill("Feature를 응집도 높은 Domain으로 분류하기", "개발자가 응집도·결합도 기준을 세우고 AI 반례를 통해 Feature 경계를 직접 조정합니다.", "기능 목록을 책임과 변경 이유가 같은 묶음으로 분류하는 법을 익힙니다.", "Feature를 먼저 수작업으로 분류한 뒤 AI에게 경계가 무너지는 사례를 요구하고, 분류 전후의 차이를 기록합니다.", "feature-domain-map.md", "어떤 기능을 왜 같은 Domain에 넣었는지 변경 이유와 데이터 소유권으로 설명합니다."),
        skill("Domain Map과 책임 경계 검증하기", "개발자가 데이터 소유권과 의존 방향을 그린 뒤 AI를 아키텍처 리뷰어로 사용합니다.", "Bounded Context, Upstream/Downstream, 원본 데이터 소유권의 차이를 이해합니다.", "직접 Context Map 초안을 만들고 AI에게 순환 의존·중복 소유권·누락된 통합 지점을 찾아달라고 요청한 뒤 스스로 수정합니다.", "domain-context-map.md", "모든 핵심 데이터에 단일 원본 소유자가 있고 순환 의존의 해소 근거가 남아 있습니다.")
      ],
      missions: [
        mission("AI 회의 요약에서 사라진 결정 근거 찾기", "기획자와 개발자가 AI 요약본을 원문과 대조해 누락된 정책·보류사항·결정 근거를 복원합니다.", "AI Agent가 회의의 결론만 남기고 조건, 반대 의견, 미결정 사항을 확정 사실처럼 정리했습니다.", "기획자는 원문 인용과 결정 상태를 표시하고 AI가 만든 추정을 사실·가정·질문으로 분리합니다.", "개발자는 누락된 조건이 기능·데이터·예외 처리에 미치는 영향을 표시합니다.", "decision-evidence-log.md"),
        mission("AI 요구사항의 모호한 완료 조건 합의하기", "AI가 만든 요구사항을 기획자와 개발자가 함께 검토해 테스트 가능한 완료 조건으로 바꿉니다.", "‘빠르게’, ‘안전하게’, ‘간편하게’ 같은 표현이 그대로 요구사항에 남아 구현 해석이 갈립니다.", "기획자는 사용자 가치와 허용 가능한 범위를 수치·상태·예시로 제시합니다.", "개발자는 정상·실패·경계 조건을 질문하고 검증 가능한 Acceptance Criteria를 작성합니다.", "requirement-acceptance-log.md"),
        mission("AI Persona의 과잉 일반화 교정하기", "AI가 만든 대표 사용자상이 실제 근거를 벗어났는지 함께 점검합니다.", "AI Agent가 근거 없이 사용자의 나이, 행동, 결제 성향을 만들어 Domain 설계를 왜곡했습니다.", "기획자는 조사 근거가 있는 특성과 가설을 구분하고 추가 확인이 필요한 항목을 백로그로 만듭니다.", "개발자는 근거 없는 Persona 속성이 권한·데이터 필드·기능 분기에 들어가지 않도록 표시합니다.", "persona-assumption-register.md"),
        mission("AI Domain 제안의 소유권 충돌 해결하기", "기획자와 개발자가 AI의 Domain Map에서 중복 책임과 데이터 소유권 충돌을 찾아 결정합니다.", "회원·결제·정산 Domain이 같은 고객 상태를 각각 원본으로 관리하도록 제안되었습니다.", "기획자는 업무 책임자와 정책 변경 주체를 명확히 합니다.", "개발자는 Source of Truth, 이벤트 전달, 실패 시 복구 책임을 제안하고 공동 결정으로 확정합니다.", "domain-ownership-decision.md")
      ]
    },
    2: {
      theme: "User Flow와 Sequence Modeling",
      skills: [
        skill("핵심 사용자 Flow 직접 설계하기", "개발자가 Actor·시작 조건·완료 조건을 먼저 정의하고 AI 질문으로 빠진 단계를 보완합니다.", "사용자 행동과 시스템 내부 처리를 분리하고 정상·대안·실패 Flow를 구분합니다.", "Video Upload·Playback·Advertising 흐름을 직접 작성한 뒤 AI에게 책임 혼합과 누락 전이만 검토시킵니다.", "04_USER_FLOW.md", "각 Flow에 Actor, 사전 조건, 완료 조건, 실패 후 복구 지점이 존재합니다."),
        skill("Domain 간 Sequence Diagram 작성하기", "개발자가 호출 순서와 동기·비동기 선택을 직접 결정하고 AI로 다이어그램을 검증합니다.", "메시지, 응답, 타임아웃, 재시도, 보상 처리의 시간 순서를 이해합니다.", "텍스트 시퀀스를 먼저 작성하고 Mermaid로 옮긴 다음 AI에게 누락 응답과 잘못된 의존 방향을 지적하게 합니다.", "05_SEQUENCE.md", "다이어그램의 모든 화살표를 코드 또는 계약 관점에서 설명할 수 있습니다."),
        skill("Frequency Capping 규칙 구현하기", "개발자가 시간창·식별자·저장 상태를 설계하고 AI 생성 테스트로 규칙을 직접 검증합니다.", "고정/슬라이딩 윈도우, 사용자 식별, 동시성, 캐시 만료가 노출 제한에 미치는 영향을 학습합니다.", "규칙과 의사코드를 직접 만든 뒤 AI에게 경계값·동시 요청 테스트를 생성시켜 실패 사례를 고칩니다.", "frequency-cap-rule-and-tests.md", "같은 입력에 결정적 결과가 나오며 경계 시간과 동시 요청 테스트를 통과합니다.")
      ],
      missions: [
        mission("AI 영향도 분석의 누락 지점 찾기", "기획자와 개발자가 AI가 빠뜨린 화면·API·DB·운영 영향을 추적합니다.", "휴대폰 인증 추가 요청을 분석한 AI Agent가 화면만 수정하고 실패 복구와 개인정보 보관 정책을 누락했습니다.", "기획자는 변경 목적, 대상 사용자, 정책 제약과 제외 범위를 명시합니다.", "개발자는 시스템 의존성과 배포·마이그레이션 영향을 연결하고 누락 질문을 돌려줍니다.", "change-impact-agreement.md"),
        mission("AI 이슈 리포트의 근거와 우선순위 검증하기", "AI가 요약한 프로젝트 이슈를 원문 근거와 실제 위험도로 재분류합니다.", "AI Agent가 언급 빈도를 심각도로 오해하고 담당자와 마감일을 추정했습니다.", "기획자는 사실·결정·추정·미결 항목을 분리하고 비즈니스 영향도를 확정합니다.", "개발자는 기술 위험, 선행 조건, 재현 가능성을 검토해 우선순위를 공동 조정합니다.", "evidence-based-issue-report.md"),
        mission("결제 타임아웃과 재시도 의미 맞추기", "AI가 만든 PG 시퀀스에서 기획 언어와 개발 상태가 다르게 해석되는 지점을 합의합니다.", "‘결제 실패’가 승인 거절인지 응답 지연인지 불명확해 AI가 무조건 재승인을 제안했습니다.", "기획자는 사용자에게 보일 상태와 재시도 허용 조건을 정의합니다.", "개발자는 Idempotency Key, 웹훅, 미확정 상태와 보상 처리 방식을 설명하고 합의안을 기록합니다.", "payment-timeout-decision.md"),
        mission("동기화 예외를 사용자 시나리오로 번역하기", "기획자와 개발자가 AI의 기술 중심 동기화 설계를 사용자 경험과 연결합니다.", "AI Agent가 BLE 재전송 로직은 만들었지만 중복 데이터, 오프라인 안내, 의료 경고 지연을 다루지 않았습니다.", "기획자는 사용자가 인지해야 할 지연·중복·실패 상태와 안내 원칙을 정합니다.", "개발자는 캐시, 재전송, 순서 보장, 중복 제거 제약을 설명하고 수용 기준을 연결합니다.", "sync-exception-scenario.md")
      ]
    },
    3: {
      theme: "Entity Discovery와 ERD",
      skills: [
        skill("Sequence에서 Entity와 상태 도출하기", "개발자가 메시지의 명사·행동·상태 변화를 추적하고 AI로 누락 모델을 검토합니다.", "Entity, Value Object, Event, 단순 속성을 구분하는 기준을 익힙니다.", "Sequence별 CRUD와 상태 전이를 직접 표기한 후 AI에게 생명주기 충돌과 누락 식별자를 질문합니다.", "entity-state-catalog.md", "각 Entity의 식별자, 생명주기, 상태 전이 근거를 설명합니다."),
        skill("관계·정규화·데이터 소유권 설계하기", "개발자가 함수 종속성과 업무 규칙을 근거로 3NF 모델을 직접 만들고 AI 반례로 검증합니다.", "Cardinality, FK, Unique, 정규화와 조회 성능의 균형을 이해합니다.", "초기 ERD를 직접 작성하고 AI가 제안한 이상 현상을 실제 샘플 데이터로 재현해 제약을 보완합니다.", "06_ERD.md", "삽입·수정·삭제 이상과 중복 소유권이 없고 제약의 이유가 기록됩니다."),
        skill("Domain–Flow–ERD 정합성 Audit하기", "개발자가 산출물 간 추적표를 만들고 AI를 교차 검증 도구로 사용합니다.", "Flow의 모든 읽기·쓰기가 Domain 책임과 ERD 구조에 매핑되어야 함을 학습합니다.", "CRUD 추적 행렬을 직접 작성한 후 AI에게 고아 Entity, 미사용 필드, 소유권 역전을 찾게 하고 직접 판정합니다.", "domain-flow-erd-audit.md", "모든 불일치에 근거, 영향, 수정 대상, 판정자가 기록됩니다.")
      ],
      missions: [
        mission("AI가 만든 Entity의 근거 검증하기", "기획자와 개발자가 AI가 임의로 추가·병합한 데이터 개념을 원문과 대조합니다.", "AI Agent가 ‘고객’, ‘회원’, ‘구매자’를 하나로 합치고 존재하지 않는 등급 속성을 만들었습니다.", "기획자는 업무 용어의 정의와 사용 맥락, 동의어 여부를 확정합니다.", "개발자는 식별자와 생명주기 차이를 검증해 분리·통합 결정을 제안합니다.", "entity-evidence-register.md"),
        mission("AI 용어 표준화의 의미 손실 막기", "AI가 비슷한 단어를 일괄 치환하면서 사라진 업무 의미를 공동 복원합니다.", "‘승인’, ‘확정’, ‘완료’가 하나의 상태로 통합되어 프로세스가 잘못 모델링되었습니다.", "기획자는 상태별 업무 책임과 사용자 의미를 설명합니다.", "개발자는 Enum, 전이 조건, API/DB 이름에 미치는 영향을 보여주고 표준 용어를 합의합니다.", "term-state-decision.md"),
        mission("AI 정규화 제안의 업무 규칙 확인하기", "기획자와 개발자가 AI의 스키마 제안에 숨은 가정을 찾아 검토합니다.", "AI Agent가 주문 시점의 가격 이력을 현재 상품 가격 참조로 바꿔 과거 거래가 변하는 문제가 생겼습니다.", "기획자는 감사·정산·고객 문의에 필요한 과거 사실 보존 규칙을 정합니다.", "개발자는 Snapshot과 참조 모델의 차이, 무결성·성능 영향을 설명합니다.", "data-history-decision.md"),
        mission("스키마 변경 시 AI 영향 분석 검증하기", "AI가 제시한 변경 목록을 기획 흐름과 실제 코드 의존성 양쪽에서 검증합니다.", "컬럼 이름 변경을 단순 작업으로 분류했지만 API 계약, 리포트, 배치가 함께 깨집니다.", "기획자는 변경되는 사용자 용어와 보고 지표를 확인합니다.", "개발자는 Migration, 하위 호환, 롤백, 데이터 검증 계획을 연결해 공동 승인받습니다.", "schema-change-checklist.md")
      ]
    },
    4: {
      theme: "API Contract와 Interface",
      skills: [
        skill("Domain Boundary로 Endpoint 설계하기", "개발자가 Resource와 책임 경계를 직접 정의하고 AI 비교안으로 설계를 다듬습니다.", "REST Resource, URI, Method, Idempotency와 Domain 경계의 관계를 익힙니다.", "Endpoint 초안을 직접 만들고 AI에게 RPC 냄새·책임 누수·일관성 위반을 찾아달라고 요청해 수정합니다.", "api-resource-map.md", "URI와 Method 선택을 업무 상태 변화와 멱등성으로 설명합니다."),
        skill("Request·Response·Error Contract 작성하기", "개발자가 Schema와 오류 규격을 직접 작성하고 AI 생성 예시로 계약을 시험합니다.", "필수/선택 필드, Validation, Status Code, 공통 Error Contract를 학습합니다.", "OpenAPI 초안을 작성한 뒤 AI로 정상·경계·오류 Payload를 생성해 Validator로 검증하고 스펙을 보완합니다.", "07_API_SPEC.yaml", "모든 예시가 스키마 검증을 통과하고 오류가 클라이언트 행동과 연결됩니다."),
        skill("API Contract 정합성 리뷰하기", "개발자가 Sequence·ERD·OpenAPI 추적표를 만들고 AI로 Breaking Change를 탐색합니다.", "계약 호환성, Versioning, Consumer 영향, 부정 테스트를 이해합니다.", "변경 Diff를 직접 분류한 뒤 AI에게 소비자 관점의 실패 시나리오를 만들게 하고 테스트로 확인합니다.", "api-contract-review.md", "Breaking/Non-breaking 판정 근거와 영향 받는 Consumer가 기록됩니다.")
      ],
      missions: [
        mission("AI API 명세의 요구사항 누락 찾기", "기획자와 개발자가 AI 생성 API가 실제 사용자 흐름을 모두 지원하는지 확인합니다.", "AI Agent가 정상 응답만 만들고 취소, 중복 요청, 권한 오류를 빠뜨렸습니다.", "기획자는 각 사용자 행동의 성공·실패 후 기대 상태를 정의합니다.", "개발자는 Endpoint·상태 코드·오류 코드로 매핑하고 누락 계약을 보완합니다.", "api-requirement-trace.md"),
        mission("AI 오류 문구와 복구 행동 맞추기", "기획자와 개발자가 오류 코드, 사용자 메시지, 재시도 행동의 연결을 합의합니다.", "AI가 모든 실패를 400과 ‘다시 시도하세요’로 처리해 사용자가 복구할 수 없습니다.", "기획자는 사용자에게 필요한 설명과 다음 행동을 정의합니다.", "개발자는 보안 노출 없이 구분 가능한 오류 코드와 Retry 가능 여부를 설계합니다.", "error-recovery-contract.md"),
        mission("외부 API 가정을 계약으로 바꾸기", "AI가 추정한 오픈뱅킹 동작을 공식 계약과 검증 질문으로 분리합니다.", "AI Agent가 문서에 없는 토큰 수명과 재시도 정책을 사실처럼 작성했습니다.", "기획자는 확정 정책과 공급사 확인 항목을 구분해 의사결정 대기열을 만듭니다.", "개발자는 Mock·Contract Test로 미확정 가정을 격리하고 실패 대응안을 제시합니다.", "external-api-assumption-log.md"),
        mission("API 변경의 사용자 영향 공동 승인하기", "AI가 낮은 위험으로 분류한 변경을 기획·개발 관점에서 다시 평가합니다.", "응답 필드 삭제가 내부 리팩터링으로 분류됐지만 앱 화면과 운영 리포트가 사용 중입니다.", "기획자는 사용자 노출 기능과 출시 일정 영향을 확인합니다.", "개발자는 Consumer 목록, Deprecation 기간, 호환 계층과 롤백 계획을 제시합니다.", "api-change-approval.md")
      ]
    },
    5: {
      theme: "Persona 기반 UI/UX",
      skills: [
        skill("Persona별 Information Architecture 설계하기", "개발자가 사용자 목표를 화면·Route·권한으로 직접 변환하고 AI 카드소팅으로 검증합니다.", "IA, Navigation, Screen Flow와 역할별 접근 차이를 학습합니다.", "직접 Sitemap과 Route 표를 만든 뒤 AI에게 Persona별 탐색 과제를 수행시켜 막힌 경로를 수정합니다.", "08_UI_SPEC.md", "핵심 목표가 최소 경로로 연결되고 접근 불가 화면의 처리 원칙이 있습니다."),
        skill("Component와 UI State 구현하기", "개발자가 Component 책임과 상태 모델을 작성하고 AI를 상태 누락 리뷰어로 사용합니다.", "Loading, Empty, Error, Disabled, Success 상태와 접근성 속성을 익힙니다.", "컴포넌트 State Matrix를 먼저 만들고 AI 생성 Story/Test로 각 상태를 렌더링해 직접 보완합니다.", "component-state-matrix.md", "모든 비동기 상태와 키보드·스크린리더 동작을 재현할 수 있습니다."),
        skill("초보 사용자 UX Walkthrough 수행하기", "개발자가 실제 화면을 조작하며 관찰하고 AI는 질문과 휴리스틱 체크를 보조합니다.", "인지 부하, 피드백, 오류 예방, 복구 가능성을 코드 수준 개선으로 연결합니다.", "Think-aloud 로그를 직접 남긴 뒤 AI가 분류한 문제를 재현하고 우선순위 높은 항목을 코드로 고칩니다.", "ux-walkthrough-and-fix.md", "관찰 근거, 재현 절차, 수정 코드, 전후 확인이 한 세트로 남습니다.")
      ],
      missions: [
        mission("AI Persona가 만든 편견 점검하기", "기획자와 개발자가 AI의 사용자 가정이 실제 데이터와 접근성 원칙을 벗어났는지 검토합니다.", "AI Agent가 고연령 사용자는 기능을 적게 써야 한다고 단정해 주요 기능을 숨겼습니다.", "기획자는 조사 근거와 포용 기준을 제시하고 가설을 검증 항목으로 바꿉니다.", "개발자는 기능 제한 대신 가독성·피드백·보조 기술 지원 대안을 제안합니다.", "inclusive-persona-review.md"),
        mission("AI UX 평가의 근거 없는 점수 고치기", "AI가 매긴 사용성 점수를 실제 관찰과 측정 지표로 교체합니다.", "AI Agent가 화면 이미지만 보고 ‘사용성 9점’을 부여했지만 완료율과 오류 데이터가 없습니다.", "기획자는 성공 기준, 대상 Persona, 관찰 질문을 정의합니다.", "개발자는 측정 이벤트와 재현 가능한 테스트 환경을 준비해 공동 판정합니다.", "ux-evidence-scorecard.md"),
        mission("AI UI 초안의 요구사항 추적하기", "AI가 만든 화면이 원래 정책·권한·예외를 보존했는지 공동 검토합니다.", "예쁜 프로토타입에 비회원 제한과 실패 복구 화면이 빠졌습니다.", "기획자는 화면별 요구사항 ID와 사용자 메시지를 연결합니다.", "개발자는 상태·권한·API 의존성을 표시하고 누락 화면을 구현 범위에 반영합니다.", "ui-requirement-trace.md"),
        mission("AI 개선안의 개발 가능성 협상하기", "기획자와 개발자가 AI의 과도한 인터랙션 제안을 가치·비용·위험으로 분해합니다.", "AI Agent가 모든 화면에 실시간 추천과 애니메이션을 제안해 일정과 접근성 위험이 커졌습니다.", "기획자는 핵심 사용자 가치와 Must/Should/Could 우선순위를 확정합니다.", "개발자는 구현 복잡도, 성능, 접근성 영향을 제시해 최소 검증안으로 합의합니다.", "ux-scope-decision.md")
      ]
    },
    6: {
      theme: "Front-End와 API Integration",
      skills: [
        skill("화면–API Binding 직접 구현하기", "개발자가 Contract를 읽고 타입·호출·렌더링을 직접 연결하며 AI를 페어 리뷰어로 사용합니다.", "DTO 변환, 비동기 호출, 취소, 오류 전파와 화면 상태의 연결을 익힙니다.", "한 Flow를 직접 구현한 뒤 AI에게 Contract 위반과 Race Condition을 질문하고 테스트로 확인해 수정합니다.", "frontend-api-binding.patch", "Mock과 실제 API에서 동일한 상태 전이가 재현되고 Contract 위반이 없습니다."),
        skill("상태 관리와 실패 UX 구현하기", "개발자가 상태 머신을 먼저 설계하고 AI 생성 실패 시나리오로 복구 흐름을 강화합니다.", "Loading·Empty·Validation·Timeout·Error·Success 상태와 전이 조건을 학습합니다.", "State Diagram을 직접 작성하고 네트워크 지연·중복 클릭·취소를 주입해 UI를 수정합니다.", "ui-state-recovery-demo.md", "실패 후 사용자가 데이터 손실 없이 다음 행동을 선택할 수 있습니다."),
        skill("Front-End Debugging과 Refactoring 익히기", "개발자가 가설·재현·관찰·수정 순서로 디버깅하고 AI는 대안 가설을 제공합니다.", "콘솔·Network·Performance 도구와 상태 격리, 함수 분리, 접근성 개선을 익힙니다.", "버그를 먼저 재현하고 자신의 원인 가설을 쓴 뒤 AI 제안을 증거로 검증하며 최소 수정과 리팩터링을 수행합니다.", "debug-refactor-log.md", "원인 증거, 실패한 가설, 최소 수정, 회귀 테스트가 기록됩니다.")
      ],
      missions: [
        mission("AI 생성 코드의 요구사항 이탈 찾기", "기획자와 개발자가 동작하는 코드가 원래 사용자 정책을 지키는지 함께 확인합니다.", "AI Agent가 화면은 완성했지만 취소 수수료와 권한 조건을 임의로 단순화했습니다.", "기획자는 시나리오별 기대 결과와 변경 불가 정책을 체크합니다.", "개발자는 코드 경로와 테스트를 요구사항에 연결해 이탈을 수정합니다.", "generated-code-trace.md"),
        mission("AI 디버깅의 성급한 결론 검증하기", "AI가 제안한 원인을 재현 증거 없이 적용하지 않고 공동 판단합니다.", "CORS 오류를 서버 장애로 단정한 AI 제안 때문에 불필요한 우회 코드가 추가될 상황입니다.", "기획자는 사용자 증상, 발생 조건, 영향 범위를 정확히 기록합니다.", "개발자는 로그·Network·재현 테스트로 가설을 검증하고 원인과 임시 대응을 구분합니다.", "incident-hypothesis-log.md"),
        mission("AI 코드 리뷰 우선순위 합의하기", "수십 개 AI 리뷰 의견을 사용자 위험과 기술 위험으로 나눠 실제 수정 순서를 정합니다.", "AI Agent가 스타일 문제와 데이터 손실 버그를 같은 심각도로 나열했습니다.", "기획자는 사용자·사업 영향과 출시 차단 조건을 제시합니다.", "개발자는 재현 가능성, 수정 위험, 회귀 범위를 평가해 공동 우선순위를 만듭니다.", "review-priority-board.md"),
        mission("AI 리팩터링의 기능 보존 확인하기", "기획자와 개발자가 코드 정리 후 사용자 동작과 예외 정책이 유지되는지 검증합니다.", "AI 리팩터링이 중복 코드를 줄이는 과정에서 재시도 횟수와 오류 안내를 삭제했습니다.", "기획자는 핵심 행동과 메시지의 회귀 체크리스트를 제공합니다.", "개발자는 Characterization Test와 Diff 설명으로 기능 보존을 입증합니다.", "refactor-acceptance-report.md")
      ]
    },
    7: {
      theme: "Back-End Business Logic",
      skills: [
        skill("Business Rule을 실행 가능한 명세로 만들기", "개발자가 정책을 조건·상태·불변식으로 직접 표현하고 AI 반례로 규칙을 단단하게 합니다.", "Rule, Validation, Policy, Invariant의 차이를 익힙니다.", "Campaign·Budget·Target 규칙을 Decision Table로 만든 뒤 AI 생성 반례를 테스트로 옮겨 보완합니다.", "09_BUSINESS_RULE.md", "각 규칙에 입력, 판정, 실패 이유, 테스트 사례가 있습니다."),
        skill("Domain Service와 Repository 구현하기", "개발자가 책임을 분리해 구현하고 AI를 구조 리뷰어로 활용합니다.", "Controller, Application/Domain Service, Repository의 역할과 의존 역전을 학습합니다.", "Use Case 하나를 직접 구현한 뒤 AI에게 계층 누수와 테스트 어려움을 지적하게 하고 리팩터링합니다.", "domain-service-repository.patch", "업무 규칙이 Framework와 DB 세부 구현 없이 단위 테스트됩니다."),
        skill("Transaction·Validation·Exception 검증하기", "개발자가 트랜잭션 경계와 실패 전략을 설계하고 AI 생성 Failure Injection으로 확인합니다.", "동시성, 원자성, 재시도, 예외 변환, 데이터 무결성을 익힙니다.", "예산 소진·중복 요청·DB 실패를 직접 주입하고 AI가 제시한 추가 케이스를 테스트로 구현합니다.", "transaction-exception-tests.md", "부분 성공과 데이터 불일치가 없고 예외가 호출자 행동으로 연결됩니다.")
      ],
      missions: [
        mission("AI Business Rule의 정책 왜곡 찾기", "기획자와 개발자가 자연어 정책이 코드 규칙으로 바뀌며 달라진 부분을 검토합니다.", "AI Agent가 ‘예산 이하’와 ‘예산 미만’을 혼동하고 시간대 기준을 임의로 UTC로 정했습니다.", "기획자는 경계값, 기준 시각, 우선순위와 예외 승인을 명확히 합니다.", "개발자는 Decision Table과 테스트로 해석 차이를 보여주고 확정 규칙을 반영합니다.", "business-rule-agreement.md"),
        mission("AI 예외 처리의 사용자 영향 확인하기", "기술 예외가 화면·알림·운영 대응으로 어떻게 이어지는지 공동 설계합니다.", "AI Agent가 모든 예외를 재시도하지만 중복 주문과 지연 안내 문제가 발생합니다.", "기획자는 사용자가 기다릴 시간, 취소 가능 시점, 안내 채널을 정합니다.", "개발자는 Retryable/Non-retryable 분류와 Idempotency, 보상 처리 방식을 연결합니다.", "exception-experience-map.md"),
        mission("AI가 놓친 트랜잭션 경계 합의하기", "한 요청의 성공 범위를 기획자와 개발자가 업무 단위로 다시 정의합니다.", "주문 저장은 성공했지만 결제 이벤트 발행이 실패한 상태를 AI가 완료로 처리했습니다.", "기획자는 어떤 상태를 사용자에게 주문 완료로 보여줄지 정합니다.", "개발자는 Outbox, 보상, 재처리와 운영 관측 방식을 제시해 합의합니다.", "transaction-boundary-decision.md"),
        mission("AI Agent 실행 결과의 책임자 정하기", "AI가 자동 수정한 Rule과 데이터 변경을 누가 검토·승인·복구할지 정합니다.", "Agent가 테스트 통과만 보고 할인 규칙을 수정했지만 사업 승인과 감사 기록이 없습니다.", "기획자는 정책 변경 승인자와 효력 시점을 명시합니다.", "개발자는 변경 Diff, 테스트, 배포·롤백 책임과 Audit Log를 설계합니다.", "agent-change-governance.md")
      ]
    },
    8: {
      theme: "Identity, Authentication과 Authorization",
      skills: [
        skill("Role·Permission Matrix 설계하기", "개발자가 최소 권한 원칙으로 권한표를 직접 만들고 AI 공격 질문으로 검증합니다.", "Role, Resource, Action, Ownership, Tenant 경계의 관계를 익힙니다.", "화면·API·데이터 권한표를 작성한 뒤 AI에게 권한 상승과 IDOR 시나리오를 생성시켜 빈칸을 수정합니다.", "10_SECURITY.md", "허용·거부 규칙과 소유권 조건이 서버 측 검증으로 연결됩니다."),
        skill("Authentication Flow 구현하기", "개발자가 비밀번호·세션·토큰 생명주기를 직접 구현하고 AI로 위협 모델을 검토합니다.", "Signup, Login, Hash, JWT/Session, 만료·갱신·로그아웃을 이해합니다.", "흐름과 코드를 직접 작성한 뒤 AI에게 탈취·재사용·동시 세션 공격을 질문하고 테스트로 방어를 확인합니다.", "authentication-flow-and-tests.md", "토큰 수명과 폐기, 비밀번호 보호, 실패 응답이 명시되고 테스트됩니다."),
        skill("Authorization Negative Test 수행하기", "개발자가 금지된 행동을 직접 테스트하며 AI는 공격 표면 확장을 돕습니다.", "권한 검증은 UI가 아니라 모든 서버 진입점에서 수행되어야 함을 학습합니다.", "타인 ID, Role 위조, Admin API, Tenant 교차 접근 테스트를 작성하고 AI 제안을 추가해 패치합니다.", "authorization-negative-tests.md", "모든 금지 시나리오가 일관된 403/404 정책과 Audit Log를 남깁니다.")
      ],
      missions: [
        mission("AI 회원 정책의 개인정보 과수집 막기", "기획자와 개발자가 AI가 제안한 가입 필드의 필요성과 보관 근거를 검토합니다.", "AI Agent가 개인화에 유용하다며 생년월일·주소·직업을 필수 항목으로 추가했습니다.", "기획자는 목적, 필수 여부, 동의, 보관 기간과 삭제 정책을 확인합니다.", "개발자는 데이터 흐름·암호화·접근 권한·삭제 구현 비용을 제시합니다.", "personal-data-review.md"),
        mission("AI 로그인 UX와 보안 균형 맞추기", "편리함을 위한 AI 제안이 계정 열거·무차별 대입 위험을 만들지 함께 검토합니다.", "AI Agent가 ‘존재하지 않는 이메일’과 ‘비밀번호 오류’를 상세 구분해 공격 힌트를 노출했습니다.", "기획자는 사용자 안내와 고객지원 경로를 설계합니다.", "개발자는 통합 오류, Rate Limit, Lockout, 관측 정책을 제안해 합의합니다.", "auth-ux-security-decision.md"),
        mission("AI 권한표의 소유권 누락 찾기", "Role만 보고 허용한 AI 권한표에 사용자·Tenant 소유권 조건을 추가합니다.", "같은 Creator Role이면 다른 사용자의 콘텐츠도 수정할 수 있게 생성되었습니다.", "기획자는 협업·위임·관리자 개입 규칙을 정의합니다.", "개발자는 Ownership Check와 Tenant Boundary, 감사 로그 테스트를 연결합니다.", "permission-ownership-contract.md"),
        mission("AI 보안 진단의 오탐·누락 판정하기", "AI 보안 리포트를 그대로 수용하지 않고 위협·증거·영향으로 공동 판정합니다.", "AI Agent가 스타일 문제는 Critical로, 실제 토큰 재사용 문제는 낮음으로 분류했습니다.", "기획자는 사용자·규제·사업 영향을 평가합니다.", "개발자는 재현 PoC, 공격 조건, 수정·회귀 위험을 검증해 최종 심각도를 확정합니다.", "security-finding-triage.md")
      ]
    },
    9: {
      theme: "Advertising, Billing과 Analytics",
      skills: [
        skill("광고 후보 검색과 선택 Rule 구현하기", "개발자가 필터·우선순위·동률 규칙을 직접 구현하고 AI 테스트로 검증합니다.", "Active, Budget, Target Match, Frequency Cap의 평가 순서와 결정성을 익힙니다.", "Rule Pipeline을 작성한 뒤 AI로 경계 데이터와 충돌 조건을 생성해 Property Test를 구현합니다.", "ad-selection-rule-tests.md", "같은 입력은 같은 결과를 내고 제외 이유를 추적할 수 있습니다."),
        skill("Billing·Analytics Domain Event 연결하기", "개발자가 Event Schema와 멱등 소비를 직접 설계하고 AI로 장애 시나리오를 확장합니다.", "At-least-once 전달, Idempotency, Ordering, Outbox, Reconciliation을 익힙니다.", "AdRequested부터 Charge까지 이벤트 흐름을 구현하고 중복·역순·유실을 주입해 복구를 확인합니다.", "billing-event-pipeline.md", "중복 과금이 없고 누락 이벤트를 탐지·재처리할 수 있습니다."),
        skill("Viewer–Ad–Billing E2E 검증하기", "개발자가 관측 지점과 기대 상태를 정의하고 AI로 통합 실패를 탐색합니다.", "UI 행동부터 광고 노출·재생·비용 차감·지표 반영까지 추적하는 법을 익힙니다.", "Correlation ID로 E2E 시나리오를 실행하고 AI가 제안한 장애를 주입해 원인을 로그로 찾습니다.", "viewer-ad-billing-e2e.md", "각 단계의 입력·출력·상태·로그가 하나의 Trace로 연결됩니다.")
      ],
      missions: [
        mission("AI 결제 흐름의 숨은 상태 찾기", "기획자와 개발자가 AI가 성공·실패로만 단순화한 결제 상태를 복원합니다.", "응답 지연과 웹훅 대기 상태가 실패로 표시되어 사용자가 반복 결제를 시도합니다.", "기획자는 대기·확인 중·완료·취소 상태별 메시지와 행동을 정합니다.", "개발자는 PG 상태, 조회·재시도, 멱등성 구현을 연결합니다.", "payment-state-experience.md"),
        mission("AI 결제 UX의 신뢰 문제 검증하기", "AI가 만든 결제 화면을 실제 가격·환불·보안 정보 기준으로 공동 점검합니다.", "할인 전후 가격과 정기 결제 조건이 빠져 사용자가 최종 금액을 오해합니다.", "기획자는 필수 고지, 취소·환불 정책과 동의 시점을 확정합니다.", "개발자는 서버 계산값, 위변조 방지, 영수증·로그 연결을 확인합니다.", "checkout-trust-checklist.md"),
        mission("AI 이벤트 설계의 중복 과금 위험 찾기", "기획자와 개발자가 Agent가 제안한 자동 재처리의 사업 위험을 검토합니다.", "실패 이벤트를 무조건 재생하면서 Charge가 두 번 반영될 수 있습니다.", "기획자는 과금 확정 기준, 고객 보상, 운영 승인 조건을 정합니다.", "개발자는 Idempotency Key, Ledger, Reconciliation과 경보를 설계합니다.", "billing-retry-decision.md"),
        mission("AI Analytics 해석의 지표 왜곡 막기", "AI가 상관관계를 원인처럼 설명한 리포트를 데이터 정의와 실험 근거로 바로잡습니다.", "클릭 증가를 매출 개선으로 단정했지만 중복 이벤트와 환불이 반영되지 않았습니다.", "기획자는 지표 정의, 의사결정 목적, 비교 기준을 명확히 합니다.", "개발자는 이벤트 품질, 중복 제거, Attribution 한계를 검증해 신뢰 범위를 표시합니다.", "analytics-evidence-report.md")
      ]
    },
    10: {
      theme: "Full Integration, QA와 Release",
      skills: [
        skill("전체 서비스 E2E Scenario와 QA 수행하기", "개발자가 위험 기반 E2E 시나리오를 직접 설계하고 AI로 누락 경로를 확장합니다.", "Happy Path, Failure Injection, Regression, Test Pyramid와 관측을 익힙니다.", "Signup부터 Payment·Billing·Analytics까지 테스트를 작성하고 AI 제안 장애를 실제로 주입해 복구를 검증합니다.", "11_TEST_SCENARIO.md", "핵심 흐름과 실패 복구가 자동·수동 증거로 재현됩니다."),
        skill("Release Readiness와 문서 Context 완성하기", "개발자가 코드·설계·운영 문서의 일치를 직접 점검하고 AI를 문서 Diff 리뷰어로 사용합니다.", "Build, Config, Migration, Rollback, Runbook, Observability 준비도를 익힙니다.", "릴리즈 체크리스트를 직접 수행한 뒤 AI에게 코드와 문서의 불일치를 찾게 하고 근거를 확인해 수정합니다.", "12_RELEASE.md", "새 개발자가 문서만으로 배포·관측·롤백을 재현할 수 있습니다."),
        skill("설계 Decision·AI 활용·Demo 발표하기", "개발자가 기술 선택과 검증 과정을 자신의 언어로 설명하고 AI로 반대 질문을 연습합니다.", "Decision Record, Trade-off, Evidence, Demo Narrative를 학습합니다.", "핵심 결정 3개와 실패·수정 사례를 직접 정리한 뒤 AI 모의 질의에 근거로 답하고 발표를 개선합니다.", "technical-demo-deck.md", "AI가 만든 결과가 아니라 개발자의 판단·검증·학습이 발표의 중심입니다.")
      ],
      missions: [
        mission("AI 런칭 문서의 사실 불일치 찾기", "기획자와 개발자가 AI가 만든 소개·FAQ·매뉴얼을 실제 기능과 대조합니다.", "아직 구현되지 않은 기능과 지원하지 않는 환불 절차가 런칭 문서에 포함됐습니다.", "기획자는 공개 가능한 범위, 약속 수준, 고객지원 절차를 확인합니다.", "개발자는 배포 버전의 Feature Flag와 실제 동작을 근거로 문서를 검증합니다.", "launch-content-verification.md"),
        mission("AI 최종 발표의 과장과 근거 점검하기", "AI가 다듬은 발표 문구를 측정 결과와 실제 의사결정 기록으로 검증합니다.", "성능·생산성 수치가 측정 없이 생성되고 AI가 한 일을 팀 성과로 표현했습니다.", "기획자는 사용자 가치와 사업 결과의 증거를 확인합니다.", "개발자는 테스트·지표·Diff와 사람의 판단 지점을 제시해 표현을 교정합니다.", "final-presentation-evidence.md"),
        mission("AI 통합 QA의 통과 착시 깨기", "기획자와 개발자가 Agent의 ‘모든 테스트 통과’ 보고가 실제 출시 기준을 충족하는지 확인합니다.", "Mock 테스트만 통과했고 실결제 Sandbox, 마이그레이션, 장애 복구는 실행되지 않았습니다.", "기획자는 출시 차단 시나리오와 사용자 수용 기준을 확정합니다.", "개발자는 환경별 증거, 미실행 항목, 잔여 위험과 담당자를 공개합니다.", "release-quality-gate.md"),
        mission("AI 배포 제안의 롤백·모니터링 합의하기", "Agent가 만든 배포 계획에 사람의 승인과 복구·관측 단계를 추가합니다.", "AI Agent가 자동 배포만 제안하고 실패 판정 지표와 롤백 책임자를 지정하지 않았습니다.", "기획자는 서비스 중단 허용 범위와 사용자 공지 기준을 정합니다.", "개발자는 Canary, Health Check, Alert, Rollback Trigger와 담당자를 연결합니다.", "deployment-governance-plan.md")
      ]
    }
  };
})();

/* PBL 수행 설명과 실제 산출물 예시 */
(function () {
  "use strict";
  var days = window.LMS_CURRICULUM;
  if (!days) return;

  var skillExamples = {
    1: [
      ["# Persona–Domain 근거표", "", "| Persona | 원문 근거 | Goal | 행동 | 필요 데이터 | Domain 후보 |", "|---|---|---|---|---|---|", "| Creator | ‘창작자는 영상을 업로드한다’ | 영상 공개 | 업로드·수정·삭제 | videoId, status | Video |", "| Advertiser | ‘캠페인 예산을 설정한다’ | 광고 집행 | 타깃·예산 설정 | campaignId, budget | Campaign |", "", "> 가설: Creator 정산 주기는 원문에 없으므로 이해관계자 확인 필요"].join("\n"),
      ["# Feature–Domain 배치표", "", "| Feature | 책임 | 변경 이유 | Owner Domain | 제외한 대안 |", "|---|---|---|---|---|", "| 영상 공개 예약 | 공개 시점과 상태 관리 | Video 정책 변경 | Video | Creator: 사용자 역할만 담당 |", "| 결제 승인 | 금액 승인·취소 | PG 정책 변경 | Billing | Order: 결제 원본 소유 아님 |"].join("\n"),
      ["flowchart LR", "  Creator -->|UploadVideo| Video", "  Video -->|VideoPublished| Playback", "  Campaign -->|AdSelected| AdServing", "  AdServing -->|ChargeRequested| Billing", "  Billing -->|ChargeCompleted| Analytics", "", "%% Owner: Video=Video Domain, Invoice=Billing Domain", "%% 금지: Analytics가 Billing 원본 DB를 직접 수정하지 않음"].join("\n")
    ],
    2: [
      ["# Playback User Flow", "", "- Actor: Viewer", "- 시작 조건: 로그인 완료, 재생 가능한 videoId 보유", "- 정상 흐름:", "  1. Viewer가 재생 버튼을 누른다.", "  2. Client가 재생 권한을 조회한다.", "  3. Playback이 재생 URL을 발급한다.", "- 완료 조건: 첫 프레임 재생 및 playback_started 기록", "- 예외: 권한 없음 → 구매 화면, 네트워크 중단 → 동일 위치 재시도"].join("\n"),
      ["sequenceDiagram", "  actor Viewer", "  participant Client", "  participant Playback", "  participant DB", "  Viewer->>Client: 재생 클릭", "  Client->>Playback: GET /videos/{id}/playback", "  Playback->>DB: 권한·상태 조회", "  alt 재생 가능", "    Playback-->>Client: 200 playbackUrl", "  else 권한 없음", "    Playback-->>Client: 403 PLAYBACK_NOT_ALLOWED", "  end"].join("\n"),
      ["describe('24시간 3회 Frequency Cap', () => {", "  it('네 번째 동시 요청을 차단한다', async () => {", "    const results = await Promise.all(", "      Array.from({ length: 4 }, () => expose('user-1', 'campaign-7'))", "    );", "    expect(results.filter(r => r.allowed)).toHaveLength(3);", "    expect(results[3].reason).toBe('FREQUENCY_CAP_EXCEEDED');", "  });", "});"].join("\n")
    ],
    3: [
      ["# Entity 후보 분류", "", "| 후보 | 분류 | 식별자 | 생명주기 근거 | 상태 |", "|---|---|---|---|---|", "| Video | Entity | videoId | 업로드 후 수정·삭제됨 | DRAFT/PUBLISHED |", "| Money | Value Object | 없음 | 금액+통화가 함께 비교됨 | - |", "| VideoPublished | Event | eventId | 공개 순간의 사실 | OCCURRED |"].join("\n"),
      ["CREATE TABLE orders (", "  order_id BIGINT PRIMARY KEY,", "  user_id BIGINT NOT NULL,", "  ordered_at TIMESTAMP NOT NULL", ");", "", "CREATE TABLE order_items (", "  order_item_id BIGINT PRIMARY KEY,", "  order_id BIGINT NOT NULL REFERENCES orders(order_id),", "  product_id BIGINT NOT NULL,", "  unit_price DECIMAL(12,2) NOT NULL, -- 주문 시점 가격 Snapshot", "  quantity INT NOT NULL CHECK (quantity > 0)", ");"].join("\n"),
      ["# Domain–Flow–ERD Audit", "", "| Flow 단계 | CRUD | Entity | Owner | 판정 | 조치 |", "|---|---|---|---|---|---|", "| 광고 노출 기록 | C | Impression | Analytics | 일치 | - |", "| 비용 차감 | U | CampaignBudget | Campaign | 불일치 | Billing 직접 UPDATE 제거, Event 사용 |"].join("\n")
    ],
    4: [
      ["| Domain | Method | URI | 권한 | 멱등성 |", "|---|---|---|---|---|", "| Video | POST | /videos | Creator | Idempotency-Key |", "| Playback | POST | /videos/{id}/playback-sessions | Viewer | 요청별 sessionId |", "| Campaign | PATCH | /campaigns/{id}/budget | Advertiser Owner | If-Match |"].join("\n"),
      ["paths:", "  /videos/{videoId}:", "    get:", "      responses:", "        '200':", "          content:", "            application/json:", "              schema:", "                $ref: '#/components/schemas/Video'", "        '404':", "          $ref: '#/components/responses/VideoNotFound'"].join("\n"),
      ["# API 변경 판정", "", "| 변경 | 판정 | 영향 Consumer | Migration | Test |", "|---|---|---|---|---|", "| `price: number` → `price: string` | Breaking | Web Checkout, 정산 배치 | v1 유지 후 v2 전환 | 문자열/숫자 Consumer Test |", "| optional `currency` 추가 | Non-breaking | 없음 | 기본 KRW | Unknown currency Test |"].join("\n")
    ],
    5: [
      ["/", "├── /browse                 # Viewer", "│   └── /videos/:id", "├── /creator               # Creator 전용", "│   ├── /videos/new", "│   └── /videos/:id/edit", "└── /advertiser            # Advertiser 전용", "    └── /campaigns", "", "권한 없음: 원래 목적을 보존한 로그인/권한 안내 화면으로 이동"].join("\n"),
      ["| Component | Loading | Empty | Error | Disabled | Success |", "|---|---|---|---|---|---|", "| VideoList | Skeleton 6개 | 추천 검색어 | Retry+오류 ID | 필터 잠금 | 카드 목록 |", "| Checkout | Spinner+금액 고정 | 장바구니 안내 | 입력 보존+재시도 | 중복 결제 방지 | 영수증 |"].join("\n"),
      ["# UX Walkthrough Finding", "", "- Finding: 검색 결과에서 뒤로 오면 필터가 초기화됨", "- 재현: 장르=교육 → 영상 상세 → 뒤로가기", "- 관찰: 사용자가 같은 필터를 다시 입력함", "- 심각도: High (과제 완료 시간 +42초)", "- 수정: URL query에 filter 저장", "- 검증: 뒤로가기 후 장르=교육 유지, 완료 시간 42초→8초"].join("\n")
    ],
    6: [
      ["async function loadVideos(signal) {", "  render({ status: 'loading' });", "  try {", "    const response = await fetch('/api/videos', { signal });", "    if (!response.ok) throw new ApiError(response.status);", "    const videos = (await response.json()).items.map(toVideoCardVM);", "    render({ status: videos.length ? 'success' : 'empty', videos });", "  } catch (error) {", "    if (error.name !== 'AbortError') render({ status: 'error', error });", "  }", "}"].join("\n"),
      ["const transitions = {", "  idle:       { SUBMIT: 'submitting' },", "  submitting: { ACCEPTED: 'pending', INVALID: 'validationError', FAIL: 'error' },", "  pending:    { CONFIRMED: 'success', TIMEOUT: 'error' },", "  error:      { RETRY: 'submitting', CANCEL: 'idle' }", "};", "", "// Error 상태에서도 formData와 idempotencyKey는 보존한다."].join("\n"),
      ["# Debug Log: 무한 요청", "", "- 재현: Dashboard 진입 후 Network 요청이 초당 6회 반복", "- 초기 가설: 서버 Retry 설정 오류", "- 증거: React effect dependency에 매 렌더마다 새 객체 생성", "- 근본 원인: `filters` 객체 참조 변경", "- 최소 수정: primitive dependency 사용", "- 회귀 테스트: 동일 filter에서 API 1회, filter 변경 시 추가 1회"].join("\n")
    ],
    7: [
      ["| Rule ID | 입력 | 조건 | 결과 | 실패 이유 |", "|---|---|---|---|---|", "| CAM-01 | status | ACTIVE가 아님 | 제외 | CAMPAIGN_INACTIVE |", "| CAM-02 | remainingBudget | cost 미만 | 제외 | BUDGET_EXHAUSTED |", "| CAM-03 | target | Viewer와 불일치 | 제외 | TARGET_MISMATCH |"].join("\n"),
      ["class CreateCampaignService {", "  constructor(repository, policy) {", "    this.repository = repository;", "    this.policy = policy;", "  }", "  async execute(command) {", "    const campaign = Campaign.create(command, this.policy);", "    await this.repository.save(campaign);", "    return campaign.id;", "  }", "}", "// Domain 객체는 HTTP와 DB 구현을 import하지 않는다."].join("\n"),
      ["it('동시 요청에서도 budget을 한 번만 차감한다', async () => {", "  await seedCampaign({ budget: 100, impressionCost: 100 });", "  const results = await Promise.allSettled([charge('event-1'), charge('event-2')]);", "  expect(await currentBudget()).toBe(0);", "  expect(results.filter(r => r.status === 'fulfilled')).toHaveLength(1);", "  expect(await chargeCount()).toBe(1);", "});"].join("\n")
    ],
    8: [
      ["| Role | Resource | Action | Ownership | 결과 |", "|---|---|---|---|---|", "| Creator | Video | UPDATE | video.creatorId == user.id | ALLOW |", "| Creator | Video | UPDATE | 타인 소유 | DENY 404 |", "| Advertiser | Campaign | READ | 같은 tenantId | ALLOW |", "| Advertiser | Campaign | READ | 다른 tenantId | DENY 404 |"].join("\n"),
      ["sequenceDiagram", "  Client->>Auth: POST /login", "  Auth->>UserDB: password hash 검증", "  Auth-->>Client: access token + rotating refresh token", "  Client->>Auth: POST /token/refresh", "  Auth->>TokenStore: 이전 refresh token 폐기", "  Auth-->>Client: 새 access/refresh token", "  Note over Auth,TokenStore: 재사용된 refresh token이면 token family 전체 폐기"].join("\n"),
      ["it('다른 tenant의 campaign 수정 요청을 숨긴다', async () => {", "  const token = tokenFor({ role: 'ADVERTISER', tenantId: 'tenant-a' });", "  const response = await patchCampaign('tenant-b-campaign', token, { budget: 0 });", "  expect(response.status).toBe(404);", "  expect(await auditLog()).toContainEqual(expect.objectContaining({ reason: 'TENANT_MISMATCH' }));", "});"].join("\n")
    ],
    9: [
      ["function selectCampaign(campaigns, context) {", "  return campaigns", "    .filter(c => c.status === 'ACTIVE')", "    .filter(c => c.remainingBudget >= c.impressionCost)", "    .filter(c => matchesTarget(c.target, context.viewer))", "    .filter(c => exposureCount(c.id, context.viewer.id, 24) < 3)", "    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0] ?? null;", "}"].join("\n"),
      ["{", "  \"eventId\": \"evt-0192\",", "  \"eventType\": \"AdImpressionRecorded\",", "  \"occurredAt\": \"2026-09-28T01:02:03Z\",", "  \"correlationId\": \"playback-771\",", "  \"campaignId\": \"cam-7\",", "  \"viewerId\": \"viewer-21\",", "  \"chargeAmount\": { \"value\": 15, \"currency\": \"KRW\" }", "}"].join("\n"),
      ["| Trace | 단계 | 기대 상태 | 실제 증거 | 판정 |", "|---|---|---|---|---|", "| playback-771 | AdSelected | cam-7 선택 | log line 182 | PASS |", "| playback-771 | Charge | 15 KRW 차감 1회 | ledger row 991 | PASS |", "| playback-771 | Analytics | impression +1 | event evt-0192 | PASS |"].join("\n")
    ],
    10: [
      ["| Scenario | Given | When | Then | 증거 |", "|---|---|---|---|---|", "| E2E-01 신규 구매 | 신규 Viewer, 재고 있음 | 가입→구매→재생 | 영수증 1건, 재생 시작 | screenshot + traceId |", "| FAIL-03 PG Timeout | 승인 결과 지연 | 결제 제출 | Pending 안내, 중복 승인 없음 | PG log + ledger |"].join("\n"),
      ["# Release Readiness", "", "- [x] Production build 재현 (`npm ci && npm run build`)", "- [x] DB migration dry-run 및 row count 검증", "- [x] Secret이 저장소에 없고 배포 환경에 주입됨", "- [x] `/health`가 DB·Queue 의존성을 구분해 보고", "- [x] Rollback v1.9.2를 Staging에서 7분 내 완료", "- Evidence: `release-evidence/2026-09-28/`"].join("\n"),
      ["# Decision 2: 결제 Event Outbox 채택", "", "- 문제: 주문 저장 후 Event 발행 실패 시 과금 누락", "- 검토 대안: DB Transaction만 사용 / 분산 Transaction / Outbox", "- 선택: Outbox", "- Trade-off: Poller 운영 비용 증가, 대신 Event 유실 방지", "- AI 활용: 대안 목록과 실패 시나리오 생성", "- 개발자 검증: Failure Injection 20회에서 누락 0건", "- Demo: DB commit 후 Broker 장애 → 재처리 화면 시연"].join("\n")
    ]
  };

  function explain(type, item) {
    if (type === "skill") {
      return [
        "분석 단계: 첫 번째 작업에서는 제공 자료의 어떤 입력·정책·현재 동작이 문제와 연결되는지 표시합니다. AI를 열기 전에 근거 위치와 자신의 가설을 먼저 기록하세요.",
        "설계·구현 단계: 두 번째 작업에서는 표, 다이어그램, 코드 또는 테스트를 직접 작성합니다. AI에는 완성본이 아니라 빠진 경계값과 반례를 질문합니다.",
        "검증 단계: 세 번째 작업에서는 실행 결과와 완료 기준을 대조합니다. 실패한 테스트, 수정 전후 Diff, 유지·기각한 AI 제안을 증거로 남기세요."
      ];
    }
    return [
      "이슈 확인 단계: 첫 번째 작업에서는 AI 결과와 원본 자료를 문장 단위로 대조해 사실, AI의 가정, 누락된 질문을 구분합니다. 문제라고 판정한 근거 위치를 함께 적으세요.",
      "역할 협업 단계: 두 번째 작업에서는 기획자가 사용자·정책·범위를, 개발자가 시스템 제약·실패 사례·검증 방법을 각각 작성한 뒤 서로의 빈칸을 질문합니다.",
      "공동 결정 단계: 세 번째 작업에서는 AI가 결론을 내리게 하지 말고 팀이 선택안을 확정합니다. 결정 근거, 담당자, 완료 조건, 재검토 시점을 산출물에 남기세요."
    ];
  }

  function missionExample(item) {
    return [
      "# " + item.title + " — 공동 의사결정 기록 예시",
      "",
      "## 확인된 문제",
      "- " + item.pbl.brief,
      "- 근거 자료: `" + item.pbl.inputs[0] + "`의 관련 항목과 AI 결과를 대조함",
      "",
      "| 구분 | 기록 예시 | 담당 | 검증 증거 |",
      "|---|---|---|---|",
      "| 확인된 사실 | 원본 자료에 명시된 조건만 사실로 인정 | 기획자 | 원문 인용·정책 ID |",
      "| AI의 가정 | 근거가 없는 제안은 결정에서 제외하고 질문으로 전환 | 공동 | AI 출력 Diff |",
      "| 기획 판단 | " + item.planner + " | 기획자 | 사용자 시나리오·정책표 |",
      "| 개발 검증 | " + item.developer + " | 개발자 | Test·Log·PoC |",
      "| 공동 결정 | 수정안을 적용하되 첫 완료 기준을 Release Gate로 사용 | 공동 | " + item.pbl.done[0] + " |",
      "",
      "## Action Items",
      "- [ ] 기획자: 정책·메시지·범위 확정",
      "- [ ] 개발자: 재현 Test와 수정 Diff 제출",
      "- [ ] 공동: Acceptance Criteria 통과 후 Decision 상태를 `APPROVED`로 변경"
    ].join("\n");
  }

  window.attachPblExamples = function () {
    for (var day = 1; day <= 10; day += 1) {
      days[day].skills.forEach(function (item, index) {
        item.pbl.explanation = explain("skill", item);
        item.pbl.example = skillExamples[day][index];
        item.pbl.exampleType = [2, 3].indexOf(day) >= 0 && index === 1 ? "mermaid" : "text";
      });
      days[day].missions.forEach(function (item) {
        item.pbl.explanation = explain("mission", item);
        item.pbl.example = missionExample(item);
        item.pbl.exampleType = "markdown";
      });
    }
  };
})();

/* PBL 실행 과제: 각 카드가 설명이 아니라 실제 수행 가능한 프로젝트가 되도록 보강한다. */
(function () {
  "use strict";
  var days = window.LMS_CURRICULUM;
  if (!days) return;

  function task(brief, inputs, work, done) {
    return { brief: brief, inputs: inputs, work: work, done: done };
  }

  function apply(day, project, skillTasks, missionTasks) {
    days[day].project = project;
    days[day].skills.forEach(function (item, index) { item.pbl = skillTasks[index]; });
    days[day].missions.forEach(function (item, index) { item.pbl = missionTasks[index]; });
  }

  apply(1, "Streamly OTT 서비스의 요구사항과 Domain을 정의한다.", [
    task("회의록 속 모호한 요청을 개발 가능한 Persona·Goal·Data 표로 바꾸세요.", ["streamly-kickoff-notes.md", "persona-evidence-sheet.md"], ["Viewer·Creator·Advertiser·Admin별로 원문 근거 2개를 인용합니다.", "각 Persona의 Goal 2개, 행동 3개, 생성·조회 데이터 3개를 작성합니다.", "AI에게 누락 질문만 받은 뒤 근거 없는 항목을 삭제하거나 ‘가설’로 표시합니다."], ["4개 Persona가 모두 작성됨", "모든 항목에 원문 근거 또는 가설 표시가 있음", "Domain 후보 5개 이상을 도출함"]),
    task("18개 Feature를 책임과 변경 이유가 같은 Domain으로 직접 분류하세요.", ["day1-feature-list.csv", "persona-domain-notes.md"], ["각 Feature에 업무 책임자와 주로 함께 변경되는 정책을 적습니다.", "Feature를 5~8개 Domain으로 묶고 중복 배치한 항목은 하나의 Owner를 정합니다.", "AI가 제시한 경계 반례 3개를 검토해 최소 2개 분류를 수정하거나 유지 근거를 씁니다."], ["18개 Feature가 빠짐없이 배치됨", "각 Domain에 한 문장 책임 정의가 있음", "경계 결정 3건의 근거가 기록됨"]),
    task("Domain 간 데이터 소유권과 의존 방향을 Context Map으로 완성하세요.", ["feature-domain-map.md", "day1-data-catalog.csv"], ["User Profile·Video·Playback·Campaign·Invoice의 원본 Owner를 지정합니다.", "Domain 간 동기 호출과 Event 전달을 다른 화살표로 그립니다.", "AI 리뷰에서 찾은 순환 의존 또는 중복 소유권을 2건 이상 해결합니다."], ["핵심 데이터 5종에 단일 Owner가 있음", "모든 화살표에 전달 데이터가 표시됨", "순환 의존이 없거나 예외 근거가 있음"])
  ], [
    task("AI 회의 요약본에서 누락·왜곡된 결정을 찾아 원문 근거와 함께 복원하세요.", ["kickoff-transcript.md", "ai-meeting-summary.md"], ["두 문서를 대조해 누락 3건, 왜곡 2건, 미결정 오인 2건을 찾습니다.", "기획자는 결정 상태와 원문 인용을, 개발자는 구현 영향을 적습니다.", "7건을 수정·보류·추가 질문으로 공동 분류합니다."], ["문제 7건 이상 발견", "모든 항목에 원문 인용과 영향이 있음", "공동 결정자와 후속 담당자가 있음"]),
    task("AI가 만든 모호한 요구사항 6개를 테스트 가능한 완료 조건으로 바꾸세요.", ["ai-requirements-draft.md", "service-policy.md"], ["‘빠르게·안전하게·간편하게’ 등 측정 불가 표현을 표시합니다.", "기획자는 허용 범위와 예시를, 개발자는 정상·실패·경계 조건을 작성합니다.", "Given–When–Then 형식의 Acceptance Criteria를 요구사항마다 2개씩 만듭니다."], ["요구사항 6개가 수정됨", "Acceptance Criteria 12개 이상", "정책 미확정 항목은 질문으로 분리됨"]),
    task("AI Persona에 포함된 근거 없는 사용자 가정을 찾아 제품 범위에서 제거하세요.", ["ai-persona-report.md", "user-interview-quotes.md"], ["근거 없는 나이·숙련도·결제 성향 가정을 5개 이상 찾습니다.", "기획자는 사실·가설·조사 필요로 분류하고 개발자는 데이터 필드·권한 분기에 미친 영향을 표시합니다.", "제품에 반영 가능한 Persona 카드 2장과 검증 백로그를 만듭니다."], ["가정 5개 이상 분류", "코드·데이터 영향이 연결됨", "검증 전 가정을 기능 조건으로 사용하지 않음"]),
    task("AI Domain Map의 중복 데이터 소유권 충돌을 해결하는 회의를 진행하세요.", ["ai-domain-map.mmd", "ownership-conflict-log.md"], ["회원·결제·정산 Domain이 중복 소유한 데이터 3개를 찾습니다.", "기획자는 정책 변경 주체, 개발자는 Source of Truth와 Event 전달안을 제시합니다.", "각 데이터의 Owner·Consumer·실패 시 복구 책임을 결정표로 확정합니다."], ["충돌 3건을 모두 결정함", "Owner는 데이터마다 하나임", "전달 실패와 복구 책임자가 기록됨"])
  ]);

  apply(2, "Streamly의 업로드·재생·광고 흐름과 시스템 Sequence를 설계한다.", [
    task("Video Upload·Playback·Advertising 사용자 Flow 3종을 완성하세요.", ["03_DOMAIN_MAP.md", "day2-flow-template.md"], ["각 Flow의 Actor·시작 조건·완료 조건을 먼저 적습니다.", "사용자 행동과 시스템 처리를 구분해 정상 단계 6개 이상을 작성합니다.", "권한 실패·네트워크 중단을 포함한 대안 Flow를 각 2개씩 추가합니다."], ["Flow 3종 완성", "각 Flow에 정상 6단계와 예외 2개 이상", "모든 단계에 책임 주체가 있음"]),
    task("세 User Flow를 Mermaid Sequence Diagram으로 직접 변환하세요.", ["04_USER_FLOW.md", "sequence-starter.mmd"], ["Client·API·Domain Service·DB·외부 시스템 Lifeline을 정의합니다.", "동기/비동기 호출, 응답, Timeout, Retry를 표시합니다.", "Mermaid를 렌더링하고 메시지 누락·역방향 의존을 AI 리뷰 후 수정합니다."], ["렌더링 가능한 Diagram 3종", "각 Diagram에 예외 흐름 2개 이상", "모든 메시지에 요청·응답 또는 Event가 있음"]),
    task("24시간 3회 광고 노출 제한 Rule과 테스트를 구현하세요.", ["ad-impression-sample.json", "frequency-cap-starter.js"], ["User ID·Campaign ID·노출 시각을 사용한 규칙 의사코드를 작성합니다.", "23:59 경계, 익명 사용자, 동시 요청, 캐시 만료 테스트 8개를 만듭니다.", "직접 구현한 함수로 샘플 데이터를 실행하고 실패 테스트를 고칩니다."], ["자동 테스트 8개 이상 통과", "동시 네 번째 요청이 차단됨", "제외 이유를 결과로 반환함"])
  ], [
    task("AI 변경 영향도 분석에서 빠진 항목을 찾아 배포 가능한 수정 계획을 만드세요.", ["phone-auth-change-request.md", "ai-impact-report.md", "system-map.md"], ["화면·API·DB·개인정보·운영 영역별 누락을 2개씩 찾습니다.", "기획자는 변경 목적과 제외 범위, 개발자는 Migration과 Rollback 영향을 씁니다.", "필수 수정·추가 확인·이번 배포 제외로 분류한 공동 계획을 만듭니다."], ["영역별 누락 총 10개 이상", "각 항목에 근거와 담당자 있음", "배포·롤백 단계가 포함됨"]),
    task("AI 이슈 리포트의 잘못된 우선순위와 추정 담당자를 교정하세요.", ["meeting-log.md", "issue-history.csv", "ai-weekly-report.md"], ["원문 근거가 없는 담당자·마감일·심각도 6건을 표시합니다.", "기획자는 사업 영향, 개발자는 재현 가능성과 선행 조건을 평가합니다.", "P0~P3 기준을 정의하고 상위 5개 이슈의 실행 순서를 합의합니다."], ["오류 6건 이상 교정", "우선순위 기준이 문서화됨", "상위 5개에 Owner와 완료 조건이 있음"]),
    task("결제 Timeout을 실패로 처리한 AI Sequence를 안전하게 수정하세요.", ["ai-payment-sequence.mmd", "pg-status-table.md"], ["승인 거절·응답 지연·웹훅 대기를 서로 다른 상태로 분리합니다.", "기획자는 상태별 문구와 버튼, 개발자는 Idempotency와 조회 API를 정의합니다.", "미확정 결제의 재조회·완료·취소 Sequence와 Acceptance Criteria를 만듭니다."], ["결제 상태 5개 이상 정의", "무조건 재승인 경로가 없음", "각 상태의 사용자 행동이 명확함"]),
    task("BLE 동기화 장애를 사용자 시나리오와 기술 복구 흐름으로 완성하세요.", ["wearable-sync-log.json", "ai-sync-design.md"], ["중복·역순·오프라인·경고 지연 사례를 재현 데이터에서 찾습니다.", "기획자는 안내와 허용 지연을, 개발자는 캐시·재전송·중복 제거를 정합니다.", "4개 장애별 사용자 메시지·시스템 처리·완료 조건 표를 작성합니다."], ["장애 4종 모두 처리", "데이터 중복 제거 기준이 있음", "의료 경고 지연의 Escalation이 있음"])
  ]);

  apply(3, "Streamly의 핵심 데이터를 정규화하고 ERD로 연결한다.", [
    task("Sequence 메시지에서 Entity·Value Object·Event를 도출하세요.", ["05_SEQUENCE.md", "entity-candidate-sheet.csv"], ["메시지 명사와 상태 변화를 표시해 후보 15개 이상을 수집합니다.", "후보를 Entity·Value Object·Event·단순 속성으로 분류하고 이유를 씁니다.", "핵심 Entity 6개의 식별자와 상태 전이를 정의합니다."], ["후보 15개 이상 분류", "핵심 Entity 6개 이상", "모든 상태가 Sequence 근거와 연결됨"]),
    task("주문·결제·쿠폰 데이터의 3NF ERD를 직접 설계하세요.", ["commerce-flat-table.csv", "normalization-workbook.md"], ["반복 그룹과 부분·이행 함수 종속을 표시합니다.", "1NF→2NF→3NF 변환 과정을 표로 기록하고 PK·FK·Unique를 정의합니다.", "샘플 20행을 넣어 삽입·수정·삭제 이상이 사라졌는지 검증합니다."], ["3NF 테이블과 변환 근거가 있음", "Cardinality와 제약이 표시됨", "세 가지 이상 현상 테스트 통과"]),
    task("Domain–Flow–ERD 추적 행렬을 만들고 불일치를 수정하세요.", ["03_DOMAIN_MAP.md", "04_USER_FLOW.md", "06_ERD.md"], ["각 Flow 단계의 CRUD Entity와 소유 Domain을 표로 연결합니다.", "고아 Entity·누락 필드·타 Domain 직접 쓰기를 5건 이상 찾습니다.", "수정 전후 ERD 또는 Flow Diff와 판정 근거를 제출합니다."], ["모든 Flow 단계가 Entity에 매핑됨", "불일치 5건 이상 판정", "직접 쓰기 위반이 제거됨"])
  ], [
    task("AI가 임의 생성·병합한 Entity를 원문 근거로 판정하세요.", ["ai-erd.mmd", "requirements.md", "term-dictionary.csv"], ["근거 없는 Entity·속성 5개와 잘못 병합된 용어 3개를 찾습니다.", "기획자는 업무 의미, 개발자는 식별자·생명주기를 기록합니다.", "유지·삭제·분리·추가 질문으로 판정하고 ERD를 수정합니다."], ["문제 8건 이상 판정", "모든 판정에 양쪽 근거가 있음", "수정 ERD가 렌더링됨"]),
    task("승인·확정·완료를 하나로 합친 AI 용어 사전을 교정하세요.", ["ai-term-dictionary.csv", "order-state-cases.md"], ["상태별 업무 책임과 사용자 화면 차이를 기획자가 작성합니다.", "개발자는 Enum과 허용 전이, API·DB 명칭을 제안합니다.", "상태 전이표와 표준 한글·영문·코드명 사전을 확정합니다."], ["상태 3개의 의미가 분리됨", "금지 전이가 정의됨", "화면·API·DB 용어가 매핑됨"]),
    task("AI 정규화안이 과거 주문 가격을 바꾸는 문제를 해결하세요.", ["ai-order-schema.sql", "price-change-scenario.md"], ["가격 변경 전후 주문을 넣어 과거 금액 변경 문제를 재현합니다.", "기획자는 보존 정책, 개발자는 Snapshot·참조 방식의 장단점을 제시합니다.", "선택한 모델과 Migration·검증 쿼리를 공동 승인합니다."], ["문제가 SQL로 재현됨", "대안 2개 이상 비교", "과거 주문 금액 보존 테스트 통과"]),
    task("컬럼 변경이 API·화면·배치에 미치는 영향을 공동 추적하세요.", ["schema-change.diff", "dependency-inventory.csv", "ai-impact-note.md"], ["AI가 누락한 Consumer를 코드·문서 검색으로 5개 이상 찾습니다.", "기획자는 지표·화면 용어, 개발자는 Migration·호환 계층을 확인합니다.", "단계적 변경·검증·롤백 체크리스트를 만듭니다."], ["Consumer 5개 이상 추가", "하위 호환 기간이 있음", "롤백과 데이터 검증 쿼리가 있음"])
  ]);

  apply(4, "Streamly의 Domain 기반 API Contract를 설계하고 검증한다.", [
    task("Video·Playback·Campaign·Ad Serving Endpoint를 설계하세요.", ["03_DOMAIN_MAP.md", "endpoint-template.csv"], ["Domain별 Resource와 가능한 상태 변화를 작성합니다.", "URI·HTTP Method·권한·멱등성 여부를 Endpoint 12개에 지정합니다.", "RPC 형태와 타 Domain 책임 누수를 찾아 최소 3개 Endpoint를 개선합니다."], ["Endpoint 12개 이상", "모든 항목에 권한과 멱등성 표시", "Domain Owner와 URI가 일치함"]),
    task("OpenAPI Request·Response·Error Contract를 완성하세요.", ["api-spec-starter.yaml", "validation-rules.md"], ["핵심 Endpoint 6개의 Schema와 필수·선택 필드를 작성합니다.", "정상·Validation·권한·충돌·서버 오류 예시를 만듭니다.", "OpenAPI Validator로 검사하고 오류 예시가 공통 Error Schema를 따르게 수정합니다."], ["Validator 오류 0건", "Endpoint별 오류 3종 이상", "오류 코드가 사용자 행동과 연결됨"]),
    task("API 변경 Diff의 Breaking Change와 Consumer 영향을 판정하세요.", ["api-v1.yaml", "api-v2-draft.yaml", "consumer-list.csv"], ["필드 삭제·타입 변경·필수화·Enum 추가를 분류합니다.", "Consumer별 실패 가능성과 Migration 방법을 작성합니다.", "부정 테스트 8개와 Deprecation 계획을 만들어 검증합니다."], ["변경 전부 Breaking 여부 판정", "Consumer Owner와 조치가 있음", "부정 테스트 8개 이상"])
  ], [
    task("AI API 명세가 빠뜨린 취소·중복·권한 흐름을 추가하세요.", ["ai-api-spec.yaml", "user-flow-cases.md"], ["사용자 Flow를 기준으로 누락 Endpoint·오류·상태 8개를 찾습니다.", "기획자는 실패 후 기대 상태, 개발자는 계약 변경안을 작성합니다.", "요구사항–Endpoint–Test 추적표를 공동 완성합니다."], ["누락 8건 이상", "모든 Flow가 API와 연결됨", "각 계약에 검증 Test가 있음"]),
    task("모든 실패를 400으로 처리한 AI 오류 규격을 복구 가능하게 바꾸세요.", ["ai-error-catalog.csv", "support-cases.md"], ["오류를 Validation·Auth·Conflict·Rate Limit·Server로 분류합니다.", "기획자는 메시지·다음 행동, 개발자는 Status·Code·Retry 가능 여부를 정합니다.", "오류 10개의 공통 Contract와 UI 처리표를 만듭니다."], ["오류 10개 이상 정의", "보안 정보 노출이 없음", "사용자 복구 행동이 있음"]),
    task("AI가 추정한 외부 API 동작을 검증 가능한 가정으로 분리하세요.", ["ai-openbanking-spec.md", "provider-doc-excerpt.md"], ["공식 문서 근거가 없는 토큰·Timeout·Retry 가정 6개를 표시합니다.", "기획자는 공급사 확인 질문, 개발자는 Mock 기본값과 격리 방법을 만듭니다.", "확정 전 구현 가능한 범위와 Blocked 범위를 합의합니다."], ["가정 6개 이상 분리", "확인 Owner와 기한이 있음", "Mock이 미확정 가정을 명시함"]),
    task("AI가 안전하다고 분류한 응답 필드 삭제를 출시 계획으로 재평가하세요.", ["breaking-change.diff", "api-usage-report.csv"], ["영향 받는 앱 화면·운영 리포트·파트너를 찾습니다.", "기획자는 출시 영향, 개발자는 호환 계층과 Deprecation 기간을 제안합니다.", "단계별 배포·모니터링·롤백 승인서를 작성합니다."], ["모든 Consumer가 식별됨", "Deprecation 기간과 공지가 있음", "롤백 Trigger가 수치로 정의됨"])
  ]);

  apply(5, "Streamly의 Persona별 화면 구조와 UI 상태를 설계한다.", [
    task("Viewer·Creator·Advertiser의 IA와 Screen Flow를 설계하세요.", ["persona-goals.md", "screen-inventory.csv"], ["Persona별 Top Task 3개와 필요한 화면을 연결합니다.", "Sitemap과 핵심 Flow를 만들고 권한 없는 접근 경로를 표시합니다.", "AI 모의 사용자 탐색에서 막힌 지점 5개를 찾아 Route를 수정합니다."], ["Persona 3종의 Top Task 경로가 있음", "모든 화면에 Route와 권한이 있음", "탐색 문제 5개 이상 개선"]),
    task("Video Card·Player·Checkout Component State Matrix를 완성하세요.", ["component-list.md", "state-matrix-template.csv"], ["각 Component의 Loading·Empty·Error·Disabled·Success를 정의합니다.", "키보드 Focus·ARIA Label·오류 알림 동작을 적습니다.", "Story 또는 정적 Demo로 15개 상태를 직접 렌더링합니다."], ["Component 3개×상태 5개", "접근성 동작 포함", "15개 상태의 화면 증거가 있음"]),
    task("초보 사용자 Walkthrough로 실제 UX 문제를 수정하세요.", ["prototype/index.html", "walkthrough-log.md"], ["가입→검색→재생 과정을 말로 설명하며 직접 수행하고 클릭·혼란 로그를 남깁니다.", "재현 가능한 문제 6개를 심각도와 근거로 분류합니다.", "상위 3개를 코드 또는 화면 명세로 고치고 전후 시간을 비교합니다."], ["문제 6개 이상", "상위 3개 수정 완료", "전후 증거와 사용자 영향이 있음"])
  ], [
    task("AI Persona의 고정관념을 제거하고 포용적 UX 요구사항을 만드세요.", ["ai-senior-persona.md", "interview-evidence.md"], ["근거 없는 제한·편견 5개를 찾아 표시합니다.", "기획자는 실제 어려움, 개발자는 접근성 대안을 제시합니다.", "기능 삭제 없이 가독성·피드백·조작 지원 요구사항을 8개 만듭니다."], ["편견 5개 이상 제거", "요구사항 8개 이상", "각 요구사항에 검증 방법이 있음"]),
    task("AI의 사용성 9점 평가를 실제 측정 계획으로 교체하세요.", ["ai-ux-score.md", "prototype/index.html"], ["근거 없는 점수와 주장 6개를 표시합니다.", "완료율·오류율·소요시간·이탈 구간을 측정할 과제 3개를 설계합니다.", "3명 모의 테스트 데이터를 수집해 점수와 개선 우선순위를 다시 계산합니다."], ["측정 과제 3개", "관찰 데이터 3명분", "새 점수에 계산 근거가 있음"]),
    task("AI UI 초안에서 누락된 정책·권한·실패 화면을 복원하세요.", ["ai-prototype.html", "requirements-trace.csv"], ["비회원·권한 없음·결제 실패·Empty 상태 누락을 찾습니다.", "기획자는 메시지, 개발자는 UI State와 API 의존성을 작성합니다.", "누락 화면 5개를 Wireframe 또는 HTML로 추가하고 추적표를 갱신합니다."], ["누락 5건 이상", "요구사항 ID와 화면이 연결됨", "각 화면에 다음 행동이 있음"]),
    task("AI가 제안한 과도한 인터랙션을 MVP 범위로 협상하세요.", ["ai-ui-ideas.md", "release-capacity.md"], ["제안 12개를 사용자 가치·개발 비용·성능·접근성으로 평가합니다.", "기획자는 MoSCoW, 개발자는 복잡도와 위험을 산정합니다.", "이번 Sprint 3개, 실험 2개, 제외 항목과 근거를 합의합니다."], ["12개 전부 평가", "Sprint 범위가 Capacity 이내", "제외 근거와 재검토 조건이 있음"])
  ]);

  apply(6, "Streamly 프론트엔드를 API와 연결하고 실패 UX를 구현한다.", [
    task("영상 목록 화면을 실제 API Contract와 연결하세요.", ["video-list-starter.js", "api-spec.yaml", "mock-server.json"], ["Fetch 함수와 DTO→View Model 변환을 직접 작성합니다.", "Loading·Success·Empty·401·500 상태를 화면에 연결합니다.", "느린 응답과 요청 취소를 재현해 Race Condition을 수정합니다."], ["5개 UI 상태 동작", "Contract와 다른 필드 접근 없음", "중복·취소 요청 테스트 통과"]),
    task("Checkout 상태 머신과 실패 복구 UX를 구현하세요.", ["checkout-starter.html", "failure-cases.json"], ["Idle→Submitting→Pending→Success/Error 전이를 그립니다.", "Timeout·중복 클릭·Validation·서버 오류를 주입합니다.", "입력 보존·재시도·문의 경로를 구현하고 8개 상태 테스트를 통과시킵니다."], ["상태 전이표와 코드 일치", "실패 시 입력이 보존됨", "상태 테스트 8개 이상"]),
    task("재현 가능한 절차로 프론트엔드 버그 3개를 고치세요.", ["buggy-dashboard/", "bug-report-template.md"], ["무한 요청·전역 상태 오염·키보드 접근 불가를 각각 재현합니다.", "AI 질문 전 자신의 원인 가설과 증거를 작성합니다.", "최소 수정과 리팩터링을 적용하고 회귀 테스트·전후 로그를 남깁니다."], ["버그 3개 모두 재현·수정", "원인 증거와 실패 가설 기록", "회귀 테스트 6개 이상"])
  ], [
    task("AI 생성 화면 코드가 위반한 정책을 찾아 수정 범위를 합의하세요.", ["ai-generated-checkout/", "checkout-policy.md"], ["취소 수수료·권한·가격 계산·개인정보 정책 이탈 6개를 찾습니다.", "기획자는 기대 결과, 개발자는 코드 경로와 테스트를 연결합니다.", "P0/P1 수정 목록과 Acceptance Criteria를 공동 작성합니다."], ["정책 이탈 6개 이상", "모든 항목에 코드 위치가 있음", "P0/P1 완료 조건이 테스트 가능함"]),
    task("AI가 단정한 CORS 원인을 증거로 검증하세요.", ["browser-network-log.har", "server-config.txt", "ai-debug-answer.md"], ["사용자 증상과 발생 조건을 기획자가 정리합니다.", "개발자는 Network·서버 로그로 가설 3개를 검증합니다.", "근본 원인·임시 대응·영구 수정·사용자 공지를 분리해 Incident Log를 완성합니다."], ["가설 3개 검증", "근본 원인 증거가 있음", "임시와 영구 조치가 분리됨"]),
    task("AI 코드 리뷰 20건을 실제 수정 우선순위로 정리하세요.", ["ai-review-comments.csv", "release-scope.md"], ["스타일·버그·보안·데이터 손실로 분류하고 재현 여부를 확인합니다.", "기획자는 사용자 영향, 개발자는 수정 위험과 회귀 범위를 점수화합니다.", "즉시 수정 5건과 보류 항목의 근거를 합의합니다."], ["20건 모두 판정", "즉시 수정 5건에 Owner 있음", "보류 항목에 재검토 조건이 있음"]),
    task("AI 리팩터링 전후 기능 보존을 공동 검증하세요.", ["before.js", "ai-refactored.js", "behavior-checklist.md"], ["Diff에서 삭제된 정책·오류 처리·재시도 로직을 찾습니다.", "기획자는 사용자 행동 8개, 개발자는 Characterization Test를 작성합니다.", "테스트 실패를 수정하고 안전한 Refactor Diff를 제출합니다."], ["행동 체크 8개", "Characterization Test 통과", "삭제된 정책이 복원되거나 합의됨"])
  ]);

  apply(7, "Streamly의 광고 Campaign Business Logic과 Backend를 구현한다.", [
    task("Campaign·Budget·Target Business Rule 10개를 실행 가능한 표로 만드세요.", ["campaign-policy.md", "decision-table-template.csv"], ["각 Rule의 입력·조건·결과·실패 이유를 작성합니다.", "경계값과 충돌 우선순위를 정하고 반례 10개를 만듭니다.", "Decision Table을 코드 테스트로 옮겨 전부 통과시킵니다."], ["Rule 10개 완성", "반례 테스트 10개 이상", "충돌 우선순위가 결정적임"]),
    task("Campaign 생성 Use Case를 계층 분리해 구현하세요.", ["backend-starter/", "09_BUSINESS_RULE.md"], ["Controller·Application Service·Domain Service·Repository 책임을 나눕니다.", "In-memory Repository로 단위 테스트를 먼저 작성합니다.", "AI 구조 리뷰에서 찾은 계층 누수 3개를 수정합니다."], ["Domain Rule이 DB 없이 테스트됨", "계층 누수 3개 이상 판정", "성공·실패 테스트 8개 이상"]),
    task("예산 차감 Transaction과 예외 처리를 검증하세요.", ["billing-service-starter/", "failure-injection-cases.md"], ["동시 요청 20개·Budget 소진·DB 실패를 주입합니다.", "부분 성공과 중복 차감을 로그·DB 상태로 확인합니다.", "Transaction 경계·Idempotency·예외 변환을 수정해 테스트를 통과시킵니다."], ["동시성 테스트 통과", "중복·음수 Budget 없음", "호출자별 예외 코드가 있음"])
  ], [
    task("AI가 잘못 해석한 예산 경계와 시간 기준을 공동 수정하세요.", ["ai-business-rules.md", "campaign-policy.md"], ["이하/미만·KST/UTC·Rule 우선순위 오류 6개를 찾습니다.", "기획자는 정책 예시, 개발자는 경계 테스트를 작성합니다.", "수정 Rule 표와 테스트 결과를 공동 승인합니다."], ["해석 오류 6개 이상", "경계 테스트 10개 이상", "승인자와 효력 시점이 있음"]),
    task("무조건 재시도하는 AI 예외 처리의 사용자·데이터 위험을 해결하세요.", ["ai-retry-policy.md", "order-incident-log.md"], ["중복 주문·장기 대기·사용자 오인의 위험을 표시합니다.", "기획자는 대기·취소 기준, 개발자는 Retryable 분류와 멱등성을 정합니다.", "예외–메시지–복구 행동–운영 대응 표를 만듭니다."], ["예외 8개 이상 분류", "무한·무조건 Retry 없음", "사용자와 운영 행동이 연결됨"]),
    task("주문 저장 후 Event 발행 실패의 완료 상태를 합의하세요.", ["partial-success-timeline.md", "architecture-options.md"], ["기획자는 주문 완료 표시 조건을, 개발자는 Outbox·보상 대안을 제시합니다.", "대안 3개의 일관성·복잡도·운영 비용을 비교합니다.", "선택안의 상태 전이·재처리·관측 Acceptance Criteria를 작성합니다."], ["대안 3개 비교", "부분 성공 상태가 명시됨", "재처리와 운영 Owner가 있음"]),
    task("AI Agent가 Rule을 자동 수정할 때의 승인·감사 절차를 설계하세요.", ["agent-change.diff", "policy-approval-matrix.md"], ["변경된 할인 Rule과 테스트가 정책 승인을 받았는지 확인합니다.", "기획자는 정책 승인자, 개발자는 Diff·배포·롤백 책임을 정의합니다.", "Agent 변경 요청서와 Human Approval Gate를 설계합니다."], ["정책 변경 3건 판정", "승인 전 배포가 차단됨", "Audit Log와 Rollback Owner가 있음"])
  ]);

  apply(8, "Streamly의 인증·인가와 다중 Role 보안을 구현한다.", [
    task("4개 Role의 화면·API·데이터 Permission Matrix를 완성하세요.", ["role-resource-list.csv", "permission-matrix-template.csv"], ["Viewer·Creator·Advertiser·Admin의 Resource×Action 권한을 작성합니다.", "Ownership과 Tenant 조건을 별도 열로 정의합니다.", "IDOR·Role 위조 반례 12개를 테스트로 만들어 권한표를 수정합니다."], ["4 Role×핵심 Resource 권한표", "Ownership 조건 포함", "금지 테스트 12개 이상"]),
    task("Signup·Login·Refresh·Logout 인증 흐름을 구현하세요.", ["auth-starter/", "token-policy.md"], ["비밀번호 Hash와 Session/JWT 생명주기를 Sequence로 그립니다.", "발급·만료·갱신·폐기 코드를 직접 구현합니다.", "토큰 탈취·재사용·동시 갱신 테스트를 실행하고 방어를 보완합니다."], ["인증 Flow 4종 동작", "평문 비밀번호 저장 없음", "공격 테스트 8개 이상"]),
    task("인가 우회 Negative Test를 작성하고 서버 검증을 패치하세요.", ["api-test-starter.js", "permission-matrix.csv"], ["타인 데이터 수정·Admin API·Role 위조·Tenant 교차 접근을 시도합니다.", "실패한 Endpoint의 서버 권한 검사를 수정합니다.", "403/404 정책과 Security Audit Log를 검증합니다."], ["Negative Test 12개 이상", "UI에만 의존한 권한 검사 없음", "금지 접근 Audit Log가 남음"])
  ], [
    task("AI가 제안한 가입 정보의 개인정보 과수집을 제거하세요.", ["ai-signup-fields.csv", "privacy-purpose-sheet.md"], ["필드마다 수집 목적·필수 여부·보관 기간·삭제 조건을 작성합니다.", "기획자는 사용자 가치, 개발자는 암호화·접근·삭제 비용을 검토합니다.", "필수·선택·제외로 판정하고 가입 Contract를 수정합니다."], ["모든 필드 판정", "제외 또는 선택 전환 3개 이상 검토", "보관·삭제 정책이 있음"]),
    task("상세 로그인 실패 메시지의 계정 열거 위험을 해결하세요.", ["ai-login-copy.md", "attack-simulation.log"], ["이메일 존재 여부가 노출되는 응답을 재현합니다.", "기획자는 통합 안내와 지원 경로, 개발자는 Rate Limit·Lockout을 정합니다.", "사용자 UX와 보안을 함께 만족하는 메시지·API 규격을 테스트합니다."], ["계정 열거가 불가능함", "정상 사용자 복구 경로가 있음", "Rate Limit 테스트 통과"]),
    task("AI 권한표에 빠진 Ownership·Tenant 조건을 추가하세요.", ["ai-permission-matrix.csv", "multi-tenant-cases.md"], ["같은 Role 간 타인·타 Tenant 접근 8개를 시도합니다.", "기획자는 협업·위임 규칙, 개발자는 서버 Condition을 정의합니다.", "권한표와 Integration Test를 갱신합니다."], ["교차 접근 8개 차단", "위임 예외가 정책 근거와 연결됨", "Tenant ID 위조 테스트 통과"]),
    task("AI 보안 리포트의 오탐·누락·심각도를 재판정하세요.", ["ai-security-report.md", "application-logs/", "threat-model.md"], ["Finding 12개를 재현 가능·오탐·추가 조사로 분류합니다.", "기획자는 사용자·규제 영향, 개발자는 PoC와 수정 위험을 평가합니다.", "최종 Severity와 P0/P1 수정 계획을 합의합니다."], ["Finding 12개 모두 판정", "Critical/High에 재현 증거 있음", "수정 Owner와 회귀 Test가 있음"])
  ]);

  apply(9, "Streamly의 광고 선택·과금·Analytics Event를 통합한다.", [
    task("광고 후보 Filter와 결정적 선택 Rule을 구현하세요.", ["campaigns.json", "viewer-context.json", "ad-selector-starter.js"], ["Active·Budget·Target·Frequency 조건을 순서대로 구현합니다.", "동률 처리와 제외 이유를 결과에 포함합니다.", "경계·충돌·빈 후보 Property Test 12개를 통과시킵니다."], ["Rule 4종 모두 동작", "같은 입력은 같은 결과", "Test 12개 이상 통과"]),
    task("광고 노출부터 과금까지 Event Pipeline을 구현하세요.", ["event-schema.json", "pipeline-starter/"], ["AdRequested→Served→Impression→Click→Charge Event Schema를 작성합니다.", "Outbox와 Idempotent Consumer를 구현합니다.", "중복·역순·유실 Event를 주입해 재처리와 Reconciliation을 확인합니다."], ["Event 5종 Schema", "중복 Charge 없음", "유실 탐지·재처리 가능"]),
    task("Viewer–Ad–Billing–Analytics E2E Trace를 완성하세요.", ["integrated-sandbox/", "trace-checklist.md"], ["영상 선택부터 비용 차감·지표 반영까지 실행합니다.", "Correlation ID로 단계별 로그·Event·DB 상태를 수집합니다.", "광고 없음·Budget 소진·Analytics 지연 장애를 주입하고 원인을 찾습니다."], ["정상 E2E 1건 증거", "장애 3종 복구", "모든 단계가 단일 Trace로 연결됨"])
  ], [
    task("AI가 성공·실패로 단순화한 결제 상태를 사용자 경험과 연결하세요.", ["ai-payment-flow.md", "pg-event-log.json"], ["Pending·Unknown·Confirmed·Cancelled 상태를 로그에서 찾습니다.", "기획자는 상태별 메시지·버튼, 개발자는 조회·재처리 방식을 정의합니다.", "상태 전이와 UI Acceptance Criteria를 공동 작성합니다."], ["상태 5개 이상", "중복 결제 유도 없음", "Unknown 복구 경로가 있음"]),
    task("AI 결제 화면의 가격·환불·보안 고지 누락을 수정하세요.", ["ai-checkout.html", "pricing-policy.md", "refund-policy.md"], ["최종 금액 오해 가능성과 필수 고지 누락 6개를 찾습니다.", "기획자는 문구·동의 시점, 개발자는 서버 계산·위변조 방지를 정합니다.", "수정 화면과 영수증 데이터 Contract를 제출합니다."], ["누락 6개 이상 수정", "서버 금액이 Source of Truth", "환불·정기 결제 조건이 표시됨"]),
    task("AI 자동 재처리의 중복 과금 위험을 차단하세요.", ["duplicate-charge-events.json", "ai-retry-worker.js"], ["같은 결제가 두 번 반영되는 과정을 재현합니다.", "기획자는 과금 확정·보상 기준, 개발자는 Idempotency·Ledger를 설계합니다.", "중복 Event 100건을 실행해 단일 Charge와 경보를 검증합니다."], ["중복 과금 0건", "Ledger 대사 결과 일치", "보상·운영 Owner가 있음"]),
    task("AI Analytics 리포트의 잘못된 인과 해석을 교정하세요.", ["ai-analytics-report.md", "raw-events.csv", "refunds.csv"], ["중복 Event와 환불을 반영해 CTR·Conversion·Revenue를 다시 계산합니다.", "기획자는 의사결정 목적, 개발자는 데이터 품질 한계를 작성합니다.", "확인 사실·가능한 가설·추가 실험을 분리한 리포트를 만듭니다."], ["지표 계산식과 Source가 있음", "중복·환불 보정 완료", "인과 주장에 실험 계획이 있음"])
  ]);

  apply(10, "Streamly를 통합 QA하고 안전하게 출시·발표한다.", [
    task("Signup→Upload→Playback→Ad→Payment E2E QA를 수행하세요.", ["release-candidate/", "e2e-test-template.md"], ["핵심 사용자 Journey 3개와 실패 주입 6개를 설계합니다.", "Sandbox에서 실행해 Screenshot·Log·DB 증거를 수집합니다.", "발견 결함을 수정하고 Regression Suite를 다시 통과시킵니다."], ["Journey 3개 통과", "실패 주입 6개 복구", "결함 전후 증거가 있음"]),
    task("실제 배포 가능한 Release Readiness 문서를 완성하세요.", ["project-repository/", "release-checklist.md"], ["Build·Config·Migration·Secret·Monitoring·Rollback 항목을 직접 실행합니다.", "README와 실제 명령의 불일치 5개를 찾아 수정합니다.", "새 팀원이 문서만 보고 Staging 배포·Health Check·Rollback을 재현하게 합니다."], ["체크리스트 증거 100%", "문서 불일치 5건 이상 수정", "독립 재현 결과가 기록됨"]),
    task("기술 Decision과 AI 검증 과정을 담은 10분 Demo를 완성하세요.", ["decision-logs/", "test-evidence/", "demo-deck-template.md"], ["핵심 Decision 3개를 문제·대안·선택·Trade-off로 정리합니다.", "AI 제안을 검증해 수정한 사례 2개와 실패 사례 1개를 넣습니다.", "실제 Demo와 반대 질문 10개를 연습해 시간 내 발표합니다."], ["10분 이내 발표", "Decision 3개와 증거 있음", "AI 결과가 아닌 개발자 판단이 설명됨"])
  ], [
    task("AI 런칭 문서의 미구현 기능과 잘못된 정책을 제거하세요.", ["ai-launch-package/", "release-feature-list.csv", "support-policy.md"], ["소개·FAQ·매뉴얼을 Release Candidate와 대조해 오류 10개를 찾습니다.", "기획자는 공개 약속, 개발자는 Feature Flag·실제 동작을 확인합니다.", "오류를 수정하고 문서–기능 추적표를 승인합니다."], ["오류 10개 이상 교정", "미구현 기능 약속 없음", "각 문서에 검증 담당자가 있음"]),
    task("AI가 과장한 최종 발표 수치와 성과를 증거 기반으로 교정하세요.", ["ai-final-deck.md", "metrics.csv", "git-summary.md"], ["측정 근거 없는 수치·AI 성과 귀속·과장 표현 8개를 표시합니다.", "기획자는 사용자 가치, 개발자는 Test·Diff·지표 근거를 연결합니다.", "사실·해석·향후 목표를 구분한 최종 Deck을 완성합니다."], ["과장 8개 이상 판정", "모든 수치에 Source가 있음", "사람의 판단과 AI 보조가 구분됨"]),
    task("AI의 ‘모든 테스트 통과’ 보고를 실제 Release Gate로 검증하세요.", ["ai-qa-report.md", "ci-results/", "release-gates.md"], ["Mock만 실행된 항목과 미실행 Sandbox·Migration·복구 테스트를 찾습니다.", "기획자는 출시 차단 기준, 개발자는 환경별 증거와 잔여 위험을 작성합니다.", "Go·Conditional Go·No-Go 판정과 후속 Owner를 확정합니다."], ["미실행 항목 전부 공개", "Gate별 증거 링크가 있음", "출시 판정과 승인자가 있음"]),
    task("AI 배포 계획에 Canary·Monitoring·Rollback 책임을 추가하세요.", ["ai-deploy-plan.md", "slo-dashboard.json", "incident-contacts.csv"], ["5% Canary→25%→100% 단계와 관찰 시간을 설계합니다.", "기획자는 중단·공지 기준, 개발자는 Error Rate·Latency·결제 오류 Trigger를 정합니다.", "모의 장애를 주입해 자동 중단·수동 승인·Rollback Runbook을 실행합니다."], ["수치 기반 Trigger 3개 이상", "모의 Rollback 성공", "공지·기술 대응 Owner가 명확함"])
  ]);

  /* Day 1 통합 실습실에 중복 삽입되어 있던 기존 과제를 추가 Mission으로 이전 */
  days[1].missions.push(
    {
      title: "추가 Mission. 반려동물 홈케어 요구사항 명세",
      card: "기존 반려동물 홈케어 과제를 기획자–개발자 협업 Mission으로 전환해 승인·결제·노쇼 정책을 검증합니다.",
      issue: "AI가 회의록을 요구사항으로 바꾸면서 펫시터 관리자 승인, 매칭 후 1시간 결제 기한, 노쇼 보상과 대체 추천 조건을 누락하거나 임의 해석했습니다.",
      planner: "기획자는 보호자·펫시터·관리자 역할, 승인 조건, 취소·노쇼 보상 정책과 미결정 질문을 확정합니다.",
      developer: "개발자는 역할별 상태 전이, 결제 만료, 보상·대체 매칭 예외를 구현 가능한 Acceptance Criteria로 검증합니다.",
      artifact: "pet-care-requirements-decision.md",
      pbl: task("반려동물 홈케어 회의록과 AI 요구사항 초안을 대조해 정책 누락을 보완하세요.", ["pet-care-meeting-notes.md", "ai-pet-care-requirements.md"], ["두 문서를 대조해 역할·승인·결제 기한·취소·노쇼 정책 누락과 임의 가정 8개를 찾습니다.", "기획자는 정책과 미결 질문을, 개발자는 상태 전이·예외·검증 조건을 작성합니다.", "PCR 요구사항 ID, 정상·예외 Flow, 담당자와 승인 상태를 포함한 공동 요구사항서를 완성합니다."], ["문제 8건 이상 판정", "1시간 결제 만료와 노쇼 보상 Flow 포함", "모든 PCR 요구사항에 검증 기준이 있음"])
    },
    {
      title: "추가 Mission. 무인 스터디카페 IoT 제어 명세",
      card: "기존 스터디카페 과제를 협업 Mission으로 옮겨 예약 시간과 도어락·전력·냉난방 제어 및 Fail-safe를 검증합니다.",
      issue: "AI가 정상 예약 흐름만 작성하고 핀코드 활성 시간, 종료 전 안내, 네트워크 단절과 도어락 미작동 시 물리적 안전 절차를 빠뜨렸습니다.",
      planner: "기획자는 예약 전후 사용자 안내, 운영자 개입 조건, 긴급 개방과 보상 정책을 정의합니다.",
      developer: "개발자는 시간 기준, Device 상태, 예비망 전환, 명령 실패·재시도와 수동 Override를 시스템 Flow로 검증합니다.",
      artifact: "study-cafe-iot-decision.md",
      pbl: task("예약 Timeline과 IoT 장애 대응이 포함된 스터디카페 통합 명세를 완성하세요.", ["study-cafe-meeting-notes.md", "ai-iot-control-flow.md"], ["예약 10분 전부터 종료 후까지 도어락·조명·냉난방 상태를 분 단위 Timeline으로 작성합니다.", "기획자는 안내·긴급콜 기준, 개발자는 통신 두절·핀코드 실패·센서 불일치 처리 방식을 작성합니다.", "정상 Flow와 장애 4종의 사용자 행동·Device 명령·운영자 대응·완료 조건을 공동 확정합니다."], ["분 단위 제어 Timeline 완성", "장애 4종과 이중 Fail-safe 포함", "모든 Hardware 명령에 성공·실패 확인이 있음"])
    },
    {
      title: "추가 Mission. 숏폼·라이브 커머스 Domain 설계",
      card: "기존 숏폼·라이브 커머스 Domain 과제를 추가 Mission으로 옮겨 AI의 경계·소유권 제안을 공동 검증합니다.",
      issue: "AI가 Video, Live, Commerce, Order, Settlement의 책임을 겹치게 배치하고 방송 종료 후 주문·환불·정산 데이터 Owner를 명확히 하지 않았습니다.",
      planner: "기획자는 방송·상품 노출·주문·환불·정산의 업무 책임과 정책 변경 주체를 정의합니다.",
      developer: "개발자는 Bounded Context, Aggregate, 데이터 Owner, Event와 실패 복구 흐름을 설계하고 순환 의존을 제거합니다.",
      artifact: "shortform-commerce-domain-decision.md",
      pbl: task("숏폼 VOD와 라이브 커머스의 Persona·Feature·Domain Map을 공동 완성하세요.", ["shortform-commerce-brief.md", "ai-commerce-domain-map.mmd"], ["Viewer·Creator·Seller·Operator의 Goal과 Feature를 작성하고 AI Map의 책임 중복 6건을 찾습니다.", "기획자는 주문·환불·정산 정책 Owner를, 개발자는 Aggregate·Event·Source of Truth를 지정합니다.", "Context Map과 방송 종료·결제 실패·환불 발생 Sequence를 수정해 공동 Decision Log를 제출합니다."], ["책임 중복 6건 이상 판정", "핵심 데이터마다 단일 Owner 존재", "예외 Sequence 3종과 복구 책임 포함"])
    },
    {
      title: "추가 Mission. B2B 모빌리티 관제 Domain 설계",
      card: "기존 법인차량 관제 과제를 추가 Mission으로 옮겨 차량·운전자·운행·정비 데이터의 소유권과 경계를 결정합니다.",
      issue: "AI가 차량 위치와 운전자 개인정보를 모든 Domain이 공유하도록 제안해 권한, 보관 기간, 실시간 수집 실패 책임이 불명확합니다.",
      planner: "기획자는 법인 관리자·운전자·관제자 역할, 위치정보 이용 목적, 보관·열람·삭제 정책을 정의합니다.",
      developer: "개발자는 Vehicle, Trip, Telemetry, Maintenance Context의 Owner와 Event, 권한·Tenant 경계, Offline 복구를 설계합니다.",
      artifact: "mobility-domain-ownership-decision.md",
      pbl: task("법인차량 관제 플랫폼의 데이터 소유권과 Domain 경계를 개인정보 정책까지 포함해 확정하세요.", ["mobility-service-brief.md", "ai-mobility-domain-map.mmd", "location-policy.md"], ["차량·운전자·위치·운행·정비 데이터별 수집 목적과 AI Map의 중복 Owner를 8건 이상 찾습니다.", "기획자는 열람·보관·삭제 정책, 개발자는 Tenant·권한·Event·Offline 동기화를 작성합니다.", "Domain Map, Ownership Matrix, 위치 수집 중단·지연·오염 예외 Flow와 담당자를 공동 승인합니다."], ["데이터 8종 이상 소유권 판정", "개인정보 보관·삭제 기준 포함", "Offline·지연·오염 예외 Flow 3종 포함"])
    }
  );
  if (window.attachPblExamples) window.attachPblExamples();

  /*
   * Persona 기반 예시 상황
   * 각 PBL 과제의 기술 주제와 AI 협업 이슈를 그대로 사용해 학생이
   * '누구의 입장에서, 언제, 왜 이 일을 해야 하는지' 이해하도록 구성한다.
   */
  var scenarioProfiles = {
    1: { developer: "김도윤(주니어 서비스 개발자, 1년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "콘텐츠 운영팀과 신규 사업 책임자", moment: "킥오프 회의 이틀 뒤 첫 Domain 설계 리뷰를 앞둔 상황" },
    2: { developer: "이준호(백엔드 개발자, 2년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "영상 재생·광고 운영 담당자", moment: "사용자 Flow와 시스템 Sequence를 확정해야 하는 Sprint Planning 전날" },
    3: { developer: "최은지(데이터 모델러, 2년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "주문·정산 운영팀", moment: "DB 스키마 확정 회의 90분 전, 용어와 Entity 해석이 엇갈린 상황" },
    4: { developer: "이준호(API 개발자, 2년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "Web·App 개발팀과 외부 API 공급사", moment: "프론트엔드 연동을 시작하기 전 API Contract 승인 회의가 열린 상황" },
    5: { developer: "정하린(프론트엔드 개발자, 1년 차)", planner: "윤지아(UX 기획자, 4년 차)", stakeholder: "Viewer·Creator·Advertiser 사용자 그룹", moment: "사용성 테스트를 하루 앞두고 프로토타입의 화면 상태를 점검하는 상황" },
    6: { developer: "정하린(프론트엔드 개발자, 1년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "API 개발팀과 고객지원 담당자", moment: "통합 테스트 중 실제 API 연결 오류가 반복되어 원인을 좁혀야 하는 상황" },
    7: { developer: "이준호(백엔드 개발자, 2년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "Campaign·Billing 운영팀", moment: "Business Rule 배포 전 동시성·예외 처리 리뷰가 열린 상황" },
    8: { developer: "오세진(보안 담당 개발자, 3년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "회원 운영팀과 개인정보보호 담당자", moment: "회원 기능 보안 점검에서 권한 우회와 개인정보 이슈가 발견된 상황" },
    9: { developer: "한민수(플랫폼 개발자, 3년 차)", planner: "박서연(서비스 기획자, 3년 차)", stakeholder: "광고주·정산·Analytics 담당자", moment: "광고 노출과 과금 수치가 맞지 않아 출시 후보를 중단하고 추적하는 상황" },
    10: { developer: "김도윤(릴리즈 담당 개발자, 2년 차)", planner: "박서연(프로덕트 오너, 4년 차)", stakeholder: "QA·운영·고객지원·경영진", moment: "최종 Demo와 출시 승인 회의를 하루 앞둔 Release Candidate 점검 상황" }
  };

  function attachPersonaScenario(day, type, item) {
    var profile = scenarioProfiles[day];
    var isSkill = type === "skill";
    var projectContext = item.title.indexOf("추가 Mission") === 0
      ? "별도 산업 사례 PBL 워크숍"
      : "Day " + day + " " + days[day].theme + " 프로젝트";
    var persona = isSkill
      ? profile.developer
      : profile.planner + " × " + profile.developer;
    var situation = isSkill
      ? "학생은 " + profile.developer + "의 역할을 맡습니다. 지금은 " + profile.moment + "입니다. " + projectContext + "에서 다음 업무를 담당합니다. " + item.pbl.brief + " 현재 전달받은 자료는 " + item.pbl.inputs.join(", ") + "뿐이며, 팀 리뷰에서 설계 근거와 검증 결과를 자신의 말로 설명해야 합니다."
      : "학생 팀은 " + profile.planner + "와 " + profile.developer + "의 역할을 맡습니다. 지금은 " + profile.moment + "입니다. " + projectContext + "의 AI Agent 결과를 검토하던 중 다음 문제가 발견됐습니다. " + item.issue;
    var dialogue = isSkill
      ? "“AI가 만든 완성본을 제출하면 왜 맞는지 설명할 수 없어. 먼저 내 초안을 만들고, 빠진 경계값과 반례만 AI에게 물어보자.”"
      : "“사용자 정책과 범위는 기획 근거로 확정하고, 시스템 제약과 실패 조건은 테스트 증거로 확인한 뒤 함께 결정합시다.”";
    var assignment = isSkill
      ? item.pbl.work.join(" → ") + " 최종 제출물은 " + item.artifact + "이며, 완료 시 다음을 설명할 수 있어야 합니다. " + item.check
      : item.pbl.work.join(" → ") + " 두 역할의 판단과 승인 근거를 함께 기록합니다. 공동 결과 파일은 " + item.artifact + "입니다.";

    item.pbl.scenario = {
      title: profile.moment,
      persona: persona,
      stakeholder: profile.stakeholder,
      situation: situation,
      dialogue: dialogue,
      assignment: assignment
    };
  }

  for (var scenarioDay = 1; scenarioDay <= 10; scenarioDay += 1) {
    days[scenarioDay].skills.forEach(function (item) { attachPersonaScenario(scenarioDay, "skill", item); });
    days[scenarioDay].missions.forEach(function (item) { attachPersonaScenario(scenarioDay, "mission", item); });
  }
})();
