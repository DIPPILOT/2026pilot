# 📂 [CWA-06 실습용 Google Drive 패키지] Google Drive 자료로 주간 업무 보고서를 작성하라

> 본 패키지는 **코덱스 현업 과제 [CWA-06]**를 실제로 수행하기 위해 필요한 Google Drive 가상 업무 환경 데이터 세트입니다.  
> 실제 현업에서 발생하는 "출처와 기준일이 제각각인 문서 파편화" 상황을 완벽하게 재현하여, Codex와 함께 검증 및 보고서를 작성할 수 있습니다.

---

## 1. Google Drive 가상 폴더 구조 및 파일 목록

```
📁 Google Drive (Shared Drives > 사업운영본부)
│
├── 📄 README.md                                                 # [안내] 실습 가이드 및 파일 인벤토리
├── 📊 01_KPI_Google_Sheet_growth-kpi.csv                        # [시트 데이터] 2026-09-25 기준 공식 주간 지표 CSV
├── 📑 01_KPI_Google_Sheet_growth-kpi.md                         # [시트 설명서] growth-kpi.gsheet 구조 및 셀 위치 가이드
├── 📝 02_회의록_Google_Docs_meeting_notes_20260925.md           # [회의록] 2026-09-25 사업운영팀 주간 스프린트 회의록
├── 🖥️ 03_발표자료_Google_Slides_all-hands_dashboard_20260924.md # [발표자료] 전사 올핸즈 대시보드 (수치 충돌 유발 슬라이드)
├── 📋 04_주간보고_템플릿_weekly_report_template.md              # [템플릿] 사업운영팀 1페이지 공식 주간 보고 표준 서식
└── ✍️ 05_과제_제출_템플릿_CWA-06_submission_template.md        # [제출양식] 최종 산출물 및 Codex 승인 기록 제출 파일
```

---

## 2. 과제 수행 절차 가이드

1. **Step 1: 자료 목록(Inventory) 구성**
   - 상기 제공된 파일들의 파일명, 소유자, 수정일자, 기준일자를 표로 정리합니다.
2. **Step 2: 수치 및 충돌 검증 (Single Source of Truth 확보)**
   - `01_KPI_Google_Sheet_growth-kpi.csv`의 확정 수치(12,430명 / 4,820만 원)와 `03_발표자료_Google_Slides`의 잠정 수치(12,510명 / 5,100만 원)의 불일치를 확인하고 `data_conflicts.md`에 분리 기록합니다.
3. **Step 3: 업무 흐름 및 안건 요약**
   - `02_회의록_Google_Docs`에서 완료 업무, 진행 업무, 위험 요소, 리더 결정 요청 안건을 추출합니다.
4. **Step 4: 1페이지 주간 보고서 초안 작성**
   - `04_주간보고_템플릿` 양식에 맞춰 출처(파일명, 셀 위치, 기준일)를 표기하여 작성합니다.
5. **Step 5: 3장 발표 슬라이드 요약**
   - 현황(Status) - 이슈(Issue) - 결정 요청(Decision) 3단계 구조로 압축합니다.
6. **Step 6: 사람의 승인 및 `codex_review.md` 작성 후 제출**
   - AI의 제안 중 수용한 것, 수정한 것, 거절한 것을 기록하고 `05_과제_제출_템플릿`을 완성하여 제출합니다.
