# 분석 API 기본 정의

## 1. 목적

분석 이벤트를 수집하고 서비스·메뉴·주문·운영 지표를 조회하기 위한 API 설계의 공통 기준입니다. 현재 문서는 구현 전 초안이며, 엔드포인트와 스키마의 상세 버전은 추후 확정합니다.

## 2. API 역할

### 수집 API

- 고객과 관리자 화면에서 발생한 분석 이벤트를 수집합니다.
- 이벤트 형식과 필수 속성을 검증합니다.
- 중복 이벤트를 제거할 수 있도록 `event_id`를 사용합니다.

### 조회 API

- 기간, 매장, 메뉴, 주문 상태를 기준으로 지표를 조회합니다.
- 대시보드와 보고서에서 같은 계산 정의를 재사용합니다.
- 사용 권한에 따라 매장 범위를 제한합니다.

## 3. 기본 경로와 버전

```text
/api/analytics/v1
```

- 호환되지 않는 변경은 새 주 버전을 사용합니다.
- 응답에 계산 정의 버전과 데이터 기준 시각을 포함합니다.
- 날짜·시간은 ISO 8601 형식을 사용합니다.

## 4. 엔드포인트 초안

| Method | Path | 목적 |
|---|---|---|
| POST | `/events` | 단일 분석 이벤트 수집 |
| POST | `/events/batch` | 여러 이벤트 일괄 수집 |
| GET | `/metrics/overview` | 주문·매출·전환 핵심 지표 |
| GET | `/metrics/funnel` | 주문 단계별 전환과 이탈 |
| GET | `/metrics/menus` | 메뉴별 조회·주문·매출 |
| GET | `/metrics/operations` | 접수·준비·지연·취소 지표 |
| GET | `/metrics/quality` | 결제·연결·동기화 오류 지표 |
| GET | `/definitions` | 사용 가능한 지표와 계산 정의 |

## 5. 이벤트 수집 요청 예시

```json
{
  "event_id": "evt_01JABC123",
  "event_name": "menu_detail_viewed",
  "occurred_at": "2026-10-31T11:30:00+09:00",
  "session_id": "ses_01JXYZ789",
  "store_id": "store-gangnam-01",
  "screen_name": "MENU_DETAIL",
  "menu_id": "menu-sw-6",
  "actor_type": "customer",
  "app_version": "2",
  "device_type": "mobile",
  "properties": {
    "category": "SANDWICH",
    "price": 7900,
    "badge": "신메뉴"
  }
}
```

## 6. 이벤트 수집 응답 예시

```json
{
  "accepted": true,
  "event_id": "evt_01JABC123",
  "received_at": "2026-10-31T11:30:01+09:00"
}
```

중복 이벤트인 경우 실패로 처리하지 않고 기존 수집 결과를 반환하는 멱등 방식을 권장합니다.

## 7. 지표 조회 요청 예시

```http
GET /api/analytics/v1/metrics/overview?store_id=store-gangnam-01&from=2026-10-01&to=2026-10-31&interval=day
```

### 공통 조회 조건

| 파라미터 | 필수 | 설명 |
|---|---|---|
| store_id | 권한에 따라 | 매장 ID |
| from | 예 | 조회 시작일 |
| to | 예 | 조회 종료일 |
| interval | 아니오 | hour, day, week, month |
| timezone | 아니오 | 기본값은 매장 시간대 |
| menu_id | 아니오 | 메뉴 필터 |
| order_type | 아니오 | DINE_IN, TAKEOUT |

## 8. 지표 조회 응답 예시

```json
{
  "definition_version": "1.0",
  "generated_at": "2026-10-31T11:31:00+09:00",
  "data_through": "2026-10-31T11:30:00+09:00",
  "filters": {
    "store_id": "store-gangnam-01",
    "from": "2026-10-01",
    "to": "2026-10-31",
    "interval": "day"
  },
  "metrics": {
    "completed_orders": 1240,
    "gross_sales": 15872000,
    "average_order_value": 12800,
    "order_conversion_rate": 72.4,
    "payment_success_rate": 98.7
  }
}
```

## 9. 오류 응답

```json
{
  "error": {
    "code": "INVALID_DATE_RANGE",
    "message": "조회 종료일은 시작일보다 빠를 수 없습니다.",
    "request_id": "req_01JERR123"
  }
}
```

### 기본 오류 코드

| HTTP | 코드 | 의미 |
|---:|---|---|
| 400 | INVALID_EVENT | 이벤트 이름 또는 필수 속성 오류 |
| 400 | INVALID_DATE_RANGE | 조회 기간 오류 |
| 401 | UNAUTHENTICATED | 인증 필요 |
| 403 | FORBIDDEN_STORE | 매장 조회 권한 없음 |
| 404 | METRIC_NOT_FOUND | 정의되지 않은 지표 |
| 409 | DEFINITION_VERSION_MISMATCH | 계산 정의 버전 불일치 |
| 429 | RATE_LIMITED | 요청 제한 초과 |
| 500 | ANALYTICS_UNAVAILABLE | 분석 시스템 오류 |

## 10. 권한 원칙

- 고객 화면은 이벤트 수집 API만 호출할 수 있습니다.
- 직원은 자신이 속한 매장의 제한된 운영 지표만 조회할 수 있습니다.
- 매니저는 해당 매장의 메뉴·주문·운영 지표를 조회할 수 있습니다.
- 점장 또는 관리자는 매장 전체 지표와 분석 정의를 조회할 수 있습니다.
- 매장 간 비교는 별도 권한이 있는 사용자만 사용할 수 있습니다.

## 11. 성능과 제한

- 이벤트 단건 수집 응답 목표: 200ms 이내
- 일괄 수집 최대 건수: 초기 기준 100건
- 일반 지표 조회 기간: 최대 1년
- 대시보드 기본 조회 기간: 최근 30일
- 동일 조건 조회 결과는 짧은 시간 캐시할 수 있습니다.
- 대용량 상세 데이터는 비동기 내보내기 방식으로 분리합니다.

## 12. 보안과 데이터 보호

- 모든 요청은 HTTPS를 사용합니다.
- 수집 API는 허용된 이벤트와 속성만 받습니다.
- 알 수 없는 속성은 저장하지 않거나 격리합니다.
- 결제정보, 비밀번호, 고객 요청사항 원문을 거부합니다.
- 관리자 조회 API는 역할과 매장 범위를 모두 확인합니다.
- 요청 ID와 감사 기록을 남기되 민감정보는 로그에서 제거합니다.

## 13. 추후 설계 항목

- 인증 방식과 API 키 정책
- 이벤트 큐와 재시도 방식
- 실시간 지표의 허용 지연 시간
- 페이지네이션과 정렬 규칙
- 대용량 CSV 내보내기
- 지표 정의 변경과 과거 데이터 재계산
- API 명세 도구와 OpenAPI 문서 위치

