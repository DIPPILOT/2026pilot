# 프로젝트 파편화 용어 관리 문서

<!-- LMS_SYNC:START -->
## LMS 활용 맥락

- **연계 일차:** Day 3 — 데이터 정규화와 ERD 설계
- **자료 역할:** 용어 표준화 및 데이터 구조 합의를 위한 비표준 용어 샘플
- **사용 기준:** Codex 실습에서 입력 자료로 사용하고, 결과는 해당 일차의 완료 산출물 및 검토 기준에 맞춰 평가합니다.
<!-- LMS_SYNC:END -->

* **Figma UI 기획서의 표기**:
  - 사용자 정보 화면: '고객명', '탈퇴회원'
  - 전문가 매칭 카드: '선생님 프로필', '전문 상담사 분야'
  - 예약 폼: '상담 신청 시간', '예약 구분'

* **백엔드 API 명세서의 표기**:
  - GET /user/profile -> 'nickname', 'MemberStatus'
  - POST /counselor/register -> 'CounselorName', 'category'
  - GET /book/history -> 'book_id', 'status'

* **데이터베이스 SQL DDL의 표기**:
  - TABLE members -> 'member_id', 'email', 'nick_name'
  - TABLE counselors -> 'counselor_id', 'name'
  - TABLE reservations -> 'res_id', 'user_id', 'counselor_id'