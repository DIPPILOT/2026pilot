# 샌드위치·음료 주문 키오스크 서비스 기획

매장 고객이 샌드위치와 음료를 주문하고, 관리자가 메뉴와 주문을 관리하는 키오스크 서비스의 기획 문서입니다.

## 문서 구성

### 디자인

- [디자인 콘셉트](design-concept.md)

### 고객 주문 서비스

- [주문 서비스 개요](customer-order/README.md)
- [주문 흐름](customer-order/order-flow.md)
- [모바일 화면 구성](customer-order/mobile-screen-spec.md)

### 관리자 화면

- [관리자 서비스 개요](admin/README.md)
- [관리 기능](admin/admin-features.md)
- [PC 관리자 화면 구성](admin/pc-screen-spec.md)

### 연관 서비스 분석 문서

서비스 분석 정책은 기획 문서의 하위 항목이 아니라 프로젝트 최상위 영역으로 분리합니다.

- [분석 문서 안내](../service-analysis/README.md)
- [기본 분석 정의](../service-analysis/analysis-definition.md)
- [분석 API 기본 정의](../service-analysis/analytics-api-definition.md)

### 공통 정책

- [메뉴와 주문 정책](common/service-policies.md)

## 기획 범위

- 포함: 고객 주문, 결제 진행, 주문 완료 안내, 메뉴 관리, 품절 관리, 주문 관리
- 추후 결정: 회원 기능, 쿠폰, 포인트, 배달 주문, 외부 POS 연동

