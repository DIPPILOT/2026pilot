# 전문가 상담 서비스 물리 데이터베이스 스키마 정의

<!-- LMS_SYNC:START -->
## LMS 활용 맥락

- **연계 일차:** Day 3 — 데이터 정규화와 ERD 설계
- **자료 역할:** ERD·정규화·API 설계 검증에 사용하는 물리 데이터베이스 스키마
- **사용 기준:** Codex 실습에서 입력 자료로 사용하고, 결과는 해당 일차의 완료 산출물 및 검토 기준에 맞춰 평가합니다.
<!-- LMS_SYNC:END -->

```sql
CREATE TABLE Users (
    user_id VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    nickname VARCHAR(50) NOT NULL
);

CREATE TABLE Experts (
    expert_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL
);

CREATE TABLE Reservations (
    reservation_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    expert_id VARCHAR(50) NOT NULL,
    reservation_date DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (expert_id) REFERENCES Experts(expert_id)
);

CREATE TABLE Payments (
    payment_id VARCHAR(50) PRIMARY KEY,
    reservation_id VARCHAR(50) NOT NULL,
    amount INT NOT NULL,
    status VARCHAR(20) NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES Reservations(reservation_id)
);
```