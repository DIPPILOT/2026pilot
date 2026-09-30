# LMS 로그인 Apps Script

`Code.gs`는 Google Sheet의 `출석부`에서 학생 명부를 읽고, 로그인 성공 기록을 `LOG_LMS_Login`에 추가합니다.

- `GET ?action=students`: 학생 ID, 이름, 소속팀 반환
- `POST`: 학생 ID 검증 후 로그인 로그 기록
- `POST action=homeworkClick`: 과제 카드 클릭을 `LOG_Homework_Mission`에 기록
- 동일 `eventId`는 6시간 동안 중복 기록하지 않음
- 동시 기록은 `LockService`로 직렬화

현재 로그인 페이지는 초기 표시 속도를 위해 학생 명부를 `docs/login/login.js`에 고정해 둡니다. 학생 명부가 변경되면 `GET ?action=students` 결과를 기준으로 해당 배열을 다시 생성합니다. 로그인 카드 클릭 시 사용하는 `POST` 기록 기능은 계속 Apps Script를 호출합니다.

`docs/homework-log.js`는 세 과제 페이지의 카드 클릭을 감지합니다. 페이지 표시나 모달 열기를 기다리지 않고 비동기 POST를 보내며, 학생 ID는 현재 LMS 로그인 세션에서 가져오고 Apps Script가 `출석부` 명부와 다시 대조합니다.

배포된 웹 앱 URL:

`https://script.google.com/macros/s/AKfycbx4kGWSG4D41ZpElazYgGKkY4V7AbnkBRir8uKRhYNGneAM6xxJKxpJJPdbU2GfDtwz/exec`

이 URL은 `docs/login/login.js`의 `APP_SCRIPT_URL`에 설정되어 있습니다.
