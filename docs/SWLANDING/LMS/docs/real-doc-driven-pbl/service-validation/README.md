# 샌드위치·음료 주문 서비스 검증 문서

이 폴더는 기획과 구현 결과가 요구사항대로 동작하는지 반복해서 검증하기 위한 기준 문서와 기록 양식을 보관합니다.

## 전체 프로젝트 구조

```text
test_26_dip/
├── service-planning/        # 계획: 서비스 요구사항, 화면 구성, 정책, 디자인 콘셉트
├── service-analysis/        # 분석: 지표, 이벤트, 데이터 품질, 분석 API 정책
├── service-implementation/  # 개발: 고객 모바일 화면, PC 관리자 화면, 공통 데이터
└── service-validation/      # 검증: 검증 계획, 테스트 데이터, 결과와 결함 기록
```

네 영역을 같은 위치에 두고 **계획 → 분석 → 개발 → 검증**의 책임과 산출물을 분리합니다.

## 문서 구성

- [전체 검증 전략](validation-strategy.md)
- [서비스 기능 검증 계획](service-validation-plan.md)
- [디자인 검증 계획](design-validation-plan.md)
- [테스트 데이터 명세](test-data.md)
- [검증 결과 보고서 양식](validation-report-template.md)

## 검증 대상

### 계획 문서

- `../service-planning/customer-order/mobile-screen-spec.md`
- `../service-planning/admin/pc-screen-spec.md`
- `../service-planning/common/service-policies.md`
- `../service-planning/design-concept.md`

### 구현 파일

- `../service-implementation/customer/`
- `../service-implementation/admin/`
- `../service-implementation/shared/store.js`
- `../service-implementation/shared/menu-data.js`
- `../service-implementation/index.html`

### 분석 정책

- `../service-analysis/analysis-definition.md`
- `../service-analysis/analytics-api-definition.md`

### 외부 데이터

- Google Sheets `샌드위치가게메뉴`
- 범위: `시트1!A1:R12`
- 기대 메뉴 수: 총 11개, 샌드위치 6개, 음료 5개

## 표준 검증 순서

1. 검증할 버전과 변경 내용을 확정합니다.
2. 테스트 데이터와 브라우저 저장 데이터를 초기화합니다.
3. 서비스 기능 검증을 수행합니다.
4. 모바일과 PC 화면의 디자인 검증을 수행합니다.
5. 실패 항목을 결함으로 기록하고 심각도를 정합니다.
6. 수정 후 실패 항목과 영향 범위를 다시 검증합니다.
7. 종료 조건을 충족하면 결과 보고서를 확정합니다.

## 결과 상태

| 상태 | 의미 |
|---|---|
| PASS | 기대 결과와 일치 |
| FAIL | 기대 결과와 불일치하며 수정 필요 |
| BLOCKED | 외부 환경이나 선행 결함 때문에 검증 불가 |
| NOT RUN | 아직 실행하지 않음 |
| NOT APPLICABLE | 현재 변경 범위에 해당하지 않음 |

## 운영 원칙

- 테스트 결과는 느낌이 아니라 재현 단계와 증거로 기록합니다.
- 계획 문서, 시트 데이터, 구현 화면이 서로 다르면 어느 쪽을 기준으로 판단했는지 명시합니다.
- 실패 항목을 수정한 뒤에는 해당 항목만 보지 않고 관련 흐름도 회귀 검증합니다.
- 실제 결제나 개인정보는 사용하지 않고 가상 데이터만 사용합니다.

