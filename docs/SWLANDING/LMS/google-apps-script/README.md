# LMS 로그인 Apps Script

`Code.gs`는 Google Sheet의 `출석부`에서 학생 명부를 읽고, 로그인 성공 기록을 `LOG_LMS_Login`에 추가합니다.

- `GET ?action=students`: 학생 ID, 이름, 소속팀 반환
- `POST`: 학생 ID 검증 후 로그인 로그 기록
- `POST action=homeworkClick`: 과제 카드 클릭을 `LOG_Homework_Mission`에 기록
- `POST action=preLearningClick`: Day 1~10 AI TASK, SKILL, MISSION 페이지 열림을 `LOG_Pre_Learning`에 기록 (`PreLearning.gs`, 기존 API 이름 유지)
- 동일 `eventId`는 6시간 동안 중복 기록하지 않음
- 동시 기록은 `LockService`로 직렬화

현재 로그인 페이지는 초기 표시 속도를 위해 학생 명부를 `docs/login/login.js`에 고정해 둡니다. 학생 명부가 변경되면 `GET ?action=students` 결과를 기준으로 해당 배열을 다시 생성합니다. 로그인 카드 클릭 시 사용하는 `POST` 기록 기능은 계속 Apps Script를 호출합니다.

`docs/homework-log.js`는 세 과제 페이지의 카드 클릭을 감지합니다. 페이지 표시나 모달 열기를 기다리지 않고 비동기 POST를 보내며, 학생 ID는 현재 LMS 로그인 세션에서 가져오고 Apps Script가 `출석부` 명부와 다시 대조합니다.

과제 로그 전송 직전에는 `localStorage.currentUserSession.expiresAt`을 검사합니다. 세션이 없거나 만료됐거나 학생 ID가 유효하지 않으면 쿠키·로컬 세션을 정리하고 로그인 페이지로 이동하며, Apps Script API는 호출하지 않습니다.

배포된 웹 앱 URL:

`https://script.google.com/macros/s/AKfycbx4kGWSG4D41ZpElazYgGKkY4V7AbnkBRir8uKRhYNGneAM6xxJKxpJJPdbU2GfDtwz/exec`

이 URL은 `docs/login/login.js`의 `APP_SCRIPT_URL`에 설정되어 있습니다.

## 사전 학습 미션 로그

Day 1~10의 AI TASK(TASK), SKILL, MISSION 학습 페이지를 열 때 기록합니다. 카드 클릭은 기록하지 않습니다. 직접 URL 접속, 페이지 내 링크 이동, 새로고침, 뒤로가기 복원도 포함합니다. 기존 13개 열을 유지하며 ID로 유형을 구분합니다: `DAY1-TASK1`, `DAY1-SKILL1`, `DAY1-MISSION1`.

`PreLearning.gs`는 `Code.gs`와 같은 Apps Script 프로젝트에 추가합니다. 기존 `doPost`가 `preLearningClick`만 새 함수로 분기하므로 로그인/과제 API URL과 로직은 유지됩니다. 두 파일을 저장한 뒤 기존 배포를 새 버전으로 업데이트합니다.

`docs/shared/pre-learning-log.js`는 학습 페이지의 경로와 쿼리로 유형/번호를 판별합니다. Day 1 통합 실습실은 활성 Task 화면 변경도 관찰하며 같은 화면의 중복 DOM 변경은 한 번만 기록합니다. 초기 step 선택은 동기적으로 수행하여 기본 Task가 잘못 기록되지 않도록 합니다. 공통 학습실은 실제 존재하는 콘텐츠만 기록합니다. 학생 ID는 `localStorage.currentUserSession`의 만료 검사 후 가져오며 누락/만료 시 API 호출 없이 로그인으로 이동합니다. Apps Script v5의 기존 요청 형식과 호환되므로 이번 변경은 서버 재배포가 필요하지 않습니다.

- 한국 시간 금요일 18:00 이상 22:00 미만, 토요일 09:00 이상 18:00 미만에는 기록하지 않습니다. 미션 이용은 가능합니다.
- 브라우저는 페이지/화면 열림 시각, 서버는 수신 시각으로 각각 제외 시간을 검사합니다. 경계 직전 요청이 제외 시간에 도착하면 서버가 기록을 생략합니다.
- 기존 13개 열(클릭 일시 ~ 처리 결과)에 맞춰 추가합니다. 시트/출석부 데이터는 수정하지 않습니다.
- 중복 이벤트는 6시간 동안 억제합니다. 네트워크 전송은 `keepalive`를 사용하지만 오프라인/강제 종료 시 기록 전달을 보장하지 않습니다.
- 현행 LMS는 클라이언트 저장 세션입니다. 서버는 명부 대조만 하며 서버 발급 인증 토큰 검증은 제공하지 않습니다.

테스트: `node google-apps-script/pre-learning.test.cjs` (LMS 디렉터리 기준). 외부 API/시트에 쓰지 않는 모의 테스트로 45개 개별 페이지, 공통 학습실, Day 1 화면 전환, 만료 세션, 시간 경계, 뒤로가기 복원을 검증합니다.
