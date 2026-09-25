# Day 3 추가 Skill Task 설계안

> 기존 LMS Task와 기존 Markdown 본문은 변경하지 않는다. 이 문서의 Task는 AI-Native SW Engineering 역량을 보강하기 위한 **추가 Task 후보**다.

## Day 기준

- **확장 주제:** Entity Discovery & ERD
- **AI 역할:** Data Architect
- **입력:** Day 1 Domain Map, Day 2 Flow·Sequence
- **통합 산출물:** Domain별 Entity 목록, 정규화 ERD, 데이터 소유권 표

## 추가 Task

### ADD-D03-T01 — Sequence에서 Entity와 상태 도출

- **Task 영역:** `TECH`
- **기술 Skill:** `TECH-DDD` `TECH-DATA`
- **AI 활용 Skill:** `AI-ANA` `AI-DES`
- **수행 내용:** 메시지와 상태 변화를 근거로 User, Channel, Video, Campaign, AdRequest, Impression, Budget 등의 Entity를 도출한다.
- **AI 활용 방식:** AI가 제안한 Entity 중 단순 화면 데이터·계산값·영속 데이터가 혼합되지 않았는지 검토한다.
- **완료 기준:** 각 Entity에 책임 Domain, 주요 속성, 식별자, 상태가 정의된다.

### ADD-D03-T02 — 관계·정규화·데이터 소유권 설계

- **Task 영역:** `HYBRID`
- **기술 Skill:** `TECH-DATA` `TECH-ARCH`
- **AI 활용 Skill:** `AI-DES` `AI-REV`
- **수행 내용:** Cardinality, FK, Unique 제약, 상태 이력을 포함한 ERD를 작성하고 Domain별 원본 데이터 소유자를 지정한다.
- **AI 활용 방식:** AI에게 중복 데이터, 순환 참조, 다대다 해소, 이력 보존 위험을 Review하게 한다.
- **완료 기준:** ERD가 최소 3정규형 기준을 설명하고 주요 관계·제약·소유권을 포함한다.

### ADD-D03-T03 — Domain–Flow–ERD 정합성 Audit

- **Task 영역:** `AI`
- **기술 Skill:** `TECH-DDD` `TECH-DATA` `TECH-QA`
- **AI 활용 Skill:** `AI-CTX` `AI-REV` `AI-QA`
- **수행 내용:** 모든 Sequence의 읽기·쓰기 데이터가 ERD와 Domain 책임에 존재하는지 추적한다.
- **AI 활용 방식:** AI에게 세 산출물을 함께 제공하고 누락 Entity, 잘못된 소유권, 이름 불일치를 표로 출력하게 한다.
- **완료 기준:** 불일치 목록이 해결되거나 미결정 사항과 담당자가 명시된다.

## LMS 반영용 마킹 예시

```text
[ADD-D03-T01] Sequence에서 Entity와 상태 도출
영역: TECH
TECH: TECH-DDD, TECH-DATA
AI: AI-ANA, AI-DES
```
