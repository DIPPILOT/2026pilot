# Codex × Antigravity 문서 주도 서비스 개발 PBL

이 폴더는 학생용 PBL 수업 페이지와 실제 예제 프로젝트를 함께 보관합니다. 에디터에서 이 폴더를 열면 계획, 분석, 구현, 검증 자료를 한 번에 확인하고 최종 업데이트할 수 있습니다.

## 폴더 구조

```text
real-doc-driven-pbl/
├── index.html                 # 학생용 PBL 워크스페이스
├── styles.css
├── app.js
├── resources/                 # 미션 안내서와 평가 루브릭
├── service-planning/          # 서비스 요구사항·화면·정책·디자인 명세
├── service-analysis/          # 지표·이벤트·데이터 품질·분석 API
├── service-implementation/    # 모바일 고객·PC 관리자 구현
└── service-validation/        # 검증 계획·데이터·결함·결과 양식
```

## 에디터 확인 순서

1. [전체 PBL 안내](resources/PBL_MISSIONS.md)
2. [서비스 기획](service-planning/README.md)
3. [서비스 분석](service-analysis/README.md)
4. [서비스 구현](service-implementation/README.md)
5. [서비스 검증](service-validation/README.md)
6. [평가 루브릭](resources/EVALUATION_RUBRIC.md)

## 로컬 페이지

- PBL 수업 페이지: `index.html`
- 구현 허브: `service-implementation/index.html`
- 고객 모바일 주문: `service-implementation/customer/index.html`
- PC 관리자: `service-implementation/admin/index.html`

## 최종 업데이트 전 확인

- 네 최상위 서비스 폴더의 책임이 중복되지 않는지 확인합니다.
- 기획·분석 문서의 파일 경로와 구현 파일이 일치하는지 확인합니다.
- 고객과 관리자가 같은 메뉴·주문 상태 정의를 사용하는지 확인합니다.
- 검증 문서에 설계 검증과 서비스 검증이 분리되어 있는지 확인합니다.
- AI가 만든 내용의 채택·수정·반려 이유를 기록합니다.

